---
sidebar_position: 3
description: "Formatul de document .erd.json: forma de stocare pe care o conține un fișier și valoarea de execuție pe care o păstrează un editor, tipurile TypeScript, constantele din spatele fiecărui câmp numeric și JSON Schema publicată."
---

# Schemă

`.erd.json` este formatul de document al editorului. Citiți această pagină dacă trebuie să generați, să validați sau să migrați un document în afara editorului.

Începând cu versiunea `4.0.0`, un document are două serializări, ambele cu câmpul `version` egal cu `'3.0.0'`. Forma de stocare este ceea ce conține un fișier: este ceea ce returnează [`editor.value`](../erd-editor-element.md#value), ceea ce scrie exportul JSON și singura formă pe care o acceptă [JSON Schema](#json-schema) publicată. Valoarea de execuție este întregul document așa cum îl păstrează un editor, pe care îl returnează [`editor.runtimeValue`](../erd-editor-element.md#runtimevalue). Metoda `setInitialValue()`, setterul `value` și metoda `setSchemaJSON()` citesc oricare dintre cele două forme, orice fișier salvat de o versiune anterioară și un document `.vuerd` v2. Înainte de versiunea `4.0.0`, exista una singură: proprietatea `value` returna întregul document așa cum îl păstra editorul, cum face acum proprietatea `runtimeValue`.

## Forma de stocare și valoarea de execuție {#storage-form-and-runtime-value}

Forma de stocare conține doar entitățile existente: fiecare tabel listat în `doc.tableIds`, coloanele pe care le listează aceste tabele, relațiile dintre două tabele păstrate, indexurile tabelelor păstrate cu coloanele de index a căror coloană este încă listată de tabel, notele și grupurile de tabele listate, precum și, începând cu versiunea `4.2.0`, cuvintele, termenii și domeniile listate care conțin o valoare în afară de ID. Omite ceea ce un editor deduce la încărcare sau păstrează cât timp este deschis: entitățile eliminate, `seqColumnIds` și `seqIndexColumnIds`, fiecare câmp `zIndex`, lățimile măsurate, câmpul `ui` al coloanelor, `identification`, `startRelationshipType` și ancorele unei relații, precum și, începând cu versiunea `4.2.0`, câmpul `order` al fiecărui rând din dicționare și listele `doc.wordIds`, `doc.termIds` și `doc.domainIds`. Tipurile de mai jos marchează fiecare dintre aceste câmpuri cu `// runtime only`.  
Cheile fiecărei colecții, cu excepția dicționarelor, sunt ID-urile, în ordinea unităților de cod, coloanele fiind grupate mai întâi după `tableId`, iar coloanele de index după `indexId`. Începând cu versiunea `4.2.0`, `wordEntities`, `termEntities` și `domainEntities` vin după toate celelalte colecții, în această ordine, fiecare scrisă ca un antet și rânduri, câte un rând pe linie (consultați [Rândurile dicționarelor](#dictionary-rows)). Fiecare entitate își scrie câmpurile într-o ordine fixă, iar textul este indentat cu două spații și se termină cu un caracter de linie nouă. Astfel, același document scrie mereu aceiași octeți, o editare modifică doar ceea ce atinge, iar un fișier salvat pe un calculator cu alte fonturi se redeschide cu aceeași valoare pentru `value`.  
VS Code, Obsidian și pluginul pentru JetBrains scriu un fișier doar când o editare modifică proprietatea `value`, așa că un fișier salvat de o versiune anterioară își păstrează forma veche până la prima editare.

Începând cu versiunea `4.2.0`, forma de stocare omite și ceea ce nu conține nimic: fiecare câmp de text pe care o entitate sau câmpul ei `ui` îl conține ca `''` (câmpurile `name`, `comment` și `ui.color` ale unui tabel, `name`, `comment`, `dataType` și `default` ale unei coloane, `name` al unui index, `value` și `ui.color` ale unei note, `name` și `color` ale unui grup de tabele), fiecare listă `doc` și fiecare colecție care nu conține nicio intrare, precum și obiectul `collections` însuși odată ce toate colecțiile sunt goale. Un text format doar din spații albe este scris așa cum este, cu excepția unui nume logic, care este atunci omis, și a unui cuvânt, termen sau domeniu ale cărui valori de după ID sunt toate goale sau formate doar din spații albe, care este omis în întregime. Fiecare ID, fiecare listă din interiorul unei entități și fiecare număr, inclusiv `0`, sunt scrise în continuare. Câmpul `doc` este scris întotdeauna, așa că fișierul unui document nou conține `$schema`, `version`, setările sale și `"doc": {}`.  
Parsarea citește un câmp de text lipsă ca `''` și o colecție lipsă ca goală, la fel ca orice versiune v3, iar forma de stocare omite o listă `doc` doar cât timp colecția ei nu conține nimic (consultați [Doc](#doc)). Astfel, și un editor anterior versiunii `4.2.0` deschide aceste fișiere, iar un program care citește singur un fișier trebuie să citească în același mod ceea ce lipsește. Un fișier salvat de o versiune anterioară revine de la următoarea salvare cu textele, listele și colecțiile goale omise, o modificare care se face o singură dată, și de atunci se salvează octet cu octet la fel.

Valoarea de execuție păstrează ceea ce omite forma de stocare: entitățile eliminate, secvențele, valorile z-index, lățimile, marcajele de cheie, indicatorii relațiilor și ancorele, câmpurile de text goale, precum și cele patru liste `tableIds`, `relationshipIds`, `indexIds` și `memoIds` și cele șase colecții de la `tableEntities` până la `memoEntities`, chiar și când sunt goale. Începând cu versiunea `4.2.0`, păstrează și cuvintele, termenii și domeniile eliminate, rândurile care nu conțin nimic, câmpul `order` al fiecărui rând, cele trei liste ale dicționarelor, un nume logic format doar din spații albe și o legătură cu un domeniu eliminat. Este indentată cu două spații, fără caracter de linie nouă la final. Folosiți-o doar pentru a inițializa un colaborator sau o a doua vizualizare prin metoda `setInitialValue()`, astfel încât, atunci când un alt editor trimite anularea unei eliminări, entitatea să revină acolo întreagă. Nu o scrieți niciodată într-un fișier; JSON Schema o refuză. Nimic nu mai colectează entitățile eliminate, așa că valoarea de execuție le păstrează până la următoarea deschidere a documentului din fișierul său.

Ambele forme scriu fiecare setare blocată cu valoarea ei blocată (consultați [`lockSettings`](#settings)), câmpul `settings.ddlScripts` doar cât timp un script conține text, iar câmpul `groupId` al unui tabel doar cât timp nu este gol. Începând cu versiunea `4.2.0`, ambele scriu și câmpul `settings.nameViewMode` doar cât timp valoarea pe care o scriu nu este `'physical'`, câmpul `settings.columnOrder` cu șapte intrări acolo unde este posibil (consultați [Settings](#settings)), iar câmpul `nameDerived` al unui tabel doar cât timp este `true`.  
Forma de stocare scrie `doc.tableGroupIds` și `tableGroupEntities` doar cât timp există un grup de tabele, un câmp `logicalName` doar cât timp conține alt text decât spații albe, câmpul `domainId` al unei coloane doar cât timp numește un domeniu pe care fișierul îl scrie, iar fiecare dicționar doar cât timp conține un rând pe care fișierul îl scrie. Valoarea de execuție scrie câmpurile grupurilor de tabele cât timp documentul conține un grup sau unul eliminat, câmpurile `logicalName` și `domainId` cât timp nu sunt `''`, iar fiecare dicționar împreună cu lista sa cât timp oricare dintre ele conține o intrare, inclusiv un rând eliminat.

## TypeScript {#typescript}

Tipurile descriu valoarea de execuție. Un câmp marcat cu `// runtime only` este omis din forma de stocare, iar un câmp marcat cu `?` este scris doar cât timp conține ceva. Textele, listele și colecțiile goale pe care forma de stocare le omite începând cu versiunea `4.2.0` nu sunt marcate.

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

Fiecare entitate are un câmp `id`, un șir de caractere opac, care îi servește drept cheie în colecția sa, cu excepția celor trei dicționare, unde este prima valoare a unui rând. Începând cu versiunea `4.2.0`, când câmpul `id` al unei entități din cele șapte colecții cu chei lipsește, este gol sau nu este un șir de caractere, parsarea îl citește din cheia la care se află entitatea și renunță la o intrare care nu este un obiect sau la una fără ID a cărei cheie este `''`. Un rând de dicționar este eliminat când nu este un tablou sau când câmpul său `id` nu este un șir de caractere diferit de `''`. Un editor anterior versiunii `4.2.0` renunță la o entitate al cărei câmp `id` lipsește sau este gol, așa că forma de stocare scrie în continuare fiecare ID.  
Începând cu versiunea `4.0.0`, fiecare ID nou, inclusiv cel al unui rând de dicționar, este un UUIDv7 scris în forma Uuid25, adică 25 de cifre în baza 36, cu litere mici, de exemplu `03gzrxjv20bdlcak89q25d2m7`, astfel încât ID-urile generate de un editor se sortează în ordinea în care le-a creat. Un document păstrează ID-urile pe care le conține, de exemplu ID-urile nanoid ale unei versiuni anterioare sau ID-urile unui fișier v2, așa că nimic nu ar trebui să se bazeze pe forma unui ID.

Începând cu versiunea `4.0.0`, nicio entitate nu are un obiect `meta` (`createAt`, `updateAt`), iar tipurile `EntityMeta` și `EntityType` au fost eliminate. Nimic nu îl scrie, parsarea renunță la obiectul `meta` dintr-un fișier mai vechi, iar JSON Schema îl refuză. Acesta determina doar momentul colectării gunoiului pentru entitățile eliminate, care nu mai există nici ea.

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

Câmpurile `originX` și `originY` reprezintă vizualizarea: punctul de pe ecran în care ajunge punctul `(0, 0)` al scenei.  
Câmpul `zoomLevel` ia valori de la `0.1` la `1.5`. Un document salvat cu o valoare peste `1` se deschide la `1` într-un editor anterior versiunii `3.5.0`.  
Începând cu versiunea `4.0.0`, setările nu conțin câmpurile `width`, `height`, `scrollTop`, `scrollLeft`, `relationshipOptimization` sau `ignoreSaveSettings`. Nimic nu le scrie, parserul nu păstrează niciunul dintre ele, iar JSON Schema refuză un fișier care le mai conține.

Câmpul `canvasType` este fila pe care se deschide un document. Un document salvat pe fila Vizualizare conține `'@dineug/erd-editor/builtin-visualization'`, dar nu și dacă era afișat modul `Graph` sau `Flow`, iar un editor nou creat afișează această filă în modul `Graph`.  
Începând cu versiunea `4.0.0`, cât timp blocarea `Canvas Type` este activată, cum este într-un document nou, documentul păstrează fila afișată în momentul blocării, iar schimbarea filei lasă proprietatea `value` așa cum era. O blocare activată pe fila Setări reține fila din care a venit cititorul, iar o valoare blocată `'settings'`, pe care o poate scrie doar o editare manuală, se deschide pe `'ERD'`.  
Începând cu versiunea `4.2.0`, câmpul `canvasType` poate fi și `'@dineug/erd-editor/builtin-dictionary'`, adică fila [Dicționar](../../guide/guides/dictionary.md), pe care blocarea `Canvas Type` o reține la fel ca pe celelalte. Un editor anterior versiunii `4.2.0` păstrează această valoare, dar nu afișează nicio filă sub bara sa de instrumente până când cititorul alege una.  
Nimic din starea proprie a modului `Flow` nu este serializat: plasarea, zoomul, deplasarea, afișarea rândurilor și tabelele focalizate rămân în editor, iar, începând cu versiunea `4.2.0`, la fel rămân și vizualizările pe care le parcurg [`Previous table` și `Next table`](../../guide/guides/visualization.md#previous-table-and-next-table). Astfel, `originX`, `originY` și `zoomLevel` descriu întotdeauna pânza ERD.

Câmpurile `show` și `lockSettings` sunt măști de biți: combinați indicatorii cu OR.  
Câmpul `columnOrder` este un tablou care conține fiecare valoare `ColumnType` o singură dată, în ordinea afișării; începând cu versiunea `4.2.0`, un document îl poate scrie cu șapte dintre cele nouă, așa cum descrie mai jos paragraful despre ordinea coloanelor.  
Câmpurile `database`, `language`, `tableNameCase`, `columnNameCase` și `bracketType` conțin fiecare exact o valoare, iar JSON Schema respinge o valoare combinată.

Într-un document nou, câmpul `show` are valoarea `431`: `tableComment`, `columnComment`, `columnDataType`, `columnDefault`, `columnPrimaryKey`, `columnNotNull` și `relationship`.  
Începând cu versiunea `3.10.0`, câmpul `show` are încă doi indicatori, ambii dezactivați într-un document nou și în orice document salvat înainte de versiunea `3.10.0`.  
Indicatorul `columnAlternateKey` (`512`) este opțiunea de afișare [`Alternate Key`](../../guide/guides/table-related-functions.md#alternate-keys). Când este activat, marchează coloanele fiecărui index unic pe două sau mai multe coloane cu `AK1.1`, `AK1.2` și așa mai departe. Inițial este dezactivat, așa că nicio diagramă existentă nu își schimbă lățimea.  
Indicatorul `hideReferentialAction` (`1024`) funcționează invers: când este activat, ascunde [etichetele ON DELETE și ON UPDATE](../../guide/guides/relationship-editing.md#reading-a-connector) de pe conectori, așa că acestea sunt afișate implicit. Opțiunea de afișare `Referential Actions` este bifată cât timp indicatorul este dezactivat. Nu modifică dimensiunea niciunui tabel.  
Un editor anterior versiunii `3.10.0` păstrează câmpul `show` ca număr întreg, așa că ambii indicatori se păstrează și după o salvare acolo.

Începând cu versiunea `4.0.0`, câmpul `show` are încă doi indicatori, ambii dezactivați într-un document nou și în orice document salvat înainte de versiunea `4.0.0`. La fel ca `hideReferentialAction`, fiecare ascunde ceea ce numește, așa că grupurile de tabele și notele sunt afișate implicit.  
Indicatorul `hideTableGroup` (`2048`) ascunde [grupurile de tabele](../../guide/guides/table-groups.md), iar `hideMemo` (`4096`) ascunde toate notele. Acestea sunt [opțiunile de afișare](../../guide/guides/table-related-functions.md#table-view-options) `Table Groups` și `Memos`, fiecare bifată cât timp indicatorul corespunzător este dezactivat. Niciunul nu modifică dimensiunea vreunui tabel.  
Un editor anterior versiunii `4.0.0` păstrează câmpul `show` ca număr întreg, așa că ambii indicatori se păstrează și după o salvare acolo.

Începând cu versiunea `4.2.0`, câmpul `show` are încă un indicator, `columnDomain` (`8192`), dezactivat într-un document nou și în orice document salvat înainte de versiunea `4.2.0`, așa că valoarea `show` a unui document nou este în continuare `431`. Este [opțiunea de afișare](../../guide/guides/table-related-functions.md#table-view-options) `Domain`: când este activat, rândul fiecărei coloane afișează o [celulă Domeniu](../../guide/guides/logical-names.md#the-domain-cell), ceea ce lărgește tabelele. Inițial este dezactivat, așa că nicio diagramă existentă nu își schimbă lățimea.  
Un editor anterior versiunii `4.2.0` păstrează câmpul `show` ca număr întreg, așa că indicatorul se păstrează și după o salvare acolo.

Începând cu versiunea `4.2.0`, constanta `ColumnType` are nouă valori. Valoarea `columnLogicalName` (`128`) stabilește locul celulei numelui logic, pe care rândul unei coloane o desenează doar în modul `Both Names`, iar `columnDomain` (`256`) pe cel al celulei Domeniu. Acestea sunt rândurile `Logical Name` și `Domain` din [ordinea coloanelor](../../guide/guides/settings.md#adjusting-column-order) a filei Setări. Un editor păstrează o ordine cu toate cele nouă, iar cea a unui document nou este `128, 1, 2, 256, 4, 8, 16, 32, 64`.  
Ambele forme scriu ordinea cu șapte intrări, omițând `128` și `256`, cât timp `128` se află imediat înainte de `columnName`, iar `256` imediat după `columnDataType`. Astfel, un document nou scrie în continuare `1, 2, 4, 8, 16, 32, 64`, iar un fișier a cărui ordine nu le-a mutat niciodată își păstrează octeții. Altfel, scriu toate cele nouă.  
Parsarea inserează cele două în acele locuri ale unei ordini cu șapte intrări, indiferent de ordinea celor șapte, și preia așa cum sunt nouă intrări care conțin fiecare tip.  
Începând cu versiunea `5.0.0`, preia și orice altă ordine. Păstrează o singură dată fiecare `ColumnType` pe care îl cunoaște, în ordinea dată, și elimină orice altă intrare: o valoare pe care niciun `ColumnType` nu o numește, cum ar fi un tip adăugat de o versiune ulterioară, și a doua intrare a aceluiași tip. Fiecare tip care lipsește din ordine este pus imediat după cel mai apropiat tip dinaintea lui, în ordinea implicită, pe care îl conține ordinea, sau, dacă nu există niciunul înainte, imediat înaintea celui mai apropiat tip de după el, adică exact modul în care `128` și `256` își găsesc locul într-o ordine cu șapte intrări. Doar o ordine care nu numește niciun tip cunoscut, sau o valoare care nu este un tablou, se citește ca ordinea implicită.  
Astfel, un fișier salvat de o versiune ulterioară se deschide cu ordinea tipurilor pe care această versiune le cunoaște, iar o salvare aici scrie acea ordine fără celelalte. Înainte de `5.0.0`, parsarea citea orice altă ordine ca ordinea implicită, așa că un astfel de fișier se deschidea cu ordinea coloanelor resetată. JSON Schema acceptă șapte sau nouă numere întregi.

Începând cu versiunea `4.0.0`, constanta `Language` are încă opt ținte ale [generatorului de cod](../../guide/guides/code-generator.md), de la `Mermaid` până la `JSONSchema`. O valoare `language` pe care parserul nu o cunoaște este citită ca `GraphQL`, așa că un editor anterior versiunii `4.0.0` deschide pe GraphQL un document salvat cu una dintre ele, iar o salvare acolo scrie GraphQL.

Începând cu versiunea `4.0.0`, câmpul `lockSettings` ia locul câmpului `ignoreSaveSettings`, iar tipul `LockSettingType` pe cel al tipului `SaveSettingType`, care a fost eliminat. Câmpul `lockSettings` numește setările pe care un document le salvează așa cum erau în momentul blocării. Bitul `viewport` acoperă împreună `originX`, `originY` și `zoomLevel`, deoarece o origine salvată fără zoomul ei se deschide în alt loc, iar fiecare dintre ceilalți biți acoperă câmpul după care este numit. Acestea sunt rândurile [`Lock`](../../guide/guides/settings.md#lock) din fila Setări.  
O setare blocată este scrisă cu valoarea ei blocată, indiferent ce afișează editorul, atât de `value`, cât și de `runtimeValue`, iar orice altă setare este scrisă așa cum este. Astfel, cât timp blocarea corespunzătoare este activată, derularea și zoomul, schimbarea filei, modificarea limbajului generatorului de cod, a unui stil de denumire ori a tipului de delimitator sau schimbarea modului de afișare a numelor lasă fișierul așa cum era. Blocarea preia valoarea pe care o are setarea în acel moment, iar parsarea preia valoarea blocată din câmpul salvat.  
Un document pornit de la zero – un editor sau un store de replicare nou, ori o valoare goală transmisă proprietății `value` sau metodei `setInitialValue()` – are câmpul `lockSettings` egal cu `63`, adică toate blocările activate. Un document al cărui obiect `settings` nu conține câmpul `lockSettings` – orice fișier salvat înainte de versiunea `4.0.0`, indiferent de valoarea `ignoreSaveSettings`, și orice document v2 – se deschide de asemenea cu toate blocările activate: vizualizarea și fila sunt cele ale unui document nou (`originX` și `originY` la `0`, `zoomLevel` la `1`, fila ERD), iar limbajul, stilurile de denumire și tipul de delimitator sunt blocate la valorile salvate. Un document care își numește blocările le păstrează, inclusiv `0`, precum și fiecare valoare pe care a salvat-o.  
Parsarea păstrează fiecare bit din `lockSettings`, inclusiv pe cei necunoscuți, așa că o blocare adăugată de o versiune ulterioară se păstrează după o salvare aici; JSON Schema verifică doar că este un număr întreg. Un editor anterior versiunii `4.0.0` renunță la `lockSettings` când salvează și scrie vizualizarea și fila așa cum sunt, astfel că fișierul se deschide din nou aici ca unul salvat înainte de versiunea `4.0.0`.

Începând cu versiunea `4.2.0`, există o a șaptea blocare, `unlockNameViewMode` (`64`), rândul `Name View`, care acoperă câmpul `nameViewMode`. Bitul ei se citește invers față de ceilalți biți de blocare, la fel ca biții de ascundere din `Show`: setat, modul de afișare a numelor este deblocat, iar nesetat, blocat. Astfel, `63` înseamnă în continuare toate blocările activate, iar un document nou conține această valoare, cu modul de afișare blocat la `'physical'`. Un fișier salvat înainte de versiunea `4.2.0` are bitul nesetat, indiferent de celelalte blocări ale sale, inclusiv când valoarea este `0`, așa că se deschide cu modul de afișare blocat la `'physical'`. Un document cu toate blocările dezactivate conține `64`, iar unul cu toate celelalte blocări activate și modul de afișare deblocat conține `127`. Testați această blocare invers: este activată cât timp `(lockSettings & 64) === 0`.  
Cât timp este activată, o schimbare a modului de afișare a numelor modifică doar ecranul editorului care a făcut-o, iar documentul păstrează modul blocat. Cât timp este dezactivată, o schimbare făcută într-un editor care poate edita aparține documentului, iar toți colaboratorii își schimbă modul odată cu ea. Schimbarea făcută într-un editor doar în citire modifică în ambele cazuri doar propriul ecran. Consultați [`Lock`](../../guide/guides/settings.md#lock).  
Un editor cu versiunea `4.0.0` sau `4.1.0` păstrează bitul la salvare, dar renunță la `nameViewMode`, așa că documentul se redeschide aici în `'physical'`, cu blocarea așa cum era.

Începând cu versiunea `4.0.0`, câmpul `ddlScripts` conține cele două scripturi ale filei [Schemă SQL](../../guide/guides/schema-sql.md), pe care le scrie codul DDL pentru fiecare bază de date: `before` după antet și înaintea tabelelor, `after` după codul DDL generat. Codul DDL le scrie pe fiecare cu sfârșituri de linie LF, fără liniile goale de la început și fără spațiile albe de la final, iar pentru MSSQL le încheie cu `GO`, așa cum se descrie în [Scripturi înainte și după tabele](../../guide/guides/schema-sql.md#before-and-after-scripts); câmpul `ddlScripts` însuși păstrează fiecare script așa cum a fost tastat. Cheia este scrisă doar cât timp unul dintre scripturi conține text, și atunci cu ambele; o cheie lipsă sau un script care nu este un șir de caractere este citit ca `''`. Opțiunile `Statements`, `Header` și `Tables` ale filei, precum și, începând cu versiunea `4.2.0`, comutatorul ei [`Write logical names into empty comments`](../../guide/guides/schema-sql.md#logical-names-as-comments) nu se salvează în document.  
Un editor anterior versiunii `4.0.0` renunță la scripturi când încarcă un document, așa că o salvare acolo le pierde.

Începând cu versiunea `4.2.0`, câmpul `nameViewMode` este [modul de afișare a numelor](../../guide/guides/logical-names.md#name-view), adică numele pe care le desenează diagrama: `'physical'` numele fiecărui tabel și al fiecărei coloane, `'logical'` numele logic în locul numelui, iar `'both'` numele logic și numele. Meniurile le numesc `Physical Names`, `Logical Names` și `Both Names`. Ambele forme îl scriu ultimul, după `ddlScripts`, și doar cât timp valoarea pe care o scriu nu este `'physical'`; cât timp blocarea `Name View` este activată, aceasta este valoarea blocată, indiferent ce afișează ecranul. O valoare lipsă sau una pe care parserul nu o cunoaște este citită ca `'physical'`, iar JSON Schema acceptă doar `"logical"` și `"both"`.  
Un editor anterior versiunii `4.2.0` renunță la `nameViewMode` când încarcă un document.

Constantele `Database`, `Language`, `Show`, `ColumnType`, `ColumnOption`, `LockSettingType` și `ReferentialAction` se extind doar prin adăugare la final. Un document salvat stochează numărul, așa că un nou sistem de baze de date, o nouă țintă de generare de cod, un nou indicator, un nou tip de coloană, o nouă opțiune de coloană, o nouă blocare sau o nouă acțiune primește bitul următor, nu o poziție la mijloc.

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

Fiecare dintre primele cinci liste este ordinea unui tip de entitate, pe care o citesc codul DDL, sortarea tabelelor și ordinea de desenare. În forma de stocare, fiecare listă conține doar ID-urile entităților păstrate, fiecare o singură dată, în ordinea listată, iar, începând cu versiunea `4.2.0`, o listă care nu conține niciunul este omisă. Începând cu versiunea `4.0.0`, lista `tableGroupIds` este ordinea grupurilor de tabele.

Începând cu versiunea `4.2.0`, listele `wordIds`, `termIds` și `domainIds` enumeră rândurile existente ale fiecărui dicționar: un rând pe care colecția sa îl conține, dar lista sa nu, este eliminat. Ele nu sunt ordinea unei foi, pe care o dă câmpul `order` al fiecărui rând. Doar valoarea de execuție le scrie, pe fiecare cât timp ea sau colecția sa conține o intrare. Rândurile unui fișier sunt ele însele apartenența și ordinea, iar JSON Schema refuză listele.  
Începând cu versiunea `4.2.0`, parsarea citește o listă pe care documentul o omite sau o conține sub altă formă decât un tablou ca fiind toate intrările pe care le conține colecția sa, fiecare ID o singură dată, în ordinea în care sunt păstrate; un tablou gol rămâne gol, iar fiecare intrare a colecției sale este atunci citită ca eliminată. Un editor anterior versiunii `4.2.0` citește o listă lipsă ca goală, așa că forma de stocare scrie în continuare fiecare listă ori de câte ori colecția sa conține o entitate.

Începând cu versiunea `4.0.0`, ordinea de suprapunere nu se salvează. Parsarea așază în stivă fiecare tabel, notă și grup de tabele listat care nu are câmpul `zIndex` după poziția sa în listă, cele care urmează fiind în față: grupurile de tabele de la `1`, tabelele de la `2`, iar notele deasupra tuturor tabelelor. O entitate care are câmpul `zIndex`, ca într-o valoare de execuție sau într-un fișier salvat înainte de versiunea `4.0.0`, îl păstrează. Prin urmare, aducerea unui tabel sau a unei note în prim-plan se pierde la redeschiderea fișierului.

### Colecție: tableEntities {#collection-tableentities}

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

Începând cu versiunea `4.0.0`, un tabel are câmpul `groupId`, ID-ul [grupului de tabele](../../guide/guides/table-groups.md) căruia îi aparține. Un câmp `groupId` lipsă sau gol, ori unul care nu numește niciun grup din `doc.tableGroupIds`, înseamnă că tabelul nu are grup, iar forma de stocare îl scrie doar cât timp numește un grup păstrat.  
Parsarea inițializează `seqColumnIds` cu `columnIds` când acesta lipsește sau nu conține un ID listat, iar un editor măsoară din nou `widthName`, `widthLogicalName` și `widthComment` cu propriile fonturi la fiecare încărcare.

Începând cu versiunea `4.2.0`, un tabel are câmpul `logicalName`, numele pe care îl desenează [modurile de afișare](../../guide/guides/logical-names.md#name-view) `Logical Names` și `Both Names`, `''` dacă nu există, și câmpul `nameDerived`, `true` cât timp dicționarele au [derivat](../../guide/guides/dictionary.md#deriving-physical-names) câmpul `name` din numele logic. Cât timp este setat, un nou nume logic derivă din nou numele; cât timp nu este, numele este unul personalizat, iar un nou nume logic nu îl modifică, decât dacă numele este gol sau format doar din spații albe. O redenumire manuală îl dezactivează, iar comanda [`Derive Physical Names Again`](../../guide/guides/dictionary.md#derive-physical-names-again) rescrie chiar și un nume scris de cineva și îl activează oriunde există un nume logic.  
Forma de stocare scrie `logicalName` după `name`, așa cum a fost tastat, doar cât timp conține alt text decât spații albe, iar `nameDerived` după `groupId` doar cât timp este `true`, singura valoare pe care o acceptă JSON Schema. Un câmp `logicalName` lipsă este citit ca `''`, iar un câmp `nameDerived` lipsă ca `false`, așa că fiecare nume dintr-un fișier salvat înainte de versiunea `4.2.0` este considerat personalizat.  
Un editor anterior versiunii `4.2.0` renunță la ambele când încarcă un document, așa că o salvare acolo pierde numele logic al fiecărui tabel.

### Colecție: tableColumnEntities {#collection-tablecolumnentities}

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

Începând cu versiunea `4.0.0`, forma de stocare nu scrie câmpul `ui` al coloanelor. Fiecare încărcare deduce câmpul `keys` – marcajul de cheie primară din bitul `primaryKey` al câmpului `options`, iar marcajul de cheie străină din relațiile care se termină pe coloană – și măsoară cele șase lățimi.  
Un editor anterior versiunii `4.0.0` afișează coloanele unui fișier salvat aici fără pictogramele de cheie primară.

Începând cu versiunea `4.2.0`, o coloană are câmpul `logicalName`, la fel ca un tabel, și câmpul `domainId`, ID-ul domeniului de care este legată, `''` dacă nu există. Editările făcute într-un editor mențin o coloană legată la tipul de date al domeniului ei, așa cum se descrie în [Domenii și tipuri de date](../../guide/guides/dictionary.md#domains-and-data-types). Totuși, parsarea nu schimbă tipul niciunei coloane, așa că un fișier scris în altă parte poate lăsa o coloană legată la alt tip, la fel cum pot face și editările încrucișate a doi colaboratori; foaia Verificări listează fiecare astfel de caz ca [`Domain type mismatch`](../../guide/guides/dictionary.md#what-each-check-finds). Parsarea golește un câmp `domainId` care nu numește niciun domeniu conținut de document. Un domeniu eliminat contează în continuare, așa că editorul păstrează o legătură cu el cât timp o anulare poate readuce domeniul. După `options`, forma de stocare scrie `logicalName` după regula de la tabel, iar `domainId` doar cât timp numește un domeniu pe care fișierul îl scrie, deci niciodată o legătură cu un domeniu eliminat.  
Bitul `ColumnOption.nameDerived` (`16`) este indicatorul de nume derivat al coloanei, păstrat în `options` împreună cu ceilalți biți, cu aceeași semnificație ca și câmpul `nameDerived` al unui tabel. De exemplu, o cheie primară non-NULL al cărei nume l-au derivat dicționarele are `options` egal cu `26`.  
Un editor anterior versiunii `4.2.0` renunță la `logicalName` și `domainId` când încarcă un document, așa că o salvare acolo le pierde. Păstrează câmpul `options` ca număr întreg, așa că bitul `nameDerived` se păstrează și după o salvare acolo.

### Colecție: relationshipEntities {#collection-relationshipentities}

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

Începând cu versiunea `3.10.0`, o relație are câmpurile `onDelete` și `onUpdate`, [acțiunile sale ON DELETE și ON UPDATE](../../guide/guides/relationship-editing.md#on-delete-and-on-update). Fiecare conține exact o valoare `ReferentialAction`. Valoarea `none`, cea implicită, nu scrie nicio clauză, așa că se aplică valoarea implicită a bazei de date. Celelalte cinci corespund acțiunilor `NO ACTION`, `CASCADE`, `SET NULL`, `SET DEFAULT` și `RESTRICT`. Fila Schemă SQL scrie o clauză doar pentru o bază de date care acceptă acțiunea respectivă.  
Forma de stocare le scrie întotdeauna pe amândouă, iar, începând cu versiunea `4.0.0`, JSON Schema le cere, verificând doar că fiecare este un număr întreg. Parsarea citește în continuare un câmp lipsă, ca în orice document salvat înainte de versiunea `3.10.0`, ca `none`, la fel și o valoare din afara listei.  
Un editor anterior versiunii `3.10.0` nu cunoaște aceste câmpuri și renunță la ele când încarcă un document, așa că o salvare acolo pierde toate acțiunile.

Începând cu versiunea `4.0.0`, fiecare încărcare deduce ceea ce omite forma de stocare. O relație este identificatoare când fiecare coloană pe care se termină este o cheie primară, iar câmpul ei `startRelationshipType` este `dash` când fiecare astfel de coloană este NOT NULL și `ring` în caz contrar; o relație căreia nu i-a mai rămas nicio coloană de capăt este neidentificatoare și `dash`, așa cum pornește o relație nouă. Ancorele, `x`, `y` și `direction`, sunt plasate din nou.

### Colecție: indexEntities {#collection-indexentities}

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

Parsarea inițializează `seqIndexColumnIds` cu `indexColumnIds` când acesta lipsește sau nu conține un ID listat.

### Colecție: indexColumnEntities {#collection-indexcolumnentities}

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

### Colecție: memoEntities {#collection-memoentities}

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

Începând cu versiunea `4.0.0`, tabelele și notele [împart aceeași stivă](../../guide/guides/table-related-functions.md#moving-multiple-tables), ordonată după `zIndex`, așa că aducerea unui tabel în prim-plan îl poate plasa peste o notă. Parsarea plasează o notă salvată fără `zIndex` deasupra tuturor tabelelor, așa cum se descrie în [Doc](#doc). O notă dintr-un fișier salvat înainte de versiunea `4.0.0` își păstrează valoarea `zIndex` salvată, care provenea din același contor ca valorile tabelelor, așa că o notă pe care o versiune anterioară a desenat-o peste toate tabelele se poate deschide sub un tabel adus în prim-plan după ea.

### Colecție: tableGroupEntities {#collection-tablegroupentities}

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

Începând cu versiunea `4.0.0`, un document poate conține [grupuri de tabele](../../guide/guides/table-groups.md): dreptunghiuri denumite și colorate, desenate în spatele tabelelor. Un tabel intră într-un grup prin propriul câmp `groupId`, așa că un grup nu conține o listă de membri. Forma de stocare scrie colecția, la fel ca `doc.tableGroupIds`, doar cât timp există un grup, iar un document fără ea, de exemplu unul salvat înainte de versiunea `4.0.0`, nu are grupuri. Indicatorul `Show.hideTableGroup` le ascunde.  
Un editor anterior versiunii `4.0.0` renunță la grupuri și la câmpul `groupId` al fiecărui tabel când încarcă un document, așa că o salvare acolo pierde toate grupurile.

### Rândurile dicționarelor {#dictionary-rows}

Începând cu versiunea `4.2.0`, un document conține trei dicționare, foile `Words`, `Terms` și `Domains` ale filei [Dicționar](../../guide/guides/dictionary.md), în `wordEntities`, `termEntities` și `domainEntities`. Fiecare câmp al unui cuvânt, termen sau domeniu este un șir de caractere și niciunul nu are câmp `ui`. Foaia `Checks` este calculată din dicționare și din diagramă și nu se salvează.

```ts
type DictionaryRows = {
  fields: string[];
  rows: string[][];
};
```

Niciunul dintre cele trei nu are ID-uri drept chei. Fiecare este scris ca un antet și rânduri: `fields` numește o singură dată câmpurile entității, mai întâi ID-ul, iar fiecare rând conține valorile unei entități în această ordine. Tipurile de mai jos listează câmpurile fiecărei entități în ordinea antetului din valoarea de execuție. Un rând își păstrează întotdeauna ID-ul și numele, dar valorile goale de la final, de după nume, sunt omise, așa că o valoare goală aflată înaintea uneia păstrate rămâne `''`, iar parsarea citește ca `''` o valoare care lipsește dintr-un rând. Ambele forme scriu fiecare rând pe o linie separată, ca JSON compact, ca în aceste două cuvinte dintr-un fișier:

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

Forma de stocare scrie rândurile listate în ordinea foii și omite `order`, așa că antetele ei nu îl numesc. Omite un rând ale cărui valori de după ID sunt toate goale sau formate doar din spații albe, de exemplu unul adăugat și niciodată completat sau unul golit, precum și orice legătură cu un astfel de domeniu sau cu unul eliminat: câmpul `domainId` al unei coloane este omis, iar cel al unui termen este scris `''`, termenul însuși fiind omis dacă nu conține nimic altceva.  
Antetele valorii de execuție numesc `"order"` imediat după `"name"`. Aceasta scrie fiecare rând pe care îl conține colecția sa, inclusiv pe cele eliminate, în ordinea în care le conține colecția, așa că, pentru ordinea unei foi, sortați după `order`, comparat în ordinea unităților de cod. Parsarea dă rândurilor unui fișier chei `order` în ordinea în care se află rândurile, așa că acestea sunt citite înapoi în ordinea în care le-a scris fișierul.  
Un document care nu conține dicționarele, de exemplu unul salvat înainte de versiunea `4.2.0`, nu are niciunul. Un editor anterior versiunii `4.2.0` renunță la toate trei când încarcă un document, așa că o salvare acolo pierde toate cuvintele, termenii și domeniile.

### Colecție: wordEntities {#collection-wordentities}

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

Un cuvânt este unul dintre cuvintele din care se compune un nume logic, iar `abbreviation` este ceea ce îl reprezintă într-un nume fizic. Câmpul `synonyms` listează alte forme de scriere ale cuvântului, iar `forbiddenWords` cuvintele care nu trebuie folosite în locul lui, fiecare listă fiind separată prin virgule.

### Colecție: termEntities {#collection-termentities}

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

Un termen este un nume logic întreg. Un tabel sau o coloană al cărui câmp `logicalName` se potrivește cu `name` derivă `physicalName` sau, cât timp acesta este gol, un nume compus din abrevierile cuvintelor, iar o coloană preia și domeniul pe care îl numește `domainId`, `''` dacă nu există (consultați [Derivarea numelor fizice](../../guide/guides/dictionary.md#deriving-physical-names)). Câmpul `synonyms` este separat prin virgule. Parsarea golește un câmp `domainId` care nu numește niciun domeniu, la fel ca la o coloană.

### Colecție: domainEntities {#collection-domainentities}

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

Un domeniu este un tip de date cu nume, pe care `dataType` îl conține la fel ca la o coloană, inclusiv lungimea, de exemplu `NUMERIC(10)`. O coloană sau un termen se leagă de un domeniu prin ID-ul acestuia, iar editorul dă fiecărei coloane legate tipul de date al domeniului (consultați [Domenii și tipuri de date](../../guide/guides/dictionary.md#domains-and-data-types)).

## JSON Schema {#json-schema}

Fișierul de schemă canonic este publicat la [json-schema/schema.json](https://raw.githubusercontent.com/dineug/erd-editor/main/json-schema/schema.json) și poate fi referențiat direct prin câmpul `$schema`.

```json
{
  "$schema": "https://raw.githubusercontent.com/dineug/erd-editor/main/json-schema/schema.json",
  "version": "3.0.0"
}
```

Puneți câmpul `$schema` la începutul unui fișier `.erd.json`, iar editoarele care înțeleg JSON Schema, de exemplu VS Code, validează documentul și completează automat câmpurile pe măsură ce editați.

Începând cu versiunea `4.0.0`, schema descrie doar forma de stocare. Fiecare obiect cu câmpuri denumite este închis (`additionalProperties: false`), fiecare câmp pe care forma de stocare îl scrie întotdeauna este obligatoriu, un câmp pe care îl omite cât timp nu conține nimic este numit, dar nu este obligatoriu, iar niciun câmp pe care îl omite întotdeauna nu este numit. Prin urmare, refuză valoarea de execuție. Refuză și un fișier salvat înainte de versiunea `4.0.0`, cu câmpul său `meta`, lățimile, `zIndex`, `ignoreSaveSettings` și celelalte, până când un editor cu versiunea `4.0.0` sau o versiune ulterioară salvează din nou acel fișier. Un fișier salvat de versiunea `3.2.0` sau de o versiune ulterioară numește deja URL-ul acestei scheme, care indică ramura `main`, așa că un editor care validează pe baza ei semnalează acum fișierul. Un fișier salvat de versiunea `3.0.0` sau `3.1.0`, ori un document v2, nu conține niciun câmp `$schema`.

Începând cu versiunea `4.2.0`, schema nu mai cere câmpurile de text ale unei entități, nicio listă `doc`, nicio colecție și nici obiectul `collections` însuși, pe care forma de stocare le omite cât timp nu conțin nimic. Acceptă în continuare un fișier salvat de versiunea `4.0.0` sau `4.1.0`. Numește noile câmpuri: `nameViewMode`, care acceptă doar `"logical"` și `"both"`; câmpurile `logicalName` și `nameDerived` ale unui tabel, acesta din urmă acceptând doar `true`; câmpurile `logicalName` și `domainId` ale unei coloane; precum și cele trei dicționare, fiecare cu antetul său și rânduri de șiruri de caractere. Câmpul `canvasType` listează fila Dicționar, `columnOrder` acceptă șapte sau nouă numere întregi, iar descrierile `show`, `columnOrder`, `lockSettings` și `options` numesc noii biți.

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
