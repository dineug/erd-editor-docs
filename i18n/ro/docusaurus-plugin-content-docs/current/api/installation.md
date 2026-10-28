---
sidebar_position: 1
description: Instalați @dineug/erd-editor din npm sau de pe un CDN, înregistrați elementele editor și viewer, conectați casetele de dialog pentru fișiere și actualizați de la 4.x sau 3.x.
---

# Instalare

```sh
npm install @dineug/erd-editor
```

Pachetul este exclusiv ESM (`"type": "module"`) și livrează doar folderul `dist`.
Nu există o versiune CommonJS, așa că `require('@dineug/erd-editor')` nu funcționează.

Conține două elemente personalizate: `<erd-editor>`, editorul, și, începând cu versiunea `5.0.0`, `<erd-viewer>`, care afișează o diagramă doar în citire (consultați [ErdViewerElement](./erd-viewer-element.md)).
Începând cu versiunea `5.0.0`, importul rădăcinii pachetului nu definește niciunul dintre ele. Fiecare element are un punct de intrare propriu care îl definește (consultați [Înregistrarea elementelor](#registering-the-elements)).

Dependențele sale de execuție rămân externe, ca importuri simple pe care bundlerul le rezolvă, le deduplică și le curăță prin tree-shaking. Începând cu versiunea `5.0.0`, `dist` conține câte un fișier pentru fiecare modul, așa că un bundler păstrează doar modulele pe care le atinge o pagină (consultați [Puncte de intrare](#entry-points)).
Workerii săi partajați sunt emiși ca fișiere de intrare separate în `dist/workers/` și construiți cu `new URL('./…', import.meta.url)`, forma pe care Vite, webpack 5 și Rspack o împachetează ca punct de intrare pentru un worker. Consultați [Web Workers](#web-workers).
Pentru o pagină fără bundler există două versiuni autonome (consultați [Eticheta script](#script-tag)).

## Utilizare {#usage}

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

`@dineug/erd-editor/erd-editor.js` definește `<erd-editor>` în momentul importului. O pagină care doar arată o diagramă importă în schimb `@dineug/erd-editor/erd-viewer.js` (consultați [ErdViewerElement](./erd-viewer-element.md)).

Elementul `<erd-editor>` nu are o dimensiune intrinsecă. Definiți pentru el (sau pentru containerul său) o lățime și o înălțime explicite.
Începând cu versiunea `4.1.0`, un [explorator](../guide/guides/explorer.md) deschis se andochează în interiorul elementului, în stânga pânzei ERD, și îngustează pânza în loc să o acopere. Un editor nou pornește cu exploratorul închis.
Panoul nu se desenează mai îngust de `200px` și lasă pânzei cel puțin `320px`, așa că, într-un element mai îngust de `520px`, un explorator deschis nu se desenează până când elementul se lărgește (consultați [Alături de pânză](../guide/guides/explorer.md#beside-the-canvas)).

Apelul `setInitialValue('')` începe un document nou, gol. Atribuirea proprietății `value` încarcă în schimb un document ca editare, așa că acesta ajunge în istoricul anulărilor.
Începând cu versiunea `4.0.0`, proprietatea `editor.value` este documentul în forma pe care o are într-un fișier, adică ceea ce trebuie stocat. Proprietatea `editor.runtimeValue` este documentul așa cum îl păstrează editorul, inclusiv entitățile eliminate: ea inițializează un colaborator și nu ajunge niciodată într-un fișier (consultați [runtimeValue](./erd-editor-element.md#runtimevalue)).
Începând cu versiunea `4.0.0`, un document nou are, de asemenea, toate [blocările setărilor](../guide/guides/settings.md#lock) activate: zona de vizualizare, fila, limbajul generatorului de cod, ambele stiluri de denumire, tipul de delimitator și, începând cu versiunea `4.2.0`, [modul de afișare a numelor](../guide/guides/logical-names.md#name-view). Derularea, zoomul, schimbarea filei, schimbarea modului de afișare sau modificarea uneia dintre celelalte setări lasă proprietatea `editor.value` neschimbată și nu declanșează niciun eveniment `change`. Un document încărcat din text păstrează blocările pe care le specifică. Unul care nu specifică niciuna, de exemplu orice fișier salvat înainte de versiunea `4.0.0`, se deschide cu toate blocările activate, la un zoom de 100% și în fila ERD, indiferent de zona de vizualizare și fila pe care le-a salvat. Zona sa de vizualizare este blocată la originea `0, 0`, iar vizualizarea se deschide în schimb pe diagramă dacă nicio parte din aceasta nu este desenată acolo (consultați [setInitialValue](./erd-editor-element.md#setinitialvalue)).
Un fișier salvat înainte de versiunea `4.2.0` se deschide în modul `Physical Names`, cu modul de afișare a numelor blocat, chiar și unul cu toate celelalte blocări dezactivate. Un editor cu versiunea `4.0.0` sau `4.1.0` păstrează la salvare blocarea modului de afișare în starea în care se află, dar nu păstrează modul de afișare însuși, așa că un fișier din versiunea `4.2.0` salvat cu modul de afișare deblocat rămâne deblocat, dar se redeschide în modul `Physical Names`.
Pentru restul API-ului, consultați [ErdEditorElement](./erd-editor-element.md).

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

Serviciul `esm.run` rezolvă în locul dumneavoastră dependențele externe ale pachetului, așa că acest cod funcționează fără bundler.
Fiecare punct de intrare se atinge prin calea sa de după versiune: `…/erd-editor.js` definește editorul, iar `…/erd-viewer.js` viewerul, care preia de la CDN fiecare limbă de afișare în afară de engleză abia când o pagină o cere. URL-ul simplu al pachetului, `https://esm.run/@dineug/erd-editor@5.0.0`, servește rădăcina, care nu definește niciun element.
Un URL fără versiune servește întotdeauna cea mai recentă versiune. Fixați o versiune, ca mai sus, dacă nu doriți ca o actualizare majoră să ajungă neanunțată pe pagina dumneavoastră.
Versiunea `5.0.0` este ea însăși una: o pagină care trebuie să rămână pe 4.x fixează `@4.2.0` (consultați [Actualizarea de la 4.x](#upgrading-from-4x)).

`esm.run` servește workerii partajați de pe `cdn.jsdelivr.net`, iar un browser nu pornește niciun worker partajat de pe o origine diferită de a paginii. Așadar, un editor încărcat astfel rulează fără workerii săi, ca pe o gazdă care îi blochează (consultați [Web Workers](#web-workers)). Versiunea pentru [eticheta script](#script-tag) îi poartă în interiorul fișierului ei.

### Eticheta script {#script-tag}

Începând cu versiunea `3.6.0`, pachetul livrează și o versiune UMD care conține toate dependențele și toți workerii partajați într-un singur fișier, `dist/erd-editor.umd.js`.
Spre ea indică câmpurile `unpkg` și `jsdelivr`, așa că URL-ul simplu al pachetului pe oricare dintre cele două CDN-uri o servește, iar ea definește obiectul `window.ErdEditor`.

```html
<erd-editor></erd-editor>
<script src="https://cdn.jsdelivr.net/npm/@dineug/erd-editor@5.0.0"></script>
<script>
  const editor = document.querySelector('erd-editor');
  editor.setInitialValue(localStorage.getItem('my-diagram') ?? '');
</script>
```

Încărcarea ei definește `<erd-editor>`. Obiectul `window.ErdEditor` conține cele două funcții callback pentru fișiere, `ErdEditor.setExportFileCallback` și `ErdEditor.setImportFileCallback`, începând cu versiunea `3.9.2` `ErdEditor.createKeyBindingMap`, începând cu versiunea `4.2.0` `ErdEditor.dictionaryRowChords` (consultați [dictionaryRowChords](./erd-editor-element.md#dictionaryrowchords)) și, începând cu versiunea `5.0.0`, `ErdEditor.ErdEditorElement` și `ErdEditor.defineErdEditor` (consultați [Înregistrarea elementelor](#registering-the-elements)). Nu conține [toImage](./to-image.md).

Începând cu versiunea `5.0.0`, un al doilea fișier, `dist/erd-viewer.umd.js`, definește `<erd-viewer>` și pune `ErdViewerElement` și `defineErdViewer` pe `window.ErdViewer`. Nu pornește niciun worker, conține toate cele 25 de limbi de afișare și nu cere nimic în afară de `src`-ul primit.

```html
<erd-viewer src="diagram.erd.json" style="display: block; height: 480px"></erd-viewer>
<script src="https://cdn.jsdelivr.net/npm/@dineug/erd-editor@5.0.0/dist/erd-viewer.umd.js"></script>
```

Niciunul dintre fișiere nu definește eticheta celuilalt, iar fiecare nu lasă pe pagină niciun global în afară de al său și de `window.Konva`.
Harta exporturilor îndreaptă în continuare un bundler spre modulele ES, așa că o instalare din npm nu preia niciodată niciunul dintre aceste fișiere.
O pagină care nu poate încărca un script propriu poate încadra viewerul găzduit de la erd-editor.io/embed (consultați [Încorporare](../guide/guides/embedding.md)).

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

Începând cu versiunea `4.0.0`, atributul `enable-locale-picker` adaugă selectorul `Display Language` din bara de instrumente, iar atributul `enable-welcome-screen`, ecranul de bun venit pe care îl afișează o diagramă goală (consultați [enableLocalePicker](./erd-editor-element.md#enablelocalepicker) și [enableWelcomeScreen](./erd-editor-element.md#enablewelcomescreen)).
O pagină care încarcă un document, așa cum se face în [Utilizare](#usage), activează proprietatea `enableWelcomeScreen` după ce metoda `setInitialValue()` l-a încărcat, nu în marcaj, astfel încât ecranul să nu apară niciodată fugitiv peste un fișier care încă se încarcă.
Editorul conține toate cele 25 de limbi de afișare, atât în versiunea ES, cât și în versiunea pentru eticheta script, așa că nu există niciun fișier de localizare de servit și nimic de înregistrat. Fără selector și fără un apel `setLocale()`, editorul se afișează în engleză.

Adăugarea atributului `readonly` aici deschide editorul ca pe un cititor: atribuirea proprietății `value`, apelarea metodei `clear()` și orice apel `setSchema*()` – inclusiv `setSchemaJSON()` și un apel de adăugare – sunt ignorate, iar evenimentul `change` nu se declanșează niciodată. Filele sale, exploratorul și Quick Search rămân pentru citit, iar fiecare control care ar edita diagrama lipsește.
Citirea proprietăților `editor.value` și `editor.runtimeValue` funcționează în continuare, iar ambele păstrează setările proprii ale documentului: o setare de vizualizare pe care o schimbă cititorul, cum ar fi zoomul sau baza de date, rămâne pe ecranul acelui editor. Pentru încărcare, folosiți în schimb metoda `setInitialValue()` (consultați [readonly](./erd-editor-element.md#readonly)).

### Redare pe server {#server-side-rendering}

Fiecare punct de intrare în afară de `engine.js` și `peer.js` are nevoie de un DOM, așa că aruncă o excepție în Node. `erd-editor.js` și `erd-viewer.js` își definesc elementul la nivelul modulului, iar rădăcina pachetului, care începând cu versiunea `5.0.0` nu definește nimic, construiește totuși ambele clase de elemente când se încarcă.
În Next.js, Nuxt, SvelteKit sau Astro, ajungeți la punctul de intrare al elementului dintr-un cod care rulează doar pe client, și tot de acolo la un import numit din rădăcină, cum ar fi `setExportFileCallback` sau `toImage`.

```js
useEffect(() => {
  import('@dineug/erd-editor/erd-editor.js');
}, []);
```

### Vite {#vite}

În dezvoltare, adăugați la pre-împachetarea Vite pachetul ELK pe care îl importă workerul de aranjare al editorului, altfel aranjările făcute de acel worker eșuează: `Flow`, `Tree - vertical` și `Tree - horizontal` din Auto Layout, modul Flow din fila Vizualizare și un import plasat prin Flow.
Vite 7 și cele mai vechi cer și ca editorul să fie ținut în afara pre-împachetării, deoarece pre-pachetul lor îndreaptă URL-urile workerilor spre fișiere pe care nu le scrie niciodată, așa că toți cei trei workeri eșuează. Pe Vite 8 omiteți acel `exclude`, care doar face ca serverul de dezvoltare să preia separat fiecare fișier al pachetului. O construcție de producție nu are nevoie de niciuna.

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

Importarea `@dineug/erd-editor/erd-editor.js` îmbină `erd-editor` în `HTMLElementTagNameMap`, iar `@dineug/erd-editor/erd-viewer.js` îmbină `erd-viewer`, așa că elementul este tipizat fără conversie explicită de tip. Orice import din rădăcină, chiar și unul doar de tip, le aduce pe amândouă.

```ts
import '@dineug/erd-editor/erd-editor.js';
import type { ErdEditorElement } from '@dineug/erd-editor';

const editor = document.createElement('erd-editor'); // ErdEditorElement
const found = document.querySelector('erd-editor'); // ErdEditorElement | null
```

Tipul `ErdEditorElement` este exportat pentru adnotarea propriilor variabile și proprietăți (props). Începând cu versiunea `5.0.0`, este și clasa elementului, iar `ErdViewerElement` este interfața și clasa viewerului (consultați [Înregistrarea elementelor](#registering-the-elements)).
Începând cu versiunea `4.0.0`, pachetul exportă și tipurile `LocaleCode`, `LocaleOption` și `SchemaSQLOptions`, iar începând cu versiunea `5.0.0` și `ToImageOptions` (consultați [Puncte de intrare](#entry-points)). Opțiunile pe care le primesc metodele `setSchema*()` nu au un nume exportat; deduceți-le din element, sub forma `Parameters<ErdEditorElement['setSchemaSQL']>[1]`.
Începând cu versiunea `5.0.0`, câmpul `typesVersions` al pachetului tipizează și fiecare punct de intrare de subcale sub `moduleResolution: "node10"`, care nu citește harta exporturilor.

## Înregistrarea elementelor {#registering-the-elements}

Începând cu versiunea `5.0.0`, pachetul definește o etichetă doar acolo unde o pagină i-o cere.

| Import | Definește |
| --- | --- |
| `@dineug/erd-editor/erd-editor.js` | `<erd-editor>` |
| `@dineug/erd-editor/erd-viewer.js` | `<erd-viewer>` |
| `@dineug/erd-editor` | Nimic |

Fiecare dintre cele două puncte de intrare își definește eticheta în momentul evaluării și nu exportă nimic, așa că se importă doar pentru efectul lui, iar niciunul nu definește eticheta celuilalt.
Rădăcina exportă ambele clase de elemente, `ErdEditorElement` și `ErdViewerElement`, precum și `defineErdEditor()` și `defineErdViewer()`, care își definesc eticheta acolo unde le apelați:

```js
import { defineErdEditor } from '@dineug/erd-editor';

defineErdEditor();
```

Un apel nu face nimic cât timp eticheta deține deja acea clasă, așa că un punct de intrare și un apel de definire, sau două apeluri de definire, pot coexista pe aceeași pagină. Aruncă o excepție `Error` care numește eticheta atunci când o deține altă clasă, cum ar fi o a doua copie a pachetului împachetată în aceeași pagină: `Another element class already defines the custom element name erd-editor`.
Clasele rădăcinii sunt cele pe care le definesc punctele de intrare, așa că `customElements.get('erd-editor') === ErdEditorElement` după ce oricare a rulat. Până când eticheta este definită, `document.createElement('erd-editor')` creează un `HTMLElement` simplu, fără membrii editorului, iar `new ErdEditorElement()` aruncă o excepție.

Pentru o etichetă proprie, definiți singur clasa sub ea și adăugați singur eticheta în `HTMLElementTagNameMap`. Faceți-o într-o fereastră care nu încarcă nici punctul de intrare al acelui element, nici versiunea sa pentru [eticheta script](#script-tag) și nu apelează nicio funcție de definire pentru el, deoarece o clasă primește un singur nume pe fereastră:

```ts
import { ErdEditorElement } from '@dineug/erd-editor';

customElements.define('my-erd-editor', ErdEditorElement);

declare global {
  interface HTMLElementTagNameMap {
    'my-erd-editor': ErdEditorElement;
  }
}
```

Un bundle care conține ambele elemente face ca Vite și Rolldown să avertizeze cu `INEFFECTIVE_DYNAMIC_IMPORT` o dată pentru fiecare limbă de afișare în afară de engleză. Viewerul încarcă fiecare dintre ele cu un `import()` propriu, iar editorul importă toate dicționarele deodată, așa că ele rămân în chunk-ul editorului și se încarcă odată cu el. Nimic nu eșuează, iar un bundle doar cu viewerul păstrează fiecare limbă într-un chunk propriu.

## Evidențierea sintaxei {#syntax-highlighting}

Panourile Schemă SQL și Generator de cod sunt evidențiate de [Shiki](https://shiki.style), într-un worker partajat propriu, iar, începând cu versiunea `4.0.0`, la fel sunt evidențiate și scripturile `Before tables` și `After tables` din fila Schemă SQL.
Începând cu versiunea `3.7.0`, nu este nimic de instalat și nimic de înregistrat: workerul este construit prima dată când se redă un panou de cod, așa că o pagină care nu deschide niciunul nu descarcă niciodată gramaticile.

| | |
| --- | --- |
| Limbaje | SQL, TypeScript, GraphQL, C#, Java, Kotlin, Scala, Go, Python, PHP, Rust, Swift, JSON, Mermaid |
| Teme | `github-dark` și `github-light`, în funcție de aspectul luminos sau întunecat al editorului |

Acestea sunt exact limbajele pe care le generează panourile: `JPA` este evidențiat ca Java, `SQLAlchemy` ca Python, `TypeORM`, `Sequelize`, `Drizzle` și `Zod` ca TypeScript, `Doctrine` ca PHP, `SeaORM` ca Rust, `JSON Schema` ca JSON, iar `DBML` și `AML` ca SQL, cea mai apropiată gramatică inclusă (consultați [Generator de cod](../guide/guides/code-generator.md)).

Motorul de expresii regulate este scris în JavaScript simplu, așa că nicio politică a aplicației gazdă nu are nevoie de `wasm-unsafe-eval`.
Acolo unde nu există `SharedWorker` – Chrome pe Android înainte de Chrome 148, Safari anterior versiunii 16.4 – eșecul este înregistrat în jurnal, iar codul apare ca text simplu; scripturile pot fi editate în continuare.

La actualizarea de la versiunea `3.6.0` sau una anterioară: pachetul `@dineug/erd-editor-shiki-worker` nu mai este publicat, iar funcția `setGetShikiServiceCallback` a dispărut odată cu el.
Eliminați instalarea și înregistrarea; o pagină care încărca workerul de pe un CDN elimină și acea a doua etichetă `<script>`.

## Web Workers {#web-workers}

Editorul rulează trei sarcini în workeri partajați (`SharedWorker`): evidențierea sintaxei, exportul de imagini și aranjarea tabelelor care stă la baza [aranjării automate](../guide/guides/table-related-functions.md#auto-layout), a [modului Flux](../guide/guides/visualization.md#how-flow-is-placed) din fila Vizualizare și, începând cu versiunea `4.0.0`, a plasării unei scheme importate.
Toți cei trei workeri sunt incluși în `@dineug/erd-editor`. Niciunul nu necesită configurare din partea dumneavoastră, dar oricare dintre ei poate fi blocat de o aplicație gazdă.
Începând cu versiunea `5.0.0`, fiecare worker este construit într-un modul propriu, așa că un bundle poartă doar workerii pe care îi ating modulele sale: un bundle cu [toImage](./to-image.md) și fără niciun element poartă doar workerul de export de imagini, iar `<erd-viewer>` nu pornește niciun worker (consultați [Puncte de intrare](#entry-points)).
Workerul care rula colectarea gunoiului pentru document a fost eliminat în versiunea `4.0.0`, împreună cu colectarea însăși.

| Worker | Fără el |
| --- | --- |
| Evidențierea sintaxei | Panourile Schemă SQL și Generator de cod, precum și scripturile din Schemă SQL rămân text simplu |
| Exportul de imagini | Imaginea PNG, imaginea SVG, copia făcută cu `Copy to clipboard`, previzualizarea din caseta de dialog `Export image` și, începând cu versiunea `5.0.0`, [toImage()](./to-image.md) sunt desenate pe firul principal, ceea ce blochează pagina cât timp durează desenarea |
| Aranjarea tabelelor | Aranjările `Flow`, `Tree - vertical` și `Tree - horizontal` ale aranjării automate, precum și modul Flux din fila Vizualizare, se încheie cu mesajul `Could not place tables`; un import plasat prin Flux – un fișier SQL, GraphQL, DBML sau AML importat cu `Import` sau `Import and Add` ori un apel `setSchema*()` cu `placement: 'auto'` – își așază tabelele pe rânduri, fără niciun mesaj; aranjarea `Force` și modul Graf nu sunt afectate, deoarece rulează în interiorul editorului |

Exportul de imagini așteaptă zece secunde răspunsul workerului său și apoi desenează pe firul principal, iar evidențierea sintaxei lasă codul ca text simplu imediat ce workerul său eșuează, așa că o aplicație gazdă care blochează workerii pierde performanță, nu funcționalitate.
Aranjarea tabelelor este excepția: motorul care calculează o aranjare este mai voluminos decât editorul însuși și nu se încarcă niciodată în același proces, așa că, la prima plasare, își așteaptă workerul timp de treizeci de secunde, iar după ce workerul a răspuns, acordă unei aranjări șaizeci de secunde pentru a fi returnată.
Dacă oricare dintre aceste așteptări expiră, plasarea se încheie la fel ca fără worker. Aranjarea automată afișează mesajul `Placing tables` imediat ce începe, în timp ce modul Flux și un import plasat prin Flux îl afișează doar după ce o plasare, inclusiv pornirea workerului său, a rulat timp de șase secunde.

Vite, webpack 5 și Rspack emit workerii ca fișiere alături de chunk-urile dumneavoastră. esbuild, precum și Rolldown folosit singur, nu prin Vite, nu emit niciunul, așa că o pagină construită cu ele rulează fără workeri.
În modul experimental `experiments.outputModule` al webpack, niciun worker nu pornește, deoarece fiecare așteaptă un chunk separat din el pe care nu îl încarcă nimic. Păstrați ieșirea implicită a webpack sau setați `optimization.splitChunks: false`.

### Politica de securitate a conținutului (CSP) {#content-security-policy}

O pagină aflată sub o politică strictă de securitate a conținutului (CSP) are nevoie de aceste directive pentru elemente:

- `worker-src 'self'` pentru versiunea procesată de bundler, ai cărei workeri sunt fișiere alături de pachet, plus `blob:` acolo unde bundlerul încorporează un worker direct în cod. În versiunea pentru [eticheta script](#script-tag), toți trei se află în interiorul fișierului ca URL-uri `data:`, așa că acea pagină necesită în schimb `worker-src data:`. `<erd-viewer>` nu are nevoie de niciuna, deoarece nu pornește niciun worker.
- Începând cu versiunea `5.0.0`, ambele elemente se stilizează singure cu foi de stil construite, pe care `style-src 'self'` le lasă să treacă. Panourile de cod ale editorului își colorează în continuare textul cu atribute `style`, iar previzualizarea din caseta de dialog `Export image` este o imagine la un URL `blob:`, așa că editorul are nevoie și de `style-src 'unsafe-inline'` și `img-src blob:` pentru ele.
- Un browser fără foi de stil construite, cum ar fi Firefox înainte de 101, primește în schimb elemente `<style>`, care necesită `style-src 'unsafe-inline'` pentru oricare dintre elemente.
- `<erd-viewer>` preia `src`-ul său cu fetch, așa că acea origine se adaugă în `connect-src` (consultați [Ce adaugă unei pagini](./erd-viewer-element.md#what-it-adds-to-a-page)).

## Puncte de intrare {#entry-points}

Pachetul are cinci puncte de intrare:

| Punct de intrare | Ce este |
| --- | --- |
| `@dineug/erd-editor` | Rădăcina: exporturile de mai jos. Începând cu versiunea `5.0.0`, nu definește niciun element, deși tot are nevoie de un DOM ca să se încarce |
| `@dineug/erd-editor/erd-editor.js` | Începând cu versiunea `5.0.0`. Definește `<erd-editor>` și nu exportă nimic |
| `@dineug/erd-editor/erd-viewer.js` | Începând cu versiunea `5.0.0`. Definește `<erd-viewer>` și nu exportă nimic |
| `@dineug/erd-editor/engine.js` | Store-ul documentului, fără DOM |
| `@dineug/erd-editor/peer.js` | Începând cu versiunea `3.9.1`. Partenerul fără interfață al serverului MCP |

Rădăcina exportă ambele clase de elemente și funcțiile lor de definire, două funcții de setare a funcțiilor callback, combinațiile de taste implicite împreună cu tipurile lor (începând cu versiunea `3.9.2`), tipurile pentru limba de afișare și tipul opțiunilor metodei `getSchemaSQL()` (începând cu versiunea `4.0.0`), combinațiile pentru rânduri ale filei Dicționar (începând cu versiunea `4.2.0`) și, începând cu versiunea `5.0.0`, `toImage`.

| Export | Descriere |
| --- | --- |
| `ErdEditorElement` | Interfața elementului (consultați [ErdEditorElement](./erd-editor-element.md)). Începând cu versiunea `5.0.0`, este și clasa lui, cea sub care este definit `<erd-editor>` (consultați [Înregistrarea elementelor](#registering-the-elements)). |
| `ErdViewerElement` | Începând cu versiunea `5.0.0`. Interfața și clasa viewerului (consultați [ErdViewerElement](./erd-viewer-element.md)). |
| `defineErdEditor()`, `defineErdViewer()` | Începând cu versiunea `5.0.0`. Definesc `<erd-editor>` sau `<erd-viewer>` ca clasa lui. Un apel nu face nimic cât timp eticheta deține acea clasă și aruncă o excepție `Error` când o deține altă clasă (consultați [Înregistrarea elementelor](#registering-the-elements)). |
| `toImage(value, options)` | Începând cu versiunea `5.0.0`. Desenează un document ca `Blob` PNG sau ca șir SVG, cu opțiunile casetei de dialog `Export image` (consultați [toImage](./to-image.md)). |
| `ToImageOptions` (tip) | Începând cu versiunea `5.0.0`. Opțiunile pe care le primește `toImage()`: `format`, `background`, `darkMode` și `scale`. |
| `setExportFileCallback(cb)` | Înlocuiește descărcarea din browser, `(blob, { fileName }) => void`. |
| `setImportFileCallback(cb)` | Înlocuiește selectorul de fișiere al browserului, `({ type, op, accept, mode }) => void`; `mode` începând cu versiunea `4.0.0`. Începând cu versiunea `4.2.0`, comanda `Import CSV` din fila Dicționar deschide selectorul de fișiere al browserului chiar și când este setată o funcție callback (consultați [Casete de dialog pentru fișiere](#file-dialogs)). |
| `createKeyBindingMap()` | Returnează la fiecare apel combinațiile de taste implicite ca un nou obiect `KeyBindingMap` (consultați [createKeyBindingMap](./erd-editor-element.md#createkeybindingmap)). |
| `KeyBindingMap`, `KeyBindingName`, `ShortcutOption` (tipuri) | O hartă de combinații de taste, uniunea numelor comenzilor sale și o singură combinație. |
| `dictionaryRowChords(map)` | Începând cu versiunea `4.2.0`. Returnează la fiecare apel, ca un nou tablou `ShortcutOption[]`, combinațiile cu care grila filei [Dicționar](../guide/guides/dictionary.md#adding-and-deleting-rows) inserează și șterge rânduri conform hărții `KeyBindingMap` pe care o transmiteți. Combinația care inserează rânduri deasupra, `Alt+Shift+Enter` cu valorile implicite, nu figurează în nicio combinație de taste (consultați [dictionaryRowChords](./erd-editor-element.md#dictionaryrowchords)). |
| `LocaleCode`, `LocaleOption` (tipuri) | Începând cu versiunea `4.0.0`. Cele 25 de coduri ale limbilor de afișare și aceleași coduri plus `'system'`, pe care le primește metoda `setLocale()` (consultați [Limbă de afișare](./erd-editor-element.md#display-language)). |
| `SchemaSQLOptions` (tip) | Începând cu versiunea `4.0.0`. Opțiunile pe care le primește metoda `getSchemaSQL()`: `statements`, `header` și, începând cu versiunea `4.2.0`, `logicalNameAsComment` (consultați [getSchemaSQL](./erd-editor-element.md#getschemasql)). |

Începând cu versiunea `5.0.0`, `dist` conține câte un fișier neminificat pentru fiecare modul, fiecare alături de declarația sa, iar câmpul `sideEffects` din `package.json` numește doar cele două puncte de intrare cu etichetă și cele două stub-uri de care au nevoie fișierele worker. Așadar, un bundler elimină fiecare modul pe care o pagină nu îl atinge și minifică o singură dată:

- Un import numit din rădăcină, cum ar fi `setExportFileCallback`, nu împachetează niciun element și niciun worker.
- `toImage` aduce workerul de export de imagini și niciun element.
- `erd-editor.js` aduce editorul și toți cei trei workeri partajați.
- `erd-viewer.js` aduce viewerul și niciun worker, cu engleza în interior și fiecare altă limbă de afișare într-un chunk propriu, încărcat abia când o pagină o cere.

Subcalea `@dineug/erd-editor/engine.js` rulează store-ul documentului fără DOM, așa că funcționează într-un Web Worker (consultați [Stocare la distanță](./advanced/remote-storage.md)).
Exportă funcția `createReplicationStore` și tipul `ReplicationStore`. Începând cu versiunea `3.10.0`, exportă și tipul `ReplicationChange`, `{ value: string; changed: boolean }`, pe care îl primește ascultătorul `change` al unei replici (consultați [on@change](./advanced/remote-storage.md#onchange)).
Începând cu versiunea `4.0.0`, un store `ReplicationStore` are și o proprietate `runtimeValue`. Proprietatea sa `value` și valoarea transmisă de un eveniment `change` sunt în forma de stocare pe care o are un fișier, la fel ca la element (consultați [ReplicationStore](./advanced/remote-storage.md#replicationstore)).

Subcalea `@dineug/erd-editor/peer.js` este partenerul fără interfață prin care [serverul MCP](../mcp/introduction.md) editează un document. Există pentru acel server, iar aceste pagini nu îl documentează.

### Casete de dialog pentru fișiere {#file-dialogs}

Importul și exportul trec prin funcții callback injectabile, așa că o aplicație gazdă fără casetă de dialog pentru fișiere a browserului – de exemplu, un webview dintr-un IDE – o poate furniza pe a sa.
Cele două nu sunt simetrice: exportul vă predă fișierul finalizat, în timp ce importul doar cere unul, iar conținutul îl introduceți înapoi dumneavoastră.
Începând cu versiunea `4.2.0`, comanda `Import CSV` din fila Dicționar este singurul import care nu apelează niciodată funcția callback de import, al cărei câmp `type` nu are nicio valoare pentru CSV. Deschide întotdeauna selectorul de fișiere propriu al browserului, pentru fișiere `.csv` (consultați [Importarea și exportarea fișierelor CSV](../guide/guides/dictionary.md#importing-and-exporting-csv)).

Câmpul `op` este `set` sau `diff`: un `diff` ajunge la metoda `setDiffValue()`, indiferent de `type`. Altfel, câmpul `type` alege metoda, iar câmpul `accept` conține extensiile acelui tip, gata să fie transmise unei casete de dialog pentru fișiere a aplicației gazdă.
Începând cu versiunea `4.0.0`, un `set` conține `mode: 'append'` când utilizatorul a ales [Import și adăugare](../guide/guides/file-import-export.md#import-and-add) și niciun `mode` pentru un import simplu. Transmiteți-l mai departe: o funcție callback care îl omite înlocuiește diagrama la care utilizatorul a cerut să adauge.

| `type` | `accept` | Metodă |
| --- | --- | --- |
| `json` | `.json` | `editor.setSchemaJSON(text, { mode })` |
| `sql` | `.sql` | `editor.setSchemaSQL(text, { placement: 'auto', mode })` |
| `graphql` | `.graphql,.gql,.graphqls` | `editor.setSchemaGraphQL(text, { placement: 'auto', mode })` |
| `dbml` | `.dbml` | `editor.setSchemaDBML(text, { placement: 'auto', mode })` |
| `aml` | `.aml` | `editor.setSchemaAML(text, { placement: 'auto', mode })` |

Opțiunea `placement: 'auto'` aranjează tabelele după relațiile lor înainte ca acestea să fie plasate, așa cum face importul propriu al editorului, și face ca apelul să returneze un Promise. Fără ea, tabelele sunt plasate imediat pe rânduri (consultați [setSchemaSQL](./erd-editor-element.md#setschemasql) și [setSchemaJSON](./erd-editor-element.md#setschemajson)).

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

Tratați separat fiecare valoare `type` pe care o gestionați și ignorați-le pe celelalte.
Un apel `setSchemaJSON()` în modul de înlocuire, la fel ca atribuirea proprietății `value`, golește documentul înainte de parsare, așa că trimiterea acolo a unui conținut care nu este un document `.erd.json` – printr-un `else` general sau pentru că un `type` adăugat ulterior a ajuns pe ramura implicită – golește diagrama în loc să importe ceva.

Valoarea `fileName` generată de editor este `<database name>-<timestamp>` plus extensia fișierului, unde marcajul de timp este ora locală în formatul `yyyy-MM-dd'T'HH_mm_ss`. Dacă numele bazei de date este gol, se folosește `unnamed`. Un fișier CSV din fila Dicționar include numele foii înainte de extensie, ca în `<database name>-<timestamp>-words.csv`.
Funcția callback de export primește aceste fișiere. Începând cu versiunea `4.0.0`, printre ele se află imaginea SVG și fișierele generatorului de cod, iar fișierul `.sql` provine din butonul `Save file` al filei Schemă SQL, nu direct din submeniul `Export`. Începând cu versiunea `4.2.0`, printre ele se află și fișierul CSV din fila Dicționar. [toImage()](./to-image.md) nu apelează niciuna dintre cele două funcții callback: vă înapoiază imaginea.

| Fișier | Extensie | Proprietatea `type` a blobului |
| --- | --- | --- |
| Exportul JSON | `.erd.json` | `application/json` |
| Fișierul salvat cu butonul `Save file` din fila Schemă SQL, care conține textul afișat de filă (consultați [Schemă SQL](../guide/guides/schema-sql.md)) | `.sql` | niciunul |
| Caseta de dialog [Export imagine](../guide/guides/file-import-export.md#image) | `.png` sau `.svg` | `image/png` sau `image/svg+xml` |
| Fișierul salvat cu butonul `Save file` din fila Generator de cod (consultați [Generator de cod](../guide/guides/code-generator.md)) | Cea a limbajului: `.cs`, `.go`, `.java`, `.kt`, `.php`, `.rs`, `.scala`, `.swift`, `.ts`, `.py`, `.aml`, `.dbml`, `.graphql`, `.json` sau `.mmd` | niciunul |
| Fișierul salvat cu comanda `Export CSV` din fila Dicționar, care conține toate rândurile foii afișate, indiferent ce listează căutarea acesteia (consultați [Importarea și exportarea fișierelor CSV](../guide/guides/dictionary.md#importing-and-exporting-csv)) | `.csv` | `text/csv` |

O aplicație gazdă care alege o funcție de tratare după extensie are nevoie de câte una pentru fiecare dintre ele.

Dacă nu le setați, editorul folosește comportamentul propriu al browserului pentru descărcare și pentru selectarea fișierelor. Transmiteți `null` pentru a reveni la acesta.

## Compatibilitate cu browserele {#browser-support}

Chrome 91+, Edge 94+, Firefox 93+, Safari 16.4+: nivelul de bază ES2022 pentru care sunt construite fișierele publicate.
Nu sunt incluse polyfill-uri. Adăugați-le pe ale dumneavoastră dacă aveți nevoie de compatibilitate cu browsere mai vechi.

## Actualizarea de la 4.x {#upgrading-from-4x}

Versiunea `5.0.0` este o versiune majoră. Verificați fiecare dintre aceste puncte când mutați o pagină de pe 4.x:

- `import '@dineug/erd-editor'` nu mai definește `<erd-editor>`. Importați în schimb `@dineug/erd-editor/erd-editor.js` pentru efectul lui sau apelați `defineErdEditor()`, și păstrați importurile numite din rădăcină așa cum sunt. TypeScript nu semnalează o pagină rămasă la importul simplu, deoarece declarațiile rădăcinii numesc în continuare eticheta în `HTMLElementTagNameMap`, dar elementul pe care îl creează este un `HTMLElement` simplu, așa că primul său apel de metodă aruncă un `TypeError` (consultați [Înregistrarea elementelor](#registering-the-elements)).

  ```diff
  -import '@dineug/erd-editor';
  +import '@dineug/erd-editor/erd-editor.js';
   import { setExportFileCallback } from '@dineug/erd-editor';
  ```

- Pe un CDN, același lucru este valabil pentru `https://esm.run/@dineug/erd-editor`, care acum servește rădăcina și nu definește nimic: importați `https://esm.run/@dineug/erd-editor@5.0.0/erd-editor.js`. URL-urile simple jsDelivr și unpkg servesc în continuare versiunea pentru eticheta script, care definește `<erd-editor>` ca înainte. Un URL fără versiune servește acum cea mai recentă versiune 5.x; fixați `@4.2.0` pentru a rămâne pe 4.x (consultați [CDN](#cdn) și [Eticheta script](#script-tag)).
- Rădăcina nu definește nimic, dar tot are nevoie de un DOM, așa că la redarea pe server un import numit din ea, cum ar fi `setExportFileCallback`, rămâne pe calea doar pentru client, alături de punctul de intrare al elementului (consultați [Redare pe server](#server-side-rendering)).
- `window.ErdEditor` primește `ErdEditorElement` și `defineErdEditor`. Versiunea pentru eticheta script a viewerului pune `ErdViewerElement` și `defineErdViewer` pe `window.ErdViewer`, iar niciun global nu conține `toImage`.
- Un editor `readonly` se deschide ca un cititor. Cele șase file, exploratorul, Quick Search și prezența rămân, iar fiecare control care ar edita diagrama dispare în loc să fie dezactivat: bara de instrumente afișează numele bazei de date ca text, fila Setări își arată setările cu fiecare control dezactivat sub o insignă `Read only`, iar bara de instrumente plutitoare păstrează doar zoomul, Name View, modul Zen și busola, așa că `Hand` și `Select` dispar, iar o tragere deplasează pânza. O apăsare nu selectează nimic: singura selecție este conturul pe care îl pune un salt din Explorer sau din Quick Search în jurul a ceea ce ajunge acolo, pe care îl șterge un clic fără mișcare, iar tastele de selectare a tuturor nu selectează nimic. Activarea `readonly` încheie ce era deschis, cum ar fi selecția, instrumentul mână, un editor de celulă, o tragere, Map Columns, previzualizarea `Force` din Auto Layout și Time Travel, și păstrează derularea, zoomul, fila și Name View (consultați [readonly](./erd-editor-element.md#readonly)).
- Setările pe care le schimbă un cititor `readonly` rămân pe ecranul acelui editor, indiferent de blocările lor: derularea și zoomul, fila, Name View, View Option, baza de date, precum și limbajul, stilurile de denumire și tipul de delimitator ale Code Generator. `value`, `runtimeValue` și exportul JSON le păstrează pe cele proprii ale documentului, la care puteau ajunge schimbările unui cititor 4.x, iar `getSharedStore()` nu trimite niciuna celorlalte editoare. `getSchemaSQL()` fără o bază de date indicată scrie baza de date aleasă de cititor. Dezactivarea `readonly` readuce baza de date, setările de cod și View Option la cele ale documentului și lasă derularea, zoomul, fila și Name View unde le-a lăsat cititorul.
- Rândul `Recalculation table width` din fila Setări a dispărut. O încărcare și o lipire încă potrivesc lățimea fiecărui tabel la textul lui.
- Pe Vite 8, eliminați `exclude: ['@dineug/erd-editor']` din `optimizeDeps`, de care au nevoie doar Vite 7 și cele mai vechi, și păstrați `include` pentru ELK (consultați [Vite](#vite)).


## Actualizarea de la 3.x {#upgrading-from-3x}

Versiunea `4.0.0` este o versiune majoră. Verificați fiecare dintre aceste puncte când mutați o pagină de pe 3.x, apoi pe cele din [Actualizarea de la 4.x](#upgrading-from-4x) pentru `5.0.0`:

- Proprietatea `editor.value`, proprietatea `value` a unei replici și valoarea `value` transmisă de evenimentul `change` al acesteia sunt în forma de stocare pe care o are un fișier: fără entități eliminate, lățimi măsurate, ordine de suprapunere sau puncte de ancorare ale relațiilor. Continuați să salvați proprietatea `value` și citiți aceste date din `runtimeValue`; marcajele de timp ale entităților (`meta`) au dispărut cu totul. Inițializați un colaborator sau o replică ce se alătură unei sesiuni în desfășurare din proprietatea `runtimeValue` a unui partener în funcțiune, nu din `value` sau din fișier, și nu salvați niciodată `runtimeValue` (consultați [value](./erd-editor-element.md#value) și [runtimeValue](./erd-editor-element.md#runtimevalue)).
- Blocările setărilor înlocuiesc opțiunile `Save Scroll Information` și `Save Zoom Information`. Un document nou, precum și orice document salvat înainte de versiunea `4.0.0`, are toate blocările activate, așa că o derulare, un zoom, o schimbare de filă sau o modificare a limbajului generatorului de cod, a unui stil de denumire ori a tipului de delimitator lasă proprietatea `value` neschimbată și nu declanșează niciun eveniment `change`. O pagină care păstra vizualizarea prin `change` are nevoie de rândul `Viewport` (și de `Canvas Type`, pentru filă) deblocat în fila Setări sau de un document al cărui câmp `settings.lockSettings` lasă acei biți nesetați (consultați [Blocare](../guide/guides/settings.md#lock)).
- Obiectul `settings` nu mai are `width`, `height`, `scrollTop`, `scrollLeft`, `relationshipOptimization` sau `ignoreSaveSettings`, iar constantele `SaveSettingType` au dispărut. Câmpul `settings.lockSettings`, cu biții `LockSettingType`, ia locul câmpului `ignoreSaveSettings`, pe care versiunea `4.0.0` sau o versiune ulterioară nici nu îl citește, nici nu îl scrie (consultați [Settings](./advanced/schema.md#settings)).
- Definiția [JSON Schema](./advanced/schema.md#json-schema) pe care fiecare fișier o indică în `$schema` descrie acum doar forma de stocare și este închisă: respinge un fișier salvat de o versiune anterioară până când o salvare făcută de versiunea `4.0.0` sau o versiune ulterioară îl rescrie.
- Colectarea gunoiului pentru document a dispărut odată cu workerul său, așa că o entitate eliminată rămâne în `runtimeValue` până la următoarea deschidere a documentului din fișierul său. Rămân trei workeri partajați (consultați [Web Workers](#web-workers)).
- Mențineți fiecare editor și fiecare replică dintr-o sesiune partajată la versiunea `4.0.0` sau o versiune ulterioară. O versiune anterioară ignoră noile tipuri de acțiuni: cele ale grupurilor de tabele, ale casetei de dialog Mapare coloane, ale blocărilor și ale scripturilor din Schemă SQL (consultați [Combinarea versiunilor](./advanced/collaborative-editing.md#mixing-releases)).
- Funcția callback de import primește `mode: 'append'` pentru Import și adăugare, pe care o funcție callback trebuie să îl transmită mai departe. Funcția callback de export primește acum și fișiere `.svg` și fișiere ale generatorului de cod, iar `Export` ▸ `Schema SQL` deschide fila Schemă SQL în loc să salveze, așa că fișierul `.sql` vine doar din butonul `Save file` al acelei file (consultați [Casete de dialog pentru fișiere](#file-dialogs)).
- Tastele `Delete` și `Backspace` sunt asociate noii comenzi `removeSelection`. Cât timp editorul are focusul în afara unui câmp de text, acțiunea implicită a tastei este împiedicată în fiecare filă, iar în fila ERD selecția este eliminată. Tipurile `KeyBindingName` și `KeyBindingMap` o includ, iar `setKeyBindingMap({ removeSelection: [] })` lasă ambele taste în seama paginii (consultați [setKeyBindingMap](./erd-editor-element.md#setkeybindingmap)).
- Câmpul `ThemeOptions.appearance` acceptă și `'system'`, adică opțiunea `System` din configuratorul de teme, pe care o setează activarea proprietății `systemDarkMode`. Evenimentul `changePresetTheme` raportează `'system'` cât timp această opțiune este aleasă, așa că stocați valoarea ca atare și transmiteți-o înapoi metodei `setPresetTheme`. Cu proprietatea `systemDarkMode` activată, un apel `setPresetTheme()` cu `'light'` sau `'dark'` rămâne acum în vigoare în loc să fie suprascris de următoarea schimbare din sistemul de operare (consultați [systemDarkMode](./erd-editor-element.md#systemdarkmode) și [changePresetTheme](./erd-editor-element.md#changepresettheme)).
- Pachetul `@dineug/erd-editor-mcp` `1.0.0` sau o versiune ulterioară, extensia pentru VS Code `4.0.0` sau o versiune ulterioară și pluginurile pentru Obsidian și JetBrains `1.0.0` sau o versiune ulterioară folosesc versiunea 2 a protocolului hubului. Serverul `1.0.0` sau o versiune ulterioară și o versiune anterioară a unui editor care deservește agenți, sau o versiune anterioară a serverului și unul dintre aceste editoare, se refuză reciproc cu eroarea `protocolMismatch`, indicând partea care trebuie actualizată (consultați [Actualizarea](../mcp/installation.md#updating)).
- Un URL CDN fără versiune servește cea mai recentă versiune, 5.x începând cu `5.0.0`. Fixați `@3.10.0` pentru a rămâne pe 3.x (consultați [CDN](#cdn)).
