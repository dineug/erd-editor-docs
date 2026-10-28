---
sidebar_position: 3
description: Sütun ekleme, seçme, yeniden sıralama ve silme, sütun seçeneklerini açıp kapatma, sütunları kopyalama veya yapıştırma.
---

# Tablo düzenleme

Tablo düzenleme temel olarak Excel'e benzer bir düzenleme deneyimi sunar.  
[Ad görünümü](./logical-names.md#name-view), bir tablonun başlığında ve satırlarında adları mı, mantıksal adları mı yoksa ikisini birden mi göstereceğine karar verir.  
Düzenleme modu `Enter` tuşuyla veya bir hücreye çift tıklayarak başlar.  
`Enter` veya `Escape` tuşu bu modu sonlandırır. Yazdığınız metin yazdığınız anda uygulanır, bu yüzden `Escape` tuşu metni eski hâline döndürmek yerine korur. [Değer alanı hücresi](./logical-names.md#the-domain-cell) bunun istisnasıdır: Yalnızca listesinden seçim yapar ve yazdığınızı asla korumaz. Bir [mantıksal ad hücresini](./logical-names.md#writing-a-logical-name) değişmiş bir mantıksal adda kapatmak fiziksel adı da doldurabilir.  
`Escape` tuşu hücreyi odakta ve tabloyu seçili bırakır, `Escape` tuşuna ikinci kez basmak ise ikisini de kaldırır. Bir mantıksal ad hücresi [terim listesini](./logical-names.md#completing-term-names) gösterirken `Escape` tuşuna ilk basış yalnızca listeyi kapatır.  
Bir giriş yönteminde birleştirme hâlâ sürerken `Escape` tuşu düzenleme modunu açık bırakır.

![Alt + N ile tablo ekleme ve iki sütunu doldurma](/img/demo-table-edit.webp)

## Sütun ekleme {#adding-columns}

Seçili her tabloya bir sütun ekleyen `Alt + Enter` (Windows/Linux) veya `⌥ + Enter` (Mac) kısayoluyla ya da yalnızca o tabloya bir sütun ekleyen tablo başlığındaki `+` düğmesiyle oluşturulur.  
Yeni sütunun ilk hücresi odağı alır; bu, satırının [sütun sırasında](./settings.md#adjusting-column-order) çizdiği ilk hücredir. Varsayılan sırada bu, adıdır; `Logical Names` görünümünde mantıksal adı, `Both Names` görünümünde ise `Logical Name` hücresidir. [Ad görünümü](./logical-names.md#name-view) bölümüne bakın.  
Son hücrede `Tab` ile eklenen bir sütun ve bir ilişkinin çiziminin, birincil anahtarı olmayan bir üst tabloya eklediği birincil anahtar da o hücrede başlar.

## Tab tuşu {#tab-key}

Doğrudan sonraki hücrenin düzenleme moduna geçmek için `Tab` tuşuna basın.  
Son hücrede `Tab` tuşuna basmak yeni bir sütun oluşturur ve ilk hücresini düzenlemeye açar. [Sütun ekleme](#adding-columns) bölümüne bakın.  
Önceki hücrenin düzenleme moduna gitmek için `Shift + Tab` tuşlarını kullanın.  
`Tab` ve `Shift + Tab` tuşları tablonun gösterdiği hücrelerden sırasıyla geçer, bu yüzden mantıksal ad ve değer alanı hücrelerinin bunlar arasında olup olmadığına Ad görünümü ve View Option → `Domain` karar verir. [Mantıksal ad yazma](./logical-names.md#writing-a-logical-name) bölümüne bakın.  
Bir satırın son hücresinden sonra çizilen [alternatif anahtar](./table-related-functions.md#alternate-keys) işaretleri hücre değildir, bu yüzden klavye odağı onların üzerinden atlar ve hiçbir zaman düzenleme için açılmazlar.

![Tab ile bir satırın hücreleri arasında ilerleme, son hücreden sütun ekleme ve Shift + Tab ile geri dönme](/img/demo-table-tab.webp)

## Veri türü otomatik tamamlama {#datatype-autocomplete}

Bir `DataType` hücresini düzenlemeye başlayın ve yazın. Seçili veritabanındaki eşleşen türler önerilir ve bir önerinin, yazdığınız metni harfi harfine içeren kısmı vurgulanır.  
Eşleşmenin kendisi bulanıktır, bu yüzden `vch` yazmak `VARCHAR` türünü de bulur.

- `Arrow Up` veya `Arrow Down`: öneriler arasında gezinme
- `Arrow Right`, `Tab` veya `Enter`: vurgulu öneriyi kabul etme
- `Arrow Left`: yazdığınız metne geri dönme

Ayrıca bir öneriye tıklayabilirsiniz.  
Liste aynı anda en fazla on öneri gösterir ve geri kalanlar için kaydırılır.  
Hiçbir şey dayatılmaz, bu yüzden listede olmayan bir tür de `VARCHAR(255)` gibi argümanlar dahil serbestçe yazılabilir. Yazdığınız metin, `VARCHAR(255)` veya `BIGINT UNSIGNED` örneklerinde olduğu gibi tam bir tür adının ötesine geçtiğinde liste kapanır.  
Öneriler seçili veritabanını izler. Veritabanını değiştirmek sunulan önerileri değiştirir ve mevcut sütunları olduğu gibi bırakır.

Bir değer alanına bağlı sütunun `DataType` hücresine yazmak ya da orada bir öneriyi kabul etmek, sütunun türü değer alanınınkinden farklılaştığı anda sütunun bağlantısını kaldırır. [Değer alanları ve veri türleri](./dictionary.md#domains-and-data-types) bölümüne bakın.  
View Option → `Domain` kapalıyken `Logical Names` görünümünde, adı olan bir değer alanına bağlı sütunun tür hücresi değer alanının adını gösterir ve bu hücreyi düzenlemek bu öneriler yerine [değer alanı seçiciyi](./logical-names.md#the-domain-cell) açar. Veri türü gösteren bir tür hücresi, veri türünü yukarıda anlatıldığı gibi düzenler.

![Ok tuşları, Tab ve Enter ile bulanık önerilerden DataType hücrelerini doldurma](/img/demo-data-type-autocomplete.webp)

## NULL olamaz, Benzersiz, Otomatik artırma {#not-null-unique-auto-increment}

Bu üç hücre metin değil, aç/kapat düğmesidir.  
Birinin durumunu değiştirmek için ona çift tıklayın ya da odaktayken `Enter` tuşuna basın.

NULL olamaz hücresinde, ayarlı olduğunda `N-N`, ayarlı olmadığında `NULL` yazar.  
`UQ` ve `AI` kapalıyken soluk, açıkken vurgulu görünür.

![NULL olamaz değerini çift tıklamayla, Benzersiz ve Otomatik artırma değerlerini Enter ile değiştirme](/img/demo-column-options.webp)

[Tablo görünüm seçenekleriyle](./table-related-functions.md) gizlenen hücreler açılıp kapatılamaz.

## Birden çok sütun seçme {#selecting-multiple-columns}

Beş yöntem desteklenir:

- `Shift + Arrow Up/Down`: seçimi her seferinde bir satır genişletme
- `Ctrl + click` (Windows/Linux) veya `⌘ + click` (Mac): seçime tek bir sütun ekleme
- `Shift + click`: son odaklanılan sütundan itibaren aralığı seçme
- `Ctrl + Shift + click` (Windows/Linux) veya `⌘ + Shift + click` (Mac): o aralığı seçime ekleme
- `Alt + A` (Windows/Linux) veya `⌥ + A` (Mac): tümünü seçme

![Shift + Arrow Down, Ctrl/⌘ + click, Shift + click ve Alt + A ile sütun seçme](/img/demo-column-select.webp)

Seçili sütunları birlikte taşımak için odaktaki sütunun yanındaki tutamacı sürükleyin. [Sütunları yeniden sıralama ve taşıma](#rearranging-and-moving-columns) bölümüne bakın.

Tablonun bağlam menüsünün hangi sütunlara uygulanacağını, hangi değiştirici tuş basılı tutulursa tutulsun, bir sütunun satırına yapılan sağ tıklama belirler.  
Zaten seçili olan bir satırda seçim korunur ve odak o satıra geçer. Diğer herhangi bir satırda yalnızca o satır seçilir. Bu, anahtar simgesi ve bir [alternatif anahtar](./table-related-functions.md#alternate-keys) işareti dahil satırın her yerinde geçerlidir.  
Bu yüzden menüden, [Sütun birincil anahtarı](#column-primary-key) veya [Sütun silme](#column-deletion) örneklerinde olduğu gibi birkaç sütun üzerinde işlem yapmak için seçili satırlardan birine sağ tıklayın.  
Mac'te `Ctrl + click` de menüyü açar, ancak düz bir tıklama sayılır, bu yüzden bir hücre üzerinde menü açılmadan önce yalnızca o satırı seçer.

## Sütunları yeniden sıralama ve taşıma {#rearranging-and-moving-columns}

Bir sütun, tablonun sol kenarının hemen dışında, odaktaki satırın yanında duran ve tutamaç simgesi taşıyan küçük bir düğme olan sürükleme tutamacıyla taşınır.  
Sütunun herhangi bir hücresini tıklayarak ya da ok tuşları veya `Tab` tuşuyla odağa aldığınızda tutamaç, satırının yanında belirir. Odak tablonun başlığındayken hiçbir satırda tutamaç olmaz.  
Tutamaç, işaretçi üzerine gelene kadar silik çizilir, ardından işaretçi bir ele dönüşür. Yalnızca basmak hiçbir şey yapmaz: Sürükleme işaretçi hareket ettiğinde başlar ve sütunu tablosunda başka bir yere ya da başka bir tabloya taşıyabilir.  
Bir tablonun satırları üzerinde sürüklenen satırlar yerine geçer, bırakma noktasının çevresindeki satırlar da yer açmak için kenara kayar. Tuvalin boş alanı ya da sütunları olan bir tablonun başlığı üzerinde ise satırların yarı saydam bir kopyası işaretçiyi izler ve her satırın ad ve tür hücrelerini, satırın geçerli [Ad görünümünde](./logical-names.md#name-view) gösterdiği gibi gösterir.  
Sütunu bir tablonun sonuna taşımak için o tablonun son satırının hemen altına bırakın. Sütunu olmayan bir tablo, bırakmayı üzerinin herhangi bir yerinde kabul eder. Bir tablonun hemen solunda, tutamacın durduğu şerit de tablonun satırlarından sayılır, bu yüzden tutamaç boyunca dümdüz aşağı yapılan bir sürükleme, işaretçi tabloya girmeden sütunları yeniden sıralar.  
Başka bir tabloya taşınan sütun, mantıksal adını ve değer alanını korur.

![Bir sütunu odağa alma ve satırının yanındaki tutamacı yeni bir konuma sürükleme, ardından başka bir sütunun tutamacını başka bir tabloya sürükleme](/img/demo-column-move.webp)

Birkaç sütunu aynı anda taşımak için [onları seçin](#selecting-multiple-columns) ve odaktaki sütunun yanındaki tutamacı sürükleyin. Odaktaki sütun, tablosunun seçili iki veya daha fazla sütunundan biri olduğu sürece tutamaç hepsini taşır, aksi hâlde yalnızca kendi sütununu taşır.  
Değiştirici tuş gerekmez. Tutamaç üzerinde `Alt` (Windows/Linux) veya `⌥` (Mac) tuşunu basılı tutmak, sütunları düz bir sürüklemenin yaptığı gibi taşır ve hiçbir şeyi çoğaltmaz.

![Üç sütunu seçme, ardından odaktaki sütunun yanındaki tutamacı başka bir tabloya sürükleme ve diğer seçili sütunların da onunla birlikte taşınması](/img/demo-column-multi-move.webp)

Tutamaçta değil de bir sütunun satırında başlayan sürükleme, tablonun başlığındaki bir sürükleme gibi tabloyu taşır. [Birden çok tabloyu taşıma](./table-related-functions.md#moving-multiple-tables) bölümüne bakın. Bir satırda `Alt + drag` (Windows/Linux) veya `⌥ + drag` (Mac) tabloyu çoğaltır. [Tabloları ve notları çoğaltma](./table-related-functions.md#duplicating-tables-and-memos) bölümüne bakın.  
Tabloların yalnızca adlarını gösterdiği `70%` ve altındaki yakınlaştırmada ya da salt okunur bir düzenleyicide tutamaç çizilmez, bu yüzden orada sütunlar yeniden sıralanamaz.  
Düzenleyici salt okunur olurken süren bir sütun sürüklemesi hemen sona erer: İmleci izleyen kopya ve tutan el kaybolur ve bırakmak hiçbir sütunu taşımaz. Sürüklemenin zaten taşıdığı satırlar taşındığı yerde kalır.

## Sütun silme {#column-deletion}

Odaktaki tablonun seçili sütunlarını siler. Bir hücreye tıklamak onun sütununu seçer, bu yüzden bir hücreye tıklayıp `Delete` tuşuna basmak yalnızca o sütunu kaldırır.  
Kısayollar:

- `Delete` veya `Backspace`. Bu tuşlar seçili sütunları, ait oldukları tablo seçili tek öğe olduğu sürece kaldırır. Hiçbir sütun seçili değilken (odak tablonun adında, [mantıksal adında](./logical-names.md#name-view) veya açıklamasındayken), başka herhangi bir şey de seçiliyken ya da tabloların yalnızca adlarını gösterdiği `70%` ve altındaki yakınlaştırmada bunun yerine seçimin tamamını kaldırırlar. [Tablo ve not silme](./table-related-functions.md#table-and-memo-deletion) bölümüne bakın.
- `Alt + Backspace` veya `Alt + Delete` (Windows/Linux), `⌥ + Backspace` veya `⌥ + Delete` (Mac). Bu tuşlar, başka tablolar veya notlar da seçiliyken bile odaktaki tablonun seçili sütunlarını kaldırır. Bir hücre düzenlenirken veya `70%` ve altındaki yakınlaştırmada hiçbir şey kaldırmazlar.

![Alt + Backspace ile önce bir sütunu, ardından seçili iki sütunu silme](/img/demo-column-remove.webp)

Tablonun bağlam menüsü de aynı işi yapar. Tablo seçili tek öğeyken bir sütunun satırına sağ tıklayın: Menünün son satırında `Delete column` yazar, o satır seçili iki veya daha fazla sütundan biri olduğunda ise `Delete columns` yazar.

Bir hücre düzenlenirken `Delete` ve `Backspace` tuşları yalnızca metin siler. Hücre düzenleyicisinin dışında basılı tutulduklarında yalnızca bir kez kaldırırlar.  
Bir kaldırma işleminin ardından odak, odaktaki sütunun üstünde kalan en yakın sütuna geçer. Üstünde hiç sütun kalmadığında, altında sütunlar kalsa bile odak tablo adına (`Logical Names` görünümünde onun yerine gösterilen mantıksal ada) geçer, bu yüzden sonraki `Delete` veya `Backspace` basışı bir sütunu değil tabloyu kaldırır.  
Kaldırılan bir sütunu kullanan ilişkiler ve dizinler de onunla birlikte kaldırılır. Onay istenmez ve kaldırmanın tamamı tek bir geri alma adımıdır.

## Sütunları kopyalama/yapıştırma {#copyingpasting-columns}

Tablo tabanlı bir pano gibi çalışır.  
Kısayollar: `Ctrl + C` (Windows/Linux) veya `⌘ + C` (Mac), `Ctrl + V` (Windows/Linux) veya `⌘ + V` (Mac)

Bir elektronik tabloya kopyalama, bir elektronik tablodan yapıştırma ve bir sütun hücresi odakta olan tabloya yapıştırma, tabloların gösterdiği hücreleri onları gösterdikleri sırayla kullanır. [Tablo görünüm seçenekleri](./table-related-functions.md#table-view-options), [Sütun sırasını ayarlama](./settings.md#adjusting-column-order) ve [Ad görünümü](./logical-names.md#name-view) bölümlerine bakın. Ad görünümü bu hücrelerin bazılarının içeriğini değiştirir:

- `Logical Names` görünümünde adın hücresi mantıksal adı tutar, mantıksal ad boşken ise boş kalır. View Option → `Domain` kapalıyken tür hücresi, bir değer alanı gösterdiği yerde sütunun değer alanının adını, aksi hâlde veri türünü tutar.
- `Both Names` görünümünde `Logical Name` hücresi, sütun sırasının onu koyduğu yerde kopyalanır ve yapıştırılır.
- Gösterilen bir değer alanı hücresi değer alanının adını tutar, hiçbir değer alanı göstermeyen bir sütun için ise boştur.

Düzenleyicide kopyalanıp bir tablo başlığı seçiliyken ya da seçili diğer tablolara yapıştırılan sütunlar, Benzersiz ve Otomatik artırma gibi gizli olanlar dahil, kopyalanan sütunların her hücresini ve mantıksal adlarını taşır.  
Bir değer alanı bağlantısını ancak bu diyagram aynı değer alanını (aynı adı taşıyan herhangi bir değer alanını değil) listelediği ve değer alanı hâlâ kopyalanan sütunun türünü taşıdığı sürece korurlar. Aksi hâlde kopyalandıkları türle bağlantısız gelirler. Yapıştırılan bir ad boş olup mantıksal ad bir ad türetmedikçe adları kendi yazdığınız ad sayılır. [Fiziksel adları türetme](./dictionary.md#deriving-physical-names) bölümüne bakın.  
`AK1.1` gibi [alternatif anahtar](./table-related-functions.md#alternate-keys) işaretleri hücre değildir, bu yüzden işaretler gösterilirken bile kopyalama ve yapıştırma onları dışarıda bırakır.

Düzenleyiciden Excel'e ve Excel'den yeniden düzenleyiciye yapıştırabilirsiniz.  
Hücre değerleri dışarıya tam olarak yazıldıkları gibi aktarılır, bu yüzden `<label>` veya `a &amp; b` gibi bir değer bir elektronik tabloya ya da belgeye değişmeden ulaşır.  
Elektronik tablo sütunları görünür hücrelerle ada göre değil, konuma göre eşleştirilir, bu yüzden sayfanın sütunları bu hücrelerin sırasını izlemelidir.  
Aşağıdaki sütunlarda bu değerlerden herhangi biri doğru olarak okunur (büyük/küçük harf ayrımı yapılmaz):

- AutoIncrement: `TRUE`, `1`, `YES`, `Y`
- Unique: `TRUE`, `1`, `YES`, `Y`
- Not Null: `TRUE`, `1`, `YES`, `Y`, `NOT NULL`

Dışarıya aktarırken düzenleyici, AutoIncrement ve Unique için `TRUE` veya `FALSE`, Not Null için `NOT NULL` veya `NULL` yazar.  
Benzersiz ve Otomatik artırma varsayılan olarak gizlidir, bu yüzden `TRUE` ve `FALSE` değerleri yalnızca bu hücreler gösterildiğinde yazılır ve okunur.

![Bayrakları TRUE/FALSE ve NOT NULL/NULL olarak yazarak dört sütunu bir elektronik tabloya yapıştırma](/img/demo-copy-column-to-sheet.webp)

![YES, 1 ve NOT NULL değerlerini doğru olarak okuyarak üç elektronik tablo satırını bir tabloya sütun olarak yapıştırma](/img/demo-copy-sheet-column.webp)

Yapıştırmanın nereye uygulanacağı odağa bağlıdır:

- Bir tablo başlığı seçiliyken yapıştırılan satırlar seçili her tabloya yeni sütunlar olarak eklenir.
- Bir sütun hücresi odaktayken o tablonun seçili satırlarının, ardından bunların sonuncusunun altındaki satırların üzerine, yapıştırılan satır sayısı kadar sırayla yazılır. Ayrı seçimler arasındaki satırlar atlanır. Üzerine yazılan bir satır görünür hücrelerinde yapıştırılan değerleri alır ve gizli hücrelerini korur, artan satırlar ise yeni sütunlar olarak eklenir. Seçili diğer her tabloya yapıştırılan satırlar yeni sütunlar olarak eklenir.

![İki sütunu kopyalama ve seçili iki tabloya aynı anda yapıştırma](/img/demo-copy-column-multi.webp)

Yapıştırılan bir satır mantıksal adları ve değer alanlarını şöyle yazar:

- Bir `Logical Name` hücresinden ya da `Logical Names` görünümünde adın hücresinden gelen mantıksal ad, eksiksiz yazılmış sayılır. Sütunun adı boş ya da hâlâ türetilmiş olduğu sürece [sözlükler](./dictionary.md#deriving-physical-names) fiziksel adı ondan türetir ve satırın kendi değer alanı hücresi bir değer alanı bağlamadıkça teriminin verdiği değer alanını bağlar. Aynı satırın yapıştırdığı bir ad korunur ve kendi yazdığınız ad sayılır.
- Bir değer alanı hücresi ya da View Option → `Domain` kapalıyken `Logical Names` görünümündeki tür hücresi, diyagram listeliyorsa metninin adlandırdığı değer alanını bağlar. Başka herhangi bir metin ya da boş bir hücre hiçbir değer alanı bağlamaz ve sütun yapıştırılan türde bir değer alanına bağlı olsa bile bağlantısını kaldırır. Tür hücresindeki, hiçbir değer alanını adlandırmayan metin veri türü olarak okunur. Düzenleyicide kopyalanan satırlar ise bunun yerine, yeni sütunların yaptığı gibi, kopyalandıkları değer alanını yalnızca bu diyagram onu kopyalanan türle listelediği sürece bağlar.
- Satır kendi türünü yapıştırmadıkça bağlanan değer alanı sütuna veri türünü verir. Satır kendi türünü yapıştırdığında başka türde bir değer alanı bağlanmaz ve sütun yapıştırılan türü alır.
- Değer alanı hücresi olmayan bir satırda yapıştırılan bir tür, onu yazmanın yaptığı gibi sütunun başka türdeki bir değer alanıyla bağlantısını kaldırır.
- Hiçbir yapıştırma bir türü [İlişkilerde veri türü eşitleme](./settings.md#relationship-datatype-sync) yoluyla aktarmaz.

## Tabloları ve notları kopyalama/yapıştırma {#copyingpasting-tables-and-memos}

Odaktaki bir tablonun içinde hiçbir sütun seçili değilken aynı kısayollar seçili tabloların ve notların kendisini kopyalar. [Tabloyla ilgili işlevler](./table-related-functions.md) sayfasına bakın.

## Sütun birincil anahtarı {#column-primary-key}

Odaktaki sütunun, yani odaktaki hücrenin ait olduğu sütunun birincil anahtar durumunu açar veya kapatır.  
Odaktaki sütun seçili iki veya daha fazla sütundan biri olduğunda, açma/kapatma seçili sütunların tümüne uygulanır: Bunlardan herhangi biri anahtar değilse tümü anahtar olur, tümü zaten anahtarsa tümü anahtar olmaktan çıkar. Seçimin dışındaki sütunlara dokunulmaz.  
Tablonun bağlam menüsünü ya da `Alt + K` (Windows/Linux) veya `⌥ + K` (Mac) kısayolunu kullanın. Açma/kapatma iki veya daha fazla sütunu kapsadığında, menü satırında `Primary Key` yerine `Primary Key on selected columns` yazar.  
Satırdaki anahtar simgesi yalnızca gösterim amaçlıdır, bu yüzden ona tıklamak anahtarı ayarlamaz.

Birkaç sütunu tek bir bileşik anahtar yapmak için [onları seçin](#selecting-multiple-columns), ardından `Alt + K` (Windows/Linux) veya `⌥ + K` (Mac) tuşlarına basın ya da seçili satırlardan birine sağ tıklayıp `Primary Key on selected columns` öğesini seçin. Her açma/kapatma tek bir geri alma adımıdır.

![Shift + Arrow Down ile iki sütunu seçme, ardından ⌥ + K ile ikisini birden birincil anahtar yapma ve ikinci basışla ikisinin de anahtarını kaldırma](/img/demo-column-pk.webp)

## Salt okunur düzenleyiciler {#read-only-editors}

[`readonly`](../../api/erd-editor-element.md#readonly) bir düzenleyicide hiçbir hücre düzenleme için açılmaz ve hiçbir sütun değişmez.  
Bir hücreye tıklamak hiçbir şeye odaklanmaz ve bir atlamanın bıraktığı seçimi kaldırır. `Enter` ve çift tıklama hiçbir düzenleyici açmaz ve hiçbir anahtarı çevirmez, `Tab` sayfaya bırakılır; sütun ekleyen, hepsini seçen ya da silen kısayollar, birincil anahtar anahtarı ve yapıştırma hiçbir şey yapmaz.  
[Gezgin](./explorer.md#going-to-a-row) veya [Hızlı aramadan](./quick-search.md) bir sütuna gitmek hücresine odaklanır. Ok tuşları ardından odağı hücreden hücreye taşır ve ulaştıkları sütun tek başına seçilir, çünkü orada `Shift` hiçbir sütun eklemez.  
`Ctrl + C` (Windows/Linux) veya `⌘ + C` (Mac) seçili sütunu ya da bir atlamanın seçtiği tabloyu yine kopyalar. [Sütunları kopyalama/yapıştırma](#copyingpasting-columns) bölümüne bakın.
