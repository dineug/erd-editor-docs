---
sidebar_position: 1
description: Instalați @dineug/erd-editor din npm sau de pe un CDN, montați elementul personalizat, conectați casetele de dialog pentru fișiere și actualizați de la 3.x.
---

# Instalare

```sh
npm install @dineug/erd-editor
```

Pachetul este exclusiv ESM (`"type": "module"`) și livrează doar folderul `dist`.
Nu există o versiune CommonJS, așa că `require('@dineug/erd-editor')` nu funcționează.

Dependențele sale de execuție rămân externe, ca importuri simple pe care bundlerul le rezolvă, le deduplică și le curăță prin tree-shaking.
Workerii săi partajați sunt emiși ca fișiere de intrare separate în `dist/workers/` și construiți cu `new URL('./…', import.meta.url)`, forma pe care Vite, webpack 5 și Rspack o împachetează ca punct de intrare pentru un worker. Consultați [Web Workers](#web-workers).
Pentru o pagină fără bundler există o a doua versiune, autonomă (consultați [Eticheta script](#script-tag)).

## Utilizare {#usage}

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

Elementul `<erd-editor>` nu are o dimensiune intrinsecă. Definiți pentru el (sau pentru containerul său) o lățime și o înălțime explicite.
Începând cu versiunea `4.1.0`, un [explorator](../guide/guides/explorer.md) deschis se andochează în interiorul elementului, în stânga pânzei ERD, și îngustează pânza în loc să o acopere. Un editor nou pornește cu exploratorul închis.
Panoul nu se desenează mai îngust de `200px` și lasă pânzei cel puțin `320px`, așa că, într-un element mai îngust de `520px`, un explorator deschis nu se desenează până când elementul se lărgește (consultați [Alături de pânză](../guide/guides/explorer.md#beside-the-canvas)).

Apelul `setInitialValue('')` începe un document nou, gol. Atribuirea proprietății `value` încarcă în schimb un document ca editare, așa că acesta ajunge în istoricul anulărilor.
Începând cu versiunea `4.0.0`, proprietatea `editor.value` este documentul în forma pe care o are într-un fișier, adică ceea ce trebuie stocat. Proprietatea `editor.runtimeValue` este documentul așa cum îl păstrează editorul, inclusiv entitățile eliminate: ea inițializează un colaborator și nu ajunge niciodată într-un fișier (consultați [runtimeValue](./erd-editor-element.md#runtimevalue)).
Începând cu versiunea `4.0.0`, un document nou are, de asemenea, toate [blocările setărilor](../guide/guides/settings.md#lock) activate: zona de vizualizare, fila, limbajul generatorului de cod, ambele stiluri de denumire și tipul de delimitator. Derularea, zoomul, schimbarea filei sau modificarea uneia dintre aceste setări lasă proprietatea `editor.value` neschimbată și nu declanșează niciun eveniment `change`. Un document încărcat din text păstrează blocările pe care le specifică. Unul care nu specifică niciuna, de exemplu orice fișier salvat înainte de versiunea `4.0.0`, se deschide cu toate blocările activate, la un zoom de 100% și în fila ERD, indiferent de vizualizarea și fila pe care le-a salvat. Vizualizarea sa este blocată la originea `0, 0` și se deschide în schimb pe diagramă dacă nicio parte din aceasta nu este desenată acolo (consultați [setInitialValue](./erd-editor-element.md#setinitialvalue)).
Pentru restul API-ului, consultați [ErdEditorElement](./erd-editor-element.md).

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

Serviciul `esm.run` rezolvă în locul dumneavoastră dependențele externe ale pachetului, așa că acest cod funcționează fără bundler.
URL-ul fără versiune servește întotdeauna cea mai recentă versiune. Fixați o versiune – `https://esm.run/@dineug/erd-editor@4.1.0` – dacă nu doriți ca o actualizare majoră să ajungă neanunțată pe pagina dumneavoastră.
Versiunea `4.0.0` este ea însăși una: o pagină care trebuie să rămână pe 3.x fixează `@3.10.0` (consultați [Actualizarea de la 3.x](#upgrading-from-3x)).

### Eticheta script {#script-tag}

Începând cu versiunea `3.6.0`, pachetul livrează și o versiune UMD care conține toate dependențele și toți workerii partajați într-un singur fișier.
Spre ea indică câmpurile `unpkg` și `jsdelivr`, așa că URL-ul simplu al pachetului pe oricare dintre cele două CDN-uri o servește, iar ea definește obiectul `window.ErdEditor`.

```html
<erd-editor></erd-editor>
<script src="https://cdn.jsdelivr.net/npm/@dineug/erd-editor@4.1.0"></script>
<script>
  const editor = document.querySelector('erd-editor');
  editor.setInitialValue(localStorage.getItem('my-diagram') ?? '');
</script>
```

Importarea ei înregistrează elementul `<erd-editor>` în același mod; obiectul `window.ErdEditor` conține cele două funcții callback pentru fișiere, `ErdEditor.setExportFileCallback` și `ErdEditor.setImportFileCallback`, și, începând cu versiunea `3.9.2`, `ErdEditor.createKeyBindingMap`.
Harta exporturilor îndreaptă în continuare un bundler spre modulele ES, așa că o instalare din npm nu preia niciodată acest fișier.

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

Începând cu versiunea `4.0.0`, atributul `enable-locale-picker` adaugă selectorul `Display Language` din bara de instrumente, iar atributul `enable-welcome-screen`, ecranul de bun venit pe care îl afișează o diagramă goală (consultați [enableLocalePicker](./erd-editor-element.md#enablelocalepicker) și [enableWelcomeScreen](./erd-editor-element.md#enablewelcomescreen)).
O pagină care încarcă un document, așa cum se face în [Utilizare](#usage), activează proprietatea `enableWelcomeScreen` după ce metoda `setInitialValue()` l-a încărcat, nu în marcaj, astfel încât ecranul să nu apară niciodată fugitiv peste un fișier care încă se încarcă.
Toate cele 25 de limbi de afișare sunt incluse în pachet, atât în versiunea ES, cât și în versiunea pentru eticheta script, așa că nu există niciun fișier de localizare de servit și nimic de înregistrat. Fără selector și fără un apel `setLocale()`, editorul se afișează în engleză.

Adăugarea atributului `readonly` aici blochează editarea: atribuirea proprietății `value`, apelarea metodei `clear()` și orice apel `setSchema*()` – inclusiv `setSchemaJSON()` și un apel de adăugare – sunt ignorate, iar evenimentul `change` nu se declanșează niciodată. Citirea proprietăților `editor.value` și `editor.runtimeValue` funcționează în continuare. Pentru încărcare, folosiți în schimb metoda `setInitialValue()`.

### Redare pe server {#server-side-rendering}

Importarea pachetului înregistrează elementul personalizat la nivelul modulului, așa că are nevoie de un DOM și aruncă o excepție în Node.
În Next.js, Nuxt, SvelteKit sau Astro, încărcați-l dintr-un cod care rulează doar pe client.

```js
useEffect(() => {
  import('@dineug/erd-editor');
}, []);
```

### TypeScript {#typescript}

Importarea pachetului îmbină `erd-editor` în `HTMLElementTagNameMap`, așa că elementul este tipizat fără conversie explicită de tip.

```ts
import '@dineug/erd-editor';
import type { ErdEditorElement } from '@dineug/erd-editor';

const editor = document.createElement('erd-editor'); // ErdEditorElement
const found = document.querySelector('erd-editor'); // ErdEditorElement | null
```

Tipul `ErdEditorElement` este exportat pentru adnotarea propriilor variabile și proprietăți (props).
Începând cu versiunea `4.0.0`, pachetul exportă și tipurile `LocaleCode`, `LocaleOption` și `SchemaSQLOptions` (consultați [Puncte de intrare](#entry-points)). Opțiunile pe care le primesc metodele `setSchema*()` nu au un nume exportat; deduceți-le din element, sub forma `Parameters<ErdEditorElement['setSchemaSQL']>[1]`.

## Evidențierea sintaxei {#syntax-highlighting}

Panourile Schemă SQL și Generator de cod sunt evidențiate de [Shiki](https://shiki.style), într-un worker partajat propriu, iar, începând cu versiunea `4.0.0`, la fel sunt evidențiate și scripturile `Before tables` și `After tables` din fila Schemă SQL.
Începând cu versiunea `3.7.0`, nu este nimic de instalat și nimic de înregistrat: workerul este construit prima dată când se redă un panou de cod, așa că o pagină care nu deschide niciunul nu descarcă niciodată gramaticile.

| | |
| --- | --- |
| Limbaje | SQL, TypeScript, GraphQL, C#, Java, Kotlin, Scala, Go, Python, PHP, Rust, Swift, JSON, Mermaid |
| Teme | `github-dark` și `github-light`, în funcție de aspectul luminos sau întunecat al editorului |

Acestea sunt exact limbajele pe care le generează panourile: `JPA` este evidențiat ca Java, `SQLAlchemy` ca Python, `TypeORM`, `Sequelize`, `Drizzle` și `Zod` ca TypeScript, `Doctrine` ca PHP, `SeaORM` ca Rust, `JSON Schema` ca JSON, iar `DBML` și `AML` ca SQL, cea mai apropiată gramatică inclusă (consultați [Generator de cod](../guide/guides/code-generator.md)).

Motorul de expresii regulate este scris în JavaScript simplu, așa că nicio politică a aplicației gazdă nu are nevoie de `wasm-unsafe-eval`.
Acolo unde nu există `SharedWorker` – Chrome pe Android, Safari anterior versiunii 16.4 – eșecul este înregistrat în jurnal, iar codul apare ca text simplu; scripturile pot fi editate în continuare.

La actualizarea de la versiunea `3.6.0` sau una anterioară: pachetul `@dineug/erd-editor-shiki-worker` nu mai este publicat, iar funcția `setGetShikiServiceCallback` a dispărut odată cu el.
Eliminați instalarea și înregistrarea; o pagină care încărca workerul de pe un CDN elimină și acea a doua etichetă `<script>`.

## Web Workers {#web-workers}

Editorul rulează trei sarcini în workeri partajați (`SharedWorker`): evidențierea sintaxei, exportul de imagini și aranjarea tabelelor care stă la baza [aranjării automate](../guide/guides/table-related-functions.md#auto-layout), a [modului Flux](../guide/guides/visualization.md#how-flow-is-placed) din fila Vizualizare și, începând cu versiunea `4.0.0`, a plasării unei scheme importate.
Toți cei trei workeri sunt incluși în `@dineug/erd-editor`. Niciunul nu necesită configurare din partea dumneavoastră, dar oricare dintre ei poate fi blocat de o aplicație gazdă.
Workerul care rula colectarea gunoiului pentru document a fost eliminat în versiunea `4.0.0`, împreună cu colectarea însăși.

| Worker | Fără el |
| --- | --- |
| Evidențierea sintaxei | Panourile Schemă SQL și Generator de cod, precum și scripturile din Schemă SQL rămân text simplu |
| Exportul de imagini | Imaginea PNG, imaginea SVG, copia făcută cu `Copy to clipboard` și previzualizarea din caseta de dialog `Export image` sunt desenate pe firul principal, ceea ce blochează pagina cât timp durează desenarea |
| Aranjarea tabelelor | Aranjările `Flow`, `Tree - vertical` și `Tree - horizontal` ale aranjării automate, precum și modul Flux din fila Vizualizare, se încheie cu mesajul `Could not place tables`; un import plasat prin Flux – un fișier SQL, GraphQL, DBML sau AML importat cu `Import` sau `Import and Add` ori un apel `setSchema*()` cu `placement: 'auto'` – își așază tabelele pe rânduri, fără niciun mesaj; aranjarea `Force` și modul Graf nu sunt afectate, deoarece rulează în interiorul editorului |

Exportul de imagini așteaptă zece secunde răspunsul workerului său și apoi desenează pe firul principal, iar evidențierea sintaxei lasă codul ca text simplu imediat ce workerul său eșuează, așa că o aplicație gazdă care blochează workerii pierde performanță, nu funcționalitate.
Aranjarea tabelelor este excepția: motorul care calculează o aranjare este mai voluminos decât editorul însuși și nu se încarcă niciodată în același proces, așa că, la prima plasare, își așteaptă workerul timp de treizeci de secunde, iar după ce workerul a răspuns, acordă unei aranjări șaizeci de secunde pentru a fi returnată.
Dacă oricare dintre aceste așteptări expiră, plasarea se încheie la fel ca fără worker. Aranjarea automată afișează mesajul `Placing tables` imediat ce începe, în timp ce modul Flux și un import plasat prin Flux îl afișează doar după ce o plasare, inclusiv pornirea workerului său, a rulat timp de șase secunde.

În versiunea procesată de bundler, toți trei sunt emiși ca fișiere alături de pachet, așa că o politică CSP strictă necesită `worker-src 'self'` – plus `blob:` acolo unde bundlerul încorporează un worker direct în cod.
În versiunea pentru [eticheta script](#script-tag), toți trei se află în interiorul fișierului ca URL-uri `data:`, așa că acea pagină necesită în schimb `worker-src data:`.

## Puncte de intrare {#entry-points}

Importarea pachetului `@dineug/erd-editor` înregistrează elementul `<erd-editor>` ca efect secundar. În plus, pachetul exportă tipul elementului, două funcții de setare a funcțiilor callback, combinațiile de taste implicite împreună cu tipurile lor (începând cu versiunea `3.9.2`), precum și tipurile pentru limba de afișare și tipul opțiunilor metodei `getSchemaSQL()` (începând cu versiunea `4.0.0`).

| Export | Descriere |
| --- | --- |
| `ErdEditorElement` (tip) | Interfața elementului (consultați [ErdEditorElement](./erd-editor-element.md)). |
| `setExportFileCallback(cb)` | Înlocuiește descărcarea din browser, `(blob, { fileName }) => void`. |
| `setImportFileCallback(cb)` | Înlocuiește selectorul de fișiere al browserului, `({ type, op, accept, mode }) => void`; `mode` începând cu versiunea `4.0.0`. |
| `createKeyBindingMap()` | Returnează la fiecare apel combinațiile de taste implicite ca un nou obiect `KeyBindingMap` (consultați [createKeyBindingMap](./erd-editor-element.md#createkeybindingmap)). |
| `KeyBindingMap`, `KeyBindingName`, `ShortcutOption` (tipuri) | O hartă de combinații de taste, uniunea numelor comenzilor sale și o singură combinație. |
| `LocaleCode`, `LocaleOption` (tipuri) | Începând cu versiunea `4.0.0`. Cele 25 de coduri ale limbilor de afișare și aceleași coduri plus `'system'`, pe care le primește metoda `setLocale()` (consultați [Limbă de afișare](./erd-editor-element.md#display-language)). |
| `SchemaSQLOptions` (tip) | Începând cu versiunea `4.0.0`. Opțiunile `statements` și `header` pe care le primește metoda `getSchemaSQL()` (consultați [getSchemaSQL](./erd-editor-element.md#getschemasql)). |

Subcalea `@dineug/erd-editor/engine.js` este un al doilea punct de intrare. Rulează store-ul documentului fără DOM, așa că funcționează într-un Web Worker (consultați [Stocare la distanță](./advanced/remote-storage.md)).
Exportă funcția `createReplicationStore` și tipul `ReplicationStore`. Începând cu versiunea `3.10.0`, exportă și tipul `ReplicationChange`, `{ value: string; changed: boolean }`, pe care îl primește ascultătorul `change` al unei replici (consultați [on@change](./advanced/remote-storage.md#onchange)).
Începând cu versiunea `4.0.0`, un store `ReplicationStore` are și o proprietate `runtimeValue`. Proprietatea sa `value` și valoarea transmisă de un eveniment `change` sunt în forma de stocare pe care o are un fișier, la fel ca la element (consultați [ReplicationStore](./advanced/remote-storage.md#replicationstore)).

Începând cu versiunea `3.9.1`, există un al treilea, `@dineug/erd-editor/peer.js`: partenerul fără interfață prin care [serverul MCP](../mcp/introduction.md) editează un document. Există pentru acel server, iar aceste pagini nu îl documentează.

### Casete de dialog pentru fișiere {#file-dialogs}

Importul și exportul trec prin funcții callback injectabile, așa că o aplicație gazdă fără casetă de dialog pentru fișiere a browserului – de exemplu, un webview dintr-un IDE – o poate furniza pe a sa.
Cele două nu sunt simetrice: exportul vă predă fișierul finalizat, în timp ce importul doar cere unul, iar conținutul îl introduceți înapoi dumneavoastră.

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

Valoarea `fileName` generată de editor este `<database name>-<timestamp>` plus extensia fișierului, unde marcajul de timp este ora locală în formatul `yyyy-MM-dd'T'HH_mm_ss`. Dacă numele bazei de date este gol, se folosește `unnamed`.
Funcția callback de export primește aceste fișiere. Începând cu versiunea `4.0.0`, printre ele se află imaginea SVG și fișierele generatorului de cod, iar fișierul `.sql` provine din butonul `Save file` al filei Schemă SQL, nu direct din submeniul `Export`.

| Fișier | Extensie | Proprietatea `type` a blobului |
| --- | --- | --- |
| Exportul JSON | `.erd.json` | `application/json` |
| Fișierul salvat cu butonul `Save file` din fila Schemă SQL, care conține textul afișat de filă (consultați [Schemă SQL](../guide/guides/schema-sql.md)) | `.sql` | niciunul |
| Caseta de dialog [Export imagine](../guide/guides/file-import-export.md#image) | `.png` sau `.svg` | `image/png` sau `image/svg+xml` |
| Fișierul salvat cu butonul `Save file` din fila Generator de cod (consultați [Generator de cod](../guide/guides/code-generator.md)) | Cea a limbajului: `.cs`, `.go`, `.java`, `.kt`, `.php`, `.rs`, `.scala`, `.swift`, `.ts`, `.py`, `.aml`, `.dbml`, `.graphql`, `.json` sau `.mmd` | niciunul |

O aplicație gazdă care alege o funcție de tratare după extensie are nevoie de câte una pentru fiecare dintre ele.

Dacă nu le setați, editorul folosește comportamentul propriu al browserului pentru descărcare și pentru selectarea fișierelor. Transmiteți `null` pentru a reveni la acesta.

## Compatibilitate cu browserele {#browser-support}

Chrome 91+, Edge 94+, Firefox 93+, Safari 16.4+: nivelul de bază ES2022 pentru care sunt construite fișierele publicate.
Nu sunt incluse polyfill-uri. Adăugați-le pe ale dumneavoastră dacă aveți nevoie de compatibilitate cu browsere mai vechi.

## Actualizarea de la 3.x {#upgrading-from-3x}

Versiunea `4.0.0` este o versiune majoră. Verificați fiecare dintre aceste puncte când mutați o pagină de pe 3.x:

- Proprietatea `editor.value`, proprietatea `value` a unei replici și valoarea `value` transmisă de evenimentul `change` al acesteia sunt în forma de stocare pe care o are un fișier: fără entități eliminate, lățimi măsurate, ordine de suprapunere sau puncte de ancorare ale relațiilor. Continuați să salvați proprietatea `value` și citiți aceste date din `runtimeValue`; marcajele de timp ale entităților (`meta`) au dispărut cu totul. Inițializați un colaborator sau o replică ce se alătură unei sesiuni în desfășurare din proprietatea `runtimeValue` a unui partener în funcțiune, nu din `value` sau din fișier, și nu salvați niciodată `runtimeValue` (consultați [value](./erd-editor-element.md#value) și [runtimeValue](./erd-editor-element.md#runtimevalue)).
- Blocările setărilor înlocuiesc opțiunile `Save Scroll Information` și `Save Zoom Information`. Un document nou, precum și orice document salvat înainte de versiunea `4.0.0`, are toate blocările activate, așa că o derulare, un zoom, o schimbare de filă sau o modificare a limbajului generatorului de cod, a unui stil de denumire ori a tipului de delimitator lasă proprietatea `value` neschimbată și nu declanșează niciun eveniment `change`. O pagină care păstra vizualizarea prin `change` are nevoie de rândul `Viewport` (și de `Canvas Type`, pentru filă) deblocat în fila Setări sau de un document al cărui câmp `settings.lockSettings` lasă acei biți nesetați (consultați [Blocare](../guide/guides/settings.md#lock)).
- Obiectul `settings` nu mai are `width`, `height`, `scrollTop`, `scrollLeft`, `relationshipOptimization` sau `ignoreSaveSettings`, iar constantele `SaveSettingType` au dispărut. Câmpul `settings.lockSettings`, cu biții `LockSettingType`, ia locul câmpului `ignoreSaveSettings`, pe care versiunea `4.0.0` sau o versiune ulterioară nici nu îl citește, nici nu îl scrie (consultați [Settings](./advanced/schema.md#settings)).
- Definiția [JSON Schema](./advanced/schema.md#json-schema) pe care fiecare fișier o indică în `$schema` descrie acum doar forma de stocare și este închisă: respinge un fișier salvat de o versiune anterioară până când o salvare făcută de versiunea `4.0.0` sau o versiune ulterioară îl rescrie.
- Colectarea gunoiului pentru document a dispărut odată cu workerul său, așa că o entitate eliminată rămâne în `runtimeValue` până la următoarea deschidere a documentului din fișierul său. Rămân trei workeri partajați (consultați [Web Workers](#web-workers)).
- Mențineți fiecare editor și fiecare replică dintr-o sesiune partajată la versiunea `4.0.0` sau o versiune ulterioară. O versiune anterioară ignoră noile tipuri de acțiuni: cele ale grupurilor de tabele, ale casetei de dialog Mapare coloane, ale blocărilor și ale scripturilor din Schemă SQL (consultați [Combinarea versiunilor](./advanced/collaborative-editing.md#mixing-releases)).
- Funcția callback de import primește `mode: 'append'` pentru Import și adăugare, pe care o funcție callback trebuie să îl transmită mai departe. Funcția callback de export primește acum și fișiere `.svg` și fișiere ale generatorului de cod, iar `Export` ▸ `Schema SQL` deschide fila Schemă SQL în loc să salveze, așa că fișierul `.sql` vine doar din butonul `Save file` al acelei file (consultați [Casete de dialog pentru fișiere](#file-dialogs)).
- Tastele `Delete` și `Backspace` sunt asociate noii comenzi `removeSelection`. Cât timp editorul are focusul în afara unui câmp de text, acțiunea implicită a tastei este împiedicată în fiecare filă, iar în fila ERD selecția este eliminată. Tipurile `KeyBindingName` și `KeyBindingMap` o includ, iar `setKeyBindingMap({ removeSelection: [] })` lasă ambele taste în seama paginii (consultați [setKeyBindingMap](./erd-editor-element.md#setkeybindingmap)).
- Câmpul `ThemeOptions.appearance` acceptă și `'system'`, adică opțiunea `System` din configuratorul de teme, pe care o setează activarea proprietății `systemDarkMode`. Evenimentul `changePresetTheme` raportează `'system'` cât timp această opțiune este aleasă, așa că stocați valoarea ca atare și transmiteți-o înapoi metodei `setPresetTheme`. Cu proprietatea `systemDarkMode` activată, un apel `setPresetTheme()` cu `'light'` sau `'dark'` rămâne acum în vigoare în loc să fie suprascris de următoarea schimbare din sistemul de operare (consultați [systemDarkMode](./erd-editor-element.md#systemdarkmode) și [changePresetTheme](./erd-editor-element.md#changepresettheme)).
- Pachetul `@dineug/erd-editor-mcp` `1.0.0`, extensia pentru VS Code `4.0.0` sau o versiune ulterioară și pluginurile pentru Obsidian și JetBrains `1.0.0` sau o versiune ulterioară folosesc versiunea 2 a protocolului hubului. Serverul `1.0.0` și o versiune anterioară a unui editor care deservește agenți, sau o versiune anterioară a serverului și unul dintre aceste editoare, se refuză reciproc cu eroarea `protocolMismatch`, indicând partea care trebuie actualizată (consultați [Actualizarea](../mcp/installation.md#updating)).
- Un URL CDN fără versiune servește acum cea mai recentă versiune 4.x. Fixați `@3.10.0` pentru a rămâne pe 3.x (consultați [CDN](#cdn)).
