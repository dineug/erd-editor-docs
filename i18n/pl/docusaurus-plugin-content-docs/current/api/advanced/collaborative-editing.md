---
sidebar_position: 1
description: Przekazywanie zmian edytora między instancjami za pomocą getSharedStore, inicjowanie dołączającego edytora z runtimeValue i rejestrów magazynu, uzgadnianie edycji wykonanych w tej samej chwili oraz pokazywanie kursora, fokusu, zaznaczenia i ramki przeciągania każdego współpracownika.
---

# Wspólna edycja

Metoda `getSharedStore()` zmienia edytor w węzeł sesji wspólnej edycji.  
Emituje każdą zmianę jako strumień akcji i stosuje akcje odsyłane przez inne edytory – transport między nimi zapewniasz sam (WebSocket, WebRTC lub cokolwiek innego, co potrafi przenosić dane JSON).  
Jest jedną z metod elementu [ErdEditorElement](../erd-editor-element.md) i współdziała z mechanizmem [Zdalne przechowywanie](./remote-storage.md), gdy przekazywane zmiany trzeba również przechowywać.  
Od wersji `5.1.0`, aby udostępniać diagram przez dokument Yjs i dowolnego z jego dostawców zamiast samodzielnie budować transport, powiąż edytor za pomocą pakietu `@dineug/erd-editor-yjs`; zobacz stronę [Yjs](./yjs.md).

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
  getLWW: () => SharedRegisters;
  mergeLWW: (lww: SharedRegisters, version: number) => void;
  getVersion: () => number;
  forgetPeer: (editorId: string) => void;
  reseed: (value: string, options: ReseedOptions) => void;
  destroy: () => void;
};

// a JSON object whose shape is the editor's own: hand it on as it is
type SharedRegisters = Record<string, unknown> & {
  readonly [registersBrand]: true;
};

type ReseedOptions = {
  lww: SharedRegisters;
  version: number;
  keepScreen?: boolean; // default false
};

// example
const sharedStore = editor.getSharedStore();
```

Pakiet `@dineug/erd-editor` nie eksportuje żadnego z tych typów pod nazwą. Kod TypeScript sięga do nich przez `ErdEditorElement`, jak w `ReturnType<ErdEditorElement['getSharedStore']>`.

Akcja to zwykły serializowalny obiekt opisujący jedną zmianę w dokumencie, więc bez strat przechodzi przez funkcję `JSON.stringify` w drodze do transportu.  
Akcje przychodzą w pakietach: metoda `subscribe` przekazuje ci tablicę, a ta tablica stanowi jedną całość – prześlij ją dalej w całości i w całości przekaż (dispatch) po drugiej stronie.  
Traktuj akcję jak nieprzezroczysty obiekt i przekazuj ją bez zmian, zamiast ją odczytywać lub przepisywać, ponieważ zawarte w niej informacje pomocnicze, takie jak jej [wersja](#concurrent-edits), utrzymują edytory w synchronizacji.

Część tego, co robi edytor, pozostaje w tym edytorze.  
Przeniesienie tabeli, notatki lub grupy tabel na wierzch, tak jak robi to ich zaznaczenie, nie jest wysyłane.  
Nie są też wysyłane wybory opcji `Statements`, `Header`, `Write logical names into empty comments` (od wersji `4.2.0`) i `Tables` na karcie [Schemat SQL](../../guide/guides/schema-sql.md), które należą do okna, w którym ich dokonano.  
Od wersji `4.1.0` w swoim edytorze pozostaje też [Eksplorator](../../guide/guides/explorer.md): to, czy jest otwarty, jego szerokość, zwinięte wiersze, wiersz z fokusem klawiatury, pozycja przewinięcia drzewa oraz wyszukiwanie i opcje nie są wysyłane.  
Nie jest też wysyłane [podświetlenie](../../guide/guides/relationship-editing.md#reading-a-connector), które przejście do klucza obcego nakłada na łącznik jego relacji.  
Od wersji `4.2.0` w swoim edytorze pozostaje również karta [Słownik](../../guide/guides/dictionary.md): to, który arkusz jest wyświetlany, oraz wyszukiwanie, zaznaczenie, przewinięcie i szerokości kolumn każdego arkusza nie są wysyłane. Wysyłane są natomiast jej edycje, sortowania i importy CSV.  
Przewinięcie, powiększenie lub przełączenie karty jest wysyłane, ale nigdy nie przesuwa widoku ani nie przełącza karty innego użytkownika. Dotyczy to również przewinięcia wykonywanego przy przejściu z Eksploratora, przełączenia na kartę ERD, gdy Eksplorator otwiera się z poziomu innej karty, oraz przełączenia karty i przewinięcia przy przejściu z arkusza [`Checks`](../../guide/guides/dictionary.md#the-checks-sheet) karty Słownik do tabeli lub kolumny. Przejście z tego arkusza do słowa, terminu lub domeny pozostaje na karcie Słownik, więc nic z niego nie jest wysyłane.

Od wersji `4.2.0` wysyłane jest też przełączenie [Widoku nazw](../../guide/guides/logical-names.md#switching-the-view), a to, co robią z nim pozostałe edytory, zależy od jego [blokady](../../guide/guides/settings.md#lock). Blokada `Name View` jest włączona w nowym diagramie i w każdym dokumencie sprzed wersji `4.2.0`.  
Gdy blokada jest włączona, przełączenie widać tylko w edytorze, który go dokonał: nadal jest wysyłane, ale każdy inny edytor i każda replika je pomijają, więc każdy użytkownik może oglądać inny widok, podczas gdy `value` zachowuje zablokowany widok.  
Gdy blokada jest wyłączona, przełączenie dokonane w edytorze, który może edytować, zmienia Widok nazw w każdym edytorze i każdej replice, przy czym obowiązuje ostatnie przełączenie, a każdy z nich ten widok zapisuje.  
Własne przełączenie edytora tylko do odczytu zawsze pozostaje w tym edytorze, a edytor nadal podąża za współdzielonymi przełączeniami pozostałych.

Od wersji `5.1.0` zmiana języka [Generatora kodu](../../guide/guides/code-generator.md), stylu nazw tabel, stylu nazw kolumn lub typu cudzysłowu podlega własnej blokadzie (`Language`, `Table Name Case`, `Column Name Case` lub `Bracket Type`) w ten sam sposób, z jedną różnicą: gdy blokada jest włączona, zmiana w ogóle nie jest wysyłana.  
Widać ją tylko w edytorze, który jej dokonał, a jego karty Generator kodu i Schemat SQL ją uwzględniają; żaden inny edytor ani replika jej nie widzi. Właściwości `value` i `runtimeValue` zachowują zablokowaną wartość, więc dołączający edytor zainicjowany z dowolnego edytora też jej nie widzi, a każdy użytkownik może oglądać inny język, styl nazw lub typ cudzysłowu, gdy blokada jest włączona.  
Gdy blokada jest wyłączona, zmiana dokonana w edytorze, który może edytować, jest wysyłana z oznaczeniem jako współdzielona (`shared: true` w jej ładunku). Zmienia ustawienie w każdym edytorze i każdej replice, przy czym obowiązuje ostatnia zmiana, a każdy z nich ją zapisuje. Edytor lub replika w wersji `5.1.0` stosuje oznaczoną zmianę niezależnie od własnej blokady, więc zmiana dokonana tuż po odblokowaniu trafia wszędzie, nawet tam, gdzie dociera przed odblokowaniem.  
Przed wersją `5.1.0` taka zmiana docierała do każdego edytora i każdej repliki niezależnie od tego, czy jej blokada była włączona, a plik zachowywał zablokowaną wartość.

Od wersji `5.0.0` edytor [tylko do odczytu](../erd-editor-element.md#readonly) w ogóle nie wysyła zmian. Przewinięcie, powiększenie, karta, Widok nazw, baza danych, język Generatora kodu, style nazw, typ cudzysłowu i wiersze `View Option`, które zmienia jego czytelnik, pozostają na jego ekranie niezależnie od ich blokad; przed wersją `5.0.0` jego przewinięcia, powiększenia, przełączenia kart, baza danych i ustawienia kodu były wysyłane tak jak w edytorze z możliwością edycji.  
Jego magazyn nadal wysyła to, co wysyłają jego mechanizmy śledzące kursora, fokusu, zaznaczenia i ramki przeciągania czytelnika, odpowiada na rejestry, o które prosi dołączający edytor, i stosuje każdą zmianę wysłaną przez pozostałych. Zmiana bazy danych, ustawienia Generatora kodu lub wiersza `View Option` trafia do jego dokumentu, a także na jego ekran, chyba że jego czytelnik zmienił to ustawienie właśnie tam, a współdzielone przełączenie Widoku nazw widać na jego ekranie w obu przypadkach. Od wersji `5.1.0` dostaje ustawienie Generatora kodu tylko wtedy, gdy zmieniono je przy wyłączonej blokadzie albo niesie je odblokowanie.  
Gdy edytor przechodzi w tryb tylko do odczytu, najpierw wysyła to, co magazyn wciąż wstrzymuje z przeciągania lub przewinięcia, tak jak robi to [flushStreamBuffers](#flushstreambuffers), dzięki czemu pozostałe edytory zachowują jego ostatni stan.

[Blokady](../../guide/guides/settings.md#lock) są współdzielone: w każdym edytorze obowiązuje ostatnie zablokowanie lub odblokowanie danego ustawienia, a blokada przenosi wartości edytora, który ją włączył, więc każdy edytor i każda replika zapisują tę samą wartość.  
Blokada `Viewport` zapisuje więc widok edytora, który ją włączył, a blokada `Canvas Type` – ostatnią kartę otwartą w tym edytorze przed kartą Ustawienia, na której włącza się blokady.  
Wyłączenie blokady `Language`, `Table Name Case`, `Column Name Case`, `Bracket Type` lub, od wersji `4.2.0`, `Name View` zmienia też to ustawienie w każdym edytorze na wartość wyświetlaną w edytorze, który ją wyłączył, łącznie z jego własną zmianą dokonaną przy włączonej blokadzie, więc edytory nadal zapisują jedną wartość. Wyłączenie blokady `Viewport` lub `Canvas Type` nie przesuwa niczyjego widoku ani nie przełącza niczyjej karty.

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
Pokój powiązany za pomocą pakietu [`@dineug/erd-editor-yjs`](./yjs.md) sam przechowuje dokument, gdy klient go [zainicjuje](./yjs.md#seeding-a-room), więc każdy powiązany z nim edytor otwiera ten dokument bez przekazywania `runtimeValue`.

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
Od wersji `4.0.0` czyści ono też rejestry współpracy edytora, które uzgadniają [równoczesne edycje](#concurrent-edits). Jeśli współdzielony magazyn edytora miał już subskrybenta, magazyn ponownie prosi pozostałe edytory o ich rejestry, tak jak przy pierwszym wywołaniu [subscribe](#subscribe), więc edytor ponownie wczytany w trakcie sesji uzgadnia zmiany tak samo jak pozostałe.  
Przypisanie właściwości `value` zachowuje rejestry, ale w przeciwieństwie do metody `setInitialValue` jest przekazywane: gdy edytor ma już współdzielony magazyn, każdy edytor w sesji wczytuje przypisany dokument, więc nigdy nie inicjuj w ten sposób dołączającego edytora.

Ani `value`, ani `runtimeValue` nie zawierają rejestrów ani wersji, do której doszedł zegar edytora, więc dołączający edytor zainicjowany samą wartością `runtimeValue` bierze je z odpowiedzi, którą edytory w sesji wysyłają na jego pierwsze wywołanie subscribe.  
Zanim ta odpowiedź nadejdzie, zmiana dokonana w dołączającym edytorze może nieść niższą wersję niż ta, którą mają pozostałe, więc odrzucają ją, podczas gdy pozostaje ona w dołączającym edytorze, a starszy zapis, który wciąż jest w drodze, nadpisuje nowszy, który zawierają dane inicjujące. Tam, gdzie nie odpowiada żaden działający edytor, na przykład gdy dokument sesji przechowuje serwer lub magazyn dokumentów, dołączający edytor nigdy ich nie dostaje.  
Od wersji `5.1.0` przekaż je razem z wartością. W edytorze w sesji wywołaj [`flushStreamBuffers()`](#flushstreambuffers), aby najpierw wyszło przeciąganie lub zmiana koloru, które wciąż wstrzymuje, a potem odczytaj w tej samej chwili `runtimeValue` oraz wyniki metod [`getLWW()`](#getlww) i [`getVersion()`](#getversion) jego magazynu. Dołączający edytor wczytuje wartość metodą `setInitialValue`, a potem przejmuje resztę za pomocą metody [`mergeLWW`](#mergelww) własnego magazynu, w tej kolejności, ponieważ każde wywołanie `setInitialValue` czyści rejestry. Jego następna zmiana niesie wtedy wersję wyższą od każdej, którą zawierają dane inicjujące, więc ląduje bez czekania na odpowiedź. W magazynie, który już istnieje, [`reseed`](#reseed) robi jedno i drugie jednym wywołaniem.

```js
// on an editor already in the session
sharedStore1.flushStreamBuffers();
const seed = {
  value: editor1.runtimeValue,
  lww: sharedStore1.getLWW(),
  version: sharedStore1.getVersion(),
};

// on the joiner
editor2.setInitialValue(seed.value);
const sharedStore2 = editor2.getSharedStore();
sharedStore2.mergeLWW(seed.lww, seed.version);
```

Dane inicjujące zachowane w ten sposób, aby otwierać dokument późniejszym dołączającym, obejmują wszystkie trzy elementy razem. To nie jest plik: do pamięci trwałej nadal zapisuje się `value`.  
Magazyn [replicationStore](./remote-storage.md#runtimevalue-getter) nie przekazuje żadnych rejestrów, więc dołączający edytor zainicjowany jego wartością `runtimeValue` nadal bierze je z odpowiedzi edytorów.

## Równoczesne edycje {#concurrent-edits}

Każdy edytor i każda replika przechowuje dla każdej nazwy i niemal każdego innego pola wersję zapisu, który je ustawił: to są jego rejestry współpracy. Zapis ląduje tylko wtedy, gdy jego wersja nie jest niższa od przechowywanej, więc edytory, które otrzymują te same zmiany w różnej kolejności, kończą na tym samym dokumencie.  
Od wersji `5.1.0` każda wersja niesie pod swoim licznikiem własne miejsce piszącego edytora, wzięte z jego identyfikatora. Wersje rosną więc skokami po 4 194 304 i przekraczają zakres 32-bitowej liczby całkowitej, gdy licznik dojdzie do 512. `JSON.stringify` i `JSON.parse` przenoszą je bez zmian, ale pośrednik lub magazyn, który parsuje je w innym języku, musi przechowywać je jako liczby 64-bitowe, nigdy jako 32-bitowe liczby całkowite.

Od wersji `5.1.0` dwa edytory, które zmieniają tę samą nazwę lub pole w tej samej chwili, poza wyjątkami opisanymi niżej, kończą z tą samą wartością w każdym edytorze i każdej replice: zapisując przy tym samym liczniku, nadają dwie różne wersje, a większa wygrywa wszędzie. Przed wersją `5.1.0` oba mogły nadać jedną wersję, a każdy edytor zachowywał wartość, którą otrzymał jako ostatnią, więc mogły skończyć w różnych stanach. Dwa edytory mają wspólne miejsce z szansą 1 do 4 194 304 na parę i wtedy remisują jak wcześniej.

Od wersji `5.1.0` pozycja tabeli, pozycja i rozmiar notatki lub grupy tabel oraz początek widoku i poziom powiększenia są wersjonowane w ten sam sposób, a to, co je przesuwa, wychodzi jako miejsce, w którym się kończy:

- przeciągnięcie jako jedno `table.moveTo`, `memo.moveTo` lub `tableGroup.moveTo` na każdą przesuniętą encję, w jednym pakiecie, więc przeciągnięcie grupy niesie punkty jej tabel, a od wersji `5.1.1` także jej notatek, razem z punktem grupy;
- cofnięcie lub ponowienie przeciągnięcia jako punkt, w którym umieszcza każdą encję;
- przesunięcie widoku jako `settings.scrollTo`, a powiększenie jako `settings.changeZoomLevel`;
- zmiana rozmiaru notatki lub grupy tabel jako jej pozycja i rozmiar razem.

Dwaj użytkownicy, którzy w tej samej chwili przesuwają albo przesuwają i zmieniają rozmiar tej samej tabeli, notatki lub grupy tabel, kończą więc z nią w jednym punkcie i o jednym rozmiarze w każdym edytorze i każdej replice. Punkt trafia do zapisu z większą wersją, obie osie razem. Przesunięcie nie zapisuje rozmiaru, więc zmiana rozmiaru zachowuje swój rozmiar nawet tam, gdzie przesunięcie wykonane w tym samym czasie zabiera punkt.  
Przed wersją `5.1.0` przeciągnięcie wychodziło jako przebyta odległość, więc dwa przeciągnięcia jednej tabeli sumowały się, a przesunięcie i zmiana rozmiaru jednej notatki lub grupy tabel wykonane naraz mogły skończyć w różnych stanach.  
Przeciągnięcie krótsze niż 20 px, które nie zostawia wpisu cofania, jest wysyłane jak każde inne, więc jako punkt może zastąpić przeciągnięcie tej samej encji wykonane w tej samej chwili przez innego użytkownika. Pakiet przeciągnięcia, przesunięcia widoku lub powiększenia, który transport dostarcza dwukrotnie, niczego nie przesuwa dwa razy.

Zmiana koloru jest wyjątkiem. Wychodzi bez wersji, a każdy edytor i każda replika nadaje jej własną i zachowuje kolor, który otrzymał jako ostatni, więc dwaj użytkownicy, którzy w tej samej chwili zmieniają kolor tej samej tabeli, notatki lub grupy tabel, mogą skończyć z różnymi kolorami.  
Kilka zmian nie ma żadnej wersji, więc każdy edytor i każda replika stosuje je w kolejności, w jakiej je otrzymuje, a dwie wykonane w tej samej chwili również mogą skończyć w różnych stanach: przeniesienie kolumny w obrębie jej tabeli lub indeksu (`column.move`, `indexColumn.move`) oraz zmiana [bazy danych](../../guide/guides/table-related-functions.md#databases), wiersza [`View Option`](../../guide/guides/table-related-functions.md#table-view-options) albo ustawień `Relationship DataType Sync`, `Maximum comment width` lub `Column Order` na karcie [Ustawienia](../../guide/guides/settings.md).  
Encje dodane przez dwóch użytkowników w tej samej chwili, na przykład dwie tabele lub dwie kolumny jednej tabeli, mogą też stać w innej kolejności w każdym edytorze i każdej replice, a `value` każdego z nich zapisuje jego własną kolejność.

Wszystko to obowiązuje wśród edytorów i replik w wersji `5.1.0` lub nowszej; sekcja [Mieszanie wersji](#mixing-releases) opisuje, co zmienia starszy edytor lub replika.

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

Edytor w wersji starszej niż `4.0.0` ignoruje nowe typy akcji: nigdy nie widzi grupy tabel ani tego, które tabele do niej należą, choć przeciągnięcie grupy nadal przesuwa w nim tabele tej grupy, ponieważ wysyła ono też przesunięcie każdej z tych tabel.  
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

Edytor w wersji `5.1.0` nie wysyła żadnego nowego typu akcji, więc edytory i repliki sprzed wersji `5.1.0` nadal dzielą z nim sesję, a pośrednik przekazujący akcje bez zmian nie potrzebuje niczego nowego. To, co opisuje sekcja [Równoczesne edycje](#concurrent-edits), obowiązuje jednak tylko wśród edytorów i replik w wersji `5.1.0`:

- Przeciągnięcia w edytorze w wersji `5.1.0` są przesyłane jako punkty w akcjach `table.moveTo`, `memo.moveTo` i `tableGroup.moveTo`, które starsze edytory już stosują, a przesunięcia widoku i powiększenia jako punkty w akcjach `settings.scrollTo` i `settings.changeZoomLevel`, których, jak każdego przesunięcia widoku i powiększenia, nie stosuje żaden inny edytor, a przyjmują je tylko repliki. Starszy edytor stosuje każdy punkt przeciągnięcia w kolejności nadejścia, poza jakimkolwiek rejestrem, a starsza replika robi to samo z każdym punktem przeciągnięcia, przesunięcia widoku lub powiększenia, więc dwa punkty wysłane naraz dla jednej encji albo dla widoku mogą tam skończyć w różnych stanach.
- Przeciągnięcie w starszym edytorze nadal jest przesyłane jako przebyta odległość, którą każdy edytor i każda replika dodaje poza swoimi rejestrami, a jego przesunięcie widoku lub powiększenie również jako odległość, którą każda replika dodaje tak samo. Odległość i punkt dla jednej encji wykonane naraz mogą skończyć w różnych stanach w edytorach i replikach, które otrzymują je w różnej kolejności, a odległość dostarczona przez transport dwukrotnie jest dodana dwa razy.
- Poza wyjątkami, które wymienia sekcja [Równoczesne edycje](#concurrent-edits), zapis nazwy lub pola w edytorze w wersji `5.1.0` wykonany w tej samej chwili co zapis tego samego w starszym edytorze wygrywa niemal zawsze, z tym samym wynikiem w każdym edytorze i każdej replice. Dwa starsze edytory nadal mogą skończyć w różnych stanach przy jednym polu zapisanym naraz.
- Edytor w wersji `5.1.0` wysyła zmianę języka, stylu nazw lub typu cudzysłowu Generatora kodu tylko przy wyłączonej blokadzie, z oznaczeniem `shared: true`, które starszy edytor ignoruje, stosując zmianę jak dawniej. Starszy edytor nadal wysyła zmianę dokonaną przy włączonej blokadzie, bez oznaczenia: edytor lub replika w wersji `5.1.0` pomija ją, dopóki to ustawienie jest tam zablokowane, a starsze edytory ją stosują. Przy włączonej blokadzie starsze edytory podążają więc nawzajem za swoimi wyborami, podczas gdy edytory w wersji `5.1.0` zachowują własne, a plik w obu przypadkach zachowuje zablokowaną wartość. Odblokowanie dokonane w którejkolwiek wersji przenosi wartość odblokowującego do każdego edytora i każdej repliki.
- Wczytanie zastępujące dokument, takie jak przypisane `value`, `clear()` lub import zastępujący, kończy rysowanie relacji w każdym edytorze w wersji `5.1.0`, zarówno w tym, który je wykonał, jak i w każdym, który je otrzymuje. Starszy edytor zachowuje przy nim włączone rysowanie.

Wszystkie edytory w sesji oraz każdy magazyn [replicationStore](./remote-storage.md#dispatch-dispatchsync), który przechowuje jej dokument, utrzymuj w wersji `5.1.0` lub nowszej, aby edycje wykonane w tej samej chwili kończyły tak samo wszędzie, poza wyjątkami, które wymienia sekcja [Równoczesne edycje](#concurrent-edits); wersja `4.2.0` lub nowsza nadal jest tym, co zachowuje nazwy logiczne i słowniki. [Serwer MCP](../../mcp/live-and-headless.md#edits-made-at-the-same-moment) sprzed wersji `1.2.0` liczy się tu jako edytor sprzed wersji `5.1.0`, a edytora sprzed wersji `5.1.0` w ogóle nie można powiązać z pokojem [Yjs](./yjs.md).

Od wersji `5.1.1` dołączenie notatki do [grupy tabel](../../guide/guides/table-groups.md) lub opuszczenie przez nią grupy przesyłane jest nowym typem akcji, `memo.changeGroup`, a pośrednik przekazujący akcje bez zmian nie potrzebuje do tego niczego nowego. Ta akcja jest wysyłana dla notatki upuszczonej w grupie lub poza nią, dla nowej grupy narysowanej wokół widocznych notatek bez grupy, dla pozycji `Group selected tables` przy notatkach zaznaczonych obok tabel, dla pozycji `Remove from group` przy notatkach w zaznaczeniu, dla każdej notatki usuwanej grupy, dla wywołań agenta kodującego dotyczących grup notatek przez [serwer MCP](../../mcp/tools.md#table-groups) oraz dla cofnięcia i ponowienia każdej z tych zmian. Wysyła ją także dodanie przez `Import and Add` lub `setSchemaJSON`, którego grupy zawierają notatki, i jego ponowienie, a jego cofnięcie tylko usuwa te notatki.

Edytor lub replika sprzed wersji `5.1.1` ignoruje `memo.changeGroup`, a jego parsowanie pomija pole `groupId` każdej notatki, więc nigdy nie widzi notatki w grupie, choć przeciągnięcie grupy w edytorze w wersji `5.1.1` nadal przesuwa tam notatki grupy, ponieważ wysyła też `memo.moveTo` dla każdej z nich. Jego własne zmiany nic nie wiedzą o grupach notatek, co ma następujące skutki w nowszych edytorach:

- Notatka, którą przeciągnie do ramki grupy, pozostaje poza grupą, a wyciągnięta przez niego z ramki notatka należąca do grupy pozostaje w grupie, przy czym ramka rozciąga się, by ją objąć.
- Jego przeciągnięcie grupy, podobnie jak `Auto Layout`, przesuwa grupę i jej tabele, ale zostawia notatki grupy tam, gdzie stoją, a ramka rozciąga się, by objąć te z nich, które są widoczne.
- Operacja `Import and Add` wykonana w nim nie umieszcza żadnej notatki w dodawanych grupach.
- Gdy usuwa grupę, pole `groupId` każdej z jej notatek nadal wskazuje tę grupę: notatki są traktowane jako niebędące w żadnej grupie, a cofnięcie przez niego usunięcia przywraca je do grupy.
- Cofnięcie przez niego wczytania, importu lub wywołania `clear()` wczytuje w każdym edytorze jego własną kopię dokumentu, a ta kopia nie ma żadnej notatki w żadnej grupie.

Dokument zapisany w takim edytorze nie ma żadnej notatki w żadnej grupie, choć edytor od wersji `4.0.0` zachowuje grupy tabel.  
Wszystkie edytory w sesji oraz każdy magazyn [replicationStore](./remote-storage.md#dispatch-dispatchsync), który przechowuje jej dokument, utrzymuj w wersji `5.1.1` lub nowszej, aby notatki pozostawały w swoich grupach tabel; wersja `5.1.0` lub nowsza nadal jest tym, co rozstrzyga edycje wykonane w tej samej chwili. [Serwer MCP](../../mcp/installation.md#updating) sprzed wersji `1.2.1` również nie widzi ani nie zachowuje tego, w jakiej grupie tabel jest notatka.

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
Gdy pakiet zawiera prośbę innego edytora o rejestry, jaką wysyła pierwsze wywołanie [subscribe](#subscribe) dołączającego edytora, magazyn odpowiada przez swoich subskrybentów swoimi rejestrami i swoją wersją, chyba że nie ma żadnych rejestrów.  
Od wersji `5.1.0` najpierw wysyła każdy pakiet strumienia, który jeszcze wstrzymuje, tak jak robi to [flushStreamBuffers](#flushstreambuffers), dzięki czemu każda wersja w jego odpowiedzi opiera się na zapisie, który został już wysłany pozostałym. Przybycie dołączającego edytora sprawia więc, że każdy edytor w sesji wysyła od razu przeciągnięcie, przesunięcie widoku, powiększenie, zmianę koloru lub zmianę rozmiaru notatki, które jeszcze wstrzymuje.

```js
sharedStore.dispatch(actions); // async
sharedStore.dispatchSync(actions); // sync
```

### subscribe {#subscribe}

Subskrybuje zmiany w edytorze.  
Dopóki nie ma co najmniej jednego subskrybenta, nic nie opuszcza edytora, a zmiany wprowadzone wcześniej są buforowane.  
Pierwsze wywołanie subscribe prosi też pozostałe edytory o ich rejestry współpracy, które uzgadniają [równoczesne edycje](#concurrent-edits), więc edytor, który dołącza później, uzgadnia je tak samo.  
Nie dostarcza ono dokumentu, więc taki edytor najpierw [zainicjuj](#seeding-a-collaborator); od wersji `5.1.0` dane inicjujące mogą nieść także rejestry.  
Od wersji `4.0.0` magazyn ponawia tę prośbę za każdym razem, gdy metoda `setInitialValue`, a od wersji `5.1.0` [reseed](#reseed), wczyta dokument do jego edytora po tym pierwszym wywołaniu subscribe.

```js
const unsubscribe = sharedStore.subscribe(actions => {
  // send...
});
```

### flushStreamBuffers {#flushstreambuffers}

Wysyła od razu pakiety strumieni, które ten magazyn jeszcze wstrzymuje, zamiast po upływie ich okresu ciszy.  
Od wersji `3.9.2` działa w magazynie zwróconym przez metodę `getSharedStore`; w wersji `3.9.1` metoda istnieje w typie, ale nic nie robi.  
Przenoszenie tabeli, notatki lub grupy tabel, zmiana ich koloru, zmiana rozmiaru notatki oraz przewijanie lub zmiana powiększenia widoku – każde z nich jest wykonywane jako strumień drobnych zmian. Zmiana rozmiaru grupy tabel przebiega inaczej: jest wysyłana raz, gdy przeciąganie się kończy.  
Magazyn zbiera każdy strumień w jeden pakiet i wstrzymuje go, dopóki strumień nie ucichnie na 200 ms, w dwóch etapach. Zmiana koloru lub zmiana rozmiaru notatki przechodzi oba, więc wychodzi około 400 ms po ostatniej zmianie, tak jak każdy strumień przed wersją `5.1.0`. Od wersji `5.1.0` przeciągnięcie, przesunięcie widoku lub powiększenie wychodzi po pierwszym etapie, około 200 ms po ostatnim kroku, jako miejsce, w którym się kończy (zobacz sekcję [Równoczesne edycje](#concurrent-edits)).  
Wywołanie kończy to oczekiwanie w obu etapach. Gdy magazyn jest połączony, subskrybent otrzymuje pakiet, zanim wywołanie zwróci sterowanie. Wywołanie, gdy nic nie jest wstrzymywane, niczego nie wysyła.  
Metoda `destroy`, czy to magazynu, czy edytora, odrzuca pakiet, który jest jeszcze wstrzymywany, więc najpierw wywołaj opisywaną tu metodę, gdy zwalniasz magazyn, a pozostałe edytory mają zachować ostatnią zmianę, na przykład przy zamykaniu karty.

```js
sharedStore.flushStreamBuffers();
sharedStore.destroy();
```

### getLWW {#getlww}

Od wersji `5.1.0` zwraca kopię rejestrów współpracy edytora (zobacz sekcję [Równoczesne edycje](#concurrent-edits)).  
Kopia powstaje przez JSON, więc jest zwykłym obiektem gotowym do przekazania do `JSON.stringify`, a jej zmiana pozostawia rejestry magazynu bez zmian.  
Przekaż ją bez zmian metodzie [mergeLWW](#mergelww) lub [reseed](#reseed) innego magazynu. Jej strukturę określa sam edytor, więc nie odczytuj żadnego jej pola.  
Odczytaj ją w tej samej chwili co wynik [getVersion](#getversion) i wartość `runtimeValue` edytora, aby [zainicjować dołączający edytor](#seeding-a-collaborator).

```js
const lww = sharedStore.getLWW();
```

### mergeLWW {#mergelww}

Od wersji `5.1.0` przejmuje do rejestrów tego magazynu rejestry, które inny magazyn wydał metodą [getLWW](#getlww), zachowując dla każdego rejestru większą wersję, oraz przejmuje `version` do zegara edytora, który zachowuje większą z własnej wersji i podanej.  
Niczego nie zmienia w dokumencie: nie zmienia ani bajta `value` czy `runtimeValue`, nie tworzy wpisu cofania i nie emituje zdarzenia `change`. Jedynie podnosi wersje, które musi przebić późniejszy zapis, więc zapis starszy niż podane rejestry jest potem odrzucany, a następna zmiana edytora niesie wersję wyższą od `version`.  
Niczego nie wysyła i na nic nie odpowiada. Przejmuje bezpośrednio to, co pierwsze wywołanie subscribe dołączającego edytora dostaje z odpowiedzi pozostałych.  
Wywołaj ją po `setInitialValue`, nigdy przed: każde `setInitialValue` i każde [reseed](#reseed) czyści przechowywane rejestry, a wraz z nimi to, co przejęło wcześniejsze `mergeLWW`.

```js
sharedStore.mergeLWW(lww, version);
```

### getVersion {#getversion}

Od wersji `5.1.0` zwraca najwyższą wersję, którą zegar edytora scalił: największą z wersji zmian, które wykonał lub przejął, próśb o rejestry i odpowiedzi wymienianych przy dołączaniu oraz każdej wartości `version` podanej metodzie `mergeLWW` lub `reseed`.  
Nie przesuwają jej kursory, fokus, zaznaczenia ani ramki przeciągania, własne ani innego edytora.  
Przekaż ją razem z wynikiem [getLWW()](#getlww), odczytanym w tej samej chwili, metodzie [mergeLWW](#mergelww) lub [reseed](#reseed) dołączającego edytora. Jest [wersją](#concurrent-edits) taką jak te, które niosą jego akcje.

```js
const version = sharedStore.getVersion();
```

### forgetPeer {#forgetpeer}

Od wersji `5.1.0` natychmiast usuwa kursor, fokus, zaznaczenie i ramkę przeciągania, które wysłał edytor o podanym identyfikatorze, oraz termin wygaśnięcia, na który każde z nich czekało. Dane wszystkich pozostałych edytorów zostają.  
Identyfikatorem jest `meta.editorId` niesiony przez każdą akcję, którą wysyła współdzielony magazyn tego edytora. Identyfikator, o którym ten edytor nic nie przechowuje, niczego nie zmienia.  
Wywołaj ją, gdy twój transport dowie się, że uczestnik odszedł. W przeciwnym razie to, co wysłał, pozostaje narysowane do wygaśnięcia: jego kursor po 30 sekundach od ostatniego odebranego, jego fokus i zaznaczenie po 90 sekundach, a jego ramka przeciągania po 3 sekundach.

```js
sharedStore.forgetPeer(editorId);
```

### reseed {#reseed}

Od wersji `5.1.0` otwiera ponownie w edytorze dokument sesji, tak jak robi to ponowne dołączenie. Powiązanie [Yjs](./yjs.md) wywołuje ją, aby otworzyć dokument pokoju, gdy wiąże się z pokojem, który został zainicjowany, oraz przy każdym ponownym dołączeniu, zachowując ekran, gdy już dołączyło do pokoju.  
Wczytuje `value` tak jak [setInitialValue](../erd-editor-element.md#setinitialvalue) i przejmuje `lww` oraz `version` tak jak [mergeLWW](#mergelww), więc magazyn zawiera potem dokładnie podane rejestry, a jego zegar – większą z własnej wersji i `version`. Opróżnia też historię cofania i, w przeciwieństwie do `setInitialValue`, czyści zaznaczenie i fokus, ponieważ mogą one wskazywać to, czego wartość już nie zawiera.  
Poza opisanym niżej generowaniem nazwy fizycznej z nazwy logicznej nie tworzy wpisu cofania, nie emituje zdarzenia `change` i niczego nie wysyła. Gdy magazyn miał już subskrybenta, wysyła prośbę o rejestry, którą wysyła każde takie wczytanie i którą transport, jeśli rejestry już przekazał, może odrzucić, oraz, przy włączonej opcji [focusTracker](#focustracker), wyczyszczone zaznaczenie i fokus.  
Tak jak `setInitialValue`, działa przy ustawionej właściwości [readonly](../erd-editor-element.md#readonly), odrzuca widok trybu Przepływ, kończy rysowanie relacji i zamyka edytory notatki, nazwy grupy tabel i komórki, zachowując lub odrzucając wpisany w nich tekst w ten sam sposób; nazwa, którą zamykana komórka nazwy logicznej generuje z tego, co wpisał jej czytelnik, jest zwykłą edycją: wysłaną, możliwą do cofnięcia i emitowaną jako zdarzenie `change`.

Bez `keepScreen` ekran pokazuje to, co zawiera wartość, jak po `setInitialValue`. Przy `keepScreen: true` ekran czytelnika jest nakładany z powrotem na wczytany dokument, tylko na tym ekranie:

- pozycja przewinięcia i poziom powiększenia, o ile element już je pokazał; te, których nigdy nie pokazał albo które wczytano, gdy był ukryty, i od tego czasu nie zostały pokazane, otwierają się tam, gdzie umieszcza je wartość, jak w edytorze dołączającym później;
- karta, gdy wczytanie ją przeniosło, a na karcie Ustawienia także karta, z której czytelnik przyszedł, którą wskazuje blokada `Canvas Type` włączona właśnie tam;
- Widok nazw i każde ustawienie Generatora kodu, które czytelnik pokazywał u siebie przy włączonej blokadzie, ale tylko gdy ta blokada była włączona przed wczytaniem, nadal jest włączona po nim i ma tę samą zablokowaną wartość. Gdy więc uczestnik odblokował ustawienie, zmienił je i zablokował ponownie z inną wartością w międzyczasie, edytor otwiera się na nowej zablokowanej wartości, a tam, gdzie blokada jest wyłączona przed wczytaniem lub po nim, pokazuje wczytaną wartość;
- każde ustawienie, które czytelnik tylko do odczytu zmienił na własnym ekranie, niezależnie od blokad.

Nic z tego nie jest wysyłane, a `value` i `runtimeValue` nadal zwracają wczytany dokument. Późniejsze odblokowanie przez uczestnika zastępuje ustawienie kodu zachowane w ten sposób, jak każde odblokowanie.  
Następne przewinięcie lub powiększenie czytelnika wykonane, gdy edytor może edytować, sprawia, że zachowana pozycja przewinięcia i poziom powiększenia znów należą do dokumentu, i jest wysyłane, zaczynając od miejsca, w którym stoi ekran, więc repliki przejmują też to powiększenie.

Wywołanie `reseed` zostawia to, co magazyn wstrzymuje, bez zmian. Przeciągnięcie, przesunięcie widoku lub powiększenie, które jest wciąż wstrzymywane, wychodzi po nim, odczytane z dokumentu zainicjowanego ponownie; zmiana koloru lub zmiana rozmiaru notatki wychodzi tak, jak została wykonana, chociaż edytor już jej nie pokazuje; a to, co wstrzymało `disconnect()`, wychodzi przy `connection()`.  
Wywołaj więc najpierw [flushStreamBuffers](#flushstreambuffers), wyślij to, co emituje, i wywołaj `reseed` z wartością, która to zawiera. Nigdy nie wywołuj `reseed` w stanie rozłączenia.

```js
sharedStore.reseed(seed.value, {
  lww: seed.lww,
  version: seed.version,
  keepScreen: true,
});
```

### destroy {#destroy}

Całkowicie niszczy instancję sharedStore.  
Sam edytor pozostaje nienaruszony, więc po opuszczeniu sesji dokument nadal można edytować.  
Mechanizmy śledzenia myszy i fokusu przestają działać, gdy zostanie zniszczony ostatni magazyn sharedStore wydany przez edytor.  
Pakiet strumienia, który magazyn jeszcze wstrzymuje, jest odrzucany razem z nim; aby go wysłać, najpierw wywołaj metodę [flushStreamBuffers](#flushstreambuffers).  
Kursory, fokusy, zaznaczenia i ramki przeciągania wysłane przez inne edytory pozostają narysowane do wygaśnięcia; od wersji `5.1.0` [forgetPeer](#forgetpeer) usuwa je dla jednego edytora od razu.

```js
sharedStore.destroy();
```
