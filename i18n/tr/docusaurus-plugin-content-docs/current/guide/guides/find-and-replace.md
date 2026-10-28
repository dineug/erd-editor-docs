---
sidebar_position: 10
description: Gezginin en üstünden tablo, sütun, dizin ve tablo grubu adlarını, mantıksal adları, açıklamaları ve notları arama, eşleşmeler arasında Gezginin ağacında ve tuvalde sırayla ilerleme, tek bir eşleşmeyi ya da tümünü değiştirme.
---

# Bul ve değiştir

Tüm diyagramda metin bulur, ERD tuvalinde her eşleşmeye gitmenizi sağlar ve tek bir eşleşmeyi ya da tümünü değiştirir.  
Sekiz metin türünde arama yapar: tablo adları, tablo açıklamaları, sütun adları, sütun açıklamaları, notlar, dizin adları, tablo grubu adları ve tablolar ile sütunların [mantıksal adları](./logical-names.md). [Neleri arar](#what-it-searches) bölümüne bakın.

ERD tuvalinin soluna yerleşik panel olan [Gezginin](./explorer.md) en üstünde, Gezginin başlık çubuğu ile ağacı arasında yer alır. Kendine ait bir başlığı yoktur. Yukarıdan aşağıya şunları içerir:

- İçinde en sonda üç [seçenek](#options) bulunan Bul alanı ve önündeki `Toggle Replace` oku.
- Başta daraltılmış olan `Replace` satırı. [Değiştirme](#replacing) bölümüne bakın.
- Sayaç, ardından eşleşmeler arasında sırayla ilerleyen yukarı ve aşağı oklar ile üç noktalı `Search In` düğmesi.
- `Search In` düğmesinin genişlettiği [metin türleri](#what-it-searches).

Bul alanında metin olduğu sürece Gezginin ağacı eşleşmeleri gösterir. [Sonuçlar](#the-results) bölümüne bakın.  
Arama bölümü kısa bir tuvalde de tam yüksekliğini korur, altındaki ağaç ise kalan alanı kaplar ve kaydırılır.

![Gezginde ⌘ + F ile Bul ve değiştir özelliğini açma, member için altı eşleşme arasında sırayla ilerleme, ardından Preserve Case açıkken altısını da user ile değiştirme (⌘ + Enter)](/img/demo-find-and-replace.webp)

## Açma ve kapatma {#opening-and-closing}

`Ctrl + F` (Windows/Linux) veya `⌘ + F` (Mac) tuşları ile [Hızlı aramadaki](./quick-search.md) ya da tuvalin bağlam menüsündeki `Toggle Explorer` öğesi, Gezgini arama bölümüne odaklanmış olarak açar. Metin imleci Bul alanına gider, alandaki metin seçili olur ve arama metni hiçbir eşleşme geçerli olmadan yeniden aranır.  
Araç çubuğundaki `Explorer` düğmesi yalnızca paneli açar veya kapatır. Metin imlecini Bul alanına koymaz, arama metnini ve geçerli eşleşmeyi olduğu gibi bırakır.  
Hızlı arama ya da [Yanında açılan iletişim kutuları](./explorer.md#dialogs-beside-it) bölümündeki beş iletişim kutusundan biri açıkken olduğu gibi, tuş metin imlecini yalnızca zaten görünen bir Gezgine geri getirdiğinde, geçerli eşleşme geçerli kalır.

Gezginin nasıl kapatıldığı, Gezgin açıkken tuşun ve iki `Toggle Explorer` öğesinin ne yaptığı ve bunların kapattığı iletişim kutuları, Gezgin sayfasındaki [Açma ve kapatma](./explorer.md#opening-and-closing) bölümünde anlatılır.  
Başka bir sekmenin ve Zen modunun Gezgini nasıl gizlediği ile Fark görüntüleyicinin, Zaman yolculuğunun ve Otomatik düzenin önizlemesinin onu nasıl gizleyip açılmasını engellediği [Kenara çekildiğinde](./explorer.md#when-it-stands-aside) bölümünde anlatılır. Gezgin için fazla dar bir düzenleyicinin durumu [Tuvalin yanında](./explorer.md#beside-the-canvas) bölümünde anlatılır.

Yeniden açıldığında son arama metni, Değiştir alanındaki metin, [seçenekler](#options), açık olan [metin türleri](#what-it-searches) ve `Replace` satırı ile metin türlerinin genişletilmiş olup olmadığı korunur.  
Bunlar düzenleyici açık kaldığı sürece korunur ve belgeye kaydedilmez. Yeni açılan bir düzenleyici tüm seçenekler kapalı, `Replace` satırı ile metin türleri daraltılmış ve yalnızca dört ad türü ile `Logical names` açık olarak başlar. [Neleri arar](#what-it-searches) bölümüne bakın.

## Tarayıcının bulma çubuğu {#the-browsers-find-bar}

Klavye odağı düzenleyicideyken `Ctrl + F` (Windows/Linux) veya `⌘ + F` (Mac), düzenleyicinin kendi metin alanları dahil her sekmede düzenleyiciye aittir, bu yüzden tarayıcının bulma çubuğu açılmaz.  
Fark görüntüleyici, Zaman yolculuğu veya Otomatik düzenin önizlemesi açıkken ve odak düzenleyicinin dışındayken tuş tarayıcıya ya da ana uygulamaya geçer.

- Web uygulaması ve Google Drive: Tarayıcının bulma çubuğu yalnızca bu iki durumda açılır.
- VS Code: Uzantı, ERD Editor içinde VS Code'un kendi bulma bileşenini kapalı tutar, bu yüzden tuş orada hiçbir zaman bulma bileşeni açmaz.
- Obsidian: Diyagramın sekmesi etkin olduğunda tuş, Obsidian'ın `Search current file` komutu yerine düzenleyiciye ulaşır.
- JetBrains IDE'si: IDE'nin tuş haritası `Ctrl + F` (Windows/Linux) veya `⌘ + F` (Mac) tuşlarını kendine ayırıyorsa, aramayı Hızlı aramadaki ya da tuvalin bağlam menüsündeki `Toggle Explorer` öğesinden açın veya Gezgini araç çubuğundaki `Explorer` düğmesiyle açıp Bul alanına tıklayın.

Düzenleyiciyi gömen bir sayfa bu tuşu değiştirebilir veya kaldırabilir. [Kısayolu değiştirme](#changing-the-shortcut) bölümüne bakın.

## Neleri arar {#what-it-searches}

Aranan metin türlerini şu sırayla sekiz düğme belirler: `Table names`, `Table comments`, `Column names`, `Column comments`, `Memos`, `Index names`, `Table group names` ve `Logical names`.  
Bu düğmeler başta daraltılmıştır. Sayacın bulunduğu satırın sonundaki `Search In` düğmesi onları o satırın altında genişletir ve yeniden daraltır, düğmeler göründüğü sürece de vurgulu olur.  
Vurgulu bir tür düğmesi açıktır. Bir düğmeyi açmak veya kapatmak için ona tıklayın, arama yeniden çalışır. Sekizi de kapalıyken hiçbir şey bulunmaz.

Arama ilk açıldığında dört ad türü, yani `Table names`, `Column names`, `Index names` ve `Table group names`, bir de `Logical names` açıktır, bu yüzden açıklamaları ve notları açmadığınız sürece bir yeniden adlandırma onlara ulaşmaz.  
`Logical names`, tabloların ve sütunların mantıksal adları için aynı şekilde tek bir türdür.  
Dizin adları, [Tablo özelliklerinin](./table-related-functions.md#indexes) `Indexes` sekmesindeki dizinlerin adlarıdır, bunların üstünde listelenen `PK_` ve `UQ_` anahtarları değildir.

Başka hiçbir şey aranmaz. Veri türleri, bir sütunun değer alanı, varsayılan değerler, bir dizinin sütunları, veritabanı adı, `Before tables` ve `After tables` betikleriyle birlikte [Şema SQL](./schema-sql.md), oluşturulan kod ve [kendi araması](./dictionary.md#searching) olan [Sözlük](./dictionary.md) sekmesinin sayfaları aramaya dahil değildir.  
Mantıksal adlar, tuvalin hiçbirini göstermediği `Physical Names` dahil, [Ad görünümü](./logical-names.md#name-view) ne gösterirse göstersin aranır. Bir [tablo görünüm seçeneğiyle](./table-related-functions.md#table-view-options) gizlenen açıklama da yine aranır. View Option → `Memos` ile gizlenen notlar ve View Option → `Table Groups` ile gizlenen [tablo grupları](./table-groups.md#hiding-groups) ise düğmeleri açık olsa bile aranmaz, bu yüzden `Replace All` göremediğiniz bir notu hiçbir zaman yeniden yazmaz, göremediğiniz bir grubu da yeniden adlandırmaz.

## Seçenekler {#options}

Bul alanının içinde en sonda bulunan üç aç/kapat düğmesi, arama metninin nasıl eşleşeceğini değiştirir. Adları araç ipuçlarında yazar ve açıkken vurgulu olurlar. Üçü de kapalı başlar ve birini değiştirmek aramayı yeniden çalıştırır.

- `Match Case`: Kapalıyken eşleştirme büyük/küçük harf ayrımı yapmaz.
- `Match Whole Word`: Bir eşleşme, yalnızca iki yanından hiçbirinde bir sözcüğün içine taşmıyorsa sayılır. Herhangi bir yazı sistemindeki harfler, rakamlar ve işaretler sözcük karakteri sayılır, alt çizgi de öyle. Bu nedenle `user`, `user id` ve `user.id` içinde eşleşir, ancak `users`, `user_id` veya `superuser` içinde eşleşmez. Arama metninin kendisi sözcük karakteri olmayan bir ucu, örneğin `.id` içindeki nokta, o uçta sınır gerektirmez.
- `Use Regular Expression`: Arama metni, her zaman Unicode modunda çalışan bir JavaScript normal ifadesidir, bu yüzden `\p{L}` çalışır. `^` ve `$`, çok satırlı bir açıklamanın veya notun her satırının başında ve sonunda eşleşir, `.` ise satır sonunu geçmez. Adlarda sık yazılan `\_` ve `\-` gibi kaçış dizileri kabul edilir.

`user(` gibi ayrıştırılamayan bir normal ifade hiçbir şey bulmaz: Sayaçta kırmızıyla `Invalid regular expression` yazar ve Bul alanı kırmızı bir çerçeveyle çevrilir.  
`Match Case` ve `Match Whole Word` normal ifadeye de uygulanır. Tek başına `^` gibi uzunluğu sıfır olan bir eşleşme hiçbir zaman listelenmez.

Düz metin, yazdığınız sırada aranır. Normal ifade ise yazmaya ara verildiğinde aranır ya da `Enter` tuşuna, bir gezinme düğmesine, `Replace` veya `Replace All` düğmesine bastığınızda ya da eşleşme içeren bir satırı seçtiğinizde hemen aranır.  
Aramanın süre sınırı yoktur, bu yüzden yoğun geri izleme yapan bir normal ifade, arama bitene kadar düzenleyicinin yanıt vermemesine yol açabilir.

Dördüncü aç/kapat düğmesi olan `Preserve Case`, `Replace` alanının içinde en sonda yer alır, bu yüzden yalnızca `Replace` satırı genişletilmişken görünür. Kapalı başlar. Bulunan hiçbir şeyi değiştirmez, yalnızca `Replace` ve `Replace All` işlemlerinin yeni metni nasıl yazacağını değiştirir. [Değiştirme](#replacing) bölümüne bakın. Açıldığında veya kapatıldığında arama yapılmaz ve geçerli eşleşme geçerli kalır.

## Sonuçlar {#the-results}

Alanların altındaki satırın başında bulunan sayaç, nerede olduğunuzu gösterir. Bul alanı boşken sayaç da boştur.

| Sayaç | Ne zaman |
| --- | --- |
| `No results` | Hiçbir şey eşleşmez. |
| `12 matches` | Eşleşmelerden birine geçmeden önce; tek bir eşleşme için `1 match`. |
| `3 of 12` | Üçüncü eşleşme geçerli eşleşmedir. |
| `Invalid regular expression` | Normal ifade ayrıştırılamaz. |
| `Replaced 12 matches` | `Replace All` o kadar eşleşmeyi değiştirdi; tek bir eşleşme için `Replaced 1 match`. |
| `No changes` | `Replace All` hiçbir şeyi değiştirmedi. |
| `No more matches` | Bir `Replace` turu başladığı yere geri döndü. [Değiştirme](#replacing) bölümüne bakın. |

`Replaced …`, `No changes` ve `No more matches` iletileri, bir düzenlemenin veya geri almanın başlattığı arama dahil, bir sonraki aramada ya da geçişte yerini eşleşme sayısına bırakır.

Bul alanında metin olduğu sürece Gezginin [ağacı](./explorer.md#the-tree) tüm diyagram yerine sonuçları gösterir: yalnızca eşleşme içeren satırları ve onların üstündeki satırları. Hiçbir şey eşleşmediğinde veya normal ifade ayrıştırılamadığında ağaç boştur. Arama metnini silmek, tüm ağacı daha önceki daraltma durumuyla geri getirir.

- `Tables`, `Table Groups` ve `Memos` klasörleri yalnızca eşleşme içerdiklerinde görünür ve her klasörün gösterdiği sayı, sonuçlarda doğrudan altındaki satırların sayısıdır.
- `Tables` klasörünün altında eşleşme içeren tablolar, hiçbir zaman mantıksal ada göre değil, ada göre sıralanır. Her tablonun altında açıklamasındaki her eşleşme için bir satır, ardından eşleşme içeren sütunların sütun sırasıyla yer aldığı ve her sütunun altında açıklamasındaki her eşleşme için bir satır bulunan bir `Columns` klasörü, ardından adı eşleşen dizinlerin yer aldığı bir `Indexes` klasörü gelir. `Foreign Keys` klasörü yoktur.
- `Table Groups` klasörünün altında adı eşleşen gruplar, tabloları olmadan, ada göre sıralanır. Bulunan bir tablo `Tables` klasörünün altında görünür.
- `Memos` klasörünün altında eşleşme içeren notlar belge sırasıyla yer alır. Her not ilk satırıyla gösterilir ve içindeki her eşleşme için bir satırı vardır.

Bir addaki eşleşme o adın kendi satırında vurgulanır, bu yüzden arama metnini iki kez içeren bir ad, iki vurgusu olan tek bir satırdır. Bir tablonun veya sütunun mantıksal adındaki eşleşme de o tablonun veya sütunun satırında yer alır, hiçbir zaman kendine ait bir satırda değil.  
Bu satırlar tabloyu veya sütunu [Ad görünümünün](./logical-names.md#beyond-the-canvas) gösterdiği gibi adlandırır ve bir satırın gösterebileceği iki addan her biri yalnızca kendi eşleşmelerini vurgular. Yalnızca görünümünün dışarıda bıraktığı adda (`Physical Names` görünümünde mantıksal ad, `Logical Names` görünümünde ad) bulunan bir satır, bu adı gösterdiği adın ardından `Both Names` görünümündeki gibi soluk olarak ve eşleşmesi vurgulanmış hâlde ekler. Gösterdiği ad da bir eşleşme içerdiğinde satır yalnızca o adı gösterir, bu yüzden görünümünün dışarıda bıraktığı addaki eşleşmeler sayılır ve aralarında ilerlenir, ancak vurgulanmaz.  
Bir açıklamadaki veya nottaki eşleşmenin kendine ait bir satırı vardır: tablo ya da sütun açıklaması için bir konuşma balonu simgesi, not için bir yapışkan not simgesi, ardından eşleşmesi vurgulanmış bir metin parçası. Uzun bir metin `…` ile kesilir ve satır sonları boşluk olarak görünür. Metnin tamamını görmek için satırın üzerine gelin.  
Diğer tüm satırlar arama dışındaki gibi görünür: Sütun veri türünü, dizin sütunlarını gösterir ve boş bir adın yerinde `unnamed` yazar.

Arama başladığında altında satır bulunan her satır genişletilmiş görünür. Daralttığınız ya da `Collapse All` düğmesinin daralttığı bir satır, altındaki bir eşleşme geçerli olana kadar veya arama metni, `Match Case`, `Match Whole Word`, `Use Regular Expression` ya da bir metin türü değişene kadar veya arama tuşla ya da bir `Toggle Explorer` öğesiyle yeniden açılana kadar daraltılmış kalır.  
Geçerli eşleşmenin satırı vurgulanır ve görünür olacak şekilde kaydırılır. Ağaç, kaç tane olursa olsun her eşleşmeyi listeler.  
Eşleşmeler arasında ağacın sırasıyla ilerlenir: tablo tablo, tablonun mantıksal adı, adı ve açıklaması, ardından sütun sırasıyla her sütununun mantıksal adı, adı ve açıklaması, ardından dizin adları; ardından tablo grubu adları; ardından notlar.

Gezgin göründüğü sürece sonuçlar belgeyi izler. Düzenlemelere ara verildiğinde aranan metinlerdeki her değişiklik yeniden arama yapar ve geçerli eşleşme hâlâ oradaysa geçerli kalır. Buna bir adın, mantıksal adın, açıklamanın veya not metninin düzenlenmesi, bir tablonun, sütunun, dizinin, notun veya tablo grubunun eklenmesi ya da kaldırılması, bir sütunun taşınması ve notların veya tablo gruplarının Görünüm seçenekleriyle gizlenmesi ya da gösterilmesi dahildir. Sonuncusu bunların eşleşmelerini ağaçtan çıkarır veya geri getirir. Tuvaldeki bir düzenleme, geri alma veya yineleme, içe aktarma ve bir ortak çalışanın ya da kodlama ajanının yaptığı düzenleme, bunların hepsi sayılır. Seçim yapmak, tuvalde tabloları, notları veya grupları taşımak, kaydırmak, yakınlaştırmak ve üzerine gelmek sayılmaz.  
Aramanın okuduğu hiçbir metni değiştirmeyen Ad görünümü değişikliği de sayılmaz: Aynı eşleşmeler kalır ve satırlar yeni görünümün gösterdiği adları alır.  
Gezgin kapalıyken ya da görünmezken yapılan düzenlemeler, Gezgin yeniden göründüğü anda aranır.

## Eşleşmeye gitme {#going-to-a-match}

Bul alanında `Enter` tuşu sonraki eşleşmeye, `Shift + Enter` ise önceki eşleşmeye gider. Sayaçtan sonraki yukarı ve aşağı ok düğmeleri de aynısını yapar. Araç ipuçlarında `Previous Match (Shift+Enter)` ve `Next Match (Enter)` yazar ve eşleşme yokken devre dışıdırlar.  
Hareket iki uçta da öbür uca döner. İlk kez bir eşleşmeye geçene kadar hiçbir eşleşme geçerli değildir, bu yüzden ilk `Enter` ilk eşleşmeye, ilk `Shift + Enter` ise son eşleşmeye gider.

Sonuçlardaki bir satıra tıklamak ya da klavye o satırdayken `Enter` veya `Space` tuşuna basmak şunlardan birini yapar:

- Kendi adı veya mantıksal adı eşleşme içeren bir satır, mantıksal addakiler addakilerden önce gelmek üzere ilk eşleşmesine gider.
- Bir açıklamanın veya notun metin parçasını gösteren satır, o eşleşmeye gider.
- Adı ve mantıksal adı eşleşmeyen bir tablo ya da bir notun kendi satırı gibi diğer herhangi bir satır, satırın temsil ettiği öğeye gider ve geçerli eşleşmeyi olduğu gibi bırakır. [Bir satıra gitme](./explorer.md#going-to-a-row) bölümüne bakın.
- Bir klasör daraltılır veya genişletilir.

Bir eşleşme her geçerli olduğunda ağaç, onun üstündeki daraltılmış satırları genişletir ve klavye odağını oraya taşır, böylece ağaçtaki ok tuşları oradan devam eder.

Bir eşleşmeye gitmek, açıksa Tablo özelliklerini kapatır, ardından:

- Bir tablonun veya sütunun adı, mantıksal adı ya da açıklaması için tabloyu tek başına seçer, öne getirir ve odaktaki hücreyi eşleşmeyi içeren hücreye taşır. Bir [tablo görünüm seçeneğiyle](./table-related-functions.md#table-view-options) gizlenmiş bir açıklamadaki eşleşme, odaktaki hücreyi bunun yerine yanındaki ada taşır. [Ad görünümü](./logical-names.md#name-view) ad veya mantıksal ad için hücre göstermediğinde odaktaki hücre onun yerine gösterilen hücreye gelir: `Physical Names` görünümünde ad, `Logical Names` görünümünde mantıksal ad.
- Dizin adı için dizinin tablosunu tek başına seçer ve öne getirir, odaktaki hücre zaten o tabloda değilse tablonun adına, `Logical Names` ve `Both Names` görünümlerinde ise mantıksal adına gelir. Dizin adları tuvalde çizilmez.
- Tablo grubu adı için grubu tek başına seçer ve tablolarıyla birlikte öne getirir.
- Not için notu tek başına seçer ve öne getirir.

Tuval yalnızca gidilen öğe zaten iyi görünmüyorsa kaydırılır ve yakınlaştırma hiçbir zaman değişmez. [Atlamanın varış noktası](./table-related-functions.md#where-a-jump-lands) bölümüne bakın.

Bul alanında `Enter` tuşuna basıldıktan sonra metin imleci orada kalır, bir satır seçildikten sonra ise klavye odağı ağaçta kalır, bu yüzden ardından yazdıklarınız seçili tabloya ulaşmaz.  
Bir eşleşmeye gitmek, çizilmekte olan bir ilişkiyi hiçbir zaman başlatmaz veya tamamlamaz.

## Değiştirme {#replacing}

`Replace` satırı başta daraltılmıştır. Bul alanının önündeki, araç ipucunda `Toggle Replace` yazan ok onu genişletir ve daraltır. Satır daraltıldığında Değiştir alanındaki metin korunur.  
Bu satırda, içinde en sonda `Preserve Case` aç/kapat düğmesi bulunan `Replace` alanı ve araç ipuçlarında `Replace (Enter)` ile `Replace All` yazan iki düğme bulunur. Eşleşme yokken iki düğme de devre dışıdır.

`Replace`, Değiştir alanında `Shift` ile ya da `Shift` olmadan `Enter` tuşuyla veya kendi düğmesiyle çalışır:

- Geçerli eşleşme yokken ilk basış yalnızca sonraki eşleşmeye gider, böylece herhangi bir şey değişmeden önce neyi değiştireceğini görürsünüz.
- Geçerli bir eşleşme varken aynı metindeki diğer eşleşmelere dokunmadan yalnızca o eşleşmeyi değiştirir ve yazdığı metinden sonraki eşleşmeye geçer. Yazdığı metin arama metnini içerse bile atlanır: `user` metnini `super_user` ile değiştirmek, ardından `super_user` içinde durmaz.
- Yeni metnin tam olarak önceki hâliyle geri yazacağı bir eşleşme olduğu gibi bırakılır ve basış yalnızca sonraki eşleşmeye geçer.
- Değiştirme ve sonraki eşleşmeye kaydırma tek bir geri alma adımıdır.

Art arda `Replace` basışlarından oluşan bir tur, başladığı yere döndüğünde durur. Sayaçta `No more matches` yazar, hiçbir eşleşme geçerli değildir ve sonraki basışlar hiçbir şeyi değiştirmez.  
Bu nedenle `Big Customer` ile değiştirilen `Customer`, büyüyüp `Big Big Customer` olmak yerine bir kez değiştirilir.  
Bir eşleşmeye gitmek, arama metnini, `Match Case`, `Match Whole Word` veya `Use Regular Expression` seçeneğini ya da bir metin türünü değiştirmek, aramayı tuşla veya bir `Toggle Explorer` öğesiyle açmak ya da `Replace All` işlemini çalıştırmak yeni bir tur başlatır, turun başladığı metni değiştiren bir geri alma veya başka herhangi bir düzenleme de öyle. Değiştir alanındaki metni veya `Preserve Case` seçeneğini değiştirmek yeni bir tur başlatmaz, tuş metin imlecini yalnızca zaten görünen bir Gezgine geri getirdiğinde de başlatmaz.  
Bir tur sürerken, turun yeniden adlandırdığı bir tablo ya da tablo grubu ağaçtaki ve eşleşme sırasındaki yerini korur, bu yüzden yeniden adlandırma onu sırada daha geriye taşıyacak olsa bile aynı öğeyle yeniden karşılaşılmaz. Sonraki tur ağacı yeniden ada göre sıralar ve yeniden adlandırılan satır yeni yerine geçer.

`Replace All`, Değiştir alanında `Ctrl + Enter` (Windows/Linux) veya `⌘ + Enter` (Mac) tuşlarıyla ya da kendi düğmesiyle çalışır:

- Açık olan metin türlerindeki her eşleşmeyi değiştirir ve diğer türlere dokunmaz. Bunun tek istisnası, değiştirilen bir mantıksal adın türettiği fiziksel adlardır: Bunları `Table names` ve `Column names` kapalıyken bile yazar, aşağıya bakın. Varsayılan türlerle tabloları, sütunları, dizinleri ve tablo gruplarını yeniden adlandırır, tabloların ve sütunların mantıksal adlarını da yeniden yazar, açıklamalar ve notlar ise değişmeden kalır.
- Değiştirdiği her şey tek bir geri alma adımıdır. [Tek hareket, tek adım](./undo-redo.md#one-gesture-one-step) bölümüne bakın.
- Sayaçta `Replaced N matches` yazar ve yalnızca metni gerçekten değişen eşleşmeler sayılır. Hiçbiri değişmediğinde, örneğin `(user)` normal ifadesi `$1` ile değiştirildiğinde, sayaçta `No changes` yazar ve geçmişe hiçbir şey kaydedilmez.
- Ardından sonuçlar hiçbir eşleşme geçerli olmadan yeniden aranır, bu yüzden yeni metnin içerdiği eşleşmeler de listelenebilir.

Her ikisi de her metni son aramanın bulduğu hâliyle değil, bastığınız andaki hâliyle okur.

Değiştir alanındaki metnin nasıl kullanıldığı:

- `Use Regular Expression` kapalıyken `$` işaretinin özel bir anlamı yoktur ve Değiştir alanındaki metin, `Preserve Case` seçeneğinin verdiği büyük/küçük harf düzeni dışında yazıldığı gibi kullanılır.
- `Use Regular Expression` açıkken `$1` ile `$99` arasındakiler, `$<name>`, `$&`, `` $` ``, `$'` ve `$$`, JavaScript'in `String.prototype.replace` yönteminde olduğu gibi genişletilir.
- `Preserve Case` kapalıyken eşleşen metnin büyük/küçük harf durumu aktarılmaz: `Match Case` kapalıyken `user` metnini `member` ile değiştirmek `Users` metnini `members` yapar.
- `Preserve Case` açıkken her yeni metin, `$1` ve diğerleri genişletildikten sonra, yerine geçtiği metnin büyük/küçük harf durumuna göre biçimlendirilir, bu yüzden aynı değiştirme `Users` metnini `Members` yapar:
  - Tamamı büyük harf olan bir eşleşme yeni metni tamamen büyük harfle, tamamı küçük harf olan bir eşleşme ise tamamen küçük harfle alır: `account` ile değiştirilen `USER` metni `ACCOUNT` olur, `Account` ile değiştirilen `user` metni ise `account` olur.
  - Diğer her eşleşme, yeni metnin ilk karakterine eşleşmenin ilk karakterinin büyük/küçük harf durumunu verir ve gerisini yazıldığı gibi bırakır: `accountKey` ile değiştirilen `UserId` metni `AccountKey` olur, `AccountKey` ile değiştirilen `uSER` metni ise `accountKey` olur. Eşleşmenin ilk karakterinin büyük/küçük harf durumu yoksa yeni metin yazıldığı gibi bırakılır: `xyz` ile değiştirilen `_Ab` metni `xyz` olur.
  - Eşleşmenin ve yeni metnin ikisi de `-` ya da ikisi de `_` içeriyorsa ve bu ayırıcı onları aynı sayıda parçaya bölüyorsa, her parça karşılık gelen parçaya göre biçimlendirilir: `account_key` ile değiştirilen `USER_id` metni `ACCOUNT_key` olur, `account-key` ile değiştirilen `User-Name` metni ise `Account-Key` olur. Hem `-` hem de `_` onları bu şekilde bölüyorsa, metin bir bütün olarak biçimlendirilir.
  - `123` gibi büyük/küçük harf ayrımı olan hiçbir harf içermeyen bir eşleşme, yeni metni yazıldığı gibi bırakır.
  - Önceki hâliyle geri yazılan bir eşleşme hiç sayılmaz: `Match Case` kapalıyken `customer` metnini `Customer` ile değiştirmek `customer`, `Customer` ve `CUSTOMER` metinlerini oldukları gibi geri yazar ve hiçbiri sayılmaz.
- Boş bir Değiştir alanı eşleşmeyi siler.

Bir değiştirme, yeni tablo adını, sütun adını, mantıksal adı, açıklamayı veya not metnini kendiniz yazmak, dizini Tablo özelliklerinde yeniden adlandırmak ya da tablo grubunu yeniden adlandırmakla aynı olan sıradan bir düzenlemedir.  
Diğer her düzenleme gibi geçmişe kaydedilir, ortak çalışanlara ve kodlama ajanına ulaşır.

Bu yüzden bir değiştirmenin yazdığı tablo veya sütun adı kendi yazdığınız bir ad olur ve daha sonra yazılan bir mantıksal ad, [Fiziksel adları yeniden türetme](./dictionary.md#derive-physical-names-again) işlemi adı yeniden sözlüklere bırakana kadar bu adı olduğu gibi bırakır. Bir değiştirmenin boş bıraktığı ad ise, temizlenen her ad gibi, sözlüklere geri döner. [Kendi yazdığınız adlar](./dictionary.md#names-of-your-own) bölümüne bakın.  
Bir tablonun veya sütunun fiziksel adı boşken ya da kendisi türetilmişken, değiştirilen bir mantıksal ad, mantıksal ad hücresini yeni bir mantıksal adla kapatmanın yaptığı gibi fiziksel adı sözlüklerden türetir. [Fiziksel adları türetme](./dictionary.md#deriving-physical-names) bölümüne bakın. Bu durumda yeni mantıksal adı bir terim olan sütun, terimin değer alanını ve onunla birlikte değer alanının veri türünü de alır. Türettikleri, değiştirmenin geri alma adımına dahildir ve `Replaced N matches` içinde sayılmaz.  
Tek bir `Replace All` aynı tablonun veya sütunun hem mantıksal adını hem de adını yeniden yazdığında, yazdığı ad yeni mantıksal adın türeteceği ada üstün gelir.

## Arama alanlarındaki tuşlar {#keys-in-the-search-fields}

- Bul alanında `Enter` sonraki eşleşmeye, `Shift + Enter` önceki eşleşmeye gider.
- Değiştir alanında `Shift` ile ya da `Shift` olmadan `Enter` değiştirir, `Ctrl + Enter` (Windows/Linux) veya `⌘ + Enter` (Mac) ise tümünü değiştirir.
- Alanlardan birinde giriş yöntemiyle birleştirme sürerken `Enter` birleştirmeye aittir, ne başka bir eşleşmeye geçer ne de değiştirme yapar.

`Escape` tuşunun, hâlâ çalışan düzenleyici kısayollarının ve diğer tüm tuşların bu alanlarda ne yaptığı [Gezgindeki tuşlar](./explorer.md#keys-in-the-explorer) bölümünde anlatılır.

## Salt okunur düzenleyiciler {#read-only-editors}

[`readonly`](../../api/erd-editor-element.md#readonly) bir düzenleyicide arama yalnızca bulur. `Toggle Replace` oku ve `Replace` satırı yoktur, dolayısıyla Değiştir alanı, `Preserve Case`, `Replace` ve `Replace All` de yoktur.  
Bul alanı, üç seçeneği, metin türleri, sayaç, sonuçlar ve eşleşmeye gitme, hepsi çalışır. Bir eşleşmeye gitmek, [Bir eşleşmeye gitme](#going-to-a-match) bölümündeki gibi indiği öğeyi seçer ve salt okunur bir düzenleyicinin yaptığı tek seçim budur: Tuval üzerinde hareket etmeyen bir tıklama onu temizler.  
Aramayı tuşla ya da Hızlı aramadaki `Toggle Explorer` ile açın, çünkü tuval bağlam menüsünde orada `Toggle Explorer` yoktur. Gezginin geri kalanı Gezgin sayfasındaki [Salt okunur düzenleyiciler](./explorer.md#read-only-editors) bölümünde anlatılır.

VS Code'da bir diyagramın Git revizyonu veya Local History kaydı gibi bir revizyonu JSON metni olarak açılır. `Reopen Editor With...` komutuyla diyagram olarak yeniden açıldığında salt okunurdur ve yalnızca bulan bu aramayı kullanır.

## Kısayolu değiştirme {#changing-the-shortcut}

Düzenleyiciyi gömen bir sayfa, `Ctrl + F` (Windows/Linux) veya `⌘ + F` (Mac) tuşlarını [`setKeyBindingMap`](../../api/erd-editor-element.md#setkeybindingmap) yöntemiyle `findReplace` adı altında başka bir tuşa bağlayabilir veya kaldırabilir.  
Kısayol kaldırıldığında tuş her sekmede sayfaya bırakılır. Araç çubuğundaki `Explorer` düğmesi Gezgini yine açar ve kapatır, Hızlı aramadaki ve tuvalin bağlam menüsündeki `Toggle Explorer` öğesi de aramayı yine açar veya Gezgini kapatır, ancak hiçbiri kısayol göstermez, bu yüzden düğmenin araç ipucunda yalnızca `Explorer` yazar. Ayarların [Kısayollar](./settings.md#shortcuts) sekmesindeki `Toggle Explorer` satırı da hiçbir tuş göstermez. Kısayol başka bir tuşa bağlandığında hepsi yeni tuşu gösterir.
