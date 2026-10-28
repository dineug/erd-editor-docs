---
sidebar_position: 3
description: Format dokumentov .erd.json – oblika za shranjevanje, ki jo vsebuje datoteka, in vrednost med izvajanjem, ki jo hrani urejevalnik, tipi TypeScript, konstante za posamezna številska polja in objavljena JSON Schema.
---

# Shema

Format `.erd.json` je format, v katerem urejevalnik zapisuje dokumente. To stran preberite, če morate dokument ustvariti, preveriti njegovo veljavnost ali ga migrirati zunaj urejevalnika.

Od različice `4.0.0` ima dokument dve serializaciji, obe s poljem `version` z vrednostjo `'3.0.0'`. Oblika za shranjevanje je tisto, kar vsebuje datoteka: to vrne [`editor.value`](../erd-editor-element.md#value), to zapiše izvoz JSON in to je edina oblika, ki jo sprejme objavljena [JSON Schema](#json-schema). Vrednost med izvajanjem je celoten dokument, kot ga hrani urejevalnik, in jo vrne [`editor.runtimeValue`](../erd-editor-element.md#runtimevalue). Metoda `setInitialValue()`, setter `value` in metoda `setSchemaJSON()` preberejo obe obliki, vsako datoteko, ki jo je shranila starejša izdaja, in dokument `.vuerd` različice v2. Pred različico `4.0.0` je obstajala samo ena: lastnost `value` je vračala celoten dokument, kot ga je hranil urejevalnik, tako kot zdaj lastnost `runtimeValue`.

## Oblika za shranjevanje in vrednost med izvajanjem {#storage-form-and-runtime-value}

Oblika za shranjevanje vsebuje samo žive entitete: vsako tabelo, navedeno v `doc.tableIds`, stolpce, ki jih te tabele navajajo, relacije med dvema ohranjenima tabelama, indekse ohranjenih tabel s stolpci indeksa, katerih stolpec tabela še navaja, navedene beležke in skupine tabel ter od različice `4.2.0` navedene besede, izraze in domene, ki poleg identifikatorja vsebujejo še kakšno vrednost. Izpusti tisto, kar urejevalnik izpelje ob nalaganju ali hrani, dokler je odprt: odstranjene entitete, `seqColumnIds` in `seqIndexColumnIds`, vsak `zIndex`, izmerjene širine, polje `ui` stolpca, `identification`, `startRelationshipType` in sidrne točke relacije ter od različice `4.2.0` polje `order` vsake vrstice slovarja in sezname `doc.wordIds`, `doc.termIds` in `doc.domainIds`. V spodnjih tipih je vsako od teh polj označeno z `// runtime only`.  
Ključi vsake kolekcije razen slovarjev so identifikatorji v vrstnem redu kodnih enot, pri čemer so stolpci najprej združeni po `tableId`, stolpci indeksov pa po `indexId`. Od različice `4.2.0` so `wordEntities`, `termEntities` in `domainEntities` za vsemi drugimi kolekcijami, v tem vrstnem redu, vsaka pa je zapisana kot glava in vrstice, vsaka vrstica v svoji vrstici besedila (glejte razdelek [Vrstice slovarjev](#dictionary-rows)). Vsaka entiteta zapiše svoja polja v stalnem vrstnem redu, besedilo pa je zamaknjeno za dva presledka in se konča z znakom za novo vrstico. Zato je zapis istega dokumenta vedno bajtno enak, sprememba spremeni samo tisto, česar se dotakne, datoteka, shranjena na računalniku z drugimi pisavami, pa se znova odpre z enako vrednostjo lastnosti `value`.  
VS Code, Obsidian in vtičnik za JetBrains zapišejo datoteko samo, ko se zaradi spremembe spremeni lastnost `value`, zato datoteka, ki jo je shranila starejša izdaja, ohrani staro obliko do svoje prve spremembe.

Od različice `4.2.0` oblika za shranjevanje izpusti tudi tisto, kar ne vsebuje ničesar: vsako besedilno polje, ki ga entiteta ali njeno polje `ui` vsebuje kot `''` (pri tabeli `name`, `comment` in `ui.color`, pri stolpcu `name`, `comment`, `dataType` in `default`, pri indeksu `name`, pri beležki `value` in `ui.color`, pri skupini tabel `name` in `color`), vsak seznam v `doc` in vsako kolekcijo, ki ne vsebuje nobenega vnosa, ter samo polje `collections`, ko so vse kolekcije prazne. Besedilo iz samih presledkov se zapiše takšno, kot je shranjeno, razen pri logičnem imenu, ki se takrat izpusti, in pri besedi, izrazu ali domeni, katere vrednosti poleg identifikatorja so vse prazne ali iz samih presledkov, saj se ta izpusti v celoti. Vsak identifikator, vsak seznam znotraj entitete in vsako število, tudi `0`, se še vedno zapiše. Polje `doc` se zapiše vedno, zato datoteka novega dokumenta vsebuje `$schema`, `version`, njegove nastavitve in `"doc": {}`.  
Razčlenjevanje manjkajoče besedilno polje prebere kot `''`, manjkajočo kolekcijo pa kot prazno, tako kot vsaka izdaja v3, oblika za shranjevanje pa seznam v `doc` izpusti samo, dokler njegova kolekcija ne vsebuje ničesar (glejte razdelek [Doc](#doc)). Zato te datoteke odpre tudi urejevalnik pred različico `4.2.0`, program, ki datoteko bere sam, pa mora manjkajoče prebrati na enak način. Datoteka, ki jo je shranila starejša izdaja, se ob naslednjem shranjevanju zapiše brez praznega besedila ter praznih seznamov in kolekcij, kar je enkratna sprememba, od takrat naprej pa se shranjuje bajtno enako.

Vrednost med izvajanjem ohrani tisto, kar oblika za shranjevanje izpusti: odstranjene entitete, zaporedja, vrednosti z-index, širine, oznake ključev, zastavice relacij in sidrne točke, prazna besedilna polja ter štiri sezname `tableIds`, `relationshipIds`, `indexIds` in `memoIds` in šest kolekcij od `tableEntities` do `memoEntities`, tudi kadar so prazni. Od različice `4.2.0` ohrani tudi odstranjene besede, izraze in domene, vrstice, ki ne vsebujejo ničesar, polje `order` vsake vrstice, tri sezname slovarjev, logično ime iz samih presledkov in povezavo z odstranjeno domeno. Zamaknjena je za dva presledka in na koncu nima znaka za novo vrstico. Uporabite jo samo za inicializacijo sodelavca ali drugega pogleda prek metode `setInitialValue()`, tako da razveljavitev odstranitve, ki jo pošlje drug urejevalnik, tam povrne celotno entiteto. Nikoli je ne zapišite v datoteko; JSON Schema jo zavrne. Odstranjenih entitet nič več ne počisti, zato jih vrednost med izvajanjem hrani, dokler se dokument naslednjič ne odpre iz svoje datoteke.

Obe obliki zapišeta vsako zaklenjeno nastavitev z njeno zaklenjeno vrednostjo (glejte polje [`lockSettings`](#settings)), `settings.ddlScripts` samo, dokler kateri od skriptov vsebuje besedilo, polje `groupId` tabele pa samo, dokler ni prazno. Od različice `4.2.0` obe zapišeta tudi `settings.nameViewMode` samo, dokler vrednost, ki jo zapišeta, ni `'physical'`, `settings.columnOrder` s sedmimi vnosi, kjer je to mogoče (glejte razdelek [Settings](#settings)), in polje `nameDerived` tabele samo, dokler je `true`.  
Oblika za shranjevanje zapiše `doc.tableGroupIds` in `tableGroupEntities` samo, dokler obstaja kakšna skupina tabel, polje `logicalName` samo, dokler vsebuje besedilo, ki ni iz samih presledkov, polje `domainId` stolpca samo, dokler navaja domeno, ki jo datoteka zapiše, vsak slovar pa samo, dokler vsebuje vrstico, ki jo datoteka zapiše. Vrednost med izvajanjem zapiše polji skupin tabel, dokler dokument vsebuje skupino ali odstranjeno skupino, polji `logicalName` in `domainId`, dokler nista `''`, vsak slovar z njegovim seznamom pa, dokler kateri od njiju vsebuje vnos, vključno z odstranjeno vrstico.

## TypeScript {#typescript}

Tipi opisujejo vrednost med izvajanjem. Polje, označeno z `// runtime only`, je v obliki za shranjevanje izpuščeno, polje, označeno z `?`, pa se zapiše samo, dokler nekaj vsebuje. Prazno besedilo ter prazni seznami in kolekcije, ki jih oblika za shranjevanje izpušča od različice `4.2.0`, niso označeni.

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

Vsaka entiteta ima polje `id`, neprozoren niz, ki je njen ključ v kolekciji, razen v treh slovarjih, kjer je prva vrednost vrstice. Od različice `4.2.0` razčlenjevanje entiteto sedmih kolekcij s ključi, katere polje `id` manjka, je prazno ali ni niz, prebere z identifikatorjem, enakim ključu, pod katerim je shranjena, izpusti pa vnos, ki ni objekt, ali vnos brez identifikatorja, katerega ključ je `''`. Vrstica slovarja se izpusti, kadar ni polje ali njeno polje `id` ni niz, različen od `''`. Urejevalnik pred različico `4.2.0` izpusti entiteto, katere polje `id` manjka ali je prazno, zato oblika za shranjevanje še vedno zapiše vsak identifikator.  
Od različice `4.0.0` je vsak nov identifikator, tudi identifikator vrstice slovarja, UUIDv7, zapisan v obliki Uuid25 kot 25 števk v osnovi 36 z malimi črkami, na primer `03gzrxjv20bdlcak89q25d2m7`, zato se identifikatorji, ki jih ustvari en urejevalnik, razvrstijo v vrstnem redu, v katerem jih je ustvaril. Dokument ohrani identifikatorje, ki jih vsebuje, na primer identifikatorje nanoid starejše izdaje ali identifikatorje datoteke v2, zato se nič ne bi smelo zanašati na obliko identifikatorja.

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

Polji `originX` in `originY` sta pogled: točka na zaslonu, na kateri pristane točka scene `(0, 0)`.  
Polje `zoomLevel` ima vrednosti od `0.1` do `1.5`. Dokument, shranjen z vrednostjo nad `1`, se v urejevalniku pred različico `3.5.0` odpre pri `1`.  
Od različice `4.0.0` nastavitve ne vsebujejo polj `width`, `height`, `scrollTop`, `scrollLeft`, `relationshipOptimization` in `ignoreSaveSettings`. Nič jih ne zapiše, razčlenjevalnik ne ohrani nobenega od njih, JSON Schema pa zavrne datoteko, ki jih še vsebuje.

Polje `canvasType` je zavihek, na katerem se dokument odpre. Dokument, shranjen na zavihku Vizualizacija, vsebuje `'@dineug/erd-editor/builtin-visualization'`, ne pa tudi tega, ali je bil prikazan način `Graph` ali `Flow`, novo ustvarjen urejevalnik pa ta zavihek prikaže v načinu `Graph`.  
Od različice `4.0.0` dokument, dokler je zaklep `Canvas Type` vklopljen, kot je v novem dokumentu, ohrani zavihek, ki je bil prikazan ob zaklepanju, preklapljanje med zavihki pa pusti lastnost `value` nespremenjeno. Zaklep, vzpostavljen na zavihku Nastavitve, hrani zavihek, s katerega je prišel bralec, zaklenjena vrednost `'settings'`, ki jo lahko zapiše samo ročno urejanje, pa se odpre na zavihku `'ERD'`.  
Od različice `4.2.0` je lahko vrednost polja `canvasType` tudi `'@dineug/erd-editor/builtin-dictionary'`, zavihek [Slovar](../../guide/guides/dictionary.md), ki ga zaklep `Canvas Type` ohrani tako kot druge zavihke. Urejevalnik pred različico `4.2.0` to vrednost ohrani, vendar pod svojo orodno vrstico ne prikaže nobenega zavihka, dokler bralec ne izbere enega.  
Nobeno lastno stanje načina `Flow` se ne serializira: njegova razporeditev, povečava, premik pogleda, prikaz vrstic in tabele, na katere je osredotočen, ostanejo v urejevalniku, od različice `4.2.0` pa tudi pogledi, med katerimi prehajata [`Previous table` in `Next table`](../../guide/guides/visualization.md#previous-table-and-next-table). Zato `originX`, `originY` in `zoomLevel` vedno opisujejo platno ERD.

Polji `show` in `lockSettings` sta bitni maski – zastavice združite z operacijo OR.  
`columnOrder` je polje, ki vsako vrednost `ColumnType` vsebuje enkrat, v vrstnem redu prikaza; od različice `4.2.0` ga lahko dokument zapiše s sedmimi od devetih vrednosti, kot opisuje spodnji odstavek o vrstnem redu stolpcev.  
Polja `database`, `language`, `tableNameCase`, `columnNameCase` in `bracketType` vsebujejo vsako natanko eno vrednost, JSON Schema pa zavrne združeno vrednost.

V novem dokumentu ima polje `show` vrednost `431`: `tableComment`, `columnComment`, `columnDataType`, `columnDefault`, `columnPrimaryKey`, `columnNotNull` in `relationship`.  
Od različice `3.10.0` obstajata še dve zastavici polja `show`, obe izklopljeni v novem dokumentu in v vsakem dokumentu, shranjenem pred različico `3.10.0`.  
Zastavica `columnAlternateKey` (`512`) je možnost pogleda [`Alternate Key`](../../guide/guides/table-related-functions.md#alternate-keys). Ko je nastavljena, označi stolpce vsakega enoličnega indeksa nad dvema ali več stolpci kot `AK1.1`, `AK1.2` in tako naprej. Na začetku je izklopljena, zato noben obstoječi diagram ne spremeni širine.  
Zastavica `hideReferentialAction` (`1024`) deluje obratno: ko je nastavljena, skrije [oznake ON DELETE in ON UPDATE](../../guide/guides/relationship-editing.md#reading-a-connector) na povezovalnih črtah, zato so privzeto prikazane. Možnost pogleda `Referential Actions` je označena, dokler je zastavica izklopljena. Ne spremeni velikosti nobene tabele.  
Urejevalnik pred različico `3.10.0` ohrani polje `show` kot celo število, zato se obe zastavici ob shranjevanju tam ohranita.

Od različice `4.0.0` obstajata še dve zastavici polja `show`, obe izklopljeni v novem dokumentu in v vsakem dokumentu, shranjenem pred različico `4.0.0`. Tako kot zastavica `hideReferentialAction` vsaka skrije tisto, kar poimenuje, zato so skupine tabel in beležke privzeto prikazane.  
Zastavica `hideTableGroup` (`2048`) skrije [skupine tabel](../../guide/guides/table-groups.md), `hideMemo` (`4096`) pa skrije vse beležke. To sta [možnosti pogleda](../../guide/guides/table-related-functions.md#table-view-options) `Table Groups` in `Memos`, vsaka označena, dokler je njena zastavica izklopljena. Nobena od njiju ne spremeni velikosti nobene tabele.  
Urejevalnik pred različico `4.0.0` ohrani polje `show` kot celo število, zato se obe zastavici ob shranjevanju tam ohranita.

Od različice `4.2.0` obstaja še ena zastavica polja `show`, `columnDomain` (`8192`), izklopljena v novem dokumentu in v vsakem dokumentu, shranjenem pred različico `4.2.0`, zato ima polje `show` v novem dokumentu še vedno vrednost `431`. To je [možnost pogleda](../../guide/guides/table-related-functions.md#table-view-options) `Domain`: ko je nastavljena, vsaka vrstica stolpca prikaže [celico domene](../../guide/guides/logical-names.md#the-domain-cell), ki tabele razširi. Na začetku je izklopljena, zato noben obstoječi diagram ne spremeni širine.  
Urejevalnik pred različico `4.2.0` ohrani polje `show` kot celo število, zato se zastavica ob shranjevanju tam ohrani.

Od različice `4.2.0` ima konstanta `ColumnType` devet vrednosti. `columnLogicalName` (`128`) določa mesto celice logičnega imena, ki jo vrstica stolpca izriše samo v prikazu `Both Names`, `columnDomain` (`256`) pa mesto celice domene. To sta vrstici `Logical Name` in `Domain` v [vrstnem redu stolpcev](../../guide/guides/settings.md#adjusting-column-order) na zavihku Nastavitve. Urejevalnik hrani vrstni red vseh devetih, vrstni red novega dokumenta pa je `128, 1, 2, 256, 4, 8, 16, 32, 64`.  
Obe obliki zapišeta vrstni red s sedmimi vnosi, brez `128` in `256`, dokler `128` stoji tik pred `columnName` in `256` tik za `columnDataType`. Zato nov dokument še vedno zapiše `1, 2, 4, 8, 16, 32, 64`, datoteka, v katere vrstnem redu ju ni nihče premaknil, pa ohrani svoje bajte. Sicer zapišeta vseh devet.  
Razčlenjevanje obe vrednosti vstavi na ti mesti v vrstni red s sedmimi vnosi, ne glede na to, v kakšnem vrstnem redu je teh sedem, devet vnosov, ki vsebujejo vse tipe, prevzame takšne, kot so.  
Od različice `5.0.0` prevzame tudi vsak drug vrstni red. Vsak `ColumnType`, ki ga pozna, ohrani enkrat, v podanem vrstnem redu, vsak drug vnos pa izpusti: vrednost, ki je noben `ColumnType` ne poimenuje, na primer tip, ki ga doda poznejša izdaja, in drugi vnos istega tipa. Vsak tip, ki ga vrstni red nima, pride tik za najbližji prejšnji tip v privzetem vrstnem redu, ki ga vrstni red vsebuje, ali, če ga ni, tik pred najbližji poznejši, kar je način, kako `128` in `256` najdeta svoji mesti v sedmih vnosih. Samo vrstni red, ki ne poimenuje nobenega tipa, ki ga pozna, ali vrednost, ki ni polje, se prebere kot privzeti vrstni red.  
Datoteka, ki jo je shranila poznejša izdaja, se zato odpre z vrstnim redom tipov, ki jih ta izdaja pozna, shranjevanje tu pa zapiše ta vrstni red brez drugih. Pred različico `5.0.0` je razčlenjevanje vsak drug vrstni red prebralo kot privzeti, zato se je taka datoteka odprla z ponastavljenim vrstnim redom stolpcev. JSON Schema sprejme sedem ali devet celih števil.

Od različice `4.0.0` ima konstanta `Language` osem dodatnih ciljev [generatorja kode](../../guide/guides/code-generator.md), od `Mermaid` do `JSONSchema`. Vrednost `language`, ki je razčlenjevalnik ne pozna, se prebere kot `GraphQL`, zato urejevalnik pred različico `4.0.0` dokument, shranjen z enim od njih, odpre z jezikom GraphQL, shranjevanje tam pa zapiše GraphQL.

Od različice `4.0.0` polje `lockSettings` nadomešča `ignoreSaveSettings`, konstanta `LockSettingType` pa konstanto `SaveSettingType`, ki je bila odstranjena. Polje `lockSettings` navaja nastavitve, ki jih dokument shrani takšne, kot so bile ob zaklepanju. Bit `viewport` hkrati zajema `originX`, `originY` in `zoomLevel`, saj se izhodišče, shranjeno brez pripadajoče povečave, odpre drugje, vsak drug bit pa zajema polje, po katerem je poimenovan. To so vrstice [`Lock`](../../guide/guides/settings.md#lock) na zavihku Nastavitve.  
Tako `value` kot `runtimeValue` zapišeta zaklenjeno nastavitev z njeno zaklenjeno vrednostjo ne glede na to, kaj prikazuje urejevalnik, vsako drugo nastavitev pa takšno, kot je. Zato datoteka, dokler je vklopljen ustrezni zaklep, ostane nespremenjena ob pomikanju in povečevanju, preklapljanju med zavihki, spreminjanju jezika generatorja kode, zapisa imen ali vrste narekovajev ali preklapljanju prikaza imen. Zaklepanje prevzame vrednost, ki jo ima nastavitev v tistem trenutku, razčlenjevanje pa prevzame zaklenjeno vrednost iz shranjenega polja.  
Dokument, ustvarjen iz nič – nov urejevalnik ali nova shramba za replikacijo ali prazna vrednost, podana lastnosti `value` ali metodi `setInitialValue()` –, ima polje `lockSettings` nastavljeno na `63`, s čimer so vklopljeni vsi zaklepi. Dokument, katerega polje `settings` ne vsebuje polja `lockSettings` – vsaka datoteka, shranjena pred različico `4.0.0`, ne glede na njeno polje `ignoreSaveSettings`, in vsak dokument v2 –, se prav tako odpre z vsemi vklopljenimi zaklepi: njegov pogled in zavihek sta tam, kjer sta pri novem dokumentu (`originX` in `originY` sta `0`, `zoomLevel` je `1`, zavihek ERD), njegov jezik, zapisa imen in vrsta narekovajev pa so zaklenjeni na vrednostih, ki jih je shranil. Dokument, ki navaja svoje zaklepe, ohrani te zaklepe, tudi vrednost `0`, in vse vrednosti, ki jih je shranil.  
Razčlenjevanje ohrani vse bite polja `lockSettings`, tudi neznane, zato se zaklep, ki ga doda poznejša izdaja, tukaj ob shranjevanju ohrani; JSON Schema preveri le, da gre za celo število. Urejevalnik pred različico `4.0.0` ob shranjevanju izpusti polje `lockSettings` in zapiše pogled in zavihek takšna, kot sta, zato se datoteka tukaj znova odpre kot datoteka, shranjena pred različico `4.0.0`.

Od različice `4.2.0` obstaja sedmi zaklep, `unlockNameViewMode` (`64`), vrstica `Name View`, ki zajema `nameViewMode`. Njegov bit se bere obratno kot drugi biti zaklepov, tako kot biti za skrivanje v `Show`: ko je nastavljen, je prikaz imen odklenjen, ko ni, pa zaklenjen. Zato `63` še vedno pomeni, da so vklopljeni vsi zaklepi, nov dokument pa to vrednost vsebuje s prikazom imen, zaklenjenim na `'physical'`. Datoteka, shranjena pred različico `4.2.0`, ima ta bit počiščen ne glede na druge zaklepe, tudi pri vrednosti `0`, zato se odpre s prikazom imen, zaklenjenim na `'physical'`. Dokument z vsemi izklopljenimi zaklepi vsebuje `64`, dokument z vsemi drugimi vklopljenimi zaklepi in odklenjenim prikazom imen pa `127`. Ta zaklep preverjajte obratno: vklopljen je, dokler velja `(lockSettings & 64) === 0`.  
Dokler je vklopljen, preklop prikaza imen spremeni samo zaslon urejevalnika, v katerem je bil opravljen, dokument pa ohrani zaklenjeni prikaz. Dokler je izklopljen, je preklop v urejevalniku, ki lahko ureja, preklop dokumenta, z njim pa preklopijo tudi vsi sodelavci. Preklop v urejevalniku samo za branje v obeh primerih spremeni samo njegov zaslon. Glejte seznam [`Lock`](../../guide/guides/settings.md#lock).  
Urejevalnik različice `4.0.0` ali `4.1.0` bit ob shranjevanju ohrani, izpusti pa `nameViewMode`, zato se dokument tukaj znova odpre v prikazu `'physical'` z nespremenjenim zaklepom.

Od različice `4.0.0` polje `ddlScripts` vsebuje dva skripta zavihka [Shema SQL](../../guide/guides/schema-sql.md), ki ju zapiše DDL vsake zbirke podatkov: `before` za glavo in pred tabelami, `after` za ustvarjeno DDL. DDL zapiše vsakega s prelomi vrstic LF, brez začetnih praznih vrstic in končnih praznih znakov ter pri MSSQL zaključenega z `GO`, kot je opisano v razdelku [Skripti pred tabelami in za njimi](../../guide/guides/schema-sql.md#before-and-after-scripts); polje `ddlScripts` pa vsak skript ohrani takšen, kot je bil vnesen. Ključ se zapiše samo, dokler kateri od skriptov vsebuje besedilo, in takrat z obema; manjkajoč ključ ali skript, ki ni niz, se prebere kot `''`. Izbire `Statements`, `Header` in `Tables` na zavihku in od različice `4.2.0` njegovo stikalo [`Write logical names into empty comments`](../../guide/guides/schema-sql.md#logical-names-as-comments) se ne shranijo v dokument.  
Urejevalnik pred različico `4.0.0` ob nalaganju dokumenta izpusti skripta, zato se ob shranjevanju tam izgubita.

Od različice `4.2.0` je polje `nameViewMode` [prikaz imen](../../guide/guides/logical-names.md#name-view), tj. imena, ki jih izriše diagram: `'physical'` ime vsake tabele in vsakega stolpca, `'logical'` logično ime na mestu imena, `'both'` pa logično ime in ime. Meniji jih imenujejo `Physical Names`, `Logical Names` in `Both Names`. Obe obliki ga zapišeta zadnjega, za `ddlScripts`, in samo, dokler vrednost, ki jo zapišeta, ni `'physical'`; dokler je zaklep `Name View` vklopljen, je to zaklenjena vrednost, ne glede na to, kaj prikazuje zaslon. Manjkajoča vrednost ali vrednost, ki je razčlenjevalnik ne pozna, se prebere kot `'physical'`, JSON Schema pa sprejme samo `"logical"` in `"both"`.  
Urejevalnik pred različico `4.2.0` ob nalaganju dokumenta izpusti polje `nameViewMode`.

Konstante `Database`, `Language`, `Show`, `ColumnType`, `ColumnOption`, `LockSettingType` in `ReferentialAction` dopuščajo samo dodajanje. Shranjeni dokument hrani število, zato nova vrsta zbirke podatkov, cilj ustvarjanja kode, zastavica, tip stolpca, možnost stolpca, zaklep ali dejanje dobi naslednji bit namesto mesta na sredini.

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

Vsak od prvih petih seznamov je vrstni red ene vrste entitet, ki ga berejo DDL, razvrščanje tabel in vrstni red izrisa. V obliki za shranjevanje vsak seznam vsebuje samo identifikatorje ohranjenih entitet, vsakega enkrat, v navedenem vrstnem redu, od različice `4.2.0` pa se seznam, ki ne vsebuje nobenega identifikatorja, izpusti. Od različice `4.0.0` je polje `tableGroupIds` vrstni red skupin tabel.

Od različice `4.2.0` seznami `wordIds`, `termIds` in `domainIds` navajajo žive vrstice posameznega slovarja: vrstica, ki jo vsebuje kolekcija, ne pa tudi seznam, je odstranjena. Niso vrstni red lista, saj tega določa polje `order` vsake vrstice. Zapiše jih samo vrednost med izvajanjem, vsakega, dokler on sam ali njegova kolekcija vsebuje kakšen vnos. V datoteki že same vrstice določajo pripadnost in vrstni red, JSON Schema pa sezname zavrne.  
Od različice `4.2.0` razčlenjevanje seznam, ki ga dokument izpusti ali ga vsebuje kot nekaj drugega kot polje, prebere kot vse vnose, ki jih vsebuje njegova kolekcija, vsak identifikator enkrat, v shranjenem vrstnem redu; prazno polje ostane prazno, vsi vnosi njegove kolekcije pa se takrat preberejo kot odstranjeni. Urejevalnik pred različico `4.2.0` manjkajoč seznam prebere kot prazen, zato oblika za shranjevanje še vedno zapiše vsak seznam, kadar koli njegova kolekcija vsebuje entiteto.

Od različice `4.0.0` se vrstni red prekrivanja ne shranjuje. Razčlenjevanje vsako navedeno tabelo, beležko in skupino tabel brez polja `zIndex` zloži glede na njeno mesto na seznamu, pri čemer so poznejše spredaj: skupine tabel od `1`, tabele od `2`, beležke pa nad vse tabele. Entiteta s poljem `zIndex`, kot v vrednosti med izvajanjem ali v datoteki, shranjeni pred različico `4.0.0`, to polje ohrani. Postavitev tabele ali beležke v ospredje se zato ob ponovnem odprtju datoteke izgubi.

### Kolekcija: tableEntities {#collection-tableentities}

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

Od različice `4.0.0` ima tabela polje `groupId`, identifikator [skupine tabel](../../guide/guides/table-groups.md), ki ji pripada. Manjkajoče ali prazno polje `groupId` ali polje, ki ne navaja nobene skupine v `doc.tableGroupIds`, pomeni, da tabela ni v nobeni skupini, oblika za shranjevanje pa ga zapiše samo, dokler navaja ohranjeno skupino.  
Razčlenjevanje polje `seqColumnIds` inicializira z `columnIds`, kadar manjka ali v njem ni katerega od navedenih identifikatorjev, urejevalnik pa ob vsakem nalaganju s svojimi pisavami znova izmeri `widthName`, `widthLogicalName` in `widthComment`.

Od različice `4.2.0` ima tabela polje `logicalName`, ime, ki ga izrišeta [prikaza](../../guide/guides/logical-names.md#name-view) `Logical Names` in `Both Names`, z vrednostjo `''`, kadar ga ni, in polje `nameDerived`, ki je `true`, kadar so slovarji polje `name` [izpeljali](../../guide/guides/dictionary.md#deriving-physical-names) iz logičnega imena. Dokler je nastavljeno, novo logično ime znova izpelje ime; dokler ni nastavljeno, je ime nekdo vnesel sam in novo logično ime ga pusti nespremenjenega, razen če je ime prazno ali iz samih presledkov. Ročno preimenovanje ga izklopi, postavka [`Derive Physical Names Again`](../../guide/guides/dictionary.md#derive-physical-names-again) pa znova zapiše celo ime, ki ga je nekdo vnesel sam, in ga vklopi povsod, kjer obstaja logično ime.  
Oblika za shranjevanje zapiše `logicalName` za `name`, takšno, kot je bilo vneseno, samo, dokler vsebuje besedilo, ki ni iz samih presledkov, `nameDerived` pa za `groupId` samo, dokler je `true`, kar je edina vrednost, ki jo sprejme JSON Schema. Manjkajoče polje `logicalName` se prebere kot `''`, manjkajoče polje `nameDerived` pa kot `false`, zato vsako ime v datoteki, shranjeni pred različico `4.2.0`, šteje za ime, ki ga je nekdo vnesel sam.  
Urejevalnik pred različico `4.2.0` ob nalaganju dokumenta izpusti obe polji, zato se ob shranjevanju tam izgubi logično ime vsake tabele.

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

Od različice `4.0.0` oblika za shranjevanje ne zapiše polja `ui` stolpca. Vsako nalaganje izpelje polje `keys`, oznako primarnega ključa iz bita `primaryKey` polja `options` in oznako tujega ključa iz relacij, ki se končajo pri stolpcu, ter izmeri šest širin.  
Urejevalnik pred različico `4.0.0` stolpce datoteke, shranjene tukaj, prikaže brez ikon primarnega ključa.

Od različice `4.2.0` ima stolpec tako kot tabela polje `logicalName` ter polje `domainId`, identifikator domene, s katero je povezan, z vrednostjo `''`, kadar povezave ni. Spremembe v enem urejevalniku ohranjajo povezan stolpec pri podatkovnem tipu njegove domene, kot je opisano v razdelku [Domene in podatkovni tipi](../../guide/guides/dictionary.md#domains-and-data-types). Razčlenjevanje pa nobenemu stolpcu ne spremeni tipa, zato lahko datoteka, zapisana drugje, pusti povezan stolpec pri drugem tipu, prav tako pa tudi navzkrižne spremembe dveh sodelavcev; list Preverjanja vsak tak stolpec navede kot preverjanje [`Domain type mismatch`](../../guide/guides/dictionary.md#what-each-check-finds). Razčlenjevanje počisti polje `domainId`, ki ne navaja nobene domene v dokumentu. Odstranjena domena še vedno šteje, zato urejevalnik povezavo z njo ohrani, dokler lahko razveljavitev domeno povrne. Za poljem `options` oblika za shranjevanje zapiše `logicalName` po enakem pravilu kot pri tabeli, `domainId` pa samo, dokler navaja domeno, ki jo datoteka zapiše, torej nikoli povezave z odstranjeno domeno.  
`ColumnOption.nameDerived` (`16`) je zastavica izpeljanega imena stolpca, shranjena v `options` skupaj z drugimi biti, in pomeni isto kot polje `nameDerived` tabele. Primarni ključ NOT NULL, katerega ime so izpeljali slovarji, ima na primer polje `options` z vrednostjo `26`.  
Urejevalnik pred različico `4.2.0` ob nalaganju dokumenta izpusti polji `logicalName` in `domainId`, zato se ob shranjevanju tam izgubita. Polje `options` ohrani kot celo število, zato se bit `nameDerived` ob shranjevanju tam ohrani.

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

### Vrstice slovarjev {#dictionary-rows}

Od različice `4.2.0` dokument v `wordEntities`, `termEntities` in `domainEntities` vsebuje tri slovarje, liste `Words`, `Terms` in `Domains` na zavihku [Slovar](../../guide/guides/dictionary.md). Vsako polje besede, izraza ali domene je niz in nobena od teh entitet nima polja `ui`. List `Checks` se izračuna iz slovarjev in diagrama ter se ne shrani.

```ts
type DictionaryRows = {
  fields: string[];
  rows: string[][];
};
```

Ključi nobenega od treh slovarjev niso identifikatorji. Vsak je zapisan kot glava in vrstice: `fields` enkrat navede polja entitete, najprej identifikator, vsaka vrstica pa vsebuje vrednosti ene entitete v tem vrstnem redu. Spodnji tipi navajajo polja vsake entitete v vrstnem redu glave vrednosti med izvajanjem. Vrstica vedno ohrani identifikator in ime, njene končne prazne vrednosti za imenom pa se izpustijo, zato prazna vrednost pred vrednostjo, ki se ohrani, ostane `''`, razčlenjevanje pa vrednost, ki je vrstica nima, prebere kot `''`. Obe obliki zapišeta vsako vrstico v svojo vrstico besedila kot kompakten JSON, kot v teh dveh besedah iz datoteke:

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

Oblika za shranjevanje zapiše navedene vrstice v vrstnem redu na listu in izpusti `order`, zato ga njene glave ne navajajo. Izpusti vrstico, katere vrednosti poleg identifikatorja so vse prazne ali iz samih presledkov, na primer vrstico, ki je bila dodana in nikoli izpolnjena, ali izpraznjeno vrstico, ter vsako povezavo s tako domeno ali z odstranjeno domeno: polje `domainId` stolpca se izpusti, pri izrazu pa se zapiše kot `''`, pri čemer se sam izraz izpusti, če ne vsebuje ničesar drugega.  
Glave vrednosti med izvajanjem navajajo `"order"` takoj za `"name"`. Vrednost med izvajanjem zapiše vsako vrstico, ki jo vsebuje kolekcija, tudi odstranjene, v vrstnem redu, v katerem jih vsebuje kolekcija, zato za vrstni red lista razvrstite po polju `order`, pri čemer vrednosti primerjate v vrstnem redu kodnih enot. Razčlenjevanje da vrsticam datoteke ključe `order` v vrstnem redu, v katerem stojijo, zato se preberejo v vrstnem redu, v katerem jih je zapisala datoteka.  
Dokument brez slovarjev, na primer dokument, shranjen pred različico `4.2.0`, nima nobenega vnosa v slovarjih. Urejevalnik pred različico `4.2.0` ob nalaganju dokumenta izpusti vse tri, zato se ob shranjevanju tam izgubijo vse besede, izrazi in domene.

### Kolekcija: wordEntities {#collection-wordentities}

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

Beseda je ena od besed, iz katerih je sestavljeno logično ime, `abbreviation` pa je tisto, kar jo nadomešča v fizičnem imenu. Polje `synonyms` navaja druge zapise besede, `forbiddenWords` pa besede, ki se ne smejo uporabiti namesto nje, vrednosti obeh polj pa so ločene z vejicami.

### Kolekcija: termEntities {#collection-termentities}

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

Izraz je celotno logično ime. Tabela ali stolpec, katerega `logicalName` se ujema z `name`, izpelje `physicalName` ali, dokler je to prazno, ime, sestavljeno iz okrajšav besed, stolpec pa prevzame tudi domeno, ki jo navaja `domainId`, pri čemer `''` pomeni, da je ni (glejte razdelek [Izpeljava fizičnih imen](../../guide/guides/dictionary.md#deriving-physical-names)). Vrednosti v polju `synonyms` so ločene z vejicami. Razčlenjevanje počisti polje `domainId`, ki ne navaja nobene domene, tako kot pri stolpcu.

### Kolekcija: domainEntities {#collection-domainentities}

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

Domena je podatkovni tip z imenom, ki ga `dataType` vsebuje tako kot pri stolpcu, vključno z dolžino, na primer `NUMERIC(10)`. Stolpec ali izraz se z domeno poveže prek njenega identifikatorja, urejevalnik pa vsakemu povezanemu stolpcu da podatkovni tip domene (glejte razdelek [Domene in podatkovni tipi](../../guide/guides/dictionary.md#domains-and-data-types)).

## JSON Schema {#json-schema}

Kanonična datoteka sheme je objavljena na [json-schema/schema.json](https://raw.githubusercontent.com/dineug/erd-editor/main/json-schema/schema.json) in jo lahko neposredno navedete v polju `$schema`.

```json
{
  "$schema": "https://raw.githubusercontent.com/dineug/erd-editor/main/json-schema/schema.json",
  "version": "3.0.0"
}
```

Polje `$schema` postavite na vrh datoteke `.erd.json` in urejevalniki, ki razumejo JSON Schema, kot je VS Code, bodo med urejanjem preverjali veljavnost dokumenta in samodejno dokončevali njegova polja.

Od različice `4.0.0` shema opisuje samo obliko za shranjevanje. Vsak objekt z imenovanimi polji je zaprt (`additionalProperties: false`), vsako polje, ki ga oblika za shranjevanje vedno zapiše, je obvezno, polje, ki ga izpusti, dokler ne vsebuje ničesar, je navedeno, vendar ni obvezno, nobeno polje, ki ga vedno izpusti, pa ni navedeno. Zato zavrne vrednost med izvajanjem. Zavrne tudi datoteko, shranjeno pred različico `4.0.0`, z objektom `meta`, širinami, poljem `zIndex`, poljem `ignoreSaveSettings` in vsem drugim, dokler je urejevalnik različice `4.0.0` ali novejše znova ne shrani. Datoteka, ki jo je shranila različica `3.2.0` ali novejša, že navaja URL te sheme, ki kaže na vejo `main`, zato jo urejevalnik, ki preverja veljavnost po njej, zdaj označi kot neveljavno. Datoteka, ki jo je shranila različica `3.0.0` ali `3.1.0`, ali dokument v2 ne navaja polja `$schema`.

Od različice `4.2.0` shema ne zahteva več besedilnih polj entitete niti nobenega seznama v `doc`, nobene kolekcije ali samega polja `collections`, ki jih oblika za shranjevanje izpusti, dokler ne vsebujejo ničesar. Še vedno sprejme datoteko, ki jo je shranila različica `4.0.0` ali `4.1.0`. Navaja nova polja: `nameViewMode`, ki sprejme samo `"logical"` in `"both"`; polji `logicalName` in `nameDerived` tabele, pri čemer slednje sprejme samo `true`; polji `logicalName` in `domainId` stolpca; ter tri slovarje, vsakega z glavo in vrsticami nizov. Polje `canvasType` navaja zavihek Slovar, `columnOrder` sprejme sedem ali devet celih števil, opisi polj `show`, `columnOrder`, `lockSettings` in `options` pa navajajo nove bite.

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
