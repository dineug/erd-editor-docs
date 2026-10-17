---
sidebar_position: 10
description: Przeglądanie schematu jako grafu w układzie siłowym w trybie Graf lub jako kafelków tabel w trybie Przepływ – powiększanie i przesuwanie widoku, podświetlanie tabel powiązanych z daną tabelą oraz skupianie widoku na kilku tabelach naraz.
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
- `Zoom out`, bieżące powiększenie wyrażone w procentach, na przykład `100%`, oraz `Zoom in`. Każde naciśnięcie zmienia powiększenie o 4 punkty procentowe, a środek ekranu pozostaje na miejscu. Wartość procentowa pokazuje powiększenie trybu, w którym jesteś, a jej kliknięcie przywraca to powiększenie do `100%`.
- `Fit`, który mieści w widoku wszystko, co pokazuje dany tryb: każdy węzeł w trybie `Graph`, każdy kafelek w trybie `Flow`.
- `Tidy Up`, dostępny tylko w trybie `Flow`, ponownie rozmieszczający kafelki – zobacz sekcję [Jak tryb Przepływ rozmieszcza kafelki](#how-flow-is-placed).
- Menu wyświetlania wierszy, dostępne tylko w trybie `Flow`, z etykietą pokazującą bieżący wybór – zobacz sekcję [Wyświetlanie wierszy](#row-display).
- `Show all`, dostępny tylko w trybie `Flow` i tylko wtedy, gdy widok jest zawężony, wracający do całego diagramu – zobacz sekcję [Skupianie widoku na tabelach](#focusing-on-tables).
- Kompas `Go to content`, który pojawia się na końcu paska narzędzi tylko wtedy, gdy na ekranie nie ma żadnego węzła ani kafelka. Pokazuje strzałkę wskazującą najbliższy węzeł lub kafelek oraz jego odległość, na przykład `1.2k`. Kliknij go, aby wyśrodkować ten węzeł lub kafelek bez zmiany powiększenia.

Przyciski powiększenia podają swoje skróty klawiaturowe w podpowiedziach, na przykład `Zoom in (Ctrl + Plus)` (Windows/Linux) lub `Zoom in (⌘ + Plus)` (Mac).  
Skróty `Ctrl + Plus` i `Ctrl + Minus` (Windows/Linux) lub `⌘ + Plus` i `⌘ + Minus` (Mac) zmieniają powiększenie o jeden krok tak jak przyciski, w obu trybach, a `Ctrl + 0` (Windows/Linux) lub `⌘ + 0` (Mac) od razu przywraca `100%`.  
Kliknięcie wartości procentowej działa tak samo jak `Ctrl + 0` (Windows/Linux) lub `⌘ + 0` (Mac), a jej podpowiedź podaje ten skrót. Gdy otwarte jest szybkie wyszukiwanie, skróty nic nie robią.

## Tryb Graf {#graph-mode}

Rysuje cały dokument jako graf w układzie siłowym, dzięki czemu jednym rzutem oka widać, jak tabele są ze sobą powiązane i które z nich znajdują się w centrum domeny.

![Otwieranie trybu Graf, najeżdżanie wskaźnikiem na tabelę w celu wyświetlenia jej podglądu, przeciąganie węzła oraz pomniejszanie i ponowne powiększanie](/img/demo-visualization.webp)

### Odczytywanie grafu {#reading-the-graph}

Każda tabela i każda kolumna jest węzłem, a oba rodzaje węzłów są rysowane różnymi kolorami. Notatki i [grupy tabel](./table-groups.md) nie są rysowane.  
Węzeł każdej kolumny łączy się z tabelą, do której należy, a dwie tabele powiązane relacją łączą się ze sobą.  
Tabele powiązane więcej niż jedną relacją w tym samym kierunku łączy tylko jedno połączenie, a relacja, która zaczyna się i kończy na tej samej tabeli, nie tworzy żadnego połączenia.

Nazwy tabel pojawiają się na grafie w miarę powiększania, stopniowo wyłaniając się w zakresie od `50%` do `100%`, a nazwa dłuższa niż 15 znaków jest obcinana. Węzły kolumn nie mają etykiet przy żadnym powiększeniu.

### Poruszanie się po grafie {#getting-around-the-graph}

Kółko myszy zmienia powiększenie względem punktu pod wskaźnikiem, w zakresie od `10%` do `400%`.  
Gest szczypania na gładziku zmienia powiększenie w ten sam sposób, a dwa palce na ekranie dotykowym zmieniają powiększenie względem punktu między nimi i przesuwają widok, gdy się poruszają.  
Przeciągnij tło, aby przesunąć widok, lub przeciągnij środkowym przyciskiem myszy z dowolnego miejsca, także z węzła, tak jak na [kanwie ERD](./table-related-functions.md#getting-around-the-canvas). Przeciąganie środkowym przyciskiem tylko przesuwa widok: nigdy nie pociąga węzła.

Przyciski powiększenia na [pasku narzędzi](#toolbar) i skróty powiększenia działają w tym samym zakresie, ale zamiast tego utrzymują w miejscu środek ekranu, a `Fit` mieści w widoku wszystkie węzły.

### Podgląd po najechaniu {#hover-preview}

Najedź wskaźnikiem na węzeł tabeli, aby wyświetlić podgląd tej tabeli obok kursora.  
Najechanie na węzeł kolumny tylko rysuje wokół niego pierścień; podgląd się nie otwiera.

Podgląd pokazuje te same kolumny co kanwa ERD, w tej samej kolejności – zobacz sekcje [Opcje widoku tabel](./table-related-functions.md#table-view-options) i [Dostosowywanie kolejności kolumn](./settings.md#adjusting-column-order).  
Gdy opcja widoku `Alternate Key` jest włączona, każda kolumna [klucza alternatywnego](./table-related-functions.md#alternate-keys) ma na końcu swojego wiersza oznaczenie, na przykład `AK1.1`, a podgląd poszerza się, aby je zmieścić, tak jak tabela na kanwie ERD.  
W przeciwieństwie do tabeli na kanwie ERD jego nagłówek nigdy nie przyjmuje koloru [grupy](./table-groups.md#coloring-a-group) tabeli.  
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

Każdy kafelek jest rysowany jak tabela na karcie ERD: kolor tabeli wzdłuż lewej krawędzi, pasek nagłówka z ikoną tabeli i nazwą tabeli, a pod nim wiersze wynikające z ustawienia [wyświetlania wierszy](#row-display). W przeciwieństwie do tabeli na karcie ERD kafelek rysuje też linię między wierszami, a jego nagłówek nigdy nie przyjmuje koloru [grupy](./table-groups.md#coloring-a-group) tabeli. Kafelki zachowują ten wygląd przy każdym powiększeniu i nigdy nie zwijają się do samej nazwy, tak jak robią to tabele na karcie ERD przy powiększeniu `70%` i mniejszym. Na kafelku nie można niczego edytować.

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

Wiersze są wymienione w kolejności kolumn tabeli. Każdy wiersz pokazuje nazwę kolumny, poprzedzoną ikoną klucza, gdy kolumna jest kluczem podstawowym, kluczem obcym lub jednym i drugim, oraz typ danych po prawej stronie, który pojawia się tylko wtedy, gdy kafelek jest [podświetlony](#lighting-related-tables).  
Żadne inne komórki ani oznaczenia klucza alternatywnego nie są rysowane, a kafelków nie dotyczą ani [Opcje widoku tabel](./table-related-functions.md#table-view-options), ani ustawienie [Dostosowywanie kolejności kolumn](./settings.md#adjusting-column-order), które ustala kolejność komórek w wierszu.

Gdy tryb Przepływ otwiera się po raz pierwszy, zaczyna od ustawienia `Name only` lub od ustawienia `Keys only`, jeśli otworzyło go [skupienie widoku na tabelach](#focusing-on-tables). Potem wyświetlanie wierszy zmienia się tylko wtedy, gdy wybierzesz inne ustawienie, a zawężanie lub poszerzanie widoku je zachowuje.  
Zmiana wyświetlania wierszy zmienia rozmiar kafelków, więc tryb Przepływ rozmieszcza je ponownie i dopasowuje do ekranu.

### Poruszanie się w trybie Przepływ {#getting-around-the-flow}

Kółko myszy przesuwa widok, a `Shift + Wheel` przesuwa go w poziomie. `Ctrl + Wheel` (Windows/Linux) lub `⌘ + Wheel` (Mac) zmienia powiększenie, utrzymując środek ekranu w miejscu.  
Gest szczypania na gładziku zmienia powiększenie względem punktu, w którym go wykonujesz, a dwa palce na ekranie dotykowym zmieniają powiększenie względem punktu między nimi i przesuwają widok, gdy się poruszają.  
Przeciągnij tło, aby przesunąć widok, lub przeciągnij środkowym przyciskiem myszy z dowolnego miejsca, także z kafelka. Przeciąganie środkowym przyciskiem tylko przesuwa widok i nie zmienia zaznaczenia. Przesuwanie widoku nie ma granic, tak jak na [kanwie ERD](./table-related-functions.md#getting-around-the-canvas).  
Powiększenie mieści się w zakresie od `10%` do `150%`. Tryb Przepływ ma własne powiększenie i przesunięcie widoku, niezależne od tych na karcie ERD, i żadne z nich nie jest zapisywane w dokumencie.

Naciśnięcie tła anuluje zaznaczenie, a `Ctrl + drag` (Windows/Linux) lub `⌘ + drag` (Mac) na tle rysuje ramkę zaznaczenia.  
Tryb Przepływ nie ma minimapy ani pasków przewijania. Gdy po przesunięciu widoku na ekranie nie zostaje żaden kafelek, użyj kompasu `Go to content` na [pasku narzędzi](#toolbar).

### Podświetlanie powiązanych tabel {#lighting-related-tables}

Najedź wskaźnikiem na kafelek, aby podświetlić ten kafelek, tabele oddalone od niego o jedną relację i łączniki łączące go z tymi tabelami. Łącznik między dwiema z tych tabel pozostaje niepodświetlony.  
Podświetlony kafelek otrzymuje obramowanie i poświatę w kolorze akcentu, jego typy danych stopniowo się pojawiają, a jego wiersze, na których kończy się relacja, zostają zabarwione. Podświetlony łącznik przybiera kolor akcentu.  
W przeciwieństwie do trybu [Graf](#highlighting-a-neighbourhood) nic innego nie przygasa, a dopóki wskaźnik nie znajduje się nad żadnym kafelkiem i żaden kafelek nie jest przypięty, nic nie jest podświetlone.

Kliknij kafelek, aby przypiąć jego podświetlenie, dzięki czemu pozostanie podświetlony po odsunięciu wskaźnika. Kliknij ponownie ten sam kafelek lub kliknij tło, aby je odpiąć; kliknięcie innego kafelka przenosi tam przypięcie. Kafelek, na który najechano wskaźnikiem, i kafelek przypięty są podświetlane jednocześnie.  
Przeciąganie, `Ctrl + click` (Windows/Linux) lub `⌘ + click` (Mac), przesuwanie widoku i [przyciski kafelka](#card-buttons) ani nie przypinają, ani nie odpinają kafelka.

Wzdłuż każdego podświetlonego łącznika biegną cząstki, od końca przy tabeli nadrzędnej, gdzie znajduje się klucz podstawowy, do końca przy tabeli podrzędnej. Gdy jednocześnie podświetlonych jest więcej niż 60 łączników, cząstki się zatrzymują, a podświetlenie pozostaje.

### Przyciski kafelków {#card-buttons}

Gdy wskaźnik znajduje się nad kafelkiem, na prawym końcu jego nagłówka pojawiają się dwa przyciski z ikonami, oba bez podpowiedzi:

- Ikona punktów trasy, ta sama, którą pokazuje przycisk `Flow`, zawęża tryb Przepływ do tej tabeli i tabel oddalonych od niej o jedną relację – zobacz sekcję [Skupianie widoku na tabelach](#focusing-on-tables).
- Ikona łącza zewnętrznego przełącza na kartę ERD, zaznacza tylko tę tabelę, przenosi ją na wierzch i ustawia fokus na komórce z jej nazwą, chyba że fokus ma już komórka tej tabeli. Kanwa przewija się do tabeli tylko wtedy, gdy ta nie jest już dobrze widoczna – zobacz sekcję [Dokąd prowadzi przejście](./table-related-functions.md#where-a-jump-lands). Nigdy nie rozpoczyna ani nie kończy rysowania relacji.

Naciśnięcie któregokolwiek z przycisków jest obsługiwane wyłącznie przez ten przycisk: w przeciwieństwie do naciśnięcia w innym miejscu kafelka nie zaznacza kafelka ani nie przenosi go na wierzch. Przycisk z punktami trasy pozostawia więc dotychczasowe zaznaczenie; przycisk z łączem zewnętrznym zaznacza tabelę tylko w ramach przełączenia na kartę ERD. Oba przyciski reagują wyłącznie na kliknięcie lewym przyciskiem myszy.

### Przenoszenie kafelków {#moving-cards}

Przeciągnij kafelek lewym przyciskiem myszy, chwytając go za dowolną część oprócz dwóch przycisków kafelka; przeciąganie prawym przyciskiem niczego nie przesuwa.  
Naciśnięcie kafelka zaznacza go, `Ctrl + click` (Windows/Linux) lub `⌘ + click` (Mac) dodaje go do zaznaczenia, a przeciągnięcie zaznaczonego kafelka przesuwa wszystkie zaznaczone kafelki. Zaznaczenie jest wspólne z kartą ERD, więc to, co zaznaczysz tutaj, pozostanie zaznaczone po powrocie na nią.

Kafelek przesuwa się tylko w trybie Przepływ: jego tabela pozostaje na swoim miejscu na karcie ERD.  
Przesunięty kafelek nie zmienia położenia przy przesuwaniu widoku, zmianie powiększenia i użyciu przycisku `Fit`. Wraca tam, gdzie umieścił go układ, gdy opuścisz kartę lub przełączysz się na tryb `Graph` i wrócisz, a także gdy przycisk `Show all` przywraca układ całego diagramu, który tryb Przepływ już ma. Nowy układ rozmieszcza go ponownie, uwzględniając miejsce, w którym go pozostawiono – zobacz sekcję [Jak tryb Przepływ rozmieszcza kafelki](#how-flow-is-placed).

### Skupianie widoku na tabelach {#focusing-on-tables}

Na karcie ERD zaznacz jedną lub więcej tabel i naciśnij `Alt + F` (Windows/Linux) lub `⌥ + F` (Mac) albo kliknij tabelę prawym przyciskiem myszy i wybierz `Focus on this table`.  
Karta Wizualizacja otwiera się w trybie `Flow`, zawężona do tych tabel i wszystkich tabel oddalonych o jedną relację od którejkolwiek z nich, w dowolnym kierunku. Rysowane są tylko łączniki między pokazanymi tabelami.

Gdy tabela, którą klikasz prawym przyciskiem myszy, jest jedną z kilku zaznaczonych tabel, pozycja brzmi `Focus on selected tables` i skupia widok na całym zaznaczeniu. Kliknięcie prawym przyciskiem myszy tabeli spoza zaznaczenia skupia widok tylko na tej tabeli.  
Skrót `Alt + F` uwzględnia zaznaczone tabele i pomija notatki oraz [grupy tabel](./table-groups.md). Gdy nie jest zaznaczona żadna tabela, nic nie robi, nawet jeśli zaznaczona jest grupa: najpierw wybierz `Select tables` w menu kontekstowym grupy – zobacz sekcję [Zaznaczanie grup](./table-groups.md#selecting-groups).  
Jest ignorowany podczas edycji komórki, notatki lub nazwy grupy, gdy fokus klawiatury znajduje się w [Eksploratorze](./explorer.md#keys-in-the-explorer) lub gdy otwarte jest szybkie wyszukiwanie, właściwości tabeli, podgląd różnic, podgląd Automatycznego układu, podróż w czasie, okno dialogowe [`Export image`](./file-import-export.md#image) lub okno dialogowe [`Map Columns`](./relationship-editing.md#map-columns).

W trybie Przepływ [przycisk kafelka](#card-buttons) z punktami trasy zawęża widok w ten sam sposób, do tej jednej tabeli. Przycisk `Show all` na [pasku narzędzi](#toolbar) wraca do całego diagramu.  
Zawężony widok otrzymuje własny układ i jest dopasowywany do ekranu. Pozostaje zawężony, gdy opuścisz kartę lub przełączysz się na tryb `Graph` i wrócisz, a klawisz `Escape` go nie poszerza.

![Skupianie widoku na tabeli orders za pomocą ⌥ + F, zawężanie do tabeli members przyciskiem z punktami trasy na jej kafelku, a następnie Show all](/img/demo-visualization-focus.webp)

### Jak tryb Przepływ rozmieszcza kafelki {#how-flow-is-placed}

Przy pierwszym wyświetleniu trybu `Flow` pokazywane w nim tabele są rozmieszczane poza wątkiem głównym, a wynik jest dopasowywany do ekranu.  
Układ jest przechowywany, dopóki edytor jest otwarty. Gdy opuścisz kartę lub przełączysz się na tryb `Graph` i wrócisz, tryb Przepływ użyje go ponownie, z powiększeniem i przesunięciem widoku w stanie, w jakim je pozostawiono.  
Tryb Przepływ przechowuje jeden układ dla całego diagramu i jeden dla zawężonego widoku, więc `Show all` wraca do układu całego diagramu i dopasowuje go do ekranu bez ponownego obliczania, o ile nie zmieniło się nic, na podstawie czego ten układ powstał.

Tryb Przepływ ponownie rozmieszcza kafelki, gdy:

- Naciśniesz `Tidy Up`. Wynik jest dopasowywany do ekranu.
- Zmienisz wyświetlanie wierszy lub zawęzisz widok do innych tabel. Wynik jest dopasowywany do ekranu.
- Tabele lub relacje zostaną dodane albo usunięte – na karcie ERD podczas twojej nieobecności, co zostaje uwzględnione po powrocie, lub przez współpracownika, gdy jesteś w trybie Przepływ. Powiększenie i przesunięcie widoku pozostają bez zmian.

Każdy układ uwzględnia bieżące położenie kafelków, więc `Tidy Up` niekoniecznie przywraca wcześniejsze rozmieszczenie.  
Zmiana, która tylko zmienia rozmiar kafelka, na przykład zmiana nazwy tabeli lub dodanie kolumny, nie powoduje ponownego rozmieszczenia kafelków. Jeśli kafelki zaczną na siebie nachodzić, naciśnij `Tidy Up`.

Jeśli obliczanie układu trwa dłużej niż 6 sekund, wyświetlany jest komunikat `Placing tables` z obracającym się wskaźnikiem ładowania i przyciskiem `Cancel`.  
Przycisk `Cancel` lub naciśnięcie klawisza `Escape` w dowolnym momencie obliczania układu przerywa to obliczanie; przycisk `Tidy Up` lub powrót do trybu `Flow` uruchamia je ponownie.  
Jeśli obliczenie układu się nie powiedzie – host nie uruchamia żadnego shared workera, worker nie zdoła się uruchomić albo w ciągu 60 sekund nie zostanie zwrócony żaden układ – tryb Przepływ wyświetla komunikat `Could not place tables` ze znakiem ostrzeżenia, a `Tidy Up` ponawia próbę. Zobacz sekcję [Web Workers](../../api/installation.md#web-workers).  
Tryb Przepływ rysuje tylko tabele rozmieszczone przez jego ostatni układ, zarówno w widoku całego diagramu, jak i w zawężonym widoku, więc przy pierwszym wyświetleniu może nie być żadnych kafelków, dopóki układ nie zostanie pomyślnie obliczony.  
Za każdym razem, gdy tryb Przepływ ponownie rozmieszcza kafelki, na przykład po zawężeniu widoku do innych tabel, poprzednie rozmieszczenie pozostaje na ekranie do czasu nadejścia nowego układu i zostaje na nim, jeśli ten układ zostanie anulowany lub się nie powiedzie.

Gdy cały dokument zostaje zastąpiony, na przykład przez zaimportowanie pliku, układy, skupienie widoku, wyświetlanie wierszy, powiększenie i przesunięcie widoku trybu Przepływ są odrzucane, a przy następnym otwarciu tryb Przepływ zaczyna od nowa, tak jak za pierwszym razem: z widokiem całego diagramu lub zawężonym, jeśli otworzysz go przez [skupienie widoku na tabelach](#focusing-on-tables).

### Tryb Przepływ nigdy nie zmienia dokumentu {#flow-never-edits-the-document}

Tryb Przepływ tylko odczytuje diagram. Zmiana powiększenia, przesuwanie widoku, przenoszenie kafelków, `Tidy Up`, wyświetlanie wierszy, przypięcia i skupianie widoku nie dodają niczego do [historii cofania](./undo-redo.md#what-the-history-records).  
Nie zmieniają też niczego w diagramie. Naciśnięcie kafelka przenosi wprawdzie jego tabelę na wierzch, tak samo jak kliknięcie tabeli na karcie ERD, więc tam również jest ona na wierzchu, ale kolejność warstw nie jest zapisywana – zobacz sekcję [Przenoszenie wielu tabel](./table-related-functions.md#moving-multiple-tables). Tryb `Graph` w ten sam sposób pozostawia diagram nietknięty.  
Naciśnięcie kafelka nigdy nie dodaje relacji. Jeśli opuścisz kartę ERD w trakcie rysowania relacji, naciśnięcie kafelka wybiera jego tabelę jako tabelę początkową, o ile żadna nie została jeszcze wybrana, a w przeciwnym razie kończy rysowanie.  
[Przycisk kafelka](#card-buttons) z łączem zewnętrznym idzie dalej, ponieważ wyprowadza z trybu Przepływ: gdy karta ERD musi przewinąć się do tabeli, to przewinięcie jest rejestrowane jak każda inna zmiana położenia widoku.

Zmiany współpracowników nadal docierają do diagramu, gdy jesteś w trybie Przepływ, a kafelki nadążają za dodawanymi lub usuwanymi przez nich tabelami i relacjami – zobacz sekcję [Jak tryb Przepływ rozmieszcza kafelki](#how-flow-is-placed).  
Ich zaznaczenie i obwódki fokusu są rysowane na kafelkach, ale ich kursory i ramki przeciągania już nie – zobacz stronę [Wspólna edycja](../../api/advanced/collaborative-editing.md).

Oba tryby, łącznie ze skupianiem widoku, działają również w edytorze z atrybutem `readonly`.
