---
sidebar_position: 6
description: Grupowanie powiązanych tabel i notatek w nazwanej, kolorowej ramce rysowanej za nimi; tworzenie, nazywanie, kolorowanie, przenoszenie, zmiana rozmiaru i usuwanie grup, przechodzenie do nich z Eksploratora, zmiana należących do nich tabel i notatek, ukrywanie ich oraz zachowywanie ich w Automatycznym układzie, Schemacie SQL i formacie DBML.
---

# Grupy tabel

Grupa tabel to nazwana, kolorowa ramka rysowana za powiązanymi tabelami i notatkami na kanwie ERD, aby pokazać, które z nich tworzą całość.  
Tabela lub notatka należy co najwyżej do jednej grupy. Grupy są zapisywane w diagramie wraz z informacją, do której grupy należy każda tabela i każda notatka.

Wzdłuż górnej krawędzi ramki biegnie pasek tytułu, na którym widać ikonę grupy, pogrubioną nazwę grupy, a gdy wskaźnik znajduje się nad grupą, także przycisk `x`, który ją usuwa – zobacz sekcję [Usuwanie grupy](#removing-a-group). Grupa bez nazwy wyświetla się jako `unnamed`, a nazwa zbyt długa, by zmieścić się na pasku, jest skracana znakiem `…`.  
Ramka zawsze mieści swoje tabele i notatki: zachowuje nadany jej rozmiar, ale rozciąga się tak, aby każda tabela i każda notatka była w środku z odstępem `24px` dookoła i z paskiem tytułu powyżej. Tabela lub notatka, która się powiększa, rozciąga ramkę razem ze sobą, podobnie jak ta upuszczona blisko krawędzi ze środkiem wciąż wewnątrz ramki. Podczas przeciągania tabel lub notatek ramka ani się nie powiększa, ani nie zmniejsza. Rozciągnięcie nie jest zapisywane: ramka wraca do swojego rozmiaru, gdy tylko żadna tabela ani notatka nie potrzebuje tego miejsca.

Notatki ukryte za pomocą [View Option](./table-related-functions.md#table-view-options) → `Memos` pozostają w swoich grupach: przeniesienie grupy przenosi je, usunięcie grupy je z niej wyjmuje, a cofnięcie którejkolwiek z tych czynności je przywraca.  
Tylko widoczne notatki rozciągają ramkę i zatrzymują krawędź przy zmianie rozmiaru. Również tylko one są obejmowane przez narysowaną grupę, zaznaczane pozycją `Select tables` i wyświetlane pod grupą w Eksploratorze.

Grupy są rysowane za wszystkimi innymi elementami kanwy: tabelami, notatkami i liniami relacji.  
Tam, gdzie grupy na siebie nachodzą, z przodu jest rysowana ta, którą ostatnio naciśnięto lub dodano, a wnętrze żadnej grupy nigdy nie zasłania paska tytułu innej grupy. Kolejność nie jest zapisywana, więc po ponownym otwarciu diagramu grupy układają się w kolejności, w jakiej je dodano.  
Grupy są widoczne na kanwie ERD, na minimapie i na wyeksportowanym obrazie, a [Eksplorator](./explorer.md) pokazuje je na liście – zobacz sekcję [Przechodzenie do grupy](#going-to-a-group). Karta [Wizualizacja](./visualization.md) w żadnym z trybów nie rysuje grup ani kolorów grup.

Agent kodujący również może tworzyć i zmieniać grupy oraz odczytywać kod DDL wybranych grup – zobacz sekcję [Grupy tabel](../../mcp/tools.md#table-groups) w opisie narzędzi MCP.

![Włączanie rysowania grupy skrótem ⌥ + G, rysowanie jej nad tabelami orders i payments, nadawanie jej nazwy Billing, upuszczanie do niej tabeli order_items, a następnie przenoszenie grupy i zmiana jej rozmiaru](/img/demo-table-group.webp)

## Tworzenie grupy {#creating-a-group}

Grupę można utworzyć na dwa sposoby, każdy z własnym skrótem. Żaden z nich nie jest dostępny w edytorze tylko do odczytu ani wtedy, gdy grupy są [ukryte](#hiding-groups), a ich skróty nic wtedy nie robią.  
Podobnie jak inne skróty kanwy, działają one tylko na karcie ERD i są wstrzymywane podczas edycji komórki, notatki lub nazwy grupy – zobacz sekcję [Skróty klawiaturowe](./settings.md#shortcuts).

### Rysowanie grupy {#drawing-a-group}

Kliknij przycisk `New Table Group` na [pasku narzędzi kanwy](./table-related-functions.md#canvas-toolbar), naciśnij `Alt + G` (Windows/Linux) lub `⌥ + G` (Mac) albo wybierz `New Table Group` w menu kontekstowym kanwy, gdzie ta pozycja następuje po `New Table` i `New Memo`, lub w palecie [Szybkie wyszukiwanie](./quick-search.md) na karcie ERD. Następnie przeciągnij po kanwie, aby narysować ramkę.  
Przycisk i skrót włączają i wyłączają rysowanie, więc naciśnięcie któregokolwiek z nich, gdy rysowanie jest włączone, kończy je niezależnie od tego, jak zostało rozpoczęte; pozycja menu kontekstowego i Szybkie wyszukiwanie tylko je rozpoczynają. Rozpoczęcie rysowania wyłącza narzędzie Rączka i anuluje rysowaną relację.  
Gdy rysowanie jest włączone, kursor ma postać krzyżyka, a naciśnięcie rozpoczyna ramkę w miejscu, w którym nastąpi, nawet nad tabelą, zamiast zaznaczać lub przesuwać to, co się pod nim znajduje. Pasek narzędzi kanwy wyróżnia wtedy przycisk `New Table Group`, a nie Rączkę ani wskaźnik.

Zwolnienie przycisku dodaje grupę w tej ramce, nigdy węższą niż `160px` ani niższą niż `100px`, wliczając pasek tytułu, niezależnie od tego, jak krótkie było przeciągnięcie. Kliknięcie bez przeciągania dodaje grupę o szerokości `480px` i wysokości `320px`, której lewy górny róg znajduje się w miejscu kliknięcia.  
Do grupy dołączają wszystkie tabele i widoczne notatki, które nie należą do żadnej grupy, a których środek leży wewnątrz nowej ramki. Tabela lub notatka należąca już do innej grupy w niej pozostaje.

Środkowy przycisk myszy nadal przesuwa widok kanwy i pozostawia rysowanie włączone. Następujące działania kończą rysowanie bez dodania grupy:

- `Escape` albo `Alt + G` (Windows/Linux) lub `⌥ + G` (Mac) przed naciśnięciem lub w trakcie przeciągania. Przed naciśnięciem pozostawiają zaznaczenie bez zmian; naciśnięcie rozpoczynające ramkę już je anulowało.
- Kliknięcie prawym przyciskiem myszy, które anuluje zaznaczenie. Menu kontekstowe się nie otwiera.
- Przełączenie na narzędzie Rączka klawiszem `Space` lub za pomocą paska narzędzi kanwy, kliknięcie wskaźnika lub przycisku `New Table Group` na pasku narzędzi albo rozpoczęcie rysowania relacji.
- Przejście na inną kartę, ukrycie grup lub przełączenie edytora w tryb tylko do odczytu.

### Grupowanie zaznaczonych tabel {#grouping-selected-tables}

Zaznacz jedną lub więcej tabel, a także notatki, które mają do nich dołączyć, i naciśnij `T`, a potem `G`, albo wybierz `Group selected tables` w menu kontekstowym tabeli lub notatki albo `Group Selected Tables` w Szybkim wyszukiwaniu. Menu notatki i Szybkie wyszukiwanie oferują to polecenie tylko wtedy, gdy zaznaczona jest jakaś tabela.  
Nowa grupa jest rysowana wokół zaznaczonych tabel i notatek z odstępem `24px` z każdej strony i paskiem tytułu powyżej. Każda zaznaczona tabela i notatka do niej dołącza, opuszczając grupę, do której należała, a opuszczona grupa pozostaje, nawet jeśli jest teraz pusta.

Skrót `T`, a potem `G` to dwa naciśnięcia bez klawisza modyfikującego, przy czym `G` następuje w ciągu sekundy po `T`. Gdy nie jest zaznaczona żadna tabela, skrót nic nie robi, a w polu tekstowym, takim jak pole wyszukiwania Eksploratora, wpisuje te dwie litery.

![Grupowanie tabel categories i products skrótem T, a potem G, nadawanie grupie nazwy Catalog, następnie kolorowanie jej na fioletowo z menu grupy, przez co oba nagłówki przyjmują ten kolor](/img/demo-table-group-selected.webp)

W obu przypadkach nowa grupa nie ma nazwy ani koloru. Zostaje zaznaczona jako jedyna, a nad jej paskiem tytułu otwiera się edytor nazwy, dzięki czemu możesz od razu wpisać nazwę – zobacz sekcję [Nazywanie grupy](#naming-a-group).  
Grupa wraz z tabelami i notatkami, które obejmuje, stanowi jeden krok cofania, a wpisana nazwa – kolejny.

## Nazywanie grupy {#naming-a-group}

Nazwę grupy edytuje się w polu, które otwiera się nad jej paskiem tytułu. Pole otwiera się samo po utworzeniu grupy, po dwukrotnym kliknięciu paska tytułu oraz po wybraniu pozycji `Rename` w menu kontekstowym grupy.  
Klawisz `Enter`, kliknięcie w innym miejscu albo ukrycie grup, bez względu na to, czy to ty je ukryjesz, czy współpracownik, zapisuje nazwę. Klawisz `Escape` zamyka pole bez zmiany nazwy i pozostawia grupę zaznaczoną, a drugie naciśnięcie klawisza `Escape` anuluje zaznaczenie.  
Zmiana nazwy stanowi jeden krok cofania; zapisanie niezmienionej nazwy niczego nie rejestruje. Pusta nazwa lub nazwa złożona z samych białych znaków wyświetla się jako `unnamed`.  
Gdy pole jest otwarte, skróty kanwy są wstrzymane, a skróty Szybkiego wyszukiwania i polecenia `Toggle Explorer` nic nie robią, tak jak podczas edycji komórki tabeli.  
Gdy współpracownik lub agent kodujący zastępuje diagram, podczas gdy pole jest otwarte, pole pozostaje otwarte, dopóki nowy diagram nadal zawiera grupę i pokazuje grupy.  
Jeśli nowy diagram nie zawiera już grupy, pole zamyka się i niczego nie zapisuje; jeśli zawiera grupę, ale ukrywa grupy, pole zamyka się i zapisuje zmienioną nazwę.  
Ponowne wczytanie diagramu do edytora, jak robi to aplikacja Obsidian, gdy plik zmienia się poza nią, zamyka pole i odrzuca wpisaną nazwę. Klawisze naciśnięte potem nigdzie nie trafiają, dopóki nie klikniesz edytora, więc naciśnięcie klawisza `Delete` lub `Backspace` przeznaczone dla nazwy niczego nie usuwa.

Funkcja [Znajdź i zamień](./find-and-replace.md#what-it-searches) przeszukuje nazwy grup w ramach opcji `Table group names`, gdy grupy są widoczne, a jej operacje `Replace` i `Replace All` zmieniają nazwy grup – zobacz sekcję [Zamiana](./find-and-replace.md#replacing). [Szybkie wyszukiwanie](./quick-search.md#searching-the-diagram) nie przeszukuje nazw grup.

## Kolorowanie grupy {#coloring-a-group}

Wybierz `Color` w menu kontekstowym grupy, aby otworzyć selektor kolorów ustawiony na kolor grupy.  
Tak jak w przypadku tabel i notatek, selektor koloruje każdą zaznaczoną tabelę, notatkę i grupę, a pozycja `Remove color` w menu lub opcja `No color` w selektorze usuwa kolor z nich wszystkich – zobacz sekcję [Ustawianie kolorów tabel i notatek](./table-related-functions.md#table-and-memo-color-specification). Kolor grupy jest też dostępny w sekcji `Document colors` selektora.

Grupa z ustawionym kolorem rysuje pasek tytułu i obrys w tym kolorze, a wnętrze w jego bladym odcieniu. Grupa bez koloru używa neutralnych odcieni szarości motywu.  
Każda tabela w grupie z kolorem ma kolor grupy na całym nagłówku, a własny kolor zachowuje na lewej krawędzi, dzięki czemu widać oba.  
Każda notatka w grupie z kolorem ma kolor grupy na całym pasku nagłówka nad swoim tekstem, a własny kolor zachowuje na pasku koloru wzdłuż swojej górnej krawędzi, dzięki czemu widać oba.  
Tekst i przyciski na takim nagłówku stają się białe, a czarne na jasnym kolorze, na którym czarny jest znacznie czytelniejszy; tak samo zmieniają się przycisk `x` notatki oraz nazwa, ikona i przycisk `x` na pasku tytułu grupy. Wśród predefiniowanych próbek kolorów selektora czarny otrzymują Orange, Amber, Yellow i Lime, a pozostałe – biały.  
Tabela zachowuje własny nagłówek, gdy jej grupa nie ma koloru, gdy grupy są ukryte, przy powiększeniu `70%` i mniejszym, przy którym tabele zwijają się do samej nazwy, oraz na karcie Wizualizacja.  
Notatka zachowuje własny nagłówek, gdy jej grupa nie ma koloru lub gdy grupy są ukryte. Notatki nigdy się nie zwijają, więc notatka ma kolor grupy na pasku nagłówka przy każdym powiększeniu.

Zmiana koloru jest rejestrowana w [historii cofania](./undo-redo.md#one-gesture-one-step) tak samo jak w przypadku tabel i notatek.

## Zaznaczanie grup {#selecting-groups}

Kliknij pasek tytułu grupy, aby zaznaczyć tylko tę grupę, albo użyj kombinacji `Ctrl + click` (Windows/Linux) lub `⌘ + click` (Mac), aby dodać ją do zaznaczenia.  
Naciśnięcie paska tytułu grupy, która jest już zaznaczona, zachowuje całe zaznaczenie, więc przeciągnięcie przesuwa wtedy całość.  
Naciśnięcie paska tytułu lub kliknięcie grupy prawym przyciskiem myszy przenosi grupę przed pozostałe grupy, a jej tabele i notatki przed wszystkie inne tabele i notatki.

Wnętrze, czyli obszar pod paskiem tytułu, działa dla lewego przycisku myszy jak kanwa: przeciąganie go przesuwa widok, `Ctrl + drag` (Windows/Linux) lub `⌘ + drag` (Mac) rysuje ramkę zaznaczenia, a kliknięcie anuluje zaznaczenie. Tabele, notatki i linie relacji nad wnętrzem reagują na wskaźnik jak zwykle.

Ramka zaznaczenia obejmuje grupę tylko wtedy, gdy otacza całą jej ramkę, więc ramka narysowana wewnątrz grupy wybiera tabele i notatki bez grupy – zobacz sekcję [Zaznaczanie wielu elementów](./table-related-functions.md#multiple-selection).  
Skrót `Ctrl + A` (Windows/Linux) lub `⌘ + A` (Mac) nigdy nie zaznacza grupy.

Pozycja `Select tables` w menu kontekstowym grupy zastępuje zaznaczenie tabelami i widocznymi notatkami grupy, pomijając samą grupę, więc następne polecenie dotyczy tylko ich.  
Użyj jej przed poleceniami, które pomijają zaznaczoną grupę, takimi jak kopiowanie czy [skupianie widoku na tabelach](./table-related-functions.md#focusing-on-tables).

Obrys zaznaczonej grupy przyjmuje kolor zaznaczenia. W [sesji wspólnej edycji](../../api/advanced/collaborative-editing.md) grupa zaznaczona przez innego uczestnika jest obrysowana kolorem tego uczestnika.

## Przechodzenie do grupy {#going-to-a-group}

[Eksplorator](./explorer.md#the-tree) wyświetla grupy w swoim folderze `Table Groups` według nazwy, każdą z jej tabelami i widocznymi notatkami pod nią. Szybkie wyszukiwanie nie wyświetla grup.

Wybranie wiersza grupy w Eksploratorze, dopasowania w nazwie grupy w funkcji [Znajdź i zamień](./find-and-replace.md#going-to-a-match) lub wiersza grupy na liście w [Podglądzie różnic](./table-related-functions.md#the-change-tree) powoduje przejście do tej grupy.  
Przejście przesuwa widok na ramkę grupy, a gdy ramka jest wyższa niż kanwa, kieruje się jej paskiem tytułu – zobacz sekcję [Dokąd prowadzi przejście](./table-related-functions.md#where-a-jump-lands). Następnie zaznacza tylko tę grupę i przenosi ją wraz z jej tabelami i notatkami na wierzch, tak jak naciśnięcie jej paska tytułu.  
Gdy grupy są [ukryte](#hiding-groups) lub gdy grupa została usunięta, przejście do niej nic nie robi.  
W Podglądzie różnic każda strona przechodzi do grupy tylko wtedy, gdy jej własny dokument zawiera tę grupę i ją pokazuje – zobacz sekcję [Przechodzenie do zmiany](./table-related-functions.md#going-to-a-change).

## Przenoszenie grupy i zmiana jej rozmiaru {#moving-and-resizing-a-group}

Przeciągnij grupę za pasek tytułu, aby przenieść ją razem ze wszystkimi jej tabelami i notatkami.  
Jeśli grupa jest częścią większego zaznaczenia, całe zaznaczenie przesuwa się razem z nią, a tabela lub notatka, która jest zarówno zaznaczona, jak i należy do grupy, przesuwa się tylko raz.  
Przeciąganie zaczyna się dopiero wtedy, gdy wskaźnik przesunie się o kawałek, więc kliknięcie lub dwukrotne kliknięcie paska tytułu pozostaje kliknięciem. Kombinacja `Alt + drag` na pasku tytułu przenosi grupę tak samo jak zwykłe przeciągnięcie; grupa nigdy nie jest duplikowana.  
Przeniesienie wraz ze wszystkimi przenoszonymi tabelami i notatkami stanowi jeden krok cofania.

Przeciągnięcie samej tabeli lub notatki przenosi tylko ją i może ją przenieść do grupy lub z niej wyjąć – zobacz sekcję [Dodawanie i usuwanie tabel](#adding-and-removing-tables).

Każda grupa, zaznaczona czy nie, ma uchwyty zmiany rozmiaru na czterech krawędziach i w czterech narożnikach, tak jak notatka.  
Przeciągnij jeden z nich lewym przyciskiem myszy: ramka podąża za wskaźnikiem, a nowy rozmiar zapisuje się po zwolnieniu przycisku jako jeden krok cofania.  
Grupy nie można zmniejszyć poniżej `160px` na `100px` ani poniżej rozmiaru jej tabel i widocznych notatek wraz z odstępem `24px` i paskiem tytułu. Krawędź zatrzymuje się w tym miejscu, niezależnie od tego, jak daleko przesunie się wskaźnik.

## Dodawanie i usuwanie tabel {#adding-and-removing-tables}

Tabela lub notatka dołącza do grupy albo ją opuszcza zależnie od miejsca, w którym ją upuścisz.  
Gdy przeciągniesz tabele lub notatki i zwolnisz przycisk, o przynależności każdej przeciąganej tabeli i notatki, których nie przenosi zaznaczona grupa, decyduje jej środek. Tabela lub notatka dołącza do położonej najwyżej grupy, której ramka zawiera jej środek, albo opuszcza swoją grupę, jeśli jej środek nie leży w ramce żadnej grupy. Grupa położona najwyżej to ta, która jest rysowana z przodu.  
Grupa, której przeciąganie nie przesuwa, zachowuje ramkę z chwili rozpoczęcia przeciągania, więc tabela lub notatka lekko przesunięta w obrębie własnej grupy w niej pozostaje, a żeby opuściła grupę, trzeba ją przeciągnąć tak, aby jej środek znalazł się poza tą ramką.  
Podczas przeciągania obrysowana jest każda grupa, do której upuszczenie przeniosłoby tabelę lub notatkę.

Jeśli zwolnisz przycisk w ciągu około `200ms` od ostatniego ruchu, zmiana grupy jest częścią kroku cofania przeciągnięcia, więc jedno cofnięcie przywraca tabele i notatki na ich miejsca i do grup, w których były. Po dłuższej przerwie przed zwolnieniem przycisku zmiana grupy stanowi osobny krok – zobacz sekcję [Jeden gest, jeden krok](./undo-redo.md#one-gesture-one-step).  
Kliknięcie lub przeciągnięcie o kilka pikseli nie zmienia przynależności do grup, a gdy grupy są ukryte, nic jej nie zmienia.

Inne sposoby zmiany tego, które tabele i notatki należą do grupy:

- Pozycja `Remove from group` w menu kontekstowym tabeli lub notatki wyjmuje każdą zaznaczoną tabelę i notatkę z jej grupy. Jest widoczna, gdy zaznaczona tabela lub notatka należy do grupy, nawet gdy grupy są ukryte, i stanowi jeden krok cofania.
- Pozycja `Group selected tables` przenosi zaznaczone tabele oraz notatki zaznaczone razem z nimi do nowej grupy – zobacz sekcję [Grupowanie zaznaczonych tabel](#grouping-selected-tables).
- Usunięcie grupy sprawia, że jej tabele i notatki nie należą do żadnej grupy.

Tabela lub notatka wklejona albo zduplikowana za pomocą klawisza `Alt` nie należy do żadnej grupy, nawet jeśli znajdzie się wewnątrz ramki grupy. Gdy ją potem przeciągniesz, obowiązuje reguła upuszczania.

![Przeciąganie notatki do grupy Billing, dzięki czemu jej nagłówek przyjmuje turkusowy kolor grupy, a ramka rozciąga się wokół niej, przenoszenie grupy razem z notatką, a następnie wyjmowanie notatki pozycją Remove from group w jej menu](/img/demo-table-group-memo.webp)

## Usuwanie grupy {#removing-a-group}

Usunięcie grupy nigdy nie usuwa jej tabel ani notatek: pozostają na swoich miejscach, poza jakąkolwiek grupą.

- Przycisk `x` na końcu paska tytułu, widoczny, gdy wskaźnik znajduje się nad grupą, usuwa tylko tę grupę.
- Pozycja `Delete` w menu kontekstowym grupy usuwa grupę. Gdy grupa jest jednym z kilku zaznaczonych elementów, pozycja brzmi `Delete selected` i usuwa wszystko, co jest zaznaczone: tabele, notatki i grupy.
- Gdy zaznaczone są grupy, klawisz `Delete` lub `Backspace` usuwa zaznaczone grupy wraz ze wszystkimi zaznaczonymi tabelami i notatkami, podobnie jak skróty `Ctrl + Backspace` i `Ctrl + Delete` (Windows/Linux) lub `⌘ + Backspace` i `⌘ + Delete` (Mac) – zobacz sekcję [Usuwanie tabel i notatek](./table-related-functions.md#table-and-memo-deletion).

Każde usunięcie stanowi jeden krok cofania: jedno cofnięcie przywraca grupę wraz z jej tabelami i notatkami.

## Menu grupy {#the-group-menu}

Kliknij prawym przyciskiem myszy pasek tytułu, wnętrze lub krawędź grupy, aby otworzyć jej menu. Na komputerze Mac otwiera je też `Ctrl + click`, a na ekranie dotykowym – przytrzymanie.  
Kliknięcie prawym przyciskiem myszy najpierw zaznacza grupę, tylko ją, chyba że należy już do zaznaczenia, więc pozycje `Color` i `Delete selected` obejmują resztę zaznaczenia tylko wtedy, gdy grupa do niego należała.

- `Select tables`: zaznacza same tabele i widoczne notatki grupy – zobacz sekcję [Zaznaczanie grup](#selecting-groups).
- `Rename`: otwiera edytor nazwy – zobacz sekcję [Nazywanie grupy](#naming-a-group).
- `Color`: otwiera selektor kolorów – zobacz sekcję [Kolorowanie grupy](#coloring-a-group).
- `Remove color`: widoczna, gdy któryś z zaznaczonych elementów ma kolor.
- `Delete` lub `Delete selected`, gdy grupa jest jednym z kilku zaznaczonych elementów, z klawiszem `Delete` widocznym po prawej stronie – zobacz sekcję [Usuwanie grupy](#removing-a-group).

Menu kontekstowe tabeli lub notatki zawiera dodatkowo pozycje `Group selected tables` i `Remove from group` po `Color` i `Remove color`, przed swoją pozycją Delete, a menu kontekstowe kanwy – pozycję `New Table Group`.  
Przy pozycji `Group selected tables` po prawej stronie widać jej klawisze, `T`, a potem `G`, a przy pozycji `New Table Group` – `Alt + G` (Windows/Linux) lub `⌥ + G` (Mac).

## Ukrywanie grup {#hiding-groups}

Pozycja `View Option` → `Table Groups` w menu kontekstowym kanwy pokazuje lub ukrywa wszystkie grupy. Domyślnie jest zaznaczona – zobacz sekcję [Opcje widoku tabel](./table-related-functions.md#table-view-options).  
Gdy jest odznaczona, ramki grup znikają z kanwy, minimapy i eksportowanych obrazów, a paski przewijania i minimapa przestają uwzględniać miejsce zajmowane przez grupy. Tabele i notatki tracą kolory grup na nagłówkach. Nic się nie przesuwa ani nie zmienia rozmiaru, a każda tabela i notatka pozostaje w swojej grupie.  
Ukrycie grup anuluje ich zaznaczenie, kończy rysowanie rozpoczęte poleceniem `New Table Group` i zamyka otwarty edytor nazwy tak jak kliknięcie w innym miejscu – zobacz sekcję [Nazywanie grupy](#naming-a-group).

Gdy grupy są ukryte:

- Pozycje `New Table Group` i `Group selected tables` nie są dostępne w menu ani polecenia `New Table Group` i `Group Selected Tables` w Szybkim wyszukiwaniu, a na pasku narzędzi kanwy brakuje przycisku `New Table Group`. Pozycja `Remove from group` jest nadal dostępna.
- Skróty `Alt + G` (Windows/Linux) lub `⌥ + G` (Mac) oraz `T`, a potem `G` nic nie robią.
- Przeciąganie tabel lub notatek nie zmienia przynależności do grup, a ramka zaznaczenia nie obejmuje żadnej grupy.
- Eksplorator pomija folder `Table Groups`, a funkcja Znajdź i zamień ani nie znajduje, ani nie zamienia nazw grup, nawet z włączoną opcją `Table group names`.
- [Automatyczny układ](#auto-layout) nadal utrzymuje razem tabele i notatki każdej grupy, karta Schemat SQL nadal oferuje [grupy do wyboru](#schema-sql-by-group), format DBML nadal je zapisuje, a operacja [Importuj i dodaj](./file-import-export.md#import-and-add) nadal umieszcza elementy poniżej ukrytych ramek.

Wybór jest zapisywany w dokumencie i rejestrowany w [historii cofania](./undo-redo.md#what-the-history-records), tak jak inne przełączniki Opcji widoku. W edytorze tylko do odczytu pozostaje on zamiast tego na tym ekranie – zobacz sekcję [Edytory tylko do odczytu](#read-only-editors).

## Automatyczny układ {#auto-layout}

Każdy z układów funkcji [Automatyczny układ](./table-related-functions.md#auto-layout) utrzymuje razem tabele i notatki każdej grupy, niezależnie od tego, czy grupy są widoczne.

- `Force` przesuwa każdą grupę wraz z jej tabelami i notatkami jako jedną ramkę, przy czym każdy element zachowuje swoje miejsce w jej wnętrzu, i utrzymuje ramkę każdej grupy w odległości co najmniej `100px` od innych grup i od tabel nienależących do żadnej grupy. Podgląd pokazuje każdą grupę w miejscu, do którego trafi.
- `Flow`, `Tree - vertical` i `Tree - horizontal` rozmieszczają tabele każdej grupy wewnątrz grupy, z jej widocznymi notatkami ułożonymi obok nich, i ustawiają grupy według relacji między nimi, a tabele nienależące do żadnej grupy rozmieszczają wokół nich.

Potem każdą grupę zawierającą tabele dopasowuje się do nich i do jej widocznych notatek: jej ramka przyjmuje ich granice z odstępem `24px` i paskiem tytułu. Grupa bez tabel zachowuje swoje położenie i rozmiar, a notatki w niej pozostają tam, gdzie są.  
Ukryta notatka przesuwa się razem z tabelami swojej grupy, ale nie zajmuje miejsca.  
Rozmieszczenie tabel, notatek i grup stanowi jeden krok cofania.

Import z formatu DBML w ten sam sposób dopasowuje każdą grupę do jej tabel, niezależnie od tego, gdzie zostaną umieszczone – zobacz sekcję [DBML](./file-import-export.md#dbml).

## Schemat SQL według grup {#schema-sql-by-group}

Karta [Schemat SQL](./schema-sql.md) może generować kod wyłącznie dla tabel wybranych grup.  
Gdy dokument zawiera grupę, widoczną lub ukrytą, panel opcji tej karty pokazuje wiersz `Tables` w sekcji `This window only` z polem wyboru `All`, osobnym polem dla każdej grupy oraz polem `No group` dla tabel nienależących do żadnej grupy – zobacz sekcję [Tabele](./schema-sql.md#tables).  
Wybór dotyczy okna edytora i nie jest zapisywany w dokumencie.

## Import, eksport i kopiowanie {#import-export-and-copying}

- Format DBML przenosi grupy w obu kierunkach, z ich tabelami, ale bez notatek. Import z formatu DBML zamienia każdy blok `TableGroup` w grupę – zobacz sekcję [DBML](./file-import-export.md#dbml) – a język `DBML` w Generatorze kodu zapisuje blok `TableGroup` dla każdej grupy, która zawiera tabelę – zobacz sekcję [Generator kodu](./code-generator.md#language).
- Plik JSON zachowuje swoje grupy wraz z tabelami i notatkami w każdej z nich. Żaden inny format ich nie przenosi: importy z formatów SQL, GraphQL i AML nie wnoszą żadnych grup, a Schemat SQL i pozostałe formaty docelowe Generatora kodu żadnych nie zapisują.
- Operacja [Importuj i dodaj](./file-import-export.md#import-and-add) wprowadza grupy z pliku jako nowe grupy zawierające ich tabele i notatki i, gdy grupy są widoczne, zaznacza je razem z nowymi tabelami i widocznymi notatkami, więc przeciągnięcie dodanego bloku przenosi także jego grupy.
- [Wyeksportowany obraz](./file-import-export.md#image) pokazuje widoczne grupy za tabelami i notatkami, z kolorami grup na nagłówkach tabel i notatek.
- Ani kopiowanie i wklejanie, ani duplikowanie za pomocą klawisza `Alt` nigdy nie kopiuje grupy – zobacz sekcje [Kopiowanie/wklejanie tabel i notatek](./table-related-functions.md#copyingpasting-tables-and-memos) i [Dodawanie i usuwanie tabel](#adding-and-removing-tables).

## Edytory tylko do odczytu {#read-only-editors}

W edytorze z atrybutem [`readonly`](../../api/erd-editor-element.md#readonly) grupy są rysowane i wyświetlane w Eksploratorze jak zwykle i można do nich przechodzić, ale nie można ich zmieniać:

- [Przejście do grupy](#going-to-a-group) zaznacza ją i jest to jedyny sposób, w jaki grupa jest tam zaznaczana. Naciśnięcie paska tytułu niczego nie zaznacza i niczego nie przesuwa: przeciągnięty przesuwa kanwę, a kliknięcie, które nie przesuwa widoku, zdejmuje zaznaczenie pozostawione przez przejście.
- Nie ma uchwytów zmiany rozmiaru ani przycisku `x`, a dwukrotne kliknięcie paska tytułu nie otwiera edytora nazwy.
- Kliknięcie grupy lub notatki prawym przyciskiem myszy nie otwiera żadnego menu, a menu tabeli zawiera tylko pozycję `Table Properties`.
- Menu kanwy nie zawiera pozycji `New Table Group`, a Szybkie wyszukiwanie nie wyświetla żadnego z dwóch poleceń dotyczących grup. Rysowanie rozpoczęte poleceniem `New Table Group` kończy się w chwili przełączenia edytora w tryb tylko do odczytu.
- [Pasek narzędzi kanwy](./table-related-functions.md#canvas-toolbar) zachowuje tylko swoje kontrolki widoku, więc nie ma przycisku `New Table Group`, a skróty `Alt + G` (Windows/Linux) lub `⌥ + G` (Mac) oraz `T`, a potem `G` nic nie robią.
- Przeciąganie tabel, notatek lub grupy trwające w chwili przełączenia edytora w tryb tylko do odczytu zatrzymuje się tam, gdzie jest, i nie zmienia żadnej grupy, a zmiana rozmiaru grupy w toku kończy się bez zmiany rozmiaru.
- `View Option` → `Table Groups` pokazuje lub ukrywa grupy tylko na tym ekranie, jak każda Opcja widoku: dokument, współpracownicy i historia cofania zachowują wybór bez zmian, a gdy edytor znów umożliwi zapis, wraca wybór dokumentu.
- Wybór w wierszu `Tables` na karcie Schemat SQL nadal działa.
