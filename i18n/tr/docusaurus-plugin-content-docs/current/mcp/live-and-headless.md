---
sidebar_position: 3
description: MCP sunucusunun bir düzenleyicide (VS Code, Obsidian veya bir JetBrains IDE'si) canlı düzenleme ile diskteki dosyayı düzenleme arasında nasıl karar verdiği ile kaydetmenin, geri almanın ve kapanan bir düzenleyicinin her modda ne yaptığı.
---

# Canlı ve headless

Sunucu her çağrıda, düzenleyicilerin `~/.erd-editor/ide/` dizininde tuttuğu kilit dosyaları aracılığıyla belgeyi tutan bir düzenleyici arar.
ERD Editor yüklü her VS Code penceresi ve her Obsidian kasa penceresi bir tane tutar, bir JetBrains IDE'si ise IDE'nin tamamı için, içinde açık olan her projeyi listeleyen bir tane tutar.
Bir düzenleyici kapandığında kilit dosyasını kaldırır.
Düzenlemenin nereye gideceğini sunucunun bulduğu şey belirler.

| Sunucunun bulduğu | Düzenlemenin yaptığı |
| --- | --- |
| Çalışma alanı, kasası veya açık projesi belgeyi içeren ya da belgeyi açmış olan bir düzenleyici | **Canlı.** Gerekirse belgeyi ERD Editor ile açar, düzenleme oturumuna katılır ve değişikliği orada uygular. Düzenlemeler hemen görünür ve düzenleyicinin sizinkileri kaydettiği gibi kaydedilir. [Kaydetme](#saving) bölümüne bakın. |
| Düzenleyici yok | **Headless.** Dosyayı yükler, değişikliği uygular ve dosyayı yenisiyle değiştirir. `erd_save` aracının yapacağı bir şey yoktur. |
| Hub'ı kapalı bir düzenleyici | **Reddedilir.** Okumalar diskten yine de çalışır. Açık bir düzenleyici varken dosyaya yazılan bir değişikliğin üzerine düzenleyicinin bir sonraki kaydetmesiyle yazılabilir, bu yüzden sunucu hiçbir şey yazmaz. |
| Hub'ı açık olan ancak sunucununkinden farklı bir protokol kullanan bir düzenleyici: `1.0.0` sürümlü sunucuyla `3.x` sürümlü bir VS Code uzantısı, `0.x` sürümlü bir Obsidian eklentisi ya da `0.9.0` veya `0.10.0` sürümlü bir JetBrains eklentisi; `1.0.0` sürümünden önceki bir sunucuyla uzantının `4.0.0` veya sonraki bir sürümü ya da eklentinin `1.0.0` veya sonraki bir sürümü | **Reddedilir**, okumalar dahil, `protocolMismatch` koduyla. İleti güncellenmesi gereken tarafı belirtir: uzantı veya eklenti ya da sunucu. [Güncelleme](./installation.md#updating) bölümüne bakın. |
| Windows'ta, belgeyi aynı dosyaya giden başka bir yolla tutan bir düzenleyici: Ajan belgeyi bu bilgisayarın `\\localhost\C$\…` gibi bir ağ paylaşımı veya eşlenmiş sürücüsü üzerinden belirtmiştir ve düzenleyici belgeyi sürücü yoluyla tutar ya da tam tersi | **Reddedilir**, okumalar dahil, `invalidPath` koduyla. İleti, düzenleyicinin belgeyi tuttuğu yolu belirtir; o yolla yeniden çağırın. |
| Windows'ta, Windows'un ajanı uzak tuttuğu bir düzenleyici: ajan yönetici olarak başlatılmamışken yönetici olarak başlatılmış bir düzenleyici ya da ajan bir korumalı alanda çalışırken herhangi bir düzenleyici | **Reddedilir**, okumalar dahil, `hubUnreachable` koduyla ve nedenini söyleyen bir iletiyle. Düzenleyiciyi ve ajanı aynı haklarla çalıştırın, örneğin düzenleyiciyi yönetici hakları olmadan yeniden başlatarak. |

Bir düzenlemenin sonucu, çalıştığı modu `live` veya `headless` olarak belirtir, reddedilen bir düzenleme ise nedenini söyler.
Arama her çağrıda yeniden yapılır, bu yüzden bir düzenleyiciyi açmak veya kapatmak bir sonraki çağrının gideceği yeri de değiştirir.

Belgeyi birden fazla düzenleyici tuttuğunda, belgeyi açmış olan düzenleyici, belgeyi içeren bir klasöre yalnızca hizmet veren düzenleyiciye üstün gelir ve klasöre hizmet verenler arasında klasörü en derinde bulunan kazanır.
Belgeyi açmış iki düzenleyici gibi bir eşitlik durumunda, kilit dosyası en son değişen düzenleyici kazanır.
Böylece bir VS Code çalışma alanı klasörünün içindeki bir Obsidian kasasında bulunan bir belge, VS Code'un onu açmış, Obsidian'ın ise açmamış olduğu durum dışında Obsidian'a gider.

Aynı belge üzerindeki çağrılar, sunucuya ulaştıkları sırayla birer birer çalışır. Farklı belgeler üzerindeki çağrılar eş zamanlı çalışır.

## Canlı {#live}

Ajan düzenleyiciye bir ortak çalışan daha gibi katılır.
Düzenlemeleri belgenin açık olduğu her düzenleyiciye hemen ulaşır ve odağı, bir ortak çalışanınki gibi düzenlediği tablo ve hücre üzerinde gösterilir. [focusTracker](../api/advanced/collaborative-editing.md#focustracker) bölümüne bakın.

Bir okuma hiçbir zaman bir düzenleyici açmaz. Bir düzenleme, belge henüz açık değilse onu klavye odağını almadan ERD Editor ile açar.

### Kaydetme {#saving}

Her düzenleyici, ajanın düzenlemelerini sizinkileri kaydettiği şekilde kaydeder.

VS Code'da ajanın düzenlemeleri, sizinkiler gibi sekmeyi değiştirilmiş olarak işaretler ve diske yalnızca belge kaydedildiğinde ulaşır.
`erd_save` aracı, VS Code'un kendi kaydetme komutunun yaptığı gibi belgeyi VS Code üzerinden kaydeder. Bunun yerine siz `Ctrl + S` (Windows/Linux) veya `⌘ + S` (Mac) ile kaydedebilirsiniz.
Kaydedilmemiş ajan düzenlemeleri varken düzenleyiciyi kapattığınızda, kaydedilmemiş diğer her değişiklikte olduğu gibi bunların kaydedilip kaydedilmeyeceği sorulur.

Obsidian, ajanın düzenlemelerini düzenleme durduktan yaklaşık iki saniye sonra kaydeder ve sekmeyi kapatmak bunları sormadan kaydeder.
Bir JetBrains IDE'si bunları düzenleme durduktan bir saniyeden kısa bir süre sonra yazar ve sekmeyi kapatmak hâlâ bekleyenleri yazar; sekme hiçbir zaman değiştirilmiş olarak görünmez.
Her ikisinde de `erd_save` aracı bunları hemen yazar.

`erd_save` aracı önce, ajanın yaptığı her düzenleme düzenleyiciye ulaşana kadar en fazla iki saniye bekler.
Düzenleyici bunu doğrulayamadığında ya da dosyayı yazmadığında çağrı `notSaved` koduyla reddedilir: VS Code, dosya diskte değiştiğinde sekmeyi kaydedilmemiş tutar ve bir JetBrains IDE'si, örneğin bir iletişim kutusu açıkken ya da dosya yazılamadığında, dosyayı yazamamıştır.

VS Code'da ve bir JetBrains IDE'sinde, kaydedilecek bir şeyi kalmamış bir belge üzerindeki `erd_save` çağrısı başarılı olur ve dosyayı olduğu gibi bırakır.
Her düzenleme kaydedildiğinde durum budur ve bir JetBrains IDE'si kaydetmeyi kendiliğinden yapar. Sonraki her değişiklik, `Viewport` kilitliyken kaydırma veya yakınlaştırma ya da `Canvas Type` kilitliyken sekme değiştirme gibi bir [kilidin](../guide/guides/settings.md#lock) dosyanın dışında tuttuğu bir değişiklik olduğu sürece de böyle kalır. Her kilit varsayılan olarak etkindir.
Bir JetBrains IDE'sinin yazamadığı bir dosya bu durumda bile reddedilir.

Düzenleyici, ajanın son düzenlemesinden sonra belgeyi kapattığında, ajanın bir sonraki çağrısı bu düzenlemelerin ancak düzenleyici kapanmadan önce kaydedilmişlerse dosyada bulunduğunu belirten bir bilgi notu içerir.

### Geri alma {#undo}

`erd_undo` aracı ajanın yaptığı son düzenlemeyi geri alır, sizinkileri asla; `erd_redo` aracı ise onu yeniden uygular.
Düzenleyicinin kendi [Geri al](../guide/guides/undo-redo.md) komutu tam tersi çalışır: Başka bir düzenleyiciden gelen değişiklikler sizin geçmişinize kaydedilmediği için sizin düzenlemelerinizi geri alır, ajanınkileri asla.

Birkaç düzenleme düzenleyicide geri alma kaydı oluşturmaz: [ayar araçlarından](./tools.md#settings) `erd_set_database` ve `erd_set_database_name` ile `erd_resize_memo`.
Grubu, yatay ve dikey kayma toplandığında 20 pikselden az taşıyan bir `erd_move_table_group` çağrısı da kayıt oluşturmaz, ancak grup taşındığı yerde kalır.
Hiçbir şeyi değiştirmeyen bir çağrı da kayıt oluşturmaz: belgenin zaten sahip olduğu bir değeri ayarlayan `erd_set_column_primary_key`, `erd_set_column_unique`, `erd_set_column_not_null`, `erd_set_column_auto_increment`, `erd_set_index_unique` veya `erd_set_index_column_order`; dizinde zaten bulunan bir sütunla `erd_add_index_column`; zaten o grupta olan (ya da `groupId` değeri `null` iken zaten hiçbir grupta olmayan) tablolarla `erd_set_table_group`; grubun zaten durduğu noktaya `erd_move_table_group`; grubun zaten sahip olduğu dikdörtgene `erd_resize_table_group`; hiç tablosu olmayan bir belgede `erd_sort_tables`; ya da `mode` değeri `append` olan ve hiç tablo getirmeyen (`erd_import_json` için ne tablo ne de not getirmeyen) bir içe aktarma.
`erd_undo` aracı bunları atlar ve sonucunda belirtir.
`erd_change_relationship_type`, `erd_change_relationship_on_delete`, `erd_change_relationship_on_update`, `erd_change_table_group_name`, `erd_change_table_group_color` ve `erd_set_ddl_script` gibi diğer düzenlemeler, belgenin zaten sahip olduğu bir değeri ayarladıklarında bile kayıt oluşturur.

Ajanın geri alma geçmişi, sonuçta bir bilgi notuyla birlikte şu durumlarda sona erer:

- Ajan, örneğin düzenleyici onu belgeden çıkardıktan sonra, belgeye yeniden katılır.
- Düzenleyici kapanır ya da belgeyi kapatıp ona hizmet vermeyi bırakır ve ajan diskteki dosyayı düzenlemeye devam eder.
- Bir düzenleyici, ajanın diskte düzenlediği bir belgeyi devralır.

Sunucu ayrıca ajanın 30 dakika boyunca hiçbir çağrı yapmadığı bir belgeyi kapatır ve geri alma geçmişi de bilgi notu olmadan onunla birlikte gider.

### Düzenleyici kapandığında {#when-the-editor-goes-away}

Bir düzenleyici bir belgeyi tuttuğu sürece sunucu asla kendiliğinden dosyaya geçmez.
Bağlantı koparsa yeniden bağlanır.
Sunucu dosyayı yalnızca düzenleyici kapandığında ya da belgeyi kapatıp artık belgeyi de onu içeren bir klasörü de listelemediğinde düzenler ve bunu sonuçta belirtir.
Bu, düzenleyicinin hizmet verdiği tüm klasörlerin dışında kalan bir diyagramı kapattığınızda (VS Code'da çalışma alanının dışından açılmış bir diyagram), Obsidian'da ERD Editor eklentisini devre dışı bıraktığınızda ve bir JetBrains IDE'sinde belgeyi içeren projeyi kapattığınızda ya da oradaki eklentiyi devre dışı bıraktığınızda olur.
Düzenleyicinin hizmet verdiği bir klasörün içindeki kapatılmış bir diyagram düzenleyicide kalır ve ajanın bir sonraki düzenlemesi onu yeniden açar.

Hâlâ çalışan, ancak kilit dosyası ortadan kalkmış ve belgeyi kapatmadan bağlantısı kapanmış bir düzenleyici, bir sonraki düzenlemeyi `hubGone` koduyla reddeder.
İleti belgeyi neyin serbest bıraktığını söyler: VS Code'da o pencereyi yeniden yükleyin ya da ajanın dosyayı doğrudan düzenlemesi için kapatın; Obsidian'da ERD Editor eklentisini yeniden etkinleştirin ya da o pencereyi kapatın; bir JetBrains IDE'sinde eklentiyi yeniden etkinleştirin ya da IDE'den çıkın.

İki durumda okuma bunun yerine, düzenleyicide henüz kaydedilmemiş düzenlemelerin eksik olduğunu belirten bir bilgi notuyla diskteki dosyaya gider: belgeyi tutan düzenleyicinin hub'ı kapalı olduğunda ve yukarıdaki `hubGone` durumunda.
Bir düzenleyicinin hub'ına bağlanamayan bir okuma, bir düzenleme gibi `hubUnreachable` koduyla reddedilir.

## Headless {#headless}

Belgeye hizmet veren bir düzenleyici yokken her düzenleme dosyayı yükler, değişikliği uygular ve dosyayı geri yazar.
Yazma, belgenin yanındaki `.<name>.<id>.tmp` adlı geçici bir dosyaya yapılır ve bu dosya ardından belgenin yerini alır; böylece belge, aşağıda anlatılan Windows'taki yerinde yazma durumu dışında hiçbir zaman yarım yazılmış kalmaz.

Bu son adımdan önce sunucu, çağrı sırasında dosyanın diskte değişip değişmediğini denetler.
Değiştiyse hiçbir şey yazılmaz, dosya yeniden yüklenir ve çağrı `conflict` koduyla reddedilir. Ajan çağrıyı yineler.
İki çağrı arasında değişen bir dosya ise basitçe yeniden yüklenir ve ajanın o andan önceki geri alma geçmişi atılır.

Salt okunur bir dosya olduğu gibi bırakılır ve düzenleme `readonly` koduyla reddedilir: sahibi için yazma izni olmayan ya da Windows'ta salt okunur özniteliğine sahip bir dosya, örneğin kullanıma alınmamış (check out edilmemiş) bir Perforce veya TFVC dosyası.
Dosyayı yazılabilir yapın, ardından yeniden çağırın. Okumalar yine de çalışır.

Ajan belgeyi diskte düzenlerken bir düzenleyici belgeye hizmet vermeye başlarsa, o tek düzenleme `hubAppeared` koduyla reddedilir ve hiçbir şey yazılmaz. Bir sonraki çağrı düzenleyici üzerinden düzenler.

Windows'ta iki kural daha geçerlidir:

- Klasörününkinden farklı, kendine ait izinleri olan bir belge, bu izinleri koruması için yenisiyle değiştirilmek yerine yerinde yazılır ve geçici dosya ardından kaldırılır. Bu yazma sırasında belgeyi okuyan bir program ayrıştırılamayan bir metinle karşılaşabilir.
- Başka bir programın açık tuttuğu bir dosya yenisiyle değiştirilemez, bu yüzden sunucu en fazla iki saniye boyunca yeniden dener. Her deneme önce yeniden bir düzenleyici arar ve bu arada belgeye hizmet vermeye başlayan bir düzenleyici yazmayı `hubAppeared` koduyla, hub'ı kapalıysa `blocked` koduyla reddeder. Dosya iki saniye sonra hâlâ tutuluyorsa hiçbir şey yazılmaz, dosya yeniden yüklenir ve çağrı sistem hatasını aktaran bir iletiyle başarısız olur.

## Reddedilme {#refused}

Bir VS Code penceresi, hub'ı kapalıyken bile kilit dosyasını tutar: `dineug.erd-editor.agentHub.enabled` ayarı kapalıyken, çalışma alanı güvenilir değilken ya da hub'ı dinlemeye başlayamadığında.
Bir Obsidian kasa penceresi, Coding agents ayarı kapatıldığında ve hub'ı dinlemeye başlayamadığında, hub'ı kapalıyken kilit dosyasını tutar.
Bir JetBrains IDE'si, Coding agents ayarı kapatıldığında, hub'ı dinlemeye başlayamadığında ve IDE kapanırken, hub'ı kapalıyken kilit dosyasını tutar.

Böyle bir belgeye yapılan düzenleme `blocked` koduyla reddedilir, çünkü açık düzenleyici dosyaya yazılan bir değişikliğin üzerine bir sonraki kaydetmesinde yazabilir.
Okumalar diskteki dosyadan yine de çalışır.

Ajanın düzenleme yapabilmesi için hub'ı, iletinin o düzenleyici için söylediği gibi yeniden açın: VS Code'da çalışma alanına güvenin ve ayarı açın ya da pencereyi yeniden yükleyin; Obsidian'da Coding agents ayarını açın ya da Obsidian'ı yeniden yükleyin; bir JetBrains IDE'sinde Coding agents ayarını açın ya da zaten açıksa IDE'yi yeniden başlatın.

Bir JetBrains IDE'si ayrıca yalnızca güvenmediği projelerin tuttuğu bir belgeyi değiştirmeyi `hubDisabled` koduyla reddeder.
Ajanlar böyle bir belgeyi yine de okuyabilir ve `erd_list_documents` aracı onu `readonly` olarak listeler. Projeye güvenin, ardından yeniden çağırın.

Kilit dosyası tutmayan bir düzenleyici hiçbir şeyi korumaz ve ajan, diyagram o düzenleyicide açıkken bile diskteki dosyayı düzenler.
Linux'ta Flatpak olarak kurulmuş Obsidian ya da bir JetBrains IDE'si, JCEF içermeyen bir JetBrains IDE'si ve hub'ı başlayamamış bir JetBrains IDE'si için durum budur. [Obsidian'ı ayarlama](./installation.md#set-up-obsidian) ve [JetBrains IDE'sini ayarlama](./installation.md#set-up-a-jetbrains-ide) bölümlerine bakın.
`3.0.0` sürümünden önceki bir VS Code uzantısı ve `0.9.0` sürümünden önceki bir JetBrains eklentisi de hub'ları olmadığı için kilit dosyası tutmaz.

## Belgeler {#documents}

Bir belge, mutlak ya da sunucunun çalışma dizinine göreli olan `path` değeriyle belirtilir.

- Yeni belgeler `.erd.json` biçimindedir. `create` ile çağrılan `erd_open_document` aracı dosyayı oluşturur ve uzantısı olmayan bir ada `.erd.json` ekler. Düzenleyicideki yeni bir diyagramda olduğu gibi yeni belgede her [kilit](../guide/guides/settings.md#lock) etkindir, bu yüzden bir düzenleyicide kaydırmak, yakınlaştırmak, sekme değiştirmek ya da başka bir Kod oluşturucu dili, ad biçimi veya tırnak türü seçmek dosyayı asla değiştirmez. Hiçbir araç tek bir kilidi etkinleştirmez veya devre dışı bırakmaz: Bunu düzenleyicinin Ayarlar sekmesinde yaparsınız. `replace` modundaki `erd_import_json` aracı hepsini yüklediği belgenin kilitleriyle değiştirir. [İçe aktarma](./tools.md#import) bölümüne bakın.
- Mevcut `.erd`, `.vuerd` ve `.vuerd.json` dosyaları da açılır. Başka herhangi bir uzantıya sahip bir yol `invalidPath` koduyla reddedilir.
- Windows'ta, Windows'un yazıldığı gibi saklamadığı bir ad içeren bir yol, okumalar dahil, belge okunmadan veya yazılmadan önce `invalidPath` koduyla reddedilir: `orders:v2.erd` gibi iki nokta üst üste ya da Windows'un reddettiği başka bir karakter içeren bir ad; büyük ya da küçük harfle yazılmış `NUL.erd` veya `CON.erd` gibi bir aygıt adı; ya da nokta veya boşlukla biten bir ad. Dosyayı yeniden adlandırın, örneğin `:` yerine `-` kullanarak.
- Birleştirme çakışması işaretleriyle bırakılmış bir dosya gibi, düzenleyicinin okuyabileceği bir belge olmayan bir dosya `invalidDocument` koduyla reddedilir ve olduğu gibi bırakılır. Asla boş bir diyagram olarak yüklenip geri yazılmaz.

Ajan bir belgeyi yalnızca araçlar aracılığıyla değiştirir ve dosyayı asla kendisinin yazmaması yönünde talimat alır.

`erd_list_documents` aracı belgeleri `path`, `open`, `active`, `dirty` ve `readonly` alanlarıyla listeler.
Araç, bir belgede olduğu gibi seçilen ve çalışma dizinine hizmet veren düzenleyiciye sorar ve o düzenleyicide açık olan diyagramları, ardından hizmet verdiği ERD dosyalarını listeler: bir VS Code penceresinin çalışma alanı klasörlerindekileri, bir Obsidian kasasındakileri ya da bir JetBrains IDE'sinde açık olan her projedekileri.
Aksi hâlde çalışma dizininin altındaki ERD dosyalarını listeler; burada salt okunur bir dosya `readonly` olarak işaretlenir ve Windows'ta, Windows'un yazıldığı gibi saklamadığı bir ad listede yer almaz.
