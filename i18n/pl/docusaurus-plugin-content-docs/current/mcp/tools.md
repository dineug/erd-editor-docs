---
sidebar_position: 4
description: Wszystkie narzędzia serwera MCP erd-editor – odczytywanie dokumentu strona po stronie, 54 narzędzia edycji, erd_batch oraz postać wyniku i odrzucenia.
---

# Narzędzia

Serwer udostępnia 63 narzędzia: pięć narzędzi sesji, trzy narzędzia odczytu, 54 narzędzia edycji, po jednym na każdą operację edycji, oraz narzędzie `erd_batch`, które uruchamia kilka narzędzi edycji jako jedną zmianę.

Każde narzędzie oprócz `erd_list_documents` przyjmuje jako pierwszy argument ścieżkę dokumentu `path`, a poniższe tabele go pomijają.
Argument oznaczony znakiem `?` jest opcjonalny.

## Narzędzia sesji {#session-tools}

| Narzędzie | Argumenty | Co robi |
| --- | --- | --- |
| `erd_list_documents` | | Wyświetla listę dokumentów ERD z polami `path`, `open`, `active`, `dirty` i `readonly`: dokumentów edytora, który obsługuje katalog roboczy, co w IDE JetBrains obejmuje każdy otwarty projekt, a w przeciwnym razie plików ERD w katalogu roboczym. |
| `erd_open_document` | `create?` | Otwiera dokument do edycji w ERD Editor w edytorze, który go obsługuje, jeśli taki istnieje. Z argumentem `create` najpierw tworzy plik, jeśli go brakuje, a nazwa bez rozszerzenia otrzymuje rozszerzenie `.erd.json`. |
| `erd_save` | | Zapisuje dokument należący do edytora. VS Code pozostawia zmiany agenta niezapisane, dopóki nie wywoła się tego narzędzia; Obsidian i IDE JetBrains zapisują je tak, jak zapisują twoje, a to narzędzie zapisuje je od razu. W trybie Headless każda zmiana jest już zapisana i to narzędzie nic nie robi. |
| `erd_undo` | | Cofa ostatnią zmianę wprowadzoną przez tego agenta, nigdy twoją. Wywołania, które nie utworzyły wpisu w historii cofania, są pomijane i wymieniane z nazwy. |
| `erd_redo` | | Ponownie stosuje zmianę, którą ostatnio cofnęło narzędzie `erd_undo`. |

Informacje o tym, co w każdym z trybów robią zapisywanie i cofanie, znajdziesz na stronie [Tryby Live i Headless](./live-and-headless.md).

## Odczyt dokumentu {#reading-a-document}

| Narzędzie | Argumenty | Co robi |
| --- | --- | --- |
| `erd_list` | `query?`, `offset?`, `limit?`, `namesOnly?` | Ustawienia i liczby elementów, a następnie strona tabel z ich indeksami i relacjami, każda tabela z identyfikatorem, położeniem i rozmiarem na kanwie, liczbą kolumn oraz grupą tabel, jeśli do jakiejś należy. Jeśli narzędzie nie wyszukuje, po tabelach następują grupy tabel, a potem notatki. |
| `erd_get` | `tableIds?`, `tableNames?`, `relationshipIds?`, `indexIds?`, `memoIds?`, `tableGroupIds?` | Wskazane encje w całości: tabele z kolumnami i grupą tabel, relacje z kolumnami oraz wartościami `onDelete` i `onUpdate`, indeksy z kolumnami, notatki z tekstem, grupy tabel z tabelami. |
| `erd_read` | `format`, `vendor?`, `statements?`, `header?`, `tableIds?`, `tableNames?`, `groupNames?` | Cały dokument naraz w jednym z czterech formatów albo kod DDL tylko wybranych tabel lub grup tabel. |

Agent znajduje identyfikatory za pomocą narzędzia `erd_list`, odczytuje kolumny i inne szczegóły za pomocą narzędzia `erd_get` i przekazuje te identyfikatory narzędziom edycji.
Rozmiar tabeli w wyniku `erd_list` to obszar, który zajmuje ona na kanwie: wysokość jest dokładna, a szerokość przybliżona.
Grupa tabel jest wymieniana z zapisanym w niej prostokątem, nazwą, kolorem i liczbą zawartych w niej tabel.
Każda relacja jest wymieniana raz, przy jednej ze swoich dwóch tabel.
Ustawienia, które podają narzędzia `erd_list` i `erd_read`, to te zapisywane w pliku – zobacz sekcję [Ustawienia](#settings).

Narzędzie `erd_read` przyjmuje jeden z czterech formatów:

| `format` | Co zwraca |
| --- | --- |
| `snapshot` | Zwięzły kod JSON z każdą encją i jej identyfikatorem, łącznie z grupami tabel, oraz z ustawieniami wraz ze skryptami Schematu SQL. Pomija to, co różni się zależnie od osoby oglądającej: zmierzone szerokości, kolejność warstw, widok i kartę. Przy dużym schemacie bywa obszerny. |
| `sql` | Kod DDL dla jednej z ośmiu baz danych: `Databricks`, `MariaDB`, `MSSQL`, `MySQL`, `Oracle`, `PostgreSQL`, `Snowflake` lub `SQLite`. Domyślną wartością argumentu `vendor` jest baza danych ustawiona w dokumencie. Kod DDL całego dokumentu zawiera jego skrypty przed tabelami i po nich. Z argumentem `tableIds`, `tableNames` lub `groupNames` obejmuje tylko te tabele, z kluczami obcymi, które zawierają, i bez skryptów. Klucze obce mają swoje akcje ON DELETE i ON UPDATE, z wyjątkiem tych, które docelowa baza danych pomija – zobacz sekcję [ON DELETE i ON UPDATE](../guide/guides/relationship-editing.md#on-delete-and-on-update). |
| `json` | Cały dokument dokładnie w takiej postaci, w jakiej trafia do pliku przy zapisie, łącznie ze zmianami, których edytor jeszcze nie zapisał – zobacz sekcję [Postać zapisu i wartość czasu wykonania](../api/advanced/schema.md#storage-form-and-runtime-value). |
| `scripts` | Wyłącznie skrypty dokumentu przed tabelami i po nich, w postaci `{"before":"…","after":"…"}`, każdy pusty, jeśli nie jest ustawiony, bez względu na wielkość schematu. |

Tylko format `sql` przyjmuje argumenty `vendor`, `statements`, `header`, `tableIds`, `tableNames` i `groupNames`, a każdy inny format je odrzuca.

- `statements`: `create`, wartość domyślna; wartość `ifNotExists`, która generuje `CREATE TABLE IF NOT EXISTS` w MySQL, MariaDB, PostgreSQL, SQLite i Databricks, a zwykłe `CREATE TABLE` w pozostałych bazach; lub wartość `recreate`, która usuwa tabele przed ich utworzeniem, przy czym Snowflake generuje zamiast tego `CREATE OR REPLACE TABLE`.
- `header`: `none`, wartość domyślna; wartość `use`, która wybiera bazę danych lub schemat wskazany przez nazwę bazy danych dokumentu; lub wartość `createAndUse`, która najpierw tworzy tę bazę danych lub schemat. Oracle ma tylko `use`, więc tam `createAndUse` generuje `use`, a PostgreSQL ma tylko `createAndUse`, więc tam `use` nie generuje nagłówka. SQLite nie generuje żadnego nagłówka, a żadna baza danych nie generuje go, gdy nazwa bazy danych jest pusta lub nie jest zwykłym identyfikatorem.
- `groupNames`: tabele grup tabel wskazanych po nazwie, bez uwzględniania wielkości liter, łączone z tabelami z argumentów `tableIds` i `tableNames`. Nazwa, która nie pasuje do żadnej grupy, jest odrzucana z kodem `notFound`. Grupa bez tabel nie dodaje żadnej tabeli, a odczyt, w którym nie zostaje ani jedna tabela, na przykład gdy każda wskazana grupa jest pusta i nie wskazano żadnej tabeli, jest odrzucany z kodem `invalidArgs`.

Argumenty `statements` i `header` dotyczą także kodu DDL wybranych tabel. Działają tak jak opcje `Statements` i `Header` na karcie [Schemat SQL](../guide/guides/schema-sql.md#options-panel) w edytorze, choć karta domyślnie używa wartości `If not exists` i `CREATE + USE`.
Nazwy są ujmowane w cudzysłów typu zapisanego w pliku, czyli zablokowanego, gdy opcja `Bracket Type` jest zablokowana – zobacz sekcję [Blokada](../guide/guides/settings.md#lock).

### Duże schematy {#large-schemas}

Działają także schematy z setkami lub tysiącami tabel.
Odczyt zwraca najwyżej 40 000 znaków, czyli mniej niż próg, od którego Claude Code odkłada wynik narzędzia do pliku.

- Narzędzie `erd_list` zwraca domyślnie stronę 100 elementów, najpierw tabele, potem grupy tabel, a potem notatki, oraz podaje w polach `nextOffset` i `note`, gdzie zaczyna się następna strona. Przekaż tę wartość `nextOffset` jako `offset` z tym samym argumentem `query`.
- Argument `query` znajduje tabele po słowach w nazwie lub komentarzu tabeli albo kolumny, bez uwzględniania wielkości liter. Tabele, których nazwy zawierają więcej z tych słów, są na początku. Wyszukiwanie nie wymienia grup tabel ani notatek.
- Argument `namesOnly` wymienia same nazwy tabel, około 2000 krótkich nazw w jednej odpowiedzi.
- Narzędzia `erd_get` i `erd_read` przyjmują oprócz identyfikatorów także `tableNames`, a `erd_read` przyjmuje `groupNames`, więc agent poproszony o zapytanie SQL dla dużego schematu odczytuje kod DDL tylko tych tabel, których potrzebuje.
- Narzędzie `erd_get` wymienia w polu `missing` identyfikatory i nazwy, które niczego nie wskazują, a w polu `notReturned` identyfikatory, na które zabrakło miejsca w jednej odpowiedzi, aby można było poprosić o nie ponownie.
- Odczyt zbyt duży na jedną odpowiedź jest odrzucany z kodem `tooLarge` i informacją, jak go zawęzić.

## Narzędzia edycji {#edit-tools}

Identyfikatory pochodzą z narzędzi `erd_list` i `erd_get` albo z pola `createdIds` wywołania, które utworzyło encję.
Nowy identyfikator składa się z 25 małych liter i cyfr, na przykład `03h17be2plxpj5n59tqag7ogj`, a identyfikator, który dokument już zawiera, zachowuje swoją postać, więc nie wyciągaj wniosków z kształtu identyfikatora.
Argumenty `x` i `y` to lewa i górna krawędź na kanwie w pikselach, a kolor to kolor szesnastkowy CSS, taki jak `#3b82f6`, albo pusty ciąg znaków, który usuwa kolor.

### Tabele {#tables}

| Narzędzie | Argumenty | Co robi |
| --- | --- | --- |
| `erd_add_table` | | Dodaje pustą tabelę w wolnym miejscu i zwraca jej identyfikator w polu `createdIds`. |
| `erd_remove_table` | `tableId` | Usuwa tabelę wraz z jej kolumnami, indeksami i każdą relacją, która jej dotyczy. |
| `erd_change_table_name` | `tableId`, `value` | Zmienia nazwę tabeli. |
| `erd_change_table_comment` | `tableId`, `value` | Ustawia komentarz tabeli. Pusty ciąg znaków go usuwa. |
| `erd_change_table_color` | `tableId`, `color` | Ustawia kolor tabeli. |
| `erd_move_table` | `tableId`, `x`, `y` | Przenosi tabelę na podaną pozycję na kanwie. |
| `erd_move_tables` | `positions` | Przenosi kilka tabel w jednej zmianie, którą cofa jedno wywołanie `erd_undo`. Argument `positions` zawiera `{ tableId, x, y }` dla każdej tabeli, przy czym każda tabela występuje najwyżej raz. |
| `erd_sort_tables` | | Rozmieszcza wszystkie tabele w wierszach na kanwie, zaczynając od tych z najmniejszą liczbą kolumn, tak jak rozmieszczają je narzędzia `erd_import_sql`, `erd_import_graphql`, `erd_import_dbml` i `erd_import_aml`. Tabele grupy tabel pozostają razem, a ramka każdej grupy zostaje do nich dopasowana. |

### Kolumny {#columns}

| Narzędzie | Argumenty | Co robi |
| --- | --- | --- |
| `erd_add_column` | `tableId` | Dodaje pustą kolumnę do tabeli i zwraca jej identyfikator w polu `createdIds`. |
| `erd_remove_columns` | `tableId`, `columnIds` | Usuwa kolumny z jednej tabeli wraz z relacjami i pozycjami indeksów, które z nich korzystają. |
| `erd_change_column_name` | `tableId`, `columnId`, `value` | Zmienia nazwę kolumny. |
| `erd_change_column_data_type` | `tableId`, `columnId`, `value` | Ustawia typ danych, taki jak `INT` lub `VARCHAR(255)`. Gdy włączona jest [Synchronizacja typu danych w relacjach](../guide/guides/settings.md#relationship-datatype-sync), zmiana przechodzi wzdłuż relacji w obu kierunkach, tak jak w edytorze: typ serial trafia do kluczy obcych jako typ całkowity, który przechowuje, tak jak kopiuje go narzędzie `erd_add_relationship`, a klucz typu serial zachowuje swój typ, gdy zmienia się jeden z jego kluczy obcych, co zatrzymuje zmianę w tym miejscu. Włączanie i wyłączanie synchronizacji należy do użytkownika, a `erd_list` podaje ją jako `relationshipDataTypeSync`. |
| `erd_change_column_default` | `tableId`, `columnId`, `value` | Ustawia wartość domyślną jako tekst SQL. Pusty ciąg znaków ją usuwa. |
| `erd_change_column_comment` | `tableId`, `columnId`, `value` | Ustawia komentarz. Pusty ciąg znaków go usuwa. |
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
| `erd_add_relationship` | `startTableId`, `endTableId`, `relationshipType`, `onDelete?`, `onUpdate?` | Łączy dwie tabele relacją. Kopiuje klucz podstawowy tabeli nadrzędnej do tabeli podrzędnej jako kolumny klucza obcego, a jeśli tabela nadrzędna nie ma klucza podstawowego, najpierw tworzy kolumnę klucza podstawowego. Każda kolumna klucza obcego otrzymuje taką nazwę, jaką nadaje jej rysowanie relacji w edytorze: klucz `id` tabeli `users` daje `users_id`, a klucz taki jak `member_id` zachowuje swoją nazwę – zobacz sekcję [Nazwy kolumn kluczy obcych](../guide/guides/relationship-editing.md#foreign-key-column-names). Każda kopiuje typ danych swojego klucza, z tym że klucz typu serial daje przechowywany przez siebie typ całkowity, np. `integer` dla `serial4`, a sam typ `serial` pozostaje typem `serial` poza PostgreSQL, MySQL i MariaDB – zobacz sekcję [Relacje identyfikujące](../guide/guides/relationship-editing.md#identifying-relationships). Pole `createdIds` zawiera nową kolumnę klucza, jeśli taka powstała, kolumny klucza obcego, a na końcu identyfikator relacji. |
| `erd_link_columns` | `startTableId`, `startColumnIds`, `endTableId`, `endColumnIds`, `relationshipType`, `onDelete?`, `onUpdate?` | Rysuje relację między istniejącymi już kolumnami, łącząc w pary kolumny początkowe i końcowe według pozycji. Nie zmienia nazwy żadnej kolumny ani żadnego typu danych. |
| `erd_remove_relationship` | `relationshipId` | Usuwa linię relacji. Jej kolumny klucza obcego pozostają w tabeli. |
| `erd_change_relationship_type` | `relationshipId`, `relationshipType` | Zmienia liczność relacji. |
| `erd_change_relationship_on_delete` | `relationshipId`, `onDelete` | Ustawia akcję ON DELETE relacji: to, co usunięcie wiersza nadrzędnego robi z jego wierszami podrzędnymi. |
| `erd_change_relationship_on_update` | `relationshipId`, `onUpdate` | Ustawia akcję ON UPDATE relacji: to, co zmiana klucza nadrzędnego robi z jego wierszami podrzędnymi. |

Narzędzie `erd_add_relationship` nadaje nazwy kolumnom klucza obcego w chwili uruchomienia, więc najpierw nadaj nazwy tabeli nadrzędnej i jej kluczowi podstawowemu.

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

### Ustawienia {#settings}

Agent zmienia ustawienia samego schematu: bazę danych, jej nazwę i skrypty karty [Schemat SQL](../guide/guides/schema-sql.md).
Każde inne ustawienie przechowywane w dokumencie użytkownik ustawia sam w edytorze: przełączniki [Opcji widoku](../guide/guides/table-related-functions.md#table-view-options), opcje karty [Ustawienia](../guide/guides/settings.md), język i style nazw Generatora kodu, typ cudzysłowu oraz [blokady](../guide/guides/settings.md#lock).
Żadne narzędzie ich nie zmienia, z wyjątkiem importów w trybie `replace`: `erd_import_json` przenosi ustawienia i blokady wczytywanego dokumentu, a pozostałe cztery przywracają widok na początek kanwy – zobacz sekcję [Import](#import).
Serwer w wersji `1.0.0` usunął narzędzia, które je ustawiały: `erd_set_language`, `erd_set_table_name_case`, `erd_set_column_name_case`, `erd_set_bracket_type`, `erd_set_relationship_data_type_sync`, `erd_set_relationship_optimization`, `erd_set_column_order`, `erd_set_max_width_comment`, `erd_set_ignore_save_settings` i `erd_set_show`.

Narzędzie `erd_list` i format `snapshot` narzędzia `erd_read` podają ustawienia w postaci zapisanej w pliku, a pole `lockSettings` zawiera po jednej fladze na każdą blokadę: `viewport`, `canvasType`, `language`, `tableNameCase`, `columnNameCase` i `bracketType`.
Zablokowany język, styl nazw lub typ cudzysłowu jest podawany z zablokowaną wartością, którą przechowuje plik i z którą otwiera się każdy edytor, niezależnie od tego, co pokazuje ekran edytora. Widok i karta nie są podawane.

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

- `erd_import_sql`, `erd_import_graphql`, `erd_import_dbml` i `erd_import_aml` zastępują wszystkie tabele, relacje, indeksy, notatki i grupy tabel. Zachowują ustawienia dokumentu, łącznie z blokadami, z wyjątkiem widoku, który wraca na początek kanwy przy powiększeniu 100%.
- `erd_import_json` zastępuje cały dokument, łącznie z jego ustawieniami: ustawienia i blokady z kodu JSON zajmują miejsce ustawień tego dokumentu, a kod JSON, w którym nie zapisano blokad, włącza wszystkie blokady i przenosi widok na początek kanwy. Aby zachować ustawienia tego dokumentu, zacznij od tekstu, który zwraca format `json` narzędzia `erd_read`. Pusty tekst daje nowy dokument, taki jak ten, który tworzy `erd_open_document` z argumentem `create`.

Tryb `append` dodaje importowaną zawartość do dokumentu, tak jak operacja [Importuj i dodaj](../guide/guides/file-import-export.md#import-and-add) w edytorze, a jedno wywołanie `erd_undo` cofa całe to dodanie:

- Zawartość tekstu trafia do dokumentu jako nowe encje z nowymi identyfikatorami, w bloku umieszczonym poniżej wszystkiego, co zawiera dokument, łącznie z ukrytymi notatkami i grupami tabel, i wyrównanym do jego lewej krawędzi. Każda istniejąca już tabela i każde ustawienie pozostają, łącznie z tabelą o tej samej nazwie: nic nie jest scalane według nazwy.
- Relacje i indeksy obejmują tylko tabele wnoszone przez import, więc klucz obcy do tabeli, której tekst nie deklaruje, jest pomijany.
- `erd_import_sql`, `erd_import_graphql` i `erd_import_aml` dodają tabele wraz z ich relacjami i indeksami, a `erd_import_dbml` także swoje grupy tabel. `erd_import_json` dodaje tabele, relacje, indeksy, notatki i grupy tabel, ale nigdy swoich ustawień, i odrzuca pusty tekst.

Dokument JSON zachowuje własny układ, łącznie z grupami tabel: w trybie `replace` w miejscach, w których umieszcza swoje tabele, a w trybie `append` wewnątrz dodanego bloku.
Tabele z kodu SQL, GraphQL, DBML i AML są rozmieszczane w wierszach, od tych z najmniejszą liczbą kolumn, z tabelami każdej grupy razem, tak jak rozmieszcza je `erd_sort_tables`, a nigdy w układzie `Flow`, w którym import samego edytora układa je, gdy jest to możliwe. Te cztery narzędzia odrzucają pusty tekst w obu trybach.

## erd_batch {#erd_batch}

Narzędzie `erd_batch` uruchamia kolejno kilka narzędzi edycji jako jedną zmianę, na zasadzie „wszystko albo nic”.

- Argument `operations` zawiera do 100 pozycji, każdą w postaci `{ tool, as?, args? }`, gdzie `args` to argumenty narzędzia bez `path`.
- Operacje są najpierw wykonywane na próbę na kopii dokumentu. Odrzucona operacja jest wskazywana, na przykład `operations[1] erd_remove_table: …`, i nic nie zostaje zastosowane.
- Jedno wywołanie `erd_undo` cofa cały pakiet, z wyjątkiem operacji, których nie może cofnąć, a które wymienia pole `undoNote` wyniku: operacji wykonanych narzędziem, które nie tworzy wpisu w historii cofania, na przykład `erd_set_database`, oraz operacji, które zmieniły dokument bez utworzenia takiego wpisu, na przykład krótkiego przesunięcia za pomocą `erd_move_table_group`. Narzędzie `erd_undo` pomija pakiet, który nie utworzył żadnego wpisu w historii cofania. Pole `historyEntries` w wyniku liczy wpisy w historii edytora w obrębie pakietu, a nie wywołania `erd_undo`.
- W sesji w trybie Live edytor przyjmuje cały pakiet albo żadnej jego części.

Agent nie może znać identyfikatorów tworzonych przez pakiet przed wywołaniem, więc operacja nazwana za pomocą `as` pozwala późniejszej operacji się do nich odwołać: `$name` lub `$name.0` oznacza jej pierwszy utworzony identyfikator, `$name.1` drugi, a `$name.last` ostatni.
Nazwa składa się z liter ASCII, cyfr i podkreśleń, nie zaczyna się od cyfry i oznacza tylko jedną operację.
Odwołanie jest rozwiązywane tylko tam, gdzie argument przyjmuje identyfikator encji, więc nazwa lub komentarz o treści `$x` pozostaje tekstem.

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

## Wyniki {#results}

Wynikiem zmiany jest jeden wiersz kodu JSON:

```json
{"tool":"erd_add_table","mode":"live","createdIds":["03h17be2plxpj5n59tqag7ogj"],"batches":1,"historyEntries":1}
```

| Pole | Znaczenie |
| --- | --- |
| `mode` | `live` lub `headless` – zobacz stronę [Tryby Live i Headless](./live-and-headless.md). |
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
| `protocolMismatch` | Rozszerzenie lub wtyczka ERD Editor w edytorze i serwer używają różnych wersji protokołu, np. serwer w wersji `1.0.0` z rozszerzeniem VS Code w wersji `3.x`. Odczyty również są odrzucane, a komunikat wskazuje stronę, którą trzeba zaktualizować – zobacz sekcję [Aktualizacja](./installation.md#updating). |
| `hubUnreachable`, `timeout`, `disconnected` | Hub edytora nie przyjął połączenia, nie odpowiedział w ciągu 30 sekund lub rozłączył się w trakcie wywołania. W systemie Windows `hubUnreachable` oznacza także, że Windows nie dopuścił agenta do huba: edytor działa z wyższymi uprawnieniami niż agent, np. gdy został uruchomiony jako administrator, a agent nie, albo agent działa w piaskownicy. |

Inne kody występują rzadziej, a każde odrzucenie zawiera komunikat z informacją, co się stało.

Narzędzia edycji, `erd_batch` i trzy narzędzia odczytu odrzucają argument, którego nie deklarują, lub argument niewłaściwego typu błędem JSON-RPC invalid params (`-32602`), zanim dotkną dokumentu, więc argument z literówką nigdy nie jest po cichu pomijany.
Pięć narzędzi sesji ignoruje argumenty, których nie znają.
