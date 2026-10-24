---
sidebar_position: 3
description: Het documentformaat .erd.json — de opslagvorm die een bestand bevat en de runtimewaarde die een editor vasthoudt, de TypeScript-typen, de constanten achter elk numeriek veld en het gepubliceerde JSON Schema.
---

# Schema

`.erd.json` is het documentformaat van de editor. Lees deze pagina als je een document buiten de editor moet genereren, valideren of migreren.

Sinds `4.0.0` heeft een document twee serialisaties, beide met `version` `'3.0.0'`. De opslagvorm is wat een bestand bevat: het is wat [`editor.value`](../erd-editor-element.md#value) retourneert, wat de JSON-export schrijft en de enige vorm die het gepubliceerde [JSON Schema](#json-schema) accepteert. De runtimewaarde is het hele document zoals een editor het vasthoudt, en is wat [`editor.runtimeValue`](../erd-editor-element.md#runtimevalue) retourneert. `setInitialValue()`, de setter `value` en `setSchemaJSON()` lezen beide vormen, elk bestand dat een eerdere versie heeft opgeslagen en een `.vuerd`-document uit v2. Vóór `4.0.0` was er maar één: `value` retourneerde het hele document zoals de editor het vasthield, zoals `runtimeValue` dat nu doet.

## Opslagvorm en runtimewaarde {#storage-form-and-runtime-value}

De opslagvorm bevat alleen de niet-verwijderde entiteiten: elke tabel die in `doc.tableIds` vermeld staat, de kolommen die die tabellen vermelden, de relaties tussen twee behouden tabellen, de indexen van behouden tabellen met de indexkolommen waarvan de tabel de kolom nog vermeldt, de vermelde memo's en tabelgroepen en sinds `4.2.0` de vermelde woorden, termen en domeinen die naast hun id nog een waarde bevatten. Ze laat weg wat een editor bij het laden afleidt of bijhoudt zolang hij geopend is: verwijderde entiteiten, `seqColumnIds` en `seqIndexColumnIds`, elke `zIndex`, de gemeten breedtes, de `ui` van kolommen, van een relatie de `identification`, de `startRelationshipType` en de ankerpunten, en sinds `4.2.0` de `order` van elke woordenboekrij en de lijsten `doc.wordIds`, `doc.termIds` en `doc.domainIds`. De typen hieronder markeren elk van deze velden met `// runtime only`.  
Elke collectie behalve de woordenboeken gebruikt de id als sleutel, in volgorde van code-eenheden, waarbij kolommen eerst op `tableId` en indexkolommen eerst op `indexId` worden gegroepeerd. Sinds `4.2.0` komen `wordEntities`, `termEntities` en `domainEntities` na elke andere collectie, in die volgorde, elk geschreven als een koprij en rijen, één rij per regel (zie [Woordenboekrijen](#dictionary-rows)). Elke entiteit schrijft haar velden in een vaste volgorde, en de tekst wordt met twee spaties ingesprongen en eindigt met een regeleinde. Daardoor schrijft hetzelfde document altijd dezelfde bytes, verandert een bewerking alleen wat ze raakt en opent een bestand dat is opgeslagen op een computer met andere lettertypen opnieuw met dezelfde `value`.  
VS Code, Obsidian en de JetBrains-plug-in schrijven een bestand alleen wanneer een bewerking `value` wijzigt, dus een bestand dat een eerdere versie heeft opgeslagen, behoudt zijn oude vorm tot de eerste bewerking.

Sinds `4.2.0` laat de opslagvorm ook weg wat niets bevat: elk tekstveld dat een entiteit of haar `ui` als `''` bevat (van een tabel `name`, `comment` en `ui.color`, van een kolom `name`, `comment`, `dataType` en `default`, van een index `name`, van een memo `value` en `ui.color`, van een tabelgroep `name` en `color`), elke lijst in `doc` en elke collectie die geen enkel item bevat, en `collections` zelf zodra elke collectie leeg is. Tekst die alleen uit spaties bestaat, wordt geschreven zoals hij is opgeslagen, behalve een logische naam, die dan wordt weggelaten, en een woord, term of domein waarvan de waarden na de id allemaal leeg zijn of alleen uit spaties bestaan, dat in zijn geheel wordt weggelaten. Elke id, elke lijst binnen een entiteit en elk getal, `0` inbegrepen, wordt nog steeds geschreven. `doc` wordt altijd geschreven, dus het bestand van een nieuw document bevat `$schema`, `version`, de instellingen en `"doc": {}`.  
Het parseren leest een ontbrekend tekstveld als `''` en een ontbrekende collectie als leeg, zoals elke v3-versie doet, en de opslagvorm laat een lijst in `doc` alleen weg zolang de collectie ervan niets bevat (zie [Doc](#doc)). Daardoor opent ook een editor vóór `4.2.0` deze bestanden, en een programma dat zelf een bestand leest, moet wat ontbreekt op dezelfde manier lezen. Een bestand dat een eerdere versie heeft opgeslagen, komt bij de volgende keer opslaan terug zonder zijn lege tekst, lijsten en collecties, een wijziging die eenmalig is, en wordt vanaf dan telkens byte voor byte hetzelfde opgeslagen.

De runtimewaarde behoudt wat de opslagvorm weglaat: verwijderde entiteiten, volgordes, z-indexen, breedtes, sleutelmarkeringen, relatievlaggen en ankerpunten, de lege tekstvelden, en de vier lijsten `tableIds`, `relationshipIds`, `indexIds` en `memoIds` en de zes collecties `tableEntities` tot en met `memoEntities`, ook als ze leeg zijn. Sinds `4.2.0` behoudt ze ook verwijderde woorden, termen en domeinen, rijen die niets bevatten, de `order` van elke rij, de drie woordenboeklijsten, een logische naam die alleen uit spaties bestaat en een koppeling naar een verwijderd domein. Ze wordt met twee spaties ingesprongen, zonder regeleinde aan het eind. Gebruik de runtimewaarde alleen om via `setInitialValue()` een medebewerker of een tweede weergave te initialiseren, zodat het ongedaan maken van een verwijdering die een andere editor verstuurt, de entiteit daar volledig terugbrengt. Schrijf ze nooit naar een bestand; het JSON Schema weigert ze. Verwijderde entiteiten worden niet meer opgeruimd, dus de runtimewaarde behoudt ze tot het document de volgende keer vanuit zijn bestand wordt geopend.

Beide vormen schrijven elke vergrendelde instelling met haar vergrendelde waarde (zie [`lockSettings`](#settings)), `settings.ddlScripts` alleen zolang een script tekst bevat en de `groupId` van een tabel alleen zolang die niet leeg is. Sinds `4.2.0` schrijven beide ook `settings.nameViewMode` alleen zolang de waarde die ze schrijven niet `'physical'` is, `settings.columnOrder` met zeven elementen waar dat kan (zie [Settings](#settings)) en de `nameDerived` van een tabel alleen zolang die `true` is.  
De opslagvorm schrijft `doc.tableGroupIds` en `tableGroupEntities` alleen zolang er een tabelgroep bestaat, een `logicalName` alleen zolang die andere tekst dan spaties bevat, de `domainId` van een kolom alleen zolang die een domein noemt dat het bestand schrijft, en elk woordenboek alleen zolang het een rij bevat die het bestand schrijft. De runtimewaarde schrijft de velden voor tabelgroepen zolang het document een groep of een verwijderde groep bevat, `logicalName` en `domainId` zolang ze niet `''` zijn, en elk woordenboek met zijn lijst zolang een van beide een item bevat, een verwijderde rij inbegrepen.

## TypeScript {#typescript}

De typen beschrijven de runtimewaarde. Een veld met de markering `// runtime only` wordt in de opslagvorm weggelaten, en een veld met de markering `?` wordt alleen geschreven zolang het iets bevat. De lege tekst, lijsten en collecties die de opslagvorm sinds `4.2.0` weglaat, zijn niet gemarkeerd.

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
    wordEntities?: DictionaryRows; // rows of Word
    termEntities?: DictionaryRows; // rows of Term
    domainEntities?: DictionaryRows; // rows of Domain
  };
};
```

Elke entiteit heeft een `id`, een ondoorzichtige string, die haar sleutel in haar collectie is, behalve in de drie woordenboeken, waar de id de eerste waarde van een rij is. Sinds `4.2.0` leest het parseren een entiteit van de zeven collecties met sleutels waarvan de `id` ontbreekt, leeg is of geen string is, aan de hand van de sleutel waaronder ze staat, en laat het een item weg dat geen object is, of een item zonder id waarvan de sleutel `''` is. Een woordenboekrij wordt weggelaten als ze geen array is of als haar `id` geen andere string dan `''` is. Een editor vóór `4.2.0` laat een entiteit weg waarvan de `id` ontbreekt of leeg is, dus de opslagvorm schrijft nog steeds elke id.  
Sinds `4.0.0` is elke nieuwe id, ook die van een woordenboekrij, een UUIDv7 in Uuid25-vorm, 25 base-36-cijfers in kleine letters zoals `03gzrxjv20bdlcak89q25d2m7`, zodat de id's die één editor aanmaakt bij het sorteren de volgorde volgen waarin hij ze heeft gemaakt. Een document behoudt de id's die het bevat, zoals de nanoid-id's van een eerdere versie of de id's van een v2-bestand, dus niets mag uitgaan van de vorm van een id.

Sinds `4.0.0` heeft geen enkele entiteit een object `meta` (`createAt`, `updateAt`), en de typen `EntityMeta` en `EntityType` zijn verwijderd. Niets schrijft het, het parseren laat de `meta` weg die een ouder bestand bevat en het JSON Schema weigert het. Het bepaalde alleen wanneer verwijderde entiteiten werden opgeruimd, en dat opruimen is eveneens verdwenen.

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

`originX` en `originY` zijn de weergave: het punt op het scherm waar scènecoördinaat `(0, 0)` terechtkomt.  
`zoomLevel` loopt van `0.1` tot `1.5`. Een document dat boven `1` is opgeslagen, opent in een editor vóór `3.5.0` op `1`.  
Sinds `4.0.0` bevatten de instellingen geen `width`, `height`, `scrollTop`, `scrollLeft`, `relationshipOptimization` of `ignoreSaveSettings`. Niets schrijft ze, de parser behoudt er geen enkele van en het JSON Schema weigert een bestand dat ze nog heeft.

`canvasType` is het tabblad waarop een document opent. Een document dat op het tabblad Visualisatie is opgeslagen, bevat `'@dineug/erd-editor/builtin-visualization'`, maar niet of de modus `Graph` of `Flow` werd getoond, en een nieuw aangemaakte editor toont dat tabblad in de modus `Graph`.  
Sinds `4.0.0` behoudt het document, zolang de vergrendeling `Canvas Type` aanstaat, zoals in een nieuw document het geval is, het tabblad dat werd getoond toen het werd vergrendeld, en laat wisselen van tabblad `value` ongewijzigd. Een vergrendeling die op het tabblad Instellingen wordt ingesteld, legt het tabblad vast waar de lezer vandaan kwam, en een vergrendelde `'settings'`, die alleen een handmatige bewerking kan schrijven, opent op `'ERD'`.  
Sinds `4.2.0` kan `canvasType` ook `'@dineug/erd-editor/builtin-dictionary'` zijn, het tabblad [Woordenboek](../../guide/guides/dictionary.md), dat de vergrendeling `Canvas Type` vasthoudt zoals ze de andere tabbladen vasthoudt. Een editor vóór `4.2.0` behoudt die waarde, maar toont onder zijn werkbalk geen tabblad totdat de lezer er een kiest.  
Niets van de eigen toestand van de modus `Flow` wordt geserialiseerd: de plaatsing, het zoomniveau, de panpositie, de rijweergave en de gefocuste tabellen blijven in de editor, en sinds `4.2.0` geldt dat ook voor de weergaven waar [`Previous table` en `Next table`](../../guide/guides/visualization.md#previous-table-and-next-table) doorheen stappen. Daardoor beschrijven `originX`, `originY` en `zoomLevel` altijd het ERD-canvas.

`show` en `lockSettings` zijn bitmaskers — combineer de vlaggen met OR.  
`columnOrder` is een array die elke waarde van `ColumnType` één keer bevat, in weergavevolgorde; sinds `4.2.0` kan een document de array schrijven met zeven van de negen waarden, zoals de alinea over de kolomvolgorde hieronder beschrijft.  
`database`, `language`, `tableNameCase`, `columnNameCase` en `bracketType` bevatten elk precies één waarde, en het JSON Schema wijst een gecombineerde waarde af.

In een nieuw document is `show` gelijk aan `431`: `tableComment`, `columnComment`, `columnDataType`, `columnDefault`, `columnPrimaryKey`, `columnNotNull` en `relationship`.  
Sinds `3.10.0` zijn er nog twee vlaggen voor `show`, die allebei uitstaan in een nieuw document en in elk document dat vóór `3.10.0` is opgeslagen.  
`columnAlternateKey` (`512`) is de weergaveoptie [`Alternate Key`](../../guide/guides/table-related-functions.md#alternate-keys). Is de vlag gezet, dan markeert ze de kolommen van elke unieke index over twee of meer kolommen als `AK1.1`, `AK1.2` enzovoort. Ze staat aanvankelijk uit, dus geen enkel bestaand diagram verandert van breedte.  
`hideReferentialAction` (`1024`) werkt andersom: is de vlag gezet, dan verbergt ze de [labels voor ON DELETE en ON UPDATE](../../guide/guides/relationship-editing.md#reading-a-connector) op verbindingslijnen, dus standaard zijn ze zichtbaar. De weergaveoptie `Referential Actions` is aangevinkt zolang de vlag uitstaat. Ze verandert de grootte van geen enkele tabel.  
Een editor vóór `3.10.0` laat het getal in `show` intact, dus beide vlaggen blijven bewaard als daar wordt opgeslagen.

Sinds `4.0.0` zijn er nog twee vlaggen voor `show`, die allebei uitstaan in een nieuw document en in elk document dat vóór `4.0.0` is opgeslagen. Net als `hideReferentialAction` verbergt elke vlag wat haar naam noemt, dus standaard zijn tabelgroepen en memo's zichtbaar.  
`hideTableGroup` (`2048`) verbergt de [tabelgroepen](../../guide/guides/table-groups.md) en `hideMemo` (`4096`) verbergt elke memo. Het zijn de [weergaveopties](../../guide/guides/table-related-functions.md#table-view-options) `Table Groups` en `Memos`, die elk zijn aangevinkt zolang hun vlag uitstaat. Geen van beide verandert de grootte van een tabel.  
Een editor vóór `4.0.0` laat het getal in `show` intact, dus beide vlaggen blijven bewaard als daar wordt opgeslagen.

Sinds `4.2.0` is er nog een vlag voor `show`, `columnDomain` (`8192`), die uitstaat in een nieuw document en in elk document dat vóór `4.2.0` is opgeslagen, dus in een nieuw document is `show` nog steeds `431`. Het is de [weergaveoptie](../../guide/guides/table-related-functions.md#table-view-options) `Domain`: is de vlag gezet, dan toont elke kolomrij een [domeincel](../../guide/guides/logical-names.md#the-domain-cell), wat de tabellen breder maakt. Ze staat aanvankelijk uit, dus geen enkel bestaand diagram verandert van breedte.  
Een editor vóór `4.2.0` laat het getal in `show` intact, dus de vlag blijft bewaard als daar wordt opgeslagen.

Sinds `4.2.0` heeft `ColumnType` negen waarden. `columnLogicalName` (`128`) plaatst de cel van de logische naam, die een kolomrij alleen in de weergave `Both Names` toont, en `columnDomain` (`256`) de domeincel. Het zijn de rijen `Logical Name` en `Domain` van de [kolomvolgorde](../../guide/guides/settings.md#adjusting-column-order) op het tabblad Instellingen. Een editor houdt een volgorde van alle negen bij, en die van een nieuw document is `128, 1, 2, 256, 4, 8, 16, 32, 64`.  
Beide vormen schrijven de volgorde met zeven elementen, zonder `128` en `256`, zolang `128` direct vóór `columnName` staat en `256` direct na `columnDataType`. Daardoor schrijft een nieuw document nog steeds `1, 2, 4, 8, 16, 32, 64`, en behoudt een bestand waarvan de volgorde ze nooit heeft verplaatst, zijn bytes. Anders schrijven ze alle negen.  
Het parseren voegt de twee op die plaatsen in een volgorde met zeven elementen in, in welke volgorde de zeven ook staan, neemt negen elementen die elk type bevatten over zoals ze staan, en leest al het andere als de standaardvolgorde. Het JSON Schema accepteert zeven of negen gehele getallen.

Sinds `4.0.0` heeft `Language` acht extra doelen voor de [Codegenerator](../../guide/guides/code-generator.md), `Mermaid` tot en met `JSONSchema`. Een `language` die de parser niet kent, wordt gelezen als `GraphQL`, dus een editor vóór `4.0.0` opent een document dat met een van deze doelen is opgeslagen op GraphQL, en opslaan schrijft daar GraphQL.

Sinds `4.0.0` neemt `lockSettings` de plaats in van `ignoreSaveSettings`, en `LockSettingType` die van `SaveSettingType`, dat is verwijderd. `lockSettings` geeft de instellingen aan die een document opslaat zoals ze stonden toen ze werden vergrendeld. `viewport` omvat `originX`, `originY` en `zoomLevel` samen, omdat een oorsprong die zonder zijn zoomniveau is opgeslagen, ergens anders opent, en elke andere bit omvat het veld waarnaar hij is genoemd. Dit zijn de rijen onder [`Lock`](../../guide/guides/settings.md#lock) op het tabblad Instellingen.  
`value` en `runtimeValue` schrijven allebei een vergrendelde instelling met haar vergrendelde waarde, wat de editor ook toont, en elke andere instelling met haar huidige waarde. Zolang de bijbehorende vergrendeling aanstaat, laten scrollen en zoomen, wisselen van tabblad, het wijzigen van de taal van de Codegenerator, een naamnotatie of het type aanhalingstekens of het wisselen van naamweergave het bestand dus ongewijzigd. Vergrendelen neemt de waarde over die de instelling op dat moment heeft, en het parseren haalt de vergrendelde waarde uit het opgeslagen veld.  
Een document dat vanuit het niets is begonnen — een nieuwe editor of replicatiestore, of een lege waarde die aan `value` of `setInitialValue()` is gegeven — heeft `lockSettings` op `63` staan, met elke vergrendeling aan. Een document waarvan de `settings` geen `lockSettings` bevatten — elk bestand dat vóór `4.0.0` is opgeslagen, wat zijn `ignoreSaveSettings` ook is, en elk v2-document — opent eveneens met elke vergrendeling aan: de weergave en het tabblad staan waar die van een nieuw document staan (`originX` en `originY` `0`, `zoomLevel` `1`, het ERD-tabblad), en de taal, de naamnotaties en het type aanhalingstekens zijn vergrendeld op wat het heeft opgeslagen. Een document dat zijn vergrendelingen vermeldt, behoudt ze, `0` inbegrepen, en elke waarde die het heeft opgeslagen.  
Het parseren behoudt elke bit van `lockSettings`, ook onbekende, dus een vergrendeling die een latere versie toevoegt, blijft hier bij opslaan bewaard; het JSON Schema controleert alleen of de waarde een geheel getal is. Een editor vóór `4.0.0` laat `lockSettings` bij het opslaan weg en schrijft de weergave en het tabblad zoals ze op dat moment zijn, dus het bestand opent hier daarna weer als een bestand dat vóór `4.0.0` is opgeslagen.

Sinds `4.2.0` is er een zevende vergrendeling, `unlockNameViewMode` (`64`), de rij `Name View`, die `nameViewMode` omvat. De bit ervan werkt andersom dan de andere vergrendelingsbits, zoals de verbergbits van `Show`: is de bit gezet, dan is de naamweergave ontgrendeld, en is hij niet gezet, dan is ze vergrendeld. Daardoor betekent `63` nog steeds dat elke vergrendeling aanstaat, en een nieuw document bevat die waarde met de naamweergave vergrendeld op `'physical'`. Een bestand dat vóór `4.2.0` is opgeslagen, heeft de bit niet gezet, wat de andere vergrendelingen ook zijn, `0` inbegrepen, dus het opent met de naamweergave vergrendeld op `'physical'`. Een document met elke vergrendeling uit bevat `64`, en een document met elke andere vergrendeling aan en de naamweergave ontgrendeld bevat `127`. Test deze vergrendeling omgekeerd: ze staat aan zolang `(lockSettings & 64) === 0`.  
Zolang ze aanstaat, verandert een wissel van naamweergave alleen het scherm van de editor waarin hij is gemaakt, en behoudt het document de vergrendelde weergave. Zolang ze uitstaat, hoort een wissel in een editor die kan bewerken bij het document, en wisselt elke medebewerker mee. Een wissel in een editor in alleen-lezenmodus verandert in beide gevallen alleen het scherm van die editor zelf. Zie [`Lock`](../../guide/guides/settings.md#lock).  
Een editor van `4.0.0` of `4.1.0` behoudt de bit bij het opslaan, maar laat `nameViewMode` weg, dus het document opent hier daarna weer in `'physical'`, met de vergrendeling zoals ze was.

Sinds `4.0.0` bevat `ddlScripts` de twee scripts van het tabblad [Schema SQL](../../guide/guides/schema-sql.md), die de DDL van elke database schrijft: `before` na de kop en vóór de tabellen, `after` na de gegenereerde DDL. De DDL schrijft elk script met LF-regeleinden, zonder lege regels aan het begin en witruimte aan het eind, en op MSSQL afgesloten met `GO`, zoals [Scripts vóór en na de tabellen](../../guide/guides/schema-sql.md#before-and-after-scripts) beschrijft; `ddlScripts` zelf bewaart elk script zoals het is getypt. De sleutel wordt alleen geschreven zolang een van beide scripts tekst bevat, en dan met beide; een ontbrekende sleutel, of een script dat geen string is, wordt gelezen als `''`. De keuzes `Statements`, `Header` en `Tables` van het tabblad, en sinds `4.2.0` de schakelaar [`Write logical names into empty comments`](../../guide/guides/schema-sql.md#logical-names-as-comments) ervan, worden niet in het document opgeslagen.  
Een editor vóór `4.0.0` laat de scripts weg wanneer hij een document laadt, dus als daar wordt opgeslagen, gaan ze verloren.

Sinds `4.2.0` is `nameViewMode` de [naamweergave](../../guide/guides/logical-names.md#name-view), de namen die het diagram toont: `'physical'` de naam van elke tabel en kolom, `'logical'` de logische naam ervan op de plaats van de naam, en `'both'` de logische naam en de naam. De menu's noemen ze `Physical Names`, `Logical Names` en `Both Names`. Beide vormen schrijven de waarde als laatste, na `ddlScripts`, en alleen zolang de waarde die ze schrijven niet `'physical'` is; zolang de vergrendeling `Name View` aanstaat, is dat de vergrendelde waarde, wat het scherm ook toont. Een ontbrekende waarde, of een waarde die de parser niet kent, wordt gelezen als `'physical'`, en het JSON Schema accepteert alleen `"logical"` en `"both"`.  
Een editor vóór `4.2.0` laat `nameViewMode` weg wanneer hij een document laadt.

`Database`, `Language`, `Show`, `ColumnType`, `ColumnOption`, `LockSettingType` en `ReferentialAction` worden alleen aan het eind uitgebreid. Een opgeslagen document bewaart het getal, dus een nieuw databasesysteem, doel voor codegeneratie, vlag, kolomtype, kolomoptie, vergrendeling of actie krijgt de volgende bit in plaats van een plek in het midden.

### Doc {#doc}

```ts
type Doc = {
  tableIds: string[];
  relationshipIds: string[];
  indexIds: string[];
  memoIds: string[];
  tableGroupIds?: string[];
  wordIds?: string[]; // runtime only
  termIds?: string[]; // runtime only
  domainIds?: string[]; // runtime only
};
```

Elk van de eerste vijf lijsten is de volgorde van één soort entiteit, die de DDL, de tabelsortering en de tekenvolgorde lezen. In de opslagvorm bevat elke lijst alleen de id's van behouden entiteiten, elk één keer, in de vermelde volgorde, en sinds `4.2.0` wordt een lijst die er geen bevat, weggelaten. Sinds `4.0.0` is `tableGroupIds` de volgorde van de tabelgroepen.

Sinds `4.2.0` vermelden `wordIds`, `termIds` en `domainIds` de niet-verwijderde rijen van elk woordenboek: een rij die de collectie wel bevat maar de lijst niet, is verwijderd. Ze zijn niet de volgorde van een blad; die geeft de `order` van elke rij. Alleen de runtimewaarde schrijft ze, elk zolang de lijst zelf of de collectie ervan een item bevat. De rijen van een bestand zijn zelf het lidmaatschap en de volgorde, en het JSON Schema weigert de lijsten.  
Sinds `4.2.0` leest het parseren een lijst die het document weglaat, of als iets anders dan een array bevat, als elk item dat de collectie ervan bevat, elke id één keer, in de opgeslagen volgorde; een lege array blijft leeg, en elk item van de collectie wordt dan als verwijderd gelezen. Een editor vóór `4.2.0` leest een ontbrekende lijst als leeg, dus de opslagvorm schrijft nog steeds elke lijst zolang de collectie ervan een entiteit bevat.

Sinds `4.0.0` wordt de stapelvolgorde niet opgeslagen. Het parseren stapelt elke vermelde tabel, memo en tabelgroep zonder `zIndex` op basis van de positie in de lijst, waarbij latere vooraan liggen: tabelgroepen vanaf `1`, tabellen vanaf `2` en memo's boven elke tabel. Een entiteit met een `zIndex`, zoals in een runtimewaarde of een bestand dat vóór `4.0.0` is opgeslagen, behoudt die. Een tabel of memo naar voren brengen gaat daardoor verloren wanneer het bestand opnieuw wordt geopend.

### Collectie: tableEntities {#collection-tableentities}

```ts
type Table = {
  id: string;
  name: string;
  logicalName?: string;
  comment: string;
  columnIds: string[];
  seqColumnIds: string[]; // runtime only
  groupId?: string;
  nameDerived?: boolean;
  ui: TableUI;
};

type TableUI = {
  x: number;
  y: number;
  zIndex: number; // runtime only
  widthName: number; // runtime only
  widthLogicalName: number; // runtime only
  widthComment: number; // runtime only
  color: string;
};
```

Sinds `4.0.0` heeft een tabel een `groupId`, de id van de [tabelgroep](../../guide/guides/table-groups.md) waartoe ze behoort. Een ontbrekende of lege `groupId`, of een die geen groep in `doc.tableGroupIds` noemt, geldt als geen groep, en de opslagvorm schrijft hem alleen zolang hij een behouden groep noemt.  
Het parseren zet `seqColumnIds` op `columnIds` als die ontbreekt of een vermelde id mist, en een editor meet `widthName`, `widthLogicalName` en `widthComment` bij elke keer laden opnieuw met zijn eigen lettertypen.

Sinds `4.2.0` heeft een tabel een `logicalName`, de naam die de [weergaven](../../guide/guides/logical-names.md#name-view) `Logical Names` en `Both Names` tonen, `''` voor geen, en een `nameDerived`, `true` zolang de woordenboeken `name` uit de logische naam hebben [afgeleid](../../guide/guides/dictionary.md#deriving-physical-names). Zolang die vlag is gezet, leidt een nieuwe logische naam de naam opnieuw af; zolang ze niet is gezet, is de naam een eigen naam, en laat een nieuwe logische naam hem ongemoeid, tenzij de naam leeg is of alleen uit spaties bestaat. Een handmatige naamswijziging zet de vlag uit, en [`Derive Physical Names Again`](../../guide/guides/dictionary.md#derive-physical-names-again) herschrijft zelfs een naam die iemand zelf heeft ingevoerd en zet de vlag aan overal waar een logische naam is.  
De opslagvorm schrijft `logicalName` na `name`, zoals getypt, alleen zolang het veld andere tekst dan spaties bevat, en `nameDerived` na `groupId` alleen zolang het veld `true` is, de enige waarde die het JSON Schema accepteert. Een ontbrekende `logicalName` wordt gelezen als `''` en een ontbrekende `nameDerived` als `false`, dus elke naam in een bestand dat vóór `4.2.0` is opgeslagen, geldt als een eigen naam.  
Een editor vóór `4.2.0` laat beide weg wanneer hij een document laadt, dus als daar wordt opgeslagen, gaat de logische naam van elke tabel verloren.

### Collectie: tableColumnEntities {#collection-tablecolumnentities}

```ts
type Column = {
  id: string;
  tableId: string;
  name: string;
  comment: string;
  dataType: string;
  default: string;
  options: number; // Constants: ColumnOption
  logicalName?: string;
  domainId?: string;
  ui: ColumnUI; // runtime only
};

type ColumnUI = {
  keys: number; // Constants: ColumnUIKey
  widthName: number;
  widthLogicalName: number;
  widthComment: number;
  widthDataType: number;
  widthDomain: number;
  widthDefault: number;
};

// Constants
const ColumnOption = {
  autoIncrement: 1,
  primaryKey: 2,
  unique: 4,
  notNull: 8,
  nameDerived: 16,
} as const;

const ColumnUIKey = {
  primaryKey: 1,
  foreignKey: 2,
} as const;
```

Sinds `4.0.0` schrijft de opslagvorm geen `ui` voor kolommen. Bij elke keer laden wordt `keys` afgeleid, de markering voor de primaire sleutel uit de bit `primaryKey` van `options` en de markering voor de refererende sleutel uit de relaties die op de kolom eindigen, en worden de zes breedtes gemeten.  
Een editor vóór `4.0.0` toont de kolommen van een bestand dat hier is opgeslagen, zonder hun pictogrammen voor de primaire sleutel.

Sinds `4.2.0` heeft een kolom, net als een tabel, een `logicalName`, en een `domainId`, de id van het domein waaraan ze is gekoppeld, `''` voor geen. Bewerkingen in één editor houden een gekoppelde kolom op het gegevenstype van haar domein, zoals [Domeinen en gegevenstypen](../../guide/guides/dictionary.md#domains-and-data-types) beschrijft. Het parseren wijzigt echter het type van geen enkele kolom, dus een bestand dat elders is geschreven, kan een gekoppelde kolom op een ander type laten staan, en dat geldt ook voor gekruiste bewerkingen van twee medebewerkers; het blad Controles vermeldt elk geval als [`Domain type mismatch`](../../guide/guides/dictionary.md#what-each-check-finds). Het parseren wist een `domainId` die geen domein noemt dat het document bevat. Een verwijderd domein telt nog mee, dus de editor behoudt een koppeling ernaar zolang het ongedaan maken het domein kan terugbrengen. Na `options` schrijft de opslagvorm `logicalName` volgens de regel voor een tabel, en `domainId` alleen zolang die een domein noemt dat het bestand schrijft, dus nooit een koppeling naar een verwijderd domein.  
`ColumnOption.nameDerived` (`16`) is de vlag van de kolom voor een afgeleide naam, die met de andere bits in `options` staat en hetzelfde betekent als de `nameDerived` van een tabel. Een primaire sleutel met NOT NULL waarvan de woordenboeken de naam hebben afgeleid, heeft bijvoorbeeld `options` `26`.  
Een editor vóór `4.2.0` laat `logicalName` en `domainId` weg wanneer hij een document laadt, dus als daar wordt opgeslagen, gaan ze verloren. Hij laat het getal in `options` intact, dus de bit `nameDerived` blijft bewaard als daar wordt opgeslagen.

### Collectie: relationshipEntities {#collection-relationshipentities}

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

Sinds `3.10.0` heeft een relatie `onDelete` en `onUpdate`, haar [acties voor ON DELETE en ON UPDATE](../../guide/guides/relationship-editing.md#on-delete-and-on-update). Elk bevat precies één waarde van `ReferentialAction`. `none`, de standaardwaarde, schrijft geen clausule, zodat het eigen standaardgedrag van de database geldt. De andere vijf staan voor `NO ACTION`, `CASCADE`, `SET NULL`, `SET DEFAULT` en `RESTRICT`. Schema SQL schrijft een clausule alleen voor een database die de bijbehorende actie accepteert.  
De opslagvorm schrijft altijd beide, en sinds `4.0.0` vereist het JSON Schema ze, waarbij het alleen controleert of elk een geheel getal is. Het parseren leest een ontbrekend veld, zoals in elk document dat vóór `3.10.0` is opgeslagen, nog steeds als `none`, en dat geldt ook voor een waarde buiten de lijst.  
Een editor vóór `3.10.0` kent de velden niet en laat ze weg wanneer hij een document laadt, dus als daar wordt opgeslagen, gaat elke actie verloren.

Sinds `4.0.0` wordt bij elke keer laden afgeleid wat de opslagvorm weglaat. Een relatie is identificerend wanneer elke kolom waarop ze eindigt een primaire sleutel is, en haar `startRelationshipType` is `dash` wanneer elke zodanige kolom NOT NULL is en anders `ring`; een relatie zonder overgebleven eindkolom is niet-identificerend en `dash`, zoals een nieuwe relatie begint. De ankerpunten, `x`, `y` en `direction`, worden opnieuw geplaatst.

### Collectie: indexEntities {#collection-indexentities}

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

Het parseren zet `seqIndexColumnIds` op `indexColumnIds` als die ontbreekt of een vermelde id mist.

### Collectie: indexColumnEntities {#collection-indexcolumnentities}

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

### Collectie: memoEntities {#collection-memoentities}

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

Sinds `4.0.0` staan tabellen en memo's in [één gedeelde stapel](../../guide/guides/table-related-functions.md#moving-multiple-tables), geordend op `zIndex`, dus als je een tabel naar voren brengt, kan die boven een memo komen te liggen. Het parseren stapelt een memo die zonder `zIndex` is opgeslagen boven elke tabel, zoals [Doc](#doc) beschrijft. Een memo in een bestand dat vóór `4.0.0` is opgeslagen, behoudt de opgeslagen `zIndex`, die uit dezelfde teller kwam als die van de tabellen, dus een memo die een eerdere versie boven elke tabel tekende, kan openen onder een tabel die daarna naar voren is gebracht.

### Collectie: tableGroupEntities {#collection-tablegroupentities}

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

Sinds `4.0.0` kan een document [tabelgroepen](../../guide/guides/table-groups.md) bevatten: rechthoeken met een naam en een kleur, die achter tabellen worden getekend. Een tabel wordt lid van een groep via haar eigen `groupId`, dus een groep bevat geen lijst met leden. De opslagvorm schrijft de collectie, net als `doc.tableGroupIds`, alleen zolang er een groep bestaat, en een document zonder de collectie, zoals een document dat vóór `4.0.0` is opgeslagen, heeft geen groepen. `Show.hideTableGroup` verbergt ze.  
Een editor vóór `4.0.0` laat de groepen en de `groupId` van elke tabel weg wanneer hij een document laadt, dus als daar wordt opgeslagen, gaat elke groep verloren.

### Woordenboekrijen {#dictionary-rows}

Sinds `4.2.0` bevat een document drie woordenboeken, de bladen `Words`, `Terms` en `Domains` van het tabblad [Woordenboek](../../guide/guides/dictionary.md), in `wordEntities`, `termEntities` en `domainEntities`. Elk veld van een woord, term of domein is een string, en geen ervan heeft een `ui`. Het blad `Checks` wordt bepaald uit de woordenboeken en het diagram, en wordt niet opgeslagen.

```ts
type DictionaryRows = {
  fields: string[];
  rows: string[][];
};
```

Geen van de drie gebruikt de id als sleutel. Elk wordt geschreven als een koprij en rijen: `fields` noemt de velden van de entiteit één keer, de id eerst, en elke rij bevat de waarden van één entiteit in die volgorde. De typen hieronder geven de velden van elke entiteit in de volgorde van de koprij van de runtimewaarde. Een rij behoudt altijd haar id en naam, maar lege waarden aan het eind, na de naam, worden weggelaten, dus een lege waarde vóór een waarde die wordt behouden, blijft `''`, en het parseren leest een waarde die een rij mist als `''`. Beide vormen schrijven elke rij op een eigen regel als compacte JSON, zoals in deze twee woorden uit een bestand:

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

De opslagvorm schrijft de vermelde rijen in de volgorde van het blad en laat `order` weg, dus de koprijen ervan noemen dat veld niet. Ze laat een rij weg waarvan de waarden na de id allemaal leeg zijn of alleen uit spaties bestaan, zoals een rij die is toegevoegd en nooit ingevuld, of die is leeggemaakt, en elke koppeling naar zo'n domein of naar een verwijderd domein: de `domainId` van een kolom wordt weggelaten, en die van een term wordt geschreven als `''`, waarbij de term zelf wordt weggelaten als hij verder niets bevat.  
De koprijen van de runtimewaarde noemen `"order"` direct na `"name"`. De runtimewaarde schrijft elke rij die de collectie bevat, verwijderde inbegrepen, in de volgorde waarin de collectie ze bevat, dus sorteer op `order`, vergeleken in volgorde van code-eenheden, voor de volgorde van een blad. Het parseren geeft de rijen van een bestand `order`-sleutels in de volgorde waarin de rijen staan, zodat ze worden teruggelezen in de volgorde waarin het bestand ze schreef.  
Een document zonder de woordenboeken, zoals een document dat vóór `4.2.0` is opgeslagen, heeft er geen. Een editor vóór `4.2.0` laat alle drie weg wanneer hij een document laadt, dus als daar wordt opgeslagen, gaat elk woord, elke term en elk domein verloren.

### Collectie: wordEntities {#collection-wordentities}

```ts
type Word = {
  id: string;
  name: string;
  order: string; // runtime only
  abbreviation: string;
  englishName: string;
  description: string;
  synonyms: string;
  forbiddenWords: string;
};
```

Een woord is een van de woorden waaruit een logische naam bestaat, en `abbreviation` is wat het woord in een fysieke naam vertegenwoordigt. `synonyms` vermeldt andere schrijfwijzen van het woord, en `forbiddenWords` woorden die niet in plaats ervan mogen worden gebruikt, elk door komma's gescheiden.

### Collectie: termEntities {#collection-termentities}

```ts
type Term = {
  id: string;
  name: string;
  order: string; // runtime only
  physicalName: string;
  domainId: string;
  description: string;
  synonyms: string;
};
```

Een term is een volledige logische naam. Een tabel of kolom waarvan de `logicalName` overeenkomt met `name`, leidt `physicalName` af of, zolang dat leeg is, een naam die uit de afkortingen van de woorden is samengesteld, en een kolom krijgt ook het domein dat `domainId` noemt, `''` voor geen (zie [Fysieke namen afleiden](../../guide/guides/dictionary.md#deriving-physical-names)). `synonyms` is door komma's gescheiden. Het parseren wist een `domainId` die geen domein noemt, net als bij een kolom.

### Collectie: domainEntities {#collection-domainentities}

```ts
type Domain = {
  id: string;
  name: string;
  order: string; // runtime only
  category: string;
  dataType: string;
  description: string;
};
```

Een domein is een gegevenstype met een naam, waarbij `dataType` het type bevat zoals een kolom dat doet, lengte inbegrepen, zoals `NUMERIC(10)`. Een kolom of term koppelt een domein via zijn id, en de editor geeft elke gekoppelde kolom het gegevenstype van het domein (zie [Domeinen en gegevenstypen](../../guide/guides/dictionary.md#domains-and-data-types)).

## JSON Schema {#json-schema}

Het canonieke schemabestand is gepubliceerd op [json-schema/schema.json](https://raw.githubusercontent.com/dineug/erd-editor/main/json-schema/schema.json), en er kan rechtstreeks met `$schema` naar worden verwezen.

```json
{
  "$schema": "https://raw.githubusercontent.com/dineug/erd-editor/main/json-schema/schema.json",
  "version": "3.0.0"
}
```

Zet `$schema` bovenaan een `.erd.json`-bestand, dan valideren editors die JSON Schema begrijpen, zoals VS Code, het document en vullen ze de velden automatisch aan terwijl je bewerkt.

Sinds `4.0.0` beschrijft het schema alleen de opslagvorm. Elk object met benoemde velden is gesloten (`additionalProperties: false`), elk veld dat de opslagvorm altijd schrijft, is verplicht, een veld dat ze weglaat zolang het niets bevat, wordt genoemd maar is niet verplicht, en geen enkel veld dat ze altijd weglaat, wordt genoemd. Daarom weigert het schema de runtimewaarde. Het weigert ook een bestand dat vóór `4.0.0` is opgeslagen, met zijn `meta`, breedtes, `zIndex`, `ignoreSaveSettings` en de rest, totdat een editor van `4.0.0` of later dat bestand opnieuw opslaat. Een bestand dat door `3.2.0` of later is opgeslagen, noemt al de URL van dit schema, die naar de branch `main` wijst, dus een editor die ertegen valideert, markeert het bestand nu. Een bestand dat door `3.0.0` of `3.1.0` is opgeslagen, of een v2-document, noemt geen `$schema`.

Sinds `4.2.0` vereist het schema niet langer de tekstvelden van een entiteit, een lijst in `doc`, een collectie of `collections` zelf, die de opslagvorm weglaat zolang ze niets bevatten. Het accepteert nog steeds een bestand dat door `4.0.0` of `4.1.0` is opgeslagen. Het noemt de nieuwe velden: `nameViewMode`, dat alleen `"logical"` en `"both"` accepteert; de `logicalName` en `nameDerived` van een tabel, waarbij `nameDerived` alleen `true` accepteert; de `logicalName` en `domainId` van een kolom; en de drie woordenboeken, elk met een koprij en rijen van strings. `canvasType` vermeldt het tabblad Woordenboek, `columnOrder` accepteert zeven of negen gehele getallen, en de beschrijvingen van `show`, `columnOrder`, `lockSettings` en `options` noemen de nieuwe bits.

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
