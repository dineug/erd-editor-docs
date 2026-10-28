---
sidebar_position: 12
description: Odczytywanie kodu DDL diagramu na karcie Schemat SQL, wybór bazy danych, cudzysłowu, instrukcji, nagłówka, nazw logicznych w pustych komentarzach i tabel w jej panelu opcji, dodawanie własnych skryptów przed tabelami i po nich oraz zapisywanie lub kopiowanie kodu SQL.
---

# Schemat SQL

Karta `Schema SQL` pokazuje kod DDL diagramu dla wybranej bazy danych: kod SQL, który tworzy jego tabele wraz z ich kluczami, indeksami i kluczami obcymi.  
Przełącz się na kartę `Schema SQL` na pasku narzędzi lub wybierz pozycję `Schema SQL` w grupie `Tab` w palecie [Szybkie wyszukiwanie](./quick-search.md). Wybranie pozycji `Schema SQL` z podmenu `Export` również ją otwiera, od razu gotową do zapisania – zobacz sekcję [Zapisywanie lub kopiowanie kodu SQL](#saving-or-copying-the-sql).

Kod SQL znajduje się po lewej stronie, a po jego prawej stronie panel opcji z nagłówkiem `Schema SQL` zawiera ustawienia, które określają postać tego kodu – zobacz sekcję [Panel opcji](#options-panel). Również w języku wyświetlania zapisywanym od prawej do lewej kod SQL pozostaje po lewej stronie i czyta się go od lewej do prawej.  
Panel otwiera się sam, chyba że przy pierwszym otwarciu karty edytor jest węższy niż 640 px. Przycisk `Hide options` w nagłówku panelu zwija go, a przycisk `Show options` w prawym górnym rogu kodu ponownie go pokazuje. Następnie panel pozostaje otwarty lub zwinięty tak, jak go zostawisz, także po przełączeniu kart, dopóki edytor jest otwarty. Zwija się i otwiera niezależnie od panelu karty Generator kodu i nigdy nie jest zapisywany w pliku.

![Otwieranie Export > Schema SQL, przełączanie instrukcji na Drop & re-create i nagłówka na USE, a następnie dodawanie skryptu SET NAMES przed tabelami](/img/demo-schema-sql-options.webp)

Kliknij kod SQL prawym przyciskiem myszy, aby otworzyć jego menu kontekstowe:

- Pozycje `Database` i `Bracket`, każda z nich to podmenu z zaznaczoną bieżącą wartością.
- Pozycje `Statements` i `Header`, każda z nich to podmenu z zaznaczoną obowiązującą opcją. Opcja, której baza danych nie obsługuje, ma przygaszony dopisek, taki jak `not in Oracle`, i nic nie robi.
- Pozycja `Options panel`, która zwija lub otwiera panel i jest zaznaczona, gdy panel jest widoczny.
- `Save file`

Gdy ta karta jest otwarta, Szybkie wyszukiwanie oferuje polecenia `Database` i `Bracket`; polecenia `Schema SQL: Statements` i `Schema SQL: Header`, które wyświetlają tylko opcje obsługiwane przez bazę danych; a także polecenie `Schema SQL: Options panel`, które zwija lub otwiera panel.  
Ani menu kontekstowe, ani Szybkie wyszukiwanie nie oferuje przełącznika `Write logical names into empty comments`, który znajduje się wyłącznie w panelu opcji – zobacz sekcję [Nazwy logiczne jako komentarze](#logical-names-as-comments).

Kod SQL jest generowany przy otwarciu karty i ponownie przy każdej zmianie jednej z opcji panelu, nazwy bazy danych lub skryptu. Zmiana tabel wprowadzona, gdy karta jest otwarta, na przykład przez współpracownika lub agenta kodującego, pojawia się dopiero, gdy opuścisz kartę i do niej wrócisz albo gdy zmieni się jedna z tych rzeczy.

[Właściwości tabeli](./table-related-functions.md#table-properties) mają własną kartę `Schema SQL`, która pokazuje kod DDL jednej tabeli. Karta ta zawsze zapisuje zwykłe instrukcje `CREATE` bez nagłówka i skryptów, nigdy nie wpisuje nazwy logicznej do pustego komentarza, nie ma panelu opcji, a jej menu kontekstowe oferuje tylko pozycje `Database` i `Bracket`.

## Panel opcji {#options-panel}

Panel zawiera trzy grupy, każdą pod własnym podpisem:

1. `Saved in the document`: `Database` i `Bracket` – zobacz sekcję [Baza danych i cudzysłów](#database-and-bracket). Edytor tylko do odczytu podpisuje je `This window only` – zobacz sekcję [Edytory tylko do odczytu](#read-only-editors).
2. `This window only`: `Statements`, `Header`, `Write logical names into empty comments` oraz, gdy diagram ma [grupę tabel](./table-groups.md), `Tables` – zobacz sekcje [Instrukcje](#statements), [Nagłówek](#header), [Nazwy logiczne jako komentarze](#logical-names-as-comments) i [Tabele](#tables).
3. `Saved in the document · written as is for every database`: skrypty `Before tables` i `After tables` – zobacz sekcję [Skrypty przed tabelami i po nich](#before-and-after-scripts).

Przyciski `Save file` i `Copy` znajdują się u jego dołu – zobacz sekcję [Zapisywanie lub kopiowanie kodu SQL](#saving-or-copying-the-sql).

Opcje w grupie `This window only` należą do okna edytora, w którym je ustawiono. Nie są zapisywane w dokumencie, udostępniane współpracownikom ani rejestrowane w historii cofania, a po zamknięciu lub ponownym wczytaniu edytora wracają do wartości początkowych; przełączanie kart je zachowuje.  
Opcja `Statements` ma początkowo wartość `If not exists`, opcja `Header` – `CREATE + USE`, a przełącznik `Write logical names into empty comments` jest wyłączony. Kod SQL, który strona osadzająca edytor odczytuje za pomocą [`getSchemaSQL()`](../../api/erd-editor-element.md#getschemasql), oraz kod SQL [odczytywany przez agenta kodującego](../../mcp/tools.md#reading-a-document) zaczynają natomiast od `Create` bez nagłówka i nie zapisują nazw logicznych, chyba że się o to poprosi.

Opcja, której wybrana baza danych nie obsługuje, pozostaje w panelu, przyciemniona, z podpowiedzią `Not in <database>`, na przykład `Not in Oracle`, a jej naciśnięcie nic nie robi.  
Kod SQL używa wtedy najbliższej postaci obsługiwanej przez bazę danych, a przycisk tej postaci jest wyświetlany jako wciśnięty: zamiast `If not exists` używana jest opcja `Create`, zamiast `CREATE + USE` – `USE` albo `None`, jeśli baza danych nie obsługuje również `USE`, a zamiast `USE` – `None`. Twój wybór zostaje zachowany, więc po przełączeniu na bazę danych, która go obsługuje, znów obowiązuje.

## Baza danych i cudzysłów {#database-and-bracket}

Opcja `Database` to baza danych diagramu, to samo ustawienie co pozycja `Database` w menu kontekstowym kanwy i baza danych w Generatorze kodu – zobacz sekcję [Bazy danych](./table-related-functions.md#databases). Oferuje Databricks, MSSQL, MariaDB, MySQL, Oracle, PostgreSQL, Snowflake i SQLite, początkowo ma wartość MySQL i jest zapisywana w pliku jak każda zmiana.

Opcja `Bracket` ustala cudzysłów, w który ujmowane są nazwy tabel, kolumn, ograniczeń i indeksów: `SingleQuote`, `DoubleQuote`, `Backtick` lub domyślna wartość `None`, która w ogóle nie ujmuje nazw w cudzysłów. Jest to ustawienie wspólne z Generatorem kodu – zobacz sekcję [Cudzysłów](./code-generator.md#bracket).  
Snowflake, który ujmuje nazwy wyłącznie w cudzysłowy podwójne, używa ich przy każdej opcji oprócz `None`, a Databricks zawsze ujmuje nazwy w grawisy.  
Opcja `Bracket` jest zapisywana w pliku tylko wtedy, gdy blokada `Bracket Type` na karcie Ustawienia jest wyłączona, a nowy diagram ma włączone wszystkie blokady. Gdy blokada jest włączona, zmiana generuje na nowo kod SQL widoczny na ekranie, ale plik zachowuje zablokowaną wartość i po ponownym otwarciu diagram ma właśnie ją – zobacz sekcję [Blokada](./settings.md#lock).

Gdy bazą danych jest Oracle, a kod SQL zawiera nazwę dłuższą niż 30 bajtów, której nie akceptują Oracle 12.1 ani starsze wersje, komunikat pod obiema listami wymienia każdą taką nazwę: `Oracle 12.2+ for names over 30 bytes: <names>`. Sprawdzane są nazwy tabel, kolumn, schematów, kluczy, indeksów, sekwencji i wyzwalaczy. Sam kod SQL się nie zmienia.

## Instrukcje {#statements}

Opcja `Statements` określa, jak tworzone są tabele:

- Opcja `Create` zapisuje zwykłe instrukcje `CREATE`.
- Opcja `If not exists` pomija tabele i indeksy, które już istnieją. Obsługują ją MySQL, MariaDB, PostgreSQL, SQLite i Databricks; MSSQL, Oracle i Snowflake zapisują zamiast niej `Create`.
  - MySQL zapisuje każdą tabelę jako `CREATE TABLE IF NOT EXISTS` z jej ograniczeniami unikatowości, indeksami i kluczami obcymi wewnątrz tej instrukcji, a całość umieszcza między `SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;` a `SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;`.
  - MariaDB dodaje `IF NOT EXISTS` w każdej instrukcji: w `CREATE TABLE`, w każdym ograniczeniu `UNIQUE` i `FOREIGN KEY` oraz w każdej instrukcji `CREATE INDEX`.
  - PostgreSQL zapisuje `CREATE TABLE IF NOT EXISTS` i `CREATE INDEX IF NOT EXISTS`, a każdy klucz obcy usuwa za pomocą `DROP CONSTRAINT IF EXISTS`, zanim doda go ponownie.
  - SQLite zapisuje `CREATE TABLE IF NOT EXISTS` i `CREATE INDEX IF NOT EXISTS`.
  - Databricks zapisuje `CREATE TABLE IF NOT EXISTS`, a każdy klucz obcy usuwa za pomocą `DROP CONSTRAINT IF EXISTS`, zanim doda go ponownie.
- Opcja `Drop & re-create` usuwa każdą zapisywaną tabelę przed jej ponownym utworzeniem, z wyjątkiem Snowflake. Obsługuje ją każda baza danych:
  - MySQL i MariaDB zapisują `DROP TABLE IF EXISTS` dla każdej tabeli, między tymi samymi dwoma wierszami, które wyłączają i ponownie włączają sprawdzanie kluczy obcych.
  - PostgreSQL zapisuje jedną instrukcję `DROP TABLE IF EXISTS` wymieniającą wszystkie tabele, która kończy się błędem, jeśli do którejś z nich odwołuje się tabela spoza listy. Przy nagłówku `CREATE + USE` tabela, której nazwa nie podaje schematu, jest usuwana z tego schematu, na przykład `shop.member`.
  - MSSQL zapisuje jedną transakcję, która wymaga wersji SQL Server 2016 lub nowszej, o czym informuje podpowiedź przycisku `SQL Server 2016+`. Usuwa klucze obce należące do zapisywanych tabel, następnie same tabele jedną instrukcją `DROP TABLE IF EXISTS`, a w razie błędu wycofuje transakcję. Klucz obcy należący do tabeli spoza listy nadal blokuje usunięcie.
  - SQLite zapisuje `PRAGMA foreign_keys=OFF;`, przez co klucze obce pozostają wyłączone dla tego połączenia, a następnie `DROP TABLE IF EXISTS` dla każdej tabeli.
  - Oracle zapisuje `DROP TABLE … CASCADE CONSTRAINTS` dla każdej tabeli i `DROP SEQUENCE` dla każdej sekwencji autoinkrementacji, każdą instrukcję w bloku PL/SQL, który kończy się wierszem `/` i ignoruje błąd zgłaszany, gdy tabela lub sekwencja nie istnieje.
  - Databricks zapisuje `DROP TABLE IF EXISTS` dla każdej tabeli.
  - Snowflake niczego nie usuwa i zamiast tego zapisuje `CREATE OR REPLACE TABLE`.

Gdy obowiązuje opcja `Drop & re-create`, ostrzeżenie w panelu wymienia usuwane przez nią tabele: `Drops <tables> before creating them. Their rows are lost.`, a w przypadku Snowflake `Replaces <tables>. Their rows are lost.`  
Jeśli tabel jest najwyżej pięć, wymieniane są wszystkie z nazwy. Gdy jest ich więcej niż pięć, ostrzeżenie wymienia pierwsze cztery i podaje liczbę pozostałych, na przykład `a, b, c, d, and 3 more tables`.

## Nagłówek {#header}

Opcja `Header` rozpoczyna kod SQL instrukcjami, które tworzą lub wybierają bazę danych albo schemat, w którym kod ten jest wykonywany. Nazwą jest nazwa bazy danych diagramu, wpisana w polu `database name` na pasku narzędzi, i jest ona ujmowana w cudzysłów wybrany w opcji `Bracket`.

- MySQL i MariaDB: `USE` zapisuje `USE shop;`, a `CREATE + USE` zapisuje przed tą instrukcją `CREATE DATABASE IF NOT EXISTS shop;`.
- MSSQL: `USE` zapisuje `USE shop` i `GO`, a `CREATE + USE` zapisuje przed nimi `IF DB_ID(N'shop') IS NULL CREATE DATABASE shop` i `GO`.
- PostgreSQL obsługuje tylko opcję `CREATE + USE`, która zapisuje `CREATE SCHEMA IF NOT EXISTS shop;` i `SET search_path TO shop, public;`.
- Oracle obsługuje tylko opcję `USE`, która zapisuje `ALTER SESSION SET CURRENT_SCHEMA = shop;`. Zamiast `CREATE + USE` używana jest właśnie ona, więc to ten wiersz Oracle zapisuje przy domyślnym nagłówku karty.
- Snowflake i Databricks: `USE` zapisuje `USE SCHEMA shop;`, a `CREATE + USE` zapisuje przed tą instrukcją `CREATE SCHEMA IF NOT EXISTS shop;`.
- SQLite nie obsługuje żadnej z nich i nie zapisuje nagłówka.

Jeśli baza danych obsługuje `USE` lub `CREATE + USE`, podpowiedź przycisku podaje, co zapisuje on w tej bazie danych, na przykład `CREATE SCHEMA + SET search_path` w PostgreSQL.

Nagłówek jest zapisywany tylko wtedy, gdy nazwa bazy danych jest prostym identyfikatorem: pierwszym znakiem jest litera ASCII (`A`–`Z`, `a`–`z`) lub `_`, a po nim następują litery ASCII, cyfry lub `_`.  
Przy każdej innej nazwie, także pustej, nagłówek nie jest zapisywany, a instrukcja `DROP TABLE` w PostgreSQL nie podaje wtedy schematu. Gdy obowiązuje nagłówek inny niż `None`, informuje o tym komunikat pod opcją `Header`: `Database name "<name>" is not a valid identifier.`  
Nowy diagram ma pustą nazwę bazy danych, więc dopóki jej nie wpiszesz, panel wyświetla komunikat `Database name "" is not a valid identifier.`

## Nazwy logiczne jako komentarze {#logical-names-as-comments}

Przełącznik `Write logical names into empty comments` w grupie `This window only` wpisuje do kodu DDL [nazwę logiczną](./logical-names.md) tabeli lub kolumny tam, gdzie jej komentarz jest pusty, w każdej bazie danych.

![Włączanie Write logical names into empty comments w panelu karty Schemat SQL, co wpisuje nazwę logiczną każdej kolumny tabeli order_items do jej pustego COMMENT, podczas gdy komentarze tabeli members pozostają bez zmian](/img/demo-schema-sql-logical-names.webp)

- Komentarz z tekstem zawsze ma pierwszeństwo: nazwa logiczna nigdy go nie zastępuje ani nie jest do niego dodawana.
- Komentarz składający się tylko z białych znaków jest traktowany jako pusty, więc w jego miejscu wpisywana jest nazwa logiczna. Nazwa logiczna, która jest pusta lub składa się tylko z białych znaków, niczego nie wpisuje, a ta tabela lub kolumna nadal nie otrzymuje komentarza.
- Nazwa logiczna jest zapisywana w tym miejscu i w tej postaci, w jakich baza danych zapisuje komentarz, a znajdujące się w niej znaki cudzysłowu są zapisywane ze znakiem ucieczki w ten sam sposób – zobacz sekcję [Komentarze](#comments).

Na przykład w MySQL kolumna `id` z nazwą logiczną `Member ID` i bez komentarza jest zapisywana z `COMMENT 'Member ID'`, natomiast kolumna `email` z nazwą logiczną `Email` i komentarzem `Sign-in address` zachowuje `COMMENT 'Sign-in address'`.

Podobnie jak opcje `Statements` i `Header`, ten przełącznik należy do okna i jest początkowo wyłączony – zobacz sekcję [Panel opcji](#options-panel).  
Import nigdy nie odczytuje takiego komentarza z powrotem jako nazwy logicznej – zobacz sekcję [Komentarze](./file-import-export.md#comments).

## Tabele {#tables}

Gdy diagram ma co najmniej jedną [grupę tabel](./table-groups.md), widoczną lub ukrytą, w grupie `This window only` pojawia się opcja `Tables` z polem wyboru dla każdej pozycji:

- Pole `All`, które zaznacza lub odznacza wszystkie pola. Gdy zaznaczone są tylko niektóre, wyświetla stan mieszany.
- Po jednym polu na każdą grupę tabel, w kolejności grup w diagramie, z podpisem w postaci nazwy grupy lub `unnamed` dla grupy bez nazwy, poprzedzonym kropką w kolorze grupy, jeśli grupa ma kolor.
- Pole `No group` dla tabel, które nie należą do żadnej grupy.

Gdy wszystkie pola są zaznaczone, karta zapisuje cały diagram.  
Gdy zaznaczone są tylko niektóre, zapisuje tabele z zaznaczonych pól wraz z ich indeksami i należącymi do nich kluczami obcymi, w tym takimi, które odwołują się do pominiętej tabeli. Skrypty przed tabelami i po nich są nadal zapisywane, a opcja `Drop & re-create`, jej ostrzeżenie i komunikat dla Oracle o długich nazwach obejmują tylko te tabele.  
Gdy żadne pole nie jest zaznaczone, karta nie zapisuje żadnego kodu, a wskazówka nad kodem brzmi `No tables chosen. Check some under Tables.` Przycisk `Save file` zapisuje wtedy pusty plik, a przycisk `Copy` kopiuje pusty tekst.

Podobnie jak w przypadku opcji `Statements` i `Header`, ten wybór należy do okna – zobacz sekcję [Panel opcji](#options-panel).  
Grupa dodana później jest początkowo zaznaczona tylko wtedy, gdy w tym momencie zaznaczone były wszystkie pola. Usunięcie grupy usuwa jej pole, a usunięcie ostatniej grupy ponownie zaznacza wszystko.  
Ten wybór dotyczy tylko tej karty. Nie wpływa na kartę `Schema SQL` we Właściwościach tabeli ani na metodę `getSchemaSQL()`.

## Skrypty przed tabelami i po nich {#before-and-after-scripts}

Pola `Before tables` i `After tables` zawierają własny kod SQL, na przykład instrukcje `CREATE EXTENSION` lub `SET` przed tabelami albo nadawanie uprawnień, widoki i dane początkowe po nich.  
Są zapisywane w dokumencie, jedna para na cały diagram, niezależnie od bazy danych. Każdy z nich trafia do kodu SQL we wpisanej postaci i nigdy nie jest sprawdzany: skrypt przed tabelami – po nagłówku, a przed instrukcjami `DROP` i tabelami, skrypt po tabelach – na samym końcu.

Podziały wierszy są zapisywane jako LF, a puste wiersze przed skryptem i białe znaki po nim są usuwane.  
W MSSQL po skrypcie, którego ostatni wiersz nie jest wierszem `GO` (ani `GO` z liczbą), dodawany jest wiersz `GO`, o czym informuje tekst pod obydwoma polami. W Oracle samodzielnie zakończ blok PL/SQL jego wierszem `/`.

Pola podświetlają składnię SQL i powiększają się wraz z tekstem.  
Zmiana jest stosowana, gdy opuścisz pole, klikając w innym miejscu lub przełączając kartę, i dopiero wtedy zmieniają się kod SQL obok niego oraz dokument. Pole, w które tylko kliknięto, niczego nie zmienia.  
Edycja skryptu zmienia diagram jak każda inna zmiana: jest zapisywana w pliku, widzą ją współpracownicy, a każda zastosowana zmiana stanowi jeden krok w [historii cofania](./undo-redo.md), który można cofnąć na karcie ERD.  
Podczas pisania w polu edytor pozostawia mu obsługę własnych skrótów klawiaturowych, więc `Ctrl + Z` (Windows/Linux) lub `⌘ + Z` (Mac) cofa to, co w nim wpisano, a kopiowanie, wycinanie i wklejanie działają na tekście zamiast na diagramie.  
Szybkie wyszukiwanie i [wyszukiwanie w Eksploratorze](./find-and-replace.md) nadal otwierają się za pomocą swoich skrótów, `Ctrl + K` i `Ctrl + F` (Windows/Linux) lub `⌘ + K` i `⌘ + F` (Mac). Ponieważ `Ctrl + F` lub `⌘ + F` przełącza na kartę ERD, stosuje wprowadzoną zmianę, tak jak każde przełączenie karty.  
Pole bez fokusu klawiatury odzwierciedla zmianę skryptu wprowadzoną przez współpracownika lub [agenta kodującego](../../mcp/tools.md#settings). Pole, w którym się znajdujesz, pokazuje tę zmianę po jego opuszczeniu, o ile nic w nim nie wpiszesz. Jeśli coś wpiszesz, po opuszczeniu pola stosowany jest twój tekst, który zastępuje ich wersję.

## Zapisywanie lub kopiowanie kodu SQL {#saving-or-copying-the-sql}

Polecenie `Save file`, dostępne u dołu panelu i w menu kontekstowym, zapisuje dokładnie ten kod SQL, który pokazuje karta, z jej bieżącą bazą danych, cudzysłowem, instrukcjami, nagłówkiem, komentarzami z nazwami logicznymi, tabelami i skryptami, jako `<database name>-<timestamp>.sql`. Plik jest nazywany i zapisywany tak jak każdy inny eksport – zobacz sekcję [Eksportowanie](./file-import-export.md#exporting).

Polecenie `Export` ▸ `Schema SQL` w menu kontekstowym kanwy lub w Szybkim wyszukiwaniu samo niczego nie zapisuje.  
Przełącza na tę kartę, otwiera panel opcji, nawet jeśli był zwinięty, i ustawia fokus klawiatury na przycisku `Save file`, więc naciśnięcie klawisza `Enter` zapisuje plik.

Przycisk `Copy` u dołu panelu lub przycisk kopiowania, który pojawia się w prawym górnym rogu kodu po najechaniu na kod wskaźnikiem, kopiuje kod SQL.  
Powiadomienie `Copied!` ze znacznikiem wyboru potwierdza to przez dwie sekundy. Jeśli przeglądarka lub host odmówi dostępu do schowka, zamiast tego przez pięć sekund informuje o tym powiadomienie `Couldn't copy to the clipboard` ze znakiem ostrzeżenia. Ponowne skopiowanie zastępuje powiadomienie, zamiast dodawać kolejne.  
Kod SQL można też zaznaczyć, więc możesz skopiować tylko jego fragment.

## Co zawiera kod DDL {#what-the-ddl-writes}

Te reguły obowiązują wszędzie, gdzie edytor zapisuje Schemat SQL: na tej karcie i w jej pliku oraz w kodzie SQL, który odczytuje strona osadzająca edytor lub agent kodujący.  
Karta `Schema SQL` we Właściwościach tabeli stosuje je do jednej tabeli, którą pokazuje. Nie zapisuje sekwencji ani wyzwalacza Oracle, a klucze obce zapisuje tylko dla SQLite, w którym znajdują się one wewnątrz instrukcji `CREATE TABLE`. Nie zapisuje też instrukcji komentarzy, które PostgreSQL, Oracle i MSSQL umieszczają po tabeli, więc w tych trzech bazach danych nie pokazuje komentarzy.

Części występują w tej kolejności, oddzielone jednym pustym wierszem: nagłówek, skrypt przed tabelami, instrukcje `DROP`, tabele i skrypt po tabelach. Tabele są zapisywane w kolejności nazw.  
Dla diagramu bez tabel i bez skryptów nic nie jest zapisywane, nawet jeśli wybrano nagłówek.

Tabele i kolumny są zapisywane pod nazwami fizycznymi niezależnie od tego, co pokazuje [Widok nazw](./logical-names.md#name-view). Kolumna powiązana z domeną jest zapisywana z własnym typem danych, który ustala domena – zobacz sekcję [Domeny i typy danych](./dictionary.md#domains-and-data-types).

### Autoinkrementacja {#auto-increment}

Kolumna oznaczona opcją `Auto Increment` jest zapisywana w sposób właściwy dla każdej bazy danych: `AUTO_INCREMENT` w MySQL i MariaDB, `IDENTITY(1,1)` w MSSQL, `AUTOINCREMENT` w Snowflake i `GENERATED ALWAYS AS IDENTITY` w PostgreSQL i Databricks.  
Dla Oracle zapisywane są sekwencja `SEQ_<table>` i wyzwalacz `SEQ_TRG_<table>`, który wypełnia kolumnę wartościami z tej sekwencji. Wyzwalacz kończy się wierszem `/`, więc SQL\*Plus i SQLcl go wykonują.

Jeśli baza danych nie przyjmuje autoinkrementacji dla typu kolumny, klauzula jest pomijana, a wiersz komentarza po tabeli wskazuje tę kolumnę:

- PostgreSQL przyjmuje ją tylko dla typów `smallint`, `integer` lub `bigint`, pod dowolną z ich nazw: `INT`, `INTEGER`, `BIGINT`, `SMALLINT`, `INT2`, `INT4` lub `INT8`. Kolumna innego typu nie dostaje ani klauzuli, ani wartości domyślnej, a komentarz brzmi na przykład `-- PostgreSQL takes IDENTITY only on smallint, integer or bigint, so member.id is written without it.`
- Databricks przyjmuje ją tylko dla typów `BIGINT` lub `LONG`.
- SQLite przyjmuje `AUTOINCREMENT` tylko dla kolumny, która jest jedynym kluczem podstawowym tabeli i ma typ całkowitoliczbowy, taki jak `INT`, `BIGINT` lub `INT8`, z szerokością lub bez niej. Ta kolumna jest zapisywana jako `INTEGER`, a klucz jako `PRIMARY KEY (id AUTOINCREMENT)`. Jedyny klucz innego typu jest zapisywany bez tej klauzuli.

### Akcje referencyjne {#referential-actions}

To, które akcje ON DELETE i ON UPDATE zapisuje każda baza danych, wymieniono w sekcji [ON DELETE i ON UPDATE](./relationship-editing.md#on-delete-and-on-update).  
Jeśli Snowflake pomija akcję, wskazuje ją komentarz nad instrukcją `ALTER TABLE` tego klucza obcego, na przykład `-- Snowflake creates no foreign key with a referential action other than NO ACTION, so ON DELETE CASCADE is left out.`

### Nazwy tabel kwalifikowane schematem {#schema-qualified-table-names}

Gdy opcja `Bracket` ma wartość `None`, nazwa tabeli z kropką, taka jak `sales.users`, jest odczytywana jako schemat i tabela, podzielona przy ostatniej kropce poza nawiasami kwadratowymi lub cudzysłowami podwójnymi.

- MySQL, MariaDB, MSSQL, Oracle i PostgreSQL tworzą zapisywane przez siebie automatyczne nazwy wyłącznie z części będącej nazwą tabeli: `FK_users_TO_orders` i `IDX_users` we wszystkich pięciu, `UQ_users_email` we wszystkich oprócz PostgreSQL oraz `PK_users` w MSSQL i Oracle, jedynych dwóch spośród nich, które nadają nazwę kluczowi podstawowemu. W tych dwóch `[sales].[users]` i `"sales"."users"` również dają `PK_users`, a `[Order]` daje `PK_Order`.
- SQLite nie nadaje nazw ograniczeniom, więc jedyną automatyczną nazwą, jaką tworzy, jest nazwa indeksu: `CREATE INDEX sales.IDX_users ON users`.
- Oracle tworzy indeksy tabeli oraz sekwencję i wyzwalacz kolumny z autoinkrementacją w schemacie tabeli: `sales.IDX_users`, `sales.SEQ_users` i `sales.SEQ_TRG_users`.
- W Oracle i SQLite nazwa indeksu, w której samodzielnie podano schemat, zachowuje go.
- Automatyczna nazwa klucza obcego lub indeksu, która, bez uwzględniania wielkości liter, powtarza wcześniejszą, otrzymuje numer. Gdy tabela `orders` odwołuje się zarówno do `sales.users`, jak i do `hr.Users`, drugi klucz ma nazwę `FK_Users_TO_orders1`.

Przy każdej innej wartości opcji `Bracket` cała nazwa tabeli jest jednym identyfikatorem, na przykład `"PK_sales.users"`. Snowflake i Databricks zawsze zachowują całą nazwę.  
Wiersze `Keys` na karcie [Indeksy](./table-related-functions.md#indexes) pokazują te same nazwy.

### Wartości domyślne {#defaults}

Wartość domyślna kolumny jest zapisywana we wpisanej postaci, ale w nawiasach tam, gdzie baza danych odczytuje dane wyrażenie tylko w nawiasach. Wartość domyślna już ujęta w nawiasy pozostaje bez zmian.

- MySQL ujmuje w nawiasy wszystko oprócz literału i bieżącego czasu, na przykład `(uuid())`. Ujmuje w nawiasy także każdą wartość domyślną oprócz `NULL` w kolumnie typu `BLOB`, `TEXT`, `JSON`, przestrzennego lub `LONG…` oraz bieżący czas w każdej kolumnie innego typu niż `TIMESTAMP` i `DATETIME`.
- MariaDB ujmuje w nawiasy wszystko oprócz literału, bieżącego czasu, wywołania funkcji i nazwy.
- SQLite ujmuje w nawiasy wszystko oprócz literału i nazwy, na przykład `(datetime('now'))`.
- PostgreSQL ujmuje w nawiasy tylko wyrażenie zawierające poza nawiasami słowo takie jak `AT TIME ZONE`, `AND`, `OR`, `IS`, `IN`, `LIKE`, `COLLATE` lub `= ANY`, na przykład `(now() AT TIME ZONE 'utc')`.
- MSSQL, Oracle, Snowflake i Databricks zapisują każdą wartość domyślną we wpisanej postaci.

### Komentarze {#comments}

Komentarz tabeli lub kolumny, który nie jest pusty, albo nazwę logiczną, którą przełącznik [`Write logical names into empty comments`](#logical-names-as-comments) wpisuje w jego miejscu, każda baza danych zapisuje tak, jak zapisuje komentarze:

- MySQL i MariaDB zapisują go bezpośrednio w definicji: kolumna kończy się klauzulą `COMMENT 'Member ID'`, a tabela zamyka się fragmentem `) COMMENT 'Members';`, także w pakiecie `If not exists` dla MySQL.
- Snowflake zapisuje komentarz kolumny bezpośrednio w definicji, `COMMENT 'Member ID'`, a komentarz tabeli w osobnym wierszu po nawiasie zamykającym, `COMMENT = 'Members';`.
- Databricks zapisuje komentarz kolumny bezpośrednio w definicji, a komentarz tabeli jako `COMMENT 'Members';` po `USING DELTA`.
- PostgreSQL zapisuje `COMMENT ON TABLE member IS 'Members';` i `COMMENT ON COLUMN member.id IS 'Member ID';` tuż po instrukcji `CREATE TABLE` tabeli. Oracle zapisuje te same instrukcje po tabeli, jej ograniczeniach unikatowości oraz jej sekwencji i wyzwalaczu autoinkrementacji.
- MSSQL zapisuje jedno wywołanie na każdą tabelę i każdą kolumnę, po tabeli i jej ograniczeniach unikatowości, a po każdym z nich następuje `GO`: `EXECUTE sys.sp_addextendedproperty 'MS_Description', N'Members', 'schema', 'dbo', 'table', 'member'`, z dodanym `'column', 'id'` w przypadku kolumny.  
  Tekst jest literałem znaków narodowych, `N'…'`, więc SQL Server zachowuje tekst spoza strony kodowej bazy danych, na przykład koreański, zamiast zapisywać znaki zapytania.  
  Gdy opcja `Bracket` ma wartość `None`, tabela o nazwie `sales.users` daje schemat `sales` i tabelę `users`, podobnie jak `[sales].[users]` i `"sales"."users"`, z których usuwane są nawiasy kwadratowe i cudzysłowy podwójne. Nazwa bez schematu należy do schematu `dbo`. Część przed schematem, jak w `shop.sales.users`, uruchamia procedurę tej bazy danych, `shop.sys.sp_addextendedproperty`. Przy każdej innej wartości opcji `Bracket` cała nazwa jest nazwą tabeli w schemacie `dbo`.
- SQLite nie przechowuje komentarzy, więc zapisuje każdy z nich jako wiersz `--` nad opisywanym elementem: `-- Members` nad `CREATE TABLE member` i `-- Member ID` nad kolumną.

Znak cudzysłowu wewnątrz komentarza ujętego w cudzysłów jest podwajany, jak w `'it''s'` i `N'it''s'`, podobnie jak znak cudzysłowu w nazwach przekazywanych przez wywołania MSSQL. Databricks zamiast tego poprzedza znak cudzysłowu i ukośnik odwrotny ukośnikiem odwrotnym, jak w `'it\'s'`, czyli w postaci, którą odczytuje każda wersja Spark. Wiersze `--` w SQLite nie są ujmowane w cudzysłów, więc zachowują znak cudzysłowu we wpisanej postaci: `-- it's`.  
Poza tym tekst jest zapisywany we wpisanej postaci, łącznie z podziałami wierszy, z wyjątkiem dwóch baz danych:

- Oracle pomija puste wiersze, przy czym wiersz zawierający tylko spacje lub tabulatory liczy się jako pusty, ponieważ SQL\*Plus kończy instrukcję na pustym wierszu i pomija jej resztę. Komentarz tabeli składający się z `Members`, pustego wiersza i `Active only` jest zapisywany jako `COMMENT ON TABLE member IS 'Members` z `Active only';` w następnym wierszu.
- SQLite zapisuje każdy ciąg podziałów wierszy jako jedną spację, ponieważ podział wiersza zakończyłby wiersz `--`, a resztę wykonałby jako kod SQL. Ten sam komentarz jest zapisywany jako `-- Members Active only`.

To, jak te komentarze są odczytywane przy imporcie, opisano w sekcji [Komentarze](./file-import-export.md#comments).

## Edytory tylko do odczytu {#read-only-editors}

W edytorze z atrybutem [`readonly`](../../api/erd-editor-element.md#readonly) karta działa dla czytelnika i nic, co na niej zrobi, nie trafia do dokumentu:

- `Database` i `Bracket` nadal zmieniają kod SQL, ale tylko w tym oknie, więc panel podpisuje je również `This window only`. Wybór nie jest zapisywany w pliku, współdzielony ze współpracownikami ani rejestrowany do cofania, niezależnie od blokad, a zmiana ustawienia, które wybrałeś, wprowadzona przez współpracownika pozostawia na ekranie Twój wybór. Karta Code Generator pokazuje ten sam wybór, a [`getSchemaSQL()`](../../api/erd-editor-element.md#getschemasql) wywołane bez bazy danych również go zapisuje. Gdy edytor znów umożliwi zapis, wracają baza danych i cudzysłów z dokumentu.
- `Statements`, `Header`, `Write logical names into empty comments` i `Tables` działają jak wszędzie, ponieważ należą już do okna.
- Oba pola skryptów są tylko do odczytu: pokazują skrypty dokumentu, które kod SQL nadal zapisuje, i nie przyjmują wpisywania.
- `Save file` i `Copy` zapisują i kopiują kod SQL wyświetlany na karcie.
