---
sidebar_position: 3
description: ".erd.json dokumentu-formatua: fitxategi batek duen biltegiratze-forma eta editore batek duen exekuzio-garaiko balioa, TypeScript motak, zenbakizko eremu bakoitzaren atzeko konstanteak eta argitaratutako JSON Schema."
---

# Eskema

`.erd.json` editorearen dokumentu-formatua da. Irakurri orri hau dokumentu bat editoretik kanpo sortu, balidatu edo migratu behar baduzu.

`4.0.0` bertsiotik aurrera, dokumentu batek bi serializazio ditu, biak `version` eremuan `'3.0.0'` balioarekin. Biltegiratze-forma fitxategi batek duena da: [`editor.value`](../erd-editor-element.md#value) propietateak itzultzen duena, JSON esportazioak idazten duena eta argitaratutako [JSON Schema](#json-schema) eskemak onartzen duen forma bakarra. Exekuzio-garaiko balioa dokumentu osoa da editore batek duen bezala, eta [`editor.runtimeValue`](../erd-editor-element.md#runtimevalue) propietateak itzultzen du. `setInitialValue()` metodoak, `value` propietatea esleitzeak eta `setSchemaJSON()` metodoak bi formetako edozein irakurtzen dute, baita aurreko bertsio batek gordetako edozein fitxategi eta v2 `.vuerd` dokumentu bat ere. `4.0.0` bertsioa baino lehen bakarra zegoen: `value` propietateak dokumentu osoa itzultzen zuen editoreak zuen bezala, orain `runtimeValue` propietateak egiten duen moduan.

## Biltegiratze-forma eta exekuzio-garaiko balioa {#storage-form-and-runtime-value}

Biltegiratze-formak entitate biziak soilik ditu: `doc.tableIds` eremuan zerrendatutako taula bakoitza, taula horiek zerrendatzen dituzten zutabeak, mantendutako bi taulen arteko erlazioak, mantendutako taulen indizeak, taulak oraindik zerrendatzen duen zutabea duten indize-zutabeekin, eta zerrendatutako oharrak eta taula-taldeak. Kanpoan uzten du editore batek kargatzean eratortzen duena edo irekita dagoen bitartean mantentzen duena: kendutako entitateak, `seqColumnIds` eta `seqIndexColumnIds`, `zIndex` balio guztiak, neurtutako zabalerak, zutabearen `ui` eremua, eta erlazio baten `identification`, `startRelationshipType` eta aingurak. Beheko motek `// runtime only` marka jartzen diote eremu horietako bakoitzari.  
Bilduma bakoitzaren gakoak id-ak dira, kode-unitateen ordenan; zutabeak lehenik `tableId` eremuaren arabera taldekatzen dira, eta indize-zutabeak `indexId` eremuaren arabera. Entitate bakoitzak bere eremuak ordena finko batean idazten ditu, eta testua bi zuriunez koskatzen da eta lerro-jauzi batekin amaitzen da. Horrela, dokumentu berak beti byte berak idazten ditu, edizio batek ukitzen duena soilik aldatzen du, eta beste letra-tipo batzuk dituen makina batean gordetako fitxategi batek `value` bera ematen du berriro irekitzean.  
VS Code editoreak, Obsidian aplikazioak eta JetBrains pluginak edizio batek `value` aldatzen duenean soilik idazten dute fitxategia; beraz, aurreko bertsio batek gordetako fitxategi batek bere forma zaharra mantentzen du lehen ediziora arte.

Exekuzio-garaiko balioak biltegiratze-formak kanpoan uzten duena mantentzen du: kendutako entitateak, sekuentziak, z-indizeak, zabalerak, gako-markak, erlazio-banderak eta aingurak. Bi zuriunez koskatzen da, amaieran lerro-jauzirik gabe. Erabili soilik lankide bat edo bigarren ikuspegi bat `setInitialValue()` metodoaren bidez hasieratzeko, beste editore batek bidaltzen duen kentze baten desegiteak entitatea osorik itzul dezan han. Ez idatzi inoiz fitxategi batean; JSON Schema eskemak ukatu egiten du. Kendutako entitateak jada ez ditu ezerk biltzen; beraz, exekuzio-garaiko balioak mantendu egiten ditu dokumentua hurrengoan bere fitxategitik ireki arte.

Bi formek ezarpen blokeatu bakoitza bere balio blokeatuan idazten dute (ikus [`lockSettings`](#settings)), `settings.ddlScripts` script batek testua duen bitartean soilik, eta taula baten `groupId` hutsik ez dagoen bitartean soilik. Biltegiratze-formak `doc.tableGroupIds` eta `tableGroupEntities` taula-talde bat dagoen bitartean soilik idazten ditu; exekuzio-garaiko balioak dokumentuak talde bat edo kendutako bat duen bitartean idazten ditu.

## TypeScript {#typescript}

Motek exekuzio-garaiko balioa deskribatzen dute. `// runtime only` marka duen eremua biltegiratze-formatik kanpo geratzen da, eta `?` marka duen eremua zerbait duen bitartean soilik idazten da.

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

Entitate bakoitzaren gakoa bere `id` eremua da, kate opako bat; analisi batek alde batera uzten du `id` eremua falta zaion edo hutsik duen entitatea. `4.0.0` bertsiotik aurrera, id berri bakoitza Uuid25 forman idatzitako UUIDv7 bat da, 36 oinarriko 25 digitu minuskulaz, adibidez `03gzrxjv20bdlcak89q25d2m7`; horrela, editore batek sortzen dituen id-ak sortu zituen ordenan ordenatzen dira. Dokumentu batek dituen id-ak mantentzen ditu, adibidez aurreko bertsio baten nanoid id-ak edo v2 fitxategi baten id-ak; beraz, ezerk ez luke id baten itxuran oinarritu behar.

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

`originX` eta `originY` ikuspegia dira: eszenako `(0, 0)` puntua kokatzen den pantailako puntua.  
`zoomLevel` eremuaren balioa `0.1` eta `1.5` artekoa da. `1` baino handiagoko zoom-mailarekin gordetako dokumentu bat `1` zoom-mailan irekitzen da `3.5.0` bertsioa baino lehenagoko editore batean.  
`4.0.0` bertsiotik aurrera, ezarpenek ez dute `width`, `height`, `scrollTop`, `scrollLeft`, `relationshipOptimization` edo `ignoreSaveSettings` eremurik. Ezerk ez ditu idazten, analizatzaileak ez du horietako bat ere mantentzen, eta JSON Schema eskemak ukatu egiten du oraindik horiek dituen fitxategia.

`canvasType` dokumentua irekitzen den fitxa da. Bisualizazioa fitxan gordetako dokumentu batek `'@dineug/erd-editor/builtin-visualization'` balioa du, baina ez zein modu zegoen ikusgai, `Graph` ala `Flow`, eta sortu berri den editore batek fitxa hori `Graph` moduan erakusten du.  
`4.0.0` bertsiotik aurrera, `Canvas Type` blokeoa aktibatuta dagoen bitartean, dokumentu berri batean dagoen bezala, dokumentuak blokeatu zenean ikusgai zegoen fitxa mantentzen du, eta fitxaz aldatzeak `value` zegoen bezala uzten du. Ezarpenak fitxan hartutako blokeo batek irakurlea lehenago zegoen fitxa gordetzen du, eta blokeatutako `'settings'` balio bat, eskuzko edizio batek soilik idatz dezakeena, `'ERD'` fitxan irekitzen da.  
`Flow` moduaren egoera propioa ez da batere serializatzen: bere antolaketa, zooma, ikuspegiaren kokapena, errenkaden bistaratzea eta fokuratutako taulak editorean geratzen dira; beraz, `originX`, `originY` eta `zoomLevel` eremuek beti ERD oihala deskribatzen dute.

`show` eta `lockSettings` bit-maskarak dira: konbinatu banderak OR eragiketarekin.  
`columnOrder` eremua `ColumnType` motaren zazpi balioak dituen array bat da, bistaratze-ordenan.  
`database`, `language`, `tableNameCase`, `columnNameCase` eta `bracketType` eremu bakoitzak balio bakar bat du zehazki, eta JSON Schema eskemak ukatu egiten du balio konbinatua.

Dokumentu berri baten `show` eremua `431` da: `tableComment`, `columnComment`, `columnDataType`, `columnDefault`, `columnPrimaryKey`, `columnNotNull` eta `relationship`.  
`3.10.0` bertsiotik aurrera, `show` eremuak bi bandera gehiago ditu, biak desaktibatuta dokumentu berri batean eta `3.10.0` bertsioa baino lehen gordetako dokumentu guztietan.  
`columnAlternateKey` (`512`) [`Alternate Key`](../../guide/guides/table-related-functions.md#alternate-keys) ikuspegi-aukera da. Ezarrita dagoenean, bi zutabe edo gehiagoko indize bakar bakoitzaren zutabeak `AK1.1`, `AK1.2` eta abar gisa markatzen ditu. Desaktibatuta hasten da; beraz, lehendik dagoen diagrama batek ere ez du zabalera aldatzen.  
`hideReferentialAction` (`1024`) banderak alderantziz funtzionatzen du: ezarrita dagoenean, konektoreetako [ON DELETE eta ON UPDATE etiketak](../../guide/guides/relationship-editing.md#reading-a-connector) ezkutatzen ditu; beraz, lehenespenez ikusgai daude. `Referential Actions` ikuspegi-aukera markatuta dago bandera desaktibatuta dagoen bitartean. Ez du inongo taularen tamainarik aldatzen.  
`3.10.0` bertsioa baino lehenagoko editore batek `show` zenbaki oso gisa mantentzen du; beraz, bi banderek bizirik irauten dute han gordetzean.

`4.0.0` bertsiotik aurrera, `show` eremuak bi bandera gehiago ditu, biak desaktibatuta dokumentu berri batean eta `4.0.0` bertsioa baino lehen gordetako dokumentu guztietan. `hideReferentialAction` banderak bezala, bakoitzak bere izenak adierazten duena ezkutatzen du; beraz, taula-taldeak eta oharrak lehenespenez ikusgai daude.  
`hideTableGroup` (`2048`) banderak [taula-taldeak](../../guide/guides/table-groups.md) ezkutatzen ditu, eta `hideMemo` (`4096`) banderak ohar guztiak. `Table Groups` eta `Memos` [ikuspegi-aukerak](../../guide/guides/table-related-functions.md#table-view-options) dira, bakoitza markatuta bere bandera desaktibatuta dagoen bitartean. Bietako batek ere ez du inongo taularen tamainarik aldatzen.  
`4.0.0` bertsioa baino lehenagoko editore batek `show` zenbaki oso gisa mantentzen du; beraz, bi banderek bizirik irauten dute han gordetzean.

`4.0.0` bertsiotik aurrera, `Language` motak [Kode-sortzailea](../../guide/guides/code-generator.md) fitxaren zortzi helburu gehiago ditu, `Mermaid` baliotik `JSONSchema` baliora arte. Analizatzaileak ezagutzen ez duen `language` balio bat `GraphQL` gisa irakurtzen da; beraz, `4.0.0` bertsioa baino lehenagoko editore batek horietako batekin gordetako dokumentua GraphQL lengoaian irekitzen du, eta han gordetzean GraphQL idazten du.

`4.0.0` bertsiotik aurrera, `lockSettings` eremuak `ignoreSaveSettings` eremuaren lekua hartzen du, eta `LockSettingType` motak kendutako `SaveSettingType` motarena. `lockSettings` eremuak dokumentu batek blokeatu zirenean zeuden bezala gordetzen dituen ezarpenak adierazten ditu. `viewport` bitak `originX`, `originY` eta `zoomLevel` batera hartzen ditu, bere zoomik gabe gordetako jatorri bat beste nonbait irekitzen baita, eta beste bit bakoitzak izen bera duen eremua hartzen du. Hauek dira Ezarpenak fitxako [`Lock`](../../guide/guides/settings.md#lock) errenkadak.  
`value` propietateak zein `runtimeValue` propietateak ezarpen blokeatu bat bere balio blokeatuan idazten dute, editoreak edozer erakutsita ere, eta gainerako ezarpen guztiak dauden bezala. Beraz, dagokion blokeoa aktibatuta dagoen bitartean, korritzeak eta zooma aldatzeak, fitxaz aldatzeak edo Kode-sortzailearen lengoaia, izenen idazkera bat edo mugatzaile mota aldatzeak fitxategia zegoen bezala uzten du. Blokeatzeak ezarpenak une horretan duen balioa hartzen du, eta analisi batek gordetako eremutik hartzen du balio blokeatua.  
Ezerezetik hasitako dokumentu batek — editore berri bat edo erreplikazio-biltegi berri bat, edo `value` propietateari edo `setInitialValue()` metodoari emandako balio huts bat — `lockSettings` eremua `63` balioarekin du, blokeo guztiak aktibatuta. `settings` eremuan `lockSettings` eremurik ez duen dokumentu bat — `4.0.0` bertsioa baino lehen gordetako fitxategi guztiak, bere `ignoreSaveSettings` edozein dela ere, eta v2 dokumentu guztiak — blokeo guztiak aktibatuta irekitzen da hura ere: ikuspegia eta fitxa dokumentu berri batenak dauden lekuan (`originX` eta `originY` `0`, `zoomLevel` `1`, ERD fitxa), eta lengoaia, izenen idazkerak eta mugatzaile mota gorde zituen balioetan blokeatuta. Bere blokeoak adierazten dituen dokumentu batek mantendu egiten ditu, `0` barne, baita gorde zituen balio guztiak ere.  
Analisi batek `lockSettings` eremuaren bit guztiak mantentzen ditu, baita ezezagunak ere, eta, beraz, geroagoko bertsio batek gehitzen duen blokeo batek bizirik irauten du hemen gordetzean; JSON Schema eskemak osoko zenbakia dela soilik egiaztatzen du. `4.0.0` bertsioa baino lehenagoko editore batek alde batera uzten du `lockSettings` gordetzean, eta ikuspegia eta fitxa dauden bezala idazten ditu; beraz, fitxategia `4.0.0` bertsioa baino lehen gordetako bat bezala irekitzen da berriro hemen.

`4.0.0` bertsiotik aurrera, `ddlScripts` eremuak [SQL eskema](../../guide/guides/schema-sql.md) fitxaren bi scriptak ditu, datu-base guztien DDLak idazten dituenak: `before` goiburuaren ondoren eta taulen aurretik, `after` sortutako DDLaren ondoren. DDLak bakoitza LF lerro-jauziekin idazten du, hasierako lerro hutsik eta amaierako zuriunerik gabe, eta MSSQL datu-basean `GO` komandoarekin amaituta, [Taulen aurreko eta ondorengo scriptak](../../guide/guides/schema-sql.md#before-and-after-scripts) atalean azaltzen den bezala; `ddlScripts` eremuak berak script bakoitza idatzi zen bezala mantentzen du. Gakoa scriptetako batek testua duen bitartean soilik idazten da, eta orduan biekin; falta den gako bat, edo katea ez den script bat, `''` gisa irakurtzen da. Fitxaren `Statements`, `Header` eta `Tables` aukerak ez dira dokumentuan gordetzen.  
`4.0.0` bertsioa baino lehenagoko editore batek alde batera uzten ditu scriptak dokumentu bat kargatzean; beraz, han gordetzean galdu egiten dira.

`Database`, `Language`, `Show`, `LockSettingType` eta `ReferentialAction` motei balioak amaieran soilik gehitzen zaizkie. Gordetako dokumentu batek zenbakia gordetzen du; beraz, hornitzaile, kode-sorkuntzako helburu, bandera, blokeo edo ekintza berri batek hurrengo bita hartzen du, erdiko toki bat hartu beharrean.

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

Zerrenda bakoitza entitate mota baten ordena da, eta DDLak, taulen ordenatzeak eta marrazte-ordenak irakurtzen dute. Biltegiratze-forman, zerrenda bakoitzak mantendutako entitateen id-ak soilik ditu, bakoitza behin, zerrendatutako ordenan. `4.0.0` bertsiotik aurrera, `tableGroupIds` taula-taldeen ordena da.

`4.0.0` bertsiotik aurrera, pilatze-ordena ez da gordetzen. Analisi batek `zIndex` eremurik ez duen zerrendatutako taula, ohar eta taula-talde bakoitza bere zerrendako tokiaren arabera pilatzen du, ondorengoak aurrean: taula-taldeak `1` baliotik, taulak `2` baliotik, eta oharrak taula guztien gainetik. `zIndex` eremua duen entitate batek, exekuzio-garaiko balio batean edo `4.0.0` bertsioa baino lehen gordetako fitxategi batean bezala, mantendu egiten du. Beraz, taula edo ohar bat aurrera ekartzea galdu egiten da fitxategia berriro irekitzean.

### Bilduma: tableEntities {#collection-tableentities}

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

`4.0.0` bertsiotik aurrera, taula batek `groupId` eremua du: kide den [taula-taldearen](../../guide/guides/table-groups.md) id-a. Falta den edo hutsik dagoen `groupId` batek, edo `doc.tableGroupIds` eremuko talderik izendatzen ez duen batek, ez duela talderik esan nahi du, eta biltegiratze-formak mantendutako talde bat izendatzen duen bitartean soilik idazten du.  
Analisi batek `seqColumnIds` eremua `columnIds` eremuaren balioarekin hasieratzen du, falta denean edo zerrendatutako id bat falta zaionean, eta editore batek `widthName` eta `widthComment` berriro neurtzen ditu bere letra-tipoekin karga bakoitzean.

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

`4.0.0` bertsiotik aurrera, biltegiratze-formak ez du zutabeen `ui` eremurik idazten. Karga bakoitzak `keys` eratortzen du, hau da, gako nagusiaren marka `options` eremuaren `primaryKey` bitetik eta gako arrotzaren marka zutabean amaitzen diren erlazioetatik, eta lau zabalerak neurtzen ditu.  
`4.0.0` bertsioa baino lehenagoko editore batek hemen gordetako fitxategi baten zutabeak gako nagusiaren ikonorik gabe erakusten ditu.

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

## JSON Schema {#json-schema}

Eskema-fitxategi kanonikoa [json-schema/schema.json](https://raw.githubusercontent.com/dineug/erd-editor/main/json-schema/schema.json) helbidean argitaratuta dago, eta zuzenean erreferentziatu daiteke `$schema` eremuarekin.

```json
{
  "$schema": "https://raw.githubusercontent.com/dineug/erd-editor/main/json-schema/schema.json",
  "version": "3.0.0"
}
```

Jarri `$schema` eremua `.erd.json` fitxategi baten hasieran, eta JSON Schema ulertzen duten editoreek, VS Code esaterako, dokumentua balidatzen dute eta haren eremuak automatikoki osatzen dituzte editatu ahala.

`4.0.0` bertsiotik aurrera, eskemak biltegiratze-forma soilik deskribatzen du. Izendun eremuak dituen objektu oro itxita dago (`additionalProperties: false`), biltegiratze-formak beti idazten duen eremu oro derrigorrezkoa da, eta kanpoan uzten duen eremurik ez da aipatzen. Horregatik, exekuzio-garaiko balioa ukatu egiten du. `4.0.0` bertsioa baino lehen gordetako fitxategi bat ere ukatzen du, bere `meta` objektuarekin, zabalerekin, `zIndex` eta `ignoreSaveSettings` eremuekin eta gainerakoekin, `4.0.0` edo berriagoa den editore batek fitxategi hori berriro gorde arte. `3.2.0` edo bertsio berriago batek gordetako fitxategi batek dagoeneko eskema honen URLa aipatzen du, `main` adarrera seinalatzen duena; beraz, haren arabera balidatzen duen editore batek orain markatzen du fitxategia. `3.0.0` edo `3.1.0` bertsioek gordetako fitxategi batek, edo v2 dokumentu batek, ez du `$schema` eremurik aipatzen.

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
