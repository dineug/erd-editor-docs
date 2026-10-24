---
sidebar_position: 13
description: Generowanie kodu w dwudziestu dwóch formatach docelowych na podstawie diagramu, wybór języka, bazy danych, stylu nazw i cudzysłowu w panelu opcji, sprawdzanie, które formaty docelowe zapisują akcje ON DELETE i ON UPDATE relacji, oraz zapisywanie lub kopiowanie wyniku.
---

# Generator kodu

Przełącz się na kartę `Code Generator` na pasku narzędzi. Karta pokazuje po lewej stronie kod całego dokumentu, a po jego prawej stronie panel opcji z nagłówkiem `Code Generator`, w którym wybierasz język, bazę danych, style nazw oraz, dla niektórych formatów docelowych, cudzysłów.  
Panel otwiera się sam, chyba że przy pierwszym otwarciu karty edytor jest węższy niż 640 px. Przycisk `Hide options` u góry panelu zwija go, a przycisk `Show options` w prawym górnym rogu kodu ponownie go pokazuje. Panel pozostaje otwarty lub zwinięty także po przełączeniu kart, dopóki edytor jest otwarty, niezależnie od panelu karty Schemat SQL, i nigdy nie jest zapisywany w pliku.

Kliknij kod prawym przyciskiem myszy, aby otworzyć jego menu kontekstowe: pozycje `Language`, `Database`, `Table Name Case`, `Column Name Case` i `Bracket` (tylko dla `Doctrine`, `JPA` i `SeaORM`), każda z podmenu, w którym zaznaczona jest bieżąca wartość, następnie pozycja `Options panel`, która zwija lub otwiera panel i jest zaznaczona, gdy panel jest widoczny, oraz `Save file`.  
Gdy ta karta jest otwarta, [Szybkie wyszukiwanie](./quick-search.md) oferuje polecenia `Database`, `Bracket` (tylko dla `Doctrine`, `JPA` i `SeaORM`), `Language`, `Table Name Case` i `Column Name Case` oraz polecenie `Code Generator: Options panel`, które zwija lub otwiera panel.

![Wybieranie języka TypeScript, a potem Rust, w menu kontekstowym kodu, przełączanie nazw kolumn na Snake w panelu opcji i kopiowanie kodu](/img/demo-code-generator.webp)

Ten sam widok kodu jest również kartą `Code Generator` panelu [Właściwości tabeli](./table-related-functions.md#table-properties), gdzie generuje kod dla tej jednej tabeli zamiast dla całego dokumentu. Nie ma tam panelu opcji, a jego menu kontekstowe zmienia te same ustawienia, ale nie ma pozycji `Options panel` ani `Save file`.  
Tam, gdzie kod całego dokumentu zaczyna się od importów lub nagłówka, kod jednej tabeli zaczyna się od tych, których ta tabela potrzebuje, takich jak `<?php` dla `PHP`, `import Foundation` dla `Swift` lub `$schema` dla `JSON Schema`.

Kod jest generowany przy otwarciu karty i ponownie przy każdej zmianie języka, bazy danych, stylu nazw lub cudzysłowu. Zmiana diagramu wprowadzona, gdy karta jest otwarta, na przykład przez współpracownika lub agenta kodującego, pojawia się dopiero, gdy opuścisz kartę i do niej wrócisz albo gdy zmieni się jedno z tych ustawień.

## Panel opcji {#options-panel}

Pod podpisem `Saved in the document` panel zawiera opcje `Language`, `Database`, `Table Name Case` i `Column Name Case`, a po nich opcję `Bracket`, gdy językiem jest `Doctrine`, `JPA` lub `SeaORM`. Każda z nich jest listą rozwijaną, a jej zmiana od razu generuje kod na nowo.  
Gdy wybrany język ignoruje opcję `Database` lub style nazw, pozostają one w panelu, przyciemnione, z dopiskiem takim jak `Not used by DBML` pod spodem, i nadal można je zmienić.  
Przyciski `Save file` i `Copy` znajdują się u dołu panelu – zobacz sekcję [Zapisywanie lub kopiowanie wyniku](#saving-or-copying-the-result).

Są to własne ustawienia diagramu, te same, które zmieniają również menu kontekstowe i Szybkie wyszukiwanie. Opcja `Database` jest zapisywana w pliku jak każda zmiana.  
Opcje `Language`, `Table Name Case`, `Column Name Case` i `Bracket` są zapisywane tylko wtedy, gdy ich blokada na karcie Ustawienia jest wyłączona (dla opcji `Bracket` jest to blokada `Bracket Type`), a nowy diagram ma włączone wszystkie blokady. Gdy blokada jest włączona, zmiana generuje na nowo kod widoczny na ekranie, ale plik zachowuje zablokowaną wartość i diagram ponownie otwiera się właśnie z nią. Panel w żaden sposób nie sygnalizuje blokady; aby zachować wybór w pliku, wyłącz jego blokadę – zobacz sekcję [Blokada](./settings.md#lock).

## Język {#language}

Obsługiwane są dwadzieścia dwa formaty docelowe, wymienione w trzech grupach – języki, biblioteki ORM, a potem schematy – każda w kolejności alfabetycznej. Lista w panelu i menu kontekstowe oddzielają grupy linią, ale żadnej z nich nie nazywają:

| Format docelowy | Grupa | Relacje | Indeksy | ON DELETE / ON UPDATE | Zapisywany jako |
| --- | --- | --- | --- | --- | --- |
| `C#` | Język | — | — | — | `.cs` |
| `Go` | Język | — | — | — | `.go` |
| `Java` | Język | — | — | — | `.java` |
| `Kotlin` | Język | — | — | — | `.kt` |
| `PHP` | Język | — | — | — | `.php` |
| `Rust` | Język | — | — | — | `.rs` |
| `Scala` | Język | — | — | — | `.scala` |
| `Swift` | Język | — | — | — | `.swift` |
| `TypeScript` | Język | — | — | — | `.ts` |
| `Doctrine` | ORM | ✓ | ✓ | Tylko ON DELETE | `.php` |
| `Drizzle` | ORM | ✓ | ✓ | ✓ | `.ts` |
| `JPA` | ORM | ✓ | — | — | `.java` |
| `SeaORM` | ORM | ✓ | Tylko unikatowe | ✓ | `.rs` |
| `Sequelize` | ORM | ✓ | ✓ | ✓ | `.ts` |
| `SQLAlchemy` | ORM | ✓ | ✓ | ✓ | `.py` |
| `TypeORM` | ORM | ✓ | ✓ | ✓ | `.ts` |
| `AML` | Schemat | ✓ | ✓ | ✓ | `.aml` |
| `DBML` | Schemat | ✓ | ✓ | ✓ | `.dbml` |
| `GraphQL` | Schemat | ✓ | — | — | `.graphql` |
| `JSON Schema` | Schemat | — | — | — | `.json` |
| `Mermaid` | Schemat | ✓ | — | — | `.mmd` |
| `Zod` | Schemat | — | — | — | `.ts` |

Domyślnym formatem jest `GraphQL`. Każdy format docelowy generuje kolumny; znaczniki ✓ pokazują, co jeszcze generuje.  
Tabele są generowane w kolejności nazw zamiast w kolejności, w jakiej leżą na kanwie, a indeksy to te wymienione na karcie `Indexes` panelu [Właściwości tabeli](./table-related-functions.md#indexes), nie wiersze `Keys` nad nimi. `SeaORM` zapisuje tylko indeksy unikatowe, a `Mermaid` oznacza kolumnę unikatową jako `UK`, ale nie zapisuje żadnego indeksu.  
Każdy format docelowy oprócz `Java`, `AML`, `DBML` i `Mermaid` zapisuje kolumnę klucza podstawowego jako NOT NULL niezależnie od tego, czy ma ona ustawioną opcję `Not Null`. `Java` nie oznacza żadnej kolumny ani jako dopuszczającej wartość NULL, ani jako niedopuszczającej, a `AML`, `DBML` i `Mermaid` zachowują flagę taką, jaką ma ona w diagramie.

Co zapisują niektóre formaty docelowe:

- `PHP`: zwykłe klasy z typowanymi właściwościami publicznymi, zaczynające się od `<?php` i `declare(strict_types=1);`.
- `Doctrine`: encje Doctrine ORM 3 z atrybutami, dla DBAL w wersji 4.2 lub nowszej, każda kolumna z jej typem DBAL i opcjami dla wybranej bazy danych.
- `Rust`: jedna struktura `pub struct` na tabelę, z typami zapisanymi pełną ścieżką, takimi jak `chrono::NaiveDateTime` lub `rust_decimal::Decimal`, bez wiersza `use`.
- `SeaORM`: encje SeaORM 2.0 w formacie dense, każda tabela jako moduł `pub mod`, dzięki czemu cały tekst kompiluje się jako jeden plik.
- `Swift`: jedna struktura `Codable`, `Hashable`, `Sendable` na tabelę, wymagająca języka Swift w wersji 6.1 lub nowszej.
- `TypeScript`: jeden interfejs `export interface` na tabelę, który opisuje wiersz jako JSON, tak jak schemat `Zod` – data lub godzina jest typu `string`, a kolumna dopuszczająca wartość NULL ma typ `T | null`.
- `Zod`: jeden schemat wiersza Zod 4 na tabelę i wywnioskowany z niego typ, bez schematu wstawiania i bez relacji.
- `JSON Schema`: jeden dokument JSON Schema draft 2020-12, ze schematem wiersza dla każdej tabeli pod kluczem `$defs`.
- `Mermaid`: diagram `erDiagram`, taki, jaki renderuje GitHub, w którym każda tabela jest encją wymieniającą każdą kolumnę z jej typem i ewentualnym oznaczeniem `PK`, `FK` lub `UK`, a każda relacja – linią między jej dwiema tabelami.

`AML`, `DBML` i `GraphQL` to formaty dwukierunkowe: każdy z nich jest też źródłem importu. Zobacz stronę [Importowanie i eksportowanie plików](./file-import-export.md). Pozostałe schematy, `JSON Schema`, `Mermaid` i `Zod`, są tylko formatami wyjściowymi.  
`DBML` zapisuje kolor każdej tabeli jako `headercolor` oraz, w kodzie całego dokumentu, blok `TableGroup` po definicjach `Ref` dla każdej [grupy tabel](./table-groups.md), która zawiera tabelę. `AML` zapisuje kolor tabeli jako najbliższą spośród nazw kolorów AML.

## ON DELETE i ON UPDATE {#on-delete-and-on-update}

Akcje ON DELETE i ON UPDATE relacji ustawia się w jej menu kontekstowym – zobacz sekcję [ON DELETE i ON UPDATE](./relationship-editing.md#on-delete-and-on-update).  
Formaty docelowe ze znacznikiem ✓ w kolumnie `ON DELETE / ON UPDATE` tabeli w sekcji [Język](#language) zapisują akcje ustawione w relacji; akcja pozostawiona na wartości `Not set` niczego nie zapisuje.  
To, które akcje zachowują formaty docelowe ORM, zależy od wybranej bazy danych, natomiast `AML` i `DBML` zachowują je wszystkie – zobacz sekcję [Baza danych](#database).

- `Doctrine` zapisuje tylko ON DELETE, ponieważ w Doctrine nie ma ON UPDATE. Dodaje `onDelete: 'CASCADE'` do każdego atrybutu `#[ORM\JoinColumn]` relacji `ManyToOne` lub `OneToOne` po stronie właścicielskiej, na przykład `#[ORM\JoinColumn(name: 'user_id', referencedColumnName: 'id', nullable: false, onDelete: 'CASCADE')]`, a do `OneToMany` lub `OneToOne` po stronie odwrotnej nie dodaje niczego. Relacja do kolumny unikatowej, która nie jest kluczem podstawowym, pozostaje zwykłymi kolumnami, które Doctrine mapuje bez asocjacji, więc nie jest dla niej zapisywana żadna akcja.
- `Drizzle` zapisuje je małymi literami. W wywołaniu `.references()` są to opcje, na przykład `{ onDelete: "cascade", onUpdate: "set null" }`; w wywołaniu `foreignKey()`, generowanym dla klucza wielokolumnowego, są łączone w łańcuch, na przykład `.onDelete("restrict").onUpdate("no action")`.
- `SeaORM` zapisuje je w relacji `belongs_to` tabeli podrzędnej, najpierw ON UPDATE, pod nazwami używanymi przez SeaORM: `NoAction`, `Cascade`, `SetNull`, `SetDefault` i `Restrict`, na przykład `on_update = "Cascade", on_delete = "SetNull"`. Relacja `has_one` lub `has_many` tabeli nadrzędnej nie dostaje żadnej.
- `Sequelize` zapisuje wpisy `onDelete: "CASCADE"` i `onUpdate` w obu wywołaniach asocjacji: `hasMany` lub `hasOne` oraz `belongsTo`. Klucz wielokolumnowy nie dostaje wywołań asocjacji, więc `Sequelize` nie zapisuje dla niego akcji.
- `SQLAlchemy` przekazuje argumenty `ondelete="CASCADE"` i `onupdate` do `ForeignKey()` w przypadku klucza jednokolumnowego, a do `ForeignKeyConstraint()` w przypadku klucza wielokolumnowego.
- `TypeORM` zapisuje opcje `onDelete: "CASCADE"` i `onUpdate` w dekoratorze `@ManyToOne` lub `@OneToOne` po stronie właścicielskiej, nigdy po stronie odwrotnej. Zawsze pomija `SET DEFAULT`, ponieważ TypeORM zapisałby tę akcję jako `DEFAULT`, czego nie akceptuje żadna baza danych.
- `DBML` dodaje ustawienia do definicji `Ref`, na przykład `[delete: set null, update: no action]`.
- `AML` zapisuje relację, która ma akcję, jako osobną instrukcję `rel` z właściwościami, na przykład `{onDelete: cascade, onUpdate: "set null"}`, zamiast zapisywać ją bezpośrednio przy jej kolumnie.

`JPA` nie zapisuje żadnej: czysta specyfikacja JPA nie ma dla nich opcji, a generator nie używa adnotacji `@OnDelete` z Hibernate. `Mermaid` również nie zapisuje żadnej, ponieważ w linii diagramu `erDiagram` nie ma na nie miejsca.  
Na karcie `Code Generator` we Właściwościach tabeli, która pokazuje jedną tabelę, `DBML` nie zapisuje definicji `Ref`, a `AML` – instrukcji `rel`, więc żaden z nich nie pokazuje tam akcji; `AML` pozostawia relację jednokolumnową, która ma akcje, bezpośrednio przy jej kolumnie, tak samo jak relację bez akcji. `Mermaid` w ogóle nie zapisuje tam linii relacji. `Doctrine` i `SeaORM` zapisują tam tę samą encję co w całym dokumencie, łącznie z akcjami.

## Styl nazw {#name-case}

Każda z opcji `Table Name Case` i `Column Name Case` obsługuje wartości `Pascal`, `Camel`, `Snake` i `None`.  
Wartości domyślne to `Pascal` dla nazw tabel i `Camel` dla nazw kolumn. Wartość `None` generuje nazwę w takiej postaci, w jakiej jest zapisana w diagramie.  
Przy każdym stylu nazwa zarezerwowana przez język formatu docelowego jest zapisywana ze znakiem ucieczki tam, gdzie ten język to umożliwia, na przykład `@class` w `C#` lub `r#type` w `Rust`, a tam, gdzie nie umożliwia, jest zmieniana, na przykład na `class_` w `Java`.

`AML`, `DBML` i `Mermaid` ignorują oba ustawienia i zawsze generują nazwy z diagramu.  
`SeaORM` również je ignoruje: nazywa pola i moduły w stylu snake case, czyli w postaci, którą SeaORM odczytuje z powrotem, a przechowywane nazwy podaje w `table_name` oraz, gdy się różnią, w `column_name`.  
Dla tych czterech formatów docelowych panel przyciemnia obie listy i wyświetla pod nimi dopisek `Not used by`.

Każdy format docelowy zapisuje nazwy fizyczne niezależnie od tego, co pokazuje [Widok nazw](./logical-names.md#name-view).  
Żaden nie zapisuje nazwy logicznej, nawet do pustego komentarza: ta karta nie ma odpowiednika przełącznika [`Write logical names into empty comments`](./schema-sql.md#logical-names-as-comments) z karty Schemat SQL.  
Żaden nie zapisuje też domeny: kolumna powiązana z domeną jest zapisywana ze swoim typem danych, jak każda inna kolumna.

## Baza danych {#database}

Typy danych są ustalane na podstawie wybranej bazy danych – zobacz sekcję [Bazy danych](./table-related-functions.md#databases).  
Na tej karcie wybierz ją z listy `Database` w panelu, z pozycji `Database` w menu kontekstowym lub w Szybkim wyszukiwaniu, a kod od razu jest generowany na nowo. Jest to jedyne ustawienie bazy danych w diagramie, to samo, które ustawiają menu kontekstowe kanwy i karta [Schemat SQL](./schema-sql.md), więc zmiana wprowadzona tutaj jest widoczna również tam.  
`Drizzle` bierze swój dialekt z tego samego ustawienia: `pgTable` dla PostgreSQL, `mysqlTable` dla MySQL i MariaDB, `sqliteTable` dla SQLite i `pgTable` dla każdej innej bazy danych.  
`SeaORM` zapisuje `column_type` tam, gdzie SeaORM w przeciwnym razie utworzyłby inny typ kolumny w PostgreSQL, MySQL, MariaDB lub SQLite, a w MSSQL, Oracle, Snowflake lub Databricks, dla których SeaORM nie ma backendu, nie zapisuje go wcale.

Wybrana baza danych decyduje też o tym, które akcje ON DELETE i ON UPDATE zapisują formaty docelowe ORM.  
`Doctrine`, `SeaORM`, `Sequelize`, `SQLAlchemy` i `TypeORM` pomijają każdą akcję, którą pomija Schemat SQL tej bazy danych, na przykład `SET DEFAULT` w MySQL i MariaDB, `RESTRICT` w MSSQL lub każdą akcję oprócz `NO ACTION` w Snowflake i Databricks, więc obowiązuje domyślna akcja bazy danych. Pełną listę zawiera sekcja [ON DELETE i ON UPDATE](./relationship-editing.md#on-delete-and-on-update).  
`Drizzle` kieruje się natomiast dialektem, który zapisuje: kod `mysqlTable` pomija `SET DEFAULT`, a kod `pgTable` i `sqliteTable` zachowuje każdą akcję, łącznie z kodem `pgTable`, który `Drizzle` zapisuje dla MSSQL, Oracle, Snowflake i Databricks.

Wyjątkiem są `AML`, `DBML` i `Mermaid`: generują każdy typ danych w takiej postaci, w jakiej jest zapisany w diagramie, więc ustawienie bazy danych nie zmienia ich wyniku, a panel przyciemnia dla nich opcję `Database`. `AML` i `DBML` zapisują każdą akcję ustawioną w relacji, a `Mermaid` nie zapisuje żadnej.

## Cudzysłów {#bracket}

Opcja `Bracket` jest dostępna w panelu, menu kontekstowym i Szybkim wyszukiwaniu tylko wtedy, gdy językiem jest `Doctrine`, `JPA` lub `SeaORM`.  
Jest to to samo ustawienie co cudzysłów na karcie Schemat SQL – zobacz stronę [Schemat SQL](./schema-sql.md#database-and-bracket) – więc zmiana wprowadzona tutaj zmienia również sposób, w jaki Schemat SQL ujmuje nazwy w cudzysłów. Oferuje wartości `SingleQuote`, `DoubleQuote`, `Backtick` i `None`, a początkowo ma wartość `None`.

- `Doctrine`: przy każdym cudzysłowie oprócz `None` każda nazwa tabeli, kolumny i kolumny złączenia jest ujmowana w grawisy, bo w ten sposób Doctrine oznacza nazwę do ujęcia w cudzysłów, na przykład ``#[ORM\Table(name: '`order`')]``. Przy `None` ujmowana jest tylko nazwa, która tego wymaga: słowo zarezerwowane przez bazę danych, nazwa, która nie jest zwykłym identyfikatorem ASCII, lub nazwa wpisana w cudzysłowie.
- `JPA`: przy każdym cudzysłowie oprócz `None` nazwa tabeli będąca słowem zarezerwowanym jest ujmowana w cudzysłów wewnątrz `@Table`, na przykład `@Table(name = "\"user\"")`. Przy `None` pozostaje bez cudzysłowu, tak jak pozostawia ją Schemat SQL.
- `SeaORM`: przy `None` nazwy są zapisywane tak, jak przechowuje je baza danych: nazwa tabeli z kropką jest dzielona na `schema_name` i `table_name`, a w PostgreSQL nazwa bez cudzysłowu jest zamieniana na małe litery. Przy każdym innym cudzysłowie nazwa jest zachowywana w całości, w takiej postaci, w jakiej ją wpisano.

## Zapisywanie lub kopiowanie wyniku {#saving-or-copying-the-result}

Polecenie `Save file`, dostępne u dołu panelu opcji lub w menu kontekstowym, zapisuje wyświetlany kod jako plik.  
Plik jest nazywany tak jak każdy eksport, `<database name>-<timestamp>`, z dopisanym rozszerzeniem podanym w tabeli w sekcji [Język](#language), na przykład `shop-2026-10-12T04_05_06.ts`, i trafia tam, gdzie każdy eksport w aplikacji hosta – zobacz sekcję [Eksportowanie](./file-import-export.md#exporting). `Java` i `JPA` umieszczają wszystkie klasy w jednym pliku `.java`, tak jak pokazuje je karta.  
W menu Export nie ma pozycji Code Generator, a karta `Code Generator` we Właściwościach tabeli nie pozwala zapisać pliku.

Aby skopiować kod, kliknij przycisk `Copy` u dołu panelu albo najedź wskaźnikiem na kod i kliknij przycisk kopiowania w jego prawym górnym rogu, co jest jedynym sposobem we Właściwościach tabeli.  
Powiadomienie `Copied!` ze znacznikiem wyboru potwierdza to przez dwie sekundy. Jeśli przeglądarka lub host odmówi dostępu do schowka, zamiast tego przez pięć sekund informuje o tym powiadomienie `Couldn't copy to the clipboard` ze znakiem ostrzeżenia. Ponowne skopiowanie zastępuje powiadomienie, zamiast dodawać kolejne.  
Tekst można też zaznaczyć, więc możesz skopiować tylko potrzebną część.
