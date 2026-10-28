---
sidebar_position: 1
description: Karşılama ekranından başlama ve tuvalin bağlam menüsünden, tuval araç çubuğundan veya bir kısayolla tablo, not, tablo grubu ve ilişki oluşturma.
---

# Düzenlemeye başlama

Düzenleme, sağ tıklayarak açılan bağlam menüsüyle başlar.

![Tuvale sağ tıklama, Relationship alt menüsünü açma, bir tablo ekleme, ardından tablonun kendi menüsünü açma](/img/demo-context-menu.webp)

Bir tabloya, nota, tablo grubuna veya ilişkiye sağ tıklamak bunun yerine o öğenin kendi menüsünü açar.  
Zaten seçili olan bir tabloya, nota veya tablo grubuna sağ tıklamak seçimin tamamını korur, bu yüzden `Color` ve `Delete selected` gibi satırlar seçimin tümüne uygulanır. [Çoklu seçim](./table-related-functions.md#multiple-selection) bölümüne bakın.  
Salt okunur bir düzenleyici hiçbir şey oluşturmaz, bu yüzden bu sayfanın anlattığı hiçbir şey orada sunulmaz: Tuval menüsü yalnızca `View Option`, `Name View`, `Export` ve `Diff Viewer` öğelerini, bir tablonun menüsü yalnızca `Table Properties` öğesini korur; bir not, bir tablo grubu veya bir ilişki hiçbir menü açmaz. [Salt okunur düzenleyiciler](./table-related-functions.md#read-only-editors) bölümüne bakın.

## Karşılama ekranı {#welcome-screen}

Web uygulamasında, Google Drive'da, VS Code'da, Obsidian'da ve bir JetBrains IDE'sinde boş bir diyagram, ERD tuvalinin üzerinde bir karşılama ekranıyla açılır. Kendi sayfanızdaki bir `<erd-editor>` öğesi bu ekranı yalnızca sayfa onu [`enableWelcomeScreen`](../../api/erd-editor-element.md#enablewelcomescreen) özelliğiyle açtığında gösterir.  
Bir diyagram hiçbir tablo, gösterilen hiçbir not ve gösterilen hiçbir tablo grubu içermediği sürece boş sayılır, bu yüzden Görünüm seçenekleriyle gizlenen notlar ve gruplar hesaba katılmaz. Diyagram bunlardan birini içerdiği anda ekran kaybolur ve diyagram her yeniden boşaldığında, örneğin son tabloyu sildikten veya ilk tablonun eklenmesini geri aldıktan sonra, geri gelir.  
Salt okunur bir düzenleyicide, Zen modunda, Tablo özellikleri açıkken veya Fark görüntüleyici, Otomatik düzenin önizlemesi ya da Zaman yolculuğu tuvali devralmışken gösterilmez.

![Boş bir diyagramdaki karşılama ekranı: Import öğesinin biçimlerini açma, Esc ile geri dönme, New Table ile bir tablo ekleme, ardından ⌘ + Z ile ekranı geri getirme](/img/demo-welcome-screen.webp)

`Right-click the canvas for every action.` başlığının altında bir menü bulunur:

- `New Table` öğesi, `Alt + N` tuşlarının yaptığı gibi bir tablo ekler.
- `New Memo` öğesi, `Alt + M` tuşlarının yaptığı gibi bir not ekler. Notlar gizliyken bu öğe yer almaz.
- `Import` öğesi menünün yerine `Back` öğesini ve `json`, `Schema SQL`, `GraphQL`, `DBML` ve `AML` biçimlerini getirir. Bir biçim seçildiğinde o biçimde bir dosya istenir ve bu dosya boş diyagramın yerine yüklenir. [Dosyaları içe veya dışa aktarma](./file-import-export.md) sayfasına bakın. `Back` öğesiyle veya `Escape` tuşuyla ilk menüye dönülür.
- `Command Palette` öğesi, `Ctrl + K` (Windows/Linux) veya `⌘ + K` (Mac) tuşlarının yaptığı gibi [Hızlı aramayı](./quick-search.md) açar.
- `Shortcuts` öğesi Ayarları [`Shortcuts`](./settings.md#shortcuts) sekmesinde açar.

Tuval yeterince genişse `New Table`, `New Memo` ve `Command Palette` öğeleri, bir ana uygulamanın yeniden atadığı tuş da dahil olmak üzere, komutlarına o anda bağlı olan tuşu gösterir.  
Bir satır klavye odağını aldığında `↑` ve `↓` tuşları satırlar arasında döngüsel olarak gezinir, `Home` ve `End` tuşları ilk ve son satıra atlar, `Enter` veya `Space` tuşu da odaktaki satıra basar. Diğer tüm kısayollar yine çalışır, bu yüzden `Alt + N` tuşları oradan da bir tablo ekler.  
Tıklamaları yalnızca menü alır: Ekranın başka herhangi bir yerindeki bir basış tuvale ulaşır ve tuvale sağ tıklamak her zamanki gibi bağlam menüsünü açar.

Tuvalde yer olduğunda elle çizilmiş oklar şunları işaret eder:

- araç çubuğundaki `Search` düğmesi: `Search commands and tables`
- `Theme` ve `Display Language` düğmeleri: `Pick a theme and a language`, araç çubuğu bunlardan yalnızca birini gösterdiğinde ise `Pick a theme` veya `Pick a language`. [Dil ve tema](./language-and-theme.md) sayfasına bakın.
- alttaki [tuval araç çubuğu](./table-related-functions.md#canvas-toolbar): `Pan, zoom and draw relationships`

[Gezgin](./explorer.md) gösterilirken karşılama ekranı yalnızca onun yanındaki tuvali kaplar.  
Araç çubuğu düğmesi Gezginin üzerinde duran bir ok yer almaz. `Theme` ve `Display Language` oku yalnızca iki düğmesi de Gezginin üzerinde durduğunda yer almaz; o zamana kadar hâlâ tuvalin üzerinde duran düğmeyi işaret eder.  
Okunun yanında yer bulamayan bir etiket bunun yerine okun altında asılı durur.

## Tablo oluşturma {#table-creation}

Bağlam menüsünden, [tuval araç çubuğundaki](./table-related-functions.md#canvas-toolbar) `New Table` düğmesiyle veya `Alt + N` kısayoluyla bir tablo oluşturun.

## Not oluşturma {#memo-creation}

Bağlam menüsünden, tuval araç çubuğundaki `New Memo` düğmesiyle veya `Alt + M` kısayoluyla bir not oluşturun.  
View Option → `Memos` kapalıyken notlar gizlidir, `New Memo` öğesi hiçbir yerde sunulmaz ve `Alt + M` tuşları hiç not eklemez. [Tablo görünüm seçenekleri](./table-related-functions.md#table-view-options) bölümüne bakın.

Not, tuval üzerindeki serbest metinli bir yazıdır. Gövdesine tıklayın ve yazın; metin belgeyle birlikte kaydedilir.  
`Escape` tuşu, yazdıklarınızı koruyup notu seçili bırakarak not düzenleyicisini kapatır, `Escape` tuşuna ikinci kez basmak ise seçimi temizler.  
Yeniden boyutlandırmak için notun kenarlığını sürükleyin. İşaretçi notun üzerindeyken başlığında gösterilen `x` notu siler.  
Bir nota sağ tıklamak not düzenleyicisini değil notun menüsünü açar: `Color`, seçili bir öğenin rengi olduğu sürece `Remove color` ve `Delete`; not seçili iki ya da daha fazla öğeden biri olduğu sürece bu satırda `Delete selected` yazar. Seçili bir not, tabloları silen tuşlarla da silinir. [Tablo ve not silme](./table-related-functions.md#table-and-memo-deletion) bölümüne bakın.

![Alt + M ile not ekleme, bir metin yazma ve notu yeniden boyutlandırmak için kenarlığını sürükleme](/img/demo-memo.webp)

## Tablo grubu oluşturma {#table-group-creation}

Tablo grubu, tabloları tutan ve ad ile renk verebileceğiniz bir kutudur. İki yoldan biriyle bir grup oluşturun:

- Bağlam menüsünden veya Hızlı aramadan `New Table Group` öğesini seçin, [tuval araç çubuğundaki](./table-related-functions.md#canvas-toolbar) `New Table Group` düğmesine tıklayın ya da `Alt + G` (Windows/Linux) veya `⌥ + G` (Mac) tuşlarına basın, ardından tuval üzerinde bir kutu sürükleyin. Merkezi kutunun içinde kalan her tablo, zaten başka bir grupta değilse yeni gruba katılır. [Grup çizme](./table-groups.md#drawing-a-group) bölümüne bakın.
- Tabloları seçin ve bir tablonun bağlam menüsünden `Group selected tables` öğesini ya da Hızlı aramadan `Group Selected Tables` öğesini seçin veya `T`, ardından `G` tuşuna basın. [Seçili tabloları gruplama](./table-groups.md#grouping-selected-tables) bölümüne bakın.

Adlandırma, renklendirme, taşıma, yeniden boyutlandırma ve geri kalan her şey [Tablo grupları](./table-groups.md) sayfasında anlatılır.

## İlişki oluşturma {#relationship-creation}

Bağlam menüsünden, tuvalin altındaki [tuval araç çubuğundan](./table-related-functions.md#canvas-toolbar) veya bir kısayolla bir ilişki başlatın. Her ilişki türünün kendi kısayolu vardır:

- Zero One: `Ctrl + Alt + 1` (Windows/Linux) veya `⌘ + ⌥ + 1` (Mac)
- Zero N: `Ctrl + Alt + 2` (Windows/Linux) veya `⌘ + ⌥ + 2` (Mac)
- One Only: `Ctrl + Alt + 3` (Windows/Linux) veya `⌘ + ⌥ + 3` (Mac)
- One N: `Ctrl + Alt + 4` (Windows/Linux) veya `⌘ + ⌥ + 4` (Mac)

Bir tür hazırlandığında imleç değişir. Önce üst tabloya, ardından alt tabloya tıklayın.  
Üst tablo, birincil anahtarı yoksa bir birincil anahtar alır ve üst tablonun her birincil anahtar sütunu için alt tablo, aynı veri türüne, varsayılan değere, açıklamaya, [mantıksal ada](./logical-names.md) ve [değer alanına](./dictionary.md#domains-and-data-types) sahip `Not Null` bir yabancı anahtar sütunu alır.  
İstisna serial anahtardır: Yabancı anahtarı, `serial4` için `integer` gibi, serial türünün sakladığı tamsayı türünü alır ve bu durumda hiçbir değer alanı bağlamaz. [Tanımlayıcı ilişkiler](./relationship-editing.md#identifying-relationships) bölümüne bakın.  
Her yabancı anahtar sütunu kendi anahtarına göre adlandırılır: `id` gibi tek sözcüklü bir adın önüne üst tablonun adı eklenir (`user_id`), `member_id` gibi birkaç sözcükten oluşan bir ad korunur ve alt tablonun zaten sahip olduğu bir ad numaralandırılır (`user_id_2`). [Yabancı anahtar sütun adları](./relationship-editing.md#foreign-key-column-names) bölümüne bakın.  
Bir tabloya iki kez tıklamak kendine başvuran bir ilişki çizer.  
Yeni bir ilişki, `On Delete` ve `On Update` ayarlarının ikisi de `Not set` olacak şekilde başlar; bunları ilişkinin bağlam menüsünden değiştirin. [ON DELETE ve ON UPDATE](./relationship-editing.md#on-delete-and-on-update) bölümüne bakın.  
İptal etmek için `Escape` tuşuna ya da aynı kısayola yeniden basın. İptal etmek seçimi olduğu gibi bırakır ve `Escape` tuşuna bir kez daha basmak seçimi temizler.

Üst tablo seçildikten sonra, ilişkinin bitebileceği bir tablonun üzerine gelmek o tabloyu bir dış çizgiyle çevreler ve yanında iki düğme gösterir:

- `Create new columns` (`+`) düğmesi, tabloya tıklamanın yaptığı gibi ilişkiyi yeni yabancı anahtar sütunlarıyla çizer.
- `Map to existing columns` (bir bağlantı simgesi) düğmesi çizimi bitirir ve iki tablo için [Sütunları eşle](./relationship-editing.md#map-columns) iletişim kutusunu açar, böylece ilişki alt tablonun zaten sahip olduğu sütunları kullanabilir. `Map` düğmesine basana kadar hiçbir şey yazılmaz.

İşaretçi, üst tabloya tıkladığınız yerden biraz uzaklaştıktan sonra üst tablo da bu düğmeleri gösterir, böylece kendine başvuran bir ilişki de mevcut sütunlarla eşlenebilir.  
Parmakla üzerine gelinemez, bu yüzden parmakla çizdiğinizde düğmeler hiçbir zaman görünmez ve alt tabloya dokunmak ilişkiyi hemen çizer; kalem ise düğmeleri farenin yaptığı gibi gösterir.  
Alt tabloya ulaştığınızda üst tablo, örneğin bir geri alma veya bir ortak çalışanın düzenlemesi nedeniyle birincil anahtarını kaybetmişse, `Create new columns` düğmesi `<parent> has no primary key to copy` araç ipucuyla soluk görünür ve alt tabloya tıklamak hiçbir şey çizmeden çizimi bitirir.  
Araç ipucu, üst tabloyu [Ad görünümünün](./logical-names.md#beyond-the-canvas) adlandırdığı gibi adlandırır.

![⌘ + ⌥ + 4 ile bir One N ilişkisi, ardından tuval araç çubuğundan bir Zero N ilişkisi çizme, Map to existing columns ve Create new columns düğmeleriyle birlikte dış çizgiyle çevrelenen alt tablo](/img/demo-relationship.webp)

## Tabloları ve notları çoğaltma {#duplicating-tables-and-memos}

Mevcut tablolar ve notlar kopyalanabilir, yapıştırılabilir ve `Alt` tuşuyla sürüklenerek çoğaltılabilir. [Tabloyla ilgili işlevler](./table-related-functions.md#copyingpasting-tables-and-memos) sayfasına bakın.
