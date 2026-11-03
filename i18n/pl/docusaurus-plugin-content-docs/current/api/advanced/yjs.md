---
sidebar_position: 2
description: Synchronizowanie elementu <erd-editor> lub magazynu uczestnika headless przez dokument Yjs za pomocą @dineug/erd-editor-yjs, inicjowanie pokoju, pokazywanie obecności przez Awareness, edytowanie offline oraz składanie historii pokoju przez kompaktor działający obok serwera.
---

# Yjs

`@dineug/erd-editor-yjs` synchronizuje diagramy przez dokument [Yjs](https://github.com/yjs/yjs). To osobny pakiet, wydany po raz pierwszy jako `0.1.0` obok `@dineug/erd-editor` `5.1.0`.  
`bindErdEditor` wiąże element `<erd-editor>`, a `bindPeerStore` magazyn uczestnika headless z `@dineug/erd-editor/peer.js` z dokumentem `Y.Doc`.  
Diagram przenosi każdy dostawca, który przenosi `Y.Doc`: serwer websocket, WebRTC, IndexedDB lub własny. Dostawca i `Y.Doc` pozostają twoje: powiązanie nigdy ich nie łączy, nie rozłącza ani nie niszczy.

Edycje są przesyłane jako pakiety akcji samego edytora, które powiązanie zachowuje w takiej postaci, w jakiej wysłał je magazyn.  
Dlatego rejestry współpracy edytora uzgadniają edycje wykonane w tej samej chwili tak samo jak w sesji połączonej przez `getSharedStore`, z tymi samymi wyjątkami, takimi jak zmiana koloru – zobacz sekcję [Równoczesne edycje](./collaborative-editing.md#concurrent-edits).  
Kursory, fokus, zaznaczenia i ramki przeciągania są przesyłane przez Awareness dostawcy – zobacz sekcję [Obecność](#presence).  
W porównaniu z samodzielnym łączeniem współdzielonego magazynu z transportem powiązanie dodaje:

- Klient, który dołącza, otwiera diagram przechowywany w pokoju, bez przekazywania [runtimeValue](../erd-editor-element.md#runtimevalue) z działającego edytora.
- Klient odcięty od sieci nadal edytuje, a jego edycje trafiają do pokoju po ponownym połączeniu – zobacz sekcję [Edycje offline i ponowne dołączenia](#offline-edits-and-rejoins).
- `Y.Doc` zwrócony przez dostawcę trwałego przechowywania otwiera diagram, który zawiera – zobacz sekcję [Co zawiera pokój](#what-the-room-holds).
- Opcjonalny kompaktor działający w Node obok serwera składa historię pokoju w jedną migawkę – zobacz sekcję [Kompaktowanie pokoju](#compacting-a-room).

Powiązanie potrzebuje pięciu metod, które wersja `5.1.0` dodała do współdzielonego magazynu i magazynu uczestnika – [getLWW](./collaborative-editing.md#getlww), [mergeLWW](./collaborative-editing.md#mergelww), [getVersion](./collaborative-editing.md#getversion), [forgetPeer](./collaborative-editing.md#forgetpeer) i [reseed](./collaborative-editing.md#reseed) – i samo wykonuje wszystkie potrzebne wywołania.

## Instalacja {#installation}

```sh
npm install @dineug/erd-editor-yjs @dineug/erd-editor yjs y-protocols
npm install y-websocket # or another provider
```

`@dineug/erd-editor`, `yjs` i `y-protocols` są zależnościami równorzędnymi (peer dependencies), więc strona zawiera po jednej kopii każdej z nich: `@dineug/erd-editor` w wersji `5.1.0` lub nowszej w ramach `5.x`, `yjs` w wersji `13.6` lub nowszej w ramach `13.x` i `y-protocols` w wersji `1.0` lub nowszej w ramach `1.x`.  
Pakiet pobiera tylko ich typy i działa na przekazanych przez ciebie `Y.Doc` i `Awareness`, więc nie ładuje własnego kodu Yjs, y-protocols ani edytora.  
Dwie kopie Yjs na jednej stronie psują wzajemnie swoje kontrole konstruktorów, a druga loguje `Yjs was already imported`. Gdy twój kod i dostawca rozwiązują `yjs` z dwóch miejsc, zdeduplikuj go w bundlerze (Vite: `resolve.dedupe: ['yjs']`).

Pakiet jest tylko w formacie ESM (`"type": "module"`), ma jeden punkt wejścia, czyli katalog główny pakietu, i jest oznaczony jako wolny od efektów ubocznych, więc bundle importujący tylko `bindErdEditor` pomija kompaktor.  
`bindErdEditor` wymaga DOM, ponieważ wiąże zdefiniowany element `<erd-editor>`. `bindPeerStore` działa też w czystym Node, w Node.js w wersji 22.12 lub nowszej, tak jak [kompaktor działający obok serwera](#compacting-a-room).

## Użycie {#usage}

```ts
function bindErdEditor(
  editor: ErdEditorElement,
  doc: Y.Doc,
  options?: BindOptions
): ErdYjsBinding;
```

```js
import '@dineug/erd-editor/erd-editor.js';

import { bindErdEditor } from '@dineug/erd-editor-yjs';
import { WebsocketProvider } from 'y-websocket';
import * as Y from 'yjs';

const doc = new Y.Doc();
const provider = new WebsocketProvider('wss://yjs.example.com', 'my-diagram', doc);
const editor = document.createElement('erd-editor');
document.body.appendChild(editor);

provider.on('sync', function onSync(synced) {
  if (!synced) return;
  provider.off('sync', onSync);

  const binding = bindErdEditor(editor, doc, {
    awareness: provider.awareness,
    getNickname: () => 'Ada',
  });
  binding.on('error', error => console.error(error));
  binding.on('rejoin', reason => console.info('reopened on the room', reason));
  binding.seed(); // false, and nothing written, once the room holds a diagram
});
```

`wss://yjs.example.com` i `my-diagram` oznaczają twój własny serwer i pokój.  
Wiąż i inicjuj dopiero po zsynchronizowaniu dostawcy, o czym informuje zdarzenie `sync` y-websocket z wartością `true`. Inicjowanie wykonane wcześniej może zastąpić diagram pokoju – zobacz sekcję [Inicjowanie pokoju](#seeding-a-room).

Gdy w chwili wiązania `Y.Doc` zawiera migawkę pokoju, powiązanie od razu otwiera ją w elemencie: wczytuje migawkę wraz z jej rejestrami i wersją, tak jak robi to [reseed](./collaborative-editing.md#reseed), i stosuje każdą edycję zapisaną po niej w dzienniku.  
To otwarcie czyści i zamyka to samo co ponowne dołączenie – zobacz sekcję [Edycje offline i ponowne dołączenia](#offline-edits-and-rejoins) – a element otwiera się tam, gdzie umieszcza go migawka. Przy tym pierwszym otwarciu zdarzenie `rejoin` nie jest emitowane.  
Gdy `Y.Doc` nie zawiera migawki, jak w pustym pokoju lub przed zsynchronizowaniem dostawcy, element zachowuje swój dokument, a powiązanie niczego nie zapisuje w pokoju, dopóki nie pojawi się migawka: jego własna, z [seed](#seed), lub innego klienta.

`bindErdEditor` pobiera z elementu jeden współdzielony magazyn metodą [getSharedStore](../erd-editor-element.md#getsharedstore), a [destroy](#destroy) go zwalnia.  
Element musi już być elementem `<erd-editor>`: jego punkt wejścia musi być zaimportowany albo funkcja `defineErdEditor()` musi być wywołana – zobacz sekcję [Rejestrowanie elementów](../installation.md#registering-the-elements). Dopóki znacznik nie jest zdefiniowany, `<erd-editor>` jest zwykłym `HTMLElement`, który przeglądarka uaktualnia, gdy znacznik zostanie zdefiniowany, a element znajdzie się w dokumencie. Dla elementu, który nie został jeszcze uaktualniony, `bindErdEditor` zgłasza wyjątek `TypeError` zamiast emitować zdarzenie `error`.

Edycje pokoju są stosowane w elemencie i emitują [change](../erd-editor-element.md#change), tak jak edycje współpracownika, w tym edycje odtworzone po otwarciu migawki.  
Otwarcie migawki, przy wiązaniu lub przy ponownym dołączeniu, nie tworzy wpisu cofania, nie emituje `change` i niczego nie zapisuje w pokoju, poza generowaniem nazwy fizycznej z nazwy logicznej opisanym w sekcji [Edycje offline i ponowne dołączenia](#offline-edits-and-rejoins).  
Aby wczytać inny dokument do zainicjowanego pokoju, wprowadź zmianę, którą stosuje każdy klient: przypisz [value](../erd-editor-element.md#value), wywołaj [clear](../erd-editor-element.md#clear) lub zaimportuj dokument.  
[setInitialValue](../erd-editor-element.md#setinitialvalue) nigdy nie jest zapisywane w pokoju, ponieważ współdzielony magazyn go nie wysyła, więc zmienia tylko ten element, a każdy inny klient zachowuje diagram pokoju. Pusty pokój zainicjuj zamiast tego metodą [seed](#seed).

Jeden `Y.Doc` przechowuje jeden diagram. Powiązanie trzyma go pod nazwami `Y.Doc` z prefiksem `erd:` i ustawia pole `erd` lokalnego stanu Awareness, a każdą inną nazwę i pole zostawia w spokoju.  
Daj każdemu powiązanemu elementowi własny `Y.Doc` i własne Awareness, tak jak ma je każdy klient pokoju: dwa powiązania współdzielące jedno Awareness nadpisują nawzajem swoje pole `erd`.

## Inicjowanie pokoju {#seeding-a-room}

Pokój nie zawiera diagramu, dopóki jakiś klient go nie [zainicjuje](#seed).  
To, co edytor zawiera w międzyczasie, trafia do jego własnego inicjowania i ustępuje inicjowaniu innego klienta, gdy to dotrze pierwsze: powiązanie otwiera się wtedy ponownie na nim z `rejoin('snapshot')`, a dokument, który zawierał element, wraz z tym, co w nim edytowano od chwili wiązania, przepada.

Gdy dwaj klienci inicjują pokój jednocześnie, jedno inicjowanie wygrywa u wszystkich klientów.  
Drugi inicjator otwiera się ponownie na zwycięskim z `rejoin('seedLost')` i traci to, co edytował od swojego inicjowania, a tak samo klient, który dołączył do przegranego inicjowania, z `rejoin('snapshot')`. Ich edycje w przegranym inicjowaniu nie docierają do nikogo.  
Inicjowanie wykonane przed zsynchronizowaniem dostawcy liczy się jako wykonane w tej samej chwili co inicjowanie, z którego pochodzi diagram pokoju, więc może je pokonać i zastąpić diagram pokoju.

## BindOptions {#bindoptions}

```ts
import type { Awareness } from 'y-protocols/awareness';

type BindOptions = {
  awareness?: Awareness;
  getNickname?: () => string;
};
```

### awareness {#awareness}

`Awareness` przenoszące kursory, fokus, zaznaczenia i ramki przeciągania, takie jak to należące do dostawcy.  
Dzięki niemu powiązanie włącza mechanizmy śledzenia myszy i fokusu elementu i rysuje w elemencie obecność pozostałych klientów – zobacz sekcję [Obecność](#presence).  
Bez niego synchronizuje się tylko diagram: element nie wysyła kursora, fokusu ani zaznaczenia i nie rysuje tych, które wysyłają inni.

```js
bindErdEditor(editor, doc, { awareness: provider.awareness });
```

### getNickname {#getnickname}

Nazwa, którą inni widzą obok kursora tego edytora.  
Współdzielony magazyn elementu odczytuje ją przy każdym wysyłaniu, tak jak w przypadku [getSharedStore](./collaborative-editing.md#getnickname), a inni użytkownicy widzą `user`, gdy jej brakuje lub jest pusta.

```js
bindErdEditor(editor, doc, {
  awareness: provider.awareness,
  getNickname: () => 'nickname...',
});
```

## ErdYjsBinding {#erdyjsbinding}

```ts
type ErdYjsBinding = {
  seed: (value?: string) => boolean;
  on: <K extends keyof BindingEvents>(
    event: K,
    listener: BindingEvents[K]
  ) => () => void;
  destroy: () => void;
};

type BindingEvents = {
  rejoin: (reason: RejoinReason) => void;
  error: (error: Error) => void;
};

type RejoinReason = 'snapshot' | 'seedLost';
```

`on(event, listener)` zwraca funkcję, która usuwa funkcję nasłuchującą.

### seed {#seed}

Zapisuje pierwszą migawkę pokoju z dokumentu edytora i zwraca `true`.  
Gdy podano `value`, czyli tekst dokumentu w dowolnej postaci, którą odczytuje [setInitialValue](../erd-editor-element.md#setinitialvalue), najpierw wczytuje go do edytora.  
Następnie bez zapisu w dzienniku porzuca przeciągnięcia, zmiany rozmiaru i zmiany kolorów, które edytor wciąż wstrzymuje, żadne z nich nie trafia więc do pokoju po migawce. Bez `value` migawka już je zawiera, ponieważ pobiera dokument edytora; przy `value` należały one do dokumentu, który `value` zastąpiło.  
Potem zapisuje migawkę opisaną w sekcji [Co zawiera pokój](#what-the-room-holds).  
Gdy pokój zawiera już migawkę, zwraca `false` i niczego nie zapisuje, nie wczytując `value`, więc każdy klient może wywołać tę metodę po powiązaniu. Zwraca też `false`, gdy powiązanie zostało zniszczone lub zatrzymane, oraz w powiązaniu [odrzuconym](#onerror) przy wiązaniu.

```js
binding.seed(); // the document the editor holds
// or
binding.seed(await (await fetch('/diagrams/shop.erd.json')).text());
```

### on@rejoin {#onrejoin}

Powiązanie ponownie otworzyło edytor na migawce pokoju, tak jak robi to [reseed](./collaborative-editing.md#reseed); sekcja [Edycje offline i ponowne dołączenia](#offline-edits-and-rejoins) opisuje, co zachowuje, a co traci.  
Przyczynę podaje `reason`:

- `'snapshot'`: migawka zawiera edycje, których powiązanie nie zastosowało, ponieważ było nieobecne, gdy złożył je kompaktor, albo ponieważ kompaktor przywrócił w osobnym złożeniu to, co złożył w migawkę zastąpioną migawką innego kompaktora (zobacz sekcję [Jeden kompaktor na pokój](#one-compactor-per-room)). Jest to też przyczyna, gdy migawka jest pierwszą, która dociera do powiązania pustego pokoju, oraz gdy pochodzi z innego inicjowania, a to powiązanie dołączyło do inicjowania, którego nie zapisało.
- `'seedLost'`: inicjowanie innego klienta wygrało z inicjowaniem zapisanym przez to powiązanie.

```js
binding.on('rejoin', reason => {
  console.info('reopened on the room', reason);
});
```

### on@error {#onerror}

Powiązanie odmówiło wiązania, zatrzymało się lub odrzuciło opcję. Każdy komunikat zaczyna się od `erd-editor-yjs: `.

Przy wiązaniu niczego nie wiąże, gdy:

- edytor lub magazyn uczestnika jest już powiązany z tym `Y.Doc`;
- jego `@dineug/erd-editor` został zbudowany przed wersją `5.1.0`; powiązanie niszczy współdzielony magazyn pobrany z elementu;
- magazyn uczestnika został zniszczony przed powiązaniem;
- pokój zawiera migawkę w układzie, którego ta wersja nie odczytuje (zobacz sekcję [Co zawiera pokój](#what-the-room-holds)).

Takie powiązanie zgłasza zdarzenie `error` w mikrozadaniu, więc funkcja nasłuchująca dodana zaraz po wywołaniu je usłyszy, a zdarzenie `rejoin` nigdy w nim nie wystąpi.

Później powiązanie zatrzymuje się, gdy:

- migawka pokoju zmienia się na układ, którego ta wersja nie odczytuje. Zatrzymuje się wtedy każde powiązanie tej wersji, każdy edytor zachowuje to, co zastosował, a nic, co edytowano później, nie jest zapisywane;
- jego magazyn uczestnika został zniszczony, gdy był powiązany, co wychodzi na jaw przy następnej zmianie pokoju albo przy wywołaniu `seed()` lub `compact()`.

Powiązanie, które się zatrzymuje, zwalnia pobrany współdzielony magazyn oraz parę złożoną ze swojego magazynu i `Y.Doc`, tak jak robi to [destroy](#destroy), i zachowuje swoje funkcje nasłuchujące.

Tylko w `bindPeerStore` poniższe przypadki zgłaszają `error`, a powiązanie działa dalej:

- `compactAfter` nie jest dodatnią liczbą całkowitą: powiązanie składa tylko na żądanie;
- `electionGraceMs` lub `retainMs` nie jest liczbą od 0 do 2 147 483 647 ms: obowiązuje wartość domyślna, ponieważ licznik czasu poza tym zakresem uruchamia się natychmiast;
- obietnica `synced` zostaje odrzucona: powiązanie nigdy nie składa i pozostawia wybór innym kompaktorom (zobacz sekcję [Jeden kompaktor na pokój](#one-compactor-per-room)).

```js
binding.on('error', error => {
  console.error(error.message);
});
```

### destroy {#destroy}

Wysyła do pokoju przeciągnięcia, zmiany rozmiaru i zmiany kolorów, które edytor wciąż wstrzymuje, ustawia pole Awareness `erd` powiązania na `null`, aby pozostali od razu przestali widzieć jego kursor, fokus i zaznaczenie, oraz przestaje obserwować `Y.Doc` i Awareness.  
W przypadku elementu niszczy też pobrany współdzielony magazyn, pozostawiając element i jego dokument bez zmian.  
Drugie wywołanie nic nie robi. Potem to, co edytuje edytor, nie dociera do nikogo.

Magazyn uczestnika, `Y.Doc` i dostawca pozostają twoje i niszczysz je dopiero po zniszczeniu powiązania: magazyn uczestnika zniszczony wcześniej nigdy nie wysyła przeciągnięć, które jeszcze wstrzymywał.  
Metoda [destroy](../erd-editor-element.md#destroy) samego elementu niszczy każdy wydany przez niego współdzielony magazyn, także ten należący do powiązania, i porzuca to, co wstrzymują, więc najpierw zniszcz powiązanie.  
Zniszcz powiązanie, zanim ponownie powiążesz ten sam edytor lub magazyn uczestnika z tym samym `Y.Doc`; powiązanie zatrzymane przez `error` już się zwolniło.

```js
binding.destroy();
editor.destroy();
```

## Obecność {#presence}

Przy użyciu [awareness](#awareness) kursor edytora, tabela lub komórka z fokusem, zaznaczenie i ramka przeciągania są przesyłane w polu `erd` jego lokalnego stanu Awareness, nigdy w `Y.Doc`, więc nie trafiają do historii pokoju, jego migawki ani trwale przechowywanego `Y.Doc`.  
Pozostali rysują je tak, jak rysują obecność współpracownika – zobacz sekcję [focusTracker](./collaborative-editing.md#focustracker) – a klient, który dołącza, rysuje obecność, którą pokój już pokazuje.  
Element ponownie wysyła swój fokus i zaznaczenie co 30 sekund, a ramkę przeciągania co sekundę. Każde z tych ponownych wysłań dociera do pozostałych, nawet gdy powtarza poprzednie, więc to, co użytkownik wciąż trzyma, nigdy nie wygasa.

Klient, który odchodzi, jest zapominany od razu.  
Gdy Awareness porzuca jego stan, jego pole `erd` zmienia się na `null`, jak ustawia to [destroy](#destroy), lub wskazuje inny edytor, powiązanie usuwa z elementu kursor, fokus, zaznaczenie i ramkę przeciągania tego edytora metodą [forgetPeer](./collaborative-editing.md#forgetpeer), zamiast czekać, aż wygasną.  
Zachowuje je, dopóki inny klient wciąż pokazuje ten sam edytor, jak element powiązany ponownie z innym `Y.Doc` pokoju.

## Edycje offline i ponowne dołączenia {#offline-edits-and-rejoins}

Klient odcięty od dostawcy nadal edytuje. Jego edycje czekają w lokalnym `Y.Doc`, nie we współdzielonym magazynie, i docierają do pozostałych, gdy dostawca połączy się ponownie i zsynchronizuje.

Gdy kompaktor złożył edycje, których klient nie zastosował podczas nieobecności, zawiera je migawka, więc po ponownym połączeniu klient otwiera się ponownie na migawce z `rejoin('snapshot')`, po wysłaniu przeciągnięć, zmian rozmiaru i zmian kolorów, które jego edytor wciąż wstrzymywał. Złożenie wyłącznie tego, co klient zastosował, niczego nie otwiera ponownie.  
Ponowne dołączenie do migawki inicjowania, do którego dołączyło powiązanie, odtwarza każdą edycję, której migawka nie zawiera, w tym własne edycje tego klienta wykonane podczas nieobecności, więc żadna nie przepada. Ponowne dołączenie do innego inicjowania niczego nie zachowuje, jak opisuje sekcja [Inicjowanie pokoju](#seeding-a-room).

Każde ponowne dołączenie czyści historię cofania, zaznaczenie i fokus oraz zamyka otwarty widok [trybu Przepływ](../../guide/guides/visualization.md#flow-mode), [rysowanie relacji](../../guide/guides/editing-start.md#relationship-creation) i edytor notatki, nazwy grupy tabel lub komórki, ponieważ mogą wskazywać to, czego migawka już nie zawiera.  
Wpisana, lecz niezatwierdzona nazwa grupy tabel jest porzucana. Zamykana komórka nazwy logicznej generuje nazwę fizyczną z nazwy logicznej, którą wpisał jej czytelnik, o ile ponownie otwarty dokument wciąż ją zawiera, tak jak przy każdym zamknięciu tej komórki. To generowanie jest zwykłą edycją: pokój zapisuje je w dzienniku, a ono tworzy wpis cofania i emituje `change` – zobacz sekcję [reseed](./collaborative-editing.md#reseed).  
Powiązanie, które dołączyło do pokoju, zachowuje to, co widzi jego czytelnik: pozycję przewinięcia, poziom powiększenia i kartę oraz ustawienia zmienione przez czytelnika tylko do odczytu.  
Zachowuje też Widok nazw i ustawienia kodu (język Generatora kodu, style nazw i typ cudzysłowu), które czytelnik pokazał u siebie, o ile [blokada](../../guide/guides/settings.md#lock) każdego z nich była włączona przed ponownym dołączeniem i nadal jest włączona po nim przy tej samej zablokowanej wartości.  
Nic z tego, co zachowuje, nie trafia do `value`, które zwraca ustawienia ponownie otwartego dokumentu – zobacz sekcję [reseed](./collaborative-editing.md#reseed) z `keepScreen`.  
Pozycja przewinięcia i poziom powiększenia elementu niepokazywanego od ostatniego wczytania oraz cały ekran powiązania, które jeszcze nie dołączyło, otwierają się tam, gdzie umieszcza je migawka.  
Magazyn uczestnika nie ma ekranu, więc jego ponowne dołączenie niczego nie zachowuje.

## Edytory tylko do odczytu {#read-only-editors}

Element [tylko do odczytu](../erd-editor-element.md#readonly) powiązany z pokojem niczego nie zapisuje w historii pokoju: jego współdzielony magazyn nie wysyła żadnej zmiany, tylko swoje mechanizmy śledzące i uzgadnianie rejestrów, a pokój [nie zapisuje w dzienniku żadnego z nich](#what-the-room-holds).  
Nadal stosuje każdą edycję, którą niesie pokój, a przy użyciu [awareness](#awareness) kursor, fokus, zaznaczenie i ramka przeciągania jego czytelnika nadal docierają do pozostałych.  
Ustawienia zmieniane przez jego czytelnika pozostają na jego ekranie, jak w każdym edytorze tylko do odczytu.  
[seed](#seed) nie jest odrzucane: element tylko do odczytu inicjuje pusty pokój dokumentem, który zawiera, lub podanym `value`.

## Co zawiera pokój {#what-the-room-holds}

Powiązanie trzyma diagram pod dwiema nazwami `Y.Doc`: `erd:snapshot`, mapą zawierającą migawkę dokumentu, i `erd:log`, tablicą pakietów akcji edytora zapisanych od tej migawki. Dostawca trwałego przechowywania zapisuje oba razem z resztą `Y.Doc`.

Migawka zawiera [runtimeValue](../erd-editor-element.md#runtimevalue) dokumentu, w tym usunięte encje, jego rejestry współpracy i wersję oraz informację, jak daleko edycje każdego autora są w niej złożone. Zapisuje ją inicjowanie, a także każde złożenie kompaktora.  
Każdy wpis dziennika to jeden pakiet w postaci, w jakiej wysłał go edytor, razem z metadanymi, które zawierają identyfikator edytora nadawcy i jego pseudonim.  
Przewinięcia, powiększenia, przełączenia kart, obecność i uzgadnianie rejestrów nigdy nie trafiają do dziennika. Każda inna zmiana wysłana przez edytor trafia, w tym przełączenie Widoku nazw wykonane przy włączonej [blokadzie](../../guide/guides/settings.md#lock), które każdy inny klient odrzuca.  
Język Generatora kodu, styl nazw lub typ cudzysłowu zmienione przy włączonej blokadzie nie są nigdy wysyłane, więc pozostają na ekranie tego edytora i nie docierają do pokoju.

`Y.Doc` zwrócony przez dostawcę trwałego przechowywania otwiera diagram, który zawiera, tak jak powiązanie otwiera każdy `Y.Doc` z migawką – zobacz sekcję [Użycie](#usage).

Migawka nie jest plikiem: jej wartość czasu wykonania zawiera usunięte encje, których plik nie może zawierać.  
Aby zapisać diagram pokoju w pamięci trwałej, zapisuj [value](../erd-editor-element.md#value) powiązanego elementu przy każdym zdarzeniu [change](../erd-editor-element.md#change).  
Zapisz je też raz po powiązaniu, po [seed](#seed) wywołanym z `value` oraz w funkcji nasłuchującej [rejoin](#onrejoin), ponieważ żadne z tych wczytań nie emituje `change`.  
Element [tylko do odczytu](../erd-editor-element.md#readonly) nigdy nie emituje `change`, więc zapisuj z elementu, który nie jest tylko do odczytu, albo odczytuj `value` z powiązanego magazynu uczestnika, który stosuje edycje pokoju na bieżąco.  
Magazynu [replicationStore](./remote-storage.md) nie można powiązać, ponieważ brakuje mu metod potrzebnych powiązaniu, a magazyn zasilany ze współdzielonego magazynu powiązanego elementu pomija edycje pokoju – zobacz sekcję [Replikowanie działającego edytora](./remote-storage.md#replicating-a-live-editor).

Układ jest prywatny i może się zmienić razem z [ERD_YJS_FORMAT](#exports).  
Odczytuj pokój wyłącznie przez powiązanie, a nazwy `erd:` i pole Awareness `erd` pozostaw jemu.

## Kompaktowanie pokoju {#compacting-a-room}

Historia pokoju rośnie z każdą edycją, a każdy klient, który dołącza, odtwarza ją w całości, dopóki coś jej nie złoży.  
`bindPeerStore` wiąże magazyn uczestnika headless z `@dineug/erd-editor/peer.js` i zwraca `ErdYjsPeerBinding`: te same [seed](#seed), [on](#erdyjsbinding) i [destroy](#destroy) oraz [compact](#compact).  
Magazyn uczestnika powiązany w procesie Node obok serwera, czyli kompaktor działający obok serwera, składa historię w migawkę swojego własnego diagramu.  
Powiązanie elementu nigdy nie składa, a magazyn uczestnika powiązany bez `compactAfter` i bez wywołania `compact()` jest zwykłym uczestnikiem headless.

```ts
function bindPeerStore(
  peer: PeerStore,
  doc: Y.Doc,
  options?: PeerBindOptions
): ErdYjsPeerBinding;

type ErdYjsPeerBinding = ErdYjsBinding & {
  compact: () => CompactResult;
};
```

```sh
npm install @dineug/erd-editor-yjs @dineug/erd-editor yjs y-protocols y-websocket ws
```

```js
import { createPeerStore } from '@dineug/erd-editor/peer.js';
import { bindPeerStore } from '@dineug/erd-editor-yjs';
import WebSocket from 'ws';
import { WebsocketProvider } from 'y-websocket';
import * as Y from 'yjs';

const doc = new Y.Doc();
const provider = new WebsocketProvider('wss://yjs.example.com', 'my-diagram', doc, {
  WebSocketPolyfill: WebSocket,
});
const synced = new Promise(resolve => {
  provider.on('sync', function onSync(isSynced) {
    if (!isSynced) return;
    provider.off('sync', onSync);
    resolve();
  });
});

const peer = createPeerStore({ nickname: 'compactor', presence: false });
const binding = bindPeerStore(peer, doc, {
  awareness: provider.awareness,
  compactAfter: 1000,
  synced,
});
binding.on('error', error => console.error(error));

process.on('SIGTERM', () => {
  binding.destroy(); // first, so the peer store's held drags still reach the room
  peer.destroy();
  provider.destroy();
  doc.destroy(); // ends the provider's Awareness timer, so the process can exit
});
```

Magazyn uczestnika pozostaje twój: powiązanie nigdy go nie niszczy. Jego pseudonimem jest ten, który otrzymał `createPeerStore`, a `presence: false` powstrzymuje go przed wysyłaniem własnego fokusu.

Złożenie zapisuje migawkę z własnej wartości czasu wykonania, rejestrów i wersji magazynu uczestnika oraz usuwa wpisy dziennika, które obejmuje, i każdy wpis innego inicjowania, wszystko w jednej transakcji.  
Klienci, którzy zastosowali wszystko, widzą, jak wpisy znikają; klient, który nie zastosował, otwiera się ponownie na migawce (zobacz sekcję [Edycje offline i ponowne dołączenia](#offline-edits-and-rejoins)).  
Każde złożenie przepisuje cały diagram do migawki, więc każde wysyła każdemu klientowi aktualizację o rozmiarze zbliżonym do sumy JSON czasu wykonania diagramu i rejestrów, bez względu na to, jak niewiele wpisów obejmuje. Ustaw `compactAfter` na tyle wysoko, aby wpisy zabierane przez złożenie przeważały nad jedną kopią diagramu.

### PeerBindOptions {#peerbindoptions}

```ts
type PeerBindOptions = CompactOptions & {
  awareness?: Awareness;
};

type CompactOptions = {
  compactAfter?: number;
  synced?: Promise<void>;
  electionGraceMs?: number;
  retainMs?: number;
};
```

| Opcja | Wartość domyślna | Opis |
| --- | --- | --- |
| `awareness` | Brak | Pokazuje magazyn uczestnika w Awareness pokoju, tak jak [awareness](#awareness) robi to dla elementu. Kompaktor, który składa samodzielnie, jest tam oznaczony, więc kompaktory widzące się nawzajem wybierają jeden do składania, a kompaktor niewidzący żadnego innego klienta niczego nie składa samodzielnie – zobacz sekcję [Jeden kompaktor na pokój](#one-compactor-per-room). Bez niej kompaktor składa samodzielnie, bez wyboru i bez okresu karencji. |
| `compactAfter` | Brak | Składa samodzielnie, gdy liczba wpisów dziennika, które zabrałoby złożenie, osiągnie tę wartość. Bez tej opcji lub bez `synced` składa tylko `compact()` oraz złożenie, które przywraca (zobacz sekcję [Jeden kompaktor na pokój](#one-compactor-per-room)). |
| `synced` | Brak | Obietnica, która zostaje spełniona, gdy dostawca się zsynchronizuje. Żadne złożenie nie następuje przed nią, także z `compact()`. Bez niej nic nie jest składane samodzielnie, a `compact()` składa od razu. |
| `electionGraceMs` | `3000` | Przy `awareness` określa, jak długo kompaktor obserwuje pokój, zanim zacznie składać samodzielnie, po `synced` i ponownie za każdym razem, gdy pojawią się inni klienci po okresie, w którym nie było żadnego. |
| `retainMs` | `600000` (dziesięć minut) | Jak długo wpisy złożenia pozostają przechowywane do przywrócenia (zobacz sekcję [Jeden kompaktor na pokój](#one-compactor-per-room)), licząc od pierwszej aktualizacji, którą pokój wysyła po złożeniu. |

Nieprawidłowa opcja lub odrzucona obietnica `synced` zgłasza zdarzenie [error](#onerror).

### compact {#compact}

```ts
type CompactResult =
  | { compacted: true; generation: number }
  | {
      compacted: false;
      reason: 'not-synced' | 'no-snapshot' | 'destroyed';
    };
```

Składa od razu, bez wyboru, okresu karencji ani progu.  
Najpierw przejmuje bieżącą migawkę pokoju, łącznie z ewentualnym ponownym dołączeniem, i wysyła to, co jego magazyn uczestnika wciąż wstrzymuje.  
Odpowiada `{ compacted: true, generation }`, gdzie `generation` liczy złożenia migawki: `0` dla inicjowania, o jeden więcej przy każdym złożeniu.  
W przeciwnym razie odpowiada `{ compacted: false, reason }`:

- `'destroyed'`, gdy powiązanie zostało zniszczone lub zatrzymane, oraz w powiązaniu [odrzuconym](#onerror) przy wiązaniu, nawet przed spełnieniem `synced`;
- `'not-synced'` przed spełnieniem `synced`;
- `'no-snapshot'` w pokoju, którego żaden klient nie zainicjował.

```js
const result = binding.compact();
if (!result.compacted) console.warn(result.reason);
```

## Jeden kompaktor na pokój {#one-compactor-per-room}

Uruchom dokładnie jeden kompaktor na pokój i nowy uruchom dopiero wtedy, gdy stary się zatrzyma. Nic tego nie wymusza.  
Spośród kompaktorów widzących się nawzajem w Awareness samodzielnie składa tylko ten z najmniejszym identyfikatorem klienta Yjs, a gdy odchodzi lub jego obietnica `synced` zostaje odrzucona, następny przejmuje to od razu.  
Kompaktor, którego Awareness nie pokazuje żadnego innego klienta, jak wtedy, gdy zamknięcie jego własnego gniazda usuwa ich wszystkich, niczego nie składa samodzielnie, dopóki inni nie pojawią się ponownie, a on nie poobserwuje pokoju przez `electionGraceMs`.

Dwa kompaktory odcięte od siebie lub ponowne uruchomienie, którego poprzednik wciąż działa, mogą mimo to składać niezależnie od siebie.  
Pokój zachowuje wtedy jedną z dwóch migawek, a kompaktor, którego migawka przegrała, przywraca to, co złożył, a czego zwycięzca nie zawiera, dopóki to przechowuje: przez `retainMs` i najwyżej ostatnie 1000 wpisów, bez względu na ich rozmiar.  
Dlatego nic nie przepada, gdy kompaktorem, którego migawka przegrywa, jest ten, który się łączy ponownie, o ile podczas rozłączenia złożył nie więcej niż 1000 wpisów.  
Gdy jest nim ten, który pozostał online, a jego przechowywanie wygasło, migawce i historii pokoju brakuje tego, co złożył, dopóki nie złoży ponownie. Klient, który ominął te edycje, albo ten, który w międzyczasie dołącza, ich nie ma i wstrzymuje późniejsze edycje każdego autora, którego edycje kompaktor złożył. Następne złożenie kompaktora przywraca je wszystkie, chyba że zwycięska migawka zawierała edycje, których mu brakowało, co otwiera go ponownie na tej migawce, a to, co złożył, przepada bezpowrotnie.

Kompaktor przywraca w osobnym złożeniu, wykonanym po dogonieniu zwycięskiej migawki, bez wyboru, okresu karencji ani progu, a każdy klient otwiera się ponownie na tym złożeniu z `rejoin('snapshot')`.  
Przywrócone edycje nie docierają do żadnego klienta poza tym złożeniem, więc klient online przez cały czas kończy tak samo jak pozostali i jak ten, który dołącza później, nawet gdy późniejsza edycja innego autora opiera się na jednej z nich, jak zmiana nazwy tabeli dodanej przez innego klienta.  
Każde przywrócenie kosztuje każdego klienta to ponowne dołączenie, wraz z [tym, co ono traci](#offline-edits-and-rejoins). Gdy dwa kompaktory przywracają jednocześnie, każdy klient nadal kończy tak samo, choć edycja może pozostać zastosowana przed tą, na której się opiera.  
Powiązanie zniszczone lub zatrzymane przed wykonaniem tego złożenia, jak wtedy, gdy niszczy je funkcja nasłuchująca `rejoin`, przywraca zamiast tego same edycje. Żadna nie przepada, ale wtedy klient online przez cały czas może zastosować jedną po edycji innego autora, która się na niej opiera, i zakończyć inaczej niż klient dołączający później.

## Ograniczenia {#limits}

- **Obszar widoku pozostaje na każdym ekranie.** Przewinięcia, powiększenia i przełączenia kart [nigdy nie trafiają do dziennika](#what-the-room-holds), choć sesja połączona przez `getSharedStore` je wysyła (tam też nie przesuwają widoku ani karty żadnego innego użytkownika). Każdy czytelnik zachowuje własny obszar widoku, a powiązanie pokazuje go tylko w swoim stanie Awareness, którego na razie nic nie odczytuje. Gdy [blokada](../../guide/guides/settings.md#lock) `Viewport` lub `Canvas Type` jest wyłączona, `value` każdego klienta zapisuje jego własne ustawienie; przy włączonych blokadach, a nowy dokument ma je włączone, każdy klient zapisuje zablokowaną wartość.
- **Migawka rośnie o jeden wpis na powiązanie.** Zachowuje dla każdego powiązania, które kiedykolwiek zapisywało w pokoju, jak daleko jego edycje są złożone, i nigdy żadnego nie usuwa. Powiązanie utworzone ponownie lub takie, które przeszło do innego inicjowania, liczy się od nowa, tak samo każde złożenie, które przywraca. Wpis to 32-znakowy identyfikator i liczba, więc dziesięć tysięcy sesji zapisujących dodaje kilkaset kilobajtów do każdej migawki i każdego złożenia.
- **Hub i pokój niczego sobie nie przekazują.** Element powiązany z pokojem i z [hubem](../../mcp/live-and-headless.md#live) agenta kodującego lub z dowolnym innym transportem przez `getSharedStore()` stosuje edycje obu, ale żaden nie słyszy edycji drugiego, ponieważ współdzielony magazyn nigdy nie przekazuje dalej tego, co otrzymał.
- **Elementy dodane jednocześnie mogą mieć różną kolejność.** Tabele lub notatki dodane jednocześnie przez dwóch klientów mogą stać w innej kolejności w diagramie każdego klienta, jak w sesji połączonej przez `getSharedStore` – zobacz sekcję [Równoczesne edycje](./collaborative-editing.md#concurrent-edits).
- **Kolory i kilka innych zmian wykonanych jednocześnie mogą skończyć inaczej.** Zmiana koloru jest zapisywana w dzienniku bez wersji, a każdy klient oznacza ją własną wersją, gdy ją stosuje. Dwie zmiany koloru jednej tabeli, notatki lub grupy tabel wykonane jednocześnie mogą więc pozostawić klientów, a także klienta dołączającego później i odtwarzającego dziennik, z różnymi kolorami. To samo może spotkać inne zmiany, które każdy klient stosuje w kolejności, w jakiej je usłyszy, takie jak dwa przeniesienia kolumn w jednej tabeli lub indeksie albo dwie zmiany bazy danych – zobacz sekcję [Równoczesne edycje](./collaborative-editing.md#concurrent-edits).
- **Odchodzący kursor czeka na serwer.** Powiązanie czyści kursor uczestnika, gdy tylko Awareness go porzuci. Serwer, który po zamknięciu gniazda usuwa tylko te stany Awareness, które to gniazdo dodało jako pierwsze, zostawia na ekranach pozostałych klienta, który połączył się ponownie, po jego odejściu, dopóki Awareness go nie wygasi, 30 sekund później. Serwer, który usuwa każdy stan, który jako ostatnie zapisało to gniazdo, czy to aktualizacją, czy dodaniem, czyści go od razu.

## Eksporty {#exports}

| Eksport | Opis |
| --- | --- |
| `bindErdEditor(editor, doc, options?)` | Wiąże element `<erd-editor>` – zobacz sekcję [Użycie](#usage). Zwraca [ErdYjsBinding](#erdyjsbinding). |
| `bindPeerStore(peer, doc, options?)` | Wiąże magazyn uczestnika z `@dineug/erd-editor/peer.js` – zobacz sekcję [Kompaktowanie pokoju](#compacting-a-room). Zwraca to samo z [compact](#compact) (`ErdYjsPeerBinding`). |
| `ERD_YJS_FORMAT` | Układ `Y.Doc` zapisywany przez tę wersję, `1`; powiązanie odrzuca pokój zapisany w innym. |

Typy: `BindOptions`, `PeerBindOptions`, `CompactOptions`, `CompactResult`, `BindingEvents`, `RejoinReason`, `ErdYjsBinding`, `ErdYjsPeerBinding`.
