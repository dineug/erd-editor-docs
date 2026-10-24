---
sidebar_position: 15
description: Cofanie i ponawianie zmian, zawartość historii, własne historie arkuszy karty Słownik oraz przechodzenie krok po kroku przez historię diagramu za pomocą funkcji Podróż w czasie.
---

# Cofanie i ponawianie

Możesz wrócić do poprzedniego stanu edycji lub przejść do późniejszego.  
Historia przechowuje maksymalnie `2048` zmian.

- Cofnij: `Ctrl + Z` (Windows/Linux) lub `⌘ + Z` (Mac)
- Ponów: `Ctrl + Shift + Z` (Windows/Linux) lub `⌘ + Shift + Z` (Mac)

Na karcie ERD te same dwa polecenia są dostępne na pasku narzędzi jako przyciski `Undo` i `Redo`, obok przycisku `Time Travel`. Na karcie Słownik pasek narzędzi pokazuje przyciski `Undo` i `Redo` bez przycisku `Time Travel`, a żadna inna karta ich nie pokazuje.  
Są podświetlone tylko wtedy, gdy jest co cofnąć lub ponowić. Edytor z atrybutem `readonly` je ukrywa, a skróty klawiaturowe niczego nie cofają ani nie ponawiają.

Polecenia Cofnij i Ponów działają na historii diagramu tylko na karcie ERD.  
Skróty są tam nieaktywne, gdy otwarte jest Szybkie wyszukiwanie, panel `Table Properties`, widok `Diff Viewer`, podgląd `Auto Layout`, okno dialogowe [`Export image`](./file-import-export.md#image), okno dialogowe [Mapuj kolumny](./relationship-editing.md#map-columns) lub Podróż w czasie.  
Działają nadal, gdy fokus klawiatury znajduje się w dowolnym miejscu [Eksploratora](./explorer.md#keys-in-the-explorer), łącznie z jego drzewem, oraz gdy otwarty jest [selektor kolorów](./table-related-functions.md#table-and-memo-color-specification). Nawet gdy kursor tekstowy jest w jednym z ich pól, takim jak pole wyszukiwania, pole zamiany lub pole `Hex`, cofają i ponawiają zmiany diagramu, a nie tekst w tym polu.

Na pozostałych kartach:

- Słownik: cofają i ponawiają zmiany wyświetlanego arkusza (`Domains`, `Words` lub `Terms`) z własnej historii tego arkusza, nigdy z historii diagramu. W arkuszu `Checks` nic nie robią – zobacz sekcję [Arkusze karty Słownik](#dictionary-sheets).
- Wizualizacja: w trybie `Flow` te same klawisze cofają się o krok i przechodzą o krok do przodu po tym, co pokazywał tryb Przepływ, tak jak przyciski `Previous table` i `Next table`, również w edytorze z atrybutem `readonly`. Nigdy nie cofają tam ani nie ponawiają zmian w diagramie – zobacz sekcję [Poprzednia i następna tabela](./visualization.md#previous-table-and-next-table). W trybie `Graph` nic nie robią.
- Schemat SQL, Generator kodu i Ustawienia: nie są dostępne. W polach `Before tables` i `After tables` karty Schemat SQL te same klawisze cofają i ponawiają zamiast tego tekst wpisywany w danym polu.

Historia jest przechowywana w pamięci na czas bieżącej sesji. Nie zapisuje się jej w dokumencie, więc po ponownym otwarciu diagramu historia jest pusta.

![Przenoszenie tabeli i usuwanie kolumny skrótem ⌥ + Backspace, a następnie cofanie obu zmian skrótem ⌘ + Z i ponawianie ich skrótem ⌘ + Shift + Z](/img/demo-undo-redo.webp)

## Co rejestruje historia {#what-the-history-records}

Rejestrowane są:

- Tabele i notatki: dodawanie, usuwanie, przenoszenie i kolor; nazwa, nazwa logiczna i komentarz tabeli; tekst i rozmiar notatki.
- Grupy tabel: dodawanie, usuwanie, przenoszenie, zmiana rozmiaru, nazwa, kolor oraz to, do której grupy należy każda tabela – zobacz stronę [Grupy tabel](./table-groups.md).
- Kolumny: dodawanie, usuwanie, zmiana kolejności, nazwa logiczna, domena, z którą jest powiązana każda z nich, oraz każda opcja kolumny.
- Nazwy fizyczne generowane przez słowniki oraz to, czy każda nazwa jest własna, czy należy do słowników: jedno cofnięcie przywraca nazwę razem z tym stanem – zobacz sekcję [Własne nazwy](./dictionary.md#names-of-your-own).
- Polecenia `Derive Physical Name Again` i `Derive Physical Names Again` – zobacz sekcję [Wygeneruj ponownie nazwy fizyczne](./dictionary.md#derive-physical-names-again).
- Relacje: dodawanie, usuwanie, zmiana typu, kolumny ustawione w oknie dialogowym [Mapuj kolumny](./relationship-editing.md#map-columns) oraz każda wartość wybrana w pozycji `On Delete` lub `On Update` – zobacz sekcję [ON DELETE i ON UPDATE](./relationship-editing.md#on-delete-and-on-update). Cofnięcie usunięcia przywraca relację wraz z jej akcjami ON DELETE i ON UPDATE.
- Indeksy i ich kolumny.
- Położenie widoku, poziom powiększenia i przełączniki `View Option`.
- Skrypty `Before tables` i `After tables` na karcie Schemat SQL, po jednym kroku na każdą zmianę zatwierdzoną opuszczeniem pola – zobacz sekcję [Skrypty przed tabelami i po nich](./schema-sql.md#before-and-after-scripts).
- Importowanie pliku i dodawanie go operacją [`Import and Add`](./file-import-export.md#import-and-add).

Nie są rejestrowane:

- System bazy danych i nazwa bazy danych.
- Język w Generatorze kodu oraz opcje `Table Name Case` i `Column Name Case`.
- Typ cudzysłowu, niezależnie od tego, czy ustawiono go na karcie Schemat SQL, czy na karcie Generator kodu.
- Wartości wybrane w opcjach `Statements`, `Header`, `Write logical names into empty comments` i `Tables` na karcie Schemat SQL, które należą do okna edytora – zobacz sekcję [Panel opcji](./schema-sql.md#options-panel).
- Wszystko na karcie Ustawienia, łącznie z wierszami [`Lock`](./settings.md#lock).
- Przełączanie Widoku nazw z dowolnego miejsca, niezależnie od tego, czy jego blokada jest włączona, czy wyłączona – zobacz sekcję [Przełączanie widoku](./logical-names.md#switching-the-view).
- Motyw i język wyświetlania – zobacz stronę [Język i motyw](./language-and-theme.md).
- To, która tabela, notatka lub grupa jest rysowana nad pozostałymi.
- [Eksplorator](./explorer.md): jego otwieranie, zamykanie lub zmiana rozmiaru, zwijanie drzewa oraz wyszukiwany tekst i opcje wyszukiwania. Rejestrowane jest jednak to, co zmieniają operacje `Replace` i `Replace All`, a także przewinięcie wykonywane przy przejściu – zobacz sekcję [Jeden gest, jeden krok](#one-gesture-one-step).
- Powiększanie i przesuwanie widoku na karcie Wizualizacja w obu trybach, przenoszenie węzłów grafu lub kafelków trybu Przepływ, przycisk `Tidy Up`, wyświetlanie wierszy, skupianie widoku na tabelach oraz przechodzenie przyciskami `Previous table` i `Next table` – zobacz sekcję [Tryb Przepływ nigdy nie zmienia dokumentu](./visualization.md#flow-never-edits-the-document).
- Wyświetlany arkusz karty Słownik oraz wyszukiwanie, zaznaczenie, przewinięcie i szerokości kolumn każdego arkusza – zobacz sekcję [Otwieranie karty](./dictionary.md#opening-the-tab).

Żadnej z tych zmian nie można cofnąć.

Zmiany wprowadzone na karcie Słownik można cofnąć, ale trafiają one do historii własnego arkusza, a nie do tej historii, więc polecenie Cofnij na karcie ERD nigdy żadnej z nich nie wycofuje, nawet nowej wartości `Data Type` domeny i zmienionych przez nią typów kolumn – zobacz sekcję [Arkusze karty Słownik](#dictionary-sheets).

Zmiany docierające z innego edytora również nie są rejestrowane, więc polecenie Cofnij wycofuje tylko zmiany wprowadzone przez ciebie. W [sesji wspólnej edycji](../../api/advanced/collaborative-editing.md) każdy edytor cofa własne zmiany, a agent kodujący, który edytuje przez [serwer MCP](../../mcp/live-and-headless.md#undo), cofa swoje zmiany narzędziem `erd_undo`.

Cofnięcie operacji `Import`, która zastępuje cały diagram, przywraca wcześniejszy diagram w stanie, w jakim edytor przechowywał go w chwili importu, a każda [blokada](./settings.md#lock) jest włączona lub wyłączona i każda zablokowana wartość jest taka jak wtedy.  
Jeśli ten diagram miał włączoną blokadę `Viewport`, widok i powiększenie wracają do zablokowanego widoku, w którym diagram się otwiera, a nie do miejsca, w którym znajdował się widok. Przy wyłączonej blokadzie `Viewport` wracają do miejsca, w którym znajdował się widok w chwili importu. Inne zablokowane ustawienia, takie jak karta, na której jesteś, język w Generatorze kodu lub Widok nazw, pozostają takie, jakie są na ekranie.  
Nowy diagram ma na początku włączone wszystkie blokady. Aby zachować swój widok po takim cofnięciu, wyłącz blokadę `Viewport` przed importem. Ani wyłączenie jej później, ani zaimportowanie pliku JSON z wyłączoną własną blokadą `Viewport` nie zmienia tego, dokąd prowadzi cofnięcie.

Cofnięcie importu pliku JSON przywraca również słowa, terminy i domeny, które miał wcześniejszy diagram. Import w formacie Schemat SQL, GraphQL, DBML lub AML zachowuje słowniki, więc jego cofnięcie i ponowienie pozostawiają je w obecnym stanie, łącznie ze zmianami wprowadzonymi od tego czasu na karcie Słownik.

Cofnięcie lub ponowienie na karcie ERD, które ponownie wiąże kolumnę z domeną albo przywraca kolumnę powiązaną z domeną, nadaje kolumnie aktualny typ danych domeny. Cofnięcie lub ponowienie, które przywraca w powiązanej kolumnie inny typ, odłącza ją od domeny – zobacz sekcję [Domeny i typy danych](./dictionary.md#domains-and-data-types).

## Jeden gest, jeden krok {#one-gesture-one-step}

Wszystko, co przekazuje pojedynczy gest, tworzy jeden wpis w historii.  
Wklejenie kilku tabel i notatek naraz lub ich zduplikowanie kombinacją `Alt + drag` cofa się w jednym kroku.

Naciśnięcie klawisza `Delete` lub `Backspace` albo wybranie pozycji `Delete selected` lub `Delete columns` w menu kontekstowym stanowi jeden krok, bez względu na to, ile tabel, notatek, grup tabel lub kolumn usuwa.  
Przełączenie klucza podstawowego w kilku zaznaczonych kolumnach stanowi jeden krok, niezależnie od tego, czy użyto skrótu `Alt + K` (Windows/Linux) lub `⌥ + K` (Mac), czy pozycji `Primary Key on selected columns` w menu kontekstowym tabeli.  
Ustawienie koloru zaznaczonych elementów lub jego usunięcie opcją `No color` lub pozycją `Remove color` stanowi jeden krok, bez względu na to, ile tabel, notatek i grup jest zaznaczonych. Wybranie koloru, który mają już wszystkie zaznaczone elementy, nie rejestruje żadnego kroku, podobnie jak opcja `No color`, gdy żaden zaznaczony element nie ma koloru.  
Użycie przycisku `Map` lub `Save` w oknie dialogowym [Mapuj kolumny](./relationship-editing.md#map-columns) stanowi jeden krok wraz z kolumnami kluczy obcych, które dodaje, i typami danych, które zmienia.  
Operacja `Import and Add` stanowi jeden krok wraz z przewinięciem, które pokazuje dodany blok, gdy jest ono potrzebne.

Wybranie terminu z listy pod komórką nazwy logicznej stanowi jeden krok: nazwa logiczna, generowana na jej podstawie nazwa fizyczna, a w przypadku kolumny także domena terminu wraz z jej typem danych – zobacz sekcję [Uzupełnianie nazw terminów](./logical-names.md#completing-term-names).  
Wybranie domeny w komórce domeny kolumny stanowi jeden krok wraz z typem danych, który domena nadaje kolumnie, i z tym, co [Synchronizacja typu danych w relacjach](./settings.md#relationship-datatype-sync) przenosi wzdłuż relacji. Wybranie pozycji `None`, które odłącza kolumnę od domeny, również stanowi jeden krok – zobacz sekcję [Komórka domeny](./logical-names.md#the-domain-cell). Wpisanie w powiązanej kolumnie typu danych innego niż typ jej domeny odłącza kolumnę od domeny w kroku tego wprowadzenia.  
Polecenie `Derive Physical Name Again` lub `Derive Physical Names Again` stanowi jeden krok, bez względu na to, ile nazw, powiązań z domeną i typów danych zmienia. Nie rejestruje żadnego kroku tylko wtedy, gdy niczego nie zmienia. Oddanie własnej nazwy słownikom jest zmianą, nawet jeśli nazwa ma już wartość, którą one nadają.

Utworzenie [grupy tabel](./table-groups.md), czy to przez jej narysowanie, czy przez zgrupowanie zaznaczonych tabel pozycją `Group selected tables` lub skrótem `T`, a potem `G`, stanowi jeden krok wraz ze wszystkimi tabelami, które obejmuje. Usunięcie grupy stanowi jeden krok, a jego cofnięcie przywraca grupę wraz z jej tabelami.  
Przeciągnięcie grupy za pasek tytułu przenosi grupę i wszystkie jej tabele w jednym kroku. Tabele upuszczone do grupy lub poza nią zmieniają grupę w tym samym kroku co ich przeciągnięcie, jeśli zwolnisz przycisk w ciągu około `200ms` od ostatniego ruchu, więc jedno cofnięcie przywraca je na ich miejsca i do grup, w których były. Po dłuższej przerwie przed zwolnieniem przycisku zmiana grupy stanowi osobny krok, a pierwsze cofnięcie wycofuje tylko ją.  
Zmiana rozmiaru grupy za krawędź lub róg jest rejestrowana raz, po zwolnieniu przycisku.  
Zastosowanie funkcji [Automatyczny układ](./table-related-functions.md#auto-layout) stanowi jeden krok, łącznie z grupami, które dopasowuje do ich tabel.

Operacja `Replace All` w funkcji [Znajdź i zamień](./find-and-replace.md#replacing) również stanowi jeden krok, bez względu na to, ile nazw tabel, nazw kolumn, nazw logicznych, nazw indeksów, nazw grup tabel, komentarzy i notatek zmienia, łącznie z nazwami fizycznymi i powiązaniami z domeną, które powstają na podstawie nazw logicznych. Gdy niczego nie zmienia, na przykład gdy opcja `Preserve Case` zapisuje każde dopasowanie z powrotem w niezmienionej postaci, nie rejestruje żadnego kroku.  
Pojedyncza operacja `Replace` stanowi jeden krok, łącznie z tym, co powstaje na podstawie nazwy logicznej, i z przewinięciem do następnego dopasowania, gdy to dopasowanie go wymaga. Gdy zapisuje swoje dopasowanie z powrotem w niezmienionej postaci, rejestruje tylko to przewinięcie, a gdy go nie ma – nic.  
Przejście do dopasowania przewija kanwę tylko wtedy, gdy dopasowanie nie jest już dobrze widoczne – zobacz sekcję [Dokąd prowadzi przejście](./table-related-functions.md#where-a-jump-lands). To przewinięcie jest rejestrowane jak każda inna zmiana położenia widoku, więc po przejściu przez kolejne dopasowania polecenie Cofnij najpierw wycofuje te przewinięcia, po jednym na krok.  
Pozostałe przejścia kończące się na kanwie rejestrują swoje przewinięcia w ten sam sposób: wybranie wiersza w Eksploratorze, wyniku Szybkiego wyszukiwania, kontroli w arkuszu `Checks` na karcie Słownik, która wskazuje tabelę lub kolumnę, lub [przycisku kafelka](./visualization.md#card-buttons) z łączem zewnętrznym w trybie Przepływ. Przejście, które pozostawia widok bez zmian, niczego nie rejestruje. Wybranie wiersza na liście widoku `Diff Viewer` również niczego nie rejestruje, ponieważ przewija jedynie własne strony Podglądu różnic, przeznaczone tylko do odczytu.

Ciągłe przeciąganie, przesuwanie widoku kanwy, powiększanie, gest szczypania lub zmiana koloru są buforowane przez około `200ms` i każda z tych czynności również trafia do historii jako jeden wpis.  
Przeciągnięcie na łączną odległość mniejszą niż `20px` nie rejestruje przeniesienia. Rejestrowana jest jedynie zmiana grupy, którą powoduje, o ile do niej dochodzi.

Wpisywanie w komórce lub notatce jest rejestrowane osobno dla każdego wprowadzenia, a nie dla gestu: każdy wpisany znak, każde wklejenie i każdy etap składania znaków w IME stanowi osobny krok.  
Komórka nazwy logicznej jest rejestrowana w ten sam sposób. Gdy jej edytor zamyka się z nazwą logiczną inną niż ta, z którą się otworzył, nazwa fizyczna generowana na jej podstawie przez słowniki stanowi jeszcze jeden krok po wpisywaniu. Pierwsze cofnięcie wycofuje tylko tę nazwę wraz z domeną i typem danych, które wniósł termin, i pozostawia wpisaną nazwę logiczną. Gdy niczego nie wygenerowano, nic więcej nie jest rejestrowane – zobacz sekcję [Wpisywanie nazwy logicznej](./logical-names.md#writing-a-logical-name).  
Nazwa grupy tabel jest rejestrowana raz, gdy zapisuje ją klawisz `Enter` lub opuszczenie pola, więc nazwa wpisana w dopiero co utworzonej grupie stanowi krok oddzielny od jej utworzenia. Ani klawisz `Esc`, ani niezmieniona nazwa niczego nie rejestrują.

## Arkusze karty Słownik {#dictionary-sheets}

Każdy z arkuszy `Domains`, `Words` i `Terms` na karcie Słownik ma własną historię, oddzielną od historii diagramu. Każda zmiana wprowadzona na tej karcie trafia do historii arkusza, którego wiersze zapisuje. Podobnie jak historia diagramu, każda z tych historii przechowuje maksymalnie `2048` kroków i znajduje się w pamięci na czas sesji.

- Gdy fokus klawiatury jest na tej karcie, skrót `Ctrl + Z` (Windows/Linux) lub `⌘ + Z` (Mac) cofa ostatnią zmianę wyświetlanego arkusza, a skrót `Ctrl + Shift + Z` (Windows/Linux) lub `⌘ + Shift + Z` (Mac) ponawia ostatnią cofniętą zmianę.
- Przyciski `Undo` i `Redo` na pasku narzędzi robią to samo i są podświetlone tylko wtedy, gdy wyświetlany arkusz ma zmianę do cofnięcia lub ponowienia. Ich naciśnięcie pozostawia fokus klawiatury tam, gdzie był: w siatce lub w polu wyszukiwania. Karta nie ma przycisku `Time Travel`.
- W arkuszu `Checks`, w którym niczego się nie edytuje, przyciski pozostają niepodświetlone, a ani one, ani klawisze nic nie robią.
- Gdy edycja komórki jest otwarta lub kursor tekstowy znajduje się w polu wyszukiwania karty, klawisze cofają i ponawiają zamiast tego tekst wpisywany w tym miejscu.

Historie nigdy się nie przenikają. Polecenie Cofnij na karcie ERD nigdy nie wycofuje zmiany arkusza, a polecenie Cofnij arkusza nigdy nie wycofuje zmiany innego arkusza ani zmiany diagramu. Każdy arkusz zachowuje swoją historię podczas przełączania arkuszy lub kart.

Każda z tych czynności stanowi jeden krok swojego arkusza:

- Edycja komórki, rejestrowana raz, w chwili zapisania, a nie dla każdego wpisanego znaku, i tylko wtedy, gdy zmienia wartość – zobacz sekcję [Edycja komórek](./dictionary.md#editing-cells).
- Wklejenie, łącznie z dodawanymi przez nie wierszami, oraz wyczyszczenie zaznaczonych komórek klawiszem `Delete` lub `Backspace` – zobacz sekcję [Kopiowanie i wklejanie](./dictionary.md#copying-and-pasting).
- Użycie przycisku `Add Row` oraz każde wstawienie lub usunięcie wierszy z paska, z menu siatki lub za pomocą klawiszy, bez względu na to, ile wierszy obejmuje – zobacz sekcję [Dodawanie i usuwanie wierszy](./dictionary.md#adding-and-deleting-rows).
- Domena terminu wybrana z jego listy, łącznie z pozycją `None` – zobacz sekcję [Domena terminu](./dictionary.md#a-terms-domain).
- Sortowanie – zobacz sekcję [Sortowanie](./dictionary.md#sorting).
- Jeden plik CSV zaimportowany przyciskiem `Import CSV`, bez względu na to, ile wierszy dodaje lub aktualizuje. Stanowi on krok arkusza, który plik wypełnia i który karta następnie wyświetla, niezależnie od tego, z którego arkusza go zaimportowano – zobacz sekcję [Importowanie](./dictionary.md#importing).

Zapis, który niczego nie zmienia, na przykład ponowny import tego samego pliku lub sortowanie arkusza, który już ma taką kolejność, nie rejestruje żadnego kroku, podobnie jak zapis odrzucony z powiadomieniem `Nothing saved: …`. Gdy termin bez wartości `Physical Name` otrzymuje nazwę, nazwa fizyczna złożona z jego słów należy do kroku tej zmiany.

Nowa wartość `Data Type` domeny stanowi jeden krok arkusza `Domains` wraz z typami, które nadaje ona kolumnom powiązanym z domeną, i z tymi, które Synchronizacja typu danych w relacjach przenosi od nich dalej – zobacz sekcję [Domeny i typy danych](./dictionary.md#domains-and-data-types).  
Jej cofnięcie lub ponowienie zmienia typ kolumn, które są powiązane z domeną w tej właśnie chwili, więc kolumna, którą w międzyczasie powiązano z inną domeną lub której zmieniono typ, zachowuje swój typ. Kolumna, którą ten krok odłączył od domeny, na przykład klucz obcy, który synchronizacja odłączyła od jego własnej domeny, zostaje ponownie powiązana tylko wtedy, gdy nadal jest niepowiązana i nadal ma typ, z jakim pozostawił ją ten krok.

Edytor z atrybutem `readonly` ukrywa te przyciski, a klawisze niczego nie cofają ani nie ponawiają.  
Zmiany od współpracowników i agentów kodujących również nie są rejestrowane w historii arkusza.

Historia każdego arkusza jest czyszczona, gdy słowniki zostają zastąpione: przez operację `Import` pliku JSON, wykonaną przez ciebie lub przez współpracownika, przez jej cofnięcie lub ponowienie oraz przez wczytanie innego diagramu do edytora. Operacja `Import` w formacie Schemat SQL, GraphQL, DBML lub AML zachowuje słowniki, a wraz z nimi historię każdego arkusza, także przy jej cofnięciu i ponowieniu.

## Podróż w czasie {#time-travel}

Podróż w czasie otwiera się przyciskiem `Time Travel` na pasku narzędzi, obok przycisków Cofnij i Ponów na karcie ERD.  
Przycisk nic nie robi, dopóki w historii diagramu nie zostanie zarejestrowana co najmniej jedna zmiana.

Podróż w czasie otwiera osobną kopię diagramu tylko do odczytu, w położeniu przewinięcia, przy poziomie powiększenia i z ustawieniem [Widok nazw](./logical-names.md#name-view), które pokazuje kanwa, niezależnie od tego, czy blokada `Viewport` lub `Name View` jest włączona.  
Przechodzi wyłącznie przez historię diagramu, więc zmiany wprowadzone w arkuszach karty Słownik nie należą do jej punktów.  
Przeciągnij suwak lub kliknij w dowolnym miejscu jego ścieżki, aby przejść przez całą historię edycji i wyświetlić podgląd każdego punktu. Skrajnie lewe położenie suwaka to stan o jeden krok wcześniejszy od pierwszej zarejestrowanej zmiany, a po otwarciu uchwyt suwaka wskazuje bieżący stan.  
Podgląd jest nieinteraktywny: rysuje minimapę, ale nie możesz przesuwać jego widoku, przewijać go ani go edytować, a rzeczywisty dokument pozostaje nietknięty, dopóki nie zastosujesz zmian.

Naciśnij przycisk `Apply`, aby przywrócić wybrany punkt, albo przycisk `Cancel` lub klawisz `Esc`, aby pozostawić dokument bez zmian.

![Otwieranie Podróży w czasie, przeciąganie suwaka wstecz przez sesję i stosowanie wcześniejszego punktu](/img/demo-time-travel.webp)
