---
sidebar_position: 1
description: Inoltrare le modifiche dell’editor tra le istanze con getSharedStore, inizializzare un editor che si unisce a partire da runtimeValue e mostrare il cursore, il focus, la selezione e il riquadro di trascinamento di ogni collaboratore.
---

# Modifica collaborativa

`getSharedStore()` trasforma un editor in un nodo di una sessione collaborativa.  
Emette ogni modifica come un flusso di azioni e applica le azioni che gli altri editor inviano a loro volta — il trasporto tra di essi va fornito da chi integra l’editor (WebSocket, WebRTC o qualsiasi altro mezzo in grado di trasportare JSON).  
È uno dei metodi di [ErdEditorElement](../erd-editor-element.md) e si usa insieme ad [Archiviazione remota](./remote-storage.md) quando le modifiche inoltrate devono anche essere archiviate.

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
  destroy: () => void;
};

// example
const sharedStore = editor.getSharedStore();
```

Un’azione è un semplice oggetto serializzabile che descrive una modifica al documento, quindi supera indenne `JSON.stringify` lungo il percorso verso il trasporto.  
Le azioni arrivano in batch: `subscribe` consegna un array, e quell’array è un’unità — inoltrarlo per intero e applicarlo per intero dall’altro lato.  
Trattare un’azione come opaca e passarla così com’è invece di leggerla o riscriverla, poiché sono i dati di gestione che contiene a mantenere sincronizzati gli editor.

Parte di ciò che fa un editor resta su quell’editor.  
Il passaggio in primo piano di una tabella, di un memo o di un gruppo di tabelle, come avviene con la selezione, non viene inviato.  
Non vengono inviate nemmeno le scelte `Statements`, `Header`, `Write logical names into empty comments` (dalla versione `4.2.0`) e `Tables` della scheda [Schema SQL](../../guide/guides/schema-sql.md), che appartengono alla finestra in cui vengono effettuate.  
Dalla versione `4.1.0` anche il pannello [Esplora](../../guide/guides/explorer.md) resta sul proprio editor: lo stato di apertura, la larghezza, le righe compresse, la riga su cui si trova il focus della tastiera, la posizione di scorrimento dell’albero, la ricerca e le opzioni non vengono inviati.  
Non viene inviata nemmeno l’[evidenziazione](../../guide/guides/relationship-editing.md#reading-a-connector) che compare sul connettore della relazione di una chiave esterna quando si va a quest’ultima.  
Dalla versione `4.2.0` anche la scheda [Dizionario](../../guide/guides/dictionary.md) resta sul proprio editor: il foglio visualizzato e, per ogni foglio, la ricerca, la selezione, la posizione di scorrimento e le larghezze delle colonne non vengono inviati. Vengono invece inviati le sue modifiche, i suoi ordinamenti e le sue importazioni CSV.  
Uno scorrimento, uno zoom o un cambio di scheda viene inviato, ma non sposta mai la vista o la scheda di un altro utente. Ciò vale anche per lo scorrimento prodotto da un salto dal pannello Esplora, per il passaggio alla scheda ERD quando il pannello Esplora viene aperto da un’altra scheda e per il cambio di scheda e lo scorrimento prodotti da un salto dal foglio [`Checks`](../../guide/guides/dictionary.md#the-checks-sheet) della scheda Dizionario a una tabella o a una colonna. Un salto da quel foglio a una parola, a un termine o a un dominio resta nella scheda Dizionario, quindi non ne viene inviato nulla.

Dalla versione `4.2.0` viene inviato anche un cambio della [Visualizzazione nomi](../../guide/guides/logical-names.md#switching-the-view), e il suo [blocco](../../guide/guides/settings.md#lock) decide che cosa ne fanno gli altri editor. Il blocco `Name View` è attivo in un nuovo diagramma e in qualsiasi documento precedente alla versione `4.2.0`.  
Mentre il blocco è attivo, il cambio compare solo nell’editor che lo ha effettuato: viene comunque inviato, ma ogni altro editor e ogni replica lo scartano, così ogni utente può guardare una vista diversa mentre `value` mantiene quella bloccata. Diverso è il caso di un cambio di linguaggio, di stile dei nomi o di tipo di delimitatore: raggiunge ogni editor, che il suo blocco sia attivo o no.  
Mentre il blocco è disattivato, un cambio effettuato in un editor che può modificare il documento cambia la Visualizzazione nomi su ogni editor e su ogni replica, dove prevale l’ultimo cambio, e ognuno di essi la salva.  
Il cambio effettuato da un editor di sola lettura resta sempre su quell’editor, che continua comunque a seguire i cambi condivisi degli altri.

Dalla versione `5.0.0` un editor [di sola lettura](../erd-editor-element.md#readonly) non invia alcun cambio. Lo scorrimento, lo zoom, la scheda, la Visualizzazione nomi, il database, il linguaggio del Generatore di codice, gli stili dei nomi, il tipo di delimitatore e le righe di `View Option` che il suo lettore cambia restano sul suo schermo, qualunque sia il loro blocco; prima della versione `5.0.0` i suoi scorrimenti, zoom, cambi di scheda, database e impostazioni del codice venivano inviati come quelli di un editor modificabile.  
Il suo store continua a inviare ciò che inviano i suoi tracker del cursore, del focus, della selezione e del riquadro di trascinamento del lettore, risponde ai registri richiesti da un editor che si unisce e applica ogni cambio inviato dagli altri. Un cambio del database, di un’impostazione del Generatore di codice o di una riga di `View Option` raggiunge il suo documento, e anche il suo schermo a meno che il lettore non abbia cambiato quell’impostazione proprio lì, e un cambio condiviso della Visualizzazione nomi compare comunque sul suo schermo.  
Quando l’editor diventa di sola lettura, invia prima ciò che lo store trattiene ancora di un trascinamento o di uno scorrimento, come fa [flushStreamBuffers](#flushstreambuffers), così gli altri conservano l’ultima parte.

I [blocchi](../../guide/guides/settings.md#lock) sono condivisi: l’ultimo blocco o sblocco di un’impostazione prevale su ogni editor e un blocco porta con sé i valori dell’editor che lo ha attivato, quindi ogni editor e ogni replica salvano lo stesso valore.  
Il blocco `Viewport` salva quindi la vista dell’editor che lo ha attivato e il blocco `Canvas Type` l’ultima scheda in cui si trovava quell’editor prima della scheda Impostazioni, dove i blocchi vengono attivati.  
La disattivazione del blocco `Language`, `Table Name Case`, `Column Name Case`, `Bracket Type` o, dalla versione `4.2.0`, `Name View` porta anche quell’impostazione, su ogni editor, al valore mostrato nell’editor che lo ha disattivato, così tutti continuano a salvare un unico valore. La disattivazione di `Viewport` o `Canvas Type` non sposta la vista né la scheda di nessuno.

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
Dalla versione `4.0.0` scarta anche i registri di collaborazione dell’editor, che risolvono le modifiche simultanee. Se lo store condiviso dell’editor ha già avuto un sottoscrittore, lo store chiede di nuovo agli altri editor i loro registri, come alla sua prima chiamata a [subscribe](#subscribe), così un editor ricaricato a metà sessione risolve le modifiche come fanno gli altri.  
L’assegnazione di `value` mantiene i registri ma, a differenza di `setInitialValue`, viene inoltrata: una volta che l’editor ha uno store condiviso, ogni editor della sessione carica il documento assegnato, quindi non inizializzare mai un nuovo partecipante in questo modo.

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

Un editor precedente alla versione `4.0.0` ignora i nuovi tipi di azione: non vede mai un gruppo di tabelle né quali tabelle ne fanno parte, anche se il trascinamento di un gruppo sposta comunque lì le tabelle del gruppo, poiché invia anche il loro `table.move`.  
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

```js
sharedStore.dispatch(actions); // async
sharedStore.dispatchSync(actions); // sync
```

### subscribe {#subscribe}

Effettua la sottoscrizione alle modifiche dell’editor.  
Nulla esce dall’editor finché non c’è almeno un sottoscrittore, e le modifiche fatte prima di allora vengono memorizzate in un buffer.  
La prima chiamata a subscribe chiede anche agli altri editor i loro registri di collaborazione, che risolvono le modifiche simultanee, così un partecipante tardivo le risolve allo stesso modo.  
Non trasmette il documento, quindi [inizializzare](#seeding-a-collaborator) prima un partecipante tardivo.  
Dalla versione `4.0.0` lo store chiede di nuovo ogni volta che `setInitialValue` carica un documento nel suo editor dopo quella prima chiamata a subscribe.

```js
const unsubscribe = sharedStore.subscribe(actions => {
  // send...
});
```

### flushStreamBuffers {#flushstreambuffers}

Invia subito i batch di flusso che questo store sta ancora trattenendo, invece che dopo il loro periodo di quiete.  
Dalla versione `3.9.2` funziona su uno store ottenuto da `getSharedStore`; nella `3.9.1` il metodo è presente nel tipo ma non fa nulla.  
Lo spostamento di una tabella, di un memo o di un gruppo di tabelle, la modifica del suo colore, il ridimensionamento di un memo e lo scorrimento o lo zoom della vista arrivano ciascuno come un flusso di piccole modifiche. Il ridimensionamento di un gruppo di tabelle no: viene inviato una sola volta, al termine del trascinamento.  
Lo store raccoglie ogni flusso in un unico batch e lo trattiene finché il flusso non resta in quiete per 200 ms. Lo fa in due fasi, quindi il batch parte circa 400 ms dopo l’ultima modifica.  
Una chiamata termina questa attesa in entrambe le fasi. Mentre lo store è connesso, un sottoscrittore riceve il batch prima che la chiamata restituisca il controllo. Una chiamata senza nulla in sospeso non invia nulla.  
`destroy`, sia quello dello store sia quello dell’editor, scarta un batch ancora trattenuto, quindi chiamare prima questo metodo quando si rilascia uno store e gli altri devono mantenere l’ultima modifica, come quando si chiude una scheda.

```js
sharedStore.flushStreamBuffers();
sharedStore.destroy();
```

### destroy {#destroy}

Distrugge completamente l’istanza di sharedStore.  
L’editor in sé non viene toccato, quindi, uscendo da una sessione, il documento resta modificabile.  
I tracker del mouse e del focus si fermano quando viene distrutto l’ultimo sharedStore fornito dall’editor.  
Un batch di flusso ancora trattenuto dallo store viene scartato insieme a esso; per inviarlo, chiamare prima [flushStreamBuffers](#flushstreambuffers).

```js
sharedStore.destroy();
```
