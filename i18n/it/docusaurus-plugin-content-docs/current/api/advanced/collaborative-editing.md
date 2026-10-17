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
Non vengono inviate nemmeno le scelte `Statements`, `Header` e `Tables` della scheda [Schema SQL](../../guide/guides/schema-sql.md), che appartengono alla finestra in cui vengono effettuate.  
Dalla versione `4.1.0` anche il pannello [Esplora](../../guide/guides/explorer.md) resta sul proprio editor: lo stato di apertura, la larghezza, le righe compresse, la riga su cui si trova il focus della tastiera, la posizione di scorrimento dell’albero, la ricerca e le opzioni non vengono inviati.  
Non viene inviata nemmeno l’[evidenziazione](../../guide/guides/relationship-editing.md#reading-a-connector) che compare sul connettore della relazione di una chiave esterna quando si va a quest’ultima.  
Uno scorrimento, uno zoom o un cambio di scheda viene inviato, ma non sposta mai la vista o la scheda di un altro utente. Ciò vale anche per lo scorrimento prodotto da un salto dal pannello Esplora e per il passaggio alla scheda ERD quando il pannello Esplora viene aperto da un’altra scheda.

I [blocchi](../../guide/guides/settings.md#lock) sono condivisi: l’ultimo blocco o sblocco di un’impostazione prevale su ogni editor e un blocco porta con sé i valori dell’editor che lo ha attivato, quindi ogni editor e ogni replica salvano lo stesso valore.  
Il blocco `Viewport` salva quindi la vista dell’editor che lo ha attivato e il blocco `Canvas Type` l’ultima scheda in cui si trovava quell’editor prima della scheda Impostazioni, dove i blocchi vengono attivati.  
La disattivazione del blocco `Language`, `Table Name Case`, `Column Name Case` o `Bracket Type` porta anche quell’impostazione, su ogni editor, al valore mostrato nell’editor che lo ha disattivato, così tutti continuano a salvare un unico valore. La disattivazione di `Viewport` o `Canvas Type` non sposta la vista né la scheda di nessuno.

Una modifica allo script `Before tables` o `After tables` viene inviata per intero quando il suo campo perde il focus. I due script vengono risolti separatamente, quindi la modifica di uno da parte di un collaboratore non sovrascrive mai l’altro.

Nulla di ciò che si fa nella [modalità Flusso](../../guide/guides/visualization.md#flow-never-edits-the-document) della scheda Visualizzazione è una modifica del documento, quindi un editor in modalità Flusso non invia modifiche agli altri e le modifiche inviate da questi continuano a essere applicate mentre vi si trova.  
L’unica eccezione è l’uscita dalla modalità Flusso verso un’altra scheda: quel cambio di scheda viene inviato come qualsiasi altro.  
Il pulsante di link esterno della card, un risultato della [Ricerca rapida](../../guide/guides/quick-search.md#searching-the-diagram) scelto dopo `#`, `@` o `:` e l’apertura del pannello [Esplora](../../guide/guides/explorer.md#opening-and-closing) fanno tutti uscire dalla modalità Flusso verso la scheda ERD. Viene inviato anche lo scorrimento che il pulsante della card o un risultato della Ricerca rapida producono lì.

## Due editor in una pagina {#two-editors-on-one-page}

Qui il collegamento da subscribe a dispatch fa le veci della rete, così si può vedere la struttura di una sessione senza un trasporto di mezzo.

```js
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
