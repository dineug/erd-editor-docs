---
sidebar_position: 2
description: Importowanie plików JSON, schematu SQL, GraphQL, DBML lub AML w miejsce diagramu albo z dodaniem poniżej niego oraz eksportowanie pliku JSON, schematu SQL lub diagramu jako obrazu PNG albo SVG.
---

# Importowanie i eksportowanie plików

## Importowanie plików zewnętrznych {#importing-external-files}

Z podmenu `Import` w menu kontekstowym kanwy można importować pięć formatów:

- json
- Schema SQL
- GraphQL
- DBML
- AML

Pozycja `Import and Add`, tuż pod pozycją `Import`, dodaje plik do diagramu, zamiast go zastępować – zobacz sekcję [Importuj i dodaj](#import-and-add).  
Ekran powitalny wyświetlany przy pustym diagramie ma pozycję `Import` z tymi samymi pięcioma formatami – zobacz sekcję [Ekran powitalny](./editing-start.md#welcome-screen).  
Arkusze karty [Słownik](./dictionary.md) przyjmują też słowa, terminy i domeny z plików CSV za pomocą własnego przycisku `Import CSV` tej karty – zobacz sekcję [Importowanie i eksportowanie plików CSV](./dictionary.md#importing-and-exporting-csv).

Rozszerzenia są dopasowywane bez uwzględniania wielkości liter. Wskazanie pliku, którego rozszerzenie nie pasuje do wybranego formatu, anuluje import i wyświetla komunikat `Only <format> files can be imported`, w którym format ma postać `json`, `sql`, `graphql`, `dbml` lub `aml`, na przykład `Only sql files can be imported`.

Operacja `Import` zastępuje bieżący dokument, zamiast scalać z nim plik, a jedno cofnięcie przywraca poprzedni diagram.  
Plik JSON przynosi ze sobą własne ustawienia, łącznie z [blokadami](./settings.md#lock). Jeśli plik blokuje kartę, język Generatora kodu, styl nazw, typ cudzysłowu lub [Widok nazw](./logical-names.md#name-view), nadal widzisz to, co było wcześniej, ale zapisywana jest zablokowana wartość z pliku. Powiększenie i położenie widoku, zablokowane czy nie, ustawiają się tak, jak wskazuje plik. Plik JSON zapisany przed wprowadzeniem blokad jest importowany ze wszystkimi blokadami włączonymi i z widokiem w powiększeniu 100%. Plik zapisany przed wprowadzeniem blokady `Name View` jest importowany z tą blokadą włączoną, niezależnie od innych zapisanych w nim blokad.  
Pozostałe formaty zachowują dotychczasowe ustawienia, łącznie z blokadami, z wyjątkiem widoku, który zaczyna od powiększenia 100%.  
Parsery GraphQL, DBML i AML nigdy nie zawodzą: plik, którego nie potrafią odczytać, daje pusty diagram, a nie błąd.

Plik JSON przynosi też nazwy logiczne swoich tabel i kolumn oraz powiązania swoich kolumn z domenami. Jego słowa, terminy i domeny zastępują te z karty [Słownik](./dictionary.md), więc plik, który ich nie zawiera, pozostawia arkusze puste, a cofnięcie importu przywraca zastąpione elementy.  
Pozostałe formaty nie zawierają żadnej z tych rzeczy. Ich tabele są importowane bez nazw logicznych i bez kolumn powiązanych z domenami, a twoje słowa, terminy i domeny pozostają bez zmian. Cofnięcie lub ponowienie importu również ich nie zmienia, więc zmiana w słowniku wprowadzona po imporcie zostaje zachowana. Taki import pozostawia też bez zmian własną historię cofania każdego arkusza, natomiast import JSON czyści te historie – zobacz sekcję [Arkusze karty Słownik](./undo-redo.md#dictionary-sheets).

Plik JSON zachowuje zapisane w nim położenia. Tabele z pliku w formacie Schemat SQL, GraphQL, DBML lub AML są rozmieszczane, zanim diagram się zmieni, z szerokościami, jakie mają przy ustawieniu [Widok nazw](./logical-names.md#beyond-the-canvas), które właśnie oglądasz:

- Gdy plik ma co najmniej dwie tabele i co najmniej jedną relację, rozmieszcza je [Automatyczny układ](./table-related-functions.md#auto-layout) z opcją `Flow`, od lewej do prawej wzdłuż relacji, począwszy od lewego górnego rogu kanwy. Liczy się także relacja tabeli z samą sobą.
- W przeciwnym razie tabele są układane w rzędach od lewego górnego rogu, począwszy od tabel z najmniejszą liczbą kolumn.
- Jeśli układanie trwa dłużej niż 6 sekund, pojawia się komunikat `Placing tables` z przyciskiem `Cancel`. Przycisk `Cancel` albo klawisz `Escape` naciśnięty, gdy komunikat jest widoczny, przerywa układanie i zamiast tego rozmieszcza tabele w rzędach. Rzędy są używane także, bez komunikatu, gdy układanie się nie powiedzie, gdy w ciągu 60 sekund nie zostanie zwrócony żaden układ lub gdy host nie uruchamia żadnego shared workera – zobacz sekcję [Web Workers](../../api/installation.md#web-workers).

Następnie diagram jest zastępowany w jednym kroku, więc nie widać żadnego stanu pośredniego. Ustawienie zmienione w trakcie rozmieszczania tabel, na przykład karta, zostaje zachowane, a jeśli w tym czasie zaimportujesz inny plik, wygrywa import rozpoczęty jako ostatni.

Edytor tylko do odczytu niczego nie importuje. Jego menu kontekstowe kanwy i Szybkie wyszukiwanie nie oferują ani pozycji `Import`, ani `Import and Add`, nie pokazuje ekranu powitalnego, a karta Słownik nie oferuje przycisku `Import CSV`.

### Importuj i dodaj {#import-and-add}

Pozycja `Import and Add` zachowuje diagram i dodaje plik poniżej niego. Jest dostępna w menu kontekstowym kanwy oraz w palecie [Szybkie wyszukiwanie](./quick-search.md) na karcie ERD i oferuje te same pięć formatów z tym samym sprawdzaniem rozszerzeń co pozycja `Import`.

![Dodawanie pliku SQL przez Import and Add > Schema SQL – jego tabele trafiają pod diagram, ułożone wzdłuż relacji i zaznaczone](/img/demo-import-and-add.webp)

Plik jest dodawany tak jak przy wklejaniu: wszystkie zawarte w nim tabele, kolumny, relacje, indeksy, notatki i [grupy tabel](./table-groups.md) są dodawane jako nowe, tabele już obecne w diagramie się nie przesuwają, a żadne ustawienie się nie zmienia, więc ustawienia z pliku JSON są pomijane.  
Tabele i kolumny z pliku JSON zachowują swoje nazwy logiczne, a każda nazwa fizyczna nadal należy do słowników lub jest własna, tak jak w pliku, co decyduje o tym, czy później wpisana nazwa logiczna wygeneruje nową – zobacz sekcję [Generowanie nazw fizycznych](./dictionary.md#deriving-physical-names). Słowa, terminy i domeny z pliku są pomijane, więc karta Słownik pozostaje bez zmian, a żadna dodana kolumna nie jest powiązana z domeną: każda zachowuje swój typ danych.  
Tabela o nazwie, którą diagram już zawiera, jest dodawana jako druga tabela o tej nazwie, a nie scalana z istniejącą. Relacje i indeksy pochodzą wyłącznie z pliku, więc klucz obcy odwołujący się do tabeli, której plik nie definiuje, nie zostaje połączony z tabelą już obecną w diagramie.

Dodany blok trafia tuż pod całą zawartość diagramu, wyrównany do jej lewej krawędzi, a w przypadku pustego diagramu – w lewy górny róg. Notatki i grupy tabel ukryte w [Opcjach widoku](./table-related-functions.md#table-view-options) również się liczą, ponieważ nadal tam są.  
Wewnątrz bloku plik JSON zachowuje własny układ, łącznie z grupami tabel. Pozostałe formaty są rozmieszczane tak samo jak przy operacji `Import`, z opcją `Flow` lub w rzędach według tych samych reguł, a ramka każdej grupy tabel jest dopasowywana do jej tabel. Dodane tabele i notatki trafiają na wierzch, nad wszystko, co już tam było.

Gdy blok zostanie umieszczony, zaznaczone jest tylko to, co dodano: nowe tabele oraz nowe notatki i grupy tabel, o ile są wyświetlane. Jeśli w międzyczasie przejdziesz na inną kartę, edytor przełączy się z powrotem na kartę ERD, zanim blok zostanie umieszczony. Następnie widok przewija się do bloku przy bieżącym powiększeniu, chyba że blok jest już dobrze widoczny – zobacz sekcję [Dokąd prowadzi przejście](./table-related-functions.md#where-a-jump-lands). Jedno cofnięcie wycofuje wszystko, co dodano.  
Plik, którego parser nie potrafi odczytać, lub plik bez żadnej tabeli i żadnej notatki nic nie dodaje.

Wszystkie pliki w formacie Schemat SQL, GraphQL, DBML lub AML dodane w czasie, gdy jeden jest jeszcze rozmieszczany, zostają umieszczone w kolejności, w jakiej rozpoczęto ich dodawanie. Plik JSON dodany w tym czasie zostaje umieszczony od razu po odczytaniu, przed nimi. Operacja `Import` lub wczytanie innego dokumentu porzuca wszystkie pliki, które są jeszcze rozmieszczane.

Agenci kodujący dodają plik w ten sam sposób w trybie `append` narzędzi MCP do importu, który zachowuje układ pliku JSON, ale tabele z pozostałych formatów układa w rzędach, nigdy z opcją `Flow` – zobacz sekcję [Import](../../mcp/tools.md#import).

### JSON {#json}

Możesz importować pliki w [formacie schematu zdefiniowanym w edytorze](../../api/advanced/schema.md).
Nazwa pliku musi kończyć się na `.json`, więc plik wyeksportowany jako `<database name>-<timestamp>.erd.json` importuje się z powrotem bez zmian; plik z samym rozszerzeniem `.erd` lub `.vuerd` nie jest tutaj akceptowany. Odczytywane są również pliki zapisane przez wcześniejsze wersje.

![Importowanie zapisanego pliku przez Import > json i zastąpienie dokumentu roboczego wraz z jego ustawieniami](/img/demo-import-json.webp)

### Schemat SQL {#schema-sql}

Możesz też importować pliki schematu zdefiniowane w języku SQL.  
Chociaż parsery zaprojektowano tak, aby były jak najbardziej elastyczne niezależnie od systemu bazy danych, część składni może nie być obsługiwana.  
Nazwa pliku musi kończyć się na `.sql`.  
[Obsługiwaną składnię można sprawdzić tutaj.](https://github.com/dineug/erd-editor/tree/main/packages/schema-sql-parser)

![Importowanie pliku SQL przez Import > Schema SQL, ułożenie jego tabel wzdłuż relacji, a potem pomniejszenie widoku nad nimi](/img/demo-import-sql.webp)

Kolumny są odczytywane tylko z instrukcji `CREATE TABLE`. Kolumna dodana przez `ALTER TABLE ... ADD COLUMN` nie jest odczytywana.  
Elementy instrukcji `CREATE TABLE`, które nie są kolumnami, są pomijane, a nie odczytywane jako kolumny: nienazwane ograniczenie `CHECK (...)`, klauzule `LIKE` i `EXCLUDE` z PostgreSQL, `FULLTEXT` i `SPATIAL` z MySQL zapisane bez `INDEX` lub `KEY`, `PERIOD FOR` z T-SQL oraz `SUPPLEMENTAL LOG DATA` z Oracle.  
Kolumna nazwana tak jak jeden z tych elementów jest jednak importowana, gdy po nazwie następuje typ wbudowany, jak w `exclude BOOLEAN`, lub gdy nazwa jest ujęta w cudzysłów, jak w `"check" int`. Słowo `like` bez cudzysłowu, po którym następuje typ niewbudowany, na przykład `like citext`, jest odczytywane jako klauzula `LIKE` z PostgreSQL i pomijane.  
Same ograniczenia `CHECK` nie są importowane, ponieważ edytor nie ma miejsca, w którym mógłby je przechowywać.

#### Typy danych {#data-types}

Typ danych kolumny jest zachowywany wraz z listą argumentów, nawet gdy nie jest typem wbudowanym żadnej z [obsługiwanych baz danych](./table-related-functions.md#databases).  
Dotyczy to typu wyliczeniowego lub złożonego utworzonego przez `CREATE TYPE`, domeny utworzonej przez `CREATE DOMAIN`, typów z rozszerzeń, takich jak `hstore`, `citext` i `ltree`, nazw kwalifikowanych schematem, takich jak `public.mood`, oraz nazw ujętych w cudzysłów lub nawiasy kwadratowe, takich jak `"MyType"` i `[dbo].[Phone]`, które zachowują swoje cudzysłowy lub nawiasy. Same instrukcje `CREATE TYPE`, `CREATE DOMAIN` i `CREATE EXTENSION` są pomijane.  
Typ wbudowany traci cudzysłowy lub nawiasy, więc typ `[int]` jest importowany jako `int`, a `[nvarchar](50)` jako `nvarchar(50)`. Typy `"char"` i `"bit"` z PostgreSQL zachowują swoje, ponieważ są to typy inne niż `char` i `bit`.  
Przyrostki tablicowe pozostają przy każdym typie: `integer[]`, `text[3][3]`, `integer ARRAY`, `mood[]`. Typ `UNSIGNED BIG INT` z SQLite jest importowany w całości.  
Modyfikatory `UNSIGNED` i `ZEROFILL` z MySQL i MariaDB, zapisane bezpośrednio po typie i jego argumentach, pozostają częścią typu w zapisanej postaci: `INT UNSIGNED`, `SMALLINT(5) UNSIGNED ZEROFILL`, `int unsigned` z mysqldump. Domyślny modyfikator `SIGNED` jest pomijany, więc typ `TINYINT SIGNED` jest importowany jako `TINYINT`. Modyfikator zapisany po innej opcji kolumny, jak w odrzucanym przez MySQL zapisie `INT NOT NULL UNSIGNED`, jest pomijany.  
Wartości `ENUM(...)` i `SET(...)` zachowują swoje cudzysłowy, a znak cudzysłowu wewnątrz wartości jest podwajany, jak w `ENUM('a','it''s')`. Zapis `'it\'s'` z MySQL, ze znakiem cudzysłowu poprzedzonym ukośnikiem odwrotnym, jest importowany z takim samym podwojeniem. W typie `STRUCT<...>` z Databricks ujęte w cudzysłów nazwy pól i klauzula `COMMENT` pola zachowują swoje cudzysłowy.  
Kolumna zapisana bez typu, na przykład kolumna bez typu w SQLite lub kolumna obliczana `AS`, pozostaje bez typu: ani słowo kluczowe, takie jak `NOT`, `NULL`, `DEFAULT`, `PRIMARY` lub `REFERENCES`, ani ciąg znaków w pojedynczych cudzysłowach nie jest odczytywany jako typ.

#### Wartości domyślne {#defaults}

Klauzula `DEFAULT` kolumny zachowuje całe swoje wyrażenie, takie jak `now()`, `0.5`, `CURRENT_TIMESTAMP` lub `ARRAY[]::text[]`, aż do następnej opcji kolumny, przecinka lub nawiasu zamykającego. Wyrażenie `CASE ... END` jest odczytywane w całości.  
Nawiasy wokół całego wyrażenia są usuwane, więc wyrażenie `((0))` z SQL Server jest importowane jako `0`, a `(getdate())` jako `getdate()`. Rzutowanie literału również jest usuwane, więc wyrażenie `'draft'::character varying` z pg_dump jest importowane jako `'draft'`, a `NULL::character varying` jako `NULL`; inne rzutowania pozostają, jak w `ARRAY[]::text[]` i `lower('A'::text)`.  
Klauzula `ON UPDATE CURRENT_TIMESTAMP` z MySQL jest pomijana, ponieważ kolumna nie ma na nią miejsca, a wartość domyślna przed nią pozostaje. Zapis `DEFAULT ON NULL 0` z Oracle, z `FOR INSERT ONLY` lub `FOR INSERT AND UPDATE` albo bez nich, jest importowany jako `0`.  
Ciąg znaków z prefiksem, taki jak `N'x'`, `E'x'`, `B'0'`, `X'ff'`, `U&'x'` lub `_utf8mb4'x'`, jest odczytywany jako jeden ciąg, nawet jeśli zawiera nawias.

SQL Server Management Studio zapisuje w skrypcie wartości domyślne po tabelach, jako `ALTER TABLE [dbo].[t] ADD CONSTRAINT [DF_x] DEFAULT ((1)) FOR [col]`. Taka instrukcja ustawia wartość domyślną tej kolumny, tutaj `1`, a nazwa jej ograniczenia jest pomijana.

Eksport Schematu SQL przywraca nawiasy tam, gdzie baza danych odczytuje wyrażenie wartości domyślnej tylko wewnątrz nich – zobacz sekcję [Wartości domyślne](./schema-sql.md#defaults).

#### Autoinkrementacja {#auto-increment}

Słowa kluczowe `AUTO_INCREMENT`, `AUTOINCREMENT` i `IDENTITY` włączają opcję `Auto Increment` kolumny, podobnie jak `GENERATED ALWAYS AS IDENTITY` i `GENERATED BY DEFAULT AS IDENTITY`, które nie pozostawiają wartości domyślnej.  
To samo robi wartość domyślna będąca pojedynczym wywołaniem `nextval()` z PostgreSQL, czyli wartość domyślna, którą otrzymuje kolumna typu serial, zapisana jako `nextval('s')` lub, tak jak zapisuje ją pg_dump, `nextval('s'::regclass)`. Nazwa sekwencji nie jest zachowywana. Wartość domyślna, która jedynie korzysta z sekwencji, na przykład `nextval('s') + 1` lub `NEXT VALUE FOR s` z SQL Server, pozostaje zwykłą wartością domyślną.  
pg_dump zapisuje obie te formy po tabelach, jako `ALTER TABLE [ONLY] t ALTER [COLUMN] c SET DEFAULT nextval('s'::regclass)` i `ALTER TABLE t ALTER [COLUMN] c ADD GENERATED ... AS IDENTITY`. Każda z tych instrukcji włącza opcję `Auto Increment` tej kolumny i usuwa jej wartość domyślną. Instrukcje `CREATE SEQUENCE`, `ALTER SEQUENCE` i każda inna akcja `ALTER COLUMN` są pomijane.  
Kolumna, której typ zapisano bezpośrednio jako `serial`, `bigserial` lub `smallserial`, zachowuje ten typ, z wyłączoną opcją `Auto Increment`.

Edytor zachowuje tylko flagę `Auto Increment`, a każda baza danych przy eksporcie zapisuje własną formę – zobacz sekcję [Autoinkrementacja](./schema-sql.md#auto-increment). Eksport dla PostgreSQL zapisuje `GENERATED ALWAYS AS IDENTITY` przy kolumnie typu `smallint`, `integer` lub `bigint`, niezależnie od zaimportowanej formy, a przy każdym innym typie, takim jak `INT UNSIGNED`, tylko wiersz komentarza po tabeli. Opcje sekwencji, takie jak `START WITH 100`, są tracone.  
Tabela z kilkoma kolumnami typu serial lub identity jest importowana z kilkoma kolumnami z autoinkrementacją, a MySQL, MariaDB i SQL Server odrzucają taką tabelę przy uruchomieniu jej eksportu.

#### Klucze podstawowe {#primary-keys}

Klucz podstawowy dodany po definicji tabeli, `ALTER TABLE t ADD [CONSTRAINT n] PRIMARY KEY (...)`, oznacza swoje kolumny jako klucz podstawowy.  
Słowa `CLUSTERED` lub `NONCLUSTERED` z SQL Server i `USING BTREE` z MySQL przed listą kolumn są pomijane przy odczycie, więc instrukcja `ALTER TABLE [dbo].[Users] ADD CONSTRAINT [PK_Users] PRIMARY KEY CLUSTERED ([Id] ASC) WITH (...) ON [PRIMARY]`, którą generuje SQL Server Management Studio, ustanawia kluczem kolumnę `Id`. Zapis `PRIMARY KEY NONCLUSTERED HASH (...)` tabeli zoptymalizowanej pod kątem pamięci nie jest odczytywany ani w `ALTER TABLE`, ani w `CREATE TABLE`.

#### Klucze unikatowe i indeksy {#unique-keys-and-indexes}

Ograniczenie `UNIQUE` obejmujące dwie lub więcej kolumn staje się jednym indeksem unikatowym w każdym zapisie: `UNIQUE (a, b)`, `UNIQUE KEY n (a, b)`, `UNIQUE INDEX n (a, b)`, `CONSTRAINT n UNIQUE (a, b)`, `INDEX n UNIQUE (a, b)` zapisane w definicji tabeli w SQL Server oraz `ALTER TABLE t ADD [CONSTRAINT n] UNIQUE (a, b)`.  
Indeks przyjmuje nazwę indeksu klucza, w jej braku nazwę z `CONSTRAINT`, a w braku obu pozostaje bez nazwy, i zachowuje kolejność sortowania każdej kolumny. Taki indeks jest [kluczem alternatywnym](./table-related-functions.md#alternate-keys).  
Ograniczenie `UNIQUE` obejmujące jedną kolumnę, w dowolnym z tych zapisów, zamiast tego oznacza tę kolumnę jako unikatową i nie dodaje indeksu, więc ograniczenie `UQ_<table name>_<column name>` zapisywane przez eksport wraca jako flaga, z której powstało. Instrukcja `CREATE UNIQUE INDEX` obejmująca jedną kolumnę pozostaje indeksem unikatowym.

Instrukcja `ALTER TABLE`, która dodaje kilka kluczy naraz, tak jak phpMyAdmin zapisuje `ADD PRIMARY KEY (id), ADD UNIQUE KEY uq_a (a, b), ADD UNIQUE KEY uq_c (c)`, zachowuje każdy zawarty w niej klucz unikatowy: klucz `uq_a` jest importowany jako indeks unikatowy o nazwie `uq_a`, a `uq_c` jako flaga Unikatowość kolumny `c`. Nazwa z `CONSTRAINT` nazywa tylko klucz we własnej klauzuli. Odczytywane są również `ADD UNIQUE INDEX IF NOT EXISTS n (...)` z MariaDB oraz `ALTER TABLE t WITH CHECK ADD ...` i `WITH NOCHECK ADD ...` z SQL Server.  
Instrukcje `CREATE INDEX` i `CREATE UNIQUE INDEX` są odczytywane z nazwami kwalifikowanymi, takimi jak `public.t` i `[dbo].[t]`, ze słowami `CLUSTERED` i `NONCLUSTERED` z SQL Server, z `CONCURRENTLY`, `IF NOT EXISTS`, `ON ONLY` i `USING btree` z PostgreSQL, a także w ogóle bez nazwy indeksu. Grupa plików `ON [PRIMARY]` z SQL Server jest ignorowana.  
Opcje klucza, takie jak `NULLS NOT DISTINCT` lub `USING BTREE`, nie są mylone z nazwą klucza. Na liście kolumn klucza tylko pierwsze słowo wskazuje kolumnę, więc `b DESC NULLS LAST`, `b text_pattern_ops` i `b COLLATE "C"` dodają do klucza kolumnę `b`, a `DESC` zostaje zachowane jako jej kolejność sortowania. Długość prefiksu, taka jak `email(191)`, jest pomijana przy odczycie, ale klucz z częścią będącą wyrażeniem, taką jak `lower(email)`, jest pomijany w całości.

Częściowy indeks unikatowy, `CREATE UNIQUE INDEX ... WHERE ...` lub `INDEX n UNIQUE (...) WHERE ...` zapisane w definicji tabeli w SQL Server, jest importowany jako zwykły indeks o tej samej nazwie i kolumnach, ponieważ klucz unikatowy w całej tabeli byłby bardziej restrykcyjny niż filtrowany klucz zadeklarowany w pliku. Wyjątkiem jest filtr złożony wyłącznie z warunków `IS NOT NULL` na kolumnach klucza, połączonych operatorem `AND`, czyli filtr, którego SQL Server potrzebuje, aby kolumna unikatowa mogła zawierać więcej niż jedną wartość NULL: taki klucz pozostaje unikatowy.  
Klucz unikatowy wskazujący kolumnę, której tabela nie ma, na przykład dodaną przez `ALTER TABLE ... ADD COLUMN`, jest pomijany w całości, a nie przycinany do istniejących kolumn. Zwykły indeks zachowuje istniejące kolumny.

Oracle SQL Developer i `DBMS_METADATA` zapisują własny indeks klucza jako osobną instrukcję `CREATE UNIQUE INDEX`, nazwaną tak jak klucz lub, w przypadku klucza bez nazwy, po którym następuje `USING INDEX`, z nazwą systemową, taką jak `SYS_C0012345`. Import odczytuje taki indeks, a także indeks wskazany przez `ADD CONSTRAINT ... USING INDEX`, jako część jego klucza: złożony klucz unikatowy jest importowany jako jeden indeks unikatowy, a klucz podstawowy lub jednokolumnowy klucz unikatowy jako flagi kolumn bez dodatkowego indeksu. Eksport z powrotem do Oracle tworzy wtedy indeks tylko raz.

Eksport Schematu SQL dla MySQL, MariaDB, MSSQL, Oracle, PostgreSQL i SQLite importuje się z powrotem z tymi samymi flagami Unikatowość i indeksami.  
Snowflake nie ma indeksów pomocniczych, więc jego eksport przywraca tylko klucze unikatowe: złożony jako indeks unikatowy, a jednokolumnowy jako flagę Unikatowość kolumny. Eksport dla Databricks nie deklaruje unikatowości, więc unikatowość nie wraca.

#### Klucze obce {#foreign-keys}

Klucz obcy staje się relacją w następujących zapisach:

- `FOREIGN KEY (...) REFERENCES t (...)` na poziomie tabeli, z `CONSTRAINT name` lub bez niego.
- `ALTER TABLE ... ADD [CONSTRAINT name] FOREIGN KEY (...) REFERENCES t (...)`, w tym `ALTER TABLE t WITH CHECK ADD ...` i `WITH NOCHECK ADD ...` generowane przez SQL Server Management Studio.
- `REFERENCES t (col)` zapisane bezpośrednio przy kolumnie, jak w `user_id INT REFERENCES users (id)`, oraz `FOREIGN KEY REFERENCES t (col)`, na które SQL Server i Snowflake pozwalają w tym miejscu. Odwołanie przy kolumnie wskazujące więcej niż jedną kolumnę jest pomijane.

Instrukcja `ALTER TABLE` daje najwyżej jedną relację i tylko wtedy, gdy jej pierwsza klauzula dodaje klucz obcy: klauzula `FOREIGN KEY` po klauzuli `ADD PRIMARY KEY` lub `ADD UNIQUE` w tej samej instrukcji nie jest odczytywana. Gdy jedna instrukcja dodaje kilka kluczy obcych, tak jak phpMyAdmin zapisuje `ADD CONSTRAINT fk1 FOREIGN KEY ..., ADD CONSTRAINT fk2 FOREIGN KEY ...`, odczytywany jest tylko ostatni z nich.

Zapis `REFERENCES t` bez listy kolumn wskazuje klucz podstawowy tabeli `t`, gdy ten klucz składa się z jednej kolumny. Przy złożonym kluczu podstawowym klucz obcy jest pomijany.  
Klucz obcy jest pomijany, a żadna z jego kolumn nie zostaje oznaczona jako klucz obcy, gdy nie zostanie znaleziona żadna z jego kolumn docelowych lub gdy liczba kolumn znalezionych w obu tabelach się różni, na przykład gdy kolumny brakuje tylko w jednej z nich. Gdy w obu tabelach brakuje tej samej liczby jego kolumn, znalezione kolumny są łączone w pary w kolejności zapisu, a relacja obejmuje tylko te kolumny.  
Każda zaimportowana relacja ma typ `Zero N` i jest identyfikująca, gdy każda z jej kolumn w tabeli podrzędnej jest również kluczem podstawowym.

Klauzule `ON DELETE` i `ON UPDATE` każdego klucza obcego stają się opcjami `On Delete` i `On Update` relacji: `NO ACTION`, `RESTRICT`, `CASCADE`, `SET NULL` lub `SET DEFAULT`, w dowolnej wielkości liter i w dowolnej kolejności. Klucz obcy bez nich jest importowany jako `Not set`. Informacje o ustawianiu ich w edytorze znajdziesz na stronie [Edycja relacji](./relationship-editing.md#on-delete-and-on-update).  
Lista kolumn z PostgreSQL po `SET NULL` lub `SET DEFAULT`, jak w `ON DELETE SET NULL (a_id)`, jest pomijana przy odczycie: akcja dotyczy całego klucza, a klauzula `ON UPDATE` po liście jest nadal odczytywana. Klauzule `MATCH FULL`, `MATCH PARTIAL` i `MATCH SIMPLE` są pomijane, a atrybut kolumny `ON UPDATE CURRENT_TIMESTAMP` z MySQL nie jest mylony z akcją.  
Eksport Schematu SQL importuje się z powrotem z akcjami, które zapisuje dana baza danych, więc akcja, którą pomija, na przykład `SET DEFAULT` w MySQL, dowolne `ON UPDATE` w Oracle lub cokolwiek poza `NO ACTION` w Snowflake, wraca jako `Not set`.

#### Komentarze {#comments}

Komentarze tabel i kolumn są importowane z trzech składni, które odczytuje parser: opcji tabeli i atrybutu kolumny `COMMENT` używanych przez MySQL, MariaDB, Snowflake i Databricks, instrukcji `COMMENT ON TABLE` i `COMMENT ON COLUMN` używanych przez PostgreSQL i Oracle oraz właściwości rozszerzonej `MS_Description`, którą SQL Server ustawia za pomocą `EXEC sp_addextendedproperty`.  
Komentarz wskazujący tabelę lub kolumnę, której plik nie definiuje, jest ignorowany.

Wywołania SQL Server są odczytywane z argumentami nazwanymi, w postaci, w jakiej SQL Server Management Studio zapisuje każdy komentarz (`@name=N'MS_Description', @value=N'...', ..., @level1type=N'TABLE', @level1name=N'Users'`), oraz z pozycyjnymi, tak jak zapisuje je eksport MSSQL edytora.  
Komentarz powstaje tylko z właściwości `MS_Description` ustawionej na tabeli lub na jednej z jej kolumn na poziomie 2. Ani inna właściwość, ani właściwość widoku, indeksu czy ograniczenia nie daje komentarza, podobnie jak komentarz przekazany w zmiennej lub zbudowany za pomocą `+`.

W komentarzu, tak jak w każdym tekście w cudzysłowie, na przykład w wartości `DEFAULT` lub nazwie w cudzysłowie, podwojony znak cudzysłowu oznacza jeden taki znak, tak jak zapisują to mysqldump i pg_dump: `'it''s'` jest odczytywane jako `it's`.  
Ukośnik odwrotny przed znakiem cudzysłowu, tak jak MySQL i MariaDB zapisują `'it\'s'`, również działa jako znak ucieczki. Taki znak cudzysłowu nadal kończy tekst, gdy następuje po nim biały znak, `,`, `;`, `)`, `]`, `:`, `|`, `+` lub koniec pliku, więc `'C:\'`, `'C:\'::text` z pg_dump i `'C:\'+name` z T-SQL zachowują swój ukośnik odwrotny.  
Wartość `DEFAULT` zachowuje swoje cudzysłowy, a znak cudzysłowu wewnątrz niej jest zapisywany z powrotem jako podwojony, niezależnie od tego, jakiej sekwencji ucieczki użył plik: `'it''s'`.  
Gdy w chwili importu bazą danych dokumentu jest Databricks, tekst w pojedynczych cudzysłowach podlega zamiast tego regułom platformy Spark: każdy ukośnik odwrotny działa jako znak ucieczki dla następnego znaku, więc `'C:\\dir'` jest odczytywane jako `C:\dir`, sekwencje ucieczki, takie jak `\n`, `\t` i `\u0041`, są dekodowane, a wartość `DEFAULT` jest zachowywana jako `'it\'s'`.

To, jak każda baza danych zapisuje komentarz przy eksporcie i jak stosuje w nim sekwencję ucieczki dla znaku cudzysłowu, opisano w sekcji [Komentarze](./schema-sql.md#comments) na stronie Schemat SQL.  
Eksport do MySQL, MariaDB, PostgreSQL, Oracle, Snowflake lub MSSQL importuje się z powrotem jako te same komentarze tabel i kolumn, łącznie ze znakami cudzysłowu, z wyjątkiem pustych wierszy, które pomija eksport Oracle. Eksport Databricks, który poprzedza znak cudzysłowu i ukośnik odwrotny ukośnikiem odwrotnym, odczytuje się z powrotem dokładnie tylko wtedy, gdy wybraną bazą danych jest Databricks.  
Komentarze nie przetrwają eksportu do SQLite i ponownego importu: SQLite zapisuje je jako zwykłe wiersze `--`, których parser nie odczytuje.  
Poza SQLite nazwa logiczna, którą przełącznik `Write logical names into empty comments` wpisał do pustego komentarza, importuje się z powrotem jako komentarz tej tabeli lub kolumny, a nie jako jej nazwa logiczna – zobacz sekcję [Nazwy logiczne jako komentarze](./schema-sql.md#logical-names-as-comments).

### GraphQL {#graphql}

Możesz zaimportować dokument GraphQL SDL.  
Definicje typów obiektowych stają się tabelami, blok `extend type` jest scalany z typem, który rozszerza, a pola interfejsów są dziedziczone przez typy, które je implementują.  
Pole, którego typem jest inna tabela, staje się relacją, a nie kolumną, a lista po obu stronach tworzy tabelę łączącą.  
Pole pojedyncze, takie jak `buyer: User`, jest najpierw łączone w parę z jedynym polem drugiego typu, którego nazwa kończy się ciągiem `By` z nazwą tego pola, na przykład `orderListByBuyer`, bez uwzględniania wielkości liter i podkreśleń; pole numerowane, takie jak `buyer2`, jest łączone w parę w ten sam sposób bez swojego numeru. Tak właśnie wynik GraphQL z Generatora kodu nazywa pola, gdy dwie tabele łączy więcej niż jedna relacja lub tabela odwołuje się do samej siebie, więc taki wynik importuje się z powrotem ze wszystkimi relacjami.  
Typy główne (`Query`, `Mutation`, `Subscription`), typy introspekcji oraz typy opakowujące Relay, federacji i Hasura, takie jak `PageInfo`, `*Connection`, `*Edge` i `*_aggregate`, są traktowane jako szum i pomijane.  
Dyrektywy `@id`, `@primaryKey`, `@unique`, `@autoincrement`, `@default`, `@map`, `@relation`, `@column`, `@table`, `@index` i `@db.*` są uwzględniane.  
Nazwa pliku musi kończyć się na `.graphql`, `.gql` lub `.graphqls`. Plik Prisma `schema.prisma` nie jest dokumentem GraphQL i nie można go tutaj zaimportować.

### DBML {#dbml}

Możesz zaimportować plik w formacie DBML, używanym przez dbdiagram.io i dbdocs.  
Odczytywane są bloki `Table`, `TablePartial`, `Ref`, `Enum` i `TableGroup`. Bloki `Project` i samodzielne bloki `Note` są pomijane bez wpływu na otaczające je tabele.  
Akceptowany jest każdy zapis odwołania: forma z dwukropkiem `Ref:`, odwołanie nazwane, forma blokowa `Ref { }` oraz ustawienie `[ref: > table.column]` zapisane przy kolumnie.  
Odwołanie wiele do wielu `<>` tworzy tabelę łączącą o nazwie utworzonej z nazw obu stron.  
Ustawienia `delete` i `update` samodzielnego odwołania stają się opcjami `On Delete` i `On Update` relacji, jak w `Ref: users.id < posts.user_id [delete: cascade, update: set null]`. Możliwe wartości to `cascade`, `restrict`, `set null`, `set default` i `no action`, w dowolnej wielkości liter. Każda inna wartość lub brak ustawienia jest importowany jako `Not set`, a inne ustawienia, takie jak `color`, są ignorowane.  
Ustawienie `[ref: ...]` zapisane przy kolumnie nie przenosi akcji, a ustawienia odwołania `<>` nie są przenoszone na tabelę łączącą. Gdy ten sam klucz obcy jest zadeklarowany zarówno przy kolumnie, jak i jako samodzielne odwołanie, zachowywana jest deklaracja przy kolumnie, bez akcji.  
Ustawienie `headercolor` tabeli, jak w `Table users [headercolor: #3498DB]`, staje się jej kolorem, gdy wartość jest kodem szesnastkowym `#rgb` lub `#rrggbb` zapisanym bez cudzysłowu. Każda inna wartość jest pomijana, a ustawienie `headercolor` bloku `TablePartial` nie jest przekazywane do tabel, które go używają.  
Każdy blok `TableGroup` staje się [grupą tabel](./table-groups.md) zawierającą wymienione w nim tabele, po jednej w wierszu, nazwane tak, jak nazywa je `Ref`. Jego ustawienie `[color: ...]` staje się kolorem grupy według tej samej reguły co `headercolor`, a jego adnotacja i inne ustawienia są pomijane. Tabela wymieniona w dwóch grupach pozostaje w pierwszej. Grupa, w której nie zostaje żadna tabela, nie jest tworzona, niezależnie od tego, czy nie wymienia żadnej tabeli zadeklarowanej w pliku, czy tylko tabele zajęte już przez wcześniejszą grupę. Ramka grupy jest dopasowywana do jej tabel niezależnie od tego, gdzie zostaną umieszczone, a gdy tabele są układane w rzędach, tabele grupy pozostają razem.  
Nazwa pliku musi kończyć się na `.dbml`.

### AML {#aml}

Możesz zaimportować plik AML (Azimutt Markup Language). Akceptowana jest zarówno obecna składnia, jak i starsza składnia v1.  
Encje stają się tabelami, a zagnieżdżone atrybuty są spłaszczane do nazwy kolumny z kropkami, takiej jak `settings.slug`.  
Atrybuty otrzymują `NOT NULL`, chyba że są oznaczone jako `nullable`, a konstrukcje, dla których edytor nie ma miejsca, takie jak `check`, `type` i `tags`, są pomijane, a nie odrzucane. Encja oznaczona jako widok jest importowana jako zwykła tabela.  
Właściwość `color` encji, jak w `users {color: red}`, staje się kolorem jej tabeli. Nazwy kolorów AML, `red`, `orange`, `amber`, `yellow`, `lime`, `green`, `emerald`, `teal`, `cyan`, `sky`, `blue`, `indigo`, `violet`, `purple`, `fuchsia`, `pink`, `rose` i `gray`, są odczytywane w dowolnej wielkości liter, w cudzysłowie lub bez, każda jako odcień 500 koloru Tailwind o tej nazwie, na przykład `#ef4444` dla `red`. Kod szesnastkowy w cudzysłowie, taki jak `"#3498db"`, jest zachowywany w zapisanej postaci; kodu `#3498db` bez cudzysłowu nie da się odczytać, ponieważ `#` rozpoczyna komentarz AML. Każda inna wartość, a także właściwość `color` przy atrybucie lub relacji, jest pomijana.  
Samodzielna instrukcja `rel` lub `fk` w starszej składni zachowuje swoje właściwości `onDelete` i `onUpdate` jako opcje `On Delete` i `On Update` relacji, jak w `rel posts(user_id) -> users(id) {onDelete: cascade, onUpdate: "set null"}`. Możliwe wartości to `cascade`, `restrict`, `set null`, `set default` i `no action`, w cudzysłowie lub bez, w dowolnej wielkości liter. Inne właściwości są pomijane.  
W relacji zapisanej przy atrybucie, takiej jak `user_id int -> users(id) {onDelete: cascade}`, właściwości należą do atrybutu, więc są pomijane, a relacja jest importowana jako `Not set`.  
Nazwa pliku musi kończyć się na `.aml`.

GraphQL, DBML i AML to formaty obsługiwane w obie strony: każdy z nich jest też formatem docelowym na karcie [Generator kodu](./code-generator.md).  
DBML i AML przenoszą ON DELETE i ON UPDATE każdej relacji w obie strony – zobacz stronę [Generator kodu](./code-generator.md#on-delete-and-on-update). GraphQL nie przenosi żadnej z tych akcji, więc import GraphQL pozostawia obie z wartością `Not set`.  
DBML przenosi w obie strony również kolory tabel, bez przezroczystości, oraz każdą grupę tabel, która zawiera tabelę. Grupa bez nazwy wraca jako `group_1`, `group_2` itd., a powtórzona nazwa grupy wraca z dodanym `_2`, `_3` itd. AML przenosi kolor tabeli tylko jako najbliższą ze swoich nazw kolorów, więc `#FF8800` jest zapisywany jako `orange` i wraca jako `#f97316`, a grup nie przenosi wcale. GraphQL nie przenosi ani kolorów, ani grup.  
Żaden z tych trzech formatów nie przenosi nazw logicznych, powiązań z domenami ani słowników w żadną stronę: Generator kodu zapisuje nazwę fizyczną i typ danych każdej tabeli i kolumny, nigdy nazwę logiczną ani domenę.

## Eksportowanie {#exporting}

Podmenu `Export` w menu kontekstowym kanwy ma trzy pozycje:

- json: Zapisuje diagram w takiej postaci, w jakiej przechowuje go jego plik, jako `.erd.json`: tabele z ich kolumnami i indeksami, relacje, notatki i grupy tabel, nazwy logiczne i powiązania kolumn z domenami, słowa, terminy i domeny z karty [Słownik](./dictionary.md) oraz ustawienia, przy czym każde [zablokowane ustawienie](./settings.md#lock) ma swoją zablokowaną wartość. To, co nic nie zawiera, na przykład pusty tekst lub pusty wiersz słownika, jest pomijane – zobacz sekcję [Postać zapisu i wartość czasu wykonania](../../api/advanced/schema.md#storage-form-and-runtime-value).
- Schema SQL: Otwiera kartę [Schemat SQL](./schema-sql.md#saving-or-copying-the-sql) z otwartym panelem opcji i fokusem na przycisku `Save file`, więc naciśnięcie klawisza `Enter` zapisuje kod SQL wyświetlany na karcie jako `.sql`. Do tego momentu nic nie jest zapisywane.
- Image: Otwiera okno dialogowe `Export image`, które zapisuje diagram jako plik `.png` lub `.svg` albo kopiuje go do schowka jako obraz PNG – zobacz sekcję [Obraz](#image).

Wszystkie trzy działają w edytorze tylko do odczytu, gdzie `Export` jest jedną z nielicznych pozycji, które zachowuje jego menu kanwy. Plik json zapisuje tam ustawienia, które przechowuje plik, a nie widok, kartę, Widok nazw, bazę danych, ustawienia kodu ani przełączniki `View Option` zmienione tylko na tym ekranie – zobacz sekcję [Edytory tylko do odczytu](./settings.md#read-only-editors) w Ustawieniach.  
Własny przycisk `Export CSV` karty Słownik, którego nie ma w tym podmenu, zapisuje arkusz `Domains`, `Words` lub `Terms` jako plik CSV. W przeciwieństwie do tych trzech pozycji nie jest dostępny w edytorze tylko do odczytu – zobacz sekcję [Importowanie i eksportowanie plików CSV](./dictionary.md#importing-and-exporting-csv).

Schemat SQL zapisuje ON DELETE i ON UPDATE każdej relacji po jej klauzuli `REFERENCES`, najpierw ON DELETE. Wartość `Not set` niczego nie zapisuje, a akcja, której wybrana baza danych nie akceptuje, jest pomijana. Informacje o tym, która baza danych przyjmuje które akcje, znajdziesz na stronie [Edycja relacji](./relationship-editing.md#on-delete-and-on-update).

Każdy eksportowany plik otrzymuje nazwę `<database name>-<timestamp>` z rozszerzeniem, przy czym znacznik czasu jest podawany w czasie lokalnym w formacie `yyyy-MM-dd'T'HH_mm_ss` – na przykład `my-schema-2026-08-29T04_05_06.erd.json`. Pusta nazwa bazy danych jest zastępowana wartością `unnamed`.  
Przyciski `Save file` na karcie Schemat SQL i na karcie [Generator kodu](./code-generator.md) nazywają swoje pliki w ten sam sposób, podobnie jak przycisk `Export CSV`, który dodaje po znaczniku czasu nazwę arkusza: `-words.csv`, `-terms.csv` lub `-domains.csv`. Obraz otrzymuje nazwę bazy danych z chwili otwarcia okna dialogowego.

Polecenia `Import`, `Import and Add` i `Export` są też dostępne w palecie [Szybkie wyszukiwanie](./quick-search.md) na karcie ERD, z tymi samymi pozycjami co menu kontekstowe kanwy.

W aplikacji Obsidian nie pojawia się okno dialogowe pobierania ani zapisu: plik jest zapisywany w sejfie, w miejscu, w którym Obsidian umieszcza nowe załączniki dla tego diagramu, a komunikat podaje jego ścieżkę.  
Znaki, których Obsidian nie dopuszcza w nazwie pliku, `\ / : * ? " < > |`, są zastępowane znakiem `-`.  
Eksplorator plików aplikacji Obsidian pokazuje wyeksportowany plik `.erd.json` lub `.sql` tylko wtedy, gdy opcja Settings → Files and links → Detect all file extensions jest włączona.

### Obraz {#image}

Polecenie `Export` ▸ `Image`, wywołane z menu kontekstowego kanwy lub z Szybkiego wyszukiwania, otwiera okno dialogowe `Export image`: podgląd obrazu obok jego opcji. Otwarty [Eksplorator](./explorer.md#dialogs-beside-it) pozostaje otwarty pod przyciemnionym obszarem.

![Otwieranie Export > Image, wyłączanie opcji Dark mode i Background, wybieranie 3x i kopiowanie obrazu do schowka](/img/demo-export.webp)

- `Background`: Domyślnie włączona. Po wyłączeniu kanwa pozostaje przezroczysta.
- `Dark mode`: Początkowo odpowiada wyglądowi edytora. Dopóki odpowiada wyglądowi na ekranie, obraz przyjmuje własne kolory kanwy, łącznie ze zmianami z [kreatora motywu](./language-and-theme.md); drugi wygląd korzysta z predefiniowanego motywu o tym samym odcieniu szarości i kolorze akcentu.
- `Scale`: `1x`, `2x` lub `3x`, domyślnie wybrana jest wartość `2x`. Określa tylko rozmiar obrazu PNG i kopii w schowku, a wiersz pod nią podaje ten rozmiar w postaci `PNG <width> × <height> px`.

Wybrane ustawienia są zachowywane do zamknięcia edytora i nigdy nie są zapisywane w dokumencie. Podgląd jest rysowany tak samo jak obraz i jest rysowany ponownie, gdy zmieni się opcja `Background` lub `Dark mode`.

Obraz przedstawia diagram w stanie z chwili otwarcia okna dialogowego; aby uwzględnić późniejsze zmiany, zamknij okno dialogowe i otwórz je ponownie. Jego tabele i kolumny są nazywane zgodnie z ustawieniem Widoku nazw, które edytor pokazywał w tej chwili, nawet jeśli przełączono je tylko na twoim ekranie, a blokada `Name View` zachowuje w pliku inny widok – zobacz sekcję [Poza kanwą](./logical-names.md#beyond-the-canvas). Kolory, które [kontrole słowników](./dictionary.md#marks-on-the-canvas) nadają nazwom na kanwie, nie są rysowane. Obraz obejmuje cały diagram, bez względu na to, jak daleko jest on przewinięty, jest przycinany do tego, co rysuje diagram, z dodatkiem marginesu, i zawsze jest rysowany w powiększeniu 100%, niezależnie od bieżącego powiększenia edytora, więc każda tabela jest narysowana w całości. To, co ukrywają [Opcje widoku](./table-related-functions.md#table-view-options) – relacje, ich etykiety ON DELETE i ON UPDATE, grupy tabel lub notatki – nie jest rysowane ani nie zajmuje miejsca, a grupy tabel są rysowane za wszystkimi innymi elementami.

Obraz zapisują trzy przyciski i każdy z nich pozostawia okno dialogowe otwarte:

- `PNG`: Zapisuje plik `.png` o rozmiarze diagramu w powiększeniu 100% pomnożonym przez wartość `Scale`. Obraz PNG zbyt duży dla kanwy przeglądarki jest zapisywany w zmniejszonej rozdzielczości, zamiast zakończyć się błędem: okno dialogowe ostrzega o tym wcześniej komunikatem `Reduced from <width> × <height> px, past what a browser canvas can hold`, a komunikat `Exported at a reduced resolution` informuje o tym później.
- `SVG`: Zapisuje plik `.svg` o rozmiarze diagramu w powiększeniu 100%, niezależnie od wartości `Scale`, i nigdy go nie zmniejsza. Tekst pozostaje w nim tekstem, a czcionki są wskazywane nazwą zamiast osadzania, więc program do wyświetlania bez czcionki edytora rysuje tekst inną czcionką. Cienie są pomijane.
- `Copy to clipboard`: Umieszcza w schowku obraz PNG z wybraną wartością `Scale`, zmniejszony tak jak zapisywany plik PNG, gdy kanwa przeglądarki nie może go pomieścić. Potwierdza to komunikatem `Copied the image to the clipboard` lub `Copied at a reduced resolution`, gdy obraz został zmniejszony. Jeśli kopiowanie się nie powiedzie, ponieważ przeglądarka lub host odmawia dostępu do schowka albo nie udało się narysować obrazu, komunikat `Couldn't copy the image` sugeruje zamiast tego zapisanie obrazu PNG.

Obraz jest rysowany w procesie roboczym w tle, jeśli host go uruchamia, więc w tym czasie z edytora można dalej korzystać. Gdy trwa to dłużej niż chwilę, pojawia się komunikat `Exporting PNG`, `Exporting SVG` lub `Copying image`, a błąd jest zgłaszany jako `Couldn't export the PNG` lub `Couldn't export the SVG`. Zamknięcie okna dialogowego, gdy plik jest jeszcze rysowany, nie przerywa jego zapisu.

Po otwarciu okna dialogowego fokus ma przycisk `PNG`, a klawisz `Tab` nie wychodzi poza okno dialogowe. Klawisz `Escape`, przycisk `x` lub kliknięcie przyciemnionego obszaru wokół okna zamyka je.  
Gdy okno jest otwarte, skróty kanwy, łącznie z cofaniem i ponawianiem, a także kopiowanie i wklejanie nic nie robią. `Ctrl + K` (Windows/Linux) lub `⌘ + K` (Mac) zamyka je i otwiera Szybkie wyszukiwanie. `Ctrl + F` (Windows/Linux) lub `⌘ + F` (Mac) zamyka je i umieszcza kursor tekstowy w polu wyszukiwania panelu [Eksplorator](./explorer.md#opening-and-closing), otwierając Eksplorator, jeśli jest zamknięty, ale nigdy go nie zamykając. W edytorze zbyt wąskim, aby pokazać Eksplorator, skrót nadal zamyka okno dialogowe, ale zamiast przenosić kursor tekstowy, wyświetla powiadomienie.
