---
sidebar_position: 7
description: Usuwanie relacji, zmiana jej typu, ustawianie akcji ON DELETE i ON UPDATE, mapowanie relacji na istniejące kolumny w oknie dialogowym „Mapuj kolumny”, odczytywanie notacji łącznika i sposobu prowadzenia łączników wokół tabel, praca z relacjami N:M i identyfikującymi oraz sprawdzanie, co nowe kolumny kluczy obcych kopiują ze swojego klucza i jak są nazywane.
---

# Edycja relacji

Relacje rysuje się za pomocą menu kontekstowego kanwy, paska narzędzi kanwy, funkcji [Szybkie wyszukiwanie](./quick-search.md#what-the-palette-lists) lub skrótu klawiaturowego – zobacz stronę [Rozpoczęcie edycji](./editing-start.md).  
Ta strona opisuje, co możesz zrobić z relacją, która już istnieje, jak okno dialogowe [Mapuj kolumny](#map-columns) sprawia, że relacja kończy się na kolumnach, które tabela podrzędna już ma, oraz jak nazywane są kolumny kluczy obcych dodawane przez relację.

## Usuwanie {#deletion}

Relację można usunąć za pomocą menu kontekstowego relacji.

![Usuwanie relacji od products do reviews za pomocą jej menu kontekstowego](/img/demo-relationship-remove.webp)

Nie ma do tego skrótu klawiaturowego, ponieważ relacji nie zaznacza się tak jak tabeli czy notatki: klawisze `Delete` i `Backspace`, które usuwają zaznaczone elementy, nigdy nie usuwają samej relacji – zobacz sekcję [Usuwanie tabel i notatek](./table-related-functions.md#table-and-memo-deletion).  
Relacje są też usuwane razem z tym, co łączą: usunięcie tabeli usuwa każdą relację z nią połączoną, a usunięcie kolumny usuwa każdą relację, która z niej korzysta.

## Zmiana typu {#type-change}

Typ można zmienić za pomocą pozycji `Relationship Type` w menu kontekstowym relacji.  
Dostępne są cztery typy, a bieżący jest oznaczony znacznikiem wyboru:

- Zero One
- Zero N
- One Only
- One N

![Zmiana typu relacji z Zero N na One Only, a potem na One N w jej menu kontekstowym](/img/demo-relationship-type.webp)

Są to te same cztery typy, od których zaczynasz rysowanie relacji, każdy z własnym skrótem klawiaturowym – zobacz stronę [Rozpoczęcie edycji](./editing-start.md).

## ON DELETE i ON UPDATE {#on-delete-and-on-update}

Akcje ustawia się za pomocą pozycji `On Delete` i `On Update` w menu kontekstowym relacji, między pozycjami `Relationship Type` i `Map Columns`.  
Każda z nich oferuje te same sześć pozycji, a bieżąca jest oznaczona znacznikiem wyboru:

- Not set
- NO ACTION
- CASCADE
- SET NULL
- SET DEFAULT
- RESTRICT

Pozycja `Not set` nie zapisuje żadnej klauzuli, więc obowiązuje domyślne zachowanie samej bazy danych. Nowa relacja, narysowana lub utworzona w oknie dialogowym [Mapuj kolumny](#map-columns), ma na początku obie akcje ustawione na `Not set`, a późniejszy wybór pozycji `Not set` usuwa ustawioną akcję.  
Obie akcje są niezależne: zmiana jednej pozostawia drugą bez zmian.  
Łącznik pokazuje, co jest ustawione – zobacz sekcję [Odczytywanie łącznika](#reading-a-connector).  
Relacja skopiowana i wklejona lub zduplikowana razem ze swoimi tabelami zachowuje obie akcje, a import z formatu Schemat SQL, DBML lub AML wczytuje akcje zadeklarowane w pliku – zobacz stronę [Importowanie i eksportowanie plików](./file-import-export.md).

![Ustawianie ON DELETE CASCADE i ON UPDATE RESTRICT w relacji od orders do order_items za pomocą jej menu kontekstowego, z etykietą D:C U:R, a potem odczytywanie obu akcji po najechaniu wskaźnikiem](/img/demo-referential-actions.webp)

Każdą akcję można wybrać niezależnie od bazy danych.  
Akcja, którą wybrana [baza danych](./table-related-functions.md#databases) pomija w swoim Schemacie SQL, ma obok siebie przygaszoną adnotację, na przykład `not in MySQL`. Pozycja `Not set` nigdy jej nie ma, a zmiana bazy danych aktualizuje adnotacje.  
Akcja z adnotacją jest mimo to zapisywana w relacji: łącznik ją pokazuje, a formaty JSON, DBML i AML ją zachowują, ale Schemat SQL tej bazy danych pomija klauzulę, więc obowiązuje domyślne zachowanie bazy danych.

[Schemat SQL](./schema-sql.md) zapisuje następujące akcje i pomija pozostałe:

| Baza danych | ON DELETE | ON UPDATE |
| --- | --- | --- |
| Databricks | `NO ACTION` | `NO ACTION` |
| MSSQL | `NO ACTION`, `CASCADE`, `SET NULL`, `SET DEFAULT` | `NO ACTION`, `CASCADE`, `SET NULL`, `SET DEFAULT` |
| MariaDB | `NO ACTION`, `CASCADE`, `SET NULL`, `RESTRICT` | `NO ACTION`, `CASCADE`, `SET NULL`, `RESTRICT` |
| MySQL | `NO ACTION`, `CASCADE`, `SET NULL`, `RESTRICT` | `NO ACTION`, `CASCADE`, `SET NULL`, `RESTRICT` |
| Oracle | `CASCADE`, `SET NULL` | brak |
| PostgreSQL | wszystkie pięć | wszystkie pięć |
| Snowflake | `NO ACTION` | `NO ACTION` |
| SQLite | wszystkie pięć | wszystkie pięć |

Schemat SQL dla Snowflake zapisuje też komentarz z nazwą każdej pominiętej akcji – zobacz sekcję [Akcje referencyjne](./schema-sql.md#referential-actions).

To, które akcje zapisują formaty docelowe ORM Generatora kodu, zależy zarówno od formatu docelowego, jak i od wybranej bazy danych – zobacz stronę [Generator kodu](./code-generator.md#on-delete-and-on-update).

## Mapuj kolumny {#map-columns}

Okno dialogowe „Mapuj kolumny” przyporządkowuje kluczowi tabeli nadrzędnej kolumny tabeli podrzędnej, po jednym wierszu na każdą kolumnę klucza.  
Każdy wiersz albo korzysta z kolumny, którą tabela podrzędna już ma, albo dodaje nową kolumnę klucza obcego, dzięki czemu relacja może kończyć się na kolumnach, które już istnieją.

![Rysowanie relacji Zero N od members do orders, wybór Map to existing columns i mapowanie id na istniejącą kolumnę member_id](/img/demo-map-columns.webp)

Okno dialogowe można otworzyć na dwa sposoby:

- Podczas rysowania relacji, za pomocą przycisku `Map to existing columns` obok tabeli podrzędnej – zobacz sekcję [Tworzenie relacji](./editing-start.md#relationship-creation). Przycisk `Map` dodaje wtedy relację rysowanego typu.
- Za pomocą pozycji `Map Columns` w menu kontekstowym relacji, aby zmienić kolumny istniejącej relacji. Przycisk `Save` zapisuje wtedy zmianę. Edytor tylko do odczytu nie otwiera menu kontekstowego relacji, więc nie można tam otworzyć okna Mapuj kolumny.

Podtytuł okna dialogowego podaje obie tabele i typ relacji, na przykład `users → posts · One N`. Typ jest tu widoczny, ale nie da się go tu zmienić – aby go zmienić, zobacz sekcję [Zmiana typu](#type-change).

W całym oknie dialogowym, łącznie z komunikatami i dopiskami pod wierszami oraz powiadomieniem, z którym okno się zamyka, tabele i kolumny są nazywane tak, jak nazywa je [Widok nazw](./logical-names.md#beyond-the-canvas).  
Trzy rzeczy pozostają w postaci fizycznej: każdy typ danych, który jest własnym typem kolumny, a nigdy nazwą jej domeny; pozycja `New column: <name>`, która pokazuje nazwę, jaką otrzyma nowa kolumna; oraz wiersze, które okno z przyciskiem `Map` od razu wypełnia, łącząc je w pary według nazwy, nigdy według nazwy logicznej.

Pole `References` określa klucz, na który wskazuje relacja: `Primary Key` z kolumnami w kolejności występowania w tabeli, a następnie `Unique: <column>` dla każdej kolumny oznaczonej opcją `Unique`. Pole jest widoczne tylko wtedy, gdy do wyboru jest więcej niż jedna możliwość.  
Indeks unikatowy nie jest tu traktowany jako klucz, a kolumna z opcją `Unique`, która stanowi cały klucz podstawowy, nie pojawia się na liście dwukrotnie.  
Wybór innego klucza tworzy wiersze od nowa. Wiersz zachowuje wybraną kolumnę, dopóki ta kolumna nadal jest w tabeli podrzędnej.

Pod nagłówkami `Referenced column` i `Foreign key column` każdy wiersz pokazuje kolumnę klucza z jej typem danych oraz listę kolumn tabeli podrzędnej, z którymi można ją połączyć w parę:

- Pozycja `Pick a column` pozostawia wiersz pusty.
- Pozycja `New column: <name>` dodaje nową kolumnę klucza obcego. Wyświetlana nazwa to ta, którą kolumna otrzyma zgodnie z opisem w sekcji [Nazwy kolumn kluczy obcych](#foreign-key-column-names), z numeracją uwzględniającą kolumny tabeli podrzędnej i inne wiersze dodające nową kolumnę. Pozycja nie jest dostępna, gdy nazwa byłaby pusta, jak w przypadku klucza bez nazwy.
- Każda kolumna tabeli podrzędnej w postaci `<name> (<data type>)`. Kolumna wybrana w innym wierszu jest wyświetlana jako `<name> (<data type>) · in use` i nie można jej wybrać, więc żadne dwa wiersze nie korzystają z tej samej kolumny. Kolumnę, której używa już inna relacja, nadal można wybrać, dzięki czemu na przykład współdzielona kolumna `tenant_id` może służyć kilku relacjom.

W oknie z przyciskiem `Map` wiersz jest od razu wypełniony tylko wtedy, gdy dokładnie jedna kolumna tabeli podrzędnej ma, bez uwzględniania wielkości liter, nazwę, którą otrzymałaby dla tego wiersza nowa kolumna klucza obcego przed jakąkolwiek numeracją `_2`, na przykład `users_id` dla `id` w tabeli `users` i `member_id` dla `member_id`. Dopóki opcja [`Bracket`](./schema-sql.md#database-and-bracket) ma wartość `None`, czyli domyślną, liczy się również nazwa utworzona z części tabelowej nazwy tabeli kwalifikowanej schematem, więc kolumna `id` w tabeli `public.users` zostaje połączona w parę z `public.users_id` lub `users_id`. W przypadku klucza `Unique` liczy się także własna nazwa kolumny klucza, więc kolumna `vin` zostaje połączona w parę z kolumną `vin`. Każdy pozostały wiersz zaczyna od pozycji `Pick a column`.  
W oknie z przyciskiem `Save` każdy wiersz zaczyna od kolumny, której relacja używa obecnie. W obu przypadkach wybór innego klucza w polu `References` wypełnia puste wiersze tego klucza według tych samych nazw.

Gdy typ danych wybranej kolumny różni się od typu, który kolumna tabeli nadrzędnej nadaje kluczowi obcemu, informuje o tym komunikat pod wierszem.  
Gdy ustawienie [Synchronizacja typu danych w relacjach](./settings.md#relationship-datatype-sync) jest włączone, a kolumna tabeli nadrzędnej ma typ danych, komunikat brzmi `<column> becomes <type>` i podaje typ, który zapisze mapowanie. W przeciwnym razie brzmi `Types differ: <parent type> and <child type>`, a kolumna zachowuje swój typ.

Przycisk `Map` lub `Save` pozostaje nieaktywny, dopóki coś stoi na przeszkodzie, a komunikat pod wierszami podaje przyczynę:

- `Pick a foreign key column for every referenced column`: któryś wiersz jest nadal pusty.
- `At least one column must reference a different column`: relacja zwrotna, w której każdy wiersz wybiera własną kolumnę nadrzędną.
- `These columns are already linked by another relationship`: inna relacja między tymi samymi dwiema tabelami łączy dokładnie te kolumny.
- `<parent> has no key to reference`: w oknie z przyciskiem `Map` tabela nadrzędna nie ma ani klucza podstawowego, ani kolumny z opcją `Unique`.

Przycisk `Save` pozostaje też nieaktywny, dopóki mapowanie nie różni się od bieżącego mapowania relacji.  
W oknie z przyciskiem `Save` wiersz wyświetla `(removed)`, gdy jego kolumna zniknęła ze swojej tabeli. Wybierz inną kolumnę tabeli podrzędnej lub, jeśli zniknęła kolumna tabeli nadrzędnej, wybierz klucz w polu `References`. W oknie z przyciskiem `Map` wiersz, którego wybrana kolumna zostanie usunięta, wraca do pozycji `Pick a column`.

Dla relacji, której kolumny po stronie nadrzędnej nie są dokładnie jednym z kluczy tabeli nadrzędnej, okno otwiera się z wybraną dodatkową pozycją na końcu pola `References`, `Current columns (not a key)`, która zachowuje te kolumny bez zmian. Gdy tabela nadrzędna nie ma żadnego klucza, jest to jedyna możliwość, a pole `References` nie jest wyświetlane.  
W takim przypadku komunikat `The referenced columns are not a key of <parent>` (lub `<parent> has no key to reference`, gdy tabela nadrzędna nie ma żadnego klucza) jest informacją, a nie błędem: przycisk `Save` nadal działa, więc możesz zmienić kolumny tabeli podrzędnej i zachować odwołanie.  
Dla relacji, której dwóch list kolumn nie da się połączyć w pary, na przykład dlatego, że mają różną długość, okno pokazuje wiersze `(invalid)`, a przycisk `Save` pozostaje nieaktywny, dopóki nie wybierzesz klucza w polu `References` lub, jeśli tabela nadrzędna nie ma klucza, nie dodasz do niej klucza podstawowego albo kolumny z opcją `Unique`.

Otwarte okno dialogowe śledzi zmiany w diagramie, łącznie ze zmianami wprowadzanymi przez współpracownika lub agenta kodującego, i zachowuje dokonany wybór.  
Jeśli w tym czasie zmienią się kolumny relacji lub klucz, z którym okno zostało otwarte, okno dodaje komunikat `This relationship changed while the dialog was open`.

Co zapisują przyciski `Map` i `Save`:

- Przycisk `Map` dodaje relację z pozycjami `On Delete` i `On Update` ustawionymi na `Not set`. Przycisk `Save` zmienia tylko kolumny relacji, kierując jej stronę nadrzędną na klucz wybrany w polu `References`, i zachowuje jej typ oraz akcje ON DELETE i ON UPDATE.
- Wiersz `New column` dodaje kolumnę na końcu tabeli podrzędnej, tak samo jak rysowanie relacji: z flagą `NOT NULL`, z nazwą utworzoną od klucza, z typem danych, wartością domyślną, komentarzem, nazwą logiczną i domeną klucza – zobacz sekcję [Relacje identyfikujące](#identifying-relationships).
- Wybrana kolumna nigdy nie zmienia nazwy ani nie zostaje powiązana z domeną klucza, a jej flaga `Not Null`, klucz podstawowy, flaga `Unique`, wartość domyślna, komentarz i nazwa logiczna pozostają bez zmian. Jej typ danych zmienia się tylko wtedy, gdy ustawienie `Relationship DataType Sync` jest włączone, a kolumna tabeli nadrzędnej ma typ danych: kolumna przyjmuje typ, który kolumna tabeli nadrzędnej nadaje kluczowi obcemu, czyli dla klucza typu serial typ całkowity, tak jak nowa kolumna, a zmiana przenosi się dalej wzdłuż relacji w taki sam sposób jak przy synchronizacji. Każda kolumna, której zmiana nadaje nowy typ, wybrana lub osiągnięta wzdłuż relacji, jest odłączana od swojej [domeny](./dictionary.md#domains-and-data-types), gdy jej nowy typ różni się od typu domeny.
- Kolumna, której mapowanie przestaje używać, pozostaje w tabeli podrzędnej i przestaje być oznaczona jako klucz obcy, chyba że kończy się na niej jeszcze inna relacja.
- Wszystko, co zapisuje jedno użycie przycisku `Map` lub `Save` – łącznie z nowymi kolumnami, zmianami typów i odłączeniami od domen – stanowi jeden krok cofania.

To, czy relacja jest identyfikująca i jak rysowany jest jej koniec przy tabeli nadrzędnej, wynika ze zmapowanych kolumn tabeli podrzędnej, tak jak w przypadku każdej relacji. Mapowanie na kolumny klucza podstawowego tabeli podrzędnej od razu czyni relację identyfikującą, a mapowanie na kolumnę dopuszczającą wartość `NULL` umieszcza kółko na końcu przy tabeli nadrzędnej – zobacz sekcję [Odczytywanie łącznika](#reading-a-connector).  
Klucz obcy w Schemacie SQL odwołuje się do wybranego klucza, na przykład `REFERENCES vehicle (vin)` dla klucza `Unique`.

Jeśli diagram zawiera już to mapowanie, gdy naciśniesz przycisk `Map` lub `Save`, ponieważ współpracownik lub agent kodujący wprowadził je wcześniej, nic nie jest zapisywane.  
Jeśli diagram zmienił się tak, że mapowanie już do niego nie pasuje, nic nie jest zapisywane i pojawia się powiadomienie `Couldn't map columns: the diagram changed`.

Przycisk `Cancel`, przycisk `x`, klawisz `Escape` lub kliknięcie przyciemnionego obszaru poza oknem dialogowym zamyka je, niczego nie zapisując.  
Przyciemniony obszar obejmuje cały edytor, łącznie z paskiem narzędzi, a otwarty [Eksplorator](./explorer.md#dialogs-beside-it) pozostaje pod nim otwarty.  
Okno dialogowe zamyka się również po otwarciu Szybkiego wyszukiwania, po opuszczeniu karty ERD oraz po przełączeniu edytora w tryb tylko do odczytu.  
`Ctrl + F` (Windows/Linux) lub `⌘ + F` (Mac) także zamyka okno dialogowe i umieszcza kursor tekstowy w polu wyszukiwania, którego używa [wyszukiwanie w Eksploratorze](./find-and-replace.md#opening-and-closing), otwierając Eksplorator, jeśli jest zamknięty. W edytorze zbyt wąskim, aby pokazać Eksplorator, skrót nadal zamyka okno dialogowe, ale zamiast przenosić kursor tekstowy, wyświetla powiadomienie – zobacz sekcję [Otwieranie i zamykanie](./explorer.md#opening-and-closing).  
Jeśli jedna z tabel, których dotyczy okno, lub sama relacja zostanie usunięta, gdy okno jest otwarte, okno zamyka się i wyświetla powiadomienie, na przykład `Map Columns closed: the relationship was removed`.  
Gdy okno jest otwarte, skróty klawiaturowe kanwy, cofanie i ponawianie oraz kopiowanie i wklejanie nic nie robią.

Agent kodujący nie ma narzędzia odpowiadającego oknu dialogowemu „Mapuj kolumny”. Aby ponownie zmapować relację, usuwa ją narzędziem `erd_remove_relationship`, które zachowuje jej kolumny kluczy obcych, i rysuje ją ponownie na istniejących kolumnach narzędziem `erd_link_columns`, obie operacje w jednym wywołaniu `erd_batch` – zobacz stronę [Narzędzia](../../mcp/tools.md#relationships).

## Relacje N:M {#nm-relationships}

Ponieważ edytor opiera się na modelu fizycznym, relację N:M wyraża się za pomocą tabeli łączącej, jak pokazano poniżej.

![Rysowanie relacji od products, a potem od tags do pustej tabeli product_tags skrótem ⌘ + ⌥ + 2, co dodaje product_id, a potem tag_id](/img/demo-relationship-n-m.webp)

Gdy tabela łącząca ma już swoje kolumny kluczy, na przykład `product_id` i `tag_id` w tabeli `product_tags`, narysuj każdą relację za pomocą przycisku `Map to existing columns` i wybierz te kolumny, zamiast dodawać nowe – zobacz sekcję [Mapuj kolumny](#map-columns). Jeśli stanowią one klucz podstawowy tabeli łączącej, każda relacja od razu jest identyfikująca.

Import z formatu GraphQL, DBML lub AML sam tworzy tabelę łączącą.  
Deklaracja relacji wiele do wielu trafia do diagramu jako tabela o nazwie `<left>_<right>` z komentarzem `Junction table inferred from <left> <-> <right>`, połączona z obiema stronami relacjami identyfikującymi.  
Zobacz stronę [Importowanie i eksportowanie plików](./file-import-export.md).

## Relacje identyfikujące {#identifying-relationships}

Narysowanie relacji przez kliknięcie tabeli podrzędnej lub za pomocą przycisku `Create new columns` kopiuje każdy klucz podstawowy tabeli nadrzędnej do tabeli podrzędnej jako kolumnę klucza obcego z flagą `NOT NULL`, więc nowa relacja jest początkowo nieidentyfikująca.  
Kopia przejmuje typ danych, wartość domyślną, komentarz i nazwę logiczną klucza, ale nie flagi `Unique` ani `Auto Increment`, a jej nazwa powstaje zgodnie z opisem w sekcji [Nazwy kolumn kluczy obcych](#foreign-key-column-names).  
Wyjątkiem co do typu danych jest klucz typu serial: jego kopia przyjmuje typ całkowity, który przechowuje typ serial. W każdej bazie danych `smallserial` i `serial2` dają `smallint`, `serial4` daje `integer`, a `bigserial` i `serial8` dają `bigint`. Sam typ `serial` daje `integer` w PostgreSQL i `bigint unsigned` w MySQL oraz MariaDB, a w każdej innej bazie danych pozostaje typem `serial`.  
Liczy się tylko cała nazwa typu, bez uwzględniania wielkości liter, więc typ `serial(4)` jest kopiowany w niezmienionej postaci. Typ zapisany wielkimi literami daje wielkie litery: `SERIAL` daje `INTEGER` w PostgreSQL. Kolumna klucza obcego, która w zapisanym diagramie ma już typ `serial`, zachowuje ten typ.  
Kopia zostaje też powiązana z [domeną](./dictionary.md#domains-and-data-types) klucza, pod warunkiem że w chwili tworzenia kopii arkusz `Domains` zawiera tę domenę, a kopia zachowuje typ danych klucza. Dlatego kopia klucza typu serial, która przyjmuje typ całkowity, nie jest powiązana z żadną domeną, natomiast kopia klucza z samym typem `serial`, która zachowuje typ `serial`, jest z nią powiązana.  
Aby relacja stała się identyfikująca, ustaw te kolumny kluczy obcych w tabeli podrzędnej jako klucze podstawowe: zaznacz je wszystkie i naciśnij raz `Alt + K` (Windows/Linux) lub `⌥ + K` (Mac) albo wybierz w menu kontekstowym tabeli pozycję `Primary Key`, która przy zaznaczeniu dwóch lub więcej kolumn nosi nazwę `Primary Key on selected columns` – zobacz sekcję [Klucz podstawowy kolumny](./table-editing.md#column-primary-key).

![Włączanie i wyłączanie klucza podstawowego dla product_id skrótem Alt + K, przez co łącznik staje się ciągły, a potem przerywany](/img/demo-identifying-relationship.webp)

Edytor sam pilnuje tej zgodności.  
Relacja jest identyfikująca, dopóki każda kolumna po jej stronie podrzędnej jest kluczem podstawowym, i staje się nieidentyfikująca, gdy tylko którakolwiek z nich przestanie nim być.

## Nazwy kolumn kluczy obcych {#foreign-key-column-names}

Podczas rysowania relacji każda dodawana kolumna klucza obcego otrzymuje nazwę od klucza tabeli nadrzędnej, który ta kolumna kopiuje:

- Jednowyrazowa nazwa klucza, na przykład `id`, `ID` lub `uuid`, otrzymuje na początku nazwę tabeli nadrzędnej i podkreślenie: `id` w tabeli `products` staje się `products_id`.
- Wielowyrazowa nazwa klucza, na przykład `member_id`, `userId` lub `UserID`, pozostaje bez zmian.
- Jednowyrazowa nazwa klucza, która jest, bez uwzględniania wielkości liter, nazwą samej tabeli, również pozostaje bez zmian: `currency` w tabeli `currency` pozostaje `currency`. Klucz, który jedynie zawiera nazwę tabeli, nadal otrzymuje prefiks: `username` w tabeli `user` staje się `user_username`.

Nazwa jest jednym wyrazem, gdy zawiera wyłącznie litery i cyfry bez zmiany wielkości liter.  
Każdy inny znak ją dzieli, więc `_id`, `order no` i `order-no` składają się z kilku wyrazów.  
Dzieli ją również zmiana wielkości liter, odczytywana tak jak w zapisie camelCase: mała litera, po której następuje wielka (`userId`), dwie wielkie litery, po których następuje mała (`IDCard`, `IDs`), lub litera pisma bez rozróżnienia wielkości liter, takiego jak hangul, kana lub pismo han, obok litery pisma, które ją rozróżnia (`회원ID`).  
Cyfry nie dzielą wyrazu, więc `id2` i `SHA256` są jednym wyrazem. Wyraz złożony zapisany literami jednej wielkości też jest jednym wyrazem: `memberid` w tabeli `members` staje się `members_memberid`.

Nazwa tabeli jest używana w takiej postaci, w jakiej jest zapisana, z wyjątkiem spacji na początku i na końcu: wielkość liter, spacje wewnątrz i kropki są zachowywane, nazwa nie jest zamieniana na liczbę pojedynczą, a opcje `Table Name Case` i `Column Name Case` Generatora kodu nie mają znaczenia. Tabela `Users` z kluczem `ID` daje `Users_ID`.  
Każda kolumna klucza złożonego otrzymuje nazwę osobno: tabela `orders` z kluczem (`tenant_id`, `id`) dodaje `tenant_id` i `orders_id`.

Nazwa, którą tabela podrzędna już ma, bez uwzględniania wielkości liter, otrzymuje numer `_2`, `_3` i tak dalej, przy czym wybierany jest pierwszy wolny numer.  
Druga relacja od tabeli `users` z kluczem `id` do tej samej tabeli dodaje `users_id_2`, a relacja zwrotna w tabeli `members` z kluczem `member_id` dodaje `member_id_2`.  
Kolumny jednego klucza złożonego są w ten sam sposób numerowane względem siebie, a nazwa pozostawiona bez zmian zajmuje swoje miejsce jako pierwsza: tabela `user` z kluczem (`id`, `user_id`) dodaje `user_id` dla `user_id` i `user_id_2` dla `id`.

Gdy tabela nadrzędna nie ma nazwy, nazwa klucza pozostaje bez zmian i w razie konfliktu jest numerowana jak każda inna.  
Klucz bez nazwy daje kolumnę klucza obcego bez nazwy.  
Dotyczy to również klucza podstawowego, który edytor dodaje do tabeli nadrzędnej bez klucza podstawowego, chyba że nadasz mu nazwę przed kliknięciem tabeli podrzędnej.

Nazwy są ustalane podczas rysowania relacji. Późniejsza zmiana nazwy tabeli nadrzędnej lub jej klucza nie zmienia ich nazw.  
Wiersze `New column` w oknie dialogowym [Mapuj kolumny](#map-columns) są nazywane według tych samych zasad, a lista pokazuje każdą nazwę, zanim ją wybierzesz.  
Relacje, które pojawiają się z gotowymi kolumnami – z importu, wklejenia, duplikowania lub z okna dialogowego „Mapuj kolumny” łączącego w pary istniejące kolumny – zachowują nazwy tych kolumn.  
Agent kodujący, który dodaje relację narzędziem `erd_add_relationship`, otrzymuje te same nazwy, typy danych, nazwy logiczne i domeny – zobacz stronę [Narzędzia](../../mcp/tools.md#relationships).

Nazwa kolumny klucza obcego powstaje od jej klucza, nigdy od kopiowanej nazwy logicznej, i jest traktowana jako wpisana samodzielnie: nazwa logiczna wpisana później w kolumnie pozostawia nazwę bez zmian, chyba że nazwa jest pusta – zobacz sekcję [Własne nazwy](./dictionary.md#names-of-your-own).  
Dlatego dopóki skopiowana nazwa logiczna pasuje do terminu, który nadaje inną nazwę, arkusz `Checks` wyświetla tę kolumnę przy kontroli [`Physical name mismatch`](./dictionary.md#what-each-check-finds). Ponowne wygenerowanie jej nazwy fizycznej zmienia jej nazwę na podstawie słowników, chyba że inna kolumna tabeli podrzędnej ma już nazwę, którą one nadają, bez uwzględniania wielkości liter – zobacz sekcję [Wygeneruj ponownie nazwy fizyczne](./dictionary.md#derive-physical-names-again).

## Odczytywanie łącznika {#reading-a-connector}

- Relacja identyfikująca jest rysowana linią ciągłą, a nieidentyfikująca – linią przerywaną.
- Koniec przy tabeli podrzędnej ma symbol liczności typu relacji: kółko i kreskę dla Zero One, kółko i kurzą łapkę dla Zero N, dwie kreski dla One Only oraz kreskę i kurzą łapkę dla One N.
- Koniec przy tabeli nadrzędnej to kółko i kreska, jak w Zero One, gdy którakolwiek z kolumn klucza obcego dopuszcza wartość `NULL`, oraz dwie kreski, jak w One Only, gdy wszystkie mają flagę `NOT NULL`.
- Najechanie wskaźnikiem na łącznik wyróżnia go razem z kolumnami, które łączy w obu tabelach.

![Najeżdżanie wskaźnikiem kolejno na trzy łączniki, z których każdy podświetla się razem z łączonymi przez siebie kolumnami](/img/demo-relationship-hover.webp)

Relacja z ustawioną akcją [ON DELETE lub ON UPDATE](#on-delete-and-on-update) ma obok końca przy tabeli podrzędnej etykietę, na przykład `D:C U:R`: `D:` i akcja ON DELETE, a potem `U:` i akcja ON UPDATE, każda tylko wtedy, gdy jest ustawiona.  
Akcje są skracane zgodnie z notacją narzędzia erwin: `C` dla CASCADE, `R` dla RESTRICT, `SN` dla SET NULL, `SD` dla SET DEFAULT i `NA` dla NO ACTION. Relacja, która nie ma ustawionej żadnej z tych akcji, nie ma etykiety.  
Etykieta znajduje się po stronie oddalonej od tabeli podrzędnej, nad linią, gdy łącznik wychodzi z lewego lub prawego boku tej tabeli, i na prawo od linii, gdy wychodzi z górnego lub dolnego boku, nie nachodząc na symbol liczności.  
Jest rysowana w kolorze łącznika na małym prostokącie w kolorze tła kanwy i podświetla się razem ze swoim łącznikiem. Etykiety są rysowane nad wszystkimi łącznikami, więc linia, która przecina etykietę, biegnie pod nią.  
Etykieta pokazuje akcję zapisaną w relacji niezależnie od tego, co zapisuje wybrana baza danych, więc ON DELETE SET DEFAULT nadal wyświetla się jako `D:SD` w MySQL.

Najechanie wskaźnikiem na łącznik, który ma ustawioną którąkolwiek z akcji, pokazuje też podpowiedź z pełnym zapisem klauzul, po jednej w wierszu, na przykład `ON DELETE CASCADE` i `ON UPDATE RESTRICT`.  
Podpowiedź pojawia się nawet wtedy, gdy etykieta jest ukryta.

Przejście do relacji podświetla ją: wybór wiersza w folderze `Foreign Keys` tabeli w [Eksploratorze](./explorer.md#going-to-a-row) lub wiersza klucza obcego w [Podglądzie różnic](./table-related-functions.md#going-to-a-change) rysuje jej łącznik i etykietę w kolorze wyróżnienia po najechaniu wskaźnikiem. W Podglądzie różnic podświetlany jest łącznik po każdej stronie, która zawiera relację, więc dodany klucz obcy podświetla tylko stronę bieżącego dokumentu, a usunięty – tylko stronę zapisanego dokumentu.  
Przejście zaznacza tylko tabelę podrzędną wraz z jej kolumnami kluczy obcych, a komórka z fokusem znajduje się w pierwszej z nich; sama relacja nadal nigdy nie jest zaznaczana. Informacje o tym, dokąd przesuwa się widok, znajdziesz w sekcji [Dokąd prowadzi przejście](./table-related-functions.md#where-a-jump-lands).  
Podświetlenie gaśnie przy następnym naciśnięciu lewego lub prawego przycisku myszy na kanwie, czy to w pustym miejscu, na tabeli, notatce, grupie tabel, czy na łączniku, nawet jeśli naciśnięcie nie zmienia zaznaczenia. Gaśnie też po przejściu do innego wiersza lub dopasowania wyszukiwania w Eksploratorze, a także po przejściu do innego wiersza w Podglądzie różnic, po każdej stronie, do której prowadzi ten wiersz.  
Podświetlenie pozostaje przy przesuwaniu widoku środkowym przyciskiem myszy lub narzędziem Rączka, a także przy zwijaniu lub rozwijaniu wiersza w Eksploratorze lub Podglądzie różnic, anulowaniu zaznaczenia klawiszem `Escape` oraz przejściu z funkcji [Szybkie wyszukiwanie](./quick-search.md) lub z [przycisku kafelka](./visualization.md#card-buttons) z łączem zewnętrznym w trybie Przepływ.  
Podświetlenie nie jest zapisywane ani nie trafia do historii cofania, a współpracownicy go nie widzą.

W edytorze z atrybutem [`readonly`](../../api/erd-editor-element.md#readonly) wskaźnik myszy również podświetla łączniki, w miejsce podświetlenia pozostawionego przez przejście. Spoczywając na tabeli, podświetla w kolorze najechania wszystkie łączniki tej tabeli, dopóki nie zjedzie z tabeli.  
Kliknięcie, które nie przesuwa widoku, pozostawia podświetlenie do następnego takiego kliknięcia: na tabeli podświetla jej łączniki, na łączniku ten łącznik, a gdziekolwiek indziej nic. Przeciągnięcie przesuwa tam kanwę i pozostawia to podświetlenie bez zmian.

Ukryj łączniki na kanwie ERD opcją widoku `Relationship` albo tylko ich etykiety opcją widoku `Referential Actions`, która jest domyślnie włączona – zobacz sekcję [Opcje widoku tabel](./table-related-functions.md#table-view-options).  
Etykiety nie są rysowane przy powiększeniu `70%` i mniejszym, przy którym tabele zwijają się do samej nazwy.  
[Eksport obrazu](./file-import-export.md#image) jest zawsze rysowany w skali 100%, więc zawiera etykiety niezależnie od powiększenia kanwy, chyba że ukrywa je opcja widoku. Gdy opcja `Background` jest wyłączona, prostokąt za każdą etykietą również jest przezroczysty.  
[Tryb Przepływ](./visualization.md#flow-mode) na karcie Wizualizacja rysuje łączniki nawet przy wyłączonej opcji `Relationship`, każdy jako jedną gładką, ciągłą, szarą krzywą z tymi samymi oznaczeniami końców, więc linia przerywana, etykiety, podpowiedź, podświetlenie po przejściu i prowadzenie ortogonalne opisane na tej stronie dotyczą tylko kanwy ERD. Relacja tabeli z samą sobą również w trybie Przepływ zakręca wokół prawego górnego rogu – zobacz sekcję [Prowadzenie łączników](#connector-routing).

## Prowadzenie łączników {#connector-routing}

Łączniki są prowadzone ortogonalnie, a ich narożniki są zaokrąglone.  
Trasa okrąża tabele stojące jej na drodze, zamiast przez nie przechodzić. Gdy każda trasa o kilku zakrętach między jej dwoma końcami przecięłaby tabelę, jak w zatłoczonym diagramie, łącznik obiera drogę okrężną z tyloma zakrętami, ile potrzebuje. Tylko gdy nie znajdzie drogi okrężnej, nadal przecina tabelę.  
Łącznik wychodzi z dwóch swoich tabel z pary boków zwróconych ku sobie, wszędzie tam, gdzie taka para istnieje, a każdy koniec wychodzi ze swojej tabeli krótkim prostym odcinkiem, zanim skręci, więc dwie niedaleko od siebie położone tabele, których końce łącznika są w jednej linii, łączy jedna prosta linia zamiast okrężnej trasy.  
Dwie zwrócone ku sobie tabele stojące bliżej niż ten odcinek, nawet mniej niż `40px` od siebie, zachowują zwrócone ku sobie boki, a tam, gdzie ich końce nie są w jednej linii, łącznik przeskakuje przez przerwę między nimi, zamiast biec pod którąś z tabel.  
Trasy wychodzące z tego samego boku tabeli są rozkładane na osobne korytarze, aby nie nakładały się na siebie.  
Omijane są tylko tabele: łącznik może przecinać notatkę lub ramkę grupy tabel i jest rysowany nad grupami tabel, a pod tabelami i notatkami.

Relacja tabeli z samą sobą jest rysowana jako jedna krzywa wokół prawego górnego rogu tabeli, wychodząca z górnego boku po stronie nadrzędnej i wchodząca w prawy bok po stronie podrzędnej.  
Kolejne relacje zwrotne w tej samej tabeli układają się na zewnątrz pierwszej, więc ich krzywe nie przecinają się wzajemnie ani nie przecinają tabeli.

Nie ma tu nic do skonfigurowania.  
Trasy są automatycznie przeliczane za każdym razem, gdy coś na kanwie się przesunie lub zmieni rozmiar, więc nigdy nie trzeba ich poprawiać ręcznie.  
Podczas przeciągania łączniki przesuwanych tabel podążają za nimi, a każdy inny łącznik zachowuje trasę, którą miał na początku przeciągania. Gdy puścisz, każdy łącznik, którego trasę zmienia przesunięcie, jest rysowany na nowo, na przykład taki, który teraz okrąża upuszczoną na jego drodze tabelę, albo taki, który prostuje się, gdy tabela zeszła mu z drogi.

Diagram rysuje te same trasy w każdym oknie, które pokazuje go w tym samym Widoku nazw: w oknie, które pozostało otwarte, gdy tabele się przesuwały, w oknie, które dopiero co otworzyło diagram, i w oknie współpracownika, a [wyeksportowany obraz](./file-import-export.md#image) rysuje je również. Widok nazw ma znaczenie, ponieważ zmienia szerokość tabel – zobacz sekcję [Widok nazw](./logical-names.md#name-view).

![Przeciąganie tabeli members w dół i z powrotem, podczas gdy łącznik od orders przełącza się między trasą na prawo od categories a trasą wokół jej lewej strony, ze wszystkimi narożnikami zaokrąglonymi](/img/demo-connector-routing.webp)
