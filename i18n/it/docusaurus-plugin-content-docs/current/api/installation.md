---
sidebar_position: 1
description: Installare @dineug/erd-editor da npm o da una CDN, registrare gli elementi editor e viewer, collegare le finestre di dialogo dei file e aggiornare dalla versione 4.x o 3.x.
---

# Installazione

```sh
npm install @dineug/erd-editor
```

Il pacchetto è solo ESM (`"type": "module"`) e distribuisce soltanto la cartella `dist`.
Non esiste una build CommonJS, quindi `require('@dineug/erd-editor')` non funziona.

Contiene due elementi personalizzati: `<erd-editor>`, l’editor, e, dalla versione `5.0.0`, `<erd-viewer>`, che mostra un diagramma in sola lettura — vedere [ErdViewerElement](./erd-viewer-element.md).
Dalla versione `5.0.0` l’importazione della radice del pacchetto non definisce nessuno dei due. Ogni elemento ha un punto di ingresso proprio che lo definisce — vedere [Registrare gli elementi](#registering-the-elements).

Le sue dipendenze di runtime restano esterne, come import con il solo nome del pacchetto che il bundler risolve, deduplica e sottopone a tree shaking. Dalla versione `5.0.0` la sua `dist` contiene un file per modulo, quindi un bundler mantiene solo i moduli che una pagina raggiunge — vedere [Punti di ingresso](#entry-points).
I suoi worker condivisi vengono generati come file di ingresso separati in `dist/workers/` e costruiti con `new URL('./…', import.meta.url)`, la forma che Vite, webpack 5 e Rspack includono nel bundle come punto di ingresso di un worker. Vedere [Web Worker](#web-workers).
Per una pagina senza bundler esistono due build autonome — vedere [Tag script](#script-tag).

## Utilizzo {#usage}

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

`@dineug/erd-editor/erd-editor.js` definisce `<erd-editor>` nel momento in cui viene importato. Una pagina che si limita a mostrare un diagramma importa invece `@dineug/erd-editor/erd-viewer.js` — vedere [ErdViewerElement](./erd-viewer-element.md).

`<erd-editor>` non ha dimensioni intrinseche. Assegnare all’elemento (o al suo contenitore) una larghezza e un’altezza esplicite.
Dalla versione `4.1.0`, il pannello [Esplora](../guide/guides/explorer.md), quando è aperto, è ancorato all’interno dell’elemento a sinistra dell’area di disegno ERD e restringe l’area di disegno anziché coprirla. Un nuovo editor si avvia con il pannello chiuso.
Il pannello non viene disegnato con una larghezza inferiore a `200px` e lascia all’area di disegno almeno `320px`, quindi in un elemento più stretto di `520px` il pannello Esplora aperto non viene disegnato finché l’elemento non si allarga — vedere [Accanto all’area di disegno](../guide/guides/explorer.md#beside-the-canvas).

`setInitialValue('')` avvia un nuovo documento vuoto. Assegnando `value`, invece, il documento viene caricato come modifica e finisce quindi nella cronologia delle modifiche.
Dalla versione `4.0.0`, `editor.value` è il documento nella forma in cui è contenuto in un file, ed è ciò che va memorizzato. `editor.runtimeValue` è il documento così come lo contiene l’editor, entità rimosse incluse: serve a inizializzare un collaboratore e non finisce mai in un file — vedere [runtimeValue](./erd-editor-element.md#runtimevalue).
Dalla versione `4.0.0`, in un nuovo documento è inoltre attivo ogni [blocco delle impostazioni](../guide/guides/settings.md#lock): l’area visibile, la scheda, il linguaggio del Generatore di codice, entrambi gli stili dei nomi, il tipo di delimitatore e, dalla versione `4.2.0`, la [Visualizzazione nomi](../guide/guides/logical-names.md#name-view). Scorrere, eseguire lo zoom, cambiare scheda, cambiare la Visualizzazione nomi o modificare una delle altre impostazioni lascia `editor.value` invariato e non emette alcun evento `change`. Un documento caricato da testo mantiene i blocchi che indica. Un documento che non ne indica nessuno, come qualsiasi file salvato prima della versione `4.0.0`, si apre con tutti i blocchi attivi, con lo zoom al 100% e sulla scheda ERD, qualunque area visibile e scheda abbia salvato. La sua area visibile è bloccata sull’origine `0, 0` e, se lì non viene disegnata alcuna parte del diagramma, la vista si apre invece sul diagramma — vedere [setInitialValue](./erd-editor-element.md#setinitialvalue).
Un file salvato prima della versione `4.2.0` si apre con la Visualizzazione nomi bloccata su `Physical Names`, anche se ha ogni altro blocco disattivato. Un editor della versione `4.0.0` o `4.1.0` mantiene il blocco della Visualizzazione nomi così com’è durante un salvataggio, ma scarta la vista, quindi un file `4.2.0` salvato con la Visualizzazione nomi sbloccata resta sbloccato ma si riapre su `Physical Names`.
Per il resto dell’API, vedere [ErdEditorElement](./erd-editor-element.md).

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

`esm.run` risolve automaticamente le dipendenze esterne del pacchetto, quindi questo codice funziona senza bundler.
Ogni punto di ingresso si raggiunge con il suo percorso dopo la versione: `…/erd-editor.js` definisce l’editor e `…/erd-viewer.js` il viewer, che scarica dalla CDN ogni lingua di visualizzazione tranne l’inglese quando una pagina la richiede. L’URL del solo pacchetto, `https://esm.run/@dineug/erd-editor@5.0.0`, fornisce la radice, che non definisce alcun elemento.
Un URL senza versione fornisce sempre la versione più recente. Fissare una versione, come sopra, se non si vuole che una nuova versione principale arrivi sulla pagina senza preavviso.
La `5.0.0` è proprio una di queste: una pagina che deve restare alla versione 4.x fissa `@4.2.0` — vedere [Aggiornamento dalla versione 4.x](#upgrading-from-4x).

`esm.run` fornisce i worker condivisi da `cdn.jsdelivr.net`, e un browser non avvia alcun worker condiviso da un’origine diversa da quella della pagina. Quindi un editor caricato in questo modo funziona senza i suoi worker, come su un host che li blocca — vedere [Web Worker](#web-workers). La build per [tag script](#script-tag) li contiene all’interno del proprio file.

### Tag script {#script-tag}

Dalla versione `3.6.0`, il pacchetto distribuisce anche una build UMD che contiene in un unico file tutte le dipendenze e tutti i worker condivisi, `dist/erd-editor.umd.js`.
È il file a cui puntano i campi `unpkg` e `jsdelivr`, per cui lo fornisce l’URL del solo pacchetto su ciascuna delle due CDN, e definisce `window.ErdEditor`.

```html
<erd-editor></erd-editor>
<script src="https://cdn.jsdelivr.net/npm/@dineug/erd-editor@5.0.0"></script>
<script>
  const editor = document.querySelector('erd-editor');
  editor.setInitialValue(localStorage.getItem('my-diagram') ?? '');
</script>
```

Il caricamento del file definisce `<erd-editor>`. `window.ErdEditor` contiene le due callback dei file, `ErdEditor.setExportFileCallback` e `ErdEditor.setImportFileCallback`, dalla versione `3.9.2` `ErdEditor.createKeyBindingMap`, dalla versione `4.2.0` `ErdEditor.dictionaryRowChords` — vedere [dictionaryRowChords](./erd-editor-element.md#dictionaryrowchords) — e dalla versione `5.0.0` `ErdEditor.ErdEditorElement` e `ErdEditor.defineErdEditor` — vedere [Registrare gli elementi](#registering-the-elements). Non contiene [toImage](./to-image.md).

Dalla versione `5.0.0` un secondo file, `dist/erd-viewer.umd.js`, definisce `<erd-viewer>` e mette `ErdViewerElement` e `defineErdViewer` su `window.ErdViewer`. Non avvia alcun worker, contiene tutte le 25 lingue di visualizzazione e non richiede altro che il `src` che riceve.

```html
<erd-viewer src="diagram.erd.json" style="display: block; height: 480px"></erd-viewer>
<script src="https://cdn.jsdelivr.net/npm/@dineug/erd-editor@5.0.0/dist/erd-viewer.umd.js"></script>
```

Nessuno dei due file definisce il tag dell’altro, e ciascuno non lascia nella pagina alcuna variabile globale oltre alla propria e a `window.Konva`.
La mappa delle esportazioni continua a indirizzare un bundler verso i moduli ES, quindi un’installazione da npm non utilizza mai nessuno dei due file.
Una pagina che non può caricare uno script proprio può invece incorporare il viewer ospitato su erd-editor.io/embed in un frame — vedere [Incorporare](../guide/guides/embedding.md).

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

Dalla versione `4.0.0`, `enable-locale-picker` aggiunge il selettore `Display Language` della barra degli strumenti ed `enable-welcome-screen` la schermata di benvenuto che compare in un diagramma vuoto — vedere [enableLocalePicker](./erd-editor-element.md#enablelocalepicker) e [enableWelcomeScreen](./erd-editor-element.md#enablewelcomescreen).
Una pagina che carica un documento, come in [Utilizzo](#usage), attiva `enableWelcomeScreen` dopo che `setInitialValue()` lo ha caricato, anziché nel markup, così la schermata non compare mai per un istante sopra un file ancora in caricamento.
L’editor contiene tutte le 25 lingue di visualizzazione, sia nella build ES sia nella build per tag script, quindi non c’è alcun file di lingua da servire né nulla da registrare. Senza il selettore e senza una chiamata a `setLocale()`, l’editor viene visualizzato in inglese.

Aggiungere qui `readonly` apre l’editor come lettore: l’assegnazione di `value`, la chiamata a `clear()` e ogni chiamata `setSchema*()` — comprese `setSchemaJSON()` e le aggiunte — vengono ignorate, e l’evento `change` non viene mai emesso. Le sue schede, il pannello Esplora e la Ricerca rapida restano disponibili per la lettura, e ogni controllo che modificherebbe il diagramma scompare.
La lettura di `editor.value` e `editor.runtimeValue` continua a funzionare ed entrambi mantengono le impostazioni proprie del documento: un’impostazione di visualizzazione che il lettore cambia, come lo zoom o il database, resta sullo schermo di quell’editor. Per caricare un documento, usare invece `setInitialValue()` — vedere [readonly](./erd-editor-element.md#readonly).

### Rendering lato server {#server-side-rendering}

Ogni punto di ingresso tranne `engine.js` e `peer.js` richiede un DOM, quindi in Node genera un’eccezione. `erd-editor.js` ed `erd-viewer.js` definiscono il proprio elemento nello scope del modulo, e la radice del pacchetto, che dalla versione `5.0.0` non definisce nulla, costruisce comunque entrambe le classi degli elementi quando viene caricata.
In Next.js, Nuxt, SvelteKit o Astro, importare il punto di ingresso dell’elemento da un percorso di codice eseguito solo sul client, e dallo stesso percorso anche un import con nome dalla radice, come `setExportFileCallback` o `toImage`.

```js
useEffect(() => {
  import('@dineug/erd-editor/erd-editor.js');
}, []);
```

### Vite {#vite}

In sviluppo, aggiungere al pre-bundling di Vite il bundle ELK importato dal worker di layout dell’editor, altrimenti i layout creati da quel worker falliscono: `Flow`, `Tree - vertical` e `Tree - horizontal` del Layout automatico, la modalità Flusso della scheda Visualizzazione e un’importazione disposta con il layout Flow.
Vite 7 e precedenti richiedono anche di tenere l’editor fuori dal pre-bundling, perché il loro pre-bundle fa puntare gli URL dei worker a file che non scrive mai, quindi tutti e tre i worker falliscono. Su Vite 8 omettere questo `exclude`, che fa soltanto scaricare al server di sviluppo ciascun file del pacchetto separatamente. Una build di produzione non richiede nessuno dei due.

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

L’importazione di `@dineug/erd-editor/erd-editor.js` unisce `erd-editor` a `HTMLElementTagNameMap`, e quella di `@dineug/erd-editor/erd-viewer.js` unisce `erd-viewer`, quindi l’elemento è tipizzato senza bisogno di un cast. Qualsiasi import dalla radice, anche solo di un tipo, li porta entrambi.

```ts
import '@dineug/erd-editor/erd-editor.js';
import type { ErdEditorElement } from '@dineug/erd-editor';

const editor = document.createElement('erd-editor'); // ErdEditorElement
const found = document.querySelector('erd-editor'); // ErdEditorElement | null
```

`ErdEditorElement` viene esportato per annotare le proprie variabili e props. Dalla versione `5.0.0` è anche la classe dell’elemento, e `ErdViewerElement` è l’interfaccia e la classe del viewer — vedere [Registrare gli elementi](#registering-the-elements).
Dalla versione `4.0.0`, il pacchetto esporta anche i tipi `LocaleCode`, `LocaleOption` e `SchemaSQLOptions`, e dalla versione `5.0.0` `ToImageOptions` — vedere [Punti di ingresso](#entry-points). Le opzioni accettate dai metodi `setSchema*()` non hanno un nome esportato; ricavarle dall’elemento, come `Parameters<ErdEditorElement['setSchemaSQL']>[1]`.
Dalla versione `5.0.0` i `typesVersions` del pacchetto tipizzano ogni punto di ingresso di sottopercorso anche con `moduleResolution: "node10"`, che non legge la mappa delle esportazioni.

## Registrare gli elementi {#registering-the-elements}

Dalla versione `5.0.0` il pacchetto definisce un tag solo dove una pagina glielo chiede.

| Import | Definisce |
| --- | --- |
| `@dineug/erd-editor/erd-editor.js` | `<erd-editor>` |
| `@dineug/erd-editor/erd-viewer.js` | `<erd-viewer>` |
| `@dineug/erd-editor` | Niente |

Ciascuno dei due punti di ingresso definisce il proprio tag quando viene valutato e non esporta nulla, quindi si importa per il suo effetto, e nessuno dei due definisce il tag dell’altro.
La radice esporta entrambe le classi degli elementi, `ErdEditorElement` ed `ErdViewerElement`, e `defineErdEditor()` e `defineErdViewer()`, che definiscono il proprio tag nel punto in cui vengono chiamate:

```js
import { defineErdEditor } from '@dineug/erd-editor';

defineErdEditor();
```

Una chiamata non fa nulla se il tag contiene già quella classe, quindi un punto di ingresso e una chiamata di definizione, o due chiamate di definizione, possono convivere in una pagina. Genera un `Error` che indica il tag quando lo contiene un’altra classe, come accadrebbe con una seconda copia del pacchetto inclusa nella stessa pagina: `Another element class already defines the custom element name erd-editor`.
Le classi della radice sono quelle che definiscono i punti di ingresso, quindi `customElements.get('erd-editor') === ErdEditorElement` dopo l’esecuzione di uno dei due. Finché il tag non è definito, `document.createElement('erd-editor')` crea un semplice `HTMLElement` senza alcun membro dell’editor, e `new ErdEditorElement()` genera un’eccezione.

Per un tag proprio, definire la classe con quel nome e aggiungere il tag a `HTMLElementTagNameMap` autonomamente. Farlo in una finestra che non carica né il punto di ingresso di quell’elemento né la sua build per [tag script](#script-tag) e non chiama alcuna funzione di definizione per esso, perché una classe accetta un solo nome per finestra:

```ts
import { ErdEditorElement } from '@dineug/erd-editor';

customElements.define('my-erd-editor', ErdEditorElement);

declare global {
  interface HTMLElementTagNameMap {
    'my-erd-editor': ErdEditorElement;
  }
}
```

Un bundle che contiene entrambi gli elementi fa sì che Vite e Rolldown segnalino un `INEFFECTIVE_DYNAMIC_IMPORT` una volta per ogni lingua di visualizzazione tranne l’inglese. Il viewer carica ciascuna di esse con un proprio `import()` e l’editor importa tutti i dizionari in una volta, quindi restano nel chunk dell’editor e si caricano con esso. Nulla fallisce, e un bundle con il solo viewer mantiene ogni lingua in un chunk separato.

## Evidenziazione della sintassi {#syntax-highlighting}

I pannelli Schema SQL e Generatore di codice sono evidenziati da [Shiki](https://shiki.style), in un worker condiviso dedicato, e dalla versione `4.0.0` lo sono anche gli script `Before tables` e `After tables` della scheda Schema SQL.
Dalla versione `3.7.0` non c’è nulla da installare né da registrare: il worker viene creato la prima volta che viene visualizzato un pannello di codice, quindi una pagina che non ne apre nessuno non scarica mai le grammatiche.

| | |
| --- | --- |
| Linguaggi | SQL, TypeScript, GraphQL, C#, Java, Kotlin, Scala, Go, Python, PHP, Rust, Swift, JSON, Mermaid |
| Temi | `github-dark` e `github-light`, in base all’aspetto chiaro o scuro dell’editor |

Sono esattamente i linguaggi generati dai pannelli: `JPA` viene evidenziato come Java, `SQLAlchemy` come Python, `TypeORM`, `Sequelize`, `Drizzle` e `Zod` come TypeScript, `Doctrine` come PHP, `SeaORM` come Rust, `JSON Schema` come JSON, e `DBML` e `AML` come SQL, la grammatica più vicina presente nel bundle — vedere [Generatore di codice](../guide/guides/code-generator.md).

Il motore delle espressioni regolari è scritto in puro JavaScript, quindi nessuna policy dell’host deve consentire `wasm-unsafe-eval`.
Dove `SharedWorker` non è disponibile — Chrome su Android precedente a Chrome 148, Safari precedente alla 16.4 — l’errore viene registrato e il codice appare come testo semplice; gli script restano comunque modificabili.

Aggiornamento dalla versione `3.6.0` o precedenti: `@dineug/erd-editor-shiki-worker` non viene più pubblicato e con esso è scomparso `setGetShikiServiceCallback`.
Rimuovere l’installazione e la registrazione; una pagina che caricava il worker da una CDN elimina anche quel secondo tag `<script>`.

## Web Worker {#web-workers}

L’editor esegue tre attività in `SharedWorker`: l’evidenziazione della sintassi, l’esportazione delle immagini e il layout delle tabelle alla base del [Layout automatico](../guide/guides/table-related-functions.md#auto-layout), della [modalità Flusso](../guide/guides/visualization.md#how-flow-is-placed) della scheda Visualizzazione e, dalla versione `4.0.0`, del posizionamento di uno schema importato.
Tutti e tre sono inclusi in `@dineug/erd-editor`. Nessuno di essi richiede configurazione, ma ciascuno può essere bloccato da un host.
Dalla versione `5.0.0` ogni worker viene costruito in un modulo proprio, quindi un bundle contiene solo i worker che i suoi moduli raggiungono: un bundle di [toImage](./to-image.md) senza alcun elemento contiene il solo worker di esportazione delle immagini, e `<erd-viewer>` non avvia alcun worker — vedere [Punti di ingresso](#entry-points).
Il worker che eseguiva la garbage collection del documento è stato rimosso nella versione `4.0.0`, insieme alla garbage collection stessa.

| Worker | Senza il worker |
| --- | --- |
| Evidenziazione della sintassi | I pannelli Schema SQL e Generatore di codice e gli script di Schema SQL restano testo semplice |
| Esportazione delle immagini | Il PNG, l’SVG, `Copy to clipboard`, l’anteprima della finestra di dialogo `Export image` e, dalla versione `5.0.0`, [toImage()](./to-image.md) vengono disegnati nel thread principale, bloccando la pagina durante il disegno |
| Layout delle tabelle | I layout `Flow`, `Tree - vertical` e `Tree - horizontal` del Layout automatico, e la modalità Flusso della scheda Visualizzazione, terminano con `Could not place tables`; un’importazione disposta con il layout Flow — un file SQL, GraphQL, DBML o AML da `Import` o `Import and Add`, oppure una chiamata `setSchema*()` con `placement: 'auto'` — colloca le sue tabelle in righe, senza alcun messaggio; `Force` e la modalità Grafo non sono interessati, poiché vengono eseguiti all’interno dell’editor |

L’esportazione delle immagini attende per dieci secondi la risposta del suo worker e poi disegna nel thread principale, mentre l’evidenziazione della sintassi lascia il codice come testo semplice non appena il suo worker fallisce, quindi un host che blocca i worker penalizza le prestazioni anziché le funzionalità.
Il layout delle tabelle è l’eccezione: il motore che calcola un layout pesa più dell’editor stesso e non viene mai caricato nello stesso processo, quindi al primo posizionamento attende il suo worker per trenta secondi e, una volta che il worker ha risposto, concede sessanta secondi per la restituzione di un layout.
Se una delle due attese scade, il posizionamento termina come senza il worker. Il Layout automatico mostra `Placing tables` non appena inizia, mentre la modalità Flusso e un’importazione disposta con il layout Flow lo mostrano solo quando un posizionamento, avvio del worker compreso, è in corso da sei secondi.

Vite, webpack 5 e Rspack generano i worker come file accanto ai chunk. esbuild, e Rolldown usato da solo anziché tramite Vite, non ne generano alcuno, quindi una pagina costruita con essi funziona senza i worker.
Con l’opzione sperimentale `experiments.outputModule` di webpack non si avvia alcun worker, perché ciascuno attende un chunk separato da esso che nessuno carica. Mantenere l’output predefinito di webpack, oppure impostare `optimization.splitChunks: false`.

### Content Security Policy {#content-security-policy}

Una pagina con una Content Security Policy restrittiva richiede queste direttive per gli elementi:

- `worker-src 'self'` per la build per bundler, i cui worker sono file accanto al pacchetto, più `blob:` dove il bundler incorpora un worker inline. Nella build per [tag script](#script-tag) tutti e tre viaggiano all’interno del file come URL `data:`, quindi quella pagina richiede invece `worker-src data:`. `<erd-viewer>` non richiede né l’una né l’altra, perché non avvia alcun worker.
- Dalla versione `5.0.0` entrambi gli elementi applicano il proprio stile con fogli di stile costruiti, che `style-src 'self'` lascia passare. I pannelli di codice dell’editor colorano comunque il testo con attributi `style`, e l’anteprima della finestra di dialogo `Export image` è un’immagine a un URL `blob:`, quindi l’editor richiede anche `style-src 'unsafe-inline'` e `img-src blob:`.
- Un browser senza fogli di stile costruiti, come Firefox precedente alla 101, riceve invece elementi `<style>`, che richiedono `style-src 'unsafe-inline'` per entrambi gli elementi.
- `<erd-viewer>` scarica il proprio `src`, quindi quell’origine va in `connect-src` — vedere [Che cosa aggiunge a una pagina](./erd-viewer-element.md#what-it-adds-to-a-page).

## Punti di ingresso {#entry-points}

Il pacchetto ha cinque punti di ingresso:

| Punto di ingresso | Che cos’è |
| --- | --- |
| `@dineug/erd-editor` | La radice: le esportazioni qui sotto. Dalla versione `5.0.0` non definisce alcun elemento, anche se per essere caricata richiede ancora un DOM |
| `@dineug/erd-editor/erd-editor.js` | Dalla versione `5.0.0`. Definisce `<erd-editor>` e non esporta nulla |
| `@dineug/erd-editor/erd-viewer.js` | Dalla versione `5.0.0`. Definisce `<erd-viewer>` e non esporta nulla |
| `@dineug/erd-editor/engine.js` | Lo store del documento senza DOM |
| `@dineug/erd-editor/peer.js` | Dalla versione `3.9.1`. Il peer headless del server MCP |

La radice esporta entrambe le classi degli elementi e le loro funzioni di definizione, due setter di callback, dalla versione `3.9.2` le associazioni di tasti predefinite con i relativi tipi, dalla versione `4.0.0` i tipi della lingua di visualizzazione e il tipo delle opzioni di `getSchemaSQL()`, dalla versione `4.2.0` le combinazioni di tasti per le righe della scheda Dizionario e dalla versione `5.0.0` `toImage`.

| Esportazione | Descrizione |
| --- | --- |
| `ErdEditorElement` | L’interfaccia dell’elemento — vedere [ErdEditorElement](./erd-editor-element.md). Dalla versione `5.0.0` è anche la sua classe, quella con cui è definito `<erd-editor>` — vedere [Registrare gli elementi](#registering-the-elements). |
| `ErdViewerElement` | Dalla versione `5.0.0`. L’interfaccia e la classe del viewer — vedere [ErdViewerElement](./erd-viewer-element.md). |
| `defineErdEditor()`, `defineErdViewer()` | Dalla versione `5.0.0`. Definiscono `<erd-editor>` o `<erd-viewer>` con la rispettiva classe. Una chiamata non fa nulla se il tag contiene già quella classe e genera un `Error` se lo contiene un’altra classe — vedere [Registrare gli elementi](#registering-the-elements). |
| `toImage(value, options)` | Dalla versione `5.0.0`. Disegna un documento come `Blob` PNG o come stringa SVG, con le opzioni della finestra di dialogo `Export image` — vedere [toImage](./to-image.md). |
| `ToImageOptions` (tipo) | Dalla versione `5.0.0`. Le opzioni accettate da `toImage()`: `format`, `background`, `darkMode` e `scale`. |
| `setExportFileCallback(cb)` | Sostituisce il download del browser, `(blob, { fileName }) => void`. |
| `setImportFileCallback(cb)` | Sostituisce il selettore di file del browser, `({ type, op, accept, mode }) => void`; `mode` dalla versione `4.0.0`. Dalla versione `4.2.0` il comando `Import CSV` della scheda Dizionario apre il selettore del browser anche quando è impostata una callback — vedere [Finestre di dialogo dei file](#file-dialogs). |
| `createKeyBindingMap()` | Restituisce a ogni chiamata le associazioni di tasti predefinite come una nuova `KeyBindingMap` — vedere [createKeyBindingMap](./erd-editor-element.md#createkeybindingmap). |
| `KeyBindingMap`, `KeyBindingName`, `ShortcutOption` (tipi) | Una mappa delle associazioni, l’unione dei nomi dei suoi comandi e una singola associazione. |
| `dictionaryRowChords(map)` | Dalla versione `4.2.0`. Restituisce, come un nuovo `ShortcutOption[]` a ogni chiamata, le combinazioni di tasti con cui la griglia della scheda [Dizionario](../guide/guides/dictionary.md#adding-and-deleting-rows) inserisce ed elimina righe in base alla `KeyBindingMap` passata. Quella che inserisce righe sopra, `Alt+Shift+Enter` con le associazioni predefinite, non fa parte di alcuna associazione — vedere [dictionaryRowChords](./erd-editor-element.md#dictionaryrowchords). |
| `LocaleCode`, `LocaleOption` (tipi) | Dalla versione `4.0.0`. I 25 codici delle lingue di visualizzazione e quegli stessi codici più `'system'`, che è quanto accetta `setLocale()` — vedere [Lingua di visualizzazione](./erd-editor-element.md#display-language). |
| `SchemaSQLOptions` (tipo) | Dalla versione `4.0.0`. Le opzioni accettate da `getSchemaSQL()`: `statements`, `header` e, dalla versione `4.2.0`, `logicalNameAsComment` — vedere [getSchemaSQL](./erd-editor-element.md#getschemasql). |

Dalla versione `5.0.0` `dist` contiene un file non minificato per modulo, ciascuno accanto alla propria dichiarazione, e il campo `sideEffects` di `package.json` nomina solo i due punti di ingresso dei tag e i due stub di cui hanno bisogno i file dei worker. Quindi un bundler scarta ogni modulo che una pagina non raggiunge e minifica una sola volta:

- Un import con nome dalla radice, come `setExportFileCallback`, non include né alcun elemento né alcun worker.
- `toImage` porta il worker di esportazione delle immagini e nessun elemento.
- `erd-editor.js` porta l’editor e tutti e tre i worker condivisi.
- `erd-viewer.js` porta il viewer e nessun worker, con l’inglese al suo interno e ogni altra lingua di visualizzazione in un chunk separato, caricato quando una pagina lo richiede.

`@dineug/erd-editor/engine.js` esegue lo store del documento senza DOM, quindi funziona in un Web Worker — vedere [Archiviazione remota](./advanced/remote-storage.md).
Esporta `createReplicationStore` e il tipo `ReplicationStore`. Dalla versione `3.10.0` esporta anche il tipo `ReplicationChange`, `{ value: string; changed: boolean }`, ricevuto dal gestore `change` di una replica — vedere [on@change](./advanced/remote-storage.md#onchange).
Dalla versione `4.0.0`, un `ReplicationStore` ha anche un `runtimeValue`. Il suo `value` e quello consegnato da un `change` sono nella forma di archiviazione contenuta in un file, come quello dell’elemento — vedere [ReplicationStore](./advanced/remote-storage.md#replicationstore).

`@dineug/erd-editor/peer.js` è il peer headless tramite il quale il [server MCP](../mcp/introduction.md) modifica un documento. Esiste per quel server e queste pagine non lo documentano.

### Finestre di dialogo dei file {#file-dialogs}

L’importazione e l’esportazione passano attraverso callback iniettabili, quindi un host senza la finestra di dialogo dei file del browser — ad esempio una webview di un IDE — può fornire la propria.
Le due operazioni non sono simmetriche: l’esportazione consegna il file finito, mentre l’importazione si limita a richiederne uno, e il contenuto va reinserito autonomamente.
Dalla versione `4.2.0` il comando `Import CSV` della scheda Dizionario è l’unica importazione che non chiama mai la callback di importazione, il cui `type` non ha alcun valore CSV. Apre sempre il selettore di file del browser, per i file `.csv` — vedere [Importare ed esportare file CSV](../guide/guides/dictionary.md#importing-and-exporting-csv).

`op` è `set` o `diff` — un `diff` va a `setDiffValue()`, qualunque sia il `type`. Altrimenti `type` sceglie il metodo e `accept` contiene le estensioni di quel tipo, pronte da passare a una finestra di dialogo dei file dell’host.
Dalla versione `4.0.0`, un `set` contiene `mode: 'append'` quando l’utente ha scelto [Importa e aggiungi](../guide/guides/file-import-export.md#import-and-add), e nessun `mode` per una semplice importazione. Inoltrarlo: una callback che lo scarta sostituisce il diagramma a cui l’utente ha chiesto di aggiungere.

| `type` | `accept` | Metodo |
| --- | --- | --- |
| `json` | `.json` | `editor.setSchemaJSON(text, { mode })` |
| `sql` | `.sql` | `editor.setSchemaSQL(text, { placement: 'auto', mode })` |
| `graphql` | `.graphql,.gql,.graphqls` | `editor.setSchemaGraphQL(text, { placement: 'auto', mode })` |
| `dbml` | `.dbml` | `editor.setSchemaDBML(text, { placement: 'auto', mode })` |
| `aml` | `.aml` | `editor.setSchemaAML(text, { placement: 'auto', mode })` |

`placement: 'auto'` dispone le tabelle in base alle loro relazioni prima che vengano inserite, come fa l’importazione dell’editor stesso, e fa sì che la chiamata restituisca una Promise. Senza questa opzione le tabelle vengono inserite subito in righe — vedere [setSchemaSQL](./erd-editor-element.md#setschemasql) e [setSchemaJSON](./erd-editor-element.md#setschemajson).

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

Prevedere un ramo per ogni `type` gestito e ignorare tutti gli altri.
Una chiamata `setSchemaJSON()` che sostituisce il documento, come l’assegnazione di `value`, lo svuota prima dell’analisi, quindi indirizzarvi un contenuto che non è un documento `.erd.json` — tramite un `else` generico, oppure perché un `type` aggiunto in seguito è ricaduto in quel ramo — svuota il diagramma invece di importare qualcosa.

Il `fileName` generato dall’editor è `<database name>-<timestamp>` più l’estensione del file, dove il timestamp è l’ora locale nel formato `yyyy-MM-dd'T'HH_mm_ss`. Se il nome del database è vuoto, si usa `unnamed`. Un file CSV della scheda Dizionario indica il proprio foglio prima dell’estensione, come in `<database name>-<timestamp>-words.csv`.
La callback di esportazione riceve questi file. Dalla versione `4.0.0` tra questi ci sono anche l’SVG e i file del Generatore di codice, e il `.sql` proviene dal pulsante `Save file` della scheda Schema SQL anziché direttamente da `Export`. Dalla versione `4.2.0` tra questi c’è anche il file CSV della scheda Dizionario. [toImage()](./to-image.md) non chiama nessuna delle due callback: restituisce l’immagine direttamente a chi lo chiama.

| File | Estensione | `type` del Blob |
| --- | --- | --- |
| L’esportazione JSON | `.erd.json` | `application/json` |
| Il pulsante `Save file` della scheda Schema SQL, che salva il testo mostrato nella scheda — vedere [Schema SQL](../guide/guides/schema-sql.md) | `.sql` | nessuno |
| La finestra di dialogo [Esporta immagine](../guide/guides/file-import-export.md#image) | `.png` o `.svg` | `image/png` o `image/svg+xml` |
| Il pulsante `Save file` della scheda Generatore di codice — vedere [Generatore di codice](../guide/guides/code-generator.md) | Quella del linguaggio: `.cs`, `.go`, `.java`, `.kt`, `.php`, `.rs`, `.scala`, `.swift`, `.ts`, `.py`, `.aml`, `.dbml`, `.graphql`, `.json` o `.mmd` | nessuno |
| Il comando `Export CSV` della scheda Dizionario, che salva ogni riga del foglio visualizzato, qualunque cosa elenchi la sua ricerca — vedere [Importare ed esportare file CSV](../guide/guides/dictionary.md#importing-and-exporting-csv) | `.csv` | `text/csv` |

Un host che sceglie un gestore in base all’estensione deve averne uno per ciascuno di essi.

Se le callback non sono impostate, l’editor usa il comportamento di download e di selezione dei file del browser. Passare `null` per tornare a questo comportamento.

## Browser supportati {#browser-support}

Chrome 91+, Edge 94+, Firefox 93+, Safari 16.4+ — la base ES2022 per cui sono compilati i bundle pubblicati.
Non è incluso alcun polyfill. Aggiungere i propri se è necessario supportare browser meno recenti.

## Aggiornamento dalla versione 4.x {#upgrading-from-4x}

La `5.0.0` è una versione principale. Quando si migra una pagina dalla versione 4.x, verificare ciascuno dei punti seguenti:

- `import '@dineug/erd-editor'` non definisce più `<erd-editor>`. Importare invece `@dineug/erd-editor/erd-editor.js` per il suo effetto, oppure chiamare `defineErdEditor()`, e lasciare invariati gli import con nome dalla radice. TypeScript non segnala una pagina rimasta con l’import semplice, perché le dichiarazioni della radice nominano ancora il tag in `HTMLElementTagNameMap`, ma l’elemento che crea è un semplice `HTMLElement`, quindi la prima chiamata a un suo metodo genera un `TypeError` — vedere [Registrare gli elementi](#registering-the-elements).

  ```diff
  -import '@dineug/erd-editor';
  +import '@dineug/erd-editor/erd-editor.js';
   import { setExportFileCallback } from '@dineug/erd-editor';
  ```

- Su una CDN vale lo stesso per `https://esm.run/@dineug/erd-editor`, che ora fornisce la radice e non definisce nulla: importare `https://esm.run/@dineug/erd-editor@5.0.0/erd-editor.js`. Gli URL jsDelivr e unpkg del solo pacchetto continuano a fornire la build per tag script, che definisce `<erd-editor>` come prima. Un URL senza versione ora fornisce la versione 5.x più recente; fissare `@4.2.0` per restare alla versione 4.x — vedere [CDN](#cdn) e [Tag script](#script-tag).
- La radice non definisce nulla ma richiede ancora un DOM, quindi con il rendering lato server un import con nome da essa, come `setExportFileCallback`, resta sul percorso solo client accanto al punto di ingresso dell’elemento — vedere [Rendering lato server](#server-side-rendering).
- `window.ErdEditor` acquisisce `ErdEditorElement` e `defineErdEditor`. La build per tag script del viewer mette `ErdViewerElement` e `defineErdViewer` su `window.ErdViewer`, e nessuna delle due variabili globali contiene `toImage`.
- Un editor `readonly` si apre come lettore. Le sue sei schede, il pannello Esplora, la Ricerca rapida e la presenza restano, e ogni controllo che modificherebbe il diagramma scompare anziché essere disabilitato: la barra degli strumenti mostra il nome del database come testo, la scheda Impostazioni mostra le sue impostazioni con ogni controllo disabilitato sotto un badge `Read only`, e la barra degli strumenti mobile mantiene solo lo zoom, la Visualizzazione nomi, la modalità zen e la bussola, quindi `Hand` e `Select` scompaiono e un trascinamento sposta la vista. Una pressione non seleziona nulla: l’unica selezione è il contorno che un salto dal pannello Esplora o dalla Ricerca rapida mette attorno a ciò che raggiunge, e che un clic fermo cancella, e le scorciatoie di selezione totale non selezionano nulla. L’attivazione di `readonly` termina ciò che era aperto, come la selezione, lo strumento mano, un editor di cella, un trascinamento, Associa colonne, l’anteprima `Force` del Layout automatico e Time Travel, e mantiene lo scorrimento, lo zoom, la scheda e la Visualizzazione nomi — vedere [readonly](./erd-editor-element.md#readonly).
- Le impostazioni che un lettore `readonly` cambia restano sullo schermo di quell’editor qualunque sia il loro blocco: lo scorrimento e lo zoom, la scheda, la Visualizzazione nomi, View Option, il database e il linguaggio, gli stili dei nomi e il tipo di delimitatore del Generatore di codice. `value`, `runtimeValue` e l’esportazione JSON mantengono quelli propri del documento, che le modifiche di un lettore 4.x potevano raggiungere, e `getSharedStore()` non ne invia nessuno agli altri editor. `getSchemaSQL()` senza un fornitore scrive il database scelto dal lettore. La disattivazione di `readonly` riporta il database, le impostazioni del codice e View Option a quelli del documento e lascia lo scorrimento, lo zoom, la scheda e la Visualizzazione nomi dove il lettore li ha lasciati.
- La riga `Recalculation table width` della scheda Impostazioni non c’è più. Un caricamento e un’operazione di incolla adattano comunque la larghezza di ogni tabella al suo testo.
- Su Vite 8 eliminare da `optimizeDeps` un `exclude: ['@dineug/erd-editor']`, che serve ancora solo a Vite 7 e precedenti, e mantenere l’`include` di ELK — vedere [Vite](#vite).

## Aggiornamento dalla versione 3.x {#upgrading-from-3x}

La `4.0.0` è una versione principale. Quando si migra una pagina dalla versione 3.x, verificare ciascuno dei punti seguenti, e poi quelli di [Aggiornamento dalla versione 4.x](#upgrading-from-4x) per la `5.0.0`:

- `editor.value`, il `value` di una replica e il `value` consegnato dal suo `change` sono nella forma di archiviazione contenuta in un file: senza entità rimosse, larghezze misurate, ordine di sovrapposizione né punti di ancoraggio delle relazioni. Continuare a salvare `value` e leggere questi dati da `runtimeValue`; i timestamp delle entità (`meta`) sono stati eliminati del tutto. Inizializzare un collaboratore o una replica che si unisce a una sessione in corso dal `runtimeValue` di un peer in esecuzione, non da `value` né dal file, e non salvare mai `runtimeValue` — vedere [value](./erd-editor-element.md#value) e [runtimeValue](./erd-editor-element.md#runtimevalue).
- I blocchi delle impostazioni sostituiscono `Save Scroll Information` e `Save Zoom Information`. Un nuovo documento, e qualsiasi documento salvato prima della versione `4.0.0`, ha tutti i blocchi attivi, quindi uno scorrimento, uno zoom, un cambio di scheda o una modifica del linguaggio del Generatore di codice, di uno stile dei nomi o del tipo di delimitatore lascia `value` invariato e non emette alcun evento `change`. Una pagina che conservava la vista tramite `change` richiede `Viewport` (e `Canvas Type` per la scheda) sbloccati nella scheda Impostazioni, oppure un documento il cui `settings.lockSettings` lascia azzerati quei bit — vedere [Blocco](../guide/guides/settings.md#lock).
- `settings` non ha più `width`, `height`, `scrollTop`, `scrollLeft`, `relationshipOptimization` né `ignoreSaveSettings`, e le costanti `SaveSettingType` sono state eliminate. `settings.lockSettings`, con i bit `LockSettingType`, prende il posto di `ignoreSaveSettings`, che la versione `4.0.0` o successiva non legge né scrive — vedere [Settings](./advanced/schema.md#settings).
- Il [JSON Schema](./advanced/schema.md#json-schema) indicato da ogni file in `$schema` ora descrive solo la forma di archiviazione ed è chiuso: rifiuta un file salvato da una versione precedente finché un salvataggio con la versione `4.0.0` o successiva non lo riscrive.
- La garbage collection del documento è stata eliminata insieme al suo worker, quindi un’entità rimossa resta in `runtimeValue` fino alla successiva apertura del documento dal suo file. Restano tre worker condivisi — vedere [Web Worker](#web-workers).
- Mantenere ogni editor e replica di una sessione condivisa sulla versione `4.0.0` o successiva. Una versione precedente ignora i nuovi tipi di azione: quelli dei gruppi di tabelle, di Associa colonne, dei blocchi e degli script di Schema SQL — vedere [Combinare versioni diverse](./advanced/collaborative-editing.md#mixing-releases).
- La callback di importazione riceve `mode: 'append'` per Importa e aggiungi, e una callback deve inoltrarlo. La callback di esportazione ora riceve anche i file `.svg` e quelli del Generatore di codice, e `Export` ▸ `Schema SQL` apre la scheda Schema SQL invece di salvare, quindi il `.sql` arriva solo dal pulsante `Save file` di quella scheda — vedere [Finestre di dialogo dei file](#file-dialogs).
- `Delete` e `Backspace` sono associati al nuovo comando `removeSelection`. Quando l’editor ha il focus al di fuori di un campo di testo, il comportamento predefinito del tasto viene impedito in ogni scheda e, nella scheda ERD, la selezione viene rimossa. `KeyBindingName` e `KeyBindingMap` ora lo includono, e `setKeyBindingMap({ removeSelection: [] })` lascia entrambi i tasti alla pagina — vedere [setKeyBindingMap](./erd-editor-element.md#setkeybindingmap).
- `ThemeOptions.appearance` accetta anche `'system'`, l’opzione `System` del generatore di temi, che viene impostata attivando `systemDarkMode`. `changePresetTheme` segnala `'system'` finché è selezionato, quindi memorizzarlo così com’è e ripassarlo a `setPresetTheme`. Con `systemDarkMode` attivo, un `setPresetTheme()` con `'light'` o `'dark'` ora resta valido invece di essere sovrascritto dal successivo cambiamento del sistema operativo — vedere [systemDarkMode](./erd-editor-element.md#systemdarkmode) e [changePresetTheme](./erd-editor-element.md#changepresettheme).
- `@dineug/erd-editor-mcp` `1.0.0` o successiva, l’estensione per VS Code `4.0.0` o successiva e i plugin per Obsidian e JetBrains `1.0.0` o successivi usano la versione 2 del protocollo dell’hub. Il server `1.0.0` o successivo e una versione precedente dell’editor che serve gli agenti, oppure un server precedente e uno di questi editor, si rifiutano a vicenda con `protocolMismatch`, indicando la parte da aggiornare — vedere [Aggiornamento](../mcp/installation.md#updating).
- Un URL CDN senza versione fornisce la versione più recente, la 5.x dalla versione `5.0.0`. Fissare `@3.10.0` per restare alla versione 3.x — vedere [CDN](#cdn).
