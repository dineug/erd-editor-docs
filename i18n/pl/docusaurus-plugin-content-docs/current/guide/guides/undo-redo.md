---
sidebar_position: 13
description: Cofanie i ponawianie zmian, zawartość historii oraz przechodzenie przez nią krok po kroku za pomocą funkcji Podróż w czasie.
---

# Cofanie i ponawianie

Możesz wrócić do poprzedniego stanu edycji lub przejść do późniejszego.  
Historia przechowuje maksymalnie `2048` zmian.

- Cofnij: `Ctrl + Z` (Windows/Linux) lub `⌘ + Z` (Mac)
- Ponów: `Ctrl + Shift + Z` (Windows/Linux) lub `⌘ + Shift + Z` (Mac)

Te same dwa polecenia są dostępne na pasku narzędzi jako przyciski `Undo` i `Redo`, obok przycisku `Time Travel`.  
Są podświetlone tylko wtedy, gdy jest co cofnąć lub ponowić. Edytor z atrybutem `readonly` ukrywa wszystkie trzy przyciski, a skróty klawiaturowe nic nie robią.

Polecenia Cofnij i Ponów działają tylko na karcie ERD. Nie są dostępne na kartach Wizualizacja, Schemat SQL, Generator kodu i Ustawienia. W polach `Before tables` i `After tables` karty Schemat SQL te same klawisze cofają i ponawiają zamiast tego tekst wpisywany w danym polu.  
Skróty są też nieaktywne, gdy otwarte jest Szybkie wyszukiwanie, panel `Table Properties`, widok `Diff Viewer`, podgląd `Auto Layout`, okno dialogowe [`Export image`](./file-import-export.md#image), okno dialogowe [Mapuj kolumny](./relationship-editing.md#map-columns) lub Podróż w czasie.  
Działają nadal, gdy fokus klawiatury znajduje się w dowolnym miejscu [Eksploratora](./explorer.md#keys-in-the-explorer), łącznie z jego drzewem, oraz gdy otwarty jest [selektor kolorów](./table-related-functions.md#table-and-memo-color-specification). Nawet gdy kursor tekstowy jest w jednym z ich pól, takim jak pole wyszukiwania, pole zamiany lub pole `Hex`, cofają i ponawiają zmiany diagramu, a nie tekst w tym polu.

Historia jest przechowywana w pamięci na czas bieżącej sesji. Nie zapisuje się jej w dokumencie, więc po ponownym otwarciu diagramu historia jest pusta.

![Przenoszenie tabeli i usuwanie kolumny skrótem ⌥ + Backspace, a następnie cofanie obu zmian skrótem ⌘ + Z i ponawianie ich skrótem ⌘ + Shift + Z](/img/demo-undo-redo.webp)

## Co rejestruje historia {#what-the-history-records}

Rejestrowane są:

- Tabele i notatki: dodawanie, usuwanie, przenoszenie, kolor, nazwa i komentarz, tekst i rozmiar notatki.
- Grupy tabel: dodawanie, usuwanie, przenoszenie, zmiana rozmiaru, nazwa, kolor oraz to, do której grupy należy każda tabela – zobacz stronę [Grupy tabel](./table-groups.md).
- Kolumny: dodawanie, usuwanie, zmiana kolejności i każda opcja kolumny.
- Relacje: dodawanie, usuwanie, zmiana typu, kolumny ustawione w oknie dialogowym [Mapuj kolumny](./relationship-editing.md#map-columns) oraz każda wartość wybrana w pozycji `On Delete` lub `On Update` – zobacz sekcję [ON DELETE i ON UPDATE](./relationship-editing.md#on-delete-and-on-update). Cofnięcie usunięcia przywraca relację wraz z jej akcjami ON DELETE i ON UPDATE.
- Indeksy i ich kolumny.
- Położenie widoku, poziom powiększenia i przełączniki `View Option`.
- Skrypty `Before tables` i `After tables` na karcie Schemat SQL, po jednym kroku na każdą zmianę zatwierdzoną opuszczeniem pola – zobacz sekcję [Skrypty przed tabelami i po nich](./schema-sql.md#before-and-after-scripts).
- Importowanie pliku i dodawanie go operacją [`Import and Add`](./file-import-export.md#import-and-add).

Nie są rejestrowane:

- System bazy danych i nazwa bazy danych.
- Język w Generatorze kodu oraz opcje `Table Name Case` i `Column Name Case`.
- Typ cudzysłowu, niezależnie od tego, czy ustawiono go na karcie Schemat SQL, czy na karcie Generator kodu.
- Wartości wybrane w opcjach `Statements`, `Header` i `Tables` na karcie Schemat SQL, które należą do okna edytora – zobacz sekcję [Panel opcji](./schema-sql.md#options-panel).
- Wszystko na karcie Ustawienia, łącznie z wierszami [`Lock`](./settings.md#lock).
- Motyw i język wyświetlania – zobacz stronę [Język i motyw](./language-and-theme.md).
- To, która tabela, notatka lub grupa jest rysowana nad pozostałymi.
- [Eksplorator](./explorer.md): jego otwieranie, zamykanie lub zmiana rozmiaru, zwijanie drzewa oraz wyszukiwany tekst i opcje wyszukiwania. Rejestrowane jest jednak to, co zmieniają operacje `Replace` i `Replace All`, a także przewinięcie wykonywane przy przejściu – zobacz sekcję [Jeden gest, jeden krok](#one-gesture-one-step).
- Powiększanie i przesuwanie widoku na karcie Wizualizacja w obu trybach, przenoszenie węzłów grafu lub kafelków trybu Przepływ, przycisk `Tidy Up`, wyświetlanie wierszy oraz skupianie widoku na tabelach – zobacz sekcję [Tryb Przepływ nigdy nie zmienia dokumentu](./visualization.md#flow-never-edits-the-document).

Żadnej z tych zmian nie można cofnąć.

Zmiany docierające z innego edytora również nie są rejestrowane, więc polecenie Cofnij wycofuje tylko zmiany wprowadzone przez ciebie. W [sesji wspólnej edycji](../../api/advanced/collaborative-editing.md) każdy edytor cofa własne zmiany, a agent kodujący, który edytuje przez [serwer MCP](../../mcp/live-and-headless.md#undo), cofa swoje zmiany narzędziem `erd_undo`.

Cofnięcie operacji `Import`, która zastępuje cały diagram, przywraca wcześniejszy diagram w stanie, w jakim edytor przechowywał go w chwili importu, a każda [blokada](./settings.md#lock) jest włączona lub wyłączona i każda zablokowana wartość jest taka jak wtedy.  
Jeśli ten diagram miał włączoną blokadę `Viewport`, widok i powiększenie wracają do zablokowanego widoku, w którym diagram się otwiera, a nie do miejsca, w którym znajdował się widok. Przy wyłączonej blokadzie `Viewport` wracają do miejsca, w którym znajdował się widok w chwili importu. Inne zablokowane ustawienia, takie jak karta, na której jesteś, lub język w Generatorze kodu, pozostają takie, jakie są na ekranie.  
Nowy diagram ma na początku włączone wszystkie blokady. Aby zachować swój widok po takim cofnięciu, wyłącz blokadę `Viewport` przed importem. Ani wyłączenie jej później, ani zaimportowanie pliku JSON z wyłączoną własną blokadą `Viewport` nie zmienia tego, dokąd prowadzi cofnięcie.

## Jeden gest, jeden krok {#one-gesture-one-step}

Wszystko, co przekazuje pojedynczy gest, tworzy jeden wpis w historii.  
Wklejenie kilku tabel i notatek naraz lub ich zduplikowanie kombinacją `Alt + drag` cofa się w jednym kroku.

Naciśnięcie klawisza `Delete` lub `Backspace` albo wybranie pozycji `Delete selected` lub `Delete columns` w menu kontekstowym stanowi jeden krok, bez względu na to, ile tabel, notatek, grup tabel lub kolumn usuwa.  
Przełączenie klucza podstawowego w kilku zaznaczonych kolumnach stanowi jeden krok, niezależnie od tego, czy użyto skrótu `Alt + K` (Windows/Linux) lub `⌥ + K` (Mac), czy pozycji `Primary Key on selected columns` w menu kontekstowym tabeli.  
Ustawienie koloru zaznaczonych elementów lub jego usunięcie opcją `No color` lub pozycją `Remove color` stanowi jeden krok, bez względu na to, ile tabel, notatek i grup jest zaznaczonych. Wybranie koloru, który mają już wszystkie zaznaczone elementy, nie rejestruje żadnego kroku, podobnie jak opcja `No color`, gdy żaden zaznaczony element nie ma koloru.  
Użycie przycisku `Map` lub `Save` w oknie dialogowym [Mapuj kolumny](./relationship-editing.md#map-columns) stanowi jeden krok wraz z kolumnami kluczy obcych, które dodaje, i typami danych, które zmienia.  
Operacja `Import and Add` stanowi jeden krok wraz z przewinięciem, które pokazuje dodany blok, gdy jest ono potrzebne.

Utworzenie [grupy tabel](./table-groups.md), czy to przez jej narysowanie, czy przez zgrupowanie zaznaczonych tabel pozycją `Group selected tables` lub skrótem `T`, a potem `G`, stanowi jeden krok wraz ze wszystkimi tabelami, które obejmuje. Usunięcie grupy stanowi jeden krok, a jego cofnięcie przywraca grupę wraz z jej tabelami.  
Przeciągnięcie grupy za pasek tytułu przenosi grupę i wszystkie jej tabele w jednym kroku. Tabele upuszczone do grupy lub poza nią zmieniają grupę w tym samym kroku co ich przeciągnięcie, jeśli zwolnisz przycisk w ciągu około `200ms` od ostatniego ruchu, więc jedno cofnięcie przywraca je na ich miejsca i do grup, w których były. Po dłuższej przerwie przed zwolnieniem przycisku zmiana grupy stanowi osobny krok, a pierwsze cofnięcie wycofuje tylko ją.  
Zmiana rozmiaru grupy za krawędź lub róg jest rejestrowana raz, po zwolnieniu przycisku.  
Zastosowanie funkcji [Automatyczny układ](./table-related-functions.md#auto-layout) stanowi jeden krok, łącznie z grupami, które dopasowuje do ich tabel.

Operacja `Replace All` w funkcji [Znajdź i zamień](./find-and-replace.md#replacing) również stanowi jeden krok, bez względu na to, ile nazw tabel, nazw kolumn, nazw indeksów, nazw grup tabel, komentarzy i notatek zmienia. Gdy niczego nie zmienia, na przykład gdy opcja `Preserve Case` zapisuje każde dopasowanie z powrotem w niezmienionej postaci, nie rejestruje żadnego kroku.  
Pojedyncza operacja `Replace` stanowi jeden krok, łącznie z przewinięciem do następnego dopasowania, gdy to dopasowanie go wymaga. Gdy zapisuje swoje dopasowanie z powrotem w niezmienionej postaci, rejestruje tylko to przewinięcie, a gdy go nie ma – nic.  
Przejście do dopasowania przewija kanwę tylko wtedy, gdy dopasowanie nie jest już dobrze widoczne – zobacz sekcję [Dokąd prowadzi przejście](./table-related-functions.md#where-a-jump-lands). To przewinięcie jest rejestrowane jak każda inna zmiana położenia widoku, więc po przejściu przez kolejne dopasowania polecenie Cofnij najpierw wycofuje te przewinięcia, po jednym na krok.  
Pozostałe przejścia kończące się na kanwie rejestrują swoje przewinięcia w ten sam sposób: wybranie wiersza w Eksploratorze, wyniku Szybkiego wyszukiwania lub [przycisku kafelka](./visualization.md#card-buttons) z łączem zewnętrznym w trybie Przepływ. Przejście, które pozostawia widok bez zmian, niczego nie rejestruje. Wybranie wiersza na liście widoku `Diff Viewer` również niczego nie rejestruje, ponieważ przewija jedynie własne strony Podglądu różnic, przeznaczone tylko do odczytu.

Ciągłe przeciąganie, przesuwanie widoku kanwy, powiększanie, gest szczypania lub zmiana koloru są buforowane przez około `200ms` i każda z tych czynności również trafia do historii jako jeden wpis.  
Przeciągnięcie na łączną odległość mniejszą niż `20px` nie rejestruje przeniesienia. Rejestrowana jest jedynie zmiana grupy, którą powoduje, o ile do niej dochodzi.

Wpisywanie w komórce lub notatce jest rejestrowane osobno dla każdego wprowadzenia, a nie dla gestu: każdy wpisany znak, każde wklejenie i każdy etap składania znaków w IME stanowi osobny krok.  
Nazwa grupy tabel jest rejestrowana raz, gdy zapisuje ją klawisz `Enter` lub opuszczenie pola, więc nazwa wpisana w dopiero co utworzonej grupie stanowi krok oddzielny od jej utworzenia. Ani klawisz `Esc`, ani niezmieniona nazwa niczego nie rejestrują.

## Podróż w czasie {#time-travel}

Podróż w czasie otwiera się przyciskiem `Time Travel` na pasku narzędzi, obok przycisków Cofnij i Ponów.  
Przycisk nic nie robi, dopóki w sesji nie zostanie zarejestrowana co najmniej jedna zmiana.

Podróż w czasie otwiera osobną kopię diagramu tylko do odczytu, w położeniu przewinięcia i przy poziomie powiększenia, które pokazuje kanwa, niezależnie od tego, czy blokada `Viewport` jest włączona.  
Przeciągnij suwak lub kliknij w dowolnym miejscu jego ścieżki, aby przejść przez całą historię edycji i wyświetlić podgląd każdego punktu. Skrajnie lewe położenie suwaka to stan o jeden krok wcześniejszy od pierwszej zarejestrowanej zmiany, a po otwarciu uchwyt suwaka wskazuje bieżący stan.  
Podgląd jest nieinteraktywny: rysuje minimapę, ale nie możesz przesuwać jego widoku, przewijać go ani go edytować, a rzeczywisty dokument pozostaje nietknięty, dopóki nie zastosujesz zmian.

Naciśnij przycisk `Apply`, aby przywrócić wybrany punkt, albo przycisk `Cancel` lub klawisz `Esc`, aby pozostawić dokument bez zmian.

![Otwieranie Podróży w czasie, przeciąganie suwaka wstecz przez sesję i stosowanie wcześniejszego punktu](/img/demo-time-travel.webp)
