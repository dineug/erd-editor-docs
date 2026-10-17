---
sidebar_position: 2
description: Replikowanie działającego edytora do magazynu bez interfejsu, poza wątkiem głównym, i serializowanie dokumentu do zapisu.
---

# Zdalne przechowywanie

Wysyłanie całego stanu edytora przy każdej zmianie jest nieefektywne.  
Z myślą o takich przypadkach edytor udostępnia interfejs API do replikacji danych w czasie rzeczywistym.

## Instalacja {#installation}

```sh
npm install @dineug/erd-editor
```

Magazyn replikacji jest dostępny pod ścieżką podrzędną `@dineug/erd-editor/engine.js`, a nie w głównym module pakietu.  
Ten punkt wejścia nie korzysta z drzewa DOM, więc działa w wątku Web Worker lub w dowolnym innym miejscu poza wątkiem głównym.  
Import głównego modułu pakietu rejestruje natomiast element niestandardowy `<erd-editor>`, który wymaga dokumentu.

## Użycie {#usage}

```ts
type ReplicationStore = {
  readonly value: string;
  readonly runtimeValue: string;
  on: (
    listeners: Partial<{ change: (change: ReplicationChange) => void }>
  ) => Unsubscribe;
  setInitialValue: (value: string) => void;
  dispatch: (actions: Array<AnyAction> | AnyAction) => void;
  dispatchSync: (actions: Array<AnyAction> | AnyAction) => void;
  destroy: () => void;
};

type ReplicationChange = {
  value: string;
  changed: boolean;
};

type InjectEngineContext = {
  toWidth: (text: string) => number;
};

type CreateReplicationStore = (
  context: InjectEngineContext
) => ReplicationStore;

// example
import { createReplicationStore } from '@dineug/erd-editor/engine.js';

const replicationStore = createReplicationStore({
  toWidth: text => text.length * 10,
});
```

## Replikowanie działającego edytora {#replicating-a-live-editor}

Akcje pochodzą ze współdzielonego magazynu działającego edytora.  
Zobacz stronę [Wspólna edycja](./collaborative-editing.md).

```js
import { createReplicationStore } from '@dineug/erd-editor/engine.js';

const replicationStore = createReplicationStore({ toWidth });
replicationStore.setInitialValue(editor.runtimeValue);

replicationStore.on({
  change: ({ value, changed }) => {
    if (changed) save(value);
  },
});

const sharedStore = editor.getSharedStore();
sharedStore.subscribe(actions => {
  replicationStore.dispatch(actions);
});
```

Granicę przekracza tylko zmiana, nigdy cały dokument.  
Replika stosuje ją i serializuje wynik po swojej stronie.  
Zdarzenie `change` przekazuje ten wynik jako `value`, a pole `changed` informuje, kiedy warto go zapisać.

Od wersji `4.0.0` inicjuj replikę na podstawie właściwości `runtimeValue` edytora, tak jak powyżej, a nie na podstawie zapisanego pliku ani właściwości `value` edytora.  
W pliku brakuje zmian wprowadzonych od jego zapisania, a we właściwości `value` – encji usuniętych w trakcie sesji.  
Replika zainicjowana bez usuniętej tabeli przywraca ją bez nazwy ani kolumn, gdy edytor cofnie usunięcie, i w takiej postaci ją zapisuje.

## InjectEngineContext {#injectenginecontext}

### toWidth {#towidth}

Mierzy szerokość ciągu znaków w pikselach.  
Magazyn nie ma drzewa DOM, więc nie może sam mierzyć tekstu, a szerokości kolumn przelicza za pomocą tej funkcji przy każdej zmianie nazwy, typu danych, wartości domyślnej lub komentarza.  
Ponownie mierzy też każdą tabelę i kolumnę za każdym razem, gdy metoda [setInitialValue](#setinitialvalue) wczytuje dokument.  
Od wersji `4.0.0` szerokości są przechowywane tylko we właściwości [runtimeValue](#runtimevalue-getter), nigdy w `value`.  
Dlatego dokument zapisany w tej wersji po ponownym wczytaniu daje bajt w bajt tę samą wartość `value`, niezależnie od tego, gdzie go zapisano i jak mierzono tam tekst.

Mierz tak jak edytor – `400 12px` w stosie czcionek edytora, z zaokrągleniem i dodaniem 2 px dopełnienia.  
W przeciwnym razie szerokości w `runtimeValue` zaczną odbiegać od tych widocznych na ekranie.

```js
const TEXT_PADDING = 2;
const FONT =
  "400 12px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, " +
  "'Helvetica Neue', 'Open Sans', system-ui, sans-serif, " +
  "'Apple Color Emoji', 'Segoe UI Emoji'";

let context = null;

function getContext() {
  if (context) return context;

  try {
    context = new OffscreenCanvas(0, 0).getContext('2d');
    if (context) context.font = FONT;
  } catch {
    // no canvas available
  }

  return context;
}

function toWidth(text) {
  const context = getContext();
  const width = context ? context.measureText(text).width : text.length * 10;

  return Math.round(width) + TEXT_PADDING;
}

const replicationStore = createReplicationStore({ toWidth });
```

Wyrażenie `text.length * 10` jest rozwiązaniem awaryjnym, gdy żadna kanwa nie jest dostępna.  
To wystarczy w przypadku magazynu, którego dokument jest tylko przechowywany, a nigdy renderowany.

## ReplicationStore {#replicationstore}

### value getter {#value-getter}

Serializuje bieżący stan edytora.  
Zwraca ciąg znaków JSON gotowy do zapisania w niezmienionej postaci – a nie sparsowany obiekt.

```js
const data = replicationStore.value;
```

Od wersji `4.0.0` właściwość `value` jest postacią zapisu: to dokument w takiej postaci, w jakiej zawiera go plik, czyli ten sam tekst, który zwraca właściwość [value](../erd-editor-element.md#value) elementu.  
Zawiera tylko nieusunięte encje, w ustalonej kolejności, bez encji usuniętych, kolejności warstw ani niczego, co wczytanie wylicza ponownie, na przykład szerokości mierzonych przez funkcję [toWidth](#towidth).  
Ma wcięcia o szerokości dwóch spacji i kończy się znakiem nowego wiersza, więc ten sam dokument zawsze daje te same bajty.  
Informacje o tym, co zawiera, znajdziesz w sekcji [Postać zapisu i wartość czasu wykonania](./schema.md#storage-form-and-runtime-value).

Każde ustawienie, którego [blokada](../../guide/guides/settings.md#lock) jest włączona, zapisuje się z wartością, przy której zostało zablokowane, a każde inne – z bieżącą wartością.  
Blokada `Viewport` obejmuje łącznie położenie widoku i poziom powiększenia, a karta, język Generatora kodu, oba style nazw i typ cudzysłowu mają własne, osobne blokady.  
Blokady zastępują pole `ignoreSaveSettings` dokumentu, które od wersji `4.0.0` nie jest ani odczytywane, ani zapisywane.  
Przed wersją `4.0.0` właściwość `value` była całym dokumentem w postaci, w jakiej przechowywał go magazyn, z zastosowanymi bitami przewijania i powiększenia z tego pola.

### runtimeValue getter {#runtimevalue-getter}

Od wersji `4.0.0` serializuje dokument w postaci, w jakiej przechowuje go replika, łącznie z usuniętymi encjami i wszystkim, co wylicza wczytanie.  
Każde zablokowane ustawienie także tutaj zapisuje się z zablokowaną wartością.

```js
const snapshot = replicationStore.runtimeValue;
```

Używaj tej wartości do inicjowania edytora lub innego magazynu, który dołącza później, za pomocą jego metody `setInitialValue`; zobacz stronę [Wspólna edycja](./collaborative-editing.md).  
Nigdy nie zapisuj jej jako pliku: zawiera usunięte encje, a opublikowany schemat [JSON Schema](./schema.md#json-schema) ją odrzuca.  
To właśnie dzięki tym usuniętym encjom cofnięcie usunięcia, wysłane później, przywraca encję w całości w magazynie zainicjowanym na podstawie tej wartości.  
Pozostają do czasu, aż dokument zostanie ponownie otwarty z pliku, którego postać ich nie zawiera.

### setInitialValue {#setinitialvalue}

Wczytuje wcześniej zapisany stan edytora.

```js
replicationStore.setInitialValue('json...');
```

Przyjmuje postać zapisu, wartość czasu wykonania lub dokument zapisany przez wcześniejszą wersję, w tym dokument v2.  
Pusty ciąg znaków lub cokolwiek, co nie jest ciągiem znaków, wczytuje nowy, pusty dokument zamiast zgłosić błąd.  
Magazyn, któremu nigdy nie przekazano wartości, zaczyna od takiego samego nowego dokumentu.  
Od wersji `4.0.0` w takim dokumencie każda [blokada](../../guide/guides/settings.md#lock) jest włączona, więc jego właściwość `value` zachowuje widok, kartę, język Generatora kodu, style nazw i typ cudzysłowu, z jakimi zaczynał, gdy edytory, które magazyn replikuje, przewijają widok, zmieniają powiększenie, przełączają karty lub zmieniają te ustawienia. W wersji `3.10.0` nie zapisywał ani przewinięcia, ani powiększenia, a wcześniej zapisywał jedno i drugie.  
Zapisany dokument zachowuje blokady, które wymienia.  
Dokument, który nie wymienia żadnej, czyli każdy dokument zapisany przed wersją `4.0.0`, w tym dokument v2, wczytuje się z włączonymi wszystkimi blokadami: z położeniem widoku `0, 0`, poziomem powiększenia `1` i kartą ERD, niezależnie od tego, co zapisał, oraz z językiem Generatora kodu, stylami nazw i typem cudzysłowu w takiej postaci, w jakiej je zapisał.  
Od wersji `4.0.0` metoda `setInitialValue` usuwa też rejestry współpracy przechowywane dla poprzedniego dokumentu, tak jak metoda [setInitialValue](../erd-editor-element.md#setinitialvalue) elementu.  
Tekst, który nie jest w formacie JSON, na przykład plik pozostawiony ze znacznikami konfliktu scalania, również nie powoduje zgłoszenia błędu: błąd parsowania trafia tylko do konsoli, dokument zostaje opróżniony, a ustawienia pozostają bez zmian.

Od wersji `4.0.0` wczytywanie nie uruchamia odśmiecania, więc usunięte encje pozostają we właściwości [runtimeValue](#runtimevalue-getter).  
Wcześniej usuwało encje, które nie występowały już w polu `doc` i nie były zmieniane od co najmniej czterech dni.

Przeliczenia wykonywane podczas wczytywania są gotowe, zanim metoda `setInitialValue` zwróci sterowanie: oznaczenia kluczy na kolumnach, odczytywane z opcji każdej kolumny i z relacji; szerokość każdej tabeli i kolumny, mierzona ponownie za pomocą `toWidth`; punkty, w których każdy łącznik styka się ze swoimi tabelami; oraz w każdej relacji flaga określająca, czy jest ona identyfikująca, i symbol na końcu przy tabeli nadrzędnej.  
Żadne z nich nie wchodzi w skład `value`, ale wartość `replicationStore.runtimeValue` odczytana zaraz po wywołaniu zawiera już je wszystkie.  
Akcja, która nadejdzie tuż po wczytaniu, na przykład odtworzone przewinięcie, jest porównywana z wczytanym dokumentem, więc samo wczytanie nigdy nie jest zgłaszane jako [`changed`](#onchange).

Ani wczytanie, ani żadne z tych przeliczeń nie emituje zdarzenia `change`.  
Jeśli chcesz ponownie zapisać wczytany dokument w postaci zapisu, sam odczytaj `replicationStore.value`, gdy metoda `setInitialValue` zwróci sterowanie.

### on@change {#onchange}

Subskrybuje zmiany stanu edytora.

```js
const unsubscribe = replicationStore.on({
  change: ({ value, changed }) => {
    if (changed) {
      // save value...
    }
  },
});
```

Zdarzenie `change` jest opóźniane (debounce) o 200 ms, więc seria akcji dociera jako jedno powiadomienie.  
Jest wywoływane tylko dla akcji takiego rodzaju, który może zmienić dokument, a także dla akcji `settings.changeIgnoreSaveSettings`, którą starszy edytor może nadal wysyłać (zobacz sekcję [dispatch, dispatchSync](#dispatch-dispatchsync)).  
Nigdy nie wywołuje go przekazana akcja obecności ani akcja `editor.mergeLWW`.  
Aby anulować subskrypcję, wywołaj zwróconą funkcję.

Od wersji `3.10.0` funkcja nasłuchująca otrzymuje wartość typu `ReplicationChange`, który `@dineug/erd-editor/engine.js` eksportuje obok typu `ReplicationStore`.  
Przed wersją `3.10.0` nie otrzymywała niczego, a funkcja nasłuchująca, która ignoruje argument, nadal działa.  
Pole `value` to zserializowany dokument w postaci zapisu, ten sam ciąg znaków, który w tym momencie zwraca `replicationStore.value`, więc nie trzeba go ponownie serializować.  
Pole `changed` ma wartość `false`, gdy akcje od poprzedniego zdarzenia `change` lub od wczytania pozostawiły `value` bajt w bajt bez zmian.

Zmiana, którą [blokada](../../guide/guides/settings.md#lock) pomija w `value`, nadal wywołuje zdarzenie `change` z polem `changed` ustawionym na `false`, więc zapisuj tylko wtedy, gdy `changed` ma wartość `true`.  
Chodzi o przewinięcie lub zmianę powiększenia przy zablokowanym ustawieniu `Viewport`, przełączenie karty przy zablokowanym ustawieniu `Canvas Type` oraz zmianę języka Generatora kodu, stylu nazw lub typu cudzysłowu przy włączonej blokadzie danego ustawienia.  
Zdarzenie [change](../erd-editor-element.md#change) elementu pomija taką zmianę, ale replika nadal ją zgłasza.  
W nowym dokumencie i w dokumencie zapisanym przed wersją `4.0.0` wszystkie blokady są włączone.  
Gdy ustawienie `Viewport` jest odblokowane, przewinięcie lub zmiana powiększenia zmienia `value`, a gdy odblokowane jest ustawienie `Canvas Type`, to samo dotyczy otwarcia innej karty edytora.  
Włączenie lub wyłączenie blokady również zmienia `value`.

Od wersji `4.0.0` pole `changed` porównuje postać zapisu, która nie zawiera ani usuniętych encji, ani kolejności warstw.  
Dlatego tabela dodana i ponownie usunięta w obrębie jednego zdarzenia `change`, zmiana, która trafia na encję usuniętą przez innego współpracownika, oraz przekazane wczytanie, które zmienia tylko kolejność warstw, również dają pole `changed` ustawione na `false`.

Pole `changed` nigdy nie wynika z porównania z zapisanym plikiem, który już po wczytaniu może różnić się od `value`: tak jest w przypadku pliku zapisanego przez wcześniejszą wersję, w tym pliku v2, a także pliku zaczynającego się od znacznika kolejności bajtów i pliku edytowanego ręcznie.  
Porównanie bajtów z takim plikiem uznałoby za zmianę nawet przewinięcie, które blokada pomija.  
Pierwsze zdarzenie `change` z polem `changed` ustawionym na `true` zwraca taki plik w postaci zapisu, więc zapisanie tej wartości jednorazowo przepisuje plik.  
Plik zapisany w tej wersji nie różni się, niezależnie od tego, gdzie go zapisano, co wyjaśnia sekcja [toWidth](#towidth).  
Jeśli wywołanie `setInitialValue` nastąpi, gdy zdarzenie `change` jeszcze oczekuje, a przed jego terminem nic nie zostanie przekazane, to zdarzenie `change` mimo to nadejdzie z wczytaną wartością `value` i polem `changed` ustawionym na `false`.

### dispatch, dispatchSync {#dispatch-dispatchsync}

Stosuje w magazynie replicationStore zmiany pochodzące ze zdalnego edytora.

```js
replicationStore.dispatch(actions); // async
replicationStore.dispatchSync(actions); // sync
```

Metoda `dispatch` odkłada zastosowanie pakietu do mikrozadania, a `dispatchSync` stosuje pakiet od razu.

Strumień współdzielonego magazynu możesz przekazać bez filtrowania.  
Obie metody zachowują tylko akcje takiego rodzaju, który może zmienić dokument, oraz dwie akcje opisane na końcu tej sekcji, pomijając pozostałe, więc informacje o obecności przesyłane w sesji wspólnej edycji – kursor myszy, fokus, zaznaczenie i ramka przeciągania każdego użytkownika – przechodzą przez nie bez żadnego skutku.

Od wersji `3.10.0` zachowywane akcje obejmują `relationship.changeOnDelete` i `relationship.changeOnUpdate`, a akcja `relationship.add` zawiera pola `onDelete` i `onUpdate`.  
Magazyn z wcześniejszej wersji pomija te akcje i ignoruje te pola, więc traci akcje [ON DELETE i ON UPDATE](../../guide/guides/relationship-editing.md#on-delete-and-on-update) relacji.

Od wersji `4.0.0` zachowywane akcje obejmują też `table.changeGroup`, siedem z ośmiu akcji `tableGroup` (`tableGroup.add`, `tableGroup.move`, `tableGroup.moveTo`, `tableGroup.remove`, `tableGroup.resize`, `tableGroup.changeName` i `tableGroup.changeColor`, czyli wszystkie oprócz zmiany kolejności warstw `tableGroup.changeZIndex`), `relationship.changeColumns`, `settings.changeLockSettings` i `settings.changeDDLScript`.  
Akcja `settings.changeRelationshipOptimization` już nie istnieje, więc obie metody ją pomijają.  
Magazyn z wcześniejszej wersji pomija nowe akcje, więc traci [grupy tabel](../../guide/guides/table-groups.md), [blokady](../../guide/guides/settings.md#lock), skrypty karty [Schemat SQL](../../guide/guides/schema-sql.md) i kolumny, które okno dialogowe [Mapuj kolumny](../../guide/guides/relationship-editing.md#map-columns) przypisuje istniejącej relacji.  
Uruchamiaj replikę w tej samej wersji co edytory lub w nowszej.

Wersja `4.1.0` nie dodaje żadnego typu akcji i pozostawia `@dineug/erd-editor/engine.js` bez zmian, więc replika w wersji `4.0.0` zachowuje każdą zmianę wysyłaną przez edytor w wersji `4.1.0`, tak samo jak replika w wersji `4.1.0`.  
Od wersji `4.1.0` przyciski `Replace` i `Replace All` w funkcji [Znajdź i zamień](../../guide/guides/find-and-replace.md#replacing) zmieniają też nazwy indeksów i grup tabel za pomocą akcji `index.changeName` i `tableGroup.changeName`, które replika w wersji `4.0.0` już zachowuje.  
Własny stan panelu [Eksplorator](../../guide/guides/explorer.md) nigdy nie jest wysyłany, a przełączenie karty lub przewinięcie wywołane przez ten panel dociera tak samo jak każde inne przełączenie karty lub przewinięcie; zobacz stronę [Wspólna edycja](./collaborative-editing.md).

Od wersji `4.0.0` obie metody stosują też akcję `editor.mergeLWW`, która przenosi rejestry współpracy wysyłane przez edytor w odpowiedzi na dołączenie innego edytora do sesji, więc replika uzgadnia równoczesne zmiany tak samo jak edytory.  
Nie zmienia ani jednego bajtu `value` i nie wywołuje zdarzenia `change`.  
Akcja `settings.changeIgnoreSaveSettings`, którą edytor wydany przed wersją `4.0.0` może nadal wysyłać, jest zachowywana, ale niczego nie zmienia: wywołuje zdarzenie `change` z polem `changed` ustawionym na `false`.

### destroy {#destroy}

Całkowicie niszczy instancję replicationStore.

```js
replicationStore.destroy();
```

Następnie magazyn przestaje emitować zdarzenie `change` i ignoruje kolejne przekazywane akcje.  
Dokument pozostaje zamrożony w ostatniej wartości, a błąd nie jest zgłaszany.  
Aby zacząć od nowa, utwórz nowy magazyn.
