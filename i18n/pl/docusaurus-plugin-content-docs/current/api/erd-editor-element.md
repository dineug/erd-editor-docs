---
sidebar_position: 2
description: Interfejs API elementu erd-editor – rejestrowanie go, atrybuty, value i runtimeValue, zdarzenia, motywy, język wyświetlania, ekran powitalny, powiązania klawiszy oraz import i eksport schematów.
---

# ErdEditorElement

Edytor jest zwykłym elementem `HTMLElement`, czyli znacznikiem `<erd-editor>`, który definiuje import `@dineug/erd-editor/erd-editor.js`.  
Od wersji `5.0.0` import głównego modułu pakietu nie definiuje żadnego znacznika. Główny moduł eksportuje `ErdEditorElement` jako typ i klasę elementu oraz `defineErdEditor()`, które definiuje znacznik tam, gdzie je wywołasz – zobacz sekcję [Rejestrowanie elementów](./installation.md#registering-the-elements).  
Dla strony, która tylko pokazuje diagram, [`<erd-viewer>`](./erd-viewer-element.md) jest osobnym elementem tylko do odczytu.

```js
import '@dineug/erd-editor/erd-editor.js';

const editor = document.createElement('erd-editor');
```

Jego definicja typu wygląda następująco.

```ts
interface ErdEditorElement extends HTMLElement {
  readonly: boolean;
  systemDarkMode: boolean; // system dark/light auto
  enableThemeBuilder: boolean;
  enableLocalePicker: boolean;
  enableWelcomeScreen: boolean;
  value: string;
  readonly runtimeValue: string;
  focus: () => void;
  blur: () => void;
  clear: () => void;
  destroy: () => void;
  setInitialValue: (value: string) => void;
  setPresetTheme: (themeOptions: Partial<ThemeOptions>) => void;
  setSystemAppearance: (appearance: 'dark' | 'light' | null) => void;
  setTheme: (theme: Partial<Theme>) => void;
  setLocale: (locale: LocaleOption) => void;
  setSystemLocale: (locale: string | null) => void;
  setKeyBindingMap: (
    keyBindingMap: Partial<
      Omit<
        KeyBindingMap,
        | 'edit'
        | 'stop'
        | 'undo'
        | 'redo'
        | 'zoomIn'
        | 'zoomOut'
        | 'zoomReset'
      >
    >
  ) => void;
  setSchemaSQL: SetSchema;
  setSchemaGraphQL: SetSchema;
  setSchemaDBML: SetSchema;
  setSchemaAML: SetSchema;
  setSchemaJSON: (
    value: string,
    options?: { mode?: 'replace' | 'append' }
  ) => void;
  getSchemaSQL: (
    databaseVendor?: DatabaseVendor,
    options?: SchemaSQLOptions
  ) => string;
  getSharedStore: (
    config?: SharedStoreConfig & {
      mouseTracker?: boolean;
      focusTracker?: boolean;
    }
  ) => SharedStore;
  setDiffValue: (value: string) => void;
}
```

Edytor renderuje swoją zawartość w zamkniętym shadow root, więc `editor.shadowRoot` ma wartość `null`, a style strony nie przenikają ani do jego wnętrza, ani na zewnątrz.  
Do niczego w jego wnętrzu nie można dotrzeć selektorem – zamiast tego styluj go za pomocą metody [setTheme](#settheme) i właściwości niestandardowych CSS `--erd-editor-*`.

`readonly`, `system-dark-mode`, `enable-theme-builder`, `enable-locale-picker` i `enable-welcome-screen` to jedyne atrybuty i wszystkie pięć ma domyślnie wartość `false`. Dwa ostatnie to nowość w wersji `4.0.0`. Każdy z nich odczytuje swoją wartość tak, jak opisano w sekcji [readonly](#readonly).

Od wersji `4.1.0` karta ERD ma [Eksplorator](../guide/guides/explorer.md), drzewo diagramu zadokowane po lewej stronie kanwy, z funkcją Znajdź i zamień u góry. Nie otwiera go, nie zamyka ani nie informuje o nim żaden atrybut, właściwość, metoda ani zdarzenie: otwiera się go przyciskiem `Explorer` na pasku narzędzi, poleceniem `Toggle Explorer` w szybkim wyszukiwaniu lub w menu kontekstowym kanwy albo za pomocą powiązania [`findReplace`](#setkeybindingmap).  
Każdy element zaczyna z zamkniętym Eksploratorem. Stan otwarcia, szerokość, zwinięcia i wyszukiwanie Eksploratora utrzymują się przez cały czas istnienia elementu, przy przełączaniu kart i przy każdym wczytaniu, także przez `setInitialValue`, i nigdy nie trafiają do `value`, `runtimeValue`, historii cofania ani współdzielonego magazynu.

Od wersji `4.2.0` tabele i kolumny mogą mieć obok swoich nazw [nazwy logiczne](../guide/guides/logical-names.md), a Widok nazw, który tak jak karta jest ustawieniem dokumentu, decyduje, czy kanwa wyświetla ich nazwy, ich nazwy logiczne, czy jedne i drugie.  
Pasek narzędzi ma też kartę [Słownik](../guide/guides/dictionary.md), umieszczoną między kartami `Code Generator` i `Settings`, która zawiera słowa, terminy i domeny dokumentu oraz arkusz `Checks`. Jest to karta taka jak pozostałe: jej wartość `canvasType`, `'@dineug/erd-editor/builtin-dictionary'`, obejmuje blokada `Canvas Type`, więc tekst zapisany na tej karcie otwiera się na niej przez [setInitialValue](#setinitialvalue), a przełączenie na nią jest zapisywane w `value` i emituje zdarzenie [change](#change) tylko wtedy, gdy ta blokada jest wyłączona. Nie otwiera jej ani nie informuje o niej żaden jej własny atrybut, właściwość, metoda ani zdarzenie. Jej zmiany są zmianami dokumentu: trafiają do `value`, emitują zdarzenie [change](#change) i docierają do współpracowników, ale ich cofanie i ponawianie działa na własnej historii każdego arkusza, a nie na historii dokumentu.  
Własny stan karty – to, który arkusz jest wyświetlany, na początku arkusz `Domains`, oraz wyszukiwanie, zaznaczenie, przewinięcie i szerokości kolumn każdego arkusza – utrzymuje się przez cały czas istnienia elementu, przy przełączaniu kart i przy każdym wczytaniu, i nigdy nie trafia do `value`, `runtimeValue`, żadnej historii cofania ani współdzielonego magazynu.  
Interfejs `ErdEditorElement` nie zyskuje żadnej nowej składowej. Interfejs API dodaje natomiast pole `logicalNameAsComment` w opcjach metody [getSchemaSQL](#getschemasql), dwanaście [tokenów motywu](#settheme) i eksport [dictionaryRowChords](#dictionaryrowchords).

## readonly {#readonly}

Ustawia możliwość edycji w edytorze.  
Gdy jest ustawiony, przypisanie do `value`, `clear()`, `setSchemaSQL()`, `setSchemaGraphQL()`, `setSchemaDBML()`, `setSchemaAML()`, `setSchemaJSON()`, cofanie i ponawianie, od wersji `4.2.0` także w arkuszu karty Słownik, są ignorowane, a zdarzenie `change` nigdy nie jest emitowane. Zamiast tego wczytaj dokument metodą [setInitialValue](#setinitialvalue).  
Od wersji `5.0.0` edytor tylko do odczytu jest czytelnikiem, a nie edytorem z wyłączonymi kontrolkami. Zachowuje sześć kart, [Eksplorator](../guide/guides/explorer.md#read-only-editors), minimapę, szybkie wyszukiwanie, Właściwości tabeli, [Diff Viewer](../guide/guides/table-related-functions.md#diff-viewer), `Export`, tryb zen oraz kursory, fokus i zaznaczenia współpracowników, a każda kontrolka, która edytowałaby diagram, jest pomijana, zamiast być rysowana jako wyłączona. Przed wersją `5.0.0` wiele jego kontrolek edycji nadal było rysowanych, a edytor odrzucał to, co wysyłały.

Na karcie ERD przeciągnięcie przesuwa kanwę, gdziekolwiek się zaczyna, także na tabeli, a naciśnięcie niczego nie zaznacza, nie przesuwa ani nie otwiera. Wskaźnik zatrzymany na tabeli podświetla jej relacje, nieruchome kliknięcie tabeli lub relacji utrzymuje to podświetlenie, a nieruchome kliknięcie gdziekolwiek indziej je gasi, jak w [`<erd-viewer>`](./erd-viewer-element.md). Jedynym zaznaczeniem jest obrys pozostawiony przez przejście: przejście do wiersza Eksploratora, do jednego z jego dopasowań Find lub do wyniku szybkiego wyszukiwania po `#`, `@` albo `:` zaznacza to, do czego dociera, a następne nieruchome kliknięcie je czyści. Kopiowanie kopiuje to, co zawiera to zaznaczenie.  
[Pasek narzędzi kanwy](../guide/guides/table-related-functions.md#canvas-toolbar) zachowuje `Zoom out`, poziom powiększenia (`Reset zoom`), `Zoom in`, listę Widoku nazw, `Zen Mode` i kompas, bez `Hand` ani `Select`, bez `New Table`, `New Memo` i `New Table Group` oraz bez przycisków relacji. Menu kanwy zachowuje `View Option`, `Name View`, `Export` i `Diff Viewer`, menu tabeli zachowuje `Table Properties`, a notatka, relacja lub grupa tabel nie wywołują żadnego menu. Szybkie wyszukiwanie na karcie ERD nie wyświetla żadnego wiersza, który zapisywałby diagram: zachowuje `Tab`, `Name View`, `Database`, `Export`, `Toggle Explorer`, wiersze `Theme` i `Display Language`, które włączają [enableThemeBuilder](#enablethemebuilder) i [enableLocalePicker](#enablelocalepicker), oraz wyszukiwania `#`, `@` i `:`. Na pozostałych kartach wyświetla to, co w edytorze z możliwością edycji. Pasek narzędzi pokazuje nazwę bazy danych jako tekst i nie ma przycisków `Undo`, `Redo` ani `Time Travel`.  
Nic nie oferuje `Import`, [`Import and Add`](../guide/guides/file-import-export.md#import-and-add), `Auto Layout`, wiersza grupy tabel (zobacz stronę [Grupy tabel](../guide/guides/table-groups.md#read-only-editors)) ani [`Map Columns`](../guide/guides/relationship-editing.md#map-columns), a [ekran powitalny](#enablewelcomescreen) się nie pokazuje.  
Powiązania, które dodają, usuwają lub edytują, nic nie robią: `edit`, `addTable`, `addColumn`, `addMemo`, `addTableGroup`, `groupSelectedTables`, `removeTable`, `removeColumn`, `removeSelection`, `primaryKey`, `selectAllTable`, `selectAllColumn`, cztery powiązania relacji i `handTool`, każde nadal blokowane tak, jak mówi jego opcja. Wklejanie i `Tab` również nic nie robią i docierają do strony niezablokowane. Powiązania powiększenia, `zenMode`, `focusView`, `tableProperties` na tabeli zaznaczonej przez przejście, `search`, `findReplace`, kopiowanie, `Escape` i klawisze strzałek nadal działają. Nie otwiera się żaden edytor komórki, notatki ani nazwy grupy tabel i nie jest rysowana żadna relacja.

[Znajdź i zamień](../guide/guides/find-and-replace.md#read-only-editors) u góry Eksploratora służy tylko do wyszukiwania, bez strzałki `Toggle Replace` i bez wiersza zamiany. Panel ma tytuł `Explorer`, a podpowiedź przycisku na pasku narzędzi brzmi w każdym edytorze `Explorer (Ctrl + F)` (Windows/Linux) lub `Explorer (⌘ + F)` (Mac). Eksplorator otwiera się w edytorze tylko do odczytu od wersji `4.1.0`; od wersji `3.10.0` do `4.0.0` funkcja Znajdź i zamień otwierała się tam jako pływający panel służący tylko do wyszukiwania, z tytułem `Find`.  
Właściwości tabeli otwierają się z menu tabeli lub powiązaniem `tableProperties`, przy czym od wersji `3.10.0` obok ich tytułu widnieje plakietka `Read only`, a ich karta `Indexes` nie pozwala na żadne zmiany – zobacz sekcję [Właściwości tabeli](../guide/guides/table-related-functions.md#table-properties).  
Karta Ustawienia ma tę samą plakietkę `Read only` i pokazuje każde ustawienie w kontrolce, której nie można nacisnąć: jej dwa przełączniki, pole `Maximum comment width` i siedem przycisków `Lock` są wyłączone, a wierszy `Column Order` nie można przeciągać. Skryptów `Before tables` i `After tables` na karcie Schemat SQL nie można wpisywać. Karta [Wizualizacja](../guide/guides/visualization.md) działa jak w edytorze z możliwością edycji, ponieważ nic na niej nie edytuje dokumentu; polecenia `Previous table` i `Next table` w trybie Przepływ nadal przechodzą o krok, wywoływane swoimi przyciskami lub klawiszami cofania i ponawiania.  
Karta [Słownik](../guide/guides/dictionary.md#read-only-editors) nadal się otwiera: jej arkusze można przełączać, przeszukiwać, zaznaczać, przewijać i z nich kopiować, a wiersz arkusza `Checks` nadal prowadzi do tego, co wskazuje. Żadna komórka nie przyjmuje edycji, wklejenia ani wyczyszczenia, karta nie pokazuje narzędzi `Add Row`, `Delete Rows`, `Import CSV` ani `Export CSV` ani menu siatki, a jej kombinacje klawiszy wierszy niczego nie wstawiają ani nie usuwają. Menu tabeli, menu kanwy i szybkie wyszukiwanie nie udostępniają poleceń [`Derive Physical Names Again`](../guide/guides/dictionary.md#derive-physical-names-again) ani `Derive Physical Name Again`.

Od wersji `5.0.0` ustawienia, które czytelnik nadal może zmieniać, pozostają na ekranie tego edytora: przewinięcie i powiększenie, karta, baza danych, język Generatora kodu, oba style nazw, typ cudzysłowu, wiersze `View Option` oraz [Widok nazw](../guide/guides/logical-names.md#read-only-editors) z każdego ze swoich selektorów, który pozostaje na ekranie od wersji `4.2.0`. Niezależnie od ich [blokad](../guide/guides/settings.md#lock) żadne z nich nie dociera do `value`, `runtimeValue`, eksportu `json`, historii cofania, zdarzenia [change](#change) ani współdzielonego magazynu, więc `value` zachowuje ustawienia dokumentu, niezależnie od tego, jak czytelnik na niego patrzy. Panele opcji kart [Schemat SQL](../guide/guides/schema-sql.md#read-only-editors) i Generator kodu podpisują te ustawienia `This window only`, gdy ustawiony jest `readonly`, podczas gdy w edytorze z możliwością edycji brzmi to `Saved in the document`. To, co obie karty pokazują, kopiują i zapisują, podąża za ekranem, podobnie jak [getSchemaSQL](#getschemasql) wywołane bez systemu bazy danych.  
Przed wersją `5.0.0` przewinięcie, powiększenie, przełączenie karty, baza danych i ustawienia kodu czytelnika trafiały do `value`, dopóki nie trzymała ich blokada, czego baza danych nigdy nie ma, a współdzielony magazyn wysyłał je do pozostałych edytorów.  
Własne opcje `This window only` na karcie Schemat SQL, czyli `Statements`, `Header`, od wersji `4.2.0` `Write logical names into empty comments` i `Tables`, nigdy nie są zapisywane w żadnym edytorze i nadal obowiązują, podobnie jak okno dialogowe [`Export image`](../guide/guides/file-import-export.md#image), kreator motywu i selektor języka. Wybór w kreatorze motywu lub w selektorze języka nadal emituje zdarzenie [changePresetTheme](#changepresettheme) lub [changeLocale](#changelocale).

Gdy jest ustawiony, nic nie trafia do historii cofania, także przewinięcie ani powiększenie, a [współdzielony magazyn](#getsharedstore) edytora nie wysyła żadnej zmiany: tylko to, co wysyłają jego mechanizmy śledzące kursora, fokusu, zaznaczenia i ramki przeciągania czytelnika, oraz rejestry, o które prosi dołączający edytor (zobacz stronę [Wspólna edycja](./advanced/collaborative-editing.md)). Nadal stosuje każdą zmianę wysłaną przez pozostałych. Zmiana bazy danych, ustawienia Generatora kodu lub wiersza `View Option` trafia do dokumentu, a także na ekran, chyba że czytelnik zmienił to ustawienie właśnie tam, a współdzielone przełączenie Widoku nazw widać na ekranie w obu przypadkach.

Jego włączenie kończy to, co było otwarte: edytor komórki, notatki lub nazwy grupy tabel, rysowaną relację, przeciąganie tabeli, notatki, grupy tabel lub kolumny, kopie z przeciągania z klawiszem Alt, zmianę rozmiaru notatki lub grupy tabel, trwający podgląd lub umieszczanie Automatycznego układu, `Map Columns`, Podróż w czasie i selektor kolorów. Czyści zaznaczenie, odkłada narzędzie Rączka i najpierw wysyła to, co każdy współdzielony magazyn wciąż wstrzymuje z przeciągania lub przewinięcia, tak jak robi to [flushStreamBuffers](./advanced/collaborative-editing.md#flushstreambuffers). Właściwości tabeli, teraz tylko do odczytu, Diff Viewer i okno `Export image` pozostają otwarte, a przewinięcie, powiększenie, karta i Widok nazw pozostają takie, jakie były. Element, który jest tylko do odczytu przy pierwszym zamontowaniu, startuje tak samo, a element przeniesiony przez hosta w obrębie strony zachowuje obrys pozostawiony przez przejście.  
Jego wyłączenie przywraca kontrolki edycji, bez niczego zaznaczonego ani otwartego. Baza danych, język Generatora kodu, oba style nazw, typ cudzysłowu i wiersze `View Option` wracają do wartości dokumentu, natomiast przewinięcie, powiększenie, karta i Widok nazw pozostają tam, gdzie zostawił je czytelnik, a `value` zachowuje wartości dokumentu, dopóki czytelnik ich znów nie zmieni. Żadne z tych przełączeń nie emituje `change`.  
Atrybut bez wartości, `=""` i `="true"` są odczytywane jako `true`. `="false"` jest odczytywane jako `false`, podobnie jak każdy inny ciąg znaków – w tym idiom HTML `readonly="readonly"`.

```js
editor.readonly = true;
// or
editor.setAttribute('readonly', 'true');
```

```html
<erd-editor readonly></erd-editor>
```

## systemDarkMode {#systemdarkmode}

Określa, czy edytor ma automatycznie dostosowywać się do ciemnego/jasnego trybu systemu.  
Od wersji `4.0.0` jego włączenie ustawia właściwość `appearance` motywu na `'system'`, tak jak `setPresetTheme({ appearance: 'system' })`. Edytor pokazuje wtedy jasny lub ciemny wygląd zgłaszany przez system operacyjny albo ten, który wskazuje [setSystemAppearance](#setsystemappearance), i przełącza się, gdy ten wygląd się zmienia.  
Późniejsze wywołanie [setPresetTheme](#setpresettheme) z `'light'` lub `'dark'` albo wybór opcji `Light` lub `Dark` w kreatorze motywu lub w szybkim wyszukiwaniu zastępuje `'system'` i pozostaje: następna zmiana w systemie operacyjnym już go nie nadpisuje, mimo że `systemDarkMode` nadal ma wartość `true`. Przed wersją `4.0.0` następna zmiana w systemie operacyjnym go nadpisywała.  
Wyłączenie go, gdy wygląd ma wartość `'system'`, zachowuje jasny lub ciemny wygląd widoczny w tym momencie. Wyłączenie go po zmianie wyglądu z `'system'` na inny pozostawia wygląd bez zmian.  
Jego zmiana nie emituje żadnego zdarzenia.

```js
editor.systemDarkMode = true;
// or
editor.setAttribute('system-dark-mode', 'true');
```

```html
<erd-editor system-dark-mode></erd-editor>
```

## enableThemeBuilder {#enablethemebuilder}

Określa, czy udostępniany jest interfejs do łatwego ustawiania motywów predefiniowanych.  
Pokazuje na pasku narzędzi przycisk `Theme`, który otwiera kreator motywu z opcjami `Accent color`, `Gray color` i `Appearance`. Od wersji `4.0.0` opcja `Appearance` oferuje `System` obok `Light` i `Dark`, a gdy ten atrybut jest włączony, szybkie wyszukiwanie wyświetla pozycję `Theme` z opcjami `System`, `Light` i `Dark`. Zobacz stronę [Język i motyw](../guide/guides/language-and-theme.md).

![Otwieranie kreatora motywu z paska narzędzi, wybieranie koloru akcentu i odcienia szarości oraz przełączanie wyglądu na Light, a potem na System](/img/demo-theme-builder.webp)

```js
editor.enableThemeBuilder = true;
// or
editor.setAttribute('enable-theme-builder', 'true');
```

```html
<erd-editor enable-theme-builder></erd-editor>
```

Zmiana motywu predefiniowanego w tym panelu lub w szybkim wyszukiwaniu emituje zdarzenie [changePresetTheme](#changepresettheme).

## enableLocalePicker {#enablelocalepicker}

Od wersji `4.0.0` określa, czy udostępniany jest interfejs do wyboru języka wyświetlania edytora.  
Pokazuje na pasku narzędzi przycisk `Display Language`, za przyciskiem `Theme`, gdy widoczne są oba. Przycisk otwiera selektor języka, a szybkie wyszukiwanie wyświetla pozycję `Display Language`. Oba oferują opcję `System` i 25 języków – zobacz stronę [Język i motyw](../guide/guides/language-and-theme.md).  
Decyduje też o tym, co edytor pokazuje przed wywołaniem metody [setLocale](#setlocale) lub wybraniem języka: `'system'`, gdy jest włączony, i język angielski, gdy jest wyłączony, więc element, który niczego nie konfiguruje, zachowuje język angielski, który zawsze pokazywał. Włączenie lub wyłączenie od razu przełącza między tymi dwiema możliwościami. Po ustawieniu lub wybraniu języka ten wybór pozostaje bez względu na to, czy atrybut jest włączony, czy wyłączony.  
Ustaw go przed dołączeniem elementu do strony, aby już pierwsza klatka była zgodna z `'system'`.  
Wybór emituje zdarzenie [changeLocale](#changelocale).

```js
editor.enableLocalePicker = true;
// or
editor.setAttribute('enable-locale-picker', 'true');
```

```html
<erd-editor enable-locale-picker></erd-editor>
```

## enableWelcomeScreen {#enablewelcomescreen}

Od wersji `4.0.0` określa, czy pusty diagram wyświetla czytelnikowi [ekran powitalny](../guide/guides/editing-start.md#welcome-screen).  
Wyświetla się nad kartą ERD, dopóki dokument nie ma żadnej tabeli, żadnej widocznej notatki ani żadnej widocznej grupy tabel. Nie jest pokazywany, gdy ustawiony jest atrybut `readonly`, w trybie zen ani gdy otwarte są Właściwości tabeli, podgląd różnic, podróż w czasie lub podgląd Automatycznego układu. Pierwsza tabela, widoczna notatka lub widoczna grupa tabel go ukrywa, a cofnięcie do pustego diagramu przywraca go.  
Jego wiersze `New Table`, `New Memo` i `Command Palette` pokazują pierwszą kombinację klawiszy powiązań `addTable`, `addMemo` i `search` w postaci, w jakiej pozostawiła je metoda [setKeyBindingMap](#setkeybindingmap), a przy nazwie pozostawionej pustej nie pokazują żadnej. Jego strzałki wskazują przyciski `Theme` i `Display Language` tylko wtedy, gdy `enableThemeBuilder` i `enableLocalePicker` je pokazują.  
W jego menu klawisze `↑`, `↓`, `Home` i `End` przechodzą między wierszami, przy czym ich akcja domyślna jest blokowana, a propagacja zatrzymywana. Propagacja klawiszy `Enter` i `Space` jest zatrzymywana, ale ich akcja domyślna nie jest blokowana, więc odbiera je wiersz z fokusem, natomiast `Escape` wśród formatów pozycji `Import` cofa do poprzedniego poziomu, z zablokowaną akcją domyślną i zatrzymaną propagacją. Każdy inny klawisz jak zwykle dociera do edytora i do strony.  
Ekran powitalny niczego nie zmienia w dokumencie, więc pozostawia `value` bez zmian i nie emituje zdarzenia `change`.  
Włącz go dopiero wtedy, gdy [setInitialValue](#setinitialvalue) wczyta dokument, tak jak robią to oficjalne hosty, aby ekran nigdy nie mignął nad plikiem, który wciąż się wczytuje.

```js
editor.enableWelcomeScreen = true;
// or
editor.setAttribute('enable-welcome-screen', 'true');
```

```html
<erd-editor enable-welcome-screen></erd-editor>
```

## value {#value}

### getter {#getter}

Zwraca bieżący dokument jako ciąg JSON w postaci określonej przez [schemat](./advanced/schema.md) edytora.  
Od wersji `4.0.0` jest to postać zapisu, czyli dokument w takiej postaci, w jakiej przechowuje go plik, a zarazem to, co zapisuje eksport `json` i co zapisują oficjalne hosty. Zawiera wyłącznie istniejące encje, bez usuniętych, bez kolejności warstw i bez tego, co edytor wylicza sam, takich jak zmierzone szerokości, oznaczenia kluczy i punkty zaczepienia relacji. Klucze jego encji występują w ustalonej kolejności, wcięcie ma dwie spacje, a na końcu jest znak nowego wiersza, więc ten sam dokument zawsze daje te same bajty.  
Od wersji `4.2.0` pomija też to, co puste: pustą listę `doc`, pustą kolekcję, wiersz słownika, który niczego nie zawiera, oraz puste pole tekstowe encji, takie jak nazwa, komentarz, typ danych, wartość domyślna czy kolor. Lista wewnątrz encji, taka jak `columnIds` tabeli, jest zapisywana nawet wtedy, gdy jest pusta. Pole `doc` nowego dokumentu ma wartość `{}`, a dokument nie ma pola `collections`, więc brakujące pole, listę lub kolekcję odczytuj jako puste. Zawiera nazwy logiczne i flagi wygenerowanej nazwy tabel i kolumn, powiązania kolumn z domenami oraz słowa, terminy i domeny, przy czym każdy słownik jest zapisywany jako jeden nagłówek z nazwami pól, po którym następują jego wiersze, każdy w osobnej linii, w kolejności w arkuszu. Zobacz sekcję [Postać zapisu i wartość czasu wykonania](./advanced/schema.md#storage-form-and-runtime-value).  
Każde ustawienie, którego [blokada](../guide/guides/settings.md#lock) jest włączona, jest zapisywane z wartością, na której je zablokowano, a nie tak, jak pokazuje je ekran. Blokada `Viewport` obejmuje `originX`, `originY` i `zoomLevel`, a każda z blokad `Canvas Type`, `Language`, `Table Name Case`, `Column Name Case`, `Bracket Type` i od wersji `4.2.0` `Name View` obejmuje własne ustawienie. Widok nazw jest zapisywany jako `nameViewMode` i tylko wtedy, gdy nie ma wartości `'physical'`. Każde inne ustawienie jest zapisywane w bieżącym stanie, a pole `lockSettings` jest zapisywane zawsze. Informacje o bitach znajdziesz w sekcji [Settings](./advanced/schema.md#settings); bit blokady `Name View` ma odwrotne znaczenie.  
Od wersji `5.0.0` ustawienia zmieniane przez czytelnika edytora [tylko do odczytu](#readonly) są zapisywane z wartościami dokumentu, także gdy są zablokowane, ponieważ pozostają na tym ekranie.  
Nowy dokument ma włączone wszystkie blokady, niezależnie od tego, czy jest to dokument, który element pokazuje, zanim otrzyma wartość, czy dokument wczytany z pustej wartości. Jego `value` zachowuje punkt początkowy `0, 0`, poziom powiększenia `1`, kartę ERD, domyślny język Generatora kodu, style nazw i typ cudzysłowu, a od wersji `4.2.0` widok `Physical Names`, dopóki nie wyłączy się odpowiedniej blokady.  
Przed wersją `4.0.0` getter zwracał cały dokument w postaci, w jakiej przechowywał go edytor, z uwzględnieniem ustawienia `ignoreSaveSettings`. Dokument w postaci, w jakiej przechowuje go edytor, udostępnia teraz [runtimeValue](#runtimevalue), a `ignoreSaveSettings` nie jest już ani odczytywane, ani zapisywane.

```js
const data = editor.value;
```

### setter {#setter}

Wczytuje wcześniej zapisany stan edytora. Zastępuje cały dokument – bieżący jest najpierw czyszczony. Od wersji `4.2.0` dotyczy to również słów, terminów i domen: dokument przejmuje te, które zawiera tekst, albo nie ma żadnych, a własna historia cofania każdego arkusza karty Słownik zostaje opróżniona.  
Podobnie jak `clear()`, `setInitialValue()` i metody `setSchema*` w domyślnym trybie `mode: 'replace'`, odrzuca też widok trybu Przepływ na karcie Wizualizacja: jego układ, tabele, do których jest zawężony, wyświetlanie wierszy, powiększenie i przesunięcie widoku, a od wersji `4.2.0` także tabele, przez które przechodzą polecenia `Previous table` i `Next table`. Dodawanie (`mode: 'append'`) go nie odrzuca.  
Przypisanie jest zapisywane na liście historii, co umożliwia `Undo, Redo`, i emituje zdarzenie `change`.  
Przyjmuje postać zapisu, wartość [runtimeValue](#runtimevalue) lub plik zapisany przez wcześniejszą wersję.  
Pusty ciąg znaków albo cokolwiek, co nie jest ciągiem znaków, wczytuje nowy dokument zamiast zgłosić błąd, więc sprawdzaj wartość przed jej przypisaniem.  
Ten nowy dokument to ten sam, od którego zaczyna `setInitialValue('')`: pusty, z ustawieniami domyślnymi, a od wersji `4.0.0` z włączonymi wszystkimi blokadami. W wersji `3.10.x` nie zapisywał ani pozycji przewinięcia, ani poziomu powiększenia, a wcześniej zapisywał jedno i drugie.  
Współdzielony magazyn przekazuje to wczytanie współpracownikom razem z pełną treścią JSON nowego dokumentu, więc każdy uczestnik, również korzystający ze starszej wersji, go wczytuje, choć edytor w wersji starszej niż `4.2.0` pomija to, czego nie zna, na przykład nazwy logiczne, powiązania z domenami i słowniki – zobacz sekcję [Mieszanie wersji](./advanced/collaborative-editing.md#mixing-releases).  
Od wersji `4.0.0` blokady wczytanego dokumentu oraz zablokowane wartości, które następnie zapisuje `value`, pochodzą z tekstu, a widok ustawia się tam, gdzie wskazuje tekst, albo na diagramie, gdy w tym miejscu nie widać żadnej jego części. Dla każdego innego ustawienia, które tekst blokuje – karty, języka Generatora kodu, stylów nazw, typu cudzysłowu i od wersji `4.2.0` Widoku nazw – edytor nadal pokazuje to, co pokazywał przed wczytaniem. Ustawienie, którego tekst nie blokuje, przyjmuje wartość z tekstu. Plik zapisany przed wersją `4.2.0` nie wskazuje blokady `Name View`, chyba że edytor w wersji `4.2.0` wyłączył w nim tę blokadę, więc wczytuje się z Widokiem nazw zablokowanym na widoku `Physical Names`, a edytor zachowuje Widok nazw, który pokazywał. Metoda [setInitialValue](#setinitialvalue) przyjmuje natomiast każdą wartość zawartą w tekście; zobacz jej opis również w przypadku tekstu, który nie wskazuje żadnych blokad.  
Tekst, który nie jest w formacie JSON, na przykład plik pozostawiony ze znacznikami konfliktu scalania, również nie powoduje błędu: dokument zostaje opróżniony, jego ustawienia pozostają bez zmian, a błąd parsowania jest zapisywany w konsoli.  
Gdy ustawiony jest atrybut `readonly`, przypisanie jest ignorowane; aby wczytać dokument do edytora tylko do odczytu, użyj metody [setInitialValue](#setinitialvalue).

```js
editor.value = 'json...';
```

## runtimeValue {#runtimevalue}

Od wersji `4.0.0` zwraca dokument w postaci, w jakiej przechowuje go ten edytor, jako ciąg JSON. Ta właściwość nie ma settera, więc przypisanie do niej zgłasza błąd w kodzie działającym w trybie ścisłym.  
Zawiera to, co pomija [value](#value): usunięte encje i ich kolejność, kolejność warstw, zmierzone szerokości, oznaczenia kluczy, punkty zaczepienia relacji i sekwencje, a od wersji `4.2.0` także puste pola tekstowe, listy `doc` i kolekcje; wiersze usunięte z arkusza karty Słownik oraz te, które niczego nie zawierają; klucz kolejności każdego wiersza słownika; listy `doc` słów, terminów i domen; a także powiązanie z usuniętą domeną. Zablokowane ustawienia także tutaj są zapisywane z zablokowanymi wartościami.  
Użyj jej, aby za pomocą metody [setInitialValue](#setinitialvalue) zainicjować inny edytor, który dołącza do już trwającej sesji, na przykład edytor współpracownika lub drugi widok tego samego dokumentu. Cofnięcie usunięcia, które sesja prześle później, przywraca wtedy w tym edytorze całą encję, podczas gdy edytor zainicjowany wartością `value` nie zawiera żadnej usuniętej encji i zamiast tego przywraca pustą tabelę bez nazwy albo, od wersji `4.2.0`, pusty wiersz słownika. Zobacz stronę [Wspólna edycja](./advanced/collaborative-editing.md).  
Usunięte encje nie podlegają już odśmiecaniu, więc pozostają w niej aż do następnego otwarcia dokumentu z pliku.  
Nigdy nie zapisuj jej do pliku: zapisuj `value`, którą akceptuje [JSON Schema](./advanced/schema.md#json-schema), w przeciwieństwie do tej właściwości.

```js
otherEditor.setInitialValue(editor.runtimeValue);
```

## setInitialValue {#setinitialvalue}

Wczytuje wcześniej zapisany stan edytora. Samo wczytanie nie jest zapisywane na liście historii, więc nie można go cofnąć, i nie jest emitowane żadne zdarzenie `change`.  
Czyści też historię cofania, więc niczego, co zrobiono przed wczytaniem, nie można cofnąć ani ponowić na wczytanym dokumencie, a od wersji `4.2.0` czyści również własną historię każdego arkusza karty Słownik.  
Przyjmuje postać zapisu, wartość [runtimeValue](#runtimevalue) lub plik zapisany przez wcześniejszą wersję, a w przeciwieństwie do przypisania do `value` przejmuje każde ustawienie zawarte w tekście, łącznie z kartą i ustawieniami kodu.  
Pusty ciąg znaków albo cokolwiek, co nie jest ciągiem znaków, wczytuje nowy dokument zamiast zgłosić błąd, więc `setInitialValue('')` rozpoczyna pusty diagram.  
Od wersji `4.0.0` ten nowy dokument, który element pokazuje również, zanim otrzyma jakąkolwiek wartość, ma włączone wszystkie blokady. Przewijanie, powiększanie, przełączanie kart oraz zmiana języka Generatora kodu, stylów nazw, typu cudzysłowu lub od wersji `4.2.0` Widoku nazw pozostawiają `value` bez zmian i nie emitują zdarzenia `change`. W wersji `3.10.x` nie zapisywał ani pozycji przewinięcia, ani poziomu powiększenia, a wcześniej zapisywał jedno i drugie.  
Dokument wczytany z tekstu zachowuje blokady, które wskazuje. Dokument, który nie wskazuje żadnych – każdy plik zapisany przed wersją `4.0.0`, niezależnie od wartości `ignoreSaveSettings`, oraz plik `.vuerd` w formacie v2 – otwiera się z włączonymi wszystkimi blokadami, z blokadą `Viewport` na punkcie początkowym `0, 0` i poziomie powiększenia `1`, na karcie ERD, z językiem, stylami nazw i typem cudzysłowu w takiej postaci, w jakiej je zapisał.  
Od wersji `4.2.0` tekst, który wskazuje swoje blokady, ale nie wskazuje blokady `Name View`, również otwiera się z tą blokadą włączoną, nawet gdy każda inna blokada jest wyłączona. Plik zapisany przed wersją `4.2.0` jest takim tekstem, chyba że edytor w wersji `4.2.0` wyłączył w nim tę blokadę (zobacz sekcję [Settings](./advanced/schema.md#settings)). Otwiera się w widoku `Physical Names`, tak jak tekst, który nie wskazuje żadnej blokady.  
Tak czy inaczej widok otwiera się w położeniu widoku dokumentu – zapisanym w tekście, gdy wskazuje on swoje blokady, a w punkcie początkowym `0, 0` przy poziomie powiększenia `1`, gdy nie wskazuje żadnych – albo na diagramie, gdy w tym miejscu nie widać żadnej jego części. Zablokowane ustawienie `Viewport` nadal zachowuje w `value` swoje zablokowane wartości.  
Od wersji `4.0.0` odrzuca też stan współpracy dokumentu przechowywanego wcześniej, a już subskrybujący [współdzielony magazyn](#getsharedstore) tego edytora ponownie prosi pozostałe edytory o ich stan, więc edytor ponownie wczytany w trwającej sesji nadrabia zaległości. Zainicjuj taki edytor wartością [runtimeValue](#runtimevalue) innego edytora.  
Tekst, który nie jest w formacie JSON, również nie powoduje błędu: dokument zostaje opróżniony, jego ustawienia pozostają bez zmian, a błąd parsowania jest zapisywany w konsoli.  
W przeciwieństwie do przypisania do `value` metody tej nie blokuje atrybut `readonly`, więc to właśnie nią wczytuje się dokument do edytora tylko do odczytu. Edytor tylko do odczytu pokazuje wtedy ustawienia, które zawiera wczytany tekst, odrzucając te, które jego czytelnik zmienił na ekranie.

```js
editor.setInitialValue('json...');
```

Wczytaj przy starcie, zapisuj przy zmianie.

```js
editor.setInitialValue(localStorage.getItem('my-diagram') ?? '');
editor.addEventListener('change', () => {
  localStorage.setItem('my-diagram', editor.value);
});
```

## Zdarzenia {#event}

`change`, `changePresetTheme` i `changeLocale` to jedyne trzy zdarzenia publiczne; `changeLocale` to nowość w wersji `4.0.0`.  
Element emituje też na samym sobie wewnętrzne zdarzenia `@dineug/erd-editor/internal-*` na potrzeby komunikacji między własnymi częściami; nie są one częścią interfejsu API.

### change {#change}

Gdy w edytorze zachodzą zmiany, emituje on zdarzenie.  
Zdarzenie jest opóźniane (debounce) o 200 ms i nie jest emitowane, gdy `readonly` ma wartość `true`.  
Jest wywoływane przy każdej zmianie dokumentu – zmianie w interfejsie, przypisaniu do `value`, wywołaniu `clear()` i każdej z metod `setSchema*`, a od wersji `4.0.0` także przy `setSchemaJSON()` i poleceniu `Import and Add`. Metoda `setInitialValue` go nie emituje.  
Od wersji `4.2.0` obejmuje to każdą zmianę na karcie [Słownik](../guide/guides/dictionary.md) i każde jej cofnięcie lub ponowienie, zmianę nazwy logicznej lub powiązania z domeną, polecenie `Derive Physical Names Again` oraz przełączenie Widoku nazw, gdy blokada `Name View` jest wyłączona.  
Nie emituje go nic, co dzieje się w trybie Przepływ na karcie Wizualizacja – powiększenie, przesuwanie widoku, przesuwanie kafelków, polecenie `Tidy Up`, wyświetlanie wierszy, zawężanie widoku z kafelka ani od wersji `4.2.0` przechodzenie o krok poleceniami `Previous table` i `Next table` lub klawiszami cofania i ponawiania – ponieważ nic z tego nie jest zmianą dokumentu. Wyjątkiem jest lista `Name View` tego trybu: przełączenie na niej emituje zdarzenie, gdy blokada `Name View` jest wyłączona, tak jak przełączenie na karcie ERD.  
Od wersji `4.0.0` nie emituje go też zmiana ustawienia, którego [blokada](../guide/guides/settings.md#lock) jest włączona, ponieważ zmienia ona tylko ekran, a nigdy `value`: przewinięcie lub powiększenie kanwy ERD przy zablokowanym ustawieniu `Viewport`, przełączenie karty przy zablokowanym ustawieniu `Canvas Type`, zmiana języka Generatora kodu, stylu nazw tabel, stylu nazw kolumn lub typu cudzysłowu przy włączonej blokadzie danego ustawienia, a od wersji `4.2.0` przełączenie Widoku nazw przy zablokowanym ustawieniu `Name View`. Pomijane są tylko te zmiany, więc pakiet, który edytuje również dokument, nadal je emituje. Zablokowanie lub odblokowanie ustawienia je emituje.  
W nowym dokumencie i w każdym pliku zapisanym przed wersją `4.0.0` wszystkie blokady są włączone, a blokada `Name View` jest włączona w każdym pliku zapisanym przed wersją `4.2.0`, chyba że wyłączył ją w nim edytor w wersji `4.2.0`, więc domyślnie przewijanie, powiększanie, przełączanie kart i przełączanie Widoku nazw niczego nie emitują. Dotyczy to skupiania widoku na tabelach z karty ERD, przycisku kafelka z łączem zewnętrznym, który przenosi z trybu Przepływ z powrotem na kartę ERD, przejścia do wiersza Eksploratora lub dopasowania wyszukiwania, otwarcia Eksploratora lub przejścia do wyniku szybkiego wyszukiwania z innej karty, a od wersji `4.2.0` także przejścia do tabeli lub kolumny z wiersza arkusza `Checks` na karcie Słownik. Każde z nich emituje jedno zdarzenie `change` tylko wtedy, gdy obejmująca je blokada jest wyłączona: `Canvas Type` w przypadku przełączenia karty i `Viewport` w przypadku przewinięcia, które wykonuje również przycisk kafelka, wynik szybkiego wyszukiwania, wiersz Eksploratora, dopasowanie wyszukiwania lub wiersz arkusza `Checks`. Od wersji `4.1.0` każde z tych przewinięć podlega jednej regule opisanej w sekcji [Dokąd prowadzi przejście](../guide/guides/table-related-functions.md#where-a-jump-lands), więc wynik szybkiego wyszukiwania będący tabelą nie przewija już widoku za każdym razem, a przejście, przy którym reguła pozostawia widok w miejscu, nie wykonuje przewinięcia, więc nie ma czego emitować. Otwarcie, zamknięcie lub zmiana rozmiaru Eksploratora zwęża lub poszerza kanwę bez przesuwania jej punktu początkowego i również niczego nie emituje. Przed wersją `4.0.0` przewijanie, powiększanie i przełączanie kart zawsze je emitowały, nawet gdy wartość `editor.value` pozostawała taka sama.  
Aby pominąć zapisy, które niczego nie zmieniają, porównuj `editor.value` z ostatnio zapisaną wartością, a nie z wczytanym plikiem: plik zapisany przez wcześniejszą wersję, plik v2 lub plik edytowany ręcznie może mieć w `value` inną postać zaraz po wczytaniu, ponieważ `value` zapisuje go w postaci zapisu. Podobnie może być z plikiem, którego blokada `Viewport` jest wyłączona, a którego punkt początkowy nie pokazuje na tym ekranie żadnej części diagramu: wczytanie przesuwa widok na diagram, a `value` zapisuje miejsce, w którym się on znalazł. Od wersji `4.0.0` nie powodują tego już zmierzone szerokości, ponieważ `value` ich nie zawiera. Od wersji `4.2.0` inną postać może mieć też plik zapisany przez wersję `4.0.0` lub `4.1.0`, ponieważ `value` pomija teraz jego puste pola tekstowe, listy i kolekcje, więc taki plik zostaje jednorazowo przepisany przy następnym zapisie. Host zapisujący pliki może zamiast tego odróżnić edycję od zmiany widoku za pomocą właściwości `changed` magazynu replikacji – zobacz sekcję [on@change](./advanced/remote-storage.md#onchange).  
Zdarzenie nie ma właściwości `detail`, nie propaguje się w górę ani nie przekracza granicy shadow root, więc nasłuchuj go na samym elemencie i odczytuj `editor.value` w funkcji obsługi.

```js
editor.addEventListener('change', event => {
  const data = event.target.value;
});
```

### changePresetTheme {#changepresettheme}

Emitowane, gdy motyw predefiniowany zmienia się we wbudowanym kreatorze motywu lub, od wersji `4.0.0`, za pomocą pozycji `Theme` w szybkim wyszukiwaniu. Emituje je każdy wybór, również wybór opcji, która już obowiązuje.  
Samodzielne wywołanie [setPresetTheme](#setpresettheme) lub [setSystemAppearance](#setsystemappearance) albo włączenie lub wyłączenie [systemDarkMode](#systemdarkmode) go nie emituje.  
`event.detail` to kompletny obiekt `ThemeOptions` po wyborze – `{ appearance, grayColor, accentColor }` – a nie żądany obiekt częściowy. Od wersji `4.0.0` jego pole `appearance` ma wartość `'system'`, gdy wybrana jest opcja `System`, a nie jasny lub ciemny wygląd, który ona pokazuje, więc zapisz go bez zmian i przekaż z powrotem do `setPresetTheme`.

```js
editor.addEventListener('changePresetTheme', event => {
  const themeOptions = event.detail;
});
```

### changeLocale {#changelocale}

Od wersji `4.0.0` emitowane, gdy w edytorze zostanie wybrany język, w selektorze języka lub za pomocą pozycji `Display Language` w szybkim wyszukiwaniu, przy czym obie te możliwości włącza [enableLocalePicker](#enablelocalepicker).  
Jest wywoływane po zastosowaniu języka, przy każdym wyborze, również przy wyborze opcji, która już obowiązuje. Nigdy nie emitują go metody [setLocale](#setlocale) i [setSystemLocale](#setsystemlocale) ani zmiana języków przeglądarki. Przełączenie języka nie emituje zdarzenia `change`.  
`event.detail` to `{ locale }`, wartość typu `LocaleOption`: `'system'`, gdy wybrano opcję `System`, a w przeciwnym razie kod języka. Element nie zapamiętuje wyboru, więc zapisz go i przekaż do `setLocale` przy następnym wczytaniu.  
Podobnie jak zdarzenie `change`, nie propaguje się w górę, więc nasłuchuj go na samym elemencie.

```js
editor.addEventListener('changeLocale', event => {
  const { locale } = event.detail; // 'system' | 'ko-KR' | ...
});
```

## focus {#focus}

Ustawia fokus na edytorze.

```js
editor.focus();
```

## blur {#blur}

Usuwa fokus z edytora.

```js
editor.blur();
```

## clear {#clear}

Opróżnia dokument, usuwając wszystkie tabele, kolumny, relacje, indeksy i notatki, od wersji `4.0.0` także wszystkie grupy tabel, a od wersji `4.2.0` słowa, terminy i domeny karty Słownik, opróżniając przy tym również własną historię cofania każdego arkusza.  
Wszystkie ustawienia pozostają, w tym baza danych, położenie widoku, poziom powiększenia, opcje widoku tabel, każda blokada wraz z przechowywaną wartością oraz skrypty `Before tables` i `After tables` na karcie Schemat SQL, więc wyczyszczony plik nadal zapisuje to, co zapisywał. Aby zamiast tego rozpocząć nowy dokument, przypisz `''` do `value` lub wywołaj `setInitialValue('')`.  
Czyszczenie jest zapisywane na liście historii, więc można je cofnąć, i emituje zdarzenie `change`. Cofnięcie przywraca dokument w postaci, w jakiej przechowywał go edytor, łącznie z jego słowami, terminami i domenami, z każdym zablokowanym ustawieniem na zablokowanej wartości. Gdy ustawiony jest atrybut `readonly`, metoda jest ignorowana.

```js
editor.clear();
```

## destroy {#destroy}

Całkowicie niszczy instancję edytora, tak że nie można jej już ponownie użyć.  
Zwalnia funkcje nasłuchujące i subskrypcje edytora oraz niszczy każdy współdzielony magazyn zwrócony przez [getSharedStore](#getsharedstore).  
Pakiet strumienia, który współdzielony magazyn jeszcze wstrzymuje, przepada razem z nim; aby go wysłać, najpierw wywołaj metodę [flushStreamBuffers](./advanced/collaborative-editing.md#flushstreambuffers) tego magazynu.

```js
editor.destroy();
```

## setKeyBindingMap {#setkeybindingmap}

Na nowo definiuje skróty klawiaturowe.  
`edit`, `stop`, `undo`, `redo`, `zoomIn`, `zoomOut` i `zoomReset` są stałe i nie można ich przedefiniować.  
Zapisywanych jest tylko dwadzieścia jeden poniższych nazw; wszystko inne w obiekcie jest ignorowane, łącznie ze stałymi nazwami.  
Od wersji `3.10.0` można przedefiniować powiązanie `search`, a w tej wersji dodano `findReplace`. Wcześniej powiązanie `search` było stałe. W wersji `4.0.0` dodano `removeSelection`. W wersji `4.1.0` dodano `addTableGroup` i `groupSelectedTables`.  
Wartość powiązania musi być tablicą `ShortcutOption[]`. Sam ciąg znaków jest ignorowany, więc pisz `{ addTable: [{ shortcut: 'Alt+KeyN' }] }` zamiast `{ addTable: 'Alt+KeyN' }`.  
Pusta tablica jest akceptowana i niczego nie wiąże: `setKeyBindingMap({ findReplace: [] })` pozostawia stronie skrót `Ctrl + F` (Windows/Linux) lub `⌘ + F` (Mac), a `{ search: [] }` robi to samo ze skrótem `Ctrl + K` (Windows/Linux) lub `⌘ + K` (Mac). Przycisk `Search` na pasku narzędzi nadal otwiera szybkie wyszukiwanie, przycisk `Explorer` na pasku narzędzi nadal otwiera i zamyka Eksplorator, a polecenie `Toggle Explorer` w szybkim wyszukiwaniu i w menu kontekstowym kanwy nadal otwiera jego wyszukiwanie lub go zamyka; żadne z nich nie pokazuje skrótu dla nazwy pozostawionej pustej. `{ removeSelection: [] }` pozostawia stronie klawisze `Delete` i `Backspace`, a pozycje usuwania w menu tabeli, notatki i grupy tabel (`Delete`, `Delete selected`, `Delete column`, `Delete columns`) nie pokazują wtedy skrótu.  
Od wersji `4.1.0` obiekt `{ addTableGroup: [] }` pozostawia stronie skrót `Alt + G` (Windows/Linux) lub `⌥ + G` (Mac), a `{ groupSelectedTables: [] }` – skrót `T`, a potem `G`. Pozycja `New Table Group` na pasku narzędzi kanwy, w menu kontekstowym kanwy i w szybkim wyszukiwaniu, pozycja `Group selected tables` w menu tabeli oraz `Group Selected Tables` w szybkim wyszukiwaniu nadal działają, ale bez wyświetlanego skrótu. Podpowiedzi przycisków `New Table`, `New Memo` i `New Table Group` na pasku narzędzi kanwy podają pierwszą kombinację klawiszy powiązań `addTable`, `addMemo` i `addTableGroup` albo, przy powiązaniu pozostawionym pustym, tylko nazwę przycisku.  
Od wersji `4.2.0` powiązania `addColumn` i `removeColumn` wyznaczają też kombinacje klawiszy wierszy w siatce karty Słownik, jak opisano niżej, więc zmiana któregokolwiek z tych powiązań przenosi razem z nim te kombinacje. `{ addColumn: [] }` nie zostawia siatce żadnej kombinacji do wstawiania wierszy, a dwie pozycje wstawiania w menu siatki nie pokazują wtedy skrótu; `{ removeColumn: [] }` nie zostawia jej żadnej do ich usuwania, a pozycja usuwania w tym menu i podpowiedź `Delete Rows` nie pokazują wtedy żadnego skrótu.  
Wywołanie jest częściowym scaleniem: pominięte nazwy zachowują domyślne powiązania, a dwukrotne wywołanie zachowuje wcześniejsze zmiany. Nie ma gettera bieżących powiązań: [createKeyBindingMap](#createkeybindingmap) zwraca wartości domyślne, a nie to, co zmieniła metoda `setKeyBindingMap`.

```ts
type ShortcutOption = {
  shortcut: string;
  preventDefault?: boolean;
  stopPropagation?: boolean;
};

const defaultKeyBindingMap: Omit<
  KeyBindingMap,
  | 'edit'
  | 'stop'
  | 'undo'
  | 'redo'
  | 'zoomIn'
  | 'zoomOut'
  | 'zoomReset'
> = {
  search: [
    { shortcut: '$mod+KeyK', preventDefault: true, stopPropagation: true },
  ],
  findReplace: [
    { shortcut: '$mod+KeyF', preventDefault: true, stopPropagation: true },
  ],
  addTable: [{ shortcut: 'Alt+KeyN', preventDefault: true }],
  addColumn: [{ shortcut: 'Alt+Enter', preventDefault: true }],
  addMemo: [{ shortcut: 'Alt+KeyM', preventDefault: true }],
  addTableGroup: [
    { shortcut: 'Alt+KeyG', preventDefault: true, stopPropagation: true },
  ],
  groupSelectedTables: [{ shortcut: 'KeyT KeyG', preventDefault: true }],
  removeTable: [
    { shortcut: '$mod+Backspace', preventDefault: true },
    { shortcut: '$mod+Delete', preventDefault: true },
  ],
  removeColumn: [
    { shortcut: 'Alt+Backspace', preventDefault: true },
    { shortcut: 'Alt+Delete', preventDefault: true },
  ],
  removeSelection: [
    { shortcut: 'Delete', preventDefault: true },
    { shortcut: 'Backspace', preventDefault: true },
  ],
  primaryKey: [{ shortcut: 'Alt+KeyK', preventDefault: true }],
  selectAllTable: [
    { shortcut: '$mod+KeyA', preventDefault: true },
    { shortcut: '$mod+Alt+KeyA', preventDefault: true },
  ],
  selectAllColumn: [{ shortcut: 'Alt+KeyA', preventDefault: true }],
  relationshipZeroOne: [{ shortcut: '$mod+Alt+Digit1', preventDefault: true }],
  relationshipZeroN: [{ shortcut: '$mod+Alt+Digit2', preventDefault: true }],
  relationshipOneOnly: [{ shortcut: '$mod+Alt+Digit3', preventDefault: true }],
  relationshipOneN: [{ shortcut: '$mod+Alt+Digit4', preventDefault: true }],
  tableProperties: [{ shortcut: 'Alt+Space', preventDefault: true }],
  focusView: [
    { shortcut: 'Alt+KeyF', preventDefault: true, stopPropagation: true },
  ],
  handTool: [{ shortcut: 'Space', preventDefault: true }],
  zenMode: [
    { shortcut: 'Alt+KeyZ', preventDefault: true, stopPropagation: true },
  ],
};

// example
editor.setKeyBindingMap({
  addTable: [{ shortcut: '$mod+KeyN', preventDefault: true }],
});
```

`selectAllTable`, `handTool`, `removeSelection` i od wersji `4.1.0` `groupSelectedTables` ustępują kursorowi tekstowemu: gdy fokus znajduje się w polu wejściowym, w obszarze tekstowym lub w elemencie `contenteditable`, `$mod + A` zaznacza tekst, `Space` wpisuje spację, `Delete` i `Backspace` usuwają tekst, natomiast `T`, a potem `G` wpisuje te dwie litery, zamiast trafiać do kanwy. W przypadku żadnego z tych naciśnięć akcja domyślna nie jest blokowana. Tak samo zachowuje się każdy skrót, do którego przypiszesz je na nowo.

Od wersji `4.0.0` powiązanie `removeSelection` (`Delete` lub `Backspace`) usuwa zaznaczone elementy na karcie ERD jako jeden krok cofania, bez pytania. Gdy tabela z fokusem jest jedynym zaznaczonym elementem, zaznaczona jest co najmniej jedna z jej kolumn, a poziom powiększenia pozwala rysować jej wiersze, usuwa te kolumny; w przeciwnym razie usuwa wszystkie zaznaczone tabele, notatki i grupy tabel, przy czym tabele należące do grupy pozostają. Zobacz sekcję [Usuwanie tabel i notatek](../guide/guides/table-related-functions.md#table-and-memo-deletion).  
Przytrzymany klawisz usuwa tylko raz, a gdy otwarty jest edytor komórki, notatki lub nazwy grupy tabel, nic nie jest usuwane. Poza polem tekstowym oraz panelami i kartami, które zatrzymują powiązania (zobacz [createKeyBindingMap](#createkeybindingmap)), akcja domyślna naciśnięcia jest blokowana na każdej karcie, gdy edytor ma fokus, także na przycisku paska narzędzi z fokusem i w edytorze tylko do odczytu, w którym niczego ono nie usuwa.

Od wersji `4.1.0` powiązanie `addTableGroup` (`Alt+KeyG`) włącza na karcie ERD rysowanie `New Table Group`, w którym następne naciśnięcie przycisku głównego na kanwie rysuje grupę, a ponowne naciśnięcie skrótu wyłącza rysowanie, tak jak przycisk `New Table Group` na pasku narzędzi kanwy. Powiązanie `groupSelectedTables` (`KeyT KeyG`, czyli `T`, a potem `G`) umieszcza zaznaczone tabele w nowej grupie i otwiera edytor jej nazwy, tak jak pozycja `Group selected tables` w menu kontekstowym tabeli. Gdy nie zaznaczono żadnej tabeli, niczego nie dodaje; zaznaczona notatka lub grupa tabel się nie liczy. Zobacz sekcje [Rysowanie grupy](../guide/guides/table-groups.md#drawing-a-group) i [Grupowanie zaznaczonych tabel](../guide/guides/table-groups.md#grouping-selected-tables).  
Oba działają tylko tam, gdzie menu oferują grupy: nie wtedy, gdy ustawiony jest atrybut `readonly`, gdy opcja widoku `Table Groups` ukrywa grupy, ani gdy otwarty jest edytor komórki, notatki lub nazwy grupy tabel. Podobnie jak pozostałe powiązania kanwy, działają tylko na karcie ERD i nie wtedy, gdy otwarte jest szybkie wyszukiwanie, Właściwości tabeli, podgląd różnic, podróż w czasie, podgląd Automatycznego układu albo okno dialogowe `Export image` lub `Map Columns`. Tam, gdzie nic nie robią, akcja domyślna naciśnięcia jest nadal blokowana, chyba że `groupSelectedTables` ustępuje kursorowi tekstowemu. W przypadku `addTableGroup` zatrzymywana jest też propagacja, tak jak w przypadku `focusView` i `zenMode`, więc funkcja nasłuchująca `keydown` strony w fazie bąbelkowania nigdy nie odbiera tego naciśnięcia.

Od wersji `4.2.0` na karcie [Słownik](../guide/guides/dictionary.md#adding-and-deleting-rows) każda kombinacja jednego naciśnięcia z powiązania `addColumn` wstawia poniżej zaznaczenia tyle wierszy, ile obejmuje zaznaczenie, ta sama kombinacja z dodatkowo przytrzymanym klawiszem `Shift` wstawia je powyżej, a każda kombinacja jednego naciśnięcia z powiązania `removeColumn` usuwa wiersze objęte zaznaczeniem: przy ustawieniach domyślnych są to `Alt+Enter`, `Alt+Shift+Enter` oraz `Alt+Backspace` lub `Alt+Delete`. Działają w siatce arkuszy `Domains`, `Words` i `Terms`, gdy nie jest otwarta edycja żadnej komórki. Kombinacja z powiązania `addColumn`, która już zawiera `Shift`, nie daje kombinacji do wstawiania powyżej, a sekwencja przypisana do któregoś z tych powiązań nie daje siatce niczego.  
Akcja domyślna każdego takiego naciśnięcia jest blokowana zgodnie z jego opcją, a propagacja jest zawsze zatrzymywana, więc nie dodaje ono ani nie usuwa żadnej kolumny na karcie ERD. W arkuszu `Checks` i w edytorze tylko do odczytu nic nie robi, choć jego akcja domyślna jest nadal blokowana, a propagacja zatrzymywana. W otwartej edycji komórki lub w polu wyszukiwania karty kombinacje te są pozostawiane tekstowi: ich propagacja jest tam zatrzymywana, ale akcja domyślna nie jest blokowana, więc pole reaguje na nie tak jak w każdym innym miejscu (na komputerze Mac `⌥ + Backspace` usuwa wyraz). Wymienia je funkcja [dictionaryRowChords](#dictionaryrowchords).

Od wersji `3.10.0` powiązanie `findReplace` (`$mod+KeyF`) otwiera funkcję [Znajdź i zamień](../guide/guides/find-and-replace.md). Od wersji `4.1.0` otwiera i zamyka zawierający ją [Eksplorator](../guide/guides/explorer.md#opening-and-closing), a karta Skróty klawiaturowe wyświetla je jako `Toggle Explorer`.  
Gdy przycisk `Explorer` na pasku narzędzi jest wciśnięty (Eksplorator jest otwarty na karcie ERD i nie ukrywa go tryb zen), zamyka Eksplorator, chyba że otwarte jest szybkie wyszukiwanie, Właściwości tabeli, kreator motywu, selektor języka, okno dialogowe `Export image` lub `Map Columns`. W przeciwnym razie zamyka to z nich, które jest otwarte, przełącza z każdej innej karty na kartę ERD i otwiera Eksplorator z kursorem tekstowym w polu `Find` i zaznaczonym wyszukiwanym tekstem. Edytor zbyt wąski, by pokazać Eksplorator obok kanwy, pozostawia go otwartym, ale ustępującym miejsca, i pokazuje powiadomienie `Widen the window to show the Explorer`. Przed wersją `4.1.0` otwierało pływający panel Znajdź i zamień lub zwracało klawiaturę do jego pola i nigdy go nie zamykało.  
Nie ustępuje kursorowi tekstowemu: gdy edytor ma fokus, jest przechwytywane na każdej karcie, zarówno z kanwy, jak i z pola wejściowego wewnątrz edytora. Akcja domyślna naciśnięcia jest blokowana, więc przeglądarka nie otwiera paska wyszukiwania, a jego propagacja jest zatrzymywana, więc żadna funkcja nasłuchująca `keydown` strony w fazie bąbelkowania go nie odbiera. Gdy otwarty jest edytor komórki lub notatki, od wersji `4.0.0` edytor nazwy grupy tabel albo od wersji `4.2.0` edycja komórki w siatce karty Słownik, akcja domyślna jest nadal blokowana, a propagacja zatrzymywana, ale powiązanie nic nie robi. W tym ostatnim przypadku nic nie robi również `search`, więc dotychczas wpisany tekst pozostaje.  
Gdy otwarty jest podgląd różnic, podróż w czasie lub podgląd Automatycznego układu, na dowolnej karcie, albo gdy edytor metody wprowadzania (IME) nadal składa znaki, akcja domyślna nie jest blokowana ani propagacja nie jest zatrzymywana, więc naciśnięcie trafia do własnego wyszukiwania przeglądarki lub hosta. Wewnątrz Eksploratora propagacja naciśnięcia wykonanego w trakcie składania znaków jest tam zatrzymywana, choć jego akcja domyślna nie jest blokowana. Tak samo zachowuje się każdy skrót, do którego przypiszesz `findReplace`.

Powiązanie `focusView` działa tylko na karcie ERD. Gdy zaznaczona jest co najmniej jedna tabela, otwiera kartę Wizualizacja w trybie Przepływ, zawężoną do tych tabel i każdej tabeli oddalonej o jedną relację; zaznaczona notatka lub grupa tabel się nie liczy, a gdy nie zaznaczono żadnej tabeli, nic nie robi. Zobacz sekcję [Skupianie widoku na tabelach](../guide/guides/visualization.md#focusing-on-tables).

Powiązania `undo` i `redo` działają zależnie od karty. Na karcie ERD cofają i ponawiają zmiany z historii dokumentu. Od wersji `4.2.0` na karcie Słownik cofają i ponawiają zmiany z własnej historii wyświetlanego arkusza, a w arkuszu `Checks` niczego nie robią – zobacz sekcję [Arkusze karty Słownik](../guide/guides/undo-redo.md#dictionary-sheets). W trybie Przepływ na karcie Wizualizacja cofają się o krok i przechodzą o krok do przodu, tak jak polecenia [`Previous table` i `Next table`](../guide/guides/visualization.md#previous-table-and-next-table), nie naruszając historii dokumentu. Na pozostałych kartach i w trybie Graf niczego nie cofają.

Powiązanie `stop` (`Escape`) na karcie ERD kończy otwarty edytor komórki lub notatki albo rysowanie relacji i pozostawia zaznaczenie bez zmian. Od wersji `4.0.0` kończy też edytor nazwy grupy tabel, nie zapisując nazwy, oraz rysowanie `New Table Group`. Edytor wywołuje dla tego naciśnięcia `preventDefault()`.  
Gdy nic z tego nie jest otwarte, klawisz `Escape` anuluje zaznaczenie i usuwa fokus z komórki, a jego akcja domyślna nie jest blokowana. Wyjście z edycji i anulowanie zaznaczenia wymaga więc dwóch naciśnięć.  
Od wersji `4.2.0`, gdy wyświetlana jest lista terminów komórki nazwy logicznej (zobacz sekcję [Uzupełnianie nazw terminów](../guide/guides/logical-names.md#completing-term-names)), pierwsze naciśnięcie `Escape` zamyka tylko tę listę i pozostawia edytor otwarty. To naciśnięcie ma blokowaną akcję domyślną i zatrzymywaną propagację już w komórce, więc nie odbiera go ani `stop`, ani funkcja nasłuchująca `keydown` strony w fazie bąbelkowania.  
Poza Eksploratorem, formatami pozycji `Import` na [ekranie powitalnym](#enablewelcomescreen), listą terminów komórki nazwy logicznej, kartą [Słownik](../guide/guides/dictionary.md#keys-on-the-tab) oraz opisanymi niżej selektorami i oknami dialogowymi edytor nigdy nie zatrzymuje propagacji klawisza `Escape`, więc strona, która sama go nasłuchuje, na przykład aby zamknąć własne okno dialogowe, odbiera oba naciśnięcia i może pominąć to, którego `defaultPrevented` ma wartość `true`.  
Gdy otwarte jest szybkie wyszukiwanie, właściwości tabeli, podgląd różnic, podgląd Automatycznego układu lub podróż w czasie, klawisz `Escape` zamyka zamiast tego to, co jest otwarte, i pozostawia zaznaczenie bez zmian. Akcja domyślna tego naciśnięcia również nie jest blokowana.  
Od wersji `4.0.0` otwarte okno dialogowe [`Export image`](../guide/guides/file-import-export.md#image) lub [`Map Columns`](../guide/guides/relationship-editing.md#map-columns) również przechwytuje `Escape`, zamykając się i pozostawiając zaznaczenie bez zmian. Każde z nich po otwarciu przejmuje klawiaturę, a to naciśnięcie `Escape` ma zarówno blokowaną akcję domyślną, jak i zatrzymywaną propagację.  
Od wersji `4.1.0` naciśnięcie `Escape`, gdy fokus jest wewnątrz [Eksploratora](../guide/guides/explorer.md#keys-in-the-explorer), w jego drzewie, polach lub przyciskach, zwraca klawiaturę kanwie i pozostawia Eksplorator otwarty, a zaznaczenie bez zmian. Edytor wywołuje dla niego zarówno `preventDefault()`, jak i `stopPropagation()`, więc nigdy nie dociera ono do funkcji nasłuchującej `keydown` strony w fazie bąbelkowania.  
Naciśnięcie `Escape` na kanwie nigdy nie zamyka Eksploratora. Przed wersją `4.1.0` naciśnięcie `Escape` wewnątrz panelu Znajdź i zamień zamykało go, a na kanwie zamykało go to samo naciśnięcie, które anulowało zaznaczenie.  
Od wersji `4.0.0` selektor języka i selektor kolorów zamykają się po naciśnięciu `Escape`: wewnątrz nich akcja domyślna jest blokowana, a propagacja zatrzymywana, natomiast na kanwie zamyka je to samo naciśnięcie, które anuluje zaznaczenie, bez blokowania akcji domyślnej i bez zatrzymywania propagacji.  
Naciśnięcie `Escape`, gdy IME nadal składa znaki, należy do składania znaków. Pozostawia otwarty edytor bez zmian i nie ma blokowanej akcji domyślnej, więc strona również może pominąć naciśnięcie, którego `isComposing` ma wartość `true` lub którego `keyCode` ma wartość `229`. Wewnątrz Eksploratora takie naciśnięcie, jak każdy klawisz naciśnięty tam w trakcie składania znaków, ma też zatrzymywaną propagację, a klawiatura pozostaje w polu.  
Przed wersją `3.9.2` pojedyncze naciśnięcie `Escape` jednocześnie kończyło edycję lub rysowanie i anulowało zaznaczenie, a edytor nigdy nie blokował jego akcji domyślnej.

### createKeyBindingMap {#createkeybindingmap}

Od wersji `3.9.2` pakiet eksportuje funkcję `createKeyBindingMap()`, a razem z nią typy `KeyBindingMap`, `KeyBindingName` i `ShortcutOption`.  
Zwraca domyślne powiązania klawiszy, wszystkie 28 nazw łącznie ze stałymi, przy każdym wywołaniu jako nową mapę, więc zmiana zwróconej mapy niczego więcej nie zmienia.  
Od tych powiązań zaczyna każdy edytor, a wywołanie `setKeyBindingMap` nie jest w nich widoczne.  
Spośród tych czterech tylko `createKeyBindingMap` jest eksportem czasu wykonania; pozostałe trzy to typy. Od wersji `4.2.0` obok niej eksportowana jest funkcja [dictionaryRowChords](#dictionaryrowchords).

```ts
type KeyBindingName =
  | 'edit'
  | 'stop'
  | 'search'
  | 'findReplace'
  | 'undo'
  | 'redo'
  | 'addTable'
  | 'addColumn'
  | 'addMemo'
  | 'addTableGroup'
  | 'groupSelectedTables'
  | 'removeTable'
  | 'removeColumn'
  | 'removeSelection'
  | 'primaryKey'
  | 'selectAllTable'
  | 'selectAllColumn'
  | 'relationshipZeroOne'
  | 'relationshipZeroN'
  | 'relationshipOneOnly'
  | 'relationshipOneN'
  | 'tableProperties'
  | 'focusView'
  | 'zoomIn'
  | 'zoomOut'
  | 'zoomReset'
  | 'handTool'
  | 'zenMode';

type KeyBindingMap = Record<KeyBindingName, ShortcutOption[]>;

declare function createKeyBindingMap(): KeyBindingMap;

// example
import { createKeyBindingMap } from '@dineug/erd-editor';

const shortcuts = Object.values(createKeyBindingMap())
  .flat()
  .map(({ shortcut }) => shortcut); // 'Enter', 'Escape', '$mod+KeyK', ...
```

Każde pole `shortcut` to kombinacja klawiszy w składni [tinykeys](https://github.com/jamiebuilds/tinykeys), określająca klawisz według `KeyboardEvent.code`, przy czym [`$mod`](#mod) oznacza `⌘` w systemie macOS i `Control` w pozostałych systemach.  
Od wersji `4.0.0` edytor odczytuje te kombinacje samodzielnie, a nie za pośrednictwem tinykeys, w tej samej składni. Klawisz pasuje według swojej właściwości `code` lub według właściwości `key` w dowolnej wielkości liter, a naciśnięcie pasuje tylko wtedy, gdy przytrzymane są dokładnie te klawisze modyfikujące, które wskazuje kombinacja. Klawisz `AltGraph` liczy się jako `Control` i `Alt` w systemie Windows oraz jako `Alt` w systemie macOS. Naciśnięcia oddzielone spacją tworzą sekwencję, która zaczyna się od nowa po sekundzie bez zdarzenia keydown.  
Od wersji `4.1.0` jedno z domyślnych powiązań jest sekwencją: `groupSelectedTables` to `KeyT KeyG`, czyli `T`, a potem `G`. Sekwencja uruchamia się przy naciśnięciu, które ją kończy, i tylko to naciśnięcie otrzymuje jej flagi `preventDefault` i `stopPropagation`, więc przy ustawieniach domyślnych klawisz `T` dociera do strony, a akcja domyślna jest blokowana tylko dla `G`. Menu, szybkie wyszukiwanie i karta Skróty klawiaturowe pokazują sekwencję jako jeden klawisz na każde naciśnięcie.  
Stałe nazwy są powiązane z `Enter` (`edit`), `Escape` (`stop`), `$mod+KeyZ` (`undo`), `$mod+Shift+KeyZ` (`redo`), `$mod+Equal` (`zoomIn`), `$mod+Minus` (`zoomOut`) i `$mod+Digit0` (`zoomReset`). `edit` i `stop` nie mają flag; pozostałych pięć ma flagi `preventDefault` i `stopPropagation`. Reszta to powyższe wartości domyślne, w tym `search` i `findReplace`.

Edytor nasłuchuje ich na własnym elemencie, więc host, który przechwytuje klawisze przed edytorem, za pomocą globalnych skrótów klawiaturowych lub funkcji nasłuchującej `keydown` w fazie przechwytywania, musi je przepuszczać, gdy edytor ma fokus.  
Zbuduj listę klawiszy do przepuszczenia na podstawie `createKeyBindingMap()`, zastępując domyślne powiązania tymi, które przekazano do `setKeyBindingMap`.  
Od wersji `3.10.0` lista ta zawiera `$mod+KeyF`, czyli kombinację własnego wyszukiwania przeglądarki. Host, który chce zachować pod tą kombinacją własne wyszukiwanie, wywołuje `setKeyBindingMap({ findReplace: [] })`.  
Od wersji `4.0.0` zawiera też same klawisze `Delete` i `Backspace`. Host, który chce zachować te klawisze, wywołuje `setKeyBindingMap({ removeSelection: [] })`.  
Od wersji `4.1.0` zawiera też `Alt+KeyG` i sekwencję `KeyT KeyG`, która ma postać jednego ciągu znaków: podziel ją w miejscu spacji i przepuszczaj każde naciśnięcie, łącznie z samymi `T` i `G`, ponieważ sekwencja, w której brakuje naciśnięcia, nigdy nie zostaje dokończona. Host, który chce zachować te klawisze, wywołuje `setKeyBindingMap({ addTableGroup: [] })` lub `setKeyBindingMap({ groupSelectedTables: [] })`.  
Od wersji `4.2.0` dodaj do niej kombinacje, które [dictionaryRowChords](#dictionaryrowchords) zwraca dla tej samej mapy, w tym `Alt+Shift+Enter`. Host, który chce zachować te klawisze, wywołuje `setKeyBindingMap({ addColumn: [] })` lub `setKeyBindingMap({ removeColumn: [] })`, co odbiera je również dodawaniu i usuwaniu kolumn na karcie ERD.

Gdy fokus znajduje się wewnątrz Eksploratora, w jego drzewie, polach `Find` i `Replace` lub przyciskach, powiązania `findReplace`, `search`, `undo`, `redo`, `zoomIn`, `zoomOut` i `zoomReset` przechodzą do edytora, więc `findReplace` działa tam tak samo jak na kanwie. Każde inne powiązanie w bieżącym ustawieniu zatrzymuje się na Eksploratorze, sekwencja na swoim ostatnim naciśnięciu (przy ustawieniach domyślnych samo `G`), i tak samo klawisze strzałek, `Tab`, `Enter`, `Space`, `Home`, `End` oraz każdy klawisz naciśnięty, gdy IME nadal składa znaki. Z wyjątkiem klawisza `Escape`, który zwraca klawiaturę kanwie, ich propagacja jest zatrzymywana bez blokowania akcji domyślnej, więc działają jak zwykłe klawisze w polach, przyciskach i drzewie Eksploratora i nie docierają ani do kanwy, ani do funkcji nasłuchującej `keydown` strony w fazie bąbelkowania: `Alt + N` nie dodaje tam tabeli, a `Delete` niczego nie usuwa. Klawisze, które poruszają się po wierszach drzewa, zwijają je lub do nich przechodzą, oraz `Enter` w polu `Find` lub `Replace`, który przechodzi przez dopasowania lub zamienia, mają również blokowaną akcję domyślną.  
Każdy inny klawisz, na przykład kombinacja zapisu lub palety poleceń hosta, trafia jak zwykle do strony. Zobacz sekcję [Klawisze w Eksploratorze](../guide/guides/explorer.md#keys-in-the-explorer). Przed wersją `4.1.0` pływający panel Znajdź i zamień zatrzymywał klawisze w ten sam sposób, z wyjątkiem `Home`, `End`, ostatniego naciśnięcia sekwencji i `Space`, gdy powiązanie `handTool` było przypisane do innego klawisza.  
Od wersji `4.0.0` selektor języka zatrzymuje klawisze w ten sam sposób: przechodzi tych samych siedem powiązań, a każde inne powiązanie (od wersji `4.1.0` sekwencja na swoim ostatnim naciśnięciu), klawisze strzałek i `Tab` mają tam zatrzymywaną propagację bez blokowania akcji domyślnej, podobnie jak każdy klawisz naciśnięty, gdy IME nadal składa znaki. `↑`, `↓`, `Home`, `End`, `Enter` i `Space` na jednym z jego wierszy przechodzą między wierszami lub wybierają jeden z nich i mają również blokowaną akcję domyślną.

Od wersji `4.2.0` klawisze zatrzymuje też karta [Słownik](../guide/guides/dictionary.md#keys-on-the-tab), przy czym do edytora przechodzą tylko `search`, `findReplace`, `undo` i `redo`. Powiązania `undo` i `redo` działają na własnej historii wyświetlanego arkusza, a gdy otwarta jest edycja komórki lub fokus znajduje się w polu wyszukiwania karty, są pozostawiane tekstowi: ich propagacja jest tam zatrzymywana, ale akcja domyślna nie jest blokowana. Powiązania `search` i `findReplace` nic nie robią, gdy otwarta jest edycja komórki, jak opisano wyżej. Kombinacje klawiszy wierszy działają w siatce, jak opisano wyżej przy `addColumn` i `removeColumn`.  
Każde inne powiązanie w bieżącym ustawieniu zatrzymuje się na karcie, sekwencja na swoim ostatnim naciśnięciu, i tak samo klawisze strzałek, `Tab`, `Enter`, `Space`, `Home`, `End` oraz każdy klawisz naciśnięty, gdy IME nadal składa znaki. Żadne z nich nie dociera ani do kanwy, ani do funkcji nasłuchującej `keydown` strony w fazie bąbelkowania: `Alt + N` nie dodaje tam tabeli, a `Delete` niczego nie usuwa z diagramu. Zdarzenia kopiowania, wycinania i wklejania na tej karcie również się na niej zatrzymują, więc diagram nigdy nie traktuje ich jako własnych. Każdy inny klawisz trafia jak zwykle do strony.

### dictionaryRowChords {#dictionaryrowchords}

Od wersji `4.2.0` pakiet eksportuje funkcję `dictionaryRowChords()`. Zwraca ona, przy każdym wywołaniu jako nową tablicę `ShortcutOption[]`, wszystkie kombinacje klawiszy, którymi siatka karty Słownik wstawia lub usuwa wiersze przy przekazanej mapie powiązań klawiszy.  
Są to kolejno: kombinacje jednego naciśnięcia z powiązania `addColumn`, które wstawiają wiersze poniżej zaznaczenia; każda z nich z dodatkowo przytrzymanym klawiszem `Shift`, wstawiająca wiersze powyżej, przy czym kombinacja, która już zawiera `Shift`, nie ma takiego odpowiednika; oraz kombinacje jednego naciśnięcia z powiązania `removeColumn`, które usuwają wiersze. Każda zachowuje flagi `preventDefault` i `stopPropagation` powiązania, z którego pochodzi, a sekwencja jest pomijana. Zobacz sekcję [Dodawanie i usuwanie wierszy](../guide/guides/dictionary.md#adding-and-deleting-rows).  
Kombinacja wstawiająca wiersze powyżej, przy ustawieniach domyślnych `Alt+Shift+Enter`, nie należy do żadnego powiązania, więc host, który dopasowuje klawisze modyfikujące dokładnie i buduje listę klawiszy do przepuszczenia wyłącznie na podstawie [createKeyBindingMap](#createkeybindingmap), nigdy jej nie przepuszcza. Przepuszczaj obie listy, tak jak robi to wtyczka Obsidian.  
Funkcja odczytuje tylko przekazaną mapę, a nie powiązania elementu, więc przekaż jej mapę, na podstawie której budujesz swoją listę klawiszy.

```ts
declare function dictionaryRowChords(
  keyBindingMap: KeyBindingMap
): ShortcutOption[];

// example
import { createKeyBindingMap, dictionaryRowChords } from '@dineug/erd-editor';

const map = createKeyBindingMap();
const shortcuts = [
  ...Object.values(map).flat(),
  ...dictionaryRowChords(map),
].map(({ shortcut }) => shortcut);
// dictionaryRowChords(map): 'Alt+Enter', 'Alt+Shift+Enter', 'Alt+Backspace', 'Alt+Delete'
```

### $mod {#mod}

Zmienia klawisz `Control` w zależności od środowiska.

- Mac: $mod = Meta (⌘)
- Windows/Linux: $mod = Control

### Tabela skrótów klawiaturowych {#shortcut-table}

Używa właściwości `key, code` zdarzenia klawiatury.  
Używaj `code` dla bezwzględnych pozycji, a `key` dla wprowadzanych wartości.

| Windows       | macOS           | `key`         | `code`                         |
| ------------- | --------------- | ------------- | ------------------------------ |
| nie dotyczy    | `Command` / `⌘` | `Meta`        | `MetaLeft` / `MetaRight`       |
| `Alt`         | `Option` / `⌥`  | `Alt`         | `AltLeft` / `AltRight`         |
| `Control`     | `Control` / `^` | `Control`     | `ControlLeft` / `ControlRight` |
| `Shift`       | `Shift`         | `Shift`       | `ShiftLeft` / `ShiftRight`     |
| `Space`       | `Space`         | nie dotyczy    | `Space`                        |
| `Enter`       | `Return`        | `Enter`       | `Enter`                        |
| `Esc`         | `Esc`           | `Escape`      | `Escape`                       |
| `Backspace`   | `Delete` / `⌫`  | `Backspace`   | `Backspace`                    |
| `Delete`      | `fn` + `Delete` | `Delete`      | `Delete`                       |
| `1`, `2` itd. | `1`, `2` itd.   | `1`, `2` itd. | `Digit1`, `Digit2` itd.        |
| `a`, `b` itd. | `a`, `b` itd.   | `a`, `b` itd. | `KeyA`, `KeyB` itd.            |
| `-`           | `-`             | `-`           | `Minus`                        |
| `=`           | `=`             | `=`           | `Equal`                        |
| `+`           | `+`             | `+`           | `Equal`                        |

## Motyw {#theme}

### setPresetTheme {#setpresettheme}

Ustawia motyw predefiniowany.  
Wartości domyślne to `appearance: 'dark'`, `grayColor: 'slate'` i `accentColor: 'indigo'`.  
Każde pole jest stosowane osobno, więc wywołanie częściowe pozostawia pozostałe dwa bez zmian. Wartość spoza poniższych nazw jest ignorowana, a wywołanie nigdy nie zgłasza błędu.  
Od wersji `4.0.0` pole `appearance` przyjmuje też `'system'`, czyli opcję `System` kreatora motywu. Wartość ta pokazuje jasny lub ciemny wygląd zgłaszany przez system operacyjny albo ten, który wskazuje [setSystemAppearance](#setsystemappearance), i przełącza się, gdy ten wygląd się zmienia.

```ts
type ThemeOptions = {
  appearance: 'dark' | 'light' | 'system';
  grayColor: 'gray' | 'mauve' | 'slate' | 'sage' | 'olive' | 'sand';
  accentColor:
    | 'gray'
    | 'gold'
    | 'bronze'
    | 'brown'
    | 'yellow'
    | 'amber'
    | 'orange'
    | 'tomato'
    | 'red'
    | 'ruby'
    | 'crimson'
    | 'pink'
    | 'plum'
    | 'purple'
    | 'violet'
    | 'iris'
    | 'indigo'
    | 'blue'
    | 'cyan'
    | 'teal'
    | 'jade'
    | 'green'
    | 'grass'
    | 'lime'
    | 'mint'
    | 'sky';
};

// example
editor.setPresetTheme({ appearance: 'light' });
```

### setSystemAppearance {#setsystemappearance}

Od wersji `4.0.0` wskazuje, czy wygląd `'system'` ma być jasny, czy ciemny, dla hosta z własnymi wariantami jasnym i ciemnym, takimi jak motyw IDE. Dopóki wskazany jest jeden z nich, zmiany w systemie operacyjnym są ignorowane.  
`null` albo dowolna wartość inna niż `'dark'` lub `'light'` przywraca podążanie za systemem operacyjnym.  
Gdy wygląd ma wartość `'light'` lub `'dark'`, metoda niczego nie zmienia na ekranie, ale wartość jest zachowywana i zaczyna obowiązywać, gdy tylko wygląd zmieni się na `'system'`. W przeciwnym razie obowiązuje od razu. Metoda niczego nie emituje, a zdarzenie `changePresetTheme` nadal zgłasza `'system'`.  
Hosty VS Code, JetBrains i Obsidian wywołują tę metodę z własnym jasnym lub ciemnym wyglądem i ponownie przy każdej jego zmianie.

```js
editor.setPresetTheme({ appearance: 'system' });
editor.setSystemAppearance('light'); // null follows the OS again
```

### setTheme {#settheme}

Pozwala dostosować motyw.  
Każde wywołanie zastępuje całą niestandardową nakładkę, więc aby zmienić jeden token w istniejącym nadpisaniu, przekaż ponownie pełny obiekt, a aby wrócić do motywu predefiniowanego, przekaż `{}`.  
Zachowywane są tylko poniższe nazwy tokenów z wartościami w postaci ciągów znaków; wszystko inne jest odrzucane bez błędu.  
Nakładka leży nad motywem predefiniowanym, więc późniejsze wywołanie `setPresetTheme` wymienia motyw predefiniowany pod spodem, a nadpisania pozostają.

#### JavaScript {#javascript}

```ts
type Theme = {
  grayColor1: string;
  grayColor2: string;
  grayColor3: string;
  grayColor4: string;
  grayColor5: string;
  grayColor6: string;
  grayColor7: string;
  grayColor8: string;
  grayColor9: string;
  grayColor10: string;
  grayColor11: string;
  grayColor12: string;

  accentColor1: string;
  accentColor2: string;
  accentColor3: string;
  accentColor4: string;
  accentColor5: string;
  accentColor6: string;
  accentColor7: string;
  accentColor8: string;
  accentColor9: string;
  accentColor10: string;
  accentColor11: string;
  accentColor12: string;

  canvasBackground: string;
  canvasBoundaryBackground: string;

  tableBackground: string;
  tableHeaderBackground: string;
  tableSelect: string;
  tableBorder: string;
  tableShadow: string;

  tableGroupHeaderBackground: string;
  tableGroupBackground: string;
  tableGroupBorder: string;

  memoBackground: string;
  memoSelect: string;
  memoBorder: string;
  memoShadow: string;

  columnSelect: string;
  columnSelectHover: string;
  columnHover: string;

  columnHandleBackground: string;
  columnHandleBorder: string;
  columnHandleHoverBackground: string;
  columnHandleHoverBorder: string;

  relationshipHover: string;

  visualizationLink: string;
  visualizationColumn: string;
  visualizationRelationship: string;

  toolbarBackground: string;

  contextMenuBackground: string;
  contextMenuSelect: string;
  contextMenuHover: string;
  contextMenuBorder: string;

  minimapBorder: string;
  minimapShadow: string;
  minimapViewportBorder: string;
  minimapViewportBorderHover: string;

  toastBackground: string;
  toastBorder: string;
  toastSuccess: string;
  toastError: string;

  findReplaceError: string;

  mapColumnsError: string;

  schemaSqlWarningBackground: string;
  schemaSqlWarningForeground: string;

  dragSelectBackground: string;
  dragSelectBorder: string;

  scrollbarTrack: string;
  scrollbarThumb: string;
  scrollbarThumbHover: string;

  foreground: string;
  active: string;
  placeholder: string;

  focus: string;
  inputActive: string;

  keyPK: string;
  keyFK: string;
  keyPFK: string;

  treeBackground: string;
  treeRowHover: string;
  treeRowCurrent: string;
  treeMuted: string;
  treeMatch: string;

  explorerBackground: string;
  explorerBorder: string;

  dictionaryErrorForeground: string;
  dictionaryErrorBackground: string;
  dictionaryWarningForeground: string;
  dictionaryWarningBackground: string;
  dictionaryBackground: string;
  dictionaryHeaderBackground: string;
  dictionaryGridLine: string;
  dictionaryHeaderSelect: string;

  diffInsertForeground: string;
  diffDeleteForeground: string;
  diffModifyForeground: string;
  diffRenameForeground: string;
};

// example
editor.setTheme({
  canvasBackground: '#1b1b1f',
  tableBackground: '#242429',
  keyPK: '#ffc53d',
});
```

`tableShadow` i `memoShadow` to kolor cienia, który tabele i notatki rzucają na kanwę ERD. Ciemny motyw predefiniowany ustawia je na `transparent`, co oznacza brak cienia, tak samo jak przekazanie do `setTheme` wartości `none` lub pustego ciągu znaków; jasny motyw predefiniowany używa `rgba(0, 0, 0, 0.18)`.

Od wersji `4.0.0` jest dziewięć dodatkowych tokenów:

- `tableGroupHeaderBackground`, `tableGroupBackground` i `tableGroupBorder` nadają kolor paskowi tytułu, wnętrzu i obrysowi [grupy tabel](../guide/guides/table-groups.md), która nie ma własnego koloru.
- `toastSuccess` i `toastError` nadają kolor znacznikowi powiadomienia, które informuje, jak coś się zakończyło.
- `findReplaceError` i `mapColumnsError` nadają kolor błędom, które pokazują funkcja Znajdź i zamień oraz okno dialogowe „Mapuj kolumny”. Wcześniej funkcja Znajdź i zamień używała `diffDeleteForeground`, więc nadpisanie tego tokenu już nie zmienia jej koloru.
- `schemaSqlWarningBackground` i `schemaSqlWarningForeground` nadają kolor ostrzeżeniom w opcjach karty Schemat SQL.

Od wersji `4.1.0` jest dziewięć kolejnych tokenów:

- `treeBackground`, `treeRowHover`, `treeRowCurrent`, `treeMuted` i `treeMatch` nadają kolor drzewu, które współdzielą [Eksplorator](../guide/guides/explorer.md#the-tree) i [Podgląd różnic](../guide/guides/table-related-functions.md#diff-viewer): jego tłu, które wypełnia też pola `Find` i `Replace` Eksploratora; wierszowi pod wskaźnikiem, wierszowi wskazywanemu przez klawiaturę, gdy drzewo ma fokus, i przyciskowi pod wskaźnikiem w nagłówku i wyszukiwaniu Eksploratora; wierszowi bieżącego dopasowania wyszukiwania; wyciszonemu tekstowi, takiemu jak liczniki, typy danych i strzałki zwijania; oraz podświetleniu pod tekstem znalezionym przez wyszukiwanie.
- `explorerBackground` i `explorerBorder` nadają kolor panelowi Eksploratora i jego liniom: krawędzi obok kanwy, linii pod wyszukiwaniem oraz obramowaniom jego pól i przycisków, które rozwija przycisk `Search In`. `explorerBorder` rysuje też krawędź drzewa Podglądu różnic, linię pod jego polem `Filter by name` i obramowanie tego pola. Ikony kluczy w Eksploratorze przyjmują kolory `keyPK`, `keyFK` i `keyPFK`.
- `diffModifyForeground` i `diffRenameForeground` nadają kolor temu, co Podgląd różnic oznacza jako zmienione i o zmienionej nazwie, w jego drzewie i na obu dokumentach. `diffModifyForeground` obrysowuje też tabelę, notatkę lub grupę tabel, którą przeniesiono albo której zmieniono rozmiar, kolor lub grupę, niezależnie od tego, co jeszcze się w niej zmieniło, i rysuje łącznik klucza obcego, który się zmienił.

`diffInsertForeground` i `diffDeleteForeground` nadają teraz kolor temu, co Podgląd różnic oznacza jako dodane i usunięte, w jego drzewie i na dokumencie, który to zawiera, jednakowo w tekście, obrysach i łącznikach. `diffInsertBackground`, `diffDeleteBackground`, `diffCrossBackground` i `diffCrossForeground` usunięto w wersji `4.1.0`, ponieważ Podgląd różnic nie wypełnia już komórek. `setTheme` odrzuca je jak każdą inną nazwę spoza `Theme`, a odpowiadające im zmienne CSS, `--erd-editor-diff-insert-background`, `--erd-editor-diff-delete-background`, `--erd-editor-diff-cross-background` i `--erd-editor-diff-cross-foreground`, nie są już odczytywane.

Od wersji `4.2.0` jest dwanaście kolejnych tokenów:

- `columnHandleBackground` i `columnHandleBorder` wypełniają i obrysowują [uchwyt przeciągania kolumny](../guide/guides/table-editing.md#rearranging-and-moving-columns), rysowany tuż za lewą krawędzią tabeli obok wiersza kolumny z fokusem, a `columnHandleHoverBackground` i `columnHandleHoverBorder` zastępują je, gdy znajduje się na nim wskaźnik. Ikona uchwytu przyjmuje kolor `foreground`, a pod wskaźnikiem `active`.
- `dictionaryErrorForeground` i `dictionaryWarningForeground` nadają kolor temu, co wykrywają [kontrole słowników](../guide/guides/dictionary.md#what-each-check-finds), czyli błędowi lub ostrzeżeniu: zgłoszonej nazwie na kanwie ERD (zobacz sekcję [Oznaczenia na kanwie](../guide/guides/dictionary.md#marks-on-the-canvas)), tekstowi zgłoszonej komórki w arkuszach `Domains`, `Words` i `Terms` oraz licznikowi arkusza `Checks`. `dictionaryErrorBackground` i `dictionaryWarningBackground` wypełniają taką komórkę. `dictionaryErrorForeground` nadaje też kolor narzędziu `Delete Rows` pod wskaźnikiem.
- `dictionaryBackground`, `dictionaryHeaderBackground`, `dictionaryGridLine` i `dictionaryHeaderSelect` nadają kolor arkuszowi karty [Słownik](../guide/guides/dictionary.md#the-sheets): jego komórkom, których kolor wypełnia też pole wyszukiwania karty i listę domen terminu; jego nagłówkom kolumn i numerom wierszy; liniom między komórkami, w których kolorze rysowane są też pasek karty i obramowania jej pól; oraz nagłówkowi, którego wiersz lub kolumna przecina się z zaznaczeniem. Reszta arkusza przyjmuje tokeny wspólne: `foreground` dla etykiet nagłówków, `active` dla tekstu komórek, `grayColor7` dla linii oddzielającej nagłówki kolumn i numery wierszy od komórek, `focus` dla krawędzi aktywnej komórki, `accentColor9` dla krawędzi zaznaczonego zakresu oraz, przy nieprzezroczystości 20%, jego wypełnienia, `accentColor6` dla nagłówka całego zaznaczonego wiersza lub kolumny, `grayColor3` dla komórek tylko do odczytu oraz tokeny paska przewijania. Wartość `accentColor9` zapisana inaczej niż jako `#rgb` lub `#rrggbb` pozostawia zaznaczony zakres bez wypełnienia.

#### Zmienne CSS {#css-variables}

Każdy token w `Theme` ma odpowiadającą mu zmienną CSS o nazwie złożonej z `--erd-editor-` i klucza zapisanego w stylu kebab-case: `grayColor10` to `--erd-editor-gray-color-10`, `keyPK` to `--erd-editor-key-pk`, a `keyPFK` to `--erd-editor-key-pfk`.  
Zmienne te są dziedziczone do wnętrza edytora, więc ustaw je tam, gdzie mają obowiązywać. Na `:root` nadają motyw każdemu edytorowi na stronie; na samym elemencie – tylko temu jednemu.

```css
erd-editor {
  --erd-editor-canvas-background: #1b1b1f;
}
```

Od wersji `3.4.0` tokeny z literówką `dargSelect` mają pisownię `dragSelect`, a ich zmienne CSS zmieniły się z `--erd-editor-darg-select-background` i `--erd-editor-darg-select-border` na `--erd-editor-drag-select-background` i `--erd-editor-drag-select-border`. Arkusz stylów, który nadal używa starych nazw, jest ignorowany.

<details>
<summary>Domyślne wartości motywu</summary>

```css
:root {
  --erd-editor-gray-color-1: #111113;
  --erd-editor-gray-color-2: #18191b;
  --erd-editor-gray-color-3: #212225;
  --erd-editor-gray-color-4: #272a2d;
  --erd-editor-gray-color-5: #2e3135;
  --erd-editor-gray-color-6: #363a3f;
  --erd-editor-gray-color-7: #43484e;
  --erd-editor-gray-color-8: #5a6169;
  --erd-editor-gray-color-9: #696e77;
  --erd-editor-gray-color-10: #777b84;
  --erd-editor-gray-color-11: #b0b4ba;
  --erd-editor-gray-color-12: #edeef0;
  --erd-editor-accent-color-1: #11131f;
  --erd-editor-accent-color-2: #141726;
  --erd-editor-accent-color-3: #182449;
  --erd-editor-accent-color-4: #1d2e62;
  --erd-editor-accent-color-5: #253974;
  --erd-editor-accent-color-6: #304384;
  --erd-editor-accent-color-7: #3a4f97;
  --erd-editor-accent-color-8: #435db1;
  --erd-editor-accent-color-9: #3e63dd;
  --erd-editor-accent-color-10: #5472e4;
  --erd-editor-accent-color-11: #9eb1ff;
  --erd-editor-accent-color-12: #d6e1ff;
  --erd-editor-canvas-background: #212225;
  --erd-editor-canvas-boundary-background: #111113;
  --erd-editor-table-background: #18191b;
  --erd-editor-table-header-background: #2e3135;
  --erd-editor-table-select: #435db1;
  --erd-editor-table-border: #363a3f;
  --erd-editor-table-shadow: transparent;
  --erd-editor-table-group-header-background: #43484e;
  --erd-editor-table-group-background: #d3edf81d;
  --erd-editor-table-group-border: #43484e;
  --erd-editor-memo-background: #18191b;
  --erd-editor-memo-select: #435db1;
  --erd-editor-memo-border: #363a3f;
  --erd-editor-memo-shadow: transparent;
  --erd-editor-column-select: #182449;
  --erd-editor-column-select-hover: #1d2e62;
  --erd-editor-column-hover: #272a2d;
  --erd-editor-column-handle-background: #18191b;
  --erd-editor-column-handle-border: #363a3f;
  --erd-editor-column-handle-hover-background: #2e3135;
  --erd-editor-column-handle-hover-border: #43484e;
  --erd-editor-relationship-hover: #435db1;
  --erd-editor-visualization-link: #43484e;
  --erd-editor-visualization-column: #5a6169;
  --erd-editor-visualization-relationship: #5a6169;
  --erd-editor-toolbar-background: #111113;
  --erd-editor-context-menu-background: #18191b;
  --erd-editor-context-menu-select: #272a2d;
  --erd-editor-context-menu-hover: #3a4f97;
  --erd-editor-context-menu-border: #363a3f;
  --erd-editor-minimap-border: black;
  --erd-editor-minimap-shadow: black;
  --erd-editor-minimap-viewport-border: #3a4f97;
  --erd-editor-minimap-viewport-border-hover: #435db1;
  --erd-editor-toast-background: #18191b;
  --erd-editor-toast-border: #363a3f;
  --erd-editor-toast-success: #3dd68c;
  --erd-editor-toast-error: #ff9592;
  --erd-editor-find-replace-error: #ff9592;
  --erd-editor-map-columns-error: #ff9592;
  --erd-editor-schema-sql-warning-background: #500f1c;
  --erd-editor-schema-sql-warning-foreground: #ff9592;
  --erd-editor-drag-select-background: #253974;
  --erd-editor-drag-select-border: #435db1;
  --erd-editor-scrollbar-track: #ddeaf814;
  --erd-editor-scrollbar-thumb: #696e77;
  --erd-editor-scrollbar-thumb-hover: #777b84;
  --erd-editor-foreground: #b0b4ba;
  --erd-editor-active: #edeef0;
  --erd-editor-placeholder: #e5edfd7b;
  --erd-editor-focus: #435db1;
  --erd-editor-input-active: #5472e4;
  --erd-editor-key-pk: #ffc53d;
  --erd-editor-key-fk: #e54666;
  --erd-editor-key-pfk: #00a2c7;
  --erd-editor-tree-background: #111113;
  --erd-editor-tree-row-hover: #212225;
  --erd-editor-tree-row-current: #1d2e62;
  --erd-editor-tree-muted: #b0b4ba;
  --erd-editor-tree-match: #253974;
  --erd-editor-explorer-background: #111113;
  --erd-editor-explorer-border: #363a3f;
  --erd-editor-dictionary-error-foreground: #ff9592;
  --erd-editor-dictionary-error-background: #500f1c;
  --erd-editor-dictionary-warning-foreground: #ffca16;
  --erd-editor-dictionary-warning-background: #3f2700;
  --erd-editor-dictionary-background: #18191b;
  --erd-editor-dictionary-header-background: #2e3135;
  --erd-editor-dictionary-grid-line: #363a3f;
  --erd-editor-dictionary-header-select: #182449;
  --erd-editor-diff-insert-foreground: #3dd68c;
  --erd-editor-diff-delete-foreground: #ff9592;
  --erd-editor-diff-modify-foreground: #ffca16;
  --erd-editor-diff-rename-foreground: #70b8ff;
}
```

</details>

## Język wyświetlania {#display-language}

Od wersji `4.0.0` własne teksty edytora – jego menu, panele, okna dialogowe, szybkie wyszukiwanie, powiadomienia i słowa, które rysuje na diagramie, takie jak `unnamed`, również w eksportowanych obrazach – są dostępne w 25 językach. Nazwy tabel i kolumn, kod SQL, typy danych i wygenerowany kod nigdy nie są tłumaczone. Zobacz stronę [Język i motyw](../guide/guides/language-and-theme.md).  
Przed wywołaniem [setLocale](#setlocale) lub wybraniem języka edytor pokazuje język angielski albo, gdy [enableLocalePicker](#enablelocalepicker) jest włączony, podąża za `'system'`.  
Edytor ustawia atrybuty `lang` i `dir` na własnym elemencie głównym wewnątrz zamkniętego shadow root, nigdy na elemencie hosta ani na stronie, więc strona pisana od prawej do lewej nie odwraca edytora, a język pisany od prawej do lewej nie odwraca strony. Hebrajski, arabski i perski układają interfejs edytora od prawej do lewej; sam diagram nigdy nie jest odbijany lustrzanie. Od wersji `4.1.0` [Eksplorator](../guide/guides/explorer.md) w każdym języku pozostaje po lewej stronie kanwy, a w tych trzech językach jego wiersze czyta się od prawej do lewej.  
Pakiet eksportuje typy `LocaleCode` (jeden z poniższych kodów) i `LocaleOption`.

```ts
type LocaleOption = LocaleCode | 'system';
```

| Kod     | Wyświetlane jako     | Język                |
| ------- | -------------------- | -------------------- |
| `id-ID` | Bahasa Indonesia     | Indonezyjski         |
| `de-DE` | Deutsch              | Niemiecki            |
| `en`    | English              | Angielski            |
| `es-ES` | Español              | Hiszpański           |
| `eu-ES` | Euskara              | Baskijski            |
| `fr-FR` | Français             | Francuski            |
| `it-IT` | Italiano             | Włoski               |
| `nl-NL` | Nederlands           | Niderlandzki         |
| `pl-PL` | Polski               | Polski               |
| `pt-PT` | Português            | Portugalski          |
| `pt-BR` | Português Brasileiro | Portugalski brazylijski |
| `ro-RO` | Română               | Rumuński             |
| `sk-SK` | Slovenčina           | Słowacki             |
| `sl-SI` | Slovenščina          | Słoweński            |
| `sv-SE` | Svenska              | Szwedzki             |
| `tr-TR` | Türkçe               | Turecki              |
| `ru-RU` | Русский              | Rosyjski             |
| `uk-UA` | Українська           | Ukraiński            |
| `he-IL` | עברית                | Hebrajski            |
| `ar-SA` | العربية              | Arabski              |
| `fa-IR` | فارسی                | Perski               |
| `ja-JP` | 日本語               | Japoński             |
| `zh-CN` | 简体中文             | Chiński uproszczony  |
| `zh-TW` | 繁體中文             | Chiński tradycyjny   |
| `ko-KR` | 한국어               | Koreański            |

### setLocale {#setlocale}

Ustawia język wyświetlania: `'system'` lub jeden z powyższych kodów. Wszystko inne, na przykład samo `'ko'`, nieznany kod lub wartość, która nie jest ciągiem znaków, jest ignorowane bez błędu.  
Zaczyna obowiązywać, zanim metoda zwróci sterowanie, więc język ustawiony przed dołączeniem elementu do strony jest widoczny już w jego pierwszej klatce.  
Niczego nie emituje, ani `changeLocale`, ani `change`, i nie zmienia ani `value`, ani historii cofania, ani współdzielonego magazynu.  
Wybór pozostaje niezależnie od stanu `enableLocalePicker`, a `setLocale('system')` podąża za systemem również przy wyłączonym selektorze.  
Edytor niczego nie przechowuje. Aby zachować wybór czytelnika, nasłuchuj zdarzenia [changeLocale](#changelocale) i przekaż ten wybór z powrotem przy następnym wczytaniu.

```js
editor.enableLocalePicker = true;
editor.setLocale(localStorage.getItem('locale') ?? 'system');
editor.addEventListener('changeLocale', event => {
  localStorage.setItem('locale', event.detail.locale);
});
```

### setSystemLocale {#setsystemlocale}

Wskazuje język, który oznacza `'system'`, w postaci tagu BCP 47, dla hosta z własnym językiem wyświetlania. Hosty VS Code, JetBrains i Obsidian wywołują tę metodę z własnym językiem wyświetlania.  
Z tagu usuwane są białe znaki z początku i końca. `null`, pusty ciąg znaków lub wartość, która nie jest ciągiem znaków, przywraca używanie `navigator.languages` przeglądarki, za którym edytor podąża w miarę jego zmian.  
Ma znaczenie tylko wtedy, gdy obowiązującą opcją jest `'system'`, i obowiązuje od razu. Wiersz `System` selektora podaje język, który z niego wynika.  
Tag albo, po kolei, każdy z języków przeglądarki jest dopasowywany do pierwszego języka, który obsługuje edytor, według podtagu języka, bez uwzględniania wielkości liter i znaków podkreślenia: `de-AT` daje `de-DE`, a `en-GB` daje `en`. Język chiński jest dopasowywany według pisma (`Hant` daje `zh-TW`, `Hans` daje `zh-CN`), a gdy pisma brak, według regionu (`TW`, `HK` i `MO` dają `zh-TW`, każdy inny region `zh-CN`). `pt` daje `pt-BR`, chyba że wskazano region inny niż `BR`. Gdy nic nie pasuje, edytor pokazuje język angielski.

```js
editor.setLocale('system');
editor.setSystemLocale('pt-PT'); // null follows the browser again
```

## setSchemaSQL {#setschemasql}

Wczytuje plik w formacie Schemat SQL.  
Domyślnie zastępuje bieżący dokument, zamiast scalać z nim zawartość pliku; zobacz opis opcji `mode` poniżej. Dotychczasowe ustawienia są zachowywane, łącznie z każdą blokadą i jej zablokowaną wartością, z wyjątkiem położenia widoku i poziomu powiększenia, a tabele są rozmieszczane po odczytaniu pliku, w wierszach, chyba że opisana niżej opcja `placement` wskazuje inaczej. Przy zablokowanym ustawieniu `Viewport` właściwość `value` zapisuje następnie widok, od którego zaczyna się import, czyli punkt początkowy `0, 0` przy poziomie powiększenia `1`. Dokument zaimportowany do elementu, który nigdy nie otrzymał wartości, ma więc włączone wszystkie blokady, tak jak nowy dokument.  
Od wersji `4.2.0` zastąpienie zachowuje też słowa, terminy i domeny dokumentu, których tekst nie może zawierać, razem z historią cofania każdego arkusza karty Słownik, a cofnięcie lub ponowienie importu również je zachowuje. Zastępujące wywołanie [setSchemaJSON](#setschemajson) i przypisanie do `value` przejmują natomiast te, które zawiera ich dokument.  
Import jest zapisywany na liście historii, co umożliwia `Undo, Redo`, i emituje zdarzenie `change`. Pusty ciąg znaków jest ignorowany, a gdy ustawiony jest atrybut `readonly`, wywołanie nic nie robi.  
`setSchemaGraphQL`, `setSchemaDBML` i `setSchemaAML` działają tak samo, a ich parsery nigdy nie zawodzą: tekst, którego nie potrafią odczytać, wczytuje pusty dokument zamiast zgłosić błąd.  
Od wersji `4.0.0` wszystkie cztery przyjmują opcjonalny drugi argument `{ placement, mode }`:

- `placement: 'grid'`, wartość domyślna, od razu umieszcza tabele w wierszach, tak jak wcześniej, a wywołanie niczego nie zwraca.
- `placement: 'auto'` najpierw rozmieszcza tabele według ich relacji, tak jak polecenie `Import` w edytorze, i zwraca obiekt `Promise`, który rozwiązuje się, gdy import trafi do dokumentu jako jeden krok cofania. Mniej niż dwie tabele, brak relacji, nieudany układ, strona bez `SharedWorker` lub przycisk `Cancel` w powiadomieniu `Placing tables` powodują, że tabele są zamiast tego układane w wierszach. Wczytanie w międzyczasie – inny import zastępujący, przypisanie do `value`, `setInitialValue()`, `clear()`, wczytanie przez współpracownika albo cofnięcie lub ponowienie wczytania lub `clear()` – unieważnia go, a `Promise` rozwiązuje się bez wczytania czegokolwiek. Importy rozmieszczane w ten sposób trafiają do dokumentu w kolejności, w jakiej się rozpoczęły.
- `mode: 'replace'`, wartość domyślna, zastępuje dokument. `mode: 'append'` dodaje plik pod diagramem, tak jak operacja [Importuj i dodaj](../guide/guides/file-import-export.md#import-and-add), pozostawiając bez zmian wszystkie istniejące tabele oraz wszystkie ustawienia z wyjątkiem karty i położenia widoku. Gdy aktywna jest inna karta, najpierw wyświetla się karta ERD. Nowe tabele oraz grupy tabel, które wnosi plik DBML, gdy grupy tabel są widoczne, stają się zaznaczeniem, a widok przewija się do nich, chyba że są już dobrze widoczne, zgodnie z regułą, której od wersji `4.1.0` podlega każde przejście – zobacz sekcję [Dokąd prowadzi przejście](../guide/guides/table-related-functions.md#where-a-jump-lands). Jedno cofnięcie usuwa cały dodany fragment. Tekst, którego nie potrafi odczytać, niczego nie dodaje i pozostawia dokument bez zmian.

Gdy ustawiony jest atrybut `readonly`, zastąpienie jest ignorowane, dodawanie niczego nie dodaje, a wywołanie z `placement: 'auto'` rozwiązuje się od razu.  
Od wersji `3.10.0` metoda `setSchemaSQL` odczytuje plik zgodnie z bieżącą bazą danych dokumentu: gdy wybrano Databricks, ciągi w pojedynczych cudzysłowach podlegają regułom sekwencji ucieczki z ukośnikiem odwrotnym stosowanym w Spark. Zobacz sekcję [Komentarze](../guide/guides/file-import-export.md#comments).  
Od wersji `3.10.0` metoda `setSchemaSQL` odczytuje ograniczenie `UNIQUE` obejmujące dwie lub więcej kolumn jako jeden indeks unikatowy, a nie jako flagę Unikatowość na każdej kolumnie. Zobacz sekcję [Klucze unikatowe i indeksy](../guide/guides/file-import-export.md#unique-keys-and-indexes).  
Od wersji `3.10.0` importy SQL, DBML i AML zachowują akcje `ON DELETE` i `ON UPDATE` odczytanych kluczy obcych.  
Od wersji `4.0.0` metoda `setSchemaSQL` zachowuje całe wyrażenie `DEFAULT` kolumny, odczytuje `ADD DEFAULT … FOR` oraz komentarze `MS_Description` z SQL Server, zamienia kolumny typu serial i identity z PostgreSQL na Autoinkrementację, zachowuje `UNSIGNED` i `ZEROFILL` w typie danych oraz odczytuje klucz podstawowy, który `ALTER TABLE … ADD PRIMARY KEY` oznacza jako `CLUSTERED`, `NONCLUSTERED` lub `USING BTREE`. Zobacz sekcję [Schemat SQL](../guide/guides/file-import-export.md#schema-sql).  
Informacje o składni akceptowanej przez każdy parser znajdziesz na stronie [Importowanie i eksportowanie plików](../guide/guides/file-import-export.md).

```ts
type SetSchema = {
  (
    value: string,
    options: { placement: 'auto'; mode?: 'replace' | 'append' }
  ): Promise<void>;
  (
    value: string,
    options?: { placement?: 'grid'; mode?: 'replace' | 'append' }
  ): void;
};

// example
editor.setSchemaSQL('Schema SQL...');
// or
await editor.setSchemaSQL('Schema SQL...', { placement: 'auto' });
// or
editor.setSchemaSQL('Schema SQL...', { mode: 'append' });
```

## setSchemaGraphQL {#setschemagraphql}

Wczytuje dokument GraphQL SDL.  
Definicje typów obiektowych stają się tabelami, a pole, którego typem jest inna tabela, staje się relacją.

```js
editor.setSchemaGraphQL('GraphQL SDL...');
```

## setSchemaDBML {#setschemadbml}

Wczytuje plik w formacie DBML, używanym przez dbdiagram.io i dbdocs.  
Od wersji `4.0.0` z każdego bloku `TableGroup` powstaje [grupa tabel](../guide/guides/table-groups.md), a pole `headercolor` tabeli staje się jej kolorem. Zobacz sekcję [DBML](../guide/guides/file-import-export.md#dbml).

```js
editor.setSchemaDBML('DBML...');
```

## setSchemaAML {#setschemaaml}

Wczytuje plik AML (Azimutt Markup Language). Akceptowany jest zarówno obecny zapis, jak i starszy zapis v1.  
Od wersji `4.0.0` kolor encji, czyli jedna z nazw kolorów Azimutt lub wartość szesnastkowa w cudzysłowie, staje się kolorem jej tabeli. Zobacz sekcję [AML](../guide/guides/file-import-export.md#aml).

```js
editor.setSchemaAML('AML...');
```

## setSchemaJSON {#setschemajson}

Od wersji `4.0.0` wczytuje dokument `.erd.json`, na przykład tekst zwracany przez [value](#value).  
W domyślnym trybie `mode: 'replace'` wczytuje dokument tak jak przypisanie do `value`: wczytanie jest zapisywane na liście historii, emituje zdarzenie `change` i przejmuje blokady dokumentu w ten sam sposób, a od wersji `4.2.0` słowa, terminy i domeny dokumentu zastępują te, które ma edytor. W przeciwieństwie do `value` pusty ciąg znaków lub wartość, która nie jest ciągiem znaków, jest ignorowana, zamiast rozpoczynać nowy dokument. Tekst, który nie jest w formacie JSON, opróżnia dokument, tak samo jak w przypadku `value`.  
`mode: 'append'` dodaje pod diagramem tabele, relacje, indeksy, notatki i grupy tabel dokumentu z nowymi identyfikatorami, zachowując ich wzajemne położenie i pomijając ustawienia dokumentu, tak jak operacja [Importuj i dodaj](../guide/guides/file-import-export.md#import-and-add) z plikiem `json`. Od wersji `4.2.0` zachowuje nazwy logiczne i flagi wygenerowanej nazwy tabel i kolumn, ale pomija słowa, terminy i domeny dokumentu, więc żadna z jego kolumn nie jest powiązana z domeną. Tekst, którego nie potrafi odczytać, lub dokument bez żadnej tabeli ani notatki niczego nie dodaje. W przeciwnym razie trafia do dokumentu tak jak dodawanie przez [setSchemaSQL](#setschemasql), a jego nowe notatki i grupy tabel są zaznaczane razem z tabelami, każdy rodzaj, o ile jest widoczny.  
Zwraca sterowanie, gdy dokument trafi na miejsce, a gdy ustawiony jest atrybut `readonly`, jest ignorowana.

```js
editor.setSchemaJSON('json...');
// or
editor.setSchemaJSON('json...', { mode: 'append' });
```

## getSchemaSQL {#getschemasql}

Eksportuje bieżący stan edytora jako Schemat SQL.  
Jeśli nie podano `databaseVendor`, zapisuje dla bazy danych, którą pokazuje edytor: bazy dokumentu, chyba że czytelnik edytora [tylko do odczytu](#readonly) wybrał inną, co od wersji `5.0.0` pozostaje na tym ekranie i jest tym, co pokazuje jego karta Schemat SQL. Nazwa spoza poniższej listy jest traktowana tak samo, bez zgłaszania błędu.  
Nazwy są ujmowane w cudzysłów zgodnie z typem cudzysłowu, który pokazuje edytor. Gdy ustawienie `Bracket Type` jest [zablokowane](../guide/guides/settings.md#lock) albo w edytorze tylko do odczytu, którego czytelnik wybrał od wersji `5.0.0` inny, może się on różnić od typu zapisywanego przez `value`, którego używa narzędzie [`erd_read`](../mcp/tools.md#reading-a-document) agenta kodującego. Zapisywane nazwy są zawsze nazwami fizycznymi, niezależnie od Widoku nazw.  
Od wersji `4.0.0` opcjonalny argument `options` wybiera instrukcje i nagłówek, tak jak opcje karty [Schemat SQL](../guide/guides/schema-sql.md), a od wersji `4.2.0` także to, czy nazwy logiczne wypełniają puste komentarze. Typ `SchemaSQLOptions` jest eksportowany.

- `statements`: `'create'`, wartość domyślna; `'ifNotExists'`, które zapisuje `IF NOT EXISTS` w MySQL, MariaDB, PostgreSQL, SQLite i Databricks, a w pozostałych systemach przechodzi na `'create'`; lub `'recreate'`, które usuwa tabele przed ich utworzeniem, przy czym Snowflake zapisuje zamiast tego `CREATE OR REPLACE TABLE`.
- `header`: `'none'`, wartość domyślna; `'use'`, które przełącza na bazę danych lub schemat dokumentu; lub `'createAndUse'`, które najpierw je tworzy, jeśli nie istnieją, a następnie na nie przełącza. Baza danych, która nie obsługuje żądanej opcji, stosuje zamiennik tak jak karta: Oracle zapisuje `'use'` zamiast `'createAndUse'`, PostgreSQL nie zapisuje nagłówka dla `'use'`, a SQLite nie zapisuje żadnego. Nagłówek jest zapisywany tylko wtedy, gdy nazwa bazy danych dokumentu jest prostym identyfikatorem – litery ASCII, cyfry i `_`, bez cyfry na początku.
- `logicalNameAsComment`, od wersji `4.2.0`: `true` zapisuje nazwę logiczną tabeli lub kolumny jako jej komentarz tam, gdzie jej własny komentarz jest pusty lub zawiera same białe znaki, a nazwa logiczna nie jest pusta ani nie zawiera samych białych znaków, w postaci, w jakiej dana baza danych zapisuje komentarz. Komentarz zawierający tekst jest zapisywany tak jak wcześniej. Opcję włącza tylko `true`: pominięcie, `false` lub każda inna wartość, na przykład `'true'` lub `1`, nie zapisuje żadnej nazwy logicznej. Działa tak samo jak przełącznik [`Write logical names into empty comments`](../guide/guides/schema-sql.md#logical-names-as-comments) na karcie.

Pominięta opcja lub opcja z nieznaną wartością przyjmuje wartość domyślną, więc wywołanie bez opcji zapisuje zwykłe instrukcje `CREATE` bez nagłówka, tak jak wcześniej.  
Od wersji `4.0.0` wynik zawsze zawiera skrypty `Before tables` i `After tables` dokumentu, w kolejności: nagłówek, skrypt przed tabelami, instrukcje usuwania, tabele, skrypt po tabelach. Własne wybory `Statements`, `Header`, `Write logical names into empty comments` i `Tables` na karcie Schemat SQL nigdy nie wpływają na to wywołanie, które zawsze zapisuje cały dokument.  
Od wersji `3.10.0` każdy klucz obcy zawiera klauzule `ON DELETE` i `ON UPDATE` relacji. Klauzula jest zapisywana tylko wtedy, gdy jej akcja jest ustawiona, a system bazy danych ją akceptuje, więc akcja, której ten system nie obsługuje, jest pomijana i obowiązuje jego zachowanie domyślne. Od wersji `4.0.0` Snowflake akceptuje tylko `NO ACTION`. Informacje o tym, co zapisuje każda baza danych, znajdziesz w sekcji [ON DELETE i ON UPDATE](../guide/guides/relationship-editing.md#on-delete-and-on-update).  
Od wersji `3.10.0` pojedynczy cudzysłów w komentarzu tabeli lub kolumny jest zabezpieczany, więc komentarz taki jak `it's` nie psuje już instrukcji. Każdy system bazy danych, który zapisuje komentarze jako literały tekstowe, podwaja go, z wyjątkiem Databricks, który wstawia ukośnik odwrotny przed każdym cudzysłowem i każdym ukośnikiem odwrotnym. SQLite nadal zapisuje komentarze jako wiersze `--`.  
Od wersji `4.2.0` SQL Server zapisuje każdy komentarz jako literał narodowy, `N'…'`, więc tekst spoza strony kodowej bazy danych, na przykład koreański, zostaje zachowany. Oracle zapisuje każdy ciąg pustych wierszy w komentarzu jako jeden podział wiersza, a SQLite zapisuje podziały wierszy komentarza jako spacje, więc komentarz pozostaje w swoim wierszu `--`. Zobacz sekcję [Komentarze](../guide/guides/schema-sql.md#comments).  
Od wersji `4.0.0` kilka baz danych zapisuje też inaczej nazwy kluczy, wartości domyślne i autoinkrementację. Zobacz sekcję [Co zawiera kod DDL](../guide/guides/schema-sql.md#what-the-ddl-writes).

```ts
type DatabaseVendor =
  | 'Databricks'
  | 'MariaDB'
  | 'MSSQL'
  | 'MySQL'
  | 'Oracle'
  | 'PostgreSQL'
  | 'Snowflake'
  | 'SQLite';

type SchemaSQLOptions = {
  statements?: 'create' | 'ifNotExists' | 'recreate';
  header?: 'none' | 'use' | 'createAndUse';
  logicalNameAsComment?: boolean;
};

const schemaSQL = editor.getSchemaSQL();
// or
const postgresSQL = editor.getSchemaSQL('PostgreSQL');
// or
const mysqlSQL = editor.getSchemaSQL('MySQL', {
  statements: 'ifNotExists',
  header: 'createAndUse',
});
// or
const commentedSQL = editor.getSchemaSQL('PostgreSQL', {
  logicalNameAsComment: true,
});
```

## getSharedStore {#getsharedstore}

Zwraca magazyn do wspólnej edycji w czasie rzeczywistym.  
`config` to `{ getNickname?, mouseTracker?, focusTracker? }`. Obie opcje śledzenia mają domyślnie wartość `true`: `mouseTracker` rozgłasza innym kursor tego edytora, a `focusTracker` – jego komórkę z fokusem, zaznaczenie i ramkę przeciągania.  
Od wersji `5.0.0` magazyn nie wysyła żadnej zmiany, gdy ustawiony jest [readonly](#readonly), tylko to, co wysyłają jego mechanizmy śledzące, i rejestry, o które prosi dołączający edytor, a nadal stosuje to, co wysyłają pozostali.  
Zobacz stronę [Wspólna edycja](./advanced/collaborative-editing.md).

```js
const sharedStore = editor.getSharedStore({
  mouseTracker: false,
  focusTracker: false,
});
```

## setDiffValue {#setdiffvalue}

Otwiera Podgląd różnic, porównując obecnie otwarty dokument z dokumentem przekazanym w argumencie.  
Niczego nie zwraca i nie modyfikuje dokumentu, więc zamknięcie podglądu pozostawia edytor dokładnie w takim stanie, w jakim był.  
Pusta wartość albo cokolwiek, co nie jest ciągiem znaków, jest porównywane z pustym dokumentem.  
To ta sama nakładka, którą otwiera pozycja [Podgląd różnic](../guide/guides/table-related-functions.md#diff-viewer) w menu kontekstowym kanwy.  
Od wersji `4.1.0` łączy w pary zawartość obu dokumentów najpierw według identyfikatora, a dopiero potem według tego, co każdy element przechowuje, na przykład nazwy tabeli lub tekstu notatki – zobacz sekcję [Co jest porównywane](../guide/guides/table-related-functions.md#what-is-compared). W porównaniu z wcześniejszą wersją tego samego dokumentu, na przykład rewizją jego pliku w Git, zmiana nazwy jest więc pokazywana jako jeden element o zmienionej nazwie; w porównaniu z dokumentem o innych identyfikatorach – jako usunięcie i dodanie. Podgląd wyświetla zmiany w drzewie obok obu dokumentów i oznacza je kolorem, zamiast wypełniać komórki.  
Od wersji `4.2.0` oba dokumenty otwierają się w Widoku nazw, który pokazuje ten edytor, niezależnie od tego, jaki widok zapisano w przekazanym dokumencie, a drzewo również według niego nazywa tabele i kolumny – zobacz sekcję [Poza kanwą](../guide/guides/logical-names.md#beyond-the-canvas). Nazwy logiczne, powiązania z domenami i słowniki nie są porównywane, więc sama ich zmiana nie jest pokazywana jako zmiana.

```js
editor.setDiffValue('prev json...');
```
