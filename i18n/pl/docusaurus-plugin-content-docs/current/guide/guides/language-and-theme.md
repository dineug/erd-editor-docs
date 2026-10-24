---
sidebar_position: 17
description: 25 języków wyświetlania edytora, układ od prawej do lewej, wygląd System, Light i Dark oraz kolory w kreatorze motywu, a także miejsca, w których przechowuje je każdy host.
---

# Język i motyw

Tekst samego edytora jest dostępny w 25 językach, a jego szatę graficzną określa motyw: wygląd (`System`, `Light` lub `Dark`), odcień szarości i kolor akcentu.  
Oba należą do osoby korzystającej z edytora, a nie do diagramu. Żadnego z nich nie zapisuje się w pliku, nie rejestruje w [historii cofania](./undo-redo.md) ani nie udostępnia współpracownikom, więc każdy widzi swoje, a zmiana któregokolwiek z nich nigdy nie oznacza pliku jako zmodyfikowanego.

Żadnego z nich nie ma na karcie [Ustawienia](./settings.md). Na pasku narzędzi, za przyciskiem [`Explorer`](./explorer.md), znajduje się przycisk `Theme`, a zaraz za nim przycisk `Display Language`. [Szybkie wyszukiwanie](./quick-search.md) wyświetla polecenia `Theme` i `Display Language` na każdej karcie.  
Aplikacja internetowa, Google Drive, VS Code, IDE JetBrains i Obsidian oferują oba i zapamiętują dokonane wybory – zobacz sekcję [W poszczególnych hostach](#in-each-host). Oba działają również w edytorze tylko do odczytu.

## Język wyświetlania {#display-language}

Język obejmuje tekst samego edytora: podpowiedzi paska narzędzi, przycisk [`Name View`](./logical-names.md#switching-the-view) na pasku narzędzi kanwy i na pasku narzędzi trybu Przepływ, menu wyświetlania wierszy w trybie Przepływ, menu kontekstowe, Szybkie wyszukiwanie, panele i okna dialogowe, kartę [Słownik](./dictionary.md) (nazwy jej arkuszy, nagłówki kolumn, narzędzia, menu, wiersz stanu i rodzaje kontroli wymieniane w arkuszu `Checks`), kartę Ustawienia, [ekran powitalny](./editing-start.md#welcome-screen), powiadomienia i komunikaty oraz tekst zastępczy wyświetlany na kanwie i w wyeksportowanym obrazie w miejscu pustej nazwy, nazwy logicznej, typu danych, domeny, wartości domyślnej lub komentarza.  
W każdym języku bez zmian pozostają: własne nazwy tabel i kolumn, [nazwy logiczne](./logical-names.md), komentarze i notatki; słowa, terminy i domeny przechowywane na karcie Słownik; systemy baz danych, języki Generatora kodu i formaty plików; typy danych, słowa kluczowe SQL oraz akcje `ON DELETE` i `ON UPDATE`; opcje Schematu SQL `Create`, `If not exists`, `Drop & re-create`, `USE` i `CREATE + USE`; oznaczenia `PK`, `FK`, `UQ`, `AI`, `NN`, `N-N`, `NULL` i `AK1.1`; litery statusu `A`, `M`, `D`, `R` i `~`, których używa [podgląd różnic](./table-related-functions.md#diff-viewer); opcje stylu nazw i opcje `Bracket` inne niż `None`; nazwy klawiszy; nazwy kolorów w kreatorze motywu; wygenerowany SQL i kod; wiersz nagłówka wyeksportowanego pliku CSV ze słownikiem; nazwy wyeksportowanych plików.

Na karcie Słownik sortowanie porządkuje wiersze według kolejności alfabetycznej języka wyświetlania, a wyszukiwanie w arkuszu `Checks` dopasowuje jego komórki w takiej postaci, w jakiej brzmią w języku wyświetlania – zobacz sekcje [Sortowanie](./dictionary.md#sorting) i [Wyszukiwanie](./dictionary.md#searching).

Języki w kolejności, w jakiej wyświetla je selektor:

| W selektorze | Język | Kod |
| --- | --- | --- |
| Bahasa Indonesia | Indonezyjski | `id-ID` |
| Deutsch | Niemiecki | `de-DE` |
| English | Angielski | `en` |
| Español | Hiszpański | `es-ES` |
| Euskara | Baskijski | `eu-ES` |
| Français | Francuski | `fr-FR` |
| Italiano | Włoski | `it-IT` |
| Nederlands | Niderlandzki | `nl-NL` |
| Polski | Polski | `pl-PL` |
| Português | Portugalski | `pt-PT` |
| Português Brasileiro | Portugalski brazylijski | `pt-BR` |
| Română | Rumuński | `ro-RO` |
| Slovenčina | Słowacki | `sk-SK` |
| Slovenščina | Słoweński | `sl-SI` |
| Svenska | Szwedzki | `sv-SE` |
| Türkçe | Turecki | `tr-TR` |
| Русский | Rosyjski | `ru-RU` |
| Українська | Ukraiński | `uk-UA` |
| עברית | Hebrajski | `he-IL` |
| العربية | Arabski | `ar-SA` |
| فارسی | Perski | `fa-IR` |
| 日本語 | Japoński | `ja-JP` |
| 简体中文 | Chiński uproszczony | `zh-CN` |
| 繁體中文 | Chiński tradycyjny | `zh-TW` |
| 한국어 | Koreański | `ko-KR` |

Polecenie `Language`, które Szybkie wyszukiwanie oferuje na karcie Generator kodu, oraz wiersz `Language` listy [Blokada](./settings.md#lock) na karcie Ustawienia to [język docelowy Generatora kodu](./code-generator.md#language), a nie język wyświetlania.

### Wybieranie języka {#picking-a-language}

Przycisk `Display Language` (ikona języków) otwiera selektor języka `Display Language`, czyli panel zatytułowany `Display Language`, wyświetlany pod paskiem narzędzi nad otwartą w danej chwili kartą.  
Pierwsza jest opcja `System`, obok której widać język, jaki w tej chwili oznacza, i pozostaje ona widoczna podczas przewijania listy. Dalej następuje 25 języków, każdy pod nazwą we własnym języku, a znacznik wyboru wskazuje obowiązującą opcję.

![Przełączanie języka wyświetlania z paska narzędzi na 한국어, potem na العربية, co odbija lustrzanie pasek narzędzi, ale nie diagram, i z powrotem na System](/img/demo-display-language.webp)

Panel otwiera się z fokusem klawiatury na wierszu ze znacznikiem wyboru:

- Klawisze `↑` i `↓` przechodzą między wierszami w pętli, a `Home` i `End` przeskakują do pierwszego i ostatniego wiersza.
- `Enter` lub `Space` wybiera wiersz z fokusem, tak jak kliknięcie.

Wybór działa od razu, zamyka panel i oddaje fokus klawiatury edytorowi.

Zamknij go bez wyboru klawiszem `Escape`, przyciskiem `x` obok tytułu, którego podpowiedź brzmi `Close (ESC)`, naciśnięciem dowolnego miejsca edytora poza panelem, z wyjątkiem paska narzędzi, lub ponownie przyciskiem `Display Language`.  
Otwarcie selektora zamyka kreator motywu i Właściwości tabeli. Otwarty [Eksplorator](./explorer.md#dialogs-beside-it) pozostaje otwarty, a w języku pisanym od lewej do prawej selektor pojawia się tuż za nim, zamiast go zasłaniać.  
Selektor zamyka się po otwarciu Szybkiego wyszukiwania lub kreatora motywu, a także po naciśnięciu skrótu `Ctrl + F` (Windows/Linux) lub `⌘ + F` (Mac). Ten skrót otwiera [Eksplorator](./explorer.md#opening-and-closing) z aktywnym wyszukiwaniem, a jeśli Eksplorator jest już otwarty, pozostawia go otwartym i przenosi fokus klawiatury do jego pola wyszukiwania. Przycisk `Explorer` na pasku narzędzi pozostawia selektor otwarty.

Gdy panel ma fokus klawiatury, nadal działa kilka skrótów edytora: `Search`, `Toggle Explorer`, `Undo`, `Redo`, `Zoom In`, `Zoom Out` i `Zoom Reset` – zobacz sekcję [Skróty klawiaturowe](./settings.md#shortcuts). Wszystkie pozostałe skróty edytora, klawisze strzałek i klawisz `Tab` nie wychodzą poza panel, więc edytor na nie nie reaguje. Klawisze, do których edytor nie przypisuje poleceń, takie jak skrót zapisu samego hosta, docierają do hosta jak zwykle.

W funkcji [Szybkie wyszukiwanie](./quick-search.md) polecenie `Display Language` wyświetla opcję `System` i 25 języków, ze znacznikiem wyboru przy obowiązującej opcji. Język można tam znaleźć również po jego angielskiej nazwie lub kodzie, więc wpisanie `german` lub `de-DE` znajduje pozycję `Deutsch`.

### Co oznacza opcja System {#what-system-follows}

W aplikacji internetowej, Google Drive, VS Code, IDE JetBrains i aplikacji Obsidian język ma początkowo wartość `System`. Ta opcja podąża za językiem hosta:

- W aplikacji internetowej, Google Drive i na własnej stronie: preferowane języki przeglądarki. Ich zmiana jest uwzględniana od razu.
- W VS Code: język wyświetlania VS Code.
- W IDE JetBrains: język, w którym IDE wyświetla własny interfejs.
- W aplikacji Obsidian: język aplikacji Obsidian.

Opcja `System` wybiera pierwszy z tych języków, który edytor obsługuje, a jeśli nie obsługuje żadnego z nich, wybiera angielski.  
Wariant regionalny jest traktowany jak jego język, więc `de-AT` daje Deutsch, a `fr-CA` daje Français. W przypadku języka chińskiego decyduje pismo: pismo tradycyjne daje 繁體中文, a każde inne pismo 简体中文. Gdy pismo nie jest podane, region Tajwan, Hongkong lub Makau daje 繁體中文, a pozostałe warianty chińskiego dają 简体中文. Język portugalski daje Português Brasileiro, chyba że podano region inny niż Brazylia, więc `pt-PT` daje Português; portugalski w aplikacji Obsidian również daje Português.

### Języki pisane od prawej do lewej {#right-to-left-languages}

עברית (hebrajski), العربية (arabski) i فارسی (perski) układają edytor od prawej do lewej: pasek narzędzi, menu, panele i okna dialogowe, Szybkie wyszukiwanie, pasek i wiersz stanu karty Słownik oraz karta Ustawienia są odbite lustrzanie. Podmenu menu kontekstowego otwierają się w lewo, a ikony Cofnij i Ponów na pasku narzędzi zamieniają się miejscami, tak aby ikona Cofnij wskazywała wstecz z perspektywy osoby czytającej od prawej do lewej.

Sam diagram nigdy nie jest odbijany lustrzanie. Kanwa z tabelami, kolumnami, relacjami i notatkami pozostaje w układzie od lewej do prawej, podobnie jak minimapa, paski przewijania, [pasek narzędzi kanwy](./table-related-functions.md#canvas-toolbar), [Wizualizacja](./visualization.md) i jej pasek narzędzi, komórki typu danych, arkusze na karcie Słownik i lista domen terminu, kod na kartach Schemat SQL i Generator kodu, selektor kolorów, obie strony podglądu różnic, podróż w czasie oraz podgląd Automatycznego układu.  
W trybie Przepływ dwie strzałki na pasku narzędzi karty Wizualizacja pozostają na swoich miejscach i zamieniają się działaniem: strzałka skierowana w prawo to `Previous table`, a skierowana w lewo – `Next table`, tak aby powrót wskazywał w tę samą stronę co ikona Cofnij. Klawisze cofania i ponawiania nadal cofają o krok i przechodzą o krok do przodu – zobacz sekcję [Poprzednia i następna tabela](./visualization.md#previous-table-and-next-table).  
[Eksplorator](./explorer.md#beside-the-canvas) pozostaje po lewej stronie kanwy, a drzewo zmian podglądu różnic po lewej stronie podglądu, przy czym każdy z nich ma krawędź do przeciągania po swojej prawej stronie. Wewnątrz oba czyta się od prawej do lewej: ich pola i wiersze są odbite lustrzanie, wiersze mają wcięcia od prawej, a w każdym z drzew `←` rozwija wiersz lub przechodzi do jego pierwszego wiersza podrzędnego, podczas gdy `→` zwija go lub wychodzi do wiersza nadrzędnego – zobacz sekcję [Klawisze w Eksploratorze](./explorer.md#keys-in-the-explorer).  
Nazwy, komentarze i inny wpisany tekst zachowują własny kierunek, więc nazwę w języku hebrajskim, arabskim lub perskim również na kanwie czyta się od prawej do lewej. Każda nazwa wymieniona w powiadomieniu karty Słownik również zachowuje własny kierunek.

## Motyw {#theme}

Przycisk `Theme` (ikona kontrastu) otwiera kreator motywu, czyli panel zatytułowany `Theme`, wyświetlany pod paskiem narzędzi nad otwartą w danej chwili kartą. Składa się on z trzech części:

- `Accent color`: 26 próbek koloru. Podpowiedź każdej z nich podaje jej nazwę, na przykład `indigo`.
- `Gray color`: 6 próbek koloru: `gray`, `mauve`, `slate`, `sage`, `olive` i `sand`.
- `Appearance`: `System`, `Light` i `Dark`.

![Otwieranie kreatora motywu z paska narzędzi, wybieranie koloru akcentu i odcienia szarości oraz przełączanie wyglądu na Light, a potem na System](/img/demo-theme-builder.webp)

W każdej części obowiązujący wybór jest oznaczony, a wybranie opcji działa od razu i nie zamyka kreatora.  
Wybranie koloru nie zmienia wyglądu, więc kolor wybrany przy ustawieniu `System` zachowuje wygląd `System`.

Opcja `System` pokazuje wygląd jasny lub ciemny tak jak host i przełącza się razem z nim:

- W aplikacji internetowej, Google Drive i na własnej stronie: tryb jasny lub ciemny zgłaszany przez przeglądarkę, który podąża za systemem operacyjnym.
- W VS Code: jasny przy jasnym motywie kolorów, a ciemny przy ciemnym lub przy jednym z dwóch motywów o wysokim kontraście.
- W IDE JetBrains: jasny lub ciemny motyw IDE.
- W aplikacji Obsidian: jasny lub ciemny motyw aplikacji Obsidian.

Zamknij kreator klawiszem `Escape`, przyciskiem `x` obok tytułu, którego podpowiedź brzmi `Close (ESC)`, naciśnięciem dowolnego miejsca edytora poza panelem, z wyjątkiem paska narzędzi, lub ponownie przyciskiem `Theme`.  
Otwarcie kreatora zamyka Właściwości tabeli i selektor języka `Display Language`. Otwarty [Eksplorator](./explorer.md#dialogs-beside-it) pozostaje otwarty, a w języku pisanym od lewej do prawej kreator pojawia się tuż za nim, zamiast go zasłaniać.  
Kreator zamyka się po otwarciu Szybkiego wyszukiwania lub selektora języka `Display Language`, a także po naciśnięciu skrótu `Ctrl + F` (Windows/Linux) lub `⌘ + F` (Mac). Ten skrót otwiera [Eksplorator](./explorer.md#opening-and-closing) z aktywnym wyszukiwaniem, a jeśli Eksplorator jest już otwarty, pozostawia go otwartym i przenosi fokus klawiatury do jego pola wyszukiwania. Przycisk `Explorer` na pasku narzędzi pozostawia kreator otwarty.  
Kreator nie przechwytuje żadnych klawiszy, więc skróty edytora działają, gdy jest otwarty.

W funkcji [Szybkie wyszukiwanie](./quick-search.md) polecenie `Theme` wyświetla opcje `System`, `Light` i `Dark`, ze znacznikiem wyboru przy obowiązującym wyglądzie. Wybranie jednej z nich zmienia tylko wygląd i pozostawia odcień szarości oraz kolor akcentu bez zmian.

## W poszczególnych hostach {#in-each-host}

To, co wybierzesz w edytorze – z paska narzędzi lub w Szybkim wyszukiwaniu – zapisuje się tam, gdzie przechowuje to host, a każdy otwarty diagram od razu uwzględnia zmianę, niezależnie od tego, gdzie ją wprowadzono.  
W VS Code, IDE JetBrains i aplikacji Obsidian opcja `Auto` hosta (w VS Code wartość `auto`) odpowiada opcji `System` edytora. Wybranie opcji `System` zapisuje wartość `Auto`, a wybranie `Light` lub `Dark` zapisuje ten wygląd, nawet jeśli przy ustawieniu `Auto` był on już widoczny.  
Własne ustawienia i komunikaty rozszerzenia oraz wtyczek są po angielsku niezależnie od języka wyświetlania.

### Aplikacja internetowa i Google Drive {#web-app-and-google-drive}

W serwisie erd-editor.io, łącznie z jego sesjami wspólnej edycji, oraz w Google Drive jeden język i jeden motyw obowiązują dla aplikacji i każdego diagramu w niej.  
Oba są przechowywane w tej przeglądarce, a nie w schemacie ani w pliku Drive, i współdzielą je wszystkie karty serwisu erd-editor.io: wybór na jednej karcie od razu zmienia pozostałe.

Dopóki nie wybierzesz języka, obowiązuje opcja `System`, która podąża za preferowanymi językami przeglądarki.  
Własny tekst aplikacji, na przykład na pasku bocznym, w koszu, we wspólnej edycji i na ekranach Google Drive, używa tego samego języka, a w języku hebrajskim, arabskim i perskim cała aplikacja ma układ od prawej do lewej. Polityka prywatności, Warunki korzystania z usługi i strony pomocy pozostają po angielsku.  
Oprócz panelu edytora i Szybkiego wyszukiwania w dolnym wierszu paska bocznego, obok łączy `Privacy` i `Terms`, znajduje się przycisk języka, którego podpowiedź brzmi `Display Language`. Jego menu wyświetla opcję `System` wraz z językiem, który ona oznacza, a następnie 25 języków.

Motyw ma początkowo wygląd `System`, odcień szarości `olive` i kolor akcentu `jade`.  
Oprócz kreatora motywu i Szybkiego wyszukiwania na dole paska bocznego znajdują się trzy przyciski z ikonami, `System`, `Light` i `Dark`: obok pozycji `Trash` w serwisie erd-editor.io i obok pozycji `Sign out` w Google Drive. Ustawiają one ten sam wygląd co kreator.

### VS Code {#vs-code}

Ustawienia rozszerzenia znajdują się pod pozycją ERD Editor w widoku Settings w VS Code:

| Ustawienie | Wartości | Wartość domyślna |
| --- | --- | --- |
| `dineug.erd-editor.locale` | `auto` lub kod z [tabeli języków](#display-language) | `auto` |
| `dineug.erd-editor.theme.appearance` | `auto`, `light`, `dark` | `auto` |
| `dineug.erd-editor.theme.grayColor` | sześć odcieni szarości | `slate` |
| `dineug.erd-editor.theme.accentColor` | 26 kolorów akcentu | `indigo` |

Edytor Settings wyświetla dla ustawienia języka opcję `Auto`, a po niej każdy język pod nazwą we własnym języku. Wartość w pliku `settings.json`, która nie wskazuje żadnego języka, jest odczytywana jako `auto`.  
Wybór motywu w edytorze zapisuje wszystkie trzy ustawienia motywu. Wybór zapisuje się tam, gdzie jego ustawienie jest już określone: w folderze obszaru roboczego, a jeśli nie, w obszarze roboczym, a jeśli nie, w ustawieniach użytkownika.

### IDE JetBrains {#jetbrains-ides}

W Settings | Tools | ERD Editor są ustawienia `Appearance:` (`Auto`, `Light`, `Dark`), `Gray color:`, `Accent color:` i `Display language:` (`Auto`, a następnie każdy język pod nazwą we własnym języku), przechowywane dla całego IDE.  
Ich wartości początkowe to `Auto`, `Slate`, `Indigo` i `Auto`.

### Obsidian {#obsidian}

W Settings → ERD Editor są ustawienia `Appearance` (`Auto`, `Light`, `Dark`), `Gray color`, `Accent color` i `Display language` (`Auto`, a następnie każdy język pod nazwą we własnym języku), przechowywane osobno dla każdego sejfu.  
Ich wartości początkowe to `Auto`, `Slate`, `Indigo` i `Auto`.  
Zmiana dotyczy każdej karty ERD w sejfie, łącznie z kartami w osobnych oknach.

### Własna strona {#your-own-page}

Element `<erd-editor>` na własnej stronie nie pokazuje przycisków `Theme` ani `Display Language`, a Szybkie wyszukiwanie nie wyświetla żadnego z tych poleceń, dopóki strona nie włączy ich za pomocą [`enableThemeBuilder`](../../api/erd-editor-element.md#enablethemebuilder) i [`enableLocalePicker`](../../api/erd-editor-element.md#enablelocalepicker).  
Dopóki strona nie ustawi języka lub czytelnik go nie wybierze, edytor wyświetla tekst po angielsku albo, jeśli włączono `enableLocalePicker`, podąża za opcją `System`.  
Motyw ma początkowo wygląd `Dark`, odcień szarości `slate` i kolor akcentu `indigo`, chyba że strona ustawi inny lub włączy [`systemDarkMode`](../../api/erd-editor-element.md#systemdarkmode).  
Wybór czytelnika działa od razu, ale element nie zapisuje żadnego z tych ustawień: strona sama ustawia wartości początkowe i zapisuje wybory czytelnika – zobacz sekcje [Motyw](../../api/erd-editor-element.md#theme) i [Język wyświetlania](../../api/erd-editor-element.md#display-language) w dokumentacji API.
