---
sidebar_position: 2
description: Mantenere allineati un elemento <erd-editor> o uno store peer headless tramite un documento Yjs con @dineug/erd-editor-yjs, inizializzare una stanza, mostrare la presenza tramite Awareness, continuare a modificare offline e riunire la cronologia della stanza con un sidecar di compattazione.
---

# Yjs

`@dineug/erd-editor-yjs` mantiene i diagrammi allineati tramite un documento [Yjs](https://github.com/yjs/yjs). È un pacchetto a sé, pubblicato per la prima volta come `0.1.0` accanto a `@dineug/erd-editor` `5.1.0`.  
`bindErdEditor` associa a un `Y.Doc` un elemento `<erd-editor>`, e `bindPeerStore` uno store peer headless di `@dineug/erd-editor/peer.js`.  
Qualunque provider trasporti il `Y.Doc` trasporta il diagramma: un server websocket, WebRTC, IndexedDB o uno proprio. Il provider e il `Y.Doc` restano dell’utente: il binding non li connette, non li disconnette e non li distrugge mai.

Le modifiche viaggiano come i gruppi di azioni dell’editor, che il binding conserva così come li ha inviati lo store.  
Quindi i registri di collaborazione dell’editor risolvono le modifiche fatte nello stesso istante come in una sessione collegata tramite `getSharedStore`, con le stesse eccezioni, come una modifica del colore — vedere [Modifiche simultanee](./collaborative-editing.md#concurrent-edits).  
Cursori, focus, selezioni e riquadri di trascinamento viaggiano tramite l’Awareness del provider — vedere [Presenza](#presence).  
Rispetto al collegamento manuale di uno store condiviso a un trasporto, il binding aggiunge:

- Un client che entra apre il diagramma contenuto nella stanza, senza che un editor in esecuzione debba passargli un [runtimeValue](../erd-editor-element.md#runtimevalue).
- Un client disconnesso continua a modificare, e le sue modifiche arrivano quando si riconnette — vedere [Modifiche offline e rientri](#offline-edits-and-rejoins).
- Un `Y.Doc` restituito da un provider di persistenza apre il diagramma che contiene — vedere [Cosa contiene la stanza](#what-the-room-holds).
- Un sidecar Node facoltativo riunisce la cronologia della stanza in un’unica istantanea — vedere [Compattare una stanza](#compacting-a-room).

Il binding richiede i cinque metodi aggiunti dalla versione `5.1.0` allo store condiviso e allo store peer — [getLWW](./collaborative-editing.md#getlww), [mergeLWW](./collaborative-editing.md#mergelww), [getVersion](./collaborative-editing.md#getversion), [forgetPeer](./collaborative-editing.md#forgetpeer) e [reseed](./collaborative-editing.md#reseed) — ed esegue da sé ogni chiamata necessaria.

## Installazione {#installation}

```sh
npm install @dineug/erd-editor-yjs @dineug/erd-editor yjs y-protocols
npm install y-websocket # or another provider
```

`@dineug/erd-editor`, `yjs` e `y-protocols` sono dipendenze peer, quindi una pagina ne contiene una sola copia: `@dineug/erd-editor` `5.1.0` o successiva nella `5.x`, `yjs` `13.6` o successiva nella `13.x` e `y-protocols` `1.0` o successiva nella `1.x`.  
Il pacchetto prende solo i loro tipi e lavora sul `Y.Doc` e sull’`Awareness` passati, quindi non carica codice proprio di Yjs, di y-protocols o dell’editor.  
Due copie di Yjs in una pagina fanno fallire a vicenda i rispettivi controlli dei costruttori, e la seconda registra `Yjs was already imported`. Quando il codice dell’utente e un provider risolvono `yjs` da due posizioni diverse, eliminare il duplicato nel bundler (Vite: `resolve.dedupe: ['yjs']`).

Il pacchetto è solo ESM (`"type": "module"`), con un solo punto di ingresso, la radice del pacchetto, ed è dichiarato privo di effetti collaterali, quindi un bundle che importa solo `bindErdEditor` lascia fuori il compattatore.  
`bindErdEditor` richiede un DOM, perché associa un elemento `<erd-editor>` già definito. `bindPeerStore` funziona anche in semplice Node, con Node.js 22.12 o successivo, come il [sidecar di compattazione](#compacting-a-room).

## Utilizzo {#usage}

```ts
function bindErdEditor(
  editor: ErdEditorElement,
  doc: Y.Doc,
  options?: BindOptions
): ErdYjsBinding;
```

```js
import '@dineug/erd-editor/erd-editor.js';

import { bindErdEditor } from '@dineug/erd-editor-yjs';
import { WebsocketProvider } from 'y-websocket';
import * as Y from 'yjs';

const doc = new Y.Doc();
const provider = new WebsocketProvider('wss://yjs.example.com', 'my-diagram', doc);
const editor = document.createElement('erd-editor');
document.body.appendChild(editor);

provider.on('sync', function onSync(synced) {
  if (!synced) return;
  provider.off('sync', onSync);

  const binding = bindErdEditor(editor, doc, {
    awareness: provider.awareness,
    getNickname: () => 'Ada',
  });
  binding.on('error', error => console.error(error));
  binding.on('rejoin', reason => console.info('reopened on the room', reason));
  binding.seed(); // false, and nothing written, once the room holds a diagram
});
```

`wss://yjs.example.com` e `my-diagram` rappresentano il server e la stanza dell’utente.  
Associare, e inizializzare, solo dopo che il provider si è sincronizzato, come indica l’evento `sync` di y-websocket con `true`. Un’inizializzazione fatta prima può sostituire il diagramma della stanza — vedere [Inizializzare una stanza](#seeding-a-room).

Quando al momento dell’associazione il `Y.Doc` contiene l’istantanea di una stanza, il binding la apre subito nell’elemento: carica l’istantanea con i suoi registri e la sua versione, come fa [reseed](./collaborative-editing.md#reseed), e applica tutte le modifiche registrate da allora.  
Questa apertura cancella e chiude ciò che fa un rientro — vedere [Modifiche offline e rientri](#offline-edits-and-rejoins) — e l’elemento si apre dove lo porta l’istantanea. Per questa prima apertura non viene emesso alcun `rejoin`.  
Quando il `Y.Doc` non contiene alcuna istantanea, come in una stanza vuota o prima che il provider si sia sincronizzato, l’elemento conserva il proprio documento, e il binding non scrive nulla nella stanza finché non compare un’istantanea, la propria [inizializzazione](#seed) o quella di un altro client.

`bindErdEditor` prende dall’elemento uno store condiviso con [getSharedStore](../erd-editor-element.md#getsharedstore), e [destroy](#destroy) lo rilascia.  
L’elemento deve già essere un `<erd-editor>`, con il suo punto di ingresso importato o `defineErdEditor()` chiamata — vedere [Registrare gli elementi](../installation.md#registering-the-elements). Finché il tag non è definito, un `<erd-editor>` è un semplice `HTMLElement`, che il browser aggiorna quando il tag viene definito e l’elemento è nel documento. Per un elemento non ancora aggiornato, `bindErdEditor` genera un `TypeError` invece di emettere `error`.

Le modifiche della stanza si applicano all’elemento, ed emettono [change](../erd-editor-element.md#change), come quelle di un collaboratore, comprese quelle riapplicate dopo l’apertura di un’istantanea.  
L’apertura di un’istantanea, al momento dell’associazione o in un rientro, non crea alcuna voce di annullamento, non emette `change` e non scrive nulla nella stanza, a parte la derivazione del nome logico descritta in [Modifiche offline e rientri](#offline-edits-and-rejoins).  
Per caricare un altro documento in una stanza già inizializzata, fare una modifica che ogni client applica: assegnare [value](../erd-editor-element.md#value), chiamare [clear](../erd-editor-element.md#clear) o importarne uno.  
[setInitialValue](../erd-editor-element.md#setinitialvalue) non viene mai scritto nella stanza, perché uno store condiviso non lo invia, quindi cambia solo quell’elemento mentre ogni altro client conserva il diagramma della stanza. Per inizializzare una stanza vuota usare invece [seed](#seed).

Un `Y.Doc` contiene un solo diagramma. Il binding lo conserva sotto i nomi `erd:` del `Y.Doc` e imposta il campo `erd` dello stato Awareness locale, lasciando intatti tutti gli altri nomi e campi.  
Dare a ogni elemento associato un `Y.Doc` e un Awareness propri, come ha ogni client di una stanza: due binding che condividono lo stesso Awareness si sovrascrivono a vicenda il campo `erd`.

## Inizializzare una stanza {#seeding-a-room}

Una stanza non contiene alcun diagramma finché un client non la [inizializza](#seed).  
Ciò che nel frattempo contiene un editor confluisce nella sua inizializzazione, e cede il posto a quella di un altro client se questa arriva per prima: il binding si riapre su di essa con `rejoin('snapshot')`, e il documento che l’elemento conteneva, con ciò che vi è stato modificato dopo l’associazione, va perso.

Quando due client inizializzano nello stesso istante, una sola inizializzazione prevale su ogni client.  
L’altro client si riapre su di essa con `rejoin('seedLost')` e perde ciò che ha modificato dopo la propria inizializzazione, così come un client entrato nell’inizializzazione perdente, con `rejoin('snapshot')`. Le loro modifiche nell’inizializzazione perdente non arrivano a nessuno.  
Un’inizializzazione fatta prima che il provider si sia sincronizzato conta come fatta nello stesso istante di quella da cui proviene il diagramma della stanza, quindi può prevalere su di essa e sostituire il diagramma della stanza.

## BindOptions {#bindoptions}

```ts
import type { Awareness } from 'y-protocols/awareness';

type BindOptions = {
  awareness?: Awareness;
  getNickname?: () => string;
};
```

### awareness {#awareness}

L’`Awareness` che trasporta cursori, focus, selezioni e riquadri di trascinamento, come quello del provider.  
Con esso, il binding attiva i tracker del mouse e del focus dell’elemento e disegna sull’elemento la presenza degli altri client — vedere [Presenza](#presence).  
Senza di esso si sincronizza solo il diagramma: l’elemento non invia cursore, focus né selezione e non disegna quelli degli altri.

```js
bindErdEditor(editor, doc, { awareness: provider.awareness });
```

### getNickname {#getnickname}

Il nome che gli altri vedono accanto al cursore di questo editor.  
Lo store condiviso dell’elemento lo legge a ogni invio, come con [getSharedStore](./collaborative-editing.md#getnickname), e gli altri utenti vedono `user` quando manca o è vuoto.

```js
bindErdEditor(editor, doc, {
  awareness: provider.awareness,
  getNickname: () => 'nickname...',
});
```

## ErdYjsBinding {#erdyjsbinding}

```ts
type ErdYjsBinding = {
  seed: (value?: string) => boolean;
  on: <K extends keyof BindingEvents>(
    event: K,
    listener: BindingEvents[K]
  ) => () => void;
  destroy: () => void;
};

type BindingEvents = {
  rejoin: (reason: RejoinReason) => void;
  error: (error: Error) => void;
};

type RejoinReason = 'snapshot' | 'seedLost';
```

`on(event, listener)` restituisce una funzione che rimuove il listener.

### seed {#seed}

Scrive la prima istantanea della stanza dal documento dell’editor e restituisce `true`.  
Con `value`, il testo di un documento in una qualsiasi delle forme che [setInitialValue](../erd-editor-element.md#setinitialvalue) legge, lo carica prima nell’editor.  
Poi rilascia, senza registrarli, i trascinamenti, i ridimensionamenti e le modifiche del colore che l’editor trattiene ancora, così nessuno di essi arriva nella stanza dopo l’istantanea. Senza `value` l’istantanea li mostra già, perché prende il documento dell’editor; con `value` appartenevano al documento che `value` ha sostituito.  
Poi scrive l’istantanea descritta in [Cosa contiene la stanza](#what-the-room-holds).  
Una volta che la stanza contiene un’istantanea restituisce `false` e non scrive nulla, senza caricare `value`, quindi ogni client può chiamarlo dopo l’associazione. Restituisce `false` anche quando il binding è stato distrutto o interrotto, e su un binding [rifiutato](#onerror) al momento dell’associazione.

```js
binding.seed(); // the document the editor holds
// or
binding.seed(await (await fetch('/diagrams/shop.erd.json')).text());
```

### on@rejoin {#onrejoin}

Il binding ha riaperto l’editor sull’istantanea della stanza, come fa [reseed](./collaborative-editing.md#reseed); [Modifiche offline e rientri](#offline-edits-and-rejoins) dice che cosa conserva e che cosa perde.  
`reason` indica il motivo:

- `'snapshot'`: l’istantanea contiene modifiche che il binding non aveva applicato, perché era assente mentre un compattatore le riuniva, o perché un compattatore ha rimesso, in una compattazione propria, ciò che aveva riunito in un’istantanea che quella di un altro compattatore ha sostituito (vedere [Un solo compattatore per stanza](#one-compactor-per-room)). È anche il motivo quando l’istantanea è la prima a raggiungere un binding di una stanza vuota, e quando appartiene a un’altra inizializzazione e questo binding era entrato in un’inizializzazione che non aveva scritto.
- `'seedLost'`: l’inizializzazione di un altro client ha prevalso su quella scritta da questo binding.

```js
binding.on('rejoin', reason => {
  console.info('reopened on the room', reason);
});
```

### on@error {#onerror}

Il binding ha rifiutato di associarsi, si è interrotto o ha respinto un’opzione. Ogni messaggio inizia con `erd-editor-yjs: `.

Al momento dell’associazione non associa nulla quando:

- l’editor o lo store peer è già associato a questo `Y.Doc`;
- il suo `@dineug/erd-editor` è stato compilato prima della versione `5.1.0`; il binding distrugge lo store condiviso preso da un elemento;
- lo store peer è stato distrutto prima di essere associato;
- la stanza contiene un’istantanea in una struttura che questa versione non legge (vedere [Cosa contiene la stanza](#what-the-room-holds)).

Un binding così emette `error` in un microtask, quindi un listener aggiunto subito dopo la chiamata lo sente, e su di esso non viene mai emesso alcun `rejoin`.

In seguito il binding si interrompe quando:

- l’istantanea della stanza passa a una struttura che questa versione non legge. Ogni binding di questa versione si interrompe, ogni editor conserva ciò che aveva applicato e nulla di ciò che viene modificato dopo viene scritto;
- il suo store peer è stato distrutto sotto di esso, rilevato alla successiva modifica della stanza o alla chiamata di `seed()` o `compact()`.

Un binding che si interrompe rilascia lo store condiviso che aveva preso, e la coppia formata dal proprio store e dal `Y.Doc`, come fa [destroy](#destroy), e conserva i propri listener.

Solo per `bindPeerStore`, questi casi emettono `error` e il binding prosegue:

- `compactAfter` non è un intero positivo: il binding riunisce solo se richiesto;
- `electionGraceMs` o `retainMs` non è un numero da 0 a 2.147.483.647 ms: subentra il valore predefinito, perché un timer oltre quell’intervallo scatta subito;
- `synced` viene rifiutato: il binding non riunisce mai, e lascia l’elezione agli altri compattatori (vedere [Un solo compattatore per stanza](#one-compactor-per-room)).

```js
binding.on('error', error => {
  console.error(error.message);
});
```

### destroy {#destroy}

Invia nella stanza i trascinamenti, i ridimensionamenti e le modifiche del colore che l’editor trattiene ancora, imposta a `null` il campo Awareness `erd` del binding, così gli altri eliminano subito il suo cursore, il focus e la selezione, e smette di osservare il `Y.Doc` e l’Awareness.  
Per un elemento distrugge anche lo store condiviso che aveva preso, lasciando l’elemento e il suo documento com’erano.  
Una seconda chiamata non fa nulla. Dopo, ciò che l’editor modifica non arriva a nessuno.

Lo store peer, il `Y.Doc` e il provider restano dell’utente, da distruggere dopo il binding: uno store peer distrutto per primo non invia mai i trascinamenti che ancora tratteneva.  
Il [destroy](../erd-editor-element.md#destroy) dell’elemento distrugge ogni store condiviso che ha consegnato, compreso quello del binding, e scarta ciò che trattengono, quindi distruggere prima il binding.  
Distruggere un binding prima di associare di nuovo lo stesso editor o lo stesso store peer allo stesso `Y.Doc`; uno che si è interrotto con `error` ha già rilasciato tutto.

```js
binding.destroy();
editor.destroy();
```

## Presenza {#presence}

Con [awareness](#awareness), il cursore dell’editor, la tabella o la cella con il focus, la selezione e il riquadro di trascinamento viaggiano nel campo `erd` del suo stato Awareness locale, mai nel `Y.Doc`, quindi non entrano mai nella cronologia della stanza, nella sua istantanea o in un `Y.Doc` persistito.  
Gli altri li disegnano come disegnano la presenza di un collaboratore — vedere [focusTracker](./collaborative-editing.md#focustracker) — e un client che entra disegna la presenza che la stanza mostra già.  
L’elemento invia di nuovo il focus e la selezione ogni 30 secondi e il riquadro di trascinamento ogni secondo. Ognuno di questi nuovi invii raggiunge gli altri anche quando ripete l’ultimo, così ciò che un utente tiene ancora non scade mai.

Un client che esce viene dimenticato subito.  
Quando l’Awareness elimina il suo stato, o il suo campo `erd` diventa `null`, come lo imposta [destroy](#destroy), o nomina un altro editor, il binding rimuove dall’elemento il cursore, il focus, la selezione e il riquadro di trascinamento di quell’editor con [forgetPeer](./collaborative-editing.md#forgetpeer) invece di attendere che scadano.  
Li conserva finché un altro client mostra ancora lo stesso editor, come fa un elemento associato di nuovo a un altro `Y.Doc` della stanza.

## Modifiche offline e rientri {#offline-edits-and-rejoins}

Un client disconnesso dal provider continua a modificare. Le sue modifiche attendono nel suo `Y.Doc` locale, non nello store condiviso, e raggiungono gli altri quando il provider si riconnette e si sincronizza.

Quando un compattatore ha riunito modifiche che il client non aveva mai applicato mentre era assente, l’istantanea le contiene, quindi alla riconnessione il client si riapre sull’istantanea con `rejoin('snapshot')`, dopo aver inviato i trascinamenti, i ridimensionamenti e le modifiche del colore che il suo editor tratteneva ancora. Una compattazione di sole modifiche che il client aveva applicato non riapre nulla.  
Un rientro su un’istantanea dell’inizializzazione in cui il binding era entrato riapplica ogni modifica che l’istantanea non contiene, comprese quelle fatte da questo client mentre era assente, quindi nessuna va persa. Un rientro su un’altra inizializzazione non conserva nulla, come descrive [Inizializzare una stanza](#seeding-a-room).

Ogni rientro cancella la cronologia delle modifiche, la selezione e il focus, e chiude una vista [Flusso](../../guide/guides/visualization.md#flow-mode) aperta, un [disegno di relazione](../../guide/guides/editing-start.md#relationship-creation) e un editor di memo, nome del gruppo di tabelle o cella, perché possono nominare ciò che l’istantanea non contiene più.  
Il nome di un gruppo di tabelle digitato e non ancora confermato viene scartato. Una cella del nome logico che si chiude deriva il nome fisico da un nome logico digitato dal suo lettore, dove il documento riaperto lo contiene ancora, come fa ogni chiusura di quella cella. Questa derivazione è una normale modifica: la stanza la registra, crea una voce di annullamento ed emette `change` — vedere [reseed](./collaborative-editing.md#reseed).  
Un binding entrato nella stanza conserva ciò che vede il suo lettore: la posizione di scorrimento, il livello di zoom e la scheda, e le impostazioni modificate da un lettore di sola lettura.  
Conserva anche la Visualizzazione nomi e le impostazioni del codice (linguaggio del Generatore di codice, stili dei nomi e tipo di delimitatore) che il lettore mostrava come proprie, finché il [blocco](../../guide/guides/settings.md#lock) di ciascuna era attivo prima del rientro ed è ancora attivo dopo, con lo stesso valore bloccato.  
Nulla di ciò che conserva arriva a `value`, che riporta le impostazioni del documento riaperto — vedere [reseed](./collaborative-editing.md#reseed) con `keepScreen`.  
La posizione di scorrimento e il livello di zoom di un elemento non mostrato dall’ultimo caricamento, e l’intera schermata di un binding che non era ancora entrato, si aprono dove le porta l’istantanea.  
Uno store peer non ha schermata, quindi il suo rientro non ne conserva alcuna.

## Editor di sola lettura {#read-only-editors}

Un elemento [di sola lettura](../erd-editor-element.md#readonly) associato a una stanza non scrive nulla nella cronologia della stanza: il suo store condiviso non invia alcuna modifica, solo i suoi tracker e lo scambio dei registri, e la stanza [non registra né gli uni né l’altro](#what-the-room-holds).  
Applica comunque ogni modifica che la stanza trasporta, e con [awareness](#awareness) il cursore, il focus, la selezione e il riquadro di trascinamento del suo lettore raggiungono ancora gli altri.  
Le impostazioni modificate dal suo lettore restano sulla sua schermata, come in ogni editor di sola lettura.  
[seed](#seed) non viene rifiutato: un elemento di sola lettura inizializza una stanza vuota con il documento che contiene, o con `value` se indicato.

## Cosa contiene la stanza {#what-the-room-holds}

Il binding conserva il diagramma in due nomi del `Y.Doc`: `erd:snapshot`, una mappa che contiene un’istantanea del documento, ed `erd:log`, un array dei gruppi di azioni dell’editor successivi a essa. Un provider di persistenza memorizza entrambi insieme al resto del `Y.Doc`.

L’istantanea contiene il [runtimeValue](../erd-editor-element.md#runtimevalue) del documento, comprese le entità rimosse, i suoi registri di collaborazione e la sua versione, e fino a che punto le modifiche di ciascun autore vi sono riunite. La scrive un’inizializzazione, e ogni compattazione di un compattatore.  
Ogni voce del registro è un gruppo di azioni così come l’ha inviato l’editor, con i suoi metadati, che contengono l’id dell’editor mittente e il suo nickname.  
Scorrimenti, zoom, cambi di scheda, presenza e scambio dei registri non vengono mai registrati. Ogni altra modifica inviata dall’editor lo è, compreso un cambio della Visualizzazione nomi fatto sotto il suo [blocco](../../guide/guides/settings.md#lock), che ogni altro client scarta.  
Un linguaggio del Generatore di codice, uno stile dei nomi o un tipo di delimitatore modificato sotto il suo blocco non viene mai inviato, quindi resta sulla schermata di quell’editor e non raggiunge mai la stanza.

Un `Y.Doc` restituito da un provider di persistenza apre il diagramma che contiene, come un binding apre ogni `Y.Doc` che contiene un’istantanea — vedere [Utilizzo](#usage).

L’istantanea non è un file: il suo valore di runtime contiene entità rimosse, che un file non deve contenere.  
Per scrivere su un supporto di archiviazione il diagramma della stanza, salvare il [value](../erd-editor-element.md#value) di un elemento associato ogni volta che scatta il suo evento [change](../erd-editor-element.md#change).  
Salvarlo anche una volta dopo l’associazione, dopo un [seed](#seed) con un `value` e in un listener di [rejoin](#onrejoin), perché nessuno di quei caricamenti emette `change`.  
Un elemento [di sola lettura](../erd-editor-element.md#readonly) non emette mai `change`, quindi salvare da uno che non è di sola lettura, oppure leggere `value` da uno store peer associato, che applica le modifiche della stanza man mano che arrivano.  
Un [replicationStore](./remote-storage.md) non può essere associato, perché gli mancano i metodi che un binding richiede, e uno alimentato dallo store condiviso di un elemento associato perde le modifiche della stanza — vedere [Replicare un editor in esecuzione](./remote-storage.md#replicating-a-live-editor).

La struttura è privata e può cambiare con [ERD_YJS_FORMAT](#exports).  
Leggere una stanza solo tramite un binding, e lasciare a questo i nomi `erd:` e il campo Awareness `erd`.

## Compattare una stanza {#compacting-a-room}

La cronologia della stanza cresce a ogni modifica, e ogni client che entra la riapplica tutta, finché qualcosa non la riunisce.  
`bindPeerStore` associa uno store peer headless di `@dineug/erd-editor/peer.js` e restituisce un `ErdYjsPeerBinding`: gli stessi [seed](#seed), [on](#erdyjsbinding) e [destroy](#destroy), con in più [compact](#compact).  
Uno store peer associato in un processo Node accanto al server, un sidecar, riunisce la cronologia in un’istantanea del proprio diagramma.  
Il binding di un elemento non riunisce mai, e uno store peer associato senza `compactAfter` e senza chiamate a `compact()` è un normale peer headless.

```ts
function bindPeerStore(
  peer: PeerStore,
  doc: Y.Doc,
  options?: PeerBindOptions
): ErdYjsPeerBinding;

type ErdYjsPeerBinding = ErdYjsBinding & {
  compact: () => CompactResult;
};
```

```sh
npm install @dineug/erd-editor-yjs @dineug/erd-editor yjs y-protocols y-websocket ws
```

```js
import { createPeerStore } from '@dineug/erd-editor/peer.js';
import { bindPeerStore } from '@dineug/erd-editor-yjs';
import WebSocket from 'ws';
import { WebsocketProvider } from 'y-websocket';
import * as Y from 'yjs';

const doc = new Y.Doc();
const provider = new WebsocketProvider('wss://yjs.example.com', 'my-diagram', doc, {
  WebSocketPolyfill: WebSocket,
});
const synced = new Promise(resolve => {
  provider.on('sync', function onSync(isSynced) {
    if (!isSynced) return;
    provider.off('sync', onSync);
    resolve();
  });
});

const peer = createPeerStore({ nickname: 'compactor', presence: false });
const binding = bindPeerStore(peer, doc, {
  awareness: provider.awareness,
  compactAfter: 1000,
  synced,
});
binding.on('error', error => console.error(error));

process.on('SIGTERM', () => {
  binding.destroy(); // first, so the peer store's held drags still reach the room
  peer.destroy();
  provider.destroy();
  doc.destroy(); // ends the provider's Awareness timer, so the process can exit
});
```

Lo store peer resta dell’utente: il binding non lo distrugge mai. Il suo nickname è quello passato a `createPeerStore`, e `presence: false` gli impedisce di inviare un focus proprio.

Una compattazione scrive l’istantanea dal valore di runtime, dai registri e dalla versione propri dello store peer, ed elimina le voci del registro che copre e ogni voce di un’altra inizializzazione, tutto in un’unica transazione.  
I client che hanno applicato tutto vedono sparire le voci; un client che non l’aveva fatto si riapre sull’istantanea (vedere [Modifiche offline e rientri](#offline-edits-and-rejoins)).  
Ogni compattazione riscrive l’intero diagramma nell’istantanea, quindi ognuna invia a ogni client un aggiornamento grande circa quanto il JSON di runtime del diagramma e i registri insieme, per quanto poche siano le voci che prende. Impostare `compactAfter` abbastanza alto perché le voci che una compattazione prende pesino più di una copia del diagramma.

### PeerBindOptions {#peerbindoptions}

```ts
type PeerBindOptions = CompactOptions & {
  awareness?: Awareness;
};

type CompactOptions = {
  compactAfter?: number;
  synced?: Promise<void>;
  electionGraceMs?: number;
  retainMs?: number;
};
```

| Opzione | Valore predefinito | Descrizione |
| --- | --- | --- |
| `awareness` | Nessuno | Mostra lo store peer nell’Awareness della stanza, come fa [awareness](#awareness) con un elemento. Un compattatore che riunisce da solo vi è contrassegnato, quindi i compattatori che si vedono tra loro ne eleggono uno che riunisca, e uno che non vede alcun altro client non riunisce nulla da solo — vedere [Un solo compattatore per stanza](#one-compactor-per-room). Senza di essa, un compattatore riunisce da solo senza elezione e senza periodo di attesa. |
| `compactAfter` | Nessuno | Riunisce da solo quando il registro contiene questo numero di voci che una compattazione prenderebbe. Senza di essa, o senza `synced`, riunisce solo `compact()`, e la compattazione che rimette (vedere [Un solo compattatore per stanza](#one-compactor-per-room)). |
| `synced` | Nessuno | Una promise che si risolve quando il provider si è sincronizzato. Nessuna compattazione precede questo momento, `compact()` compreso. Senza di essa, nulla riunisce da solo e `compact()` riunisce subito. |
| `electionGraceMs` | `3000` | Con `awareness`, per quanto tempo il compattatore osserva la stanza prima di riunire da solo, dopo `synced` e di nuovo ogni volta che compaiono altri client dopo che non ce n’erano. |
| `retainMs` | `600000` (dieci minuti) | Per quanto tempo le voci di una compattazione restano trattenute per essere rimesse (vedere [Un solo compattatore per stanza](#one-compactor-per-room)), contato dal primo aggiornamento che la stanza invia dopo la compattazione. |

Un’opzione non valida, o un `synced` rifiutato, emette [error](#onerror).

### compact {#compact}

```ts
type CompactResult =
  | { compacted: true; generation: number }
  | {
      compacted: false;
      reason: 'not-synced' | 'no-snapshot' | 'destroyed';
    };
```

Riunisce subito, senza elezione, periodo di attesa né soglia.  
Per prima cosa recepisce l’istantanea corrente della stanza, un rientro compreso, e invia ciò che il suo store peer trattiene ancora.  
Risponde `{ compacted: true, generation }`, dove `generation` conta le compattazioni dell’istantanea: `0` per un’inizializzazione, una in più per ogni compattazione.  
Altrimenti risponde `{ compacted: false, reason }`:

- `'destroyed'` quando il binding è stato distrutto o interrotto, e su un binding [rifiutato](#onerror) al momento dell’associazione, anche prima che `synced` si risolva;
- `'not-synced'` prima che `synced` si risolva;
- `'no-snapshot'` in una stanza che nessun client ha inizializzato.

```js
const result = binding.compact();
if (!result.compacted) console.warn(result.reason);
```

## Un solo compattatore per stanza {#one-compactor-per-room}

Eseguire esattamente un compattatore per stanza, e avviarne uno nuovo solo quando il vecchio si è fermato. Nulla lo impone.  
Tra i compattatori che si vedono nell’Awareness, solo quello con il più piccolo id client Yjs riunisce da solo, e quando esce, o il suo `synced` viene rifiutato, subentra subito il successivo.  
Un compattatore il cui Awareness non mostra alcun altro client, come quando si chiude il suo socket e li fa cadere tutti, non riunisce nulla da solo finché gli altri non compaiono di nuovo ed esso non ha osservato la stanza per `electionGraceMs`.

Due compattatori isolati l’uno dall’altro, o un riavvio il cui predecessore è ancora in esecuzione, possono comunque riunire entrambi.  
La stanza conserva allora una delle due istantanee, e il compattatore la cui istantanea ha perso rimette ciò che ha riunito e che il vincitore non contiene, finché lo trattiene: `retainMs`, e al massimo le sue ultime 1.000 voci, per quanto grande sia ciascuna.  
Quindi non si perde nulla quando il compattatore la cui istantanea perde è quello che si riconnette, purché abbia riunito non più di 1.000 voci mentre erano separati.  
Quando è quello rimasto online e il suo tempo di trattenimento è scaduto, l’istantanea e la cronologia della stanza non contengono ciò che ha riunito finché non riunisce di nuovo. Un client che ha perso quelle modifiche, o uno che entra nel frattempo, non le ha, e trattiene le modifiche successive di ogni autore le cui modifiche il compattatore ha riunito. La compattazione successiva del compattatore le riporta tutte, a meno che l’istantanea vincente contenesse modifiche che esso non aveva, il che lo riapre su quell’istantanea e fa perdere per sempre ciò che aveva riunito.

Un compattatore rimette in una compattazione propria, fatta dopo che si è allineato all’istantanea vincente, senza elezione, periodo di attesa né soglia, e ogni client si riapre su quella compattazione con `rejoin('snapshot')`.  
Le modifiche che rimette non raggiungono alcun client al di fuori di quella compattazione, quindi un client rimasto sempre online ha alla fine lo stesso stato degli altri e di uno che entra più tardi, anche quando una modifica successiva di un altro autore si basa su una di esse, come la ridenominazione di una tabella aggiunta da un altro client.  
Ogni rimessa costa a ogni client quel rientro, con [ciò che un rientro fa perdere](#offline-edits-and-rejoins). Quando due compattatori rimettono nello stesso istante, ogni client finisce comunque allo stesso modo, anche se una modifica può restare applicata prima di quella su cui si basa.  
Un binding distrutto o interrotto prima che quella compattazione venga eseguita, come quando lo distrugge un listener di `rejoin`, rimette invece le modifiche per conto proprio. Nessuna va persa, ma allora un client rimasto sempre online può applicarne una dopo la modifica di un altro autore che si basa su di essa, e finire diverso da uno che entra più tardi.

## Limiti {#limits}

- **Il viewport resta su ogni schermata.** Scorrimenti, zoom e cambi di scheda [non vengono mai registrati](#what-the-room-holds), anche se una sessione collegata tramite `getSharedStore` li invia (neppure lì spostano la vista o la scheda di un altro utente). Ogni lettore conserva la propria, e il binding la mostra solo nel proprio stato Awareness, che per ora nulla legge. Con il [blocco](../../guide/guides/settings.md#lock) `Viewport` o `Canvas Type` disattivato, il `value` di ogni client salva la propria; con i blocchi attivi, che un nuovo documento ha attivi, ogni client salva quella bloccata.
- **L’istantanea cresce di una voce per binding.** Conserva, per ogni binding che abbia mai scritto nella stanza, fino a che punto le sue modifiche sono riunite, e non ne elimina mai nessuna. Un binding creato di nuovo, o uno passato a un’altra inizializzazione, conta da capo, e così ogni compattazione che rimette. Una voce è un id di 32 caratteri e un numero, quindi diecimila sessioni di scrittura aggiungono alcune centinaia di kilobyte a ogni istantanea e a ogni compattazione.
- **Un hub e una stanza non si inoltrano nulla tra loro.** Un elemento associato a una stanza e all’[hub](../../mcp/live-and-headless.md#live) di un agente di programmazione, o a un qualsiasi altro trasporto tramite `getSharedStore()`, applica le modifiche di entrambi, ma nessuno dei due sente quelle dell’altro, perché uno store condiviso non rinvia ciò che ha ricevuto.
- **Le aggiunte fatte nello stesso istante possono essere elencate in ordini diversi.** Le tabelle o i memo che due client aggiungono nello stesso istante possono comparire in un ordine diverso nel diagramma di ciascun client, come in una sessione collegata tramite `getSharedStore` — vedere [Modifiche simultanee](./collaborative-editing.md#concurrent-edits).
- **I colori e alcune altre modifiche fatte nello stesso istante possono finire diversi.** Una modifica del colore viene registrata senza versione, e ogni client le assegna la propria quando la applica. Due cambi di colore della stessa tabella, dello stesso memo o dello stesso gruppo di tabelle fatti nello stesso istante possono quindi lasciare i client, e un client che entra più tardi e riapplica il registro, con colori diversi. Lo stesso vale per le altre modifiche che ogni client applica nell’ordine in cui le sente, come due spostamenti di colonna all’interno della stessa tabella o dello stesso indice, o due modifiche del database — vedere [Modifiche simultanee](./collaborative-editing.md#concurrent-edits).
- **Un cursore in uscita attende il server.** Il binding elimina il cursore di un peer non appena l’Awareness lo scarta. Un server che, alla chiusura di un socket, rimuove solo gli stati Awareness che quel socket ha aggiunto per primi lascia sullo schermo degli altri un client che si era riconnesso, dopo la sua uscita, finché l’Awareness non lo fa scadere, 30 secondi dopo. Uno che rimuove ogni stato scritto per ultimo da un socket, un aggiornamento come un’aggiunta, lo elimina subito.

## Esportazioni {#exports}

| Esportazione | Descrizione |
| --- | --- |
| `bindErdEditor(editor, doc, options?)` | Associa un elemento `<erd-editor>` — vedere [Utilizzo](#usage). Restituisce un [ErdYjsBinding](#erdyjsbinding). |
| `bindPeerStore(peer, doc, options?)` | Associa uno store peer di `@dineug/erd-editor/peer.js` — vedere [Compattare una stanza](#compacting-a-room). Restituisce lo stesso con [compact](#compact) (`ErdYjsPeerBinding`). |
| `ERD_YJS_FORMAT` | La struttura del `Y.Doc` che questa versione scrive, `1`; un binding rifiuta una stanza scritta in un’altra. |

Tipi: `BindOptions`, `PeerBindOptions`, `CompactOptions`, `CompactResult`, `BindingEvents`, `RejoinReason`, `ErdYjsBinding`, `ErdYjsPeerBinding`.
