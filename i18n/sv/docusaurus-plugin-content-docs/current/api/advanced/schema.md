---
sidebar_position: 3
description: Dokumentformatet .erd.json – lagringsformen som en fil innehåller och körtidsvärdet som en editor har, TypeScript-typerna, konstanterna bakom varje numeriskt fält och det publicerade JSON Schema.
---

# Schema

`.erd.json` är editorns dokumentformat. Läs den här sidan om du behöver generera, validera eller migrera ett dokument utanför editorn.

Sedan `4.0.0` har ett dokument två serialiseringar, båda med `version` `'3.0.0'`. Lagringsformen är det som en fil innehåller: det är vad [`editor.value`](../erd-editor-element.md#value) returnerar, vad JSON-exporten skriver och den enda form som det publicerade [JSON Schema](#json-schema) accepterar. Körtidsvärdet är hela dokumentet så som en editor har det, vilket [`editor.runtimeValue`](../erd-editor-element.md#runtimevalue) returnerar. `setInitialValue()`, settern för `value` och `setSchemaJSON()` läser båda formerna, alla filer som en tidigare version har sparat och ett `.vuerd`-dokument från v2. Före `4.0.0` fanns det bara en: `value` returnerade hela dokumentet så som editorn hade det, som `runtimeValue` gör nu.

## Lagringsform och körtidsvärde {#storage-form-and-runtime-value}

Lagringsformen innehåller endast de befintliga entiteterna: varje tabell som listas i `doc.tableIds`, de kolumner som dessa tabeller listar, relationerna mellan två bevarade tabeller, indexen för bevarade tabeller med de indexkolumner vars kolumn tabellen fortfarande listar samt de listade anteckningarna och tabellgrupperna. Den utelämnar det som en editor härleder vid inläsning eller behåller medan den är öppen: borttagna entiteter, `seqColumnIds` och `seqIndexColumnIds`, varje `zIndex`, de uppmätta bredderna, kolumnernas `ui` samt en relations `identification`, `startRelationshipType` och fästpunkter. Typerna nedan märker vart och ett av dessa fält med `// runtime only`.  
Varje samling har id:n som nycklar, i kodenhetsordning, där kolumnerna först grupperas efter `tableId` och indexkolumnerna efter `indexId`. Varje entitet skriver sina fält i en fast ordning, och texten är indragen med två blanksteg och slutar med en radbrytning. Därför skriver samma dokument alltid samma byte, en redigering ändrar bara det som den berör och en fil som har sparats på en dator med andra typsnitt öppnas igen med samma `value`.  
VS Code, Obsidian och JetBrains-pluginet skriver en fil bara när en redigering ändrar `value`, så en fil som en tidigare version har sparat behåller sin gamla form fram till den första redigeringen.

Körtidsvärdet behåller det som lagringsformen utelämnar: borttagna entiteter, sekvenser, z-index, bredder, nyckelmärken, relationsflaggor och fästpunkter. Det är indraget med två blanksteg utan avslutande radbrytning. Använd det bara för att initiera en medarbetare eller en andra vy via `setInitialValue()`, så att en ångrad borttagning som en annan editor skickar återställer hela entiteten där. Skriv det aldrig till en fil; JSON Schema avvisar det. Ingenting samlar längre in borttagna entiteter, så körtidsvärdet behåller dem tills dokumentet nästa gång öppnas från sin fil.

Båda formerna skriver varje låst inställning med dess låsta värde (se [`lockSettings`](#settings)), `settings.ddlScripts` bara när ett skript innehåller text och en tabells `groupId` bara när det inte är tomt. Lagringsformen skriver `doc.tableGroupIds` och `tableGroupEntities` bara när det finns en tabellgrupp; körtidsvärdet skriver dem när dokumentet innehåller en grupp eller en borttagen grupp.

## TypeScript {#typescript}

Typerna beskriver körtidsvärdet. Ett fält som är märkt med `// runtime only` utelämnas i lagringsformen, och ett fält som är märkt med `?` skrivs bara när det innehåller något.

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

Varje entitet har sitt `id`, en opak sträng, som nyckel; vid tolkning förkastas en entitet vars `id` saknas eller är tomt. Sedan `4.0.0` är varje nytt id ett UUIDv7 skrivet i Uuid25-form, 25 siffror i bas 36 med gemener, till exempel `03gzrxjv20bdlcak89q25d2m7`, så de id:n som en editor genererar sorteras i den ordning den skapade dem. Ett dokument behåller de id:n det innehåller, till exempel nanoid-id:n från en tidigare version eller id:n i en v2-fil, så ingenting bör förlita sig på hur ett id ser ut.

Sedan `4.0.0` har ingen entitet något objekt `meta` (`createAt`, `updateAt`), och typerna `EntityMeta` och `EntityType` har tagits bort. Ingenting skriver det, vid tolkning förkastas den `meta` som en äldre fil har och JSON Schema avvisar det. Det användes bara för att tidsstyra skräpinsamlingen av borttagna entiteter, som också har tagits bort.

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

`originX` och `originY` är vyn: den punkt på skärmen där scenpunkten `(0, 0)` hamnar.  
`zoomLevel` går från `0.1` till `1.5`. Ett dokument som sparats med ett värde över `1` öppnas med `1` i en editor från före `3.5.0`.  
Sedan `4.0.0` innehåller inställningarna inte `width`, `height`, `scrollTop`, `scrollLeft`, `relationshipOptimization` eller `ignoreSaveSettings`. Ingenting skriver dem, parsern behåller inget av dem och JSON Schema avvisar en fil som fortfarande har dem.

`canvasType` är den flik som ett dokument öppnas på. Ett dokument som sparats på fliken Visualisering innehåller `'@dineug/erd-editor/builtin-visualization'` men inte om läget `Graph` eller `Flow` visades, och en nyskapad editor visar den fliken i läget `Graph`.  
Så länge låset `Canvas Type` är på, vilket det är i ett nytt dokument, behåller dokumentet sedan `4.0.0` den flik som visades när inställningen låstes, och ett flikbyte lämnar `value` som det var. Ett lås som slås på medan fliken Inställningar visas behåller den flik du kom från, och ett låst `'settings'`, som bara en manuell redigering kan skriva, öppnas på `'ERD'`.  
Inget av det egna tillståndet i läget `Flow` serialiseras – dess placering, zoom, panorering, radvisning och fokuserade tabeller stannar i editorn – så `originX`, `originY` och `zoomLevel` beskriver alltid ERD-arbetsytan.

`show` och `lockSettings` är bitmasker – kombinera flaggorna med OR.  
`columnOrder` är en array som innehåller alla sju värdena i `ColumnType`, i visningsordning.  
`database`, `language`, `tableNameCase`, `columnNameCase` och `bracketType` innehåller vart och ett exakt ett värde, och JSON Schema avvisar ett kombinerat värde.

I ett nytt dokument är `show` `431`: `tableComment`, `columnComment`, `columnDataType`, `columnDefault`, `columnPrimaryKey`, `columnNotNull` och `relationship`.  
Sedan `3.10.0` finns det ytterligare två flaggor i `show`, båda av i ett nytt dokument och i varje dokument som sparats före `3.10.0`.  
`columnAlternateKey` (`512`) är visningsalternativet [`Alternate Key`](../../guide/guides/table-related-functions.md#alternate-keys). När flaggan är satt märks kolumnerna i varje unikt index över två eller fler kolumner som `AK1.1`, `AK1.2` och så vidare. Flaggan är av från början, så inget befintligt diagram ändrar bredd.  
`hideReferentialAction` (`1024`) fungerar tvärtom: när flaggan är satt döljs [etiketterna ON DELETE och ON UPDATE](../../guide/guides/relationship-editing.md#reading-a-connector) på relationslinjerna, så de visas som standard. Visningsalternativet `Referential Actions` är ikryssat medan flaggan är av. Flaggan ändrar inte storleken på någon tabell.  
En editor från före `3.10.0` behåller hela talet i `show`, så båda flaggorna finns kvar när dokumentet sparas där.

Sedan `4.0.0` finns det ytterligare två flaggor i `show`, båda av i ett nytt dokument och i varje dokument som sparats före `4.0.0`. Liksom `hideReferentialAction` döljer var och en det som den namnger, så tabellgrupper och anteckningar visas som standard.  
`hideTableGroup` (`2048`) döljer [tabellgrupperna](../../guide/guides/table-groups.md), och `hideMemo` (`4096`) döljer varje anteckning. De är [visningsalternativen](../../guide/guides/table-related-functions.md#table-view-options) `Table Groups` och `Memos`, som vart och ett är ikryssat medan dess flagga är av. Ingen av dem ändrar storleken på någon tabell.  
En editor från före `4.0.0` behåller hela talet i `show`, så båda flaggorna finns kvar när dokumentet sparas där.

Sedan `4.0.0` har `Language` ytterligare åtta mål för [kodgeneratorn](../../guide/guides/code-generator.md), `Mermaid` till och med `JSONSchema`. Ett värde i `language` som parsern inte känner till läses som `GraphQL`, så en editor från före `4.0.0` väljer GraphQL när den öppnar ett dokument som sparats med något av dem, och när dokumentet sparas där skrivs GraphQL.

Sedan `4.0.0` har `lockSettings` ersatt `ignoreSaveSettings` och `LockSettingType` ersatt `SaveSettingType`, som har tagits bort. `lockSettings` anger vilka inställningar ett dokument sparar så som de var när de låstes. `viewport` omfattar `originX`, `originY` och `zoomLevel` tillsammans, eftersom ett origo som sparats utan sin zoomnivå öppnas någon annanstans, och varje annan bit omfattar det fält som den är uppkallad efter. Det här är raderna under [`Lock`](../../guide/guides/settings.md#lock) på fliken Inställningar.  
En låst inställning skrivs med sitt låsta värde, oavsett vad editorn visar, av både `value` och `runtimeValue`, och alla andra inställningar skrivs så som de är. Så länge motsvarande lås är på förblir filen därför oförändrad när du rullar och zoomar, byter flik eller ändrar kodgeneratorns språk, ett skiftläge för namn eller typen av citattecken. Låsningen tar det värde som inställningen har i just det ögonblicket, och vid tolkning hämtas det låsta värdet från det sparade fältet.  
Ett dokument som skapas från grunden – en ny editor eller en ny replikeringsstore, eller ett tomt värde som ges till `value` eller `setInitialValue()` – har `lockSettings` satt till `63`, med alla lås på. Ett dokument vars `settings` saknar `lockSettings` – varje fil som sparats före `4.0.0`, oavsett dess `ignoreSaveSettings`, och varje v2-dokument – öppnas också med alla lås på: med vyn och fliken där de är i ett nytt dokument (`originX` och `originY` `0`, `zoomLevel` `1`, ERD-fliken) och med språket, skiftlägena för namn och typen av citattecken låsta till det som dokumentet sparade. Ett dokument som anger sina lås behåller dem, även `0`, och alla värden som det sparade.  
Vid tolkning behålls varje bit i `lockSettings`, även okända bitar, så ett lås som en senare version lägger till finns kvar när dokumentet sparas här; JSON Schema kontrollerar bara att värdet är ett heltal. En editor från före `4.0.0` tar bort `lockSettings` när den sparar och skriver vyn och fliken som de är, så filen öppnas här igen som en fil som sparats före `4.0.0`.

Sedan `4.0.0` innehåller `ddlScripts` de två skripten på fliken [Schema SQL](../../guide/guides/schema-sql.md), som DDL-koden för varje databas skriver: `before` efter inledningen och före tabellerna, `after` efter den genererade DDL-koden. DDL-koden skriver vart och ett med LF-radbrytningar, utan inledande tomma rader och avslutande blanktecken, och för MSSQL avslutat med `GO`, som [Skript före och efter tabellerna](../../guide/guides/schema-sql.md#before-and-after-scripts) beskriver; `ddlScripts` behåller själv varje skript så som det skrevs. Nyckeln skrivs bara när något av skripten innehåller text, och då med båda; en saknad nyckel, eller ett skript som inte är en sträng, läses som `''`. Valen `Statements`, `Header` och `Tables` på fliken sparas inte i dokumentet.  
En editor från före `4.0.0` tar bort skripten när den läser in ett dokument, så de går förlorade om dokumentet sparas där.

`Database`, `Language`, `Show`, `LockSettingType` och `ReferentialAction` kan bara utökas i slutet. Ett sparat dokument lagrar talet, så ett nytt databassystem eller kodgenereringsmål, en ny flagga, ett nytt lås eller en ny åtgärd tar nästa bit i stället för en plats i mitten.

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

Varje lista är ordningen för en typ av entitet, och den läses av DDL-koden, tabellsorteringen och ritordningen. I lagringsformen innehåller varje lista bara id:n för bevarade entiteter, vart och ett en gång, i den ordning de listas. Sedan `4.0.0` är `tableGroupIds` tabellgruppernas ordning.

Sedan `4.0.0` sparas inte staplingsordningen. Vid tolkning staplas varje listad tabell, anteckning och tabellgrupp som saknar `zIndex` efter sin plats i listan, med senare poster framför: tabellgrupper från `1`, tabeller från `2` och anteckningar ovanför alla tabeller. En entitet som har ett `zIndex`, som i ett körtidsvärde eller en fil som sparats före `4.0.0`, behåller det. Att lägga en tabell eller anteckning överst går därför förlorat när filen öppnas igen.

### Samling: tableEntities {#collection-tableentities}

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

Sedan `4.0.0` har en tabell `groupId`, id:t för den [tabellgrupp](../../guide/guides/table-groups.md) som den tillhör. Ett saknat eller tomt `groupId`, eller ett som inte anger någon grupp i `doc.tableGroupIds`, betyder ingen grupp, och lagringsformen skriver det bara när det anger en bevarad grupp.  
Vid tolkning sätts `seqColumnIds` till `columnIds` när det saknas eller inte innehåller ett listat id, och en editor mäter `widthName` och `widthComment` på nytt med sina egna typsnitt vid varje inläsning.

### Samling: tableColumnEntities {#collection-tablecolumnentities}

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

Sedan `4.0.0` skriver lagringsformen inget `ui` för kolumner. Varje inläsning härleder `keys`, primärnyckelmärket från biten `primaryKey` i `options` och sekundärnyckelmärket från de relationer som slutar på kolumnen, och mäter de fyra bredderna.  
En editor från före `4.0.0` visar kolumnerna i en fil som sparats här utan deras primärnyckelikoner.

### Samling: relationshipEntities {#collection-relationshipentities}

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

Sedan `3.10.0` har en relation `onDelete` och `onUpdate`, dess [åtgärder för ON DELETE och ON UPDATE](../../guide/guides/relationship-editing.md#on-delete-and-on-update). Vart och ett innehåller exakt ett värde i `ReferentialAction`. `none`, standardvärdet, skriver ingen klausul, så databasens eget standardbeteende gäller. De övriga fem står för `NO ACTION`, `CASCADE`, `SET NULL`, `SET DEFAULT` och `RESTRICT`. Schema SQL skriver en klausul bara för en databas som har stöd för dess åtgärd.  
Lagringsformen skriver alltid båda, och sedan `4.0.0` kräver JSON Schema dem och kontrollerar bara att vart och ett är ett heltal. Vid tolkning läses fortfarande ett saknat fält, som i alla dokument som sparats före `3.10.0`, som `none`, och detsamma gäller ett värde utanför listan.  
En editor från före `3.10.0` känner inte till fälten och tar bort dem när den läser in ett dokument, så alla åtgärder går förlorade om dokumentet sparas där.

Sedan `4.0.0` härleder varje inläsning det som lagringsformen utelämnar. En relation är identifierande när varje kolumn som den slutar på är en primärnyckel, och dess `startRelationshipType` är `dash` när varje sådan kolumn är NOT NULL och annars `ring`; en relation utan någon kvarvarande slutkolumn är icke-identifierande och `dash`, så som en ny relation börjar. Fästpunkterna, `x`, `y` och `direction`, placeras på nytt.

### Samling: indexEntities {#collection-indexentities}

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

Vid tolkning sätts `seqIndexColumnIds` till `indexColumnIds` när det saknas eller inte innehåller ett listat id.

### Samling: indexColumnEntities {#collection-indexcolumnentities}

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

### Samling: memoEntities {#collection-memoentities}

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

Sedan `4.0.0` [delar tabeller och anteckningar på samma stapel](../../guide/guides/table-related-functions.md#moving-multiple-tables), som ordnas efter `zIndex`, så en tabell som läggs överst kan hamna över en anteckning. Vid tolkning staplas en anteckning som sparats utan `zIndex` ovanför alla tabeller, som [Doc](#doc) beskriver. En anteckning i en fil som sparats före `4.0.0` behåller det `zIndex` som den sparade, vilket kom från samma räknare som tabellernas, så en anteckning som en tidigare version ritade över alla tabeller kan öppnas under en tabell som lades överst efter den.

### Samling: tableGroupEntities {#collection-tablegroupentities}

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

Sedan `4.0.0` kan ett dokument innehålla [tabellgrupper](../../guide/guides/table-groups.md): namngivna, färgade rektanglar som ritas bakom tabellerna. En tabell går med i en grupp via sitt eget `groupId`, så en grupp innehåller ingen lista över medlemmar. Lagringsformen skriver samlingen, liksom `doc.tableGroupIds`, bara när det finns en grupp, och ett dokument utan den, till exempel ett som sparats före `4.0.0`, har inga grupper. `Show.hideTableGroup` döljer dem.  
En editor från före `4.0.0` tar bort grupperna och varje tabells `groupId` när den läser in ett dokument, så alla grupper går förlorade om dokumentet sparas där.

## JSON Schema {#json-schema}

Den kanoniska schemafilen publiceras på [json-schema/schema.json](https://raw.githubusercontent.com/dineug/erd-editor/main/json-schema/schema.json) och kan refereras till direkt med `$schema`.

```json
{
  "$schema": "https://raw.githubusercontent.com/dineug/erd-editor/main/json-schema/schema.json",
  "version": "3.0.0"
}
```

Lägg `$schema` överst i en `.erd.json`-fil, så validerar editorer som förstår JSON Schema, till exempel VS Code, dokumentet och autokompletterar dess fält medan du redigerar.

Sedan `4.0.0` beskriver schemat endast lagringsformen. Varje objekt med namngivna fält är stängt (`additionalProperties: false`), varje fält som lagringsformen alltid skriver är obligatoriskt och inget fält som den utelämnar namnges. Det avvisar därför körtidsvärdet. Det avvisar också en fil som sparats före `4.0.0`, med dess `meta`, bredder, `zIndex`, `ignoreSaveSettings` och resten, tills en editor i version `4.0.0` eller senare sparar filen igen. En fil som sparats av `3.2.0` eller senare anger redan URL:en till det här schemat, som pekar på grenen `main`, så en editor som validerar mot det flaggar filen nu. En fil som sparats av `3.0.0` eller `3.1.0`, eller ett v2-dokument, anger inget `$schema`.

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
