---
sidebar_position: 3
description: Het documentformaat .erd.json — de opslagvorm die een bestand bevat en de runtimewaarde die een editor vasthoudt, de TypeScript-typen, de constanten achter elk numeriek veld en het gepubliceerde JSON Schema.
---

# Schema

`.erd.json` is het documentformaat van de editor. Lees deze pagina als je een document buiten de editor moet genereren, valideren of migreren.

Sinds `4.0.0` heeft een document twee serialisaties, beide met `version` `'3.0.0'`. De opslagvorm is wat een bestand bevat: het is wat [`editor.value`](../erd-editor-element.md#value) retourneert, wat de JSON-export schrijft en de enige vorm die het gepubliceerde [JSON Schema](#json-schema) accepteert. De runtimewaarde is het hele document zoals een editor het vasthoudt, en is wat [`editor.runtimeValue`](../erd-editor-element.md#runtimevalue) retourneert. `setInitialValue()`, de setter `value` en `setSchemaJSON()` lezen beide vormen, elk bestand dat een eerdere versie heeft opgeslagen en een `.vuerd`-document uit v2. Vóór `4.0.0` was er maar één: `value` retourneerde het hele document zoals de editor het vasthield, zoals `runtimeValue` dat nu doet.

## Opslagvorm en runtimewaarde {#storage-form-and-runtime-value}

De opslagvorm bevat alleen de niet-verwijderde entiteiten: elke tabel die in `doc.tableIds` vermeld staat, de kolommen die die tabellen vermelden, de relaties tussen twee behouden tabellen, de indexen van behouden tabellen met de indexkolommen waarvan de tabel de kolom nog vermeldt en de vermelde memo's en tabelgroepen. Ze laat weg wat een editor bij het laden afleidt of bijhoudt zolang hij geopend is: verwijderde entiteiten, `seqColumnIds` en `seqIndexColumnIds`, elke `zIndex`, de gemeten breedtes, de `ui` van kolommen en van een relatie de `identification`, de `startRelationshipType` en de ankerpunten. De typen hieronder markeren elk van deze velden met `// runtime only`.  
Elke collectie gebruikt de id als sleutel, in volgorde van code-eenheden, waarbij kolommen eerst op `tableId` en indexkolommen eerst op `indexId` worden gegroepeerd. Elke entiteit schrijft haar velden in een vaste volgorde, en de tekst wordt met twee spaties ingesprongen en eindigt met een regeleinde. Daardoor schrijft hetzelfde document altijd dezelfde bytes, verandert een bewerking alleen wat ze raakt en opent een bestand dat is opgeslagen op een computer met andere lettertypen opnieuw met dezelfde `value`.  
VS Code, Obsidian en de JetBrains-plug-in schrijven een bestand alleen wanneer een bewerking `value` wijzigt, dus een bestand dat een eerdere versie heeft opgeslagen, behoudt zijn oude vorm tot de eerste bewerking.

De runtimewaarde behoudt wat de opslagvorm weglaat: verwijderde entiteiten, volgordes, z-indexen, breedtes, sleutelmarkeringen, relatievlaggen en ankerpunten. Ze wordt met twee spaties ingesprongen, zonder regeleinde aan het eind. Gebruik de runtimewaarde alleen om via `setInitialValue()` een medebewerker of een tweede weergave te initialiseren, zodat het ongedaan maken van een verwijdering die een andere editor verstuurt, de entiteit daar volledig terugbrengt. Schrijf ze nooit naar een bestand; het JSON Schema weigert ze. Verwijderde entiteiten worden niet meer opgeruimd, dus de runtimewaarde behoudt ze tot het document de volgende keer vanuit zijn bestand wordt geopend.

Beide vormen schrijven elke vergrendelde instelling met haar vergrendelde waarde (zie [`lockSettings`](#settings)), `settings.ddlScripts` alleen zolang een script tekst bevat en de `groupId` van een tabel alleen zolang die niet leeg is. De opslagvorm schrijft `doc.tableGroupIds` en `tableGroupEntities` alleen zolang er een tabelgroep bestaat; de runtimewaarde schrijft ze zolang het document een groep of een verwijderde groep bevat.

## TypeScript {#typescript}

De typen beschrijven de runtimewaarde. Een veld met de markering `// runtime only` wordt in de opslagvorm weggelaten, en een veld met de markering `?` wordt alleen geschreven zolang het iets bevat.

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

Elke entiteit heeft haar `id` als sleutel, een ondoorzichtige string; het parseren laat een entiteit weg waarvan de `id` ontbreekt of leeg is. Sinds `4.0.0` is elke nieuwe id een UUIDv7 in Uuid25-vorm, 25 base-36-cijfers in kleine letters zoals `03gzrxjv20bdlcak89q25d2m7`, zodat de id's die één editor aanmaakt bij het sorteren de volgorde volgen waarin hij ze heeft gemaakt. Een document behoudt de id's die het bevat, zoals de nanoid-id's van een eerdere versie of de id's van een v2-bestand, dus niets mag uitgaan van de vorm van een id.

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

`originX` en `originY` zijn de weergave: het punt op het scherm waar scènecoördinaat `(0, 0)` terechtkomt.  
`zoomLevel` loopt van `0.1` tot `1.5`. Een document dat boven `1` is opgeslagen, opent in een editor vóór `3.5.0` op `1`.  
Sinds `4.0.0` bevatten de instellingen geen `width`, `height`, `scrollTop`, `scrollLeft`, `relationshipOptimization` of `ignoreSaveSettings`. Niets schrijft ze, de parser behoudt er geen enkele van en het JSON Schema weigert een bestand dat ze nog heeft.

`canvasType` is het tabblad waarop een document opent. Een document dat op het tabblad Visualisatie is opgeslagen, bevat `'@dineug/erd-editor/builtin-visualization'`, maar niet of de modus `Graph` of `Flow` werd getoond, en een nieuw aangemaakte editor toont dat tabblad in de modus `Graph`.  
Sinds `4.0.0` behoudt het document, zolang de vergrendeling `Canvas Type` aanstaat, zoals in een nieuw document het geval is, het tabblad dat werd getoond toen het werd vergrendeld, en laat wisselen van tabblad `value` ongewijzigd. Een vergrendeling die op het tabblad Instellingen wordt ingesteld, legt het tabblad vast waar de lezer vandaan kwam, en een vergrendelde `'settings'`, die alleen een handmatige bewerking kan schrijven, opent op `'ERD'`.  
Niets van de eigen toestand van de modus `Flow` wordt geserialiseerd — de plaatsing, het zoomniveau, de panpositie, de rijweergave en de gefocuste tabellen blijven in de editor — dus `originX`, `originY` en `zoomLevel` beschrijven altijd het ERD-canvas.

`show` en `lockSettings` zijn bitmaskers — combineer de vlaggen met OR.  
`columnOrder` is een array met alle zeven waarden van `ColumnType`, in weergavevolgorde.  
`database`, `language`, `tableNameCase`, `columnNameCase` en `bracketType` bevatten elk precies één waarde, en het JSON Schema wijst een gecombineerde waarde af.

In een nieuw document is `show` gelijk aan `431`: `tableComment`, `columnComment`, `columnDataType`, `columnDefault`, `columnPrimaryKey`, `columnNotNull` en `relationship`.  
Sinds `3.10.0` zijn er nog twee vlaggen voor `show`, die allebei uitstaan in een nieuw document en in elk document dat vóór `3.10.0` is opgeslagen.  
`columnAlternateKey` (`512`) is de weergaveoptie [`Alternate Key`](../../guide/guides/table-related-functions.md#alternate-keys). Is de vlag gezet, dan markeert ze de kolommen van elke unieke index over twee of meer kolommen als `AK1.1`, `AK1.2` enzovoort. Ze staat aanvankelijk uit, dus geen enkel bestaand diagram verandert van breedte.  
`hideReferentialAction` (`1024`) werkt andersom: is de vlag gezet, dan verbergt ze de [labels voor ON DELETE en ON UPDATE](../../guide/guides/relationship-editing.md#reading-a-connector) op verbindingslijnen, dus standaard zijn ze zichtbaar. De weergaveoptie `Referential Actions` is aangevinkt zolang de vlag uitstaat. Ze verandert de grootte van geen enkele tabel.  
Een editor vóór `3.10.0` laat het getal in `show` intact, dus beide vlaggen blijven bewaard als daar wordt opgeslagen.

Sinds `4.0.0` zijn er nog twee vlaggen voor `show`, die allebei uitstaan in een nieuw document en in elk document dat vóór `4.0.0` is opgeslagen. Net als `hideReferentialAction` verbergt elke vlag wat haar naam noemt, dus standaard zijn tabelgroepen en memo's zichtbaar.  
`hideTableGroup` (`2048`) verbergt de [tabelgroepen](../../guide/guides/table-groups.md) en `hideMemo` (`4096`) verbergt elke memo. Het zijn de [weergaveopties](../../guide/guides/table-related-functions.md#table-view-options) `Table Groups` en `Memos`, die elk zijn aangevinkt zolang hun vlag uitstaat. Geen van beide verandert de grootte van een tabel.  
Een editor vóór `4.0.0` laat het getal in `show` intact, dus beide vlaggen blijven bewaard als daar wordt opgeslagen.

Sinds `4.0.0` heeft `Language` acht extra doelen voor de [Codegenerator](../../guide/guides/code-generator.md), `Mermaid` tot en met `JSONSchema`. Een `language` die de parser niet kent, wordt gelezen als `GraphQL`, dus een editor vóór `4.0.0` opent een document dat met een van deze doelen is opgeslagen op GraphQL, en opslaan schrijft daar GraphQL.

Sinds `4.0.0` neemt `lockSettings` de plaats in van `ignoreSaveSettings`, en `LockSettingType` die van `SaveSettingType`, dat is verwijderd. `lockSettings` geeft de instellingen aan die een document opslaat zoals ze stonden toen ze werden vergrendeld. `viewport` omvat `originX`, `originY` en `zoomLevel` samen, omdat een oorsprong die zonder zijn zoomniveau is opgeslagen, ergens anders opent, en elke andere bit omvat het veld waarnaar hij is genoemd. Dit zijn de rijen onder [`Lock`](../../guide/guides/settings.md#lock) op het tabblad Instellingen.  
`value` en `runtimeValue` schrijven allebei een vergrendelde instelling met haar vergrendelde waarde, wat de editor ook toont, en elke andere instelling met haar huidige waarde. Zolang de bijbehorende vergrendeling aanstaat, laten scrollen en zoomen, wisselen van tabblad of het wijzigen van de taal van de Codegenerator, een naamnotatie of het type aanhalingstekens het bestand dus ongewijzigd. Vergrendelen neemt de waarde over die de instelling op dat moment heeft, en het parseren haalt de vergrendelde waarde uit het opgeslagen veld.  
Een document dat vanuit het niets is begonnen — een nieuwe editor of replicatiestore, of een lege waarde die aan `value` of `setInitialValue()` is gegeven — heeft `lockSettings` op `63` staan, met elke vergrendeling aan. Een document waarvan de `settings` geen `lockSettings` bevatten — elk bestand dat vóór `4.0.0` is opgeslagen, wat zijn `ignoreSaveSettings` ook is, en elk v2-document — opent eveneens met elke vergrendeling aan: de weergave en het tabblad staan waar die van een nieuw document staan (`originX` en `originY` `0`, `zoomLevel` `1`, het ERD-tabblad), en de taal, de naamnotaties en het type aanhalingstekens zijn vergrendeld op wat het heeft opgeslagen. Een document dat zijn vergrendelingen vermeldt, behoudt ze, `0` inbegrepen, en elke waarde die het heeft opgeslagen.  
Het parseren behoudt elke bit van `lockSettings`, ook onbekende, dus een vergrendeling die een latere versie toevoegt, blijft hier bij opslaan bewaard; het JSON Schema controleert alleen of de waarde een geheel getal is. Een editor vóór `4.0.0` laat `lockSettings` bij het opslaan weg en schrijft de weergave en het tabblad zoals ze op dat moment zijn, dus het bestand opent hier daarna weer als een bestand dat vóór `4.0.0` is opgeslagen.

Sinds `4.0.0` bevat `ddlScripts` de twee scripts van het tabblad [Schema SQL](../../guide/guides/schema-sql.md), die de DDL van elke database schrijft: `before` na de kop en vóór de tabellen, `after` na de gegenereerde DDL. De DDL schrijft elk script met LF-regeleinden, zonder lege regels aan het begin en witruimte aan het eind, en op MSSQL afgesloten met `GO`, zoals [Scripts vóór en na de tabellen](../../guide/guides/schema-sql.md#before-and-after-scripts) beschrijft; `ddlScripts` zelf bewaart elk script zoals het is getypt. De sleutel wordt alleen geschreven zolang een van beide scripts tekst bevat, en dan met beide; een ontbrekende sleutel, of een script dat geen string is, wordt gelezen als `''`. De keuzes `Statements`, `Header` en `Tables` van het tabblad worden niet in het document opgeslagen.  
Een editor vóór `4.0.0` laat de scripts weg wanneer hij een document laadt, dus als daar wordt opgeslagen, gaan ze verloren.

`Database`, `Language`, `Show`, `LockSettingType` en `ReferentialAction` worden alleen aan het eind uitgebreid. Een opgeslagen document bewaart het getal, dus een nieuw databasesysteem, een nieuw doel voor codegeneratie, een nieuwe vlag, vergrendeling of actie krijgt de volgende bit in plaats van een plek in het midden.

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

Elke lijst is de volgorde van één soort entiteit, die de DDL, de tabelsortering en de tekenvolgorde lezen. In de opslagvorm bevat elke lijst alleen de id's van behouden entiteiten, elk één keer, in de vermelde volgorde. Sinds `4.0.0` is `tableGroupIds` de volgorde van de tabelgroepen.

Sinds `4.0.0` wordt de stapelvolgorde niet opgeslagen. Het parseren stapelt elke vermelde tabel, memo en tabelgroep zonder `zIndex` op basis van de positie in de lijst, waarbij latere vooraan liggen: tabelgroepen vanaf `1`, tabellen vanaf `2` en memo's boven elke tabel. Een entiteit met een `zIndex`, zoals in een runtimewaarde of een bestand dat vóór `4.0.0` is opgeslagen, behoudt die. Een tabel of memo naar voren brengen gaat daardoor verloren wanneer het bestand opnieuw wordt geopend.

### Collectie: tableEntities {#collection-tableentities}

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

Sinds `4.0.0` heeft een tabel een `groupId`, de id van de [tabelgroep](../../guide/guides/table-groups.md) waartoe ze behoort. Een ontbrekende of lege `groupId`, of een die geen groep in `doc.tableGroupIds` noemt, geldt als geen groep, en de opslagvorm schrijft hem alleen zolang hij een behouden groep noemt.  
Het parseren zet `seqColumnIds` op `columnIds` als die ontbreekt of een vermelde id mist, en een editor meet `widthName` en `widthComment` bij elke keer laden opnieuw met zijn eigen lettertypen.

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

Sinds `4.0.0` schrijft de opslagvorm geen `ui` voor kolommen. Bij elke keer laden wordt `keys` afgeleid, de markering voor de primaire sleutel uit de bit `primaryKey` van `options` en de markering voor de refererende sleutel uit de relaties die op de kolom eindigen, en worden de vier breedtes gemeten.  
Een editor vóór `4.0.0` toont de kolommen van een bestand dat hier is opgeslagen, zonder hun pictogrammen voor de primaire sleutel.

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

## JSON Schema {#json-schema}

Het canonieke schemabestand is gepubliceerd op [json-schema/schema.json](https://raw.githubusercontent.com/dineug/erd-editor/main/json-schema/schema.json), en er kan rechtstreeks met `$schema` naar worden verwezen.

```json
{
  "$schema": "https://raw.githubusercontent.com/dineug/erd-editor/main/json-schema/schema.json",
  "version": "3.0.0"
}
```

Zet `$schema` bovenaan een `.erd.json`-bestand, dan valideren editors die JSON Schema begrijpen, zoals VS Code, het document en vullen ze de velden automatisch aan terwijl je bewerkt.

Sinds `4.0.0` beschrijft het schema alleen de opslagvorm. Elk object met benoemde velden is gesloten (`additionalProperties: false`), elk veld dat de opslagvorm altijd schrijft, is verplicht, en geen enkel veld dat ze weglaat, wordt genoemd. Daarom weigert het schema de runtimewaarde. Het weigert ook een bestand dat vóór `4.0.0` is opgeslagen, met zijn `meta`, breedtes, `zIndex`, `ignoreSaveSettings` en de rest, totdat een editor van `4.0.0` of later dat bestand opnieuw opslaat. Een bestand dat door `3.2.0` of later is opgeslagen, noemt al de URL van dit schema, die naar de branch `main` wijst, dus een editor die ertegen valideert, markeert het bestand nu. Een bestand dat door `3.0.0` of `3.1.0` is opgeslagen, of een v2-document, noemt geen `$schema`.

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
