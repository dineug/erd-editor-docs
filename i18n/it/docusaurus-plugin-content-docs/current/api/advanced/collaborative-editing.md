---
sidebar_position: 1
description: Inoltrare le modifiche dell’editor tra le istanze con getSharedStore, inizializzare un editor che si unisce a partire da runtimeValue e dai registri dello store, risolvere le modifiche fatte nello stesso istante e mostrare il cursore, il focus, la selezione e il riquadro di trascinamento di ogni collaboratore.
---

# Modifica collaborativa

`getSharedStore()` trasforma un editor in un nodo di una sessione collaborativa.  
Emette ogni modifica come un flusso di azioni e applica le azioni che gli altri editor inviano a loro volta — il trasporto tra di essi va fornito da chi integra l’editor (WebSocket, WebRTC o qualsiasi altro mezzo in grado di trasportare JSON).  
È uno dei metodi di [ErdEditorElement](../erd-editor-element.md) e si usa insieme ad [Archiviazione remota](./remote-storage.md) quando le modifiche inoltrate devono anche essere archiviate.  
Dalla versione `5.1.0`, per condividere un diagramma tramite un documento Yjs e uno qualsiasi dei suoi provider invece di predisporre da sé il trasporto, associare l’editor con `@dineug/erd-editor-yjs`; vedere [Yjs](./yjs.md).

```ts
interface ErdEditorElement extends HTMLElement {
  // ...
  getSharedStore: (
    config?: SharedStoreConfig & {
      mouseTracker?: boolean;
      focusTracker?: boolean;
    }
  ) => SharedStore;
}

type SharedStoreConfig = {
  getNickname?: () => string;
};

type SharedStore = {
  connection: () => void;
  disconnect: () => void;
  dispatch: (actions: Array<AnyAction> | AnyAction) => void;
  dispatchSync: (actions: Array<AnyAction> | AnyAction) => void;
  subscribe: (fn: (value: AnyAction[]) => void) => Unsubscribe;
  flushStreamBuffers: () => void;
  getLWW: () => SharedRegisters;
  mergeLWW: (lww: SharedRegisters, version: number) => void;
  getVersion: () => number;
  forgetPeer: (editorId: string) => void;
  reseed: (value: string, options: ReseedOptions) => void;
  destroy: () => void;
};

// a JSON object whose shape is the editor's own: hand it on as it is
type SharedRegisters = Record<string, unknown> & {
  readonly [registersBrand]: true;
};

type ReseedOptions = {
  lww: SharedRegisters;
  version: number;
  keepScreen?: boolean; // default false
};

// example
const sharedStore = editor.getSharedStore();
```

`@dineug/erd-editor` non esporta nessuno di questi tipi per nome. Il codice TypeScript li raggiunge tramite `ErdEditorElement`, come in `ReturnType<ErdEditorElement['getSharedStore']>`.

Un’azione è un semplice oggetto serializzabile che descrive una modifica al documento, quindi supera indenne `JSON.stringify` lungo il percorso verso il trasporto.  
Le azioni arrivano in batch: `subscribe` consegna un array, e quell’array è un’unità — inoltrarlo per intero e applicarlo per intero dall’altro lato.  
Trattare un’azione come opaca e passarla così com’è invece di leggerla o riscriverla, poiché sono i dati di gestione che contiene, come la sua [versione](#concurrent-edits), a mantenere sincronizzati gli editor.

Parte di ciò che fa un editor resta su quell’editor.  
Il passaggio in primo piano di una tabella, di un memo o di un gruppo di tabelle, come avviene con la selezione, non viene inviato.  
Non vengono inviate nemmeno le scelte `Statements`, `Header`, `Write logical names into empty comments` (dalla versione `4.2.0`) e `Tables` della scheda [Schema SQL](../../guide/guides/schema-sql.md), che appartengono alla finestra in cui vengono effettuate.  
Dalla versione `4.1.0` anche il pannello [Esplora](../../guide/guides/explorer.md) resta sul proprio editor: lo stato di apertura, la larghezza, le righe compresse, la riga su cui si trova il focus della tastiera, la posizione di scorrimento dell’albero, la ricerca e le opzioni non vengono inviati.  
Non viene inviata nemmeno l’[evidenziazione](../../guide/guides/relationship-editing.md#reading-a-connector) che compare sul connettore della relazione di una chiave esterna quando si va a quest’ultima.  
Dalla versione `4.2.0` anche la scheda [Dizionario](../../guide/guides/dictionary.md) resta sul proprio editor: il foglio visualizzato e, per ogni foglio, la ricerca, la selezione, la posizione di scorrimento e le larghezze delle colonne non vengono inviati. Vengono invece inviati le sue modifiche, i suoi ordinamenti e le sue importazioni CSV.  
Uno scorrimento, uno zoom o un cambio di scheda viene inviato, ma non sposta mai la vista o la scheda di un altro utente. Ciò vale anche per lo scorrimento prodotto da un salto dal pannello Esplora, per il passaggio alla scheda ERD quando il pannello Esplora viene aperto da un’altra scheda e per il cambio di scheda e lo scorrimento prodotti da un salto dal foglio [`Checks`](../../guide/guides/dictionary.md#the-checks-sheet) della scheda Dizionario a una tabella o a una colonna. Un salto da quel foglio a una parola, a un termine o a un dominio resta nella scheda Dizionario, quindi non ne viene inviato nulla.

Dalla versione `4.2.0` viene inviato anche un cambio della [Visualizzazione nomi](../../guide/guides/logical-names.md#switching-the-view), e il suo [blocco](../../guide/guides/settings.md#lock) decide che cosa ne fanno gli altri editor. Il blocco `Name View` è attivo in un nuovo diagramma e in qualsiasi documento precedente alla versione `4.2.0`.  
Mentre il blocco è attivo, il cambio compare solo nell’editor che lo ha effettuato: viene comunque inviato, ma ogni altro editor e ogni replica lo scartano, così ogni utente può guardare una vista diversa mentre `value` mantiene quella bloccata.  
Mentre il blocco è disattivato, un cambio effettuato in un editor che può modificare il documento cambia la Visualizzazione nomi su ogni editor e su ogni replica, dove prevale l’ultimo cambio, e ognuno di essi la salva.  
Il cambio effettuato da un editor di sola lettura resta sempre su quell’editor, che continua comunque a seguire i cambi condivisi degli altri.

Dalla versione `5.1.0` un cambio del linguaggio del [Generatore di codice](../../guide/guides/code-generator.md), dello stile dei nomi delle tabelle, dello stile dei nomi delle colonne o del tipo di delimitatore segue allo stesso modo il proprio blocco (`Language`, `Table Name Case`, `Column Name Case` o `Bracket Type`), con una differenza: mentre il blocco è attivo, il cambio non viene inviato affatto.  
Compare solo nell’editor che lo ha effettuato, le cui schede Generatore di codice e Schema SQL lo seguono, e nessun altro editor o replica lo vede. `value` e `runtimeValue` mantengono il valore bloccato, quindi non lo vede nemmeno chi si unisce inizializzato da un qualsiasi editor, e ogni utente può guardare un diverso linguaggio, stile dei nomi o tipo di delimitatore mentre il blocco è attivo.  
Mentre il blocco è disattivato, un cambio effettuato in un editor che può modificare il documento viene inviato con il contrassegno di condiviso (`shared: true` nel suo payload). Cambia l’impostazione su ogni editor e su ogni replica, dove prevale l’ultimo cambio, e ognuno di essi la salva. Un editor o una replica `5.1.0` applica un cambio contrassegnato qualunque cosa dica il proprio blocco, quindi un cambio effettuato subito dopo uno sblocco arriva ovunque, anche dove giunge prima dello sblocco.  
Prima della versione `5.1.0` un cambio di questo tipo raggiungeva ogni editor e ogni replica, che il blocco fosse attivo o no, mentre il file manteneva il valore bloccato.

Dalla versione `5.0.0` un editor [di sola lettura](../erd-editor-element.md#readonly) non invia alcun cambio. Lo scorrimento, lo zoom, la scheda, la Visualizzazione nomi, il database, il linguaggio del Generatore di codice, gli stili dei nomi, il tipo di delimitatore e le righe di `View Option` che il suo lettore cambia restano sul suo schermo, qualunque sia il loro blocco; prima della versione `5.0.0` i suoi scorrimenti, zoom, cambi di scheda, database e impostazioni del codice venivano inviati come quelli di un editor modificabile.  
Il suo store continua a inviare ciò che inviano i suoi tracker del cursore, del focus, della selezione e del riquadro di trascinamento del lettore, risponde ai registri richiesti da un editor che si unisce e applica ogni cambio inviato dagli altri. Un cambio del database, di un’impostazione del Generatore di codice o di una riga di `View Option` raggiunge il suo documento, e anche il suo schermo a meno che il lettore non abbia cambiato quell’impostazione proprio lì, e un cambio condiviso della Visualizzazione nomi compare comunque sul suo schermo. Dalla versione `5.1.0` riceve un’impostazione del Generatore di codice solo quando quell’impostazione è stata cambiata con il blocco disattivato o quando la porta con sé uno sblocco.  
Quando l’editor diventa di sola lettura, invia prima ciò che lo store trattiene ancora di un trascinamento o di uno scorrimento, come fa [flushStreamBuffers](#flushstreambuffers), così gli altri conservano l’ultima parte.

I [blocchi](../../guide/guides/settings.md#lock) sono condivisi: l’ultimo blocco o sblocco di un’impostazione prevale su ogni editor e un blocco porta con sé i valori dell’editor che lo ha attivato, quindi ogni editor e ogni replica salvano lo stesso valore.  
Il blocco `Viewport` salva quindi la vista dell’editor che lo ha attivato e il blocco `Canvas Type` l’ultima scheda in cui si trovava quell’editor prima della scheda Impostazioni, dove i blocchi vengono attivati.  
La disattivazione del blocco `Language`, `Table Name Case`, `Column Name Case`, `Bracket Type` o, dalla versione `4.2.0`, `Name View` porta anche quell’impostazione, su ogni editor, al valore mostrato nell’editor che lo ha disattivato, compreso il suo stesso cambio effettuato sotto il blocco, così tutti continuano a salvare un unico valore. La disattivazione di `Viewport` o `Canvas Type` non sposta la vista né la scheda di nessuno.

Una modifica allo script `Before tables` o `After tables` viene inviata per intero quando il suo campo perde il focus. I due script vengono risolti separatamente, quindi la modifica di uno da parte di un collaboratore non sovrascrive mai l’altro.

Nulla di ciò che si fa nella [modalità Flusso](../../guide/guides/visualization.md#flow-never-edits-the-document) della scheda Visualizzazione è una modifica del documento, quindi un editor in modalità Flusso non invia modifiche agli altri e le modifiche inviate da questi continuano a essere applicate mentre vi si trova.  
Ci sono due eccezioni. L’uscita dalla modalità Flusso verso un’altra scheda è un cambio di scheda, inviato come qualsiasi altro. Dalla versione `4.2.0` una scelta nell’elenco della Visualizzazione nomi sulla barra degli strumenti della modalità Flusso è un cambio della Visualizzazione nomi, inviato e applicato come uno effettuato nell’area di disegno.  
`Previous table`, `Next table` e i tasti di annullamento e ripetizione, che in modalità Flusso [tornano indietro e vanno avanti tra le viste](../../guide/guides/visualization.md#previous-table-and-next-table), non vengono inviati.  
Il pulsante di link esterno della card, un risultato della [Ricerca rapida](../../guide/guides/quick-search.md#searching-the-diagram) scelto dopo `#`, `@` o `:` e l’apertura del pannello [Esplora](../../guide/guides/explorer.md#opening-and-closing) fanno tutti uscire dalla modalità Flusso verso la scheda ERD. Viene inviato anche lo scorrimento che il pulsante della card o un risultato della Ricerca rapida producono lì.

## Due editor in una pagina {#two-editors-on-one-page}

Qui il collegamento da subscribe a dispatch fa le veci della rete, così si può vedere la struttura di una sessione senza un trasporto di mezzo.

```js
import '@dineug/erd-editor/erd-editor.js';

const editor1 = document.createElement('erd-editor');
const editor2 = document.createElement('erd-editor');

const sharedStore1 = editor1.getSharedStore({
  getNickname: () => 'editor1',
});
const sharedStore2 = editor2.getSharedStore({
  getNickname: () => 'editor2',
});

sharedStore1.subscribe(actions => {
  sharedStore2.dispatch(actions);
});

sharedStore2.subscribe(actions => {
  sharedStore1.dispatch(actions);
});
```

Qui entrambi gli editor partono dallo stesso documento nuovo e vuoto, quindi nessuno dei due deve essere inizializzato.  
Con tre o più editor, inviare i batch di ciascuno a tutti gli altri: un editor non inoltra mai ciò che ha ricevuto.

## Inizializzare un collaboratore {#seeding-a-collaborator}

Uno store condiviso inoltra le modifiche man mano che vengono fatte e non consegna mai a chi si unisce il documento nel suo stato attuale, quindi a un editor che si unisce a una sessione già in corso va prima fornito il documento.  
Dalla versione `4.0.0` inizializzarlo con [`runtimeValue`](../erd-editor-element.md#runtimevalue) di un editor già presente nella sessione, non con `value` né con il file salvato.  
Una stanza associata con [`@dineug/erd-editor-yjs`](./yjs.md) contiene essa stessa il documento una volta che un client l’ha [inizializzata](./yjs.md#seeding-a-room), quindi ogni editor associato a essa apre quel documento senza che gli venga passato alcun `runtimeValue`.

```js
editor2.setInitialValue(editor1.runtimeValue);

const sharedStore2 = editor2.getSharedStore();
```

Il valore di runtime contiene ancora ciò che è stato rimosso dall’apertura del documento, quindi quando in seguito un altro editor annulla una rimozione, il nuovo partecipante ripristina la tabella con il suo nome e le sue colonne.  
[`value`](../erd-editor-element.md#value) è la forma contenuta in un file, senza le entità rimosse, quindi un nuovo partecipante inizializzato da esso, o dal file, ripristinerebbe invece una tabella vuota e senza nome.  
Dalla versione `4.2.0` lo stesso vale per una parola, un termine o un dominio rimosso da un foglio della scheda [Dizionario](../../guide/guides/dictionary.md): quando un altro editor ne annulla la rimozione, un nuovo partecipante inizializzato da `runtimeValue` elenca di nuovo la riga per intero, mentre uno inizializzato da `value` elenca una riga vuota, che il suo stesso `value` poi esclude.  
Continuare a scrivere `value` nell’archivio: `runtimeValue` serve solo a inizializzare un altro editor, una seconda vista o un [replicationStore](./remote-storage.md).  
Gli editor in VS Code, in Obsidian, in un IDE JetBrains e nell’app web inizializzano in questo modo una seconda vista di un documento aperto.

`setInitialValue` non viene inoltrato, quindi l’inizializzazione del nuovo partecipante non cambia nulla sugli altri.  
Dalla versione `4.0.0` scarta anche i registri di collaborazione dell’editor, che risolvono le [modifiche simultanee](#concurrent-edits). Se lo store condiviso dell’editor ha già avuto un sottoscrittore, lo store chiede di nuovo agli altri editor i loro registri, come alla sua prima chiamata a [subscribe](#subscribe), così un editor ricaricato a metà sessione risolve le modifiche come fanno gli altri.  
L’assegnazione di `value` mantiene i registri ma, a differenza di `setInitialValue`, viene inoltrata: una volta che l’editor ha uno store condiviso, ogni editor della sessione carica il documento assegnato, quindi non inizializzare mai un nuovo partecipante in questo modo.

Né `value` né `runtimeValue` contengono i registri o la versione raggiunta dall’orologio dell’editor, quindi chi si unisce, inizializzato solo da `runtimeValue`, li riceve dalla risposta che gli editor della sessione inviano alla sua prima chiamata a subscribe.  
Finché quella risposta non arriva, una modifica fatta da chi si unisce può portare una versione inferiore a quella degli altri, che quindi la rifiutano mentre resta su chi si unisce, e una scrittura più vecchia ancora in viaggio si applica sopra quella più recente contenuta nei dati di inizializzazione. Dove nessun editor in esecuzione risponde, ad esempio quando un server o un archivio di documenti conserva il documento della sessione, chi si unisce non li riceve mai.  
Dalla versione `5.1.0` consegnarli insieme al valore. Su un editor della sessione, chiamare [`flushStreamBuffers()`](#flushstreambuffers), così un trascinamento o una modifica del colore che trattiene ancora partono per primi, poi leggere nello stesso momento `runtimeValue` e [`getLWW()`](#getlww) e [`getVersion()`](#getversion) del suo store. Chi si unisce carica il valore con `setInitialValue`, poi riceve il resto con [`mergeLWW`](#mergelww) del proprio store, in quest’ordine, poiché ogni `setInitialValue` scarta i registri. La sua modifica successiva porta quindi una versione superiore a ogni versione contenuta nei dati di inizializzazione, così si applica senza alcuna risposta da attendere. Su uno store già esistente, [`reseed`](#reseed) fa entrambe le cose in una sola chiamata.

```js
// on an editor already in the session
sharedStore1.flushStreamBuffers();
const seed = {
  value: editor1.runtimeValue,
  lww: sharedStore1.getLWW(),
  version: sharedStore1.getVersion(),
};

// on the joiner
editor2.setInitialValue(seed.value);
const sharedStore2 = editor2.getSharedStore();
sharedStore2.mergeLWW(seed.lww, seed.version);
```

I dati di inizializzazione conservati in questo modo per aprire il documento nei partecipanti successivi contengono i tre valori insieme. Non sono un file: `value` resta ciò che va scritto nell’archivio.  
Un [replicationStore](./remote-storage.md#runtimevalue-getter) non consegna alcun registro, quindi chi si unisce inizializzato dal suo `runtimeValue` li riceve comunque dalla risposta degli editor.

## Modifiche simultanee {#concurrent-edits}

Ogni editor e ogni replica mantiene, per ogni nome e per quasi ogni altro campo, la versione della scrittura che lo ha impostato: sono i suoi registri di collaborazione. Una scrittura viene applicata solo se la sua versione non è inferiore a quella mantenuta, quindi gli editor che ricevono le stesse modifiche in ordini diversi finiscono con lo stesso documento.  
Dalla versione `5.1.0` ogni versione porta, sotto il suo contatore, una posizione propria dell’editor che scrive, ricavata dal suo id. Le versioni crescono quindi a passi di 4.194.304 e superano un intero a 32 bit quando il contatore raggiunge 512. `JSON.stringify` e `JSON.parse` le trasportano intatte, ma un inoltro o un archivio che le analizza con un altro linguaggio deve mantenerle come numeri a 64 bit, mai come interi a 32 bit.

Dalla versione `5.1.0` due editor che cambiano nello stesso istante uno stesso nome o campo, a parte le eccezioni qui sotto, finiscono con lo stesso valore su ogni editor e su ogni replica: scrivendo con lo stesso contatore, assegnano due versioni diverse, e la maggiore prevale ovunque. Prima della versione `5.1.0` entrambi potevano assegnare la stessa versione, e ogni editor manteneva quella ricevuta per ultima, quindi potevano finire con valori diversi. Due editor condividono una posizione con probabilità di 1 su 4.194.304 a coppia, e in quel caso pareggiano come prima.

Dalla versione `5.1.0` la posizione di una tabella, la posizione e la dimensione di un memo o di un gruppo di tabelle e l’origine e il livello di zoom della vista hanno una versione allo stesso modo, e ciò che li sposta viene inviato come il punto in cui terminano:

- un trascinamento come un unico `table.moveTo`, `memo.moveTo` o `tableGroup.moveTo` per ogni entità spostata, in un solo batch, così il trascinamento di un gruppo porta i punti delle sue tabelle, e dalla versione `5.1.1` quelli dei suoi memo, insieme a quello del gruppo;
- l’annullamento o la ripetizione di un trascinamento come il punto in cui porta ogni entità;
- uno scorrimento come `settings.scrollTo` e uno zoom come `settings.changeZoomLevel`;
- il ridimensionamento di un memo o di un gruppo di tabelle come la sua posizione e la sua dimensione insieme.

Quindi due utenti che spostano, o spostano e ridimensionano, una stessa tabella, uno stesso memo o uno stesso gruppo di tabelle nello stesso istante finiscono con quell’elemento in un solo punto e con una sola dimensione su ogni editor e su ogni replica. Il punto va alla scrittura con la versione maggiore, con entrambi gli assi insieme. Uno spostamento non scrive alcuna dimensione, quindi un ridimensionamento mantiene la sua dimensione anche dove uno spostamento fatto nello stesso istante prende il punto.  
Prima della versione `5.1.0` un trascinamento veniva inviato come la distanza percorsa, quindi due trascinamenti di una stessa tabella si sommavano, e uno spostamento e un ridimensionamento di uno stesso memo o gruppo di tabelle fatti nello stesso istante potevano finire con valori diversi.  
Un trascinamento inferiore a 20 px, che non lascia alcuna voce di annullamento, viene inviato come ogni altro, quindi come punto può prevalere su un trascinamento della stessa entità fatto da un altro utente nello stesso istante. Un batch di trascinamento, di scorrimento o di zoom che un trasporto consegna due volte non sposta nulla due volte.

Una modifica del colore è un’eccezione. Viene inviata senza versione, e ogni editor e ogni replica le assegna la propria e mantiene il colore ricevuto per ultimo, quindi due utenti che ricolorano nello stesso istante una stessa tabella, un memo o un gruppo di tabelle possono finire con colori diversi.  
Alcune modifiche non hanno alcuna versione, quindi ogni editor e ogni replica le applica nell’ordine in cui le riceve, e due fatte nello stesso istante possono anch’esse finire con valori diversi: una colonna spostata all’interno della propria tabella o del proprio indice (`column.move`, `indexColumn.move`), e una modifica del [database](../../guide/guides/table-related-functions.md#databases), di una riga di [`View Option`](../../guide/guides/table-related-functions.md#table-view-options) o di `Relationship DataType Sync`, `Maximum comment width` o `Column Order` della scheda [Impostazioni](../../guide/guides/settings.md).  
Anche le entità che due utenti aggiungono nello stesso istante, come due tabelle o due colonne di una stessa tabella, possono trovarsi in un ordine diverso su ogni editor e su ogni replica, e il `value` di ciascuno salva il proprio ordine.

Tutto ciò vale tra editor e repliche della versione `5.1.0` o successiva; [Combinare versioni diverse](#mixing-releases) indica che cosa cambia con una versione più vecchia.

## Combinare versioni diverse {#mixing-releases}

Un editor applica solo i tipi di azione che la sua versione conosce, quindi in una sessione che combina versioni diverse gli editor più vecchi perdono tutto ciò che viaggia su un tipo più recente.

Dalla versione `3.10.0` una modifica di [ON DELETE o ON UPDATE](../../guide/guides/relationship-editing.md#on-delete-and-on-update) di una relazione viaggia come uno di due nuovi tipi di azione, `relationship.changeOnDelete` e `relationship.changeOnUpdate`, e `relationship.add` può contenerli entrambi. Un inoltro che passa le azioni così come sono non ha bisogno di nulla di nuovo per essi.  
Un editor precedente alla versione `3.10.0` ignora quei tipi di azione e quei campi: non conosce mai l’ON DELETE o l’ON UPDATE di una relazione, e un documento salvato da esso non ha né l’uno né l’altro. Una relazione aggiunta da un editor più vecchio arriva senza di essi, quindi entrambi partono da `Not set`.

Ogni altra modifica inviata da un editor `3.10.0` viaggia su tipi di azione che gli editor più vecchi conoscono già.  
`Replace All` in [Trova e sostituisci](../../guide/guides/find-and-replace.md#replacing) invia le sue modifiche come un unico batch delle stesse azioni di rinomina, di commento e di memo inviate da una modifica manuale. Le [opzioni di visualizzazione](../../guide/guides/table-related-functions.md#table-view-options) `Alternate Key` e `Referential Actions` viaggiano sull’azione esistente `settings.changeShow`.

Dalla versione `4.0.0` queste modifiche viaggiano su nuovi tipi di azione, e un inoltro che passa le azioni così come sono non ha bisogno di nulla di nuovo per essi:

- un [gruppo di tabelle](../../guide/guides/table-groups.md) aggiunto, spostato, ridimensionato, rinominato, ricolorato o rimosso: `tableGroup.add`, `tableGroup.move`, `tableGroup.moveTo`, `tableGroup.resize`, `tableGroup.changeName`, `tableGroup.changeColor` e `tableGroup.remove`; una tabella che entra in un gruppo o ne esce: `table.changeGroup`;
- un `Save` di [Associa colonne](../../guide/guides/relationship-editing.md#map-columns) su una relazione esistente, che imposta entrambi i suoi elenchi di colonne in una volta: `relationship.changeColumns`;
- un [blocco](../../guide/guides/settings.md#lock) attivato o disattivato: `settings.changeLockSettings`;
- una modifica allo script `Before tables` o `After tables` della scheda [Schema SQL](../../guide/guides/schema-sql.md): `settings.changeDDLScript`.

Le opzioni di visualizzazione `Table Groups` e `Memos` viaggiano sull’azione esistente `settings.changeShow`.  
`settings.changeIgnoreSaveSettings`, che gli interruttori `Save Scroll Information` e `Save Zoom Information` inviavano prima di essere sostituiti dai blocchi, non viene più inviata, e `settings.changeRelationshipOptimization` non esiste più. Un editor `4.0.0` che riceve l’una o l’altra non cambia nulla.

Un editor precedente alla versione `4.0.0` ignora i nuovi tipi di azione: non vede mai un gruppo di tabelle né quali tabelle ne fanno parte, anche se il trascinamento di un gruppo sposta comunque lì le tabelle del gruppo, poiché invia anche uno spostamento di ciascuna di quelle tabelle.  
Mantiene le vecchie colonne di una relazione dopo un `Save` di Associa colonne e, quando su di esso viene rimossa una colonna di quella vecchia associazione, la relazione scompare su ogni editor. Non ha blocchi né script.  
Un documento salvato da esso non ha nulla di tutto ciò, e un editor `4.0.0` lo apre con tutti i blocchi attivi.  
Mantenere ogni editor di una sessione, e qualsiasi [replicationStore](./remote-storage.md#dispatch-dispatchsync) che ne archivia il documento, alla versione `4.0.0` o successiva.

Un editor `4.1.0` non invia nessun nuovo tipo di azione, quindi editor e repliche `4.0.0` e `4.1.0` condividono una sessione senza perdere nulla.  
Il suo [Trova e sostituisci](../../guide/guides/find-and-replace.md#replacing) cerca anche nei nomi degli indici e dei gruppi di tabelle, e `Replace` e `Replace All` li rinominano tramite le azioni `index.changeName` e `tableGroup.changeName` che un editor `4.0.0` applica già.

Dalla versione `4.2.0` queste modifiche viaggiano su nuovi tipi di azione, e un inoltro che passa le azioni così come sono non ha bisogno di nulla di nuovo per essi:

- il [nome logico](../../guide/guides/logical-names.md) di una tabella o di una colonna: `table.changeLogicalName` e `column.changeLogicalName`; se il suo nome è stato [derivato dai dizionari](../../guide/guides/dictionary.md#deriving-physical-names): `table.changeNameDerived` e `column.changeNameDerived`;
- una colonna collegata a un [dominio](../../guide/guides/dictionary.md#domains-and-data-types) o scollegata: `column.changeDomain`;
- una parola, un termine o un dominio aggiunto, modificato (compresa la sua posizione nel foglio, come la imposta un ordinamento) o rimosso nella scheda [Dizionario](../../guide/guides/dictionary.md): `dictionary.add`, `dictionary.update` e `dictionary.remove`;
- un cambio della [Visualizzazione nomi](../../guide/guides/logical-names.md#switching-the-view): `settings.changeNameViewMode`.

Il blocco `Name View` viaggia sull’azione esistente `settings.changeLockSettings`, l’opzione di visualizzazione `Domain` su `settings.changeShow` e uno spostamento di `Logical Name` o `Domain` nell’[ordine delle colonne](../../guide/guides/settings.md#adjusting-column-order) su `settings.changeColumnOrder`.  
Le azioni `editor.clear` ed `editor.loadJson` di un’importazione Schema SQL, GraphQL, DBML o AML da `Import` contengono `keepDictionaries: true`, che mantiene le parole, i termini e i domini su ogni editor. Lo stesso vale per quelle di un [setSchemaSQL](../erd-editor-element.md#setschemasql), `setSchemaGraphQL`, `setSchemaDBML` o `setSchemaAML` che sostituisce il documento.  
Un nome fisico derivato dai dizionari viaggia su `table.changeName` o `column.changeName`, e il tipo di dati che un dominio assegna alle sue colonne su `column.changeDataType`, le stesse azioni inviate da una modifica manuale.

Un editor precedente alla versione `4.2.0` ignora i nuovi tipi di azione: non ha nomi logici, collegamenti a domini, dizionari né Visualizzazione nomi. Un blocco o uno sblocco di `Name View` non vi cambia nulla, e lo stesso vale per uno spostamento di `Logical Name` o `Domain` nell’ordine delle colonne, o per uno spostamento su uno dei due. Né vi cambia nulla un blocco `Canvas Type` attivato da un editor arrivato alla scheda Impostazioni dalla scheda Dizionario: l’editor più vecchio non conosce quella scheda, quindi mantiene `Canvas Type` sbloccato. Mostra comunque i nomi fisici derivati dai dizionari e i tipi di dati assegnati dai domini.  
Le modifiche che effettua ignorano nomi logici, domini e dizionari, con questi effetti sugli editor più recenti:

- Una tabella o una colonna che rinomina a mano mantiene il nome contrassegnato come derivato, quindi un nome logico scritto in seguito per essa in un editor più recente può derivare di nuovo il nome al posto di quello digitato.
- Un tipo di dati che assegna a una colonna collegata a un dominio lascia il collegamento, quindi il foglio `Checks` elenca `Domain type mismatch` e la successiva modifica del tipo del dominio riassegna alla colonna il tipo del dominio.
- Le colonne di chiave esterna di una relazione che aggiunge non ricevono dalla loro chiave alcun nome logico né dominio.
- Una tabella che incolla o duplica arriva senza nomi logici né collegamenti a domini.
- Un’importazione Schema SQL, GraphQL, DBML o AML su di esso non invia alcun `keepDictionaries`, quindi svuota le parole, i termini e i domini su ogni editor.
- Il suo annullamento di un caricamento, di un’importazione o di `clear()` carica su ogni editor la propria copia del documento, e quella copia non ha nomi logici, collegamenti a domini né dizionari.
- Quella copia, e il documento caricato da un’importazione Schema SQL, GraphQL, DBML o AML su di esso, riportano inoltre il blocco `Name View` di ogni editor allo stato in cui quell’editor lo aveva trovato. Ogni editor salva quindi `Physical Names` come Visualizzazione nomi, e la mostra anche se il blocco è disattivato.

Un documento salvato da esso non ha nomi logici, collegamenti a domini, dizionari né Visualizzazione nomi, quindi un editor `4.2.0` lo apre nella vista `Physical Names`. L’editor più vecchio salva però il blocco `Name View` così come lo ha trovato, quindi un documento sbloccato in un editor `4.2.0` resta sbloccato.  
Mantenere ogni editor di una sessione, e qualsiasi [replicationStore](./remote-storage.md#dispatch-dispatchsync) che ne archivia il documento, alla versione `4.2.0` o successiva.

Un editor `5.1.0` non invia alcun nuovo tipo di azione, quindi editor e repliche precedenti alla versione `5.1.0` condividono comunque una sessione con esso, e un inoltro che passa le azioni così come sono non ha bisogno di nulla di nuovo. Ciò che descrive [Modifiche simultanee](#concurrent-edits) vale però solo tra editor e repliche `5.1.0`:

- I trascinamenti di un editor `5.1.0` viaggiano come punti su `table.moveTo`, `memo.moveTo` e `tableGroup.moveTo`, che gli editor più vecchi già applicano, e i suoi scorrimenti e zoom come punti su `settings.scrollTo` e `settings.changeZoomLevel`, che, come ogni scorrimento e zoom, nessun altro editor applica e solo le repliche accolgono. Un editor più vecchio applica ogni punto di un trascinamento nell’ordine in cui arriva, fuori da qualsiasi registro, e una replica più vecchia fa lo stesso con ogni punto di un trascinamento, di uno scorrimento o di uno zoom, quindi due punti inviati nello stesso istante per una stessa entità, o per la vista, possono finire lì con valori diversi.
- Il trascinamento di un editor più vecchio viaggia ancora come distanza percorsa, che ogni editor e ogni replica somma fuori dai propri registri, e il suo scorrimento o zoom come distanza anch’esso, che ogni replica somma allo stesso modo. Una distanza e un punto su una stessa entità fatti nello stesso istante possono finire con valori diversi su editor e repliche che li ricevono in ordini diversi, e una distanza che un trasporto consegna due volte viene sommata due volte.
- Fuori dalle eccezioni indicate in [Modifiche simultanee](#concurrent-edits), la scrittura di un nome o campo di un editor `5.1.0` fatta nello stesso istante di quella di un editor più vecchio prevale quasi sempre, con la stessa risposta su ogni editor e ogni replica. Due editor più vecchi possono comunque finire con valori diversi per un campo scritto nello stesso istante.
- Un editor `5.1.0` invia un cambio del linguaggio del Generatore di codice, dello stile dei nomi o del tipo di delimitatore solo mentre il suo blocco è disattivato, con il contrassegno `shared: true`, che un editor più vecchio ignora applicando il cambio come prima. Un editor più vecchio invia ancora quello che effettua sotto il blocco, senza contrassegno: un editor o una replica `5.1.0` lo scarta mentre quell’impostazione vi è bloccata, e gli editor più vecchi lo applicano. Quindi sotto un blocco gli editor più vecchi seguono le scelte l’uno dell’altro mentre gli editor `5.1.0` mantengono le proprie, e in entrambi i casi il file mantiene il valore bloccato. Uno sblocco effettuato su una qualsiasi delle due versioni porta il valore di chi sblocca a ogni editor e a ogni replica.
- Un caricamento che sostituisce il documento, come un `value` assegnato, `clear()` o un’importazione che sostituisce, termina il disegno di una relazione su ogni editor `5.1.0`, quello che lo ha effettuato e ognuno di quelli che lo ricevono. Un editor più vecchio mantiene il disegno attivo attraverso di esso.

Mantenere ogni editor di una sessione, e qualsiasi [replicationStore](./remote-storage.md#dispatch-dispatchsync) che ne archivia il documento, alla versione `5.1.0` o successiva, così le modifiche fatte nello stesso istante finiscono allo stesso modo ovunque, a parte le eccezioni indicate in [Modifiche simultanee](#concurrent-edits); la `4.2.0` o successiva resta ciò che mantiene nomi logici e dizionari. Un [server MCP](../../mcp/live-and-headless.md#edits-made-at-the-same-moment) precedente alla `1.2.0` conta qui come un editor precedente alla versione `5.1.0`, e un editor precedente alla versione `5.1.0` non può essere associato affatto a una stanza [Yjs](./yjs.md).

Dalla versione `5.1.1` un memo che entra in un [gruppo di tabelle](../../guide/guides/table-groups.md) o lo lascia viaggia su un nuovo tipo di azione, `memo.changeGroup`, e un inoltro che passa le azioni così come sono non ha bisogno di nulla di nuovo per esso. Viene inviato per un memo rilasciato dentro o fuori da un gruppo, per un nuovo gruppo disegnato attorno a memo visibili che non sono in alcun gruppo, per `Group selected tables` con dei memo selezionati accanto alle tabelle, per `Remove from group` con dei memo nella selezione, per ogni memo di un gruppo rimosso, per le chiamate con cui un agente di programmazione cambia il gruppo dei memo tramite il [server MCP](../../mcp/tools.md#table-groups) e per l’annullamento e la ripetizione di ciascuna di queste azioni. Lo inviano anche un’aggiunta con `Import and Add` o con `setSchemaJSON` i cui gruppi contengono dei memo, e la sua ripetizione, mentre il suo annullamento si limita a rimuovere quei memo.

Un editor o una replica precedente alla versione `5.1.1` ignora `memo.changeGroup`, e la sua analisi scarta il `groupId` di ogni memo, quindi non vede mai un memo in un gruppo, anche se il trascinamento di un gruppo da parte di un editor `5.1.1` sposta comunque lì i memo del gruppo, perché invia anche un `memo.moveTo` per ciascuno di essi. Le sue modifiche non sanno nulla dei gruppi dei memo, con questi effetti sugli editor più recenti:

- Un memo che trascina nel riquadro di un gruppo resta fuori dal gruppo, e un memo del gruppo che trascina fuori dal riquadro resta nel gruppo, mentre il riquadro si allarga per contenerlo.
- Il suo trascinamento di un gruppo, come il suo `Auto Layout`, sposta il gruppo e le sue tabelle ma lascia i memo del gruppo dove si trovano, e il riquadro si allarga per contenere lì quelli visibili.
- Un `Import and Add` su di esso non mette alcun memo nei gruppi che aggiunge.
- Un gruppo che rimuove lascia nel `groupId` di ciascuno dei suoi memo il riferimento al gruppo: i memo risultano fuori da ogni gruppo, e il suo annullamento della rimozione li rimette nel gruppo.
- Il suo annullamento di un caricamento, di un’importazione o di `clear()` carica su ogni editor la propria copia del documento, e quella copia non ha alcun memo in un gruppo.

Un documento salvato da uno di essi non ha alcun memo in un gruppo, anche se uno dalla versione `4.0.0` in poi conserva i gruppi delle sue tabelle.  
Mantenere ogni editor di una sessione, e qualsiasi [replicationStore](./remote-storage.md#dispatch-dispatchsync) che ne archivia il documento, alla versione `5.1.1` o successiva per tenere i memo nei loro gruppi di tabelle; la versione `5.1.0` o successiva resta quella che risolve le modifiche fatte nello stesso istante. Un [server MCP](../../mcp/installation.md#updating) precedente alla versione `1.2.1` allo stesso modo non vede né conserva in quale gruppo di tabelle si trovi un memo.

## SharedStoreConfig {#sharedstoreconfig}

### getNickname {#getnickname}

Imposta il nickname mostrato accanto al cursore del mouse di questo utente negli altri editor.  
Gli altri utenti vedono `user` quando il nickname manca o è vuoto.

```js
editor.getSharedStore({
  getNickname: () => 'nickname...',
});
```

### mouseTracker {#mousetracker}

Trasmette agli altri editor il cursore del mouse di questo utente. Il valore predefinito è `true`.  
I cursori inviati dagli altri utenti vengono sempre mostrati nell’area di disegno ERD.

```js
editor.getSharedStore({ mouseTracker: false });
```

### focusTracker {#focustracker}

Trasmette ciò su cui sta lavorando questo utente. Il valore predefinito è `true`.  
La tabella e la cella con il focus, le tabelle, i memo e i gruppi di tabelle selezionati e il riquadro che si trascina nell’area di disegno vengono inviati agli altri editor e lì disegnati.  
Ogni utente riceve un proprio colore, così è possibile distinguerli: un contorno sulla tabella con il focus, una sottolineatura sulla cella con il focus, un anello attorno alle tabelle, ai memo e ai gruppi di tabelle selezionati e un rettangolo tratteggiato per il riquadro di trascinamento.  
Dalla versione `4.2.0` ogni utente può guardare una diversa vista della [Visualizzazione nomi](../../guide/guides/logical-names.md#collaborators) mentre il relativo blocco è attivo, o dopo il cambio di vista effettuato da un editor di sola lettura. Una cella con il focus che la propria vista non disegna viene sottolineata sulla cella disegnata al suo posto: il nome e il nome logico prendono l’uno il posto dell’altro, come fanno il tipo di dati e il dominio.  
La presenza in arrivo dagli altri utenti viene sempre disegnata nella propria area di disegno, che questa opzione sia attiva o no.  
Nella modalità Flusso della scheda Visualizzazione, il focus e la selezione degli altri utenti vengono disegnati sulle card delle tabelle, ma i loro riquadri di trascinamento no. Le tabelle selezionate lì vengono comunque inviate; il riquadro trascinato lì no.

```js
editor.getSharedStore({ focusTracker: false });
```

Disattivare entrambi i tracker per usare lo store condiviso come semplice inoltro che non pubblica alcuna presenza propria.  
La presenza inviata dagli altri editor viene comunque ricevuta e disegnata.  
È ciò che fanno gli editor in VS Code, in Obsidian, in un IDE JetBrains e in Google Drive.

```js
editor.getSharedStore({ mouseTracker: false, focusTracker: false });
```

Il cursore, il focus, la selezione e il riquadro di trascinamento viaggiano sullo stesso flusso delle modifiche al documento, ma sono effimeri.  
Non entrano mai nel documento, nella cronologia delle modifiche né in `editor.value`, quindi un trasporto è libero di scartarli e un replicationStore li ignora.

## SharedStore {#sharedstore}

### connection, disconnect {#connection-disconnect}

Questi metodi impostano lo stato di connessione corrente.  
In stato disconnesso, le modifiche vengono memorizzate internamente in un buffer.  
Le modifiche nel buffer vengono emesse ai sottoscrittori non appena la trasmissione torna possibile.  
Lo stato predefinito è connesso (`connection`).

```js
sharedStore.connection();
sharedStore.disconnect();
```

### dispatch, dispatchSync {#dispatch-dispatchsync}

Applica all’istanza corrente dell’editor le modifiche provenienti da altre istanze dell’editor.  
Quando un batch contiene la richiesta di registri di un altro editor, come quella inviata dalla prima chiamata a [subscribe](#subscribe) di chi si unisce, lo store risponde tramite i propri sottoscrittori con i suoi registri e la sua versione, a meno che non contenga registri.  
Dalla versione `5.1.0` invia prima ogni batch di flusso che ancora trattiene, come fa [flushStreamBuffers](#flushstreambuffers), così ogni versione contenuta nella sua risposta poggia su una scrittura già inviata agli altri. L’arrivo di chi si unisce fa quindi inviare subito a ogni editor della sessione un trascinamento, uno scorrimento, uno zoom, una modifica del colore o un ridimensionamento di un memo che ancora trattiene.

```js
sharedStore.dispatch(actions); // async
sharedStore.dispatchSync(actions); // sync
```

### subscribe {#subscribe}

Effettua la sottoscrizione alle modifiche dell’editor.  
Nulla esce dall’editor finché non c’è almeno un sottoscrittore, e le modifiche fatte prima di allora vengono memorizzate in un buffer.  
La prima chiamata a subscribe chiede anche agli altri editor i loro registri di collaborazione, che risolvono le [modifiche simultanee](#concurrent-edits), così un partecipante tardivo le risolve allo stesso modo.  
Non trasmette il documento, quindi [inizializzare](#seeding-a-collaborator) prima un partecipante tardivo; dalla versione `5.1.0` i dati di inizializzazione possono contenere anche i registri.  
Dalla versione `4.0.0` lo store chiede di nuovo ogni volta che `setInitialValue`, o dalla versione `5.1.0` [reseed](#reseed), carica un documento nel suo editor dopo quella prima chiamata a subscribe.

```js
const unsubscribe = sharedStore.subscribe(actions => {
  // send...
});
```

### flushStreamBuffers {#flushstreambuffers}

Invia subito i batch di flusso che questo store sta ancora trattenendo, invece che dopo il loro periodo di quiete.  
Dalla versione `3.9.2` funziona su uno store ottenuto da `getSharedStore`; nella `3.9.1` il metodo è presente nel tipo ma non fa nulla.  
Lo spostamento di una tabella, di un memo o di un gruppo di tabelle, la modifica del suo colore, il ridimensionamento di un memo e lo scorrimento o lo zoom della vista vengono fatti ciascuno come un flusso di piccole modifiche. Il ridimensionamento di un gruppo di tabelle no: viene inviato una sola volta, al termine del trascinamento.  
Lo store raccoglie ogni flusso in un unico batch e lo trattiene finché il flusso non resta in quiete per 200 ms, in due fasi. Una modifica del colore o un ridimensionamento di un memo le supera entrambe, quindi parte circa 400 ms dopo l’ultima modifica, come ogni flusso prima della versione `5.1.0`. Dalla versione `5.1.0` un trascinamento, uno scorrimento o uno zoom parte dopo la prima fase, circa 200 ms dopo il suo ultimo passo, come il punto in cui termina (vedere [Modifiche simultanee](#concurrent-edits)).  
Una chiamata termina questa attesa in entrambe le fasi. Mentre lo store è connesso, un sottoscrittore riceve il batch prima che la chiamata restituisca il controllo. Una chiamata senza nulla in sospeso non invia nulla.  
`destroy`, sia quello dello store sia quello dell’editor, scarta un batch ancora trattenuto, quindi chiamare prima questo metodo quando si rilascia uno store e gli altri devono mantenere l’ultima modifica, come quando si chiude una scheda.

```js
sharedStore.flushStreamBuffers();
sharedStore.destroy();
```

### getLWW {#getlww}

Dalla versione `5.1.0`, restituisce una copia dei registri di collaborazione dell’editor (vedere [Modifiche simultanee](#concurrent-edits)).  
La copia viene fatta tramite JSON, quindi è un semplice oggetto pronto per `JSON.stringify`, e una sua modifica lascia invariati i registri dello store.  
Passarla così com’è a [mergeLWW](#mergelww) o a [reseed](#reseed) di un altro store. La sua forma è propria dell’editor, quindi non leggerne alcun campo.  
Leggerla insieme a [getVersion](#getversion) e al `runtimeValue` dell’editor nello stesso momento per [inizializzare chi si unisce](#seeding-a-collaborator).

```js
const lww = sharedStore.getLWW();
```

### mergeLWW {#mergelww}

Dalla versione `5.1.0`, accoglie nei registri di questo store quelli che un altro store ha consegnato con [getLWW](#getlww), mantenendo la versione maggiore di ciascuno, e accoglie `version` nell’orologio dell’editor, che mantiene la maggiore tra la propria e quella data.  
Non cambia nulla nel documento: nemmeno un byte di `value` o `runtimeValue`, nessuna voce di annullamento e nessun evento `change`. Alza soltanto le versioni che una scrittura successiva deve superare, quindi in seguito una scrittura più vecchia dei registri dati viene rifiutata, e la modifica successiva dell’editor porta una versione superiore a `version`.  
Non invia nulla e non risponde a nulla. È ciò che la prima chiamata a subscribe di chi si unisce ottiene dalla risposta degli altri, accolto direttamente.  
Chiamarlo dopo `setInitialValue`, mai prima: ogni `setInitialValue` e ogni [reseed](#reseed) scarta i registri mantenuti, e con essi ciò che un `mergeLWW` precedente aveva accolto.

```js
sharedStore.mergeLWW(lww, version);
```

### getVersion {#getversion}

Dalla versione `5.1.0`, restituisce la versione più alta che l’orologio dell’editor ha unito: la maggiore tra le versioni delle modifiche che ha effettuato o accolto, delle richieste di registri e delle risposte scambiate all’ingresso di un partecipante, e di ogni `version` data a `mergeLWW` o `reseed`.  
Cursori, focus, selezioni e riquadri di trascinamento, propri o di un altro editor, non la spostano.  
Consegnarla con [getLWW()](#getlww), letto nello stesso momento, a [mergeLWW](#mergelww) o a [reseed](#reseed) di chi si unisce. È una [versione](#concurrent-edits) come quelle che portano le sue azioni.

```js
const version = sharedStore.getVersion();
```

### forgetPeer {#forgetpeer}

Dalla versione `5.1.0`, rimuove subito il cursore, il focus, la selezione e il riquadro di trascinamento inviati dall’editor con l’id dato, e la scadenza che ciascuno attendeva. Quelli di ogni altro editor restano.  
L’id è il `meta.editorId` portato da ogni azione che lo store condiviso di quell’editor invia. Un id di cui questo editor non ha nulla non cambia nulla.  
Chiamarlo quando il proprio trasporto viene a sapere che un peer se n’è andato. Altrimenti ciò che il peer ha inviato resta disegnato fino alla scadenza: il suo cursore 30 secondi dopo l’ultimo ricevuto, il suo focus e la sua selezione 90 secondi dopo e il suo riquadro di trascinamento 3 secondi dopo.

```js
sharedStore.forgetPeer(editorId);
```

### reseed {#reseed}

Dalla versione `5.1.0`, apre di nuovo nell’editor il documento di una sessione, come fa un rientro. Il binding [Yjs](./yjs.md) lo chiama per aprire il documento di una stanza quando si associa a una stanza già inizializzata, e di nuovo a ogni rientro, conservando la schermata una volta entrato nella stanza.  
Carica `value` come fa [setInitialValue](../erd-editor-element.md#setinitialvalue) e accoglie `lww` e `version` come fa [mergeLWW](#mergelww), quindi lo store contiene esattamente i registri dati, e il suo orologio la maggiore tra la propria versione e `version`. Svuota inoltre la cronologia delle modifiche e, a differenza di `setInitialValue`, scarta la selezione e il focus, poiché potrebbero indicare ciò che il valore non contiene più.  
A parte la derivazione del nome logico descritta più sotto, non produce alcuna voce di annullamento, non emette alcun evento `change` e non invia alcuna modifica. Una volta che lo store ha avuto un sottoscrittore, invia la richiesta di registri che ogni caricamento di questo tipo invia, che un trasporto che ha già consegnato i registri può scartare, e, con [focusTracker](#focustracker) attivo, la selezione e il focus azzerati.  
Come `setInitialValue`, funziona mentre [readonly](../erd-editor-element.md#readonly) è impostato, scarta una vista in modalità Flusso, termina il disegno di una relazione e chiude gli editor del memo, del nome del gruppo di tabelle e delle celle, mantenendo o scartando allo stesso modo ciò che vi era stato digitato; un nome che una cella del nome logico in chiusura ricava da ciò che il suo lettore ha digitato è una modifica ordinaria: inviata, annullabile ed emessa come evento `change`.

Senza `keepScreen` la schermata mostra ciò che contiene il valore, come dopo `setInitialValue`. Con `keepScreen: true` la schermata del lettore viene riportata sopra il documento caricato, solo su quella schermata:

- la posizione di scorrimento e il livello di zoom, una volta che l’elemento li ha mostrati; uno mai mostrato, o caricato mentre era nascosto e non più mostrato da allora, si apre dove lo porta il valore, come per chi si unisce in ritardo;
- la scheda, quando il caricamento l’ha spostata, e nella scheda Impostazioni anche la scheda da cui il lettore proveniva, che è quella indicata da un blocco `Canvas Type` attivato lì;
- la Visualizzazione nomi e ogni impostazione del Generatore di codice che il lettore mostrava come propria sotto il suo blocco, ma solo quando quel blocco era attivo prima del caricamento, lo è ancora dopo e contiene lo stesso valore bloccato. Quindi quando nel frattempo un peer ha sbloccato, cambiato e bloccato di nuovo un’impostazione con un altro valore, l’editor si apre sul nuovo valore bloccato, e dove il blocco è disattivato prima o dopo il caricamento, mostra il valore caricato;
- ogni impostazione che un lettore di sola lettura ha cambiato sul proprio schermo, qualunque cosa dicano i blocchi.

Nulla di ciò viene inviato, e `value` e `runtimeValue` continuano a riportare il documento caricato. Un successivo sblocco di un peer sostituisce un’impostazione del codice conservata in questo modo, come fa ogni sblocco.  
Il successivo scorrimento o zoom del lettore, fatto mentre l’editor può modificare, rende di nuovo del documento la posizione di scorrimento e il livello di zoom conservati, e parte guidato da dove si trova la schermata, così anche le repliche accolgono quello zoom.

Una chiamata a `reseed` lascia invariato ciò che lo store trattiene. Un trascinamento, uno scorrimento o uno zoom ancora trattenuto parte dopo di essa, letto dal documento reinizializzato; una modifica del colore o un ridimensionamento di un memo parte com’era stato fatto, anche se l’editor non lo mostra più; e ciò che `disconnect()` ha trattenuto parte con `connection()`.  
Quindi chiamare prima [flushStreamBuffers](#flushstreambuffers), inviare ciò che emette e inizializzare di nuovo con un valore che lo contiene. Non inizializzare mai di nuovo mentre si è disconnessi.

```js
sharedStore.reseed(seed.value, {
  lww: seed.lww,
  version: seed.version,
  keepScreen: true,
});
```

### destroy {#destroy}

Distrugge completamente l’istanza di sharedStore.  
L’editor in sé non viene toccato, quindi, uscendo da una sessione, il documento resta modificabile.  
I tracker del mouse e del focus si fermano quando viene distrutto l’ultimo sharedStore fornito dall’editor.  
Un batch di flusso ancora trattenuto dallo store viene scartato insieme a esso; per inviarlo, chiamare prima [flushStreamBuffers](#flushstreambuffers).  
I cursori, i focus, le selezioni e i riquadri di trascinamento inviati dagli altri editor restano disegnati fino alla scadenza; dalla versione `5.1.0` [forgetPeer](#forgetpeer) rimuove subito quelli di un editor.

```js
sharedStore.destroy();
```
