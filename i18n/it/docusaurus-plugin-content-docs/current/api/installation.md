---
sidebar_position: 1
description: Installare @dineug/erd-editor da npm o da una CDN, montare l’elemento personalizzato, collegare le finestre di dialogo dei file e aggiornare dalla versione 3.x.
---

# Installazione

```sh
npm install @dineug/erd-editor
```

Il pacchetto è solo ESM (`"type": "module"`) e distribuisce soltanto la cartella `dist`.
Non esiste una build CommonJS, quindi `require('@dineug/erd-editor')` non funziona.

Le sue dipendenze di runtime restano esterne, come import con il solo nome del pacchetto che il bundler risolve, deduplica e sottopone a tree shaking.
I suoi worker condivisi vengono generati come file di ingresso separati in `dist/workers/` e costruiti con `new URL('./…', import.meta.url)`, la forma che Vite, webpack 5 e Rspack includono nel bundle come punto di ingresso di un worker. Vedere [Web Worker](#web-workers).
Per una pagina senza bundler esiste una seconda build autonoma — vedere [Tag script](#script-tag).

## Utilizzo {#usage}

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

`<erd-editor>` non ha dimensioni intrinseche. Assegnare all’elemento (o al suo contenitore) una larghezza e un’altezza esplicite.
Dalla versione `4.1.0`, il pannello [Esplora](../guide/guides/explorer.md), quando è aperto, è ancorato all’interno dell’elemento a sinistra dell’area di disegno ERD e restringe l’area di disegno anziché coprirla. Un nuovo editor si avvia con il pannello chiuso.
Il pannello non viene disegnato con una larghezza inferiore a `200px` e lascia all’area di disegno almeno `320px`, quindi in un elemento più stretto di `520px` il pannello Esplora aperto non viene disegnato finché l’elemento non si allarga — vedere [Accanto all’area di disegno](../guide/guides/explorer.md#beside-the-canvas).

`setInitialValue('')` avvia un nuovo documento vuoto. Assegnando `value`, invece, il documento viene caricato come modifica e finisce quindi nella cronologia delle modifiche.
Dalla versione `4.0.0`, `editor.value` è il documento nella forma in cui è contenuto in un file, ed è ciò che va memorizzato. `editor.runtimeValue` è il documento così come lo contiene l’editor, entità rimosse incluse: serve a inizializzare un collaboratore e non finisce mai in un file — vedere [runtimeValue](./erd-editor-element.md#runtimevalue).
Dalla versione `4.0.0`, in un nuovo documento è inoltre attivo ogni [blocco delle impostazioni](../guide/guides/settings.md#lock): l’area visibile, la scheda, il linguaggio del Generatore di codice, entrambi gli stili dei nomi e il tipo di delimitatore. Scorrere, eseguire lo zoom, cambiare scheda o modificare una di queste impostazioni lascia `editor.value` invariato e non emette alcun evento `change`. Un documento caricato da testo mantiene i blocchi che indica. Un documento che non ne indica nessuno, come qualsiasi file salvato prima della versione `4.0.0`, si apre con tutti i blocchi attivi, con lo zoom al 100% e sulla scheda ERD, qualunque vista e scheda abbia salvato. La sua vista è bloccata sull’origine `0, 0` e, se lì non viene disegnata alcuna parte del diagramma, si apre invece sul diagramma — vedere [setInitialValue](./erd-editor-element.md#setinitialvalue).
Per il resto dell’API, vedere [ErdEditorElement](./erd-editor-element.md).

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

`esm.run` risolve automaticamente le dipendenze esterne del pacchetto, quindi questo codice funziona senza bundler.
L’URL senza versione fornisce sempre la versione più recente. Fissare una versione — `https://esm.run/@dineug/erd-editor@4.1.0` — se non si vuole che una nuova versione principale arrivi sulla pagina senza preavviso.
La `4.0.0` è proprio una di queste: una pagina che deve restare alla versione 3.x fissa `@3.10.0` — vedere [Aggiornamento dalla versione 3.x](#upgrading-from-3x).

### Tag script {#script-tag}

Dalla versione `3.6.0`, il pacchetto distribuisce anche una build UMD che contiene in un unico file tutte le dipendenze e tutti i worker condivisi.
È il file a cui puntano i campi `unpkg` e `jsdelivr`, per cui lo fornisce l’URL del solo pacchetto su ciascuna delle due CDN, e definisce `window.ErdEditor`.

```html
<erd-editor></erd-editor>
<script src="https://cdn.jsdelivr.net/npm/@dineug/erd-editor@4.1.0"></script>
<script>
  const editor = document.querySelector('erd-editor');
  editor.setInitialValue(localStorage.getItem('my-diagram') ?? '');
</script>
```

L’importazione del file registra `<erd-editor>` allo stesso modo; `window.ErdEditor` contiene le due callback dei file, `ErdEditor.setExportFileCallback` e `ErdEditor.setImportFileCallback`, e, dalla versione `3.9.2`, `ErdEditor.createKeyBindingMap`.
La mappa delle esportazioni continua a indirizzare un bundler verso i moduli ES, quindi un’installazione da npm non utilizza mai questo file.

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

Dalla versione `4.0.0`, `enable-locale-picker` aggiunge il selettore `Display Language` della barra degli strumenti ed `enable-welcome-screen` la schermata di benvenuto che compare in un diagramma vuoto — vedere [enableLocalePicker](./erd-editor-element.md#enablelocalepicker) e [enableWelcomeScreen](./erd-editor-element.md#enablewelcomescreen).
Una pagina che carica un documento, come in [Utilizzo](#usage), attiva `enableWelcomeScreen` dopo che `setInitialValue()` lo ha caricato, anziché nel markup, così la schermata non compare mai per un istante sopra un file ancora in caricamento.
Tutte le 25 lingue di visualizzazione sono incluse nel pacchetto, sia nella build ES sia nella build per tag script, quindi non c’è alcun file di lingua da servire né nulla da registrare. Senza il selettore e senza una chiamata a `setLocale()`, l’editor viene visualizzato in inglese.

Aggiungere qui `readonly` blocca la modifica: l’assegnazione di `value`, la chiamata a `clear()` e ogni chiamata `setSchema*()` — comprese `setSchemaJSON()` e le aggiunte — vengono ignorate, e l’evento `change` non viene mai emesso. La lettura di `editor.value` e `editor.runtimeValue` continua a funzionare. Per caricare un documento, usare invece `setInitialValue()`.

### Rendering lato server {#server-side-rendering}

L’importazione del pacchetto registra l’elemento personalizzato nello scope del modulo, quindi richiede un DOM e in Node genera un’eccezione.
In Next.js, Nuxt, SvelteKit o Astro, importarlo da un percorso di codice eseguito solo sul client.

```js
useEffect(() => {
  import('@dineug/erd-editor');
}, []);
```

### TypeScript {#typescript}

L’importazione del pacchetto unisce `erd-editor` a `HTMLElementTagNameMap`, quindi l’elemento è tipizzato senza bisogno di un cast.

```ts
import '@dineug/erd-editor';
import type { ErdEditorElement } from '@dineug/erd-editor';

const editor = document.createElement('erd-editor'); // ErdEditorElement
const found = document.querySelector('erd-editor'); // ErdEditorElement | null
```

`ErdEditorElement` viene esportato per annotare le proprie variabili e props.
Dalla versione `4.0.0`, il pacchetto esporta anche i tipi `LocaleCode`, `LocaleOption` e `SchemaSQLOptions` — vedere [Punti di ingresso](#entry-points). Le opzioni accettate dai metodi `setSchema*()` non hanno un nome esportato; ricavarle dall’elemento, come `Parameters<ErdEditorElement['setSchemaSQL']>[1]`.

## Evidenziazione della sintassi {#syntax-highlighting}

I pannelli Schema SQL e Generatore di codice sono evidenziati da [Shiki](https://shiki.style), in un worker condiviso dedicato, e dalla versione `4.0.0` lo sono anche gli script `Before tables` e `After tables` della scheda Schema SQL.
Dalla versione `3.7.0` non c’è nulla da installare né da registrare: il worker viene creato la prima volta che viene visualizzato un pannello di codice, quindi una pagina che non ne apre nessuno non scarica mai le grammatiche.

| | |
| --- | --- |
| Linguaggi | SQL, TypeScript, GraphQL, C#, Java, Kotlin, Scala, Go, Python, PHP, Rust, Swift, JSON, Mermaid |
| Temi | `github-dark` e `github-light`, in base all’aspetto chiaro o scuro dell’editor |

Sono esattamente i linguaggi generati dai pannelli: `JPA` viene evidenziato come Java, `SQLAlchemy` come Python, `TypeORM`, `Sequelize`, `Drizzle` e `Zod` come TypeScript, `Doctrine` come PHP, `SeaORM` come Rust, `JSON Schema` come JSON, e `DBML` e `AML` come SQL, la grammatica più vicina presente nel bundle — vedere [Generatore di codice](../guide/guides/code-generator.md).

Il motore delle espressioni regolari è scritto in puro JavaScript, quindi nessuna policy dell’host deve consentire `wasm-unsafe-eval`.
Dove `SharedWorker` non è disponibile — Chrome su Android, Safari precedente alla 16.4 — l’errore viene registrato e il codice appare come testo semplice; gli script restano comunque modificabili.

Aggiornamento dalla versione `3.6.0` o precedenti: `@dineug/erd-editor-shiki-worker` non viene più pubblicato e con esso è scomparso `setGetShikiServiceCallback`.
Rimuovere l’installazione e la registrazione; una pagina che caricava il worker da una CDN elimina anche quel secondo tag `<script>`.

## Web Worker {#web-workers}

L’editor esegue tre attività in `SharedWorker`: l’evidenziazione della sintassi, l’esportazione delle immagini e il layout delle tabelle alla base del [Layout automatico](../guide/guides/table-related-functions.md#auto-layout), della [modalità Flusso](../guide/guides/visualization.md#how-flow-is-placed) della scheda Visualizzazione e, dalla versione `4.0.0`, del posizionamento di uno schema importato.
Tutti e tre sono inclusi in `@dineug/erd-editor`. Nessuno di essi richiede configurazione, ma ciascuno può essere bloccato da un host.
Il worker che eseguiva la garbage collection del documento è stato rimosso nella versione `4.0.0`, insieme alla garbage collection stessa.

| Worker | Senza il worker |
| --- | --- |
| Evidenziazione della sintassi | I pannelli Schema SQL e Generatore di codice e gli script di Schema SQL restano testo semplice |
| Esportazione delle immagini | Il PNG, l’SVG, `Copy to clipboard` e l’anteprima della finestra di dialogo `Export image` vengono disegnati nel thread principale, bloccando la pagina durante il disegno |
| Layout delle tabelle | I layout `Flow`, `Tree - vertical` e `Tree - horizontal` del Layout automatico, e la modalità Flusso della scheda Visualizzazione, terminano con `Could not place tables`; un’importazione disposta con il layout Flow — un file SQL, GraphQL, DBML o AML da `Import` o `Import and Add`, oppure una chiamata `setSchema*()` con `placement: 'auto'` — colloca le sue tabelle in righe, senza alcun messaggio; `Force` e la modalità Grafo non sono interessati, poiché vengono eseguiti all’interno dell’editor |

L’esportazione delle immagini attende per dieci secondi la risposta del suo worker e poi disegna nel thread principale, mentre l’evidenziazione della sintassi lascia il codice come testo semplice non appena il suo worker fallisce, quindi un host che blocca i worker penalizza le prestazioni anziché le funzionalità.
Il layout delle tabelle è l’eccezione: il motore che calcola un layout pesa più dell’editor stesso e non viene mai caricato nello stesso processo, quindi al primo posizionamento attende il suo worker per trenta secondi e, una volta che il worker ha risposto, concede sessanta secondi per la restituzione di un layout.
Se una delle due attese scade, il posizionamento termina come senza il worker. Il Layout automatico mostra `Placing tables` non appena inizia, mentre la modalità Flusso e un’importazione disposta con il layout Flow lo mostrano solo quando un posizionamento, avvio del worker compreso, è in corso da sei secondi.

Nella build per bundler tutti e tre vengono generati come file accanto al pacchetto, quindi una CSP restrittiva richiede `worker-src 'self'` — più `blob:` dove il bundler incorpora un worker inline.
Nella build per [tag script](#script-tag) tutti e tre viaggiano all’interno del file come URL `data:`, quindi quella pagina richiede invece `worker-src data:`.

## Punti di ingresso {#entry-points}

L’importazione di `@dineug/erd-editor` registra `<erd-editor>` come effetto collaterale. Oltre a questo, esporta il tipo dell’elemento, due setter di callback, dalla versione `3.9.2` le associazioni di tasti predefinite con i relativi tipi e dalla versione `4.0.0` i tipi della lingua di visualizzazione e il tipo delle opzioni di `getSchemaSQL()`.

| Esportazione | Descrizione |
| --- | --- |
| `ErdEditorElement` (tipo) | L’interfaccia dell’elemento — vedere [ErdEditorElement](./erd-editor-element.md). |
| `setExportFileCallback(cb)` | Sostituisce il download del browser, `(blob, { fileName }) => void`. |
| `setImportFileCallback(cb)` | Sostituisce il selettore di file del browser, `({ type, op, accept, mode }) => void`; `mode` dalla versione `4.0.0`. |
| `createKeyBindingMap()` | Restituisce a ogni chiamata le associazioni di tasti predefinite come una nuova `KeyBindingMap` — vedere [createKeyBindingMap](./erd-editor-element.md#createkeybindingmap). |
| `KeyBindingMap`, `KeyBindingName`, `ShortcutOption` (tipi) | Una mappa delle associazioni, l’unione dei nomi dei suoi comandi e una singola associazione. |
| `LocaleCode`, `LocaleOption` (tipi) | Dalla versione `4.0.0`. I 25 codici delle lingue di visualizzazione e quegli stessi codici più `'system'`, che è quanto accetta `setLocale()` — vedere [Lingua di visualizzazione](./erd-editor-element.md#display-language). |
| `SchemaSQLOptions` (tipo) | Dalla versione `4.0.0`. Le opzioni `statements` e `header` accettate da `getSchemaSQL()` — vedere [getSchemaSQL](./erd-editor-element.md#getschemasql). |

`@dineug/erd-editor/engine.js` è un secondo punto di ingresso. Esegue lo store del documento senza DOM, quindi funziona in un Web Worker — vedere [Archiviazione remota](./advanced/remote-storage.md).
Esporta `createReplicationStore` e il tipo `ReplicationStore`. Dalla versione `3.10.0` esporta anche il tipo `ReplicationChange`, `{ value: string; changed: boolean }`, ricevuto dal gestore `change` di una replica — vedere [on@change](./advanced/remote-storage.md#onchange).
Dalla versione `4.0.0`, un `ReplicationStore` ha anche un `runtimeValue`. Il suo `value` e quello consegnato da un `change` sono nella forma di archiviazione contenuta in un file, come quello dell’elemento — vedere [ReplicationStore](./advanced/remote-storage.md#replicationstore).

Dalla versione `3.9.1` ne esiste un terzo, `@dineug/erd-editor/peer.js`: il peer headless tramite il quale il [server MCP](../mcp/introduction.md) modifica un documento. Esiste per quel server e queste pagine non lo documentano.

### Finestre di dialogo dei file {#file-dialogs}

L’importazione e l’esportazione passano attraverso callback iniettabili, quindi un host senza la finestra di dialogo dei file del browser — ad esempio una webview di un IDE — può fornire la propria.
Le due operazioni non sono simmetriche: l’esportazione consegna il file finito, mentre l’importazione si limita a richiederne uno, e il contenuto va reinserito autonomamente.

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

Il `fileName` generato dall’editor è `<database name>-<timestamp>` più l’estensione del file, dove il timestamp è l’ora locale nel formato `yyyy-MM-dd'T'HH_mm_ss`. Se il nome del database è vuoto, si usa `unnamed`.
La callback di esportazione riceve questi file. Dalla versione `4.0.0` tra questi ci sono anche l’SVG e i file del Generatore di codice, e il `.sql` proviene dal pulsante `Save file` della scheda Schema SQL anziché direttamente da `Export`.

| File | Estensione | `type` del Blob |
| --- | --- | --- |
| L’esportazione JSON | `.erd.json` | `application/json` |
| Il pulsante `Save file` della scheda Schema SQL, che salva il testo mostrato nella scheda — vedere [Schema SQL](../guide/guides/schema-sql.md) | `.sql` | nessuno |
| La finestra di dialogo [Esporta immagine](../guide/guides/file-import-export.md#image) | `.png` o `.svg` | `image/png` o `image/svg+xml` |
| Il pulsante `Save file` della scheda Generatore di codice — vedere [Generatore di codice](../guide/guides/code-generator.md) | Quella del linguaggio: `.cs`, `.go`, `.java`, `.kt`, `.php`, `.rs`, `.scala`, `.swift`, `.ts`, `.py`, `.aml`, `.dbml`, `.graphql`, `.json` o `.mmd` | nessuno |

Un host che sceglie un gestore in base all’estensione deve averne uno per ciascuno di essi.

Se le callback non sono impostate, l’editor usa il comportamento di download e di selezione dei file del browser. Passare `null` per tornare a questo comportamento.

## Browser supportati {#browser-support}

Chrome 91+, Edge 94+, Firefox 93+, Safari 16.4+ — la base ES2022 per cui sono compilati i bundle pubblicati.
Non è incluso alcun polyfill. Aggiungere i propri se è necessario supportare browser meno recenti.

## Aggiornamento dalla versione 3.x {#upgrading-from-3x}

La `4.0.0` è una versione principale. Quando si migra una pagina dalla versione 3.x, verificare ciascuno dei punti seguenti:

- `editor.value`, il `value` di una replica e il `value` consegnato dal suo `change` sono nella forma di archiviazione contenuta in un file: senza entità rimosse, larghezze misurate, ordine di sovrapposizione né punti di ancoraggio delle relazioni. Continuare a salvare `value` e leggere questi dati da `runtimeValue`; i timestamp delle entità (`meta`) sono stati eliminati del tutto. Inizializzare un collaboratore o una replica che si unisce a una sessione in corso dal `runtimeValue` di un peer in esecuzione, non da `value` né dal file, e non salvare mai `runtimeValue` — vedere [value](./erd-editor-element.md#value) e [runtimeValue](./erd-editor-element.md#runtimevalue).
- I blocchi delle impostazioni sostituiscono `Save Scroll Information` e `Save Zoom Information`. Un nuovo documento, e qualsiasi documento salvato prima della versione `4.0.0`, ha tutti i blocchi attivi, quindi uno scorrimento, uno zoom, un cambio di scheda o una modifica del linguaggio del Generatore di codice, di uno stile dei nomi o del tipo di delimitatore lascia `value` invariato e non emette alcun evento `change`. Una pagina che conservava la vista tramite `change` richiede `Viewport` (e `Canvas Type` per la scheda) sbloccati nella scheda Impostazioni, oppure un documento il cui `settings.lockSettings` lascia azzerati quei bit — vedere [Blocco](../guide/guides/settings.md#lock).
- `settings` non ha più `width`, `height`, `scrollTop`, `scrollLeft`, `relationshipOptimization` né `ignoreSaveSettings`, e le costanti `SaveSettingType` sono state eliminate. `settings.lockSettings`, con i bit `LockSettingType`, prende il posto di `ignoreSaveSettings`, che la versione `4.0.0` o successiva non legge né scrive — vedere [Settings](./advanced/schema.md#settings).
- Il [JSON Schema](./advanced/schema.md#json-schema) indicato da ogni file in `$schema` ora descrive solo la forma di archiviazione ed è chiuso: rifiuta un file salvato da una versione precedente finché un salvataggio con la versione `4.0.0` o successiva non lo riscrive.
- La garbage collection del documento è stata eliminata insieme al suo worker, quindi un’entità rimossa resta in `runtimeValue` fino alla successiva apertura del documento dal suo file. Restano tre worker condivisi — vedere [Web Worker](#web-workers).
- Mantenere ogni editor e replica di una sessione condivisa sulla versione `4.0.0` o successiva. Una versione precedente ignora i nuovi tipi di azione: quelli dei gruppi di tabelle, di Associa colonne, dei blocchi e degli script di Schema SQL — vedere [Combinare versioni diverse](./advanced/collaborative-editing.md#mixing-releases).
- La callback di importazione riceve `mode: 'append'` per Importa e aggiungi, e una callback deve inoltrarlo. La callback di esportazione ora riceve anche i file `.svg` e quelli del Generatore di codice, e `Export` ▸ `Schema SQL` apre la scheda Schema SQL invece di salvare, quindi il `.sql` arriva solo dal pulsante `Save file` di quella scheda — vedere [Finestre di dialogo dei file](#file-dialogs).
- `Delete` e `Backspace` sono associati al nuovo comando `removeSelection`. Quando l’editor ha il focus al di fuori di un campo di testo, il comportamento predefinito del tasto viene impedito in ogni scheda e, nella scheda ERD, la selezione viene rimossa. `KeyBindingName` e `KeyBindingMap` ora lo includono, e `setKeyBindingMap({ removeSelection: [] })` lascia entrambi i tasti alla pagina — vedere [setKeyBindingMap](./erd-editor-element.md#setkeybindingmap).
- `ThemeOptions.appearance` accetta anche `'system'`, l’opzione `System` del generatore di temi, che viene impostata attivando `systemDarkMode`. `changePresetTheme` segnala `'system'` finché è selezionato, quindi memorizzarlo così com’è e ripassarlo a `setPresetTheme`. Con `systemDarkMode` attivo, un `setPresetTheme()` con `'light'` o `'dark'` ora resta valido invece di essere sovrascritto dal successivo cambiamento del sistema operativo — vedere [systemDarkMode](./erd-editor-element.md#systemdarkmode) e [changePresetTheme](./erd-editor-element.md#changepresettheme).
- `@dineug/erd-editor-mcp` `1.0.0`, l’estensione per VS Code `4.0.0` o successiva e i plugin per Obsidian e JetBrains `1.0.0` o successivi usano la versione 2 del protocollo dell’hub. Il server `1.0.0` e una versione precedente dell’editor che serve gli agenti, oppure un server precedente e uno di questi editor, si rifiutano a vicenda con `protocolMismatch`, indicando la parte da aggiornare — vedere [Aggiornamento](../mcp/installation.md#updating).
- Un URL CDN senza versione ora fornisce la versione 4.x più recente. Fissare `@3.10.0` per restare alla versione 3.x — vedere [CDN](#cdn).
