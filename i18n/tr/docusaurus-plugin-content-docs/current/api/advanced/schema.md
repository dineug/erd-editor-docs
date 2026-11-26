---
sidebar_position: 4
description: .erd.json belge biçimi – bir dosyanın tuttuğu depolama biçimi, TypeScript türleri, her sayısal alanın ardındaki sabitler ve yayımlanan JSON Schema.
---

# Şema

`.erd.json`, düzenleyicinin belge biçimidir. Bir belgeyi düzenleyicinin dışında oluşturmanız, doğrulamanız veya taşımanız gerekiyorsa bu sayfayı okuyun.

Bu sayfa depolama biçimini, yani `4.0.0` sürümünden itibaren her sürümün yazdığı, belgenin bir dosyanın tuttuğu hâlini anlatır. [`editor.value`](../erd-editor-element.md#value) özelliğinin döndürdüğü ve JSON dışa aktarmanın yazdığı biçim budur, yayımlanan [JSON Schema'nın](#json-schema) kabul ettiği tek biçim de budur. `version` değeri, önceki bir sürümün kaydettiği her v3 dosyasında olduğu gibi `'3.0.0'` olur; bu yüzden `version`, eski bir dosyayı yeni bir dosyadan ayırt etmez. `setInitialValue()`, `value` setter'ı ve `setSchemaJSON()` bu biçimi, önceki bir sürümün kaydettiği her dosyayı ve bir v2 `.vuerd` belgesini okur. `4.0.0` sürümünden önce `value`, belgenin düzenleyicinin tuttuğu hâliyle tamamını döndürüyordu; bu yüzden o zaman kaydedilmiş bir dosya daha fazlasını tutar ([Depolama biçimi](#storage-form) bölümüne bakın).  
Bir düzenleyicinin [`runtimeValue`](../erd-editor-element.md#runtimevalue) özelliği, bu sayfanın anlatmadığı başka bir serileştirmedir. Başka bir düzenleyiciyi veya bir replikayı ilk içerikle başlatır ve bir [Yjs odası](./yjs.md#what-the-room-holds) onu anlık görüntüsünde saklar; bir dosyaya asla girmemelidir ve JSON Schema, bir varlık tutan her çalışma zamanı değerini reddeder.

## Depolama biçimi {#storage-form}

Depolama biçimi yalnızca canlı varlıkları tutar: `doc.tableIds` içinde listelenen her tablo, bu tabloların listelediği sütunlar, korunan iki tablo arasındaki ilişkiler, korunan tabloların dizinleri ile bunların sütunu tablonun listesinde hâlâ yer alan dizin sütunları, listelenen notlar ve tablo grupları, `4.2.0` sürümünden itibaren de Sözlük sekmesinin sayfalarındaki, kimlikleri dışında bir değer tutan sözcükler, terimler ve değer alanları. Bir düzenleyicinin yükleme sırasında hesapladığı veya yalnızca açık kaldığı sürece tuttuğu hiçbir şeyi tutmaz: katman sırası, ölçülen genişlikler ve anahtar işaretleri yoktur; bir ilişkinin tanımlayıcı olup olmadığı, üst tablo ucunun nasıl çizildiği ve tablolarıyla nerede buluştuğu da yoktur. Her yükleme bunları dosyanın tuttuklarından yeniden hesaplar.  
Sözlükler dışındaki her koleksiyon kimliklerle anahtarlanır ve kod birimi sırasına göre dizilir; sütunlar önce `tableId` değerine, dizin sütunları önce `indexId` değerine göre gruplanır. `4.2.0` sürümünden itibaren `wordEntities`, `termEntities` ve `domainEntities` diğer tüm koleksiyonlardan sonra bu sırayla gelir ve her biri bir başlık ve satırlar olarak, her satır ayrı bir satırda olmak üzere yazılır ([Sözlük satırları](#dictionary-rows) bölümüne bakın). Her varlık alanlarını sabit bir sırayla yazar, metin iki boşlukla girintilenir ve bir satır sonuyla biter. Bu yüzden aynı belge her zaman aynı baytları yazar, bir düzenleme yalnızca dokunduğu kısmı değiştirir ve başka yazı tiplerinin bulunduğu bir makinede kaydedilen bir dosya aynı `value` değeriyle yeniden açılır.  
VS Code, Obsidian ve JetBrains eklentisi bir dosyayı yalnızca bir düzenleme `value` değerini değiştirdiğinde yazar, bu yüzden önceki bir sürümün kaydettiği bir dosya ilk düzenlemesine kadar eski biçimini korur.

`4.2.0` sürümünden itibaren depolama biçimi hiçbir şey tutmayanları da dışarıda bırakır: bir varlığın veya onun `ui` alanının `''` olarak tuttuğu her metin alanı (bir tablonun `name`, `comment` ve `ui.color` alanları, bir sütunun `name`, `comment`, `dataType` ve `default` alanları, bir dizinin `name` alanı, bir notun `value` ve `ui.color` alanları, bir tablo grubunun `name` ve `color` alanları), hiçbir kayıt tutmayan her `doc` listesi ve koleksiyon, tüm koleksiyonlar boş olduğunda da `collections` alanının kendisi. Yalnızca boşluklardan oluşan metin tutulduğu gibi yazılır; bunun istisnaları, bu durumda dışarıda bırakılan mantıksal ad ile kimliği dışındaki değerlerinin tümü boş olan veya yalnızca boşluklardan oluşan ve tamamen dışarıda bırakılan sözcük, terim veya değer alanıdır. Her kimlik, bir varlığın içindeki her liste ve `0` dahil her sayı yine yazılır. `doc` her zaman yazılır, bu yüzden yeni bir belgenin dosyası `$schema`, `version`, ayarlarını ve `"doc": {}` değerini tutar.  
Ayrıştırma, her v3 sürümünün yaptığı gibi eksik bir metin alanını `''`, eksik bir koleksiyonu da boş olarak okur ve depolama biçimi bir `doc` listesini yalnızca koleksiyonu hiçbir şey tutmadığı sürece dışarıda bırakır ([Doc](#doc) bölümüne bakın). Bu yüzden `4.2.0` sürümünden önceki bir düzenleyici de bu dosyaları açar ve bir dosyayı kendisi okuyan bir program da eksik olanı aynı şekilde okumalıdır. Önceki bir sürümün kaydettiği bir dosya, bir sonraki kaydetmede boş metinleri, listeleri ve koleksiyonları dışarıda bırakılmış olarak geri gelir; bu bir kez yapılan bir değişikliktir ve dosya o andan itibaren bayt bayt aynı kaydedilir.

Depolama biçimi kilitli her ayarı kilitli değeriyle ([`lockSettings`](#settings) bölümüne bakın), `settings.ddlScripts` alanını yalnızca bir betik metin içerirken, bir tablonun veya `5.1.1` sürümünden itibaren bir notun `groupId` alanını ise yalnızca dosyanın yazdığı bir tablo grubunu belirttiği sürece yazar. `4.2.0` sürümünden itibaren `settings.nameViewMode` alanını yalnızca yazdığı değer `'physical'` olmadığı sürece, `settings.columnOrder` alanını mümkün olduğunda yedi kayıtla ([Settings](#settings) bölümüne bakın), bir tablonun `nameDerived` alanını ise yalnızca `true` olduğu sürece yazar.  
`doc.tableGroupIds` ve `tableGroupEntities` alanlarını yalnızca bir tablo grubu varken, bir `logicalName` alanını yalnızca boşluk dışında metin içerdiği sürece, bir sütunun `domainId` alanını yalnızca dosyanın yazdığı bir değer alanını belirttiği sürece, her sözlüğü de yalnızca dosyanın yazdığı bir satırı tuttuğu sürece yazar.

`4.0.0` sürümünden önce kaydedilmiş bir dosya, belgenin o zaman bir düzenleyicinin tuttuğu hâliyle tamamını tutar; kaldırılmış varlıkları ve her yüklemenin hesapladıklarını da içerir. Bir yükleme onu okur, her tablonun ve notun katman sırasındaki yerini korur ([Doc](#doc) bölümüne bakın), gerisini yeniden hesaplar ve sonraki kaydetme yalnızca depolama biçimini yazar.

## TypeScript {#typescript}

Türler depolama biçimini tanımlar ve her biri alanlarını bir dosyanın yazdığı sırayla listeler. `?` ile işaretlenen bir alan, [Depolama biçimi](#storage-form) bölümünde ayrıntılandığı gibi depolama biçiminin dışarıda bırakabileceği bir alandır ve ayrıştırma, eksik olanı hiçbir şey tutmuyormuş gibi okur: `''`, `false`, tablo grubu veya değer alanı yok, boş bir koleksiyon, `nameViewMode` için `'physical'` ve `ddlScripts` için iki boş betik. İstisna, ayrıştırmanın koleksiyonundan doldurduğu eksik bir `doc` listesidir ([Doc](#doc) bölümüne bakın). Bir sözlük satırında `?`, satırın kendilerinden önce bitebileceği değerleri işaretler ([Sözlük satırları](#dictionary-rows) bölümüne bakın). Diğer her alan her zaman yazılır.

### ERDEditorSchemaV3 {#erdeditorschemav3}

```ts
type ERDEditorSchemaV3 = {
  $schema: 'https://raw.githubusercontent.com/dineug/erd-editor/main/json-schema/schema.json';
  version: '3.0.0';
  settings: Settings;
  doc: Doc;
  collections?: {
    tableEntities?: Record<string, Table>;
    tableColumnEntities?: Record<string, Column>;
    relationshipEntities?: Record<string, Relationship>;
    indexEntities?: Record<string, Index>;
    indexColumnEntities?: Record<string, IndexColumn>;
    memoEntities?: Record<string, Memo>;
    tableGroupEntities?: Record<string, TableGroup>;
    wordEntities?: DictionaryRows; // rows of Word
    termEntities?: DictionaryRows; // rows of Term
    domainEntities?: DictionaryRows; // rows of Domain
  };
};
```

Her varlığın, onu koleksiyonunda anahtarlayan opak bir dize olan bir `id` değeri vardır; bunun istisnası, kimliğin bir satırın ilk değeri olduğu üç sözlüktür. `4.2.0` sürümünden itibaren ayrıştırma, anahtarlı yedi koleksiyonda `id` değeri eksik, boş veya dize olmayan bir varlığı tutulduğu anahtarla okur; nesne olmayan bir kaydı ya da kimliği olmayan ve anahtarı `''` olan bir kaydı ise atar. Bir sözlük satırı, dizi değilse veya `id` değeri `''` dışında bir dize değilse atılır. `4.2.0` sürümünden önceki bir düzenleyici `id` değeri eksik veya boş olan bir varlığı atar, bu yüzden depolama biçimi yine her kimliği yazar.  
`4.0.0` sürümünden itibaren, bir sözlük satırınınki dahil, her yeni kimlik `03gzrxjv20bdlcak89q25d2m7` gibi küçük harfle yazılmış 25 adet 36 tabanlı basamaktan oluşan, Uuid25 biçiminde yazılmış bir UUIDv7'dir, bu yüzden bir düzenleyicinin ürettiği kimlikler onları ürettiği sırayla sıralanır. Bir belge, önceki bir sürümün nanoid kimlikleri veya bir v2 dosyasının kimlikleri gibi tuttuğu kimlikleri korur, bu yüzden hiçbir şey bir kimliğin yapısına dayanmamalıdır.

`4.0.0` sürümünden itibaren hiçbir varlık bir `meta` nesnesi (`createAt`, `updateAt`) taşımaz ve `EntityMeta` ile `EntityType` türleri kaldırıldı. Hiçbir şey onu yazmaz, ayrıştırma daha eski bir dosyanın taşıdığı `meta` nesnesini atar ve JSON Schema onu reddeder. Bu nesne yalnızca kaldırılmış varlıkların çöp toplanmasını zamanlıyordu ve çöp toplama da artık yok.

### Settings {#settings}

```ts
type Settings = {
  originX: number;
  originY: number;
  zoomLevel: number;
  show: number; // Constants: Show
  database: number; // Constants: Database
  databaseName: string;
  canvasType: string; // Constants: CanvasType
  language: number; // Constants: Language
  tableNameCase: number; // Constants: NameCase
  columnNameCase: number; // Constants: NameCase
  bracketType: number; // Constants: BracketType
  relationshipDataTypeSync: boolean;
  columnOrder: number[]; // Constants: ColumnType
  maxWidthComment: number;
  lockSettings: number; // Constants: LockSettingType
  ddlScripts?: DDLScripts;
  nameViewMode?: string; // Constants: NameViewMode
};

type DDLScripts = {
  before: string;
  after: string;
};

// Constants
const CanvasType = {
  ERD: 'ERD',
  visualization: '@dineug/erd-editor/builtin-visualization',
  schemaSQL: '@dineug/erd-editor/builtin-schema-sql',
  generatorCode: '@dineug/erd-editor/builtin-generator-code',
  settings: 'settings',
  dictionary: '@dineug/erd-editor/builtin-dictionary',
} as const;

const Show = {
  tableComment: 1,
  columnComment: 2,
  columnDataType: 4,
  columnDefault: 8,
  columnAutoIncrement: 16,
  columnPrimaryKey: 32,
  columnUnique: 64,
  columnNotNull: 128,
  relationship: 256,
  columnAlternateKey: 512,
  hideReferentialAction: 1024,
  hideTableGroup: 2048,
  hideMemo: 4096,
  columnDomain: 8192,
} as const;

const ColumnType = {
  columnName: 1,
  columnDataType: 2,
  columnNotNull: 4,
  columnUnique: 8,
  columnAutoIncrement: 16,
  columnDefault: 32,
  columnComment: 64,
  columnLogicalName: 128,
  columnDomain: 256,
} as const;

const Database = {
  MariaDB: 1,
  MSSQL: 2,
  MySQL: 4,
  Oracle: 8,
  PostgreSQL: 16,
  SQLite: 32,
  Databricks: 64,
  Snowflake: 128,
} as const;

const Language = {
  GraphQL: 1,
  csharp: 2,
  Java: 4,
  Kotlin: 8,
  TypeScript: 16,
  JPA: 32,
  Scala: 64,
  Go: 128,
  SQLAlchemy: 256,
  TypeORM: 512,
  Sequelize: 1024,
  Drizzle: 2048,
  DBML: 4096,
  AML: 8192,
  Mermaid: 16384,
  PHP: 32768,
  Doctrine: 65536,
  Rust: 131072,
  SeaORM: 262144,
  Swift: 524288,
  Zod: 1048576,
  JSONSchema: 2097152,
} as const;

const NameCase = {
  none: 1,
  camelCase: 2,
  pascalCase: 4,
  snakeCase: 8,
} as const;

const BracketType = {
  none: 1,
  doubleQuote: 2,
  singleQuote: 4,
  backtick: 8,
} as const;

const LockSettingType = {
  viewport: 1, // originX, originY and zoomLevel
  canvasType: 2,
  language: 4,
  tableNameCase: 8,
  columnNameCase: 16,
  bracketType: 32,
  unlockNameViewMode: 64, // nameViewMode; set while unlocked
} as const;

const NameViewMode = {
  physical: 'physical',
  logical: 'logical',
  both: 'both',
} as const;
```

`originX` ve `originY` görünümdür: sahnedeki `(0, 0)` noktasının denk geldiği ekran noktası.  
`zoomLevel`, `0.1` ile `1.5` arasında değişir. `1` değerinin üzerinde kaydedilmiş bir belge, `3.5.0` sürümünden önceki bir düzenleyicide `1` değerinde açılır.  
`4.0.0` sürümünden itibaren ayarlar `width`, `height`, `scrollTop`, `scrollLeft`, `relationshipOptimization` veya `ignoreSaveSettings` alanlarını taşımaz. Hiçbir şey onları yazmaz, ayrıştırıcı hiçbirini korumaz ve JSON Schema hâlâ bunları içeren bir dosyayı reddeder.

`canvasType`, bir belgenin açıldığı sekmedir. Görselleştirme sekmesinde kaydedilen bir belge `'@dineug/erd-editor/builtin-visualization'` değerini tutar ancak `Graph` modunun mu yoksa `Flow` modunun mu gösterildiğini tutmaz, yeni oluşturulan bir düzenleyici de bu sekmeyi `Graph` modunda gösterir.  
`4.0.0` sürümünden itibaren, yeni bir belgede olduğu gibi `Canvas Type` kilidi etkin olduğu sürece belge, kilitlendiği sırada gösterilen sekmeyi korur ve sekme değiştirmek `value` değerini olduğu gibi bırakır. Ayarlar sekmesindeyken konan bir kilit oraya geldiğiniz sekmeyi tutar, yalnızca elle düzenlemenin yazabildiği kilitli bir `'settings'` değeri ise `'ERD'` sekmesinde açılır.  
`4.2.0` sürümünden itibaren `canvasType`, `Canvas Type` kilidinin diğerlerini tuttuğu gibi tuttuğu [Sözlük](../../guide/guides/dictionary.md) sekmesi olan `'@dineug/erd-editor/builtin-dictionary'` değerini de alabilir. `4.2.0` sürümünden önceki bir düzenleyici bu değeri korur, ancak okuyucu bir sekme seçene kadar araç çubuğunun altında hiçbir sekme göstermez.  
`Flow` modunun kendi durumu hiç serileştirilmez: Yerleştirme, yakınlaştırma, kaydırma, satır görünümü ve odaklanılan tablolar düzenleyicide kalır, `4.2.0` sürümünden itibaren [`Previous table` ve `Next table`](../../guide/guides/visualization.md#previous-table-and-next-table) düğmelerinin aralarında adım adım ilerlediği görünümler de öyle. Bu yüzden `originX`, `originY` ve `zoomLevel` her zaman ERD tuvalini tanımlar.

`show` ve `lockSettings` bit maskeleridir – bayrakları OR ile birleştirin.  
`columnOrder`, her `ColumnType` değerini birer kez, görüntülenme sırasıyla tutan bir dizidir; `4.2.0` sürümünden itibaren bir belge, aşağıdaki sütun sırası paragrafında anlatıldığı gibi onu dokuz değerden yedisiyle yazabilir.  
`database`, `language`, `tableNameCase`, `columnNameCase` ve `bracketType` alanlarının her biri tam olarak tek bir değer tutar ve JSON Schema birleştirilmiş bir değeri reddeder.

Yeni bir belgenin `show` değeri `431` olur: `tableComment`, `columnComment`, `columnDataType`, `columnDefault`, `columnPrimaryKey`, `columnNotNull` ve `relationship`.  
`3.10.0` sürümünden itibaren, ikisi de yeni bir belgede ve `3.10.0` sürümünden önce kaydedilen her belgede kapalı olan iki `show` bayrağı daha vardır.  
`columnAlternateKey` (`512`), [`Alternate Key`](../../guide/guides/table-related-functions.md#alternate-keys) görünüm seçeneğidir. Ayarlandığında, iki veya daha fazla sütun üzerindeki her benzersiz dizinin sütunlarını `AK1.1`, `AK1.2` vb. olarak işaretler. Başlangıçta kapalıdır, bu yüzden mevcut hiçbir diyagramın genişliği değişmez.  
`hideReferentialAction` (`1024`) tersine çalışır: Ayarlandığında bağlantı çizgilerindeki [ON DELETE ve ON UPDATE etiketlerini](../../guide/guides/relationship-editing.md#reading-a-connector) gizler, bu yüzden etiketler varsayılan olarak gösterilir. `Referential Actions` görünüm seçeneği, bayrak kapalıyken işaretlidir. Hiçbir tablonun boyutunu değiştirmez.  
`3.10.0` sürümünden önceki bir düzenleyici `show` değerini bir tam sayı olarak korur, bu yüzden iki bayrak da orada yapılan bir kaydetmeden sonra korunur.

`4.0.0` sürümünden itibaren, ikisi de yeni bir belgede ve `4.0.0` sürümünden önce kaydedilen her belgede kapalı olan iki `show` bayrağı daha vardır. `hideReferentialAction` bayrağı gibi her biri adının belirttiği şeyi gizler, bu yüzden tablo grupları ve notlar varsayılan olarak gösterilir.  
`hideTableGroup` (`2048`) [tablo gruplarını](../../guide/guides/table-groups.md), `hideMemo` (`4096`) ise her notu gizler. Bunlar `Table Groups` ve `Memos` [görünüm seçenekleridir](../../guide/guides/table-related-functions.md#table-view-options) ve her biri kendi bayrağı kapalıyken işaretlidir. İkisi de hiçbir tablonun boyutunu değiştirmez.  
`4.0.0` sürümünden önceki bir düzenleyici `show` değerini bir tam sayı olarak korur, bu yüzden iki bayrak da orada yapılan bir kaydetmeden sonra korunur.

`4.2.0` sürümünden itibaren, yeni bir belgede ve `4.2.0` sürümünden önce kaydedilen her belgede kapalı olan bir `show` bayrağı daha vardır: `columnDomain` (`8192`); bu yüzden yeni bir belgenin `show` değeri yine `431` olur. Bu bayrak `Domain` [görünüm seçeneğidir](../../guide/guides/table-related-functions.md#table-view-options): Ayarlandığında her sütun satırı, tabloları genişleten bir [değer alanı hücresi](../../guide/guides/logical-names.md#the-domain-cell) gösterir. Başlangıçta kapalıdır, bu yüzden mevcut hiçbir diyagramın genişliği değişmez.  
`4.2.0` sürümünden önceki bir düzenleyici `show` değerini bir tam sayı olarak korur, bu yüzden bayrak orada yapılan bir kaydetmeden sonra korunur.

`4.2.0` sürümünden itibaren `ColumnType` sabitinin dokuz değeri vardır. `columnLogicalName` (`128`), bir sütun satırının yalnızca `Both Names` görünümünde gösterdiği mantıksal ad hücresinin, `columnDomain` (`256`) ise değer alanı hücresinin yerini belirler. Bunlar Ayarlar sekmesindeki [sütun sırasının](../../guide/guides/settings.md#adjusting-column-order) `Logical Name` ve `Domain` satırlarıdır. Bir düzenleyici dokuzunun tümünden oluşan bir sıra tutar ve yeni bir belgenin sırası `128, 1, 2, 256, 4, 8, 16, 32, 64` olur.  
Depolama biçimi sırayı `128` değeri `columnName` değerinin hemen önünde, `256` değeri de `columnDataType` değerinin hemen ardında durduğu sürece `128` ve `256` değerlerini dışarıda bırakarak yedi kayıtla yazar. Bu yüzden yeni bir belge yine `1, 2, 4, 8, 16, 32, 64` yazar ve sırası bu ikisinin yerini hiç değiştirmemiş bir dosya baytlarını korur. Aksi hâlde dokuzunu da yazar.  
Ayrıştırma, yedisi hangi sırada olursa olsun bu ikisini yedi kayıtlı bir sıranın bu yerlerine yerleştirir ve her türü tutan dokuz kaydı olduğu gibi alır.  
`5.0.0` sürümünden itibaren başka her sırayı da kabul eder. Bildiği her `ColumnType` değerini verilen sırayla birer kez tutar ve diğer her kaydı atar: hiçbir `ColumnType` değerinin adlandırmadığı bir değeri, örneğin sonraki bir sürümün eklediği bir türü ve aynı türün ikinci kaydını. Sıranın içermediği her tür, varsayılan sırada kendisinden önce gelen ve sıranın tuttuğu en yakın türün hemen ardına, onun öncesinde böyle bir tür yoksa kendisinden sonra gelen en yakın türün hemen önüne yerleşir; `128` ve `256` değerleri yedi kayıtta yerlerini böyle bulur. Yalnızca bildiği hiçbir türü adlandırmayan bir sıra ya da dizi olmayan bir değer varsayılan sıra olarak okunur.  
Bu yüzden sonraki bir sürümün kaydettiği dosya, bu sürümün bildiği türlerin sırasıyla açılır ve burada yapılan bir kayıt o sırayı diğer türler olmadan yazar. `5.0.0` sürümünden önce ayrıştırma başka her sırayı varsayılan sıra olarak okuyordu, bu yüzden böyle bir dosya sütun sırası sıfırlanmış olarak açılırdı. JSON Schema yedi veya dokuz tam sayı kabul eder.

`4.0.0` sürümünden itibaren `Language` sabitinde `Mermaid` ile `JSONSchema` arasındaki sekiz [Kod oluşturucu](../../guide/guides/code-generator.md) hedefi daha vardır. Ayrıştırıcının tanımadığı bir `language` değeri `GraphQL` olarak okunur, bu yüzden `4.0.0` sürümünden önceki bir düzenleyici bunlardan biriyle kaydedilmiş bir belgeyi GraphQL seçili olarak açar ve orada kaydetmek GraphQL yazar.

`4.0.0` sürümünden itibaren `lockSettings`, `ignoreSaveSettings` alanının, `LockSettingType` de kaldırılan `SaveSettingType` sabitinin yerini alır. `lockSettings`, bir belgenin kilitlendikleri andaki hâlleriyle kaydettiği ayarları belirtir. `viewport` biti `originX`, `originY` ve `zoomLevel` alanlarını birlikte kapsar, çünkü yakınlaştırması olmadan kaydedilen bir başlangıç noktası başka bir yerde açılır, diğer her bit ise adını aldığı alanı kapsar. Bunlar, Ayarlar sekmesindeki [`Lock`](../../guide/guides/settings.md#lock) satırlarıdır.  
Bir dosya kilitli her ayarı, düzenleyici ne gösterirse göstersin kilitli değeriyle, diğer her ayarı ise o anki hâliyle tutar. Bu yüzden ilgili kilit etkin olduğu sürece kaydırmak ve yakınlaştırmak, sekme değiştirmek, Kod oluşturucu dilini, bir ad biçimini veya tırnak türünü değiştirmek ya da Ad görünümünü değiştirmek dosyayı olduğu gibi bırakır. Kilitleme, ayarın o anda tuttuğu değeri alır, ayrıştırma ise kilitli değeri kaydedilmiş alandan alır.  
Sıfırdan başlatılan bir belgede – yeni bir düzenleyici veya replikasyon deposu ya da `value` setter'ına veya `setInitialValue()` yöntemine verilen boş bir değer – `lockSettings` değeri `63` olur, yani tüm kilitler etkindir. `settings` alanında `lockSettings` bulunmayan bir belge de – `ignoreSaveSettings` değeri ne olursa olsun `4.0.0` sürümünden önce kaydedilen her dosya ve her v2 belgesi – tüm kilitler etkin olarak açılır: Görünümü ve sekmesi yeni bir belgeninkilerle aynıdır (`originX` ve `originY` `0`, `zoomLevel` `1`, ERD sekmesi), dili, ad biçimleri ve tırnak türü ise kaydettiği değerlerde kilitlenir. Kilitlerini belirten bir belge, `0` dahil bu kilitleri ve kaydettiği her değeri korur.  
Ayrıştırma, bilinmeyenler dahil `lockSettings` değerinin her bitini korur, bu yüzden sonraki bir sürümün eklediği bir kilit burada yapılan bir kaydetmeden sonra da korunur; JSON Schema yalnızca bunun bir tam sayı olduğunu denetler. `4.0.0` sürümünden önceki bir düzenleyici kaydederken `lockSettings` alanını atar ve görünümü ile sekmeyi o anki hâlleriyle yazar, bu yüzden dosya burada yeniden `4.0.0` sürümünden önce kaydedilmiş bir dosya gibi açılır.

`4.2.0` sürümünden itibaren yedinci bir kilit vardır: `nameViewMode` alanını kapsayan `Name View` satırı olan `unlockNameViewMode` (`64`). Bu bit, `Show` sabitinin gizleme bitlerinde olduğu gibi diğer kilit bitlerinin tersine okunur: Ayarlıyken Ad görünümü kilitsizdir, temizken kilitlidir. Bu yüzden `63` yine tüm kilitlerin etkin olduğu anlamına gelir ve yeni bir belge, Ad görünümü `'physical'` değerinde kilitli olarak bu değeri tutar. `4.2.0` sürümünden önce kaydedilmiş bir dosya, `0` dahil diğer kilitleri ne olursa olsun bu biti temiz tutar; bu yüzden Ad görünümü `'physical'` değerinde kilitli olarak açılır. Tüm kilitleri devre dışı olan bir belge `64`, Ad görünümü kilitsiz ve diğer tüm kilitleri etkin olan bir belge ise `127` tutar. Bu kilidi ters olarak sınayın: `(lockSettings & 64) === 0` olduğu sürece etkindir.  
Bit temizken bir dosya `nameViewMode` değerini, herhangi bir düzenleyici ne gösterirse göstersin kilitli görünümde, ayarlıyken ise o anki hâliyle tutar. Her düzenleyicinin kilit etkinken ve devre dışıyken ne gösterdiği [`Lock`](../../guide/guides/settings.md#lock) bölümünde anlatılır.  
`4.0.0` veya `4.1.0` sürümünün düzenleyicisi kaydetme sırasında biti korur ancak `nameViewMode` alanını atar; bu yüzden belge burada, kilidi olduğu gibi kalarak `'physical'` değeriyle yeniden açılır.

`4.0.0` sürümünden itibaren `ddlScripts`, her veritabanının DDL'inin yazdığı [Şema SQL](../../guide/guides/schema-sql.md) sekmesindeki iki betiği tutar: `before` başlıktan sonra ve tablolardan önce, `after` oluşturulan DDL'in ardından yazılır. DDL, [Önceki ve sonraki betikler](../../guide/guides/schema-sql.md#before-and-after-scripts) bölümünde anlatıldığı gibi her birini LF satır sonlarıyla, baştaki boş satırları ve sondaki boşluk karakterleri olmadan ve MSSQL'de `GO` ile bitirerek yazar; `ddlScripts` ise her betiği girildiği gibi korur. Anahtar yalnızca betiklerden herhangi biri metin içerirken yazılır ve o durumda iki betik de yazılır; eksik bir anahtar veya dize olmayan bir betik `''` olarak okunur. Sekmenin `Statements`, `Header` ve `Tables` seçimleri ile `4.2.0` sürümünden itibaren [`Write logical names into empty comments`](../../guide/guides/schema-sql.md#logical-names-as-comments) anahtarı belgeye kaydedilmez.  
`4.0.0` sürümünden önceki bir düzenleyici bir belgeyi yüklerken betikleri atar, bu yüzden orada kaydedildiğinde betikler kaybolur.

`4.2.0` sürümünden itibaren `nameViewMode`, diyagramın gösterdiği adları belirleyen [Ad görünümü](../../guide/guides/logical-names.md#name-view) ayarıdır: `'physical'` her tablonun ve sütunun adını, `'logical'` adın yerinde mantıksal adını, `'both'` ise mantıksal adı ve adı gösterir. Menüler bunları `Physical Names`, `Logical Names` ve `Both Names` olarak adlandırır. Depolama biçimi bu alanı en sona, `ddlScripts` alanından sonra ve yalnızca yazdığı değer `'physical'` olmadığı sürece yazar. Eksik bir değer veya ayrıştırıcının tanımadığı bir değer `'physical'` olarak okunur ve JSON Schema yalnızca `"logical"` ve `"both"` değerlerini kabul eder.  
`4.2.0` sürümünden önceki bir düzenleyici bir belgeyi yüklerken `nameViewMode` alanını atar.

`Database`, `Language`, `Show`, `ColumnType`, `ColumnOption`, `LockSettingType` ve `ReferentialAction` yalnızca sona eklenen sabitlerdir. Kaydedilmiş bir belge sayıyı sakladığı için yeni bir veritabanı sistemi, kod oluşturma hedefi, bayrak, sütun türü, sütun seçeneği, kilit veya eylem ortadan bir yer almak yerine bir sonraki biti alır.

### Doc {#doc}

```ts
type Doc = {
  tableIds?: string[];
  relationshipIds?: string[];
  indexIds?: string[];
  memoIds?: string[];
  tableGroupIds?: string[];
};
```

Her liste bir varlık türünün sırasıdır ve DDL, tablo sıralaması ve çizim sırası bu sırayı okur. Her biri yalnızca dosyanın yazdığı varlıkların kimliklerini, her birini bir kez ve listelendiği sırayla tutar; `4.2.0` sürümünden itibaren hiçbir kimlik tutmayan bir liste dışarıda bırakılır. `4.0.0` sürümünden itibaren `tableGroupIds`, tablo gruplarının sırasıdır. Sözlüklerin burada listesi yoktur, çünkü satırları her sayfanın sırasıyla durur ([Sözlük satırları](#dictionary-rows) bölümüne bakın) ve JSON Schema `doc` içinde başka hiçbir anahtarı kabul etmez.

`4.2.0` sürümünden itibaren ayrıştırma, belgenin dışarıda bıraktığı veya dizi dışında bir şey olarak tuttuğu bir listeyi, koleksiyonunun tuttuğu her kayıt olarak, her kimlik bir kez ve tutulduğu sırayla okur; boş bir dizi boş kalır ve koleksiyonunun her kaydı bu durumda kaldırılmış olarak okunur. `4.2.0` sürümünden önceki bir düzenleyici eksik bir listeyi boş olarak okur, bu yüzden depolama biçimi koleksiyonu bir varlık tuttuğu her durumda listeyi yine yazar.

`4.0.0` sürümünden itibaren bir dosya katman sırası tutmaz. Bir yükleme listelenmiş tabloları ve notları listelerindeki yerlerine göre, sonrakiler önde ve her not her tablonun üstünde olacak şekilde, tablo gruplarını da kendi aralarında aynı şekilde, tabloların arkasında olacak biçimde üst üste dizer. `4.0.0` sürümünden önce kaydedilmiş bir dosyadaki bir tablo veya not, `ui` alanında bir `zIndex` taşır; yükleme bunu katman sırasındaki yeri olarak korur ve sonraki kaydetme dışarıda bırakır. Bu yüzden bir tabloyu veya notu öne getirmek, dosya yeniden açıldığında kaybolur.

### Koleksiyon: tableEntities {#collection-tableentities}

```ts
type Table = {
  id: string;
  name?: string;
  logicalName?: string;
  comment?: string;
  columnIds: string[];
  groupId?: string;
  nameDerived?: true;
  ui: TableUI;
};

type TableUI = {
  x: number;
  y: number;
  color?: string;
};
```

`4.0.0` sürümünden itibaren bir tablo, ait olduğu [tablo grubunun](../../guide/guides/table-groups.md) kimliği olan `groupId` alanını taşır. Eksik veya boş bir `groupId` ya da `doc.tableGroupIds` içinde hiçbir grubu belirtmeyen bir `groupId` grup olmadığı anlamına gelir ve depolama biçimi bu alanı yalnızca korunan bir grubu belirttiği sürece yazar.

`4.2.0` sürümünden itibaren bir tablo, `Logical Names` ve `Both Names` [görünümlerinin](../../guide/guides/logical-names.md#name-view) gösterdiği ad olan `logicalName` alanını (ad yoksa `''`) ve sözlükler `name` değerini mantıksal addan [türettiği](../../guide/guides/dictionary.md#deriving-physical-names) sürece `true` olan `nameDerived` alanını taşır. Bu alan ayarlıyken yeni bir mantıksal ad, adı yeniden türetir; ayarlı değilken ad birinin kendi yazdığı addır ve yeni bir mantıksal ad, ad boş olmadıkça veya yalnızca boşluklardan oluşmadıkça ona dokunmaz. Elle yeniden adlandırma bu alanı kapatır; [`Derive Physical Names Again`](../../guide/guides/dictionary.md#derive-physical-names-again) ise birinin yazdığı bir adı bile yeniden yazar ve mantıksal ad bulunan her yerde bu alanı açar.  
Depolama biçimi `logicalName` alanını `name` alanından sonra, girildiği gibi ve yalnızca boşluk dışında metin içerdiği sürece, `nameDerived` alanını ise `groupId` alanından sonra ve yalnızca JSON Schema'nın kabul ettiği tek değer olan `true` değerini taşıdığı sürece yazar. Eksik bir `logicalName` alanı `''`, eksik bir `nameDerived` alanı ise `false` olarak okunur; bu yüzden `4.2.0` sürümünden önce kaydedilmiş bir dosyadaki her ad, birinin kendi yazdığı ad sayılır.  
`4.2.0` sürümünden önceki bir düzenleyici bir belgeyi yüklerken ikisini de atar, bu yüzden orada kaydedildiğinde her tablonun mantıksal adı kaybolur.

### Koleksiyon: tableColumnEntities {#collection-tablecolumnentities}

```ts
type Column = {
  id: string;
  tableId: string;
  name?: string;
  comment?: string;
  dataType?: string;
  default?: string;
  options: number; // Constants: ColumnOption
  logicalName?: string;
  domainId?: string;
};

// Constants
const ColumnOption = {
  autoIncrement: 1,
  primaryKey: 2,
  unique: 4,
  notNull: 8,
  nameDerived: 16,
} as const;
```

`4.0.0` sürümünden itibaren bir dosya anahtar işareti tutmaz: her yükleme bir sütunu `options` alanının `primaryKey` bitinden birincil anahtar olarak, tablosunda bir ilişki o sütunda bittiği sürece de yabancı anahtar olarak işaretler.  
`4.0.0` sürümünden önceki bir düzenleyici, burada kaydedilmiş bir dosyanın sütunlarını birincil anahtar simgeleri olmadan gösterir.

`4.2.0` sürümünden itibaren bir sütun, bir tablo gibi `logicalName` alanını ve bağlandığı değer alanının kimliği olan `domainId` alanını (bağlantı yoksa `''`) taşır. Tek bir düzenleyicideki düzenlemeler, [Değer alanları ve veri türleri](../../guide/guides/dictionary.md#domains-and-data-types) bölümünde anlatıldığı gibi bağlı bir sütunu değer alanının veri türünde tutar. Ancak ayrıştırma hiçbir sütunun türünü yeniden ayarlamaz, bu yüzden başka bir yerde yazılmış bir dosya bağlı bir sütunu başka bir türde bırakabilir; iki ortak çalışanın çapraz düzenlemeleri de bunu yapabilir. Denetimler sayfası her birini [`Domain type mismatch`](../../guide/guides/dictionary.md#what-each-check-finds) olarak listeler. Ayrıştırma, dosyanın tuttuğu hiçbir değer alanını belirtmeyen bir `domainId` değerini temizler. Depolama biçimi `options` alanından sonra `logicalName` alanını tablodaki kurala göre, `domainId` alanını ise yalnızca dosyanın yazdığı bir değer alanını belirttiği sürece yazar; bu yüzden kaldırılmış bir değer alanına veya dosyanın dışarıda bıraktığı bir değer alanına bağlı bir sütun, bağlantı olmadan ve tuttuğu veri türüyle yazılır.  
`ColumnOption.nameDerived` (`16`), sütunun türetilmiş ad bayrağıdır; diğer bitlerle birlikte `options` içinde tutulur ve bir tablonun `nameDerived` alanıyla aynı anlama gelir. Örneğin adını sözlüklerin türettiği, NULL olamayan bir birincil anahtarın `options` değeri `26` olur.  
`4.2.0` sürümünden önceki bir düzenleyici bir belgeyi yüklerken `logicalName` ve `domainId` alanlarını atar, bu yüzden orada kaydedildiğinde bunlar kaybolur. `options` değerini bir tam sayı olarak korur, bu yüzden `nameDerived` biti orada yapılan bir kaydetmeden sonra korunur.

### Koleksiyon: relationshipEntities {#collection-relationshipentities}

```ts
type Relationship = {
  id: string;
  relationshipType: number; // Constants: RelationshipType
  onDelete: number; // Constants: ReferentialAction
  onUpdate: number; // Constants: ReferentialAction
  start: RelationshipPoint;
  end: RelationshipPoint;
};

type RelationshipPoint = {
  tableId: string;
  columnIds: string[];
};

// Constants
const RelationshipType = {
  ZeroOne: 2,
  ZeroN: 4,
  OneOnly: 8,
  OneN: 16,
} as const;

const ReferentialAction = {
  none: 1,
  noAction: 2,
  cascade: 4,
  setNull: 8,
  setDefault: 16,
  restrict: 32,
} as const;
```

`3.10.0` sürümünden itibaren bir ilişki, kendi [ON DELETE ve ON UPDATE eylemlerini](../../guide/guides/relationship-editing.md#on-delete-and-on-update) belirten `onDelete` ve `onUpdate` alanlarını taşır. Her biri tam olarak tek bir `ReferentialAction` değeri tutar. Varsayılan değer olan `none` hiçbir yan tümce yazmaz, bu yüzden veritabanının kendi varsayılanı uygulanır. Diğer beşi `NO ACTION`, `CASCADE`, `SET NULL`, `SET DEFAULT` ve `RESTRICT` anlamına gelir. Şema SQL bir yan tümceyi yalnızca o eylemi kabul eden bir veritabanı için yazar.  
Depolama biçimi her zaman ikisini de yazar ve `4.0.0` sürümünden itibaren JSON Schema ikisini de zorunlu tutar, ancak yalnızca her birinin bir tam sayı olduğunu denetler. Ayrıştırma, `3.10.0` sürümünden önce kaydedilen her belgede olduğu gibi eksik bir alanı hâlâ `none` olarak okur, listenin dışındaki bir değeri de öyle.  
`3.10.0` sürümünden önceki bir düzenleyici bu alanları tanımaz ve bir belgeyi yüklerken onları atar, bu yüzden orada kaydedildiğinde tüm eylemler kaybolur.

`4.0.0` sürümünden itibaren her yükleme, bir ilişkinin tanımlayıcı olup olmadığını ve üst tablo ucunun nasıl çizildiğini, bittiği sütunlardan alt tablonun hâlâ listelediklerine bakarak okur. Bu tür her sütun birincil anahtar olduğu sürece tanımlayıcıdır, yani düz çizgidir; bu tür her sütun NOT NULL olduğu sürece üst tablo ucu iki çubuktur, aksi hâlde bir halka ve bir çubuktur. Böyle bir sütunu kalmamış bir ilişki, yeni bir ilişkinin başlangıçta olduğu gibi iki çubuklu, tanımlayıcı olmayan bir ilişkidir. [Bağlantı çizgisini okuma](../../guide/guides/relationship-editing.md#reading-a-connector) bölümüne bakın.

### Koleksiyon: indexEntities {#collection-indexentities}

```ts
type Index = {
  id: string;
  name?: string;
  tableId: string;
  indexColumnIds: string[];
  unique: boolean;
};
```

### Koleksiyon: indexColumnEntities {#collection-indexcolumnentities}

```ts
type IndexColumn = {
  id: string;
  indexId: string;
  columnId: string;
  orderType: number; // Constants: OrderType
};

// Constants
const OrderType = {
  ASC: 1,
  DESC: 2,
} as const;
```

### Koleksiyon: memoEntities {#collection-memoentities}

```ts
type Memo = {
  id: string;
  value?: string;
  groupId?: string;
  ui: MemoUI;
};

type MemoUI = {
  x: number;
  y: number;
  width: number;
  height: number;
  color?: string;
};
```

`4.0.0` sürümünden itibaren tablolar ve notlar [tek bir katman sırasını paylaşır](../../guide/guides/table-related-functions.md#moving-multiple-tables), bu yüzden bir tabloyu öne getirmek onu bir notun üstüne yerleştirebilir. Bir yükleme, [Doc](#doc) bölümünde anlatıldığı gibi her notu her tablonun üstüne yerleştirir. `4.0.0` sürümünden önce kaydedilmiş bir dosyadaki bir not, kaydettiği `zIndex` değerini korur; bu değer tablolarınkiyle aynı sayaçtan geldiği için önceki bir sürümün her tablonun üstüne çizdiği bir not, kendisinden sonra öne getirilmiş bir tablonun altında açılabilir.

`5.1.1` sürümünden itibaren bir not, bir tablo gibi, ait olduğu [tablo grubunun](../../guide/guides/table-groups.md) kimliği olan `groupId` alanını taşır. Eksik veya boş bir `groupId` (`5.1.1` sürümünden önce kaydedilmiş her dosyada olduğu gibi) ya da `doc.tableGroupIds` içinde hiçbir grubu belirtmeyen bir `groupId` grup olmadığı anlamına gelir ve depolama biçimi bu alanı yalnızca korunan bir grubu belirttiği sürece yazar.  
`5.1.1` sürümünden önceki bir düzenleyici bir belgeyi yüklerken her notun `groupId` alanını atar, bu yüzden orada kaydetmek her notu grubundan çıkarır; ancak `4.0.0` ve sonrasındaki bir düzenleyici tabloların gruplarını korur. [Sürümleri karıştırma](./collaborative-editing.md#mixing-releases) bölümüne bakın.

### Koleksiyon: tableGroupEntities {#collection-tablegroupentities}

```ts
type TableGroup = {
  id: string;
  name?: string;
  color?: string;
  ui: TableGroupUI;
};

type TableGroupUI = {
  x: number;
  y: number;
  width: number;
  height: number;
};
```

`4.0.0` sürümünden itibaren bir belge [tablo grupları](../../guide/guides/table-groups.md) tutabilir: tabloların ve notların arkasına çizilen, adı ve rengi olan dikdörtgenler. Bir tablo ve `5.1.1` sürümünden itibaren bir not bir gruba kendi `groupId` alanı aracılığıyla katılır, bu yüzden bir grup üye listesi tutmaz. Depolama biçimi bu koleksiyonu, `doc.tableGroupIds` gibi, yalnızca bir grup varken yazar ve `4.0.0` sürümünden önce kaydedilmiş bir belge gibi bu koleksiyonu içermeyen bir belgede grup yoktur. `Show.hideTableGroup` bayrağı grupları gizler.  
`4.0.0` sürümünden önceki bir düzenleyici bir belgeyi yüklerken grupları ve her tablonun `groupId` alanını atar, bu yüzden orada kaydedildiğinde tüm gruplar kaybolur.

### Sözlük satırları {#dictionary-rows}

`4.2.0` sürümünden itibaren bir belge, [Sözlük](../../guide/guides/dictionary.md) sekmesinin `Words`, `Terms` ve `Domains` sayfaları olan üç sözlüğü `wordEntities`, `termEntities` ve `domainEntities` içinde tutar. Bir sözcüğün, terimin veya değer alanının her alanı bir dizedir ve hiçbirinin `ui` alanı yoktur. `Checks` sayfası sözlüklerden ve diyagramdan hesaplanır ve kaydedilmez.

```ts
type DictionaryRows = {
  fields: string[];
  rows: string[][];
};
```

Üçünden hiçbiri kimlikle anahtarlanmaz. Her biri bir başlık ve satırlar olarak yazılır: `fields` varlığın alanlarını, kimlik ilk sırada olmak üzere bir kez adlandırır ve her satır bir varlığın değerlerini bu sırayla tutar. Aşağıdaki türler her varlığın alanlarını bu sırayla listeler. Bir satır kimliğini ve adını her zaman korur, ancak addan sonra sonda kalan boş değerleri dışarıda bırakılır; bu yüzden korunan bir değerden önce gelen boş bir değer `''` olarak kalır ve ayrıştırma, bir satırda bulunmayan bir değeri `''` olarak okur. Her satır, bir dosyadan alınan şu iki sözcükte olduğu gibi, ayrı bir satırda sıkıştırılmış JSON olarak yazılır:

```json
"wordEntities": {
  "fields": [
    "id",
    "name",
    "abbreviation",
    "englishName",
    "description",
    "synonyms",
    "forbiddenWords"
  ],
  "rows": [
    ["w1","Customer","CUST","customer"],
    ["w2","Number","NO","number","","No, Num","Nbr"]
  ]
}
```

Depolama biçimi her sayfanın satırlarını sayfanın sırasıyla ve sıra alanı olmadan yazar, bu yüzden bir dosyanın satırları bir sözlüğün üyeleri ve onların sırasıdır. Kimliği dışındaki değerlerinin tümü boş olan veya yalnızca boşluklardan oluşan bir satırı – eklenip hiç doldurulmamış ya da boşaltılmış bir satır gibi – ve böyle bir değer alanına ya da kaldırılmış bir değer alanına giden her bağlantıyı dışarıda bırakır: Bir sütunun `domainId` alanı dışarıda bırakılır, bir terimin `domainId` değeri ise `''` olarak yazılır ve terim başka hiçbir şey tutmuyorsa terimin kendisi dışarıda bırakılır.  
Ayrıştırma satırları durdukları sırayla okur, bu yüzden her sayfa onları dosyanın yazdığı sırayla listeler.  
Sözlükleri olmayan bir belgede, örneğin `4.2.0` sürümünden önce kaydedilmiş bir belgede, hiç sözlük yoktur. `4.2.0` sürümünden önceki bir düzenleyici bir belgeyi yüklerken üçünü de atar, bu yüzden orada kaydedildiğinde her sözcük, terim ve değer alanı kaybolur.

### Koleksiyon: wordEntities {#collection-wordentities}

```ts
type Word = {
  id: string;
  name: string;
  abbreviation?: string;
  englishName?: string;
  description?: string;
  synonyms?: string;
  forbiddenWords?: string;
};
```

Sözcük, bir mantıksal adı oluşturan sözcüklerden biridir ve `abbreviation`, fiziksel bir adda onun yerini tutan kısaltmadır. `synonyms` sözcüğün başka yazılışlarını, `forbiddenWords` ise onun yerine kullanılmaması gereken sözcükleri listeler; ikisi de virgülle ayrılır.

### Koleksiyon: termEntities {#collection-termentities}

```ts
type Term = {
  id: string;
  name: string;
  physicalName?: string;
  domainId?: string;
  description?: string;
  synonyms?: string;
};
```

Terim, bir mantıksal adın tamamıdır. `logicalName` değeri `name` ile eşleşen bir tablo veya sütun `physicalName` değerini ya da bu değer boşken sözcüklerin kısaltmalarından oluşturulan bir adı türetir; bir sütun ayrıca `domainId` değerinin belirttiği değer alanını da alır, değer alanı yoksa bu değer `''` olur ([Fiziksel adları türetme](../../guide/guides/dictionary.md#deriving-physical-names) bölümüne bakın). `synonyms` virgülle ayrılır. Ayrıştırma, bir sütunda olduğu gibi, dosyanın tuttuğu hiçbir değer alanını belirtmeyen bir `domainId` değerini temizler.

### Koleksiyon: domainEntities {#collection-domainentities}

```ts
type Domain = {
  id: string;
  name: string;
  category?: string;
  dataType?: string;
  description?: string;
};
```

Değer alanı adlandırılmış bir veri türüdür; `dataType` bu türü, uzunluk dahil, bir sütunun tuttuğu gibi tutar, örneğin `NUMERIC(10)`. Bir sütun veya terim bir değer alanına kimliğiyle bağlanır ve düzenleyici her bağlı sütuna değer alanının veri türünü verir ([Değer alanları ve veri türleri](../../guide/guides/dictionary.md#domains-and-data-types) bölümüne bakın).

## JSON Schema {#json-schema}

Asıl şema dosyası [json-schema/schema.json](https://raw.githubusercontent.com/dineug/erd-editor/main/json-schema/schema.json) adresinde yayımlanır ve `$schema` ile doğrudan ona başvurulabilir.

```json
{
  "$schema": "https://raw.githubusercontent.com/dineug/erd-editor/main/json-schema/schema.json",
  "version": "3.0.0"
}
```

Bir `.erd.json` dosyasının en üstüne `$schema` ekleyin; VS Code gibi JSON Schema'yı anlayan düzenleyiciler, düzenlediğiniz sırada belgeyi doğrular ve alanlarını otomatik tamamlar.

`4.0.0` sürümünden itibaren şema yalnızca depolama biçimini tanımlar. Adlandırılmış alanları olan her nesne kapalıdır (`additionalProperties: false`), depolama biçiminin her zaman yazdığı her alan zorunludur, yukarıdaki türlerde `?` ile işaretlenen her alan adlandırılır ancak zorunlu değildir ve başka hiçbir alan adlandırılmaz. Bu yüzden `meta`, genişlikler, `zIndex`, `ignoreSaveSettings` vb. içeren, `4.0.0` sürümünden önce kaydedilmiş bir dosyayı `4.0.0` veya sonraki bir sürümdeki bir düzenleyici o dosyayı yeniden kaydedene kadar reddeder. `3.2.0` veya sonraki bir sürümle kaydedilmiş bir dosya, `main` dalını gösteren bu şemanın URL'sini zaten belirtir, bu yüzden bu şemaya göre doğrulama yapan bir düzenleyici dosyayı artık geçersiz olarak işaretler. `3.0.0` veya `3.1.0` ile kaydedilmiş bir dosya ya da bir v2 belgesi hiçbir `$schema` belirtmez.

`4.2.0` sürümünden itibaren şema, depolama biçiminin hiçbir şey tutmadıkları sürece dışarıda bıraktığı, bir varlığın metin alanlarını, herhangi bir `doc` listesini, herhangi bir koleksiyonu veya `collections` alanının kendisini artık zorunlu tutmaz. `4.0.0` veya `4.1.0` ile kaydedilmiş bir dosyayı yine kabul eder. Yeni alanları adlandırır: yalnızca `"logical"` ve `"both"` değerlerini alan `nameViewMode`; bir tablonun `logicalName` alanı ile yalnızca `true` değerini alan `nameDerived` alanı; bir sütunun `logicalName` ve `domainId` alanları ve her biri başlığı ve dizelerden oluşan satırlarıyla üç sözlük. `canvasType` Sözlük sekmesini listeler, `columnOrder` yedi veya dokuz tam sayı alır ve `show`, `columnOrder`, `lockSettings` ve `options` açıklamaları yeni bitleri adlandırır.

`5.1.1` sürümünden itibaren bir notun `groupId` alanını da adlandırır; `5.1.1` sürümünden önce alınmış bir şema kopyası bu alanı reddeder.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://raw.githubusercontent.com/dineug/erd-editor/main/json-schema/schema.json",
  "title": "ERD Editor document",
  "description": "The storage form an ERD Editor file holds (.erd, .erd.json, .vuerd, .vuerd.json): the live entities alone, each collection keyed in id order but the dictionaries, a header and one row per entry in document order, without what an editor derives on load or keeps while it is open, without an entity's text field while it is empty, which reads as the empty string, and without an empty list or collection, which reads as none",
  "type": "object",
  "properties": {
    "$schema": {
      "type": "string"
    },
    "version": {
      "description": "Version of the schema",
      "const": "3.0.0"
    },
    "settings": {
      "$ref": "#/$defs/settings"
    },
    "doc": {
      "$ref": "#/$defs/doc"
    },
    "collections": {
      "description": "The entities of each kind, a kind with none left out",
      "type": "object",
      "properties": {
        "tableEntities": {
          "$ref": "#/$defs/tableEntities"
        },
        "tableColumnEntities": {
          "$ref": "#/$defs/tableColumnEntities"
        },
        "relationshipEntities": {
          "$ref": "#/$defs/relationshipEntities"
        },
        "indexEntities": {
          "$ref": "#/$defs/indexEntities"
        },
        "indexColumnEntities": {
          "$ref": "#/$defs/indexColumnEntities"
        },
        "memoEntities": {
          "$ref": "#/$defs/memoEntities"
        },
        "tableGroupEntities": {
          "$ref": "#/$defs/tableGroupEntities"
        },
        "wordEntities": {
          "$ref": "#/$defs/wordEntities"
        },
        "termEntities": {
          "$ref": "#/$defs/termEntities"
        },
        "domainEntities": {
          "$ref": "#/$defs/domainEntities"
        }
      },
      "additionalProperties": false
    }
  },
  "required": ["$schema", "version", "settings", "doc"],
  "additionalProperties": false,
  "$defs": {
    "settings": {
      "type": "object",
      "properties": {
        "originX": {
          "type": "number"
        },
        "originY": {
          "type": "number"
        },
        "zoomLevel": {
          "type": "number",
          "minimum": 0.1,
          "maximum": 1.5
        },
        "show": {
          "description": "bit value (tableComment: 1) | (columnComment: 2) | (columnDataType: 4) | (columnDefault: 8) | (columnAutoIncrement: 16) | (columnPrimaryKey: 32) | (columnUnique: 64) | (columnNotNull: 128) | (relationship: 256) | (columnAlternateKey: 512) | (hideReferentialAction: 1024) | (hideTableGroup: 2048) | (hideMemo: 4096) | (columnDomain: 8192); the three hide bits hide what they name while set",
          "type": "integer"
        },
        "database": {
          "description": "bit value (MariaDB: 1) | (MSSQL: 2) | (MySQL: 4) | (Oracle: 8) | (PostgreSQL: 16) | (SQLite: 32) | (Databricks: 64) | (Snowflake: 128)",
          "type": "integer",
          "enum": [1, 2, 4, 8, 16, 32, 64, 128]
        },
        "databaseName": {
          "type": "string"
        },
        "canvasType": {
          "enum": [
            "ERD",
            "@dineug/erd-editor/builtin-visualization",
            "@dineug/erd-editor/builtin-schema-sql",
            "@dineug/erd-editor/builtin-generator-code",
            "settings",
            "@dineug/erd-editor/builtin-dictionary"
          ]
        },
        "language": {
          "description": "bit value (GraphQL: 1) | (csharp: 2) | (Java: 4) | (Kotlin: 8) | (TypeScript: 16) | (JPA: 32) | (Scala: 64) | (Go: 128) | (SQLAlchemy: 256) | (TypeORM: 512) | (Sequelize: 1024) | (Drizzle: 2048) | (DBML: 4096) | (AML: 8192) | (Mermaid: 16384) | (PHP: 32768) | (Doctrine: 65536) | (Rust: 131072) | (SeaORM: 262144) | (Swift: 524288) | (Zod: 1048576) | (JSONSchema: 2097152)",
          "type": "integer",
          "enum": [1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768, 65536, 131072, 262144, 524288, 1048576, 2097152]
        },
        "tableNameCase": {
          "description": "bit value (none: 1) | (camelCase: 2) | (pascalCase: 4) | (snakeCase: 8)",
          "type": "integer",
          "enum": [1, 2, 4, 8]
        },
        "columnNameCase": {
          "description": "bit value (none: 1) | (camelCase: 2) | (pascalCase: 4) | (snakeCase: 8)",
          "type": "integer",
          "enum": [1, 2, 4, 8]
        },
        "bracketType": {
          "description": "bit value (none: 1) | (doubleQuote: 2) | (singleQuote: 4) | (backtick: 8)",
          "type": "integer",
          "enum": [1, 2, 4, 8]
        },
        "relationshipDataTypeSync": {
          "type": "boolean"
        },
        "columnOrder": {
          "description": "bit value (columnName: 1) | (columnDataType: 2) | (columnNotNull: 4) | (columnUnique: 8) | (columnAutoIncrement: 16) | (columnDefault: 32) | (columnComment: 64) | (columnLogicalName: 128) | (columnDomain: 256); seven entries without the last two while the logical name stands just before the name and the domain just after the data type, all nine otherwise",
          "type": "array",
          "prefixItems": [
            { "type": "integer" },
            { "type": "integer" },
            { "type": "integer" },
            { "type": "integer" },
            { "type": "integer" },
            { "type": "integer" },
            { "type": "integer" },
            { "type": "integer" },
            { "type": "integer" }
          ],
          "anyOf": [
            { "minItems": 7, "maxItems": 7 },
            { "minItems": 9, "maxItems": 9 }
          ]
        },
        "maxWidthComment": {
          "type": "integer"
        },
        "lockSettings": {
          "description": "bit value (viewport: 1) | (canvasType: 2) | (language: 4) | (tableNameCase: 8) | (columnNameCase: 16) | (bracketType: 32) | (unlockNameViewMode: 64); a locked setting is saved as it stood when locked, the viewport being originX, originY and zoomLevel. The last bit reads the other way round: set, the name view mode is unlocked, and clear, as in a file saved before it, locked",
          "type": "integer"
        },
        "ddlScripts": {
          "description": "SQL the Schema SQL writes as is for every database: before after the header and ahead of the tables, after past the generated DDL. Absent while both are empty",
          "type": "object",
          "properties": {
            "before": { "type": "string" },
            "after": { "type": "string" }
          },
          "required": ["before", "after"],
          "additionalProperties": false
        },
        "nameViewMode": {
          "description": "The names the diagram shows: the logical ones, or both the physical and the logical. Absent while it shows the physical names, the default",
          "enum": ["logical", "both"]
        }
      },
      "required": [
        "originX",
        "originY",
        "zoomLevel",
        "show",
        "database",
        "databaseName",
        "canvasType",
        "language",
        "tableNameCase",
        "columnNameCase",
        "bracketType",
        "relationshipDataTypeSync",
        "columnOrder",
        "maxWidthComment",
        "lockSettings"
      ],
      "additionalProperties": false
    },
    "doc": {
      "description": "The order of each kind of entity, which the DDL, the sort and the draw order read, a kind with none left out. A list goes out whenever its collection holds an entity, since a reader that finds none lists none",
      "type": "object",
      "properties": {
        "tableIds": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "relationshipIds": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "indexIds": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "memoIds": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "tableGroupIds": {
          "description": "Order of the table groups. Written while a group exists; absent means none",
          "type": "array",
          "items": {
            "type": "string"
          }
        }
      },
      "additionalProperties": false
    },
    "tableEntities": {
      "type": "object",
      "additionalProperties": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "name": {
            "type": "string"
          },
          "logicalName": {
            "description": "The name the logical view shows; absent means none",
            "type": "string"
          },
          "comment": {
            "type": "string"
          },
          "columnIds": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "groupId": {
            "description": "Id of the table group in doc.tableGroupIds the table belongs to; absent means none",
            "type": "string"
          },
          "nameDerived": {
            "description": "The dictionaries filled the name, so a new logical name derives it again; absent means a name someone wrote",
            "type": "boolean",
            "const": true
          },
          "ui": {
            "type": "object",
            "properties": {
              "x": {
                "type": "number"
              },
              "y": {
                "type": "number"
              },
              "color": {
                "type": "string"
              }
            },
            "required": ["x", "y"],
            "additionalProperties": false
          }
        },
        "required": ["id", "columnIds", "ui"],
        "additionalProperties": false
      }
    },
    "tableColumnEntities": {
      "type": "object",
      "additionalProperties": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "tableId": {
            "type": "string"
          },
          "name": {
            "type": "string"
          },
          "comment": {
            "type": "string"
          },
          "dataType": {
            "type": "string"
          },
          "default": {
            "type": "string"
          },
          "options": {
            "description": "bit value (autoIncrement: 1) | (primaryKey: 2) | (unique: 4) | (notNull: 8) | (nameDerived: 16); nameDerived is set while the dictionaries filled the name",
            "type": "integer"
          },
          "logicalName": {
            "description": "The name the logical view shows; absent means none",
            "type": "string"
          },
          "domainId": {
            "description": "Id of the domain in domainEntities that governs the data type; absent means none",
            "type": "string"
          }
        },
        "required": ["id", "tableId", "options"],
        "additionalProperties": false
      }
    },
    "relationshipEntities": {
      "type": "object",
      "additionalProperties": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "relationshipType": {
            "description": "bit value (ZeroOne: 2) | (ZeroN: 4) | (OneOnly: 8) | (OneN: 16)",
            "type": "integer"
          },
          "onDelete": {
            "description": "bit value (none: 1) | (noAction: 2) | (cascade: 4) | (setNull: 8) | (setDefault: 16) | (restrict: 32); none, the default, writes no ON DELETE clause",
            "type": "integer"
          },
          "onUpdate": {
            "description": "bit value (none: 1) | (noAction: 2) | (cascade: 4) | (setNull: 8) | (setDefault: 16) | (restrict: 32); none, the default, writes no ON UPDATE clause",
            "type": "integer"
          },
          "start": {
            "$ref": "#/$defs/RelationshipPoint"
          },
          "end": {
            "$ref": "#/$defs/RelationshipPoint"
          }
        },
        "required": [
          "id",
          "relationshipType",
          "onDelete",
          "onUpdate",
          "start",
          "end"
        ],
        "additionalProperties": false
      }
    },
    "indexEntities": {
      "type": "object",
      "additionalProperties": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "name": {
            "type": "string"
          },
          "tableId": {
            "type": "string"
          },
          "indexColumnIds": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "unique": {
            "type": "boolean"
          }
        },
        "required": ["id", "tableId", "indexColumnIds", "unique"],
        "additionalProperties": false
      }
    },
    "indexColumnEntities": {
      "type": "object",
      "additionalProperties": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "indexId": {
            "type": "string"
          },
          "columnId": {
            "type": "string"
          },
          "orderType": {
            "description": "bit value (ASC: 1) | (DESC: 2)",
            "type": "integer"
          }
        },
        "required": ["id", "indexId", "columnId", "orderType"],
        "additionalProperties": false
      }
    },
    "memoEntities": {
      "type": "object",
      "additionalProperties": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "value": {
            "type": "string"
          },
          "groupId": {
            "description": "Id of the table group in doc.tableGroupIds the memo belongs to; absent means none",
            "type": "string"
          },
          "ui": {
            "type": "object",
            "properties": {
              "x": {
                "type": "number"
              },
              "y": {
                "type": "number"
              },
              "width": {
                "type": "number"
              },
              "height": {
                "type": "number"
              },
              "color": {
                "type": "string"
              }
            },
            "required": ["x", "y", "width", "height"],
            "additionalProperties": false
          }
        },
        "required": ["id", "ui"],
        "additionalProperties": false
      }
    },
    "tableGroupEntities": {
      "description": "Named, coloured rectangles drawn behind tables and memos; a table or a memo joins one through its groupId. Written while a group exists; absent means none",
      "type": "object",
      "additionalProperties": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "name": {
            "type": "string"
          },
          "color": {
            "type": "string"
          },
          "ui": {
            "type": "object",
            "properties": {
              "x": {
                "type": "number"
              },
              "y": {
                "type": "number"
              },
              "width": {
                "type": "number"
              },
              "height": {
                "type": "number"
              }
            },
            "required": ["x", "y", "width", "height"],
            "additionalProperties": false
          }
        },
        "required": ["id", "ui"],
        "additionalProperties": false
      }
    },
    "wordEntities": {
      "description": "The words of the dictionary, the parts a logical name is composed of, each with its abbreviation in a physical name. Written while a word exists; absent means none",
      "type": "object",
      "properties": {
        "fields": {
          "const": ["id", "name", "abbreviation", "englishName", "description", "synonyms", "forbiddenWords"]
        },
        "rows": {
          "description": "One row per entry in document order, its values in the order fields names them; values past the name are left out from the last empty one back",
          "type": "array",
          "items": {
            "type": "array",
            "prefixItems": [
              { "type": "string" },
              { "type": "string" },
              { "type": "string" },
              { "type": "string" },
              { "type": "string" },
              { "type": "string" },
              { "type": "string" }
            ],
            "items": false,
            "minItems": 2
          }
        }
      },
      "required": ["fields", "rows"],
      "additionalProperties": false
    },
    "termEntities": {
      "description": "The terms of the dictionary, logical names a column matches by its text, each with its physical name and domain id. Written while a term exists; absent means none",
      "type": "object",
      "properties": {
        "fields": {
          "const": ["id", "name", "physicalName", "domainId", "description", "synonyms"]
        },
        "rows": {
          "description": "One row per entry in document order, its values in the order fields names them; values past the name are left out from the last empty one back",
          "type": "array",
          "items": {
            "type": "array",
            "prefixItems": [
              { "type": "string" },
              { "type": "string" },
              { "type": "string" },
              { "type": "string" },
              { "type": "string" },
              { "type": "string" }
            ],
            "items": false,
            "minItems": 2
          }
        }
      },
      "required": ["fields", "rows"],
      "additionalProperties": false
    },
    "domainEntities": {
      "description": "The domains of the dictionary, named data types a column or a term links to by id. Written while a domain exists; absent means none",
      "type": "object",
      "properties": {
        "fields": {
          "const": ["id", "name", "category", "dataType", "description"]
        },
        "rows": {
          "description": "One row per entry in document order, its values in the order fields names them; values past the name are left out from the last empty one back",
          "type": "array",
          "items": {
            "type": "array",
            "prefixItems": [
              { "type": "string" },
              { "type": "string" },
              { "type": "string" },
              { "type": "string" },
              { "type": "string" }
            ],
            "items": false,
            "minItems": 2
          }
        }
      },
      "required": ["fields", "rows"],
      "additionalProperties": false
    },
    "RelationshipPoint": {
      "type": "object",
      "properties": {
        "tableId": {
          "type": "string"
        },
        "columnIds": {
          "type": "array",
          "items": {
            "type": "string"
          }
        }
      },
      "required": ["tableId", "columnIds"],
      "additionalProperties": false
    }
  }
}
```
