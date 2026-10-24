---
sidebar_position: 3
description: Dodawanie, zaznaczanie, zmiana kolejności i usuwanie kolumn, przełączanie opcji kolumn oraz kopiowanie lub wklejanie kolumn.
---

# Edycja tabel

Edycja tabel działa zasadniczo podobnie jak edycja w programie Excel.  
[Widok nazw](./logical-names.md#name-view) decyduje o tym, czy tabela wyświetla w nagłówku i wierszach nazwy fizyczne, nazwy logiczne czy obie.  
Tryb edycji włącza się klawiszem `Enter` lub dwukrotnym kliknięciem komórki.  
Kończy go klawisz `Enter` lub `Escape`. Wpisywany tekst jest stosowany na bieżąco, więc klawisz `Escape` zachowuje tekst, zamiast przywracać poprzednią wartość. Wyjątkiem jest [komórka domeny](./logical-names.md#the-domain-cell): służy ona tylko do wyboru z listy i nigdy nie zachowuje wpisanego tekstu. Zamknięcie [komórki nazwy logicznej](./logical-names.md#writing-a-logical-name) po zmianie nazwy logicznej może też wypełnić nazwę fizyczną.  
Klawisz `Escape` zachowuje fokus na komórce i zaznaczenie tabeli, a drugie naciśnięcie klawisza `Escape` zdejmuje fokus i anuluje zaznaczenie. Gdy komórka nazwy logicznej pokazuje swoją [listę terminów](./logical-names.md#completing-term-names), pierwsze naciśnięcie klawisza `Escape` zamyka tylko listę.  
Dopóki edytor metody wprowadzania (IME) jeszcze składa znaki, klawisz `Escape` nie kończy trybu edycji.

![Dodawanie tabeli za pomocą Alt + N i wypełnianie dwóch kolumn](/img/demo-table-edit.webp)

## Dodawanie kolumn {#adding-columns}

Kolumnę tworzy się skrótem `Alt + Enter` (Windows/Linux) lub `⌥ + Enter` (Mac).  
Kolumna jest dodawana do każdej zaznaczonej tabeli.

## Klawisz Tab {#tab-key}

Naciśnij klawisz `Tab`, aby przejść od razu do trybu edycji następnej komórki.  
Naciśnięcie klawisza `Tab` w ostatniej komórce tworzy nową kolumnę.  
Użyj skrótu `Shift + Tab`, aby przejść do trybu edycji poprzedniej komórki.  
Klawisz `Tab` i skrót `Shift + Tab` przechodzą po kolei przez komórki wyświetlane w tabeli, więc to Widok nazw i opcja View Option → `Domain` decydują o tym, czy są wśród nich komórki nazwy logicznej i domeny – zobacz sekcję [Wpisywanie nazwy logicznej](./logical-names.md#writing-a-logical-name).  
Oznaczenia [kluczy alternatywnych](./table-related-functions.md#alternate-keys) rysowane za ostatnią komórką wiersza nie są komórkami, więc fokus klawiatury je pomija i nigdy nie otwierają się one do edycji.

![Przechodzenie klawiszem Tab przez komórki wiersza, dodawanie kolumny z ostatniej komórki i powrót za pomocą Shift + Tab](/img/demo-table-tab.webp)

## Autouzupełnianie typu danych {#datatype-autocomplete}

Zacznij edytować komórkę `DataType` i wpisuj tekst. Pojawiają się sugestie pasujących typów z wybranej bazy danych, a w każdej sugestii wyróżniona jest ta część, która dosłownie zawiera wpisany tekst.  
Samo dopasowanie jest rozmyte, więc tekst `vch` pasuje także do typu `VARCHAR`.

- `Arrow Up` lub `Arrow Down`: przechodzi między sugestiami
- `Arrow Right`, `Tab` lub `Enter`: akceptuje wyróżnioną sugestię
- `Arrow Left`: wraca do wpisanego tekstu

Możesz też kliknąć sugestię.  
Lista pokazuje naraz do dziesięciu sugestii, a pozostałe są dostępne po przewinięciu.  
Nic nie jest narzucane, więc typ spoza listy można swobodnie wpisać, także z argumentami, na przykład `VARCHAR(255)`. Lista zamyka się, gdy wpisany tekst wykracza poza pełną nazwę typu, tak jak `VARCHAR(255)` lub `BIGINT UNSIGNED`.  
Sugestie zależą od wybranej bazy danych. Zmiana bazy danych zmienia proponowane typy i pozostawia istniejące kolumny bez zmian.

Wpisywanie w komórce `DataType` kolumny powiązanej z domeną lub zaakceptowanie w niej sugestii odłącza kolumnę od domeny, gdy tylko jej typ różni się od typu domeny – zobacz sekcję [Domeny i typy danych](./dictionary.md#domains-and-data-types).  
W widoku `Logical Names`, gdy opcja View Option → `Domain` jest wyłączona, komórka typu kolumny powiązanej z domeną z nazwą pokazuje nazwę domeny, a jej edycja otwiera [selektor domen](./logical-names.md#the-domain-cell) zamiast tych sugestii. Komórka typu, która pokazuje typ danych, edytuje go tak, jak opisano powyżej.

![Wypełnianie komórek DataType sugestiami z dopasowania rozmytego za pomocą klawiszy strzałek, Tab i Enter](/img/demo-data-type-autocomplete.webp)

## NOT NULL, Unikatowość, Autoinkrementacja {#not-null-unique-auto-increment}

Te trzy komórki są przełącznikami, a nie tekstem.  
Aby przełączyć jedną z nich, kliknij ją dwukrotnie lub naciśnij klawisz `Enter`, gdy ma fokus.

Komórka NOT NULL pokazuje `N-N`, gdy flaga jest ustawiona, i `NULL`, gdy nie jest.  
Oznaczenia `UQ` i `AI` są przyciemnione, gdy są wyłączone, i wyróżnione, gdy są włączone.

![Przełączanie NOT NULL dwukrotnym kliknięciem, a Unikatowości i Autoinkrementacji klawiszem Enter](/img/demo-column-options.webp)

Komórek ukrytych za pomocą [opcji widoku tabel](./table-related-functions.md) nie można przełączać.

## Zaznaczanie wielu kolumn {#selecting-multiple-columns}

Dostępnych jest pięć sposobów:

- `Shift + Arrow Up/Down`: rozszerza zaznaczenie po jednym wierszu
- `Ctrl + click` (Windows/Linux) lub `⌘ + click` (Mac): dodaje pojedynczą kolumnę
- `Shift + click`: zaznacza zakres od ostatniej kolumny z fokusem
- `Ctrl + Shift + click` (Windows/Linux) lub `⌘ + Shift + click` (Mac): dodaje ten zakres do zaznaczenia
- `Alt + A` (Windows/Linux) lub `⌥ + A` (Mac): zaznacza wszystko

![Zaznaczanie kolumn za pomocą Shift + Arrow Down, Ctrl/⌘ + click, Shift + click i Alt + A](/img/demo-column-select.webp)

Aby przenieść zaznaczone kolumny razem, przeciągnij uchwyt obok kolumny z fokusem – zobacz sekcję [Zmiana kolejności i przenoszenie kolumn](#rearranging-and-moving-columns).

Kliknięcie prawym przyciskiem myszy wiersza kolumny decyduje o tym, na których kolumnach działa menu kontekstowe tabeli, niezależnie od przytrzymanego klawisza modyfikującego.  
Na wierszu, który jest już zaznaczony, zaznaczenie pozostaje bez zmian, a fokus przechodzi na ten wiersz. Na każdym innym wierszu zaznaczany jest tylko ten wiersz. Dotyczy to dowolnego miejsca wiersza, w tym ikony klucza i oznaczenia [klucza alternatywnego](./table-related-functions.md#alternate-keys).  
Aby więc za pomocą menu działać na kilku kolumnach, jak w sekcjach [Klucz podstawowy kolumny](#column-primary-key) lub [Usuwanie kolumn](#column-deletion), kliknij prawym przyciskiem myszy jeden z zaznaczonych wierszy.  
Na komputerze Mac menu otwiera także skrót `Ctrl + click`, ale liczy się on jako zwykłe kliknięcie, więc na komórce zaznacza tylko jej wiersz, zanim otworzy się menu.

## Zmiana kolejności i przenoszenie kolumn {#rearranging-and-moving-columns}

Kolumnę przenosi się za pomocą jej uchwytu przeciągania, czyli małego przycisku z ikoną uchwytu, który znajduje się tuż za lewą krawędzią tabeli, obok wiersza z fokusem.  
Ustaw fokus na dowolnej komórce kolumny, klikając ją albo za pomocą klawiszy strzałek lub klawisza `Tab`, a obok jej wiersza pojawi się uchwyt. Gdy fokus jest na nagłówku tabeli, żaden wiersz nie ma uchwytu.  
Uchwyt jest ledwie widoczny, dopóki nie znajdzie się na nim wskaźnik, który wtedy zmienia się w dłoń. Samo naciśnięcie nic nie robi: przeciąganie zaczyna się, gdy wskaźnik się poruszy, i może przenieść kolumnę w inne miejsce jej tabeli albo do innej tabeli.  
Nad wierszami tabeli przeciągane wiersze przesuwają się na swoje miejsce, a wiersze wokół miejsca upuszczenia rozsuwają się, aby zrobić miejsce. Nad pustą kanwą lub nad nagłówkiem tabeli, która ma kolumny, za wskaźnikiem podąża półprzezroczysta kopia wierszy, pokazująca komórki nazwy i typu każdego wiersza tak, jak wyświetla je ten wiersz przy bieżącym ustawieniu [Widok nazw](./logical-names.md#name-view).  
Upuść kolumnę tuż pod ostatnim wierszem tabeli, aby przenieść ją na koniec tej tabeli. Do tabeli bez kolumn można upuścić kolumnę w dowolnym jej miejscu. Pas tuż na lewo od tabeli, w którym znajduje się uchwyt, również liczy się jako wiersze tabeli, więc przeciąganie prosto w dół wzdłuż uchwytu zmienia kolejność kolumn bez wprowadzania wskaźnika do tabeli.  
Kolumna przeniesiona do innej tabeli zachowuje swoją nazwę logiczną i domenę.

![Ustawianie fokusu na kolumnie i przeciąganie uchwytu obok jej wiersza na nowe miejsce, a potem przeciąganie uchwytu innej kolumny do innej tabeli](/img/demo-column-move.webp)

Aby przenieść kilka kolumn naraz, [zaznacz je](#selecting-multiple-columns) i przeciągnij uchwyt obok kolumny z fokusem. Gdy kolumna z fokusem jest jedną z co najmniej dwóch zaznaczonych kolumn swojej tabeli, uchwyt przenosi je wszystkie, a w przeciwnym razie przenosi tylko swoją kolumnę.  
Klawisz modyfikujący nie jest potrzebny. Przytrzymanie klawisza `Alt` (Windows/Linux) lub `⌥` (Mac) na uchwycie przenosi kolumny tak jak zwykłe przeciąganie i niczego nie duplikuje.

![Zaznaczanie trzech kolumn, a potem przeciąganie uchwytu obok kolumny z fokusem do innej tabeli, przy czym pozostałe zaznaczone kolumny przesuwają się razem z nią](/img/demo-column-multi-move.webp)

Przeciąganie rozpoczęte na wierszu kolumny, a nie na jej uchwycie, przenosi tabelę, tak jak przeciąganie jej nagłówka – zobacz sekcję [Przenoszenie wielu tabel](./table-related-functions.md#moving-multiple-tables). Skrót `Alt + drag` (Windows/Linux) lub `⌥ + drag` (Mac) na wierszu duplikuje tabelę – zobacz sekcję [Duplikowanie tabel i notatek](./table-related-functions.md#duplicating-tables-and-memos).  
Uchwyt nie jest wyświetlany przy powiększeniu `70%` i mniejszym, przy którym tabele pokazują tylko swoje nazwy, ani w edytorze tylko do odczytu, więc nie można tam zmieniać kolejności kolumn.

## Usuwanie kolumn {#column-deletion}

Usuwa zaznaczone kolumny tabeli z fokusem. Kliknięcie komórki zaznacza jej kolumnę, więc kliknięcie komórki i naciśnięcie klawisza `Delete` usuwa tę jedną kolumnę.  
Skróty klawiaturowe:

- `Delete` lub `Backspace`. Usuwają one zaznaczone kolumny, dopóki ich tabela jest jedynym zaznaczonym elementem. Gdy nie jest zaznaczona żadna kolumna (fokus jest na nazwie, [nazwie logicznej](./logical-names.md#name-view) lub komentarzu tabeli), gdy zaznaczone jest też coś innego albo przy powiększeniu `70%` i mniejszym, przy którym tabele pokazują tylko swoje nazwy, usuwają zamiast tego całe zaznaczenie – zobacz sekcję [Usuwanie tabel i notatek](./table-related-functions.md#table-and-memo-deletion).
- `Alt + Backspace` lub `Alt + Delete` (Windows/Linux), `⌥ + Backspace` lub `⌥ + Delete` (Mac). Te skróty usuwają zaznaczone kolumny tabeli z fokusem, nawet gdy zaznaczone są też inne tabele lub notatki. Nie usuwają niczego podczas edycji komórki ani przy powiększeniu `70%` i mniejszym.

![Usuwanie jednej kolumny, a potem dwóch zaznaczonych kolumn za pomocą Alt + Backspace](/img/demo-column-remove.webp)

To samo robi menu kontekstowe tabeli. Gdy tabela jest jedynym zaznaczonym elementem, kliknij prawym przyciskiem myszy wiersz kolumny: ostatnia pozycja menu brzmi `Delete column` lub – gdy ten wiersz jest jedną z co najmniej dwóch zaznaczonych kolumn – `Delete columns`.

Podczas edycji komórki klawisze `Delete` i `Backspace` kasują tylko tekst. Przytrzymane poza edytorem komórki usuwają tylko raz.  
Po usunięciu fokus przechodzi na najbliższą pozostałą kolumnę powyżej kolumny, która miała fokus. Gdy powyżej nie pozostała żadna kolumna, fokus przechodzi na nazwę tabeli (w widoku `Logical Names` – na nazwę logiczną wyświetlaną w jej miejscu), nawet jeśli poniżej pozostały kolumny, więc następne naciśnięcie klawisza `Delete` lub `Backspace` usuwa tabelę, a nie kolumnę.  
Relacje i indeksy korzystające z usuniętej kolumny są usuwane razem z nią. Nie ma potwierdzenia, a całe usunięcie stanowi jeden krok cofania.

## Kopiowanie/wklejanie kolumn {#copyingpasting-columns}

Działa jak schowek dla danych tabelarycznych.  
Skróty klawiaturowe: `Ctrl + C` (Windows/Linux) lub `⌘ + C` (Mac), `Ctrl + V` (Windows/Linux) lub `⌘ + V` (Mac)

Kopiowanie do arkusza kalkulacyjnego, wklejanie z niego i wklejanie do tabeli, której komórka kolumny ma fokus, korzystają z komórek widocznych w tabelach, w kolejności, w jakiej są wyświetlane – zobacz sekcje [Opcje widoku tabel](./table-related-functions.md#table-view-options), [Dostosowywanie kolejności kolumn](./settings.md#adjusting-column-order) i [Widok nazw](./logical-names.md#name-view). Widok nazw zmienia zawartość niektórych z tych komórek:

- W widoku `Logical Names` komórka nazwy zawiera nazwę logiczną albo nic, gdy nazwa logiczna jest pusta. Gdy opcja View Option → `Domain` jest wyłączona, komórka typu zawiera nazwę domeny kolumny tam, gdzie ją pokazuje, a w przeciwnym razie typ danych.
- W widoku `Both Names` komórka `Logical Name` jest kopiowana i wklejana w miejscu, które wyznacza dla niej kolejność kolumn.
- Widoczna komórka domeny zawiera nazwę domeny albo nic w przypadku kolumny, która nie pokazuje żadnej domeny.

Kolumny skopiowane w edytorze i wklejone przy zaznaczonym nagłówku tabeli albo do pozostałych zaznaczonych tabel zachowują wszystkie komórki skopiowanych kolumn, także ukryte, takie jak Unikatowość i Autoinkrementacja, oraz swoje nazwy logiczne.  
Zachowują powiązanie z domeną tylko wtedy, gdy ta sama domena, a nie jedynie domena o tej samej nazwie, występuje w tym diagramie i nadal ma typ skopiowanej kolumny. W przeciwnym razie trafiają do tabeli niepowiązane z domeną, z typem, z jakim je skopiowano. Ich nazwy są traktowane jako wpisane samodzielnie, chyba że wklejona nazwa jest pusta i na podstawie nazwy logicznej generowana jest nazwa fizyczna – zobacz sekcję [Generowanie nazw fizycznych](./dictionary.md#deriving-physical-names).  
Oznaczenia [kluczy alternatywnych](./table-related-functions.md#alternate-keys), takie jak `AK1.1`, nie są komórkami, więc kopiowanie i wklejanie pomijają je nawet wtedy, gdy są widoczne.

Możesz wklejać z edytora do programu Excel i z programu Excel z powrotem do edytora.  
Wartości komórek są przekazywane dokładnie tak, jak je wpisano, więc wartość taka jak `<label>` lub `a &amp; b` trafia do arkusza kalkulacyjnego lub dokumentu bez zmian.  
Kolumny arkusza kalkulacyjnego są dopasowywane do widocznych komórek według pozycji, a nie nazwy, więc kolumny arkusza muszą występować w tej samej kolejności co te komórki.  
W poniższych kolumnach każda z tych wartości jest odczytywana jako prawda (bez uwzględniania wielkości liter):

- Autoinkrementacja: `TRUE`, `1`, `YES`, `Y`
- Unikatowość: `TRUE`, `1`, `YES`, `Y`
- NOT NULL: `TRUE`, `1`, `YES`, `Y`, `NOT NULL`

Przy kopiowaniu na zewnątrz edytor zapisuje `TRUE` lub `FALSE` dla flag Autoinkrementacja i Unikatowość oraz `NOT NULL` lub `NULL` dla flagi NOT NULL.  
Komórki Unikatowość i Autoinkrementacja są domyślnie ukryte, więc wartości `TRUE` i `FALSE` są zapisywane i odczytywane dopiero wtedy, gdy te komórki są widoczne.

![Wklejanie czterech kolumn do arkusza kalkulacyjnego z flagami zapisanymi jako TRUE/FALSE i NOT NULL/NULL](/img/demo-copy-column-to-sheet.webp)

![Wklejanie trzech wierszy arkusza kalkulacyjnego do tabeli jako kolumn, z wartościami YES, 1 i NOT NULL odczytanymi jako prawda](/img/demo-copy-sheet-column.webp)

To, gdzie trafia wklejenie, zależy od fokusu:

- Gdy zaznaczony jest nagłówek tabeli, wklejone wiersze są dodawane jako nowe kolumny do każdej zaznaczonej tabeli.
- Gdy fokus ma komórka kolumny, zaznaczone wiersze tej tabeli, a następnie wiersze poniżej ostatniego z nich, są nadpisywane po kolei – tyle, ile wklejono wierszy. Wiersze między oddzielnymi zaznaczeniami są pomijane. Nadpisany wiersz przyjmuje wklejone wartości w widocznych komórkach i zachowuje ukryte, a pozostałe wklejone wiersze są dodawane jako nowe kolumny. Do każdej innej zaznaczonej tabeli wklejone wiersze są dodawane jako nowe kolumny.

![Kopiowanie dwóch kolumn i wklejanie ich naraz do dwóch zaznaczonych tabel](/img/demo-copy-column-multi.webp)

Wklejony wiersz zapisuje nazwy logiczne i domeny w następujący sposób:

- Nazwa logiczna z komórki `Logical Name` lub z komórki nazwy w widoku `Logical Names` jest traktowana tak, jakby wpisano ją w całości. Dopóki nazwa kolumny jest pusta lub nadal wygenerowana, [słowniki](./dictionary.md#deriving-physical-names) generują na jej podstawie nazwę fizyczną i wiążą kolumnę z domeną, którą nadaje jej termin, chyba że z domeną wiąże ją komórka domeny z tego samego wiersza. Nazwa wklejona w tym samym wierszu zostaje zachowana i jest traktowana jako wpisana samodzielnie.
- Komórka domeny albo komórka typu w widoku `Logical Names`, gdy opcja View Option → `Domain` jest wyłączona, wiąże kolumnę z domeną, której nazwę zawiera jej tekst, jeśli taka domena występuje w diagramie. Każdy inny tekst lub pusta komórka nie wiąże żadnej domeny i odłącza kolumnę od domeny, nawet od domeny o wklejonym typie. Tekst w komórce typu, który nie jest nazwą żadnej domeny, jest odczytywany jako typ danych. Wiersze skopiowane w edytorze wiążą zamiast tego domenę, z którą je skopiowano, i tylko wtedy, gdy ten diagram zawiera ją ze skopiowanym typem, tak jak w przypadku nowych kolumn.
- Powiązana domena nadaje kolumnie swój typ danych, chyba że wiersz wkleja własny typ. Wtedy domena o innym typie nie zostaje powiązana, a kolumna przyjmuje wklejony typ.
- W wierszu bez komórki domeny wklejony typ odłącza kolumnę od domeny o innym typie, tak jak jego wpisanie.
- Żadne wklejenie nie przenosi typu za pośrednictwem ustawienia [Synchronizacja typu danych w relacjach](./settings.md#relationship-datatype-sync).

## Kopiowanie/wklejanie tabel i notatek {#copyingpasting-tables-and-memos}

Gdy wewnątrz tabeli z fokusem nie jest zaznaczona żadna kolumna, te same skróty kopiują zaznaczone tabele i notatki w całości – zobacz stronę [Operacje na tabelach](./table-related-functions.md).

## Klucz podstawowy kolumny {#column-primary-key}

Włącza i wyłącza klucz podstawowy kolumny z fokusem, czyli kolumny, do której należy komórka z fokusem.  
Gdy kolumna z fokusem jest jedną z co najmniej dwóch zaznaczonych kolumn, przełączenie dotyczy wszystkich zaznaczonych kolumn: jeśli którakolwiek z nich nie jest kluczem, wszystkie stają się kluczami, a jeśli wszystkie już nimi są, wszystkie przestają nimi być. Kolumny spoza zaznaczenia pozostają bez zmian.  
Użyj menu kontekstowego tabeli albo skrótu `Alt + K` (Windows/Linux) lub `⌥ + K` (Mac). Gdy przełączenie obejmuje co najmniej dwie kolumny, pozycja menu brzmi `Primary Key on selected columns` zamiast `Primary Key`.  
Ikona klucza w wierszu służy tylko do wyświetlania, więc kliknięcie jej nie ustawia klucza.

Aby utworzyć z kilku kolumn jeden klucz złożony, [zaznacz je](#selecting-multiple-columns), a potem naciśnij `Alt + K` (Windows/Linux) lub `⌥ + K` (Mac) albo kliknij prawym przyciskiem myszy jeden z zaznaczonych wierszy i wybierz `Primary Key on selected columns`. Każde przełączenie stanowi jeden krok cofania.

![Zaznaczanie dwóch kolumn za pomocą Shift + Arrow Down, a potem ustawianie klucza podstawowego na obu za pomocą ⌥ + K i usuwanie go z obu drugim naciśnięciem](/img/demo-column-pk.webp)
