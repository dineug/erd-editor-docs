---
sidebar_position: 1
description: Instalacja pakietu @dineug/erd-editor z npm lub CDN, rejestrowanie elementów edytora i przeglądarki, podłączanie okien dialogowych plików oraz aktualizacja z wersji 4.x i 3.x.
---

# Instalacja

```sh
npm install @dineug/erd-editor
```

Pakiet obsługuje wyłącznie ESM (`"type": "module"`) i publikuje tylko folder `dist`.
Nie ma kompilacji CommonJS, więc wywołanie `require('@dineug/erd-editor')` nie działa.

Zawiera dwa elementy niestandardowe: `<erd-editor>`, czyli edytor, oraz, od wersji `5.0.0`, `<erd-viewer>`, który pokazuje diagram tylko do odczytu – zobacz stronę [ErdViewerElement](./erd-viewer-element.md).
Od wersji `5.0.0` import głównego modułu pakietu nie definiuje żadnego z nich. Każdy element ma własny punkt wejścia, który go definiuje – zobacz sekcję [Rejestrowanie elementów](#registering-the-elements).

Zależności czasu wykonania pozostają zewnętrzne, jako importy po samej nazwie pakietu, które bundler rozwiązuje, deduplikuje i oczyszcza z nieużywanego kodu (tree shaking). Od wersji `5.0.0` folder `dist` zawiera jeden plik na moduł, więc bundler zachowuje tylko te moduły, do których dociera strona – zobacz sekcję [Punkty wejścia](#entry-points).
Shared workery pakietu są generowane jako osobne pliki wejściowe w katalogu `dist/workers/` i tworzone za pomocą `new URL('./…', import.meta.url)`, czyli w zapisie, który Vite, webpack 5 i Rspack pakują jako punkt wejścia workera. Zobacz sekcję [Web Workers](#web-workers).
Dla strony bez bundlera istnieją dwie samodzielne kompilacje – zobacz sekcję [Znacznik script](#script-tag).

## Użycie {#usage}

```js
import '@dineug/erd-editor/erd-editor.js';

const editor = document.createElement('erd-editor');
editor.style.cssText = 'display: block; width: 100%; height: 100vh;';
document.body.appendChild(editor);

// load a document without adding an undo entry, then keep it in sync
editor.setInitialValue(localStorage.getItem('my-diagram') ?? '');
editor.addEventListener('change', () => {
  localStorage.setItem('my-diagram', editor.value);
});
```

Moduł `@dineug/erd-editor/erd-editor.js` definiuje `<erd-editor>` w chwili importu. Strona, która tylko pokazuje diagram, importuje zamiast niego `@dineug/erd-editor/erd-viewer.js` – zobacz stronę [ErdViewerElement](./erd-viewer-element.md).

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
  import 'https://esm.run/@dineug/erd-editor@5.0.0/erd-editor.js';

  const editor = document.createElement('erd-editor');
  editor.style.cssText = 'display: block; width: 100%; height: 100vh;';
  document.body.appendChild(editor);
</script>
<!-- or -->
<script type="module" src="https://esm.run/@dineug/erd-editor@5.0.0/erd-editor.js"></script>
```

Usługa `esm.run` sama rozwiązuje zewnętrzne zależności pakietu, więc ten sposób działa bez bundlera.
Każdy punkt wejścia jest dostępny pod ścieżką po numerze wersji: `…/erd-editor.js` definiuje edytor, a `…/erd-viewer.js` przeglądarkę, która pobiera z CDN każdy język wyświetlania poza angielskim dopiero wtedy, gdy strona o niego poprosi. Sam adres URL pakietu, `https://esm.run/@dineug/erd-editor@5.0.0`, udostępnia moduł główny, który nie definiuje żadnego elementu.
Adres URL bez numeru wersji zawsze udostępnia najnowszą wersję. Przypnij wersję, jak powyżej, jeśli nie chcesz, aby aktualizacja do nowej wersji głównej trafiła na stronę bez zapowiedzi.
Wersja `5.0.0` sama jest taką aktualizacją: strona, która musi pozostać przy wersji 4.x, przypina `@4.2.0` – zobacz sekcję [Aktualizacja z wersji 4.x](#upgrading-from-4x).

Usługa `esm.run` udostępnia shared workery z `cdn.jsdelivr.net`, a przeglądarka nie uruchamia shared workera z innego źródła niż źródło strony. Edytor wczytany w ten sposób działa więc bez swoich workerów, tak jak na hoście, który je blokuje – zobacz sekcję [Web Workers](#web-workers). Kompilacja dla [znacznika script](#script-tag) zawiera je w swoim pliku.

### Znacznik script {#script-tag}

Od wersji `3.6.0` pakiet zawiera też kompilację UMD, która mieści wszystkie zależności i wszystkie shared workery w jednym pliku, `dist/erd-editor.umd.js`.
To na nią wskazują pola `unpkg` i `jsdelivr`, więc w obu sieciach CDN udostępnia ją sam adres URL pakietu; kompilacja ta definiuje obiekt `window.ErdEditor`.

```html
<erd-editor></erd-editor>
<script src="https://cdn.jsdelivr.net/npm/@dineug/erd-editor@5.0.0"></script>
<script>
  const editor = document.querySelector('erd-editor');
  editor.setInitialValue(localStorage.getItem('my-diagram') ?? '');
</script>
```

Wczytanie tego pliku definiuje element `<erd-editor>`. Obiekt `window.ErdEditor` zawiera dwie funkcje zwrotne plików, `ErdEditor.setExportFileCallback` i `ErdEditor.setImportFileCallback`, od wersji `3.9.2` `ErdEditor.createKeyBindingMap`, od wersji `4.2.0` `ErdEditor.dictionaryRowChords` – zobacz sekcję [dictionaryRowChords](./erd-editor-element.md#dictionaryrowchords) – a od wersji `5.0.0` `ErdEditor.ErdEditorElement` i `ErdEditor.defineErdEditor` – zobacz sekcję [Rejestrowanie elementów](#registering-the-elements). Nie zawiera funkcji [toImage](./to-image.md).

Od wersji `5.0.0` drugi plik, `dist/erd-viewer.umd.js`, definiuje `<erd-viewer>` i umieszcza `ErdViewerElement` oraz `defineErdViewer` w obiekcie `window.ErdViewer`. Nie uruchamia żadnego workera, zawiera wszystkie 25 języków wyświetlania i nie wysyła żadnych żądań poza pobraniem przekazanego mu `src`.

```html
<erd-viewer src="diagram.erd.json" style="display: block; height: 480px"></erd-viewer>
<script src="https://cdn.jsdelivr.net/npm/@dineug/erd-editor@5.0.0/dist/erd-viewer.umd.js"></script>
```

Żaden z tych plików nie definiuje znacznika drugiego i każdy zostawia na stronie tylko swój własny obiekt globalny oraz `window.Konva`.
Mapa eksportów nadal kieruje bundler do modułów ES, więc instalacja z npm nigdy nie korzysta z żadnego z tych plików.
Strona, która nie może wczytać własnego skryptu, może zamiast tego osadzić hostowaną przeglądarkę z erd-editor.io/embed – zobacz stronę [Osadzanie](../guide/guides/embedding.md).

### HTML {#html}

```html
<erd-editor system-dark-mode enable-theme-builder enable-locale-picker enable-welcome-screen></erd-editor>
<script type="module">
  import 'https://esm.run/@dineug/erd-editor@5.0.0/erd-editor.js';

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
Edytor zawiera wszystkie 25 języków wyświetlania, zarówno w kompilacji ES, jak i w kompilacji dla znacznika script, więc nie trzeba udostępniać żadnego pliku lokalizacji ani niczego rejestrować. Bez selektora i bez wywołania `setLocale()` edytor używa języka angielskiego.

Dodanie tutaj atrybutu `readonly` otwiera edytor jako czytelnika: przypisanie `value`, wywołanie `clear()` i każde wywołanie `setSchema*()` – łącznie z `setSchemaJSON()` i dodawaniem – są ignorowane, a zdarzenie `change` nigdy nie jest wywoływane. Jego karty, Eksplorator i Szybkie wyszukiwanie pozostają do czytania, a każda kontrolka, która edytowałaby diagram, jest pomijana.
Odczyt `editor.value` i `editor.runtimeValue` nadal działa, a obie wartości zachowują własne ustawienia dokumentu: ustawienie widoku zmienione przez czytelnika, takie jak powiększenie czy baza danych, pozostaje na ekranie tego edytora. Zamiast tego wczytaj dokument za pomocą `setInitialValue()` – zobacz sekcję [readonly](./erd-editor-element.md#readonly).

### Renderowanie po stronie serwera {#server-side-rendering}

Każdy punkt wejścia poza `engine.js` i `peer.js` wymaga drzewa DOM, więc w środowisku Node zgłasza błąd. Moduły `erd-editor.js` i `erd-viewer.js` definiują swój element na poziomie modułu, a moduł główny pakietu, który od wersji `5.0.0` niczego nie definiuje, nadal buduje obie klasy elementów podczas ładowania.
W Next.js, Nuxt, SvelteKit lub Astro ładuj punkt wejścia elementu ze ścieżki kodu wykonywanej wyłącznie po stronie klienta, a import nazwany z modułu głównego, taki jak `setExportFileCallback` lub `toImage`, z tej samej ścieżki.

```js
useEffect(() => {
  import('@dineug/erd-editor/erd-editor.js');
}, []);
```

### Vite {#vite}

W trybie deweloperskim dodaj do wstępnego pakowania Vite pakiet ELK, który importuje worker układu edytora, bo inaczej układy tworzone przez tego workera kończą się błędem: `Flow`, `Tree - vertical` i `Tree - horizontal` Automatycznego układu, tryb Przepływ na karcie Wizualizacja oraz import rozmieszczany w układzie Przepływ.
Vite 7 i starsze wymagają też wyłączenia edytora ze wstępnego pakowania, ponieważ ich wstępnie spakowana wersja kieruje adresy URL workerów do plików, których nigdy nie zapisuje, więc zawodzą wszystkie trzy workery. W Vite 8 pomiń to wykluczenie `exclude`, które tylko sprawia, że serwer deweloperski pobiera każdy plik pakietu osobno. Kompilacja produkcyjna nie potrzebuje żadnego z nich.

```js
// vite.config.js
export default {
  optimizeDeps: {
    include: ['@dineug/erd-editor > elkjs/lib/elk.bundled.js'],
    // Vite 7 and older only:
    // exclude: ['@dineug/erd-editor'],
  },
};
```

### TypeScript {#typescript}

Zaimportowanie `@dineug/erd-editor/erd-editor.js` dołącza `erd-editor` do interfejsu `HTMLElementTagNameMap`, a `@dineug/erd-editor/erd-viewer.js` dołącza `erd-viewer`, więc element ma poprawny typ bez rzutowania. Każdy import z modułu głównego, także samego typu, wnosi oba.

```ts
import '@dineug/erd-editor/erd-editor.js';
import type { ErdEditorElement } from '@dineug/erd-editor';

const editor = document.createElement('erd-editor'); // ErdEditorElement
const found = document.querySelector('erd-editor'); // ErdEditorElement | null
```

Typ `ErdEditorElement` jest eksportowany, aby można było oznaczać nim typy własnych zmiennych i właściwości (props). Od wersji `5.0.0` jest to także klasa elementu, a `ErdViewerElement` to interfejs i klasa przeglądarki – zobacz sekcję [Rejestrowanie elementów](#registering-the-elements).
Od wersji `4.0.0` pakiet eksportuje też typy `LocaleCode`, `LocaleOption` i `SchemaSQLOptions`, a od wersji `5.0.0` typ `ToImageOptions` – zobacz sekcję [Punkty wejścia](#entry-points). Opcje przyjmowane przez metody `setSchema*()` nie mają eksportowanej nazwy; odczytaj je z typu elementu, jako `Parameters<ErdEditorElement['setSchemaSQL']>[1]`.
Od wersji `5.0.0` pole `typesVersions` pakietu typuje też każdy punkt wejścia będący ścieżką podrzędną w trybie `moduleResolution: "node10"`, który nie czyta mapy eksportów.

## Rejestrowanie elementów {#registering-the-elements}

Od wersji `5.0.0` pakiet definiuje znacznik tylko tam, gdzie strona o to poprosi.

| Import | Definiuje |
| --- | --- |
| `@dineug/erd-editor/erd-editor.js` | `<erd-editor>` |
| `@dineug/erd-editor/erd-viewer.js` | `<erd-viewer>` |
| `@dineug/erd-editor` | Nic |

Każdy z tych dwóch punktów wejścia definiuje swój znacznik w chwili wykonania i niczego nie eksportuje, więc importuje się go dla samego efektu, a żaden z nich nie definiuje znacznika drugiego.
Moduł główny eksportuje obie klasy elementów, `ErdEditorElement` i `ErdViewerElement`, oraz funkcje `defineErdEditor()` i `defineErdViewer()`, które definiują swój znacznik tam, gdzie je wywołasz:

```js
import { defineErdEditor } from '@dineug/erd-editor';

defineErdEditor();
```

Wywołanie nic nie robi, gdy znacznik ma już tę klasę, więc punkt wejścia i wywołanie funkcji define albo dwa wywołania mogą spotkać się na jednej stronie. Zgłasza błąd `Error` z nazwą znacznika, gdy zajmuje go inna klasa, jak druga kopia pakietu spakowana na tej samej stronie: `Another element class already defines the custom element name erd-editor`.
Klasy z modułu głównego są tymi, które definiują punkty wejścia, więc po wykonaniu któregokolwiek z nich `customElements.get('erd-editor') === ErdEditorElement`. Dopóki znacznik nie jest zdefiniowany, `document.createElement('erd-editor')` tworzy zwykły `HTMLElement` bez żadnego z członków edytora, a `new ErdEditorElement()` zgłasza błąd.

Dla własnego znacznika zdefiniuj klasę pod nim samodzielnie i samodzielnie dodaj znacznik do `HTMLElementTagNameMap`. Zrób to w oknie, które nie wczytuje ani punktu wejścia tego elementu, ani jego kompilacji dla [znacznika script](#script-tag) i nie wywołuje dla niego żadnej funkcji define, ponieważ klasa przyjmuje w oknie jedną nazwę:

```ts
import { ErdEditorElement } from '@dineug/erd-editor';

customElements.define('my-erd-editor', ErdEditorElement);

declare global {
  interface HTMLElementTagNameMap {
    'my-erd-editor': ErdEditorElement;
  }
}
```

Pakiet zawierający oba elementy sprawia, że Vite i Rolldown ostrzegają o `INEFFECTIVE_DYNAMIC_IMPORT` raz dla każdego języka wyświetlania poza angielskim. Przeglądarka wczytuje każdy z nich własnym wywołaniem `import()`, a edytor importuje wszystkie słowniki naraz, więc pozostają one w jego chunku i ładują się razem z nim. Nic nie zawodzi, a pakiet z samą przeglądarką trzyma każdy język w osobnym chunku.

## Podświetlanie składni {#syntax-highlighting}

Kod w panelach Schemat SQL i Generator kodu podświetla biblioteka [Shiki](https://shiki.style), działająca we własnym shared workerze, a od wersji `4.0.0` także skrypty `Before tables` i `After tables` na karcie Schemat SQL.
Od wersji `3.7.0` nie trzeba niczego instalować ani rejestrować: worker powstaje przy pierwszym renderowaniu panelu z kodem, więc strona, która nie otwiera żadnego z nich, nigdy nie pobiera gramatyk.

| | |
| --- | --- |
| Języki | SQL, TypeScript, GraphQL, C#, Java, Kotlin, Scala, Go, Python, PHP, Rust, Swift, JSON, Mermaid |
| Motywy | `github-dark` i `github-light`, zgodnie z jasnym lub ciemnym wyglądem edytora |

To dokładnie te języki, w których panele generują kod: kod `JPA` jest podświetlany jako Java, `SQLAlchemy` jako Python, `TypeORM`, `Sequelize`, `Drizzle` i `Zod` jako TypeScript, `Doctrine` jako PHP, `SeaORM` jako Rust, `JSON Schema` jako JSON, a `DBML` i `AML` jako SQL, bo to najbliższa im gramatyka w dołączonym zestawie – zobacz stronę [Generator kodu](../guide/guides/code-generator.md).

Silnik wyrażeń regularnych jest napisany w czystym języku JavaScript, więc żadna polityka hosta nie musi zezwalać na `wasm-unsafe-eval`.
Tam, gdzie brakuje interfejsu `SharedWorker` – w Chrome na Androidzie przed wersją Chrome 148 i w Safari przed wersją 16.4 – błąd jest zapisywany w logu, a kod wyświetla się jako zwykły tekst; skrypty nadal można edytować.

Aktualizacja z wersji `3.6.0` lub starszej: pakiet `@dineug/erd-editor-shiki-worker` nie jest już publikowany, a wraz z nim zniknęła funkcja `setGetShikiServiceCallback`.
Usuń instalację i rejestrację; strona, która wczytywała workera z CDN, usuwa też ten drugi znacznik `<script>`.

## Web Workers {#web-workers}

Edytor wykonuje trzy zadania w instancjach `SharedWorker`: podświetlanie składni, eksport obrazu i układanie tabel, na którym opierają się [Automatyczny układ](../guide/guides/table-related-functions.md#auto-layout), [tryb Przepływ](../guide/guides/visualization.md#how-flow-is-placed) na karcie Wizualizacja i, od wersji `4.0.0`, rozmieszczanie zaimportowanego schematu.
Wszystkie trzy są zawarte w pakiecie `@dineug/erd-editor`. Żadnego z nich nie trzeba konfigurować, ale każdy z nich host może zablokować.
Od wersji `5.0.0` każdy worker jest tworzony we własnym module, więc pakiet zawiera tylko te workery, do których docierają jego moduły: pakiet samej funkcji [toImage](./to-image.md), bez żadnego elementu, zawiera wyłącznie workera eksportu obrazu, a `<erd-viewer>` w ogóle nie uruchamia workera – zobacz sekcję [Punkty wejścia](#entry-points).
Worker, który wykonywał odśmiecanie dokumentu, usunięto w wersji `4.0.0` razem z samym odśmiecaniem.

| Worker | Bez niego |
| --- | --- |
| Podświetlanie składni | Panele Schemat SQL i Generator kodu oraz skrypty karty Schemat SQL pozostają zwykłym tekstem |
| Eksport obrazu | Pliki PNG i SVG, obraz kopiowany przez `Copy to clipboard`, podgląd w oknie dialogowym `Export image` i, od wersji `5.0.0`, [toImage()](./to-image.md) są rysowane w wątku głównym, co blokuje stronę na czas rysowania |
| Układanie tabel | Układy `Flow`, `Tree - vertical` i `Tree - horizontal` Automatycznego układu oraz tryb Przepływ na karcie Wizualizacja kończą się komunikatem `Could not place tables`; import rozmieszczany w układzie Przepływ – plik SQL, GraphQL, DBML lub AML wczytany przez `Import` lub `Import and Add` albo wywołanie `setSchema*()` z `placement: 'auto'` – układa swoje tabele w wierszach, bez żadnego komunikatu; układ `Force` i tryb Graf nie są tym objęte, ponieważ działają wewnątrz edytora |

Eksport obrazu czeka dziesięć sekund na odpowiedź swojego workera i dopiero potem rysuje w wątku głównym, a podświetlanie składni zostawia kod jako zwykły tekst, gdy tylko jego worker zawiedzie, więc blokowanie workerów przez hosta odbija się na wydajności, a nie na funkcjonalności.
Wyjątkiem jest układanie tabel: silnik obliczający układ jest większy niż sam edytor i nigdy nie jest ładowany w procesie edytora, dlatego układanie tabel przy pierwszym rozmieszczaniu czeka na swojego workera trzydzieści sekund, a gdy worker już odpowie, na wynikowy układ czeka sześćdziesiąt sekund.
Jeśli upłynie którykolwiek z tych czasów oczekiwania, rozmieszczanie kończy się tak samo jak bez workera. Automatyczny układ pokazuje komunikat `Placing tables` od razu po rozpoczęciu, a tryb Przepływ i import rozmieszczany w układzie Przepływ pokazują go dopiero wtedy, gdy rozmieszczanie, łącznie z uruchomieniem workera, trwa już sześć sekund.

Vite, webpack 5 i Rspack generują workery jako pliki obok Twoich chunków. esbuild oraz Rolldown użyty samodzielnie, a nie przez Vite, nie generują żadnych, więc strona przez nie zbudowana działa bez workerów.
Przy eksperymentalnej opcji webpacka `experiments.outputModule` żaden worker nie startuje, ponieważ każdy czeka na wydzielony z niego chunk, którego nic nie ładuje. Zachowaj domyślne wyjście webpacka albo ustaw `optimization.splitChunks: false`.

### Content Security Policy {#content-security-policy}

Strona objęta restrykcyjną polityką Content Security Policy potrzebuje dla tych elementów następujących dyrektyw:

- `worker-src 'self'` dla kompilacji z bundlerem, w której workery są plikami obok pakietu, oraz `blob:` tam, gdzie bundler osadza workera w kodzie. W kompilacji dla [znacznika script](#script-tag) wszystkie trzy znajdują się w pliku jako adresy URL `data:`, więc taka strona wymaga zamiast tego `worker-src data:`. `<erd-viewer>` nie potrzebuje żadnej z nich, ponieważ nie uruchamia workera.
- Od wersji `5.0.0` oba elementy nadają sobie style za pomocą konstruowanych arkuszy stylów, które `style-src 'self'` przepuszcza. Panele kodu edytora nadal kolorują tekst atrybutami `style`, a podgląd okna dialogowego `Export image` jest obrazem pod adresem URL `blob:`, więc edytor potrzebuje też `style-src 'unsafe-inline'` i `img-src blob:`.
- Przeglądarka bez konstruowanych arkuszy stylów, taka jak Firefox przed wersją 101, dostaje zamiast nich elementy `<style>`, które w przypadku obu elementów wymagają `style-src 'unsafe-inline'`.
- `<erd-viewer>` pobiera swój `src`, więc to źródło trafia do `connect-src` – zobacz sekcję [Co dodaje do strony](./erd-viewer-element.md#what-it-adds-to-a-page).

## Punkty wejścia {#entry-points}

Pakiet ma pięć punktów wejścia:

| Punkt wejścia | Czym jest |
| --- | --- |
| `@dineug/erd-editor` | Moduł główny: eksporty poniżej. Od wersji `5.0.0` nie definiuje żadnego elementu, choć do załadowania nadal potrzebuje drzewa DOM |
| `@dineug/erd-editor/erd-editor.js` | Od wersji `5.0.0`. Definiuje `<erd-editor>` i niczego nie eksportuje |
| `@dineug/erd-editor/erd-viewer.js` | Od wersji `5.0.0`. Definiuje `<erd-viewer>` i niczego nie eksportuje |
| `@dineug/erd-editor/engine.js` | Magazyn dokumentu bez drzewa DOM |
| `@dineug/erd-editor/peer.js` | Od wersji `3.9.1`. Uczestnik bez interfejsu (headless) serwera MCP |

Moduł główny eksportuje obie klasy elementów i ich funkcje define, dwa settery funkcji zwrotnych, od wersji `3.9.2` domyślne powiązania klawiszy wraz z ich typami, od wersji `4.0.0` typy języków wyświetlania i typ opcji `getSchemaSQL()`, od wersji `4.2.0` kombinacje klawiszy wierszy karty Słownik, a od wersji `5.0.0` funkcję `toImage`.

| Eksport | Opis |
| --- | --- |
| `ErdEditorElement` | Interfejs elementu – zobacz stronę [ErdEditorElement](./erd-editor-element.md). Od wersji `5.0.0` także jego klasa, ta, jako którą jest zdefiniowany `<erd-editor>` – zobacz sekcję [Rejestrowanie elementów](#registering-the-elements). |
| `ErdViewerElement` | Od wersji `5.0.0`. Interfejs i klasa przeglądarki – zobacz stronę [ErdViewerElement](./erd-viewer-element.md). |
| `defineErdEditor()`, `defineErdViewer()` | Od wersji `5.0.0`. Definiują `<erd-editor>` lub `<erd-viewer>` jako jego klasę. Wywołanie nic nie robi, gdy znacznik ma już tę klasę, a zgłasza błąd `Error`, gdy zajmuje go inna klasa – zobacz sekcję [Rejestrowanie elementów](#registering-the-elements). |
| `toImage(value, options)` | Od wersji `5.0.0`. Rysuje dokument jako obiekt `Blob` PNG lub ciąg SVG, z opcjami okna dialogowego `Export image` – zobacz stronę [toImage](./to-image.md). |
| `ToImageOptions` (typ) | Od wersji `5.0.0`. Opcje przyjmowane przez `toImage()`: `format`, `background`, `darkMode` i `scale`. |
| `setExportFileCallback(cb)` | Zastępuje pobieranie przez przeglądarkę, `(blob, { fileName }) => void`. |
| `setImportFileCallback(cb)` | Zastępuje okno wyboru pliku przeglądarki, `({ type, op, accept, mode }) => void`; pole `mode` od wersji `4.0.0`. Od wersji `4.2.0` przycisk `Import CSV` na karcie Słownik otwiera okno wyboru pliku przeglądarki nawet przy ustawionej funkcji zwrotnej – zobacz sekcję [Okna dialogowe plików](#file-dialogs). |
| `createKeyBindingMap()` | Przy każdym wywołaniu zwraca domyślne powiązania klawiszy jako nowy obiekt `KeyBindingMap` – zobacz sekcję [createKeyBindingMap](./erd-editor-element.md#createkeybindingmap). |
| `KeyBindingMap`, `KeyBindingName`, `ShortcutOption` (typy) | Mapa powiązań, unia nazw jej poleceń i pojedyncze powiązanie. |
| `dictionaryRowChords(map)` | Od wersji `4.2.0`. Przy każdym wywołaniu zwraca, jako nową tablicę `ShortcutOption[]`, kombinacje klawiszy, którymi siatka karty [Słownik](../guide/guides/dictionary.md#adding-and-deleting-rows) wstawia i usuwa wiersze przy przekazanej mapie `KeyBindingMap`. Kombinacja wstawiająca wiersze powyżej, przy ustawieniach domyślnych `Alt+Shift+Enter`, nie należy do żadnego powiązania – zobacz sekcję [dictionaryRowChords](./erd-editor-element.md#dictionaryrowchords). |
| `LocaleCode`, `LocaleOption` (typy) | Od wersji `4.0.0`. Kody 25 języków wyświetlania oraz te same kody z dodatkiem `'system'`, przyjmowane przez `setLocale()` – zobacz sekcję [Język wyświetlania](./erd-editor-element.md#display-language). |
| `SchemaSQLOptions` (typ) | Od wersji `4.0.0`. Opcje przyjmowane przez `getSchemaSQL()`: `statements`, `header` oraz, od wersji `4.2.0`, `logicalNameAsComment` – zobacz sekcję [getSchemaSQL](./erd-editor-element.md#getschemasql). |

Od wersji `5.0.0` folder `dist` zawiera jeden niezminifikowany plik na moduł, każdy obok swojej deklaracji, a pole `sideEffects` w `package.json` wymienia tylko dwa punkty wejścia znaczników i dwa stuby potrzebne plikom workerów. Dzięki temu bundler odrzuca każdy moduł, do którego strona nie dociera, i minifikuje całość raz:

- Import nazwany z modułu głównego, taki jak `setExportFileCallback`, nie pakuje żadnego elementu ani workera.
- `toImage` wnosi workera eksportu obrazu i żaden element.
- `erd-editor.js` wnosi edytor i wszystkie trzy shared workery.
- `erd-viewer.js` wnosi przeglądarkę bez żadnego workera, z angielskim w środku i każdym innym językiem wyświetlania we własnym chunku, ładowanym dopiero wtedy, gdy strona o niego poprosi.

Moduł `@dineug/erd-editor/engine.js` uruchamia magazyn dokumentu bez drzewa DOM, więc działa w wątku Web Worker – zobacz stronę [Zdalne przechowywanie](./advanced/remote-storage.md).
Eksportuje funkcję `createReplicationStore` i typ `ReplicationStore`. Od wersji `3.10.0` eksportuje też typ `ReplicationChange`, `{ value: string; changed: boolean }`, który otrzymuje funkcja nasłuchująca zdarzenia `change` repliki – zobacz sekcję [on@change](./advanced/remote-storage.md#onchange).
Od wersji `4.0.0` obiekt `ReplicationStore` ma też właściwość `runtimeValue`. Jego właściwość `value` oraz wartość przekazywana przez zdarzenie `change` mają postać zapisu, w jakiej przechowuje je plik, tak jak w przypadku elementu – zobacz sekcję [ReplicationStore](./advanced/remote-storage.md#replicationstore).

Moduł `@dineug/erd-editor/peer.js` to uczestnik działający bez interfejsu (headless), przez którego [serwer MCP](../mcp/introduction.md) edytuje dokument. Istnieje na potrzeby tego serwera, a ta dokumentacja go nie opisuje.

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
Funkcja zwrotna eksportu otrzymuje poniższe pliki. Od wersji `4.0.0` są wśród nich plik SVG i pliki z Generatora kodu, a plik `.sql` pochodzi nie bezpośrednio z pozycji `Export`, lecz z przycisku `Save file` na karcie Schemat SQL. Od wersji `4.2.0` jest wśród nich także plik CSV z karty Słownik. Funkcja [toImage()](./to-image.md) nie wywołuje żadnej z tych funkcji zwrotnych: zwraca obraz tobie.

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

## Aktualizacja z wersji 4.x {#upgrading-from-4x}

Wersja `5.0.0` to nowa wersja główna. Przenosząc stronę z wersji 4.x, sprawdź każdy z poniższych punktów:

- Import `import '@dineug/erd-editor'` nie definiuje już `<erd-editor>`. Zaimportuj zamiast niego `@dineug/erd-editor/erd-editor.js` dla samego efektu albo wywołaj `defineErdEditor()`, a importy nazwane z modułu głównego zostaw bez zmian. TypeScript nie oznacza strony pozostawionej przy samym imporcie, ponieważ deklaracje modułu głównego nadal nazywają znacznik w `HTMLElementTagNameMap`, ale utworzony element jest zwykłym `HTMLElement`, więc pierwsze wywołanie jego metody zgłasza `TypeError` – zobacz sekcję [Rejestrowanie elementów](#registering-the-elements).

  ```diff
  -import '@dineug/erd-editor';
  +import '@dineug/erd-editor/erd-editor.js';
   import { setExportFileCallback } from '@dineug/erd-editor';
  ```

- W CDN to samo dotyczy adresu `https://esm.run/@dineug/erd-editor`, który udostępnia teraz moduł główny i niczego nie definiuje: zaimportuj `https://esm.run/@dineug/erd-editor@5.0.0/erd-editor.js`. Same adresy jsDelivr i unpkg nadal udostępniają kompilację dla znacznika script, która definiuje `<erd-editor>` jak dotąd. Adres bez numeru wersji udostępnia teraz najnowszą wersję 5.x; przypnij `@4.2.0`, aby pozostać przy wersji 4.x – zobacz sekcje [CDN](#cdn) i [Znacznik script](#script-tag).
- Moduł główny niczego nie definiuje, ale nadal potrzebuje drzewa DOM, więc przy renderowaniu po stronie serwera import nazwany z niego, taki jak `setExportFileCallback`, pozostaje na ścieżce wykonywanej wyłącznie po stronie klienta obok punktu wejścia elementu – zobacz sekcję [Renderowanie po stronie serwera](#server-side-rendering).
- Obiekt `window.ErdEditor` zyskuje `ErdEditorElement` i `defineErdEditor`. Kompilacja przeglądarki dla znacznika script umieszcza `ErdViewerElement` i `defineErdViewer` w obiekcie `window.ErdViewer`, a żaden z obiektów globalnych nie zawiera `toImage`.
- Edytor z atrybutem `readonly` otwiera się jako czytelnik. Zachowuje sześć kart, Eksplorator, Szybkie wyszukiwanie i obecność innych, a każda kontrolka, która edytowałaby diagram, jest pomijana, zamiast być wyłączona: pasek narzędzi pokazuje nazwę bazy danych jako tekst, karta Ustawienia pokazuje swoje ustawienia ze wszystkimi kontrolkami wyłączonymi pod plakietką `Read only`, a pływający pasek narzędzi zachowuje tylko powiększenie, Widok nazw, tryb zen i kompas, więc `Hand` i `Select` znikają, a przeciągnięcie przesuwa kanwę. Naciśnięcie niczego nie zaznacza: jedynym zaznaczeniem jest obrys, który przejście z Eksploratora lub Szybkiego wyszukiwania nakłada na to, do czego dociera, a które nieruchome kliknięcie czyści, i skróty zaznaczania wszystkiego niczego nie zaznaczają. Włączenie `readonly` kończy to, co było otwarte, na przykład zaznaczenie, narzędzie Rączka, edytor komórki, przeciąganie, Map Columns, podgląd `Force` Automatycznego układu i Podróż w czasie, a zachowuje przewinięcie, powiększenie, kartę i Widok nazw – zobacz sekcję [readonly](./erd-editor-element.md#readonly).
- Ustawienia, które zmienia czytelnik w edytorze `readonly`, pozostają na ekranie tego edytora niezależnie od ich blokad: przewinięcie i powiększenie, karta, Widok nazw, View Option, baza danych oraz język, style nazw i typ cudzysłowu Generatora kodu. Właściwości `value`, `runtimeValue` i eksport JSON zachowują własne ustawienia dokumentu, do których zmiany czytelnika w wersji 4.x mogły docierać, a `getSharedStore()` nie wysyła żadnego z nich do pozostałych edytorów. Wywołanie `getSchemaSQL()` bez systemu bazy danych zapisuje bazę danych wybraną przez czytelnika. Wyłączenie `readonly` przywraca do wartości dokumentu bazę danych, ustawienia kodu i View Option, a przewinięcie, powiększenie, kartę i Widok nazw zostawia tam, gdzie zostawił je czytelnik.
- Wiersz `Recalculation table width` na karcie Ustawienia zniknął. Wczytanie i wklejenie nadal dopasowują szerokość każdej tabeli do jej tekstu.
- W Vite 8 usuń `exclude: ['@dineug/erd-editor']` z `optimizeDeps`, którego potrzebuje już tylko Vite 7 i starsze, a zachowaj `include` dla ELK – zobacz sekcję [Vite](#vite).

## Aktualizacja z wersji 3.x {#upgrading-from-3x}

Wersja `4.0.0` to nowa wersja główna. Przenosząc stronę z wersji 3.x, sprawdź każdy z poniższych punktów, a potem punkty z sekcji [Aktualizacja z wersji 4.x](#upgrading-from-4x) dla wersji `5.0.0`:

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
- Adres URL CDN bez numeru wersji udostępnia najnowszą wersję, od wersji `5.0.0` jest to 5.x. Przypnij `@3.10.0`, aby pozostać przy wersji 3.x – zobacz sekcję [CDN](#cdn).
