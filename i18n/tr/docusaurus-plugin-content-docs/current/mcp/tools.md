---
sidebar_position: 4
description: erd-editor MCP sunucusunun sunduğu tüm araçlar – belgeyi sayfa sayfa okuma, sözlük denetimleri, 67 düzenleme aracı, erd_batch ve bir sonuçla bir reddin neye benzediği.
---

# Araçlar

Sunucu 77 araç sunar: beş oturum aracı, dört okuma aracı, her düzenleme işlemi için bir tane olmak üzere 67 düzenleme aracı ve birkaç düzenleme aracını tek bir düzenleme olarak çalıştıran `erd_batch`.

`erd_list_documents` dışındaki her araç ilk argüman olarak belgenin `path` değerini alır ve aşağıdaki tablolarda bu argüman yer almaz.
`?` ile işaretlenen bir argüman isteğe bağlıdır.

## Oturum araçları {#session-tools}

| Araç | Argümanlar | Ne yapar |
| --- | --- | --- |
| `erd_list_documents` | | ERD belgelerini `path`, `open`, `active`, `dirty` ve `readonly` alanlarıyla listeler: çalışma dizinine hizmet veren düzenleyicinin belgelerini (bir JetBrains IDE'sinde bunlar açık olan her projeyi kapsar), aksi hâlde çalışma dizini altındaki ERD dosyalarını. |
| `erd_open_document` | `create?` | Bir belgeyi düzenlemek üzere açar. Belgeye hizmet veren bir düzenleyici varsa belge, o düzenleyicideki ERD Editor ile açılır. `create` ile, dosya yoksa önce dosyayı oluşturur ve uzantısız bir ada `.erd.json` uzantısı eklenir. |
| `erd_save` | | Bir düzenleyicinin tuttuğu belgeyi kaydeder. VS Code, ajanın düzenlemelerini bu araç çağrılana kadar kaydedilmemiş tutar; Obsidian ve bir JetBrains IDE'si bunları sizinkileri kaydettikleri gibi kaydeder, bu araç ise onları hemen yazar. Headless modda, sonucundaki `saved: true` değerinin belirttiği gibi her düzenleme zaten yazılmıştır ve bu araç hiçbir şey yapmaz. |
| `erd_undo` | | Bu ajanın yaptığı son düzenlemeyi geri alır, sizinkileri asla. Geri alma kaydı oluşturmayan çağrılar atlanır ve adları bildirilir. |
| `erd_redo` | | `erd_undo` aracının en son geri aldığı düzenlemeyi yeniden uygular. |

Kaydetmenin ve geri almanın her modda ne yaptığı için [Canlı ve headless](./live-and-headless.md) sayfasına bakın.

## Belge okuma {#reading-a-document}

| Araç | Argümanlar | Ne yapar |
| --- | --- | --- |
| `erd_list` | `query?`, `offset?`, `limit?`, `namesOnly?` | Ayarlar ve sayılar, ardından dizinleri ve ilişkileriyle birlikte bir sayfa tablo; her tablo için kimliği, tuval üzerindeki konumu ve boyutu, sütun sayısı, varsa mantıksal adı ve bir tablo grubundaysa tablo grubu. Arama yapmıyorsa tablolardan sonra tablo grupları, notlar ve ardından değer alanları, terimler ve sözcükler gelir. |
| `erd_get` | `tableIds?`, `tableNames?`, `relationshipIds?`, `indexIds?`, `memoIds?`, `tableGroupIds?`, `wordIds?`, `termIds?`, `domainIds?` | Belirtilen varlıklar, eksiksiz olarak: sütunları ve tablo gruplarıyla tablolar, sütunları ile `onDelete` ve `onUpdate` değerleriyle ilişkiler, sütunlarıyla dizinler, metinleriyle notlar, tablolarıyla tablo grupları ve tüm alanlarıyla sözcükler, terimler ve değer alanları. |
| `erd_read` | `format`, `vendor?`, `statements?`, `header?`, `logicalNameAsComment?`, `tableIds?`, `tableNames?`, `groupNames?` | Dört biçimden birinde belgenin tamamı tek seferde ya da yalnızca bazı tabloların veya tablo gruplarının DDL'i. |
| `erd_list_checks` | `level?`, `tableIds?`, `tableNames?`, `offset?`, `limit?` | Sözcük, terim ve değer alanı sözlüklerinin ortaya çıkardığı sorunlar, düzenleyicinin Sözlük sekmesindeki `Checks` sayfasının listelediği biçimde ve sayfa sayfa. Hiçbir şeyi değiştirmez. [Sözlük denetimleri](#dictionary-checks) bölümüne bakın. |

Bir ajan kimlikleri `erd_list` ile bulur, sütunları, sözlük satırlarını ve diğer ayrıntıları `erd_get` ile okur ve bu kimlikleri düzenleme araçlarına aktarır.
Bir tablonun `erd_list` içindeki boyutu, tuval üzerinde kapladığı kutudur: Yükseklik kesin, genişlik yaklaşıktır.
Bir tablo grubu, sakladığı dikdörtgenle, adıyla, rengiyle ve kaç tablo içerdiğiyle listelenir.
Her ilişki, iki tablosundan biriyle birlikte bir kez listelenir.
Bir sözlük satırı kimliğiyle, `name` değeriyle ve bir fiziksel ada ya da bir sütuna verdiğiyle listelenir: bir değer alanının `dataType` değeri, bir terimin `physicalName` ve `domainId` değerleri ve bir sözcüğün `abbreviation` değeri. Her sözlük satırlarını, sayfasının gösterdiği sırayla listeler.
`erd_list` ve `erd_read` araçlarının bildirdiği ayarlar, dosyanın kaydettiği ayarlardır. [Ayarlar](#settings) bölümüne bakın.

`erd_get` içinde ve `erd_read` aracının `snapshot` biçiminde her tablo ve sütun, yoksa boş bir dize olan `logicalName` değerini ve adı sözlükler verdiyse `true` olan, böylece yeni bir mantıksal adın adı yeniden türetmesini sağlayan `nameDerived` değerini taşır. [Sözlükler](#dictionaries) bölümüne bakın.
Her sütun `domainId` değerini taşır, her terim de öyle: Değer alanı yoksa ya da belgenin artık listelemediği bir değer alanıysa boş bir dize.

`erd_read` dört biçimden birini alır:

| `format` | Verdiği yanıt |
| --- | --- |
| `snapshot` | Tablo grupları ile sözcük, terim ve değer alanı satırları dahil her varlığı kimliğiyle ve ayarları Şema SQL betikleriyle birlikte içeren kompakt JSON. Bir görüntüleyenden diğerine değişen şeyleri içermez: ölçülen genişlikler, katman sırası, görünüm, sekme ve Ad görünümü. Büyük bir şemada boyutu büyüktür. |
| `sql` | Sekiz veritabanından biri için DDL: `Databricks`, `MariaDB`, `MSSQL`, `MySQL`, `Oracle`, `PostgreSQL`, `Snowflake` veya `SQLite`. `vendor` verilmezse varsayılan olarak belgede ayarlı veritabanı kullanılır. Belgenin tamamının DDL'i, tablolardan önceki ve sonraki betikleri içerir. `tableIds`, `tableNames` veya `groupNames` ile yalnızca bu tablolar, tuttukları yabancı anahtarlarla birlikte ve betikler olmadan. Yabancı anahtarlar ON DELETE ve ON UPDATE eylemlerini taşır, hedef veritabanının dışarıda bıraktıkları hariç. [ON DELETE ve ON UPDATE](../guide/guides/relationship-editing.md#on-delete-and-on-update) bölümüne bakın. |
| `json` | Belgenin tamamı, tam olarak bir kaydetme işleminin dosyaya yazdığı biçimde, düzenleyicinin henüz kaydetmediği düzenlemeler dahil. [Depolama biçimi ve çalışma zamanı değeri](../api/advanced/schema.md#storage-form-and-runtime-value) bölümüne bakın. |
| `scripts` | Şemanın boyutu ne olursa olsun yalnızca belgenin tablolardan önceki ve sonraki betikleri, `{"before":"…","after":"…"}` biçiminde. Ayarlanmamış betik boş gelir. |

`vendor`, `statements`, `header`, `logicalNameAsComment`, `tableIds`, `tableNames` ve `groupNames` argümanlarını yalnızca `sql` biçimi alır, başka bir biçim bunları reddeder.

- `statements`: varsayılan olan `create`; MySQL, MariaDB, PostgreSQL, SQLite ve Databricks'te `CREATE TABLE IF NOT EXISTS`, diğerlerinde düz `CREATE TABLE` yazan `ifNotExists`; ya da tabloları oluşturmadan önce silen `recreate` (Snowflake bunun yerine `CREATE OR REPLACE TABLE` yazar).
- `header`: varsayılan olan `none`; belgenin veritabanı adının belirttiği veritabanını veya şemayı seçen `use`; ya da bunu önce oluşturan `createAndUse`. Oracle'da yalnızca `use` vardır, bu yüzden orada `createAndUse` da `use` yazar ve PostgreSQL'de yalnızca `createAndUse` vardır, bu yüzden orada `use` hiçbir başlık yazmaz. SQLite hiç başlık yazmaz ve veritabanı adı boşken ya da düz bir tanımlayıcı değilken hiçbir veritabanı başlık yazmaz.
- `logicalNameAsComment`: `true`, açıklama boşken ya da yalnızca boşluklardan oluşurken bir tablonun veya sütunun mantıksal adını, her veritabanının açıklama yazdığı yerde ve biçimde açıklaması olarak yazar ve metin içeren her açıklamayı korur; varsayılan olan `false` hiçbir mantıksal ad yazmaz. [Açıklama olarak mantıksal adlar](../guide/guides/schema-sql.md#logical-names-as-comments) bölümüne bakın.
- `groupNames`: Adları büyük ya da küçük harfle verilen tablo gruplarının tabloları, `tableIds` ve `tableNames` ile birleştirilir. Hiçbir grupla eşleşmeyen bir ad `notFound` koduyla reddedilir. Tablo içermeyen bir grup hiç tablo eklemez ve hiç tablo kalmayan bir okuma, adı verilen her grubun boş olduğu ve hiçbir tablonun adının verilmediği durumda olduğu gibi, `invalidArgs` koduyla reddedilir.

`statements`, `header` ve `logicalNameAsComment`, bazı tabloların DDL'ine de uygulanır. Düzenleyicinin [Şema SQL](../guide/guides/schema-sql.md#options-panel) sekmesindeki `Statements` ve `Header` seçenekleri ve `Write logical names into empty comments` anahtarı gibi çalışırlar, ancak sekme `If not exists` ve `CREATE + USE` değerleriyle başlar. Anahtar, `logicalNameAsComment` gibi kapalı başlar.
Adlar dosyanın kaydettiği tırnak türüyle, `Bracket Type` kilitliyken de kilitli tırnak türüyle tırnak içine alınır. [Kilit](../guide/guides/settings.md#lock) bölümüne bakın.

### Büyük şemalar {#large-schemas}

Yüzlerce ya da binlerce tablodan oluşan şemalar da desteklenir.
Bir okumanın yanıtı en fazla 40.000 karakterdir; bu, Claude Code'un bir araç sonucunu ayrı bir dosyaya aktardığı sınırın altındadır.

- `erd_list` varsayılan olarak 100 öğelik bir sayfa döndürür (önce tablolar, ardından tablo grupları, notlar, değer alanları, terimler ve sözcükler; hepsi aynı başlangıç konumu sayacını paylaşır) ve sonraki sayfanın nerede başladığını `nextOffset` ve bir `note` bilgi notuyla bildirir. Bu `nextOffset` değerini aynı `query` ile birlikte `offset` olarak verin.
- `query`, tabloları tablo veya sütun adındaki, mantıksal adındaki ya da açıklamasındaki sözcüklere göre, büyük/küçük harf ayrımı yapmadan bulur. Adı veya mantıksal adı bu sözcüklerden daha fazlasını içeren tablolar önce gelir. Bir arama, tablo gruplarını, notları veya sözlük satırlarını listelemez.
- `namesOnly` yalnızca tablo adlarını listeler, tek bir yanıta yaklaşık 2.000 kısa ad sığar.
- `erd_get` ve `erd_read`, kimliklerin yanı sıra `tableNames` argümanını da alır, `erd_read` ise `groupNames` argümanını da alır, böylece büyük bir şema üzerinde kendisinden SQL sorgusu istenen bir ajan yalnızca ihtiyaç duyduğu tabloların DDL'ini okur.
- Sözlükler de parça parça gelir: `erd_list` tablolardan sonra satırlarını sayfa sayfa listeler, `erd_get` ise satırları `domainIds`, `termIds` ve `wordIds` ile eksiksiz verir.
- `erd_get`, hiçbir şeye karşılık gelmeyen kimlikleri ve adları `missing` altında, tek bir yanıta sığmayan kimlikleri ise yeniden istenmek üzere `notReturned` altında listeler.
- `erd_list_checks` da aynı şekilde sayfa sayfa yanıt verir. [Sözlük denetimleri](#dictionary-checks) bölümüne bakın.
- Tek bir yanıta sığmayacak kadar büyük bir okuma, nasıl daraltılacağı belirtilerek `tooLarge` koduyla reddedilir.

### Sözlük denetimleri {#dictionary-checks}

`erd_list_checks`, düzenleyicinin [Denetimler sayfasındaki](../guide/guides/dictionary.md#the-checks-sheet) denetimleri aynı sırayla listeler: önce sözcüklerin denetimleri, ardından terimlerin ve değer alanlarının denetimleri, her sözlük kendi sayfasının gösterdiği sırayla, ardından her tablo ve onu izleyen sütunları.
Sayfada olduğu gibi, bir denetim yalnızca okuduğu sözlükte en az bir satır varken çalışır. Sözlüklerinde hiç sözcük, terim veya değer alanı bulunmayan bir belge hiç denetlenmez: `total` değeri `0` olur ve `note` bilgi notu bunu belirtir.

- `level`: yalnızca o düzey için `error` veya `warning`; varsayılan olarak ikisi de.
- `tableIds` ve `tableNames`: yalnızca bu tabloların ve sütunlarının denetimleri (adlar büyük ya da küçük harfle verilebilir); bu, sözlüklerin kendi satırlarını dışarıda bırakır. Hiçbir tabloya karşılık gelmeyen bir kimlik veya ad `notFound` koduyla reddedilir.
- `offset` ve `limit`: varsayılan olarak 100 denetimlik bir sayfa; sayfa, tek bir yanıtın dolduğu yerde de biter. Ardından başka denetimler geldiği sürece `nextOffset` ve bir `note` bilgi notu sonraki sayfanın nerede başladığını belirtir; bunu aynı filtrelerle `offset` olarak verin. Bazı denetimleri düzelttikten sonra listeyi `0` konumundan yeniden alın: Düzeltilen bir denetim listeden çıkar, bu nedenle daha ileri bir konum hâlâ düzeltilmemiş denetimleri atlar.

Yanıt şunları içerir: filtrelerin bıraktığı denetim sayısı olan `total`; bunlardan her koda kaç tane düştüğünü, hiç denetimi olmayan kodu dışarıda bırakarak veren `counts` ve sayfanın kendisi olarak `checks`.
Her denetim `level` ve `code` değerlerini ve hedefinin `kind` ve `id` değerlerini verir: `table`, `column`, `word`, `term` veya `domain`. Bir sütunun denetimi ayrıca `tableId` değerini ve tablosunun adını `table` olarak ekler.
`name`, hedefin adı, yani bir tablonun veya sütunun fiziksel adıdır; varsa yanında `logicalName` değeri de gelir. `field`, denetimin okuduğu alandır: `name`, `logicalName` veya `domainId`. `text`, denetimin orada bulduğu metindir; `suggestions` ise sözlükler bir öneri sunduğunda bunun yerine kullanılacak olandır. Böylece bir ajan bir denetimi `erd_get` çağırmadan düzeltebilir:

```json
{"level":"warning","code":"physicalNameMismatch","kind":"column","id":"8e1z0q4xk2m7cwd5tfb9h3ynp","tableId":"03h17be2plxpj5n59tqag7ogj","table":"users","name":"id","logicalName":"Member Number","field":"name","text":"id","suggestions":["MBR_NO"]}
```

| `code` | `level` | Sayfadaki `Type` | Ne bulur |
| --- | --- | --- | --- |
| `duplicateName` | `error` | `Duplicate name` | Bir sözlüğün iki satırının paylaştığı bir ad. Satırların her biri listelenir. |
| `unknownDomain` | `error` | `Unknown domain` | Belgenin artık listelemediği bir değer alanına bağlı bir sütun veya terim. `text`, o değer alanının adı, adı bilinmiyorsa kimliğidir. |
| `forbiddenWord` | `error` | `Forbidden word` | Bir tablonun veya sütunun mantıksal adında ya da bir terimin adında geçen ve bir sözcüğün yasaklı olarak listelediği bir sözcük. `suggestions`, standart sözcüklerdir. |
| `unregisteredWord` | `warning` | `Unregistered word` | Aynı yerlerde geçen ve hiçbir sözcüğün listelemediği metin. |
| `synonymWord` | `warning` | `Synonym` | Aynı yerlerde bir standart sözcüğün yerine kullanılan eş anlamlı sözcük. `suggestions`, standart sözcüklerdir. |
| `physicalNameMismatch` | `warning` | `Physical name mismatch` | Bir tablonun veya sütunun, mantıksal adının teriminin verdiğinden farklı olan fiziksel adı. Öneri, terimin fiziksel adı ya da terim hiç fiziksel ad tutmuyorsa sözcüklerinin oluşturduğu addır. |
| `domainTypeMismatch` | `warning` | `Domain type mismatch` | Veri türü, bağlı olduğu değer alanınınkiyle aynı olmayan bir sütun. `text` sütunun türü, öneri ise değer alanının türüdür. |

Her denetimin bir adı nasıl okuduğu [Her denetimin buldukları](../guide/guides/dictionary.md#what-each-check-finds) bölümünde anlatılır.

## Düzenleme araçları {#edit-tools}

Kimlikler `erd_list` ve `erd_get` araçlarından ya da varlığı oluşturan çağrının `createdIds` alanından gelir.
Yeni bir kimlik, `03h17be2plxpj5n59tqag7ogj` gibi 25 küçük harf ve rakamdan oluşur; belgede zaten bulunan bir kimlik ise biçimini korur, bu nedenle bir kimliğin biçiminden hiçbir anlam çıkarmayın.
`x` ve `y`, tuval üzerindeki sol ve üst kenarlardır (piksel cinsinden); renk ise `#3b82f6` gibi bir CSS onaltılık renk kodu ya da rengi kaldıran boş bir dizedir.

### Tablolar {#tables}

| Araç | Argümanlar | Ne yapar |
| --- | --- | --- |
| `erd_add_table` | | Serbest bir konuma boş bir tablo ekler ve kimliğini `createdIds` içinde döndürür. |
| `erd_remove_table` | `tableId` | Bir tabloyu sütunları, dizinleri ve ona bağlı her ilişkiyle birlikte kaldırır. |
| `erd_change_table_name` | `tableId`, `value` | Bir tabloyu yeniden adlandırır. Ad bundan sonra elle yazılmış sayılır, bu nedenle sonradan verilen bir mantıksal ad, ad boş olmadığı sürece onu olduğu gibi bırakır. [Sözlükler](#dictionaries) bölümüne bakın. |
| `erd_change_table_comment` | `tableId`, `value` | Bir tablonun açıklamasını ayarlar. Boş bir dize açıklamayı temizler. |
| `erd_set_table_logical_name` | `tableId`, `value` | Bir tablonun mantıksal adını ayarlar. Boş bir dize mantıksal adı temizler ve adı olduğu gibi bırakır. Tablonun adı boşken ya da türetilmişken sözlükler adı mantıksal addan türetir. [Sözlükler](#dictionaries) bölümüne bakın. Bir terim bir tabloya değer alanı vermez. |
| `erd_change_table_color` | `tableId`, `color` | Bir tablonun rengini ayarlar. |
| `erd_move_table` | `tableId`, `x`, `y` | Bir tabloyu tuval üzerinde bir konuma taşır. |
| `erd_move_tables` | `positions` | Birkaç tabloyu, tek bir `erd_undo` çağrısının geri aldığı tek bir düzenlemede taşır. `positions`, her tablo için bir `{ tableId, x, y }` içerir ve her tablo en fazla bir kez yer alır. |
| `erd_sort_tables` | | `erd_import_sql`, `erd_import_graphql`, `erd_import_dbml` ve `erd_import_aml` araçlarının yerleştirdiği gibi, tüm tabloları en az sütunlu olan önce gelecek şekilde tuval boyunca satırlara yerleştirir. Bir tablo grubunun tabloları bir arada kalır ve her grubun kutusu bunların çevresine oturtulur. |

### Sütunlar {#columns}

| Araç | Argümanlar | Ne yapar |
| --- | --- | --- |
| `erd_add_column` | `tableId` | Bir tabloya boş bir sütun ekler ve kimliğini `createdIds` içinde döndürür. |
| `erd_remove_columns` | `tableId`, `columnIds` | Tek bir tablodan sütunları, onları kullanan ilişkiler ve dizin girdileriyle birlikte kaldırır. |
| `erd_change_column_name` | `tableId`, `columnId`, `value` | Bir sütunu yeniden adlandırır. Ad, bir tablonunki gibi, bundan sonra elle yazılmış sayılır. |
| `erd_change_column_data_type` | `tableId`, `columnId`, `value` | `INT` veya `VARCHAR(255)` gibi veri türünü ayarlar. [İlişkilerde veri türü eşitleme](../guide/guides/settings.md#relationship-datatype-sync) açıkken değişiklik, düzenleyicide olduğu gibi ilişkileri her iki yönde izler: Bir serial türü, `erd_add_relationship` aracının kopyaladığı gibi, sakladığı tamsayı türü olarak yabancı anahtarlara ulaşır; bir serial anahtar ise yabancı anahtarlarından biri değiştiğinde türünü korur ve değişiklik orada durur. Eşitlemeyi açmak veya kapatmak kullanıcıya kalmıştır ve `erd_list` bunu `relationshipDataTypeSync` olarak bildirir. Bir değer alanına bağlı bir sütun, değer alanınınkinden farklı bir türe ayarlandığında bu değer alanıyla bağlantısı kaldırılır; eşitlemenin ulaştığı ve yeni türü kendi değer alanınınkinden farklı olan her sütun için de aynısı olur. [Bağlantıyı kaldırma](../guide/guides/dictionary.md#unlinking) bölümüne bakın. |
| `erd_change_column_default` | `tableId`, `columnId`, `value` | Varsayılan değeri SQL metni olarak ayarlar. Boş bir dize varsayılan değeri temizler. |
| `erd_change_column_comment` | `tableId`, `columnId`, `value` | Açıklamayı ayarlar. Boş bir dize açıklamayı temizler. |
| `erd_set_column_logical_name` | `tableId`, `columnId`, `value` | Bir sütunun mantıksal adını ayarlar. Boş bir dize mantıksal adı temizler ve adı olduğu gibi bırakır. Sütunun adı boşken ya da türetilmişken sözlükler adı türetir, bir terimin değer alanı da sütunu kendisine bağlar ve ona değer alanının veri türünü verir. [Sözlükler](#dictionaries) bölümüne bakın. |
| `erd_set_column_domain` | `tableId`, `columnId`, `domainId?`, `domainName?` | Bir sütunu, kimliğiyle ya da adıyla (ikisinden biriyle) verilen bir değer alanına bağlar. Sütun değer alanının veri türünü alır; bu tür, İlişkilerde veri türü eşitleme açıkken ilişkileri izler ve `erd_change_column_data_type` ile aynı bağlantı kaldırma kuralları geçerlidir. `null` veya boş dize olan bir `domainId` ya da boş bir `domainName`, sütunun bağlantısını kaldırır ve türünü korur. |
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
| `erd_add_relationship` | `startTableId`, `endTableId`, `relationshipType`, `onDelete?`, `onUpdate?` | İki tabloyu ilişkilendirir. Üst tablonun birincil anahtarını alt tabloya yabancı anahtar sütunları olarak kopyalar; üst tablonun birincil anahtarı yoksa önce bir birincil anahtar sütunu oluşturur. Her yabancı anahtar sütunu, düzenleyicide ilişki çizmenin adlandırdığı şekilde adlandırılır: `users` tablosunun `id` anahtarından `users_id` oluşur, `member_id` gibi bir anahtar ise adını korur. [Yabancı anahtar sütun adları](../guide/guides/relationship-editing.md#foreign-key-column-names) bölümüne bakın. Her biri kendi anahtarının veri türünü kopyalar; ancak bir serial anahtar, `serial4` için `integer` gibi sakladığı tamsayı türünü verir ve yalın bir `serial`, PostgreSQL, MySQL ve MariaDB dışında `serial` olarak kalır. [Tanımlayıcı ilişkiler](../guide/guides/relationship-editing.md#identifying-relationships) bölümüne bakın. Her biri ayrıca anahtarının mantıksal adını alır ve bir serial anahtar ona başka bir tür vermedikçe anahtarının bağlı olduğu değer alanına bağlanır. `createdIds`, oluşturulduysa yeni anahtar sütununu, yabancı anahtar sütunlarını ve en sonda ilişki kimliğini içerir. |
| `erd_link_columns` | `startTableId`, `startColumnIds`, `endTableId`, `endColumnIds`, `relationshipType`, `onDelete?`, `onUpdate?` | Zaten var olan sütunlar arasında, başlangıç ve bitiş sütunlarını konumlarına göre eşleştirerek bir ilişki çizer. Hiçbir sütunu yeniden adlandırmaz, hiçbir veri türünü değiştirmez ve hiçbir mantıksal adı veya değer alanını kopyalamaz. |
| `erd_remove_relationship` | `relationshipId` | Bir ilişki çizgisini kaldırır. Yabancı anahtar sütunları tabloda kalır. |
| `erd_change_relationship_type` | `relationshipId`, `relationshipType` | Bir ilişkinin kardinalitesini değiştirir. |
| `erd_change_relationship_on_delete` | `relationshipId`, `onDelete` | Bir ilişkinin ON DELETE eylemini ayarlar: üst tablodaki bir satırın silinmesinin, ona bağlı alt tablo satırlarına ne yaptığı. |
| `erd_change_relationship_on_update` | `relationshipId`, `onUpdate` | Bir ilişkinin ON UPDATE eylemini ayarlar: üst tablodaki bir anahtarın değişmesinin, ona bağlı alt tablo satırlarına ne yaptığı. |

`erd_add_relationship` yabancı anahtar sütunlarını çalıştığı anda adlandırır ve anahtarlarının mantıksal adlarını kopyalar. Anahtarın sonradan yeniden adlandırılması veya ona sonradan mantıksal ad verilmesi bu sütunlara ulaşmaz, bu nedenle önce üst tabloyu ve birincil anahtarını adlandırın ve anahtara mantıksal adını verin.
Verdiği adlar elle yazılmış sayılır, bu nedenle sonradan verilen bir mantıksal ad onları olduğu gibi bırakır, `erd_derive_physical_names` ise onları yeniden sözlüklere bırakır. [Sözlükler](#dictionaries) bölümüne bakın.

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

### Sözlükler {#dictionaries}

Bu araçlar, düzenleyicinin [Sözlük](../guide/guides/dictionary.md) sekmesindeki, bir tablonun veya sütunun mantıksal adının fiziksel adını kendilerinden türettiği üç sözlüğü düzenler:

- Sözcük, mantıksal adları oluşturan standart bir sözcüktür ve fiziksel ada yazdığı kısaltmayla birlikte gelir; örneğin `Member` ve `MBR`.
- Terim, verdiği fiziksel adla ve bir sütun için bağladığı değer alanıyla birlikte bütün bir mantıksal addır; örneğin `MBR_NO` ve `Identifier` ile `Member Number`.
- Değer alanı, sütunların bağlandığı adlandırılmış bir veri türüdür; örneğin `INT` için `Identifier`.

| Araç | Argümanlar | Ne yapar |
| --- | --- | --- |
| `erd_add_word` | `name`, `abbreviation`, `englishName?`, `description?`, `synonyms?`, `forbiddenWords?` | Sözcük sözlüğünün sonuna bir sözcük ekler ve kimliğini `createdIds` içinde döndürür. `synonyms` ve `forbiddenWords` virgülle ayrılır: sözcüğün başka yazılışları ve onun yerine kullanılmaması gereken sözcükler. |
| `erd_update_word` | `wordId`, `name?`, `abbreviation?`, `englishName?`, `description?`, `synonyms?`, `forbiddenWords?` | Verilen alanları değiştirir, gerisini olduğu gibi bırakır. |
| `erd_remove_word` | `wordId` | Bir sözcüğü kaldırır. |
| `erd_add_term` | `name`, `physicalName?`, `domainId?`, `domainName?`, `description?`, `synonyms?` | Terim sözlüğünün sonuna bir terim ekler ve kimliğini `createdIds` içinde döndürür. `physicalName` verilmezse sözcükler, oluşturabiliyorlarsa bir fiziksel ad oluşturur; örneğin `Member Number` için `MBR_NO`. |
| `erd_update_term` | `termId`, `name?`, `physicalName?`, `domainId?`, `domainName?`, `description?`, `synonyms?` | Verilen alanları değiştirir, gerisini olduğu gibi bırakır. Terim hiç fiziksel ad tutmazken ya da boş bir `physicalName` ile birlikte verilen bir `name`, sözcükleri bir fiziksel ad oluşturuyorsa o adı da yazar. |
| `erd_remove_term` | `termId` | Bir terimi kaldırır. |
| `erd_add_domain` | `name`, `category?`, `dataType`, `description?` | Değer alanı sözlüğünün sonuna bir değer alanı ekler ve kimliğini `createdIds` içinde döndürür. `category`, değer alanlarını `Number` veya `Text` gibi gruplara ayırır. |
| `erd_update_domain` | `domainId`, `name?`, `category?`, `dataType?`, `description?` | Verilen alanları değiştirir, gerisini olduğu gibi bırakır. Yeni bir `dataType`, değer alanına bağlı her sütuna ulaşır ve İlişkilerde veri türü eşitleme açıkken, `erd_change_column_data_type` ile aynı bağlantı kaldırma kurallarıyla ilişkileri izler. |
| `erd_remove_domain` | `domainId` | Bir değer alanını kaldırır. Ona bağlı sütunlar veri türlerini korur; bu sütunlar ve ona bağlı terimler hiçbir değer alanı göstermez: `domainId` değerleri boş bir dize olarak okunur. `erd_undo` bağlantıları geri getirir, bir kaydetme ise onları dosyaya yazmaz. |
| `erd_derive_physical_names` | `scope`, `tableId?`, `columnId?` | Düzenleyicinin [Fiziksel adları yeniden türetme](../guide/guides/dictionary.md#derive-physical-names-again) işlevinin yaptığı gibi, tek bir sütun, tek bir tablo ya da belgenin tamamı için fiziksel adları mantıksal adlardan yeniden türetir. |

- Bir sözlük her adı bir kez tutar, bu nedenle aynı sözlüğün başka bir satırının tuttuğu bir ad `invalidArgs` koduyla reddedilir. Adlar baştaki ve sondaki boşluklar atılarak ve büyük/küçük harf ayrımı yapılarak karşılaştırılır, bu nedenle `Member` ve `member` iki ayrı addır.
- Bir güncelleme satırı kimliğiyle belirtir ve en az bir alan verir. Satırın zaten tuttuğu değerler hiçbir şeyi değiştirmez ve geri alma kaydı oluşturmaz; bir ekleme veya kaldırma ise her zaman bir kayıt oluşturur.
- Bir terimin değer alanı ya `domainId` ile (değer alanı olmaması için `null` veya boş bir dize) ya da `domainName` ile (değer alanı olmaması için boş bir dize) verilir. Bir `domainName`, adların karşılaştırıldığı şekilde karşılaştırılarak, sözlükteki sırada o adı taşıyan ilk değer alanını alır. İkisini birden vermek ya da hiçbir değer alanının taşımadığı bir `domainName` vermek reddedilir. `erd_set_column_domain` de değer alanını aynı şekilde alır.
- Bir sözcüğü veya terimi değiştirmek ya da kaldırmak hiçbir şeyi yeniden adlandırmaz ve hiçbir bağlantıyı kaldırmaz: Verdiği adlar ve değer alanları olduğu gibi kalır. `erd_derive_physical_names` adları yeniden türetir ve bir terimin şu anda verdiği değer alanını bağlar, ancak artık hiçbir terimle eşleşmeyen ya da terimi değer alanı vermeyen bir sütun bağlı olduğu değer alanını korur. Boş bir `domainId` ile `erd_set_column_domain` bu bağlantıyı kaldırır.
- Hiçbir araç, Sözlük sekmesinin yaptığı gibi bir sözlüğü CSV olarak içe veya dışa aktarmaz, bir sözlüğü sıralamaz ya da belirli bir konuma satır eklemez.

`erd_list` satırları listeler, `erd_get` her alanı verir, `erd_read` aracının `snapshot` biçimi hepsini tutar, `erd_list_checks` ise sözlüklerin ortaya çıkardığı sorunları listeler. [Belge okuma](#reading-a-document) bölümüne bakın.

`erd_set_table_logical_name` ve `erd_set_column_logical_name`, bir mantıksal ad yazıldığında düzenleyicinin yaptığı gibi fiziksel ad türetir ([Fiziksel adları türetme](../guide/guides/dictionary.md#deriving-physical-names) bölümüne bakın):

- Bir ad yalnızca boşken ya da kendisi türetilmişken türetilir; okumalar bunu `nameDerived: true` olarak gösterir. Boş olmayan ve elle yazılmış bir ad kalır, yalnızca mantıksal ad yazılır. `erd_change_table_name` ve `erd_change_column_name` araçlarının, SQL, GraphQL, DBML ve AML içe aktarmalarının yazdığı adlar ile `erd_add_relationship` aracının yabancı anahtar sütunlarına verdiği adların tümü elle yazılmış sayılır. Boş bir dizeyle yeniden adlandırılan bir ad, bir sonraki mantıksal adla yeniden türetilir.
- Önce, sözlük adlarının karşılaştırıldığı şekilde karşılaştırılarak, adı mantıksal adla aynı olan terime bakılır. Terim kendi fiziksel adını ya da hiç fiziksel ad tutmuyorsa sözcüklerinin oluşturduğu adı verir. Bir sütun için, hiçbir ad türetilmese bile terimin değer alanını da bağlar ve sütun, İlişkilerde veri türü eşitleme açıkken ilişkileri izleyerek değer alanının veri türünü alır.
- Böyle bir terim yoksa adı sözcükler, kısaltmaları alt çizgilerle birleştirilerek oluşturur: `Member Number`, `MBR_NO` verir. Ya hep ya hiç: Bir eş anlamlı sözcük, yasaklı bir sözcük, hiçbir sözcüğün listelemediği bir metin ya da kısaltması olmayan bir sözcük hiçbir şey oluşturmaz ve ad olduğu gibi kalır. Sözcükler hiçbir değer alanı bağlamaz, değer alanı olmayan bir terim de bağlamaz, bu nedenle sütun bağlı olduğu değer alanını korur.
- Türetilen adı, büyük/küçük harf farkı gözetilmeksizin tablosundaki başka bir sütunda zaten bulunan bir sütun, adını, `nameDerived` değerini ve değer alanını korur.
- Bir mantıksal adı temizlemek fiziksel adı olduğu gibi bırakır. Mantıksal adı ve türettiği şeyler zaten yerinde olan bir çağrı hiçbir şeyi değiştirmez ve geri alma kaydı oluşturmaz.

`erd_derive_physical_names` bir `scope` alır: o sütun için `tableId` ve `columnId` ile `column`; tablonun adı ve tüm sütunları için `tableId` ile `table` ya da her tablo ve sütunları için kimliksiz `document`. Gereken bir kimliği eksik olan ya da almadığı bir kimlik verilen bir kapsam reddedilir.
Kapsanan ve mantıksal adı olan her ad, elle yazılmış bir ad dahil, yeniden sözlüklere bırakılır ve onların şu anda verdiğini alır: bir terimin fiziksel adını ve bir sütun için onun değer alanını ve türünü ya da aksi hâlde sözcüklerin oluşturduğu adı; bu son durumda sütunun değer alanı olduğu gibi kalır. Hiçbir şey türetmeyen bir mantıksal ad, adı olduğu gibi bırakır ve `nameDerived` artık `true` olur. Mantıksal adı olmayan bir ad olduğu gibi kalır; aynı tabloya giden ikinci bir yabancı anahtar gibi, yeni adı tablosundaki başka bir sütunda bulunan bir sütun da olduğu gibi kalır ve `nameDerived` değerini de korur. Tek bir `erd_undo` çağrının tamamını geri alır.
İçe aktarılan bir şemanın adları elle yazılmış sayılır, bu nedenle onu sözlüklerden adlandırmak için mantıksal adları ayarlayın ve ardından `erd_derive_physical_names` çağırın. Bu çağrı terimin kendi fiziksel adını verir; terimin sözcüklerinde yapılan bir değişiklik bu adı yeniden oluşturmaz. Bu nedenle bir terimin sözcüklerini değiştirdikten sonra önce terimi güncelleyin: Sözcüklerin adı yeniden oluşturması için `name` değerini boş bir `physicalName` ile verin ya da yeni `physicalName` değerini verin.

Sözlük sekmesi gelmeden önce çıkmış bir ERD Editor sürümü, dosyayı kaydederken dosyanın mantıksal adlarını, değer alanı bağlantılarını ve sözlük satırlarını siler; `4.2.0` sürümünden önceki VS Code uzantısı ile `1.2.0` sürümünden önceki Obsidian ve JetBrains eklentileri böyle yapar. Bunlardan `4.0.0` veya `4.1.0` sürümlü uzantı ile `1.0.0` veya `1.1.0` sürümlü eklentiler sunucuyla hâlâ canlı düzenleme yapar, ancak bir ajanın yazdığı mantıksal adları, değer alanı bağlantılarını ve sözlük satırlarını ne gösterir ne de korur. [Güncelleme](./installation.md#updating) bölümüne bakın.

### Ayarlar {#settings}

Bir ajan şemanın kendi ayarlarını belirler: veritabanı, veritabanının adı ve [Şema SQL](../guide/guides/schema-sql.md) betikleri.
Belgenin sakladığı diğer tüm ayarları kullanıcı düzenleyicide belirler: [Ad görünümü](../guide/guides/logical-names.md#name-view), [Görünüm seçeneklerinin](../guide/guides/table-related-functions.md#table-view-options) aç/kapat düğmeleri, [Ayarlar](../guide/guides/settings.md) sekmesinin seçenekleri, Kod oluşturucunun dili ve ad biçimleri, tırnak türü ve [kilitler](../guide/guides/settings.md#lock).
`replace` modundaki içe aktarmalar dışında hiçbir araç bunları değiştirmez: `erd_import_json` yüklediği belgenin ayarlarını ve kilitlerini getirir, diğer dördü ise görünümü tuvalin başlangıcına geri döndürür. [İçe aktarma](#import) bölümüne bakın.
`1.0.0` sürümlü sunucu, bunları ayarlayan araçları kaldırdı: `erd_set_language`, `erd_set_table_name_case`, `erd_set_column_name_case`, `erd_set_bracket_type`, `erd_set_relationship_data_type_sync`, `erd_set_relationship_optimization`, `erd_set_column_order`, `erd_set_max_width_comment`, `erd_set_ignore_save_settings` ve `erd_set_show`.

`erd_list` ve `erd_read` aracının `snapshot` biçimi ayarları dosyanın kaydettiği şekilde bildirir ve `lockSettings` her kilit için bir bayrak tutar: `viewport`, `canvasType`, `language`, `tableNameCase`, `columnNameCase`, `bracketType` ve `unlockNameViewMode`.
Sonuncusu ters yönde okunur: `Name View` kilidi etkinken – yeni bir belgede ve bu kilit var olmadan önce kaydedilmiş bir dosyada olduğu gibi – `false`, kullanıcı kilidi devre dışı bıraktığında ise `true` olur.
Kilitli bir dil, ad biçimi veya tırnak türü, bir düzenleyicinin ekranında ne görünürse görünsün, kilitli değeriyle, yani dosyanın sakladığı ve her düzenleyicinin açılırken kullandığı değerle bildirilir. Görünüm, sekme ve Ad görünümü bildirilmez. Bir ajan, Ad görünümü ne gösterirse göstersin mantıksal adları okur ve yazar.

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

- `erd_import_sql`, `erd_import_graphql`, `erd_import_dbml` ve `erd_import_aml` her tabloyu, ilişkiyi, dizini, notu ve tablo grubunu yenileriyle değiştirir. Belgenin kilitler dahil ayarlarını korurlar, yalnızca görünüm %100 yakınlaştırmayla tuvalin başlangıcına geri döner; belgenin sözcük, terim ve değer alanı sözlüklerini de korurlar. Getirdikleri tabloların mantıksal adları yoktur ve hiçbir değer alanına bağlanmazlar.
- `erd_import_json` ayarlar ve sözlükler dahil belgenin tamamını yenisiyle değiştirir: JSON'un ayarları, kilitleri, sözcükleri, terimleri ve değer alanları bu belgeninkilerin yerini alır ve kilit kaydı içermeyen bir JSON tüm kilitleri etkinleştirir ve görünümü tuvalin başlangıcına koyar. JSON'da `Name View` kilidi devre dışı değilse her görüntüleyen kendi Ad görünümünü korur; devre dışıysa JSON kendi Ad görünümünü getirir. Bu belgenin ayarlarını korumak için `erd_read` aracının `json` biçiminin verdiği metinden başlayın. Boş bir metin, `erd_open_document` aracının `create` ile oluşturduğu gibi yeni bir belge verir.

`append`, düzenleyicinin [İçe aktar ve ekle](../guide/guides/file-import-export.md#import-and-add) işlevinin yaptığı gibi içe aktarılanı belgeye ekler ve tek bir `erd_undo` eklemenin tamamını geri alır:

- Metnin içerdikleri yeni kimliklere sahip yeni varlıklar olarak, belgenin içerdiği her şeyin (gizli notlar ve tablo grupları dahil) altındaki bir blokta, bunların sol kenarıyla hizalanarak gelir. Zaten var olan her tablo ve ayar, aynı adlı bir tablo dahil, yerinde kalır: Hiçbir şey ada göre birleştirilmez.
- İlişkiler ve dizinler yalnızca içe aktarmanın getirdiği tablolar arasında gelir, bu nedenle metnin tanımlamadığı bir tabloya giden yabancı anahtar atılır.
- `erd_import_sql`, `erd_import_graphql` ve `erd_import_aml` tabloları ilişkileri ve dizinleriyle birlikte ekler, `erd_import_dbml` ise tablo gruplarını da ekler. `erd_import_json` tabloları, ilişkileri, dizinleri, notları ve tablo gruplarını ekler, ayarlarını asla eklemez ve boş bir metni reddeder. Tabloları ve sütunları mantıksal adlarını getirir, ancak hiçbir sütun bir değer alanına bağlanmaz ve JSON'un sözcüklerinden, terimlerinden veya değer alanlarından hiçbiri gelmez.

Bir JSON belgesi, tablo grupları dahil kendi yerleşimini korur: `replace` ile tablolarını yerleştirdiği yerde, `append` ile eklenen bloğun içinde.
SQL, GraphQL, DBML ve AML metinlerinden gelen tablolar, `erd_sort_tables` aracının yerleştirdiği gibi, en az sütunlu olanlar önce ve her grubun tabloları bir arada olacak şekilde satırlar hâlinde dizilir; düzenleyicinin kendi Import işlevinin mümkün olduğunda kullandığı `Flow` ile asla yerleştirilmez. Bu dört araç her iki modda da boş bir metni reddeder.

## erd_batch {#erd_batch}

`erd_batch`, birkaç düzenleme aracını sırayla, ya hepsi ya hiçbiri ilkesiyle tek bir düzenleme olarak çalıştırır.

- `operations`, her biri `{ tool, as?, args? }` biçiminde en fazla 100 girdi içerir; burada `tool` bir düzenleme aracı, `args` ise aracın `path` dışındaki argümanlarıdır. `erd_list_checks` gibi bir okuma aracı reddedilir.
- İşlemler önce belgenin bir kopyası üzerinde denenir. Reddedilen işlem `operations[1] erd_remove_table: …` gibi adıyla belirtilir ve hiçbir şey uygulanmaz.
- Tek bir `erd_undo`, geri alamadığı işlemler dışında toplu işlemin tamamını geri alır ve sonucun `undoNote` alanı bu işlemleri belirtir: `erd_set_database` gibi geri alma kaydı oluşturmayan bir aracın işlemleri ve kısa bir `erd_move_table_group` gibi kayıt oluşturmadan belgeyi değiştiren işlemler. `erd_undo`, hiç geri alma kaydı oluşturmayan bir toplu işlemi atlar. Sonuçtaki `historyEntries`, `erd_undo` çağrılarını değil, toplu işlemin içindeki düzenleyici geçmiş kayıtlarını sayar.
- Canlı bir oturumda düzenleyici toplu işlemin ya tamamını alır ya da hiçbir kısmını almaz.

Bir ajan, bir toplu işlemin oluşturacağı kimlikleri çağrıdan önce bilemez; bu nedenle `as` ile adlandırılan bir işlem, sonraki bir işlemin bu kimliklere başvurmasını sağlar: ilk oluşturulan kimlik için `$name` veya `$name.0`, ikincisi için `$name.1` ve sonuncusu için `$name.last`.
Bir ad ASCII harfler, rakamlar ve alt çizgilerden oluşur, rakamla başlamaz ve yalnızca tek bir işlemi adlandırır.
Bir başvuru yalnızca bir argümanın `wordId`, `termId` ve `domainId` dahil bir varlık kimliği aldığı yerde çözümlenir, bu nedenle `$x` yazan bir ad veya açıklama metin olarak kalır.
Bir `domainName` de metindir, ancak işlemi çalışırken okunur, bu nedenle toplu işlemin daha önceki bir işleminin eklediği bir değer alanını belirtebilir.

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

Sözcükler, bir değer alanı ve bir terim, ardından bunlardan mantıksal adlarıyla adlandırılan bir tablo:

```json
{
  "path": "shop.erd.json",
  "operations": [
    { "tool": "erd_add_word", "args": { "name": "Member", "abbreviation": "MBR" } },
    { "tool": "erd_add_word", "args": { "name": "Number", "abbreviation": "NO" } },
    { "tool": "erd_add_word", "args": { "name": "Name", "abbreviation": "NM" } },
    { "tool": "erd_add_domain", "as": "identifier", "args": { "name": "Identifier", "dataType": "INT" } },
    { "tool": "erd_add_term", "args": { "name": "Member Number", "domainId": "$identifier" } },
    { "tool": "erd_add_table", "as": "members" },
    { "tool": "erd_set_table_logical_name", "args": { "tableId": "$members", "value": "Member" } },
    { "tool": "erd_add_column", "as": "no", "args": { "tableId": "$members" } },
    { "tool": "erd_set_column_logical_name", "args": { "tableId": "$members", "columnId": "$no", "value": "Member Number" } },
    { "tool": "erd_add_column", "as": "nm", "args": { "tableId": "$members" } },
    { "tool": "erd_set_column_logical_name", "args": { "tableId": "$members", "columnId": "$nm", "value": "Member Name" } }
  ]
}
```

Terim, sözcüklerinden `MBR_NO` adını oluşturur ve tablo `MBR` olarak adlandırılır. `Member Number` sütunu terimin `MBR_NO` adını ve değer alanını alır, böylece `Identifier` değer alanına bağlanır ve türü `INT` olur; hiçbir terimin tutmadığı `Member Name` ise `MBR_NM` olarak oluşturulur.

## Sonuçlar {#results}

Bir düzenleme tek satırlık bir JSON ile yanıt verir:

```json
{"tool":"erd_add_table","mode":"live","createdIds":["03h17be2plxpj5n59tqag7ogj"],"batches":1,"historyEntries":1}
```

| Alan | Anlamı |
| --- | --- |
| `mode` | `live` veya `headless`. [Canlı ve headless](./live-and-headless.md) sayfasına bakın. |
| `saved` | Headless modda her düzenleme aracının, `erd_batch`, `erd_undo` ve `erd_redo` araçlarının sonucunda `true` olur: Çağrı yanıt verdiğinde dosya değişikliği zaten içerir, bu nedenle kaydedilecek bir şey kalmaz. Değişikliği düzenleyici tuttuğu için canlı bir sonuçta `saved` yer almaz. [Kaydetme](./live-and-headless.md#saving) bölümüne bakın. |
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
| `protocolMismatch` | Düzenleyicinin ERD Editor uzantısı veya eklentisi ile sunucu farklı protokol sürümleri kullanır; örneğin `1.0.0` veya sonraki bir sürümü kullanan sunucu ile `3.x` sürümlü bir VS Code uzantısı. Okumalar da reddedilir ve ileti güncellenmesi gereken tarafı belirtir. [Güncelleme](./installation.md#updating) bölümüne bakın. |
| `hubUnreachable`, `timeout`, `disconnected` | Bir düzenleyicinin hub'ı bağlantıyı kabul etmedi, 30 saniye içinde yanıt vermedi ya da çağrı sırasında bağlantıyı kesti. Windows'ta `hubUnreachable` ayrıca Windows'un ajanı hub'dan uzak tuttuğu anlamına gelir: Düzenleyici ajandan daha fazla hakla çalışır (örneğin düzenleyici yönetici olarak başlatılmış, ajan ise başlatılmamışsa) ya da ajan bir korumalı alanda çalışır. |

Diğer kodlar daha seyrektir ve her ret, ne olduğunu söyleyen bir ileti taşır.

Düzenleme araçları, `erd_batch` ve dört okuma aracı, bildirmedikleri bir argümanı ya da yanlış türde bir argümanı belgeye dokunmadan önce bir JSON-RPC geçersiz parametre hatasıyla (`-32602`) reddeder, böylece yanlış yazılmış bir argüman asla sessizce yok sayılmaz.
Beş oturum aracı bilmedikleri argümanları yok sayar.
