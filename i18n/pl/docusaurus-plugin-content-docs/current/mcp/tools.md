---
sidebar_position: 4
description: Wszystkie narzędzia serwera MCP erd-editor – odczytywanie dokumentu strona po stronie, kontrole słowników, 67 narzędzi edycji, erd_batch oraz postać wyniku i odrzucenia.
---

# Narzędzia

Serwer udostępnia 77 narzędzi: pięć narzędzi sesji, cztery narzędzia odczytu, 67 narzędzi edycji, po jednym na każdą operację edycji, oraz narzędzie `erd_batch`, które uruchamia kilka narzędzi edycji jako jedną zmianę.

Każde narzędzie oprócz `erd_list_documents` przyjmuje jako pierwszy argument ścieżkę dokumentu `path`, a poniższe tabele go pomijają.
Argument oznaczony znakiem `?` jest opcjonalny.

## Narzędzia sesji {#session-tools}

| Narzędzie | Argumenty | Co robi |
| --- | --- | --- |
| `erd_list_documents` | | Wyświetla listę dokumentów ERD z polami `path`, `open`, `active`, `dirty` i `readonly`: dokumentów edytora, który obsługuje katalog roboczy, co w IDE JetBrains obejmuje każdy otwarty projekt, a w przeciwnym razie plików ERD w katalogu roboczym. |
| `erd_open_document` | `create?` | Otwiera dokument do edycji w ERD Editor w edytorze, który go obsługuje, jeśli taki istnieje. Z argumentem `create` najpierw tworzy plik, jeśli go brakuje, a nazwa bez rozszerzenia otrzymuje rozszerzenie `.erd.json`. |
| `erd_save` | | Zapisuje dokument należący do edytora. VS Code pozostawia zmiany agenta niezapisane, dopóki nie wywoła się tego narzędzia; Obsidian i IDE JetBrains zapisują je tak, jak zapisują twoje, a to narzędzie zapisuje je od razu. W trybie Headless każda zmiana jest już zapisana, o czym informuje pole `saved: true` w jej wyniku, i to narzędzie nic nie robi. |
| `erd_undo` | | Cofa ostatnią zmianę wprowadzoną przez tego agenta, nigdy twoją. Wywołania, które nie utworzyły wpisu w historii cofania, są pomijane i wymieniane z nazwy. |
| `erd_redo` | | Ponownie stosuje zmianę, którą ostatnio cofnęło narzędzie `erd_undo`. |

Informacje o tym, co w każdym z trybów robią zapisywanie i cofanie, znajdziesz na stronie [Tryby Live i Headless](./live-and-headless.md).

## Odczyt dokumentu {#reading-a-document}

| Narzędzie | Argumenty | Co robi |
| --- | --- | --- |
| `erd_list` | `query?`, `offset?`, `limit?`, `namesOnly?` | Ustawienia i liczby elementów, a następnie strona tabel z ich indeksami i relacjami, każda tabela z identyfikatorem, położeniem i rozmiarem na kanwie, liczbą kolumn, nazwą logiczną, jeśli ją ma, oraz grupą tabel, jeśli do jakiejś należy. Jeśli narzędzie nie wyszukuje, po tabelach następują grupy tabel, notatki, a potem domeny, terminy i słowa. |
| `erd_get` | `tableIds?`, `tableNames?`, `relationshipIds?`, `indexIds?`, `memoIds?`, `tableGroupIds?`, `wordIds?`, `termIds?`, `domainIds?` | Wskazane encje w całości: tabele z kolumnami i grupą tabel, relacje z kolumnami oraz wartościami `onDelete` i `onUpdate`, indeksy z kolumnami, notatki z tekstem, grupy tabel z tabelami oraz słowa, terminy i domeny ze wszystkimi polami. |
| `erd_read` | `format`, `vendor?`, `statements?`, `header?`, `logicalNameAsComment?`, `tableIds?`, `tableNames?`, `groupNames?` | Cały dokument naraz w jednym z czterech formatów albo kod DDL tylko wybranych tabel lub grup tabel. |
| `erd_list_checks` | `level?`, `tableIds?`, `tableNames?`, `offset?`, `limit?` | Nieprawidłowości wykryte przez słowniki słów, terminów i domen, w takiej postaci, w jakiej wyświetla je arkusz `Checks` karty Słownik w edytorze, strona po stronie. Niczego nie zmienia – zobacz sekcję [Kontrole słowników](#dictionary-checks). |

Agent znajduje identyfikatory za pomocą narzędzia `erd_list`, odczytuje kolumny, wiersze słowników i inne szczegóły za pomocą narzędzia `erd_get` i przekazuje te identyfikatory narzędziom edycji.
Rozmiar tabeli w wyniku `erd_list` to obszar, który zajmuje ona na kanwie: wysokość jest dokładna, a szerokość przybliżona.
Grupa tabel jest wymieniana z zapisanym w niej prostokątem, nazwą, kolorem i liczbą zawartych w niej tabel.
Każda relacja jest wymieniana raz, przy jednej ze swoich dwóch tabel.
Wiersz słownika jest wymieniany z identyfikatorem, polem `name` i tym, co daje nazwie fizycznej lub kolumnie: polem `dataType` domeny, polami `physicalName` i `domainId` terminu oraz polem `abbreviation` słowa. Każdy słownik wymienia swoje wiersze w kolejności, w jakiej pokazuje je jego arkusz.
Ustawienia, które podają narzędzia `erd_list` i `erd_read`, to te zapisywane w pliku – zobacz sekcję [Ustawienia](#settings).

W wyniku `erd_get` i w formacie `snapshot` narzędzia `erd_read` każda tabela i kolumna ma pole `logicalName`, z pustym ciągiem znaków, gdy nie ma nazwy logicznej, oraz pole `nameDerived`, które ma wartość `true`, dopóki nazwę wygenerowały słowniki, więc nowa nazwa logiczna wygeneruje ją ponownie – zobacz sekcję [Słowniki](#dictionaries).
Każda kolumna ma pole `domainId`, podobnie jak każdy termin: z pustym ciągiem znaków, gdy nie ma domeny lub gdy wskazuje domenę, której dokument już nie wymienia.

Narzędzie `erd_read` przyjmuje jeden z czterech formatów:

| `format` | Co zwraca |
| --- | --- |
| `snapshot` | Zwięzły kod JSON z każdą encją i jej identyfikatorem, łącznie z grupami tabel oraz wierszami słów, terminów i domen, oraz z ustawieniami wraz ze skryptami Schematu SQL. Pomija to, co różni się zależnie od osoby oglądającej: zmierzone szerokości, kolejność warstw, widok, kartę i Widok nazw. Przy dużym schemacie bywa obszerny. |
| `sql` | Kod DDL dla jednej z ośmiu baz danych: `Databricks`, `MariaDB`, `MSSQL`, `MySQL`, `Oracle`, `PostgreSQL`, `Snowflake` lub `SQLite`. Domyślną wartością argumentu `vendor` jest baza danych ustawiona w dokumencie. Kod DDL całego dokumentu zawiera jego skrypty przed tabelami i po nich. Z argumentem `tableIds`, `tableNames` lub `groupNames` obejmuje tylko te tabele, z kluczami obcymi, które zawierają, i bez skryptów. Klucze obce mają swoje akcje ON DELETE i ON UPDATE, z wyjątkiem tych, które docelowa baza danych pomija – zobacz sekcję [ON DELETE i ON UPDATE](../guide/guides/relationship-editing.md#on-delete-and-on-update). |
| `json` | Cały dokument dokładnie w takiej postaci, w jakiej trafia do pliku przy zapisie, łącznie ze zmianami, których edytor jeszcze nie zapisał – zobacz sekcję [Postać zapisu i wartość czasu wykonania](../api/advanced/schema.md#storage-form-and-runtime-value). |
| `scripts` | Wyłącznie skrypty dokumentu przed tabelami i po nich, w postaci `{"before":"…","after":"…"}`, każdy pusty, jeśli nie jest ustawiony, bez względu na wielkość schematu. |

Tylko format `sql` przyjmuje argumenty `vendor`, `statements`, `header`, `logicalNameAsComment`, `tableIds`, `tableNames` i `groupNames`, a każdy inny format je odrzuca.

- `statements`: `create`, wartość domyślna; wartość `ifNotExists`, która generuje `CREATE TABLE IF NOT EXISTS` w MySQL, MariaDB, PostgreSQL, SQLite i Databricks, a zwykłe `CREATE TABLE` w pozostałych bazach; lub wartość `recreate`, która usuwa tabele przed ich utworzeniem, przy czym Snowflake generuje zamiast tego `CREATE OR REPLACE TABLE`.
- `header`: `none`, wartość domyślna; wartość `use`, która wybiera bazę danych lub schemat wskazany przez nazwę bazy danych dokumentu; lub wartość `createAndUse`, która najpierw tworzy tę bazę danych lub schemat. Oracle ma tylko `use`, więc tam `createAndUse` generuje `use`, a PostgreSQL ma tylko `createAndUse`, więc tam `use` nie generuje nagłówka. SQLite nie generuje żadnego nagłówka, a żadna baza danych nie generuje go, gdy nazwa bazy danych jest pusta lub nie jest zwykłym identyfikatorem.
- `logicalNameAsComment`: wartość `true` zapisuje nazwę logiczną tabeli lub kolumny jako jej komentarz, gdy komentarz jest pusty lub zawiera same białe znaki, w tych miejscach i w tej postaci, w jakich każda baza danych zapisuje komentarz, i zachowuje każdy komentarz zawierający tekst; wartość `false`, domyślna, nie zapisuje żadnej nazwy logicznej – zobacz sekcję [Nazwy logiczne jako komentarze](../guide/guides/schema-sql.md#logical-names-as-comments).
- `groupNames`: tabele grup tabel wskazanych po nazwie, bez uwzględniania wielkości liter, łączone z tabelami z argumentów `tableIds` i `tableNames`. Nazwa, która nie pasuje do żadnej grupy, jest odrzucana z kodem `notFound`. Grupa bez tabel nie dodaje żadnej tabeli, a odczyt, w którym nie zostaje ani jedna tabela, na przykład gdy każda wskazana grupa jest pusta i nie wskazano żadnej tabeli, jest odrzucany z kodem `invalidArgs`.

Argumenty `statements`, `header` i `logicalNameAsComment` dotyczą także kodu DDL wybranych tabel. Działają tak jak opcje `Statements` i `Header` oraz przełącznik `Write logical names into empty comments` na karcie [Schemat SQL](../guide/guides/schema-sql.md#options-panel) w edytorze, choć karta domyślnie używa wartości `If not exists` i `CREATE + USE`. Przełącznik jest początkowo wyłączony, tak jak argument `logicalNameAsComment`.
Nazwy są ujmowane w cudzysłów typu zapisanego w pliku, czyli zablokowanego, gdy opcja `Bracket Type` jest zablokowana – zobacz sekcję [Blokada](../guide/guides/settings.md#lock).

### Duże schematy {#large-schemas}

Działają także schematy z setkami lub tysiącami tabel.
Odczyt zwraca najwyżej 40 000 znaków, czyli mniej niż próg, od którego Claude Code odkłada wynik narzędzia do pliku.

- Narzędzie `erd_list` zwraca domyślnie stronę 100 elementów, najpierw tabele, potem grupy tabel, notatki, domeny, terminy i słowa, przy czym przesunięcie liczy się wspólnie dla nich wszystkich, oraz podaje w polach `nextOffset` i `note`, gdzie zaczyna się następna strona. Przekaż tę wartość `nextOffset` jako `offset` z tym samym argumentem `query`.
- Argument `query` znajduje tabele po słowach w nazwie, nazwie logicznej lub komentarzu tabeli albo kolumny, bez uwzględniania wielkości liter. Tabele, których nazwy lub nazwy logiczne zawierają więcej z tych słów, są na początku. Wyszukiwanie nie wymienia grup tabel, notatek ani wierszy słowników.
- Argument `namesOnly` wymienia same nazwy tabel, około 2000 krótkich nazw w jednej odpowiedzi.
- Narzędzia `erd_get` i `erd_read` przyjmują oprócz identyfikatorów także `tableNames`, a `erd_read` przyjmuje `groupNames`, więc agent poproszony o zapytanie SQL dla dużego schematu odczytuje kod DDL tylko tych tabel, których potrzebuje.
- Słowniki również są zwracane w częściach: `erd_list` przechodzi strona po stronie przez ich wiersze po tabelach, a `erd_get` zwraca wiersze w całości według `domainIds`, `termIds` i `wordIds`.
- Narzędzie `erd_get` wymienia w polu `missing` identyfikatory i nazwy, które niczego nie wskazują, a w polu `notReturned` identyfikatory, na które zabrakło miejsca w jednej odpowiedzi, aby można było poprosić o nie ponownie.
- Narzędzie `erd_list_checks` zwraca wyniki strona po stronie w ten sam sposób – zobacz sekcję [Kontrole słowników](#dictionary-checks).
- Odczyt zbyt duży na jedną odpowiedź jest odrzucany z kodem `tooLarge` i informacją, jak go zawęzić.

### Kontrole słowników {#dictionary-checks}

Narzędzie `erd_list_checks` wymienia kontrole z [arkusza Kontrole](../guide/guides/dictionary.md#the-checks-sheet) w edytorze, w tej samej kolejności: najpierw kontrole słów, potem terminów i domen, każdy słownik w kolejności, w jakiej pokazuje go jego arkusz, a następnie kontrole każdej tabeli, po których następują kontrole jej kolumn.
Tak jak w arkuszu, kontrola działa tylko wtedy, gdy słownik, który odczytuje, zawiera jakiś wiersz. Dokument, którego słowniki nie zawierają żadnego słowa, terminu ani domeny, w ogóle nie jest sprawdzany: pole `total` ma wartość `0`, a informuje o tym pole `note`.

- `level`: `error` lub `warning`, aby uzyskać tylko kontrole tego poziomu; domyślnie oba poziomy.
- `tableIds` i `tableNames`: tylko kontrole tych tabel i ich kolumn, z nazwami bez uwzględniania wielkości liter, co pomija własne wiersze słowników. Identyfikator lub nazwa, które nie wskazują żadnej tabeli, są odrzucane z kodem `notFound`.
- `offset` i `limit`: domyślnie strona 100 kontroli, która kończy się też wtedy, gdy jedna odpowiedź jest pełna. Gdy są kolejne, pola `nextOffset` i `note` podają, gdzie zaczyna się następna strona; przekaż tę wartość jako `offset` z tymi samymi filtrami. Po poprawieniu tego, co zgłaszają niektóre kontrole, wyświetl listę ponownie od przesunięcia `0`: rozwiązana kontrola znika z listy, więc późniejsze przesunięcie pominęłoby kontrole jeszcze nierozwiązane.

Odpowiedź zawiera pole `total`, czyli liczbę kontroli, które pozostawiają filtry; pole `counts`, czyli liczbę tych kontroli dla każdego kodu, z pominięciem kodów bez kontroli; oraz stronę jako `checks`.
Każda kontrola podaje swój poziom `level`, kod `code` oraz rodzaj `kind` i identyfikator `id` swojego obiektu: `table`, `column`, `word`, `term` lub `domain`. Kontrola kolumny dodaje pole `tableId` oraz nazwę jej tabeli jako `table`.
Pole `name` to nazwa obiektu, w przypadku tabeli lub kolumny jej nazwa fizyczna, z polem `logicalName`, gdy obiekt ma nazwę logiczną. Pole `field` wskazuje, co odczytuje kontrola: `name`, `logicalName` lub `domainId`. Pole `text` to to, co tam znalazła, a pole `suggestions`, o ile słowniki coś proponują, to to, czego użyć zamiast tego. Dzięki temu agent może rozwiązać kontrolę bez wywołania `erd_get`:

```json
{"level":"warning","code":"physicalNameMismatch","kind":"column","id":"8e1z0q4xk2m7cwd5tfb9h3ynp","tableId":"03h17be2plxpj5n59tqag7ogj","table":"users","name":"id","logicalName":"Member Number","field":"name","text":"id","suggestions":["MBR_NO"]}
```

| `code` | `level` | `Type` w arkuszu | Co wykrywa |
| --- | --- | --- | --- |
| `duplicateName` | `error` | `Duplicate name` | Nazwa wspólna dla dwóch wierszy jednego słownika. Wymieniany jest każdy z tych wierszy. |
| `unknownDomain` | `error` | `Unknown domain` | Kolumna lub termin powiązane z domeną, której dokument już nie wymienia. Pole `text` to nazwa tej domeny albo jej identyfikator, gdy nazwa nie jest znana. |
| `forbiddenWord` | `error` | `Forbidden word` | Słowo, które jakieś słowo wymienia jako zakazane, w nazwie logicznej tabeli lub kolumny albo w nazwie terminu. Pole `suggestions` zawiera słowa standardowe. |
| `unregisteredWord` | `warning` | `Unregistered word` | Tekst, którego nie wymienia żadne słowo, w tych samych miejscach. |
| `synonymWord` | `warning` | `Synonym` | Synonim użyty zamiast słowa standardowego, w tych samych miejscach. Pole `suggestions` zawiera słowa standardowe. |
| `physicalNameMismatch` | `warning` | `Physical name mismatch` | Nazwa fizyczna tabeli lub kolumny inna niż ta, którą daje termin odpowiadający jej nazwie logicznej. Sugestią jest nazwa fizyczna terminu albo nazwa składana z jego słów, gdy termin jej nie zawiera. |
| `domainTypeMismatch` | `warning` | `Domain type mismatch` | Kolumna, której typ danych nie jest typem danych powiązanej z nią domeny. Pole `text` to typ kolumny, a sugestia – typ domeny. |

To, jak każda kontrola odczytuje nazwę, opisano w sekcji [Co wykrywa każda kontrola](../guide/guides/dictionary.md#what-each-check-finds).

## Narzędzia edycji {#edit-tools}

Identyfikatory pochodzą z narzędzi `erd_list` i `erd_get` albo z pola `createdIds` wywołania, które utworzyło encję.
Nowy identyfikator składa się z 25 małych liter i cyfr, na przykład `03h17be2plxpj5n59tqag7ogj`, a identyfikator, który dokument już zawiera, zachowuje swoją postać, więc nie wyciągaj wniosków z kształtu identyfikatora.
Argumenty `x` i `y` to lewa i górna krawędź na kanwie w pikselach, a kolor to kolor szesnastkowy CSS, taki jak `#3b82f6`, albo pusty ciąg znaków, który usuwa kolor.

### Tabele {#tables}

| Narzędzie | Argumenty | Co robi |
| --- | --- | --- |
| `erd_add_table` | | Dodaje pustą tabelę w wolnym miejscu i zwraca jej identyfikator w polu `createdIds`. |
| `erd_remove_table` | `tableId` | Usuwa tabelę wraz z jej kolumnami, indeksami i każdą relacją, która jej dotyczy. |
| `erd_change_table_name` | `tableId`, `value` | Zmienia nazwę tabeli. Nazwa jest wtedy traktowana jako wpisana ręcznie, więc późniejsza nazwa logiczna pozostawia ją bez zmian, dopóki nie jest pusta – zobacz sekcję [Słowniki](#dictionaries). |
| `erd_change_table_comment` | `tableId`, `value` | Ustawia komentarz tabeli. Pusty ciąg znaków go usuwa. |
| `erd_set_table_logical_name` | `tableId`, `value` | Ustawia nazwę logiczną tabeli. Pusty ciąg znaków ją usuwa i pozostawia nazwę fizyczną. Gdy nazwa tabeli jest pusta lub wygenerowana, słowniki generują ją na podstawie nazwy logicznej – zobacz sekcję [Słowniki](#dictionaries). Termin nie daje tabeli żadnej domeny. |
| `erd_change_table_color` | `tableId`, `color` | Ustawia kolor tabeli. |
| `erd_move_table` | `tableId`, `x`, `y` | Przenosi tabelę na podaną pozycję na kanwie. |
| `erd_move_tables` | `positions` | Przenosi kilka tabel w jednej zmianie, którą cofa jedno wywołanie `erd_undo`. Argument `positions` zawiera `{ tableId, x, y }` dla każdej tabeli, przy czym każda tabela występuje najwyżej raz. |
| `erd_sort_tables` | | Rozmieszcza wszystkie tabele w wierszach na kanwie, zaczynając od tych z najmniejszą liczbą kolumn, tak jak rozmieszczają je narzędzia `erd_import_sql`, `erd_import_graphql`, `erd_import_dbml` i `erd_import_aml`. Tabele grupy tabel pozostają razem, a ramka każdej grupy zostaje do nich dopasowana. |

### Kolumny {#columns}

| Narzędzie | Argumenty | Co robi |
| --- | --- | --- |
| `erd_add_column` | `tableId` | Dodaje pustą kolumnę do tabeli i zwraca jej identyfikator w polu `createdIds`. |
| `erd_remove_columns` | `tableId`, `columnIds` | Usuwa kolumny z jednej tabeli wraz z relacjami i pozycjami indeksów, które z nich korzystają. |
| `erd_change_column_name` | `tableId`, `columnId`, `value` | Zmienia nazwę kolumny. Nazwa jest wtedy traktowana jako wpisana ręcznie, tak jak nazwa tabeli. |
| `erd_change_column_data_type` | `tableId`, `columnId`, `value` | Ustawia typ danych, taki jak `INT` lub `VARCHAR(255)`. Gdy włączona jest [Synchronizacja typu danych w relacjach](../guide/guides/settings.md#relationship-datatype-sync), zmiana przechodzi wzdłuż relacji w obu kierunkach, tak jak w edytorze: typ serial trafia do kluczy obcych jako typ całkowity, który przechowuje, tak jak kopiuje go narzędzie `erd_add_relationship`, a klucz typu serial zachowuje swój typ, gdy zmienia się jeden z jego kluczy obcych, co zatrzymuje zmianę w tym miejscu. Włączanie i wyłączanie synchronizacji należy do użytkownika, a `erd_list` podaje ją jako `relationshipDataTypeSync`. Kolumna powiązana z domeną zostaje od niej odłączona, gdy ustawi się typ inny niż typ domeny, podobnie jak każda kolumna, do której dociera synchronizacja, a której nowy typ różni się od typu jej własnej domeny – zobacz sekcję [Odłączanie od domeny](../guide/guides/dictionary.md#unlinking). |
| `erd_change_column_default` | `tableId`, `columnId`, `value` | Ustawia wartość domyślną jako tekst SQL. Pusty ciąg znaków ją usuwa. |
| `erd_change_column_comment` | `tableId`, `columnId`, `value` | Ustawia komentarz. Pusty ciąg znaków go usuwa. |
| `erd_set_column_logical_name` | `tableId`, `columnId`, `value` | Ustawia nazwę logiczną kolumny. Pusty ciąg znaków ją usuwa i pozostawia nazwę fizyczną. Gdy nazwa kolumny jest pusta lub wygenerowana, słowniki ją generują, a domena terminu zostaje powiązana z kolumną i nadaje jej swój typ danych – zobacz sekcję [Słowniki](#dictionaries). |
| `erd_set_column_domain` | `tableId`, `columnId`, `domainId?`, `domainName?` | Wiąże kolumnę z domeną wskazaną przez identyfikator albo nazwę, jedno z dwóch. Kolumna przyjmuje typ danych domeny, który przechodzi wzdłuż relacji, gdy włączona jest Synchronizacja typu danych w relacjach, z takim samym odłączaniem od domeny jak w `erd_change_column_data_type`. Argument `domainId` z wartością `null` lub pustym ciągiem znaków albo pusty argument `domainName` odłącza kolumnę od domeny i zachowuje jej typ. |
| `erd_set_column_primary_key` | `tableId`, `columnId`, `value` | Wartość `true` dodaje kolumnę do klucza podstawowego, a `false` ją z niego usuwa. |
| `erd_set_column_unique` | `tableId`, `columnId`, `value` | Określa, czy kolumna jest unikatowa. |
| `erd_set_column_not_null` | `tableId`, `columnId`, `value` | Określa, czy kolumna jest `NOT NULL`. |
| `erd_set_column_auto_increment` | `tableId`, `columnId`, `value` | Określa, czy kolumna ma autoinkrementację. |
| `erd_move_column` | `tableId`, `columnId`, `targetColumnId` | Przenosi kolumnę w obrębie jej tabeli na pozycję innej kolumny. |

### Relacje {#relationships}

Argument `relationshipType` to liczność na końcu przy tabeli podrzędnej: `ZeroOne`, `ZeroN`, `OneOnly` lub `OneN`.
Tabela początkowa to tabela nadrzędna, czyli strona docelowa odwołania, która zawiera klucz podstawowy, a tabela końcowa to tabela podrzędna.
Argumenty `onDelete` i `onUpdate` to akcje ON DELETE i ON UPDATE klucza obcego: `none`, `noAction`, `cascade`, `setNull`, `setDefault` lub `restrict`.
Wartość `none` nie generuje żadnej klauzuli, więc obowiązuje domyślne zachowanie bazy danych – zobacz sekcję [ON DELETE i ON UPDATE](../guide/guides/relationship-editing.md#on-delete-and-on-update).
Akcja pominięta w wywołaniu `erd_add_relationship` lub `erd_link_columns` ma wartość `none`.

| Narzędzie | Argumenty | Co robi |
| --- | --- | --- |
| `erd_add_relationship` | `startTableId`, `endTableId`, `relationshipType`, `onDelete?`, `onUpdate?` | Łączy dwie tabele relacją. Kopiuje klucz podstawowy tabeli nadrzędnej do tabeli podrzędnej jako kolumny klucza obcego, a jeśli tabela nadrzędna nie ma klucza podstawowego, najpierw tworzy kolumnę klucza podstawowego. Każda kolumna klucza obcego otrzymuje taką nazwę, jaką nadaje jej rysowanie relacji w edytorze: klucz `id` tabeli `users` daje `users_id`, a klucz taki jak `member_id` zachowuje swoją nazwę – zobacz sekcję [Nazwy kolumn kluczy obcych](../guide/guides/relationship-editing.md#foreign-key-column-names). Każda kopiuje typ danych swojego klucza, z tym że klucz typu serial daje przechowywany przez siebie typ całkowity, np. `integer` dla `serial4`, a sam typ `serial` pozostaje typem `serial` poza PostgreSQL, MySQL i MariaDB – zobacz sekcję [Relacje identyfikujące](../guide/guides/relationship-editing.md#identifying-relationships). Każda przejmuje też nazwę logiczną swojego klucza i wiąże się z domeną, z którą powiązany jest jej klucz, chyba że klucz typu serial daje jej inny typ. Pole `createdIds` zawiera nową kolumnę klucza, jeśli taka powstała, kolumny klucza obcego, a na końcu identyfikator relacji. |
| `erd_link_columns` | `startTableId`, `startColumnIds`, `endTableId`, `endColumnIds`, `relationshipType`, `onDelete?`, `onUpdate?` | Rysuje relację między istniejącymi już kolumnami, łącząc w pary kolumny początkowe i końcowe według pozycji. Nie zmienia nazwy żadnej kolumny ani żadnego typu danych i nie kopiuje żadnej nazwy logicznej ani domeny. |
| `erd_remove_relationship` | `relationshipId` | Usuwa linię relacji. Jej kolumny klucza obcego pozostają w tabeli. |
| `erd_change_relationship_type` | `relationshipId`, `relationshipType` | Zmienia liczność relacji. |
| `erd_change_relationship_on_delete` | `relationshipId`, `onDelete` | Ustawia akcję ON DELETE relacji: to, co usunięcie wiersza nadrzędnego robi z jego wierszami podrzędnymi. |
| `erd_change_relationship_on_update` | `relationshipId`, `onUpdate` | Ustawia akcję ON UPDATE relacji: to, co zmiana klucza nadrzędnego robi z jego wierszami podrzędnymi. |

Narzędzie `erd_add_relationship` nadaje nazwy kolumnom klucza obcego i kopiuje nazwy logiczne ich kluczy w chwili uruchomienia. Późniejsza zmiana nazwy lub nazwy logicznej klucza do nich nie dociera, więc najpierw nadaj nazwy tabeli nadrzędnej i jej kluczowi podstawowemu oraz nadaj kluczowi nazwę logiczną.
Nadane przez nie nazwy są traktowane jako wpisane ręcznie, więc późniejsza nazwa logiczna pozostawia je bez zmian, natomiast `erd_derive_physical_names` oddaje je słownikom – zobacz sekcję [Słowniki](#dictionaries).

Żadne narzędzie nie zmienia kolumn istniejącej relacji tak, jak robi to okno dialogowe [Mapuj kolumny](../guide/guides/relationship-editing.md#map-columns) w edytorze.
Aby zmapować relację na inne kolumny, uruchom narzędzie `erd_remove_relationship`, które pozostawia jej kolumny klucza obcego w tabeli, oraz `erd_link_columns` z wybranymi kolumnami w jednym wywołaniu `erd_batch`, które cofa jedno wywołanie `erd_undo`.

### Indeksy {#indexes}

Identyfikator kolumny indeksu to pozycja na liście kolumn indeksu, którą podaje `erd_get`, a nie identyfikator kolumny tabeli.

| Narzędzie | Argumenty | Co robi |
| --- | --- | --- |
| `erd_add_index` | `tableId` | Dodaje pusty indeks do tabeli i zwraca jego identyfikator w polu `createdIds`. |
| `erd_remove_index` | `indexId` | Usuwa indeks. |
| `erd_change_index_name` | `indexId`, `value` | Zmienia nazwę indeksu. |
| `erd_set_index_unique` | `indexId`, `value` | Określa, czy indeks jest unikatowy. |
| `erd_add_index_column` | `indexId`, `columnId` | Dodaje kolumnę tabeli indeksu i zwraca identyfikator nowej kolumny indeksu. Kolumna, która jest już w indeksie, pozostaje bez zmian. |
| `erd_remove_index_column` | `indexId`, `indexColumnId` | Usuwa jedną kolumnę z indeksu. |
| `erd_move_index_column` | `indexId`, `indexColumnId`, `targetIndexColumnId` | Przenosi kolumnę w obrębie indeksu na pozycję innej z jego kolumn. |
| `erd_set_index_column_order` | `indexId`, `indexColumnId`, `orderType` | Ustawia kolejność sortowania jednej kolumny w indeksie: `ASC` lub `DESC`. |

### Notatki {#memos}

| Narzędzie | Argumenty | Co robi |
| --- | --- | --- |
| `erd_add_memo` | | Dodaje pustą notatkę w wolnym miejscu i zwraca jej identyfikator w polu `createdIds`. |
| `erd_remove_memo` | `memoId` | Usuwa notatkę. |
| `erd_change_memo_value` | `memoId`, `value` | Zastępuje tekst notatki. |
| `erd_change_memo_color` | `memoId`, `color` | Ustawia kolor notatki. |
| `erd_move_memo` | `memoId`, `x`, `y` | Przenosi notatkę na podaną pozycję na kanwie. |
| `erd_resize_memo` | `memoId`, `width`, `height` | Zmienia rozmiar notatki. Szerokość musi wynosić co najmniej około `116` pikseli, a wysokość co najmniej `100`. Nie tworzy wpisu w historii cofania, ponieważ edytor rejestruje zmianę rozmiaru notatki tylko przy przeciąganiu. |

Gdy notatki są ukryte za pomocą [View Option](../guide/guides/table-related-functions.md#table-view-options) → `Memos`, narzędzie `erd_add_memo` nadal dodaje notatkę, która pozostaje ukryta, dopóki notatki nie zostaną ponownie pokazane.
Narzędzia `erd_list` i `erd_get` wymieniają również ukryte notatki.

### Grupy tabel {#table-groups}

Grupa tabel to nazwana ramka rysowana za jej tabelami, a jej kolor widać na ramce i na nagłówkach jej tabel – zobacz stronę [Grupy tabel](../guide/guides/table-groups.md).
Tabela należy najwyżej do jednej grupy. Narzędzia `erd_move_table`, `erd_move_tables` i `erd_move_table_group` nigdy nie zmieniają tego, które tabele należą do grupy, niezależnie od tego, gdzie umieszczą tabelę, natomiast w edytorze tabela dołącza do grupy lub ją opuszcza w zależności od miejsca, w którym zostanie upuszczona – zobacz sekcję [Dodawanie i usuwanie tabel](../guide/guides/table-groups.md#adding-and-removing-tables). Narzędzia `erd_add_table_group` i `erd_set_table_group` umieszczają tabele w grupie, a `erd_remove_table_group` pozostawia jej tabele poza jakąkolwiek grupą.
Grupa przechowuje prostokąt o szerokości co najmniej `160` pikseli i wysokości co najmniej `100`, łącznie z paskiem tytułu, a edytor rysuje ramkę powiększoną tak, aby mieściła każdą z jej tabel.

| Narzędzie | Argumenty | Co robi |
| --- | --- | --- |
| `erd_add_table_group` | `name`, `color?`, `x?`, `y?`, `width?`, `height?`, `tableIds?` | Dodaje grupę i zwraca jej identyfikator w polu `createdIds`. Przekaż albo `tableIds`, albo prostokąt, czyli `x`, `y`, `width` i `height` razem. Z argumentem `tableIds` każda tabela opuszcza grupę, do której należała, a prostokąt zostaje dopasowany do tych tabel tak, jak dopasowuje go [grupowanie zaznaczonych tabel](../guide/guides/table-groups.md#grouping-selected-tables). Prostokąt obejmuje każdą tabelę nienależącą do żadnej grupy, jeśli jej środek leży w jego obrębie, tak jak [rysowanie grupy](../guide/guides/table-groups.md#drawing-a-group). Pusta wartość `name` pozostawia grupę bez nazwy. Jedno wywołanie `erd_undo` usuwa grupę i przywraca każdą tabelę do grupy, w której była. |
| `erd_remove_table_group` | `groupId` | Usuwa grupę. Jej tabele pozostają na swoich miejscach, poza jakąkolwiek grupą. |
| `erd_change_table_group_name` | `groupId`, `value` | Zmienia nazwę grupy. Pusty ciąg znaków pozostawia ją bez nazwy. |
| `erd_change_table_group_color` | `groupId`, `color` | Ustawia kolor grupy. |
| `erd_move_table_group` | `groupId`, `x`, `y` | Przenosi grupę tak, aby jej prostokąt zaczynał się w podanym punkcie, i przesuwa jej tabele o tyle samo, tak jak przeciąganie jej paska tytułu. Przesunięcie o mniej niż 20 pikseli, licząc łącznie w poziomie i w pionie, nie tworzy wpisu w historii cofania. |
| `erd_resize_table_group` | `groupId`, `x?`, `y?`, `width`, `height` | Ustawia prostokąt grupy, a jej tabele pozostają na swoich miejscach. Pominięcie `x` i `y` zachowuje jego narożnik. Prostokąt, który nie pomieściłby tabel grupy wraz z ich marginesem, jest odrzucany z komunikatem podającym obszar, który musi pomieścić. |
| `erd_set_table_group` | `tableIds`, `groupId` | Umieszcza tabele w grupie, a każda z nich opuszcza grupę, do której należała. Argument `groupId` z wartością `null` lub pustym ciągiem znaków wyjmuje je ze wszystkich grup. |

Gdy grupy są ukryte za pomocą `View Option` → `Table Groups`, te narzędzia nadal dodają i zmieniają grupy, które pozostają ukryte, dopóki grupy nie zostaną pokazane – zobacz sekcję [Ukrywanie grup](../guide/guides/table-groups.md#hiding-groups).
Narzędzie `erd_sort_tables` utrzymuje tabele każdej grupy razem, `erd_import_dbml` i `erd_import_json` wczytują grupy – zobacz sekcję [Import](#import) – a `erd_read` generuje kod DDL wybranych grup za pomocą argumentu `groupNames`.
Wersja ERD Editor wydana przed wprowadzeniem grup tabel usuwa grupy z pliku przy jego zapisywaniu, tak jak rozszerzenie VS Code w wersji starszej niż `4.0.0` oraz wtyczki Obsidian i JetBrains w wersji starszej niż `1.0.0` – zobacz sekcję [Aktualizacja](./installation.md#updating).

### Słowniki {#dictionaries}

Te narzędzia edytują trzy słowniki karty [Słownik](../guide/guides/dictionary.md) w edytorze, które na podstawie nazwy logicznej tabeli lub kolumny generują jej nazwę fizyczną:

- Słowo to słowo standardowe, z którego składają się nazwy logiczne, wraz ze skrótem, który wpisuje do nazwy fizycznej, na przykład `Member` i `MBR`.
- Termin to cała nazwa logiczna wraz z nazwą fizyczną, którą daje, oraz, w przypadku kolumny, domeną, z którą ją wiąże, na przykład `Member Number` z `MBR_NO` i `Identifier`.
- Domena to nazwany typ danych, z którym wiążą się kolumny, na przykład `Identifier` dla `INT`.

| Narzędzie | Argumenty | Co robi |
| --- | --- | --- |
| `erd_add_word` | `name`, `abbreviation`, `englishName?`, `description?`, `synonyms?`, `forbiddenWords?` | Dodaje słowo na końcu słownika słów i zwraca jego identyfikator w polu `createdIds`. Argumenty `synonyms` i `forbiddenWords` są rozdzielane przecinkami: inne zapisy tego słowa oraz słowa, których nie wolno używać zamiast niego. |
| `erd_update_word` | `wordId`, `name?`, `abbreviation?`, `englishName?`, `description?`, `synonyms?`, `forbiddenWords?` | Zmienia przekazane pola i pozostawia pozostałe. |
| `erd_remove_word` | `wordId` | Usuwa słowo. |
| `erd_add_term` | `name`, `physicalName?`, `domainId?`, `domainName?`, `description?`, `synonyms?` | Dodaje termin na końcu słownika terminów i zwraca jego identyfikator w polu `createdIds`. Bez argumentu `physicalName` słowa składają nazwę fizyczną, jeśli mogą, na przykład `MBR_NO` dla `Member Number`. |
| `erd_update_term` | `termId`, `name?`, `physicalName?`, `domainId?`, `domainName?`, `description?`, `synonyms?` | Zmienia przekazane pola i pozostawia pozostałe. Argument `name` przekazany, gdy termin nie zawiera nazwy fizycznej, lub razem z pustym argumentem `physicalName` zapisuje też nazwę fizyczną składaną z jego słów, jeśli da się ją z nich złożyć. |
| `erd_remove_term` | `termId` | Usuwa termin. |
| `erd_add_domain` | `name`, `category?`, `dataType`, `description?` | Dodaje domenę na końcu słownika domen i zwraca jej identyfikator w polu `createdIds`. Argument `category` grupuje domeny, na przykład `Number` lub `Text`. |
| `erd_update_domain` | `domainId`, `name?`, `category?`, `dataType?`, `description?` | Zmienia przekazane pola i pozostawia pozostałe. Nowa wartość `dataType` trafia do każdej kolumny powiązanej z domeną i przechodzi wzdłuż relacji, gdy włączona jest Synchronizacja typu danych w relacjach, z takim samym odłączaniem od domeny jak w `erd_change_column_data_type`. |
| `erd_remove_domain` | `domainId` | Usuwa domenę. Powiązane z nią kolumny zachowują swój typ danych, a one i powiązane z nią terminy nie pokazują żadnej domeny: ich pole `domainId` jest odczytywane jako pusty ciąg znaków. Narzędzie `erd_undo` przywraca powiązania, a zapis pomija je w pliku. |
| `erd_derive_physical_names` | `scope`, `tableId?`, `columnId?` | Ponownie generuje nazwy fizyczne na podstawie nazw logicznych, tak jak polecenie [Wygeneruj ponownie nazwy fizyczne](../guide/guides/dictionary.md#derive-physical-names-again) w edytorze, dla jednej kolumny, jednej tabeli lub całego dokumentu. |

- Słownik zawiera każdą nazwę tylko raz, więc nazwa, którą ma już inny wiersz tego samego słownika, jest odrzucana z kodem `invalidArgs`. Nazwy są porównywane bez spacji na początku i na końcu, z uwzględnieniem wielkości liter, więc `Member` i `member` to dwie różne nazwy.
- Aktualizacja wskazuje wiersz przez jego identyfikator i przekazuje co najmniej jedno pole. Wartości, które wiersz już zawiera, niczego nie zmieniają i nie tworzą wpisu w historii cofania; dodanie lub usunięcie zawsze go tworzy.
- Domenę terminu podaje się albo argumentem `domainId`, z wartością `null` lub pustym ciągiem znaków oznaczającymi brak domeny, albo argumentem `domainName`, z pustym ciągiem znaków oznaczającym brak domeny. Argument `domainName` wybiera pierwszą domenę o tej nazwie w kolejności słownika, porównując nazwy w ten sam sposób. Przekazanie obu argumentów lub wartości `domainName`, której nie ma żadna domena, jest odrzucane. Narzędzie `erd_set_column_domain` przyjmuje domenę w ten sam sposób.
- Zmiana lub usunięcie słowa albo terminu nie zmienia żadnej nazwy i niczego nie odłącza od domeny: nazwy i domeny, które słowo lub termin nadało, pozostają bez zmian. Narzędzie `erd_derive_physical_names` ponownie generuje nazwy i wiąże domenę, którą termin daje teraz, ale kolumna, do której teraz nie pasuje żaden termin lub której termin nie daje żadnej domeny, zachowuje domenę, z którą jest powiązana. `erd_set_column_domain` z pustym argumentem `domainId` odłącza ją od domeny.
- Żadne narzędzie nie importuje ani nie eksportuje słownika jako pliku CSV, nie sortuje słownika ani nie wstawia wierszy w wybranym miejscu, tak jak robi to karta Słownik.

Narzędzie `erd_list` wymienia wiersze, `erd_get` podaje wszystkie pola, format `snapshot` narzędzia `erd_read` zawiera je wszystkie, a `erd_list_checks` wymienia nieprawidłowości wykryte przez słowniki – zobacz sekcję [Odczyt dokumentu](#reading-a-document).

Narzędzia `erd_set_table_logical_name` i `erd_set_column_logical_name` generują nazwę fizyczną tak jak edytor po wpisaniu nazwy logicznej – zobacz sekcję [Generowanie nazw fizycznych](../guide/guides/dictionary.md#deriving-physical-names):

- Nazwa jest generowana tylko wtedy, gdy jest pusta lub sama została wygenerowana, co odczyty pokazują jako `nameDerived: true`. Niepusta nazwa wpisana ręcznie pozostaje, a zapisywana jest tylko nazwa logiczna. Narzędzia `erd_change_table_name` i `erd_change_column_name`, importy SQL, GraphQL, DBML i AML oraz kolumny klucza obcego, którym nazwy nadaje `erd_add_relationship`, zapisują nazwy jako wpisane ręcznie. Nazwa zmieniona na pusty ciąg znaków zostaje ponownie wygenerowana przy następnej nazwie logicznej.
- Pierwszeństwo ma termin, którego nazwa jest nazwą logiczną, przy czym nazwy są porównywane tak jak nazwy w słowniku. Daje on swoją nazwę fizyczną albo nazwę składaną z jego słów, gdy sam jej nie zawiera. W przypadku kolumny wiąże ją też z domeną terminu, nawet gdy żadna nazwa nie jest generowana, a kolumna przyjmuje typ danych domeny, który przechodzi wzdłuż relacji, gdy włączona jest Synchronizacja typu danych w relacjach.
- Gdy takiego terminu nie ma, nazwę składają słowa, a ich skróty są łączone podkreśleniami: `Member Number` daje `MBR_NO`. Obowiązuje zasada „wszystko albo nic”: synonim, słowo zakazane, tekst, którego nie wymienia żadne słowo, lub słowo bez skrótu sprawiają, że nic nie zostaje złożone, a nazwa pozostaje taka, jaka była. Słowa nie wiążą żadnej domeny, podobnie jak termin bez domeny, więc kolumna zachowuje domenę, z którą jest powiązana.
- Kolumna, której wygenerowaną nazwę ma już inna kolumna jej tabeli, bez względu na wielkość liter, zachowuje swoją nazwę, wartość `nameDerived` i domenę.
- Usunięcie nazwy logicznej pozostawia nazwę fizyczną bez zmian. Wywołanie, którego nazwa logiczna i to, co ona generuje, są już na miejscu, niczego nie zmienia i nie tworzy wpisu w historii cofania.

Narzędzie `erd_derive_physical_names` przyjmuje argument `scope`: `column` z argumentami `tableId` i `columnId` dla tej kolumny; `table` z argumentem `tableId` dla nazwy tabeli i każdej jej kolumny; lub `document` bez identyfikatora dla każdej tabeli i jej kolumn. Zakres, któremu brakuje potrzebnego identyfikatora lub któremu przekazano identyfikator, którego nie przyjmuje, jest odrzucany.
Każda objęta nazwa, która ma nazwę logiczną, wraca do słowników, łącznie z nazwą wpisaną ręcznie, i przyjmuje to, co one dają teraz: nazwę fizyczną terminu oraz, w przypadku kolumny, jego domenę i typ, a w przeciwnym razie nazwę złożoną ze słów, co pozostawia domenę kolumny bez zmian. Nazwa logiczna, która niczego nie generuje, pozostawia nazwę fizyczną bez zmian, przy czym `nameDerived` ma teraz wartość `true`. Nazwa bez nazwy logicznej pozostaje bez zmian, podobnie jak kolumna, której nową nazwę ma już inna kolumna jej tabeli, na przykład drugi klucz obcy do tej samej tabeli; taka kolumna zachowuje też swoją wartość `nameDerived`. Jedno wywołanie `erd_undo` cofa całe wywołanie.
Nazwy zaimportowanego schematu są traktowane jako wpisane ręcznie, więc aby nadać mu nazwy ze słowników, ustaw nazwy logiczne, a następnie wywołaj `erd_derive_physical_names`. To wywołanie daje własną nazwę fizyczną terminu, a zmiana słów terminu nie składa jej ponownie. Dlatego po zmianie słów terminu najpierw zaktualizuj termin: przekaż jego `name` z pustym argumentem `physicalName`, aby słowa złożyły ją od nowa, albo przekaż nową wartość `physicalName`.

Wersja ERD Editor wydana przed wprowadzeniem karty Słownik usuwa z pliku nazwy logiczne, powiązania z domenami i wiersze słowników przy jego zapisywaniu, tak jak rozszerzenie VS Code w wersji starszej niż `4.2.0` oraz wtyczki Obsidian i JetBrains w wersji starszej niż `1.2.0`. Spośród nich rozszerzenie w wersji `4.0.0` lub `4.1.0` oraz wtyczki w wersji `1.0.0` lub `1.1.0` nadal edytują na żywo z serwerem, ale ani nie pokazują, ani nie zachowują nazw logicznych, powiązań z domenami i wierszy słowników zapisanych przez agenta – zobacz sekcję [Aktualizacja](./installation.md#updating).

### Ustawienia {#settings}

Agent zmienia ustawienia samego schematu: bazę danych, jej nazwę i skrypty karty [Schemat SQL](../guide/guides/schema-sql.md).
Każde inne ustawienie przechowywane w dokumencie użytkownik ustawia sam w edytorze: [Widok nazw](../guide/guides/logical-names.md#name-view), przełączniki [Opcji widoku](../guide/guides/table-related-functions.md#table-view-options), opcje karty [Ustawienia](../guide/guides/settings.md), język i style nazw Generatora kodu, typ cudzysłowu oraz [blokady](../guide/guides/settings.md#lock).
Żadne narzędzie ich nie zmienia, z wyjątkiem importów w trybie `replace`: `erd_import_json` przenosi ustawienia i blokady wczytywanego dokumentu, a pozostałe cztery przywracają widok na początek kanwy – zobacz sekcję [Import](#import).
Serwer w wersji `1.0.0` usunął narzędzia, które je ustawiały: `erd_set_language`, `erd_set_table_name_case`, `erd_set_column_name_case`, `erd_set_bracket_type`, `erd_set_relationship_data_type_sync`, `erd_set_relationship_optimization`, `erd_set_column_order`, `erd_set_max_width_comment`, `erd_set_ignore_save_settings` i `erd_set_show`.

Narzędzie `erd_list` i format `snapshot` narzędzia `erd_read` podają ustawienia w postaci zapisanej w pliku, a pole `lockSettings` zawiera po jednej fladze na każdą blokadę: `viewport`, `canvasType`, `language`, `tableNameCase`, `columnNameCase`, `bracketType` i `unlockNameViewMode`.
Ostatnia flaga ma odwrotne znaczenie: ma wartość `false`, gdy blokada `Name View` jest włączona, tak jak w nowym dokumencie i w pliku zapisanym przed wprowadzeniem tej blokady, a wartość `true`, gdy użytkownik wyłączy blokadę.
Zablokowany język, styl nazw lub typ cudzysłowu jest podawany z zablokowaną wartością, którą przechowuje plik i z którą otwiera się każdy edytor, niezależnie od tego, co pokazuje ekran edytora. Widok, karta i Widok nazw nie są podawane. Agent odczytuje i zapisuje nazwy logiczne niezależnie od tego, co pokazuje Widok nazw.

Narzędzie `erd_set_ddl_script` tworzy wpis w historii cofania. Narzędzia `erd_set_database` i `erd_set_database_name` go nie tworzą, więc `erd_undo` nie może ich cofnąć.

| Narzędzie | Argumenty | Co robi |
| --- | --- | --- |
| `erd_set_database` | `value` | Ustawia bazę danych: `MariaDB`, `MSSQL`, `MySQL`, `Oracle`, `PostgreSQL`, `SQLite`, `Databricks` lub `Snowflake`. Określa typy danych tej bazy oraz kod DDL, który generuje `erd_read`, gdy nie podano argumentu `vendor`. |
| `erd_set_database_name` | `value` | Ustawia nazwę bazy danych, którą podają nagłówki `use` i `createAndUse` narzędzia `erd_read`. |
| `erd_set_ddl_script` | `position`, `sql` | Ustawia jeden z dwóch skryptów umieszczanych wokół tabel – zobacz sekcję [Skrypty przed tabelami i po nich](../guide/guides/schema-sql.md#before-and-after-scripts). Argument `position` ma wartość `before`, czyli skrypt umieszczany przed tabelami, np. `CREATE EXTENSION` lub `CREATE SCHEMA`, albo `after`, czyli skrypt umieszczany po nich, np. `GRANT` lub `CREATE VIEW`. Argument `sql` zastępuje cały skrypt, maksymalnie 10 000 znaków, a pusty ciąg znaków go usuwa. Najpierw odczytaj bieżący skrypt za pomocą formatu `scripts` narzędzia `erd_read`. |

Skrypt trafia bez zmian do kodu DDL każdej bazy danych, więc napisz go pod kątem bazy danych dokumentu. W MSSQL po skrypcie, którego ostatni wiersz nie jest `GO`, dodawany jest wiersz `GO`.
Wersja ERD Editor wydana przed wprowadzeniem tych skryptów usuwa skrypty z pliku przy jego zapisywaniu, tak jak rozszerzenie VS Code w wersji starszej niż `4.0.0` oraz wtyczki Obsidian i JetBrains w wersji starszej niż `1.0.0` – zobacz sekcję [Aktualizacja](./installation.md#updating).

### Import {#import}

Te narzędzia wczytują schemat tak, jak robi to menu importu w edytorze – zobacz stronę [Importowanie i eksportowanie plików](../guide/guides/file-import-export.md).
Każde z nich przyjmuje tekst jako `value` oraz argument `mode`: domyślny `replace` lub `append`.

| Narzędzie | Argumenty | Co robi |
| --- | --- | --- |
| `erd_import_sql` | `value`, `mode?` | Wczytuje kod SQL DDL, czyli instrukcje `CREATE TABLE` i podobne. |
| `erd_import_graphql` | `value`, `mode?` | Wczytuje dokument GraphQL SDL. |
| `erd_import_dbml` | `value`, `mode?` | Wczytuje kod DBML. Każdy blok `TableGroup` staje się grupą tabel złożoną z tabel, które wymienia – zobacz sekcję [DBML](../guide/guides/file-import-export.md#dbml). |
| `erd_import_aml` | `value`, `mode?` | Wczytuje kod AML. |
| `erd_import_json` | `value`, `mode?` | Wczytuje dokument erd-editor w formacie JSON, np. inny plik `.erd.json`. |

Tryb `replace` zastępuje dokument, a `erd_undo` przywraca poprzedni:

- `erd_import_sql`, `erd_import_graphql`, `erd_import_dbml` i `erd_import_aml` zastępują wszystkie tabele, relacje, indeksy, notatki i grupy tabel. Zachowują ustawienia dokumentu, łącznie z blokadami, z wyjątkiem widoku, który wraca na początek kanwy przy powiększeniu 100%, a także słowniki słów, terminów i domen dokumentu. Tabele, które wnoszą, nie mają nazw logicznych i nie są powiązane z żadną domeną.
- `erd_import_json` zastępuje cały dokument, łącznie z jego ustawieniami i słownikami: ustawienia, blokady, słowa, terminy i domeny z kodu JSON zajmują miejsce tych z tego dokumentu, a kod JSON, w którym nie zapisano blokad, włącza wszystkie blokady i przenosi widok na początek kanwy. Każda osoba oglądająca zachowuje własny Widok nazw, chyba że w kodzie JSON blokada `Name View` jest wyłączona – wtedy obowiązuje Widok nazw z kodu JSON. Aby zachować ustawienia tego dokumentu, zacznij od tekstu, który zwraca format `json` narzędzia `erd_read`. Pusty tekst daje nowy dokument, taki jak ten, który tworzy `erd_open_document` z argumentem `create`.

Tryb `append` dodaje importowaną zawartość do dokumentu, tak jak operacja [Importuj i dodaj](../guide/guides/file-import-export.md#import-and-add) w edytorze, a jedno wywołanie `erd_undo` cofa całe to dodanie:

- Zawartość tekstu trafia do dokumentu jako nowe encje z nowymi identyfikatorami, w bloku umieszczonym poniżej wszystkiego, co zawiera dokument, łącznie z ukrytymi notatkami i grupami tabel, i wyrównanym do jego lewej krawędzi. Każda istniejąca już tabela i każde ustawienie pozostają, łącznie z tabelą o tej samej nazwie: nic nie jest scalane według nazwy.
- Relacje i indeksy obejmują tylko tabele wnoszone przez import, więc klucz obcy do tabeli, której tekst nie deklaruje, jest pomijany.
- `erd_import_sql`, `erd_import_graphql` i `erd_import_aml` dodają tabele wraz z ich relacjami i indeksami, a `erd_import_dbml` także swoje grupy tabel. `erd_import_json` dodaje tabele, relacje, indeksy, notatki i grupy tabel, ale nigdy swoich ustawień, i odrzuca pusty tekst. Jego tabele i kolumny wnoszą swoje nazwy logiczne, ale żadna kolumna nie jest powiązana z domeną i do dokumentu nie trafia żadne słowo, termin ani domena z kodu JSON.

Dokument JSON zachowuje własny układ, łącznie z grupami tabel: w trybie `replace` w miejscach, w których umieszcza swoje tabele, a w trybie `append` wewnątrz dodanego bloku.
Tabele z kodu SQL, GraphQL, DBML i AML są rozmieszczane w wierszach, od tych z najmniejszą liczbą kolumn, z tabelami każdej grupy razem, tak jak rozmieszcza je `erd_sort_tables`, a nigdy w układzie `Flow`, w którym import samego edytora układa je, gdy jest to możliwe. Te cztery narzędzia odrzucają pusty tekst w obu trybach.

## erd_batch {#erd_batch}

Narzędzie `erd_batch` uruchamia kolejno kilka narzędzi edycji jako jedną zmianę, na zasadzie „wszystko albo nic”.

- Argument `operations` zawiera do 100 pozycji, każdą w postaci `{ tool, as?, args? }`, gdzie `tool` to narzędzie edycji, a `args` to argumenty narzędzia bez `path`. Narzędzie odczytu, takie jak `erd_list_checks`, jest odrzucane.
- Operacje są najpierw wykonywane na próbę na kopii dokumentu. Odrzucona operacja jest wskazywana, na przykład `operations[1] erd_remove_table: …`, i nic nie zostaje zastosowane.
- Jedno wywołanie `erd_undo` cofa cały pakiet, z wyjątkiem operacji, których nie może cofnąć, a które wymienia pole `undoNote` wyniku: operacji wykonanych narzędziem, które nie tworzy wpisu w historii cofania, na przykład `erd_set_database`, oraz operacji, które zmieniły dokument bez utworzenia takiego wpisu, na przykład krótkiego przesunięcia za pomocą `erd_move_table_group`. Narzędzie `erd_undo` pomija pakiet, który nie utworzył żadnego wpisu w historii cofania. Pole `historyEntries` w wyniku liczy wpisy w historii edytora w obrębie pakietu, a nie wywołania `erd_undo`.
- W sesji w trybie Live edytor przyjmuje cały pakiet albo żadnej jego części.

Agent nie może znać identyfikatorów tworzonych przez pakiet przed wywołaniem, więc operacja nazwana za pomocą `as` pozwala późniejszej operacji się do nich odwołać: `$name` lub `$name.0` oznacza jej pierwszy utworzony identyfikator, `$name.1` drugi, a `$name.last` ostatni.
Nazwa składa się z liter ASCII, cyfr i podkreśleń, nie zaczyna się od cyfry i oznacza tylko jedną operację.
Odwołanie jest rozwiązywane tylko tam, gdzie argument przyjmuje identyfikator encji, łącznie z `wordId`, `termId` i `domainId`, więc nazwa lub komentarz o treści `$x` pozostaje tekstem.
Argument `domainName` również jest tekstem, ale jest odczytywany w chwili wykonania jego operacji, więc może wskazywać domenę dodaną przez wcześniejszą operację pakietu.

Tabela z kolumnami i relacją w jednym wywołaniu:

```json
{
  "path": "shop.erd.json",
  "operations": [
    { "tool": "erd_add_table", "as": "users" },
    { "tool": "erd_change_table_name", "args": { "tableId": "$users", "value": "users" } },
    { "tool": "erd_add_column", "as": "uid", "args": { "tableId": "$users" } },
    { "tool": "erd_change_column_name", "args": { "tableId": "$users", "columnId": "$uid", "value": "id" } },
    { "tool": "erd_change_column_data_type", "args": { "tableId": "$users", "columnId": "$uid", "value": "BIGINT" } },
    { "tool": "erd_set_column_primary_key", "args": { "tableId": "$users", "columnId": "$uid", "value": true } },
    { "tool": "erd_add_table", "as": "orders" },
    { "tool": "erd_change_table_name", "args": { "tableId": "$orders", "value": "orders" } },
    { "tool": "erd_add_relationship", "args": { "startTableId": "$users", "endTableId": "$orders", "relationshipType": "ZeroN", "onDelete": "cascade" } }
  ]
}
```

Tabela `users` i jej klucz `id` otrzymują nazwy przed utworzeniem relacji, więc kolumna klucza obcego, którą relacja dodaje do tabeli `orders`, to `users_id`.

Słowa, domena i termin, a następnie tabela, która otrzymuje od nich nazwy na podstawie swoich nazw logicznych:

```json
{
  "path": "shop.erd.json",
  "operations": [
    { "tool": "erd_add_word", "args": { "name": "Member", "abbreviation": "MBR" } },
    { "tool": "erd_add_word", "args": { "name": "Number", "abbreviation": "NO" } },
    { "tool": "erd_add_word", "args": { "name": "Name", "abbreviation": "NM" } },
    { "tool": "erd_add_domain", "as": "identifier", "args": { "name": "Identifier", "dataType": "INT" } },
    { "tool": "erd_add_term", "args": { "name": "Member Number", "domainId": "$identifier" } },
    { "tool": "erd_add_table", "as": "members" },
    { "tool": "erd_set_table_logical_name", "args": { "tableId": "$members", "value": "Member" } },
    { "tool": "erd_add_column", "as": "no", "args": { "tableId": "$members" } },
    { "tool": "erd_set_column_logical_name", "args": { "tableId": "$members", "columnId": "$no", "value": "Member Number" } },
    { "tool": "erd_add_column", "as": "nm", "args": { "tableId": "$members" } },
    { "tool": "erd_set_column_logical_name", "args": { "tableId": "$members", "columnId": "$nm", "value": "Member Name" } }
  ]
}
```

Termin składa `MBR_NO` ze swoich słów, a tabela otrzymuje nazwę `MBR`. Kolumna `Member Number` przyjmuje nazwę `MBR_NO` terminu i jego domenę, więc jest powiązana z domeną `Identifier` i ma typ `INT`, a kolumna `Member Name`, której nie zawiera żaden termin, otrzymuje złożoną nazwę `MBR_NM`.

## Wyniki {#results}

Wynikiem zmiany jest jeden wiersz kodu JSON:

```json
{"tool":"erd_add_table","mode":"live","createdIds":["03h17be2plxpj5n59tqag7ogj"],"batches":1,"historyEntries":1}
```

| Pole | Znaczenie |
| --- | --- |
| `mode` | `live` lub `headless` – zobacz stronę [Tryby Live i Headless](./live-and-headless.md). |
| `saved` | `true` w wyniku każdej zmiany, wywołania `erd_batch`, `erd_undo` i `erd_redo` w trybie Headless: plik zawiera zmianę, zanim wywołanie zwróci odpowiedź, więc nie ma już nic do zapisania. Wynik w trybie Live nie ma pola `saved`, ponieważ zmianę przechowuje edytor – zobacz sekcję [Zapisywanie](./live-and-headless.md#saving). |
| `createdIds` | Identyfikatory tego, co utworzyło wywołanie, w kolejności utworzenia. |
| `batches`, `historyEntries` | Liczba pakietów zmian wysłanych przez wywołanie i liczba utworzonych przez nie wpisów w historii edytora. |
| `undoable`, `undoNote` | `undoable` ma wartość `false`, gdy `erd_undo` pominie wywołanie, a `undoNote` podaje przyczynę: narzędzie nie tworzy wpisu w historii cofania, wywołanie zmieniło dokument bez utworzenia wpisu, tak jak `erd_move_table_group` o mniej niż 20 pikseli, albo dokument miał już tę wartość. Wynik `erd_batch` zawsze zawiera pole `undoNote`. Gdy pakiet utworzył wpis w historii cofania, pole informuje, że jedno wywołanie `erd_undo` cofa pakiet, i wymienia każdą operację, której to wywołanie nie cofa; gdy nie utworzył żadnego, wynik zawiera `undoable: false`, a pole informuje, że `erd_undo` go pomija. |
| `mismatch` | Występuje, gdy wywołanie utworzyło inną liczbę pakietów lub wpisów w historii, niż deklaruje narzędzie. |
| `notes` | Występuje, gdy coś w sesji się zmieniło, np. edytor został zamknięty lub przestał obsługiwać dokument albo plik zmienił się na dysku. |

Odrzucenie to wynik błędu zawierający kod i komunikat z informacją, co zrobić:

```json
{"error":{"code":"notFound","message":"tableId nope names no live table; read the document for current ids"}}
```

| `code` | Przyczyna |
| --- | --- |
| `notFound` | Identyfikator nie wskazuje niczego, co obecnie istnieje, albo plik nie istnieje. |
| `invalidArgs` | Brakuje argumentu lub ma on niewłaściwą wartość. |
| `invalidPath` | Ścieżka nie prowadzi do dokumentu ERD. W systemie Windows także ścieżka z nazwą, której Windows nie zapisuje w podanej postaci, lub ścieżka prowadząca do dokumentu, który edytor ma pod inną ścieżką, podaną w komunikacie. |
| `invalidDocument` | Plik nie jest dokumentem, który edytor potrafi odczytać. |
| `tooLarge` | Odczyt nie mieści się w jednej odpowiedzi. |
| `blocked` | Dokument należy do edytora z wyłączonym hubem. Komunikat podaje, jak go włączyć: w VS Code zaufaj obszarowi roboczemu i włącz ustawienie `dineug.erd-editor.agentHub.enabled` albo przeładuj okno; w aplikacji Obsidian włącz opcję Coding agents albo przeładuj aplikację Obsidian; w IDE JetBrains włącz opcję Coding agents albo, jeśli jest już włączona, uruchom ponownie IDE. |
| `hubDisabled` | W IDE JetBrains dokument należy tylko do projektu, któremu IDE nie ufa. Odczyty nadal działają; zaufaj projektowi, aby agent mógł edytować. |
| `conflict` | Plik zmienił się na dysku w trakcie wywołania. Nic nie zostało zapisane. |
| `hubAppeared`, `hubGone` | Edytor zaczął obsługiwać dokument, który agent edytował na dysku, albo edytor, który go obsługiwał, nadal działa, ale jego plik blokady i połączenie zniknęły. Nic nie zostało zapisane. |
| `notSaved` | Narzędzie `erd_save` nie mogło zapisać dokumentu edytora. |
| `readonly` | Edytor ma dokument w trybie tylko do odczytu, np. plik, którego nie może zapisać lub nie potrafi odczytać jako diagramu. Gdy nie ma edytora, sam plik jest tylko do odczytu, np. plik Perforce lub TFVC, który nie został wyewidencjonowany. Nic nie zostało zapisane. |
| `protocolMismatch` | Rozszerzenie lub wtyczka ERD Editor w edytorze i serwer używają różnych wersji protokołu, np. serwer w wersji `1.0.0` lub nowszej z rozszerzeniem VS Code w wersji `3.x`. Odczyty również są odrzucane, a komunikat wskazuje stronę, którą trzeba zaktualizować – zobacz sekcję [Aktualizacja](./installation.md#updating). |
| `hubUnreachable`, `timeout`, `disconnected` | Hub edytora nie przyjął połączenia, nie odpowiedział w ciągu 30 sekund lub rozłączył się w trakcie wywołania. W systemie Windows `hubUnreachable` oznacza także, że Windows nie dopuścił agenta do huba: edytor działa z wyższymi uprawnieniami niż agent, np. gdy został uruchomiony jako administrator, a agent nie, albo agent działa w piaskownicy. |

Inne kody występują rzadziej, a każde odrzucenie zawiera komunikat z informacją, co się stało.

Narzędzia edycji, `erd_batch` i cztery narzędzia odczytu odrzucają argument, którego nie deklarują, lub argument niewłaściwego typu błędem JSON-RPC invalid params (`-32602`), zanim dotkną dokumentu, więc argument z literówką nigdy nie jest po cichu pomijany.
Pięć narzędzi sesji ignoruje argumenty, których nie znają.
