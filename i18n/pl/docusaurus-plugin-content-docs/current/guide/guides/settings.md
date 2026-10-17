---
sidebar_position: 14
description: Synchronizacja typu danych w relacjach, maksymalna szerokość komentarza, przeliczanie szerokości tabel, blokady ustawień (widoku, karty i ustawień kodu), kolejność wyświetlania kolumn i lista skrótów klawiaturowych.
---

# Ustawienia

Otwórz je przyciskiem `Settings` na pasku narzędzi lub pozycją `Tab` w [szybkim wyszukiwaniu](./quick-search.md).
Ekran Ustawienia ma dwie karty: `Preferences` i `Shortcuts`. Najpierw otwiera się karta `Preferences`, chyba że Ustawienia otwarto wierszem `Shortcuts` na [ekranie powitalnym](./editing-start.md#welcome-screen) – wtedy otwiera się karta `Shortcuts`.

Motywu i języka wyświetlania nie ma na tym ekranie. Otwierają je przyciski `Theme` i `Display Language` na pasku narzędzi – zobacz stronę [Język i motyw](./language-and-theme.md).

## Synchronizacja typu danych w relacjach {#relationship-datatype-sync}

Określa, czy synchronizować typy danych. Domyślnie jest włączona.
Zmieniony typ danych kolumny trafia wtedy do każdej kolumny połączonej z nią relacją, wzdłuż łańcucha od obu jego końców, więc klucz obcy nigdy nie rozmija się z kluczem, do którego się odwołuje.
W kierunku od klucza do jego kluczy obcych typ serial trafia jako typ całkowity, który przechowuje, tak jak przy rysowaniu relacji – zobacz sekcję [Relacje identyfikujące](./relationship-editing.md#identifying-relationships). Zmiana typu klucza na `serial` daje więc jego kluczom obcym typ `integer` w PostgreSQL, a zmiana biegnie stamtąd dalej w dół łańcucha.
W kierunku od klucza obcego z powrotem do jego klucza typ trafia w niezmienionej postaci, z tym wyjątkiem, że klucz typu serial zachowuje swój typ, a zmiana na nim się zatrzymuje.
Okno dialogowe [Mapuj kolumny](./relationship-editing.md#map-columns) również uwzględnia to ustawienie: gdy jest ono włączone, każda istniejąca kolumna, którą mapuje, przyjmuje typ, jaki jej klucz w tabeli nadrzędnej nadaje kluczowi obcemu, a zmiana biegnie dalej wzdłuż relacji tak jak powyżej. Gdy ustawienie jest wyłączone albo klucz nie ma typu danych, kolumna zachowuje własny typ.

<img src="/img/settings-relationship-data-type-sync.png" width="290" alt="Ustawienie synchronizacji typu danych w relacjach" loading="lazy" />

![Zmiana typu members.id na BIGINT UNSIGNED, która aktualizuje każdą połączoną z nią kolumnę member_id](/img/demo-relationship-data-type-sync.webp)

## Maksymalna szerokość komentarza {#maximum-comment-width}

Określa maksymalną szerokość kolumny komentarza w pikselach (`60` ~ `200`).
Wyłączenie przełącznika znosi limit, a pole jest nieaktywne, dopóki przełącznik pozostaje wyłączony.
Po włączeniu przełącznika wartość początkowa to `60px`. Wpisana wartość spoza zakresu jest zmieniana na najbliższą jego granicę.

![Włączanie opcji Maximum comment width, wpisywanie wartości 120 i karta ERD z komentarzami przyciętymi do tej szerokości](/img/demo-settings-comment-width.webp)

## Przeliczanie szerokości tabel {#recalculation-table-width}

Naciśnij przycisk `Sync`, aby przeliczyć szerokość każdej tabeli i komórki kolumny tak, by pasowała do jej bieżącego tekstu, oraz przerysować łączniki relacji zgodnie z nowymi rozmiarami.
Potwierdza to powiadomienie `Recalculated table width`.
Szerokości są przeliczane automatycznie przy każdym wczytaniu dokumentu, więc jest to potrzebne tylko wtedy, gdy po zmianie czcionki lub sposobu renderowania stały się nieaktualne.
Szerokości nie są zapisywane w pliku, więc przycisk `Sync` nigdy go nie zmienia.

## Blokada {#lock}

Lista `Lock` zawiera sześć ustawień. Dopóki blokada ustawienia jest włączona, plik zachowuje wartość, którą ustawienie miało w chwili zablokowania, więc zmiana tego ustawienia na ekranie pozostawia plik w niezmienionym stanie.

| Wiersz | Co zachowuje plik | W nowym diagramie |
| --- | --- | --- |
| `Viewport` | Poziom powiększenia i położenie widoku kanwy ERD jako jedna blokada | `100% · 0, 0` |
| `Canvas Type` | Karta, na której otwiera się diagram: `ERD`, `Visualization`, `Schema SQL` lub `Code Generator` | `ERD` |
| `Language` | Język [Generatora kodu](./code-generator.md#language) | `GraphQL` |
| `Table Name Case` | [Styl nazw tabel](./code-generator.md#name-case) Generatora kodu | `Pascal` |
| `Column Name Case` | [Styl nazw kolumn](./code-generator.md#name-case) Generatora kodu | `Camel` |
| `Bracket Type` | Opcja `Bracket` na karcie [Schemat SQL](./schema-sql.md#database-and-bracket) i w tych formatach docelowych [Generatora kodu](./code-generator.md#bracket), które ją oferują | `None` |

Każdy wiersz pokazuje wartość i przycisk blokady, a kliknięcie przycisku włącza lub wyłącza tę jedną blokadę.
Gdy blokada jest włączona, przycisk pokazuje zamkniętą kłódkę z podpowiedzią `Unlock Viewport` (i analogicznie w każdym wierszu), a wartość z podpowiedzią `Locked value` to ta, którą zachowuje plik.
Gdy jest wyłączona, przycisk pokazuje otwartą kłódkę z podpowiedzią `Lock Viewport`, a przyciemniona wartość z podpowiedzią `Current value` to ustawienie w obecnym stanie.
Wartość `Viewport` składa się z powiększenia, a po nim z położenia widoku, na przykład `75% · -40, 91`. Położenie widoku to punkt na ekranie, podany w pikselach, w którym leży punkt `0, 0` diagramu, a współrzędna wynosząca tysiąc lub więcej jest skracana, jak w `1.2k` lub `-24k`.

Zablokowanie zapamiętuje ustawienie w stanie z tej właśnie chwili.
Gdy blokada jest włączona, ustawienie nadal działa na ekranie: możesz przewijać i powiększać, przełączać karty i wybierać inny język, styl nazw lub cudzysłów w menu, panelach opcji lub szybkim wyszukiwaniu.
Plik zachowuje jednak zablokowaną wartość, a wiersz nadal ją pokazuje, więc diagram otwiera się ponownie w zablokowanym widoku, na zablokowanej karcie, z zablokowanym językiem, stylami nazw i cudzysłowem. Eksport JSON również zapisuje zablokowane wartości.
Aby zapisać to, co pokazuje ekran, wyłącz blokadę, a od tej chwili plik będzie podążał za ustawieniem: przy wyłączonej blokadzie `Viewport` diagram otwiera się tam, gdzie go zostawiono. Aby zamiast tego zablokować nową wartość, na przykład nowy widok początkowy, wyłącz blokadę i włącz ją ponownie.
Jeśli przy otwarciu pliku zablokowany widok nie pokazuje żadnej części diagramu, ekran i tak przesuwa się na diagram, a zablokowana wartość pozostaje bez zmian.
Blokada `Canvas Type` nigdy nie zachowuje karty Ustawienia. Jej włączenie blokuje ostatnią inną kartę, która była otwarta, a gdy blokada jest wyłączona, jej wiersz podaje nazwę tej karty.

![Odblokowywanie opcji Viewport, przewijanie i powiększanie diagramu oraz ponowne blokowanie jej przy nowym widoku pokazanym w jej wierszu](/img/demo-settings-locks.webp)

Włączenie lub wyłączenie blokady zmienia plik, ponieważ plik przechowuje informację, które blokady są włączone, ale podobnie jak reszta karty Ustawienia nie jest rejestrowane w [historii cofania](./undo-redo.md#what-the-history-records). W edytorze tylko do odczytu przyciski blokad nic nie robią.
Każde inne ustawienie jest zapisywane w bieżącym stanie: baza danych, przełączniki [`View Option`](./table-related-functions.md#table-view-options) i reszta karty `Preferences`.

W nowym diagramie, czyli rozpoczętym od zera, wszystkie blokady są włączone. Taki diagram to pusty plik otwarty w VS Code, aplikacji Obsidian lub IDE JetBrains (w aplikacji Obsidian taki plik tworzą polecenia `ERD Editor: Create new diagram` i `New ERD`), nowy schemat w aplikacji internetowej, plik utworzony z menu New w Google Drive lub element `<erd-editor>` bez nadanej wartości.
Schemat lub plik Google Drive, który aplikacja internetowa tworzy przez zaimportowanie pliku SQL, DBML, AML lub GraphQL, również zaczyna z włączonymi wszystkimi blokadami. Schemat lub plik utworzony z pliku JSON zachowuje blokady zapisane w tym pliku.
Otwierany plik zachowuje blokady, z którymi go zapisano, każdą z jej zablokowaną wartością.
Plik, w którym nie zapisano blokad, na przykład zapisany przez wersję sprzed wprowadzenia blokad lub napisany ręcznie, otwiera się z włączonymi wszystkimi blokadami: z widokiem `100% · 0, 0` i kartą `ERD` niezależnie od zapisanego w nim widoku i karty oraz z językiem, stylami nazw i typem cudzysłowu zablokowanymi tak, jak je zapisano.
Operacja `Import`, która zastępuje diagram, również ustawia blokady: plik JSON przynosi zapisane w nim blokady i ich wartości, a plik SQL, DBML, AML lub GraphQL zachowuje dotychczasowe blokady, ale przywraca widok `100% · 0, 0`, zablokowany czy nie – zobacz sekcję [Importowanie plików zewnętrznych](./file-import-export.md#importing-external-files). Cofnięcie importu przywraca zastąpione przez niego blokady i zablokowane wartości.

Zmiana, której blokada nie dopuszcza do pliku, nie jest liczona jako zmiana. VS Code nie oznacza karty jako zmodyfikowanej, a aplikacja Obsidian i IDE JetBrains pozostawiają plik bez zmian zarówno przy zapisie automatycznym, jak i przy zamknięciu karty.
Dlatego przy wszystkich włączonych blokadach rozglądanie się po diagramie, przełączanie kart i wypróbowywanie innego języka, stylu nazw lub cudzysłowu nigdy nie pojawiają się w wyniku polecenia `git diff`.
Przy wyłączonej blokadzie `Viewport` przewijanie i powiększanie zmieniają plik, a przy wyłączonej blokadzie `Canvas Type` zmienia go także przełączanie kart, w tym przejście na kartę Ustawienia.
Pusty plik nowego diagramu pozostaje pusty do pierwszej zmiany, którą zachowuje plik: edycji, zmiany ustawienia nieobjętego żadną blokadą albo włączenia lub wyłączenia blokady.
Otwarcie diagramu i zamknięcie go bez takiej zmiany pozostawia plik bez zmian, niezależnie od tego, która wersja go zapisała i na jakim komputerze. Plik zawiera wyłącznie to, czym jest diagram, w stałej kolejności, a plik zapisany w starszej postaci jest jednorazowo przepisywany do tej postaci przy pierwszej takiej zmianie – zobacz sekcję [Postać zapisu i wartość czasu wykonania](../../api/advanced/schema.md#storage-form-and-runtime-value).
W VS Code rewizja ponownie otwarta jako diagram poleceniem `Reopen Editor With...`, na przykład rewizja Git lub wpis Local History, jest tylko do odczytu i nigdy nie jest oznaczana jako zmodyfikowana.
W Google Drive przewinięcie, powiększenie lub przełączenie na inną kartę nigdy nie jest zapisywane samodzielnie, niezależnie od blokady. Przy wyłączonej blokadzie `Viewport` widok jest zapisywany tylko razem z inną zmianą, więc plik Google Drive otwiera się w widoku z chwili ostatniego zapisu, a to samo dotyczy karty przy wyłączonej blokadzie `Canvas Type`.

W [sesji wspólnej edycji](../../api/advanced/collaborative-editing.md) włączenie lub wyłączenie blokady dociera do każdego edytora, a blokada zachowuje wartość z edytora, który ją włączył.
Wyłączenie blokady `Language`, stylu nazw lub `Bracket Type` nadaje każdemu edytorowi wartość wyświetlaną w edytorze, który ją wyłączył, więc wszystkie zapisują jedną wartość. Wyłączenie blokady `Viewport` lub `Canvas Type` nie przesuwa niczyjego widoku ani nie przełącza niczyjej karty.
Agent kodujący działający przez serwer MCP nie ma narzędzia do blokad ani do ustawień, które one obejmują, a zablokowany język, styl nazw lub typ cudzysłowu odczytuje jako wartość zachowaną w pliku. Wpływ na nie mają tylko jego importy w trybie `replace`, tak jak operacja `Import` – zobacz sekcje [Ustawienia](../../mcp/tools.md#settings) i [Import](../../mcp/tools.md#import).

## Dostosowywanie kolejności kolumn {#adjusting-column-order}

Ustala kolejność wyświetlania kolumn w tabelach.
Przeciągnij wiersz, aby go przenieść – można przeciągać cały wiersz, a oznacza go ikona uchwytu. Siedem wierszy w domyślnej kolejności to `Name`, `DataType`, `Not Null`, `Unique`, `Auto Increment`, `Default` i `Comment`.
Komórka ukryta przez [opcję widoku tabeli](./table-related-functions.md#table-view-options) zachowuje swoje miejsce na liście, więc kolejność dotyczy tych komórek, które są akurat widoczne.
Oznaczenie [klucza alternatywnego](./table-related-functions.md#alternate-keys) (`AK1.1` itd.) nie jest jednym z tych wierszy. Zawsze znajduje się na końcu wiersza, za komórką, którą ta kolejność umieszcza jako ostatnią.

![Przewijanie w dół do listy Column Order i przeciąganie wiersza Comment w górę pod wiersz Name, co umieszcza każdy komentarz tuż za nazwą jego kolumny](/img/demo-settings-column-order.webp)

## Skróty klawiaturowe {#shortcuts}

Karta `Shortcuts` to tabela tylko do odczytu z kolumnami `Command` i `Keybinding`, która zawiera powiązania klawiszy dla używanej platformy.

| Command | Windows/Linux | Mac |
| --- | --- | --- |
| Editing | `Enter` | `Enter` |
| Stop | `ESC` | `ESC` |
| Search | `Ctrl + K` | `⌘ + K` |
| [Toggle Explorer](./explorer.md) | `Ctrl + F` | `⌘ + F` |
| Undo | `Ctrl + Z` | `⌘ + Z` |
| Redo | `Ctrl + Shift + Z` | `⌘ + Shift + Z` |
| Add Table | `Alt + N` | `⌥ + N` |
| Add Column | `Alt + Enter` | `⌥ + Enter` |
| Add Memo | `Alt + M` | `⌥ + M` |
| Add Table Group | `Alt + G` | `⌥ + G` |
| Group Selected Tables | `T`, a potem `G` | `T`, a potem `G` |
| Remove Table, Memo | `Ctrl + Backspace`, `Ctrl + Delete` | `⌘ + Backspace`, `⌘ + Delete` |
| Remove Column | `Alt + Backspace`, `Alt + Delete` | `⌥ + Backspace`, `⌥ + Delete` |
| Delete Selection | `Delete`, `Backspace` | `Delete`, `Backspace` |
| Primary Key | `Alt + K` | `⌥ + K` |
| Select All Table, Memo | `Ctrl + A`, `Ctrl + Alt + A` | `⌘ + A`, `⌘ + ⌥ + A` |
| Select All Column | `Alt + A` | `⌥ + A` |
| Relationship Zero One | `Ctrl + Alt + 1` | `⌘ + ⌥ + 1` |
| Relationship Zero N | `Ctrl + Alt + 2` | `⌘ + ⌥ + 2` |
| Relationship One Only | `Ctrl + Alt + 3` | `⌘ + ⌥ + 3` |
| Relationship One N | `Ctrl + Alt + 4` | `⌘ + ⌥ + 4` |
| Table Properties | `Alt + Space` | `⌥ + Space` |
| Focus on this table | `Alt + F` | `⌥ + F` |
| Zoom In | `Ctrl + Plus` | `⌘ + Plus` |
| Zoom Out | `Ctrl + Minus` | `⌘ + Minus` |
| Zoom Reset | `Ctrl + 0` | `⌘ + 0` |
| Hand Tool | `Space` | `Space` |
| Zen Mode | `Alt + Z` | `⌥ + Z` |

Większość z nich działa tylko na karcie ERD i jest wstrzymywana, gdy otwarte jest szybkie wyszukiwanie, właściwości tabeli, podgląd różnic, podgląd Automatycznego układu, podróż w czasie, okno dialogowe [`Export image`](./file-import-export.md#image) lub okno dialogowe [`Map Columns`](./relationship-editing.md#map-columns).
Wyjątkami są polecenia `Search`, `Toggle Explorer` i `Stop`: `Search` otwiera i zamyka szybkie wyszukiwanie na każdej karcie, `Toggle Explorer` na każdej karcie otwiera wyszukiwanie w [Eksploratorze](./explorer.md#opening-and-closing) i przełącza na kartę ERD, a `Stop` zamyka szybkie wyszukiwanie, właściwości tabeli, podgląd różnic, podgląd Automatycznego układu, podróż w czasie, okno dialogowe `Export image`, okno dialogowe `Map Columns`, kreator motywu, selektor `Display Language`, selektor kolorów i otwarte menu kontekstowe.
Polecenie `Toggle Explorer` z powrotem zamyka Eksplorator, gdy jest on otwarty na karcie ERD i nie ukrywa go tryb zen, tak jak przycisk `Explorer` na pasku narzędzi. Gdy otwarte jest szybkie wyszukiwanie, właściwości tabeli, kreator motywu, selektor `Display Language`, okno dialogowe `Export image` lub okno dialogowe `Map Columns`, zamyka zamiast tego to, co jest otwarte, i przenosi fokus klawiatury do wyszukiwania w Eksploratorze.
Polecenie `Toggle Explorer` nic nie robi podczas edycji komórki, notatki lub nazwy grupy tabel. Gdy otwarty jest podgląd różnic, podgląd Automatycznego układu lub podróż w czasie, pozostawia swój klawisz przeglądarce lub hostowi – zobacz sekcję [Pasek wyszukiwania przeglądarki](./find-and-replace.md#the-browsers-find-bar).
Na karcie ERD polecenie `Stop` kończy otwartą edycję komórki lub notatki, zamyka edytor nazwy [grupy tabel](./table-groups.md) bez zmiany nazwy grupy albo anuluje rysowanie relacji lub grupy `New Table Group`, a zaznaczenie pozostawia bez zmian. Gdy nic z tego nie jest otwarte, anuluje zaznaczenie i zdejmuje fokus z komórki, a tym samym naciśnięciem zamyka otwarty selektor kolorów. Otwarty kreator motywu lub selektor `Display Language` zamyka się tym samym naciśnięciem w obu przypadkach.
Otwarty Eksplorator, kreator motywu lub selektor `Display Language` nie wstrzymuje na kanwie żadnego ze skrótów. Polecenie `Stop` nigdy nie zamyka Eksploratora. Informacje o tym, co robią w Eksploratorze `Stop` i inne klawisze, znajdziesz w sekcji [Klawisze w Eksploratorze](./explorer.md#keys-in-the-explorer), a o ich działaniu w selektorze – w sekcji [Wybieranie języka](./language-and-theme.md#picking-a-language).
Polecenie `Delete Selection` usuwa wszystkie zaznaczone tabele, notatki i grupy tabel albo, gdy zaznaczona jest jedna tabela wraz z częścią jej kolumn, a powiększenie przekracza `70%`, te kolumny – zobacz sekcję [Usuwanie tabel i notatek](./table-related-functions.md#table-and-memo-deletion). Polecenie `Remove Table, Memo` usuwa również zaznaczone grupy tabel.
Polecenie `Add Table Group` rozpoczyna rysowanie grupy [`New Table Group`](./table-groups.md#drawing-a-group), tak jak przycisk `New Table Group` na [pasku narzędzi kanwy](./table-related-functions.md#canvas-toolbar), a drugie naciśnięcie anuluje rysowanie. Polecenie `Group Selected Tables` to dwa naciśnięcia bez klawisza modyfikującego: `T`, a potem `G` w ciągu sekundy. Umieszcza zaznaczone tabele w nowej grupie i otwiera edytor jej nazwy, tak jak pozycja `Group selected tables` w menu kontekstowym tabeli, a gdy żadna tabela nie jest zaznaczona, nic nie robi – zobacz sekcję [Grupowanie zaznaczonych tabel](./table-groups.md#grouping-selected-tables). Żadne z nich nic nie robi w edytorze tylko do odczytu ani wtedy, gdy grupy są [ukryte](./table-groups.md#hiding-groups).
Polecenia `Zoom In`, `Zoom Out` i `Zoom Reset` zmieniają też powiększenie na karcie [Wizualizacja](./visualization.md#toolbar), zarówno w trybie `Graph`, jak i `Flow`, chyba że otwarte jest szybkie wyszukiwanie.
Na karcie Wizualizacja polecenie `Stop` zamyka też menu [wyświetlania wierszy](./visualization.md#row-display) i anuluje wciąż trwające [rozmieszczanie kafelków w trybie Przepływ](./visualization.md#how-flow-is-placed); nie poszerza natomiast widoku zawężonego poleceniem `Focus on this table`.
Polecenie `Focus on this table` otwiera kartę Wizualizacja w trybie `Flow`, zawężoną do zaznaczonych tabel i wszystkich tabel oddalonych od nich o jedną relację, a gdy żadna tabela nie jest zaznaczona, nic nie robi – zobacz sekcję [Skupianie widoku na tabelach](./visualization.md#focusing-on-tables).
Polecenia `Select All Table, Memo`, `Hand Tool`, `Delete Selection` i `Group Selected Tables` ustępują kursorowi tekstowemu: podczas edycji komórki lub notatki albo pisania w polu tekstowym, takim jak pole wyszukiwania Eksploratora, `Ctrl + A` (Windows/Linux) lub `⌘ + A` (Mac) zaznacza tekst, `Space` wpisuje spację, `Delete` i `Backspace` usuwają tekst, a naciśnięcie `T`, a potem `G` wpisuje te dwie litery.
Kopiowanie i wklejanie to własne skróty przeglądarki `Ctrl + C` i `Ctrl + V` (Windows/Linux) lub `⌘ + C` i `⌘ + V` (Mac), dlatego nie ma ich na tej liście – zobacz stronę [Edycja tabel](./table-editing.md).

Powiązań klawiszy nie można zmieniać na tej karcie.
Host osadzający edytor zmienia je za pomocą metody [`setKeyBindingMap`](../../api/erd-editor-element.md#setkeybindingmap), z wyjątkiem poleceń `Editing`, `Stop`, `Undo`, `Redo`, `Zoom In`, `Zoom Out` i `Zoom Reset`, które są stałe.
Karta `Shortcuts` pokazuje wtedy powiązania hosta: polecenie, którego host nie zmienia, zachowuje domyślne powiązanie, a polecenie, któremu host nie przypisuje żadnego klawisza, nie pokazuje żadnego.

W aplikacji Obsidian te klawisze trafiają do edytora zawsze, gdy aktywna jest karta diagramu w aplikacji Obsidian, nawet jeśli skrót klawiaturowy aplikacji Obsidian używa tego samego klawisza, na przykład `Alt + Enter`, `Ctrl + K` i `Ctrl + F` (Windows/Linux) lub `⌥ + Enter`, `⌘ + K` i `⌘ + F` (Mac). Wszystkie pozostałe skróty klawiaturowe aplikacji Obsidian nadal tam działają. Informacje o skrócie `Ctrl + F` lub `⌘ + F` znajdziesz w sekcji [Pasek wyszukiwania przeglądarki](./find-and-replace.md#the-browsers-find-bar).
