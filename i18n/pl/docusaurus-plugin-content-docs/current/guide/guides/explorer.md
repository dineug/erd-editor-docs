---
sidebar_position: 8
description: Przeglądanie tabel diagramu wraz z ich kolumnami, indeksami i kluczami obcymi, jego grup tabel i notatek w drzewie zadokowanym obok kanwy ERD oraz przechodzenie do każdego z tych elementów jednym kliknięciem.
---

# Eksplorator

Eksplorator to panel zadokowany przy lewej krawędzi kanwy ERD, który przedstawia diagram w postaci drzewa: jego tabele, każdą z jej kolumnami, indeksami i kluczami obcymi, następnie jego [grupy tabel](./table-groups.md), a potem notatki. Kliknij wiersz, aby przejść do odpowiadającego mu elementu na kanwie.  
Eksplorator zwęża kanwę, a nie ją zasłania. Jest częścią edytora diagramów, a nie widokiem Explorer w VS Code ani eksploratorem plików aplikacji Obsidian.

![Otwieranie Eksploratora z paska narzędzi, przechodzenie do tabeli products, a potem do kolumny status i klucza obcego member_id tabeli orders, zwijanie przyciskiem Collapse All, poszerzanie panelu i jego zamykanie](/img/demo-explorer.webp)

Na górze panelu, między paskiem tytułu a drzewem, znajduje się funkcja [Znajdź i zamień](./find-and-replace.md). Gdy pole wyszukiwania zawiera tekst, drzewo pokazuje tylko to, co pasuje – zobacz sekcję [Wyniki](./find-and-replace.md#the-results).  
Samo drzewo nigdy nie zmienia diagramu: nie oferuje zmiany nazwy, przeciągania, usuwania ani pokazywania i ukrywania. Zamiana to jedyna zmiana, jaką wprowadza panel.

Własny stan Eksploratora należy wyłącznie do ciebie: to, czy jest otwarty, jego szerokość, zwinięcie wierszy, wiersz z fokusem klawiatury, miejsce, do którego jest przewinięty, oraz wyszukiwanie.  
Żaden z tych elementów nie jest zapisywany w pliku, rejestrowany w historii cofania, udostępniany współpracownikom ani przechowywany w przeglądarce. Stan jest zachowywany, dopóki edytor pozostaje otwarty, również przy przełączaniu kart i między dokumentami wczytywanymi do tego samego edytora. Nowo otwarty edytor uruchamia się z zamkniętym Eksploratorem.

## Otwieranie i zamykanie {#opening-and-closing}

Otwórz go jednym z tych sposobów:

- Przycisk `Explorer` na pasku narzędzi, tuż za przyciskiem `Search`, z ikoną drzewa. Jego podpowiedź brzmi `Explorer (Ctrl + F)` (Windows/Linux) lub `Explorer (⌘ + F)` (Mac).
- Skrót `Ctrl + F` (Windows/Linux) lub `⌘ + F` (Mac), który na karcie [Skróty klawiaturowe](./settings.md#shortcuts) w Ustawieniach nosi nazwę `Toggle Explorer`.
- Polecenie `Toggle Explorer` w palecie [Szybkie wyszukiwanie](./quick-search.md), dostępne na każdej karcie. Pojawia się po wpisaniu `find`, `replace`, `rename`, `tree`, `outline` lub `objects`.
- Pozycja `Toggle Explorer` w menu kontekstowym kanwy: kliknij prawym przyciskiem myszy puste miejsce na kanwie ERD poza jakąkolwiek [grupą tabel](./table-groups.md). Znajduje się za pozycjami `New Table`, `New Memo` i `New Table Group`, przed pozycją `Relationship`.

Obie pozycje `Toggle Explorer` pokazują skrót po prawej stronie.  
Przycisk na pasku narzędzi, skrót i pozycja w Szybkim wyszukiwaniu działają na każdej karcie. Na karcie Wizualizacja, Schemat SQL, Generator kodu lub Ustawienia najpierw przełączają na kartę ERD, ponieważ Eksplorator jest widoczny tylko tam.

Przycisk na pasku narzędzi tylko otwiera i zamyka panel. Nie umieszcza kursora tekstowego w polu wyszukiwania i pozostawia otwarte Właściwości tabeli, kreator motywu oraz selektor `Display Language`.  
Skrót i obie pozycje `Toggle Explorer` otwierają Eksplorator z aktywnym wyszukiwaniem: kursor tekstowy trafia do pola wyszukiwania z zaznaczonym tekstem, a każde z pięciu okien dialogowych wymienionych w sekcji [Okna dialogowe obok Eksploratora](#dialogs-beside-it) się zamyka. To, co wyszukiwanie zachowuje między otwarciami, opisano w sekcji [Otwieranie i zamykanie](./find-and-replace.md#opening-and-closing) na stronie Znajdź i zamień.  
Skrót nic nie robi podczas edycji komórki tabeli, notatki lub nazwy grupy tabel.

Przycisk na pasku narzędzi wygląda na wciśnięty, gdy Eksplorator jest otwarty na karcie ERD i nie jest ukryty przez [tryb zen](#when-it-stands-aside). Gdy tak jest, przycisk, skrót i każda z pozycji `Toggle Explorer` zamykają Eksplorator, a fokus klawiatury, jeśli był w panelu, wraca do edytora.  
Skrót nigdy nie zamyka Eksploratora, gdy otwarte jest Szybkie wyszukiwanie lub jedno z pięciu okien dialogowych. Zamiast tego zamyka paletę lub okno dialogowe i przenosi fokus klawiatury do pola wyszukiwania, zaznaczając jego tekst i, jeśli Eksplorator był już widoczny, zachowując bieżące dopasowanie. Pozycja `Toggle Explorer` w Szybkim wyszukiwaniu nie robi takiego wyjątku: jej uruchomienie zamyka paletę, a następnie otwarty Eksplorator.

Przycisk `x` na pasku tytułu, którego podpowiedź brzmi `Close`, również zamyka Eksplorator i przekazuje fokus klawiatury kanwie. Klawisz `Escape` go nie zamyka – zobacz sekcję [Klawisze w Eksploratorze](#keys-in-the-explorer).  
Po ponownym otwarciu Eksplorator wraca z tą samą szerokością, z drzewem zwiniętym i przewiniętym tak jak wcześniej oraz z tym samym wyszukiwanym tekstem. Otwarty skrótem lub pozycją `Toggle Explorer` ponownie wyszukuje ten tekst, z rozwiniętymi wszystkimi wynikami – zobacz sekcję [Wyniki](./find-and-replace.md#the-results).

Gdy skrót lub pozycja `Toggle Explorer` otwiera Eksplorator w edytorze zbyt wąskim, aby go pomieścić, wyświetla się powiadomienie `Widen the window to show the Explorer`, a fokus klawiatury pozostaje tam, gdzie był – zobacz sekcję [Obok kanwy](#beside-the-canvas).  
Eksplorator jest mimo to otwarty, z wciśniętym przyciskiem na pasku narzędzi, i pojawia się z już wykonanym wyszukiwaniem, gdy tylko edytor stanie się wystarczająco szeroki, nie przejmując przy tym fokusu klawiatury. Otwarcie go przyciskiem na pasku narzędzi nie wyświetla powiadomienia.

## Obok kanwy {#beside-the-canvas}

Eksplorator biegnie wzdłuż lewej krawędzi karty ERD, poniżej paska narzędzi, przez całą wysokość kanwy.  
Kanwa zwęża się, aby zrobić dla niego miejsce, więc żadna część diagramu nie leży pod panelem, a [pasek narzędzi kanwy](./table-related-functions.md#canvas-toolbar), minimapa i [ekran powitalny](./editing-start.md#welcome-screen) znajdują się na kanwie obok niego.  
Otwarcie, zamknięcie lub zmiana rozmiaru Eksploratora nie przewija diagramu i niczego nie rejestruje w [historii cofania](./undo-redo.md#what-the-history-records).

W nowo otwartym edytorze ma początkowo szerokość `260px`. Przeciągnij jego prawą krawędź, aby ustawić dowolną szerokość od `200px` do `480px`, lub kliknij krawędź dwukrotnie, aby wrócić do wartości `260px`.

Obok Eksploratora kanwa zawsze zachowuje co najmniej `320px` szerokości:

- W edytorze węższym niż szerokość Eksploratora plus `320px` Eksplorator jest rysowany jako węższy, tak aby się zmieścić, ale nie węższy niż `200px`.
- W edytorze węższym niż `520px` Eksplorator ustępuje miejsca. Nie jest rysowany, ale pozostaje otwarty, więc przycisk na pasku narzędzi nadal wygląda na wciśnięty, a jego naciśnięcie zamyka Eksplorator. Gdy edytor stanie się wystarczająco szeroki, Eksplorator wraca z własną szerokością.

Liczy się szerokość samego edytora, a nie okna przeglądarki, mimo że powiadomienie opisane w sekcji [Otwieranie i zamykanie](#opening-and-closing) mówi o oknie.

W [języku wyświetlania pisanym od prawej do lewej](./language-and-theme.md#right-to-left-languages) Eksplorator pozostaje po lewej stronie kanwy, ponieważ kanwa nigdy nie jest odbijana lustrzanie.  
Jego zawartość czyta się od prawej do lewej: pasek tytułu, wyszukiwanie i wiersze są odbite lustrzanie, a wiersze są wcinane od prawej. Przeciągana krawędź pozostaje po jego prawej stronie, przy kanwie. Typy danych, kolumny indeksów i tekst kluczy obcych zachowują kolejność od lewej do prawej.

## Kiedy Eksplorator ustępuje miejsca {#when-it-stands-aside}

Eksplorator jest widoczny tylko na karcie ERD.  
Przejście na inną kartę ukrywa go, a przycisk na pasku narzędzi przestaje wyglądać na wciśnięty. Po powrocie na kartę ERD Eksplorator pojawia się znowu w takim stanie, w jakim go zostawiono, tak samo zwinięty i przewinięty.

Gdy otwarty jest [podgląd różnic](./table-related-functions.md#diff-viewer), [podróż w czasie](./undo-redo.md#time-travel) lub podgląd funkcji [Automatyczny układ](./table-related-functions.md#auto-layout), nic nie otwiera ani nie zamyka Eksploratora:

- Otwarty Eksplorator jest ukryty i pojawia się ponownie po ich zamknięciu.
- Przycisk na pasku narzędzi jest przyciemniony i nic nie robi.
- Szybkie wyszukiwanie pomija polecenie `Toggle Explorer`.
- Skrót jest pozostawiany przeglądarce lub hostowi – zobacz sekcję [Pasek wyszukiwania przeglądarki](./find-and-replace.md#the-browsers-find-bar).

Podgląd różnic wyświetla swoje zmiany w drzewie tego samego rodzaju – zobacz sekcję [Podgląd różnic](./table-related-functions.md#diff-viewer).

Włączenie [trybu zen](./table-related-functions.md#canvas-toolbar) skrótem `Alt + Z` (Windows/Linux) lub `⌥ + Z` (Mac) ukrywa otwarty Eksplorator bez zamykania go, a wyłączenie trybu zen przywraca Eksplorator.  
W trybie zen skrót i obie pozycje `Toggle Explorer` nadal otwierają Eksplorator z aktywnym wyszukiwaniem, a tryb zen pozostaje włączony. Eksplorator zajmuje wtedy całą wysokość edytora, ponieważ górnego paska narzędzi nie ma, i pozostaje widoczny po wyłączeniu trybu zen. Ponowne włączenie trybu zen znowu go ukrywa.

Ilekroć panel znika, gdy jest w nim fokus klawiatury, niezależnie od tego, czy został zamknięty, ukryty, czy ustąpił miejsca, fokus klawiatury wraca do edytora.

## Drzewo {#the-tree}

Pasek tytułu zawiera napis `Explorer` i dwa przyciski: `Collapse All` oraz `x`, który zamyka Eksplorator. Poniżej znajduje się wyszukiwanie – zobacz stronę [Znajdź i zamień](./find-and-replace.md) – a pod nim drzewo.

Najwyższy poziom zawiera trzy foldery, w tej kolejności: `Tables`, `Table Groups` i `Memos`. Pod każdą tabelą znajdują się jej własne foldery `Columns`, `Indexes` i `Foreign Keys`.  
Pusty folder nie jest wyświetlany, więc pusty diagram nie pokazuje żadnych wierszy. Folder `Table Groups` jest też pomijany, gdy [View Option](./table-related-functions.md#table-view-options) → `Table Groups` ukrywa grupy, a folder `Memos` – gdy View Option → `Memos` ukrywa notatki.  
Wiersz folderu pokazuje ikonę folderu, jego nazwę, a na samym końcu licznik wierszy znajdujących się bezpośrednio pod nim, więc licznik obok folderu `Tables` to liczba tabel w diagramie.

Tabele są uporządkowane według nazwy bez uwzględniania wielkości liter, a tabele o tej samej nazwie zachowują kolejność z dokumentu. Grupy tabel są uporządkowane w ten sam sposób, podobnie jak tabele pod każdą grupą. Kolumny tabeli zachowują jej własną kolejność, a jej indeksy, klucze obce oraz notatki – kolejność z dokumentu.  
Drzewo śledzi zmiany diagramu, niezależnie od tego, czy wynikają one ze zmiany na kanwie, cofnięcia lub ponowienia, importu, czy z działań współpracownika lub agenta kodującego, więc zmiana nazwy tabeli przenosi jej wiersz.

Każdy rodzaj wiersza pokazuje:

- Tabela: ikonę tabeli i jej nazwę.
- Kolumna: ikonę klucza dla kolumny klucza podstawowego lub klucza obcego, w kolorze, jakim komórka klucza w samej tabeli oznacza klucz podstawowy, klucz obcy lub oba, a dla każdej innej kolumny ikonę listy. Następnie jej nazwę oraz przygaszonym tekstem jej typ danych, a po nim `PK`, `FK` lub oba oznaczenia, na przykład `id` `BIGINT PK` lub `user_id` `BIGINT FK`.
- Indeks: ikonę indeksu i jego nazwę. Następnie przygaszonym tekstem oznaczenie `UNIQUE` dla indeksu unikatowego oraz jego kolumny w nawiasach, w kolejności indeksu, z oznaczeniem `DESC` po kolumnie malejącej, na przykład `orders_user_idx` `UNIQUE (user_id DESC, total)` lub po prostu `(total)`.
- Klucz obcy: wymieniony tylko pod tabelą podrzędną, czyli tą, która zawiera kolumny klucza obcego, i tylko wtedy, gdy tabela nadrzędna jest w diagramie. Jego ikona klucza przyjmuje kolor łącznika: kolor klucza podstawowego i klucza obcego dla [relacji identyfikującej](./relationship-editing.md#identifying-relationships), a w pozostałych przypadkach kolor klucza obcego. Pokazuje kolumny klucza tabeli podrzędnej rozdzielone przecinkami, a następnie przygaszonym tekstem `→` z tabelą nadrzędną i jej kolumnami, na przykład `user_id` `→ users(id)`.
- Grupa tabel: kropkę w kolorze grupy, szarą dla grupy bez koloru, oraz jej nazwę. Jej tabele są wymienione pod nią według nazwy, a wiersz każdej z nich prowadzi do danej tabeli. Grupa bez tabel nie ma nic do rozwinięcia.
- Notatka: ikonę karteczki samoprzylepnej i pierwszą linię notatki.

Pusta nazwa lub notatka, której pierwsza linia jest pusta, wyświetla się jako `unnamed` kursywą.  
W wąskim panelu przygaszony tekst jest skracany znakiem `…` wcześniej niż nazwa. Najedź wskaźnikiem na nazwę lub jej przygaszony tekst, aby zobaczyć pełną treść.

Na początku rozwinięty jest tylko folder `Tables`. Kliknij wiersz folderu albo naciśnij na nim klawisz `Enter` lub `Space`, aby go zwinąć lub rozwinąć.  
Strzałka na początku wiersza zwija lub rozwija ten wiersz bez przechodzenia gdziekolwiek. Ma ją każdy wiersz tabeli, nawet tabeli, pod którą nic nie ma. Klawisze `→` i `←` również zwijają i rozwijają – zobacz sekcję [Klawisze w Eksploratorze](#keys-in-the-explorer).  
Przycisk `Collapse All` przy każdym naciśnięciu zwija jeden poziom: najgłębszy widoczny poziom rozwiniętych wierszy, więc kolejne naciśnięcia zwijają drzewo od dołu do góry. Naciśnięcie, które dochodzi do najwyższego poziomu, zwija wszystkie wiersze, łącznie z tymi pod już zwiniętym wierszem, pozostawiając tylko foldery najwyższego poziomu.  
Edycja, cofanie i ponawianie oraz zmiany wprowadzane przez współpracowników lub agenta kodującego pozostawiają stan zwinięcia bez zmian.

## Przechodzenie do wiersza {#going-to-a-row}

Kliknij wiersz albo naciśnij klawisz `Enter` lub `Space`, gdy jest na nim fokus klawiatury, aby przejść do odpowiadającego mu elementu na kanwie ERD. Wiersz folderu tylko się zwija lub rozwija, a klawisze strzałek służą tylko do poruszania się po drzewie.

- Wiersz tabeli, także tabeli wymienionej pod grupą, zaznacza tylko tę tabelę i przenosi ją na wierzch. Fokus przechodzi na komórkę z nazwą tabeli, chyba że komórka z fokusem jest już w tej tabeli.
- Wiersz kolumny zaznacza tylko jej tabelę i ustawia fokus na komórce z nazwą kolumny.
- Wiersz indeksu zaznacza jego tabelę, tak jak wiersz tabeli. Sam indeks nie jest wyróżniany; indeksy edytuje się we [Właściwościach tabeli](./table-related-functions.md#indexes).
- Wiersz klucza obcego pokazuje w widoku obie tabele relacji naraz albo samą tabelę podrzędną, gdy tabele są zbyt daleko od siebie, aby pokazać je razem. Zaznacza tylko tabelę podrzędną wraz z jej kolumnami kluczy obcych, ustawia fokus na pierwszej z nich i podświetla łącznik relacji – zobacz sekcję [Odczytywanie łącznika](./relationship-editing.md#reading-a-connector).
- Wiersz grupy tabel przesuwa widok na ramkę grupy, kierując się jej paskiem tytułu, zaznacza tylko tę grupę i przenosi ją wraz z tabelami na wierzch.
- Wiersz notatki zaznacza tylko tę notatkę i przenosi ją na wierzch.

Widok przesuwa się według reguły wspólnej dla wszystkich przejść: powiększenie nigdy się nie zmienia, a kanwa przewija się tylko wtedy, gdy element docelowy nie jest już dobrze widoczny – zobacz sekcję [Dokąd prowadzi przejście](./table-related-functions.md#where-a-jump-lands).  
Przejście do wiersza najpierw zamyka Właściwości tabeli, jeśli są otwarte, i nigdy nie rozpoczyna ani nie kończy rysowania relacji.  
Gdy pole wyszukiwania zawiera tekst, wiersz, którego własna nazwa zawiera dopasowanie, lub wiersz pokazujący fragment komentarza albo notatki prowadzi zamiast tego do dopasowania – zobacz sekcję [Przechodzenie do dopasowania](./find-and-replace.md#going-to-a-match).

Po kliknięciu fokus klawiatury pozostaje w drzewie, więc klawisze `Delete`, `Backspace` i inne klawisze edycji nie docierają do nowego zaznaczenia, dopóki nie naciśniesz klawisza `Escape` lub nie klikniesz kanwy – zobacz sekcję [Klawisze w Eksploratorze](#keys-in-the-explorer).

## Klawisze w Eksploratorze {#keys-in-the-explorer}

Drzewo to jeden punkt w kolejności przechodzenia klawiszem `Tab`, pomijany, gdy drzewo nie ma wierszy.  
Gdy przejdziesz do niego klawiszem Tab, fokus trafia na wiersz, na którym był ostatnio, w razie jego braku na wiersz bieżącego dopasowania albo na pierwszy wiersz widoczny w całości, po czym widok przewija się do tego wiersza. Wiersz z fokusem klawiatury jest rysowany tak jak wiersz pod wskaźnikiem.

W drzewie:

- Klawisze `↑` i `↓` przesuwają fokus o jeden wiersz i zatrzymują się na pierwszym i ostatnim wierszu, zamiast przechodzić na drugi koniec. Klawisze `Home` i `End` przechodzą do pierwszego i ostatniego wiersza.
- Klawisz `→` rozwija zwinięty wiersz albo przechodzi do pierwszego elementu podrzędnego rozwiniętego wiersza. Klawisz `←` zwija rozwinięty wiersz albo przechodzi do jego elementu nadrzędnego. W języku wyświetlania pisanym od prawej do lewej te dwa klawisze zamieniają się rolami.
- Klawisze `Enter` i `Space` działają jak kliknięcie: przechodzą do wiersza albo zwijają lub rozwijają folder – zobacz sekcję [Przechodzenie do wiersza](#going-to-a-row).
- Wpisanie litery nie powoduje przejścia do wiersza.

Klawisz `Escape` naciśnięty w dowolnym miejscu Eksploratora, w drzewie, w polu wyszukiwania lub zamiany albo na jednym z jego przycisków, oddaje fokus klawiatury kanwie. Eksplorator pozostaje otwarty, a zaznaczenie się nie zmienia.  
Naciśnięcie klawisza `Escape`, które kończy składanie znaków w edytorze metody wprowadzania, kończy tylko składanie znaków. Klawisz `Escape` nigdy nie zamyka Eksploratora, niezależnie od tego, czy zostanie naciśnięty w nim, czy na kanwie.

Gdy fokus klawiatury jest w Eksploratorze, nadal działa kilka skrótów edytora – zobacz sekcję [Skróty klawiaturowe](./settings.md#shortcuts):

- `Ctrl + F` (Windows/Linux) lub `⌘ + F` (Mac) działa tak samo jak na kanwie: zamyka Eksplorator albo, gdy obok niego otwarte są Właściwości tabeli, zamyka Właściwości tabeli i umieszcza kursor tekstowy w polu wyszukiwania – zobacz sekcję [Otwieranie i zamykanie](#opening-and-closing).
- `Ctrl + K` (Windows/Linux) lub `⌘ + K` (Mac) otwiera i zamyka Szybkie wyszukiwanie.
- Skróty `Undo` i `Redo` cofają i ponawiają zmiany w diagramie, a nie w tekście pola.
- Skróty `Zoom In`, `Zoom Out` i `Zoom Reset` zmieniają powiększenie kanwy.

Każdy inny skrót edytora pozostaje w Eksploratorze, podobnie jak klawisze strzałek, `Tab`, `Enter`, `Space`, `Home`, `End` oraz każdy klawisz naciśnięty podczas składania znaków w edytorze metody wprowadzania.  
Żaden z nich nie dociera do kanwy: klawisze `Delete` i `Backspace` nigdy nie usuwają zaznaczenia, `Alt + N` (Windows/Linux) lub `⌥ + N` (Mac) nie dodaje tabeli, a skrót `T`, a potem `G` niczego nie grupuje. W polu działają jak zwykłe klawisze tekstowe: `Ctrl + A` (Windows/Linux) lub `⌘ + A` (Mac) zaznacza tekst pola, `Delete` i `Backspace` usuwają tekst, a `Space` wpisuje spację. Klawisz `Tab` przenosi fokus między przyciskami, polami i drzewem Eksploratora.  
Klawisze samych pól wyszukiwania i zamiany opisano w sekcji [Klawisze w polach wyszukiwania](./find-and-replace.md#keys-in-the-search-fields).  
Klawisze, z którymi edytor nie wiąże żadnych poleceń, takie jak własne skróty hosta do zapisywania lub otwierania palety poleceń, docierają do hosta jak zwykle.

## Okna dialogowe obok Eksploratora {#dialogs-beside-it}

[Właściwości tabeli](./table-related-functions.md#table-properties), [kreator motywu](./language-and-theme.md#theme), selektor [`Display Language`](./language-and-theme.md#picking-a-language) oraz okna dialogowe [`Export image`](./file-import-export.md#image) i [Mapuj kolumny](./relationship-editing.md#map-columns) przy otwieraniu pozostawiają Eksplorator otwarty.

- Właściwości tabeli otwierają się na środku kanwy obok Eksploratora i przyciemniają tylko kanwę. Eksplorator pozostaje dostępny: wybranie wiersza zamyka Właściwości tabeli, a następnie przechodzi do wiersza.
- Okna dialogowe `Export image` i „Mapuj kolumny” przyciemniają cały edytor, łącznie z paskiem narzędzi i Eksploratorem. Eksplorator pozostaje otwarty pod przyciemnionym obszarem, a kliknięcie w nim zamyka okno dialogowe, tak jak kliknięcie w dowolnym miejscu przyciemnionego obszaru; okno dialogowe „Mapuj kolumny” zamyka się wtedy bez mapowania czegokolwiek.
- W języku wyświetlania pisanym od lewej do prawej kreator motywu i selektor `Display Language` otwierają się tuż obok Eksploratora, zamiast go zasłaniać, i przesuwają się, jeśli Eksplorator otworzy się lub zamknie, gdy są widoczne. W języku pisanym od prawej do lewej zachowują swoje miejsce po prawej stronie. Naciśnięcie w Eksploratorze zamyka je, tak jak każde naciśnięcie poza nimi, z wyjątkiem naciśnięcia na pasku narzędzi.

Otwarcie wyszukiwania skrótem lub pozycją `Toggle Explorer` zamyka każde z tych pięciu okien, przy czym okno dialogowe „Mapuj kolumny” zamyka się bez mapowania czegokolwiek.  
[Szybkie wyszukiwanie](./quick-search.md) również pozostawia Eksplorator otwarty, a klawisz `Escape` zamyka wtedy tylko paletę.

## Edytory tylko do odczytu {#read-only-editors}

W edytorze z atrybutem [`readonly`](../../api/erd-editor-element.md#readonly) Eksplorator działa tak jak w każdym innym: przycisk na pasku narzędzi z tą samą podpowiedzią, skrót, obie pozycje `Toggle Explorer`, drzewo, zwijanie, przycisk `Collapse All` oraz przechodzenie do wiersza, które jak zwykle zaznacza element docelowy. Jego tytuł brzmi tam również `Explorer`.  
Jego wyszukiwanie tylko znajduje dopasowania – zobacz sekcję [Edytory tylko do odczytu](./find-and-replace.md#read-only-editors) na stronie Znajdź i zamień.
