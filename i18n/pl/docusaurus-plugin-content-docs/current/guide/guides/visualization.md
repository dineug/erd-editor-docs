---
sidebar_position: 11
description: Przeglądanie schematu jako grafu w układzie siłowym w trybie Graf lub jako kafelków tabel w trybie Przepływ – powiększanie i przesuwanie widoku, podświetlanie tabel powiązanych z daną tabelą, skupianie widoku na kilku tabelach naraz oraz cofanie się do wcześniejszych skupień widoku.
---

# Wizualizacja

Pozwala objąć cały dokument jednym rzutem oka, w jednym z dwóch trybów:

- `Graph`, czyli graf w układzie siłowym obejmujący wszystkie tabele, ich kolumny i łączące je relacje – zobacz sekcję [Tryb Graf](#graph-mode).
- `Flow`, czyli każda tabela narysowana jako kafelek i rozmieszczona zgodnie ze swoimi relacjami – zobacz sekcję [Tryb Przepływ](#flow-mode).

Otwórz ją za pomocą karty `Visualization` na górnym pasku narzędzi lub pozycji `Tab` w palecie [Szybkie wyszukiwanie](./quick-search.md).  
Na karcie ERD skrót `Alt + F` (Windows/Linux) lub `⌥ + F` (Mac) oraz pozycja `Focus on this table` w menu kontekstowym tabeli otwierają ją od razu w trybie `Flow`, zawężoną do wybranych tabel i tabel oddalonych od nich o jedną relację – zobacz sekcję [Skupianie widoku na tabelach](#focusing-on-tables).

Przełączaj tryby za pomocą przycisków `Graph` i `Flow` na lewym końcu [paska narzędzi](#toolbar).  
Nowo otwarty edytor zaczyna od trybu `Graph`. Wybrany tryb obowiązuje, dopóki edytor jest otwarty, także po przejściu na inne karty, ale nie jest zapisywany w dokumencie.

## Pasek narzędzi {#toolbar}

Pasek narzędzi unosi się nad środkiem dolnej krawędzi karty. Od lewej do prawej:

- `Graph` i `Flow`, z wyróżnionym bieżącym trybem.
- `Previous table` i `Next table`, dostępne tylko w trybie `Flow`: strzałka w lewo i strzałka w prawo, które cofają się o krok i przechodzą o krok do przodu po tabelach, do których zawężano tryb Przepływ – zobacz sekcję [Poprzednia i następna tabela](#previous-table-and-next-table). Każda z nich jest przyciemniona, dopóki w danym kierunku nie ma kroku, do którego można przejść.
- `Zoom out`, bieżące powiększenie wyrażone w procentach, na przykład `100%`, oraz `Zoom in`. Każde naciśnięcie zmienia powiększenie o 4 punkty procentowe, a środek ekranu pozostaje na miejscu. Wartość procentowa pokazuje powiększenie trybu, w którym jesteś, a jej kliknięcie przywraca to powiększenie do `100%`.
- `Fit`, który mieści w widoku wszystko, co pokazuje dany tryb: każdy węzeł w trybie `Graph`, każdy kafelek w trybie `Flow`.
- `Tidy Up`, dostępny tylko w trybie `Flow`, ponownie rozmieszczający kafelki – zobacz sekcję [Jak tryb Przepływ rozmieszcza kafelki](#how-flow-is-placed).
- Menu wyświetlania wierszy, dostępne tylko w trybie `Flow`, z etykietą pokazującą bieżący wybór – zobacz sekcję [Wyświetlanie wierszy](#row-display).
- Lista `Name View`, dostępna tylko w trybie `Flow`, z etykietą pokazującą bieżący widok – zobacz sekcję [Nazwy na kafelkach](#names-on-the-cards).
- `Show all`, dostępny tylko w trybie `Flow` i tylko wtedy, gdy widok jest zawężony, wracający do całego diagramu – zobacz sekcję [Skupianie widoku na tabelach](#focusing-on-tables).
- Kompas `Go to content`, który pojawia się na końcu paska narzędzi tylko wtedy, gdy na ekranie nie ma żadnego węzła ani kafelka. Pokazuje strzałkę wskazującą najbliższy węzeł lub kafelek oraz jego odległość, na przykład `1.2k`. Kliknij go, aby wyśrodkować ten węzeł lub kafelek bez zmiany powiększenia.

Przyciski powiększenia i obie strzałki podają swoje skróty klawiaturowe w podpowiedziach, na przykład `Zoom in (Ctrl + Plus)` (Windows/Linux) lub `Zoom in (⌘ + Plus)` (Mac) oraz `Previous table (Ctrl + Z)` (Windows/Linux) lub `Previous table (⌘ + Z)` (Mac).  
Skróty `Ctrl + Plus` i `Ctrl + Minus` (Windows/Linux) lub `⌘ + Plus` i `⌘ + Minus` (Mac) zmieniają powiększenie o jeden krok tak jak przyciski, w obu trybach, a `Ctrl + 0` (Windows/Linux) lub `⌘ + 0` (Mac) od razu przywraca `100%`. W trybie `Flow` skróty `Ctrl + Z` i `Ctrl + Shift + Z` (Windows/Linux) lub `⌘ + Z` i `⌘ + Shift + Z` (Mac) przechodzą o krok tak jak obie strzałki.  
Kliknięcie wartości procentowej działa tak samo jak `Ctrl + 0` (Windows/Linux) lub `⌘ + 0` (Mac), a jej podpowiedź podaje ten skrót. Gdy otwarte jest szybkie wyszukiwanie, skróty nic nie robią.

## Tryb Graf {#graph-mode}

Rysuje cały dokument jako graf w układzie siłowym, dzięki czemu jednym rzutem oka widać, jak tabele są ze sobą powiązane i które z nich znajdują się w centrum domeny.

![Otwieranie trybu Graf, najeżdżanie wskaźnikiem na tabelę w celu wyświetlenia jej podglądu, przeciąganie węzła oraz pomniejszanie i ponowne powiększanie](/img/demo-visualization.webp)

### Odczytywanie grafu {#reading-the-graph}

Każda tabela i każda kolumna jest węzłem, a oba rodzaje węzłów są rysowane różnymi kolorami. Notatki i [grupy tabel](./table-groups.md) nie są rysowane.  
Węzeł każdej kolumny łączy się z tabelą, do której należy, a dwie tabele powiązane relacją łączą się ze sobą.  
Tabele powiązane więcej niż jedną relacją w tym samym kierunku łączy tylko jedno połączenie, a relacja, która zaczyna się i kończy na tej samej tabeli, nie tworzy żadnego połączenia.

Nazwy tabel pojawiają się na grafie w miarę powiększania, stopniowo wyłaniając się w zakresie od `50%` do `100%`, a nazwa dłuższa niż 15 znaków jest obcinana. Węzły kolumn nie mają etykiet przy żadnym powiększeniu.  
Etykiety są zgodne z Widokiem nazw – zobacz sekcję [Poza kanwą](./logical-names.md#beyond-the-canvas). W widoku `Both Names` etykieta zawiera nazwę logiczną w jednej linii, a pod nią nazwę fizyczną w następnej, i każda linia jest obcinana osobno.

### Poruszanie się po grafie {#getting-around-the-graph}

Kółko myszy zmienia powiększenie względem punktu pod wskaźnikiem, w zakresie od `10%` do `400%`.  
Gest szczypania na gładziku zmienia powiększenie w ten sam sposób, a dwa palce na ekranie dotykowym zmieniają powiększenie względem punktu między nimi i przesuwają widok, gdy się poruszają.  
Przeciągnij tło, aby przesunąć widok, lub przeciągnij środkowym przyciskiem myszy z dowolnego miejsca, także z węzła, tak jak na [kanwie ERD](./table-related-functions.md#getting-around-the-canvas). Przeciąganie środkowym przyciskiem tylko przesuwa widok: nigdy nie pociąga węzła.

Przyciski powiększenia na [pasku narzędzi](#toolbar) i skróty powiększenia działają w tym samym zakresie, ale zamiast tego utrzymują w miejscu środek ekranu, a `Fit` mieści w widoku wszystkie węzły.

### Podgląd po najechaniu {#hover-preview}

Najedź wskaźnikiem na węzeł tabeli, aby wyświetlić podgląd tej tabeli obok kursora.  
Najechanie na węzeł kolumny tylko rysuje wokół niego pierścień; podgląd się nie otwiera.

Podgląd pokazuje te same kolumny i komórki co kanwa ERD, w tej samej kolejności, i nazywa je tak jak kanwa w bieżącym Widoku nazw – zobacz sekcje [Opcje widoku tabel](./table-related-functions.md#table-view-options), [Dostosowywanie kolejności kolumn](./settings.md#adjusting-column-order) i [Widok nazw](./logical-names.md#name-view).  
Gdy opcja widoku `Alternate Key` jest włączona, każda kolumna [klucza alternatywnego](./table-related-functions.md#alternate-keys) ma na końcu swojego wiersza oznaczenie, na przykład `AK1.1`, a podgląd poszerza się, aby je zmieścić, tak jak tabela na kanwie ERD.  
W przeciwieństwie do tabeli na kanwie ERD jego nagłówek nigdy nie przyjmuje koloru [grupy](./table-groups.md#coloring-a-group) tabeli, a jego nazwy nigdy nie mają [oznaczeń](./dictionary.md#marks-on-the-canvas), które kontrole słowników nanoszą na kanwę.  
Służy wyłącznie do wyświetlania i jest ukrywany podczas przeciągania węzła lub przesuwania widoku.

### Podświetlanie sąsiedztwa {#highlighting-a-neighbourhood}

Najechanie na tabelę podświetla także jej sąsiedztwo: samą tabelę, jej własne kolumny, tabele połączone z nią relacjami w dowolnym kierunku i połączenia między nimi.  
Wszystko inne na grafie przygasa, więc to, z czym tabela się łączy, można odczytać w oderwaniu od reszty.

### Przenoszenie węzłów {#moving-nodes}

Przeciągnij węzeł lewym przyciskiem myszy, aby pociągnąć go razem ze wszystkim, co jest z nim połączone, w nowe miejsce.  
Dopóki go trzymasz, węzeł pozostaje przypięty pod wskaźnikiem, a układ wokół niego ponownie się ożywia.  
Gdy go zwolnisz, węzeł znów się stabilizuje – nic nie pozostaje przypięte w miejscu upuszczenia.  
Naciśnięcie lub przeciągnięcie prawym przyciskiem myszy na węźle ani go nie pociąga, ani nie przesuwa widoku.

### Graf jest migawką {#the-graph-is-a-snapshot}

Graf powstaje na podstawie dokumentu w stanie z chwili otwarcia tej karty i jest budowany od nowa przy każdym powrocie do niej.  
Przełączenie z trybu `Flow` na tryb `Graph` również buduje go od nowa, a każde ponowne zbudowanie zaczyna się od powiększenia `100%`.

## Tryb Przepływ {#flow-mode}

Rysuje każdą tabelę jako kafelek i rozmieszcza kafelki zgodnie z ich relacjami. Notatki i [grupy tabel](./table-groups.md) nie są rysowane.  
Nie jest to układ `Flow` funkcji [Automatyczny układ](./table-related-functions.md#auto-layout), która przenosi tabele na samej karcie ERD.

Każdy kafelek jest rysowany jak tabela na karcie ERD: kolor tabeli wzdłuż lewej krawędzi, pasek nagłówka z ikoną tabeli i nazwami tabeli w postaci, w jakiej pokazuje je [Widok nazw](#names-on-the-cards), a pod nim wiersze wynikające z ustawienia [wyświetlania wierszy](#row-display). W przeciwieństwie do tabeli na karcie ERD kafelek rysuje też linię między wierszami, a jego nagłówek nigdy nie przyjmuje koloru [grupy](./table-groups.md#coloring-a-group) tabeli. Kafelki zachowują ten wygląd przy każdym powiększeniu i nigdy nie zwijają się do samej nazwy, tak jak robią to tabele na karcie ERD przy powiększeniu `70%` i mniejszym. Na kafelku nie można niczego edytować.

Łącznik to jedna gładka krzywa od tabeli do tabeli, rysowana pod kafelkami, więc może przechodzić za którymś z nich. Relacja zwrotna zakręca wokół prawego górnego rogu kafelka, tak jak na karcie ERD – zobacz sekcję [Prowadzenie łączników](./relationship-editing.md#connector-routing). Każdy łącznik jest rysowany tą samą ciągłą szarą linią, niezależnie od tego, czy relacja jest identyfikująca, czy nie, z tymi samymi oznaczeniami końców co na karcie ERD – zobacz sekcję [Odczytywanie łącznika](./relationship-editing.md#reading-a-connector). Tryb Przepływ rysuje łączniki nawet wtedy, gdy [opcja widoku](./table-related-functions.md#table-view-options) `Relationship` jest wyłączona. Nigdy nie rysuje etykiet `D:` i `U:` oznaczających akcje ON DELETE i ON UPDATE relacji ani nie pokazuje podpowiedzi, która podaje je w pełnym brzmieniu, niezależnie od ustawienia opcji widoku `Referential Actions`.

W widoku całego diagramu tabele, których żadna relacja nie łączy z inną tabelą, są zebrane w jeden blok, a nie rozrzucone między pozostałymi.

![Przełączanie do trybu Przepływ, najeżdżanie wskaźnikiem na tabelę orders w celu podświetlenia jej i jej sąsiadów, przypinanie podświetlenia, wybieranie Keys only, a następnie powiększanie za pomocą ⌘ + Wheel i naciskanie Fit](/img/demo-visualization-flow.webp)

### Wyświetlanie wierszy {#row-display}

Menu wyświetlania wierszy na [pasku narzędzi](#toolbar) określa, jaka część każdego kafelka jest rysowana. Jego etykietą jest bieżący wybór, a jego podpowiedź brzmi na przykład `Row display: Name only`.  
Menu otwiera się nad paskiem narzędzi ze znacznikiem obok bieżącego wyboru. Zamyka się, gdy wybierzesz pozycję, ponownie klikniesz etykietę, klikniesz w dowolnym innym miejscu edytora, naciśniesz klawisz `Escape` lub przełączysz się na tryb `Graph`.

| Wyświetlanie wierszy | Co pokazuje każdy kafelek |
| --- | --- |
| `Name only` | Sam nagłówek. |
| `Keys only` | Kolumny klucza podstawowego i klucza obcego oraz każda inna kolumna, na której kończy się relacja. |
| `All fields` | Każda kolumna. |

Wiersze są wymienione w kolejności kolumn tabeli. Każdy wiersz pokazuje nazwę kolumny, poprzedzoną ikoną klucza, gdy kolumna jest kluczem podstawowym, kluczem obcym lub jednym i drugim, oraz typ danych po prawej stronie, niezależnie od tego, czy kafelek jest [podświetlony](#lighting-related-tables). [Widok nazw](#names-on-the-cards) decyduje, które nazwy pokazuje wiersz i czy pokazuje on domenę kolumny.  
Żadne inne komórki ani oznaczenia klucza alternatywnego nie są rysowane, a kafelków nie dotyczą ani [Opcje widoku tabel](./table-related-functions.md#table-view-options), ani ustawienie [Dostosowywanie kolejności kolumn](./settings.md#adjusting-column-order), które ustala kolejność komórek w wierszu.

Gdy tryb Przepływ otwiera się po raz pierwszy, zaczyna od ustawienia `Name only` lub od ustawienia `Keys only`, jeśli otworzyło go [skupienie widoku na tabelach](#focusing-on-tables). Potem wyświetlanie wierszy zmienia się tylko wtedy, gdy wybierzesz inne ustawienie, a zawężanie lub poszerzanie widoku je zachowuje.  
Zmiana wyświetlania wierszy zmienia rozmiar kafelków, więc tryb Przepływ rozmieszcza je ponownie i dopasowuje do ekranu.

### Nazwy na kafelkach {#names-on-the-cards}

Kafelek pokazuje nazwy swojej tabeli i kolumn zgodnie z Widokiem nazw, tym samym, w którym wyświetla je karta ERD – zobacz sekcję [Widok nazw](./logical-names.md#name-view).  
Przełącz go tutaj listą `Name View` na [pasku narzędzi](#toolbar). Jej przycisk pokazuje bieżący widok: `Physical Names`, `Logical Names` lub `Both Names`, a jego podpowiedź brzmi `Name View`. Lista otwiera się nad paskiem narzędzi ze znacznikiem obok bieżącego widoku i zamyka się tak samo jak menu [wyświetlania wierszy](#row-display). Wybór przełącza cały edytor, łącznie z kartą ERD, tak jak przełączenie wykonane w dowolnym innym miejscu – zobacz sekcję [Przełączanie widoku](./logical-names.md#switching-the-view).

Kafelki rozmieszczają swoje komórki wyłącznie według Widoku nazw. Nie zmienia ich żadna [opcja widoku](./table-related-functions.md#table-view-options), łącznie z opcją `Domain`:

| Widok nazw | Nagłówek | Każdy wiersz |
| --- | --- | --- |
| `Physical Names` | Nazwa tabeli. | Nazwa kolumny, a po niej typ danych. |
| `Logical Names` | Nazwa logiczna tabeli. | Nazwa logiczna kolumny, a po niej nazwa jej [domeny](./dictionary.md#domains-and-data-types) lub jej typ danych, dopóki kolumna nie ma domeny. |
| `Both Names` | Nazwa logiczna, a po niej wyciszona nazwa tabeli. | Nazwa logiczna, nazwa fizyczna, domena i typ danych. |

Dopóki nazwa logiczna jest pusta, widok `Logical Names` pokazuje w jej miejscu przyciemnioną nazwę fizyczną, a gdy nazwa fizyczna również jest pusta – tekst zastępczy `table` lub `column`, natomiast widok `Both Names` pokazuje przyciemniony tekst zastępczy `logical`. W widoku `Both Names` kolumna bez domeny pokazuje przyciemniony tekst zastępczy `domain`.  
Kafelek nigdy nie ma [oznaczeń](./dictionary.md#marks-on-the-canvas), które kontrole słowników nanoszą na nazwy na karcie ERD.  
Przełączenie Widoku nazw zmienia rozmiar kafelków, więc tryb Przepływ rozmieszcza je ponownie – zobacz sekcję [Jak tryb Przepływ rozmieszcza kafelki](#how-flow-is-placed).

### Poruszanie się w trybie Przepływ {#getting-around-the-flow}

Kółko myszy przesuwa widok, a `Shift + Wheel` przesuwa go w poziomie. `Ctrl + Wheel` (Windows/Linux) lub `⌘ + Wheel` (Mac) zmienia powiększenie, utrzymując środek ekranu w miejscu.  
Gest szczypania na gładziku zmienia powiększenie względem punktu, w którym go wykonujesz, a dwa palce na ekranie dotykowym zmieniają powiększenie względem punktu między nimi i przesuwają widok, gdy się poruszają.  
Przeciągnij tło, aby przesunąć widok, lub przeciągnij środkowym przyciskiem myszy z dowolnego miejsca, także z kafelka. Przeciąganie środkowym przyciskiem tylko przesuwa widok i nie zmienia zaznaczenia. Przesuwanie widoku nie ma granic, tak jak na [kanwie ERD](./table-related-functions.md#getting-around-the-canvas).  
Powiększenie mieści się w zakresie od `10%` do `150%`. Tryb Przepływ ma własne powiększenie i przesunięcie widoku, niezależne od tych na karcie ERD, i żadne z nich nie jest zapisywane w dokumencie.

Naciśnięcie tła anuluje zaznaczenie, a `Ctrl + drag` (Windows/Linux) lub `⌘ + drag` (Mac) na tle rysuje ramkę zaznaczenia.  
Tryb Przepływ nie ma minimapy ani pasków przewijania. Gdy po przesunięciu widoku na ekranie nie zostaje żaden kafelek, użyj kompasu `Go to content` na [pasku narzędzi](#toolbar).

### Podświetlanie powiązanych tabel {#lighting-related-tables}

Najedź wskaźnikiem na kafelek, aby podświetlić ten kafelek, tabele oddalone od niego o jedną relację i łączniki łączące go z tymi tabelami. Łącznik między dwiema z tych tabel pozostaje niepodświetlony.  
Podświetlony kafelek otrzymuje obramowanie i poświatę w kolorze akcentu, a jego wiersze, na których kończy się relacja, zostają zabarwione. Podświetlony łącznik przybiera kolor akcentu.  
W przeciwieństwie do trybu [Graf](#highlighting-a-neighbourhood) nic innego nie przygasa, a dopóki wskaźnik nie znajduje się nad żadnym kafelkiem i żaden kafelek nie jest przypięty, nic nie jest podświetlone.

Kliknij kafelek, aby przypiąć jego podświetlenie, dzięki czemu pozostanie podświetlony po odsunięciu wskaźnika. Kliknij ponownie ten sam kafelek lub kliknij tło, aby je odpiąć; kliknięcie innego kafelka przenosi tam przypięcie. Kafelek, na który najechano wskaźnikiem, i kafelek przypięty są podświetlane jednocześnie.  
Przeciąganie, `Ctrl + click` (Windows/Linux) lub `⌘ + click` (Mac), przesuwanie widoku i [przyciski kafelka](#card-buttons) ani nie przypinają, ani nie odpinają kafelka.

Wzdłuż każdego podświetlonego łącznika biegną cząstki, od końca przy tabeli nadrzędnej, gdzie znajduje się klucz podstawowy, do końca przy tabeli podrzędnej. Gdy jednocześnie podświetlonych jest więcej niż 60 łączników, cząstki się zatrzymują, a podświetlenie pozostaje.

### Przyciski kafelków {#card-buttons}

Gdy wskaźnik znajduje się nad kafelkiem, na prawym końcu jego nagłówka pojawiają się dwa przyciski z ikonami, oba bez podpowiedzi:

- Ikona punktów trasy, ta sama, którą pokazuje przycisk `Flow`, zawęża tryb Przepływ do tej tabeli i tabel oddalonych od niej o jedną relację – zobacz sekcję [Skupianie widoku na tabelach](#focusing-on-tables). To, co tryb Przepływ pokazywał wcześniej, pozostaje dostępne jednym naciśnięciem przycisku `Previous table` – zobacz sekcję [Poprzednia i następna tabela](#previous-table-and-next-table).
- Ikona łącza zewnętrznego przełącza na kartę ERD, zaznacza tylko tę tabelę, przenosi ją na wierzch i ustawia fokus na komórce z jej nazwą, a w widokach `Logical Names` i `Both Names` na komórce z jej nazwą logiczną, chyba że fokus ma już komórka tej tabeli. Kanwa przewija się do tabeli tylko wtedy, gdy ta nie jest już dobrze widoczna – zobacz sekcję [Dokąd prowadzi przejście](./table-related-functions.md#where-a-jump-lands). Nigdy nie rozpoczyna ani nie kończy rysowania relacji.

Naciśnięcie któregokolwiek z przycisków jest obsługiwane wyłącznie przez ten przycisk: w przeciwieństwie do naciśnięcia w innym miejscu kafelka nie zaznacza kafelka ani nie przenosi go na wierzch. Przycisk z punktami trasy pozostawia więc dotychczasowe zaznaczenie; przycisk z łączem zewnętrznym zaznacza tabelę tylko w ramach przełączenia na kartę ERD. Oba przyciski reagują wyłącznie na kliknięcie lewym przyciskiem myszy.

### Przenoszenie kafelków {#moving-cards}

Przeciągnij kafelek lewym przyciskiem myszy, chwytając go za dowolną część oprócz dwóch przycisków kafelka; przeciąganie prawym przyciskiem niczego nie przesuwa.  
Naciśnięcie kafelka zaznacza go, `Ctrl + click` (Windows/Linux) lub `⌘ + click` (Mac) dodaje go do zaznaczenia, a przeciągnięcie zaznaczonego kafelka przesuwa wszystkie zaznaczone kafelki. Zaznaczenie jest wspólne z kartą ERD, więc to, co zaznaczysz tutaj, pozostanie zaznaczone po powrocie na nią.

Kafelek przesuwa się tylko w trybie Przepływ: jego tabela pozostaje na swoim miejscu na karcie ERD.  
Przesunięty kafelek nie zmienia położenia przy przesuwaniu widoku, zmianie powiększenia i użyciu przycisku `Fit`. Wraca tam, gdzie umieścił go układ, gdy opuścisz kartę lub przełączysz się na tryb `Graph` i wrócisz, a także gdy przycisk `Show all` lub [krok](#previous-table-and-next-table) przywraca układ, który tryb Przepływ już ma. Nowy układ rozmieszcza go ponownie, uwzględniając miejsce, w którym go pozostawiono – zobacz sekcję [Jak tryb Przepływ rozmieszcza kafelki](#how-flow-is-placed).

### Skupianie widoku na tabelach {#focusing-on-tables}

Na karcie ERD zaznacz jedną lub więcej tabel i naciśnij `Alt + F` (Windows/Linux) lub `⌥ + F` (Mac) albo kliknij tabelę prawym przyciskiem myszy i wybierz `Focus on this table`.  
Karta Wizualizacja otwiera się w trybie `Flow`, zawężona do tych tabel i wszystkich tabel oddalonych o jedną relację od którejkolwiek z nich, w dowolnym kierunku. Rysowane są tylko łączniki między pokazanymi tabelami.

Gdy tabela, którą klikasz prawym przyciskiem myszy, jest jedną z kilku zaznaczonych tabel, pozycja brzmi `Focus on selected tables` i skupia widok na całym zaznaczeniu. Kliknięcie prawym przyciskiem myszy tabeli spoza zaznaczenia skupia widok tylko na tej tabeli.  
Skrót `Alt + F` uwzględnia zaznaczone tabele i pomija notatki oraz [grupy tabel](./table-groups.md). Gdy nie jest zaznaczona żadna tabela, nic nie robi, nawet jeśli zaznaczona jest grupa: najpierw wybierz `Select tables` w menu kontekstowym grupy – zobacz sekcję [Zaznaczanie grup](./table-groups.md#selecting-groups).  
Jest ignorowany podczas edycji komórki, notatki lub nazwy grupy, gdy fokus klawiatury znajduje się w [Eksploratorze](./explorer.md#keys-in-the-explorer) lub gdy otwarte jest szybkie wyszukiwanie, właściwości tabeli, podgląd różnic, podgląd Automatycznego układu, podróż w czasie, okno dialogowe [`Export image`](./file-import-export.md#image) lub okno dialogowe [`Map Columns`](./relationship-editing.md#map-columns).

W trybie Przepływ [przycisk kafelka](#card-buttons) z punktami trasy zawęża widok w ten sam sposób, do tej jednej tabeli. Przycisk `Show all` na [pasku narzędzi](#toolbar) wraca do całego diagramu. Przyciski `Previous table` i `Next table` na pasku narzędzi lub ich skróty klawiaturowe cofają się o krok i przechodzą o krok do przodu po tym, do czego zawężano tryb Przepływ – zobacz sekcję [Poprzednia i następna tabela](#previous-table-and-next-table).  
Zawężony widok otrzymuje własny układ i jest dopasowywany do ekranu. Pozostaje zawężony, gdy opuścisz kartę lub przełączysz się na tryb `Graph` i wrócisz, a klawisz `Escape` go nie poszerza.

![Skupianie widoku na tabeli orders za pomocą ⌥ + F, zawężanie do tabeli members przyciskiem z punktami trasy na jej kafelku, a następnie Show all](/img/demo-visualization-focus.webp)

### Poprzednia i następna tabela {#previous-table-and-next-table}

Tryb Przepływ pamięta, do czego zawężano widok, tak jak historia przeglądarki. Za każdym razem, gdy widok przechodzi do innych tabel – przez [skupienie widoku na tabelach](#focusing-on-tables) z karty ERD, za pomocą [przycisku kafelka](#card-buttons) z punktami trasy lub przyciskiem `Show all` – to, co pokazywał wcześniej, zostaje zachowane jako krok wstecz, niezależnie od tego, czy było to kilka tabel, czy cały diagram.

![Zawężanie trybu Przepływ do tabeli orders za pomocą ⌥ + F, a następnie do tabeli members, cofanie się przyciskiem Previous table, przechodzenie do przodu skrótem ⌘ + Shift + Z i z powrotem skrótem ⌘ + Z, a następnie Show all](/img/demo-visualization-steps.webp)

- Przycisk `Previous table` na [pasku narzędzi](#toolbar) cofa się o krok, a przycisk `Next table` ponownie przechodzi do przodu, do tego, co opuścił przycisk `Previous table`.
- W trybie `Flow` skrót `Ctrl + Z` (Windows/Linux) lub `⌘ + Z` (Mac) cofa się o krok tak jak przycisk `Previous table`, a skrót `Ctrl + Shift + Z` (Windows/Linux) lub `⌘ + Shift + Z` (Mac) przechodzi o krok do przodu tak jak przycisk `Next table`. Tam nigdy nie cofają ani nie ponawiają zmian w diagramie. W trybie `Graph` oraz gdy otwarte jest szybkie wyszukiwanie, nic nie robią.
- Zawężenie widoku lub naciśnięcie przycisku `Show all` po cofnięciu się usuwa kroki do przodu. Ponowne skupienie widoku dokładnie na tych tabelach, do których tryb Przepływ jest już zawężony, nie dodaje ani nie usuwa żadnego kroku.
- Przechowywanych jest 100 ostatnich kroków wstecz, a najstarszy jest usuwany jako pierwszy.

Krok pokazuje te ze swoich tabel, które nadal są w diagramie, wraz ze wszystkimi tabelami oddalonymi od nich o jedną relację, tak jak skupienie widoku. Krok, którego wszystkie tabele usunięto, jest pomijany i usuwany, podobnie jak krok, który pozostawiłby tryb Przepływ w obecnym stanie: na dokładnie tych tabelach, do których jest teraz zawężony, lub na całym diagramie, gdy tryb Przepływ już go pokazuje.  
Przycisk jest przyciemniony i nic nie robi, dopóki w danym kierunku nie pozostał żaden krok. Oba są przyciemnione przy pierwszym otwarciu trybu Przepływ, niezależnie od tego, czy otwiera się on na całym diagramie, czy na tabelach, z którymi otworzyło go skupienie widoku. Po pierwszym otwarciu trybu Przepływ późniejsze skupienie widoku z karty ERD zachowuje jako krok wstecz to, co tryb Przepływ pokazywał w chwili, gdy go opuszczono.  
Krok jest rozmieszczany i dopasowywany do ekranu tak samo jak skupienie widoku – zobacz sekcję [Jak tryb Przepływ rozmieszcza kafelki](#how-flow-is-placed) – a wyświetlanie wierszy pozostaje bez zmian.

Kroki należą wyłącznie do trybu Przepływ. Są przechowywane, dopóki edytor jest otwarty, także podczas przechodzenia na inne karty i do trybu `Graph`, ale nie są zapisywane w dokumencie ani wysyłane do współpracowników i nie dodają niczego do historii cofania. Zastąpienie całego dokumentu odrzuca je wraz z resztą stanu trybu Przepływ.

W języku wyświetlania pisanym od prawej do lewej pasek narzędzi zachowuje swoją kolejność, a obie strzałki zamieniają się funkcjami, więc przycisk `Previous table` to strzałka skierowana w prawo. Skróty klawiaturowe pozostają takie same – zobacz sekcję [Języki pisane od prawej do lewej](./language-and-theme.md#right-to-left-languages).

### Jak tryb Przepływ rozmieszcza kafelki {#how-flow-is-placed}

Przy pierwszym wyświetleniu trybu `Flow` pokazywane w nim tabele są rozmieszczane poza wątkiem głównym, a wynik jest dopasowywany do ekranu.  
Układ jest przechowywany, dopóki edytor jest otwarty. Gdy opuścisz kartę lub przełączysz się na tryb `Graph` i wrócisz, tryb Przepływ użyje go ponownie, z powiększeniem i przesunięciem widoku w stanie, w jakim je pozostawiono.  
Tryb Przepływ przechowuje jeden układ dla całego diagramu i jeden dla tabel, do których ostatnio go zawężono, więc `Show all` wraca do układu całego diagramu i dopasowuje go do ekranu bez ponownego obliczania, o ile nie zmieniło się nic, na podstawie czego ten układ powstał. [Krok](#previous-table-and-next-table) do całego diagramu lub do tabel, do których ostatnio zawężono tryb Przepływ, w ten sam sposób ponownie używa tego układu.

Tryb Przepływ ponownie rozmieszcza kafelki, gdy:

- Naciśniesz `Tidy Up`. Wynik jest dopasowywany do ekranu.
- Zmienisz wyświetlanie wierszy, zawęzisz widok do innych tabel lub przejdziesz do innych tabel przyciskiem `Previous table` lub `Next table`. Wynik jest dopasowywany do ekranu.
- Wybierzesz inny widok na liście `Name View`. Wynik jest dopasowywany do ekranu.
- Tabele lub relacje zostaną dodane albo usunięte lub zostanie przełączony Widok nazw – podczas twojej nieobecności w trybie Przepływ, co zostaje uwzględnione po powrocie, lub przez współpracownika, gdy jesteś w trybie Przepływ. Powiększenie i przesunięcie widoku pozostają bez zmian.

Każdy układ uwzględnia bieżące położenie kafelków, więc `Tidy Up` niekoniecznie przywraca wcześniejsze rozmieszczenie.  
Zmiana, która tylko zmienia rozmiar kafelka, na przykład zmiana nazwy tabeli, wpisanie nazwy logicznej lub dodanie kolumny, nie powoduje ponownego rozmieszczenia kafelków. Jeśli kafelki zaczną na siebie nachodzić, naciśnij `Tidy Up`.

Jeśli obliczanie układu trwa dłużej niż 6 sekund, wyświetlany jest komunikat `Placing tables` z obracającym się wskaźnikiem ładowania i przyciskiem `Cancel`.  
Przycisk `Cancel` lub naciśnięcie klawisza `Escape` w dowolnym momencie obliczania układu przerywa to obliczanie; przycisk `Tidy Up` lub powrót do trybu `Flow` uruchamia je ponownie.  
Jeśli obliczenie układu się nie powiedzie – host nie uruchamia żadnego shared workera, worker nie zdoła się uruchomić albo w ciągu 60 sekund nie zostanie zwrócony żaden układ – tryb Przepływ wyświetla komunikat `Could not place tables` ze znakiem ostrzeżenia, a `Tidy Up` ponawia próbę. Zobacz sekcję [Web Workers](../../api/installation.md#web-workers).  
Tryb Przepływ rysuje tylko tabele rozmieszczone przez jego ostatni układ, zarówno w widoku całego diagramu, jak i w zawężonym widoku, więc przy pierwszym wyświetleniu może nie być żadnych kafelków, dopóki układ nie zostanie pomyślnie obliczony.  
Za każdym razem, gdy tryb Przepływ ponownie rozmieszcza kafelki, na przykład po zawężeniu widoku do innych tabel, poprzednie rozmieszczenie pozostaje na ekranie do czasu nadejścia nowego układu i zostaje na nim, jeśli ten układ zostanie anulowany lub się nie powiedzie.

Gdy cały dokument zostaje zastąpiony, na przykład przez zaimportowanie pliku, układy, skupienie widoku, kroki przycisków `Previous table` i `Next table`, wyświetlanie wierszy, powiększenie i przesunięcie widoku trybu Przepływ są odrzucane, a przy następnym otwarciu tryb Przepływ zaczyna od nowa, tak jak za pierwszym razem: z widokiem całego diagramu lub zawężonym, jeśli otworzysz go przez [skupienie widoku na tabelach](#focusing-on-tables).

### Tryb Przepływ nigdy nie zmienia dokumentu {#flow-never-edits-the-document}

Tryb Przepływ tylko odczytuje diagram. Zmiana powiększenia, przesuwanie widoku, przenoszenie kafelków, `Tidy Up`, wyświetlanie wierszy, przypięcia, skupianie widoku i przechodzenie przyciskami `Previous table` i `Next table` nie dodają niczego do [historii cofania](./undo-redo.md#what-the-history-records).  
Nie zmieniają też niczego w diagramie. Naciśnięcie kafelka przenosi wprawdzie jego tabelę na wierzch, tak samo jak kliknięcie tabeli na karcie ERD, więc tam również jest ona na wierzchu, ale kolejność warstw nie jest zapisywana – zobacz sekcję [Przenoszenie wielu tabel](./table-related-functions.md#moving-multiple-tables). Tryb `Graph` w ten sam sposób pozostawia diagram nietknięty.  
Wyjątkiem jest lista `Name View`, i to tylko wtedy, gdy [blokada](./settings.md#lock) `Name View` jest wyłączona: wybór przełącza wtedy Widok nazw diagramu, który jest zapisywany i przełącza się również u współpracowników. Gdy blokada jest włączona, co jest ustawieniem domyślnym, wybór zmienia tylko twój własny ekran. W obu przypadkach nie dodaje niczego do historii cofania.  
Naciśnięcie kafelka nigdy nie dodaje relacji. Jeśli opuścisz kartę ERD w trakcie rysowania relacji, naciśnięcie kafelka wybiera jego tabelę jako tabelę początkową, o ile żadna nie została jeszcze wybrana, a w przeciwnym razie kończy rysowanie.  
[Przycisk kafelka](#card-buttons) z łączem zewnętrznym idzie dalej, ponieważ wyprowadza z trybu Przepływ: gdy karta ERD musi przewinąć się do tabeli, to przewinięcie jest rejestrowane jak każda inna zmiana położenia widoku.

Zmiany współpracowników nadal docierają do diagramu, gdy jesteś w trybie Przepływ, a kafelki nadążają za dodawanymi lub usuwanymi przez nich tabelami i relacjami – zobacz sekcję [Jak tryb Przepływ rozmieszcza kafelki](#how-flow-is-placed).  
Ich zaznaczenie i obwódki fokusu są rysowane na kafelkach, ale ich kursory i ramki przeciągania już nie – zobacz stronę [Wspólna edycja](../../api/advanced/collaborative-editing.md).

Oba tryby, łącznie ze skupianiem widoku i przechodzeniem o krok, działają również w edytorze z atrybutem [`readonly`](../../api/erd-editor-element.md#readonly), podobnie jak lista `Name View`, która przełącza tam tylko twój własny ekran.  
Na karcie ERD edytora tylko do odczytu menu tabeli zawiera tylko pozycję `Table Properties`, a naciśnięcie nie zaznacza żadnej tabeli, więc skupiaj widok skrótem `Alt + F` (Windows/Linux) lub `⌥ + F` (Mac) na tabeli zaznaczonej przez przejście z [Eksploratora](./explorer.md#going-to-a-row) lub [Szybkiego wyszukiwania](./quick-search.md).
