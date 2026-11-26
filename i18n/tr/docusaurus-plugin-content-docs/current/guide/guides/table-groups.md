---
sidebar_position: 6
description: İlgili tabloları ve notları arkalarında çizilen adlı, renkli bir kutuda toplama; grupları oluşturma, adlandırma, renklendirme, taşıma, yeniden boyutlandırma ve kaldırma, Gezginden gruplara gitme, grupların tuttuğu tabloları ve notları değiştirme, grupları gizleme ve Otomatik düzende, Şema SQL'de ve DBML'de koruma.
---

# Tablo grupları

Tablo grubu, hangilerinin bir arada olduğunu göstermek için ERD tuvalinde ilgili tabloların ve notların arkasına çizilen, adı ve rengi olan bir kutudur.  
Bir tablo veya not en fazla bir grupta bulunur. Gruplar, her tablonun ve notun hangi grupta olduğu bilgisiyle birlikte diyagramla kaydedilir.

Kutunun üst kenarı boyunca bir başlık çubuğu bulunur; bu çubukta bir grup simgesi, kalın yazılmış grup adı ve işaretçi grubun üzerindeyken grubu kaldıran bir `x` yer alır. [Grubu kaldırma](#removing-a-group) bölümüne bakın. Adı olmayan bir grupta `unnamed` yazar ve çubuğa sığmayacak kadar uzun bir ad `…` ile kısaltılır.  
Kutu tablolarını ve notlarını her zaman içinde tutar: Kendisine verilen boyutu korur, ancak her tabloyu ve notu çevresinde `24px` boşluk ve üstünde başlık çubuğu kalacak şekilde içeride tutmak için genişler. Büyüyen bir tablo veya not kutuyu da kendisiyle birlikte genişletir; merkezi hâlâ kutunun içindeyken bir kenarın yakınına bırakılan bir tablo veya not da öyle. Tablolar veya notlar sürüklenirken kutu ne büyür ne küçülür. Bu genişleme kaydedilmez: Hiçbir tablonun ya da notun artık o boşluğa ihtiyacı kalmadığında kutu kendi boyutuna döner.

[View Option](./table-related-functions.md#table-view-options) → `Memos` ile gizlenen notlar gruplarında kalır: Bir grubu taşımak onları da taşır, grubu kaldırmak onları gruptan çıkarır ve ikisinden birini geri almak onları yerine koyar.  
Yalnızca gösterilen notlar kutuyu genişletir ve bir yeniden boyutlandırma kenarını durdurur; yalnızca onları çizilen grup içine alır, `Select tables` öğesi seçer ve Gezgin grubun altında listeler.

Gruplar tuvaldeki diğer her şeyin, yani tabloların, notların ve ilişki çizgilerinin arkasına çizilir.  
Gruplar üst üste geldiğinde en son basılan veya eklenen grup önde çizilir ve hiçbir grubun gövdesi başka bir grubun başlık çubuğunu hiçbir zaman örtmez. Bu sıra kaydedilmez; bu nedenle yeniden açılan bir diyagram gruplarını eklendikleri sırayla üst üste dizer.  
Gruplar ERD tuvalinde, mini haritada ve dışa aktarılan görüntüde görünür, [Gezgin](./explorer.md) de onları listeler. [Gruba gitme](#going-to-a-group) bölümüne bakın. [Görselleştirme](./visualization.md) sekmesi iki modun hiçbirinde ne grupları ne de grup renklerini çizer.

Bir kodlama ajanı da grup oluşturabilir, grupları değiştirebilir ve seçilen grupların DDL'ini okuyabilir. MCP araçlarındaki [Tablo grupları](../../mcp/tools.md#table-groups) bölümüne bakın.

![⌥ + G ile grup çizimini hazırlama, orders ve payments üzerine çizme, Billing olarak adlandırma, order_items tablosunu içine bırakma, ardından grubu taşıma ve yeniden boyutlandırma](/img/demo-table-group.webp)

## Grup oluşturma {#creating-a-group}

Grup oluşturmanın, her biri bir kısayola sahip iki yolu vardır. İkisi de salt okunur bir düzenleyicide veya gruplar [gizliyken](#hiding-groups) sunulmaz ve bu durumda kısayolları hiçbir şey yapmaz.  
Diğer tuval kısayolları gibi bunlar da yalnızca ERD sekmesinde çalışır ve bir hücre, bir not veya bir grubun adı düzenlenirken devre dışı kalır. [Kısayollar](./settings.md#shortcuts) bölümüne bakın.

### Grup çizme {#drawing-a-group}

[Tuval araç çubuğundaki](./table-related-functions.md#canvas-toolbar) `New Table Group` düğmesine tıklayın, `Alt + G` (Windows/Linux) veya `⌥ + G` (Mac) tuşlarına basın ya da `New Table Group` öğesini, `New Table` ve `New Memo` öğelerinin ardından yer aldığı tuvalin bağlam menüsünden veya ERD sekmesinde [Hızlı aramadan](./quick-search.md) seçin. Ardından tuval üzerinde bir kutu sürükleyin.  
Düğme ve kısayol çizimi açıp kapatır; bu nedenle çizim hazırken ikisinden birine basmak, çizim nasıl başlatılmış olursa olsun onu sona erdirir. Bağlam menüsündeki satır ve Hızlı arama ise çizimi yalnızca başlatır. Çizimi başlatmak el aracını kapatır ve çizilmekte olan bir ilişkiyi iptal eder.  
Çizim hazırken imleç artı imlecine dönüşür ve bir basış, altındakini seçmek veya taşımak yerine, bir tablonun üzerinde bile olsa nereye denk gelirse kutuyu orada başlatır. Bu sırada tuval araç çubuğu `New Table Group` düğmesini işaretler; el aracını da seçim aracını da işaretlemez.

Bırakmak o kutuda bir grup ekler; bu grup, sürükleme ne kadar kısa olursa olsun, başlık çubuğu dahil hiçbir zaman `160px` genişlikten ve `100px` yükseklikten küçük olmaz. Sürüklemeden yapılan bir tıklama, sol üst köşesi tıklanan noktada olan, `480px` genişliğinde ve `320px` yüksekliğinde bir grup ekler.  
Hiçbir grupta olmayan ve merkezi yeni kutunun içinde kalan her tablo ve gösterilen not gruba katılır. Zaten başka bir grupta olan bir tablo veya not orada kalır.

Farenin orta düğmesi tuvali yine kaydırır ve çizimi hazır bırakır. Şunlar grup eklemeden çizimi sona erdirir:

- Basmadan önce veya sürükleme sırasında `Escape` ya da `Alt + G` (Windows/Linux) veya `⌥ + G` (Mac). Basmadan önce bunlar seçimi olduğu gibi bırakır; kutuyu başlatan basış seçimi zaten temizlemiştir.
- Seçimi temizleyen bir sağ tıklama. Hiçbir bağlam menüsü açılmaz.
- `Space` tuşuyla veya tuval araç çubuğuyla el aracına geçme, araç çubuğundaki seçim aracına ya da `New Table Group` düğmesine tıklama veya bir ilişki başlatma.
- Başka bir sekmeye geçme, grupları gizleme veya düzenleyicinin salt okunur duruma geçmesi.

### Seçili tabloları gruplama {#grouping-selected-tables}

Bir veya daha fazla tablo ve onlarla birlikte istediğiniz notları seçip `T`, ardından `G` tuşuna basın ya da bir tablonun veya bir notun bağlam menüsünden `Group selected tables` öğesini veya Hızlı aramadan `Group Selected Tables` öğesini seçin. Bir notun menüsü ve Hızlı arama bu öğeyi yalnızca bir tablo seçiliyken sunar.  
Yeni grup, seçili tabloların ve notların çevresine her yanda `24px` boşluk ve üstte başlık çubuğu kalacak şekilde çizilir. Seçili her tablo ve not, bulunduğu gruptan ayrılarak yeni gruba katılır; ayrıldığı grup artık boş olsa bile yerinde kalır.

`T`, ardından `G`, değiştirici tuş olmadan yapılan iki basıştır: `T` tuşundan sonra bir saniye içinde `G`. Hiçbir tablo seçili değilken hiçbir şey yapmaz; Gezginin Bul alanı gibi bir metin alanında ise bu iki harfi yazar.

![T, ardından G ile categories ve products tablolarını gruplama, grubu Catalog olarak adlandırma, ardından menüsünden Violet ile renklendirerek iki tablo başlığının da bu rengi almasını sağlama](/img/demo-table-group-selected.webp)

Her iki yolda da yeni grubun adı ve rengi yoktur. Grup tek başına seçilir ve hemen bir ad yazabilmeniz için başlık çubuğunun üzerinde ad alanı açılır. [Grubu adlandırma](#naming-a-group) bölümüne bakın.  
Grup ve içine aldığı tablolar ile notlar tek bir geri alma adımıdır; yazdığınız ad ise ayrı bir adımdır.

## Grubu adlandırma {#naming-a-group}

Grubun adı, başlık çubuğunun üzerinde açılan bir alanda düzenlenir. Bu alan bir grup oluşturulduğunda kendiliğinden, başlık çubuğuna çift tıklandığında ve grubun bağlam menüsündeki `Rename` öğesinden açılır.  
`Enter` tuşu, başka bir yere tıklamak veya grupları gizlemek, gizleyen siz de olsanız bir ortak çalışan da olsa, adı kaydeder. `Escape` tuşu adı değiştirmeden alanı kapatır ve grubu seçili bırakır; `Escape` tuşuna ikinci kez basmak ise seçimi temizler.  
Değiştirilen bir ad tek bir geri alma adımıdır; adı değiştirmeden kaydetmek hiçbir kayıt oluşturmaz. Boş veya yalnızca boşluklardan oluşan bir ad `unnamed` olarak görünür.  
Alan açıkken, bir tablo hücresi düzenlenirken olduğu gibi tuval kısayolları devre dışı kalır, Hızlı arama ve `Toggle Explorer` kısayolları da hiçbir şey yapmaz.  
Bir ortak çalışan veya bir kodlama ajanı alan açıkken diyagramı değiştirirse, alan yeni diyagram grubu hâlâ tuttuğu ve grupları gösterdiği sürece açık kalır.  
Bu diyagram artık grubu tutmuyorsa alan kapanır ve hiçbir şey kaydetmez; grubu tutuyor ama grupları gizliyorsa alan kapanır ve değişmiş bir adı kaydeder.  
Obsidian'ın dosya dışarıdan değiştiğinde yaptığı gibi diyagramın düzenleyiciye yeniden yüklenmesi alanı kapatır ve yazılan adı atar. Bundan sonra basılan tuşlar siz düzenleyiciye tıklayana kadar hiçbir yere gitmez; bu nedenle ad için basılan bir `Delete` veya `Backspace` hiçbir şeyi kaldırmaz.

[Bul ve değiştir](./find-and-replace.md#what-it-searches), gruplar gösterilirken grup adlarında `Table group names` altında arama yapar; `Replace` ve `Replace All` düğmeleri de grupları yeniden adlandırır. [Değiştirme](./find-and-replace.md#replacing) bölümüne bakın. [Hızlı arama](./quick-search.md#searching-the-diagram) grup adlarında arama yapmaz.

## Grubu renklendirme {#coloring-a-group}

Renk seçiciyi grubun rengiyle açmak için grubun bağlam menüsünde `Color` öğesini seçin.  
Tablolarda ve notlarda olduğu gibi seçici, seçili her tabloyu, notu ve grubu renklendirir; menüdeki `Remove color` öğesi veya seçicideki `No color` seçeneği de hepsinin rengini kaldırır. [Tablo ve not rengi belirleme](./table-related-functions.md#table-and-memo-color-specification) bölümüne bakın. Bir grubun rengi, seçicinin `Document colors` bölümünde de sunulur.

Renkli bir grup, başlık çubuğunu ve dış çizgisini bu renkte, gövdesini ise rengin soluk bir tonunda çizer. Rengi olmayan bir grup temanın nötr gri tonlarını kullanır.  
Renkli bir gruptaki her tablo, başlığı boyunca grubun rengini taşır ve sol kenarında kendi rengini korur; böylece ikisi de görünür.  
Renkli bir gruptaki her not, metninin üstündeki başlık boyunca grubun rengini taşır ve üst kenarındaki şeritte kendi rengini korur; böylece ikisi de görünür.  
Böyle bir başlıktaki metin ve düğmeler beyaza, siyahın çok daha iyi okunduğu açık bir renkte ise siyaha döner; bir notun `x` düğmesi ile grubun başlık çubuğundaki ad, simge ve `x` de öyle. Seçicinin hazır renk örnekleri arasında Orange, Amber, Yellow ve Lime siyahı, geri kalanlar beyazı alır.  
Bir tablo, grubunun rengi yokken, gruplar gizliyken, tabloların yalnızca adlarına daraldığı `70%` ve altındaki yakınlaştırmada ve Görselleştirme sekmesinde kendi başlığını korur.  
Bir not, grubunun rengi yokken veya gruplar gizliyken kendi başlığını korur. Notlar asla daralmaz; bu yüzden bir not, her yakınlaştırmada grubun rengini taşır.

Bir renk değişikliği, tablolarda ve notlarda olduğu gibi [geri alma geçmişine](./undo-redo.md#one-gesture-one-step) kaydedilir.

## Grupları seçme {#selecting-groups}

Grubu tek başına seçmek için grubun başlık çubuğuna tıklayın ya da `Ctrl + click` (Windows/Linux) veya `⌘ + click` (Mac) ile seçime ekleyin.  
Zaten seçili olan bir grubun başlık çubuğuna basmak seçimin tamamını korur; böylece ardından yapılan bir sürükleme seçimin tamamını taşır.  
Başlık çubuğuna basmak veya gruba sağ tıklamak grubu diğer grupların, tablolarını ve notlarını da diğer tüm tabloların ve notların önüne getirir.

Gövde, yani başlık çubuğunun altındaki alan, farenin sol düğmesi açısından tuvaldir: Onu sürüklemek tuvali kaydırır, `Ctrl + drag` (Windows/Linux) veya `⌘ + drag` (Mac) bir seçim kutusu çizer ve bir tıklama seçimi temizler. Gövdenin üzerindeki tablolar, notlar ve ilişki çizgileri işaretçiye her zamanki gibi yanıt verir.

Seçim kutusu bir grubu yalnızca grubun kutusunu tamamen içine aldığında seçer; bu nedenle bir grubun içinde çizilen kutu, grubu almadan tabloları ve notları seçer. [Çoklu seçim](./table-related-functions.md#multiple-selection) bölümüne bakın.  
`Ctrl + A` (Windows/Linux) veya `⌘ + A` (Mac) hiçbir zaman bir grup seçmez.

Grubun bağlam menüsündeki `Select tables` öğesi seçimi, grubun kendisini dışarıda bırakarak grubun tablolarıyla ve gösterilen notlarıyla değiştirir; böylece sonraki komut yalnızca onlara ulaşır.  
Bunu, kopyalama veya [tablolara odaklanma](./table-related-functions.md#focusing-on-tables) gibi seçili bir grubu atlayan komutlardan önce kullanın.

Seçili bir grubun dış çizgisi seçim rengini alır. Bir [ortak düzenleme oturumunda](../../api/advanced/collaborative-editing.md), başka bir katılımcının seçtiği grup o katılımcının rengiyle çevrelenir.

## Gruba gitme {#going-to-a-group}

[Gezgin](./explorer.md#the-tree) grupları `Table Groups` klasöründe, adlarıyla ve her birinin tabloları ve gösterilen notları altında olacak şekilde listeler. Hızlı arama hiçbir grubu listelemez.

Gezginde bir grup satırını, bir grubun adındaki bir [Bul ve değiştir](./find-and-replace.md#going-to-a-match) eşleşmesini veya [Fark görüntüleyicinin](./table-related-functions.md#the-change-tree) listesindeki bir grup satırını seçmek o gruba gider.  
Bu, grubun kutusunu görünüme getirir; kutu tuvalden yüksekse başlık çubuğunu esas alır. [Atlamanın varış noktası](./table-related-functions.md#where-a-jump-lands) bölümüne bakın. Ardından, başlık çubuğuna basıldığında olduğu gibi grubu tek başına seçer ve tablolarıyla ve notlarıyla birlikte öne getirir.  
Gruplar [gizliyken](#hiding-groups) veya grup kaldırıldıktan sonra gruba gitmek hiçbir şey yapmaz.  
Fark görüntüleyicide her taraf gruba yalnızca kendi belgesi grubu içeriyor ve gösteriyorsa gider. [Bir değişikliğe gitme](./table-related-functions.md#going-to-a-change) bölümüne bakın.

## Grubu taşıma ve yeniden boyutlandırma {#moving-and-resizing-a-group}

Bir grubu tüm tabloları ve notlarıyla birlikte taşımak için başlık çubuğundan sürükleyin.  
Grup daha büyük bir seçimin parçasıysa seçimin tamamı onunla birlikte taşınır; hem seçili hem de grupta olan bir tablo veya not yalnızca bir kez taşınır.  
Sürükleme ancak işaretçi biraz hareket ettikten sonra başlar; bu nedenle başlık çubuğuna tıklama veya çift tıklama bir tıklama olarak kalır. Başlık çubuğunda `Alt + drag` grubu normal bir sürükleme gibi taşır; bir grup hiçbir zaman çoğaltılmaz.  
Taşıdığı her tablo ve notla birlikte taşıma tek bir geri alma adımıdır.

Bir tabloyu veya notu tek başına sürüklemek yalnızca onu taşır ve onu bir grubun içine veya dışına taşıyabilir. [Tablo ekleme ve çıkarma](#adding-and-removing-tables) bölümüne bakın.

Her grubun, bir notta olduğu gibi, seçili olsun ya da olmasın dört kenarında ve dört köşesinde yeniden boyutlandırma tutamaçları bulunur.  
Bir tutamacı farenin sol düğmesiyle sürükleyin: Kutu işaretçiyi izler ve yeni boyut, bıraktığınızda tek bir geri alma adımı olarak kaydedilir.  
Bir grup `160px` × `100px` boyutundan küçük yapılamaz; `24px` boşluklarıyla birlikte tablolarından, gösterilen notlarından ve başlık çubuğundan da küçük yapılamaz. İşaretçi ne kadar ileri giderse gitsin kenar orada durur.

## Tablo ekleme ve çıkarma {#adding-and-removing-tables}

Bir tablo veya not, onu bıraktığınız yere göre bir gruba katılır veya gruptan ayrılır.  
Tabloları veya notları sürükleyip bıraktığınızda, sürüklenen ve seçili bir grubun taşımadığı her tablo ve not merkezine göre değerlendirilir. Tablo veya not, kutusu merkezini içeren en üstteki gruba katılır ya da merkezi hiçbir grubun kutusunda değilse grubundan ayrılır. En üstteki grup, önde çizilen gruptur.  
Sürüklemenin yerinde bıraktığı bir grup, sürükleme başladığında sahip olduğu kutuyu korur; bu nedenle kendi grubu içinde biraz kaydırılan bir tablo veya not grupta kalır ve gruptan ayrılması için merkezi o kutunun dışına çıkana kadar sürüklenmesi gerekir.  
Sürükleme sırasında, bırakıldığında bir tablo veya notun gireceği her grup dış çizgiyle vurgulanır.

Son hareketten sonraki yaklaşık `200ms` içinde bıraktığınızda grup değişikliği sürüklemenin geri alma adımının parçası olur; böylece tek bir geri alma tabloları ve notları eski yerlerine ve eski gruplarına geri getirir. Bırakmadan önce daha uzun bir duraklama olursa grup değişikliği kendi başına bir adım olur. [Tek hareket, tek adım](./undo-redo.md#one-gesture-one-step) bölümüne bakın.  
Bir tıklama veya birkaç piksellik bir sürükleme hiçbir tablonun veya notun grubunu değiştirmez; gruplar gizliyken de hiçbir tablonun veya notun grubu değişmez.

Bir grubun hangi tabloları ve notları tuttuğunu değiştirmenin diğer yolları:

- Bir tablonun veya bir notun bağlam menüsündeki `Remove from group` öğesi seçili her tabloyu ve notu grubundan çıkarır. Bu öğe, gruplar gizliyken bile seçili bir tablo veya not bir gruptayken görünür ve tek bir geri alma adımıdır.
- `Group selected tables` öğesi seçili tabloları ve onlarla birlikte seçili notları yeni bir gruba taşır. [Seçili tabloları gruplama](#grouping-selected-tables) bölümüne bakın.
- Bir grubu kaldırmak tablolarını ve notlarını grupsuz bırakır.

Yapıştırılan veya `Alt` tuşuyla çoğaltılan bir tablo veya not, bir grubun kutusunun içine düşse bile hiçbir grupta olmaz. Onu daha sonra sürüklemek bırakma kuralını uygular.

![Bir notu Billing grubuna sürükleyip not başlığının grubun turkuaz rengini almasını ve kutunun notun çevresinde genişlemesini sağlama, grubu notla birlikte taşıma, ardından notu menüsündeki Remove from group ile gruptan çıkarma](/img/demo-table-group-memo.webp)

## Grubu kaldırma {#removing-a-group}

Bir grubu kaldırmak tablolarını veya notlarını asla kaldırmaz: Oldukları yerde, grupsuz olarak kalırlar.

- Başlık çubuğunun sonundaki, işaretçi grubun üzerindeyken görünen `x` yalnızca o grubu kaldırır.
- Grubun bağlam menüsündeki `Delete` öğesi grubu kaldırır. Grup birkaç seçili öğeden biri olduğunda satırda `Delete selected` yazar ve bu satır seçili her şeyi kaldırır: tabloları, notları ve grupları.
- Gruplar seçiliyken `Delete` veya `Backspace` tuşu seçili grupları, seçili tablolar ve notlarla birlikte kaldırır; `Ctrl + Backspace` ve `Ctrl + Delete` (Windows/Linux) veya `⌘ + Backspace` ve `⌘ + Delete` (Mac) de aynısını yapar. [Tablo ve not silme](./table-related-functions.md#table-and-memo-deletion) bölümüne bakın.

Her kaldırma, grubu içindeki tablolar ve notlarla birlikte geri getiren tek bir geri alma adımıdır.

## Grup menüsü {#the-group-menu}

Bir grubun menüsünü açmak için grubun başlık çubuğuna, gövdesine veya kenarına sağ tıklayın. Mac'te `Ctrl + click` de menüyü açar; dokunmatik ekranda uzun basmak da öyle.  
Sağ tıklama önce grubu seçer; grup zaten seçimin parçası değilse yalnızca onu seçer. Bu nedenle `Color` ve `Delete selected` öğeleri seçimin geri kalanına yalnızca grup seçimdeyse ulaşır.

- `Select tables`: Yalnızca grubun tablolarını ve gösterilen notlarını seçer. [Grupları seçme](#selecting-groups) bölümüne bakın.
- `Rename`: Ad alanını açar. [Grubu adlandırma](#naming-a-group) bölümüne bakın.
- `Color`: Renk seçiciyi açar. [Grubu renklendirme](#coloring-a-group) bölümüne bakın.
- `Remove color`: Seçili öğelerden birinin rengi olduğunda gösterilir.
- `Delete` veya grup birkaç seçili öğeden biri olduğunda `Delete selected`; sağda `Delete` tuşu gösterilir. [Grubu kaldırma](#removing-a-group) bölümüne bakın.

Bir tablonun veya bir notun bağlam menüsü, `Color` ve `Remove color` öğelerinden sonra ve Delete satırından önce `Group selected tables` ve `Remove from group` öğelerini ekler; tuvalin bağlam menüsü ise `New Table Group` öğesini ekler.  
`Group selected tables` öğesi sağda tuşlarını, yani `T`, ardından `G` tuşlarını gösterir; `New Table Group` öğesi ise `Alt + G` (Windows/Linux) veya `⌥ + G` (Mac) tuşlarını gösterir.

## Grupları gizleme {#hiding-groups}

Tuvalin bağlam menüsündeki `View Option` → `Table Groups` seçeneği tüm grupları gösterir veya gizler. Varsayılan olarak işaretlidir. [Tablo görünüm seçenekleri](./table-related-functions.md#table-view-options) bölümüne bakın.  
İşareti kaldırıldığında grup kutuları tuvalden, mini haritadan ve dışa aktarılan görüntülerden kaybolur; kaydırma çubukları ve mini harita da artık gruplar için yer ayırmaz. Tablolar ve notlar başlıklarındaki grup renklerini yitirir. Hiçbir şey taşınmaz veya yeniden boyutlandırılmaz ve her tablo ve not kendi grubunda kalır.  
Grupları gizlemek grupların seçimini kaldırır, bir `New Table Group` çizimini sona erdirir ve açık bir ad alanını, başka bir yere tıklamanın yaptığı gibi kapatır. [Grubu adlandırma](#naming-a-group) bölümüne bakın.

Gruplar gizliyken:

- Menülerde `New Table Group` ve `Group selected tables` öğeleri, Hızlı aramada da `New Table Group` ve `Group Selected Tables` öğeleri sunulmaz; tuval araç çubuğunda da `New Table Group` düğmesi yer almaz. `Remove from group` öğesi yine sunulur.
- `Alt + G` (Windows/Linux) veya `⌥ + G` (Mac) ile `T`, ardından `G` hiçbir şey yapmaz.
- Tabloları veya notları sürüklemek hiçbir tablonun veya notun grubunu değiştirmez ve seçim kutusu hiçbir grubu seçmez.
- Gezginde `Table Groups` klasörü yer almaz; Bul ve değiştir de `Table group names` açık olsa bile grup adlarını ne bulur ne de değiştirir.
- [Otomatik düzen](#auto-layout) her grubun tablolarını ve notlarını yine bir arada tutar, Şema SQL sekmesi [seçilebilecek grupları](#schema-sql-by-group) yine sunar, DBML grupları yine yazar ve [İçe aktar ve ekle](./file-import-export.md#import-and-add) ile eklenenler yine gizli kutuların altına yerleşir.

Bu seçim, Görünüm seçeneklerindeki diğer aç/kapat düğmeleri gibi belgeye kaydedilir ve [geri alma geçmişine](./undo-redo.md#what-the-history-records) işlenir. Salt okunur bir düzenleyicide bunun yerine o ekranda kalır. [Salt okunur düzenleyiciler](#read-only-editors) bölümüne bakın.

## Otomatik düzen {#auto-layout}

[Otomatik düzenin](./table-related-functions.md#auto-layout) her türü, gruplar gösterilsin ya da gösterilmesin her grubun tablolarını ve notlarını bir arada tutar.

- `Force`, her grubu tabloları ve notlarıyla birlikte tek bir kutu olarak taşır; her biri kutunun içindeki yerini korur. Ayrıca her grubun kutusunu diğer gruplardan ve grupsuz tablolardan en az `100px` uzakta tutar. Önizleme her grubu gideceği yerde gösterir.
- `Flow`, `Tree - vertical` ve `Tree - horizontal`, her grubun tablolarını grubun içinde, gösterilen notlarını ise yanlarına toplu olarak düzenler ve grupları aralarındaki ilişkilere göre yerleştirir; grupsuz tablolar ise grupların çevresine düzenlenir.

Ardından tablo içeren her grup tablolarına ve gösterilen notlarına uydurulur: Kutusu, `24px` boşluk ve başlık çubuğuyla birlikte onların sınırları olur. Tablosu olmayan bir grup yerini ve boyutunu korur ve içindeki notlar oldukları yerde kalır.  
Gizli bir not grubunun tablolarıyla birlikte taşınır ama yer kaplamaz.  
Tablolar, notlar ve gruplar tek bir geri alma adımı olarak yerleşir.

Bir DBML içe aktarması, tablolar nereye yerleştirilirse yerleştirilsin, her grubu aynı şekilde tablolarının çevresine uydurur. [DBML](./file-import-export.md#dbml) bölümüne bakın.

## Gruba göre Şema SQL {#schema-sql-by-group}

[Şema SQL](./schema-sql.md) sekmesi yalnızca seçilen grupların tablolarını yazabilir.  
Belge, gösterilsin ya da gizlensin, bir grup içerdiği sürece sekmenin seçenekler paneli `This window only` altında bir `Tables` satırı gösterir; bu satırda `All` için bir kutu, her grup için birer kutu ve grupsuz tablolar için bir `No group` kutusu bulunur. [Tablolar](./schema-sql.md#tables) bölümüne bakın.  
Bu seçim düzenleyici penceresine aittir ve belgeye kaydedilmez.

## İçe aktarma, dışa aktarma ve kopyalama {#import-export-and-copying}

- DBML grupları iki yönde de taşır; tablolarıyla birlikte, notlarıyla değil. DBML içe aktarması her `TableGroup` bloğunu bir gruba dönüştürür. [DBML](./file-import-export.md#dbml) bölümüne bakın. Kod oluşturucunun `DBML` hedefi ise tablo içeren her grup için bir `TableGroup` bloğu yazar. [Kod oluşturucu](./code-generator.md#language) bölümüne bakın.
- Bir JSON dosyası gruplarını, her birindeki tablolar ve notlarla birlikte korur. Başka hiçbir biçim grupları taşımaz: SQL, GraphQL ve AML içe aktarmaları hiç grup getirmez, Şema SQL ve Kod oluşturucunun diğer hedefleri de hiç grup yazmaz.
- [İçe aktar ve ekle](./file-import-export.md#import-and-add), bir dosyanın gruplarını tablolarını ve notlarını tutan yeni gruplar olarak getirir ve gruplar gösteriliyorsa bunları yeni tablolar ve gösterilen notlarla birlikte seçer; böylece eklenen bloğu sürüklemek gruplarını da beraberinde taşır.
- [Dışa aktarılan bir görüntü](./file-import-export.md#image), gösterilen grupları tabloların ve notların arkasında, grup renkleri bunların başlıklarında olacak şekilde çizer.
- Kopyalayıp yapıştırmak veya `Alt` tuşuyla çoğaltmak hiçbir zaman bir grubu kopyalamaz. [Tabloları ve notları kopyalama/yapıştırma](./table-related-functions.md#copyingpasting-tables-and-memos) ve [Tablo ekleme ve çıkarma](#adding-and-removing-tables) bölümlerine bakın.

## Salt okunur düzenleyiciler {#read-only-editors}

[`readonly`](../../api/erd-editor-element.md#readonly) bir düzenleyicide gruplar her zamanki gibi çizilir ve Gezginde listelenir; gruplara gidilebilir, ancak değiştirilemez:

- [Bir gruba gitmek](#going-to-a-group) onu seçer ve orada bir grubun seçilmesinin tek yolu budur. Başlık çubuğuna basmak hiçbir şeyi seçmez ve hiçbir şeyi taşımaz: sürüklendiğinde tuvali kaydırır ve hareketsiz bir tıklama bir atlamanın bıraktığı seçimi kaldırır.
- Yeniden boyutlandırma tutamaçları ve `x` bulunmaz ve başlık çubuğuna çift tıklamak ad alanını açmaz.
- Bir gruba veya bir nota sağ tıklamak hiçbir menü açmaz ve tablo menüsünde yalnızca `Table Properties` öğesi bulunur.
- Tuval menüsünde `New Table Group` bulunmaz ve Hızlı arama iki grup komutundan hiçbirini listelemez. Düzenleyici salt okunur duruma geçtiğinde bir `New Table Group` çizimi sona erer.
- [Tuval araç çubuğu](./table-related-functions.md#canvas-toolbar) yalnızca görünüm kontrollerini korur, bu yüzden `New Table Group` düğmesi yoktur; `Alt + G` (Windows/Linux) veya `⌥ + G` (Mac) ile `T`, ardından `G` hiçbir şey yapmaz.
- Düzenleyici salt okunur duruma geçerken süren bir tablo, not ya da grup sürüklemesi olduğu yerde durur ve hiçbir grubu değiştirmez, süren bir grup yeniden boyutlandırması ise boyutu değiştirmeden sona erer.
- `View Option` → `Table Groups`, her View Option'ın orada yaptığı gibi grupları yalnızca o ekranda gösterir veya gizler: belge, ortak çalışanlar ve geri alma geçmişi seçimi olduğu gibi korur ve düzenleyiciyi yeniden yazılabilir yapmak belgenin seçimini geri koyar.
- Şema SQL sekmesindeki `Tables` seçimi yine çalışır.
