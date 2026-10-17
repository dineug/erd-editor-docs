---
sidebar_position: 4
description: erd-editor MCP sunucusunun sunduğu tüm araçlar – belgeyi sayfa sayfa okuma, 54 düzenleme aracı, erd_batch ve bir sonuçla bir reddin neye benzediği.
---

# Araçlar

Sunucu 63 araç sunar: beş oturum aracı, üç okuma aracı, her düzenleme işlemi için bir tane olmak üzere 54 düzenleme aracı ve birkaç düzenleme aracını tek bir düzenleme olarak çalıştıran `erd_batch`.

`erd_list_documents` dışındaki her araç ilk argüman olarak belgenin `path` değerini alır ve aşağıdaki tablolarda bu argüman yer almaz.
`?` ile işaretlenen bir argüman isteğe bağlıdır.

## Oturum araçları {#session-tools}

| Araç | Argümanlar | Ne yapar |
| --- | --- | --- |
| `erd_list_documents` | | ERD belgelerini `path`, `open`, `active`, `dirty` ve `readonly` alanlarıyla listeler: çalışma dizinine hizmet veren düzenleyicinin belgelerini (bir JetBrains IDE'sinde bunlar açık olan her projeyi kapsar), aksi hâlde çalışma dizini altındaki ERD dosyalarını. |
| `erd_open_document` | `create?` | Bir belgeyi düzenlemek üzere açar. Belgeye hizmet veren bir düzenleyici varsa belge, o düzenleyicideki ERD Editor ile açılır. `create` ile, dosya yoksa önce dosyayı oluşturur ve uzantısız bir ada `.erd.json` uzantısı eklenir. |
| `erd_save` | | Bir düzenleyicinin tuttuğu belgeyi kaydeder. VS Code, ajanın düzenlemelerini bu araç çağrılana kadar kaydedilmemiş tutar; Obsidian ve bir JetBrains IDE'si bunları sizinkileri kaydettikleri gibi kaydeder, bu araç ise onları hemen yazar. Headless modda her düzenleme zaten yazılmıştır ve bu araç hiçbir şey yapmaz. |
| `erd_undo` | | Bu ajanın yaptığı son düzenlemeyi geri alır, sizinkileri asla. Geri alma kaydı oluşturmayan çağrılar atlanır ve adları bildirilir. |
| `erd_redo` | | `erd_undo` aracının en son geri aldığı düzenlemeyi yeniden uygular. |

Kaydetmenin ve geri almanın her modda ne yaptığı için [Canlı ve headless](./live-and-headless.md) sayfasına bakın.

## Belge okuma {#reading-a-document}

| Araç | Argümanlar | Ne yapar |
| --- | --- | --- |
| `erd_list` | `query?`, `offset?`, `limit?`, `namesOnly?` | Ayarlar ve sayılar, ardından dizinleri ve ilişkileriyle birlikte bir sayfa tablo; her tablo için kimliği, tuval üzerindeki konumu ve boyutu, sütun sayısı ve bir tablo grubundaysa tablo grubu. Arama yapmıyorsa tablolardan sonra tablo grupları, ardından notlar gelir. |
| `erd_get` | `tableIds?`, `tableNames?`, `relationshipIds?`, `indexIds?`, `memoIds?`, `tableGroupIds?` | Belirtilen varlıklar, eksiksiz olarak: sütunları ve tablo gruplarıyla tablolar, sütunları ile `onDelete` ve `onUpdate` değerleriyle ilişkiler, sütunlarıyla dizinler, metinleriyle notlar, tablolarıyla tablo grupları. |
| `erd_read` | `format`, `vendor?`, `statements?`, `header?`, `tableIds?`, `tableNames?`, `groupNames?` | Dört biçimden birinde belgenin tamamı tek seferde ya da yalnızca bazı tabloların veya tablo gruplarının DDL'i. |

Bir ajan kimlikleri `erd_list` ile bulur, sütunları ve diğer ayrıntıları `erd_get` ile okur ve bu kimlikleri düzenleme araçlarına aktarır.
Bir tablonun `erd_list` içindeki boyutu, tuval üzerinde kapladığı kutudur: Yükseklik kesin, genişlik yaklaşıktır.
Bir tablo grubu, sakladığı dikdörtgenle, adıyla, rengiyle ve kaç tablo içerdiğiyle listelenir.
Her ilişki, iki tablosundan biriyle birlikte bir kez listelenir.
`erd_list` ve `erd_read` araçlarının bildirdiği ayarlar, dosyanın kaydettiği ayarlardır. [Ayarlar](#settings) bölümüne bakın.

`erd_read` dört biçimden birini alır:

| `format` | Verdiği yanıt |
| --- | --- |
| `snapshot` | Tablo grupları dahil her varlığı kimliğiyle ve ayarları Şema SQL betikleriyle birlikte içeren kompakt JSON. Bir görüntüleyenden diğerine değişen şeyleri içermez: ölçülen genişlikler, katman sırası, görünüm ve sekme. Büyük bir şemada boyutu büyüktür. |
| `sql` | Sekiz veritabanından biri için DDL: `Databricks`, `MariaDB`, `MSSQL`, `MySQL`, `Oracle`, `PostgreSQL`, `Snowflake` veya `SQLite`. `vendor` verilmezse varsayılan olarak belgede ayarlı veritabanı kullanılır. Belgenin tamamının DDL'i, tablolardan önceki ve sonraki betikleri içerir. `tableIds`, `tableNames` veya `groupNames` ile yalnızca bu tablolar, tuttukları yabancı anahtarlarla birlikte ve betikler olmadan. Yabancı anahtarlar ON DELETE ve ON UPDATE eylemlerini taşır, hedef veritabanının dışarıda bıraktıkları hariç. [ON DELETE ve ON UPDATE](../guide/guides/relationship-editing.md#on-delete-and-on-update) bölümüne bakın. |
| `json` | Belgenin tamamı, tam olarak bir kaydetme işleminin dosyaya yazdığı biçimde, düzenleyicinin henüz kaydetmediği düzenlemeler dahil. [Depolama biçimi ve çalışma zamanı değeri](../api/advanced/schema.md#storage-form-and-runtime-value) bölümüne bakın. |
| `scripts` | Şemanın boyutu ne olursa olsun yalnızca belgenin tablolardan önceki ve sonraki betikleri, `{"before":"…","after":"…"}` biçiminde. Ayarlanmamış betik boş gelir. |

`vendor`, `statements`, `header`, `tableIds`, `tableNames` ve `groupNames` argümanlarını yalnızca `sql` biçimi alır, başka bir biçim bunları reddeder.

- `statements`: varsayılan olan `create`; MySQL, MariaDB, PostgreSQL, SQLite ve Databricks'te `CREATE TABLE IF NOT EXISTS`, diğerlerinde düz `CREATE TABLE` yazan `ifNotExists`; ya da tabloları oluşturmadan önce silen `recreate` (Snowflake bunun yerine `CREATE OR REPLACE TABLE` yazar).
- `header`: varsayılan olan `none`; belgenin veritabanı adının belirttiği veritabanını veya şemayı seçen `use`; ya da bunu önce oluşturan `createAndUse`. Oracle'da yalnızca `use` vardır, bu yüzden orada `createAndUse` da `use` yazar ve PostgreSQL'de yalnızca `createAndUse` vardır, bu yüzden orada `use` hiçbir başlık yazmaz. SQLite hiç başlık yazmaz ve veritabanı adı boşken ya da düz bir tanımlayıcı değilken hiçbir veritabanı başlık yazmaz.
- `groupNames`: Adları büyük ya da küçük harfle verilen tablo gruplarının tabloları, `tableIds` ve `tableNames` ile birleştirilir. Hiçbir grupla eşleşmeyen bir ad `notFound` koduyla reddedilir. Tablo içermeyen bir grup hiç tablo eklemez ve hiç tablo kalmayan bir okuma, adı verilen her grubun boş olduğu ve hiçbir tablonun adının verilmediği durumda olduğu gibi, `invalidArgs` koduyla reddedilir.

`statements` ve `header`, bazı tabloların DDL'ine de uygulanır. Düzenleyicinin [Şema SQL](../guide/guides/schema-sql.md#options-panel) sekmesindeki `Statements` ve `Header` seçenekleri gibi çalışırlar, ancak sekme `If not exists` ve `CREATE + USE` değerleriyle başlar.
Adlar dosyanın kaydettiği tırnak türüyle, `Bracket Type` kilitliyken de kilitli tırnak türüyle tırnak içine alınır. [Kilit](../guide/guides/settings.md#lock) bölümüne bakın.

### Büyük şemalar {#large-schemas}

Yüzlerce ya da binlerce tablodan oluşan şemalar da desteklenir.
Bir okumanın yanıtı en fazla 40.000 karakterdir; bu, Claude Code'un bir araç sonucunu ayrı bir dosyaya aktardığı sınırın altındadır.

- `erd_list` varsayılan olarak 100 öğelik bir sayfa döndürür (önce tablolar, ardından tablo grupları, ardından notlar) ve sonraki sayfanın nerede başladığını `nextOffset` ve bir `note` bilgi notuyla bildirir. Bu `nextOffset` değerini aynı `query` ile birlikte `offset` olarak verin.
- `query`, tabloları tablo veya sütun adındaki ya da açıklamasındaki sözcüklere göre, büyük/küçük harf ayrımı yapmadan bulur. Adı bu sözcüklerden daha fazlasını içeren tablolar önce gelir. Bir arama, tablo gruplarını veya notları listelemez.
- `namesOnly` yalnızca tablo adlarını listeler, tek bir yanıta yaklaşık 2.000 kısa ad sığar.
- `erd_get` ve `erd_read`, kimliklerin yanı sıra `tableNames` argümanını da alır, `erd_read` ise `groupNames` argümanını da alır, böylece büyük bir şema üzerinde kendisinden SQL sorgusu istenen bir ajan yalnızca ihtiyaç duyduğu tabloların DDL'ini okur.
- `erd_get`, hiçbir şeye karşılık gelmeyen kimlikleri ve adları `missing` altında, tek bir yanıta sığmayan kimlikleri ise yeniden istenmek üzere `notReturned` altında listeler.
- Tek bir yanıta sığmayacak kadar büyük bir okuma, nasıl daraltılacağı belirtilerek `tooLarge` koduyla reddedilir.

## Düzenleme araçları {#edit-tools}

Kimlikler `erd_list` ve `erd_get` araçlarından ya da varlığı oluşturan çağrının `createdIds` alanından gelir.
Yeni bir kimlik, `03h17be2plxpj5n59tqag7ogj` gibi 25 küçük harf ve rakamdan oluşur; belgede zaten bulunan bir kimlik ise biçimini korur, bu nedenle bir kimliğin biçiminden hiçbir anlam çıkarmayın.
`x` ve `y`, tuval üzerindeki sol ve üst kenarlardır (piksel cinsinden); renk ise `#3b82f6` gibi bir CSS onaltılık renk kodu ya da rengi kaldıran boş bir dizedir.

### Tablolar {#tables}

| Araç | Argümanlar | Ne yapar |
| --- | --- | --- |
| `erd_add_table` | | Serbest bir konuma boş bir tablo ekler ve kimliğini `createdIds` içinde döndürür. |
| `erd_remove_table` | `tableId` | Bir tabloyu sütunları, dizinleri ve ona bağlı her ilişkiyle birlikte kaldırır. |
| `erd_change_table_name` | `tableId`, `value` | Bir tabloyu yeniden adlandırır. |
| `erd_change_table_comment` | `tableId`, `value` | Bir tablonun açıklamasını ayarlar. Boş bir dize açıklamayı temizler. |
| `erd_change_table_color` | `tableId`, `color` | Bir tablonun rengini ayarlar. |
| `erd_move_table` | `tableId`, `x`, `y` | Bir tabloyu tuval üzerinde bir konuma taşır. |
| `erd_move_tables` | `positions` | Birkaç tabloyu, tek bir `erd_undo` çağrısının geri aldığı tek bir düzenlemede taşır. `positions`, her tablo için bir `{ tableId, x, y }` içerir ve her tablo en fazla bir kez yer alır. |
| `erd_sort_tables` | | `erd_import_sql`, `erd_import_graphql`, `erd_import_dbml` ve `erd_import_aml` araçlarının yerleştirdiği gibi, tüm tabloları en az sütunlu olan önce gelecek şekilde tuval boyunca satırlara yerleştirir. Bir tablo grubunun tabloları bir arada kalır ve her grubun kutusu bunların çevresine oturtulur. |

### Sütunlar {#columns}

| Araç | Argümanlar | Ne yapar |
| --- | --- | --- |
| `erd_add_column` | `tableId` | Bir tabloya boş bir sütun ekler ve kimliğini `createdIds` içinde döndürür. |
| `erd_remove_columns` | `tableId`, `columnIds` | Tek bir tablodan sütunları, onları kullanan ilişkiler ve dizin girdileriyle birlikte kaldırır. |
| `erd_change_column_name` | `tableId`, `columnId`, `value` | Bir sütunu yeniden adlandırır. |
| `erd_change_column_data_type` | `tableId`, `columnId`, `value` | `INT` veya `VARCHAR(255)` gibi veri türünü ayarlar. [İlişkilerde veri türü eşitleme](../guide/guides/settings.md#relationship-datatype-sync) açıkken değişiklik, düzenleyicide olduğu gibi ilişkileri her iki yönde izler: Bir serial türü, `erd_add_relationship` aracının kopyaladığı gibi, sakladığı tamsayı türü olarak yabancı anahtarlara ulaşır; bir serial anahtar ise yabancı anahtarlarından biri değiştiğinde türünü korur ve değişiklik orada durur. Eşitlemeyi açmak veya kapatmak kullanıcıya kalmıştır ve `erd_list` bunu `relationshipDataTypeSync` olarak bildirir. |
| `erd_change_column_default` | `tableId`, `columnId`, `value` | Varsayılan değeri SQL metni olarak ayarlar. Boş bir dize varsayılan değeri temizler. |
| `erd_change_column_comment` | `tableId`, `columnId`, `value` | Açıklamayı ayarlar. Boş bir dize açıklamayı temizler. |
| `erd_set_column_primary_key` | `tableId`, `columnId`, `value` | `true` sütunu birincil anahtarın parçası yapar, `false` onu birincil anahtardan çıkarır. |
| `erd_set_column_unique` | `tableId`, `columnId`, `value` | Sütunun benzersiz olup olmadığını ayarlar. |
| `erd_set_column_not_null` | `tableId`, `columnId`, `value` | Sütunun `NOT NULL` olup olmadığını ayarlar. |
| `erd_set_column_auto_increment` | `tableId`, `columnId`, `value` | Sütunun otomatik artırmalı olup olmadığını ayarlar. |
| `erd_move_column` | `tableId`, `columnId`, `targetColumnId` | Bir sütunu kendi tablosu içinde başka bir sütunun konumuna taşır. |

### İlişkiler {#relationships}

`relationshipType`, alt tablo ucundaki kardinalitedir: `ZeroOne`, `ZeroN`, `OneOnly` veya `OneN`.
Başlangıç tablosu üst tablodur, yani birincil anahtarı tutan başvurulan taraftır; bitiş tablosu ise alt tablodur.
`onDelete` ve `onUpdate`, yabancı anahtarın ON DELETE ve ON UPDATE eylemleridir: `none`, `noAction`, `cascade`, `setNull`, `setDefault` veya `restrict`.
`none` hiçbir yan tümce yazmaz, bu nedenle veritabanının varsayılanı geçerli olur. [ON DELETE ve ON UPDATE](../guide/guides/relationship-editing.md#on-delete-and-on-update) bölümüne bakın.
`erd_add_relationship` veya `erd_link_columns` çağrısında verilmeyen bir eylem `none` olur.

| Araç | Argümanlar | Ne yapar |
| --- | --- | --- |
| `erd_add_relationship` | `startTableId`, `endTableId`, `relationshipType`, `onDelete?`, `onUpdate?` | İki tabloyu ilişkilendirir. Üst tablonun birincil anahtarını alt tabloya yabancı anahtar sütunları olarak kopyalar; üst tablonun birincil anahtarı yoksa önce bir birincil anahtar sütunu oluşturur. Her yabancı anahtar sütunu, düzenleyicide ilişki çizmenin adlandırdığı şekilde adlandırılır: `users` tablosunun `id` anahtarından `users_id` oluşur, `member_id` gibi bir anahtar ise adını korur. [Yabancı anahtar sütun adları](../guide/guides/relationship-editing.md#foreign-key-column-names) bölümüne bakın. Her biri kendi anahtarının veri türünü kopyalar; ancak bir serial anahtar, `serial4` için `integer` gibi sakladığı tamsayı türünü verir ve yalın bir `serial`, PostgreSQL, MySQL ve MariaDB dışında `serial` olarak kalır. [Tanımlayıcı ilişkiler](../guide/guides/relationship-editing.md#identifying-relationships) bölümüne bakın. `createdIds`, oluşturulduysa yeni anahtar sütununu, yabancı anahtar sütunlarını ve en sonda ilişki kimliğini içerir. |
| `erd_link_columns` | `startTableId`, `startColumnIds`, `endTableId`, `endColumnIds`, `relationshipType`, `onDelete?`, `onUpdate?` | Zaten var olan sütunlar arasında, başlangıç ve bitiş sütunlarını konumlarına göre eşleştirerek bir ilişki çizer. Hiçbir sütunu yeniden adlandırmaz ve hiçbir veri türünü değiştirmez. |
| `erd_remove_relationship` | `relationshipId` | Bir ilişki çizgisini kaldırır. Yabancı anahtar sütunları tabloda kalır. |
| `erd_change_relationship_type` | `relationshipId`, `relationshipType` | Bir ilişkinin kardinalitesini değiştirir. |
| `erd_change_relationship_on_delete` | `relationshipId`, `onDelete` | Bir ilişkinin ON DELETE eylemini ayarlar: üst tablodaki bir satırın silinmesinin, ona bağlı alt tablo satırlarına ne yaptığı. |
| `erd_change_relationship_on_update` | `relationshipId`, `onUpdate` | Bir ilişkinin ON UPDATE eylemini ayarlar: üst tablodaki bir anahtarın değişmesinin, ona bağlı alt tablo satırlarına ne yaptığı. |

`erd_add_relationship` yabancı anahtar sütunlarını çalıştığı anda adlandırır, bu nedenle önce üst tabloyu ve birincil anahtarını adlandırın.

Hiçbir araç, var olan bir ilişkinin sütunlarını düzenleyicinin [Sütunları eşle](../guide/guides/relationship-editing.md#map-columns) iletişim kutusunun yaptığı gibi değiştirmez.
Bir ilişkiyi başka sütunlara eşlemek için, yabancı anahtar sütunlarını tabloda bırakan `erd_remove_relationship` aracını ve istenen sütunlarla `erd_link_columns` aracını, tek bir `erd_undo` çağrısının geri aldığı tek bir `erd_batch` içinde çalıştırın.

### Dizinler {#indexes}

Bir dizin sütunu kimliği, tablo sütununun kimliği değil, `erd_get` aracının verdiği, dizinin sütun listesindeki bir girdinin kimliğidir.

| Araç | Argümanlar | Ne yapar |
| --- | --- | --- |
| `erd_add_index` | `tableId` | Bir tabloya boş bir dizin ekler ve kimliğini `createdIds` içinde döndürür. |
| `erd_remove_index` | `indexId` | Bir dizini kaldırır. |
| `erd_change_index_name` | `indexId`, `value` | Bir dizini yeniden adlandırır. |
| `erd_set_index_unique` | `indexId`, `value` | Dizinin benzersiz olup olmadığını ayarlar. |
| `erd_add_index_column` | `indexId`, `columnId` | Dizinin tablosundan bir sütun ekler ve yeni dizin sütunu kimliğini döndürür. Dizinde zaten bulunan bir sütun olduğu gibi bırakılır. |
| `erd_remove_index_column` | `indexId`, `indexColumnId` | Bir dizinden tek bir sütunu kaldırır. |
| `erd_move_index_column` | `indexId`, `indexColumnId`, `targetIndexColumnId` | Bir sütunu dizin içinde, dizinin başka bir sütununun konumuna taşır. |
| `erd_set_index_column_order` | `indexId`, `indexColumnId`, `orderType` | Bir dizindeki tek bir sütunun sıralama düzenini ayarlar: `ASC` veya `DESC`. |

### Notlar {#memos}

| Araç | Argümanlar | Ne yapar |
| --- | --- | --- |
| `erd_add_memo` | | Serbest bir konuma boş bir not ekler ve kimliğini `createdIds` içinde döndürür. |
| `erd_remove_memo` | `memoId` | Bir notu kaldırır. |
| `erd_change_memo_value` | `memoId`, `value` | Bir notun metnini yenisiyle değiştirir. |
| `erd_change_memo_color` | `memoId`, `color` | Bir notun rengini ayarlar. |
| `erd_move_memo` | `memoId`, `x`, `y` | Bir notu tuval üzerinde bir konuma taşır. |
| `erd_resize_memo` | `memoId`, `width`, `height` | Bir notu yeniden boyutlandırır. Genişlik en az yaklaşık `116` piksel, yükseklik en az `100` olmalıdır. Düzenleyici bir notun yeniden boyutlandırılmasını yalnızca sürüklemeyle yapıldığında kaydettiği için bu araç geri alma kaydı oluşturmaz. |

Notlar [View Option](../guide/guides/table-related-functions.md#table-view-options) → `Memos` ile gizliyken `erd_add_memo` yine de bir not ekler ve bu not, notlar yeniden gösterilene kadar gizli kalır.
`erd_list` ve `erd_get` gizli notları da listeler.

### Tablo grupları {#table-groups}

Tablo grubu, tablolarının arkasına çizilen adlandırılmış bir kutudur ve rengi hem kutuda hem de tablolarının başlıkları boyunca görünür. [Tablo grupları](../guide/guides/table-groups.md) sayfasına bakın.
Bir tablo en fazla bir grupta bulunur. `erd_move_table`, `erd_move_tables` ve `erd_move_table_group`, bir tabloyu nereye yerleştirirlerse yerleştirsinler bir grubun hangi tabloları içerdiğini asla değiştirmez; düzenleyicide ise bir tablo bırakıldığı yere göre bir gruba katılır ya da gruptan ayrılır. [Tablo ekleme ve çıkarma](../guide/guides/table-groups.md#adding-and-removing-tables) bölümüne bakın. `erd_add_table_group` ve `erd_set_table_group` tabloları bir gruba koyar, `erd_remove_table_group` ise grubun tablolarını grupsuz bırakır.
Bir grup, başlık çubuğu dahil en az `160` piksel genişliğinde ve `100` yüksekliğinde bir dikdörtgen saklar ve düzenleyici kutuyu, tablolarının her birini içine alacak şekilde büyüterek çizer.

| Araç | Argümanlar | Ne yapar |
| --- | --- | --- |
| `erd_add_table_group` | `name`, `color?`, `x?`, `y?`, `width?`, `height?`, `tableIds?` | Bir grup ekler ve kimliğini `createdIds` içinde döndürür. Ya `tableIds` ya da `x`, `y`, `width` ve `height` değerlerinin birlikte verildiği bir dikdörtgen verin. `tableIds` ile her tablo bulunduğu gruptan ayrılır ve dikdörtgen, [seçili tabloları gruplamanın](../guide/guides/table-groups.md#grouping-selected-tables) yaptığı gibi tabloların çevresine oturtulur. Bir dikdörtgen, [grup çizmenin](../guide/guides/table-groups.md#drawing-a-group) yaptığı gibi, merkezi kendi içinde kalan ve hiçbir grupta olmayan her tabloyu içine alır. Boş bir `name` grubu adsız bırakır. Tek bir `erd_undo` grubu kaldırır ve her tabloyu önceki grubuna geri koyar. |
| `erd_remove_table_group` | `groupId` | Bir grubu kaldırır. Grubun tabloları oldukları yerde, hiçbir grupta olmadan kalır. |
| `erd_change_table_group_name` | `groupId`, `value` | Bir grubu yeniden adlandırır. Boş bir dize grubu adsız bırakır. |
| `erd_change_table_group_color` | `groupId`, `color` | Bir grubun rengini ayarlar. |
| `erd_move_table_group` | `groupId`, `x`, `y` | Bir grubu, dikdörtgeni o noktadan başlayacak şekilde taşır ve başlık çubuğunu sürüklemenin yaptığı gibi tablolarını da aynı mesafe kadar taşır. Yatay ve dikey uzaklıkların toplamı 20 pikselin altında kalan bir taşıma geri alma kaydı oluşturmaz. |
| `erd_resize_table_group` | `groupId`, `x?`, `y?`, `width`, `height` | Bir grubun dikdörtgenini ayarlar, grubun tabloları yerinde kalır. `x` ve `y` verilmezse grubun köşesi korunur. Grubun tablolarını iç boşluklarıyla birlikte içine almayacak bir dikdörtgen, içine alması gereken kutuyu belirten bir iletiyle reddedilir. |
| `erd_set_table_group` | `tableIds`, `groupId` | Tabloları bir gruba koyar, her tablo bulunduğu gruptan ayrılır. `null` veya boş dize olan bir `groupId` onları tüm gruplardan çıkarır. |

Gruplar `View Option` → `Table Groups` ile gizliyken bu araçlar yine de grup ekler ve grupları değiştirir; bu gruplar, gruplar gösterilene kadar gizli kalır. [Grupları gizleme](../guide/guides/table-groups.md#hiding-groups) bölümüne bakın.
`erd_sort_tables` her grubun tablolarını bir arada tutar, `erd_import_dbml` ve `erd_import_json` grupları getirir ([İçe aktarma](#import) bölümüne bakın) ve `erd_read`, `groupNames` ile seçilen grupların DDL'ini yazar.
Tablo grupları gelmeden önce çıkmış bir ERD Editor sürümü, dosyayı kaydederken dosyanın gruplarını siler; `4.0.0` sürümünden önceki VS Code uzantısı ile `1.0.0` sürümünden önceki Obsidian ve JetBrains eklentileri böyle yapar. [Güncelleme](./installation.md#updating) bölümüne bakın.

### Ayarlar {#settings}

Bir ajan şemanın kendi ayarlarını belirler: veritabanı, veritabanının adı ve [Şema SQL](../guide/guides/schema-sql.md) betikleri.
Belgenin sakladığı diğer tüm ayarları kullanıcı düzenleyicide belirler: [Görünüm seçeneklerinin](../guide/guides/table-related-functions.md#table-view-options) aç/kapat düğmeleri, [Ayarlar](../guide/guides/settings.md) sekmesinin seçenekleri, Kod oluşturucunun dili ve ad biçimleri, tırnak türü ve [kilitler](../guide/guides/settings.md#lock).
`replace` modundaki içe aktarmalar dışında hiçbir araç bunları değiştirmez: `erd_import_json` yüklediği belgenin ayarlarını ve kilitlerini getirir, diğer dördü ise görünümü tuvalin başlangıcına geri döndürür. [İçe aktarma](#import) bölümüne bakın.
`1.0.0` sürümlü sunucu, bunları ayarlayan araçları kaldırdı: `erd_set_language`, `erd_set_table_name_case`, `erd_set_column_name_case`, `erd_set_bracket_type`, `erd_set_relationship_data_type_sync`, `erd_set_relationship_optimization`, `erd_set_column_order`, `erd_set_max_width_comment`, `erd_set_ignore_save_settings` ve `erd_set_show`.

`erd_list` ve `erd_read` aracının `snapshot` biçimi ayarları dosyanın kaydettiği şekilde bildirir ve `lockSettings` her kilit için bir bayrak tutar: `viewport`, `canvasType`, `language`, `tableNameCase`, `columnNameCase` ve `bracketType`.
Kilitli bir dil, ad biçimi veya tırnak türü, bir düzenleyicinin ekranında ne görünürse görünsün, kilitli değeriyle, yani dosyanın sakladığı ve her düzenleyicinin açılırken kullandığı değerle bildirilir. Görünüm ve sekme bildirilmez.

`erd_set_ddl_script` geri alma kaydı oluşturur. `erd_set_database` ve `erd_set_database_name` oluşturmaz, bu nedenle `erd_undo` bunları geri alamaz.

| Araç | Argümanlar | Ne yapar |
| --- | --- | --- |
| `erd_set_database` | `value` | Veritabanını ayarlar: `MariaDB`, `MSSQL`, `MySQL`, `Oracle`, `PostgreSQL`, `SQLite`, `Databricks` veya `Snowflake`. Veritabanının veri türlerini ve `vendor` verilmediğinde `erd_read` aracının yazdığı DDL'i belirler. |
| `erd_set_database_name` | `value` | `erd_read` aracının `use` ve `createAndUse` başlıklarında geçen veritabanı adını ayarlar. |
| `erd_set_ddl_script` | `position`, `sql` | Tabloların çevresine yazılan iki betikten birini ayarlar. [Önceki ve sonraki betikler](../guide/guides/schema-sql.md#before-and-after-scripts) bölümüne bakın. `position`, tablolardan önce yazılan `before` (`CREATE EXTENSION` veya `CREATE SCHEMA` gibi) ya da tablolardan sonra yazılan `after` (`GRANT` veya `CREATE VIEW` gibi) değeridir. `sql`, en fazla 10.000 karakter olmak üzere betiğin tamamının yerine geçer ve boş bir dize betiği kaldırır. Geçerli betiği önce `erd_read` aracının `scripts` biçimiyle okuyun. |

Bir betik her veritabanının DDL'ine olduğu gibi girer, bu nedenle betiği belgenin veritabanına göre yazın. MSSQL'de, son satırı `GO` olmayan bir betiğin ardına bir `GO` satırı eklenir.
Bu betikler gelmeden önce çıkmış bir ERD Editor sürümü, dosyayı kaydederken dosyanın betiklerini siler; `4.0.0` sürümünden önceki VS Code uzantısı ile `1.0.0` sürümünden önceki Obsidian ve JetBrains eklentileri böyle yapar. [Güncelleme](./installation.md#updating) bölümüne bakın.

### İçe aktarma {#import}

Bu araçlar bir şemayı düzenleyicinin Import menüsünün okuduğu şekilde okur. [Dosyaları içe veya dışa aktarma](../guide/guides/file-import-export.md) sayfasına bakın.
Her biri metni `value` olarak ve `mode` argümanını alır: varsayılan olan `replace` ya da `append`.

| Araç | Argümanlar | Ne yapar |
| --- | --- | --- |
| `erd_import_sql` | `value`, `mode?` | SQL DDL yükler: `CREATE TABLE` ifadeleri ve benzerleri. |
| `erd_import_graphql` | `value`, `mode?` | Bir GraphQL SDL'i yükler. |
| `erd_import_dbml` | `value`, `mode?` | DBML yükler. Her `TableGroup`, adını verdiği tablolardan oluşan bir tablo grubuna dönüşür. [DBML](../guide/guides/file-import-export.md#dbml) bölümüne bakın. |
| `erd_import_aml` | `value`, `mode?` | AML yükler. |
| `erd_import_json` | `value`, `mode?` | Başka bir `.erd.json` dosyası gibi bir erd-editor JSON belgesi yükler. |

`replace` belgenin yerini alır ve `erd_undo` önceki belgeyi geri getirir:

- `erd_import_sql`, `erd_import_graphql`, `erd_import_dbml` ve `erd_import_aml` her tabloyu, ilişkiyi, dizini, notu ve tablo grubunu yenileriyle değiştirir. Belgenin kilitler dahil ayarlarını korurlar, yalnızca görünüm %100 yakınlaştırmayla tuvalin başlangıcına geri döner.
- `erd_import_json` ayarlar dahil belgenin tamamını yenisiyle değiştirir: JSON'un ayarları ve kilitleri bu belgeninkilerin yerini alır ve kilit kaydı içermeyen bir JSON tüm kilitleri etkinleştirir ve görünümü tuvalin başlangıcına koyar. Bu belgenin ayarlarını korumak için `erd_read` aracının `json` biçiminin verdiği metinden başlayın. Boş bir metin, `erd_open_document` aracının `create` ile oluşturduğu gibi yeni bir belge verir.

`append`, düzenleyicinin [İçe aktar ve ekle](../guide/guides/file-import-export.md#import-and-add) işlevinin yaptığı gibi içe aktarılanı belgeye ekler ve tek bir `erd_undo` eklemenin tamamını geri alır:

- Metnin içerdikleri yeni kimliklere sahip yeni varlıklar olarak, belgenin içerdiği her şeyin (gizli notlar ve tablo grupları dahil) altındaki bir blokta, bunların sol kenarıyla hizalanarak gelir. Zaten var olan her tablo ve ayar, aynı adlı bir tablo dahil, yerinde kalır: Hiçbir şey ada göre birleştirilmez.
- İlişkiler ve dizinler yalnızca içe aktarmanın getirdiği tablolar arasında gelir, bu nedenle metnin tanımlamadığı bir tabloya giden yabancı anahtar atılır.
- `erd_import_sql`, `erd_import_graphql` ve `erd_import_aml` tabloları ilişkileri ve dizinleriyle birlikte ekler, `erd_import_dbml` ise tablo gruplarını da ekler. `erd_import_json` tabloları, ilişkileri, dizinleri, notları ve tablo gruplarını ekler, ayarlarını asla eklemez ve boş bir metni reddeder.

Bir JSON belgesi, tablo grupları dahil kendi yerleşimini korur: `replace` ile tablolarını yerleştirdiği yerde, `append` ile eklenen bloğun içinde.
SQL, GraphQL, DBML ve AML metinlerinden gelen tablolar, `erd_sort_tables` aracının yerleştirdiği gibi, en az sütunlu olanlar önce ve her grubun tabloları bir arada olacak şekilde satırlar hâlinde dizilir; düzenleyicinin kendi Import işlevinin mümkün olduğunda kullandığı `Flow` ile asla yerleştirilmez. Bu dört araç her iki modda da boş bir metni reddeder.

## erd_batch {#erd_batch}

`erd_batch`, birkaç düzenleme aracını sırayla, ya hepsi ya hiçbiri ilkesiyle tek bir düzenleme olarak çalıştırır.

- `operations`, her biri `{ tool, as?, args? }` biçiminde en fazla 100 girdi içerir ve `args`, aracın `path` dışındaki argümanlarıdır.
- İşlemler önce belgenin bir kopyası üzerinde denenir. Reddedilen işlem `operations[1] erd_remove_table: …` gibi adıyla belirtilir ve hiçbir şey uygulanmaz.
- Tek bir `erd_undo`, geri alamadığı işlemler dışında toplu işlemin tamamını geri alır ve sonucun `undoNote` alanı bu işlemleri belirtir: `erd_set_database` gibi geri alma kaydı oluşturmayan bir aracın işlemleri ve kısa bir `erd_move_table_group` gibi kayıt oluşturmadan belgeyi değiştiren işlemler. `erd_undo`, hiç geri alma kaydı oluşturmayan bir toplu işlemi atlar. Sonuçtaki `historyEntries`, `erd_undo` çağrılarını değil, toplu işlemin içindeki düzenleyici geçmiş kayıtlarını sayar.
- Canlı bir oturumda düzenleyici toplu işlemin ya tamamını alır ya da hiçbir kısmını almaz.

Bir ajan, bir toplu işlemin oluşturacağı kimlikleri çağrıdan önce bilemez; bu nedenle `as` ile adlandırılan bir işlem, sonraki bir işlemin bu kimliklere başvurmasını sağlar: ilk oluşturulan kimlik için `$name` veya `$name.0`, ikincisi için `$name.1` ve sonuncusu için `$name.last`.
Bir ad ASCII harfler, rakamlar ve alt çizgilerden oluşur, rakamla başlamaz ve yalnızca tek bir işlemi adlandırır.
Bir başvuru yalnızca bir argümanın varlık kimliği aldığı yerde çözümlenir, bu nedenle `$x` yazan bir ad veya açıklama metin olarak kalır.

Tek bir çağrıda sütunlarıyla bir tablo ve bir ilişki:

```json
{
  "path": "shop.erd.json",
  "operations": [
    { "tool": "erd_add_table", "as": "users" },
    { "tool": "erd_change_table_name", "args": { "tableId": "$users", "value": "users" } },
    { "tool": "erd_add_column", "as": "uid", "args": { "tableId": "$users" } },
    { "tool": "erd_change_column_name", "args": { "tableId": "$users", "columnId": "$uid", "value": "id" } },
    { "tool": "erd_change_column_data_type", "args": { "tableId": "$users", "columnId": "$uid", "value": "BIGINT" } },
    { "tool": "erd_set_column_primary_key", "args": { "tableId": "$users", "columnId": "$uid", "value": true } },
    { "tool": "erd_add_table", "as": "orders" },
    { "tool": "erd_change_table_name", "args": { "tableId": "$orders", "value": "orders" } },
    { "tool": "erd_add_relationship", "args": { "startTableId": "$users", "endTableId": "$orders", "relationshipType": "ZeroN", "onDelete": "cascade" } }
  ]
}
```

`users` tablosu ve onun `id` anahtarı ilişkiden önce adlandırılır, bu nedenle ilişkinin `orders` tablosuna eklediği yabancı anahtar sütunu `users_id` olur.

## Sonuçlar {#results}

Bir düzenleme tek satırlık bir JSON ile yanıt verir:

```json
{"tool":"erd_add_table","mode":"live","createdIds":["03h17be2plxpj5n59tqag7ogj"],"batches":1,"historyEntries":1}
```

| Alan | Anlamı |
| --- | --- |
| `mode` | `live` veya `headless`. [Canlı ve headless](./live-and-headless.md) sayfasına bakın. |
| `createdIds` | Çağrının oluşturduklarının kimlikleri, sırayla. |
| `batches`, `historyEntries` | Çağrının kaç değişiklik paketi gönderdiği ve kaç düzenleyici geçmiş kaydı oluşturduğu. |
| `undoable`, `undoNote` | `erd_undo` çağrıyı atlayacaksa `undoable` değeri `false` olur ve `undoNote` nedenini söyler: Araç geri alma kaydı oluşturmaz, çağrı 20 pikselin altındaki bir `erd_move_table_group` gibi kayıt oluşturmadan belgeyi değiştirmiştir ya da belge bu değere zaten sahiptir. Bir `erd_batch` sonucu her zaman bir `undoNote` içerir. Toplu işlem geri alma kaydı oluşturduğunda bu bilgi notu, tek bir `erd_undo` çağrısının toplu işlemi geri aldığını söyler ve yerinde bıraktığı her işlemi belirtir; hiç kayıt oluşturmadığında sonuç `undoable: false` içerir ve bilgi notu `erd_undo` aracının onu atladığını söyler. |
| `mismatch` | Çağrı, aracın bildirdiğinden farklı sayıda paket veya geçmiş kaydı oluşturduğunda bulunur. |
| `notes` | Oturumla ilgili bir şey değiştiğinde bulunur; örneğin kapanan ya da belgeye hizmet vermeyi bırakan bir düzenleyici veya diskte değişen bir dosya. |

Bir ret, bir kod ve ne yapılacağını söyleyen bir ileti taşıyan bir hata sonucudur:

```json
{"error":{"code":"notFound","message":"tableId nope names no live table; read the document for current ids"}}
```

| `code` | Nedeni |
| --- | --- |
| `notFound` | Bir kimlik şu anda var olan hiçbir şeye karşılık gelmez ya da dosya yoktur. |
| `invalidArgs` | Bir argüman eksiktir ya da yanlış bir değere sahiptir. |
| `invalidPath` | Yol bir ERD belgesi değildir. Windows'ta ayrıca Windows'un yazıldığı gibi saklamadığı bir ad içeren bir yol ya da bir düzenleyicinin başka bir yol altında tuttuğu bir belgeye ulaşan bir yol; ileti bu diğer yolu belirtir. |
| `invalidDocument` | Dosya, düzenleyicinin okuyabileceği bir belge değildir. |
| `tooLarge` | Bir okuma tek bir yanıta sığmaz. |
| `blocked` | Belgeyi, hub'ı kapalı bir düzenleyici tutar. İleti hub'ın nasıl açılacağını söyler: VS Code'da çalışma alanına güvenin ve `dineug.erd-editor.agentHub.enabled` ayarını açın ya da pencereyi yeniden yükleyin; Obsidian'da Coding agents ayarını açın ya da Obsidian'ı yeniden yükleyin; bir JetBrains IDE'sinde Coding agents ayarını açın ya da açıksa IDE'yi yeniden başlatın. |
| `hubDisabled` | Bir JetBrains IDE'si belgeyi yalnızca güvenmediği bir projede tutar. Okumalar yine de çalışır; ajanın düzenleme yapabilmesi için projeye güvenin. |
| `conflict` | Dosya çağrı sırasında diskte değişti. Hiçbir şey yazılmadı. |
| `hubAppeared`, `hubGone` | Bir düzenleyici, ajanın diskte düzenlediği bir belgeye hizmet vermeye başladı ya da belgeye hizmet veren düzenleyici hâlâ çalışıyor ancak kilit dosyası ve bağlantısı ortadan kalktı. Hiçbir şey yazılmadı. |
| `notSaved` | `erd_save` düzenleyicinin belgesini kaydedemedi. |
| `readonly` | Düzenleyici belgeyi salt okunur tutar; örneğin yazamadığı ya da diyagram olarak okuyamadığı bir dosya. Düzenleyici yoksa dosyanın kendisi salt okunurdur; örneğin kullanıma alınmamış (check out edilmemiş) bir Perforce veya TFVC dosyası. Hiçbir şey yazılmadı. |
| `protocolMismatch` | Düzenleyicinin ERD Editor uzantısı veya eklentisi ile sunucu farklı protokol sürümleri kullanır; örneğin `1.0.0` sürümlü sunucu ile `3.x` sürümlü bir VS Code uzantısı. Okumalar da reddedilir ve ileti güncellenmesi gereken tarafı belirtir. [Güncelleme](./installation.md#updating) bölümüne bakın. |
| `hubUnreachable`, `timeout`, `disconnected` | Bir düzenleyicinin hub'ı bağlantıyı kabul etmedi, 30 saniye içinde yanıt vermedi ya da çağrı sırasında bağlantıyı kesti. Windows'ta `hubUnreachable` ayrıca Windows'un ajanı hub'dan uzak tuttuğu anlamına gelir: Düzenleyici ajandan daha fazla hakla çalışır (örneğin düzenleyici yönetici olarak başlatılmış, ajan ise başlatılmamışsa) ya da ajan bir korumalı alanda çalışır. |

Diğer kodlar daha seyrektir ve her ret, ne olduğunu söyleyen bir ileti taşır.

Düzenleme araçları, `erd_batch` ve üç okuma aracı, bildirmedikleri bir argümanı ya da yanlış türde bir argümanı belgeye dokunmadan önce bir JSON-RPC geçersiz parametre hatasıyla (`-32602`) reddeder, böylece yanlış yazılmış bir argüman asla sessizce yok sayılmaz.
Beş oturum aracı bilmedikleri argümanları yok sayar.
