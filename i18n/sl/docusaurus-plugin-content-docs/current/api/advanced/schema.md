---
sidebar_position: 3
description: Format dokumentov .erd.json – oblika za shranjevanje, ki jo vsebuje datoteka, in vrednost med izvajanjem, ki jo hrani urejevalnik, tipi TypeScript, konstante za posamezna številska polja in objavljena JSON Schema.
---

# Shema

Format `.erd.json` je format, v katerem urejevalnik zapisuje dokumente. To stran preberite, če morate dokument ustvariti, preveriti njegovo veljavnost ali ga migrirati zunaj urejevalnika.

Od različice `4.0.0` ima dokument dve serializaciji, obe s poljem `version` z vrednostjo `'3.0.0'`. Oblika za shranjevanje je tisto, kar vsebuje datoteka: to vrne [`editor.value`](../erd-editor-element.md#value), to zapiše izvoz JSON in to je edina oblika, ki jo sprejme objavljena [JSON Schema](#json-schema). Vrednost med izvajanjem je celoten dokument, kot ga hrani urejevalnik, in jo vrne [`editor.runtimeValue`](../erd-editor-element.md#runtimevalue). Metoda `setInitialValue()`, setter `value` in metoda `setSchemaJSON()` preberejo obe obliki, vsako datoteko, ki jo je shranila starejša izdaja, in dokument `.vuerd` različice v2. Pred različico `4.0.0` je obstajala samo ena: lastnost `value` je vračala celoten dokument, kot ga je hranil urejevalnik, tako kot zdaj lastnost `runtimeValue`.

## Oblika za shranjevanje in vrednost med izvajanjem {#storage-form-and-runtime-value}

Oblika za shranjevanje vsebuje samo žive entitete: vsako tabelo, navedeno v `doc.tableIds`, stolpce, ki jih te tabele navajajo, relacije med dvema ohranjenima tabelama, indekse ohranjenih tabel s stolpci indeksa, katerih stolpec tabela še navaja, ter navedene beležke in skupine tabel. Izpusti tisto, kar urejevalnik izpelje ob nalaganju ali hrani, dokler je odprt: odstranjene entitete, `seqColumnIds` in `seqIndexColumnIds`, vsak `zIndex`, izmerjene širine, polje `ui` stolpca ter `identification`, `startRelationshipType` in sidrne točke relacije. V spodnjih tipih je vsako od teh polj označeno z `// runtime only`.  
Ključi vsake kolekcije so identifikatorji v vrstnem redu kodnih enot, pri čemer so stolpci najprej združeni po `tableId`, stolpci indeksov pa po `indexId`. Vsaka entiteta zapiše svoja polja v stalnem vrstnem redu, besedilo pa je zamaknjeno za dva presledka in se konča z znakom za novo vrstico. Zato je zapis istega dokumenta vedno bajtno enak, sprememba spremeni samo tisto, česar se dotakne, datoteka, shranjena na računalniku z drugimi pisavami, pa se znova odpre z enako vrednostjo lastnosti `value`.  
VS Code, Obsidian in vtičnik za JetBrains zapišejo datoteko samo, ko se zaradi spremembe spremeni lastnost `value`, zato datoteka, ki jo je shranila starejša izdaja, ohrani staro obliko do svoje prve spremembe.

Vrednost med izvajanjem ohrani tisto, kar oblika za shranjevanje izpusti: odstranjene entitete, zaporedja, vrednosti z-index, širine, oznake ključev, zastavice relacij in sidrne točke. Zamaknjena je za dva presledka in na koncu nima znaka za novo vrstico. Uporabite jo samo za inicializacijo sodelavca ali drugega pogleda prek metode `setInitialValue()`, tako da razveljavitev odstranitve, ki jo pošlje drug urejevalnik, tam povrne celotno entiteto. Nikoli je ne zapišite v datoteko; JSON Schema jo zavrne. Odstranjenih entitet nič več ne počisti, zato jih vrednost med izvajanjem hrani, dokler se dokument naslednjič ne odpre iz svoje datoteke.

Obe obliki zapišeta vsako zaklenjeno nastavitev z njeno zaklenjeno vrednostjo (glejte polje [`lockSettings`](#settings)), `settings.ddlScripts` samo, dokler kateri od skriptov vsebuje besedilo, polje `groupId` tabele pa samo, dokler ni prazno. Oblika za shranjevanje zapiše `doc.tableGroupIds` in `tableGroupEntities` samo, dokler obstaja kakšna skupina tabel; vrednost med izvajanjem ju zapiše, dokler dokument vsebuje skupino ali odstranjeno skupino.

## TypeScript {#typescript}

Tipi opisujejo vrednost med izvajanjem. Polje, označeno z `// runtime only`, je v obliki za shranjevanje izpuščeno, polje, označeno z `?`, pa se zapiše samo, dokler nekaj vsebuje.

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

Ključ vsake entitete je njeno polje `id`, neprozoren niz; razčlenjevanje izpusti entiteto, katere polje `id` manjka ali je prazno. Od različice `4.0.0` je vsak nov identifikator UUIDv7, zapisan v obliki Uuid25 kot 25 števk v osnovi 36 z malimi črkami, na primer `03gzrxjv20bdlcak89q25d2m7`, zato se identifikatorji, ki jih ustvari en urejevalnik, razvrstijo v vrstnem redu, v katerem jih je ustvaril. Dokument ohrani identifikatorje, ki jih vsebuje, na primer identifikatorje nanoid starejše izdaje ali identifikatorje datoteke v2, zato se nič ne bi smelo zanašati na obliko identifikatorja.

Od različice `4.0.0` nobena entiteta nima objekta `meta` (`createAt`, `updateAt`), tipa `EntityMeta` in `EntityType` pa sta odstranjena. Nič ga ne zapiše, razčlenjevanje izpusti objekt `meta`, ki ga vsebuje starejša datoteka, JSON Schema pa ga zavrne. Določal je le čas zbiranja smeti odstranjenih entitet, ki ga prav tako ni več.

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

Polji `originX` in `originY` sta pogled: točka na zaslonu, na kateri pristane točka scene `(0, 0)`.  
Polje `zoomLevel` ima vrednosti od `0.1` do `1.5`. Dokument, shranjen z vrednostjo nad `1`, se v urejevalniku pred različico `3.5.0` odpre pri `1`.  
Od različice `4.0.0` nastavitve ne vsebujejo polj `width`, `height`, `scrollTop`, `scrollLeft`, `relationshipOptimization` in `ignoreSaveSettings`. Nič jih ne zapiše, razčlenjevalnik ne ohrani nobenega od njih, JSON Schema pa zavrne datoteko, ki jih še vsebuje.

Polje `canvasType` je zavihek, na katerem se dokument odpre. Dokument, shranjen na zavihku Vizualizacija, vsebuje `'@dineug/erd-editor/builtin-visualization'`, ne pa tudi tega, ali je bil prikazan način `Graph` ali `Flow`, novo ustvarjen urejevalnik pa ta zavihek prikaže v načinu `Graph`.  
Od različice `4.0.0` dokument, dokler je zaklep `Canvas Type` vklopljen, kot je v novem dokumentu, ohrani zavihek, ki je bil prikazan ob zaklepanju, preklapljanje med zavihki pa pusti lastnost `value` nespremenjeno. Zaklep, vzpostavljen na zavihku Nastavitve, hrani zavihek, s katerega je prišel bralec, zaklenjena vrednost `'settings'`, ki jo lahko zapiše samo ročno urejanje, pa se odpre na zavihku `'ERD'`.  
Nobeno lastno stanje načina `Flow` se ne serializira – njegova razporeditev, povečava, premik pogleda, prikaz vrstic in tabele, na katere je osredotočen, ostanejo v urejevalniku –, zato `originX`, `originY` in `zoomLevel` vedno opisujejo platno ERD.

Polji `show` in `lockSettings` sta bitni maski – zastavice združite z operacijo OR.  
`columnOrder` je polje z vsemi sedmimi vrednostmi `ColumnType` v vrstnem redu prikaza.  
Polja `database`, `language`, `tableNameCase`, `columnNameCase` in `bracketType` vsebujejo vsako natanko eno vrednost, JSON Schema pa zavrne združeno vrednost.

V novem dokumentu ima polje `show` vrednost `431`: `tableComment`, `columnComment`, `columnDataType`, `columnDefault`, `columnPrimaryKey`, `columnNotNull` in `relationship`.  
Od različice `3.10.0` obstajata še dve zastavici polja `show`, obe izklopljeni v novem dokumentu in v vsakem dokumentu, shranjenem pred različico `3.10.0`.  
Zastavica `columnAlternateKey` (`512`) je možnost pogleda [`Alternate Key`](../../guide/guides/table-related-functions.md#alternate-keys). Ko je nastavljena, označi stolpce vsakega enoličnega indeksa nad dvema ali več stolpci kot `AK1.1`, `AK1.2` in tako naprej. Na začetku je izklopljena, zato noben obstoječi diagram ne spremeni širine.  
Zastavica `hideReferentialAction` (`1024`) deluje obratno: ko je nastavljena, skrije [oznake ON DELETE in ON UPDATE](../../guide/guides/relationship-editing.md#reading-a-connector) na povezovalnih črtah, zato so privzeto prikazane. Možnost pogleda `Referential Actions` je označena, dokler je zastavica izklopljena. Ne spremeni velikosti nobene tabele.  
Urejevalnik pred različico `3.10.0` ohrani polje `show` kot celo število, zato se obe zastavici ob shranjevanju tam ohranita.

Od različice `4.0.0` obstajata še dve zastavici polja `show`, obe izklopljeni v novem dokumentu in v vsakem dokumentu, shranjenem pred različico `4.0.0`. Tako kot zastavica `hideReferentialAction` vsaka skrije tisto, kar poimenuje, zato so skupine tabel in beležke privzeto prikazane.  
Zastavica `hideTableGroup` (`2048`) skrije [skupine tabel](../../guide/guides/table-groups.md), `hideMemo` (`4096`) pa skrije vse beležke. To sta [možnosti pogleda](../../guide/guides/table-related-functions.md#table-view-options) `Table Groups` in `Memos`, vsaka označena, dokler je njena zastavica izklopljena. Nobena od njiju ne spremeni velikosti nobene tabele.  
Urejevalnik pred različico `4.0.0` ohrani polje `show` kot celo število, zato se obe zastavici ob shranjevanju tam ohranita.

Od različice `4.0.0` ima konstanta `Language` osem dodatnih ciljev [generatorja kode](../../guide/guides/code-generator.md), od `Mermaid` do `JSONSchema`. Vrednost `language`, ki je razčlenjevalnik ne pozna, se prebere kot `GraphQL`, zato urejevalnik pred različico `4.0.0` dokument, shranjen z enim od njih, odpre z jezikom GraphQL, shranjevanje tam pa zapiše GraphQL.

Od različice `4.0.0` polje `lockSettings` nadomešča `ignoreSaveSettings`, konstanta `LockSettingType` pa konstanto `SaveSettingType`, ki je bila odstranjena. Polje `lockSettings` navaja nastavitve, ki jih dokument shrani takšne, kot so bile ob zaklepanju. Bit `viewport` hkrati zajema `originX`, `originY` in `zoomLevel`, saj se izhodišče, shranjeno brez pripadajoče povečave, odpre drugje, vsak drug bit pa zajema polje, po katerem je poimenovan. To so vrstice [`Lock`](../../guide/guides/settings.md#lock) na zavihku Nastavitve.  
Tako `value` kot `runtimeValue` zapišeta zaklenjeno nastavitev z njeno zaklenjeno vrednostjo ne glede na to, kaj prikazuje urejevalnik, vsako drugo nastavitev pa takšno, kot je. Zato datoteka, dokler je vklopljen ustrezni zaklep, ostane nespremenjena ob pomikanju in povečevanju, preklapljanju med zavihki ali spreminjanju jezika generatorja kode, zapisa imen ali vrste narekovajev. Zaklepanje prevzame vrednost, ki jo ima nastavitev v tistem trenutku, razčlenjevanje pa prevzame zaklenjeno vrednost iz shranjenega polja.  
Dokument, ustvarjen iz nič – nov urejevalnik ali nova shramba za replikacijo ali prazna vrednost, podana lastnosti `value` ali metodi `setInitialValue()` –, ima polje `lockSettings` nastavljeno na `63`, s čimer so vklopljeni vsi zaklepi. Dokument, katerega polje `settings` ne vsebuje polja `lockSettings` – vsaka datoteka, shranjena pred različico `4.0.0`, ne glede na njeno polje `ignoreSaveSettings`, in vsak dokument v2 –, se prav tako odpre z vsemi vklopljenimi zaklepi: njegov pogled in zavihek sta tam, kjer sta pri novem dokumentu (`originX` in `originY` sta `0`, `zoomLevel` je `1`, zavihek ERD), njegov jezik, zapisa imen in vrsta narekovajev pa so zaklenjeni na vrednostih, ki jih je shranil. Dokument, ki navaja svoje zaklepe, ohrani te zaklepe, tudi vrednost `0`, in vse vrednosti, ki jih je shranil.  
Razčlenjevanje ohrani vse bite polja `lockSettings`, tudi neznane, zato se zaklep, ki ga doda poznejša izdaja, tukaj ob shranjevanju ohrani; JSON Schema preveri le, da gre za celo število. Urejevalnik pred različico `4.0.0` ob shranjevanju izpusti polje `lockSettings` in zapiše pogled in zavihek takšna, kot sta, zato se datoteka tukaj znova odpre kot datoteka, shranjena pred različico `4.0.0`.

Od različice `4.0.0` polje `ddlScripts` vsebuje dva skripta zavihka [Shema SQL](../../guide/guides/schema-sql.md), ki ju zapiše DDL vsake zbirke podatkov: `before` za glavo in pred tabelami, `after` za ustvarjeno DDL. DDL zapiše vsakega s prelomi vrstic LF, brez začetnih praznih vrstic in končnih praznih znakov ter pri MSSQL zaključenega z `GO`, kot je opisano v razdelku [Skripti pred tabelami in za njimi](../../guide/guides/schema-sql.md#before-and-after-scripts); polje `ddlScripts` pa vsak skript ohrani takšen, kot je bil vnesen. Ključ se zapiše samo, dokler kateri od skriptov vsebuje besedilo, in takrat z obema; manjkajoč ključ ali skript, ki ni niz, se prebere kot `''`. Izbire `Statements`, `Header` in `Tables` na zavihku se ne shranijo v dokument.  
Urejevalnik pred različico `4.0.0` ob nalaganju dokumenta izpusti skripta, zato se ob shranjevanju tam izgubita.

Konstante `Database`, `Language`, `Show`, `LockSettingType` in `ReferentialAction` dopuščajo samo dodajanje. Shranjeni dokument hrani število, zato nova vrsta zbirke podatkov, cilj ustvarjanja kode, zastavica, zaklep ali dejanje dobi naslednji bit namesto mesta na sredini.

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

Vsak seznam je vrstni red ene vrste entitet, ki ga berejo DDL, razvrščanje tabel in vrstni red izrisa. V obliki za shranjevanje vsak seznam vsebuje samo identifikatorje ohranjenih entitet, vsakega enkrat, v navedenem vrstnem redu. Od različice `4.0.0` je polje `tableGroupIds` vrstni red skupin tabel.

Od različice `4.0.0` se vrstni red prekrivanja ne shranjuje. Razčlenjevanje vsako navedeno tabelo, beležko in skupino tabel brez polja `zIndex` zloži glede na njeno mesto na seznamu, pri čemer so poznejše spredaj: skupine tabel od `1`, tabele od `2`, beležke pa nad vse tabele. Entiteta s poljem `zIndex`, kot v vrednosti med izvajanjem ali v datoteki, shranjeni pred različico `4.0.0`, to polje ohrani. Postavitev tabele ali beležke v ospredje se zato ob ponovnem odprtju datoteke izgubi.

### Kolekcija: tableEntities {#collection-tableentities}

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

Od različice `4.0.0` ima tabela polje `groupId`, identifikator [skupine tabel](../../guide/guides/table-groups.md), ki ji pripada. Manjkajoče ali prazno polje `groupId` ali polje, ki ne navaja nobene skupine v `doc.tableGroupIds`, pomeni, da tabela ni v nobeni skupini, oblika za shranjevanje pa ga zapiše samo, dokler navaja ohranjeno skupino.  
Razčlenjevanje polje `seqColumnIds` inicializira z `columnIds`, kadar manjka ali v njem ni katerega od navedenih identifikatorjev, urejevalnik pa ob vsakem nalaganju s svojimi pisavami znova izmeri `widthName` in `widthComment`.

### Kolekcija: tableColumnEntities {#collection-tablecolumnentities}

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

Od različice `4.0.0` oblika za shranjevanje ne zapiše polja `ui` stolpca. Vsako nalaganje izpelje polje `keys`, oznako primarnega ključa iz bita `primaryKey` polja `options` in oznako tujega ključa iz relacij, ki se končajo pri stolpcu, ter izmeri štiri širine.  
Urejevalnik pred različico `4.0.0` stolpce datoteke, shranjene tukaj, prikaže brez ikon primarnega ključa.

### Kolekcija: relationshipEntities {#collection-relationshipentities}

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

Od različice `3.10.0` ima relacija polji `onDelete` in `onUpdate`, njeni [dejanji ON DELETE in ON UPDATE](../../guide/guides/relationship-editing.md#on-delete-and-on-update). Vsako vsebuje natanko eno vrednost `ReferentialAction`. Privzeta vrednost `none` ne zapiše nobenega določila, zato velja privzeto vedenje same zbirke podatkov. Preostalih pet vrednosti pomeni `NO ACTION`, `CASCADE`, `SET NULL`, `SET DEFAULT` in `RESTRICT`. Shema SQL zapiše določilo samo za zbirko podatkov, ki sprejema njegovo dejanje.  
Oblika za shranjevanje vedno zapiše obe, od različice `4.0.0` pa ju JSON Schema zahteva in pri tem preveri le, da je vsako celo število. Manjkajoče polje, kakršno je v vsakem dokumentu, shranjenem pred različico `3.10.0`, razčlenjevanje še vedno prebere kot `none`, prav tako pa tudi vrednost zunaj seznama.  
Urejevalnik pred različico `3.10.0` teh polj ne pozna in ju ob nalaganju dokumenta izpusti, zato se ob shranjevanju tam izgubijo vsa dejanja.

Od različice `4.0.0` vsako nalaganje izpelje tisto, kar oblika za shranjevanje izpusti. Relacija je identifikacijska, kadar je vsak stolpec, na katerem se konča, primarni ključ, njeno polje `startRelationshipType` pa ima vrednost `dash`, kadar je vsak tak stolpec NOT NULL, sicer pa `ring`; relacija, ki ji ne ostane noben končni stolpec, je neidentifikacijska in ima `dash`, tako kot se začne nova relacija. Sidrne točke, `x`, `y` in `direction`, se znova postavijo.

### Kolekcija: indexEntities {#collection-indexentities}

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

Razčlenjevanje polje `seqIndexColumnIds` inicializira z `indexColumnIds`, kadar manjka ali v njem ni katerega od navedenih identifikatorjev.

### Kolekcija: indexColumnEntities {#collection-indexcolumnentities}

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

### Kolekcija: memoEntities {#collection-memoentities}

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

Od različice `4.0.0` si tabele in beležke [delijo en sklad](../../guide/guides/table-related-functions.md#moving-multiple-tables), urejen po polju `zIndex`, zato lahko postavitev tabele v ospredje to tabelo postavi nad beležko. Razčlenjevanje beležko, shranjeno brez polja `zIndex`, postavi nad vse tabele, kot je opisano v razdelku [Doc](#doc). Beležka v datoteki, shranjeni pred različico `4.0.0`, ohrani shranjeno vrednost `zIndex`, ki je izhajala iz istega števca kot vrednosti tabel, zato se beležka, ki jo je starejša izdaja izrisala nad vsemi tabelami, lahko odpre pod tabelo, ki je bila pozneje postavljena v ospredje.

### Kolekcija: tableGroupEntities {#collection-tablegroupentities}

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

Od različice `4.0.0` lahko dokument vsebuje [skupine tabel](../../guide/guides/table-groups.md): poimenovane, obarvane pravokotnike, izrisane za tabelami. Tabela se pridruži skupini prek lastnega polja `groupId`, zato skupina nima seznama članov. Oblika za shranjevanje zapiše kolekcijo, tako kot `doc.tableGroupIds`, samo, dokler obstaja kakšna skupina, dokument brez nje, na primer dokument, shranjen pred različico `4.0.0`, pa nima skupin. Zastavica `Show.hideTableGroup` jih skrije.  
Urejevalnik pred različico `4.0.0` ob nalaganju dokumenta izpusti skupine in polje `groupId` vseh tabel, zato se ob shranjevanju tam izgubijo vse skupine.

## JSON Schema {#json-schema}

Kanonična datoteka sheme je objavljena na [json-schema/schema.json](https://raw.githubusercontent.com/dineug/erd-editor/main/json-schema/schema.json) in jo lahko neposredno navedete v polju `$schema`.

```json
{
  "$schema": "https://raw.githubusercontent.com/dineug/erd-editor/main/json-schema/schema.json",
  "version": "3.0.0"
}
```

Polje `$schema` postavite na vrh datoteke `.erd.json` in urejevalniki, ki razumejo JSON Schema, kot je VS Code, bodo med urejanjem preverjali veljavnost dokumenta in samodejno dokončevali njegova polja.

Od različice `4.0.0` shema opisuje samo obliko za shranjevanje. Vsak objekt z imenovanimi polji je zaprt (`additionalProperties: false`), vsako polje, ki ga oblika za shranjevanje vedno zapiše, je obvezno, nobeno polje, ki ga izpusti, pa ni navedeno. Zato zavrne vrednost med izvajanjem. Zavrne tudi datoteko, shranjeno pred različico `4.0.0`, z objektom `meta`, širinami, poljem `zIndex`, poljem `ignoreSaveSettings` in vsem drugim, dokler je urejevalnik različice `4.0.0` ali novejše znova ne shrani. Datoteka, ki jo je shranila različica `3.2.0` ali novejša, že navaja URL te sheme, ki kaže na vejo `main`, zato jo urejevalnik, ki preverja veljavnost po njej, zdaj označi kot neveljavno. Datoteka, ki jo je shranila različica `3.0.0` ali `3.1.0`, ali dokument v2 ne navaja polja `$schema`.

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
