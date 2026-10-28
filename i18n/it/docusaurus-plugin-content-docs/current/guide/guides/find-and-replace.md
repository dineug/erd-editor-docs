---
sidebar_position: 10
description: Cercare nomi di tabelle, colonne, indici e gruppi di tabelle, nomi logici, commenti e memo dalla parte superiore del pannello Esplora, spostarsi da una corrispondenza all’altra nel suo albero e nell’area di disegno e sostituirne una o tutte.
---

# Trova e sostituisci

Trova il testo in tutto il diagramma, porta a ciascuna corrispondenza nell’area di disegno ERD e sostituisce una sola corrispondenza o tutte.  
Cerca in otto tipi di testo: nomi delle tabelle, commenti delle tabelle, nomi delle colonne, commenti delle colonne, memo, nomi degli indici, nomi dei gruppi di tabelle e i [nomi logici](./logical-names.md) di tabelle e colonne — vedere [Cosa cerca](#what-it-searches).

Si trova in cima a [Esplora](./explorer.md), il pannello ancorato a sinistra dell’area di disegno ERD, tra la barra del titolo di Esplora e il suo albero. Non ha un titolo proprio. Dall’alto in basso contiene:

- Il campo Trova, con le tre [opzioni](#options) all’interno, alla sua estremità, e prima di esso la freccia `Toggle Replace`.
- La riga `Replace`, inizialmente compressa — vedere [Sostituzione](#replacing).
- Il contatore, poi le frecce su e giù che passano da una corrispondenza all’altra e il pulsante `Search In` a tre puntini.
- I [tipi di testo](#what-it-searches), che `Search In` espande.

Mentre il campo Trova contiene del testo, l’albero di Esplora mostra le corrispondenze — vedere [I risultati](#the-results).  
Con un’area di disegno bassa, la ricerca mantiene tutta la sua altezza e l’albero sottostante occupa lo spazio rimanente e scorre.

![Apertura di Trova e sostituisci in Esplora con ⌘ + F, passaggio tra le sei corrispondenze di member, poi, con Preserve Case attivo, sostituzione di tutte e sei con user (⌘ + Enter)](/img/demo-find-and-replace.webp)

## Apertura e chiusura {#opening-and-closing}

`Ctrl + F` (Windows/Linux) o `⌘ + F` (Mac) e la voce `Toggle Explorer` nella [Ricerca rapida](./quick-search.md) o nel menu contestuale dell’area di disegno aprono Esplora sulla ricerca. Il punto di inserimento passa al campo Trova con il testo selezionato e il testo di ricerca viene cercato di nuovo senza alcuna corrispondenza corrente.  
Il pulsante `Explorer` della barra degli strumenti si limita ad aprire o chiudere il pannello. Non porta il punto di inserimento nel campo Trova e lascia invariati il testo di ricerca e la corrispondenza corrente.  
Quando il tasto si limita a riportare il punto di inserimento in un pannello Esplora già visibile, come accade mentre è aperta la Ricerca rapida o una delle cinque finestre di dialogo descritte in [Finestre di dialogo accanto al pannello](./explorer.md#dialogs-beside-it), la corrispondenza corrente resta tale.

La chiusura di Esplora, l’effetto del tasto e delle due voci `Toggle Explorer` mentre il pannello è aperto e le finestre di dialogo che chiudono sono descritti in [Apertura e chiusura](./explorer.md#opening-and-closing) nella pagina Esplora.  
[Quando si nasconde](./explorer.md#when-it-stands-aside) spiega come un’altra scheda e la modalità Zen lo nascondano e come il Visualizzatore differenze, il Viaggio nel tempo e l’anteprima del Layout automatico lo nascondano e ne impediscano l’apertura. [Accanto all’area di disegno](./explorer.md#beside-the-canvas) tratta il caso di un editor troppo stretto per mostrarlo.

Alla riapertura vengono mantenuti l’ultimo testo di ricerca e, con esso, il testo di sostituzione, le [opzioni](#options), i [tipi di testo](#what-it-searches) che erano attivi e lo stato espanso o compresso della riga `Replace` e dei tipi di testo.  
Vengono mantenuti finché l’editor resta aperto e non sono salvati nel documento. Un editor appena aperto parte con tutte le opzioni disattivate, la riga `Replace` e i tipi di testo compressi e solo i quattro tipi di nome e `Logical names` attivi — vedere [Cosa cerca](#what-it-searches).

## La barra di ricerca del browser {#the-browsers-find-bar}

Mentre l’editor ha il focus, `Ctrl + F` (Windows/Linux) o `⌘ + F` (Mac) è gestito dall’editor in ogni scheda, anche nei suoi campi di testo, quindi la barra di ricerca del browser non si apre.  
Il tasto passa al browser o all’host mentre è aperto il Visualizzatore differenze, il Viaggio nel tempo o l’anteprima del Layout automatico, e mentre il focus è fuori dall’editor.

- App web e Google Drive: la barra di ricerca del browser si apre solo in questi due casi.
- VS Code: l’estensione lascia disattivato il widget di ricerca proprio di VS Code nell’ERD Editor, quindi lì il tasto non lo apre mai.
- Obsidian: il tasto raggiunge l’editor ogni volta che la scheda del diagramma è attiva, al posto del comando `Search current file` di Obsidian.
- IDE JetBrains: se la mappa dei tasti dell’IDE riserva a sé `Ctrl + F` (Windows/Linux) o `⌘ + F` (Mac), aprire la ricerca dalla voce `Toggle Explorer` nella Ricerca rapida o nel menu contestuale dell’area di disegno, o aprire Esplora con il pulsante `Explorer` della barra degli strumenti e fare clic nel campo Trova.

Una pagina che incorpora l’editor può spostare o rimuovere il tasto — vedere [Modificare il tasto di scelta rapida](#changing-the-shortcut).

## Cosa cerca {#what-it-searches}

Otto pulsanti scelgono i tipi di testo in cui cercare, in questo ordine: `Table names`, `Table comments`, `Column names`, `Column comments`, `Memos`, `Index names`, `Table group names` e `Logical names`.  
Inizialmente sono compressi. Il pulsante `Search In`, alla fine della riga del contatore, li espande sotto quella riga e li comprime di nuovo, ed è evidenziato mentre sono visibili.  
Un pulsante di tipo evidenziato è attivo. Fare clic su uno di essi per attivarlo o disattivarlo, e la ricerca viene eseguita di nuovo. Con tutti e otto disattivati, non viene trovato nulla.

La ricerca si apre la prima volta con i quattro tipi di nome, `Table names`, `Column names`, `Index names` e `Table group names`, e con `Logical names`, quindi una ridenominazione non raggiunge commenti e memo, a meno che non vengano attivati.  
`Logical names` è un unico tipo per i nomi logici sia delle tabelle sia delle colonne.  
I nomi degli indici sono i nomi degli indici nella scheda `Indexes` di [Proprietà tabella](./table-related-functions.md#indexes), non le chiavi `PK_` e `UQ_` elencate sopra di essi.

Non viene cercato nient’altro: né i tipi di dati, né il dominio di una colonna, né i valori predefiniti, né le colonne di un indice, né il nome del database, né lo [Schema SQL](./schema-sql.md) con i suoi script `Before tables` e `After tables`, né il codice generato, né i fogli della scheda [Dizionario](./dictionary.md), che hanno una [ricerca propria](./dictionary.md#searching).  
I nomi logici vengono cercati qualunque cosa disegni la [Visualizzazione nomi](./logical-names.md#name-view), compresa la vista `Physical Names`, in cui l’area di disegno non ne mostra alcuno. Anche un commento nascosto da un’[opzione di visualizzazione delle tabelle](./table-related-functions.md#table-view-options) viene comunque cercato. I memo nascosti con View Option → `Memos` e i [gruppi di tabelle](./table-groups.md#hiding-groups) nascosti con View Option → `Table Groups` invece non vengono cercati, anche con il relativo pulsante attivo, quindi `Replace All` non riscrive mai un memo né rinomina un gruppo che non è visibile.

## Opzioni {#options}

Tre interruttori all’interno del campo Trova, alla sua estremità, cambiano il modo in cui il testo di ricerca trova le corrispondenze. Il loro nome compare nei tooltip e sono evidenziati quando sono attivi. Tutti e tre partono disattivati e la modifica di uno di essi avvia una nuova ricerca.

- `Match Case`: se è disattivato, la corrispondenza non distingue tra maiuscole e minuscole.
- `Match Whole Word`: una corrispondenza conta solo se non prosegue in una parola su nessuno dei due lati. Lettere, cifre e segni combinanti di qualsiasi sistema di scrittura contano come caratteri di parola, così come il trattino basso. `user` corrisponde quindi in `user id` e `user.id`, ma non all’interno di `users`, `user_id` o `superuser`. Un’estremità del testo di ricerca che non è essa stessa un carattere di parola, come il punto in `.id`, non richiede un confine di parola da quel lato.
- `Use Regular Expression`: il testo di ricerca è un’espressione regolare JavaScript, sempre in modalità Unicode, quindi `\p{L}` funziona. `^` e `$` corrispondono all’inizio e alla fine di ogni riga di un commento o di un memo su più righe e `.` non attraversa un’interruzione di riga. Sono accettate le sequenze di escape spesso digitate nei nomi, come `\_` e `\-`.

Un’espressione regolare che non può essere analizzata, come `user(`, non trova nulla: il contatore mostra `Invalid regular expression` in rosso e il campo Trova ha un bordo rosso.  
`Match Case` e `Match Whole Word` si applicano anche a un’espressione regolare. Una corrispondenza di lunghezza zero, come `^` da solo, non viene mai elencata.

Il testo semplice viene cercato durante la digitazione. Un’espressione regolare viene cercata quando la digitazione si interrompe, o subito quando si preme `Enter`, un pulsante di navigazione, `Replace` o `Replace All`, o si sceglie una riga che contiene una corrispondenza.  
La ricerca non ha limiti di tempo, quindi un’espressione regolare che esegue molto backtracking può rendere l’editor non reattivo finché non termina.

Un quarto interruttore, `Preserve Case`, si trova all’interno del campo `Replace`, alla sua estremità, quindi è visibile solo mentre la riga `Replace` è espansa. Parte disattivato. Non cambia nulla di ciò che viene trovato, ma solo il modo in cui `Replace` e `Replace All` scrivono la sostituzione — vedere [Sostituzione](#replacing). Attivarlo o disattivarlo non avvia alcuna ricerca e la corrispondenza corrente resta tale.

## I risultati {#the-results}

Il contatore, all’inizio della riga sotto i campi, indica la posizione corrente. È vuoto mentre il campo Trova è vuoto.

| Contatore | Quando |
| --- | --- |
| `No results` | Non c’è alcuna corrispondenza. |
| `12 matches` | Prima di spostarsi su una di esse; `1 match` se ce n’è una sola. |
| `3 of 12` | La terza corrispondenza è quella corrente. |
| `Invalid regular expression` | L’espressione regolare non può essere analizzata. |
| `Replaced 12 matches` | `Replace All` ha modificato quel numero di corrispondenze; `Replaced 1 match` se è una sola. |
| `No changes` | `Replace All` non ha modificato nulla. |
| `No more matches` | Una serie di `Replace` è tornata al punto di partenza — vedere [Sostituzione](#replacing). |

`Replaced …`, `No changes` e `No more matches` lasciano il posto al contatore alla ricerca o allo spostamento successivo, compresa la ricerca avviata da una modifica o da un annullamento.

Mentre il campo Trova contiene del testo, l’[albero](./explorer.md#the-tree) di Esplora mostra i risultati invece dell’intero diagramma: solo le righe che contengono una corrispondenza e le righe sopra di esse. Quando non c’è alcuna corrispondenza, o l’espressione regolare non può essere analizzata, è vuoto. Eliminando il testo di ricerca torna l’intero albero, compresso com’era prima.

- `Tables`, `Table Groups` e `Memos` compaiono solo quando contengono una corrispondenza e il conteggio di ogni cartella è il numero di righe direttamente sotto di essa nei risultati.
- Sotto `Tables` compaiono le tabelle che contengono una corrispondenza, in ordine di nome, mai di nome logico. Sotto ogni tabella compaiono una riga per ogni corrispondenza nel suo commento, poi una cartella `Columns` con le colonne che contengono una corrispondenza, nell’ordine delle colonne, ciascuna con una riga per ogni corrispondenza nel suo commento, poi una cartella `Indexes` con gli indici il cui nome corrisponde. Non c’è una cartella `Foreign Keys`.
- Sotto `Table Groups` compaiono i gruppi il cui nome corrisponde, in ordine di nome, senza le loro tabelle. Una tabella trovata compare sotto `Tables`.
- Sotto `Memos` compaiono i memo che contengono una corrispondenza, nell’ordine del documento, ciascuno indicato dalla sua prima riga e con una riga per ogni corrispondenza al suo interno.

Una corrispondenza in un nome è evidenziata nella riga di quel nome, quindi un nome che contiene due volte il testo di ricerca è una sola riga con due evidenziazioni. Anche una corrispondenza nel nome logico di una tabella o di una colonna compare nella riga di quella tabella o colonna, mai in una riga propria.  
Quelle righe indicano la tabella o la colonna come la mostra la [Visualizzazione nomi](./logical-names.md#beyond-the-canvas), e ciascuno dei due nomi che una riga può mostrare evidenzia solo le proprie corrispondenze. Una riga trovata solo nel nome che la sua vista omette, il nome logico in `Physical Names` o il nome in `Logical Names`, aggiunge quel nome dopo quello che mostra, attenuato come in `Both Names`, con la corrispondenza evidenziata. Quando anche il nome che mostra contiene una corrispondenza, la riga mostra solo quel nome, quindi le corrispondenze nel nome che la sua vista omette vengono contate e percorse ma non evidenziate.  
Una corrispondenza in un commento o in un memo ha una riga propria: un fumetto per il commento di una tabella o di una colonna, o un foglietto adesivo per un memo, poi un estratto del testo con la corrispondenza evidenziata. Un testo lungo viene troncato con `…` e le interruzioni di riga appaiono come spazi. Passare il puntatore sulla riga per vedere il testo completo.  
Ogni altra riga appare come al di fuori di una ricerca: una colonna mostra il suo tipo di dati, un indice le sue colonne e un nome vuoto appare come `unnamed`.

Ogni riga che ha righe sotto di sé appare espansa quando inizia una ricerca. Una riga compressa manualmente, o da `Collapse All`, resta compressa finché una corrispondenza sotto di essa non diventa quella corrente, o finché non cambiano il testo di ricerca, `Match Case`, `Match Whole Word`, `Use Regular Expression` o un tipo di testo, o la ricerca non viene riaperta con il tasto o con una voce `Toggle Explorer`.  
La riga della corrispondenza corrente è evidenziata e resa visibile con lo scorrimento. L’albero elenca tutte le corrispondenze, per quante siano.  
Le corrispondenze si percorrono nell’ordine dell’albero: tabella per tabella, il nome logico, il nome e il commento della tabella, poi il nome logico, il nome e il commento di ciascuna delle sue colonne nell’ordine delle colonne, poi i nomi dei suoi indici; poi i nomi dei gruppi di tabelle; poi i memo.

I risultati seguono il documento mentre Esplora è visibile. Quando le modifiche si interrompono, qualsiasi cambiamento ai testi cercati avvia una nuova ricerca e la corrispondenza corrente resta tale se esiste ancora. Ciò comprende la modifica del testo di un nome, di un nome logico, di un commento o di un memo, l’aggiunta o la rimozione di una tabella, una colonna, un indice, un memo o un gruppo di tabelle, lo spostamento di una colonna e i memo o i gruppi di tabelle nascosti o mostrati con Opzioni di visualizzazione, il che toglie le loro corrispondenze dall’albero o le riporta. Una modifica nell’area di disegno, un annullamento o una ripetizione, un’importazione e una modifica da parte di un collaboratore o di un agente di programmazione contano tutti. Non contano la selezione, lo spostamento di tabelle, memo o gruppi nell’area di disegno, lo scorrimento, lo zoom e il passaggio del puntatore.  
Non conta nemmeno il cambio della Visualizzazione nomi, che non modifica alcun testo letto dalla ricerca: restano le stesse corrispondenze, e le righe assumono i nomi mostrati dalla nuova vista.  
Le modifiche apportate mentre Esplora è chiuso o non visibile vengono cercate non appena torna visibile.

## Andare a una corrispondenza {#going-to-a-match}

`Enter` nel campo Trova passa alla corrispondenza successiva e `Shift + Enter` a quella precedente. I pulsanti freccia su e giù dopo il contatore fanno lo stesso; i loro tooltip riportano `Previous Match (Shift+Enter)` e `Next Match (Enter)` e i pulsanti sono disabilitati mentre non c’è alcuna corrispondenza.  
Arrivati a un’estremità, lo spostamento ricomincia dall’altra. Nessuna corrispondenza è corrente fino al primo spostamento, quindi il primo `Enter` va alla prima corrispondenza e il primo `Shift + Enter` all’ultima.

Un clic su una riga dei risultati, o `Enter` o `Space` quando la riga ha il focus, fa una di queste cose:

- Una riga il cui nome o nome logico contiene una corrispondenza va alla sua prima corrispondenza, quella del nome logico prima di quella del nome.
- Una riga che mostra un estratto di un commento o di un memo va a quella corrispondenza.
- Qualsiasi altra riga, come una tabella il cui nome e il cui nome logico non corrispondono o la riga propria di un memo, va all’elemento che la riga rappresenta e lascia invariata la corrispondenza corrente — vedere [Andare a una riga](./explorer.md#going-to-a-row).
- Una cartella si comprime o si espande.

Ogni volta che una corrispondenza diventa quella corrente, l’albero espande le eventuali righe compresse sopra di essa e vi porta la riga con il focus, così i tasti freccia nell’albero proseguono da lì.

Andare a una corrispondenza chiude il pannello Proprietà tabella, se è aperto, poi:

- Per il nome, il nome logico o il commento di una tabella o di una colonna, seleziona solo la tabella, la porta in primo piano e sposta il focus sulla cella che contiene la corrispondenza. Una corrispondenza in un commento nascosto da un’[opzione di visualizzazione delle tabelle](./table-related-functions.md#table-view-options) sposta invece il focus sul nome accanto. Dove la [Visualizzazione nomi](./logical-names.md#name-view) non disegna alcuna cella per il nome o per il nome logico, il focus va su quella disegnata al suo posto: il nome in `Physical Names`, il nome logico in `Logical Names`.
- Per il nome di un indice, seleziona solo la tabella dell’indice e la porta in primo piano, con il focus sul nome della tabella, o sul suo nome logico in `Logical Names` e `Both Names`, a meno che il focus non sia già in quella tabella. I nomi degli indici non sono disegnati nell’area di disegno.
- Per il nome di un gruppo di tabelle, seleziona solo il gruppo e lo porta in primo piano con le sue tabelle.
- Per un memo, seleziona solo il memo e lo porta in primo piano.

L’area di disegno scorre solo quando la destinazione non è già ben visibile e lo zoom non cambia mai — vedere [Dove porta un salto](./table-related-functions.md#where-a-jump-lands).

Dopo `Enter` nel campo Trova il punto di inserimento resta lì, e dopo la scelta di una riga il focus resta nell’albero, quindi ciò che si digita dopo non raggiunge la tabella selezionata.  
Andare a una corrispondenza non avvia né completa mai una relazione in corso di disegno.

## Sostituzione {#replacing}

La riga `Replace` è inizialmente compressa. La freccia prima del campo Trova, il cui tooltip riporta `Toggle Replace`, la espande e la comprime. Comprimendola, il testo di sostituzione viene mantenuto.  
La riga contiene il campo `Replace`, con l’interruttore `Preserve Case` all’interno, alla sua estremità, e due pulsanti, i cui tooltip riportano `Replace (Enter)` e `Replace All`. Entrambi i pulsanti sono disabilitati mentre non c’è alcuna corrispondenza.

`Replace` si esegue con `Enter` nel campo Sostituisci, con o senza `Shift`, o con il suo pulsante:

- Senza una corrispondenza corrente, la prima pressione va solo alla corrispondenza successiva, così si vede cosa cambierebbe prima che cambi qualcosa.
- Con una corrispondenza corrente, sostituisce quella sola occorrenza, lasciando le altre occorrenze nello stesso testo, e prosegue alla corrispondenza successiva dopo il testo che ha scritto. Ciò che ha scritto viene saltato anche quando contiene il testo di ricerca: sostituendo `user` con `super_user`, non ci si ferma poi all’interno di `super_user`.
- Una corrispondenza che la sostituzione riscriverebbe esattamente com’era viene lasciata invariata e la pressione si limita a passare alla corrispondenza successiva.
- La sostituzione e lo scorrimento alla corrispondenza successiva sono un solo passo di annullamento.

Una serie di pressioni di `Replace` si ferma quando torna al punto di partenza. Il contatore mostra `No more matches`, nessuna corrispondenza è corrente e le pressioni successive non sostituiscono nulla.  
`Customer` sostituito con `Big Customer` viene quindi sostituito una sola volta, invece di diventare `Big Big Customer`.  
Andare a una corrispondenza, cambiare il testo di ricerca, `Match Case`, `Match Whole Word`, `Use Regular Expression` o un tipo di testo, aprire la ricerca con il tasto o con una voce `Toggle Explorer`, o `Replace All` avvia una nuova serie, così come un annullamento o qualsiasi altra modifica che cambia il testo in cui la serie è iniziata. Cambiare il testo di sostituzione o `Preserve Case` non la avvia, e nemmeno il tasto quando si limita a riportare il punto di inserimento in un pannello Esplora già visibile.  
Finché dura una serie, una tabella o un gruppo di tabelle che essa rinomina mantiene la propria posizione nell’albero e nell’ordine delle corrispondenze, quindi un elemento rinominato in modo da finire più avanti nell’ordinamento non viene incontrato di nuovo. La serie successiva riporta l’albero in ordine di nome e la riga rinominata si sposta nella nuova posizione.

`Replace All` si esegue con `Ctrl + Enter` (Windows/Linux) o `⌘ + Enter` (Mac) nel campo Sostituisci, o con il suo pulsante:

- Sostituisce tutte le corrispondenze nei tipi di testo attivi e lascia intatti gli altri tipi, a parte i nomi fisici che un nome logico sostituito deriva, che scrive anche mentre `Table names` e `Column names` sono disattivati — vedere più avanti. Con i tipi predefiniti, rinomina tabelle, colonne, indici e gruppi di tabelle e riscrive i nomi logici di tabelle e colonne; commenti e memo restano invariati.
- Tutto ciò che modifica è un solo passo di annullamento — vedere [Un gesto, un passo](./undo-redo.md#one-gesture-one-step).
- Il contatore mostra `Replaced N matches`, contando solo le occorrenze il cui testo è effettivamente cambiato. Quando nessuna è cambiata, mostra `No changes` e nella cronologia non viene registrato nulla, come quando si sostituisce l’espressione regolare `(user)` con `$1`.
- I risultati vengono poi cercati di nuovo senza alcuna corrispondenza corrente, quindi possono elencare corrispondenze contenute nel nuovo testo.

Entrambi leggono ogni testo com’è al momento della pressione, non come lo ha trovato l’ultima ricerca.

Come viene usato il testo di sostituzione:

- Senza `Use Regular Expression`, `$` non ha alcun significato speciale e il testo di sostituzione viene usato così come è stato digitato, a parte le maiuscole e minuscole che gli applica `Preserve Case`.
- Con `Use Regular Expression`, da `$1` a `$99`, `$<name>`, `$&`, `` $` ``, `$'` e `$$` vengono espansi come in `String.prototype.replace` di JavaScript.
- Senza `Preserve Case`, le maiuscole e minuscole del testo corrispondente non vengono riportate: con `Match Case` disattivato, sostituire `user` con `member` trasforma `Users` in `members`.
- Con `Preserve Case`, a ogni sostituzione vengono applicate le maiuscole e minuscole del testo che sostituisce, dopo l’espansione di `$1` e degli altri, quindi la stessa sostituzione trasforma `Users` in `Members`:
  - Una corrispondenza tutta in maiuscolo riceve la sostituzione tutta in maiuscolo e una corrispondenza tutta in minuscolo la riceve tutta in minuscolo: `USER` con `account` dà `ACCOUNT` e `user` con `Account` dà `account`.
  - Qualsiasi altra corrispondenza dà al primo carattere della sostituzione la stessa forma, maiuscola o minuscola, del primo carattere della corrispondenza e lascia il resto come digitato: `UserId` con `accountKey` dà `AccountKey` e `uSER` con `AccountKey` dà `accountKey`. Quando il primo carattere della corrispondenza non distingue tra maiuscolo e minuscolo, la sostituzione resta come digitata: `_Ab` con `xyz` dà `xyz`.
  - Quando la corrispondenza e la sostituzione contengono entrambe `-`, o entrambe `_`, e quel separatore le divide nello stesso numero di parti, a ogni parte vengono applicate le maiuscole e minuscole della parte corrispondente: `USER_id` con `account_key` dà `ACCOUNT_key` e `User-Name` con `account-key` dà `Account-Key`. Quando sia `-` sia `_` le dividono in questo modo, le maiuscole e minuscole vengono applicate all’insieme come a un’unica parte.
  - Una corrispondenza senza lettere che distinguono tra maiuscolo e minuscolo, come `123`, lascia la sostituzione come digitata.
  - Una corrispondenza riscritta com’era non viene contata: con `Match Case` disattivato, sostituire `customer` con `Customer` riscrive `customer`, `Customer` e `CUSTOMER` com’erano e nessuna di esse viene contata.
- Un campo Sostituisci vuoto elimina la corrispondenza.

Una sostituzione è una normale modifica, come digitare personalmente il nuovo nome della tabella, il nome della colonna, il nome logico, il commento o il testo del memo, rinominare l’indice in Proprietà tabella o rinominare il gruppo di tabelle.  
Viene registrata nella cronologia e raggiunge i collaboratori e un agente di programmazione come qualsiasi altra modifica.

Così un nome di tabella o di colonna scritto da una sostituzione diventa un nome personalizzato, che un nome logico scritto in seguito lascia com’è finché [Deriva di nuovo i nomi fisici](./dictionary.md#derive-physical-names-again) non lo restituisce ai dizionari. Un nome che una sostituzione lascia vuoto torna invece ai dizionari, come qualsiasi nome cancellato — vedere [Nomi personalizzati](./dictionary.md#names-of-your-own).  
Finché il nome fisico di una tabella o di una colonna è vuoto o è stato a sua volta derivato, un nome logico sostituito lo deriva dai dizionari, come fa la chiusura della cella del nome logico su un nuovo nome logico — vedere [Derivare i nomi fisici](./dictionary.md#deriving-physical-names). In tal caso, una colonna il cui nuovo nome logico è un termine assume anche il dominio del termine e, con esso, il tipo di dati del dominio. Ciò che viene derivato fa parte del passo di annullamento della sostituzione e non viene contato in `Replaced N matches`.  
Quando un solo `Replace All` riscrive sia il nome logico sia il nome della stessa tabella o colonna, il nome che scrive prevale su quello che deriverebbe il nuovo nome logico.

## Tasti nei campi di ricerca {#keys-in-the-search-fields}

- Nel campo Trova, `Enter` passa alla corrispondenza successiva e `Shift + Enter` a quella precedente.
- Nel campo Sostituisci, `Enter` sostituisce, con o senza `Shift`, e `Ctrl + Enter` (Windows/Linux) o `⌘ + Enter` (Mac) sostituisce tutto.
- Mentre un metodo di input sta componendo del testo in uno dei due campi, `Enter` appartiene alla composizione e non sposta né sostituisce.

L’effetto di `Escape`, dei tasti di scelta rapida dell’editor che continuano a funzionare e di ogni altro tasto in questi campi è descritto in [Tasti nel pannello Esplora](./explorer.md#keys-in-the-explorer).

## Editor di sola lettura {#read-only-editors}

In un editor [`readonly`](../../api/erd-editor-element.md#readonly) la ricerca si limita a trovare. Mancano la freccia `Toggle Replace` e la riga `Replace`, quindi anche il campo Sostituisci, `Preserve Case`, `Replace` e `Replace All`.  
Il campo Trova, le sue tre opzioni, i tipi di testo, il contatore, i risultati e lo spostamento a una corrispondenza funzionano tutti. Lo spostamento a una corrispondenza seleziona ciò su cui arriva, come in [Andare a una corrispondenza](#going-to-a-match), e quella selezione è l’unica che un editor di sola lettura faccia: un clic sull’area di disegno che non sposta la cancella.  
Aprire la ricerca con il tasto o con `Toggle Explorer` nella Ricerca rapida, poiché il menu contestuale dell’area di disegno non ha lì `Toggle Explorer`. Il resto del pannello Esplora è trattato in [Editor di sola lettura](./explorer.md#read-only-editors) nella pagina Esplora.

In VS Code, una revisione di un diagramma, come una revisione Git o una voce di Local History, si apre come testo JSON. Riaperta come diagramma con `Reopen Editor With...`, è di sola lettura e ha questa ricerca che si limita a trovare.

## Modificare il tasto di scelta rapida {#changing-the-shortcut}

Una pagina che incorpora l’editor può riassegnare `Ctrl + F` (Windows/Linux) o `⌘ + F` (Mac), o rimuoverlo, con il nome `findReplace` tramite [`setKeyBindingMap`](../../api/erd-editor-element.md#setkeybindingmap).  
Se viene rimosso, il tasto è lasciato alla pagina in ogni scheda. Il pulsante `Explorer` della barra degli strumenti apre e chiude ancora Esplora e la voce `Toggle Explorer` nella Ricerca rapida e nel menu contestuale dell’area di disegno apre ancora la ricerca o chiude Esplora, ma nessuno di essi mostra un tasto di scelta rapida, quindi il tooltip del pulsante riporta solo `Explorer`. Nemmeno la riga `Toggle Explorer` nella scheda [Tasti di scelta rapida](./settings.md#shortcuts) delle Impostazioni mostra un tasto. Con una nuova associazione, tutti mostrano il nuovo tasto.
