---
sidebar_position: 3
description: Format dokumentu .erd.json – postać zapisu przechowywana w pliku i wartość czasu wykonania przechowywana przez edytor, typy TypeScript, stałe stojące za każdym polem liczbowym i opublikowany schemat JSON Schema.
---

# Schemat

`.erd.json` to format dokumentu edytora. Przeczytaj tę stronę, jeśli musisz wygenerować, zwalidować lub zmigrować dokument poza edytorem.

Od wersji `4.0.0` dokument ma dwie serializacje, obie z polem `version` o wartości `'3.0.0'`. Postać zapisu to zawartość pliku: zwraca ją [`editor.value`](../erd-editor-element.md#value), zapisuje ją eksport JSON i jest to jedyna postać akceptowana przez opublikowany schemat [JSON Schema](#json-schema). Wartość czasu wykonania to cały dokument w takiej postaci, w jakiej przechowuje go edytor; zwraca ją [`editor.runtimeValue`](../erd-editor-element.md#runtimevalue). `setInitialValue()`, setter `value` i `setSchemaJSON()` odczytują obie postacie, każdy plik zapisany przez wcześniejszą wersję i dokument v2 `.vuerd`. Przed wersją `4.0.0` istniała tylko jedna: właściwość `value` zwracała cały dokument w takiej postaci, w jakiej przechowywał go edytor, tak jak teraz robi to `runtimeValue`.

## Postać zapisu i wartość czasu wykonania {#storage-form-and-runtime-value}

Postać zapisu zawiera wyłącznie nieusunięte encje: każdą tabelę wymienioną w `doc.tableIds`, kolumny wymienione przez te tabele, relacje między dwiema zachowanymi tabelami, indeksy zachowanych tabel wraz z kolumnami indeksów, których kolumnę tabela nadal wymienia, wymienione notatki i grupy tabel, a od wersji `4.2.0` także wymienione słowa, terminy i domeny, które poza identyfikatorem zawierają jakąś wartość. Pomija to, co edytor wylicza przy wczytywaniu lub przechowuje, dopóki jest otwarty: usunięte encje, `seqColumnIds` i `seqIndexColumnIds`, każdą wartość `zIndex`, zmierzone szerokości, pole `ui` kolumn, pola `identification`, `startRelationshipType` i punkty zaczepienia relacji, a od wersji `4.2.0` także pole `order` każdego wiersza słownika oraz listy `doc.wordIds`, `doc.termIds` i `doc.domainIds`. Typy poniżej oznaczają każde z tych pól komentarzem `// runtime only`.  
Każda kolekcja oprócz słowników ma klucze w postaci identyfikatorów uporządkowanych w kolejności jednostek kodu, przy czym kolumny są najpierw grupowane według `tableId`, a kolumny indeksów według `indexId`. Od wersji `4.2.0` kolekcje `wordEntities`, `termEntities` i `domainEntities` występują po wszystkich pozostałych kolekcjach, w tej kolejności, a każda z nich jest zapisywana jako nagłówek i wiersze, po jednym wierszu w linii (zobacz sekcję [Wiersze słowników](#dictionary-rows)). Każda encja zapisuje swoje pola w stałej kolejności, a tekst ma wcięcie o szerokości dwóch spacji i kończy się znakiem nowego wiersza. Dlatego ten sam dokument zawsze zapisuje się jako te same bajty, zmiana modyfikuje tylko to, czego dotyczy, a plik zapisany na komputerze z innymi czcionkami po ponownym otwarciu daje tę samą wartość `value`.  
VS Code, aplikacja Obsidian i wtyczka JetBrains zapisują plik tylko wtedy, gdy zmiana modyfikuje właściwość `value`, więc plik zapisany przez wcześniejszą wersję zachowuje dawną postać aż do pierwszej zmiany.

Od wersji `4.2.0` postać zapisu pomija też to, co niczego nie zawiera: każde pole tekstowe, które encja lub jej obiekt `ui` przechowuje jako `''` (pola `name`, `comment` i `ui.color` tabeli, pola `name`, `comment`, `dataType` i `default` kolumny, pole `name` indeksu, pola `value` i `ui.color` notatki oraz pola `name` i `color` grupy tabel), każdą listę `doc` i kolekcję bez żadnego wpisu, a także samo pole `collections`, gdy wszystkie kolekcje są puste. Tekst złożony wyłącznie ze spacji jest zapisywany w przechowywanej postaci, z wyjątkiem nazwy logicznej, która jest wtedy pomijana, oraz słowa, terminu lub domeny, których wszystkie wartości poza identyfikatorem są puste lub składają się tylko ze spacji: taki wpis jest pomijany w całości. Każdy identyfikator, każda lista wewnątrz encji i każda liczba, łącznie z `0`, są nadal zapisywane. Pole `doc` jest zapisywane zawsze, więc plik nowego dokumentu zawiera `$schema`, `version`, jego ustawienia i `"doc": {}`.  
Parsowanie odczytuje brakujące pole tekstowe jako `''`, a brakującą kolekcję jako pustą, tak jak robi to każda wersja v3, a postać zapisu pomija listę `doc` tylko wtedy, gdy jej kolekcja niczego nie zawiera (zobacz sekcję [Doc](#doc)). Dlatego edytor w wersji starszej niż `4.2.0` również otwiera takie pliki, a program, który sam odczytuje plik, musi w ten sam sposób interpretować brakujące elementy. Plik zapisany przez wcześniejszą wersję po następnym zapisie nie zawiera już pustych pól tekstowych, list ani kolekcji – to jednorazowa zmiana – a od tej pory zapisuje się bajt w bajt tak samo.

Wartość czasu wykonania zachowuje to, co pomija postać zapisu: usunięte encje, sekwencje, wartości z-index, szerokości, oznaczenia kluczy, flagi relacji i punkty zaczepienia, puste pola tekstowe, cztery listy `tableIds`, `relationshipIds`, `indexIds` i `memoIds` oraz sześć kolekcji od `tableEntities` do `memoEntities`, nawet gdy są puste. Od wersji `4.2.0` zachowuje też usunięte słowa, terminy i domeny, wiersze, które niczego nie zawierają, pole `order` każdego wiersza, trzy listy słowników, nazwę logiczną złożoną wyłącznie ze spacji i powiązanie z usuniętą domeną. Ma wcięcie o szerokości dwóch spacji i nie kończy się znakiem nowego wiersza. Używaj jej wyłącznie do zainicjowania edytora współpracownika lub drugiego widoku przez `setInitialValue()`, aby cofnięcie usunięcia, które wysyła inny edytor, przywracało tam encję w całości. Nigdy nie zapisuj jej do pliku; JSON Schema ją odrzuca. Usuniętych encji nic już nie odśmieca, więc wartość czasu wykonania przechowuje je do następnego otwarcia dokumentu z pliku.

Obie postacie zapisują każde zablokowane ustawienie z jego zablokowaną wartością (zobacz [`lockSettings`](#settings)), pole `settings.ddlScripts` tylko wtedy, gdy któryś skrypt zawiera tekst, a pole `groupId` tabeli tylko wtedy, gdy nie jest puste. Od wersji `4.2.0` obie zapisują też pole `settings.nameViewMode` tylko wtedy, gdy zapisywana wartość jest inna niż `'physical'`, pole `settings.columnOrder` jako siedem wpisów, gdy to możliwe (zobacz sekcję [Settings](#settings)), a pole `nameDerived` tabeli tylko wtedy, gdy ma wartość `true`.  
Postać zapisu zawiera `doc.tableGroupIds` i `tableGroupEntities` tylko wtedy, gdy istnieje grupa tabel, pole `logicalName` tylko wtedy, gdy zawiera tekst inny niż same spacje, pole `domainId` kolumny tylko wtedy, gdy wskazuje domenę zapisywaną w pliku, a każdy słownik tylko wtedy, gdy zawiera wiersz zapisywany w pliku. Wartość czasu wykonania zawiera pola grup tabel, gdy dokument ma grupę lub usuniętą grupę, pola `logicalName` i `domainId`, gdy są różne od `''`, a każdy słownik wraz z jego listą, gdy którekolwiek z nich zawiera wpis, łącznie z usuniętym wierszem.

## TypeScript {#typescript}

Typy opisują wartość czasu wykonania. Pole oznaczone komentarzem `// runtime only` jest pomijane w postaci zapisu, a pole oznaczone znakiem `?` jest zapisywane tylko wtedy, gdy coś zawiera. Puste teksty, listy i kolekcje, które postać zapisu pomija od wersji `4.2.0`, nie są oznaczone.

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

Każda encja ma pole `id`, nieprzezroczysty ciąg znaków, który jest jej kluczem w kolekcji, z wyjątkiem trzech słowników, w których jest to pierwsza wartość wiersza. Od wersji `4.2.0` parsowanie odczytuje encję jednej z siedmiu kolekcji z kluczami, której pole `id` nie istnieje, jest puste lub nie jest ciągiem znaków, z identyfikatorem równym kluczowi, pod którym jest przechowywana, a pomija wpis, który nie jest obiektem, albo wpis bez identyfikatora, którego kluczem jest `''`. Wiersz słownika jest pomijany, gdy nie jest tablicą lub jego `id` nie jest ciągiem znaków innym niż `''`. Edytor w wersji starszej niż `4.2.0` pomija encję bez pola `id` lub z pustym polem `id`, więc postać zapisu nadal zapisuje każdy identyfikator.  
Od wersji `4.0.0` każdy nowy identyfikator, także identyfikator wiersza słownika, to UUIDv7 zapisany w postaci Uuid25, czyli 25 cyfr o podstawie 36 pisanych małymi literami, na przykład `03gzrxjv20bdlcak89q25d2m7`, więc identyfikatory nadane przez jeden edytor sortują się w kolejności, w jakiej je utworzył. Dokument zachowuje identyfikatory, które zawiera, na przykład identyfikatory nanoid z wcześniejszej wersji lub identyfikatory pliku v2, więc nic nie powinno zależeć od formatu identyfikatora.

Od wersji `4.0.0` żadna encja nie ma obiektu `meta` (`createAt`, `updateAt`), a typy `EntityMeta` i `EntityType` usunięto. Nic go nie zapisuje, parsowanie pomija obiekt `meta` ze starszego pliku, a JSON Schema go odrzuca. Służył on wyłącznie do wyznaczania momentu odśmiecania usuniętych encji, a tego mechanizmu również już nie ma.

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

`originX` i `originY` określają położenie widoku: punkt ekranu, na który trafia punkt sceny `(0, 0)`.  
`zoomLevel` przyjmuje wartości od `0.1` do `1.5`. Dokument zapisany z wartością powyżej `1` otwiera się z wartością `1` w edytorze w wersji starszej niż `3.5.0`.  
Od wersji `4.0.0` ustawienia nie zawierają pól `width`, `height`, `scrollTop`, `scrollLeft`, `relationshipOptimization` ani `ignoreSaveSettings`. Nic ich nie zapisuje, parser nie zachowuje żadnego z nich, a JSON Schema odrzuca plik, który nadal je ma.

`canvasType` to karta, na której otwiera się dokument. Dokument zapisany na karcie Wizualizacja zawiera `'@dineug/erd-editor/builtin-visualization'`, ale nie informację, czy był wyświetlany tryb `Graph`, czy `Flow`, a nowo utworzony edytor pokazuje tę kartę w trybie `Graph`.  
Od wersji `4.0.0`, dopóki blokada `Canvas Type` jest włączona, a tak jest w nowym dokumencie, dokument zachowuje kartę wyświetlaną w chwili zablokowania, a przełączanie kart pozostawia właściwość `value` bez zmian. Blokada ustawiona na karcie Ustawienia zachowuje kartę, która była otwarta przed przejściem do Ustawień, a zablokowana wartość `'settings'`, którą można zapisać tylko ręczną edycją, otwiera się jako `'ERD'`.  
Od wersji `4.2.0` pole `canvasType` może mieć też wartość `'@dineug/erd-editor/builtin-dictionary'`, czyli kartę [Słownik](../../guide/guides/dictionary.md), którą blokada `Canvas Type` zachowuje tak samo jak pozostałe. Edytor w wersji starszej niż `4.2.0` zachowuje tę wartość, ale nie pokazuje pod paskiem narzędzi żadnej karty, dopóki użytkownik którejś nie wybierze.  
Żadna część własnego stanu trybu `Flow` nie jest serializowana: jego rozmieszczenie, powiększenie, przesunięcie widoku, wyświetlanie wierszy i tabele, na których skupiono widok, pozostają w edytorze, a od wersji `4.2.0` także widoki, między którymi przechodzą krok po kroku polecenia [`Previous table` i `Next table`](../../guide/guides/visualization.md#previous-table-and-next-table). Dlatego `originX`, `originY` i `zoomLevel` zawsze opisują kanwę ERD.

`show` i `lockSettings` to maski bitowe – połącz flagi operatorem OR.  
`columnOrder` to tablica zawierająca każdą wartość `ColumnType` jeden raz, w kolejności wyświetlania; od wersji `4.2.0` dokument może ją zapisać z siedmioma z dziewięciu wartości, jak opisuje poniższy akapit o kolejności kolumn.  
Każde z pól `database`, `language`, `tableNameCase`, `columnNameCase` i `bracketType` zawiera dokładnie jedną wartość, a JSON Schema odrzuca wartość łączoną.

W nowym dokumencie pole `show` ma wartość `431`: `tableComment`, `columnComment`, `columnDataType`, `columnDefault`, `columnPrimaryKey`, `columnNotNull` i `relationship`.  
Od wersji `3.10.0` istnieją dwie dodatkowe flagi pola `show`, obie wyłączone w nowym dokumencie i w każdym dokumencie zapisanym przed wersją `3.10.0`.  
`columnAlternateKey` (`512`) to opcja widoku [`Alternate Key`](../../guide/guides/table-related-functions.md#alternate-keys). Gdy jest ustawiona, oznacza kolumny każdego indeksu unikatowego obejmującego dwie lub więcej kolumn jako `AK1.1`, `AK1.2` itd. Początkowo jest wyłączona, więc żaden istniejący diagram nie zmienia szerokości.  
`hideReferentialAction` (`1024`) działa odwrotnie: gdy jest ustawiona, ukrywa [etykiety ON DELETE i ON UPDATE](../../guide/guides/relationship-editing.md#reading-a-connector) na łącznikach, więc domyślnie są one widoczne. Opcja widoku `Referential Actions` jest zaznaczona, dopóki flaga jest wyłączona. Flaga nie zmienia rozmiaru żadnej tabeli.  
Edytor w wersji starszej niż `3.10.0` zachowuje wartość `show` w całości jako liczbę, więc obie flagi przetrwają zapis w tym edytorze.

Od wersji `4.0.0` istnieją dwie kolejne flagi pola `show`, obie wyłączone w nowym dokumencie i w każdym dokumencie zapisanym przed wersją `4.0.0`. Podobnie jak `hideReferentialAction`, każda z nich ukrywa to, co wskazuje jej nazwa, więc grupy tabel i notatki są domyślnie widoczne.  
`hideTableGroup` (`2048`) ukrywa [grupy tabel](../../guide/guides/table-groups.md), a `hideMemo` (`4096`) ukrywa wszystkie notatki. Są to [opcje widoku](../../guide/guides/table-related-functions.md#table-view-options) `Table Groups` i `Memos`, każda zaznaczona, dopóki jej flaga jest wyłączona. Żadna z nich nie zmienia rozmiaru żadnej tabeli.  
Edytor w wersji starszej niż `4.0.0` zachowuje wartość `show` w całości jako liczbę, więc obie flagi przetrwają zapis w tym edytorze.

Od wersji `4.2.0` istnieje jeszcze jedna flaga pola `show`, `columnDomain` (`8192`), wyłączona w nowym dokumencie i w każdym dokumencie zapisanym przed wersją `4.2.0`, więc pole `show` nowego dokumentu nadal ma wartość `431`. Jest to [opcja widoku](../../guide/guides/table-related-functions.md#table-view-options) `Domain`: gdy flaga jest ustawiona, każdy wiersz kolumny pokazuje [komórkę domeny](../../guide/guides/logical-names.md#the-domain-cell), co poszerza tabele. Początkowo jest wyłączona, więc żaden istniejący diagram nie zmienia szerokości.  
Edytor w wersji starszej niż `4.2.0` zachowuje wartość `show` w całości jako liczbę, więc flaga przetrwa zapis w tym edytorze.

Od wersji `4.2.0` stała `ColumnType` ma dziewięć wartości. `columnLogicalName` (`128`) ustala miejsce komórki nazwy logicznej, którą wiersz kolumny wyświetla tylko w widoku `Both Names`, a `columnDomain` (`256`) – miejsce komórki domeny. Są to wiersze `Logical Name` i `Domain` [kolejności kolumn](../../guide/guides/settings.md#adjusting-column-order) na karcie Ustawienia. Edytor przechowuje kolejność wszystkich dziewięciu wartości, a w nowym dokumencie jest to `128, 1, 2, 256, 4, 8, 16, 32, 64`.  
Obie postacie zapisują kolejność jako siedem wpisów, pomijając `128` i `256`, dopóki `128` stoi tuż przed `columnName`, a `256` tuż po `columnDataType`. Dlatego nowy dokument nadal zapisuje `1, 2, 4, 8, 16, 32, 64`, a plik, w którego kolejności nigdy ich nie przeniesiono, zachowuje swoje bajty. W przeciwnym razie zapisują wszystkie dziewięć.  
Parsowanie wstawia te dwie wartości w opisane miejsca kolejności złożonej z siedmiu wpisów, niezależnie od kolejności tych siedmiu, przyjmuje bez zmian dziewięć wpisów zawierających każdy typ, a wszystko inne odczytuje jako kolejność domyślną. JSON Schema przyjmuje siedem lub dziewięć liczb całkowitych.

Od wersji `4.0.0` stała `Language` ma osiem kolejnych formatów docelowych karty [Generator kodu](../../guide/guides/code-generator.md), od `Mermaid` do `JSONSchema`. Wartość `language` nieznana parserowi jest odczytywana jako `GraphQL`, więc edytor w wersji starszej niż `4.0.0` otwiera dokument, w którym zapisano jeden z nich, z językiem GraphQL, a przy zapisie w tym edytorze do pliku trafia GraphQL.

Od wersji `4.0.0` pole `lockSettings` zastępuje pole `ignoreSaveSettings`, a typ `LockSettingType` – usunięty typ `SaveSettingType`. `lockSettings` wskazuje ustawienia, które dokument zapisuje w stanie z chwili ich zablokowania. `viewport` obejmuje razem `originX`, `originY` i `zoomLevel`, ponieważ położenie widoku zapisane bez poziomu powiększenia otwiera się w innym miejscu, a każdy pozostały bit obejmuje pole, od którego pochodzi jego nazwa. Są to wiersze listy [`Lock`](../../guide/guides/settings.md#lock) na karcie Ustawienia.  
Zarówno `value`, jak i `runtimeValue` zapisują zablokowane ustawienie z jego zablokowaną wartością, niezależnie od tego, co pokazuje edytor, a każde inne ustawienie w bieżącym stanie. Dlatego, dopóki odpowiednia blokada jest włączona, przewijanie i powiększanie, przełączanie kart, zmiana języka w Generatorze kodu, stylu nazw lub typu cudzysłowu czy przełączanie Widoku nazw pozostawia plik bez zmian. Zablokowanie zapamiętuje wartość, którą ustawienie ma w tej chwili, a parsowanie odczytuje zablokowaną wartość z zapisanego pola.  
Dokument utworzony od zera – nowy edytor lub magazyn replikacji albo pusta wartość przekazana do `value` lub `setInitialValue()` – ma pole `lockSettings` ustawione na `63`, czyli wszystkie blokady włączone. Dokument, którego pole `settings` nie zawiera pola `lockSettings` – każdy plik zapisany przed wersją `4.0.0`, niezależnie od wartości `ignoreSaveSettings`, i każdy dokument v2 – również otwiera się ze wszystkimi blokadami włączonymi: z położeniem widoku i kartą takimi jak w nowym dokumencie (`originX` i `originY` równe `0`, `zoomLevel` równe `1`, karta ERD) oraz z językiem, stylami nazw i typem cudzysłowu zablokowanymi na zapisanych wartościach. Dokument, który określa swoje blokady, zachowuje je, także gdy jest to `0`, oraz każdą zapisaną wartość.  
Parsowanie zachowuje wszystkie bity pola `lockSettings`, także nieznane, więc blokada dodana w późniejszej wersji przetrwa tutaj zapis; JSON Schema sprawdza tylko, czy wartość jest liczbą całkowitą. Edytor w wersji starszej niż `4.0.0` przy zapisie pomija `lockSettings` i zapisuje położenie widoku oraz kartę w bieżącym stanie, więc plik otwiera się tutaj ponownie jak plik zapisany przed wersją `4.0.0`.

Od wersji `4.2.0` istnieje siódma blokada, `unlockNameViewMode` (`64`), czyli wiersz `Name View`, która obejmuje `nameViewMode`. Jej bit działa odwrotnie niż pozostałe bity blokad, tak jak bity ukrywania w `Show`: gdy jest ustawiony, Widok nazw jest odblokowany, a gdy jest wyzerowany – zablokowany. Dlatego `63` nadal oznacza wszystkie blokady włączone, a nowy dokument ma tę wartość z Widokiem nazw zablokowanym na `'physical'`. Plik zapisany przed wersją `4.2.0` ma ten bit wyzerowany niezależnie od pozostałych blokad, także przy wartości `0`, więc otwiera się z Widokiem nazw zablokowanym na `'physical'`. Dokument ze wszystkimi blokadami wyłączonymi ma wartość `64`, a dokument z włączonymi wszystkimi pozostałymi blokadami i odblokowanym Widokiem nazw – `127`. Sprawdzaj tę blokadę odwrotnie: jest włączona, gdy `(lockSettings & 64) === 0`.  
Gdy jest włączona, przełączenie Widoku nazw zmienia tylko ekran edytora, w którym go dokonano, a dokument zachowuje zablokowany widok. Gdy jest wyłączona, przełączenie w edytorze, który może edytować, należy do dokumentu, a każdy współpracownik przełącza widok razem z nim. Przełączenie w edytorze tylko do odczytu w obu przypadkach zmienia tylko jego własny ekran. Zobacz [`Lock`](../../guide/guides/settings.md#lock).  
Edytor w wersji `4.0.0` lub `4.1.0` zachowuje ten bit przy zapisie, ale pomija `nameViewMode`, więc dokument otwiera się tutaj ponownie w widoku `'physical'`, z blokadą w niezmienionym stanie.

Od wersji `4.0.0` pole `ddlScripts` przechowuje dwa skrypty karty [Schemat SQL](../../guide/guides/schema-sql.md), które trafiają do kodu DDL każdej bazy danych: `before` po nagłówku i przed tabelami, `after` za wygenerowanym kodem DDL. W kodzie DDL każdy z nich ma końce wierszy LF, jest pozbawiony początkowych pustych wierszy i końcowych białych znaków, a dla MSSQL kończy się `GO`, jak opisano w sekcji [Skrypty przed tabelami i po nich](../../guide/guides/schema-sql.md#before-and-after-scripts); samo pole `ddlScripts` przechowuje każdy skrypt w takiej postaci, w jakiej go wpisano. Klucz jest zapisywany tylko wtedy, gdy któryś skrypt zawiera tekst, i wówczas obejmuje oba; brak klucza lub skrypt, który nie jest ciągiem znaków, jest odczytywany jako `''`. Opcje `Statements`, `Header` i `Tables` tej karty, a od wersji `4.2.0` także jej przełącznik [`Write logical names into empty comments`](../../guide/guides/schema-sql.md#logical-names-as-comments), nie są zapisywane w dokumencie.  
Edytor w wersji starszej niż `4.0.0` pomija skrypty przy wczytywaniu dokumentu, więc zapis w tym edytorze powoduje ich utratę.

Od wersji `4.2.0` pole `nameViewMode` to [Widok nazw](../../guide/guides/logical-names.md#name-view), czyli nazwy wyświetlane przez diagram: `'physical'` – nazwa każdej tabeli i kolumny, `'logical'` – jej nazwa logiczna w miejscu nazwy, a `'both'` – nazwa logiczna i nazwa. Menu nazywają je `Physical Names`, `Logical Names` i `Both Names`. Obie postacie zapisują to pole na końcu, po `ddlScripts`, i tylko wtedy, gdy zapisywana wartość jest inna niż `'physical'`; gdy blokada `Name View` jest włączona, jest to zablokowana wartość, niezależnie od tego, co pokazuje ekran. Brakująca wartość lub wartość nieznana parserowi jest odczytywana jako `'physical'`, a JSON Schema przyjmuje tylko `"logical"` i `"both"`.  
Edytor w wersji starszej niż `4.2.0` pomija `nameViewMode` przy wczytywaniu dokumentu.

Stałe `Database`, `Language`, `Show`, `ColumnType`, `ColumnOption`, `LockSettingType` i `ReferentialAction` można jedynie rozszerzać na końcu. Zapisany dokument przechowuje liczbę, więc nowy system bazy danych, format docelowy generowania kodu, flaga, typ kolumny, opcja kolumny, blokada lub akcja zajmuje następny bit, a nie miejsce pośrodku.

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

Każda z pierwszych pięciu list określa kolejność encji jednego rodzaju, z której korzystają kod DDL, sortowanie tabel i kolejność rysowania. W postaci zapisu każda lista zawiera tylko identyfikatory zachowanych encji, każdy jeden raz, w kolejności z listy, a od wersji `4.2.0` lista, która nie zawiera żadnego, jest pomijana. Od wersji `4.0.0` pole `tableGroupIds` określa kolejność grup tabel.

Od wersji `4.2.0` pola `wordIds`, `termIds` i `domainIds` wymieniają nieusunięte wiersze każdego słownika: wiersz, który kolekcja zawiera, ale którego nie ma na liście, jest usunięty. Nie są kolejnością arkusza, którą wyznacza pole `order` każdego wiersza. Zapisuje je tylko wartość czasu wykonania, każdą wtedy, gdy ona lub jej kolekcja zawiera wpis. W pliku przynależność i kolejność wyznaczają same wiersze, a JSON Schema odrzuca te listy.  
Od wersji `4.2.0` parsowanie odczytuje listę, którą dokument pomija lub przechowuje jako coś innego niż tablica, jako wszystkie wpisy jej kolekcji, każdy identyfikator jeden raz, w kolejności przechowywania; pusta tablica pozostaje pusta, a wszystkie wpisy jej kolekcji są wtedy odczytywane jako usunięte. Edytor w wersji starszej niż `4.2.0` odczytuje brakującą listę jako pustą, więc postać zapisu nadal zapisuje każdą listę, gdy jej kolekcja zawiera encję.

Od wersji `4.0.0` kolejność warstw nie jest zapisywana. Parsowanie układa w warstwy każdą wymienioną tabelę, notatkę i grupę tabel bez wartości `zIndex` według jej miejsca na liście, przy czym późniejsze trafiają na wierzch: grupy tabel od `1`, tabele od `2`, a notatki nad wszystkimi tabelami. Encja z wartością `zIndex`, jak w wartości czasu wykonania lub w pliku zapisanym przed wersją `4.0.0`, zachowuje ją. Dlatego przeniesienie tabeli lub notatki na wierzch przepada po ponownym otwarciu pliku.

### Kolekcja: tableEntities {#collection-tableentities}

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

Od wersji `4.0.0` tabela ma pole `groupId`, czyli identyfikator [grupy tabel](../../guide/guides/table-groups.md), do której należy. Brakujące lub puste pole `groupId` albo takie, które nie wskazuje żadnej grupy z `doc.tableGroupIds`, oznacza brak grupy, a w postaci zapisu pojawia się ono tylko wtedy, gdy wskazuje zachowaną grupę.  
Gdy pole `seqColumnIds` nie istnieje lub brakuje w nim któregoś z wymienionych identyfikatorów, parsowanie inicjuje je wartością `columnIds`, a edytor przy każdym wczytaniu ponownie mierzy `widthName`, `widthLogicalName` i `widthComment` własnymi czcionkami.

Od wersji `4.2.0` tabela ma pole `logicalName`, czyli nazwę wyświetlaną przez [widoki](../../guide/guides/logical-names.md#name-view) `Logical Names` i `Both Names`, z wartością `''` oznaczającą brak, oraz pole `nameDerived`, które ma wartość `true`, gdy słowniki [wygenerowały](../../guide/guides/dictionary.md#deriving-physical-names) pole `name` na podstawie nazwy logicznej. Dopóki jest ustawione, nowa nazwa logiczna ponownie generuje nazwę; gdy nie jest, nazwa jest traktowana jako własna i nowa nazwa logiczna jej nie zmienia, chyba że nazwa jest pusta lub składa się tylko ze spacji. Ręczna zmiana nazwy wyłącza to pole, a polecenie [`Derive Physical Names Again`](../../guide/guides/dictionary.md#derive-physical-names-again) nadpisuje nawet nazwę wpisaną samodzielnie i włącza je wszędzie tam, gdzie istnieje nazwa logiczna.  
Postać zapisu zapisuje pole `logicalName` po polu `name`, w takiej postaci, w jakiej je wpisano, tylko wtedy, gdy zawiera tekst inny niż same spacje, a pole `nameDerived` po polu `groupId` tylko wtedy, gdy ma wartość `true`, jedyną, którą przyjmuje JSON Schema. Brakujące pole `logicalName` jest odczytywane jako `''`, a brakujące pole `nameDerived` jako `false`, więc każda nazwa w pliku zapisanym przed wersją `4.2.0` jest traktowana jako własna.  
Edytor w wersji starszej niż `4.2.0` pomija oba pola przy wczytywaniu dokumentu, więc zapis w tym edytorze powoduje utratę nazwy logicznej każdej tabeli.

### Kolekcja: tableColumnEntities {#collection-tablecolumnentities}

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

Od wersji `4.0.0` postać zapisu nie zawiera pola `ui` kolumn. Każde wczytanie wylicza `keys` – oznaczenie klucza podstawowego z bitu `primaryKey` pola `options`, a oznaczenie klucza obcego z relacji kończących się na kolumnie – i mierzy sześć szerokości.  
Edytor w wersji starszej niż `4.0.0` wyświetla kolumny pliku zapisanego tutaj bez ikon klucza podstawowego.

Od wersji `4.2.0` kolumna ma pole `logicalName`, tak jak tabela, oraz pole `domainId`, czyli identyfikator domeny, z którą jest powiązana, z wartością `''` oznaczającą brak. Zmiany w jednym edytorze utrzymują powiązaną kolumnę przy typie danych jej domeny, jak opisano w sekcji [Domeny i typy danych](../../guide/guides/dictionary.md#domains-and-data-types). Parsowanie nie zmienia jednak typu żadnej kolumny, więc plik zapisany gdzie indziej może pozostawić powiązaną kolumnę z innym typem, podobnie jak krzyżujące się zmiany dwóch współpracowników; arkusz Kontrole wyświetla każdy taki przypadek jako kontrolę [`Domain type mismatch`](../../guide/guides/dictionary.md#what-each-check-finds). Parsowanie czyści pole `domainId`, które nie wskazuje żadnej domeny zawartej w dokumencie. Usunięta domena nadal się liczy, więc edytor zachowuje powiązanie z nią, dopóki cofnięcie może ją przywrócić. Po polu `options` postać zapisu zapisuje pole `logicalName` według reguły dla tabeli, a pole `domainId` tylko wtedy, gdy wskazuje domenę zapisywaną w pliku, więc nigdy nie zapisuje powiązania z usuniętą domeną.  
`ColumnOption.nameDerived` (`16`) to flaga wygenerowanej nazwy kolumny, przechowywana w `options` razem z pozostałymi bitami i oznaczająca to samo co pole `nameDerived` tabeli. Na przykład klucz podstawowy z ograniczeniem NOT NULL, którego nazwę wygenerowały słowniki, ma `options` równe `26`.  
Edytor w wersji starszej niż `4.2.0` pomija pola `logicalName` i `domainId` przy wczytywaniu dokumentu, więc zapis w tym edytorze powoduje ich utratę. Zachowuje wartość `options` w całości jako liczbę, więc bit `nameDerived` przetrwa zapis w tym edytorze.

### Kolekcja: relationshipEntities {#collection-relationshipentities}

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

Od wersji `3.10.0` relacja ma pola `onDelete` i `onUpdate`, czyli swoje [akcje ON DELETE i ON UPDATE](../../guide/guides/relationship-editing.md#on-delete-and-on-update). Każde z nich zawiera dokładnie jedną wartość `ReferentialAction`. Domyślna wartość `none` nie zapisuje klauzuli, więc obowiązuje domyślne zachowanie samej bazy danych. Pozostałych pięć wartości oznacza `NO ACTION`, `CASCADE`, `SET NULL`, `SET DEFAULT` i `RESTRICT`. Schemat SQL zapisuje klauzulę tylko dla bazy danych, która obsługuje daną akcję.  
Postać zapisu zawsze zawiera oba pola, a od wersji `4.0.0` JSON Schema ich wymaga, sprawdzając tylko, czy każde jest liczbą całkowitą. Parsowanie nadal odczytuje brakujące pole, jak w każdym dokumencie zapisanym przed wersją `3.10.0`, jako `none`, podobnie jak wartość spoza listy.  
Edytor w wersji starszej niż `3.10.0` nie zna tych pól i pomija je przy wczytywaniu dokumentu, więc zapis w tym edytorze powoduje utratę wszystkich akcji.

Od wersji `4.0.0` każde wczytanie wylicza to, co pomija postać zapisu. Relacja jest identyfikująca, gdy każda kolumna, na której się kończy, jest kluczem podstawowym, a jej pole `startRelationshipType` ma wartość `dash`, gdy każda taka kolumna ma ustawione NOT NULL, a w przeciwnym razie `ring`; relacja, w której nie pozostała żadna kolumna końcowa, jest nieidentyfikująca i ma wartość `dash`, tak jak nowo utworzona relacja. Punkty zaczepienia, czyli `x`, `y` i `direction`, są rozmieszczane ponownie.

### Kolekcja: indexEntities {#collection-indexentities}

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

Gdy pole `seqIndexColumnIds` nie istnieje lub brakuje w nim któregoś z wymienionych identyfikatorów, parsowanie inicjuje je wartością `indexColumnIds`.

### Kolekcja: indexColumnEntities {#collection-indexcolumnentities}

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

### Kolekcja: memoEntities {#collection-memoentities}

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

Od wersji `4.0.0` tabele i notatki [współdzielą jeden stos warstw](../../guide/guides/table-related-functions.md#moving-multiple-tables) uporządkowany według `zIndex`, więc przeniesienie tabeli na wierzch może umieścić ją nad notatką. Parsowanie umieszcza notatkę zapisaną bez wartości `zIndex` nad wszystkimi tabelami, jak opisano w sekcji [Doc](#doc). Notatka w pliku zapisanym przed wersją `4.0.0` zachowuje zapisaną wartość `zIndex`, która pochodziła z tego samego licznika co wartości tabel, więc notatka, którą wcześniejsza wersja rysowała nad wszystkimi tabelami, może otworzyć się pod tabelą przeniesioną na wierzch później niż ona.

### Kolekcja: tableGroupEntities {#collection-tablegroupentities}

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

Od wersji `4.0.0` dokument może zawierać [grupy tabel](../../guide/guides/table-groups.md): nazwane, kolorowe prostokąty rysowane za tabelami. Tabela dołącza do grupy przez własne pole `groupId`, więc grupa nie przechowuje listy członków. Postać zapisu zawiera tę kolekcję, podobnie jak `doc.tableGroupIds`, tylko wtedy, gdy istnieje grupa, a dokument bez niej, taki jak zapisany przed wersją `4.0.0`, nie ma grup. `Show.hideTableGroup` je ukrywa.  
Edytor w wersji starszej niż `4.0.0` przy wczytywaniu dokumentu pomija grupy i pole `groupId` każdej tabeli, więc zapis w tym edytorze powoduje utratę wszystkich grup.

### Wiersze słowników {#dictionary-rows}

Od wersji `4.2.0` dokument zawiera trzy słowniki, czyli arkusze `Words`, `Terms` i `Domains` karty [Słownik](../../guide/guides/dictionary.md), w polach `wordEntities`, `termEntities` i `domainEntities`. Każde pole słowa, terminu lub domeny jest ciągiem znaków i żaden z tych wpisów nie ma obiektu `ui`. Arkusz `Checks` jest wyliczany na podstawie słowników i diagramu i nie jest zapisywany.

```ts
type DictionaryRows = {
  fields: string[];
  rows: string[][];
};
```

Żaden z trzech słowników nie ma kluczy w postaci identyfikatorów. Każdy jest zapisywany jako nagłówek i wiersze: `fields` raz wymienia pola encji, zaczynając od identyfikatora, a każdy wiersz zawiera wartości jednej encji w tej kolejności. Typy poniżej wymieniają pola każdej encji w kolejności nagłówka wartości czasu wykonania. Wiersz zawsze zachowuje identyfikator i nazwę, ale jego końcowe puste wartości po nazwie są pomijane, więc pusta wartość przed wartością zachowaną pozostaje `''`, a parsowanie odczytuje wartość, której brakuje w wierszu, jako `''`. Obie postacie zapisują każdy wiersz w osobnej linii w zwartym formacie JSON, jak w tych dwóch słowach z pliku:

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

Postać zapisu zapisuje wymienione wiersze w kolejności arkusza i pomija pole `order`, więc jej nagłówki go nie wymieniają. Pomija wiersz, którego wszystkie wartości poza identyfikatorem są puste lub składają się tylko ze spacji, na przykład dodany i nigdy niewypełniony albo opróżniony, oraz każde powiązanie z taką domeną lub z domeną usuniętą: pole `domainId` kolumny jest pomijane, a pole `domainId` terminu jest zapisywane jako `''`, przy czym sam termin jest pomijany, jeśli nie zawiera niczego innego.  
Nagłówki wartości czasu wykonania wymieniają `"order"` tuż po `"name"`. Wartość czasu wykonania zapisuje każdy wiersz, który zawiera jej kolekcja, łącznie z usuniętymi, w kolejności, w jakiej przechowuje je kolekcja, więc aby uzyskać kolejność arkusza, sortuj według `order`, porównując w kolejności jednostek kodu. Parsowanie nadaje wierszom pliku klucze `order` w kolejności, w jakiej wiersze występują, więc po odczycie mają kolejność, w jakiej zapisał je plik.  
Dokument bez słowników, taki jak zapisany przed wersją `4.2.0`, nie ma żadnych słów, terminów ani domen. Edytor w wersji starszej niż `4.2.0` pomija wszystkie trzy słowniki przy wczytywaniu dokumentu, więc zapis w tym edytorze powoduje utratę wszystkich słów, terminów i domen.

### Kolekcja: wordEntities {#collection-wordentities}

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

Słowo to jedno ze słów, z których składa się nazwa logiczna, a `abbreviation` to skrót, który zastępuje je w nazwie fizycznej. `synonyms` wymienia inne zapisy tego słowa, a `forbiddenWords` słowa, których nie wolno używać zamiast niego, oba jako listy rozdzielane przecinkami.

### Kolekcja: termEntities {#collection-termentities}

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

Termin to cała nazwa logiczna. Tabela lub kolumna, której pole `logicalName` jest zgodne z polem `name`, otrzymuje jako wygenerowaną nazwę wartość pola `physicalName` albo, dopóki to pole jest puste, nazwę złożoną ze skrótów słów, a kolumna przyjmuje też domenę wskazaną przez `domainId`, gdzie `''` oznacza brak (zobacz sekcję [Generowanie nazw fizycznych](../../guide/guides/dictionary.md#deriving-physical-names)). Pole `synonyms` jest listą rozdzielaną przecinkami. Parsowanie czyści pole `domainId`, które nie wskazuje żadnej domeny, tak jak w przypadku kolumny.

### Kolekcja: domainEntities {#collection-domainentities}

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

Domena to nazwany typ danych, który pole `dataType` przechowuje tak jak kolumna, łącznie z długością, na przykład `NUMERIC(10)`. Kolumna lub termin wiąże się z domeną przez jej identyfikator, a edytor nadaje każdej powiązanej kolumnie typ danych domeny (zobacz sekcję [Domeny i typy danych](../../guide/guides/dictionary.md#domains-and-data-types)).

## JSON Schema {#json-schema}

Kanoniczny plik schematu jest opublikowany pod adresem [json-schema/schema.json](https://raw.githubusercontent.com/dineug/erd-editor/main/json-schema/schema.json) i można się do niego odwoływać bezpośrednio przez pole `$schema`.

```json
{
  "$schema": "https://raw.githubusercontent.com/dineug/erd-editor/main/json-schema/schema.json",
  "version": "3.0.0"
}
```

Umieść pole `$schema` na początku pliku `.erd.json`, a edytory obsługujące JSON Schema, takie jak VS Code, będą walidować dokument i autouzupełniać jego pola podczas edycji.

Od wersji `4.0.0` schemat opisuje wyłącznie postać zapisu. Każdy obiekt z nazwanymi polami jest zamknięty (`additionalProperties: false`), każde pole, które postać zapisu zawsze zawiera, jest wymagane, pole, które pomija, gdy niczego nie zawiera, jest wymienione, ale nie jest wymagane, a żadne pole, które pomija zawsze, nie jest wymienione. Schemat odrzuca więc wartość czasu wykonania. Odrzuca też plik zapisany przed wersją `4.0.0`, z jego polem `meta`, szerokościami, `zIndex`, `ignoreSaveSettings` i resztą, dopóki edytor w wersji `4.0.0` lub nowszej nie zapisze tego pliku ponownie. Plik zapisany przez wersję `3.2.0` lub nowszą już wskazuje adres URL tego schematu, który prowadzi do gałęzi `main`, więc edytor walidujący względem niego teraz zgłasza błędy w tym pliku. Plik zapisany przez wersję `3.0.0` lub `3.1.0` albo dokument v2 nie zawiera pola `$schema`.

Od wersji `4.2.0` schemat nie wymaga już pól tekstowych encji, żadnej listy `doc`, żadnej kolekcji ani samego pola `collections`, które postać zapisu pomija, gdy niczego nie zawierają. Nadal przyjmuje plik zapisany przez wersję `4.0.0` lub `4.1.0`. Wymienia nowe pola: pole `nameViewMode`, które przyjmuje tylko `"logical"` i `"both"`; pola `logicalName` i `nameDerived` tabeli, z których drugie przyjmuje tylko `true`; pola `logicalName` i `domainId` kolumny; oraz trzy słowniki, każdy z nagłówkiem i wierszami ciągów znaków. Pole `canvasType` wymienia kartę Słownik, pole `columnOrder` przyjmuje siedem lub dziewięć liczb całkowitych, a opisy pól `show`, `columnOrder`, `lockSettings` i `options` wymieniają nowe bity.

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
