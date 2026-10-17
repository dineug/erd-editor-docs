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
Nie są też wysyłane wybory opcji `Statements`, `Header` i `Tables` na karcie [Schemat SQL](../../guide/guides/schema-sql.md), które należą do okna, w którym ich dokonano.  
Od wersji `4.1.0` w swoim edytorze pozostaje też [Eksplorator](../../guide/guides/explorer.md): to, czy jest otwarty, jego szerokość, zwinięte wiersze, wiersz z fokusem klawiatury, pozycja przewinięcia drzewa oraz wyszukiwanie i opcje nie są wysyłane.  
Nie jest też wysyłane [podświetlenie](../../guide/guides/relationship-editing.md#reading-a-connector), które przejście do klucza obcego nakłada na łącznik jego relacji.  
Przewinięcie, powiększenie lub przełączenie karty jest wysyłane, ale nigdy nie przesuwa widoku ani nie przełącza karty innego użytkownika. Dotyczy to również przewinięcia wykonywanego przy przejściu z Eksploratora i przełączenia na kartę ERD, gdy Eksplorator otwiera się z poziomu innej karty.

[Blokady](../../guide/guides/settings.md#lock) są współdzielone: w każdym edytorze obowiązuje ostatnie zablokowanie lub odblokowanie danego ustawienia, a blokada przenosi wartości edytora, który ją włączył, więc każdy edytor i każda replika zapisują tę samą wartość.  
Blokada `Viewport` zapisuje więc widok edytora, który ją włączył, a blokada `Canvas Type` – ostatnią kartę otwartą w tym edytorze przed kartą Ustawienia, na której włącza się blokady.  
Wyłączenie blokady `Language`, `Table Name Case`, `Column Name Case` lub `Bracket Type` zmienia też to ustawienie w każdym edytorze na wartość wyświetlaną w edytorze, który ją wyłączył, więc edytory nadal zapisują jedną wartość. Wyłączenie blokady `Viewport` lub `Canvas Type` nie przesuwa niczyjego widoku ani nie przełącza niczyjej karty.

Zmiana skryptu `Before tables` lub `After tables` jest wysyłana w całości, gdy jego pole traci fokus. Oba skrypty są uzgadniane osobno, więc zmiana jednego z nich wprowadzona przez współpracownika nigdy nie nadpisuje drugiego.

Żadna czynność w [trybie Przepływ](../../guide/guides/visualization.md#flow-never-edits-the-document) na karcie Wizualizacja nie jest zmianą dokumentu, więc edytor w trybie Przepływ nie wysyła innym edytorom żadnych zmian, a zmiany wysyłane przez nie są w tym czasie nadal stosowane.  
Jedynym wyjątkiem jest przejście z trybu Przepływ na inną kartę: to przełączenie karty jest wysyłane jak każde inne.  
Przycisk kafelka z łączem zewnętrznym, wynik [szybkiego wyszukiwania](../../guide/guides/quick-search.md#searching-the-diagram) wybrany po prefiksie `#`, `@` lub `:` oraz otwarcie [Eksploratora](../../guide/guides/explorer.md#opening-and-closing) przenoszą z trybu Przepływ na kartę ERD. Przewinięcie wykonane tam przez przycisk kafelka lub wynik szybkiego wyszukiwania również jest wysyłane.

## Dwa edytory na jednej stronie {#two-editors-on-one-page}

Bezpośrednie połączenie subscribe z dispatch zastępuje tu sieć, dzięki czemu widać strukturę sesji bez zasłaniającego ją transportu.

```js
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
