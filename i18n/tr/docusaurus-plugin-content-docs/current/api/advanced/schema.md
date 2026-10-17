---
sidebar_position: 3
description: .erd.json belge biçimi – bir dosyanın tuttuğu depolama biçimi ve bir düzenleyicinin tuttuğu çalışma zamanı değeri, TypeScript türleri, her sayısal alanın ardındaki sabitler ve yayımlanan JSON Schema.
---

# Şema

`.erd.json`, düzenleyicinin belge biçimidir. Bir belgeyi düzenleyicinin dışında oluşturmanız, doğrulamanız veya taşımanız gerekiyorsa bu sayfayı okuyun.

`4.0.0` sürümünden itibaren bir belgenin iki serileştirmesi vardır ve ikisinde de `version` değeri `'3.0.0'` olur. Depolama biçimi bir dosyanın tuttuğu biçimdir: [`editor.value`](../erd-editor-element.md#value) özelliğinin döndürdüğü ve JSON dışa aktarmanın yazdığı biçim budur, yayımlanan [JSON Schema'nın](#json-schema) kabul ettiği tek biçim de budur. Çalışma zamanı değeri, bir düzenleyicinin tuttuğu hâliyle belgenin tamamıdır ve bunu [`editor.runtimeValue`](../erd-editor-element.md#runtimevalue) özelliği döndürür. `setInitialValue()`, `value` setter'ı ve `setSchemaJSON()` her iki biçimi, önceki bir sürümün kaydettiği her dosyayı ve bir v2 `.vuerd` belgesini okur. `4.0.0` sürümünden önce yalnızca bir biçim vardı: `value`, şu anda `runtimeValue` özelliğinin yaptığı gibi, belgenin düzenleyicinin tuttuğu hâliyle tamamını döndürüyordu.

## Depolama biçimi ve çalışma zamanı değeri {#storage-form-and-runtime-value}

Depolama biçimi yalnızca canlı varlıkları tutar: `doc.tableIds` içinde listelenen her tablo, bu tabloların listelediği sütunlar, korunan iki tablo arasındaki ilişkiler, korunan tabloların dizinleri ile bunların sütunu tablonun listesinde hâlâ yer alan dizin sütunları, listelenen notlar ve tablo grupları. Bir düzenleyicinin yükleme sırasında türettiği veya açık kaldığı sürece tuttuğu şeyleri dışarıda bırakır: kaldırılmış varlıklar, `seqColumnIds` ve `seqIndexColumnIds`, her `zIndex`, ölçülen genişlikler, sütunların `ui` alanı ve bir ilişkinin `identification` ve `startRelationshipType` alanları ile bağlantı noktaları. Aşağıdaki türler bu alanların her birini `// runtime only` olarak işaretler.  
Her koleksiyon kimliklerle anahtarlanır ve kod birimi sırasına göre dizilir; sütunlar önce `tableId` değerine, dizin sütunları önce `indexId` değerine göre gruplanır. Her varlık alanlarını sabit bir sırayla yazar, metin iki boşlukla girintilenir ve bir satır sonuyla biter. Bu yüzden aynı belge her zaman aynı baytları yazar, bir düzenleme yalnızca dokunduğu kısmı değiştirir ve başka yazı tiplerinin bulunduğu bir makinede kaydedilen bir dosya aynı `value` değeriyle yeniden açılır.  
VS Code, Obsidian ve JetBrains eklentisi bir dosyayı yalnızca bir düzenleme `value` değerini değiştirdiğinde yazar, bu yüzden önceki bir sürümün kaydettiği bir dosya ilk düzenlemesine kadar eski biçimini korur.

Çalışma zamanı değeri, depolama biçiminin dışarıda bıraktıklarını tutar: kaldırılmış varlıklar, sıra listeleri, z-index değerleri, genişlikler, anahtar işaretleri, ilişki bayrakları ve bağlantı noktaları. İki boşlukla girintilenir ve sonunda satır sonu yoktur. Bunu yalnızca `setInitialValue()` aracılığıyla bir ortak çalışanı veya ikinci bir görünümü ilk içerikle başlatmak için kullanın; böylece başka bir düzenleyicinin gönderdiği bir kaldırma işleminin geri alınması, varlığı orada eksiksiz geri getirir. Bunu asla bir dosyaya yazmayın: JSON Schema onu reddeder. Kaldırılmış varlıkları artık hiçbir şey çöp olarak toplamaz, bu yüzden çalışma zamanı değeri onları belge kendi dosyasından bir sonraki kez açılana kadar tutar.

Her iki biçim de kilitli her ayarı kilitli değeriyle ([`lockSettings`](#settings) bölümüne bakın), `settings.ddlScripts` alanını yalnızca bir betik metin içerirken, bir tablonun `groupId` alanını ise yalnızca boş değilken yazar. Depolama biçimi `doc.tableGroupIds` ve `tableGroupEntities` alanlarını yalnızca bir tablo grubu varken yazar, çalışma zamanı değeri ise belge bir grup veya kaldırılmış bir grup tuttuğu sürece bunları yazar.

## TypeScript {#typescript}

Türler çalışma zamanı değerini tanımlar. `// runtime only` ile işaretlenen bir alan depolama biçiminde yer almaz, `?` ile işaretlenen bir alan ise yalnızca bir şey içerdiği sürece yazılır.

### ERDEditorSchemaV3 {#erdeditorschemav3}

```ts
type ERDEditorSchemaV3 = {
  $schema: 'https://raw.githubusercontent.com/dineug/erd-editor/main/json-schema/schema.json';
  version: '3.0.0';
  settings: Settings;
  doc: Doc;
  collections: {
    tableEntities: Record<string, Table>;
    tableColumnEntities: Record<string, Column>;
    relationshipEntities: Record<string, Relationship>;
    indexEntities: Record<string, Index>;
    indexColumnEntities: Record<string, IndexColumn>;
    memoEntities: Record<string, Memo>;
    tableGroupEntities?: Record<string, TableGroup>;
  };
};
```

Her varlığın anahtarı, opak bir dize olan kendi `id` değeridir; ayrıştırma, `id` değeri eksik veya boş olan bir varlığı atar. `4.0.0` sürümünden itibaren her yeni kimlik, `03gzrxjv20bdlcak89q25d2m7` gibi küçük harfle yazılmış 25 adet 36 tabanlı basamaktan oluşan, Uuid25 biçiminde yazılmış bir UUIDv7'dir, bu yüzden bir düzenleyicinin ürettiği kimlikler onları ürettiği sırayla sıralanır. Bir belge, önceki bir sürümün nanoid kimlikleri veya bir v2 dosyasının kimlikleri gibi tuttuğu kimlikleri korur, bu yüzden hiçbir şey bir kimliğin yapısına dayanmamalıdır.

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
} as const;

const ColumnType = {
  columnName: 1,
  columnDataType: 2,
  columnNotNull: 4,
  columnUnique: 8,
  columnAutoIncrement: 16,
  columnDefault: 32,
  columnComment: 64,
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
} as const;
```

`originX` ve `originY` görünümdür: sahnedeki `(0, 0)` noktasının denk geldiği ekran noktası.  
`zoomLevel`, `0.1` ile `1.5` arasında değişir. `1` değerinin üzerinde kaydedilmiş bir belge, `3.5.0` sürümünden önceki bir düzenleyicide `1` değerinde açılır.  
`4.0.0` sürümünden itibaren ayarlar `width`, `height`, `scrollTop`, `scrollLeft`, `relationshipOptimization` veya `ignoreSaveSettings` alanlarını taşımaz. Hiçbir şey onları yazmaz, ayrıştırıcı hiçbirini korumaz ve JSON Schema hâlâ bunları içeren bir dosyayı reddeder.

`canvasType`, bir belgenin açıldığı sekmedir. Görselleştirme sekmesinde kaydedilen bir belge `'@dineug/erd-editor/builtin-visualization'` değerini tutar ancak `Graph` modunun mu yoksa `Flow` modunun mu gösterildiğini tutmaz, yeni oluşturulan bir düzenleyici de bu sekmeyi `Graph` modunda gösterir.  
`4.0.0` sürümünden itibaren, yeni bir belgede olduğu gibi `Canvas Type` kilidi etkin olduğu sürece belge, kilitlendiği sırada gösterilen sekmeyi korur ve sekme değiştirmek `value` değerini olduğu gibi bırakır. Ayarlar sekmesindeyken konan bir kilit oraya geldiğiniz sekmeyi tutar, yalnızca elle düzenlemenin yazabildiği kilitli bir `'settings'` değeri ise `'ERD'` sekmesinde açılır.  
`Flow` modunun kendi durumu hiç serileştirilmez – yerleştirme, yakınlaştırma, kaydırma, satır görünümü ve odaklanılan tablolar düzenleyicide kalır – bu yüzden `originX`, `originY` ve `zoomLevel` her zaman ERD tuvalini tanımlar.

`show` ve `lockSettings` bit maskeleridir – bayrakları OR ile birleştirin.  
`columnOrder`, yedi `ColumnType` değerinin tümünü görüntülenme sırasıyla tutan bir dizidir.  
`database`, `language`, `tableNameCase`, `columnNameCase` ve `bracketType` alanlarının her biri tam olarak tek bir değer tutar ve JSON Schema birleştirilmiş bir değeri reddeder.

Yeni bir belgenin `show` değeri `431` olur: `tableComment`, `columnComment`, `columnDataType`, `columnDefault`, `columnPrimaryKey`, `columnNotNull` ve `relationship`.  
`3.10.0` sürümünden itibaren, ikisi de yeni bir belgede ve `3.10.0` sürümünden önce kaydedilen her belgede kapalı olan iki `show` bayrağı daha vardır.  
`columnAlternateKey` (`512`), [`Alternate Key`](../../guide/guides/table-related-functions.md#alternate-keys) görünüm seçeneğidir. Ayarlandığında, iki veya daha fazla sütun üzerindeki her benzersiz dizinin sütunlarını `AK1.1`, `AK1.2` vb. olarak işaretler. Başlangıçta kapalıdır, bu yüzden mevcut hiçbir diyagramın genişliği değişmez.  
`hideReferentialAction` (`1024`) tersine çalışır: Ayarlandığında bağlantı çizgilerindeki [ON DELETE ve ON UPDATE etiketlerini](../../guide/guides/relationship-editing.md#reading-a-connector) gizler, bu yüzden etiketler varsayılan olarak gösterilir. `Referential Actions` görünüm seçeneği, bayrak kapalıyken işaretlidir. Hiçbir tablonun boyutunu değiştirmez.  
`3.10.0` sürümünden önceki bir düzenleyici `show` değerini bir tam sayı olarak korur, bu yüzden iki bayrak da orada yapılan bir kaydetmeden sonra korunur.

`4.0.0` sürümünden itibaren, ikisi de yeni bir belgede ve `4.0.0` sürümünden önce kaydedilen her belgede kapalı olan iki `show` bayrağı daha vardır. `hideReferentialAction` bayrağı gibi her biri adının belirttiği şeyi gizler, bu yüzden tablo grupları ve notlar varsayılan olarak gösterilir.  
`hideTableGroup` (`2048`) [tablo gruplarını](../../guide/guides/table-groups.md), `hideMemo` (`4096`) ise her notu gizler. Bunlar `Table Groups` ve `Memos` [görünüm seçenekleridir](../../guide/guides/table-related-functions.md#table-view-options) ve her biri kendi bayrağı kapalıyken işaretlidir. İkisi de hiçbir tablonun boyutunu değiştirmez.  
`4.0.0` sürümünden önceki bir düzenleyici `show` değerini bir tam sayı olarak korur, bu yüzden iki bayrak da orada yapılan bir kaydetmeden sonra korunur.

`4.0.0` sürümünden itibaren `Language` sabitinde `Mermaid` ile `JSONSchema` arasındaki sekiz [Kod oluşturucu](../../guide/guides/code-generator.md) hedefi daha vardır. Ayrıştırıcının tanımadığı bir `language` değeri `GraphQL` olarak okunur, bu yüzden `4.0.0` sürümünden önceki bir düzenleyici bunlardan biriyle kaydedilmiş bir belgeyi GraphQL seçili olarak açar ve orada kaydetmek GraphQL yazar.

`4.0.0` sürümünden itibaren `lockSettings`, `ignoreSaveSettings` alanının, `LockSettingType` de kaldırılan `SaveSettingType` sabitinin yerini alır. `lockSettings`, bir belgenin kilitlendikleri andaki hâlleriyle kaydettiği ayarları belirtir. `viewport` biti `originX`, `originY` ve `zoomLevel` alanlarını birlikte kapsar, çünkü yakınlaştırması olmadan kaydedilen bir başlangıç noktası başka bir yerde açılır, diğer her bit ise adını aldığı alanı kapsar. Bunlar, Ayarlar sekmesindeki [`Lock`](../../guide/guides/settings.md#lock) satırlarıdır.  
`value` ve `runtimeValue` kilitli bir ayarı, düzenleyici ne gösterirse göstersin, aynı şekilde kilitli değeriyle, diğer her ayarı ise o anki hâliyle yazar. Bu yüzden ilgili kilit etkin olduğu sürece kaydırmak ve yakınlaştırmak, sekme değiştirmek ya da Kod oluşturucu dilini, bir ad biçimini veya tırnak türünü değiştirmek dosyayı olduğu gibi bırakır. Kilitleme, ayarın o anda tuttuğu değeri alır, ayrıştırma ise kilitli değeri kaydedilmiş alandan alır.  
Sıfırdan başlatılan bir belgede – yeni bir düzenleyici veya replikasyon deposu ya da `value` setter'ına veya `setInitialValue()` yöntemine verilen boş bir değer – `lockSettings` değeri `63` olur, yani tüm kilitler etkindir. `settings` alanında `lockSettings` bulunmayan bir belge de – `ignoreSaveSettings` değeri ne olursa olsun `4.0.0` sürümünden önce kaydedilen her dosya ve her v2 belgesi – tüm kilitler etkin olarak açılır: Görünümü ve sekmesi yeni bir belgeninkilerle aynıdır (`originX` ve `originY` `0`, `zoomLevel` `1`, ERD sekmesi), dili, ad biçimleri ve tırnak türü ise kaydettiği değerlerde kilitlenir. Kilitlerini belirten bir belge, `0` dahil bu kilitleri ve kaydettiği her değeri korur.  
Ayrıştırma, bilinmeyenler dahil `lockSettings` değerinin her bitini korur, bu yüzden sonraki bir sürümün eklediği bir kilit burada yapılan bir kaydetmeden sonra da korunur; JSON Schema yalnızca bunun bir tam sayı olduğunu denetler. `4.0.0` sürümünden önceki bir düzenleyici kaydederken `lockSettings` alanını atar ve görünümü ile sekmeyi o anki hâlleriyle yazar, bu yüzden dosya burada yeniden `4.0.0` sürümünden önce kaydedilmiş bir dosya gibi açılır.

`4.0.0` sürümünden itibaren `ddlScripts`, her veritabanının DDL'inin yazdığı [Şema SQL](../../guide/guides/schema-sql.md) sekmesindeki iki betiği tutar: `before` başlıktan sonra ve tablolardan önce, `after` oluşturulan DDL'in ardından yazılır. DDL, [Önceki ve sonraki betikler](../../guide/guides/schema-sql.md#before-and-after-scripts) bölümünde anlatıldığı gibi her birini LF satır sonlarıyla, baştaki boş satırları ve sondaki boşluk karakterleri olmadan ve MSSQL'de `GO` ile bitirerek yazar; `ddlScripts` ise her betiği girildiği gibi korur. Anahtar yalnızca betiklerden herhangi biri metin içerirken yazılır ve o durumda iki betik de yazılır; eksik bir anahtar veya dize olmayan bir betik `''` olarak okunur. Sekmenin `Statements`, `Header` ve `Tables` seçimleri belgeye kaydedilmez.  
`4.0.0` sürümünden önceki bir düzenleyici bir belgeyi yüklerken betikleri atar, bu yüzden orada kaydedildiğinde betikler kaybolur.

`Database`, `Language`, `Show`, `LockSettingType` ve `ReferentialAction` yalnızca sona eklenen sabitlerdir. Kaydedilmiş bir belge sayıyı sakladığı için yeni bir veritabanı sistemi, kod oluşturma hedefi, bayrak, kilit veya eylem ortadan bir yer almak yerine bir sonraki biti alır.

### Doc {#doc}

```ts
type Doc = {
  tableIds: string[];
  relationshipIds: string[];
  indexIds: string[];
  memoIds: string[];
  tableGroupIds?: string[];
};
```

Her liste bir varlık türünün sırasıdır ve DDL, tablo sıralaması ve çizim sırası bu sırayı okur. Depolama biçiminde her liste yalnızca korunan varlıkların kimliklerini, her birini bir kez ve listelendiği sırayla tutar. `4.0.0` sürümünden itibaren `tableGroupIds`, tablo gruplarının sırasıdır.

`4.0.0` sürümünden itibaren katman sırası kaydedilmez. Ayrıştırma, `zIndex` taşımayan listelenmiş her tabloyu, notu ve tablo grubunu listesindeki yerine göre, sonrakiler önde olacak şekilde üst üste dizer: Tablo grupları `1` değerinden, tablolar `2` değerinden başlar, notlar ise her tablonun üstüne gelir. Çalışma zamanı değerinde veya `4.0.0` sürümünden önce kaydedilmiş bir dosyada olduğu gibi `zIndex` taşıyan bir varlık bu değeri korur. Bu yüzden bir tabloyu veya notu öne getirmek, dosya yeniden açıldığında kaybolur.

### Koleksiyon: tableEntities {#collection-tableentities}

```ts
type Table = {
  id: string;
  name: string;
  comment: string;
  columnIds: string[];
  seqColumnIds: string[]; // runtime only
  groupId?: string;
  ui: TableUI;
};

type TableUI = {
  x: number;
  y: number;
  zIndex: number; // runtime only
  widthName: number; // runtime only
  widthComment: number; // runtime only
  color: string;
};
```

`4.0.0` sürümünden itibaren bir tablo, ait olduğu [tablo grubunun](../../guide/guides/table-groups.md) kimliği olan `groupId` alanını taşır. Eksik veya boş bir `groupId` ya da `doc.tableGroupIds` içinde hiçbir grubu belirtmeyen bir `groupId` grup olmadığı anlamına gelir ve depolama biçimi bu alanı yalnızca korunan bir grubu belirttiği sürece yazar.  
Ayrıştırma, `seqColumnIds` eksik olduğunda veya listelenen bir kimliği içermediğinde onu `columnIds` ile başlatır ve bir düzenleyici her yüklemede `widthName` ile `widthComment` değerlerini kendi yazı tipleriyle yeniden ölçer.

### Koleksiyon: tableColumnEntities {#collection-tablecolumnentities}

```ts
type Column = {
  id: string;
  tableId: string;
  name: string;
  comment: string;
  dataType: string;
  default: string;
  options: number; // Constants: ColumnOption
  ui: ColumnUI; // runtime only
};

type ColumnUI = {
  keys: number; // Constants: ColumnUIKey
  widthName: number;
  widthComment: number;
  widthDataType: number;
  widthDefault: number;
};

// Constants
const ColumnOption = {
  autoIncrement: 1,
  primaryKey: 2,
  unique: 4,
  notNull: 8,
} as const;

const ColumnUIKey = {
  primaryKey: 1,
  foreignKey: 2,
} as const;
```

`4.0.0` sürümünden itibaren depolama biçimi sütunların `ui` alanını yazmaz. Her yükleme `keys` değerini türetir – birincil anahtar işaretini `options` alanının `primaryKey` bitinden, yabancı anahtar işaretini sütunda biten ilişkilerden – ve dört genişliği ölçer.  
`4.0.0` sürümünden önceki bir düzenleyici, burada kaydedilmiş bir dosyanın sütunlarını birincil anahtar simgeleri olmadan gösterir.

### Koleksiyon: relationshipEntities {#collection-relationshipentities}

```ts
type Relationship = {
  id: string;
  identification: boolean; // runtime only
  relationshipType: number; // Constants: RelationshipType
  startRelationshipType: number; // Constants: StartRelationshipType; runtime only
  onDelete: number; // Constants: ReferentialAction
  onUpdate: number; // Constants: ReferentialAction
  start: RelationshipPoint;
  end: RelationshipPoint;
};

type RelationshipPoint = {
  tableId: string;
  columnIds: string[];
  x: number; // runtime only
  y: number; // runtime only
  direction: number; // Constants: Direction; runtime only
};

// Constants
const RelationshipType = {
  ZeroOne: 2,
  ZeroN: 4,
  OneOnly: 8,
  OneN: 16,
} as const;

const StartRelationshipType = {
  ring: 1,
  dash: 2,
} as const;

const ReferentialAction = {
  none: 1,
  noAction: 2,
  cascade: 4,
  setNull: 8,
  setDefault: 16,
  restrict: 32,
} as const;

const Direction = {
  left: 1,
  right: 2,
  top: 4,
  bottom: 8,
} as const;
```

`3.10.0` sürümünden itibaren bir ilişki, kendi [ON DELETE ve ON UPDATE eylemlerini](../../guide/guides/relationship-editing.md#on-delete-and-on-update) belirten `onDelete` ve `onUpdate` alanlarını taşır. Her biri tam olarak tek bir `ReferentialAction` değeri tutar. Varsayılan değer olan `none` hiçbir yan tümce yazmaz, bu yüzden veritabanının kendi varsayılanı uygulanır. Diğer beşi `NO ACTION`, `CASCADE`, `SET NULL`, `SET DEFAULT` ve `RESTRICT` anlamına gelir. Şema SQL bir yan tümceyi yalnızca o eylemi kabul eden bir veritabanı için yazar.  
Depolama biçimi her zaman ikisini de yazar ve `4.0.0` sürümünden itibaren JSON Schema ikisini de zorunlu tutar, ancak yalnızca her birinin bir tam sayı olduğunu denetler. Ayrıştırma, `3.10.0` sürümünden önce kaydedilen her belgede olduğu gibi eksik bir alanı hâlâ `none` olarak okur, listenin dışındaki bir değeri de öyle.  
`3.10.0` sürümünden önceki bir düzenleyici bu alanları tanımaz ve bir belgeyi yüklerken onları atar, bu yüzden orada kaydedildiğinde tüm eylemler kaybolur.

`4.0.0` sürümünden itibaren her yükleme, depolama biçiminin dışarıda bıraktıklarını türetir. Bir ilişki, bittiği her sütun birincil anahtar olduğunda tanımlayıcıdır ve bu tür her sütun NOT NULL olduğunda `startRelationshipType` değeri `dash`, aksi takdirde `ring` olur; bitiş sütunu kalmamış bir ilişki ise yeni bir ilişkinin başlangıçta olduğu gibi tanımlayıcı olmayan bir ilişkidir ve `dash` olur. Bağlantı noktaları, yani `x`, `y` ve `direction`, yeniden yerleştirilir.

### Koleksiyon: indexEntities {#collection-indexentities}

```ts
type Index = {
  id: string;
  name: string;
  tableId: string;
  indexColumnIds: string[];
  seqIndexColumnIds: string[]; // runtime only
  unique: boolean;
};
```

Ayrıştırma, `seqIndexColumnIds` eksik olduğunda veya listelenen bir kimliği içermediğinde onu `indexColumnIds` ile başlatır.

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
  value: string;
  ui: MemoUI;
};

type MemoUI = {
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number; // runtime only
  color: string;
};
```

`4.0.0` sürümünden itibaren tablolar ve notlar `zIndex` değerine göre sıralanan [tek bir katman sırasını paylaşır](../../guide/guides/table-related-functions.md#moving-multiple-tables), bu yüzden bir tabloyu öne getirmek onu bir notun üstüne yerleştirebilir. Ayrıştırma, [Doc](#doc) bölümünde anlatıldığı gibi `zIndex` olmadan kaydedilmiş bir notu her tablonun üstüne yerleştirir. `4.0.0` sürümünden önce kaydedilmiş bir dosyadaki bir not, kaydettiği `zIndex` değerini korur; bu değer tablolarınkiyle aynı sayaçtan geldiği için önceki bir sürümün her tablonun üstüne çizdiği bir not, kendisinden sonra öne getirilmiş bir tablonun altında açılabilir.

### Koleksiyon: tableGroupEntities {#collection-tablegroupentities}

```ts
type TableGroup = {
  id: string;
  name: string;
  color: string;
  ui: TableGroupUI;
};

type TableGroupUI = {
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number; // runtime only
};
```

`4.0.0` sürümünden itibaren bir belge [tablo grupları](../../guide/guides/table-groups.md) tutabilir: tabloların arkasına çizilen, adı ve rengi olan dikdörtgenler. Bir tablo bir gruba kendi `groupId` alanı aracılığıyla katılır, bu yüzden bir grup üye listesi tutmaz. Depolama biçimi bu koleksiyonu, `doc.tableGroupIds` gibi, yalnızca bir grup varken yazar ve `4.0.0` sürümünden önce kaydedilmiş bir belge gibi bu koleksiyonu içermeyen bir belgede grup yoktur. `Show.hideTableGroup` bayrağı grupları gizler.  
`4.0.0` sürümünden önceki bir düzenleyici bir belgeyi yüklerken grupları ve her tablonun `groupId` alanını atar, bu yüzden orada kaydedildiğinde tüm gruplar kaybolur.

## JSON Schema {#json-schema}

Asıl şema dosyası [json-schema/schema.json](https://raw.githubusercontent.com/dineug/erd-editor/main/json-schema/schema.json) adresinde yayımlanır ve `$schema` ile doğrudan ona başvurulabilir.

```json
{
  "$schema": "https://raw.githubusercontent.com/dineug/erd-editor/main/json-schema/schema.json",
  "version": "3.0.0"
}
```

Bir `.erd.json` dosyasının en üstüne `$schema` ekleyin; VS Code gibi JSON Schema'yı anlayan düzenleyiciler, düzenlediğiniz sırada belgeyi doğrular ve alanlarını otomatik tamamlar.

`4.0.0` sürümünden itibaren şema yalnızca depolama biçimini tanımlar. Adlandırılmış alanları olan her nesne kapalıdır (`additionalProperties: false`), depolama biçiminin her zaman yazdığı her alan zorunludur ve onun dışarıda bıraktığı hiçbir alan adlandırılmaz. Bu yüzden çalışma zamanı değerini reddeder. `meta`, genişlikler, `zIndex`, `ignoreSaveSettings` vb. içeren, `4.0.0` sürümünden önce kaydedilmiş bir dosyayı da `4.0.0` veya sonraki bir sürümdeki bir düzenleyici o dosyayı yeniden kaydedene kadar reddeder. `3.2.0` veya sonraki bir sürümle kaydedilmiş bir dosya, `main` dalını gösteren bu şemanın URL'sini zaten belirtir, bu yüzden bu şemaya göre doğrulama yapan bir düzenleyici dosyayı artık geçersiz olarak işaretler. `3.0.0` veya `3.1.0` ile kaydedilmiş bir dosya ya da bir v2 belgesi hiçbir `$schema` belirtmez.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://raw.githubusercontent.com/dineug/erd-editor/main/json-schema/schema.json",
  "title": "ERD Editor document",
  "description": "The storage form an ERD Editor file holds (.erd, .erd.json, .vuerd, .vuerd.json): the live entities alone, each collection keyed in id order, without what an editor derives on load or keeps while it is open",
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
        }
      },
      "required": [
        "tableEntities",
        "tableColumnEntities",
        "relationshipEntities",
        "indexEntities",
        "indexColumnEntities",
        "memoEntities"
      ],
      "additionalProperties": false
    }
  },
  "required": ["$schema", "version", "settings", "doc", "collections"],
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
          "description": "bit value (tableComment: 1) | (columnComment: 2) | (columnDataType: 4) | (columnDefault: 8) | (columnAutoIncrement: 16) | (columnPrimaryKey: 32) | (columnUnique: 64) | (columnNotNull: 128) | (relationship: 256) | (columnAlternateKey: 512) | (hideReferentialAction: 1024) | (hideTableGroup: 2048) | (hideMemo: 4096); the three hide bits hide what they name while set",
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
            "settings"
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
          "description": "bit value (columnName: 1) | (columnDataType: 2) | (columnNotNull: 4) | (columnUnique: 8) | (columnAutoIncrement: 16) | (columnDefault: 32) | (columnComment: 64)",
          "type": "array",
          "prefixItems": [
            { "type": "integer" },
            { "type": "integer" },
            { "type": "integer" },
            { "type": "integer" },
            { "type": "integer" },
            { "type": "integer" },
            { "type": "integer" }
          ],
          "minItems": 7,
          "maxItems": 7
        },
        "maxWidthComment": {
          "type": "integer"
        },
        "lockSettings": {
          "description": "bit value (viewport: 1) | (canvasType: 2) | (language: 4) | (tableNameCase: 8) | (columnNameCase: 16) | (bracketType: 32); a locked setting is saved as it stood when locked, the viewport being originX, originY and zoomLevel",
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
      "description": "The order of each kind of entity, which the DDL, the sort and the draw order read",
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
      "required": ["tableIds", "relationshipIds", "indexIds", "memoIds"],
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
            "required": ["x", "y", "color"],
            "additionalProperties": false
          }
        },
        "required": ["id", "name", "comment", "columnIds", "ui"],
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
            "description": "bit value (autoIncrement: 1) | (primaryKey: 2) | (unique: 4) | (notNull: 8)",
            "type": "integer"
          }
        },
        "required": [
          "id",
          "tableId",
          "name",
          "comment",
          "dataType",
          "default",
          "options"
        ],
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
        "required": ["id", "name", "tableId", "indexColumnIds", "unique"],
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
            "required": ["x", "y", "width", "height", "color"],
            "additionalProperties": false
          }
        },
        "required": ["id", "value", "ui"],
        "additionalProperties": false
      }
    },
    "tableGroupEntities": {
      "description": "Named, coloured rectangles drawn behind tables; a table joins one through its groupId. Written while a group exists; absent means none",
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
        "required": ["id", "name", "color", "ui"],
        "additionalProperties": false
      }
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
