---
sidebar_position: 11
description: Şemayı kuvvet yönelimli bir graf ya da tablo kartlarından oluşan bir akış olarak inceleme, yakınlaştırma ve kaydırma, bir tablonun ilişkili tablolarını vurgulama, aynı anda birkaç tabloya odaklanma ve önceki odaklara geri dönme.
---

# Görselleştirme

Belgenin tamamını iki moddan birinde tek bakışta gösterir:

- `Graph`, her tablonun, sütunlarının ve aralarındaki ilişkilerin kuvvet yönelimli bir grafı. [Graf modu](#graph-mode) bölümüne bakın.
- `Flow`, kart olarak çizilen ve ilişkileri boyunca yerleştirilen her tablo. [Akış modu](#flow-mode) bölümüne bakın.

Üstteki araç çubuğunda bulunan `Visualization` sekmesinden ya da [Hızlı aramada](./quick-search.md) `Tab` altından açın.  
ERD sekmesinde `Alt + F` (Windows/Linux) veya `⌥ + F` (Mac) tuşları ve tablonun bağlam menüsündeki `Focus on this table` öğesi, onu doğrudan `Flow` modunda, seçtiğiniz tablolara ve bunlara tek bir ilişkiyle bağlı tablolara daraltılmış olarak açar. [Tablolara odaklanma](#focusing-on-tables) bölümüne bakın.

Modlar arasında [araç çubuğunun](#toolbar) sol ucundaki `Graph` ve `Flow` düğmeleriyle geçiş yapın.  
Yeni açılan bir düzenleyici `Graph` modunda başlar. Seçtiğiniz mod, düzenleyici açık kaldığı sürece diğer sekmelere gidip gelseniz de korunur, ancak belgeye kaydedilmez.

## Araç çubuğu {#toolbar}

Sekmenin alt kenarının ortasında yüzen bir araç çubuğu bulunur. Soldan sağa:

- Geçerli modu vurgulu gösteren `Graph` ve `Flow` düğmeleri.
- Yalnızca `Flow` modunda bulunan `Previous table` ve `Next table`: Akış modunun daraltıldığı tablolar arasında bir adım geri ve ileri giden bir sol ok ve bir sağ ok. [Önceki tablo ve sonraki tablo](#previous-table-and-next-table) bölümüne bakın. Her biri, o yönde gidilecek bir adım yokken soluk görünür.
- `Zoom out`, `100%` gibi bir yüzde olarak geçerli yakınlaştırma düzeyi ve `Zoom in`. Her basış, ekranın ortasını yerinde tutarak yakınlaştırmayı 4 yüzde puanı değiştirir. Yüzde, içinde bulunduğunuz modun yakınlaştırma düzeyini gösterir ve ona tıklamak bu yakınlaştırmayı `100%` değerine geri getirir.
- Modun gösterdiği her şeyi görünüm alanına getiren `Fit`: `Graph` modunda her düğüm, `Flow` modunda her kart.
- Yalnızca `Flow` modunda bulunan ve kartları yeniden yerleştiren `Tidy Up`. [Akış modunun yerleşimi](#how-flow-is-placed) bölümüne bakın.
- Yalnızca `Flow` modunda bulunan ve etiketinde geçerli seçimi gösteren satır görünümü menüsü. [Satır görünümü](#row-display) bölümüne bakın.
- Yalnızca `Flow` modunda bulunan ve etiketinde geçerli görünümü gösteren `Name View` listesi. [Kartlardaki adlar](#names-on-the-cards) bölümüne bakın.
- Yalnızca `Flow` modunda ve yalnızca görünüm daraltılmışken bulunan, diyagramın tamamına geri dönen `Show all`. [Tablolara odaklanma](#focusing-on-tables) bölümüne bakın.
- Yalnızca ekranda hiçbir düğüm ya da kart yokken araç çubuğunun sonuna eklenen `Go to content` pusulası. En yakın düğümü ya da kartı işaret eden bir oku ve ona olan uzaklığı gösterir, örneğin `1.2k`. Yakınlaştırmayı değiştirmeden o düğümü ya da kartı ortalamak için pusulaya tıklayın.

Yakınlaştırma düğmeleri ve iki ok kısayollarını araç ipuçlarında belirtir, örneğin `Zoom in (Ctrl + Plus)` (Windows/Linux) veya `Zoom in (⌘ + Plus)` (Mac) ve `Previous table (Ctrl + Z)` (Windows/Linux) veya `Previous table (⌘ + Z)` (Mac).  
`Ctrl + Plus` ve `Ctrl + Minus` (Windows/Linux) veya `⌘ + Plus` ve `⌘ + Minus` (Mac) tuşları, her iki modda da yakınlaştırmayı düğmeler gibi adım adım değiştirir, `Ctrl + 0` (Windows/Linux) veya `⌘ + 0` (Mac) ise yakınlaştırmayı doğrudan `100%` değerine döndürür. `Flow` modunda `Ctrl + Z` ve `Ctrl + Shift + Z` (Windows/Linux) veya `⌘ + Z` ve `⌘ + Shift + Z` (Mac) tuşları iki ok gibi adım adım ilerler.  
Yüzdeye tıklamak `Ctrl + 0` (Windows/Linux) veya `⌘ + 0` (Mac) ile aynı işi yapar ve bu kısayolu araç ipucunda belirtir. Hızlı arama açıkken kısayollar hiçbir şey yapmaz.

## Graf modu {#graph-mode}

Belgenin tamamını kuvvet yönelimli bir graf olarak çizer, böylece tabloların birbiriyle nasıl ilişkili olduğunu ve hangilerinin bir alanın merkezinde yer aldığını tek bakışta görebilirsiniz.

![Graf modunu açma, önizlemesi için bir tablonun üzerine gelme, bir düğümü sürükleme, uzaklaştırıp yeniden yakınlaştırma](/img/demo-visualization.webp)

### Grafı okuma {#reading-the-graph}

Her tablo ve her sütun bir düğümdür ve bu iki tür farklı renklerde çizilir. Notlar ve [tablo grupları](./table-groups.md) çizilmez.  
Her sütun düğümü ait olduğu tabloya bağlanır ve bir ilişkiyle birleştirilen iki tablo birbirine bağlanır.  
Aynı yönde birden fazla ilişkiyle birleştirilen tablolar yalnızca bir kez bağlanır ve aynı tabloda başlayıp biten bir ilişki hiçbir bağlantı çizmez.

Yakınlaştırdıkça tablo adları grafta belirir, `50%` ile `100%` arasında yavaş yavaş görünür hâle gelir ve 15 karakterden uzun bir ad kısaltılır. Sütun düğümleri hiçbir yakınlaştırma düzeyinde etiket taşımaz.  
Etiketler Ad görünümünü izler. [Tuvalin ötesinde](./logical-names.md#beyond-the-canvas) bölümüne bakın. `Both Names` görünümünde bir etiket mantıksal adı bir satıra, adı da onun altındaki satıra koyar ve her satır ayrı ayrı kısaltılır.

### Grafta gezinme {#getting-around-the-graph}

Fare tekerleği, işaretçinin üzerinde bulunduğu noktayı merkez alarak `10%` ile `400%` arasında yakınlaştırır.  
Dokunmatik yüzeyde kıstırma hareketi de aynı şekilde yakınlaştırır, dokunmatik ekranda iki parmak ise aralarındaki noktayı merkez alarak yakınlaştırır ve hareket ettikçe görünümü kaydırır.  
Kaydırmak için arka planı sürükleyin ya da [ERD tuvalinde](./table-related-functions.md#getting-around-the-canvas) olduğu gibi farenin orta düğmesiyle, bir düğümün üzeri de dahil herhangi bir yerden sürükleyin. Orta düğmeyle sürükleme yalnızca kaydırır: Asla bir düğümü çekmez.

[Araç çubuğundaki](#toolbar) yakınlaştırma düğmeleri ve yakınlaştırma kısayolları ise aynı aralıkta kalarak ekranın ortasını sabit tutar ve `Fit` her düğümü görünüm alanına getirir.

### Üzerine gelme önizlemesi {#hover-preview}

Bir tabloyu imlecin yanında önizlemek için o tablonun düğümünün üzerine gelin.  
Bir sütun düğümünün üzerine gelmek yalnızca çevresine bir halka çizer; önizleme açılmaz.

Önizleme, ERD tuvalindekiyle aynı sütunları ve hücreleri aynı sırada gösterir ve bunları, içinde bulunduğunuz Ad görünümünde tuvalin adlandırdığı gibi adlandırır. [Tablo görünüm seçenekleri](./table-related-functions.md#table-view-options), [Sütun sırasını ayarlama](./settings.md#adjusting-column-order) ve [Ad görünümü](./logical-names.md#name-view) bölümlerine bakın.  
`Alternate Key` görünüm seçeneği açıkken bir [alternatif anahtarın](./table-related-functions.md#alternate-keys) her sütunu, `AK1.1` gibi işaretini satırının sonunda taşır ve önizleme, ERD tuvalindeki tablo gibi bu işaret için genişler.  
ERD tuvalindeki bir tablonun aksine, önizlemenin başlığı asla tablonun [grubunun](./table-groups.md#coloring-a-group) rengini almaz ve adları, sözlük denetimlerinin tuvale koyduğu [işaretleri](./dictionary.md#marks-on-the-canvas) asla taşımaz.  
Önizleme yalnızca görüntülemeye yöneliktir ve bir düğümü sürüklerken ya da kaydırırken gizlenir.

### Komşuluğu vurgulama {#highlighting-a-neighbourhood}

Bir tablonun üzerine gelmek komşuluğunu da vurgular: tablonun kendisi, kendi sütunları, ilişkilerinin her iki yönde birleştirdiği tablolar ve bunlar arasındaki bağlantılar.  
Graftaki geri kalan her şey soluklaşır, böylece tablonun bağlı olduğu her şey kendi başına okunabilir.

### Düğümleri taşıma {#moving-nodes}

Bir düğümü ve ona bağlı her şeyi yeni bir konuma çekmek için düğümü farenin sol düğmesiyle sürükleyin.  
Düğüm, tuttuğunuz sürece işaretçinin altında sabit kalır ve düzen onun çevresinde yeniden hareketlenir.  
Bıraktığınızda yeniden dengeye oturur – hiçbir şey bırakıldığı yerde sabit kalmaz.  
Bir düğüme sağ düğmeyle basmak ya da onu sağ düğmeyle sürüklemek düğümü ne çeker ne de görünümü kaydırır.

### Graf bir anlık görüntüdür {#the-graph-is-a-snapshot}

Graf, bu sekmeyi açtığınız andaki hâliyle belgeden oluşturulur ve sekmeye her döndüğünüzde sıfırdan yeniden oluşturulur.  
`Flow` modundan `Graph` moduna geçmek de onu yeniden oluşturur ve her yeniden oluşturma yine `100%` değerinden başlar.

## Akış modu {#flow-mode}

Her tabloyu bir kart olarak çizer ve kartları ilişkileri boyunca yerleştirir. Notlar ve [tablo grupları](./table-groups.md) çizilmez.  
Bu, ERD sekmesindeki tabloların kendisini taşıyan [Otomatik düzenin](./table-related-functions.md#auto-layout) `Flow` düzeni değildir.

Her kart, ERD sekmesindeki bir tablo gibi çizilir: sol kenarı boyunca tablonun rengi, tablo simgesini ve tablonun [Ad görünümünün](#names-on-the-cards) gösterdiği adlarını içeren bir başlık şeridi, ardından [satır görünümünün](#row-display) gerektirdiği satırlar. ERD sekmesindeki bir tablonun aksine kart, satırlarının arasına bir çizgi de çizer ve başlığı asla tablonun [grubunun](./table-groups.md#coloring-a-group) rengini almaz. Kartlar bu görünümü her yakınlaştırma düzeyinde korur ve ERD sekmesindeki tabloların `70%` ve altındaki yakınlaştırmada yaptığı gibi asla yalnızca adlarına daralmaz. Kart üzerindeki hiçbir şey düzenlenemez.

Bağlantı çizgisi, tablodan tabloya uzanan tek bir yumuşak eğridir ve kartların altına çizilir, bu yüzden bir kartın arkasından geçebilir. Bir tablodan kendisine giden bir ilişki, ERD sekmesinde olduğu gibi kartın sağ üst köşesinin çevresinden kıvrılır. [Bağlantı çizgisi yönlendirme](./relationship-editing.md#connector-routing) bölümüne bakın. İlişki tanımlayıcı olsun ya da olmasın, her bağlantı çizgisi aynı düz gri çizgi olarak ve ERD sekmesindekiyle aynı uç işaretleriyle çizilir. [Bağlantı çizgisini okuma](./relationship-editing.md#reading-a-connector) bölümüne bakın. Akış modu, `Relationship` [görünüm seçeneği](./table-related-functions.md#table-view-options) kapalıyken bile bağlantı çizgilerini çizer. `Referential Actions` görünüm seçeneği ne olursa olsun, bir ilişkinin ON DELETE ve ON UPDATE eylemlerini gösteren `D:` ve `U:` etiketlerini asla çizmez, bu eylemleri açıkça yazan araç ipucunu da göstermez.

Diyagramın tamamı gösterilirken, hiçbir ilişkiyle başka bir tabloya bağlanmayan tablolar diğerlerinin arasına dağılmak yerine tek bir blokta toplanır.

![Akış moduna geçme, orders tablosunu ve komşularını vurgulamak için üzerine gelme, vurguyu sabitleme, Keys only seçeneğini seçme, ardından ⌘ + Wheel ile yakınlaştırıp Fit düğmesine basma](/img/demo-visualization-flow.webp)

### Satır görünümü {#row-display}

[Araç çubuğundaki](#toolbar) satır görünümü menüsü, her kartın ne kadarının çizileceğini belirler. Etiketi geçerli seçimdir ve araç ipucunda örneğin `Row display: Name only` yazar.  
Menü, geçerli seçimin yanında bir onay işaretiyle araç çubuğunun üstünde açılır. Bir seçim yaptığınızda, etikete yeniden tıkladığınızda, düzenleyicide başka herhangi bir yere tıkladığınızda, `Escape` tuşuna bastığınızda ya da `Graph` moduna geçtiğinizde kapanır.

| Satır görünümü | Her kartın gösterdiği |
| --- | --- |
| `Name only` | Yalnızca başlık. |
| `Keys only` | Birincil anahtar ve yabancı anahtar sütunları ile bir ilişkinin ucunun bağlandığı diğer her sütun. |
| `All fields` | Her sütun. |

Satırlar tablonun sütun sırasına göre listelenir. Her satır sütun adını gösterir; sütun birincil anahtar, yabancı anahtar ya da her ikisiyse adın önünde bir anahtar simgesi bulunur, sağda ise kart [vurgulu](#lighting-related-tables) olsun ya da olmasın veri türü yer alır. Bir satırın hangi adları göstereceğine ve sütunun değer alanını gösterip göstermeyeceğine [Ad görünümü](#names-on-the-cards) karar verir.  
Başka hiçbir hücre ya da alternatif anahtar işareti çizilmez ve kartlara ne [Tablo görünüm seçenekleri](./table-related-functions.md#table-view-options) ne de bir satırdaki hücreleri sıralayan [Sütun sırasını ayarlama](./settings.md#adjusting-column-order) uygulanır.

Akış modu ilk açıldığında `Name only` seçeneğiyle, [tablolara odaklanarak](#focusing-on-tables) açıldıysa `Keys only` seçeneğiyle başlar. Bundan sonra satır görünümü yalnızca başka birini seçtiğinizde değişir ve görünümü daraltmak ya da genişletmek onu korur.  
Satır görünümünü değiştirmek kartları yeniden boyutlandırır, bu nedenle Akış modu onları yeniden yerleştirir ve ekrana sığdırır.

### Kartlardaki adlar {#names-on-the-cards}

Bir kart, tablosunu ve sütunlarını ERD sekmesinin de kullandığı Ad görünümünde adlandırır. [Ad görünümü](./logical-names.md#name-view) bölümüne bakın.  
Ad görünümünü burada [araç çubuğundaki](#toolbar) `Name View` listesiyle değiştirin. Listenin düğmesinde geçerli görünüm, yani `Physical Names`, `Logical Names` veya `Both Names` yazar; araç ipucunda ise `Name View` yazar. Liste, geçerli görünümün yanında bir onay işaretiyle araç çubuğunun üstünde açılır ve [satır görünümü](#row-display) menüsü gibi kapanır. Bir seçim, başka herhangi bir yerde yapılan bir görünüm değişikliği gibi, ERD sekmesi dahil düzenleyicinin tamamında görünümü değiştirir. [Görünümü değiştirme](./logical-names.md#switching-the-view) bölümüne bakın.

Kartlar hücrelerini yalnızca Ad görünümüne göre yerleştirir. `Domain` dahil hiçbir [görünüm seçeneği](./table-related-functions.md#table-view-options) onları değiştirmez:

| Ad görünümü | Başlık | Her satır |
| --- | --- | --- |
| `Physical Names` | Tablo adı. | Sütun adı, ardından veri türü. |
| `Logical Names` | Tablonun mantıksal adı. | Sütunun mantıksal adı, ardından [değer alanının](./dictionary.md#domains-and-data-types) adı ya da değer alanı yokken veri türü. |
| `Both Names` | Mantıksal ad, ardından soluk olarak tablo adı. | Mantıksal ad, ad, değer alanı ve veri türü. |

Bir mantıksal ad boşken `Logical Names` görünümü onun yerine adı soluk olarak, ad da boşsa `table` veya `column` yer tutucusunu gösterir; `Both Names` görünümü ise soluk `logical` yer tutucusunu gösterir. `Both Names` görünümünde değer alanı olmayan bir sütun soluk `domain` yer tutucusunu gösterir.  
Bir kart, sözlük denetimlerinin ERD sekmesindeki adlara koyduğu [işaretleri](./dictionary.md#marks-on-the-canvas) asla taşımaz.  
Ad görünümünü değiştirmek kartları yeniden boyutlandırır, bu nedenle Akış modu onları yeniden yerleştirir. [Akış modunun yerleşimi](#how-flow-is-placed) bölümüne bakın.

### Akış modunda gezinme {#getting-around-the-flow}

Fare tekerleği görünümü kaydırır, `Shift + Wheel` ise yatay olarak kaydırır. `Ctrl + Wheel` (Windows/Linux) veya `⌘ + Wheel` (Mac), ekranın ortasını yerinde tutarak yakınlaştırır.  
Dokunmatik yüzeyde kıstırma hareketi, kıstırdığınız noktayı merkez alarak yakınlaştırır, dokunmatik ekranda iki parmak ise aralarındaki noktayı merkez alarak yakınlaştırır ve hareket ettikçe görünümü kaydırır.  
Kaydırmak için arka planı sürükleyin ya da farenin orta düğmesiyle, bir kartın üzeri de dahil herhangi bir yerden sürükleyin. Orta düğmeyle sürükleme yalnızca kaydırır ve seçimi olduğu gibi bırakır. [ERD tuvalinde](./table-related-functions.md#getting-around-the-canvas) olduğu gibi kaydırmanın bir sınırı yoktur.  
Yakınlaştırma `10%` ile `150%` arasındadır. Akış modu, ERD sekmesininkinden ayrı olarak kendi yakınlaştırma ve kaydırma konumunu tutar ve ikisi de belgeye kaydedilmez.

Arka plana basmak seçimi kaldırır ve arka planda `Ctrl + drag` (Windows/Linux) veya `⌘ + drag` (Mac) bir seçim kutusu çizer.  
Akış modunda mini harita ve kaydırma çubukları yoktur. Kaydırma sonucunda ekranda hiç kart kalmadığında [araç çubuğundaki](#toolbar) `Go to content` pusulasını kullanın.

### İlişkili tabloları vurgulama {#lighting-related-tables}

Bir kartı, ona tek bir ilişkiyle bağlı tabloları ve onu bu tablolara bağlayan bağlantı çizgilerini vurgulamak için kartın üzerine gelin. Bu tablolardan ikisi arasındaki bir bağlantı çizgisi vurgulanmaz.  
Vurgulanan bir kart vurgu renginde bir kenarlık ve parıltı alır, bir ilişkinin ucunun bağlandığı satırları da hafifçe renklendirilir. Vurgulanan bir bağlantı çizgisi vurgu rengine döner.  
[Graf modundan](#highlighting-a-neighbourhood) farklı olarak başka hiçbir şey soluklaşmaz ve üzerine gelinen ya da sabitlenen bir kart yokken hiçbir şey vurgulanmaz.

Vurgusunu sabitlemek için bir karta tıklayın, böylece işaretçi başka bir yere geçtiğinde de kart vurgulu kalır. Sabitlemeyi kaldırmak için aynı karta yeniden ya da arka plana tıklayın; başka bir karta tıklamak sabitlemeyi o karta taşır. Üzerine gelinen kart ve sabitlenen kart birlikte vurgulanır.  
Sürükleme, `Ctrl + click` (Windows/Linux) veya `⌘ + click` (Mac), kaydırma ve [kart düğmeleri](#card-buttons) bir kartı ne sabitler ne de sabitlemesini kaldırır.

Vurgulanan her bağlantı çizgisi boyunca, birincil anahtarın bulunduğu üst tablo ucundan alt tablo ucuna doğru parçacıklar akar. Aynı anda 60'tan fazla bağlantı çizgisi vurgulandığında parçacıklar durur ve vurgu kalır.

### Kart düğmeleri {#card-buttons}

İşaretçi bir kartın üzerindeyken, kartın başlığının sağ ucunda araç ipucu bulunmayan iki simge düğmesi belirir:

- `Flow` düğmesinde görünen simgenin aynısı olan yol noktaları simgesi, Akış modunu o tabloya ve ona tek bir ilişkiyle bağlı tablolara daraltır. [Tablolara odaklanma](#focusing-on-tables) bölümüne bakın. Akış modunun önceden gösterdiği, `Previous table` ile bir adım geride kalır. [Önceki tablo ve sonraki tablo](#previous-table-and-next-table) bölümüne bakın.
- Dış bağlantı simgesi ERD sekmesine geçer, yalnızca o tabloyu seçer, onu öne getirir ve odaktaki hücre zaten o tablonun bir hücresi değilse odaktaki hücreyi tablonun adına, `Logical Names` ve `Both Names` görünümlerinde ise mantıksal adına taşır. Tuval, tabloya yalnızca tablo zaten iyi görünmüyorsa kaydırılır. [Atlamanın varış noktası](./table-related-functions.md#where-a-jump-lands) bölümüne bakın. Çizilmekte olan bir ilişkiyi asla başlatmaz ya da tamamlamaz.

İki düğmeden birine basmak yalnızca o düğmeyi ilgilendirir: Kartın başka bir yerine basmanın aksine kartı seçmez ve öne getirmez. Bu nedenle yol noktaları düğmesi mevcut seçiminizi olduğu gibi bırakır; dış bağlantı düğmesi ise tabloyu yalnızca ERD sekmesine geçişinin bir parçası olarak seçer. İki düğme de yalnızca sol tıklamayla çalışır.

### Kartları taşıma {#moving-cards}

Bir kartı, iki kart düğmesi dışında herhangi bir yerinden tutarak farenin sol düğmesiyle sürükleyin; sağ düğmeyle sürüklemek hiçbir şeyi taşımaz.  
Bir karta basmak onu seçer, `Ctrl + click` (Windows/Linux) veya `⌘ + click` (Mac) onu seçime ekler ve seçili bir kartı sürüklemek seçili tüm kartları taşır. Seçim, ERD sekmesinin kullandığı seçimin ta kendisidir, bu yüzden burada seçtikleriniz geri döndüğünüzde de seçili kalır.

Kart yalnızca Akış modunda taşınır: Tablosu ERD sekmesinde olduğu yerde kalır.  
Taşınan bir kart kaydırma, yakınlaştırma ve `Fit` sırasında yerinde kalır. Sekmeden ayrılıp ya da `Graph` moduna geçip geri döndüğünüzde ve `Show all` ya da bir [adım](#previous-table-and-next-table), Akış modunun zaten sahip olduğu bir düzene döndüğünde kart, düzenin onu yerleştirdiği yere geri gider. Yeni bir düzen, kartı bıraktığınız yeri hesaba katarak onu yeniden yerleştirir. [Akış modunun yerleşimi](#how-flow-is-placed) bölümüne bakın.

### Tablolara odaklanma {#focusing-on-tables}

ERD sekmesinde bir ya da daha fazla tablo seçip `Alt + F` (Windows/Linux) veya `⌥ + F` (Mac) tuşlarına basın ya da bir tabloya sağ tıklayıp `Focus on this table` öğesini seçin.  
Görselleştirme sekmesi, bu tablolara ve bunlardan herhangi birine her iki yönde tek bir ilişkiyle bağlı tüm tablolara daraltılmış olarak `Flow` modunda açılır. Yalnızca gösterdiği tablolar arasındaki bağlantı çizgileri çizilir.

Sağ tıkladığınız tablo seçili birkaç tablodan biriyse, öğede `Focus on selected tables` yazar ve öğe seçimin tamamına odaklanır. Seçimin dışındaki bir tabloya sağ tıklamak yalnızca o tabloya odaklanır.  
`Alt + F` kısayolu seçili tabloları alır, notları ve [tablo gruplarını](./table-groups.md) dışarıda bırakır. Seçili tablo yoksa, bir grup seçili olsa bile hiçbir şey yapmaz: Önce grubun bağlam menüsünden `Select tables` öğesini seçin. [Grupları seçme](./table-groups.md#selecting-groups) bölümüne bakın.  
Bir hücre, bir not ya da bir grubun adı düzenlenirken, klavye odağı [Gezgindeyken](./explorer.md#keys-in-the-explorer) veya Hızlı arama, Tablo özellikleri, Fark görüntüleyici, Otomatik düzenin önizlemesi, Zaman yolculuğu, [`Export image`](./file-import-export.md#image) ya da [`Map Columns`](./relationship-editing.md#map-columns) iletişim kutusu açıkken yok sayılır.

Akış modunda yol noktaları [kart düğmesi](#card-buttons) görünümü aynı şekilde, o tek tabloya göre daraltır. [Araç çubuğundaki](#toolbar) `Show all` diyagramın tamamına geri döner. Araç çubuğundaki `Previous table` ve `Next table` düğmeleri ya da bunların tuşları, Akış modunun daraltıldığı tablolar arasında bir adım geri ve ileri gider. [Önceki tablo ve sonraki tablo](#previous-table-and-next-table) bölümüne bakın.  
Daraltılmış bir görünüm ayrı olarak yerleştirilir ve ekrana sığdırılır. Sekmeden ayrılıp ya da `Graph` moduna geçip geri döndüğünüzde daraltılmış olarak kalır ve `Escape` tuşu onu genişletmez.

![⌥ + F ile orders tablosuna odaklanma, kartındaki yol noktaları düğmesiyle members tablosuna daraltma, ardından Show all](/img/demo-visualization-focus.webp)

### Önceki tablo ve sonraki tablo {#previous-table-and-next-table}

Akış modu, bir tarayıcının geçmişi gibi neye daraltıldığını hatırlar. Görünüm başka tablolara her geçtiğinde – ERD sekmesinden [tablolara odaklanarak](#focusing-on-tables), yol noktaları [kart düğmesiyle](#card-buttons) ya da `Show all` ile – daha önce gösterdiği, ister birkaç tablo ister diyagramın tamamı olsun, bir geri adım olarak saklanır.

![⌥ + F ile Akış modunu orders tablosuna, ardından members tablosuna daraltma, Previous table ile geri gitme, ⌘ + Shift + Z ile ileri ve ⌘ + Z ile yeniden geri gitme, ardından Show all](/img/demo-visualization-steps.webp)

- [Araç çubuğundaki](#toolbar) `Previous table` bir adım geri gider, `Next table` ise `Previous table` düğmesinin geride bıraktığına yeniden ilerler.
- `Flow` modunda `Ctrl + Z` (Windows/Linux) veya `⌘ + Z` (Mac), `Previous table` gibi bir adım geri gider; `Ctrl + Shift + Z` (Windows/Linux) veya `⌘ + Shift + Z` (Mac) ise `Next table` gibi bir adım ileri gider. Orada diyagramdaki bir düzenlemeyi asla geri almaz ya da yinelemezler. `Graph` modunda ve Hızlı arama açıkken hiçbir şey yapmazlar.
- Geri gittikten sonra görünümü daraltmak ya da `Show all` düğmesine basmak ileri adımları siler. Akış modunun zaten daraltıldığı tabloların tam olarak aynısına yeniden odaklanmak adım eklemez ve hiçbir adımı silmez.
- En son 100 geri adım saklanır ve önce en eskisi silinir.

Bir adım, tablolarından hâlâ diyagramda bulunanları, odaklanmanın yaptığı gibi bunlara tek bir ilişkiyle bağlı her tabloyla birlikte gösterir. Tüm tabloları kaldırılmış bir adım atlanır ve silinir; Akış modunu olduğu yerde bırakacak bir adım da öyle: şu anda daraltıldığı tabloların tam olarak aynısı ya da Akış modu diyagramın tamamını zaten gösterirken diyagramın tamamı.  
Bir düğme, o yönde kalan adım yokken soluk görünür ve hiçbir şey yapmaz. Akış modu ilk açıldığında, ister diyagramın tamamıyla ister onu açan bir odaklanmanın tablolarıyla açılsın, ikisi de soluktur. Akış modu açıldıktan sonra ERD sekmesinden yapılan bir odaklanma, Akış modunun ondan ayrıldığınızda gösterdiğini bir geri adım olarak saklar.  
Bir adım, bir odaklanma gibi yerleştirilir ve ekrana sığdırılır; satır görünümü ise olduğu gibi kalır. [Akış modunun yerleşimi](#how-flow-is-placed) bölümüne bakın.

Adımlar Akış modunun kendisine aittir. Düzenleyici açık kaldığı sürece, diğer sekmelere ve `Graph` moduna gidip gelseniz de saklanır; ancak belgeye kaydedilmez, ortak çalışanlara gönderilmez ve geri alma geçmişine hiçbir şey eklemez. Belgenin tamamının yenisiyle değiştirilmesi, onları Akış modunun geri kalanıyla birlikte atar.

Sağdan sola yazılan bir görüntüleme dilinde araç çubuğu sırasını korur ve iki ok işlevlerini değiştirir; bu nedenle `Previous table` sağı gösteren oktur. Tuşlar aynı kalır. [Sağdan sola yazılan diller](./language-and-theme.md#right-to-left-languages) bölümüne bakın.

### Akış modunun yerleşimi {#how-flow-is-placed}

`Flow` modu ilk kez gösterildiğinde, gösterdiği tablolar ana iş parçacığının dışında yerleştirilir ve sonuç ekrana sığdırılır.  
Düzen, düzenleyici açık kaldığı sürece korunur. Sekmeden ayrılıp ya da `Graph` moduna geçip geri döndüğünüzde Akış modu bu düzeni yeniden kullanır, yakınlaştırma ve kaydırma konumu da bıraktığınız gibi kalır.  
Akış modu, diyagramın tamamı için bir düzen ve en son daraltıldığı tablolar için bir düzen tutar, bu yüzden o düzenin dayandığı hiçbir şey değişmediği sürece `Show all` tüm diyagram düzenine geri döner ve onu yeniden hesaplamadan ekrana sığdırır. Diyagramın tamamına ya da Akış modunun en son daraltıldığı tablolara giden bir [adım](#previous-table-and-next-table) da bu düzeni aynı şekilde yeniden kullanır.

Akış modu kartları şu durumlarda yeniden yerleştirir:

- `Tidy Up` düğmesine bastığınızda. Sonuç ekrana sığdırılır.
- Satır görünümünü değiştirdiğinizde, görünümü başka tablolara daralttığınızda ya da `Previous table` veya `Next table` ile başka tablolara geçtiğinizde. Sonuç ekrana sığdırılır.
- `Name View` listesinde başka bir görünüm seçtiğinizde. Sonuç ekrana sığdırılır.
- Tablolar ya da ilişkiler eklendiğinde veya kaldırıldığında ya da Ad görünümü değiştirildiğinde – siz Akış modundan uzaktayken yapılıp döndüğünüzde algılanan değişikliklerle ya da siz Akış modundayken bir ortak çalışanın yaptığı değişikliklerle. Yakınlaştırma ve kaydırma konumu olduğu yerde kalır.

Her düzen kartların şu anki konumlarını hesaba katar, bu yüzden `Tidy Up` daha önceki bir yerleşimi mutlaka geri getirmez.  
Bir tabloyu yeniden adlandırmak, bir mantıksal ad yazmak ya da sütun eklemek gibi yalnızca bir kartı yeniden boyutlandıran bir değişiklik, kartları yeniden yerleştirmez. Kartlar üst üste binerse `Tidy Up` düğmesine basın.

Yerleştirme 6 saniyeden uzun sürerse dönen bir yükleme göstergesi ve `Cancel` düğmesi içeren bir `Placing tables` bilgi kutusu gösterilir.  
`Cancel` düğmesi ya da yerleştirme sürerken herhangi bir anda `Escape` tuşu yerleştirmeyi iptal eder; `Tidy Up` ya da `Flow` moduna geri dönmek onu yeniden başlatır.  
Yerleştirme başarısız olursa – ana uygulama paylaşımlı worker (SharedWorker) çalıştırmıyorsa, worker başlatılamazsa ya da 60 saniye içinde hiçbir düzen dönmezse – Akış modu uyarı işaretli bir `Could not place tables` bilgi kutusu gösterir ve `Tidy Up` yeniden dener. [Web Worker'lar](../../api/installation.md#web-workers) bölümüne bakın.  
Akış modu, diyagramın tamamında da daraltılmış bir görünümde de yalnızca son düzeninin yerleştirdiği tabloları çizer, bu yüzden ilk kez gösterildiğinde bir yerleştirme başarılı olana kadar hiç kart olmayabilir.  
Akış modu kartları yeniden yerleştirdiğinde, örneğin görünümü başka tablolara daralttığınızda, önceki yerleşim yeni düzen gelene kadar ekranda kalır ve o düzen iptal edilirse ya da başarısız olursa da orada kalmaya devam eder.

Belgenin tamamı yenisiyle değiştirildiğinde, örneğin bir dosya içe aktarılarak, Akış modunun düzenleri, odağı, `Previous table` ve `Next table` adımları, satır görünümü, yakınlaştırması ve kaydırma konumu atılır ve Akış modu, onu bir sonraki açışınızda ilk seferdeki gibi baştan başlar: diyagramın tamamıyla ya da onu [tablolara odaklanarak](#focusing-on-tables) açarsanız daraltılmış olarak.

### Akış modu belgeyi asla düzenlemez {#flow-never-edits-the-document}

Akış modu diyagramı yalnızca okur. Yakınlaştırma, kaydırma, kartları taşıma, `Tidy Up`, satır görünümü, sabitlemeler, odaklanma ve `Previous table` ile `Next table` düğmeleriyle adım adım ilerleme [geri alma geçmişine](./undo-redo.md#what-the-history-records) hiçbir şey eklemez.  
Diyagramda da hiçbir şeyi değiştirmezler. Bir karta basmak, ERD sekmesinde bir tabloya tıklamanın yaptığı gibi kartın tablosunu gerçekten öne getirir, bu yüzden tablo orada da öndedir, ancak katman sırası kaydedilmez. [Birden çok tabloyu taşıma](./table-related-functions.md#moving-multiple-tables) bölümüne bakın. `Graph` modu da diyagrama aynı şekilde dokunmaz.  
`Name View` listesi, yalnızca `Name View` [kilidi](./settings.md#lock) devre dışıyken bir istisnadır: O durumda bir seçim diyagramın Ad görünümünü değiştirir; bu görünüm kaydedilir ve ortak çalışanlarda da değişir. Kilit, varsayılan olarak olduğu gibi etkinken bir seçim yalnızca kendi ekranınızı değiştirir. Her iki durumda da geri alma geçmişine hiçbir şey eklemez.  
Bir karta basmak asla ilişki eklemez. ERD sekmesinden bir ilişki çizerken ayrıldıysanız, karta basmak henüz hiçbir tablo seçilmemişse kartın tablosunu başlangıç tablosu olarak seçer, aksi hâlde çizimi sonlandırır.  
Dış bağlantı [kart düğmesi](#card-buttons) ise sizi Akış modundan çıkardığı için daha ileri gider: ERD sekmesinin tabloya kaydırılması gerektiğinde bu kaydırma, görünüm konumundaki diğer her değişiklik gibi kaydedilir.

Siz Akış modundayken ortak çalışanların düzenlemeleri diyagrama ulaşmaya devam eder ve kartlar onların eklediği ya da kaldırdığı tabloları ve ilişkileri izler. [Akış modunun yerleşimi](#how-flow-is-placed) bölümüne bakın.  
Ortak çalışanların seçim ve odak halkaları kartlarda çizilir, ancak imleçleri ve sürükleme kutuları çizilmez. [Ortak düzenleme](../../api/advanced/collaborative-editing.md) sayfasına bakın.

Odaklanma ve adım adım ilerleme de dahil olmak üzere her iki mod `readonly` bir düzenleyicide de çalışır; orada yalnızca kendi ekranınızı değiştiren `Name View` listesi de öyle.
