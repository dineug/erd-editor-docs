---
sidebar_position: 3
description: Interfejs API elementu erd-viewer – diagram tylko do odczytu z value lub adresu URL src, jego minimapa i pasek kontrolek, zdarzenia load i error, motywy, język wyświetlania, fokus i klawisze, ładowanie oraz to, co element dodaje do strony.
---

# ErdViewerElement

Od wersji `5.0.0` pakiet zawiera też element `<erd-viewer>`, widok dokumentu tylko do odczytu: czytelnik przesuwa widok, powiększa, wyszukuje i podświetla relacje, a nic w nim nie edytuje. Rysuje wyłącznie kanwę ERD, z jej paskami przewijania, [minimapą](#minimap), [paskiem kontrolek](#controls) i paletą przeszukującą dokument, a nie ma paska narzędzi, kart, Eksploratora ani menu kontekstowego.

```js
import '@dineug/erd-editor/erd-viewer.js';
```

```html
<erd-viewer src="/diagrams/shop.erd.json" style="display: block; height: 480px"></erd-viewer>
```

<iframe src="https://erd-editor.io/embed?src=https%3A%2F%2Fgithub.com%2Fdineug%2Ferd-editor%2Fblob%2Fmain%2Fdata%2Fbookstore.erd.json" width="100%" height="480" style={{ border: 0 }} loading="lazy" title="ERD Editor"></iframe>

Ramka powyżej to ten element w postaci, w jakiej pokazuje go erd-editor.io/embed, tutaj z przykładem księgarni: kliknij ją, aby nadać jej fokus, a potem powiększaj i wyszukuj klawiszami opisanymi w sekcji [Fokus i klawisze](#focus-and-keys); o osadzaniu własnego dokumentu bez kodu przeczytasz na stronie [Osadzanie](../guide/guides/embedding.md).

Przeglądarka jest zwykłym elementem `HTMLElement`.  
Jej definicja typu wygląda następująco.

```ts
interface ErdViewerElement extends HTMLElement {
  src: string;
  nameView: 'physical' | 'logical' | 'both' | null;
  minimap: boolean;
  controls: boolean;
  value: string;
  setPresetTheme: (themeOptions: Partial<ThemeOptions>) => void;
  setSystemAppearance: (appearance: 'dark' | 'light' | null) => void;
  setTheme: (theme: Partial<Theme>) => void;
  setLocale: (locale: LocaleOption) => Promise<void>;
  setSystemLocale: (locale: string | null) => Promise<void>;
  destroy: () => void;
}
```

Import `@dineug/erd-editor/erd-viewer.js` definiuje `<erd-viewer>` i pozostawia `<erd-editor>` niezdefiniowany. Import głównego modułu pakietu nie definiuje żadnego z nich: eksportuje klasę `ErdViewerElement` i `defineErdViewer()`, które definiuje znacznik tam, gdzie je wywołasz, więc strona może też zdefiniować klasę pod własnym znacznikiem – zobacz sekcję [Rejestrowanie elementów](./installation.md#registering-the-elements).  
Każdy punkt wejścia poza `engine.js` i `peer.js` wymaga drzewa DOM, ten również, więc strona renderowana po stronie serwera importuje go po stronie klienta – zobacz sekcję [Renderowanie po stronie serwera](./installation.md#server-side-rendering).  
Import punktu wejścia dodaje `erd-viewer` do `HTMLElementTagNameMap`, więc `document.createElement('erd-viewer')` i `document.querySelector('erd-viewer')` mają typ `ErdViewerElement` bez rzutowania.

Podobnie jak edytor, przeglądarka renderuje się w zamkniętym shadow root, więc `viewer.shadowRoot` ma wartość `null`, a style strony nie przedostają się do środka ani na zewnątrz; stylizuj ją za pomocą [setTheme](#settheme) i właściwości niestandardowych `--erd-editor-*`. Kilka przeglądarek na jednej stronie zachowuje każda własny dokument, widok, motyw i język.  
Element `<erd-viewer>` nie ma własnego rozmiaru. Element niestandardowy jest domyślnie liniowy, więc nadaj mu `display: block` i wysokość, jak powyżej. Widok wypełnia pole elementu i podąża za jego zmianą rozmiaru, zachowując powiększenie.

`src`, `name-view`, `minimap` i `controls` to jedyne jego atrybuty, każdy z właściwością o tej samej nazwie, `nameView` dla `name-view`. [value](#value) jest wyłącznie właściwością.  
Wartości `value`, `src`, `nameView`, `minimap` lub `controls` ustawione na elemencie, zanim jego znacznik zostanie zdefiniowany, na przykład przez framework, który renderuje element, zanim punkt wejścia się załaduje, są przejmowane po zdefiniowaniu znacznika, ponad atrybutami nadanymi przez znaczniki. Są przejmowane w kolejności, w jakiej strona zapisała każdą z nich po raz pierwszy, więc wygrywa późniejsza z wartości `value` i `src`. Wartość `value`, która nie zawiera dokumentu, nie ma wtedy już wywołującego, któremu mogłaby zgłosić błąd: jest zgłaszana jako nieprzechwycony błąd, a przeglądarka pozostaje pusta.

Kompilacja dla znacznika script, `dist/erd-viewer.umd.js`, zawiera samą przeglądarkę ze wszystkimi zależnościami. Definiuje `<erd-viewer>` i umieszcza `ErdViewerElement` oraz `defineErdViewer` w obiekcie `window.ErdViewer`. Adres URL CDN bez ścieżki udostępnia zamiast niej kompilację edytora, więc podaj nazwę pliku – zobacz sekcję [Znacznik script](./installation.md#script-tag).

```html
<erd-viewer src="diagram.erd.json" style="display: block; height: 480px"></erd-viewer>
<script src="https://cdn.jsdelivr.net/npm/@dineug/erd-editor@5.0.0/dist/erd-viewer.umd.js"></script>
```

## src {#src}

Adres URL dokumentu, który przeglądarka ma pobrać i pokazać. Domyślnie jest to `''`, czyli brak.  
Pobranie to zwykłe `fetch()`, żądanie `GET` bez własnych opcji, więc podlegają mu reguły CORS przeglądarki: dokument z innego źródła wymaga serwera, który zezwala na źródło strony, a ciasteczka trafiają tylko do własnego źródła strony. Adres względny jest rozwiązywany względem strony.  
Odpowiedź musi zawierać dokument w takiej postaci, jaką ma plik `.erd.json`, czyli w postaci zapisu, którą zapisują [value](./erd-editor-element.md#value) edytora i każdy oficjalny host. Żaden inny format nie jest odczytywany: plik SQL, GraphQL, DBML lub AML kończy się błędem jako tekst, którego nie da się sparsować.  
Dokument, który da się sparsować, ląduje dopasowany do widoku i emituje [load](#load). Żądanie odrzucone przez sieć lub CORS, odpowiedź bez statusu `ok` albo tekst, którego nie da się sparsować, emituje [error](#error) i pozostawia pusty diagram – zobacz sekcję [Ładowanie](#loading).

Liczy się tylko ostatnie żądanie. Nowy `src` przerywa trwające pobieranie, więc wolna odpowiedź nigdy nie wyląduje nad późniejszym dokumentem. Przerywa je także przypisanie [value](#value), a także usunięcie `src` lub ustawienie go na `''`, co przestaje go śledzić i pozostawia pokazany dokument bez zmian.  
Wygrywa ostatnio ustawiony z `value` i `src`, zarówno przez właściwość, jak i przez atrybut. Wartość `src` zapisana po `value` jest pobierana nawet wtedy, gdy wskazuje adres pobrany wcześniej. Zapisana ponownie nad dokumentem, który już pokazuje, nic nie pobiera.  
Przeglądarka pobiera dane tylko wtedy, gdy jest na stronie. Wyjęcie jej przerywa trwające pobieranie, a ponowne wstawienie pobiera `src`, którego jeszcze nie pokazała, także taki, który zawiódł, a nigdy taki, który już pokazuje.  
Parametr `src` to jedyne `fetch()` wykonywane przez pakiet, więc restrykcyjna polityka Content Security Policy wymienia źródło dokumentu w `connect-src`.

```js
viewer.src = 'https://example.com/diagrams/shop.erd.json';
// or
viewer.setAttribute('src', 'https://example.com/diagrams/shop.erd.json');
```

```html
<erd-viewer src="https://example.com/diagrams/shop.erd.json"></erd-viewer>
```

## value {#value}

### getter {#getter}

Pobiera pokazywany dokument, niezależnie od tego, czy pochodzi z `src`, czy z `value`, jako ciąg JSON w postaci zapisu, którą zapisuje [value](./erd-editor-element.md#value) edytora. Zanim cokolwiek zostanie pokazane, jest to nowy, pusty dokument, którego `doc` to `{}`.  
Dopóki [blokada](../guide/guides/settings.md#lock) `Viewport` dokumentu jest włączona, jak w nowym dokumencie, zapisuje powiększenie i przewinięcie, przy których dokument jest zablokowany, niezależnie od tego, gdzie czytelnik przesunął widok. Tylko przy wyłączonej blokadzie zapisuje miejsce, w którym widok się znajduje, łącznie z dopasowaniem, które wykonuje lądowanie.  
Zapisuje Widok nazw, który zawiera dokument, nigdy ten, który pokazuje nad nim [nameView](#nameview) lub pasek kontrolek, nawet w dokumencie z wyłączoną blokadą `Name View`.  
Nadal zwraca dokument po [destroy](#destroy).

```js
const data = viewer.value;
```

### setter {#setter}

Pokazuje dokument z jego tekstu, zastępując pokazywany, i dopasowuje go do widoku – zobacz sekcję [Ładowanie](#loading). Przyjmuje tekst, który zawiera plik lub `value` edytora.  
Tekst, którego nie da się sparsować, zgłasza błąd, zanim cokolwiek się zmieni, a pokazywany dokument pozostaje: `SyntaxError` dla tekstu niebędącego JSON-em, `TypeError` dla JSON-a, który nie zawiera dokumentu, takiego jak `7`. Pusty ciąg lub cokolwiek, co nie jest ciągiem znaków, pokazuje pusty diagram.  
Przypisanie przerywa trwające pobieranie `src` i nie emituje ani `load`, ani `error`.

```js
viewer.value = localStorage.getItem('my-diagram') ?? '';
```

## nameView {#nameview}

Pokazuje diagram w [Widoku nazw](../guide/guides/logical-names.md#name-view) ponad tym, który zawiera dokument: `'physical'` dla `Physical Names`, `'logical'` dla `Logical Names` lub `'both'` dla `Both Names`. Wartość `null`, domyślna, pokazuje widok własny dokumentu, a wartość atrybutu inna niż te trzy jest odczytywana jako `null`.  
Obowiązuje nad każdym dokumentem wczytanym po niej, a [value](#value) nigdy jej nie zapisuje. Usunięcie atrybutu przywraca widok własny dokumentu.  
Lista `Name View` na [pasku kontrolek](#controls) też przełącza widok, do czasu wylądowania następnego dokumentu lub następnej zmiany `nameView`. Przełączenie tam również nie jest zapisywane w `value`.

```js
viewer.nameView = 'both';
// or
viewer.setAttribute('name-view', 'both');
```

```html
<erd-viewer name-view="logical"></erd-viewer>
```

## minimap {#minimap}

Pokazuje minimapę w prawym górnym rogu, dopóki dokument zawiera tabelę, pokazywaną notatkę lub pokazywaną grupę tabel. Domyślnie jest włączona.  
Działa jak minimapa edytora: kliknij ją, aby przenieść tam widok, lub przeciągnij jej prostokąt widoku, aby go przesunąć – zobacz sekcję [Poruszanie się po kanwie](../guide/guides/table-related-functions.md#getting-around-the-canvas). Palec na niej należy do strony, dopóki przeglądarka nie ma fokusu.  
Wyłącza ją tylko `minimap="false"`. Sam atrybut, każda inna wartość i brak atrybutu pozostawiają ją włączoną.

```js
viewer.minimap = false;
// or
viewer.setAttribute('minimap', 'false');
```

```html
<erd-viewer minimap="false"></erd-viewer>
```

## controls {#controls}

Pokazuje pasek kontrolek pośrodku dolnej krawędzi kanwy. Domyślnie jest włączony i zawiera, od lewej do prawej:

- Powiększenie: `Zoom out`, bieżące powiększenie w procentach i `Zoom in`. Oba przyciski zmieniają powiększenie o krok tak jak klawisze powiększenia, a kliknięcie wartości procentowej, `Reset zoom`, przywraca `100%`. Każdy podaje swój klawisz w podpowiedzi.
- `Fit`, który powiększa i przewija tak, aby cały diagram był widoczny w widoku, wyśrodkowany.
- `Name View`, przycisk, który podaje obowiązujący widok i otwiera nad paskiem listę `Physical Names`, `Logical Names` i `Both Names` – zobacz sekcję [nameView](#nameview).
- Kompas `Go to content`, który dołącza na końcu paska tylko wtedy, gdy żadna część diagramu nie jest na ekranie, i przenosi widok do najbliższej jego części.

Pasek układa się od lewej do prawej w każdym języku.  
Wyłącza go tylko `controls="false"`, razem z jego kompasem i listą `Name View`. Sam atrybut, każda inna wartość i brak atrybutu pozostawiają go włączonym. Bez paska kółko, szczypnięcie i klawisze nadal powiększają widok, gdy przeglądarka ma fokus.

```js
viewer.controls = false;
// or
viewer.setAttribute('controls', 'false');
```

```html
<erd-viewer controls="false"></erd-viewer>
```

## Zdarzenia {#event}

Zdarzenia `load` i `error` są jedynymi dwoma i oba dotyczą `src`. Żadne z nich nie jest propagowane w górę, więc nasłuchuj na samym elemencie.

### load {#load}

Emitowane, gdy dokument wskazany przez `src` został pobrany i pokazany. Wartość `event.detail` to `null`.  
Przypisanie `value` nie emituje żadnego, podobnie jak pobranie, które przerwał późniejszy `src`, `value`, wyjęcie elementu ze strony lub [destroy](#destroy).

```js
viewer.addEventListener('load', () => {
  console.log('shown', viewer.src);
});
```

### error {#error}

Emitowane, gdy pobranie `src` zawiedzie: sieć lub CORS odrzuciły żądanie, odpowiedź nie miała statusu `ok` albo jej tekstu nie dało się sparsować. Przeglądarka pokazuje wtedy pusty diagram i komunikat `Couldn't load the diagram` – zobacz sekcję [Ładowanie](#loading).  
Wartość `event.detail` to przyczyna: `TypeError`, którym `fetch()` jest odrzucane, `Error` z nazwanym statusem, na przykład `GET /missing.erd.json answered 404 Not Found`, albo `SyntaxError` lub `TypeError` parsera.  
Pobranie, które coś przerwało, nie emituje niczego.

```js
viewer.addEventListener('error', event => {
  console.warn('could not show', viewer.src, event.detail);
});
```

## setPresetTheme {#setpresettheme}

Ustawia motyw predefiniowany, przyjmując obiekt `ThemeOptions` edytora – zobacz sekcję [setPresetTheme](./erd-editor-element.md#setpresettheme).  
Przeglądarka startuje z `appearance: 'system'`, `grayColor: 'slate'` i `accentColor: 'indigo'`, więc od pierwszej klatki pokazuje jasny lub ciemny wygląd zgłaszany przez system operacyjny i przełącza się, gdy ten się zmieni. Edytor startuje natomiast jako ciemny.  
Każde pole jest stosowane osobno, więc częściowe wywołanie pozostawia dwa pozostałe bez zmian. Wartość, która nie jest jedną z nazw, jest ignorowana, a wywołanie nigdy nie zgłasza błędu.  
Przeglądarka nie ma kreatora motywu ani `systemDarkMode` i nie emituje żadnego zdarzenia dla motywu.

```js
viewer.setPresetTheme({ appearance: 'light', accentColor: 'teal' });
```

## setSystemAppearance {#setsystemappearance}

Nazywa jasny lub ciemny wygląd, który pokazuje wygląd `'system'`, dla strony z własnym jasnym i ciemnym wyglądem. Gdy jeden jest nazwany, zmiany systemu operacyjnego są ignorowane.  
Wartość `null` lub każda inna niż `'dark'` albo `'light'` wraca do śledzenia systemu operacyjnego.  
Gdy wygląd to `'light'` lub `'dark'`, nic nie zmienia na ekranie, ale wartość jest zachowywana i obowiązuje, gdy tylko wygląd stanie się `'system'`. Nic nie emituje.

```js
viewer.setSystemAppearance('dark'); // null follows the OS again
```

## setTheme {#settheme}

Nadpisuje tokeny motywu na wierzchu motywu predefiniowanego, przyjmując tokeny `Theme` edytora – zobacz sekcję [setTheme](./erd-editor-element.md#settheme).  
Każde wywołanie zastępuje całą nakładkę, więc przekaż `{}`, aby wrócić do motywu predefiniowanego. Zachowywane są tylko nazwy tokenów z wartościami tekstowymi, a późniejsze `setPresetTheme` podmienia motyw predefiniowany pod spodem, podczas gdy nadpisania pozostają.  
Właściwości niestandardowe CSS `--erd-editor-*` również docierają do przeglądarki, ustawione na elemencie lub gdziekolwiek nad nim – zobacz sekcję [Zmienne CSS](./erd-editor-element.md#css-variables). Kanwa, do której nie sięga żaden arkusz stylów, czyta je ponownie, gdy zmieni się arkusz stylów w `head` strony albo atrybut `class` lub `style` elementu albo elementu nad nim. Reguła dodana przez `insertRule()` nie zmienia żadnego z nich, więc kanwa uwzględnia ją przy następnej takiej zmianie.

```css
erd-viewer {
  --erd-editor-canvas-background: #ffffff;
}
```

## setLocale {#setlocale}

Ustawia język wyświetlania: `'system'`, domyślny, albo jeden z 25 kodów wymienionych w sekcji [Język wyświetlania](./erd-editor-element.md#display-language) edytora. Wszystko inne, na przykład sam `'ko'` albo wartość niebędąca ciągiem znaków, jest ignorowane.  
Język zmienia podpowiedzi paska kontrolek, listę `Name View`, paletę, komunikaty o ładowaniu oraz słowa, które diagram rysuje sam, takie jak `unnamed`. Nazwy, komentarze i reszta dokumentu nigdy nie są tłumaczone.

Angielski jest częścią punktu wejścia przeglądarki i obowiązuje, zanim wywołanie zwróci. Każdy inny język jest osobnym modułem, który Twój bundler generuje jako chunk obok przeglądarki, a przeglądarka pobiera go z Twojego pakietu przy pierwszej prośbie strony o ten język, raz dla wszystkich przeglądarek strony. Dopóki nie wyląduje, przeglądarka pokazuje dotychczasowy język, w pierwszej klatce angielski. Jeśli jego ładowanie zawiedzie, przeglądarka pokazuje angielski, a ponowna prośba o ten język próbuje jeszcze raz.  
Kompilacja dla [znacznika script](./installation.md#script-tag) zawiera wszystkie 25 języków, więc żadnego nie pobiera. Pakiet, który zawiera też edytor, ładuje każdy język razem z chunkiem edytora – zobacz sekcję [Rejestrowanie elementów](./installation.md#registering-the-elements).  
Zwracany obiekt `Promise` jest rozstrzygany, gdy ten język wylądował lub nie udało się go załadować, i nigdy nie jest odrzucany. Ten język, albo angielski po niepowodzeniu, obowiązuje wtedy, chyba że późniejsze wywołanie poprosiło o inny: wygrywa późniejsze wywołanie, niezależnie od kolejności lądowania języków.

Hebrajski, arabski i perski układają paletę i komunikaty o ładowaniu od prawej do lewej. Kanwa, minimapa, paski przewijania oraz pasek kontrolek z kompasem pozostają ułożone od lewej do prawej, tak jak kanwa edytora – zobacz sekcję [Języki pisane od prawej do lewej](../guide/guides/language-and-theme.md#right-to-left-languages).  
Przeglądarka ustawia `lang` i `dir` na własnym korzeniu wewnątrz zamkniętego shadow root, nigdy na elemencie hosta ani na stronie.  
Nic nie emituje, a przeglądarka nie ma selektora języka i niczego nie przechowuje.

```js
await viewer.setLocale('ko-KR');
```

## setSystemLocale {#setsystemlocale}

Nazywa język, który oznacza `'system'`, jako znacznik BCP 47, dla strony z własnym ustawieniem języka.  
Znacznik jest przycinany z białych znaków. Wartość `null`, pusty ciąg lub wartość niebędąca ciągiem znaków wraca do języków strony.  
Są to `<html lang>` strony, a potem `navigator.languages` przeglądarki, odczytane raz, gdy przeglądarka po raz pierwszy się łączy. Wartość `'system'` bierze pierwszy z nich, dla którego przeglądarka ma język, według reguły edytora z sekcji [setSystemLocale](./erd-editor-element.md#setsystemlocale), a angielski, gdy nie ma żadnego z nich. Strona, której `<html lang>` nazywa język, jaki ma przeglądarka, pokazuje więc ten język niezależnie od preferencji przeglądarki, a późniejsza zmiana `lang` lub języków przeglądarki nie przesuwa żadnej przeglądarki.  
Ma znaczenie tylko wtedy, gdy obowiązującą opcją jest `'system'`, a jego `Promise` jest rozstrzygany tak jak w [setLocale](#setlocale).

```js
viewer.setSystemLocale('ja-JP'); // null goes back to the page's languages
```

## destroy {#destroy}

Kończy działanie przeglądarki na stałe. Zdejmuje widok, zanim zwróci, niezależnie od tego, czy element nadal jest na stronie, czy został wcześniej wyjęty, przerywa trwające pobieranie `src` i przestaje śledzić schemat kolorów systemu operacyjnego oraz style strony.  
Zniszczona przeglądarka niczego więcej nie rysuje, niczego nie pobiera i o żaden język nie prosi, nawet po ponownym dodaniu do strony. Odczyt [value](#value) nadal zwraca dokument, który zawierała.  
Wyjęcie elementu ze strony go nie niszczy: wstawiony z powrotem działa dalej i pobiera `src`, którego jeszcze nie pokazał – zobacz sekcję [Ładowanie](#loading).

```js
viewer.destroy();
```

## Fokus i klawisze {#focus-and-keys}

Przeglądarka nie przejmuje fokusu przy montowaniu, przy lądowaniu dokumentu ani przy zamknięciu swojej palety, więc nigdy nie przewija strony do siebie ani nie przejmuje klawiszy strony.  
Kliknięcie lub dotknięcie jej kanwy nadaje jej fokus bez przewijania strony i jest jednym przystankiem klawisza `Tab`. W przeciwieństwie do edytora nie ma własnych składowych `focus()` i `blur()`. Naciśnięcie gdziekolwiek indziej na stronie znów odbiera jej fokus.

Dopóki przeglądarka nie ma fokusu, strona zachowuje kółko, które przewija stronę, i szczypnięcie na gładziku. Palec na kanwie przewija stronę i niczego nie przesuwa, a każdy klawisz dociera do strony niezablokowany.  
Gdy przeglądarka ma fokus:

- Kółko przesuwa widok, a `Shift + Wheel` przesuwa go na boki. Nad notatką, której tekst się nie mieści, kółko przewija notatkę.
- `Ctrl + Wheel` (Windows/Linux) lub `⌘ + Wheel` (Mac), szczypnięcie na gładziku albo dwa palce na ekranie dotykowym powiększają widok.
- Palec przesuwa widok.
- `Ctrl + Plus` i `Ctrl + Minus` (Windows/Linux) lub `⌘ + Plus` i `⌘ + Minus` (Mac) zmieniają powiększenie o krok, tak jak przyciski `Zoom in` i `Zoom out`, a `Ctrl + 0` (Windows/Linux) lub `⌘ + 0` (Mac) wraca od razu do `100%`, zachowując środek ekranu na miejscu.
- `Ctrl + K` (Windows/Linux) lub `⌘ + K` (Mac) otwiera paletę, a `Esc` ją zamyka.

To jedyne jej klawisze i nie można ich przepiąć. Każdy inny klawisz dociera do strony niezablokowany, z fokusem lub bez: `Delete`, `Backspace`, `Space`, `Enter`, `Tab`, `Ctrl + A`, `Ctrl + F` i każda kombinacja, która w edytorze edytuje.

Paleta przeszukuje wyłącznie dokument i nie wyświetla żadnego polecenia. Jej puste pole pokazuje prefiksy: `#` przeszukuje tabele, `@` kolumny, `:` komentarze i notatki, a `?` wyświetla prefiksy, jak w edytorze – zobacz sekcję [Przeszukiwanie diagramu](../guide/guides/quick-search.md#searching-the-diagram). Słowo bez prefiksu pokazuje `No commands match` nad wierszami, które przeszukują diagram pod jego kątem.  
Wybór wiersza przesuwa widok według reguły edytora, [Dokąd prowadzi przejście](../guide/guides/table-related-functions.md#where-a-jump-lands), pozostawiając powiększenie bez zmian, i obrysowuje to, do czego dotarł, przeniesione na wierzch: tabelę, tabelę zawierającą kolumnę lub komentarz albo notatkę.  
Wybór wiersza lub naciśnięcie `Esc` zamyka paletę i pozostawia fokus bez żadnego elementu, więc następne obrócenie kółka przewija stronę; kliknij widok, aby znów nadać mu kółko i klawisze. Gdy paleta jest otwarta, kółko przewija jej listę, a klawisze powiększenia nic nie robią.

Z fokusem lub bez, przeciągnięcie głównym przyciskiem myszy przesuwa widok z dowolnego miejsca kanwy, także nad tabelą. Kliknięcie lub dotknięcie, które nie przesuwa widoku, podświetla relacje: na tabeli relacje tej tabeli, na linii relacji tę linię, a gdziekolwiek indziej, także na notatce, gasi podświetlenie. Takie kliknięcie czyści też obrys pozostawiony przez przejście z palety. Wskaźnik spoczywający na tabeli podświetla jej relacje, dopóki tam jest.  
Żadne naciśnięcie niczego nie zaznacza, nie przesuwa ani nie edytuje. Nie ma zaznaczenia poza obrysem przejścia, nie ma ramki zaznaczenia, a dwukrotne kliknięcie ani `Enter` nie otwiera żadnej komórki.

## Ładowanie {#loading}

Gdy `src` się ładuje, komunikat pośrodku kanwy brzmi `Loading diagram` obok obracającego się wskaźnika. Gdy ładowanie zawiedzie, brzmi `Couldn't load the diagram` obok znaku ostrzeżenia, dopóki nowy `src` lub `value` nie zajmie jego miejsca albo `src` nie zostanie usunięty. Naciśnięcia przechodzą przez komunikat do kanwy, a komunikat jest zapisany w języku wyświetlania, od prawej do lewej w języku pisanym od prawej do lewej.

Każdy dokument, który ląduje, z `src` lub z `value`, jest dopasowywany do pola przeglądarki: powiększany i przewijany tak, aby cały diagram był widoczny, wyśrodkowany, tak jak robi to `Fit`, a powiększenie i przewinięcie zapisane w pliku zostają odłożone na bok. Dokument przekazany, zanim przeglądarka ma rozmiar, ustawiony przed umieszczeniem jej na stronie lub gdy jej pole jest puste, jest dopasowywany, gdy tylko go dostanie. Późniejsza zmiana rozmiaru zachowuje powiększenie; `Fit` dopasowuje ponownie.

Przeglądarka pobiera `src` tylko wtedy, gdy jest na stronie. Wyjęcie jej przerywa trwające pobieranie, a ponowne wstawienie pobiera `src`, którego jeszcze nie pokazała, także taki, który zawiódł, a nigdy taki, który już pokazuje. Przeglądarkę, która nie jest już potrzebna, kończy się metodą [destroy](#destroy).

## Co dodaje do strony {#what-it-adds-to-a-page}

- Żadnego workera. Nie uruchamia żadnego, więc Content Security Policy nie potrzebuje dla niej `worker-src`.
- Żadnego magazynu. Nie zapisuje ciasteczka, `localStorage`, `sessionStorage` ani IndexedDB.
- Dwa rodzaje żądań: pobranie [src](#src), którego źródło restrykcyjna polityka wymienia w `connect-src`, oraz moduł języka wyświetlania innego niż angielski, z Twojego pakietu – zobacz sekcję [setLocale](#setlocale).
- Style w konstruowanych arkuszach stylów, które restrykcyjne `style-src` przepuszcza. Przeglądarka bez konstruowanych arkuszy stylów, taka jak Firefox przed wersją 101, dostaje zamiast nich elementy `<style>`, które wymagają `style-src 'unsafe-inline'`.
- Nasłuchiwacze na `window`. Import punktu wejścia dodaje trzy na czas życia strony, dla `mousedown`, `touchstart` i własnego zdarzenia pakietu `@dineug/erd-editor/internal-forward-move-start`. Konva, która rysuje kanwę, ustawia `window.Konva` i wraz ze swoją pierwszą sceną dodaje nasłuchiwacze myszy i dotyku do `window` oraz nasłuchiwacz `visibilitychange` do `document`, których nigdy nie usuwa. Punkt wejścia edytora dodaje te same.
- Do czasu [destroy](#destroy) każda przeglądarka śledzi schemat kolorów systemu operacyjnego i obserwuje style strony pod kątem właściwości niestandardowych, które opisuje [setTheme](#settheme).
