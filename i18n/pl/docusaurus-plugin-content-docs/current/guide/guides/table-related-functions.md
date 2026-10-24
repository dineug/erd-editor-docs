---
sidebar_position: 5
description: Zaznaczanie, przenoszenie, kopiowanie, duplikowanie i usuwanie tabel i notatek, ustawianie kolorów i opcji widoku, definiowanie indeksów i kluczy alternatywnych, wybór bazy danych, poruszanie się po nieskończonej kanwie i porównywanie dokumentów.
---

# Operacje na tabelach

Wszystko, co robisz z tabelami i notatkami, gdy już istnieją – zaznaczanie, przenoszenie, kopiowanie, usuwanie, kolorowanie i ustawianie tego, co pokazuje kanwa – oraz otaczające je elementy sterowania kanwą.  
Najpierw opisano polecenia dotyczące tabel i notatek; potem właściwości tabeli, skupianie widoku na tabelach, indeksy i klucze alternatywne, automatyczny układ i system bazy danych; na końcu samą kanwę: pasek narzędzi kanwy, powiększenie, przesuwanie widoku i to, dokąd prowadzi przejście, oraz podgląd różnic.  
Grupy tabel, czyli ramki skupiające tabele, mają własną stronę – zobacz stronę [Grupy tabel](./table-groups.md).  
Własną stronę mają też nazwy logiczne i Widok nazw, który określa, jakie nazwy pokazują tabele – zobacz stronę [Nazwy logiczne](./logical-names.md).

## Zaznaczanie wielu elementów {#multiple-selection}

Dostępne są trzy sposoby:

- `Ctrl + drag` (Windows/Linux) lub `⌘ + drag` (Mac)
- `Ctrl + click` (Windows/Linux) lub `⌘ + click` (Mac)
- `Ctrl + A` lub `Ctrl + Alt + A` (Windows/Linux), `⌘ + A` lub `⌘ + ⌥ + A` (Mac)

Notatki zaznacza się w ten sam sposób, a każdy z obu skrótów zaznaczania wszystkiego obejmuje naraz wszystkie tabele i notatki. Notatki ukryte za pomocą View Option → `Memos` są pomijane przy zaznaczaniu wszystkiego i przez ramkę zaznaczenia – zobacz sekcję [Opcje widoku tabel](#table-view-options).  
[Grupy tabel](./table-groups.md#selecting-groups) dodaje się do zaznaczenia skrótem `Ctrl + click` (Windows/Linux) lub `⌘ + click` (Mac) na ich pasku tytułu, ale zaznaczanie wszystkiego nigdy nie obejmuje żadnej z nich.  
Skrót `Ctrl + A` ustępuje kursorowi tekstowemu, więc podczas edycji komórki zaznacza tekst, a nie diagram.  
Ramka zaznaczenia dodaje tabelę lub notatkę do zaznaczenia, gdy zakrywa jej środek, a nie gdy tylko dotyka jej krawędzi. Grupę tabel zaznacza tylko wtedy, gdy obejmuje całą ramkę grupy, więc ramka narysowana wewnątrz grupy wybiera tabele bez grupy.  
Kliknięcie prawym przyciskiem myszy czegoś, co jest już zaznaczone, zachowuje całe zaznaczenie, więc pozycje menu takie jak `Color`, `Group selected tables` i `Delete selected` działają na całość. Kliknięcie prawym przyciskiem myszy dowolnej innej tabeli, notatki lub grupy tabel zaznacza tylko ten element, nawet przy przytrzymanym klawiszu `Ctrl` lub `⌘`, a kliknięcie prawym przyciskiem myszy relacji lub pustej kanwy anuluje zaznaczenie.  
Klawisz `Escape` anuluje zaznaczenie. Gdy otwarty jest edytor komórki, notatki lub nazwy grupy tabel albo trwa rysowanie relacji lub grupy poleceniem `New Table Group`, pierwsze naciśnięcie klawisza `Escape` kończy tę czynność, a drugie anuluje zaznaczenie.

![Zaznaczanie tabel za pomocą ⌘ + drag i ⌘ + click, a potem wszystkich tabel i notatek za pomocą ⌘ + A](/img/demo-table-select.webp)

W sesji wspólnej edycji zaznaczenie, komórka z fokusem i ramka zaznaczenia każdego uczestnika są rysowane na kanwie w kolorze tego uczestnika – zobacz stronę [Wspólna edycja](../../api/advanced/collaborative-editing.md).  
Komórka z fokusem uczestnika, który ma ustawiony inny Widok nazw, jest rysowana na komórce, którą twój widok wyświetla w jej miejscu, na przykład jego komórka nazwy na twojej komórce nazwy logicznej – zobacz sekcję [Współpracownicy](./logical-names.md#collaborators).

## Przenoszenie wielu tabel {#moving-multiple-tables}

Przeciągnij dowolną tabelę lub notatkę, która już należy do zaznaczenia, a całe zaznaczenie przesunie się razem z nią – bez żadnego klawisza modyfikującego.  
Tabelę przeciąga się za jej nagłówek lub za dowolny z wierszy jej kolumn, więc przeciąganie rozpoczęte na wierszu kolumny przenosi tabelę, a nie kolumnę. Kolumny przenosi się zamiast tego za uchwyt przeciągania obok wiersza z fokusem – zobacz sekcję [Zmiana kolejności i przenoszenie kolumn](./table-editing.md#rearranging-and-moving-columns).  
Na komórce nagłówka lub wierszu kolumny tabela zaczyna się przesuwać dopiero wtedy, gdy wskaźnik pokona niewielką odległość, więc kliknięcie w tym miejscu nadal ustawia fokus na komórce, a dwukrotne kliknięcie nadal otwiera jej edytor. Przeciąganie nigdy nie rozpoczyna się od krawędzi z kolorem tabeli, która otwiera selektor kolorów, od przycisków `+` i `x` w jej nagłówku ani od przycisku `x` w wierszu kolumny.  
Przeciągnięcie czegoś spoza zaznaczenia zawęża zaznaczenie do tego elementu i przenosi tylko ten element. Skrót `Ctrl + drag` (Windows/Linux) lub `⌘ + drag` (Mac) w obu przypadkach zachowuje zaznaczenie.  
Tabele i notatki przenosi tylko lewy przycisk myszy. Kliknięcie prawym przyciskiem myszy wybiera, na czym działa menu kontekstowe, i niczego nie przenosi, a przeciąganie środkowym przyciskiem zamiast tego przesuwa widok kanwy – zobacz sekcję [Poruszanie się po kanwie](#getting-around-the-canvas).

![Przeciągnięcie jednej z dwóch zaznaczonych tabel przenosi obie, a relacja podąża za nimi](/img/demo-table-multiple-move.webp)

Zaznaczona [grupa tabel](./table-groups.md) również się przesuwa, przenosząc swoje tabele, a tabela, która jest zarówno zaznaczona, jak i należy do przenoszonej grupy, przesuwa się tylko raz.  
Miejsce, w którym upuścisz tabelę, może przenieść ją do grupy lub z niej usunąć – zobacz sekcję [Dodawanie i usuwanie tabel](./table-groups.md#adding-and-removing-tables).

Tabele i notatki mają wspólną kolejność warstw. Naciśnięcie tabeli lub notatki lewym albo prawym przyciskiem przenosi ją na wierzch, przed wszystkie inne tabele i notatki, a naciśnięcie paska tytułu grupy tabel lub kliknięcie prawym przyciskiem myszy jej wnętrza przenosi jej tabele na wierzch.  
Kolejność nie jest zapisywana: ponownie otwarty diagram układa tabele w kolejności, w jakiej wymienia je plik, a wszystkie notatki nad nimi.

## Kopiowanie/wklejanie tabel i notatek {#copyingpasting-tables-and-memos}

Kopiuje zaznaczone tabele i notatki oraz wkleja je ponownie jako nowe.  
Skróty klawiaturowe: `Ctrl + C` (Windows/Linux) lub `⌘ + C` (Mac), `Ctrl + V` (Windows/Linux) lub `⌘ + V` (Mac)

Skopiowana tabela zachowuje nazwę, nazwę logiczną, komentarz, kolumny i kolor; skopiowana notatka zachowuje tekst, rozmiar i kolor.  
Każda skopiowana kolumna zachowuje swoją nazwę logiczną, a każda nazwa tabeli i kolumny zachowuje informację o tym, czy wygenerowały ją słowniki – zobacz sekcję [Generowanie nazw fizycznych](./dictionary.md#deriving-physical-names).  
Wklejona kolumna zachowuje powiązanie z domeną tylko wtedy, gdy spełnione są dwa warunki: diagram, do którego trafia, ma na liście dokładnie tę domenę, a nie tylko domenę o tej samej nazwie, a domena nadal ma typ danych, z którym kolumnę skopiowano. W przeciwnym razie kolumna trafia do diagramu bez domeny i zachowuje typ, z którym ją skopiowano – zobacz sekcję [Powiązanie kolumny z domeną](./dictionary.md#linking-a-column).  
Kopiowane są też indeksy i relacje: indeks trafia w całości do skopiowanej tabeli, a relacja jest kopiowana wraz z typem i akcjami ON DELETE i ON UPDATE, gdy obie łączone przez nią tabele należą do kopiowanego zestawu. Relacja skopiowana tylko w połowie jest pomijana, zamiast wskazywać z powrotem na oryginał.  
Wklejone kopie stają się nowym zaznaczeniem, a każde kolejne wklejenie tej samej kopii przesuwa ją o następne `50px`, więc powtarzane wklejenia nie nakładają się na siebie.  
Kopia nie zachowuje swojej [grupy tabel](./table-groups.md): wklejona tabela nie należy do żadnej grupy, nawet jeśli znajdzie się w obrębie ramki grupy, a zaznaczona grupa nie jest kopiowana.  
Gdy View Option → `Memos` ukrywa notatki, wklejenie nadal dodaje zawarte w nim notatki, ukryte i niezaznaczone, więc nowym zaznaczeniem stają się tylko wklejone tabele.

![Kopiowanie dwóch powiązanych tabel i dwukrotne wklejanie ich razem z relacją](/img/demo-table-copy-paste.webp)

Gdy wewnątrz tabeli z fokusem zaznaczone są kolumny, ten sam skrót kopiuje zamiast tego te kolumny – zobacz stronę [Edycja tabel](./table-editing.md).

## Duplikowanie tabel i notatek {#duplicating-tables-and-memos}

Przytrzymaj klawisz `Alt` i przeciągnij tabelę lub notatkę lewym przyciskiem myszy.  
Tabelę chwyta się za jej nagłówek lub za dowolny wiersz kolumny, więc skrót `Alt + drag` na wierszu kolumny duplikuje tabelę i nie zmienia kolejności kolumn. Przytrzymanie klawisza `Alt` na uchwycie przeciągania kolumny niczego nie duplikuje: kolumna przesuwa się tak jak przy zwykłym przeciąganiu uchwytu – zobacz sekcję [Zmiana kolejności i przenoszenie kolumn](./table-editing.md#rearranging-and-moving-columns).  
Za wskaźnikiem podąża półprzezroczysty podgląd, a zwolnienie przycisku upuszcza kopię w miejscu podglądu.  
Jeśli chwycony element już należy do zaznaczenia, duplikowane jest całe zaznaczenie. W przeciwnym razie miejsce zaznaczenia zajmuje encja pod wskaźnikiem.  
Skrót `Alt + click` bez ruszania myszą upuszcza kopię `50px` niżej i w prawo, przesuwając ją dalej za każdym razem, gdy to miejsce jest już zajęte.

Duplikat zawiera to samo co [wklejenie](#copyingpasting-tables-and-memos): nazwy i nazwy logiczne, komentarze, kolumny, kolory, rozmiary notatek oraz indeksy i relacje należące w całości do tego, co skopiowano. Ponieważ pozostaje w tym samym diagramie, zachowuje bez zmian powiązanie każdej kolumny z domeną. Podobnie jak wklejona kopia, nie trafia do żadnej grupy tabel.  
Skrót `Alt + drag` na pasku tytułu grupy tabel przenosi grupę tak jak zwykłe przeciąganie; grupa nigdy nie jest duplikowana.

![Duplikowanie tabeli za pomocą Alt + drag, a potem Alt + click, aby dodać kolejną kopię niżej i w prawo](/img/demo-table-duplicate.webp)

## Usuwanie tabel i notatek {#table-and-memo-deletion}

Usuwa zaznaczone tabele, notatki i [grupy tabel](./table-groups.md).  
Skróty klawiaturowe:

- `Delete` lub `Backspace`. Usuwają one całe zaznaczenie, chyba że jedynym zaznaczonym elementem jest tabela z niektórymi zaznaczonymi kolumnami, a powiększenie przekracza `70%`: wtedy usuwają zamiast tego te kolumny – zobacz sekcję [Usuwanie kolumn](./table-editing.md#column-deletion).
- `Ctrl + Backspace` lub `Ctrl + Delete` (Windows/Linux), `⌘ + Backspace` lub `⌘ + Delete` (Mac). Te skróty zawsze usuwają zaznaczone tabele, notatki i grupy tabel, nawet gdy zaznaczone są kolumny.

![Usuwanie tabeli i jej relacji klawiszem Delete, a potem tabeli i notatki naraz za pomocą Delete selected z menu notatki](/img/demo-table-remove.webp)

Usuwać można też z menu kontekstowych. Ostatnia pozycja menu tabeli lub notatki brzmi `Delete selected`, gdy ta tabela lub notatka jest jednym z co najmniej dwóch zaznaczonych elementów, i usuwa całe zaznaczenie. W przeciwnym razie brzmi `Delete` i usuwa tylko tę tabelę lub notatkę. Otwarte na wierszu zaznaczonej kolumny menu tabeli zawiera zamiast tego pozycję `Delete column` lub `Delete columns`, jak opisano w sekcji [Usuwanie kolumn](./table-editing.md#column-deletion).

Usunięcie tabeli usuwa razem z nią jej relacje i indeksy. Usunięcie grupy tabel zachowuje jej tabele, już poza grupą – zobacz sekcję [Usuwanie grupy](./table-groups.md#removing-a-group).  
Nie ma potwierdzenia, każde usunięcie stanowi jeden krok cofania, a w edytorze z atrybutem `readonly` nic nie jest usuwane.  
Przytrzymane klawisze `Delete` i `Backspace` usuwają tylko raz i nigdy nie usuwają relacji – zobacz stronę [Edycja relacji](./relationship-editing.md#deletion). Podczas pisania w komórce, notatce lub dowolnym innym polu tekstowym edytują zamiast tego tekst.  
W Ustawieniach oba klawisze figurują jako `Delete Selection` – zobacz sekcję [Skróty klawiaturowe](./settings.md#shortcuts).

## Ustawianie kolorów tabel i notatek {#table-and-memo-color-specification}

Możesz przypisywać kolory, aby rozróżniać elementy według kategorii.  
Tabela pokazuje swój kolor wzdłuż lewej krawędzi, a notatka – na pasku u góry. Kliknij tę krawędź lub pasek lewym przyciskiem albo wybierz `Color` w menu kontekstowym tabeli lub notatki, aby otworzyć selektor kolorów przy wskaźniku. Kolor zostaje zastosowany do każdej zaznaczonej tabeli, notatki i grupy tabel, a nie tylko do klikniętego elementu.  
Grupę tabel koloruje się pozycją `Color` w jej własnym menu, a tabela w kolorowej grupie ma kolor grupy na całym nagłówku, zachowując własny kolor na lewej krawędzi – zobacz sekcję [Kolorowanie grupy](./table-groups.md#coloring-a-group).

![Wybór koloru predefiniowanego Blue z paska koloru notatki dla dwóch zaznaczonych tabel i notatki, a potem usunięcie koloru za pomocą No color](/img/demo-table-color.webp)

Selektor zawiera od góry do dołu:

- Obszar nasycenia i jasności, następnie suwak odcienia z podglądem koloru obok. Jeśli przeglądarka udostępnia pipetę, przycisk pipety przed suwakiem, `Pick a color from the screen`, pobiera kolor z dowolnego miejsca na ekranie.
- Pola `Hex`, `R`, `G` i `B`. Pole `Hex` przyjmuje 3, 4, 6 lub 8 cyfr szesnastkowych, ze znakiem `#` lub bez niego, albo wklejoną wartość `rgb()`, `hsl()` lub nazwę koloru CSS. Pełna wartość 6- lub 8-cyfrowa jest stosowana w trakcie wpisywania, a każda inna po naciśnięciu klawisza `Enter` lub po opuszczeniu pola. Pola `R`, `G` i `B` przyjmują liczby całkowite, traktując każdą wartość powyżej `255` jako `255`, a ich wartości są stosowane po naciśnięciu klawisza `Enter` lub po opuszczeniu pola. Tekst, którego selektor nie potrafi odczytać, jest odrzucany.
- Szesnaście próbek kolorów predefiniowanych w dwóch rzędach po osiem: Red, Orange, Amber, Yellow, Lime, Green, Teal, Cyan, Blue, Indigo, Violet, Purple, Pink, Crimson, Brown i Gray. Najechanie wskaźnikiem na próbkę koloru pokazuje jej kod szesnastkowy.
- `Document colors`: do ośmiu kolorów, których już używają tabele, notatki i grupy tabel dokumentu, od najczęściej używanego. Ten rząd pojawia się tylko wtedy, gdy takie kolory istnieją.
- `No color`.

Kolor jest zawsze nieprzezroczysty: selektor nie ma regulacji przezroczystości i odrzuca każdą przezroczystość zawartą we wpisanej lub wklejonej wartości.  
Otwarcie selektora niczego nie zmienia, a wybranie koloru, który zaznaczenie już ma, nie dodaje kroku cofania.

Opcja `No color` usuwa kolor każdej zaznaczonej tabeli, notatki i grupy tabel w jednym kroku cofania i zamyka selektor. Pozycja `Remove color`, widoczna tuż pod pozycją `Color` w menu kontekstowych tabeli, notatki i grupy tabel, gdy którykolwiek zaznaczony element ma kolor, robi to samo bez otwierania selektora.

Po otwarciu selektor przejmuje fokus klawiatury, a klawisze `Tab` i `Shift + Tab` przechodzą w pętli po jego elementach sterujących. Klawisze strzałek przesuwają obszar i suwak odcienia o 1 lub, z klawiszem `Shift`, o 10, a także przechodzą od próbki do próbki, od razu stosując każdy kolor.  
Gdy selektor ma fokus klawiatury, cofanie i ponawianie, skróty powiększenia oraz polecenia `Search` i `Toggle Explorer` nadal docierają do edytora, a pozostałe skróty edytora nie: skróty [usuwania](#table-and-memo-deletion) niczego nie usuwają, a klawisze `Delete` i `Backspace` jedynie edytują tekst pól `Hex`, `R`, `G` i `B`.  
Klawisz `Escape` zamyka selektor, podobnie jak naciśnięcie kanwy poza nim.  
Naciśnięcie w panelu [Eksplorator](./explorer.md) nie jest naciśnięciem kanwy, więc selektor pozostaje otwarty. Wybrany tam wiersz zmienia zaznaczenie, a następny wybór koloru koloruje nowe zaznaczenie.

## Opcje widoku tabel {#table-view-options}

Dostępne są następujące opcje widoku:

- Table Comment
- Column Comment
- DataType
- Domain
- Default
- Not Null
- Unique
- Alternate Key
- Auto Increment
- Relationship
- Referential Actions
- Table Groups
- Memos

Opcje `Domain`, `Unique`, `Alternate Key` i `Auto Increment` są domyślnie wyłączone, a pozostałe włączone.  
To, jakie nazwy pokazują tabele, nie jest opcją widoku: pozycja `Name View`, tuż za pozycją `View Option` w menu kontekstowym kanwy, wybiera nazwy fizyczne, nazwy logiczne lub obie – zobacz sekcję [Przełączanie widoku](./logical-names.md#switching-the-view).  
Opcja `Domain` dodaje każdej kolumnie komórkę, umieszczoną zgodnie z [kolejnością kolumn](./settings.md#adjusting-column-order), z nazwą domeny, z którą kolumna jest powiązana. Kolumna, która nie jest powiązana z żadną domeną z arkusza `Domains`, pokazuje w niej przyciemniony tekst zastępczy `domain`. Komórka jest widoczna niezależnie od Widoku nazw. Gdy opcja `Domain` jest wyłączona, widok `Logical Names` pokazuje zamiast tego nazwę powiązanej domeny w komórce typu – zobacz sekcję [Komórka domeny](./logical-names.md#the-domain-cell).  
Opcja `Alternate Key` oznacza kolumny każdego klucza alternatywnego, na przykład `AK1.1` – zobacz sekcję [Klucze alternatywne](#alternate-keys).  
Opcja `Referential Actions` pokazuje etykiety `D:` i `U:`, które akcje ON DELETE i ON UPDATE relacji umieszczają na końcu jej łącznika przy tabeli podrzędnej – zobacz sekcję [Odczytywanie łącznika](./relationship-editing.md#reading-a-connector). Jej wyłączenie ukrywa tylko te etykiety i nie przesuwa żadnej tabeli ani łącznika.  
Opcja `Table Groups` pokazuje [grupy tabel](./table-groups.md) i kolory grup na nagłówkach ich tabel. Jej wyłączenie ukrywa je na kanwie, minimapie i w eksportowanych obrazach, nie przesuwa żadnej tabeli i pozostawia każdą tabelę w jej grupie – zobacz sekcję [Ukrywanie grup](./table-groups.md#hiding-groups). Usuwa też folder `Table Groups` z [Eksploratora](./explorer.md#the-tree) i przycisk `New Table Group` z [paska narzędzi kanwy](#canvas-toolbar), a wyszukiwanie w Eksploratorze przestaje znajdować nazwy grup.  
Opcja `Memos` pokazuje notatki. Jej wyłączenie ukrywa wszystkie notatki na kanwie, minimapie i w eksportowanych obrazach oraz nie przesuwa żadnej tabeli ani łącznika. Ukryte notatki nie zajmują miejsca, więc paski przewijania, minimapa i kompas `Go to content` je pomijają.  
Ukrycie notatek anuluje ich zaznaczenie i zamyka otwarty edytor notatki. [Eksplorator](./explorer.md#the-tree) usuwa swój folder `Memos`, a jego wyszukiwanie [Znajdź i zamień](./find-and-replace.md) i prefiks `:` szybkiego wyszukiwania ich nie przeszukują. Gdy są ukryte, polecenie `New Memo` znika z menu kontekstowego, [paska narzędzi kanwy](#canvas-toolbar), szybkiego wyszukiwania i [ekranu powitalnego](./editing-start.md#welcome-screen), a skrót `Alt + M` nie dodaje notatki. Wklejenie lub operacja [Importuj i dodaj](./file-import-export.md#import-and-add) nadal dodaje zawarte w nich notatki, ukryte i niezaznaczone.  
W edytorze z atrybutem `readonly` przełączniki niczego nie zmieniają.

![Przełączanie pozycji Opcji widoku przy zmieniającym się układzie tabel, oznaczanie złożonego indeksu unikatowego jako AK1.1 i AK1.2 za pomocą Alternate Key, a potem wyłączanie i włączanie Memos](/img/demo-view-options.webp)

Kafelki w trybie `Flow` karty Wizualizacja nie stosują się do tych opcji, łącznie z opcją `Domain`: korzystają z własnego [wyświetlania wierszy](./visualization.md#row-display) i rysują swoje łączniki nawet przy wyłączonej opcji `Relationship`. To, jakie komórki rozmieszcza kafelek, zależy wyłącznie od Widoku nazw – zobacz sekcję [Nazwy na kafelkach](./visualization.md#names-on-the-cards).

## Właściwości tabeli {#table-properties}

Otwiera panel właściwości tabeli.  
Wybierz `Table Properties` w menu kontekstowym tabeli, co otwiera panel dla tabeli klikniętej prawym przyciskiem myszy, albo zaznacz tabelę i naciśnij `Alt + Space`.  
Panel otwiera się na środku przyciemnionej kanwy. Przyciemniona jest tylko kanwa, więc otwarty [Eksplorator](./explorer.md#dialogs-beside-it) pozostaje otwarty i dostępny obok panelu. Nagłówek panelu zawiera tytuł `Table Properties`, pięć ostatnio otwartych tabel w postaci etykiet z wyróżnioną bieżącą tabelą oraz przycisk zamykania. Każda etykieta nazywa swoją tabelę tak, jak robi to [Widok nazw](./logical-names.md#beyond-the-canvas). Kliknij etykietę, aby przejść do tej tabeli bez ponownego otwierania panelu.  
Pod nagłówkiem znajdują się trzy karty: `Indexes`, `Schema SQL` i `Code Generator`. Panel ma ten sam rozmiar dla wszystkich trzech, więc przełączanie kart go nie przesuwa ani nie zmienia jego rozmiaru.  
Zamknij go przyciskiem zamykania, klawiszem `Escape` lub kliknięciem kanwy poza panelem.  
Wybranie w Eksploratorze wiersza innego niż folder lub przejście do dopasowania jego wyszukiwania zamyka Właściwości tabeli przed przejściem. To samo robi skrót `Ctrl + F` (Windows/Linux) lub `⌘ + F` (Mac), który otwiera wyszukiwanie Eksploratora albo, gdy Eksplorator jest już otwarty, umieszcza kursor tekstowy w jego polu wyszukiwania. Każde inne kliknięcie w Eksploratorze, także w wierszu folderu, lub na przycisku `Explorer` paska narzędzi pozostawia Właściwości tabeli otwarte. Naciśnięcie klawisza `Escape`, gdy fokus klawiatury jest w Eksploratorze, jedynie oddaje fokus klawiatury kanwie, więc do zamknięcia Właściwości tabeli potrzebne jest drugie naciśnięcie klawisza `Escape`.

Kartę `Indexes` opisano w sekcji [Indeksy](#indexes).  
Karta `Schema SQL` pokazuje kod DDL tabeli dla wybranej [bazy danych](#databases): jej instrukcję `CREATE TABLE`, osobne ograniczenia, które niektóre bazy danych zapisują dla jej kolumn oznaczonych jako unikatowe, oraz jej indeksy. Zawsze zapisuje zwykłe instrukcje `CREATE`, bez nagłówka, bez skryptów przed tabelami i po nich oraz bez nazw logicznych w pustych komentarzach, niezależnie od ustawień karty [Schemat SQL](./schema-sql.md) na pasku narzędzi – zobacz sekcję [Nazwy logiczne jako komentarze](./schema-sql.md#logical-names-as-comments). Nie ma panelu opcji, a jej menu kontekstowe oferuje tylko `Database` i `Bracket`.  
Karta `Code Generator` generuje kod tylko dla tej tabeli – zobacz stronę [Generator kodu](./code-generator.md).

W edytorze z atrybutem `readonly` panel nadal się otwiera, z plakietką `Read only` obok tytułu, ale jego karta `Indexes` nie pozwala na żadne zmiany.

## Skupianie widoku na tabelach {#focusing-on-tables}

Otwiera kartę Wizualizacja w trybie `Flow`, zawężoną do wybranych tabel i wszystkich tabel oddalonych od nich o jedną relację.  
Wybierz `Focus on this table` w menu kontekstowym tabeli albo zaznacz jedną lub więcej tabel i naciśnij `Alt + F`.  
Gdy tabela kliknięta prawym przyciskiem myszy jest jedną z kilku zaznaczonych tabel, pozycja brzmi `Focus on selected tables` i skupia widok na całym zaznaczeniu. Kliknięcie prawym przyciskiem myszy tabeli spoza zaznaczenia skupia widok tylko na tej tabeli.  
Skrót uwzględnia zaznaczone tabele, pomija notatki i nic nie robi, gdy żadna tabela nie jest zaznaczona.  
Zaznaczona [grupa tabel](./table-groups.md) nie ma tu znaczenia, zarówno dla skrótu, jak i dla pozycji menu: jej tabele są uwzględniane tylko wtedy, gdy same są zaznaczone, co robi pozycja `Select tables` w menu grupy.  
To, co pokazuje zawężony widok i jak wrócić do całego diagramu, opisano na stronie [Wizualizacja](./visualization.md#focusing-on-tables), a to, jak cofać się i przechodzić do przodu po tym, co tryb Przepływ pokazywał wcześniej – w sekcji [Poprzednia i następna tabela](./visualization.md#previous-table-and-next-table).

## Indeksy {#indexes}

Indeksy definiuje się na karcie `Indexes` panelu właściwości tabeli i są one uwzględniane w eksportowanym Schemacie SQL.

Lewa strona zawiera klucze i indeksy tabeli w dwóch grupach.  
Grupa `Keys`, widoczna, gdy tabela ma jakiekolwiek klucze, zawiera klucze deklarowane przez jej kolumny: klucz `PK_<table name>` obejmujący kolumny oznaczone jako PK, a następnie klucz `UQ_<table name>_<column name>` dla każdej kolumny oznaczonej jako unikatowa, w kolejności kolumn. Nazwy są nazwami fizycznymi, które zapisuje Schemat SQL wybranej bazy danych, niezależnie od Widoku nazw, więc przy ustawieniu `Bracket` na `None` tabela kwalifikowana schematem, taka jak `sales.users`, pokazuje `PK_users` we wszystkich bazach danych oprócz Databricks i Snowflake – zobacz sekcję [Nazwy tabel kwalifikowane schematem](./schema-sql.md#schema-qualified-table-names). Każdy klucz ma oznaczenie `PK` lub `UQ` i ikonę kłódki. Są one tutaj tylko do odczytu i zmieniają się wyłącznie wraz z flagami kolumn [PK](./table-editing.md#column-primary-key) i [Unikatowość](./table-editing.md#not-null-unique-auto-increment).  
Grupa `Indexes` zawiera indeksy tabeli w kolejności ich dodania. Każdy indeks ma przełącznik `UQ`, który czyni go unikatowym, pole nazwy i przycisk `x`, który go usuwa. Indeks będący [kluczem alternatywnym](#alternate-keys) pokazuje też swój numer, na przykład `AK1`. Dodaj indeks przyciskiem `Add Index` na dole listy.

Prawa strona zawiera kolumny tabeli pod nagłówkiem `Columns`, każdą z polem wyboru. Każdy wiersz pokazuje te same komórki co wiersz kolumny na kanwie, zgodnie z kolejnością kolumn, Opcjami widoku i [Widokiem nazw](./logical-names.md#beyond-the-canvas). Nic nie da się edytować, dopóki po lewej nie zostanie wybrany indeks.  
Zaznacz kolumnę, aby dodać ją do wybranego indeksu, a odznacz ją, aby ją usunąć. Wybranie klucza pokazuje jego kolumny jako zaznaczone, ale pola wyboru pozostają nieaktywne.  
Kolumny wybranego indeksu są wymienione niżej pod nagłówkiem `Index order`, każda nazwana tak, jak nazywa ją Widok nazw, a w widoku `Both Names` z nazwą fizyczną w nawiasie po nazwie logicznej, na przykład `Member Number (member_no)`. Przeciągnij je za uchwyt, aby zmienić ich kolejność, i kliknij etykietę `ASC` lub `DESC` w wierszu, aby odwrócić kierunek sortowania. W kluczu alternatywnym każdy wiersz kończy się oznaczeniem `AK<n>.<m>`. Lista pokazuje naraz trzy wiersze, a pozostałe są dostępne po przewinięciu.

W edytorze z atrybutem `readonly` wybranie klucza lub indeksu nadal pokazuje jego kolumny, ale nie ma przycisków `Add Index` ani `x` i nic innego na karcie nie da się zmienić.

[Eksplorator](./explorer.md#the-tree) wymienia indeksy każdej tabeli w jej folderze `Indexes`, a wybranie tam indeksu przechodzi do jego tabeli. Jego wyszukiwanie znajduje też nazwy indeksów i może je zmieniać – zobacz sekcję [Co jest przeszukiwane](./find-and-replace.md#what-it-searches).

![Otwieranie Właściwości tabeli dla orders, gdzie karta Indexes wymienia klucze PK i UQ nad indeksami, a potem dodawanie indeksu obejmującego member_id i ordered_at DESC i odczytywanie go na karcie Schema SQL](/img/demo-table-properties.webp)

## Klucze alternatywne {#alternate-keys}

Klucz alternatywny to indeks unikatowy obejmujący dwie lub więcej kolumn: indeks na karcie `Indexes` z włączonym przełącznikiem `UQ` i co najmniej dwiema zaznaczonymi kolumnami tabeli.  
Indeks unikatowy obejmujący jedną kolumnę nie wyraża nic więcej niż flaga Unikatowość tej kolumny, więc nie jest kluczem alternatywnym, podobnie jak zwykły indeks, klucz podstawowy czy kolumna oznaczona jako unikatowa.

Gdy w [opcjach widoku](#table-view-options) włączona jest opcja `Alternate Key`, diagram oznacza kolumny każdego klucza alternatywnego tak, jak zapisują je erwin i IDEF1X: `AK1.1`, `AK1.2` i tak dalej. Opcja jest domyślnie wyłączona.

Klucze są numerowane według położenia ich kolumn w tabeli, a nie według kolejności dodania indeksów. Kluczem `AK1` jest ten, którego pierwsza kolumna w kolejności `Index order` znajduje się w tabeli najwyżej. Przy równości decyduje kolejna kolumna każdego klucza, a klucz będący początkową częścią dłuższego klucza poprzedza go.  
Przeniesienie kolumny w obrębie tabeli lub zmiana kolejności `Index order` klucza może zmienić numerację kluczy. Cofnięcie usunięcia klucza przywraca mu jego numer, a każdy współpracownik widzi te same numery.

Każda kolumna klucza jest oznaczona jako `AK<n>.<m>`, gdzie `n` to numer klucza, a `m` to pozycja kolumny w kolejności `Index order` klucza. Kolumna należąca do kilku kluczy ma wszystkie oznaczenia, połączone przecinkiem.  
Na przykład w tabeli z kolumnami `a`, `b` i `c` indeksy unikatowe obejmujące (`c`, `a`) i (`b`, `a`) stają się kluczami `AK1` = (`b`, `a`) i `AK2` = (`c`, `a`), ponieważ `b` znajduje się wyżej niż `c`. Zatem kolumna `b` ma oznaczenie `AK1.1`, kolumna `c` – `AK2.1`, a kolumna `a` – `AK1.2,AK2.2`.

Oznaczenie jest rysowane na końcu wiersza, za komórką, którą [kolejność kolumn](./settings.md#adjusting-column-order) umieszcza jako ostatnią. Nie jest komórką, więc nigdy nie otrzymuje fokusu, nie jest edytowane ani kopiowane – zobacz stronę [Edycja tabel](./table-editing.md).  
Oznaczenie AK może mieć także kolumna klucza podstawowego lub klucza obcego, ponieważ oznaczenie niczego nie zastępuje: ikona klucza na początku wiersza nadal pokazuje PK i FK, a komórka Unikatowość zachowuje własne oznaczenie `UQ`.  
Tabela, która ma klucz alternatywny, rezerwuje za ostatnią komórką każdego wiersza miejsce na swoje najdłuższe oznaczenie; tabela bez takiego klucza zachowuje swoją szerokość.  
Oznaczenia są widoczne na kanwie ERD, gdzie tabela zwinięta do nazwy przy powiększeniu `70%` i mniejszym nie pokazuje żadnego, oraz w [eksporcie obrazu](./file-import-export.md#image), który rysuje każdą tabelę w całości niezależnie od powiększenia. Pokazuje je także [podgląd po najechaniu](./visualization.md#hover-preview) karty Wizualizacja w trybie `Graph`; kafelki w trybie `Flow` nigdy ich nie pokazują.

Karta `Indexes` pokazuje numery niezależnie od tego, czy opcja jest włączona – zobacz sekcję [Indeksy](#indexes).

## Automatyczny układ {#auto-layout}

Automatycznie rozmieszcza wszystkie tabele na kanwie.  
Otwórz `Auto Layout` z menu kontekstowego kanwy lub z szybkiego wyszukiwania i wybierz jeden z czterech układów:

| Układ | Co rysuje |
| --- | --- |
| `Force` | Symulacja: relacje przyciągają tabele do siebie, sąsiednie tabele się odpychają, a nakładające się tabele rozsuwają się. |
| `Flow` | Od lewej do prawej wzdłuż relacji, przy czym każdy łącznik dostaje własny punkt styku z tabelą. Układ stara się ograniczyć liczbę skrzyżowań, ale może pozostawić niektóre, których inny układ by uniknął. |
| `Tree - vertical` | Warstwy w dół: tabela nadrzędna znajduje się nad tabelami, które mają klucz obcy odwołujący się do niej. |
| `Tree - horizontal` | Te same warstwy, ułożone od lewej do prawej. |

Układ `Force` otwiera podgląd na czas stabilizowania się układu, z przyciskami `Apply` i `Cancel` w wyświetlanym komunikacie.  
Kadr podglądu obejmuje diagram w stanie z chwili uruchomienia układu, więc podczas stabilizowania się układu tabele mogą wyjść poza kadr. Podgląd jest rysowany przy powiększeniu `70%` lub mniejszym, więc jego tabele są zwinięte do nazwy i krawędzi z kolorem. Podgląd otwiera się w bieżącym Widoku nazw, niezależnie od widoku zachowanego w pliku – zobacz sekcję [Poza kanwą](./logical-names.md#beyond-the-canvas).  
Przycisk `Apply` zachowuje położenia z danej chwili, a gdy układ się ustabilizuje, zostaje zastosowany samoczynnie. Przycisk `Cancel` lub klawisz `Escape` pozostawia diagram bez zmian.

Pozostałe trzy są obliczane za jednym razem, poza wątkiem głównym, więc nie ma czego oglądać: podczas obliczania układu wyświetla się komunikat, a gotowe rozmieszczenie jest wyśrodkowane na obszarze, który diagram już zajmuje. Przycisk `Cancel` lub klawisz `Escape` porzuca układ, na który już nie czekasz, a w hoście, który nie uruchamia żadnego shared workera, układ kończy się komunikatem `Could not place tables` – zobacz sekcję [Web Workers](../../api/installation.md#web-workers). Tak samo kończy się układ, który nie wróci w ciągu 60 sekund.

Niezależnie od wybranego układu przenoszone są tabele i grupy tabel, a notatki pozostają na miejscu. Tabele są rozmieszczane z szerokościami, jakie mają w bieżącym Widoku nazw. Relacja zwrotna jest ignorowana, a kilka relacji między tymi samymi dwiema tabelami liczy się jako jedna.  
Każdy układ utrzymuje tabele każdej grupy razem, niezależnie od tego, czy grupy są widoczne, i dopasowuje każdą grupę zawierającą tabele tak, aby je obejmowała – zobacz stronę [Grupy tabel](./table-groups.md#auto-layout).  
Wynik trafia do historii jako jeden wpis, więc jedno cofnięcie przywraca każdą tabelę i grupę na jej poprzednie miejsce.

![Porządkowanie stosu tabel automatycznym układem Flow z menu kontekstowego kanwy, który ustawia je od lewej do prawej wzdłuż ich relacji](/img/demo-automatic-table-placement.webp)

## Bazy danych {#databases}

Obsługiwane bazy danych to:

- Databricks
- MSSQL
- MariaDB
- MySQL
- Oracle
- PostgreSQL
- Snowflake
- SQLite

Wybierz jedną z nich w pozycji `Database` w menu kontekstowym kanwy, w panelu opcji lub menu kontekstowym kart Schemat SQL i Generator kodu albo w szybkim wyszukiwaniu. Wszystkie te miejsca zmieniają to samo ustawienie.

Te opcje określają składnię Schematu SQL używaną przy eksporcie, autouzupełnianie typu danych oraz typy, jakie otrzymują wygenerowany kod i importowane schematy.  
Decydują, które wybory `Statements` i `Header` może zapisać karta [Schemat SQL](./schema-sql.md#options-panel). Wybór, którego baza danych nie obsługuje, pozostaje w panelu opcji jako przyciemniony, a kod SQL korzysta z najbliższego obsługiwanego.  
Decydują także, które akcje ON DELETE i ON UPDATE zapisują Schemat SQL i formaty docelowe ORM Generatora kodu oraz które z nich menu relacji oznaczają jako `not in <database>` – zobacz sekcje [ON DELETE i ON UPDATE](./relationship-editing.md#on-delete-and-on-update) i [Generator kodu](./code-generator.md#database).  
Import Schematu SQL zachowuje typ danych kolumny wraz z listą argumentów niezależnie od tego, czy edytor ma go na swojej liście, na przykład `TIMESTAMP WITH TIME ZONE`, `public.mood` lub `integer[]` – zobacz sekcję [Typy danych](./file-import-export.md#data-types). Autouzupełnianie typu danych podpowiada tylko typy z listy wybranej bazy danych.

![Przełączanie bazy danych na PostgreSQL, a potem wybór typu PostgreSQL w autouzupełnianiu](/img/demo-database.webp)

![Autouzupełnianie typu danych z dopasowaniem rozmytym, obsługiwane klawiszami strzałek i zatwierdzane klawiszem Right, Tab lub Enter](/img/demo-data-type-autocomplete.webp)

## Pasek narzędzi kanwy {#canvas-toolbar}

Nad środkiem dolnej krawędzi kanwy unosi się mały pasek narzędzi, który zawiera od lewej do prawej narzędzia działające na samą kanwę i polecenia dodające do niej elementy:

- Rączka i wskaźnik. Domyślnie aktywny jest wskaźnik; Rączka zmienia każde przeciągnięcie w przesuwanie widoku, zarówno nad tabelami, jak i nad pustym obszarem. Klawisz `Space` przełącza między nimi. Gdy włączony jest tryb rysowania grupy [`New Table Group`](./table-groups.md#drawing-a-group), zamiast któregokolwiek z nich wyróżniony jest przycisk `New Table Group`, a kliknięcie któregoś z nich, naciśnięcie klawisza `Space` lub wybór notacji relacji kończy rysowanie bez dodawania grupy.
- `New Table`, `New Memo` i `New Table Group`. Przycisk `New Table` dodaje tabelę tak jak `Alt + N`, a przycisk `New Memo` dodaje notatkę tak jak `Alt + M`. Przycisk `New Table Group` włącza [rysowanie grupy](./table-groups.md#drawing-a-group) tak jak `Alt + G` i wyłącza Rączkę; drugie kliknięcie, podobnie jak drugie naciśnięcie `Alt + G`, kończy rysowanie bez dodawania grupy. Przycisk `New Memo` nie jest dostępny, gdy View Option → `Memos` ukrywa notatki, a przycisk `New Table Group`, gdy View Option → `Table Groups` ukrywa grupy. Edytor z atrybutem `readonly` nie pokazuje żadnego z tych trzech przycisków.
- Powiększenie: `Zoom out`, bieżące powiększenie w procentach i `Zoom in`. Oba przyciski zmieniają powiększenie skokowo tak samo jak skróty powiększenia, a kliknięcie wartości procentowej przywraca je do `100%`.
- Cztery notacje relacji, te same cztery, od których zaczynasz tworzenie relacji – zobacz stronę [Rozpoczęcie edycji](./editing-start.md). Wybranie jednej z nich przełącza z powrotem na wskaźnik, ponieważ relację rysuje się, klikając dwie tabele.
- `Name View`, przycisk ze strzałką w dół, który podaje bieżący widok: `Physical Names`, `Logical Names` lub `Both Names`. Ma stałą szerokość niezależnie od podawanego widoku, więc przełączenie nigdy nie przesuwa paska narzędzi. Kliknięcie otwiera nad paskiem narzędzi listę tych trzech widoków z zaznaczonym bieżącym widokiem. Wybranie jednego z nich przełącza na ten widok i zamyka listę; drugie kliknięcie przycisku, naciśnięcie w dowolnym innym miejscu lub klawisz `Escape` zamyka listę bez przełączania. Edytor z atrybutem `readonly` również go pokazuje. To, co wyświetla każdy widok, opisano w sekcji [Widok nazw](./logical-names.md#name-view), a to, czy przełączenie jest zapisywane – w sekcji [Przełączanie widoku](./logical-names.md#switching-the-view).
- Tryb zen, `Alt + Z`, który ukrywa wszystko oprócz kanwy i tego paska narzędzi. Ponowne naciśnięcie `Alt + Z` lub kliknięcie przycisku przywraca resztę. Otwarty Eksplorator jest ukrywany razem z resztą, bez zamykania, i wraca razem z nią. Nadal można go otworzyć w trybie zen – zobacz sekcję [Kiedy Eksplorator ustępuje miejsca](./explorer.md#when-it-stands-aside).
- Kompas `Go to content`, który pojawia się na końcu paska narzędzi tylko wtedy, gdy na ekranie nie ma żadnej tabeli, widocznej notatki ani widocznej grupy tabel – zobacz sekcję [Poruszanie się po kanwie](#getting-around-the-canvas).

Każdy przycisk, który ma skrót klawiaturowy, podaje go w podpowiedzi, na przykład `New Table (Alt + N)` (Windows/Linux) lub `New Table (⌥ + N)` (Mac).  
Pasek narzędzi ustępuje miejsca na czas otwarcia podglądu Automatycznego układu `Force`, właściwości tabeli, podróży w czasie lub podglądu różnic i wraca po ich zamknięciu.

![Dodawanie tabeli i notatki z paska narzędzi, włączanie i wyłączanie New Table Group, przesuwanie widoku Rączką, skokowa zmiana powiększenia oraz włączanie i wyłączanie trybu zen za pomocą ⌥ + Z](/img/demo-canvas-toolbar.webp)

## Powiększanie i pomniejszanie {#zoom-inout}

Powiększenie zmienia się skrótem `Ctrl + Wheel` (Windows/Linux) lub `⌘ + Wheel` (Mac). Samo kółko myszy przesuwa widok kanwy.  
Powiększać można też gestem szczypania na gładziku, względem punktu, w którym go wykonujesz, a także dwoma palcami na ekranie dotykowym, które przy ruchu również przesuwają widok.  
Skróty klawiaturowe: `Ctrl + Plus` (Windows/Linux) lub `⌘ + Plus` (Mac), `Ctrl + Minus` (Windows/Linux) lub `⌘ + Minus` (Mac)  
Skrót `Ctrl + 0` (Windows/Linux) lub `⌘ + 0` (Mac) od razu przywraca powiększenie `100%`, zachowując środek ekranu w miejscu.

Przyciski `Zoom out` i `Zoom in` na [pasku narzędzi kanwy](#canvas-toolbar) zmieniają powiększenie skokowo, tak jak skróty `Minus` i `Plus`: każde naciśnięcie zmienia je o 4 punkty procentowe, zachowując środek ekranu w miejscu. Wartość procentowa między nimi pokazuje bieżące powiększenie, a kliknięcie jej od razu przywraca `100%`, tak jak `Ctrl + 0` (Windows/Linux) lub `⌘ + 0` (Mac).

Powiększenie mieści się w zakresie od `10%` do `150%`.  
Przy powiększeniu `70%` i mniejszym tabele zwijają się do nazwy i krawędzi z kolorem, a edycja komórek, skróty komórek oraz kopiowanie i wklejanie przestają działać, dopóki ponownie nie powiększysz widoku. Nazwa wyświetlana przez zwiniętą tabelę jest zgodna z Widokiem nazw – zobacz sekcję [Widok nazw](./logical-names.md#name-view).

Te same trzy skróty zmieniają też powiększenie na karcie Wizualizacja, zarówno w trybie `Graph`, jak i `Flow`, każdy tryb we własnym zakresie – zobacz stronę [Wizualizacja](./visualization.md#toolbar).

![Pomniejszanie za pomocą ⌘ + Wheel, aż tabele zwiną się do nazwy, a potem skokowy powrót za pomocą ⌘ + Plus, ⌘ + Minus i ⌘ + 0](/img/demo-zoom.webp)

## Poruszanie się po kanwie {#getting-around-the-canvas}

Kanwa nie ma krawędzi ani rozmiaru do ustawienia. Tabele i notatki znajdują się tam, gdzie je umieścisz, a wszystko, co opisano poniżej, dotyczy diagramu, a nie strony o stałym rozmiarze.

Przeciągnij pusty obszar kanwy, aby przesunąć widok, albo przełącz się na narzędzie Rączka klawiszem `Space` i przeciągnij w dowolnym miejscu, także nad tabelą. Widok przesuwa też kółko myszy, a `Shift + Wheel` przesuwa go w poziomie.  
Wnętrze [grupy tabel](./table-groups.md#selecting-groups), czyli obszar pod jej paskiem tytułu, jest dla lewego przycisku pustą kanwą: przeciągnięcie go przesuwa widok, `Ctrl + drag` (Windows/Linux) lub `⌘ + drag` (Mac) rysuje ramkę zaznaczenia, a kliknięcie anuluje zaznaczenie.  
Przesuwanie widoku nie ma ograniczeń: kółko myszy, przeciąganie i narzędzie Rączka przenoszą widok tak daleko, jak go przesuniesz, poza tabele z każdej strony.

Przeciągnij środkowym przyciskiem myszy (naciśnij kółko), aby przesunąć widok z dowolnego miejsca kanwy, zarówno przy wskaźniku, jak i przy Rączce. Działa to nawet wtedy, gdy naciśnięcie trafi w tabelę, notatkę, komórkę, ikonę lub relację.  
Przeciąganie środkowym przyciskiem niczego nie zaznacza, nie przenosi ani nie klika i zachowuje zaznaczenie. Zamyka otwarte menu kontekstowe i selektor kolorów, a przeglądarka nie uruchamia własnego przewijania ani wklejania środkowym przyciskiem.  
Naciśnięcie środkowym przyciskiem na paskach przewijania, minimapie, pasku narzędzi kanwy lub otwartym edytorze komórki albo notatki nie przesuwa widoku.

Minimapa w prawym górnym rogu przedstawia diagram z zapasem miejsca o wielkości ekranu z każdej strony, czyli zasięg pasków przewijania, zaokrąglony na zewnątrz do grubej siatki, więc im bardziej pomniejszasz widok, tym mniejszy jest na niej diagram. Kliknij ją, aby przenieść widok w to miejsce, albo przeciągnij prostokąt obszaru widoku, aby przesunąć widok. W miarę pomniejszania prostokąt obszaru widoku rośnie i obejmuje większą część mapy.  
Minimapa rysuje każdą tabelę w jej kolorze, a każdą widoczną grupę tabel jako ramkę w kolorze grupy za jej tabelami.  
Paski przewijania wzdłuż prawej i dolnej krawędzi opisują ten sam zakres ruchu, który rozciąga się od położenia, w którym diagram znajduje się tuż za jedną krawędzią ekranu, do położenia tuż za drugą, więc jest co najmniej o ekran dłuższy niż narysowany diagram, a jeszcze dłuższy, gdy widok znajduje się poza nim. Poza trybem zen oba paski przewijania są widoczne zawsze, gdy dokument zawiera tabelę, widoczną notatkę lub widoczną grupę tabel, nawet jeśli wszystko mieści się na ekranie. Dokument bez żadnego z tych elementów, na przykład taki, którego jedyne notatki są ukryte za pomocą View Option → `Memos`, nie pokazuje żadnego z pasków ani minimapy.  
Przeciąganie uchwytu paska przewijania lub prostokąta obszaru widoku na minimapie to jedyne przesuwanie widoku, które ma granicę: nie sięga dalej niż do tabel tuż poza ekranem albo do miejsca, w którym zaczęło się przeciąganie, jeśli było ono dalej.

Jeśli po przesunięciu widoku na ekranie nie ma żadnej tabeli, widocznej notatki ani widocznej grupy tabel, na końcu [paska narzędzi kanwy](#canvas-toolbar) pojawia się kompas `Go to content` ze strzałką wskazującą najbliższy z tych elementów i jego odległością. Kliknij go, aby wyśrodkować ten element bez zmiany powiększenia.

![Przesuwanie widoku przez przeciąganie pustej kanwy, kółkiem myszy, przeciąganiem środkowym przyciskiem nad tabelą i z minimapy, a potem Shift + wheel poza zawartość i powrót za kompasem Go to content](/img/demo-canvas-navigation.webp)

### Dokąd prowadzi przejście {#where-a-jump-lands}

Każde przejście, które prowadzi do czegoś na kanwie, przesuwa widok według jednej reguły: wyniki `#`, `@` i `:` funkcji [Szybkie wyszukiwanie](./quick-search.md#searching-the-diagram), wiersze [Eksploratora](./explorer.md#going-to-a-row) i dopasowania jego wyszukiwania [Znajdź i zamień](./find-and-replace.md#going-to-a-match), wiersze listy [Podglądu różnic](#going-to-a-change), [przycisk kafelka](./visualization.md#card-buttons) z łączem zewnętrznym w trybie Przepływ, kontrola wskazująca tabelę lub kolumnę w arkuszu [Kontrole](./dictionary.md#the-checks-sheet) na karcie Słownik oraz przejście do miejsca, w którym operacja [Importuj i dodaj](./file-import-export.md#import-and-add) umieszcza elementy. Każda z tych sekcji mówi, co zaznacza przejście; ta mówi, dokąd przesuwa się widok.

Przejście nigdy nie zmienia powiększenia i wykonuje co najwyżej jedno przewinięcie. Z innej karty najpierw przełącza na kartę ERD.  
Mierzy kanwę tak, jak jest widoczna: poniżej górnego paska narzędzi, a w trybie zen na całej wysokości, oraz na prawo od otwartego Eksploratora, który zwęża kanwę, a nie ją zasłania.

Kierunki poziomy i pionowy są oceniane osobno, a kierunek, w którym cel jest już dobrze widoczny, pozostaje dokładnie bez zmian:

- Cel nie dłuższy niż połowa kanwy w danym kierunku pozostaje na miejscu, dopóki jego środek leży w środkowej połowie kanwy, między jedną czwartą a trzema czwartymi jej szerokości lub wysokości. W przeciwnym razie jego środek zostaje przesunięty na środek kanwy.
- Dłuższy cel, który nadal mieści się z zapasem `40px` na każdym końcu, pozostaje na miejscu, dopóki jest w całości widoczny. W przeciwnym razie w poziomie zostaje wyśrodkowany, a w pionie jego górna krawędź zostaje przesunięta `40px` poniżej górnej krawędzi kanwy.
- Cel jeszcze dłuższy pozostaje na miejscu, dopóki jest w całości widoczny lub, gdy jest dłuższy niż kanwa, dopóki widoczna jest jego kluczowa część, opisana poniżej. W przeciwnym razie zostaje wyśrodkowany, jeśli się mieści, a jeśli nie, umieszczony jak najbliżej środka tak, aby oba końce jego kluczowej części znajdowały się co najmniej `40px` wewnątrz kanwy; jeśli kluczowa część jest na to za długa, jej początek znajduje się `40px` wewnątrz kanwy.

Zatem mała tabela przy lewej krawędzi kanwy, w połowie jej wysokości, przesuwa się tylko w poziomie.

Co przejście pokazuje w widoku i jaka kluczowa część musi być widoczna, gdy całość się nie mieści:

- Tabela: cała tabela, z paskiem nazwy u góry jako kluczową częścią albo z komórką komentarza przy dopasowaniu w komentarzu tabeli, gdy View Option → `Table Comment` pokazuje komentarze. Przy powiększeniu `70%` i mniejszym, gdy tabele są zwinięte do nazwy, kluczową częścią jest nazwa na środku prostokąta tabeli.
- Kolumna: jej wiersz, z komórką, do której prowadzi przejście, jako kluczową częścią: z nazwą, z nazwą logiczną przy dopasowaniu w nazwie logicznej lub kontroli dotyczącej nazwy logicznej, z komórką domeny przy kontroli dotyczącej jej domeny albo z komentarzem zawierającym dopasowanie, gdy View Option → `Column Comment` pokazuje komentarze. Gdy wiersz nie wyświetla takiej komórki, przejście prowadzi do komórki wyświetlanej w jej miejscu: do nazwy logicznej zamiast nazwy fizycznej w widoku `Logical Names`, do nazwy fizycznej zamiast nazwy logicznej w widoku `Physical Names` oraz do komórki typu zamiast komórki domeny, gdy pozycja View Option → `Domain` jest wyłączona, albo do całego wiersza, gdy wyłączona jest też pozycja `DataType`. Przy powiększeniu `70%` i mniejszym kolumna pokazuje swoją tabelę według reguły dla tabel.
- Komórka zbyt szeroka, aby pokazać ją w całości, na przykład długi komentarz: kluczową częścią jest dopasowany w niej tekst. Gdy przejście prowadzi do komórki wyświetlanej zamiast tej, która zawiera dopasowanie, na przykład do nazwy fizycznej przy dopasowaniu w nazwie logicznej w widoku `Physical Names`, kluczową częścią nie jest tekst.
- Relacja: prostokąt obejmujący jej dwie tabele, z tabelą podrzędną jako kluczową częścią.
- Grupa tabel: jej ramka, z paskiem tytułu jako kluczową częścią.
- Notatka lub blok umieszczony przez operację Importuj i dodaj: całość.

Gdy żaden kierunek nie wymaga przesunięcia, nie ma przewinięcia, więc dwukrotne przejście z rzędu do tego samego miejsca za drugim razem niczego nie przesuwa. Przejście, które przewija kanwę, zapisuje przewinięcie w [historii cofania](./undo-redo.md#what-the-history-records) tak jak każdą inną zmianę położenia widoku, a przejście, które niczego nie przesuwa, nie zostawia niczego do cofnięcia. W przypadku operacji Importuj i dodaj przewinięcie należy do tego samego kroku co dodanie. Wiersz listy Podglądu różnic przesuwa tylko strony widoku, które są tylko do odczytu, więc niczego nie zapisuje.  
Żadne przejście nie rozpoczyna ani nie kończy rysowania relacji. Kompas `Go to content` nie jest przejściem: wyśrodkowuje to, na co wskazuje.

## Podgląd różnic {#diff-viewer}

Możesz porównać wcześniej zapisane dokumenty z bieżącym dokumentem.  
Wybierz `Diff Viewer` w menu kontekstowym kanwy i wskaż wcześniej wyeksportowany dokument `.json`.

Widok otwiera się nad kanwą: po lewej to, co się zmieniło, a obok zapisany i bieżący dokument, jeden przy drugim.  
Bieżący dokument jest porównywany w stanie z chwili otwarcia widoku; późniejsze zmiany, w tym zmiany współpracownika, do widoku nie docierają. Obie strony otwierają się w bieżącym Widoku nazw i w nim pozostają, niezależnie od widoku zachowanego w którymkolwiek z plików – zobacz sekcję [Poza kanwą](./logical-names.md#beyond-the-canvas). Otwarty [Eksplorator](./explorer.md#when-it-stands-aside) jest ukryty, dopóki widok jest otwarty, więc widok zajmuje całą szerokość edytora.  
Widok każdej strony przesuwa się kółkiem myszy, przeciąganiem pustego obszaru lub wnętrza grupy tabel albo przeciąganiem środkowym przyciskiem w dowolnym jej miejscu, a powiększenie zmienia się skrótem `Ctrl + Wheel` (Windows/Linux), `⌘ + Wheel` (Mac) lub gestem szczypania. Przy powiększeniu `70%` i mniejszym jej tabele zwijają się tak jak na kanwie – zobacz sekcję [Oznaczenia po obu stronach](#marks-on-the-two-sides).  
Obie strony są tylko do odczytu, więc nic w dokumencie nie zostaje zmienione. Każda ma własne zaznaczenie, a kliknięcie tam tabeli zaznacza ją tylko po tej stronie.  
Zamknij widok przyciskiem `Close` w komunikacie `Diff Viewer`, który pojawia się przy jego otwarciu, lub klawiszem `Escape`.

![Otwieranie Podglądu różnic dla zapisanego pliku .json, klikanie w jego drzewie wierszy oznaczonych A, M, D i R, filtrowanie według nazwy i zamykanie go](/img/demo-diff-viewer.webp)

### Co jest porównywane {#what-is-compared}

Porównywane są tabele, kolumny, indeksy, klucze obce, notatki i grupy tabel.  
Każdy element jest najpierw łączony w parę według identyfikatora, więc przy porównaniu z wcześniejszą wersją tego samego pliku, która zachowuje identyfikatory, tabela, kolumna, indeks lub grupa tabel o zmienionej nazwie nadal jest jednym elementem, wymienionym jako element o zmienionej nazwie.  
Pozostałe elementy są łączone w pary jeden do jednego według tego, co zachowują: tabela lub grupa tabel według nazwy z uwzględnieniem wielkości liter; kolumna lub indeks według swojej tabeli i nazwy; klucz obcy według swoich dwóch tabel i par kolumn; notatka według tekstu, a potem położenia. Indeks bez nazwy jest łączony w parę według kolumn, ich kolejności i kierunku oraz tego, czy jest unikatowy, a grupa tabel bez nazwy według największej liczby wspólnych tabel.  
Dlatego przy porównaniu z plikiem z innego źródła, na przykład z diagramem odtworzonym przez import kodu SQL, tabela o zmienionej nazwie jest pokazywana jako jedna usunięta i jedna dodana.

Co liczy się jako zmiana:

- Tabela: nazwa, komentarz, grupa tabel, położenie i kolor.
- Kolumna: nazwa, komentarz, typ danych, wartość domyślna, Autoinkrementacja, klucz podstawowy, Unikatowość, NOT NULL i pozycja w tabeli. Za przeniesione uznaje się tylko kolumny spoza kolejności wspólnej dla obu dokumentów, więc dodanie, usunięcie lub przeniesienie jednej kolumny nie powoduje oznaczenia pozostałych.
- Indeks: nazwa, UNIQUE i kolumny wraz z ich kolejnością i kierunkiem.
- Klucz obcy: pary kolumn, typ relacji oraz akcje ON DELETE i ON UPDATE.
- Notatka: tekst, położenie, rozmiar i kolor.
- Grupa tabel: nazwa, zawarte w niej tabele, kolor, położenie i rozmiar.

Dlatego tabela, notatka lub grupa, którą tylko przeniesiono albo której zmieniono rozmiar lub kolor, liczy się jako zmieniona. Położenia i rozmiary są porównywane w pełnych pikselach, a kolejność warstw i miejsce, w którym łącznik styka się z tabelą, nigdy nie mają znaczenia.  
Nazwy logiczne, powiązania z domeną oraz słowa, terminy i domeny z karty [Słownik](./dictionary.md) nie są porównywane, więc sama ich zmiana nie jest ani wymieniana, ani oznaczana. Liczy się natomiast typ danych zmieniony przez domenę – jako zmiana typu danych kolumny.

### Drzewo zmian {#the-change-tree}

Lista po lewej jest rysowana jak [drzewo Eksploratora](./explorer.md#the-tree) i zawiera tylko to, co się zmieniło: foldery `Tables`, `Table Groups` i `Memos`, każdy widoczny tylko wtedy, gdy zawiera wiersz, a pod tabelą jej własne foldery `Columns`, `Indexes` i `Foreign Keys`. Klucz obcy jest wymieniony pod swoją tabelą podrzędną, a dodana lub usunięta tabela nie ma w środku żadnych wierszy.  
Każdy folder pokazuje, ile zawiera wierszy, a każdy folder i każda tabela są na początku rozwinięte.  
Wiersz tabeli lub kolumny jest nazwany zgodnie z Widokiem nazw, w którym otworzyły się strony. W widoku `Both Names` pokazuje nazwę logiczną, a po niej wyciszoną nazwę fizyczną, a w usuniętym wierszu wyciszona nazwa jest przekreślona razem z resztą. Tabele i grupy tabel są uporządkowane według nazwy bez uwzględniania wielkości liter, niezależnie od widoku. Notatki oraz kolumny, indeksy i klucze obce tabeli zachowują kolejność bieżącego dokumentu, a usunięty element wraca na swoje dawne miejsce. Wiersz notatki pokazuje pierwszą linię notatki, a wiersz klucza obcego pokazuje jego kolumny w tabeli podrzędnej, a potem `→` z tabelą nadrzędną i jej kolumnami, na przykład `user_id → users(id)`. Pusta nazwa jest wyświetlana jako `unnamed` kursywą.

Każdy wiersz kończy się literą, a wiersz oznaczony literą `A`, `D`, `M` lub `R` ma nazwę w kolorze tej litery:

- `A`, dodany, na zielono: tylko w bieżącym dokumencie.
- `D`, usunięty, na czerwono i przekreślony: tylko w zapisanym dokumencie.
- `M`, zmieniony, w kolorze bursztynowym: w obu, ze zmianami.
- `R`, o zmienionej nazwie, na niebiesko: w obu, z nową nazwą. Zmiana nazwy ma pierwszeństwo przed każdą inną zmianą, którą podpowiedź nadal wymienia.
- `~`, w kolorze bursztynowym, kończy każdy folder i tabelę wymienioną tylko z powodu zmian w jej wnętrzu; ich nazwy zachowują zwykły kolor.

Najedź wskaźnikiem na nazwę wiersza, aby zobaczyć podpowiedź: status `Added`, `Deleted`, `Modified`, `Renamed` lub `Changed inside`, a potem po jednej linii na każdą zmianę, na przykład `Name: users → members` lub `NN: ✗ → ✓`. Tekst jest przytaczany w postaci pierwszej linii, obciętej po 40 znakach, a pusta wartość jest wyświetlana jako `—`. Podpowiedź dodanego lub usuniętego elementu zawiera tylko jego status.

Pole `Filter by name` nad drzewem zostawia wiersze, których bieżąca lub zapisana nazwa albo bieżąca lub zapisana nazwa logiczna zawiera wpisany tekst, bez uwzględniania wielkości liter, niezależnie od Widoku nazw. Tabela, której nazwa pasuje, zachowuje wszystkie swoje wiersze, a tabela, której nazwa nie pasuje, zachowuje tylko pasujące wiersze. Filtr, który niczego nie dopasowuje, pozostawia drzewo puste.  
Gdy oba dokumenty w ogóle się nie różnią, drzewo pokazuje komunikat `No changes`.

Przeciągnij prawą krawędź drzewa, aby je poszerzyć lub zwęzić, od `200px` do `480px`, a kliknij krawędź dwukrotnie, aby przywrócić wartość `260px`. Każde porównanie otwiera się z wartością `260px`, a obie strony dzielą resztę szerokości po równo.  
Klawiatura pozwala poruszać się po drzewie tak samo jak po drzewie Eksploratora – zobacz sekcję [Klawisze w Eksploratorze](./explorer.md#keys-in-the-explorer) – ale tutaj klawisz `Escape`, w drzewie lub w polu `Filter by name`, zamyka widok.

### Przechodzenie do zmiany {#going-to-a-change}

Kliknij wiersz albo naciśnij `Enter` lub `Space`, gdy ma on fokus klawiatury, aby przejść do jego elementu po każdej stronie, która go zawiera: do dodanego elementu tylko po stronie bieżącego dokumentu, do usuniętego tylko po stronie zapisanego dokumentu, a do elementu obecnego w obu dokumentach – po obu stronach. Wiersz folderu tylko zwija lub rozwija folder, podobnie jak strzałka na początku wiersza tabeli.

- Wiersz tabeli, kolumny lub indeksu zaznacza tylko tabelę.
- Wiersz klucza obcego pokazuje w widoku obie jego tabele (lub tylko tabelę podrzędną, gdy są zbyt daleko od siebie, aby zmieściły się razem), zaznacza tabelę podrzędną wraz z kolumnami klucza obcego i podświetla łącznik – zobacz sekcję [Odczytywanie łącznika](./relationship-editing.md#reading-a-connector).
- Wiersz notatki zaznacza notatkę, a wiersz grupy tabel zaznacza grupę. Notatka lub grupa ukryta przez dokument danej strony nie powoduje po tej stronie żadnego przejścia.

Każda strona przesuwa się według reguły z sekcji [Dokąd prowadzi przejście](#where-a-jump-lands), mierzonej na tej stronie, więc ponowne kliknięcie tego samego wiersza niczego nie przesuwa.

### Oznaczenia po obu stronach {#marks-on-the-two-sides}

Obie strony kolorują tekst, obrysy i łączniki i niczego nie wypełniają. Dodane elementy są zielone i widoczne tylko po stronie bieżącego dokumentu, usunięte są czerwone i widoczne tylko po stronie zapisanego dokumentu, a zmienione, w kolorze bursztynowym, i te o zmienionej nazwie, w kolorze niebieskim, są widoczne po obu stronach. Wszystko, co się nie zmieniło, jest rysowane jak zwykle.

- Dodana lub usunięta tabela albo grupa tabel ma obrys w odpowiednim kolorze, a jej nazwa przyjmuje ten kolor. Dodana lub usunięta notatka jest obrysowana.
- Dodana lub usunięta kolumna w tabeli obecnej w obu dokumentach koloruje cały swój wiersz, a przeniesiona kolumna zmienia kolor całego swojego wiersza na bursztynowy. Nic wewnątrz dodanej lub usuniętej tabeli nie jest oznaczane osobno.
- Tekst zmienionej komórki zmienia kolor na bursztynowy: komentarza tabeli, komentarza kolumny, typu danych, wartości domyślnej, Autoinkrementacji, Unikatowości lub NOT NULL albo tekstu notatki. Zmiana klucza podstawowego zmienia kolor ikony klucza kolumny na bursztynowy.
- Tabela, kolumna lub grupa tabel o zmienionej nazwie ma nazwę w kolorze niebieskim.
- Tabela, notatka lub grupa tabel ze zmianą, która nie ma własnej komórki, taką jak przeniesienie, nowy rozmiar lub kolor albo zmiana grupy lub tabel w grupie, ma bursztynowy obrys.
- Dodany, usunięty lub zmieniony klucz obcy rysuje swój łącznik w odpowiednim kolorze. Najechanie na niego wskaźnikiem lub podświetlenie z wiersza rysuje go zamiast tego w zwykłym kolorze najechania.
- Zmiana indeksu niczego nie oznacza po żadnej ze stron; jest widoczna tylko w drzewie.

Każda strona stosuje Opcje widoku swojego dokumentu. Zmiana w komórce, której dana strona nie rysuje, jest pokazywana zamiast tego na nazwie. Zmiana kolumny w komórce ukrytej przez jedną z Opcji widoku, takiej jak `Unique` lub `Auto Increment`, obie domyślnie wyłączone, zmienia kolor nazwy kolumny na bursztynowy, podobnie jak zmiana klucza podstawowego w wierszu, który nie pokazuje ikony klucza. Zmiana komentarza tabeli przy wyłączonej opcji `Table Comment` zmienia kolor nazwy tabeli na bursztynowy. Niebieski kolor zmiany nazwy ma pierwszeństwo przed tym bursztynowym. Notatka lub grupa tabel ukryta przez swój dokument jest wymieniona w drzewie, ale nie jest rysowana po tej stronie.

W widoku `Logical Names`, który nie wyświetla komórki nazwy, niebieski kolor zmiany nazwy i bursztynowy kolor zmiany w komórce, której strona nie wyświetla, trafiają na nazwę logiczną wyświetlaną w miejscu nazwy. Zmiana typu danych zmienia kolor komórki typu na bursztynowy niezależnie od Widoku nazw, nawet tam, gdzie komórka pokazuje nazwę domeny. Żadna ze stron nie rysuje kolorów, które kontrole Słownika nadają nazwom na kanwie – zobacz sekcję [Oznaczenia na kanwie](./dictionary.md#marks-on-the-canvas).

Przy powiększeniu `70%` i mniejszym zwinięte tabele zachowują obrys. Nazwa zachowuje zielony lub czerwony kolor dodanej lub usuniętej tabeli albo niebieski kolor zmiany nazwy, a w pozostałych przypadkach przyjmuje bursztynowy kolor zmiany komentarza. Zmiany kolumn nie są rysowane, dopóki ponownie nie powiększysz widoku; drzewo nadal je wymienia.
