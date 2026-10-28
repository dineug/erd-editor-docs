---
sidebar_position: 1
description: Przekazywanie zmian edytora między instancjami za pomocą getSharedStore, inicjowanie dołączającego edytora z runtimeValue oraz pokazywanie kursora, fokusu, zaznaczenia i ramki przeciągania każdego współpracownika.
---

# Wspólna edycja

Metoda `getSharedStore()` zmienia edytor w węzeł sesji wspólnej edycji.  
Emituje każdą zmianę jako strumień akcji i stosuje akcje odsyłane przez inne edytory – transport między nimi zapewniasz sam (WebSocket, WebRTC lub cokolwiek innego, co potrafi przenosić dane JSON).  
Jest jedną z metod elementu [ErdEditorElement](../erd-editor-element.md) i współdziała z mechanizmem [Zdalne przechowywanie](./remote-storage.md), gdy przekazywane zmiany trzeba również przechowywać.

```ts
interface ErdEditorElement extends HTMLElement {
  // ...
  getSharedStore: (
    config?: SharedStoreConfig & {
      mouseTracker?: boolean;
      focusTracker?: boolean;
    }
  ) => SharedStore;
}

type SharedStoreConfig = {
  getNickname?: () => string;
};

type SharedStore = {
  connection: () => void;
  disconnect: () => void;
  dispatch: (actions: Array<AnyAction> | AnyAction) => void;
  dispatchSync: (actions: Array<AnyAction> | AnyAction) => void;
  subscribe: (fn: (value: AnyAction[]) => void) => Unsubscribe;
  flushStreamBuffers: () => void;
  destroy: () => void;
};

// example
const sharedStore = editor.getSharedStore();
```

Akcja to zwykły serializowalny obiekt opisujący jedną zmianę w dokumencie, więc bez strat przechodzi przez funkcję `JSON.stringify` w drodze do transportu.  
Akcje przychodzą w pakietach: metoda `subscribe` przekazuje ci tablicę, a ta tablica stanowi jedną całość – prześlij ją dalej w całości i w całości przekaż (dispatch) po drugiej stronie.  
Traktuj akcję jak nieprzezroczysty obiekt i przekazuj ją bez zmian, zamiast ją odczytywać lub przepisywać, ponieważ to zawarte w niej informacje pomocnicze utrzymują edytory w synchronizacji.

Część tego, co robi edytor, pozostaje w tym edytorze.  
Przeniesienie tabeli, notatki lub grupy tabel na wierzch, tak jak robi to ich zaznaczenie, nie jest wysyłane.  
Nie są też wysyłane wybory opcji `Statements`, `Header`, `Write logical names into empty comments` (od wersji `4.2.0`) i `Tables` na karcie [Schemat SQL](../../guide/guides/schema-sql.md), które należą do okna, w którym ich dokonano.  
Od wersji `4.1.0` w swoim edytorze pozostaje też [Eksplorator](../../guide/guides/explorer.md): to, czy jest otwarty, jego szerokość, zwinięte wiersze, wiersz z fokusem klawiatury, pozycja przewinięcia drzewa oraz wyszukiwanie i opcje nie są wysyłane.  
Nie jest też wysyłane [podświetlenie](../../guide/guides/relationship-editing.md#reading-a-connector), które przejście do klucza obcego nakłada na łącznik jego relacji.  
Od wersji `4.2.0` w swoim edytorze pozostaje również karta [Słownik](../../guide/guides/dictionary.md): to, który arkusz jest wyświetlany, oraz wyszukiwanie, zaznaczenie, przewinięcie i szerokości kolumn każdego arkusza nie są wysyłane. Wysyłane są natomiast jej edycje, sortowania i importy CSV.  
Przewinięcie, powiększenie lub przełączenie karty jest wysyłane, ale nigdy nie przesuwa widoku ani nie przełącza karty innego użytkownika. Dotyczy to również przewinięcia wykonywanego przy przejściu z Eksploratora, przełączenia na kartę ERD, gdy Eksplorator otwiera się z poziomu innej karty, oraz przełączenia karty i przewinięcia przy przejściu z arkusza [`Checks`](../../guide/guides/dictionary.md#the-checks-sheet) karty Słownik do tabeli lub kolumny. Przejście z tego arkusza do słowa, terminu lub domeny pozostaje na karcie Słownik, więc nic z niego nie jest wysyłane.

Od wersji `4.2.0` wysyłane jest też przełączenie [Widoku nazw](../../guide/guides/logical-names.md#switching-the-view), a to, co robią z nim pozostałe edytory, zależy od jego [blokady](../../guide/guides/settings.md#lock). Blokada `Name View` jest włączona w nowym diagramie i w każdym dokumencie sprzed wersji `4.2.0`.  
Gdy blokada jest włączona, przełączenie widać tylko w edytorze, który go dokonał: nadal jest wysyłane, ale każdy inny edytor i każda replika je pomijają, więc każdy użytkownik może oglądać inny widok, podczas gdy `value` zachowuje zablokowany widok. Inaczej jest ze zmianą języka, stylu nazw lub typu cudzysłowu: dociera ona do każdego edytora niezależnie od tego, czy jej blokada jest włączona.  
Gdy blokada jest wyłączona, przełączenie dokonane w edytorze, który może edytować, zmienia Widok nazw w każdym edytorze i każdej replice, przy czym obowiązuje ostatnie przełączenie, a każdy z nich ten widok zapisuje.  
Własne przełączenie edytora tylko do odczytu zawsze pozostaje w tym edytorze, a edytor nadal podąża za współdzielonymi przełączeniami pozostałych.

Od wersji `5.0.0` edytor [tylko do odczytu](../erd-editor-element.md#readonly) w ogóle nie wysyła zmian. Przewinięcie, powiększenie, karta, Widok nazw, baza danych, język Generatora kodu, style nazw, typ cudzysłowu i wiersze `View Option`, które zmienia jego czytelnik, pozostają na jego ekranie niezależnie od ich blokad; przed wersją `5.0.0` jego przewinięcia, powiększenia, przełączenia kart, baza danych i ustawienia kodu były wysyłane tak jak w edytorze z możliwością edycji.  
Jego magazyn nadal wysyła to, co wysyłają jego mechanizmy śledzące kursora, fokusu, zaznaczenia i ramki przeciągania czytelnika, odpowiada na rejestry, o które prosi dołączający edytor, i stosuje każdą zmianę wysłaną przez pozostałych. Zmiana bazy danych, ustawienia Generatora kodu lub wiersza `View Option` trafia do jego dokumentu, a także na jego ekran, chyba że jego czytelnik zmienił to ustawienie właśnie tam, a współdzielone przełączenie Widoku nazw widać na jego ekranie w obu przypadkach.  
Gdy edytor przechodzi w tryb tylko do odczytu, najpierw wysyła to, co magazyn wciąż wstrzymuje z przeciągania lub przewinięcia, tak jak robi to [flushStreamBuffers](#flushstreambuffers), dzięki czemu pozostałe edytory zachowują jego ostatni stan.

[Blokady](../../guide/guides/settings.md#lock) są współdzielone: w każdym edytorze obowiązuje ostatnie zablokowanie lub odblokowanie danego ustawienia, a blokada przenosi wartości edytora, który ją włączył, więc każdy edytor i każda replika zapisują tę samą wartość.  
Blokada `Viewport` zapisuje więc widok edytora, który ją włączył, a blokada `Canvas Type` – ostatnią kartę otwartą w tym edytorze przed kartą Ustawienia, na której włącza się blokady.  
Wyłączenie blokady `Language`, `Table Name Case`, `Column Name Case`, `Bracket Type` lub, od wersji `4.2.0`, `Name View` zmienia też to ustawienie w każdym edytorze na wartość wyświetlaną w edytorze, który ją wyłączył, więc edytory nadal zapisują jedną wartość. Wyłączenie blokady `Viewport` lub `Canvas Type` nie przesuwa niczyjego widoku ani nie przełącza niczyjej karty.

Zmiana skryptu `Before tables` lub `After tables` jest wysyłana w całości, gdy jego pole traci fokus. Oba skrypty są uzgadniane osobno, więc zmiana jednego z nich wprowadzona przez współpracownika nigdy nie nadpisuje drugiego.

Żadna czynność w [trybie Przepływ](../../guide/guides/visualization.md#flow-never-edits-the-document) na karcie Wizualizacja nie jest zmianą dokumentu, więc edytor w trybie Przepływ nie wysyła innym edytorom żadnych zmian, a zmiany wysyłane przez nie są w tym czasie nadal stosowane.  
Są dwa wyjątki. Przejście z trybu Przepływ na inną kartę jest przełączeniem karty, wysyłanym jak każde inne. Od wersji `4.2.0` wybór na liście Widoku nazw na pasku narzędzi trybu Przepływ jest przełączeniem Widoku nazw, wysyłanym i stosowanym tak jak przełączenie dokonane na kanwie.  
Polecenia `Previous table` i `Next table` oraz klawisze cofania i ponawiania, które w trybie Przepływ [przechodzą krok po kroku przez widoki](../../guide/guides/visualization.md#previous-table-and-next-table), nie są wysyłane.  
Przycisk kafelka z łączem zewnętrznym, wynik [szybkiego wyszukiwania](../../guide/guides/quick-search.md#searching-the-diagram) wybrany po prefiksie `#`, `@` lub `:` oraz otwarcie [Eksploratora](../../guide/guides/explorer.md#opening-and-closing) przenoszą z trybu Przepływ na kartę ERD. Przewinięcie wykonane tam przez przycisk kafelka lub wynik szybkiego wyszukiwania również jest wysyłane.

## Dwa edytory na jednej stronie {#two-editors-on-one-page}

Bezpośrednie połączenie subscribe z dispatch zastępuje tu sieć, dzięki czemu widać strukturę sesji bez zasłaniającego ją transportu.

```js
import '@dineug/erd-editor/erd-editor.js';

const editor1 = document.createElement('erd-editor');
const editor2 = document.createElement('erd-editor');

const sharedStore1 = editor1.getSharedStore({
  getNickname: () => 'editor1',
});
const sharedStore2 = editor2.getSharedStore({
  getNickname: () => 'editor2',
});

sharedStore1.subscribe(actions => {
  sharedStore2.dispatch(actions);
});

sharedStore2.subscribe(actions => {
  sharedStore1.dispatch(actions);
});
```

Oba edytory zaczynają tu od tego samego nowego, pustego dokumentu, więc żadnego z nich nie trzeba inicjować.  
Przy trzech lub więcej edytorach wysyłaj pakiety każdego z nich do wszystkich pozostałych: edytor nigdy nie przekazuje dalej tego, co otrzymał.

## Inicjowanie edytora współpracownika {#seeding-a-collaborator}

Współdzielony magazyn przekazuje zmiany w miarę ich wprowadzania i nigdy nie udostępnia dołączającemu edytorowi dokumentu w jego obecnym stanie, więc edytorowi, który dołącza do już trwającej sesji, trzeba najpierw dostarczyć dokument.  
Od wersji `4.0.0` zainicjuj go wartością [`runtimeValue`](../erd-editor-element.md#runtimevalue) z edytora, który już jest w sesji, a nie wartością `value` ani zapisanym plikiem.

```js
editor2.setInitialValue(editor1.runtimeValue);

const sharedStore2 = editor2.getSharedStore();
```

Wartość czasu wykonania nadal zawiera to, co usunięto od otwarcia dokumentu, więc gdy inny edytor później cofnie usunięcie, dołączający edytor przywraca tabelę z jej nazwą i kolumnami.  
Właściwość [`value`](../erd-editor-element.md#value) to postać, którą przechowuje plik, bez usuniętych encji, więc dołączający edytor zainicjowany z niej lub z pliku przywróciłby zamiast tego pustą tabelę bez nazwy.  
Od wersji `4.2.0` to samo dotyczy słowa, terminu lub domeny usuniętych z arkusza karty [Słownik](../../guide/guides/dictionary.md): gdy inny edytor cofnie usunięcie, dołączający edytor zainicjowany z `runtimeValue` przywraca wiersz w całości, a zainicjowany z `value` – pusty wiersz, który jego własna właściwość `value` następnie pomija.  
Nadal zapisuj wartość `value` w pamięci trwałej: wartość `runtimeValue` służy tylko do inicjowania innego edytora, drugiego widoku lub magazynu [replicationStore](./remote-storage.md).  
Edytory w VS Code, aplikacji Obsidian, IDE JetBrains i aplikacji internetowej inicjują w ten sposób drugi widok otwartego dokumentu.

Wywołanie `setInitialValue` nie jest przekazywane, więc zainicjowanie dołączającego edytora niczego nie zmienia w pozostałych.  
Od wersji `4.0.0` czyści ono też rejestry współpracy edytora, które uzgadniają równoczesne zmiany. Jeśli współdzielony magazyn edytora miał już subskrybenta, magazyn ponownie prosi pozostałe edytory o ich rejestry, tak jak przy pierwszym wywołaniu [subscribe](#subscribe), więc edytor ponownie wczytany w trakcie sesji uzgadnia zmiany tak samo jak pozostałe.  
Przypisanie właściwości `value` zachowuje rejestry, ale w przeciwieństwie do metody `setInitialValue` jest przekazywane: gdy edytor ma już współdzielony magazyn, każdy edytor w sesji wczytuje przypisany dokument, więc nigdy nie inicjuj w ten sposób dołączającego edytora.

## Mieszanie wersji {#mixing-releases}

Edytor stosuje tylko te typy akcji, które zna jego własna wersja, więc w sesji łączącej różne wersje starsze edytory tracą wszystko, co jest przesyłane akcjami nowszego typu.

Od wersji `3.10.0` zmiana ustawienia [ON DELETE lub ON UPDATE](../../guide/guides/relationship-editing.md#on-delete-and-on-update) relacji jest przesyłana jako jeden z dwóch nowych typów akcji, `relationship.changeOnDelete` i `relationship.changeOnUpdate`, a akcja `relationship.add` może zawierać obie wartości. Pośrednik przekazujący akcje bez zmian nie potrzebuje do ich obsługi niczego nowego.  
Edytor w wersji starszej niż `3.10.0` ignoruje te typy akcji i pola: nigdy nie poznaje ustawień ON DELETE ani ON UPDATE relacji, a dokument zapisany w takim edytorze nie zawiera żadnego z nich. Relacja dodana przez starszy edytor przychodzi bez nich, więc oba ustawienia mają początkowo wartość `Not set`.

Każda inna zmiana wysyłana przez edytor w wersji `3.10.0` jest przesyłana akcjami typów, które starsze edytory już znają.  
Przycisk `Replace All` w funkcji [Znajdź i zamień](../../guide/guides/find-and-replace.md#replacing) wysyła swoje zmiany jako jeden pakiet tych samych akcji zmiany nazwy, komentarza i notatki, które wysyła edycja ręczna. [Opcje widoku](../../guide/guides/table-related-functions.md#table-view-options) `Alternate Key` i `Referential Actions` są przesyłane istniejącą akcją `settings.changeShow`.

Od wersji `4.0.0` poniższe zmiany są przesyłane akcjami nowych typów, a pośrednik przekazujący akcje bez zmian nie potrzebuje do ich obsługi niczego nowego:

- dodanie, przeniesienie, zmiana rozmiaru, zmiana nazwy, zmiana koloru lub usunięcie [grupy tabel](../../guide/guides/table-groups.md): `tableGroup.add`, `tableGroup.move`, `tableGroup.moveTo`, `tableGroup.resize`, `tableGroup.changeName`, `tableGroup.changeColor` i `tableGroup.remove`; dołączenie tabeli do grupy lub wyjście z niej: `table.changeGroup`;
- zapisanie przyciskiem `Save` w oknie dialogowym [Mapuj kolumny](../../guide/guides/relationship-editing.md#map-columns) dla istniejącej relacji, które ustawia naraz obie jej listy kolumn: `relationship.changeColumns`;
- włączenie lub wyłączenie [blokady](../../guide/guides/settings.md#lock): `settings.changeLockSettings`;
- zmiana skryptu `Before tables` lub `After tables` na karcie [Schemat SQL](../../guide/guides/schema-sql.md): `settings.changeDDLScript`.

Opcje widoku `Table Groups` i `Memos` są przesyłane istniejącą akcją `settings.changeShow`.  
Akcja `settings.changeIgnoreSaveSettings`, którą wysyłały przełączniki `Save Scroll Information` i `Save Zoom Information`, zanim zastąpiły je blokady, nie jest już wysyłana, a akcja `settings.changeRelationshipOptimization` została usunięta. Edytor w wersji `4.0.0`, który otrzyma którąkolwiek z nich, niczego nie zmienia.

Edytor w wersji starszej niż `4.0.0` ignoruje nowe typy akcji: nigdy nie widzi grupy tabel ani tego, które tabele do niej należą, choć przeciągnięcie grupy nadal przesuwa w nim tabele tej grupy, ponieważ wysyła ono też ich akcje `table.move`.  
Zachowuje stare kolumny relacji po zapisaniu przyciskiem `Save` w oknie dialogowym „Mapuj kolumny”, a po usunięciu w nim kolumny z tego starego mapowania relacja znika we wszystkich edytorach. Nie ma w nim blokad ani skryptów.  
Dokument zapisany w takim edytorze nie zawiera żadnej z tych informacji, a edytor w wersji `4.0.0` otwiera go z włączonymi wszystkimi blokadami.  
Wszystkie edytory w sesji oraz każdy magazyn [replicationStore](./remote-storage.md#dispatch-dispatchsync), który przechowuje jej dokument, utrzymuj w wersji `4.0.0` lub nowszej.

Edytor w wersji `4.1.0` nie wysyła żadnego nowego typu akcji, więc edytory i repliki w wersjach `4.0.0` i `4.1.0` dzielą jedną sesję, niczego nie tracąc.  
Jego funkcja [Znajdź i zamień](../../guide/guides/find-and-replace.md#replacing) przeszukuje też nazwy indeksów i nazwy grup tabel, a przyciski `Replace` i `Replace All` zmieniają ich nazwy akcjami `index.changeName` i `tableGroup.changeName`, które edytor w wersji `4.0.0` już stosuje.

Od wersji `4.2.0` poniższe zmiany są przesyłane akcjami nowych typów, a pośrednik przekazujący akcje bez zmian nie potrzebuje do ich obsługi niczego nowego:

- [nazwa logiczna](../../guide/guides/logical-names.md) tabeli lub kolumny: `table.changeLogicalName` i `column.changeLogicalName`; to, czy nazwę tabeli lub kolumny [wygenerowano na podstawie słowników](../../guide/guides/dictionary.md#deriving-physical-names): `table.changeNameDerived` i `column.changeNameDerived`;
- powiązanie kolumny z [domeną](../../guide/guides/dictionary.md#domains-and-data-types) lub odłączenie jej od domeny: `column.changeDomain`;
- dodanie, zmiana (łącznie z miejscem w arkuszu, które ustala sortowanie) lub usunięcie słowa, terminu lub domeny na karcie [Słownik](../../guide/guides/dictionary.md): `dictionary.add`, `dictionary.update` i `dictionary.remove`;
- przełączenie [Widoku nazw](../../guide/guides/logical-names.md#switching-the-view): `settings.changeNameViewMode`.

Blokada `Name View` jest przesyłana istniejącą akcją `settings.changeLockSettings`, opcja widoku `Domain` – akcją `settings.changeShow`, a przeniesienie pozycji `Logical Name` lub `Domain` w [kolejności kolumn](../../guide/guides/settings.md#adjusting-column-order) – akcją `settings.changeColumnOrder`.  
Akcje `editor.clear` i `editor.loadJson` importu w formacie Schemat SQL, GraphQL, DBML lub AML wykonanego przez pozycję `Import` zawierają `keepDictionaries: true`, co zachowuje słowa, terminy i domeny w każdym edytorze. To samo dotyczy akcji zastępującego wywołania [setSchemaSQL](../erd-editor-element.md#setschemasql), `setSchemaGraphQL`, `setSchemaDBML` lub `setSchemaAML`.  
Nazwa fizyczna wygenerowana przez słowniki jest przesyłana akcją `table.changeName` lub `column.changeName`, a typ danych, który domena nadaje swoim kolumnom – akcją `column.changeDataType`, czyli tymi samymi akcjami, które wysyła edycja ręczna.

Edytor w wersji starszej niż `4.2.0` ignoruje nowe typy akcji: nie ma w nim nazw logicznych, powiązań z domenami, słowników ani Widoku nazw. Zablokowanie lub odblokowanie ustawienia `Name View` niczego w nim nie zmienia, podobnie jak przeniesienie pozycji `Logical Name` lub `Domain` w kolejności kolumn albo przeniesienie innej pozycji na miejsce którejś z nich. Niczego nie zmienia w nim również blokada `Canvas Type` włączona przez edytor, który przeszedł na kartę Ustawienia z karty Słownik: starszy edytor nie zna tej karty, więc pozostawia ustawienie `Canvas Type` odblokowane. Nadal wyświetla nazwy fizyczne generowane przez słowniki i typy danych nadawane przez domeny.  
Jego własne zmiany nic nie wiedzą o nazwach logicznych, domenach ani słownikach, co ma następujące skutki w nowszych edytorach:

- Tabela lub kolumna, której nazwę zmienia ręcznie, zachowuje oznaczenie nazwy jako wygenerowanej, więc nazwa logiczna wpisana dla niej później w nowszym edytorze może ponownie wygenerować nazwę fizyczną, nadpisując tę wpisaną w starszym edytorze.
- Typ danych, który nadaje kolumnie powiązanej z domeną, pozostawia powiązanie, więc arkusz `Checks` wyświetla kontrolę `Domain type mismatch`, a następna zmiana typu domeny ponownie nadaje kolumnie typ domeny.
- Kolumny klucza obcego relacji, którą dodaje, nie otrzymują od swojego klucza ani nazwy logicznej, ani domeny.
- Tabela, którą wkleja lub duplikuje, przychodzi bez nazw logicznych i powiązań z domenami.
- Import w formacie Schemat SQL, GraphQL, DBML lub AML wykonany w tym edytorze nie wysyła `keepDictionaries`, więc opróżnia słowa, terminy i domeny w każdym edytorze.
- Cofnięcie przez niego wczytania, importu lub wywołania `clear()` wczytuje w każdym edytorze jego własną kopię dokumentu, a ta kopia nie ma nazw logicznych, powiązań z domenami ani słowników.
- Ta kopia, a także dokument wczytywany przez wykonany w nim import w formacie Schemat SQL, GraphQL, DBML lub AML, przywracają też w każdym edytorze blokadę `Name View` do stanu, w jakim zastał ją starszy edytor. Każdy edytor zapisuje wtedy jako Widok nazw widok `Physical Names`, a jeśli blokada jest wyłączona, również go wyświetla.

Dokument zapisany w takim edytorze nie ma nazw logicznych, powiązań z domenami, słowników ani Widoku nazw, więc edytor w wersji `4.2.0` otwiera go w widoku `Physical Names`. Starszy edytor zapisuje jednak blokadę `Name View` w takim stanie, w jakim ją zastał, więc dokument odblokowany w edytorze w wersji `4.2.0` pozostaje odblokowany.  
Wszystkie edytory w sesji oraz każdy magazyn [replicationStore](./remote-storage.md#dispatch-dispatchsync), który przechowuje jej dokument, utrzymuj w wersji `4.2.0` lub nowszej.

## SharedStoreConfig {#sharedstoreconfig}

### getNickname {#getnickname}

Ustawia pseudonim wyświetlany obok kursora myszy tego użytkownika w pozostałych edytorach.  
Inni użytkownicy widzą `user`, gdy pseudonim nie został podany lub jest pusty.

```js
editor.getSharedStore({
  getNickname: () => 'nickname...',
});
```

### mouseTracker {#mousetracker}

Rozsyła kursor myszy tego użytkownika do pozostałych edytorów. Wartość domyślna to `true`.  
Kursory wysyłane przez innych użytkowników są zawsze wyświetlane na kanwie ERD.

```js
editor.getSharedStore({ mouseTracker: false });
```

### focusTracker {#focustracker}

Rozsyła informacje o tym, nad czym pracuje ten użytkownik. Wartość domyślna to `true`.  
Tabela i komórka z twoim fokusem, zaznaczone przez ciebie tabele, notatki i grupy tabel oraz ramka, którą przeciągasz na kanwie, są wysyłane do pozostałych edytorów i tam rysowane.  
Każdy użytkownik dostaje własny kolor, dzięki czemu można ich odróżnić: obrys tabeli z fokusem, podkreślenie komórki z fokusem, obwódka wokół zaznaczonych tabel, notatek i grup tabel oraz przerywany prostokąt w miejscu ramki przeciągania.  
Od wersji `4.2.0` każdy z użytkowników może mieć ustawiony inny [Widok nazw](../../guide/guides/logical-names.md#collaborators), gdy jego blokada jest włączona, albo po własnym przełączeniu w edytorze tylko do odczytu. Komórka z fokusem, której twój widok nie wyświetla, jest podkreślana na komórce wyświetlanej w jej miejscu: nazwa i nazwa logiczna zastępują się nawzajem, tak jak typ danych i domena.  
Informacje o obecności napływające od innych użytkowników są zawsze rysowane na twojej kanwie, niezależnie od tego, czy ta opcja jest włączona.  
W trybie Przepływ na karcie Wizualizacja fokus i zaznaczenie innych użytkowników są rysowane na kafelkach tabel, ale ich ramki przeciągania już nie. Tabele, które tam zaznaczasz, nadal są wysyłane; ramka, którą tam przeciągasz – już nie.

```js
editor.getSharedStore({ focusTracker: false });
```

Wyłącz oba mechanizmy śledzenia, aby używać współdzielonego magazynu jako zwykłego pośrednika, który nie publikuje żadnych własnych informacji o obecności.  
Informacje o obecności wysyłane przez inne edytory są nadal odbierane i rysowane.  
Tak działają edytory w VS Code, aplikacji Obsidian, IDE JetBrains i Google Drive.

```js
editor.getSharedStore({ mouseTracker: false, focusTracker: false });
```

Kursor, fokus, zaznaczenie i ramka przeciągania są przesyłane tym samym strumieniem co zmiany dokumentu, ale są ulotne.  
Nigdy nie trafiają do dokumentu, historii cofania ani właściwości `editor.value`, więc transport może je swobodnie odrzucać, a magazyn replicationStore je ignoruje.

## SharedStore {#sharedstore}

### connection, disconnect {#connection-disconnect}

Te metody ustawiają bieżący stan połączenia.  
W stanie rozłączenia zmiany są buforowane wewnętrznie.  
Zbuforowane zmiany są emitowane do subskrybentów, gdy tylko transmisja znów stanie się możliwa.  
Stanem domyślnym jest stan połączenia (`connection`).

```js
sharedStore.connection();
sharedStore.disconnect();
```

### dispatch, dispatchSync {#dispatch-dispatchsync}

Stosuje w bieżącej instancji edytora zmiany pochodzące z innych instancji edytora.

```js
sharedStore.dispatch(actions); // async
sharedStore.dispatchSync(actions); // sync
```

### subscribe {#subscribe}

Subskrybuje zmiany w edytorze.  
Dopóki nie ma co najmniej jednego subskrybenta, nic nie opuszcza edytora, a zmiany wprowadzone wcześniej są buforowane.  
Pierwsze wywołanie subscribe prosi też pozostałe edytory o ich rejestry współpracy, które uzgadniają równoczesne zmiany, więc edytor, który dołącza później, uzgadnia je tak samo.  
Nie dostarcza ono dokumentu, więc taki edytor najpierw [zainicjuj](#seeding-a-collaborator).  
Od wersji `4.0.0` magazyn ponawia tę prośbę za każdym razem, gdy metoda `setInitialValue` wczyta dokument do jego edytora po tym pierwszym wywołaniu subscribe.

```js
const unsubscribe = sharedStore.subscribe(actions => {
  // send...
});
```

### flushStreamBuffers {#flushstreambuffers}

Wysyła od razu pakiety strumieni, które ten magazyn jeszcze wstrzymuje, zamiast po upływie ich okresu ciszy.  
Od wersji `3.9.2` działa w magazynie zwróconym przez metodę `getSharedStore`; w wersji `3.9.1` metoda istnieje w typie, ale nic nie robi.  
Przenoszenie tabeli, notatki lub grupy tabel, zmiana ich koloru, zmiana rozmiaru notatki oraz przewijanie lub zmiana powiększenia widoku – każde z nich przychodzi jako strumień drobnych zmian. Zmiana rozmiaru grupy tabel tak nie działa: jest wysyłana raz, gdy przeciąganie się kończy.  
Magazyn zbiera każdy strumień w jeden pakiet i wstrzymuje go, dopóki strumień nie ucichnie na 200 ms. Robi to w dwóch etapach, więc pakiet wychodzi około 400 ms po ostatniej zmianie.  
Wywołanie kończy to oczekiwanie w obu etapach. Gdy magazyn jest połączony, subskrybent otrzymuje pakiet, zanim wywołanie zwróci sterowanie. Wywołanie, gdy nic nie jest wstrzymywane, niczego nie wysyła.  
Metoda `destroy`, czy to magazynu, czy edytora, odrzuca pakiet, który jest jeszcze wstrzymywany, więc najpierw wywołaj opisywaną tu metodę, gdy zwalniasz magazyn, a pozostałe edytory mają zachować ostatnią zmianę, na przykład przy zamykaniu karty.

```js
sharedStore.flushStreamBuffers();
sharedStore.destroy();
```

### destroy {#destroy}

Całkowicie niszczy instancję sharedStore.  
Sam edytor pozostaje nienaruszony, więc po opuszczeniu sesji dokument nadal można edytować.  
Mechanizmy śledzenia myszy i fokusu przestają działać, gdy zostanie zniszczony ostatni magazyn sharedStore wydany przez edytor.  
Pakiet strumienia, który magazyn jeszcze wstrzymuje, jest odrzucany razem z nim; aby go wysłać, najpierw wywołaj metodę [flushStreamBuffers](#flushstreambuffers).

```js
sharedStore.destroy();
```
