---
sidebar_position: 1
description: Instalacja pakietu @dineug/erd-editor z npm lub CDN, montowanie elementu niestandardowego, podłączanie okien dialogowych plików i aktualizacja z wersji 3.x.
---

# Instalacja

```sh
npm install @dineug/erd-editor
```

Pakiet obsługuje wyłącznie ESM (`"type": "module"`) i publikuje tylko folder `dist`.
Nie ma kompilacji CommonJS, więc wywołanie `require('@dineug/erd-editor')` nie działa.

Zależności czasu wykonania pozostają zewnętrzne, jako importy po samej nazwie pakietu, które bundler rozwiązuje, deduplikuje i oczyszcza z nieużywanego kodu (tree shaking).
Shared workery pakietu są generowane jako osobne pliki wejściowe w katalogu `dist/workers/` i tworzone za pomocą `new URL('./…', import.meta.url)`, czyli w zapisie, który Vite, webpack 5 i Rspack pakują jako punkt wejścia workera. Zobacz sekcję [Web Workers](#web-workers).
Dla strony bez bundlera istnieje druga, samodzielna kompilacja – zobacz sekcję [Znacznik script](#script-tag).

## Użycie {#usage}

```js
import '@dineug/erd-editor';

const editor = document.createElement('erd-editor');
editor.style.cssText = 'display: block; width: 100%; height: 100vh;';
document.body.appendChild(editor);

// load a document without adding an undo entry, then keep it in sync
editor.setInitialValue(localStorage.getItem('my-diagram') ?? '');
editor.addEventListener('change', () => {
  localStorage.setItem('my-diagram', editor.value);
});
```

Element `<erd-editor>` nie ma własnego rozmiaru. Nadaj mu (lub jego kontenerowi) jawnie określoną szerokość i wysokość.
Od wersji `4.1.0` otwarty [Eksplorator](../guide/guides/explorer.md) jest zadokowany wewnątrz elementu, po lewej stronie kanwy ERD, i zwęża kanwę zamiast ją zasłaniać. Nowy edytor uruchamia się z zamkniętym Eksploratorem.
Panel ma szerokość co najmniej `200px` i zostawia kanwie co najmniej `320px`, więc w elemencie węższym niż `520px` otwarty Eksplorator nie jest rysowany, dopóki element się nie poszerzy – zobacz sekcję [Obok kanwy](../guide/guides/explorer.md#beside-the-canvas).

Wywołanie `setInitialValue('')` rozpoczyna nowy, pusty dokument. Przypisanie właściwości `value` wczytuje natomiast dokument jako zmianę, więc trafia on do historii cofania.
Od wersji `4.0.0` właściwość `editor.value` to dokument w postaci, w jakiej przechowuje go plik, i to właśnie ją należy zapisywać. Właściwość `editor.runtimeValue` to dokument w postaci, w jakiej przechowuje go edytor, łącznie z usuniętymi encjami: służy do zainicjowania edytora współpracownika i nigdy nie trafia do pliku – zobacz sekcję [runtimeValue](./erd-editor-element.md#runtimevalue).
Od wersji `4.0.0` nowy dokument ma też włączone wszystkie [blokady ustawień](../guide/guides/settings.md#lock): obszaru widoku, karty, języka Generatora kodu, obu stylów nazw, typu cudzysłowu oraz, od wersji `4.2.0`, ustawienia [Widok nazw](../guide/guides/logical-names.md#name-view). Przewijanie, zmiana powiększenia, przełączanie kart, przełączanie Widoku nazw lub zmiana jednego z pozostałych ustawień pozostawia `editor.value` bez zmian i nie wywołuje zdarzenia `change`. Dokument wczytany z tekstu zachowuje blokady, które w nim określono. Dokument, który nie określa żadnych blokad, taki jak każdy plik zapisany przed wersją `4.0.0`, otwiera się ze wszystkimi blokadami włączonymi, przy powiększeniu 100% i na karcie ERD, niezależnie od tego, jaki obszar widoku i jaką kartę zapisano. Jego obszar widoku jest zablokowany w punkcie początkowym `0, 0`, a jeśli w tym miejscu nie jest narysowana żadna część diagramu, widok otwiera się zamiast tego na diagramie – zobacz sekcję [setInitialValue](./erd-editor-element.md#setinitialvalue).
Plik zapisany przed wersją `4.2.0` otwiera się z Widokiem nazw zablokowanym na widoku `Physical Names`, nawet jeśli wszystkie pozostałe blokady są w nim wyłączone. Edytor w wersji `4.0.0` lub `4.1.0` przy zapisie zachowuje blokadę Widoku nazw w niezmienionym stanie, ale pomija sam widok, więc plik z wersji `4.2.0` zapisany z odblokowanym Widokiem nazw pozostaje odblokowany, lecz ponownie otwiera się w widoku `Physical Names`.
Resztę interfejsu API opisano na stronie [ErdEditorElement](./erd-editor-element.md).

### CDN {#cdn}

```html
<script type="module">
  import 'https://esm.run/@dineug/erd-editor';

  const editor = document.createElement('erd-editor');
  editor.style.cssText = 'display: block; width: 100%; height: 100vh;';
  document.body.appendChild(editor);
</script>
<!-- or -->
<script type="module" src="https://esm.run/@dineug/erd-editor"></script>
```

Usługa `esm.run` sama rozwiązuje zewnętrzne zależności pakietu, więc ten sposób działa bez bundlera.
Adres URL bez numeru wersji zawsze udostępnia najnowszą wersję. Przypnij wersję – `https://esm.run/@dineug/erd-editor@4.2.0` – jeśli nie chcesz, aby aktualizacja do nowej wersji głównej trafiła na stronę bez zapowiedzi.
Wersja `4.0.0` sama jest taką aktualizacją: strona, która musi pozostać przy wersji 3.x, przypina `@3.10.0` – zobacz sekcję [Aktualizacja z wersji 3.x](#upgrading-from-3x).

### Znacznik script {#script-tag}

Od wersji `3.6.0` pakiet zawiera też kompilację UMD, która mieści wszystkie zależności i wszystkie shared workery w jednym pliku.
To na nią wskazują pola `unpkg` i `jsdelivr`, więc w obu sieciach CDN udostępnia ją sam adres URL pakietu; kompilacja ta definiuje obiekt `window.ErdEditor`.

```html
<erd-editor></erd-editor>
<script src="https://cdn.jsdelivr.net/npm/@dineug/erd-editor@4.2.0"></script>
<script>
  const editor = document.querySelector('erd-editor');
  editor.setInitialValue(localStorage.getItem('my-diagram') ?? '');
</script>
```

Wczytanie tego pliku rejestruje element `<erd-editor>` w ten sam sposób; obiekt `window.ErdEditor` zawiera dwie funkcje zwrotne plików, `ErdEditor.setExportFileCallback` i `ErdEditor.setImportFileCallback`, a od wersji `3.9.2` także `ErdEditor.createKeyBindingMap`. Od wersji `4.2.0` obiekt ten zawiera też `ErdEditor.dictionaryRowChords` – zobacz sekcję [dictionaryRowChords](./erd-editor-element.md#dictionaryrowchords).
Mapa eksportów nadal kieruje bundler do modułów ES, więc instalacja z npm nigdy nie korzysta z tego pliku.

### HTML {#html}

```html
<erd-editor system-dark-mode enable-theme-builder enable-locale-picker enable-welcome-screen></erd-editor>
<script type="module">
  import 'https://esm.run/@dineug/erd-editor';

  const editor = document.querySelector('erd-editor');
</script>
```

```css
erd-editor {
  display: block;
  width: 100%;
  height: 100vh;
}
```

Od wersji `4.0.0` atrybut `enable-locale-picker` dodaje do paska narzędzi selektor `Display Language`, a atrybut `enable-welcome-screen` dodaje ekran powitalny wyświetlany przy pustym diagramie – zobacz sekcje [enableLocalePicker](./erd-editor-element.md#enablelocalepicker) i [enableWelcomeScreen](./erd-editor-element.md#enablewelcomescreen).
Strona, która wczytuje dokument, tak jak przykład w sekcji [Użycie](#usage), włącza `enableWelcomeScreen` dopiero wtedy, gdy metoda `setInitialValue()` go wczyta, a nie w znacznikach, więc ekran nigdy nie miga nad plikiem, który wciąż się wczytuje.
Pakiet zawiera wszystkie 25 języków wyświetlania, zarówno w kompilacji ES, jak i w kompilacji dla znacznika script, więc nie trzeba udostępniać żadnego pliku lokalizacji ani niczego rejestrować. Bez selektora i bez wywołania `setLocale()` edytor używa języka angielskiego.

Dodanie tutaj atrybutu `readonly` blokuje edycję: przypisanie `value`, wywołanie `clear()` i każde wywołanie `setSchema*()` – łącznie z `setSchemaJSON()` i dodawaniem – są ignorowane, a zdarzenie `change` nigdy nie jest wywoływane. Odczyt `editor.value` i `editor.runtimeValue` nadal działa. Zamiast tego wczytaj dokument za pomocą `setInitialValue()`.

### Renderowanie po stronie serwera {#server-side-rendering}

Zaimportowanie pakietu rejestruje element niestandardowy na poziomie modułu, więc import wymaga drzewa DOM i w środowisku Node zgłasza błąd.
W Next.js, Nuxt, SvelteKit lub Astro ładuj pakiet ze ścieżki kodu wykonywanej wyłącznie po stronie klienta.

```js
useEffect(() => {
  import('@dineug/erd-editor');
}, []);
```

### TypeScript {#typescript}

Zaimportowanie pakietu dołącza `erd-editor` do interfejsu `HTMLElementTagNameMap`, więc element ma poprawny typ bez rzutowania.

```ts
import '@dineug/erd-editor';
import type { ErdEditorElement } from '@dineug/erd-editor';

const editor = document.createElement('erd-editor'); // ErdEditorElement
const found = document.querySelector('erd-editor'); // ErdEditorElement | null
```

Typ `ErdEditorElement` jest eksportowany, aby można było oznaczać nim typy własnych zmiennych i właściwości (props).
Od wersji `4.0.0` pakiet eksportuje też typy `LocaleCode`, `LocaleOption` i `SchemaSQLOptions` – zobacz sekcję [Punkty wejścia](#entry-points). Opcje przyjmowane przez metody `setSchema*()` nie mają eksportowanej nazwy; odczytaj je z typu elementu, jako `Parameters<ErdEditorElement['setSchemaSQL']>[1]`.

## Podświetlanie składni {#syntax-highlighting}

Kod w panelach Schemat SQL i Generator kodu podświetla biblioteka [Shiki](https://shiki.style), działająca we własnym shared workerze, a od wersji `4.0.0` także skrypty `Before tables` i `After tables` na karcie Schemat SQL.
Od wersji `3.7.0` nie trzeba niczego instalować ani rejestrować: worker powstaje przy pierwszym renderowaniu panelu z kodem, więc strona, która nie otwiera żadnego z nich, nigdy nie pobiera gramatyk.

| | |
| --- | --- |
| Języki | SQL, TypeScript, GraphQL, C#, Java, Kotlin, Scala, Go, Python, PHP, Rust, Swift, JSON, Mermaid |
| Motywy | `github-dark` i `github-light`, zgodnie z jasnym lub ciemnym wyglądem edytora |

To dokładnie te języki, w których panele generują kod: kod `JPA` jest podświetlany jako Java, `SQLAlchemy` jako Python, `TypeORM`, `Sequelize`, `Drizzle` i `Zod` jako TypeScript, `Doctrine` jako PHP, `SeaORM` jako Rust, `JSON Schema` jako JSON, a `DBML` i `AML` jako SQL, bo to najbliższa im gramatyka w dołączonym zestawie – zobacz stronę [Generator kodu](../guide/guides/code-generator.md).

Silnik wyrażeń regularnych jest napisany w czystym języku JavaScript, więc żadna polityka hosta nie musi zezwalać na `wasm-unsafe-eval`.
Tam, gdzie brakuje interfejsu `SharedWorker` – w Chrome w systemie Android i w Safari w wersji starszej niż 16.4 – błąd jest zapisywany w logu, a kod wyświetla się jako zwykły tekst; skrypty nadal można edytować.

Aktualizacja z wersji `3.6.0` lub starszej: pakiet `@dineug/erd-editor-shiki-worker` nie jest już publikowany, a wraz z nim zniknęła funkcja `setGetShikiServiceCallback`.
Usuń instalację i rejestrację; strona, która wczytywała workera z CDN, usuwa też ten drugi znacznik `<script>`.

## Web Workers {#web-workers}

Edytor wykonuje trzy zadania w instancjach `SharedWorker`: podświetlanie składni, eksport obrazu i układanie tabel, na którym opierają się [Automatyczny układ](../guide/guides/table-related-functions.md#auto-layout), [tryb Przepływ](../guide/guides/visualization.md#how-flow-is-placed) na karcie Wizualizacja i, od wersji `4.0.0`, rozmieszczanie zaimportowanego schematu.
Wszystkie trzy są zawarte w pakiecie `@dineug/erd-editor`. Żadnego z nich nie trzeba konfigurować, ale każdy z nich host może zablokować.
Worker, który wykonywał odśmiecanie dokumentu, usunięto w wersji `4.0.0` razem z samym odśmiecaniem.

| Worker | Bez niego |
| --- | --- |
| Podświetlanie składni | Panele Schemat SQL i Generator kodu oraz skrypty karty Schemat SQL pozostają zwykłym tekstem |
| Eksport obrazu | Pliki PNG i SVG, obraz kopiowany przez `Copy to clipboard` i podgląd w oknie dialogowym `Export image` są rysowane w wątku głównym, co blokuje stronę na czas rysowania |
| Układanie tabel | Układy `Flow`, `Tree - vertical` i `Tree - horizontal` Automatycznego układu oraz tryb Przepływ na karcie Wizualizacja kończą się komunikatem `Could not place tables`; import rozmieszczany w układzie Przepływ – plik SQL, GraphQL, DBML lub AML wczytany przez `Import` lub `Import and Add` albo wywołanie `setSchema*()` z `placement: 'auto'` – układa swoje tabele w wierszach, bez żadnego komunikatu; układ `Force` i tryb Graf nie są tym objęte, ponieważ działają wewnątrz edytora |

Eksport obrazu czeka dziesięć sekund na odpowiedź swojego workera i dopiero potem rysuje w wątku głównym, a podświetlanie składni zostawia kod jako zwykły tekst, gdy tylko jego worker zawiedzie, więc blokowanie workerów przez hosta odbija się na wydajności, a nie na funkcjonalności.
Wyjątkiem jest układanie tabel: silnik obliczający układ jest większy niż sam edytor i nigdy nie jest ładowany w procesie edytora, dlatego układanie tabel przy pierwszym rozmieszczaniu czeka na swojego workera trzydzieści sekund, a gdy worker już odpowie, na wynikowy układ czeka sześćdziesiąt sekund.
Jeśli upłynie którykolwiek z tych czasów oczekiwania, rozmieszczanie kończy się tak samo jak bez workera. Automatyczny układ pokazuje komunikat `Placing tables` od razu po rozpoczęciu, a tryb Przepływ i import rozmieszczany w układzie Przepływ pokazują go dopiero wtedy, gdy rozmieszczanie, łącznie z uruchomieniem workera, trwa już sześć sekund.

W kompilacji dla bundlera wszystkie trzy są generowane jako pliki obok pakietu, więc restrykcyjna polityka CSP wymaga `worker-src 'self'` – oraz `blob:` tam, gdzie bundler osadza workera w kodzie.
W kompilacji dla [znacznika script](#script-tag) wszystkie trzy są zawarte w pliku jako adresy URL `data:`, więc taka strona wymaga zamiast tego `worker-src data:`.

## Punkty wejścia {#entry-points}

Zaimportowanie pakietu `@dineug/erd-editor` rejestruje element `<erd-editor>` jako efekt uboczny. Poza tym pakiet eksportuje typ elementu, dwa settery funkcji zwrotnych, od wersji `3.9.2` domyślne powiązania klawiszy wraz z ich typami, od wersji `4.0.0` typy języków wyświetlania i typ opcji `getSchemaSQL()`, a od wersji `4.2.0` kombinacje klawiszy wierszy karty Słownik.

| Eksport | Opis |
| --- | --- |
| `ErdEditorElement` (typ) | Interfejs elementu – zobacz stronę [ErdEditorElement](./erd-editor-element.md). |
| `setExportFileCallback(cb)` | Zastępuje pobieranie przez przeglądarkę, `(blob, { fileName }) => void`. |
| `setImportFileCallback(cb)` | Zastępuje okno wyboru pliku przeglądarki, `({ type, op, accept, mode }) => void`; pole `mode` od wersji `4.0.0`. Od wersji `4.2.0` przycisk `Import CSV` na karcie Słownik otwiera okno wyboru pliku przeglądarki nawet przy ustawionej funkcji zwrotnej – zobacz sekcję [Okna dialogowe plików](#file-dialogs). |
| `createKeyBindingMap()` | Przy każdym wywołaniu zwraca domyślne powiązania klawiszy jako nowy obiekt `KeyBindingMap` – zobacz sekcję [createKeyBindingMap](./erd-editor-element.md#createkeybindingmap). |
| `KeyBindingMap`, `KeyBindingName`, `ShortcutOption` (typy) | Mapa powiązań, unia nazw jej poleceń i pojedyncze powiązanie. |
| `dictionaryRowChords(map)` | Od wersji `4.2.0`. Przy każdym wywołaniu zwraca, jako nową tablicę `ShortcutOption[]`, kombinacje klawiszy, którymi siatka karty [Słownik](../guide/guides/dictionary.md#adding-and-deleting-rows) wstawia i usuwa wiersze przy przekazanej mapie `KeyBindingMap`. Kombinacja wstawiająca wiersze powyżej, przy ustawieniach domyślnych `Alt+Shift+Enter`, nie należy do żadnego powiązania – zobacz sekcję [dictionaryRowChords](./erd-editor-element.md#dictionaryrowchords). |
| `LocaleCode`, `LocaleOption` (typy) | Od wersji `4.0.0`. Kody 25 języków wyświetlania oraz te same kody z dodatkiem `'system'`, przyjmowane przez `setLocale()` – zobacz sekcję [Język wyświetlania](./erd-editor-element.md#display-language). |
| `SchemaSQLOptions` (typ) | Od wersji `4.0.0`. Opcje przyjmowane przez `getSchemaSQL()`: `statements`, `header` oraz, od wersji `4.2.0`, `logicalNameAsComment` – zobacz sekcję [getSchemaSQL](./erd-editor-element.md#getschemasql). |

Drugim punktem wejścia jest `@dineug/erd-editor/engine.js`. Uruchamia on magazyn dokumentu bez drzewa DOM, więc działa w wątku Web Worker – zobacz stronę [Zdalne przechowywanie](./advanced/remote-storage.md).
Eksportuje funkcję `createReplicationStore` i typ `ReplicationStore`. Od wersji `3.10.0` eksportuje też typ `ReplicationChange`, `{ value: string; changed: boolean }`, który otrzymuje funkcja nasłuchująca zdarzenia `change` repliki – zobacz sekcję [on@change](./advanced/remote-storage.md#onchange).
Od wersji `4.0.0` obiekt `ReplicationStore` ma też właściwość `runtimeValue`. Jego właściwość `value` oraz wartość przekazywana przez zdarzenie `change` mają postać zapisu, w jakiej przechowuje je plik, tak jak w przypadku elementu – zobacz sekcję [ReplicationStore](./advanced/remote-storage.md#replicationstore).

Od wersji `3.9.1` istnieje trzeci punkt wejścia, `@dineug/erd-editor/peer.js`: uczestnik działający bez interfejsu (headless), przez którego [serwer MCP](../mcp/introduction.md) edytuje dokument. Ten punkt wejścia istnieje na potrzeby tego serwera, a ta dokumentacja go nie opisuje.

### Okna dialogowe plików {#file-dialogs}

Import i eksport korzystają z funkcji zwrotnych, które można wstrzyknąć, więc host bez przeglądarkowego okna dialogowego plików – na przykład widok webview w IDE – może dostarczyć własne.
Nie są one symetryczne: eksport przekazuje gotowy plik, import natomiast tylko o niego prosi, a jego zawartość trzeba samodzielnie przekazać z powrotem do edytora.
Od wersji `4.2.0` przycisk `Import CSV` na karcie Słownik to jedyny import, który nigdy nie wywołuje funkcji zwrotnej importu, której pole `type` nie ma wartości dla plików CSV. Zawsze otwiera on własne okno wyboru pliku przeglądarki, dla plików `.csv` – zobacz sekcję [Importowanie i eksportowanie plików CSV](../guide/guides/dictionary.md#importing-and-exporting-csv).

Pole `op` ma wartość `set` lub `diff` – żądanie `diff` trafia do metody `setDiffValue()` niezależnie od wartości `type`. W przeciwnym razie pole `type` wybiera metodę, a pole `accept` zawiera rozszerzenia tego typu, gotowe do przekazania oknu dialogowemu plików hosta.
Od wersji `4.0.0` żądanie `set` zawiera `mode: 'append'`, gdy użytkownik wybrał operację [Importuj i dodaj](../guide/guides/file-import-export.md#import-and-add), a przy zwykłym imporcie nie zawiera pola `mode`. Przekaż tę wartość dalej: funkcja zwrotna, która ją pomija, zastępuje diagram, do którego użytkownik chciał dodać zawartość.

| `type` | `accept` | Metoda |
| --- | --- | --- |
| `json` | `.json` | `editor.setSchemaJSON(text, { mode })` |
| `sql` | `.sql` | `editor.setSchemaSQL(text, { placement: 'auto', mode })` |
| `graphql` | `.graphql,.gql,.graphqls` | `editor.setSchemaGraphQL(text, { placement: 'auto', mode })` |
| `dbml` | `.dbml` | `editor.setSchemaDBML(text, { placement: 'auto', mode })` |
| `aml` | `.aml` | `editor.setSchemaAML(text, { placement: 'auto', mode })` |

Opcja `placement: 'auto'` rozmieszcza tabele według ich relacji, zanim trafią do diagramu, tak jak robi to wbudowany import edytora, i sprawia, że wywołanie zwraca obiekt Promise. Bez niej tabele trafiają do diagramu od razu, ułożone w wierszach – zobacz sekcje [setSchemaSQL](./erd-editor-element.md#setschemasql) i [setSchemaJSON](./erd-editor-element.md#setschemajson).

```js
import { setExportFileCallback, setImportFileCallback } from '@dineug/erd-editor';

setExportFileCallback((blob, { fileName }) => host.writeFile(fileName, blob));

setImportFileCallback(async ({ type, op, accept, mode }) => {
  const text = await host.pickFile(accept);

  if (op === 'diff') {
    editor.setDiffValue(text);
  } else if (type === 'json') {
    editor.setSchemaJSON(text, { mode });
  } else if (type === 'sql') {
    editor.setSchemaSQL(text, { placement: 'auto', mode });
  } else if (type === 'graphql') {
    editor.setSchemaGraphQL(text, { placement: 'auto', mode });
  } else if (type === 'dbml') {
    editor.setSchemaDBML(text, { placement: 'auto', mode });
  } else if (type === 'aml') {
    editor.setSchemaAML(text, { placement: 'auto', mode });
  }
});
```

Dla każdej obsługiwanej wartości `type` wywołuj odpowiednią metodę, a pozostałe ignoruj.
Wywołanie `setSchemaJSON()` w trybie zastępowania, tak jak przypisanie `value`, czyści dokument przed parsowaniem, więc skierowanie tam danych, które nie są dokumentem `.erd.json` – przez ogólną gałąź `else` albo dlatego, że dodana później wartość `type` nie miała własnej gałęzi – opróżnia diagram, zamiast cokolwiek zaimportować.

Generowana przez edytor wartość `fileName` ma postać `<database name>-<timestamp>` z dopisanym rozszerzeniem pliku, gdzie znacznik czasu to czas lokalny w formacie `yyyy-MM-dd'T'HH_mm_ss`. Pusta nazwa bazy danych zostaje zastąpiona przez `unnamed`. Plik CSV z karty Słownik ma przed rozszerzeniem nazwę swojego arkusza, na przykład `<database name>-<timestamp>-words.csv`.
Funkcja zwrotna eksportu otrzymuje poniższe pliki. Od wersji `4.0.0` są wśród nich plik SVG i pliki z Generatora kodu, a plik `.sql` pochodzi nie bezpośrednio z pozycji `Export`, lecz z przycisku `Save file` na karcie Schemat SQL. Od wersji `4.2.0` jest wśród nich także plik CSV z karty Słownik.

| Plik | Rozszerzenie | `type` obiektu Blob |
| --- | --- | --- |
| Eksport JSON | `.erd.json` | `application/json` |
| Przycisk `Save file` na karcie Schemat SQL, zapisujący tekst wyświetlany na tej karcie – zobacz stronę [Schemat SQL](../guide/guides/schema-sql.md) | `.sql` | brak |
| Okno dialogowe [Export image](../guide/guides/file-import-export.md#image) | `.png` lub `.svg` | `image/png` lub `image/svg+xml` |
| Przycisk `Save file` na karcie Generator kodu – zobacz stronę [Generator kodu](../guide/guides/code-generator.md) | Rozszerzenie języka: `.cs`, `.go`, `.java`, `.kt`, `.php`, `.rs`, `.scala`, `.swift`, `.ts`, `.py`, `.aml`, `.dbml`, `.graphql`, `.json` lub `.mmd` | brak |
| Przycisk `Export CSV` na karcie Słownik, zapisujący wszystkie wiersze wyświetlanego arkusza niezależnie od tego, które z nich pokazuje wyszukiwanie – zobacz sekcję [Importowanie i eksportowanie plików CSV](../guide/guides/dictionary.md#importing-and-exporting-csv) | `.csv` | `text/csv` |

Host, który wybiera procedurę obsługi według rozszerzenia, potrzebuje jej dla każdego z nich.

Jeśli funkcji zwrotnych nie ustawiono, edytor korzysta z wbudowanego w przeglądarkę mechanizmu pobierania i wyboru plików. Przekaż `null`, aby do niego wrócić.

## Obsługa przeglądarek {#browser-support}

Chrome 91+, Edge 94+, Firefox 93+, Safari 16.4+ – bazowy poziom ES2022, dla którego kompilowane są publikowane pakiety.
Pakiet nie zawiera żadnych polyfilli. Dodaj własne, jeśli musisz obsługiwać starsze przeglądarki.

## Aktualizacja z wersji 3.x {#upgrading-from-3x}

Wersja `4.0.0` to nowa wersja główna. Przenosząc stronę z wersji 3.x, sprawdź każdy z poniższych punktów:

- Właściwość `editor.value`, właściwość `value` repliki i wartość `value` przekazywana przez jej zdarzenie `change` mają postać zapisu, w jakiej przechowuje je plik: bez usuniętych encji, zmierzonych szerokości, kolejności warstw ani punktów zaczepienia relacji. Nadal zapisuj `value`, a te dane odczytuj z `runtimeValue`; znaczniki czasu encji (`meta`) zniknęły całkowicie. Współpracownika lub replikę dołączającą do trwającej sesji inicjuj wartością `runtimeValue` działającego uczestnika, a nie wartością `value` ani plikiem, i nigdy nie zapisuj `runtimeValue` – zobacz sekcje [value](./erd-editor-element.md#value) i [runtimeValue](./erd-editor-element.md#runtimevalue).
- Blokady ustawień zastępują opcje `Save Scroll Information` i `Save Zoom Information`. Nowy dokument, a także każdy dokument zapisany przed wersją `4.0.0`, ma włączone wszystkie blokady, więc przewinięcie, zmiana powiększenia, przełączenie karty albo zmiana języka Generatora kodu, stylu nazw lub typu cudzysłowu pozostawia `value` bez zmian i nie wywołuje zdarzenia `change`. Strona, która zachowywała widok przez `change`, potrzebuje odblokowanego ustawienia `Viewport` (oraz `Canvas Type` dla karty) na karcie Ustawienia albo dokumentu, którego `settings.lockSettings` ma te bity wyzerowane – zobacz sekcję [Blokada](../guide/guides/settings.md#lock).
- Obiekt `settings` nie ma już pól `width`, `height`, `scrollTop`, `scrollLeft`, `relationshipOptimization` ani `ignoreSaveSettings`, a stałe `SaveSettingType` zniknęły. Pole `settings.lockSettings` z bitami `LockSettingType` zastępuje pole `ignoreSaveSettings`, którego wersja `4.0.0` lub nowsza ani nie odczytuje, ani nie zapisuje – zobacz sekcję [Settings](./advanced/schema.md#settings).
- Schemat [JSON Schema](./advanced/schema.md#json-schema), który każdy plik wskazuje w polu `$schema`, opisuje teraz wyłącznie postać zapisu i jest zamknięty: odrzuca plik zapisany przez wcześniejszą wersję, dopóki nie nadpisze go zapis w wersji `4.0.0` lub nowszej.
- Odśmiecanie dokumentu zniknęło razem ze swoim workerem, więc usunięta encja pozostaje w `runtimeValue` do następnego otwarcia dokumentu z pliku. Pozostały trzy shared workery – zobacz sekcję [Web Workers](#web-workers).
- Pilnuj, aby wszystkie edytory i repliki we wspólnej sesji miały wersję `4.0.0` lub nowszą. Wcześniejsza wersja ignoruje nowe typy akcji: akcje grup tabel, okna dialogowego „Mapuj kolumny”, blokad i skryptów karty Schemat SQL – zobacz sekcję [Mieszanie wersji](./advanced/collaborative-editing.md#mixing-releases).
- Funkcja zwrotna importu otrzymuje `mode: 'append'` dla operacji Importuj i dodaj, a każda funkcja zwrotna musi tę wartość przekazać dalej. Funkcja zwrotna eksportu otrzymuje teraz także pliki `.svg` i pliki z Generatora kodu, a pozycja `Export` ▸ `Schema SQL`, zamiast zapisywać, otwiera kartę Schemat SQL, więc plik `.sql` przychodzi tylko z przycisku `Save file` tej karty – zobacz sekcję [Okna dialogowe plików](#file-dialogs).
- Klawisze `Delete` i `Backspace` są powiązane z nowym poleceniem `removeSelection`. Gdy edytor ma fokus poza polem tekstowym, domyślne działanie klawisza jest blokowane na każdej karcie, a na karcie ERD edytor usuwa zaznaczone elementy. Typy `KeyBindingName` i `KeyBindingMap` zyskują to polecenie, a `setKeyBindingMap({ removeSelection: [] })` pozostawia oba klawisze stronie – zobacz sekcję [setKeyBindingMap](./erd-editor-element.md#setkeybindingmap).
- Właściwość `ThemeOptions.appearance` przyjmuje też wartość `'system'`, odpowiadającą opcji `System` w kreatorze motywu, którą ustawia włączenie `systemDarkMode`. Zdarzenie `changePresetTheme` zgłasza `'system'`, dopóki ta opcja jest wybrana, więc zapisuj tę wartość bez zmian i przekazuj ją z powrotem do `setPresetTheme`. Przy włączonym `systemDarkMode` motyw ustawiony przez `setPresetTheme()` z `'light'` lub `'dark'` teraz pozostaje, zamiast zostać nadpisany przy następnej zmianie w systemie operacyjnym – zobacz sekcje [systemDarkMode](./erd-editor-element.md#systemdarkmode) i [changePresetTheme](./erd-editor-element.md#changepresettheme).
- Serwer `@dineug/erd-editor-mcp` w wersji `1.0.0` lub nowszej, rozszerzenie VS Code w wersji `4.0.0` lub nowszej oraz wtyczki Obsidian i JetBrains w wersji `1.0.0` lub nowszej posługują się protokołem huba w wersji 2. Serwer w wersji `1.0.0` lub nowszej i wcześniejsza wersja edytora obsługująca agentów albo wcześniejszy serwer i jeden z tych edytorów odrzucają się nawzajem z kodem `protocolMismatch`, wskazując, którą stronę należy zaktualizować – zobacz sekcję [Aktualizacja](../mcp/installation.md#updating).
- Adres URL CDN bez numeru wersji udostępnia teraz najnowszą wersję 4.x. Przypnij `@3.10.0`, aby pozostać przy wersji 3.x – zobacz sekcję [CDN](#cdn).
