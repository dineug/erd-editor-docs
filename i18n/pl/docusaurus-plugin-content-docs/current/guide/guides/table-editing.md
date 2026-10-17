---
sidebar_position: 3
description: Dodawanie, zaznaczanie, zmiana kolejności i usuwanie kolumn, przełączanie opcji kolumn oraz kopiowanie lub wklejanie kolumn.
---

# Edycja tabel

Edycja tabel działa zasadniczo podobnie jak edycja w programie Excel.  
Tryb edycji włącza się klawiszem `Enter` lub dwukrotnym kliknięciem komórki.  
Kończy go klawisz `Enter` lub `Escape`. Wpisywany tekst jest stosowany na bieżąco, więc klawisz `Escape` zachowuje tekst, zamiast przywracać poprzednią wartość.  
Klawisz `Escape` zachowuje fokus na komórce i zaznaczenie tabeli, a drugie naciśnięcie klawisza `Escape` zdejmuje fokus i anuluje zaznaczenie.  
Dopóki edytor metody wprowadzania (IME) jeszcze składa znaki, klawisz `Escape` nie kończy trybu edycji.

![Dodawanie tabeli za pomocą Alt + N i wypełnianie dwóch kolumn](/img/demo-table-edit.webp)

## Dodawanie kolumn {#adding-columns}

Kolumnę tworzy się skrótem `Alt + Enter` (Windows/Linux) lub `⌥ + Enter` (Mac).  
Kolumna jest dodawana do każdej zaznaczonej tabeli.

## Klawisz Tab {#tab-key}

Naciśnij klawisz `Tab`, aby przejść od razu do trybu edycji następnej komórki.  
Naciśnięcie klawisza `Tab` w ostatniej komórce tworzy nową kolumnę.  
Użyj skrótu `Shift + Tab`, aby przejść do trybu edycji poprzedniej komórki.  
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

Kliknięcie prawym przyciskiem myszy wiersza kolumny decyduje o tym, na których kolumnach działa menu kontekstowe tabeli, niezależnie od przytrzymanego klawisza modyfikującego.  
Na wierszu, który jest już zaznaczony, zaznaczenie pozostaje bez zmian, a fokus przechodzi na ten wiersz. Na każdym innym wierszu zaznaczany jest tylko ten wiersz. Dotyczy to dowolnego miejsca wiersza, w tym ikony klucza i oznaczenia [klucza alternatywnego](./table-related-functions.md#alternate-keys).  
Aby więc za pomocą menu działać na kilku kolumnach, jak w sekcjach [Klucz podstawowy kolumny](#column-primary-key) lub [Usuwanie kolumn](#column-deletion), kliknij prawym przyciskiem myszy jeden z zaznaczonych wierszy.  
Na komputerze Mac menu otwiera także skrót `Ctrl + click`, ale liczy się on jako zwykłe kliknięcie, więc na komórce zaznacza tylko jej wiersz, zanim otworzy się menu.

## Zmiana kolejności i przenoszenie kolumn {#rearranging-and-moving-columns}

Działa przy użyciu gestu `dragging` i umożliwia przenoszenie kolumn do innych tabel.  
Przeciągane wiersze podążają za wskaźnikiem, a wiersze wokół miejsca upuszczenia rozsuwają się, aby zrobić miejsce.  
Upuść kolumnę tuż pod ostatnim wierszem tabeli, aby przenieść ją na koniec tej tabeli. Do tabeli bez kolumn można upuścić kolumnę w dowolnym jej miejscu.

![Przeciąganie kolumny na nowe miejsce, a potem do innej tabeli](/img/demo-column-move.webp)

Kilka kolumn naraz można przenieść skrótem `Ctrl + drag` (Windows/Linux) lub `⌘ + drag` (Mac).

![Zaznaczanie trzech kolumn i przenoszenie ich do innej tabeli za pomocą Ctrl/⌘ + drag](/img/demo-column-multi-move.webp)

## Usuwanie kolumn {#column-deletion}

Usuwa zaznaczone kolumny tabeli z fokusem. Kliknięcie komórki zaznacza jej kolumnę, więc kliknięcie komórki i naciśnięcie klawisza `Delete` usuwa tę jedną kolumnę.  
Skróty klawiaturowe:

- `Delete` lub `Backspace` (`⌫` na komputerze Mac). Usuwają one zaznaczone kolumny, dopóki ich tabela jest jedynym zaznaczonym elementem. Gdy nie jest zaznaczona żadna kolumna (fokus jest na nazwie lub komentarzu tabeli), gdy zaznaczone jest też coś innego albo przy powiększeniu `70%` i mniejszym, przy którym tabele pokazują tylko swoje nazwy, usuwają zamiast tego całe zaznaczenie – zobacz sekcję [Usuwanie tabel i notatek](./table-related-functions.md#table-and-memo-deletion).
- `Alt + Backspace` lub `Alt + Delete` (Windows/Linux), `⌥ + ⌫` lub `⌥ + Delete` (Mac). Te skróty usuwają zaznaczone kolumny tabeli z fokusem, nawet gdy zaznaczone są też inne tabele lub notatki. Nie usuwają niczego podczas edycji komórki ani przy powiększeniu `70%` i mniejszym.

![Usuwanie jednej kolumny, a potem dwóch zaznaczonych kolumn za pomocą Alt + Backspace](/img/demo-column-remove.webp)

To samo robi menu kontekstowe tabeli. Gdy tabela jest jedynym zaznaczonym elementem, kliknij prawym przyciskiem myszy wiersz kolumny: ostatnia pozycja menu brzmi `Delete column` lub – gdy ten wiersz jest jedną z co najmniej dwóch zaznaczonych kolumn – `Delete columns`.

Podczas edycji komórki klawisze `Delete` i `Backspace` kasują tylko tekst. Przytrzymane poza edytorem komórki usuwają tylko raz.  
Po usunięciu fokus przechodzi na najbliższą pozostałą kolumnę powyżej kolumny, która miała fokus. Gdy powyżej nie pozostała żadna kolumna, fokus przechodzi na nazwę tabeli, nawet jeśli poniżej pozostały kolumny, więc następne naciśnięcie klawisza `Delete` lub `Backspace` usuwa tabelę, a nie kolumnę.  
Relacje i indeksy korzystające z usuniętej kolumny są usuwane razem z nią. Nie ma potwierdzenia, a całe usunięcie stanowi jeden krok cofania.

## Kopiowanie/wklejanie kolumn {#copyingpasting-columns}

Działa jak schowek dla danych tabelarycznych.  
Skróty klawiaturowe: `Ctrl + C` (Windows/Linux) lub `⌘ + C` (Mac), `Ctrl + V` (Windows/Linux) lub `⌘ + V` (Mac)

Kopiowanie do arkusza kalkulacyjnego, wklejanie z niego i wklejanie do tabeli, której komórka kolumny ma fokus, korzystają z komórek widocznych w tabelach, w kolejności, w jakiej są wyświetlane – zobacz sekcje [Opcje widoku tabel](./table-related-functions.md#table-view-options) i [Dostosowywanie kolejności kolumn](./settings.md#adjusting-column-order).  
Kolumny skopiowane w edytorze i wklejone przy zaznaczonym nagłówku tabeli albo do pozostałych zaznaczonych tabel zachowują wszystkie komórki skopiowanych kolumn, także ukryte, takie jak Unikatowość i Autoinkrementacja.  
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

## Kopiowanie/wklejanie tabel i notatek {#copyingpasting-tables-and-memos}

Gdy wewnątrz tabeli z fokusem nie jest zaznaczona żadna kolumna, te same skróty kopiują zaznaczone tabele i notatki w całości – zobacz stronę [Operacje na tabelach](./table-related-functions.md).

## Klucz podstawowy kolumny {#column-primary-key}

Włącza i wyłącza klucz podstawowy kolumny z fokusem, czyli kolumny, do której należy komórka z fokusem.  
Gdy kolumna z fokusem jest jedną z co najmniej dwóch zaznaczonych kolumn, przełączenie dotyczy wszystkich zaznaczonych kolumn: jeśli którakolwiek z nich nie jest kluczem, wszystkie stają się kluczami, a jeśli wszystkie już nimi są, wszystkie przestają nimi być. Kolumny spoza zaznaczenia pozostają bez zmian.  
Użyj menu kontekstowego tabeli albo skrótu `Alt + K` (Windows/Linux) lub `⌥ + K` (Mac). Gdy przełączenie obejmuje co najmniej dwie kolumny, pozycja menu brzmi `Primary Key on selected columns` zamiast `Primary Key`.  
Ikona klucza w wierszu służy tylko do wyświetlania, więc kliknięcie jej nie ustawia klucza.

Aby utworzyć z kilku kolumn jeden klucz złożony, [zaznacz je](#selecting-multiple-columns), a potem naciśnij `Alt + K` (Windows/Linux) lub `⌥ + K` (Mac) albo kliknij prawym przyciskiem myszy jeden z zaznaczonych wierszy i wybierz `Primary Key on selected columns`. Każde przełączenie stanowi jeden krok cofania.

![Zaznaczanie dwóch kolumn za pomocą Shift + Arrow Down, a potem ustawianie klucza podstawowego na obu za pomocą ⌥ + K i usuwanie go z obu drugim naciśnięciem](/img/demo-column-pk.webp)
