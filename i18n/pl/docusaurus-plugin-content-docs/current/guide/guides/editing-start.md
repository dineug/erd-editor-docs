---
sidebar_position: 1
description: Zacznij od ekranu powitalnego i twórz tabele, notatki, grupy tabel oraz relacje za pomocą menu kontekstowego kanwy, paska narzędzi kanwy lub skrótu klawiaturowego.
---

# Rozpoczęcie edycji

Edycja zaczyna się od menu kontekstowego otwieranego kliknięciem prawym przyciskiem myszy.

![Klikanie kanwy prawym przyciskiem myszy, otwieranie podmenu Relationship, dodawanie tabeli, a następnie jej własne menu](/img/demo-context-menu.webp)

Kliknięcie prawym przyciskiem myszy tabeli, notatki, grupy tabel lub relacji otwiera zamiast tego własne menu danego elementu.  
Kliknięcie prawym przyciskiem myszy już zaznaczonej tabeli, notatki lub grupy tabel zachowuje całe zaznaczenie, więc pozycje takie jak `Color` i `Delete selected` dotyczą wszystkich zaznaczonych elementów – zobacz sekcję [Zaznaczanie wielu elementów](./table-related-functions.md#multiple-selection).  
Edytor tylko do odczytu niczego nie tworzy, więc nic z tego, co opisuje ta strona, nie jest tam oferowane: menu kanwy zachowuje tylko `View Option`, `Name View`, `Export` i `Diff Viewer`, menu tabeli tylko `Table Properties`, a notatka, grupa tabel lub relacja nie otwiera żadnego menu – zobacz sekcję [Edytory tylko do odczytu](./table-related-functions.md#read-only-editors).

## Ekran powitalny {#welcome-screen}

W aplikacji internetowej, w Google Drive, w VS Code, w aplikacji Obsidian i w IDE JetBrains pusty diagram otwiera się z ekranem powitalnym nad kanwą ERD. Element `<erd-editor>` na własnej stronie pokazuje go tylko wtedy, gdy strona włączy go właściwością [`enableWelcomeScreen`](../../api/erd-editor-element.md#enablewelcomescreen).  
Diagram uznaje się za pusty, dopóki nie zawiera żadnej tabeli, żadnej widocznej notatki ani żadnej widocznej grupy tabel, więc notatki i grupy ukryte za pomocą Opcji widoku się nie liczą. Ekran znika, gdy tylko w diagramie pojawi się jeden z tych elementów, i wraca za każdym razem, gdy diagram znów staje się pusty, na przykład po usunięciu ostatniej tabeli lub cofnięciu dodania pierwszej.  
Nie jest wyświetlany w edytorze tylko do odczytu, w trybie zen, gdy otwarte są Właściwości tabeli, ani wtedy, gdy kanwę zajmuje podgląd różnic, podgląd Automatycznego układu lub podróż w czasie.

![Ekran powitalny na pustym diagramie: otwieranie formatów pozycji Import, powrót klawiszem Esc, dodawanie tabeli przyciskiem New Table, a następnie przywracanie ekranu skrótem ⌘ + Z](/img/demo-welcome-screen.webp)

Pod nagłówkiem `Right-click the canvas for every action.` znajduje się menu:

- `New Table` dodaje tabelę, tak jak `Alt + N`.
- `New Memo` dodaje notatkę, tak jak `Alt + M`. Ta pozycja jest pomijana, gdy notatki są ukryte.
- `Import` zastępuje menu pozycją `Back` i formatami `json`, `Schema SQL`, `GraphQL`, `DBML` i `AML`. Po wybraniu formatu edytor prosi o plik w tym formacie i wczytuje go w miejsce pustego diagramu – zobacz stronę [Importowanie i eksportowanie plików](./file-import-export.md). Pozycja `Back` lub klawisz `Escape` przywraca pierwsze menu.
- `Command Palette` otwiera [Szybkie wyszukiwanie](./quick-search.md), tak jak `Ctrl + K` (Windows/Linux) lub `⌘ + K` (Mac).
- `Shortcuts` otwiera Ustawienia na karcie [`Shortcuts`](./settings.md#shortcuts).

Gdy kanwa jest wystarczająco szeroka, pozycje `New Table`, `New Memo` i `Command Palette` pokazują skrót przypisany obecnie do ich polecenia, także skrót zmieniony przez hosta.  
Gdy jedna z pozycji ma fokus klawiatury, klawisze `↑` i `↓` przechodzą cyklicznie przez pozycje, `Home` i `End` przeskakują do pierwszej i ostatniej z nich, a `Enter` lub `Space` aktywuje pozycję z fokusem. Wszystkie pozostałe skróty nadal działają, więc skrót `Alt + N` także tutaj dodaje tabelę.  
Kliknięcia odbiera tylko menu: naciśnięcie w dowolnym innym miejscu ekranu trafia na kanwę, a kliknięcie kanwy prawym przyciskiem myszy jak zwykle otwiera menu kontekstowe.

Gdy na kanwie jest wystarczająco miejsca, odręcznie narysowane strzałki wskazują:

- przycisk `Search` na pasku narzędzi: `Search commands and tables`
- przyciski `Theme` i `Display Language`: `Pick a theme and a language` albo `Pick a theme` lub `Pick a language`, gdy pasek narzędzi pokazuje tylko jeden z nich – zobacz stronę [Język i motyw](./language-and-theme.md)
- [pasek narzędzi kanwy](./table-related-functions.md#canvas-toolbar) na dole: `Pan, zoom and draw relationships`

Gdy [Eksplorator](./explorer.md) jest widoczny, ekran powitalny zakrywa tylko kanwę obok niego.  
Strzałka, której przycisk na pasku narzędzi znajduje się nad Eksploratorem, jest pomijana. Strzałka przycisków `Theme` i `Display Language` jest pomijana tylko wtedy, gdy oba jej przyciski znajdują się nad Eksploratorem; do tego czasu wskazuje ten, który nadal jest nad kanwą.  
Etykieta, dla której brakuje miejsca obok jej strzałki, pojawia się zamiast tego pod strzałką.

## Tworzenie tabeli {#table-creation}

Utwórz tabelę za pomocą menu kontekstowego, przycisku `New Table` na [pasku narzędzi kanwy](./table-related-functions.md#canvas-toolbar) lub skrótu `Alt + N`.

## Tworzenie notatki {#memo-creation}

Utwórz notatkę za pomocą menu kontekstowego, przycisku `New Memo` na pasku narzędzi kanwy lub skrótu `Alt + M`.  
Gdy pozycja View Option → `Memos` jest wyłączona, notatki są ukryte, pozycja `New Memo` nie jest nigdzie dostępna, a skrót `Alt + M` nie dodaje żadnej notatki – zobacz sekcję [Opcje widoku tabel](./table-related-functions.md#table-view-options).

Notatka to swobodny tekst umieszczony na kanwie. Kliknij wewnątrz notatki i wpisuj tekst; jest on zapisywany razem z dokumentem.  
Klawisz `Escape` zamyka edytor notatki, zachowując wpisany tekst i pozostawiając notatkę zaznaczoną, a drugie naciśnięcie klawisza `Escape` anuluje zaznaczenie.  
Przeciągnij krawędź notatki, aby zmienić jej rozmiar. Przycisk `x` w nagłówku, widoczny, gdy wskaźnik znajduje się nad notatką, usuwa ją.  
Kliknięcie notatki prawym przyciskiem myszy otwiera jej menu, a nie edytor: pozycje `Color`, `Remove color`, gdy któryś z zaznaczonych elementów ma kolor, oraz `Delete`, która brzmi `Delete selected`, gdy notatka jest jednym z co najmniej dwóch zaznaczonych elementów. Zaznaczoną notatkę usuwają też te same klawisze, które usuwają tabele – zobacz sekcję [Usuwanie tabel i notatek](./table-related-functions.md#table-and-memo-deletion).

![Dodawanie notatki skrótem Alt + M, wpisywanie tekstu i przeciąganie jej krawędzi w celu zmiany rozmiaru](/img/demo-memo.webp)

## Tworzenie grupy tabel {#table-group-creation}

Grupa tabel to ramka zawierająca tabele, której możesz nadać nazwę i kolor. Utwórz ją na jeden z dwóch sposobów:

- Wybierz `New Table Group` w menu kontekstowym lub w Szybkim wyszukiwaniu, kliknij przycisk `New Table Group` na [pasku narzędzi kanwy](./table-related-functions.md#canvas-toolbar) albo naciśnij `Alt + G` (Windows/Linux) lub `⌥ + G` (Mac), a następnie przeciągnij po kanwie, aby narysować ramkę. Każda tabela, której środek leży wewnątrz ramki, dołącza do nowej grupy, chyba że należy już do innej grupy – zobacz sekcję [Rysowanie grupy](./table-groups.md#drawing-a-group).
- Zaznacz tabele i wybierz `Group selected tables` w menu kontekstowym tabeli lub `Group Selected Tables` w Szybkim wyszukiwaniu albo naciśnij `T`, a potem `G` – zobacz sekcję [Grupowanie zaznaczonych tabel](./table-groups.md#grouping-selected-tables).

Nazywanie, kolorowanie, przenoszenie, zmianę rozmiaru i pozostałe operacje opisano na stronie [Grupy tabel](./table-groups.md).

## Tworzenie relacji {#relationship-creation}

Rozpocznij tworzenie relacji za pomocą menu kontekstowego, [paska narzędzi kanwy](./table-related-functions.md#canvas-toolbar) na dole kanwy lub skrótu klawiaturowego. Każdy typ relacji ma własny skrót:

- Zero One: `Ctrl + Alt + 1` (Windows/Linux) lub `⌘ + ⌥ + 1` (Mac)
- Zero N: `Ctrl + Alt + 2` (Windows/Linux) lub `⌘ + ⌥ + 2` (Mac)
- One Only: `Ctrl + Alt + 3` (Windows/Linux) lub `⌘ + ⌥ + 3` (Mac)
- One N: `Ctrl + Alt + 4` (Windows/Linux) lub `⌘ + ⌥ + 4` (Mac)

Po wybraniu typu kursor zmienia wygląd. Kliknij najpierw tabelę nadrzędną, a potem tabelę podrzędną.  
Tabela nadrzędna otrzymuje klucz podstawowy, jeśli go nie ma, a dla każdej kolumny klucza podstawowego tabeli nadrzędnej tabela podrzędna otrzymuje kolumnę klucza obcego z flagą `Not Null` i z tym samym typem danych, wartością domyślną, komentarzem, [nazwą logiczną](./logical-names.md) i [domeną](./dictionary.md#domains-and-data-types).  
Wyjątkiem jest klucz typu serial: jego klucz obcy przyjmuje typ całkowity przechowywany przez typ serial, na przykład `integer` dla `serial4`, i wtedy nie jest powiązany z żadną domeną – zobacz sekcję [Relacje identyfikujące](./relationship-editing.md#identifying-relationships).  
Każda kolumna klucza obcego otrzymuje nazwę od swojego klucza: jednowyrazowa nazwa, taka jak `id`, otrzymuje na początku nazwę tabeli nadrzędnej (`user_id`), nazwa wielowyrazowa, taka jak `member_id`, pozostaje bez zmian, a nazwa, którą tabela podrzędna już ma, otrzymuje numer (`user_id_2`) – zobacz sekcję [Nazwy kolumn kluczy obcych](./relationship-editing.md#foreign-key-column-names).  
Dwa kliknięcia tej samej tabeli rysują relację zwrotną.  
Nowa relacja ma na początku obie akcje, `On Delete` i `On Update`, ustawione na `Not set`; zmień je w menu kontekstowym relacji – zobacz sekcję [ON DELETE i ON UPDATE](./relationship-editing.md#on-delete-and-on-update).  
Aby anulować rysowanie, naciśnij klawisz `Escape` lub ponownie ten sam skrót. Anulowanie pozostawia zaznaczenie bez zmian, a kolejne naciśnięcie klawisza `Escape` je anuluje.

Po wybraniu tabeli nadrzędnej najechanie wskaźnikiem na tabelę, na której relacja może się zakończyć, obrysowuje ją i wyświetla obok niej dwa przyciski:

- `Create new columns` (`+`) rysuje relację z nowymi kolumnami kluczy obcych, tak jak kliknięcie tabeli.
- `Map to existing columns` (ikona łącza) kończy rysowanie i otwiera okno dialogowe [Mapuj kolumny](./relationship-editing.md#map-columns) dla obu tabel, aby relacja mogła korzystać z kolumn, które tabela podrzędna już ma. Nic nie jest zapisywane, dopóki nie naciśniesz przycisku `Map`.

Tabela nadrzędna również pokazuje te przyciski, gdy wskaźnik przesunie się nieco od miejsca kliknięcia, więc relację zwrotną także można zmapować na istniejące kolumny.  
Palcem nie można najechać na tabelę, więc podczas rysowania palcem przyciski nigdy się nie pojawiają, a dotknięcie tabeli podrzędnej od razu rysuje relację; pióro pokazuje je tak samo jak mysz.  
Jeśli w chwili dotarcia do tabeli podrzędnej tabela nadrzędna nie ma już klucza podstawowego, na przykład w wyniku cofnięcia lub zmiany wprowadzonej przez współpracownika, przycisk `Create new columns` jest przyciemniony i ma podpowiedź `<parent> has no primary key to copy`, a kliknięcie tabeli podrzędnej kończy rysowanie, niczego nie rysując.  
Podpowiedź nazywa tabelę nadrzędną tak, jak robi to [Widok nazw](./logical-names.md#beyond-the-canvas).

![Rysowanie relacji One N skrótem ⌘ + ⌥ + 4, a następnie relacji Zero N z paska narzędzi kanwy, z obrysowaną tabelą podrzędną i jej przyciskami Map to existing columns i Create new columns](/img/demo-relationship.webp)

## Duplikowanie tabel i notatek {#duplicating-tables-and-memos}

Istniejące tabele i notatki można duplikować przez kopiowanie i wklejanie oraz przeciąganie z wciśniętym klawiszem `Alt` – zobacz stronę [Operacje na tabelach](./table-related-functions.md#copyingpasting-tables-and-memos).
