---
sidebar_position: 2
description: Replicare un editor in esecuzione in uno store headless fuori dal thread principale e serializzare il documento per l’archiviazione.
---

# Archiviazione remota

Inviare l’intero stato dell’editor a ogni modifica è inefficiente.  
Per questo caso, l’editor fornisce un’API per la replica dei dati in tempo reale.

## Installazione {#installation}

```sh
npm install @dineug/erd-editor
```

Lo store di replica si trova nel sottopercorso `@dineug/erd-editor/engine.js`, non nella radice del pacchetto.  
Questo punto di ingresso non accede al DOM, quindi funziona in un Web Worker o in qualsiasi altro contesto fuori dal thread principale.  
Importando invece la radice del pacchetto si registra l’elemento personalizzato `<erd-editor>`, che richiede un documento.

## Utilizzo {#usage}

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

## Replicare un editor in esecuzione {#replicating-a-live-editor}

Le azioni provengono dallo store condiviso di un editor in esecuzione.  
Vedere [Modifica collaborativa](./collaborative-editing.md).

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

Solo la modifica attraversa il confine, mai l’intero documento.  
La replica la applica e serializza il risultato dal proprio lato.  
`change` consegna quel risultato come `value`, e `changed` indica quando vale la pena scriverlo.

Dalla versione `4.0.0`, inizializzare la replica dal `runtimeValue` dell’editor, come sopra, anziché dal file archiviato o dal `value` dell’editor.  
Al file mancano le modifiche apportate dopo il suo salvataggio, e a `value` mancano le entità rimosse nella sessione.  
Una replica inizializzata senza una tabella rimossa la ripristina senza nome né colonne quando un editor ne annulla la rimozione, e la salva così.  
Dalla versione `4.2.0` lo stesso vale per una parola, un termine o un dominio rimosso da un foglio della scheda [Dizionario](../../guide/guides/dictionary.md).  
Quando un editor ne annulla la rimozione, una replica inizializzata senza la riga la elenca di nuovo vuota e, poiché `value` esclude una riga vuota, la replica salva il documento senza di essa.  
Nel caso di un dominio, anche le colonne e i termini che vi erano collegati restano scollegati in quella replica, poiché non ha mai contenuto i collegamenti e l’annullamento non li invia.

## InjectEngineContext {#injectenginecontext}

### toWidth {#towidth}

Misura una stringa in pixel.  
Lo store non ha un DOM, quindi non può misurare il testo da sé, e ricalcola la larghezza delle colonne con questa funzione ogni volta che cambia un nome, un tipo di dati, un valore predefinito o un commento.  
Dalla versione `4.2.0` ciò comprende il [nome logico](../../guide/guides/logical-names.md) di una tabella o di una colonna.  
Misura la cella Dominio di una colonna, che mostra il nome del dominio a cui la colonna è collegata, ogni volta che la colonna viene collegata a un dominio o scollegata e ogni volta che quel dominio viene aggiunto, rinominato o rimosso.  
Misura inoltre di nuovo ogni tabella e colonna ogni volta che [setInitialValue](#setinitialvalue) carica un documento.  
Dalla versione `4.0.0` le larghezze sono conservate solo in [runtimeValue](#runtimevalue-getter), mai in `value`.  
Così un documento salvato da questa versione si rilegge con lo stesso `value` byte per byte, ovunque sia stato salvato e qualunque misura avesse lì il testo.

Misurare come fa l’editor — `400 12px` nell’elenco di font dell’editor, arrotondando e aggiungendo 2 px di spaziatura interna.  
Altrimenti le larghezze in `runtimeValue` si discostano da quelle sullo schermo.

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

`text.length * 10` è la soluzione di ripiego quando non è disponibile alcun canvas.  
È sufficiente per uno store il cui documento viene solo archiviato, mai visualizzato.

## ReplicationStore {#replicationstore}

### value getter {#value-getter}

Serializza lo stato corrente dell’editor.  
Restituisce una stringa JSON, pronta da archiviare così com’è — non un oggetto analizzato.

```js
const data = replicationStore.value;
```

Dalla versione `4.0.0`, `value` è la forma di archiviazione: il documento come lo contiene un file, lo stesso testo restituito dal [value](../erd-editor-element.md#value) dell’elemento.  
Contiene solo le entità attive, in un ordine fisso, senza quelle rimosse, senza l’ordine di sovrapposizione e senza nulla di ciò che un caricamento ricalcola, come le larghezze misurate da [toWidth](#towidth).  
Dalla versione `4.2.0` contiene anche i nomi logici, l’indicazione se ogni nome è stato derivato dai dizionari, i collegamenti ai domini e le parole, i termini e i domini della scheda [Dizionario](../../guide/guides/dictionary.md).  
Esclude inoltre, dalla versione `4.2.0`, ogni campo di testo vuoto di un’entità, ogni elenco di `doc` e ogni collezione che non contiene nulla, e `collections` stesso quando ogni collezione è vuota.  
È indentato con due spazi, con ogni riga dei dizionari su una riga di testo propria, e termina con un carattere di nuova riga, quindi lo stesso documento produce sempre gli stessi byte.  
Per ciò che contiene, vedere [Forma di archiviazione e valore di runtime](./schema.md#storage-form-and-runtime-value).

Ogni impostazione il cui [blocco](../../guide/guides/settings.md#lock) è attivo viene scritta con il valore a cui è stata bloccata, e ogni altra impostazione così com’è.  
Il blocco `Viewport` copre insieme l’origine della vista e il livello di zoom, e la scheda, il linguaggio del Generatore di codice, entrambi gli stili dei nomi e il tipo di delimitatore hanno ciascuno un proprio blocco.  
Dalla versione `4.2.0` ne ha uno anche la [Visualizzazione nomi](../../guide/guides/logical-names.md#name-view), il cui blocco `Name View` è attivo in un nuovo documento.  
I blocchi sostituiscono il campo `ignoreSaveSettings` del documento, che dalla versione `4.0.0` non viene né letto né scritto.  
Prima della versione `4.0.0`, `value` era l’intero documento come lo conteneva lo store, con i bit di scorrimento e di zoom di quel campo applicati.

### runtimeValue getter {#runtimevalue-getter}

Dalla versione `4.0.0`, serializza il documento come lo contiene la replica, comprese le entità rimosse e tutto ciò che un caricamento ricalcola.  
Anche qui ogni impostazione bloccata viene scritta con il suo valore bloccato.

```js
const snapshot = replicationStore.runtimeValue;
```

Utilizzarlo per inizializzare, tramite il suo `setInitialValue`, un editor o un altro store che si unisce in seguito; vedere [Modifica collaborativa](./collaborative-editing.md).  
Non archiviarlo mai come file: contiene le entità rimosse, e il [JSON Schema](./schema.md#json-schema) pubblicato lo rifiuta.  
Sono proprio queste entità rimosse a far sì che l’annullamento di una rimozione, inviato in seguito, ripristini l’entità per intero nello store inizializzato a partire da esso.  
Restano fino alla successiva apertura del documento dal suo file, la cui forma le esclude.

### setInitialValue {#setinitialvalue}

Carica lo stato dell’editor archiviato in precedenza.

```js
replicationStore.setInitialValue('json...');
```

Accetta la forma di archiviazione, un valore di runtime o un documento salvato da una versione precedente, compreso un documento v2.  
Una stringa vuota, o qualsiasi valore che non sia una stringa, carica un documento nuovo e vuoto anziché generare un errore.  
Uno store a cui non è mai stato passato un valore parte come lo stesso documento nuovo.  
Dalla versione `4.0.0` quel documento ha attivo ogni [blocco](../../guide/guides/settings.md#lock), quindi il suo `value` mantiene la vista, la scheda, il linguaggio del Generatore di codice, gli stili dei nomi e il tipo di delimitatore con cui è partito mentre gli editor che replica scorrono, eseguono lo zoom, cambiano scheda o modificano quelle impostazioni. Nella versione `3.10.0` non salvava né lo scorrimento né lo zoom, e prima ancora li salvava entrambi.  
Dalla versione `4.2.0` mantiene anche la propria Visualizzazione nomi, `Physical Names`, mentre gli editor cambiano la loro.  
Un documento archiviato mantiene i blocchi che indica.  
Uno che non ne indica nessuno, cioè qualsiasi documento salvato prima della versione `4.0.0`, compreso un documento v2, si carica con ogni blocco attivo: l’origine della vista a `0, 0`, il livello di zoom a `1` e la scheda su ERD, qualunque cosa abbia salvato, e il linguaggio del Generatore di codice, gli stili dei nomi e il tipo di delimitatore come li ha salvati.  
Un documento salvato prima della versione `4.2.0` non indica alcun blocco `Name View`, quindi si carica con quel blocco attivo e nella vista `Physical Names`, anche se è stato salvato con ogni altro blocco disattivato.  
Dalla versione `4.0.0`, `setInitialValue` scarta anche i registri di collaborazione conservati per il documento precedente, come fa il [setInitialValue](../erd-editor-element.md#setinitialvalue) dell’elemento.  
Nemmeno un testo che non è JSON, come un file rimasto con i marcatori di conflitto di merge, genera un errore: l’errore di analisi viene solo registrato nella console, il documento viene svuotato e le impostazioni restano com’erano.

Dalla versione `4.0.0` il caricamento non esegue alcuna garbage collection, quindi le entità rimosse restano in [runtimeValue](#runtimevalue-getter).  
Prima scartava le entità che non comparivano più in `doc` e non erano state modificate da quattro giorni o più.

Le riscritture del caricamento terminano prima che `setInitialValue` restituisca il controllo: gli indicatori di chiave sulle colonne, ricavati dalle opzioni di ciascuna colonna e dalle relazioni; ogni larghezza di tabella e di colonna, misurata di nuovo con `toWidth`; i punti in cui ciascun connettore incontra le sue tabelle; e il flag identificante di ciascuna relazione e il simbolo alla sua estremità lato padre.  
Nessuna di esse fa parte di `value`, ma `replicationStore.runtimeValue` letto subito dopo la chiamata le contiene già tutte.  
Un’azione che arriva subito dopo il caricamento, come uno scorrimento riprodotto, viene valutata rispetto al documento caricato, quindi il caricamento stesso non viene mai segnalato come [`changed`](#onchange).

Né il caricamento né alcuna di queste riscritture emette `change`.  
Leggere direttamente `replicationStore.value` dopo il ritorno di `setInitialValue` se si vuole riscrivere il documento caricato nella forma di archiviazione.

### on@change {#onchange}

Effettua la sottoscrizione alle modifiche dello stato dell’editor.

```js
const unsubscribe = replicationStore.on({
  change: ({ value, changed }) => {
    if (changed) {
      // save value...
    }
  },
});
```

`change` viene emesso con un debounce di 200 ms, quindi una raffica di azioni arriva come un’unica notifica.  
Viene emesso solo per azioni di un tipo che può modificare il documento, oltre all’azione `settings.changeIgnoreSaveSettings` che un editor meno recente può ancora inviare (vedere [dispatch, dispatchSync](#dispatch-dispatchsync)).  
Un’azione di presenza inoltrata o `editor.mergeLWW` non lo attiva mai.  
Chiamare la funzione restituita per annullare la sottoscrizione.

Dalla versione `3.10.0` il listener riceve un `ReplicationChange`, un tipo che `@dineug/erd-editor/engine.js` esporta accanto a `ReplicationStore`.  
Prima della versione `3.10.0` non riceveva nulla, e un listener che ignora l’argomento continua a funzionare.  
`value` è il documento serializzato nella forma di archiviazione, la stessa stringa che `replicationStore.value` restituisce in quel momento, quindi non serve serializzarlo di nuovo.  
`changed` è `false` quando le azioni successive al `change` precedente, o al caricamento, hanno lasciato `value` com’era, byte per byte.

Una modifica che un [blocco](../../guide/guides/settings.md#lock) esclude da `value` emette comunque `change`, con `changed` impostato su `false`, quindi scrivere solo quando `changed` è `true`.  
Si tratta di uno scorrimento o di uno zoom mentre `Viewport` è bloccato, di un cambio di scheda mentre `Canvas Type` è bloccato, e di una modifica del linguaggio del Generatore di codice, di uno stile dei nomi o del tipo di delimitatore mentre il relativo blocco è attivo.  
Dalla versione `4.2.0` vale lo stesso per un cambio della Visualizzazione nomi mentre `Name View` è bloccato: l’editor lo invia comunque, ma la replica lo scarta, come fanno gli altri editor.  
Un cambio della Visualizzazione nomi effettuato in un editor di sola lettura viene scartato allo stesso modo, qualunque sia il suo blocco.  
L’evento [change](../erd-editor-element.md#change) dell’elemento esclude una modifica di questo tipo, ma la replica la segnala comunque.  
Ogni blocco è attivo in un documento nuovo e in uno salvato prima della versione `4.0.0`, e `Name View` è bloccato in qualsiasi documento salvato prima della versione `4.2.0`.  
Con `Viewport` sbloccato uno scorrimento o uno zoom modifica `value`, con `Canvas Type` sbloccato lo fa anche l’apertura di un’altra scheda dell’editor, e con `Name View` sbloccato lo fa anche un cambio della Visualizzazione nomi da parte di un editor che non è di sola lettura.  
Anche attivare o disattivare un blocco modifica `value`.

Dalla versione `4.0.0`, `changed` confronta la forma di archiviazione, che non contiene né le entità rimosse né l’ordine di sovrapposizione.  
Così anche una tabella aggiunta e rimossa di nuovo all’interno di un solo `change`, una modifica che ricade su un’entità rimossa da un altro collaboratore e un caricamento inoltrato che cambia solo l’ordine di sovrapposizione risultano tutti con `changed` impostato su `false`.  
Dalla versione `4.2.0` lo stesso vale per una riga aggiunta a un foglio della scheda Dizionario e lasciata vuota, poiché la forma di archiviazione esclude una riga che non contiene nulla.

`changed` non confronta mai con il file archiviato, che può già differire da `value` una volta caricato: è il caso di un file salvato da una versione precedente, compreso un file v2, così come di un file che inizia con un byte order mark e di uno modificato a mano.  
Dalla versione `4.2.0` ciò comprende un file salvato dalla `4.0.0` o dalla `4.1.0`, poiché `value` esclude i campi di testo vuoti delle sue entità e gli elenchi di `doc` e le collezioni vuoti che un file del genere contiene.  
Un confronto byte per byte con un file del genere conterebbe come modifica perfino uno scorrimento che un blocco esclude.  
Il primo `change` con `changed` impostato su `true` restituisce un file del genere nella forma di archiviazione, quindi scriverlo riscrive il file una sola volta.  
Un file salvato da questa versione non differisce, ovunque sia stato salvato, come spiega [toWidth](#towidth).  
Se `setInitialValue` arriva mentre un `change` è ancora in sospeso, e non viene inviato nulla prima della sua scadenza, quel `change` arriva comunque, con il `value` caricato e `changed` impostato su `false`.

### dispatch, dispatchSync {#dispatch-dispatchsync}

Applica al replicationStore le modifiche degli editor remoti.

```js
replicationStore.dispatch(actions); // async
replicationStore.dispatchSync(actions); // sync
```

`dispatch` rimanda l’applicazione a un microtask, mentre `dispatchSync` applica subito il batch.

È possibile passare il flusso di uno store condiviso senza filtrarlo.  
Entrambi i metodi mantengono solo le azioni di un tipo che può modificare il documento, oltre alle due descritte alla fine di questa sezione, e scartano le altre, quindi la presenza trasportata da una sessione collaborativa — il cursore del mouse, il focus, la selezione e il riquadro di trascinamento di ciascun utente — passa senza alcun effetto.

Dalla versione `3.10.0` le azioni mantenute includono `relationship.changeOnDelete` e `relationship.changeOnUpdate`, e `relationship.add` contiene `onDelete` e `onUpdate`.  
Uno store di una versione precedente scarta quelle azioni e ignora quei campi, quindi perde le azioni [ON DELETE e ON UPDATE](../../guide/guides/relationship-editing.md#on-delete-and-on-update) di una relazione.

Dalla versione `4.0.0` le azioni mantenute includono anche `table.changeGroup`, sette delle otto azioni `tableGroup` (`tableGroup.add`, `tableGroup.move`, `tableGroup.moveTo`, `tableGroup.remove`, `tableGroup.resize`, `tableGroup.changeName` e `tableGroup.changeColor`, tutte tranne la modifica dell’ordine di sovrapposizione `tableGroup.changeZIndex`), `relationship.changeColumns`, `settings.changeLockSettings` e `settings.changeDDLScript`.  
L’azione `settings.changeRelationshipOptimization` non esiste più, quindi entrambi i metodi la scartano.  
Uno store di una versione precedente scarta le nuove azioni, quindi perde i [gruppi di tabelle](../../guide/guides/table-groups.md), i [blocchi](../../guide/guides/settings.md#lock), gli script di [Schema SQL](../../guide/guides/schema-sql.md) e le colonne che [Associa colonne](../../guide/guides/relationship-editing.md#map-columns) assegna a una relazione esistente.  
Eseguire la replica sulla stessa versione degli editor o su una più recente.

La versione `4.1.0` non aggiunge alcun tipo di azione e lascia `@dineug/erd-editor/engine.js` invariato, quindi una replica `4.0.0` mantiene ogni modifica inviata da un editor `4.1.0`, esattamente come fa una replica `4.1.0`.  
Dalla versione `4.1.0`, i comandi `Replace` e `Replace All` di [Trova e sostituisci](../../guide/guides/find-and-replace.md#replacing) rinominano anche indici e gruppi di tabelle, tramite le azioni `index.changeName` e `tableGroup.changeName` che una replica `4.0.0` già mantiene.  
Lo stato proprio del pannello [Esplora](../../guide/guides/explorer.md) non viene mai inviato, e un cambio di scheda o uno scorrimento che esso esegue arriva come qualsiasi altro cambio di scheda o scorrimento; vedere [Modifica collaborativa](./collaborative-editing.md).

Dalla versione `4.2.0` le azioni mantenute comprendono anche `table.changeLogicalName`, `table.changeNameDerived`, `column.changeLogicalName`, `column.changeDomain`, `column.changeNameDerived`, `settings.changeNameViewMode` e `dictionary.add`, `dictionary.update` e `dictionary.remove`, che trasportano ogni modifica, ordinamento e importazione CSV nei fogli della scheda [Dizionario](../../guide/guides/dictionary.md).  
Dei cambi della Visualizzazione nomi, una replica applica solo quelli effettuati da un editor che non è di sola lettura mentre `Name View` è sbloccato, e scarta gli altri (vedere [on@change](#onchange)).  
Uno store di una versione precedente scarta tutte queste azioni, quindi perde i [nomi logici](../../guide/guides/logical-names.md), i collegamenti ai domini, l’indicazione se ogni nome proviene dai dizionari, le parole, i termini e i domini, e la Visualizzazione nomi.  
Un editor precedente alla versione `4.2.0` presente nella sessione può comunque sottrarre parte di tutto ciò a una replica `4.2.0`.  
Un `Import` Schema SQL, GraphQL, DBML o AML su quell’editor, ma non un `Import and Add`, svuota le parole, i termini e i domini della replica.  
Il suo annullamento di un caricamento, di un `Import` o di `clear()` carica nella replica la propria copia del documento, senza nomi logici, collegamenti a domini né dizionari; vedere [Combinare versioni diverse](./collaborative-editing.md#mixing-releases).  
`@dineug/erd-editor/engine.js` esporta gli stessi `createReplicationStore`, `ReplicationStore` e `ReplicationChange` di prima, e `createReplicationStore` accetta lo stesso contesto.

Dalla versione `4.0.0` entrambi i metodi applicano anche `editor.mergeLWW`, che trasporta i registri di collaborazione con cui un editor risponde quando un altro si unisce alla sessione, così la replica risolve le modifiche simultanee come fanno gli editor.  
Non modifica alcun byte di `value` e non emette alcun `change`.  
L’azione `settings.changeIgnoreSaveSettings`, che un editor precedente alla versione `4.0.0` può ancora inviare, viene mantenuta ma non cambia nulla: emette `change` con `changed` impostato su `false`.

### destroy {#destroy}

Distrugge completamente l’istanza di replicationStore.

```js
replicationStore.destroy();
```

Da quel momento lo store smette di emettere `change` e ignora gli ulteriori invii di azioni.  
Il documento resta fermo al suo ultimo valore anziché generare un errore.  
Per ricominciare, creare un nuovo store.
