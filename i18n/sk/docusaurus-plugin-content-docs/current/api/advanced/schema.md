---
sidebar_position: 3
description: Formát dokumentu .erd.json – úložná forma, ktorú obsahuje súbor, a hodnota za behu, ktorú drží editor, typy TypeScript, konštanty za každým číselným poľom a zverejnená JSON Schema.
---

# Schéma

`.erd.json` je formát dokumentov editora. Túto stránku si prečítajte, ak potrebujete dokument generovať, overovať alebo migrovať mimo editora.

Od verzie `4.0.0` má dokument dve serializácie, obe s hodnotou `'3.0.0'` v poli `version`. Úložná forma je to, čo obsahuje súbor: vracia ju [`editor.value`](../erd-editor-element.md#value), zapisuje ju export JSON a je jedinou formou, ktorú prijíma zverejnená [JSON Schema](#json-schema). Hodnota za behu je celý dokument tak, ako ho drží editor, a vracia ju [`editor.runtimeValue`](../erd-editor-element.md#runtimevalue). Metóda `setInitialValue()`, setter `value` a metóda `setSchemaJSON()` načítajú obe formy, akýkoľvek súbor uložený staršou verziou a dokument `.vuerd` vo formáte v2. Pred verziou `4.0.0` existovala iba jedna: vlastnosť `value` vracala celý dokument tak, ako ho držal editor, rovnako ako teraz vlastnosť `runtimeValue`.

## Úložná forma a hodnota za behu {#storage-form-and-runtime-value}

Úložná forma obsahuje iba aktuálne entity: každú tabuľku uvedenú v `doc.tableIds`, stĺpce, ktoré tieto tabuľky uvádzajú, vzťahy medzi dvoma zachovanými tabuľkami, indexy zachovaných tabuliek so stĺpcami indexu, ktorých stĺpec tabuľka stále uvádza, uvedené poznámky a skupiny tabuliek a od verzie `4.2.0` uvedené slová, termíny a domény, ktoré okrem svojho identifikátora obsahujú aj nejakú hodnotu. Vynecháva to, čo editor odvodí pri načítaní alebo drží, kým je otvorený: odstránené entity, polia `seqColumnIds` a `seqIndexColumnIds`, všetky polia `zIndex`, namerané šírky, pole `ui` stĺpca, `identification`, `startRelationshipType` a body ukotvenia vzťahu a od verzie `4.2.0` pole `order` každého riadka slovníka a zoznamy `doc.wordIds`, `doc.termIds` a `doc.domainIds`. Nižšie uvedené typy označujú každé z týchto polí ako `// runtime only`.  
Každá kolekcia okrem slovníkov má ako kľúče identifikátory zoradené v poradí kódových jednotiek, pričom stĺpce sú najprv zoskupené podľa `tableId` a stĺpce indexov podľa `indexId`. Od verzie `4.2.0` nasledujú kolekcie `wordEntities`, `termEntities` a `domainEntities` v tomto poradí za všetkými ostatnými kolekciami a každá sa zapisuje ako hlavička a riadky, jeden riadok na riadku textu (pozrite si časť [Riadky slovníkov](#dictionary-rows)). Každá entita zapisuje svoje polia v pevnom poradí a text je odsadený dvoma medzerami a končí znakom nového riadka. Rovnaký dokument sa preto vždy zapíše do rovnakých bajtov, úprava zmení iba to, čoho sa týka, a súbor uložený na počítači s inými písmami sa znova otvorí s rovnakou hodnotou `value`.  
VS Code, Obsidian a doplnok pre JetBrains zapisujú súbor iba vtedy, keď úprava zmení hodnotu `value`, takže súbor uložený staršou verziou si zachová svoju starú formu až do prvej úpravy.

Od verzie `4.2.0` úložná forma vynecháva aj to, čo nič neobsahuje: každé textové pole, ktoré entita alebo jej pole `ui` obsahuje ako `''` (pri tabuľke `name`, `comment` a `ui.color`, pri stĺpci `name`, `comment`, `dataType` a `default`, pri indexe `name`, pri poznámke `value` a `ui.color`, pri skupine tabuliek `name` a `color`), každý zoznam v objekte `doc` a každú kolekciu bez jedinej položky, ako aj samotné pole `collections`, keď sú všetky kolekcie prázdne. Text zložený iba z medzier sa zapíše tak, ako je, okrem logického názvu, ktorý sa vtedy vynechá, a okrem slova, termínu alebo domény, ktorých hodnoty okrem identifikátora sú všetky prázdne alebo zložené iba z medzier a ktoré sa vynechajú celé. Každý identifikátor, každý zoznam vnútri entity a každé číslo vrátane `0` sa naďalej zapisuje. Objekt `doc` sa zapisuje vždy, takže súbor nového dokumentu obsahuje `$schema`, `version`, jeho nastavenia a `"doc": {}`.  
Pri parsovaní sa chýbajúce textové pole načíta ako `''` a chýbajúca kolekcia ako prázdna, ako to robí každá verzia pracujúca s formátom v3, a úložná forma vynechá zoznam v objekte `doc` iba vtedy, keď jeho kolekcia nič neobsahuje (pozrite si časť [Doc](#doc)). Editor starší ako verzia `4.2.0` preto otvorí aj tieto súbory a program, ktorý súbor číta sám, musí chýbajúce údaje čítať rovnako. Súbor uložený staršou verziou sa pri najbližšom uložení zapíše s vynechanými prázdnymi textami, zoznamami a kolekciami, čo je jednorazová zmena, a odvtedy sa ukladá bajt po bajte rovnako.

Hodnota za behu zachováva to, čo úložná forma vynecháva: odstránené entity, sekvencie, z-indexy, šírky, značky kľúčov, príznaky vzťahov a body ukotvenia, prázdne textové polia a štyri zoznamy `tableIds`, `relationshipIds`, `indexIds` a `memoIds` a šesť kolekcií od `tableEntities` po `memoEntities`, aj keď sú prázdne. Od verzie `4.2.0` zachováva aj odstránené slová, termíny a domény, riadky, ktoré nič neobsahujú, pole `order` každého riadka, tri zoznamy slovníkov, logický názov zložený iba z medzier a prepojenie s odstránenou doménou. Je odsadená dvoma medzerami a nekončí znakom nového riadka. Používajte ju iba na inicializáciu spolupracovníka alebo druhého zobrazenia pomocou metódy `setInitialValue()`, aby vrátenie späť odstránenia, ktoré pošle iný editor, tam obnovilo celú entitu. Nikdy ju nezapisujte do súboru; JSON Schema ju odmietne. Na odstránené entity sa už nevzťahuje zber nepotrebných údajov (garbage collection), takže hodnota za behu ich zachováva, kým sa dokument nabudúce neotvorí zo svojho súboru.

Obe formy zapisujú každé zamknuté nastavenie s jeho zamknutou hodnotou (pozrite si pole [`lockSettings`](#settings)), pole `settings.ddlScripts` iba vtedy, keď niektorý skript obsahuje text, a pole `groupId` tabuľky iba vtedy, keď nie je prázdne. Od verzie `4.2.0` obe zapisujú aj pole `settings.nameViewMode` iba vtedy, keď hodnota, ktorú zapisujú, nie je `'physical'`, pole `settings.columnOrder` so siedmimi položkami tam, kde je to možné (pozrite si časť [Settings](#settings)), a pole `nameDerived` tabuľky iba vtedy, keď má hodnotu `true`.  
Úložná forma zapisuje `doc.tableGroupIds` a `tableGroupEntities` iba vtedy, keď existuje skupina tabuliek, pole `logicalName` iba vtedy, keď obsahuje iný text ako medzery, pole `domainId` stĺpca iba vtedy, keď označuje doménu, ktorú súbor zapisuje, a každý slovník iba vtedy, keď obsahuje riadok, ktorý súbor zapisuje. Hodnota za behu zapisuje polia skupín tabuliek, kým dokument obsahuje skupinu alebo odstránenú skupinu, polia `logicalName` a `domainId`, kým nie sú `''`, a každý slovník s jeho zoznamom, kým niektorý z nich obsahuje položku, a to aj odstránený riadok.

## TypeScript {#typescript}

Typy opisujú hodnotu za behu. Pole označené `// runtime only` sa v úložnej forme vynecháva a pole označené `?` sa zapisuje iba vtedy, keď niečo obsahuje. Prázdne texty, zoznamy a kolekcie, ktoré úložná forma od verzie `4.2.0` vynecháva, označené nie sú.

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

Každá entita má `id`, nepriehľadný reťazec, ktorý je jej kľúčom v kolekcii, okrem troch slovníkov, kde je prvou hodnotou riadka. Od verzie `4.2.0` sa pri parsovaní entita siedmich kolekcií s kľúčmi, ktorej `id` chýba, je prázdne alebo nie je reťazcom, prečíta podľa kľúča, pod ktorým je uložená, a zahodí sa položka, ktorá nie je objektom, alebo položka bez identifikátora, ktorej kľúč je `''`. Riadok slovníka sa zahodí, keď nie je pole alebo keď jeho `id` nie je reťazec odlišný od `''`. Editor starší ako verzia `4.2.0` zahodí entitu, ktorej `id` chýba alebo je prázdne, preto úložná forma naďalej zapisuje každý identifikátor.  
Od verzie `4.0.0` je každý nový identifikátor, vrátane identifikátora riadka slovníka, UUIDv7 zapísaný vo forme Uuid25, ako 25 číslic v sústave so základom 36 písaných malými písmenami, napríklad `03gzrxjv20bdlcak89q25d2m7`, takže identifikátory, ktoré vytvorí jeden editor, sa zoradia v poradí, v akom ich vytvoril. Dokument si ponechá identifikátory, ktoré obsahuje, napríklad identifikátory nanoid staršej verzie alebo identifikátory súboru vo formáte v2, takže nič by sa nemalo spoliehať na tvar identifikátora.

Od verzie `4.0.0` nemá žiadna entita objekt `meta` (`createAt`, `updateAt`) a typy `EntityMeta` a `EntityType` boli odstránené. Nič ho nezapisuje, pri parsovaní sa objekt `meta` zo staršieho súboru zahodí a JSON Schema ho odmietne. Slúžil iba na časovanie zberu nepotrebných údajov (garbage collection) pri odstránených entitách, ktorý takisto zanikol.

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

`originX` a `originY` predstavujú zobrazenie: bod obrazovky, na ktorý pripadne bod scény `(0, 0)`.  
Hodnota `zoomLevel` je v rozsahu od `0.1` do `1.5`. Dokument uložený s hodnotou nad `1` sa v editore staršom ako verzia `3.5.0` otvorí s hodnotou `1`.  
Od verzie `4.0.0` nastavenia neobsahujú polia `width`, `height`, `scrollTop`, `scrollLeft`, `relationshipOptimization` ani `ignoreSaveSettings`. Nič ich nezapisuje, parser nezachová žiadne z nich a JSON Schema odmietne súbor, ktorý ich ešte obsahuje.

`canvasType` je karta, na ktorej sa dokument otvorí. Dokument uložený na karte Vizualizácia obsahuje `'@dineug/erd-editor/builtin-visualization'`, ale nie to, či bol zobrazený režim `Graph` alebo `Flow`, a novo vytvorený editor zobrazí túto kartu v režime `Graph`.  
Od verzie `4.0.0` si dokument, kým je zapnuté zamknutie `Canvas Type`, ako je to v novom dokumente, ponechá kartu, ktorá bola zobrazená v čase zamknutia, a prepínanie kariet ponechá hodnotu `value` bez zmeny. Zamknutie na karte Nastavenia zachová kartu, z ktorej ste na ňu prišli, a zamknutá hodnota `'settings'`, ktorú možno zapísať iba ručnou úpravou, sa otvorí ako `'ERD'`.  
Od verzie `4.2.0` môže mať `canvasType` aj hodnotu `'@dineug/erd-editor/builtin-dictionary'`, teda kartu [Slovník](../../guide/guides/dictionary.md), ktorú zamknutie `Canvas Type` uchováva rovnako ako ostatné. Editor starší ako verzia `4.2.0` túto hodnotu zachová, ale pod svojím panelom nástrojov nezobrazí žiadnu kartu, kým niektorú nevyberiete.  
Žiadny vlastný stav režimu `Flow` sa neserializuje: jeho rozmiestnenie, priblíženie, posúvanie, zobrazenie riadkov a zameranie na tabuľky zostávajú v editore a od verzie `4.2.0` aj zobrazenia, ktorými krokujú tlačidlá [`Previous table` a `Next table`](../../guide/guides/visualization.md#previous-table-and-next-table). Preto `originX`, `originY` a `zoomLevel` vždy opisujú plátno ERD.

`show` a `lockSettings` sú bitové masky – príznaky kombinujte operáciou OR.  
`columnOrder` je pole, ktoré obsahuje každú hodnotu `ColumnType` raz, v poradí zobrazenia; od verzie `4.2.0` ho dokument môže zapísať so siedmimi z deviatich hodnôt, ako opisuje odsek o poradí stĺpcov nižšie.  
Každé z polí `database`, `language`, `tableNameCase`, `columnNameCase` a `bracketType` obsahuje práve jednu hodnotu a JSON Schema kombinovanú hodnotu odmietne.

V novom dokumente má `show` hodnotu `431`: `tableComment`, `columnComment`, `columnDataType`, `columnDefault`, `columnPrimaryKey`, `columnNotNull` a `relationship`.  
Od verzie `3.10.0` existujú ďalšie dva príznaky `show`, oba vypnuté v novom dokumente aj v každom dokumente uloženom pred verziou `3.10.0`.  
`columnAlternateKey` (`512`) je možnosť zobrazenia [`Alternate Key`](../../guide/guides/table-related-functions.md#alternate-keys). Ak je príznak nastavený, stĺpce každého jedinečného indexu nad dvoma alebo viacerými stĺpcami sa označia ako `AK1.1`, `AK1.2` a tak ďalej. Na začiatku je vypnutý, takže šírka žiadneho existujúceho diagramu sa nezmení.  
`hideReferentialAction` (`1024`) funguje opačne: ak je príznak nastavený, skryje [popisy ON DELETE a ON UPDATE](../../guide/guides/relationship-editing.md#reading-a-connector) na spojniciach, takže predvolene sú zobrazené. Možnosť zobrazenia `Referential Actions` je začiarknutá, kým je príznak vypnutý. Nemení veľkosť žiadnej tabuľky.  
Editor starší ako verzia `3.10.0` uchováva `show` ako celé číslo, takže pri uložení v ňom sa oba príznaky zachovajú.

Od verzie `4.0.0` existujú ďalšie dva príznaky `show`, oba vypnuté v novom dokumente aj v každom dokumente uloženom pred verziou `4.0.0`. Podobne ako `hideReferentialAction` každý z nich skryje to, čo pomenúva, takže skupiny tabuliek a poznámky sú predvolene zobrazené.  
`hideTableGroup` (`2048`) skryje [skupiny tabuliek](../../guide/guides/table-groups.md) a `hideMemo` (`4096`) skryje všetky poznámky. Zodpovedajú [možnostiam zobrazenia](../../guide/guides/table-related-functions.md#table-view-options) `Table Groups` a `Memos`, z ktorých každá je začiarknutá, kým je jej príznak vypnutý. Ani jeden z nich nemení veľkosť žiadnej tabuľky.  
Editor starší ako verzia `4.0.0` uchováva `show` ako celé číslo, takže pri uložení v ňom sa oba príznaky zachovajú.

Od verzie `4.2.0` existuje ďalší príznak `show`, `columnDomain` (`8192`), vypnutý v novom dokumente aj v každom dokumente uloženom pred verziou `4.2.0`, takže `show` nového dokumentu má naďalej hodnotu `431`. Je to [možnosť zobrazenia](../../guide/guides/table-related-functions.md#table-view-options) `Domain`: ak je príznak nastavený, riadok každého stĺpca zobrazí [bunku domény](../../guide/guides/logical-names.md#the-domain-cell), čo tabuľky rozšíri. Na začiatku je vypnutý, takže šírka žiadneho existujúceho diagramu sa nezmení.  
Editor starší ako verzia `4.2.0` uchováva `show` ako celé číslo, takže pri uložení v ňom sa príznak zachová.

Od verzie `4.2.0` má `ColumnType` deväť hodnôt. `columnLogicalName` (`128`) určuje miesto bunky logického názvu, ktorú riadok stĺpca vykresľuje iba v zobrazení `Both Names`, a `columnDomain` (`256`) miesto bunky domény. Sú to riadky `Logical Name` a `Domain` v [poradí stĺpcov](../../guide/guides/settings.md#adjusting-column-order) na karte Nastavenia. Editor uchováva poradie všetkých deviatich a poradie nového dokumentu je `128, 1, 2, 256, 4, 8, 16, 32, 64`.  
Obe formy zapisujú poradie so siedmimi položkami a vynechávajú `128` a `256`, kým `128` stojí tesne pred `columnName` a `256` tesne za `columnDataType`. Nový dokument preto naďalej zapisuje `1, 2, 4, 8, 16, 32, 64` a súbor, v ktorého poradí sa tieto dve hodnoty nikdy nepresunuli, si zachová svoje bajty. Inak zapisujú všetkých deväť.  
Pri parsovaní sa tieto dve hodnoty vložia do poradia so siedmimi položkami na uvedené miesta bez ohľadu na to, v akom poradí je týchto sedem hodnôt, a deväť položiek, ktoré obsahujú každý typ, sa prevezme tak, ako sú.  
Od verzie `5.0.0` prijme aj akékoľvek iné poradie. Každý `ColumnType`, ktorý pozná, ponechá raz v danom poradí a každú inú položku zahodí: hodnotu, ktorú nepomenúva žiadny `ColumnType`, napríklad typ pridaný neskorším vydaním, aj druhú položku rovnakého typu. Každý typ, ktorý v poradí chýba, sa umiestni tesne za najbližší typ pred ním v predvolenom poradí, ktorý poradie obsahuje, alebo, ak taký nie je, tesne pred najbližší nasledujúci, čím nachádzajú svoje miesta `128` a `256` v siedmich položkách. Ako predvolené poradie sa načíta iba poradie, ktoré nepomenúva žiadny známy typ, alebo hodnota, ktorá nie je pole.  
Súbor uložený neskorším vydaním sa preto otvorí s poradím typov, ktoré toto vydanie pozná, a uloženie tu zapíše toto poradie bez ostatných. Pred verziou `5.0.0` parsovanie čítalo každé iné poradie ako predvolené, takže sa takýto súbor otvoril s vynulovaným poradím stĺpcov. JSON Schema prijme sedem alebo deväť celých čísel.

Od verzie `4.0.0` má konštanta `Language` osem ďalších cieľových jazykov pre [Generátor kódu](../../guide/guides/code-generator.md), od `Mermaid` po `JSONSchema`. Hodnota `language`, ktorú parser nepozná, sa načíta ako `GraphQL`, takže editor starší ako verzia `4.0.0` otvorí dokument, ktorý bol uložený s jedným z nich, s jazykom GraphQL a uložením v ňom sa zapíše GraphQL.

Od verzie `4.0.0` zaujíma pole `lockSettings` miesto poľa `ignoreSaveSettings` a konštanta `LockSettingType` miesto konštanty `SaveSettingType`, ktorá bola odstránená. Pole `lockSettings` určuje nastavenia, ktoré dokument ukladá v stave, v akom boli v čase zamknutia. Bit `viewport` pokrýva polia `originX`, `originY` a `zoomLevel` spoločne, pretože počiatok uložený bez svojho priblíženia sa otvorí inde, a každý ďalší bit pokrýva pole, podľa ktorého je pomenovaný. Zodpovedajú riadkom [`Lock`](../../guide/guides/settings.md#lock) na karte Nastavenia.  
Vlastnosti `value` aj `runtimeValue` zapisujú zamknuté nastavenie s jeho zamknutou hodnotou bez ohľadu na to, čo editor zobrazuje, a každé ďalšie nastavenie v jeho aktuálnom stave. Kým je teda zapnuté príslušné zamknutie, posúvanie a zmena priblíženia, prepínanie kariet, zmena jazyka na karte Generátor kódu, štýlu názvov či typu úvodzoviek alebo prepnutie Zobrazenia názvov ponechá súbor bez zmeny. Zamknutie prevezme hodnotu, ktorú má nastavenie v tej chvíli, a pri parsovaní sa zamknutá hodnota prevezme z uloženého poľa.  
Dokument začatý od nuly – nový editor alebo replikačné úložisko či prázdna hodnota zadaná do `value` alebo `setInitialValue()` – má pole `lockSettings` nastavené na `63`, čiže všetky zamknutia sú zapnuté. Dokument, ktorého `settings` neobsahujú `lockSettings` – každý súbor uložený pred verziou `4.0.0` bez ohľadu na jeho `ignoreSaveSettings` a každý dokument vo formáte v2 –, sa takisto otvorí so všetkými zamknutiami zapnutými: jeho zobrazenie a karta sú rovnaké ako v novom dokumente (`originX` a `originY` `0`, `zoomLevel` `1`, karta ERD) a jeho jazyk, štýly názvov a typ úvodzoviek sú zamknuté na uložených hodnotách. Dokument, ktorý svoje zamknutia uvádza, si ich zachová vrátane `0` a takisto všetky hodnoty, ktoré uložil.  
Pri parsovaní sa zachová každý bit poľa `lockSettings` vrátane neznámych, takže zamknutie, ktoré pridá novšia verzia, sa pri uložení v tejto verzii zachová; JSON Schema overuje iba to, či ide o celé číslo. Editor starší ako verzia `4.0.0` pri ukladaní pole `lockSettings` zahodí a zobrazenie a kartu zapíše v aktuálnom stave, takže súbor sa v tejto verzii znova otvorí ako súbor uložený pred verziou `4.0.0`.

Od verzie `4.2.0` existuje siedme zamknutie, `unlockNameViewMode` (`64`), riadok `Name View`, ktoré pokrýva `nameViewMode`. Jeho bit sa číta opačne ako ostatné bity zamknutí, podobne ako bity skrytia v `Show`: ak je nastavený, Zobrazenie názvov je odomknuté, a ak je vynulovaný, je zamknuté. Hodnota `63` preto naďalej znamená, že sú zapnuté všetky zamknutia, a nový dokument ju má so Zobrazením názvov zamknutým na `'physical'`. Súbor uložený pred verziou `4.2.0` má tento bit vynulovaný bez ohľadu na ostatné zamknutia, a to aj pri hodnote `0`, takže sa otvorí so Zobrazením názvov zamknutým na `'physical'`. Dokument so všetkými zamknutiami vypnutými má hodnotu `64` a dokument so všetkými ostatnými zamknutiami zapnutými a odomknutým Zobrazením názvov má hodnotu `127`. Toto zamknutie testujte obrátene: je zapnuté, kým platí `(lockSettings & 64) === 0`.  
Kým je zapnuté, prepnutie Zobrazenia názvov zmení iba obrazovku editora, ktorý ho urobil, a dokument si ponechá zamknuté zobrazenie. Kým je vypnuté, prepnutie v editore, ktorý môže upravovať, patrí dokumentu a každý spolupracovník sa prepne spolu s ním. Prepnutie v editore iba na čítanie v oboch prípadoch zmení iba jeho vlastnú obrazovku. Pozrite si časť [`Lock`](../../guide/guides/settings.md#lock).  
Editor verzie `4.0.0` alebo `4.1.0` pri uložení tento bit zachová, ale pole `nameViewMode` zahodí, takže sa dokument v tejto verzii znova otvorí so zobrazením `'physical'` a so zamknutím v pôvodnom stave.

Od verzie `4.0.0` obsahuje pole `ddlScripts` dva skripty z karty [Schéma SQL](../../guide/guides/schema-sql.md), ktoré DDL zapisuje pre každú databázu: `before` za hlavičku a pred tabuľky, `after` za vygenerovaný kód DDL. DDL zapíše každý z nich so zalomeniami riadkov LF, bez úvodných prázdnych riadkov a koncových prázdnych znakov a pri MSSQL ukončený príkazom `GO`, ako opisuje časť [Skripty pred tabuľkami a za nimi](../../guide/guides/schema-sql.md#before-and-after-scripts); samotné pole `ddlScripts` uchováva každý skript tak, ako bol zadaný. Kľúč sa zapisuje iba vtedy, keď niektorý zo skriptov obsahuje text, a vtedy s oboma; chýbajúci kľúč alebo skript, ktorý nie je reťazcom, sa načíta ako `''`. Voľby `Statements`, `Header` a `Tables` na tejto karte a od verzie `4.2.0` aj jej prepínač [`Write logical names into empty comments`](../../guide/guides/schema-sql.md#logical-names-as-comments) sa v dokumente neukladajú.  
Editor starší ako verzia `4.0.0` pri načítaní dokumentu skripty zahodí, takže uložením v ňom sa stratia.

Od verzie `4.2.0` je `nameViewMode` [Zobrazenie názvov](../../guide/guides/logical-names.md#name-view), teda názvy, ktoré diagram vykresľuje: `'physical'` fyzický názov každej tabuľky a stĺpca, `'logical'` ich logický názov na mieste fyzického názvu a `'both'` logický aj fyzický názov. Ponuky ich nazývajú `Physical Names`, `Logical Names` a `Both Names`. Obe formy ho zapisujú ako posledné, za `ddlScripts`, a iba vtedy, keď hodnota, ktorú zapisujú, nie je `'physical'`; kým je zapnuté zamknutie `Name View`, ide o zamknutú hodnotu bez ohľadu na to, čo ukazuje obrazovka. Chýbajúca hodnota alebo hodnota, ktorú parser nepozná, sa načíta ako `'physical'` a JSON Schema prijme iba `"logical"` a `"both"`.  
Editor starší ako verzia `4.2.0` pri načítaní dokumentu pole `nameViewMode` zahodí.

Do konštánt `Database`, `Language`, `Show`, `ColumnType`, `ColumnOption`, `LockSettingType` a `ReferentialAction` sa hodnoty iba pridávajú. Uložený dokument uchováva číslo, takže nový databázový systém, cieľ generovania kódu, príznak, typ stĺpca, možnosť stĺpca, zamknutie alebo akcia dostane nasledujúci bit namiesto miesta uprostred.

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

Každý z prvých piatich zoznamov určuje poradie jedného druhu entít, z ktorého vychádzajú DDL, triedenie tabuliek a poradie vykresľovania. V úložnej forme obsahuje každý zoznam iba identifikátory zachovaných entít, každý raz, v uvedenom poradí, a od verzie `4.2.0` sa zoznam, ktorý žiadne neobsahuje, vynechá. Od verzie `4.0.0` určuje pole `tableGroupIds` poradie skupín tabuliek.

Od verzie `4.2.0` uvádzajú `wordIds`, `termIds` a `domainIds` aktuálne riadky každého slovníka: riadok, ktorý jeho kolekcia obsahuje, ale jeho zoznam nie, je odstránený. Neurčujú poradie v hárku, ktoré udáva pole `order` každého riadka. Zapisuje ich iba hodnota za behu, každý z nich vtedy, keď zoznam alebo jeho kolekcia obsahuje položku. Samotné riadky súboru určujú členstvo aj poradie a JSON Schema tieto zoznamy odmietne.  
Od verzie `4.2.0` sa pri parsovaní zoznam, ktorý dokument vynecháva alebo ktorý obsahuje ako niečo iné než pole, načíta ako všetky položky, ktoré obsahuje jeho kolekcia, každý identifikátor raz, v uloženom poradí; prázdne pole zostane prázdne a každá položka jeho kolekcie sa potom načíta ako odstránená. Editor starší ako verzia `4.2.0` načíta chýbajúci zoznam ako prázdny, preto úložná forma naďalej zapisuje každý zoznam vždy, keď jeho kolekcia obsahuje entitu.

Od verzie `4.0.0` sa poradie prekrývania neukladá. Pri parsovaní sa každá uvedená tabuľka, poznámka a skupina tabuliek, ktorá nemá pole `zIndex`, zaradí do poradia prekrývania podľa svojho miesta vo svojom zozname, pričom neskoršie sú vpredu: skupiny tabuliek od `1`, tabuľky od `2` a poznámky nad všetkými tabuľkami. Entita, ktorá má pole `zIndex`, ako v hodnote za behu alebo v súbore uloženom pred verziou `4.0.0`, si ho ponechá. Presunutie tabuľky alebo poznámky dopredu sa preto pri opätovnom otvorení súboru stratí.

### Kolekcia: tableEntities {#collection-tableentities}

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

Od verzie `4.0.0` má tabuľka pole `groupId`, identifikátor [skupiny tabuliek](../../guide/guides/table-groups.md), do ktorej patrí. Chýbajúce alebo prázdne pole `groupId` alebo také, ktoré neoznačuje žiadnu skupinu v `doc.tableGroupIds`, znamená, že tabuľka nemá skupinu, a úložná forma ho zapisuje iba vtedy, keď označuje zachovanú skupinu.  
Ak pole `seqColumnIds` chýba alebo v ňom chýba niektorý uvedený identifikátor, pri parsovaní sa nastaví na `columnIds` a editor pri každom načítaní znova zmeria `widthName`, `widthLogicalName` a `widthComment` pomocou vlastných písiem.

Od verzie `4.2.0` má tabuľka pole `logicalName`, teda názov, ktorý vykresľujú [zobrazenia](../../guide/guides/logical-names.md#name-view) `Logical Names` a `Both Names` (`''` znamená žiadny), a pole `nameDerived` s hodnotou `true`, kým je `name` [odvodený](../../guide/guides/dictionary.md#deriving-physical-names) z logického názvu pomocou slovníkov. Kým je príznak nastavený, nový logický názov znova odvodí fyzický názov; kým nie je, fyzický názov sa považuje za vlastný a nový logický názov ho ponechá, pokiaľ nie je prázdny alebo zložený iba z medzier. Ručné premenovanie príznak vypne a príkaz [`Derive Physical Names Again`](../../guide/guides/dictionary.md#derive-physical-names-again) prepíše aj názov, ktorý niekto zapísal sám, a zapne príznak všade, kde existuje logický názov.  
Úložná forma zapisuje pole `logicalName` za pole `name` tak, ako bolo zadané, iba vtedy, keď obsahuje iný text ako medzery, a pole `nameDerived` za pole `groupId` iba vtedy, keď má hodnotu `true`, jedinú hodnotu, ktorú JSON Schema prijme. Chýbajúce pole `logicalName` sa načíta ako `''` a chýbajúce pole `nameDerived` ako `false`, takže každý názov v súbore uloženom pred verziou `4.2.0` sa považuje za vlastný.  
Editor starší ako verzia `4.2.0` pri načítaní dokumentu obe polia zahodí, takže uložením v ňom sa stratí logický názov každej tabuľky.

### Kolekcia: tableColumnEntities {#collection-tablecolumnentities}

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

Od verzie `4.0.0` úložná forma nezapisuje pole `ui` stĺpca. Pri každom načítaní sa odvodí pole `keys`, značka primárneho kľúča z bitu `primaryKey` poľa `options` a značka cudzieho kľúča zo vzťahov, ktoré končia na danom stĺpci, a zmeria sa šesť šírok.  
Editor starší ako verzia `4.0.0` zobrazí stĺpce súboru uloženého v tejto verzii bez ikon primárneho kľúča.

Od verzie `4.2.0` má stĺpec pole `logicalName`, rovnako ako tabuľka, a pole `domainId`, identifikátor domény, s ktorou je prepojený (`''` znamená žiadnu). Úpravy v jednom editore udržiavajú prepojený stĺpec na type údajov jeho domény, ako opisuje časť [Domény a typy údajov](../../guide/guides/dictionary.md#domains-and-data-types). Pri parsovaní sa však typ žiadneho stĺpca nezmení, takže súbor zapísaný inde môže ponechať prepojený stĺpec s iným typom a rovnako aj skrížené úpravy dvoch spolupracovníkov; hárok Kontroly každý taký prípad uvedie ako [`Domain type mismatch`](../../guide/guides/dictionary.md#what-each-check-finds). Pri parsovaní sa vymaže pole `domainId`, ktoré neoznačuje žiadnu doménu v dokumente. Odstránená doména sa stále počíta, takže editor si prepojenie s ňou ponechá, kým ju vrátenie späť môže obnoviť. Za pole `options` úložná forma zapisuje pole `logicalName` podľa pravidla pre tabuľku a pole `domainId` iba vtedy, keď označuje doménu, ktorú súbor zapisuje, takže nikdy nezapíše prepojenie s odstránenou doménou.  
`ColumnOption.nameDerived` (`16`) je príznak odvodeného názvu stĺpca, ktorý sa uchováva v poli `options` spolu s ostatnými bitmi a znamená to isté ako `nameDerived` tabuľky. Napríklad primárny kľúč s NOT NULL, ktorého názov sa odvodil zo slovníkov, má v poli `options` hodnotu `26`.  
Editor starší ako verzia `4.2.0` pri načítaní dokumentu polia `logicalName` a `domainId` zahodí, takže uložením v ňom sa stratia. Pole `options` uchováva ako celé číslo, takže bit `nameDerived` sa pri uložení v ňom zachová.

### Kolekcia: relationshipEntities {#collection-relationshipentities}

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

Od verzie `3.10.0` má vzťah polia `onDelete` a `onUpdate`, ktoré predstavujú jeho [akcie ON DELETE a ON UPDATE](../../guide/guides/relationship-editing.md#on-delete-and-on-update). Každé z nich obsahuje práve jednu hodnotu `ReferentialAction`. Predvolená hodnota `none` nezapisuje žiadnu klauzulu, takže platí predvolené správanie samotnej databázy. Ostatných päť zodpovedá `NO ACTION`, `CASCADE`, `SET NULL`, `SET DEFAULT` a `RESTRICT`. Schéma SQL zapíše klauzulu iba pre databázu, ktorá danú akciu prijíma.  
Úložná forma vždy zapisuje obe polia a od verzie `4.0.0` ich JSON Schema vyžaduje, pričom overuje iba to, či je každé z nich celé číslo. Pri parsovaní sa chýbajúce pole, ako v každom dokumente uloženom pred verziou `3.10.0`, stále načíta ako `none`, a rovnako aj hodnota mimo zoznamu.  
Editor starší ako verzia `3.10.0` tieto polia nepozná a pri načítaní dokumentu ich zahodí, takže uložením v ňom sa stratia všetky akcie.

Od verzie `4.0.0` sa pri každom načítaní odvodí to, čo úložná forma vynecháva. Vzťah je identifikujúci, keď je každý stĺpec, na ktorom končí, primárnym kľúčom, a jeho pole `startRelationshipType` má hodnotu `dash`, keď je každý takýto stĺpec NOT NULL, inak `ring`; vzťah, ktorému nezostal žiadny koncový stĺpec, je neidentifikujúci a má hodnotu `dash`, tak ako začína nový vzťah. Body ukotvenia `x`, `y` a `direction` sa umiestnia znova.

### Kolekcia: indexEntities {#collection-indexentities}

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

Ak pole `seqIndexColumnIds` chýba alebo v ňom chýba niektorý uvedený identifikátor, pri parsovaní sa nastaví na `indexColumnIds`.

### Kolekcia: indexColumnEntities {#collection-indexcolumnentities}

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

### Kolekcia: memoEntities {#collection-memoentities}

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

Od verzie `4.0.0` tabuľky a poznámky [zdieľajú jedno poradie prekrývania](../../guide/guides/table-related-functions.md#moving-multiple-tables) určené hodnotou `zIndex`, takže tabuľka sa po presunutí dopredu môže dostať nad poznámku. Pri parsovaní sa poznámka uložená bez poľa `zIndex` zaradí nad všetky tabuľky, ako opisuje časť [Doc](#doc). Poznámka v súbore uloženom pred verziou `4.0.0` si ponechá uložený `zIndex`, ktorý pochádzal z rovnakého počítadla ako pri tabuľkách, takže poznámka, ktorú staršia verzia vykreslila nad všetkými tabuľkami, sa môže otvoriť pod tabuľkou, ktorá bola po nej presunutá dopredu.

### Kolekcia: tableGroupEntities {#collection-tablegroupentities}

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

Od verzie `4.0.0` môže dokument obsahovať [skupiny tabuliek](../../guide/guides/table-groups.md): pomenované farebné obdĺžniky vykreslené za tabuľkami. Tabuľka sa k skupine pripojí prostredníctvom vlastného poľa `groupId`, takže skupina neobsahuje zoznam členov. Úložná forma zapisuje kolekciu, podobne ako `doc.tableGroupIds`, iba vtedy, keď existuje nejaká skupina, a dokument bez tejto kolekcie, napríklad uložený pred verziou `4.0.0`, nemá žiadne skupiny. Príznak `Show.hideTableGroup` ich skryje.  
Editor starší ako verzia `4.0.0` pri načítaní dokumentu zahodí skupiny aj pole `groupId` každej tabuľky, takže uložením v ňom sa stratia všetky skupiny.

### Riadky slovníkov {#dictionary-rows}

Od verzie `4.2.0` obsahuje dokument tri slovníky, hárky `Words`, `Terms` a `Domains` karty [Slovník](../../guide/guides/dictionary.md), v kolekciách `wordEntities`, `termEntities` a `domainEntities`. Každé pole slova, termínu alebo domény je reťazec a žiadna z týchto entít nemá pole `ui`. Hárok `Checks` sa vypočíta zo slovníkov a diagramu a neukladá sa.

```ts
type DictionaryRows = {
  fields: string[];
  rows: string[][];
};
```

Ani jeden z nich nemá ako kľúče identifikátory. Každý sa zapisuje ako hlavička a riadky: `fields` raz pomenuje polia entity, identifikátor ako prvý, a každý riadok obsahuje hodnoty jednej entity v tomto poradí. Nižšie uvedené typy uvádzajú polia každej entity v poradí hlavičky hodnoty za behu. Riadok si vždy ponechá svoj identifikátor a názov, ale jeho prázdne hodnoty na konci, za názvom, sa vynechajú, takže prázdna hodnota pred hodnotou, ktorá sa ponechá, zostane `''`, a pri parsovaní sa hodnota, ktorá v riadku chýba, načíta ako `''`. Obe formy zapisujú každý riadok na samostatný riadok ako kompaktný JSON, ako v týchto dvoch slovách zo súboru:

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

Úložná forma zapisuje uvedené riadky v poradí v hárku a vynecháva `order`, takže ho jej hlavičky neuvádzajú. Vynecháva riadok, ktorého hodnoty okrem identifikátora sú všetky prázdne alebo zložené iba z medzier, napríklad riadok pridaný a nikdy nevyplnený alebo vyprázdnený, a každé prepojenie s takou doménou alebo s odstránenou doménou: pole `domainId` stĺpca sa vynechá a pole `domainId` termínu sa zapíše ako `''`, pričom samotný termín sa vynechá, ak nič iné neobsahuje.  
Hlavičky hodnoty za behu uvádzajú `"order"` hneď za `"name"`. Zapisuje všetky riadky kolekcie vrátane odstránených v poradí, v akom ich kolekcia obsahuje, preto poradie v hárku získate zoradením podľa `order` v poradí kódových jednotiek. Pri parsovaní dostanú riadky súboru kľúče `order` v poradí, v akom riadky stoja, takže sa načítajú v poradí, v akom ich súbor zapísal.  
Dokument bez slovníkov, napríklad dokument uložený pred verziou `4.2.0`, nemá žiadne slová, termíny ani domény. Editor starší ako verzia `4.2.0` pri načítaní dokumentu zahodí všetky tri slovníky, takže uložením v ňom sa stratia všetky slová, termíny a domény.

### Kolekcia: wordEntities {#collection-wordentities}

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

Slovo je jedno zo slov, z ktorých sa skladá logický názov, a `abbreviation` je to, čo ho zastupuje vo fyzickom názve. `synonyms` uvádza iné spôsoby zápisu slova a `forbiddenWords` slová, ktoré sa namiesto neho nesmú použiť, v oboch prípadoch oddelené čiarkami.

### Kolekcia: termEntities {#collection-termentities}

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

Termín je celý logický názov. Tabuľka alebo stĺpec, ktorých `logicalName` sa zhoduje s `name`, odvodí `physicalName` alebo, kým je toto pole prázdne, názov zložený zo skratiek slov a stĺpec navyše prevezme doménu, ktorú označuje `domainId`, pričom `''` znamená žiadnu (pozrite si časť [Odvodzovanie fyzických názvov](../../guide/guides/dictionary.md#deriving-physical-names)). Hodnoty v `synonyms` sú oddelené čiarkami. Pri parsovaní sa vymaže pole `domainId`, ktoré neoznačuje žiadnu doménu, rovnako ako pri stĺpci.

### Kolekcia: domainEntities {#collection-domainentities}

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

Doména je pomenovaný typ údajov, ktorý `dataType` uchováva rovnako ako stĺpec, vrátane dĺžky, napríklad `NUMERIC(10)`. Stĺpec alebo termín sa s doménou prepojí jej identifikátorom a editor dá každému prepojenému stĺpcu typ údajov domény (pozrite si časť [Domény a typy údajov](../../guide/guides/dictionary.md#domains-and-data-types)).

## JSON Schema {#json-schema}

Kanonický súbor schémy je zverejnený na adrese [json-schema/schema.json](https://raw.githubusercontent.com/dineug/erd-editor/main/json-schema/schema.json) a možno naň priamo odkazovať pomocou `$schema`.

```json
{
  "$schema": "https://raw.githubusercontent.com/dineug/erd-editor/main/json-schema/schema.json",
  "version": "3.0.0"
}
```

Uveďte pole `$schema` na začiatku súboru `.erd.json` a editory, ktoré rozumejú JSON Schema, napríklad VS Code, budú počas úprav dokument overovať a automaticky dopĺňať jeho polia.

Od verzie `4.0.0` schéma opisuje iba úložnú formu. Každý objekt s pomenovanými poľami je uzavretý (`additionalProperties: false`), každé pole, ktoré úložná forma vždy zapisuje, je povinné, pole, ktoré vynecháva, kým nič neobsahuje, je uvedené, ale nie je povinné, a žiadne pole, ktoré vynecháva vždy, nie je uvedené. Hodnotu za behu preto odmietne. Odmietne aj súbor uložený pred verziou `4.0.0` s jeho `meta`, šírkami, `zIndex`, `ignoreSaveSettings` a ďalšími poľami, kým tento súbor znova neuloží editor vo verzii `4.0.0` alebo novšej. Súbor uložený verziou `3.2.0` alebo novšou už uvádza adresu URL tejto schémy, ktorá odkazuje na vetvu `main`, takže editor, ktorý podľa nej overuje, teraz súbor označí ako chybný. Súbor uložený verziou `3.0.0` či `3.1.0` alebo dokument vo formáte v2 neuvádza `$schema`.

Od verzie `4.2.0` schéma už nevyžaduje textové polia entít, zoznamy v objekte `doc`, kolekcie ani samotné pole `collections`, ktoré úložná forma vynecháva, kým nič neobsahujú. Naďalej prijíma súbor uložený verziou `4.0.0` alebo `4.1.0`. Uvádza nové polia: `nameViewMode`, ktoré prijíma iba `"logical"` a `"both"`; `logicalName` a `nameDerived` tabuľky, pričom `nameDerived` prijíma iba `true`; `logicalName` a `domainId` stĺpca; a tri slovníky, každý s hlavičkou a riadkami reťazcov. `canvasType` uvádza kartu Slovník, `columnOrder` prijíma sedem alebo deväť celých čísel a popisy polí `show`, `columnOrder`, `lockSettings` a `options` uvádzajú nové bity.

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
