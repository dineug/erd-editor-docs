---
sidebar_position: 3
description: ".erd.json dokumentu-formatua: fitxategi batek duen biltegiratze-forma eta editore batek duen exekuzio-garaiko balioa, TypeScript motak, zenbakizko eremu bakoitzaren atzeko konstanteak eta argitaratutako JSON Schema."
---

# Eskema

`.erd.json` editorearen dokumentu-formatua da. Irakurri orri hau dokumentu bat editoretik kanpo sortu, balidatu edo migratu behar baduzu.

`4.0.0` bertsiotik aurrera, dokumentu batek bi serializazio ditu, biak `version` eremuan `'3.0.0'` balioarekin. Biltegiratze-forma fitxategi batek duena da: [`editor.value`](../erd-editor-element.md#value) propietateak itzultzen duena, JSON esportazioak idazten duena eta argitaratutako [JSON Schema](#json-schema) eskemak onartzen duen forma bakarra. Exekuzio-garaiko balioa dokumentu osoa da editore batek duen bezala, eta [`editor.runtimeValue`](../erd-editor-element.md#runtimevalue) propietateak itzultzen du. `setInitialValue()` metodoak, `value` propietatea esleitzeak eta `setSchemaJSON()` metodoak bi formetako edozein irakurtzen dute, baita aurreko bertsio batek gordetako edozein fitxategi eta v2 `.vuerd` dokumentu bat ere. `4.0.0` bertsioa baino lehen bakarra zegoen: `value` propietateak dokumentu osoa itzultzen zuen editoreak zuen bezala, orain `runtimeValue` propietateak egiten duen moduan.

## Biltegiratze-forma eta exekuzio-garaiko balioa {#storage-form-and-runtime-value}

Biltegiratze-formak entitate biziak soilik ditu: `doc.tableIds` eremuan zerrendatutako taula bakoitza, taula horiek zerrendatzen dituzten zutabeak, mantendutako bi taulen arteko erlazioak, mantendutako taulen indizeak, taulak oraindik zerrendatzen duen zutabea duten indize-zutabeekin, zerrendatutako oharrak eta taula-taldeak, eta, `4.2.0` bertsiotik aurrera, id-az gain balioren bat duten zerrendatutako hitzak, terminoak eta domeinuak. Kanpoan uzten du editore batek kargatzean eratortzen duena edo irekita dagoen bitartean mantentzen duena: kendutako entitateak, `seqColumnIds` eta `seqIndexColumnIds`, `zIndex` balio guztiak, neurtutako zabalerak, zutabearen `ui` eremua, erlazio baten `identification`, `startRelationshipType` eta aingurak, eta, `4.2.0` bertsiotik aurrera, hiztegiko errenkada bakoitzaren `order` eremua eta `doc.wordIds`, `doc.termIds` eta `doc.domainIds` zerrendak. Beheko motek `// runtime only` marka jartzen diote eremu horietako bakoitzari.  
Hiztegiak ez beste bilduma bakoitzaren gakoak id-ak dira, kode-unitateen ordenan; zutabeak lehenik `tableId` eremuaren arabera taldekatzen dira, eta indize-zutabeak `indexId` eremuaren arabera. `4.2.0` bertsiotik aurrera, `wordEntities`, `termEntities` eta `domainEntities` beste bilduma guztien ondoren datoz, ordena horretan, bakoitza goiburu bat eta errenkadak gisa idatzita, errenkada bat lerro bakoitzeko (ikus [Hiztegien errenkadak](#dictionary-rows)). Entitate bakoitzak bere eremuak ordena finko batean idazten ditu, eta testua bi zuriunez koskatzen da eta lerro-jauzi batekin amaitzen da. Horrela, dokumentu berak beti byte berak idazten ditu, edizio batek ukitzen duena soilik aldatzen du, eta beste letra-tipo batzuk dituen makina batean gordetako fitxategi batek `value` bera ematen du berriro irekitzean.  
VS Code editoreak, Obsidian aplikazioak eta JetBrains pluginak edizio batek `value` aldatzen duenean soilik idazten dute fitxategia; beraz, aurreko bertsio batek gordetako fitxategi batek bere forma zaharra mantentzen du lehen ediziora arte.

`4.2.0` bertsiotik aurrera, biltegiratze-formak ezer ez duena ere kanpoan uzten du: entitate batek edo haren `ui` eremuak `''` gisa duen testu-eremu bakoitza (taula baten `name`, `comment` eta `ui.color`, zutabe baten `name`, `comment`, `dataType` eta `default`, indize baten `name`, ohar baten `value` eta `ui.color`, taula-talde baten `name` eta `color`), sarrerarik ez duen `doc` zerrenda eta bilduma bakoitza, eta `collections` bera, bilduma guztiak hutsik daudenean. Zuriunez soilik osatutako testua dagoen bezala idazten da, bi salbuespenekin: izen logiko bat, orduan kanpoan uzten dena, eta id-az gaindiko balio guztiak hutsik edo zuriunez soilik dituen hitz, termino edo domeinu bat, osorik kanpoan uzten dena. Id guztiak, entitate baten barruko zerrenda guztiak eta zenbaki guztiak, `0` barne, idazten dira oraindik. `doc` eremua beti idazten da; beraz, dokumentu berri baten fitxategiak `$schema`, `version`, bere ezarpenak eta `"doc": {}` ditu.  
Analisi batek falta den testu-eremu bat `''` gisa irakurtzen du, eta falta den bilduma bat huts gisa, v3 bertsio guztiek egiten duten bezala, eta biltegiratze-formak `doc` zerrenda bat kanpoan uzten du haren bildumak ezer ez duen bitartean soilik (ikus [Doc](#doc)). Beraz, `4.2.0` bertsioa baino lehenagoko editore batek ere irekitzen ditu fitxategi hauek, eta fitxategi bat berak irakurtzen duen programa batek modu berean irakurri behar du falta dena. Aurreko bertsio batek gordetako fitxategi bat hurrengo gordetzean testu, zerrenda eta bilduma hutsak kanpoan utzita itzultzen da, behin bakarrik egiten den aldaketa bat, eta handik aurrera bytez byte gordetzen da.

Exekuzio-garaiko balioak biltegiratze-formak kanpoan uzten duena mantentzen du: kendutako entitateak, sekuentziak, z-indizeak, zabalerak, gako-markak, erlazio-banderak eta aingurak, testu-eremu hutsak, eta `tableIds`, `relationshipIds`, `indexIds` eta `memoIds` lau zerrendak eta `tableEntities` bildumatik `memoEntities` bildumara arteko sei bildumak, hutsik daudenean ere. `4.2.0` bertsiotik aurrera, kendutako hitzak, terminoak eta domeinuak, ezer ez duten errenkadak, errenkada bakoitzaren `order` eremua, hiztegien hiru zerrendak, zuriunez soilik osatutako izen logiko bat eta kendutako domeinu baterako lotura bat ere mantentzen ditu. Bi zuriunez koskatzen da, amaieran lerro-jauzirik gabe. Erabili soilik lankide bat edo bigarren ikuspegi bat `setInitialValue()` metodoaren bidez hasieratzeko, beste editore batek bidaltzen duen kentze baten desegiteak entitatea osorik itzul dezan han. Ez idatzi inoiz fitxategi batean; JSON Schema eskemak ukatu egiten du. Kendutako entitateak jada ez ditu ezerk biltzen; beraz, exekuzio-garaiko balioak mantendu egiten ditu dokumentua hurrengoan bere fitxategitik ireki arte.

Bi formek ezarpen blokeatu bakoitza bere balio blokeatuan idazten dute (ikus [`lockSettings`](#settings)), `settings.ddlScripts` script batek testua duen bitartean soilik, eta taula baten `groupId` hutsik ez dagoen bitartean soilik. `4.2.0` bertsiotik aurrera, biek idazten dute, halaber, `settings.nameViewMode` idazten duten balioa `'physical'` ez den bitartean soilik, `settings.columnOrder` zazpi sarreratan, ahal den lekuan (ikus [Settings](#settings)), eta taula baten `nameDerived` `true` den bitartean soilik.  
Biltegiratze-formak `doc.tableGroupIds` eta `tableGroupEntities` taula-talde bat dagoen bitartean soilik idazten ditu, `logicalName` bat zuriuneez bestelako testua duen bitartean soilik, zutabe baten `domainId` fitxategiak idazten duen domeinu bat izendatzen duen bitartean soilik, eta hiztegi bakoitza fitxategiak idazten duen errenkada bat duen bitartean soilik. Exekuzio-garaiko balioak taula-taldeen eremuak dokumentuak talde bat edo kendutako bat duen bitartean idazten ditu, `logicalName` eta `domainId` `''` ez diren bitartean, eta hiztegi bakoitza bere zerrendarekin, bietako batek sarrera bat duen bitartean, kendutako errenkada bat barne.

## TypeScript {#typescript}

Motek exekuzio-garaiko balioa deskribatzen dute. `// runtime only` marka duen eremua biltegiratze-formatik kanpo geratzen da, eta `?` marka duen eremua zerbait duen bitartean soilik idazten da. Biltegiratze-formak `4.2.0` bertsiotik aurrera kanpoan uzten dituen testu, zerrenda eta bilduma hutsak ez daude markatuta.

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

Entitate orok `id` bat du, kate opako bat, bere bilduman gako gisa erabiltzen dena, hiru hiztegietan izan ezik: horietan, errenkada baten lehen balioa da. `4.2.0` bertsiotik aurrera, analisi batek gakodun zazpi bildumetako entitate bat, haren `id` falta denean, hutsik dagoenean edo katea ez denean, gordeta dagoen gakoaren arabera irakurtzen du, eta alde batera uzten du objektua ez den sarrera bat, edo id-rik ez duena eta `''` gakoa duena. Hiztegiko errenkada bat alde batera uzten da array bat ez denean edo haren `id` balioa `''` ez den kate bat ez denean. `4.2.0` bertsioa baino lehenagoko editore batek alde batera uzten du `id` eremua falta zaion edo hutsik duen entitatea; beraz, biltegiratze-formak id guztiak idazten ditu oraindik.  
`4.0.0` bertsiotik aurrera, id berri bakoitza, hiztegiko errenkada batena barne, Uuid25 forman idatzitako UUIDv7 bat da, 36 oinarriko 25 digitu minuskulaz, adibidez `03gzrxjv20bdlcak89q25d2m7`; horrela, editore batek sortzen dituen id-ak sortu zituen ordenan ordenatzen dira. Dokumentu batek dituen id-ak mantentzen ditu, adibidez aurreko bertsio baten nanoid id-ak edo v2 fitxategi baten id-ak; beraz, ezerk ez luke id baten itxuran oinarritu behar.

`4.0.0` bertsiotik aurrera, entitate batek ere ez du `meta` objekturik (`createAt`, `updateAt`), eta `EntityMeta` eta `EntityType` motak kendu egin ziren. Ezerk ez du idazten, analisi batek alde batera uzten du fitxategi zaharrago batek duen `meta` objektua, eta JSON Schema eskemak ukatu egiten du. Kendutako entitateen zabor-bilketaren unea zehazteko soilik balio zuen, eta zabor-bilketa hori ere desagertu da.

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

`originX` eta `originY` ikuspegia dira: eszenako `(0, 0)` puntua kokatzen den pantailako puntua.  
`zoomLevel` eremuaren balioa `0.1` eta `1.5` artekoa da. `1` baino handiagoko zoom-mailarekin gordetako dokumentu bat `1` zoom-mailan irekitzen da `3.5.0` bertsioa baino lehenagoko editore batean.  
`4.0.0` bertsiotik aurrera, ezarpenek ez dute `width`, `height`, `scrollTop`, `scrollLeft`, `relationshipOptimization` edo `ignoreSaveSettings` eremurik. Ezerk ez ditu idazten, analizatzaileak ez du horietako bat ere mantentzen, eta JSON Schema eskemak ukatu egiten du oraindik horiek dituen fitxategia.

`canvasType` dokumentua irekitzen den fitxa da. Bisualizazioa fitxan gordetako dokumentu batek `'@dineug/erd-editor/builtin-visualization'` balioa du, baina ez zein modu zegoen ikusgai, `Graph` ala `Flow`, eta sortu berri den editore batek fitxa hori `Graph` moduan erakusten du.  
`4.0.0` bertsiotik aurrera, `Canvas Type` blokeoa aktibatuta dagoen bitartean, dokumentu berri batean dagoen bezala, dokumentuak blokeatu zenean ikusgai zegoen fitxa mantentzen du, eta fitxaz aldatzeak `value` zegoen bezala uzten du. Ezarpenak fitxan hartutako blokeo batek irakurlea lehenago zegoen fitxa gordetzen du, eta blokeatutako `'settings'` balio bat, eskuzko edizio batek soilik idatz dezakeena, `'ERD'` fitxan irekitzen da.  
`4.2.0` bertsiotik aurrera, `canvasType` `'@dineug/erd-editor/builtin-dictionary'` ere izan daiteke, [Hiztegia](../../guide/guides/dictionary.md) fitxa, eta `Canvas Type` blokeoak besteak bezala gordetzen du. `4.2.0` bertsioa baino lehenagoko editore batek balio hori mantentzen du, baina ez du fitxarik erakusten bere tresna-barraren azpian, irakurleak bat aukeratu arte.  
`Flow` moduaren egoera propioa ez da batere serializatzen: bere antolaketa, zooma, ikuspegiaren kokapena, errenkaden bistaratzea eta fokuratutako taulak editorean geratzen dira, eta, `4.2.0` bertsiotik aurrera, baita [`Previous table` eta `Next table`](../../guide/guides/visualization.md#previous-table-and-next-table) botoiek zeharkatzen dituzten ikuspegiak ere. Beraz, `originX`, `originY` eta `zoomLevel` eremuek beti ERD oihala deskribatzen dute.

`show` eta `lockSettings` bit-maskarak dira: konbinatu banderak OR eragiketarekin.  
`columnOrder` eremua `ColumnType` motaren balio bakoitza behin dituen array bat da, bistaratze-ordenan; `4.2.0` bertsiotik aurrera, dokumentu batek bederatzietatik zazpirekin idatz dezake, beheko zutabeen ordenari buruzko paragrafoak azaltzen duen bezala.  
`database`, `language`, `tableNameCase`, `columnNameCase` eta `bracketType` eremu bakoitzak balio bakar bat du zehazki, eta JSON Schema eskemak ukatu egiten du balio konbinatua.

Dokumentu berri baten `show` eremua `431` da: `tableComment`, `columnComment`, `columnDataType`, `columnDefault`, `columnPrimaryKey`, `columnNotNull` eta `relationship`.  
`3.10.0` bertsiotik aurrera, `show` eremuak bi bandera gehiago ditu, biak desaktibatuta dokumentu berri batean eta `3.10.0` bertsioa baino lehen gordetako dokumentu guztietan.  
`columnAlternateKey` (`512`) [`Alternate Key`](../../guide/guides/table-related-functions.md#alternate-keys) ikuspegi-aukera da. Ezarrita dagoenean, bi zutabe edo gehiagoko indize bakar bakoitzaren zutabeak `AK1.1`, `AK1.2` eta abar gisa markatzen ditu. Desaktibatuta hasten da; beraz, lehendik dagoen diagrama batek ere ez du zabalera aldatzen.  
`hideReferentialAction` (`1024`) banderak alderantziz funtzionatzen du: ezarrita dagoenean, konektoreetako [ON DELETE eta ON UPDATE etiketak](../../guide/guides/relationship-editing.md#reading-a-connector) ezkutatzen ditu; beraz, lehenespenez ikusgai daude. `Referential Actions` ikuspegi-aukera markatuta dago bandera desaktibatuta dagoen bitartean. Ez du inongo taularen tamainarik aldatzen.  
`3.10.0` bertsioa baino lehenagoko editore batek `show` zenbaki oso gisa mantentzen du; beraz, bi banderek bizirik irauten dute han gordetzean.

`4.0.0` bertsiotik aurrera, `show` eremuak bi bandera gehiago ditu, biak desaktibatuta dokumentu berri batean eta `4.0.0` bertsioa baino lehen gordetako dokumentu guztietan. `hideReferentialAction` banderak bezala, bakoitzak bere izenak adierazten duena ezkutatzen du; beraz, taula-taldeak eta oharrak lehenespenez ikusgai daude.  
`hideTableGroup` (`2048`) banderak [taula-taldeak](../../guide/guides/table-groups.md) ezkutatzen ditu, eta `hideMemo` (`4096`) banderak ohar guztiak. `Table Groups` eta `Memos` [ikuspegi-aukerak](../../guide/guides/table-related-functions.md#table-view-options) dira, bakoitza markatuta bere bandera desaktibatuta dagoen bitartean. Bietako batek ere ez du inongo taularen tamainarik aldatzen.  
`4.0.0` bertsioa baino lehenagoko editore batek `show` zenbaki oso gisa mantentzen du; beraz, bi banderek bizirik irauten dute han gordetzean.

`4.2.0` bertsiotik aurrera, `show` eremuak bandera bat gehiago du, `columnDomain` (`8192`), desaktibatuta dokumentu berri batean eta `4.2.0` bertsioa baino lehen gordetako dokumentu guztietan; beraz, dokumentu berri baten `show` eremua `431` da oraindik. `Domain` [ikuspegi-aukera](../../guide/guides/table-related-functions.md#table-view-options) da: ezarrita dagoenean, zutabe-errenkada bakoitzak [Domain gelaxka](../../guide/guides/logical-names.md#the-domain-cell) bat erakusten du, eta horrek taulak zabaltzen ditu. Desaktibatuta hasten da; beraz, lehendik dagoen diagrama batek ere ez du zabalera aldatzen.  
`4.2.0` bertsioa baino lehenagoko editore batek `show` zenbaki oso gisa mantentzen du; beraz, banderak bizirik irauten du han gordetzean.

`4.2.0` bertsiotik aurrera, `ColumnType` motak bederatzi balio ditu. `columnLogicalName` (`128`) balioak izen logikoaren gelaxka kokatzen du, zutabe-errenkada batek `Both Names` ikuspegian soilik marrazten duena, eta `columnDomain` (`256`) balioak Domain gelaxka. Ezarpenak fitxako [zutabeen ordenaren](../../guide/guides/settings.md#adjusting-column-order) `Logical Name` eta `Domain` errenkadak dira. Editore batek bederatziak dituen ordena bat du, eta dokumentu berri batena `128, 1, 2, 256, 4, 8, 16, 32, 64` da.  
Bi formek ordena zazpi sarreratan idazten dute, `128` eta `256` kanpoan utzita, `128` `columnName` balioaren berehala aurretik eta `256` `columnDataType` balioaren berehala ondoren dauden bitartean. Beraz, dokumentu berri batek `1, 2, 4, 8, 16, 32, 64` idazten du oraindik, eta bere ordenan bi horiek inoiz mugitu ez dituen fitxategi batek bere byteak mantentzen ditu. Bestela, bederatziak idazten dituzte.  
Analisi batek bi horiek leku horietan jartzen ditu zazpi sarrerako ordena batean, zazpiak edozein ordenatan daudela ere, mota guztiak dituzten bederatzi sarrera dauden bezala hartzen ditu, eta beste edozer ordena lehenetsi gisa irakurtzen du. JSON Schema eskemak zazpi edo bederatzi osoko zenbaki onartzen ditu.

`4.0.0` bertsiotik aurrera, `Language` motak [Kode-sortzailea](../../guide/guides/code-generator.md) fitxaren zortzi helburu gehiago ditu, `Mermaid` baliotik `JSONSchema` baliora arte. Analizatzaileak ezagutzen ez duen `language` balio bat `GraphQL` gisa irakurtzen da; beraz, `4.0.0` bertsioa baino lehenagoko editore batek horietako batekin gordetako dokumentua GraphQL lengoaian irekitzen du, eta han gordetzean GraphQL idazten du.

`4.0.0` bertsiotik aurrera, `lockSettings` eremuak `ignoreSaveSettings` eremuaren lekua hartzen du, eta `LockSettingType` motak kendutako `SaveSettingType` motarena. `lockSettings` eremuak dokumentu batek blokeatu zirenean zeuden bezala gordetzen dituen ezarpenak adierazten ditu. `viewport` bitak `originX`, `originY` eta `zoomLevel` batera hartzen ditu, bere zoomik gabe gordetako jatorri bat beste nonbait irekitzen baita, eta beste bit bakoitzak izen bera duen eremua hartzen du. Hauek dira Ezarpenak fitxako [`Lock`](../../guide/guides/settings.md#lock) errenkadak.  
`value` propietateak zein `runtimeValue` propietateak ezarpen blokeatu bat bere balio blokeatuan idazten dute, editoreak edozer erakutsita ere, eta gainerako ezarpen guztiak dauden bezala. Beraz, dagokion blokeoa aktibatuta dagoen bitartean, korritzeak eta zooma aldatzeak, fitxaz aldatzeak, Kode-sortzailearen lengoaia, izenen idazkera bat edo mugatzaile mota aldatzeak, edo Izenen ikuspegia aldatzeak fitxategia zegoen bezala uzten du. Blokeatzeak ezarpenak une horretan duen balioa hartzen du, eta analisi batek gordetako eremutik hartzen du balio blokeatua.  
Ezerezetik hasitako dokumentu batek — editore berri bat edo erreplikazio-biltegi berri bat, edo `value` propietateari edo `setInitialValue()` metodoari emandako balio huts bat — `lockSettings` eremua `63` balioarekin du, blokeo guztiak aktibatuta. `settings` eremuan `lockSettings` eremurik ez duen dokumentu bat — `4.0.0` bertsioa baino lehen gordetako fitxategi guztiak, bere `ignoreSaveSettings` edozein dela ere, eta v2 dokumentu guztiak — blokeo guztiak aktibatuta irekitzen da hura ere: ikuspegia eta fitxa dokumentu berri batenak dauden lekuan (`originX` eta `originY` `0`, `zoomLevel` `1`, ERD fitxa), eta lengoaia, izenen idazkerak eta mugatzaile mota gorde zituen balioetan blokeatuta. Bere blokeoak adierazten dituen dokumentu batek mantendu egiten ditu, `0` barne, baita gorde zituen balio guztiak ere.  
Analisi batek `lockSettings` eremuaren bit guztiak mantentzen ditu, baita ezezagunak ere, eta, beraz, geroagoko bertsio batek gehitzen duen blokeo batek bizirik irauten du hemen gordetzean; JSON Schema eskemak osoko zenbakia dela soilik egiaztatzen du. `4.0.0` bertsioa baino lehenagoko editore batek alde batera uzten du `lockSettings` gordetzean, eta ikuspegia eta fitxa dauden bezala idazten ditu; beraz, fitxategia `4.0.0` bertsioa baino lehen gordetako bat bezala irekitzen da berriro hemen.

`4.2.0` bertsiotik aurrera, zazpigarren blokeo bat dago, `unlockNameViewMode` (`64`), `Name View` errenkada, `nameViewMode` hartzen duena. Haren bitak beste blokeo-biten alderantziz funtzionatzen du, `Show` motaren ezkutatze-bitek bezala: ezarrita dagoenean, Izenen ikuspegia desblokeatuta dago, eta garbi dagoenean, blokeatuta. Beraz, `63` balioak blokeo guztiak aktibatuta esan nahi du oraindik, eta dokumentu berri batek balio hori du, Izenen ikuspegia `'physical'` balioan blokeatuta duela. `4.2.0` bertsioa baino lehen gordetako fitxategi batek bita garbi du, beste blokeoak edozein direla ere, `0` barne; beraz, Izenen ikuspegia `'physical'` balioan blokeatuta duela irekitzen da. Blokeo guztiak desaktibatuta dituen dokumentu batek `64` du, eta beste blokeo guztiak aktibatuta eta Izenen ikuspegia desblokeatuta dituenak `127`. Egiaztatu blokeo hau alderantziz: aktibatuta dago `(lockSettings & 64) === 0` den bitartean.  
Aktibatuta dagoen bitartean, Izenen ikuspegiaren aldaketa batek hura egin duen editorearen pantaila soilik aldatzen du, eta dokumentuak ikuspegi blokeatua mantentzen du. Desaktibatuta dagoen bitartean, edita dezakeen editore batean egindako aldaketa dokumentuarena da, eta lankide guztiek harekin batera aldatzen dute ikuspegia. Irakurtzeko soilik dagoen editore baten aldaketak bere pantaila soilik aldatzen du, bi kasuetan. Ikus [`Lock`](../../guide/guides/settings.md#lock).  
`4.0.0` edo `4.1.0` bertsioko editore batek bita mantentzen du gordetzean, baina `nameViewMode` alde batera uzten du; beraz, dokumentua `'physical'` balioan irekitzen da berriro hemen, bere blokeoa zegoen bezala duela.

`4.0.0` bertsiotik aurrera, `ddlScripts` eremuak [SQL eskema](../../guide/guides/schema-sql.md) fitxaren bi scriptak ditu, datu-base guztien DDLak idazten dituenak: `before` goiburuaren ondoren eta taulen aurretik, `after` sortutako DDLaren ondoren. DDLak bakoitza LF lerro-jauziekin idazten du, hasierako lerro hutsik eta amaierako zuriunerik gabe, eta MSSQL datu-basean `GO` komandoarekin amaituta, [Taulen aurreko eta ondorengo scriptak](../../guide/guides/schema-sql.md#before-and-after-scripts) atalean azaltzen den bezala; `ddlScripts` eremuak berak script bakoitza idatzi zen bezala mantentzen du. Gakoa scriptetako batek testua duen bitartean soilik idazten da, eta orduan biekin; falta den gako bat, edo katea ez den script bat, `''` gisa irakurtzen da. Fitxaren `Statements`, `Header` eta `Tables` aukerak, eta, `4.2.0` bertsiotik aurrera, haren [`Write logical names into empty comments`](../../guide/guides/schema-sql.md#logical-names-as-comments) etengailua, ez dira dokumentuan gordetzen.  
`4.0.0` bertsioa baino lehenagoko editore batek alde batera uzten ditu scriptak dokumentu bat kargatzean; beraz, han gordetzean galdu egiten dira.

`4.2.0` bertsiotik aurrera, `nameViewMode` [Izenen ikuspegia](../../guide/guides/logical-names.md#name-view) da, diagramak marrazten dituen izenak: `'physical'` taula eta zutabe bakoitzaren izena, `'logical'` haren izen logikoa izenaren lekuan, eta `'both'` izen logikoa eta izena. Menuek `Physical Names`, `Logical Names` eta `Both Names` deitzen diete. Bi formek azkenik idazten dute, `ddlScripts` eremuaren ondoren, eta idazten duten balioa `'physical'` ez den bitartean soilik; `Name View` blokeoa aktibatuta dagoen bitartean, balio hori balio blokeatua da, pantailak edozer erakutsita ere. Falta den balio bat, edo analizatzaileak ezagutzen ez duen bat, `'physical'` gisa irakurtzen da, eta JSON Schema eskemak `"logical"` eta `"both"` soilik onartzen ditu.  
`4.2.0` bertsioa baino lehenagoko editore batek alde batera uzten du `nameViewMode` dokumentu bat kargatzean.

`Database`, `Language`, `Show`, `ColumnType`, `ColumnOption`, `LockSettingType` eta `ReferentialAction` motei balioak amaieran soilik gehitzen zaizkie. Gordetako dokumentu batek zenbakia gordetzen du; beraz, hornitzaile, kode-sorkuntzako helburu, bandera, zutabe mota, zutabe-aukera, blokeo edo ekintza berri batek hurrengo bita hartzen du, erdiko toki bat hartu beharrean.

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

Lehen bost zerrendetako bakoitza entitate mota baten ordena da, eta DDLak, taulen ordenatzeak eta marrazte-ordenak irakurtzen dute. Biltegiratze-forman, zerrenda bakoitzak mantendutako entitateen id-ak soilik ditu, bakoitza behin, zerrendatutako ordenan, eta, `4.2.0` bertsiotik aurrera, bat ere ez duen zerrenda kanpoan uzten da. `4.0.0` bertsiotik aurrera, `tableGroupIds` taula-taldeen ordena da.

`4.2.0` bertsiotik aurrera, `wordIds`, `termIds` eta `domainIds` zerrendek hiztegi bakoitzaren errenkada biziak zerrendatzen dituzte: bildumak duen baina zerrendak ez duen errenkada bat kendutakoa da. Ez dira orri baten ordena; hori errenkada bakoitzaren `order` eremuak ematen du. Exekuzio-garaiko balioak soilik idazten ditu, bakoitza hark edo haren bildumak sarrera bat duen bitartean. Fitxategi baten errenkadak berak dira kidetza eta ordena, eta JSON Schema eskemak zerrendak ukatu egiten ditu.  
`4.2.0` bertsiotik aurrera, analisi batek dokumentuak kanpoan uzten duen zerrenda bat, edo array ez den zerbait gisa duena, haren bildumak dituen sarrera guztiak balira bezala irakurtzen du, id bakoitza behin, dauden ordenan; array huts bat hutsik geratzen da, eta orduan haren bildumako sarrera guztiak kendutako gisa irakurtzen dira. `4.2.0` bertsioa baino lehenagoko editore batek falta den zerrenda bat huts gisa irakurtzen du; beraz, biltegiratze-formak zerrenda bakoitza idazten du oraindik haren bildumak entitate bat duen bakoitzean.

`4.0.0` bertsiotik aurrera, pilatze-ordena ez da gordetzen. Analisi batek `zIndex` eremurik ez duen zerrendatutako taula, ohar eta taula-talde bakoitza bere zerrendako tokiaren arabera pilatzen du, ondorengoak aurrean: taula-taldeak `1` baliotik, taulak `2` baliotik, eta oharrak taula guztien gainetik. `zIndex` eremua duen entitate batek, exekuzio-garaiko balio batean edo `4.0.0` bertsioa baino lehen gordetako fitxategi batean bezala, mantendu egiten du. Beraz, taula edo ohar bat aurrera ekartzea galdu egiten da fitxategia berriro irekitzean.

### Bilduma: tableEntities {#collection-tableentities}

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

`4.0.0` bertsiotik aurrera, taula batek `groupId` eremua du: kide den [taula-taldearen](../../guide/guides/table-groups.md) id-a. Falta den edo hutsik dagoen `groupId` batek, edo `doc.tableGroupIds` eremuko talderik izendatzen ez duen batek, ez duela talderik esan nahi du, eta biltegiratze-formak mantendutako talde bat izendatzen duen bitartean soilik idazten du.  
Analisi batek `seqColumnIds` eremua `columnIds` eremuaren balioarekin hasieratzen du, falta denean edo zerrendatutako id bat falta zaionean, eta editore batek `widthName`, `widthLogicalName` eta `widthComment` berriro neurtzen ditu bere letra-tipoekin karga bakoitzean.

`4.2.0` bertsiotik aurrera, taula batek `logicalName` eremua du, `Logical Names` eta `Both Names` [ikuspegiek](../../guide/guides/logical-names.md#name-view) marrazten duten izena, `''` izenik ez badago, eta `nameDerived`, `true` hiztegiek `name` izen logikotik [eratorri](../../guide/guides/dictionary.md#deriving-physical-names) duten bitartean. Ezarrita dagoen bitartean, izen logiko berri batek izena berriro eratortzen du; ezarrita ez dagoen bitartean, izena norbaitek idatzitakoa da, eta izen logiko berri batek bere horretan uzten du, izena hutsik edo zuriunez soilik osatuta ez badago. Eskuz izena aldatzeak desaktibatu egiten du, eta [`Derive Physical Names Again`](../../guide/guides/dictionary.md#derive-physical-names-again) aukerak norbaitek idatzitako izena ere berridazten du eta izen logikoa dagoen leku guztietan aktibatzen du.  
Biltegiratze-formak `logicalName` `name` eremuaren ondoren idazten du, idatzi zen bezala, zuriuneez bestelako testua duen bitartean soilik, eta `nameDerived` `groupId` eremuaren ondoren, `true` den bitartean soilik, JSON Schema eskemak onartzen duen balio bakarra baita. Falta den `logicalName` bat `''` gisa irakurtzen da, eta falta den `nameDerived` bat `false` gisa; beraz, `4.2.0` bertsioa baino lehen gordetako fitxategi bateko izen guztiak norbaitek idatzitakotzat hartzen dira.  
`4.2.0` bertsioa baino lehenagoko editore batek biak alde batera uzten ditu dokumentu bat kargatzean; beraz, han gordetzean taula guztien izen logikoak galtzen dira.

### Bilduma: tableColumnEntities {#collection-tablecolumnentities}

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

`4.0.0` bertsiotik aurrera, biltegiratze-formak ez du zutabeen `ui` eremurik idazten. Karga bakoitzak `keys` eratortzen du, hau da, gako nagusiaren marka `options` eremuaren `primaryKey` bitetik eta gako arrotzaren marka zutabean amaitzen diren erlazioetatik, eta sei zabalerak neurtzen ditu.  
`4.0.0` bertsioa baino lehenagoko editore batek hemen gordetako fitxategi baten zutabeak gako nagusiaren ikonorik gabe erakusten ditu.

`4.2.0` bertsiotik aurrera, zutabe batek `logicalName` eremua du, taula batek bezala, eta `domainId`, lotzen duen domeinuaren id-a, `''` domeinurik ez badago. Editore bakar bateko edizioek lotutako zutabe bat bere domeinuaren datu motan mantentzen dute, [Domeinuak eta datu motak](../../guide/guides/dictionary.md#domains-and-data-types) atalean azaltzen den bezala. Analisi batek, ordea, ez dio inongo zutaberi mota aldatzen; beraz, beste nonbait idatzitako fitxategi batek lotutako zutabe bat beste mota batean utz dezake, eta gauza bera gerta daiteke bi lankideren edizio gurutzatuekin; Egiaztapenak orriak horietako bakoitza [`Domain type mismatch`](../../guide/guides/dictionary.md#what-each-check-finds) egiaztapen gisa zerrendatzen du. Analisi batek dokumentuak duen domeinurik izendatzen ez duen `domainId` bat garbitzen du. Kendutako domeinu bat kontuan hartzen da oraindik; beraz, editoreak hartarako lotura mantentzen du desegite batek domeinua itzul dezakeen bitartean. `options` eremuaren ondoren, biltegiratze-formak `logicalName` taularen arauaren arabera idazten du, eta `domainId` fitxategiak idazten duen domeinu bat izendatzen duen bitartean soilik; beraz, inoiz ez kendutako domeinu baterako lotura bat.  
`ColumnOption.nameDerived` (`16`) zutabearen izen eratorriaren bandera da; `options` eremuan gordetzen da beste bitekin batera, eta taula baten `nameDerived` eremuak esan nahi duena esan nahi du. Adibidez, ez nulua den eta hiztegiek izena eratorri dioten gako nagusi batek `26` balioa du `options` eremuan.  
`4.2.0` bertsioa baino lehenagoko editore batek `logicalName` eta `domainId` alde batera uzten ditu dokumentu bat kargatzean; beraz, han gordetzean galdu egiten dira. `options` zenbaki oso gisa mantentzen du; beraz, `nameDerived` bitak bizirik irauten du han gordetzean.

### Bilduma: relationshipEntities {#collection-relationshipentities}

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

`3.10.0` bertsiotik aurrera, erlazio batek `onDelete` eta `onUpdate` eremuak ditu, bere [ON DELETE eta ON UPDATE ekintzak](../../guide/guides/relationship-editing.md#on-delete-and-on-update). Bakoitzak `ReferentialAction` balio bakar bat du zehazki. `none` balioak, lehenetsiak, ez du klausularik idazten; beraz, datu-basearen beraren balio lehenetsia aplikatzen da. Beste bostek `NO ACTION`, `CASCADE`, `SET NULL`, `SET DEFAULT` eta `RESTRICT` adierazten dituzte. SQL eskema fitxak klausula bat idazten du soilik haren ekintza onartzen duen datu-base baterako.  
Biltegiratze-formak beti idazten ditu biak, eta `4.0.0` bertsiotik aurrera JSON Schema eskemak derrigorrezko egiten ditu, bakoitza osoko zenbakia dela soilik egiaztatuz. Analisi batek oraindik ere `none` gisa irakurtzen du falta den eremu bat, `3.10.0` bertsioa baino lehen gordetako dokumentu guztietan bezala, baita zerrendatik kanpoko balio bat ere.  
`3.10.0` bertsioa baino lehenagoko editore batek ez ditu eremu horiek ezagutzen, eta alde batera uzten ditu dokumentu bat kargatzean; beraz, han gordetzean ekintza guztiak galtzen dira.

`4.0.0` bertsiotik aurrera, karga bakoitzak biltegiratze-formak kanpoan uzten duena eratortzen du. Erlazio bat identifikatzailea da amaitzen den zutabe guztiak gako nagusiak direnean, eta bere `startRelationshipType` eremua `dash` da zutabe horiek guztiak NOT NULL direnean, eta `ring` bestela; amaierako zutaberik geratzen ez zaion erlazioa ez-identifikatzailea eta `dash` da, erlazio berri bat hasten den bezala. Aingurak, hau da, `x`, `y` eta `direction`, berriro kokatzen dira.

### Bilduma: indexEntities {#collection-indexentities}

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

Analisi batek `seqIndexColumnIds` eremua `indexColumnIds` eremuaren balioarekin hasieratzen du, falta denean edo zerrendatutako id bat falta zaionean.

### Bilduma: indexColumnEntities {#collection-indexcolumnentities}

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

### Bilduma: memoEntities {#collection-memoentities}

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

`4.0.0` bertsiotik aurrera, taulek eta oharrek `zIndex` eremuaren arabera ordenatutako [pila bakarra partekatzen dute](../../guide/guides/table-related-functions.md#moving-multiple-tables); beraz, taula bat aurrera ekartzeak ohar baten gainean jar dezake. Analisi batek `zIndex` eremurik gabe gordetako ohar bat taula guztien gainean pilatzen du, [Doc](#doc) atalean azaltzen den bezala. `4.0.0` bertsioa baino lehen gordetako fitxategi bateko ohar batek gorde zuen `zIndex` balioa mantentzen du, taulen kontagailu beretik zetorrena; beraz, aurreko bertsio batek taula guztien gainean marraztutako ohar bat haren ondoren aurrera ekarritako taula baten azpian ireki daiteke.

### Bilduma: tableGroupEntities {#collection-tablegroupentities}

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

`4.0.0` bertsiotik aurrera, dokumentu batek [taula-taldeak](../../guide/guides/table-groups.md) izan ditzake: taulen atzean marraztutako laukizuzen izendun eta koloredunak. Taula bat bere `groupId` eremuaren bidez sartzen da talde batean; beraz, talde batek ez du kideen zerrendarik. Biltegiratze-formak bilduma, `doc.tableGroupIds` bezala, talde bat dagoen bitartean soilik idazten du, eta hura ez duen dokumentu batek, `4.0.0` bertsioa baino lehen gordetako bat adibidez, ez du talderik. `Show.hideTableGroup` banderak ezkutatzen ditu.  
`4.0.0` bertsioa baino lehenagoko editore batek alde batera uzten ditu taldeak eta taula guztien `groupId` eremua dokumentu bat kargatzean; beraz, han gordetzean talde guztiak galtzen dira.

### Hiztegien errenkadak {#dictionary-rows}

`4.2.0` bertsiotik aurrera, dokumentu batek hiru hiztegi ditu, [Hiztegia](../../guide/guides/dictionary.md) fitxako `Words`, `Terms` eta `Domains` orriak, `wordEntities`, `termEntities` eta `domainEntities` bildumetan. Hitz, termino edo domeinu baten eremu guztiak kateak dira, eta batek ere ez du `ui` eremurik. `Checks` orria hiztegietatik eta diagramatik kalkulatzen da, eta ez da gordetzen.

```ts
type DictionaryRows = {
  fields: string[];
  rows: string[][];
};
```

Hiruretako batek ere ez du id-a gako gisa erabiltzen. Bakoitza goiburu bat eta errenkadak gisa idazten da: `fields` eremuak entitatearen eremuak behin izendatzen ditu, id-a lehenik, eta errenkada bakoitzak entitate baten balioak ditu ordena horretan. Beheko motek entitate bakoitzaren eremuak zerrendatzen dituzte, exekuzio-garaiko balioaren goiburuaren ordenan. Errenkada batek beti mantentzen ditu bere id-a eta izena, baina izenaz gaindiko amaierako balio hutsak kanpoan uzten dira; beraz, mantentzen den balio baten aurreko balio huts batek `''` izaten jarraitzen du, eta analisi batek errenkada bati falta zaion balio bat `''` gisa irakurtzen du. Bi formek errenkada bakoitza bere lerroan idazten dute, JSON trinko gisa, fitxategi bateko bi hitz hauetan bezala:

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

Biltegiratze-formak zerrendatutako errenkadak orriaren ordenan idazten ditu eta `order` kanpoan uzten du; beraz, haren goiburuek ez dute izendatzen. Id-az gaindiko balio guztiak hutsik edo zuriunez soilik dituen errenkada bat kanpoan uzten du, adibidez gehitu eta inoiz bete ez dena, edo hustutakoa, eta halako domeinu baterako edo kendutako baterako lotura oro: zutabe baten `domainId` kanpoan uzten da, eta termino batena `''` gisa idazten da; terminoa bera kanpoan uzten da beste ezer ez badu.  
Exekuzio-garaiko balioaren goiburuek `"order"` izendatzen dute `"name"` eremuaren berehala ondoren. Bildumak dituen errenkada guztiak idazten ditu, kendutakoak barne, bildumak dituen ordenan; beraz, orri baten ordena lortzeko, ordenatu `order` eremuaren arabera, kode-unitateen ordenan alderatuta. Analisi batek fitxategi baten errenkadei `order` gakoak ematen dizkie errenkadak dauden ordenan; beraz, fitxategiak idatzi zituen ordenan irakurtzen dira berriro.  
Hiztegiak ez dituen dokumentu batek, adibidez `4.2.0` bertsioa baino lehen gordetako batek, ez du hiztegirik. `4.2.0` bertsioa baino lehenagoko editore batek hirurak alde batera uzten ditu dokumentu bat kargatzean; beraz, han gordetzean hitz, termino eta domeinu guztiak galtzen dira.

### Bilduma: wordEntities {#collection-wordentities}

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

Hitz bat izen logiko bat osatzen duten hitzetako bat da, eta `abbreviation` izen fisiko batean hura ordezkatzen duena da. `synonyms` eremuak hitzaren beste idazkera batzuk zerrendatzen ditu, eta `forbiddenWords` eremuak haren ordez erabili behar ez diren hitzak, bakoitza komaz bereizita.

### Bilduma: termEntities {#collection-termentities}

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

Termino bat izen logiko oso bat da. `logicalName` eremua `name` balioarekin bat datorren taula edo zutabe batek `physicalName` eratortzen du edo, hura hutsik dagoen bitartean, hitzen laburduretatik osatutako izen bat, eta zutabe batek `domainId` eremuak izendatzen duen domeinua ere hartzen du, `''` domeinurik ez badago (ikus [Izen fisikoak eratortzea](../../guide/guides/dictionary.md#deriving-physical-names)). `synonyms` komaz bereizita dago. Analisi batek domeinurik izendatzen ez duen `domainId` bat garbitzen du, zutabe batean bezala.

### Bilduma: domainEntities {#collection-domainentities}

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

Domeinu bat izena duen datu mota bat da; `dataType` eremuak zutabe batek bezala gordetzen du, luzera barne, adibidez `NUMERIC(10)`. Zutabe batek edo termino batek domeinu bat bere id-aren bidez lotzen du, eta editoreak lotutako zutabe guztiei domeinuaren datu mota ematen die (ikus [Domeinuak eta datu motak](../../guide/guides/dictionary.md#domains-and-data-types)).

## JSON Schema {#json-schema}

Eskema-fitxategi kanonikoa [json-schema/schema.json](https://raw.githubusercontent.com/dineug/erd-editor/main/json-schema/schema.json) helbidean argitaratuta dago, eta zuzenean erreferentziatu daiteke `$schema` eremuarekin.

```json
{
  "$schema": "https://raw.githubusercontent.com/dineug/erd-editor/main/json-schema/schema.json",
  "version": "3.0.0"
}
```

Jarri `$schema` eremua `.erd.json` fitxategi baten hasieran, eta JSON Schema ulertzen duten editoreek, VS Code esaterako, dokumentua balidatzen dute eta haren eremuak automatikoki osatzen dituzte editatu ahala.

`4.0.0` bertsiotik aurrera, eskemak biltegiratze-forma soilik deskribatzen du. Izendun eremuak dituen objektu oro itxita dago (`additionalProperties: false`), biltegiratze-formak beti idazten duen eremu oro derrigorrezkoa da, ezer ez duen bitartean kanpoan uzten duen eremua aipatu egiten da baina ez da derrigorrezkoa, eta beti kanpoan uzten duen eremurik ez da aipatzen. Horregatik, exekuzio-garaiko balioa ukatu egiten du. `4.0.0` bertsioa baino lehen gordetako fitxategi bat ere ukatzen du, bere `meta` objektuarekin, zabalerekin, `zIndex` eta `ignoreSaveSettings` eremuekin eta gainerakoekin, `4.0.0` edo berriagoa den editore batek fitxategi hori berriro gorde arte. `3.2.0` edo bertsio berriago batek gordetako fitxategi batek dagoeneko eskema honen URLa aipatzen du, `main` adarrera seinalatzen duena; beraz, haren arabera balidatzen duen editore batek orain markatzen du fitxategia. `3.0.0` edo `3.1.0` bertsioek gordetako fitxategi batek, edo v2 dokumentu batek, ez du `$schema` eremurik aipatzen.

`4.2.0` bertsiotik aurrera, eskemak ez ditu jada derrigorrezkotzat hartzen entitate baten testu-eremuak, `doc` zerrendarik, bildumarik edo `collections` bera, biltegiratze-formak ezer ez duten bitartean kanpoan uzten baititu. `4.0.0` edo `4.1.0` bertsioek gordetako fitxategi bat onartzen du oraindik. Eremu berriak aipatzen ditu: `nameViewMode`, `"logical"` eta `"both"` soilik onartzen dituena; taula baten `logicalName` eta `nameDerived`, azken honek `true` soilik onartzen duela; zutabe baten `logicalName` eta `domainId`; eta hiru hiztegiak, bakoitza bere goiburuarekin eta kate-errenkadekin. `canvasType` eremuak Hiztegia fitxa zerrendatzen du, `columnOrder` eremuak zazpi edo bederatzi osoko zenbaki onartzen ditu, eta `show`, `columnOrder`, `lockSettings` eta `options` eremuen deskribapenek bit berriak izendatzen dituzte.

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
