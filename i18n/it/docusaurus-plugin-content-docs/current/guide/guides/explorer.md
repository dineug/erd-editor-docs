---
sidebar_position: 9
description: Sfogliare le tabelle del diagramma con le loro colonne, i loro indici e le loro chiavi esterne, i suoi gruppi di tabelle e i suoi memo in un albero ancorato accanto all’area di disegno ERD, e raggiungere ciascuno di essi con un clic.
---

# Esplora

Esplora è un pannello ancorato al bordo sinistro dell’area di disegno ERD che elenca il diagramma sotto forma di albero: le sue tabelle, ciascuna con le proprie colonne, i propri indici e le proprie chiavi esterne, poi i suoi [gruppi di tabelle](./table-groups.md), poi i suoi memo. Fare clic su una riga per andare a ciò che rappresenta nell’area di disegno.  
Il pannello Esplora restringe l’area di disegno anziché coprirla. Fa parte dell’editor del diagramma e non è la vista Esplora risorse di VS Code né l’esplora file di Obsidian.

![Apertura del pannello Esplora dalla barra degli strumenti, salto a products, poi alla colonna status e alla chiave esterna member_id di orders, compressione con Collapse All, allargamento del pannello e chiusura](/img/demo-explorer.webp)

[Trova e sostituisci](./find-and-replace.md) si trova nella parte superiore, tra la barra del titolo e l’albero. Mentre il campo Trova contiene del testo, l’albero mostra solo ciò che corrisponde — vedere [I risultati](./find-and-replace.md#the-results).  
L’albero in sé non modifica mai il diagramma: non permette di rinominare, trascinare, eliminare, mostrare o nascondere nulla. Una sostituzione è l’unica modifica apportata dal pannello.

Lo stato del pannello Esplora riguarda solo l’utente: se è aperto, la sua larghezza, quali righe sono compresse, la riga che ha il focus, la posizione di scorrimento e la ricerca.  
Nulla di tutto ciò viene salvato nel file, registrato nella cronologia delle modifiche, condiviso con i collaboratori o memorizzato nel browser. Viene conservato finché l’editor resta aperto, anche quando si cambia scheda e quando si caricano altri documenti nello stesso editor. Un editor appena aperto parte con il pannello Esplora chiuso.

## Apertura e chiusura {#opening-and-closing}

Si apre in uno qualsiasi di questi modi:

- Il pulsante `Explorer` della barra degli strumenti, subito dopo `Search`, con un’icona ad albero. Il suo tooltip riporta `Explorer (Ctrl + F)` (Windows/Linux) o `Explorer (⌘ + F)` (Mac).
- `Ctrl + F` (Windows/Linux) o `⌘ + F` (Mac), con il nome `Toggle Explorer` nella scheda [Tasti di scelta rapida](./settings.md#shortcuts) delle Impostazioni.
- La voce `Toggle Explorer` nella [Ricerca rapida](./quick-search.md), presente in ogni scheda. Digitando `find`, `replace`, `rename`, `tree`, `outline` o `objects` la si fa comparire.
- La voce `Toggle Explorer` nel menu contestuale dell’area di disegno: fare clic con il pulsante destro su un punto vuoto dell’area di disegno ERD, al di fuori di qualsiasi [gruppo di tabelle](./table-groups.md). Si trova dopo `New Table`, `New Memo` e `New Table Group`, prima di `Relationship`. Il menu dell’area di disegno di un editor di sola lettura non ha una riga simile — vedere [Editor di sola lettura](#read-only-editors).

Le due voci `Toggle Explorer` mostrano il tasto di scelta rapida a destra.  
Il pulsante della barra degli strumenti, il tasto di scelta rapida e la voce della Ricerca rapida funzionano da ogni scheda. Dalla scheda Visualizzazione, Schema SQL, Generatore di codice, Dizionario o Impostazioni passano prima alla scheda ERD, poiché il pannello Esplora compare solo lì.

Il pulsante della barra degli strumenti si limita ad aprire e chiudere il pannello. Non porta il punto di inserimento nel campo Trova e lascia aperti il pannello Proprietà tabella, il generatore di temi e il selettore `Display Language`.  
Il tasto di scelta rapida e le due voci `Toggle Explorer` aprono il pannello Esplora sulla sua ricerca: il punto di inserimento va nel campo Trova con il testo selezionato, e si chiude l’eventuale finestra di dialogo aperta tra le cinque descritte in [Finestre di dialogo accanto al pannello](#dialogs-beside-it). Cosa conserva la ricerca tra un’apertura e l’altra è descritto in [Apertura e chiusura](./find-and-replace.md#opening-and-closing) nella pagina Trova e sostituisci.  
Il tasto di scelta rapida non ha effetto mentre si modifica una cella di tabella, un memo o il nome di un gruppo di tabelle, o mentre è aperta la modifica di una cella nella scheda [Dizionario](./dictionary.md#keys-on-the-tab), compreso l’elenco dei domini di un termine.

Il pulsante della barra degli strumenti appare premuto mentre il pannello Esplora è aperto nella scheda ERD e non è nascosto dalla [modalità Zen](#when-it-stands-aside). In quel caso, il pulsante, il tasto di scelta rapida e ciascuna delle due voci `Toggle Explorer` chiudono il pannello Esplora, e il focus, se si trovava nel pannello, torna all’editor.  
Il tasto di scelta rapida non lo chiude mai mentre è aperta la Ricerca rapida o una delle cinque finestre di dialogo. Chiude invece il riquadro comandi o la finestra di dialogo e porta il focus nel campo Trova, con il testo selezionato e, se il pannello Esplora era già visibile, mantenendo la corrispondenza corrente. La voce `Toggle Explorer` della Ricerca rapida non prevede questa eccezione: eseguirla chiude il riquadro comandi e poi il pannello Esplora, se è aperto.

Anche il pulsante `x` nella barra del titolo, il cui tooltip riporta `Close`, chiude il pannello Esplora e passa il focus all’area di disegno. `Escape` non lo chiude — vedere [Tasti nel pannello Esplora](#keys-in-the-explorer).  
Riaperto, il pannello Esplora torna con la stessa larghezza, con le stesse righe compresse, la stessa posizione di scorrimento e lo stesso testo di ricerca. Se viene aperto con il tasto di scelta rapida o con una voce `Toggle Explorer`, ripete la ricerca di quel testo con ogni risultato espanso — vedere [I risultati](./find-and-replace.md#the-results).

Quando il tasto di scelta rapida o una voce `Toggle Explorer` apre il pannello Esplora in un editor troppo stretto per contenerlo, compare la notifica `Widen the window to show the Explorer` e il focus resta dov’era — vedere [Accanto all’area di disegno](#beside-the-canvas).  
Il pannello Esplora risulta comunque aperto, con il pulsante della barra degli strumenti premuto, e compare, con la ricerca già eseguita, non appena l’editor è abbastanza largo, senza prendere il focus. Aprirlo con il pulsante della barra degli strumenti non mostra alcuna notifica.

## Accanto all’area di disegno {#beside-the-canvas}

Il pannello Esplora si estende lungo il bordo sinistro della scheda ERD, sotto la barra degli strumenti, per tutta l’altezza dell’area di disegno.  
L’area di disegno si restringe per fargli spazio, quindi nessuna parte del diagramma resta sotto il pannello, e la [barra degli strumenti dell’area di disegno](./table-related-functions.md#canvas-toolbar), la minimappa e la [schermata di benvenuto](./editing-start.md#welcome-screen) si trovano tutte nell’area di disegno accanto a esso.  
Aprire, chiudere o ridimensionare il pannello Esplora non fa scorrere il diagramma e non registra nulla nella [cronologia delle modifiche](./undo-redo.md#what-the-history-records).

In un editor appena aperto è largo inizialmente `260px`. Trascinare il suo bordo destro per impostare una larghezza qualsiasi da `200px` a `480px`, oppure fare doppio clic sul bordo per tornare a `260px`.

L’area di disegno conserva sempre almeno `320px` accanto al pannello Esplora:

- In un editor più stretto della larghezza del pannello Esplora più `320px`, il pannello viene disegnato più stretto per adattarsi, fino a un minimo di `200px`.
- In un editor più stretto di `520px`, si fa da parte. Non viene disegnato, ma resta aperto, quindi il pulsante della barra degli strumenti appare ancora premuto e una pressione lo chiude. Non appena l’editor è abbastanza largo, ricompare con la propria larghezza.

Conta la larghezza dell’editor stesso, non quella della finestra del browser, anche se la notifica descritta in [Apertura e chiusura](#opening-and-closing) parla della finestra.

In una [lingua di visualizzazione da destra a sinistra](./language-and-theme.md#right-to-left-languages), il pannello Esplora resta a sinistra dell’area di disegno, poiché l’area di disegno non viene mai specchiata.  
Il suo contenuto si legge da destra a sinistra: la barra del titolo, la ricerca e le righe sono specchiate, e le righe rientrano da destra. Il bordo da trascinare resta sul suo lato destro, a contatto con l’area di disegno. I tipi di dati, le colonne degli indici e il testo delle chiavi esterne mantengono l’ordine da sinistra a destra.

## Quando si nasconde {#when-it-stands-aside}

Il pannello Esplora compare solo nella scheda ERD.  
Passare a un’altra scheda lo nasconde, e il pulsante della barra degli strumenti non appare più premuto. Tornando alla scheda ERD ricompare così come era stato lasciato, con le stesse righe compresse e la stessa posizione di scorrimento.

Mentre è aperto il [Visualizzatore differenze](./table-related-functions.md#diff-viewer), il [Viaggio nel tempo](./undo-redo.md#time-travel) o l’anteprima del [Layout automatico](./table-related-functions.md#auto-layout), niente apre o chiude il pannello Esplora:

- Un pannello Esplora aperto viene nascosto, e ricompare non appena questi si chiudono.
- Il pulsante della barra degli strumenti appare attenuato e non ha effetto.
- La Ricerca rapida non include `Toggle Explorer`.
- Il tasto di scelta rapida viene lasciato al browser o all’host — vedere [La barra di ricerca del browser](./find-and-replace.md#the-browsers-find-bar).

Il Visualizzatore differenze elenca le sue modifiche in un albero dello stesso tipo — vedere [Visualizzatore differenze](./table-related-functions.md#diff-viewer).

Attivare la [modalità Zen](./table-related-functions.md#canvas-toolbar) con `Alt + Z` (Windows/Linux) o `⌥ + Z` (Mac) nasconde un pannello Esplora aperto senza chiuderlo, e disattivare la modalità Zen lo fa ricomparire.  
In modalità Zen il tasto di scelta rapida e le due voci `Toggle Explorer` aprono comunque il pannello Esplora sulla sua ricerca, e la modalità Zen resta attiva. Il pannello Esplora occupa allora l’intera altezza dell’editor, poiché la barra degli strumenti superiore non c’è più, e resta visibile quando si disattiva la modalità Zen. Riattivando la modalità Zen viene nascosto di nuovo.

Ogni volta che il pannello scompare mentre ha il focus, che venga chiuso, nascosto o si faccia da parte, il focus torna all’editor.

## L’albero {#the-tree}

La barra del titolo riporta `Explorer` e contiene due pulsanti: `Collapse All` e la `x` che chiude il pannello Esplora. Sotto di essa si trova la ricerca — vedere [Trova e sostituisci](./find-and-replace.md) — e sotto ancora l’albero.

Il livello superiore contiene tre cartelle, in questo ordine: `Tables`, `Table Groups` e `Memos`. Sotto ogni tabella si trovano le sue cartelle `Columns`, `Indexes` e `Foreign Keys`.  
Una cartella vuota non viene mostrata, quindi un diagramma vuoto non mostra alcuna riga. Anche la cartella `Table Groups` viene omessa mentre [View Option](./table-related-functions.md#table-view-options) → `Table Groups` nasconde i gruppi, e la cartella `Memos` mentre View Option → `Memos` nasconde i memo.  
Una riga di cartella mostra un’icona di cartella, il suo nome e, in fondo alla riga, il numero delle righe direttamente sotto di essa, quindi il numero accanto a `Tables` è il numero di tabelle del diagramma. Il numero raggruppa le migliaia come fa la lingua di visualizzazione, sempre con le cifre da 0 a 9, come `1,234` in inglese e `1.234` in tedesco.

Le tabelle sono elencate per nome, senza distinzione tra maiuscole e minuscole, e le tabelle con lo stesso nome mantengono l’ordine del documento. I gruppi di tabelle sono elencati allo stesso modo, così come le tabelle sotto ciascun gruppo. Le colonne di una tabella mantengono l’ordine della tabella stessa, mentre i suoi indici, le sue chiavi esterne e i memo mantengono quello del documento.  
L’albero segue il diagramma man mano che cambia, che sia per una modifica nell’area di disegno, un annullamento o una ripetizione, un’importazione, un collaboratore o un agente di programmazione, quindi rinominare una tabella ne sposta la riga.  
L’ordine segue il nome in ogni vista della [Visualizzazione nomi](./logical-names.md#name-view), mai il nome logico. Cambiare vista modifica le etichette delle righe delle tabelle e delle colonne senza spostarne alcuna, e lo stesso vale per l’assegnazione di un nome logico a una tabella o a una colonna in `Logical Names` o `Both Names`. Un nome fisico [derivato](./dictionary.md#deriving-physical-names) da un nuovo nome logico è però una ridenominazione come le altre, quindi può spostare la riga di una tabella.

Ogni tipo di riga mostra:

- Una tabella: un’icona di tabella e il suo nome.
- Una colonna: un’icona a forma di chiave per una colonna chiave primaria o chiave esterna, colorata come la cella chiave della tabella colora una chiave primaria, una chiave esterna o entrambe, e un’icona a elenco per qualsiasi altra colonna. Poi il suo nome e, in tono attenuato, il suo tipo di dati seguito da `PK`, `FK` o entrambi, come `id` `BIGINT PK` o `user_id` `BIGINT FK`. Il tipo mostrato è sempre il tipo di dati della colonna, mai il suo [dominio](./logical-names.md#the-domain-cell), qualunque sia la Visualizzazione nomi.
- Un indice: un’icona di indice e il suo nome. Poi, in tono attenuato, `UNIQUE` per un indice univoco e le sue colonne tra parentesi nell’ordine dell’indice, con `DESC` dopo una colonna discendente, come `orders_user_idx` `UNIQUE (user_id DESC, total)`, o semplicemente `(total)`.
- Una chiave esterna: elencata solo sotto la tabella figlia, quella che contiene le colonne chiave esterna, e solo finché la tabella padre si trova nel diagramma. La sua icona a forma di chiave assume il colore del connettore: il colore di chiave primaria e chiave esterna per una [relazione identificante](./relationship-editing.md#identifying-relationships), altrimenti il colore di chiave esterna. Mostra le colonne chiave della tabella figlia, separate da virgole, poi, in tono attenuato, `→` con la tabella padre e le sue colonne, come `user_id` `→ users(id)`.
- Un gruppo di tabelle: un punto nel colore del gruppo, grigio per un gruppo senza colore, e il suo nome. Le sue tabelle sono elencate sotto di esso per nome, e ciascuna porta alla propria tabella. Un gruppo senza tabelle non ha nulla da espandere.
- Un memo: un’icona di nota adesiva e la prima riga del memo.

Le righe delle tabelle, le tabelle elencate sotto un gruppo e le righe delle colonne seguono la Visualizzazione nomi — vedere [Oltre l’area di disegno](./logical-names.md#beyond-the-canvas). In `Both Names`, ad esempio, una riga di colonna riporta `Total Amount` `total` `NUMERIC`: il nome logico, poi il nome e il tipo di dati, entrambi attenuati.  
In ogni vista, le righe degli indici e delle chiavi esterne mostrano le loro colonne per nome, e anche una riga di chiave esterna mostra la sua tabella padre per nome.  
Mentre il campo Trova contiene del testo, una riga trovata solo nel nome che la sua vista omette mostra anche quel nome, attenuato — vedere [I risultati](./find-and-replace.md#the-results).

Un nome vuoto, o un memo la cui prima riga è vuota, appare come `unnamed` in corsivo. In `Logical Names` e `Both Names`, una tabella o una colonna appare come `unnamed` solo quando anche il suo nome logico è vuoto.  
In un pannello stretto, il testo attenuato viene troncato con `…` prima del nome con cui inizia la riga. Passare il puntatore su un nome o sul suo testo attenuato per vederlo per intero.

All’inizio è espansa solo la cartella `Tables`. Fare clic su una riga di cartella, oppure premere `Enter` o `Space` su di essa, per comprimerla o espanderla.  
La freccia all’inizio di una riga comprime o espande quella riga senza andare da nessuna parte. Ogni riga di tabella ne ha una, anche quella di una tabella senza nulla sotto. Anche `→` e `←` comprimono ed espandono — vedere [Tasti nel pannello Esplora](#keys-in-the-explorer).  
`Collapse All` comprime un livello a ogni pressione: il livello più profondo di righe espanse visibili, quindi le pressioni comprimono dal basso verso l’alto. La pressione che raggiunge il livello superiore comprime ogni riga, comprese quelle sotto una riga già compressa, lasciando solo le cartelle di primo livello.  
Le modifiche, gli annullamenti, le ripetizioni e i cambiamenti apportati da collaboratori o da un agente di programmazione lasciano la compressione delle righe com’è.

## Andare a una riga {#going-to-a-row}

Fare clic su una riga, oppure premere `Enter` o `Space` mentre ha il focus, per andare a ciò che rappresenta nell’area di disegno ERD. Una riga di cartella si limita a comprimersi o espandersi, e i tasti freccia si spostano solo all’interno dell’albero.

- Una riga di tabella, o una tabella elencata sotto un gruppo, seleziona solo quella tabella e la porta in primo piano. A meno che la cella con il focus non si trovi già in quella tabella, il focus passa alla prima cella dell’intestazione della tabella: il nome, o il nome logico in `Logical Names` e `Both Names`.
- Una riga di colonna seleziona solo la sua tabella e porta la cella con il focus sul nome della colonna o, in `Logical Names`, sul nome logico disegnato al suo posto.
- Una riga di indice seleziona la sua tabella, come fa una riga di tabella. L’indice in sé non viene messo in evidenza; gli indici si modificano in [Proprietà tabella](./table-related-functions.md#indexes).
- Una riga di chiave esterna porta in vista insieme entrambe le tabelle della relazione, oppure la tabella figlia quando le due sono troppo distanti per essere mostrate insieme. Seleziona solo la tabella figlia con le sue colonne chiave esterna, porta la cella con il focus sulla prima di esse ed evidenzia il connettore della relazione — vedere [Leggere un connettore](./relationship-editing.md#reading-a-connector).
- Una riga di gruppo di tabelle porta in vista il riquadro del gruppo inquadrandone la barra del titolo, seleziona solo il gruppo e lo porta in primo piano insieme alle sue tabelle.
- Una riga di memo seleziona solo il memo e lo porta in primo piano.

La vista si sposta secondo la regola comune a ogni navigazione: lo zoom non cambia mai, e l’area di disegno scorre solo quando l’elemento raggiunto non è già ben visibile — vedere [Dove porta un salto](./table-related-functions.md#where-a-jump-lands).  
Andare a una riga chiude prima il pannello Proprietà tabella, se è aperto, e non avvia né completa mai una relazione in corso di disegno.  
Mentre il campo Trova contiene del testo, una riga il cui nome o nome logico contiene una corrispondenza, o una che mostra un estratto di un commento o di un memo, porta invece alla sua prima corrispondenza — vedere [Andare a una corrispondenza](./find-and-replace.md#going-to-a-match).

Dopo un clic, il focus resta nell’albero, quindi `Delete`, `Backspace` e gli altri tasti di modifica non raggiungono la nuova selezione finché non si preme `Escape` o si fa clic sull’area di disegno — vedere [Tasti nel pannello Esplora](#keys-in-the-explorer).

## Tasti nel pannello Esplora {#keys-in-the-explorer}

L’albero occupa un solo passo nella sequenza di tabulazione e viene saltato finché non contiene righe.  
Raggiungendolo con la tabulazione si arriva sulla riga che aveva il focus per ultima, oppure, in mancanza di essa, sulla riga della corrispondenza corrente, o sulla prima riga interamente visibile, e quella riga viene fatta scorrere in vista. La riga con il focus viene disegnata come una riga sotto il puntatore.

Nell’albero:

- `↑` e `↓` spostano di una riga, fermandosi alla prima e all’ultima riga anziché ricominciare dall’altra estremità. `Home` e `End` vanno alla prima e all’ultima riga.
- `→` espande una riga compressa, o passa al primo figlio di una riga espansa. `←` comprime una riga espansa, o passa alla riga padre. In una lingua di visualizzazione da destra a sinistra i due tasti si scambiano.
- `Enter` e `Space` equivalgono a un clic: vanno alla riga, oppure comprimono o espandono una cartella — vedere [Andare a una riga](#going-to-a-row).
- Digitare una lettera non fa saltare a una riga.

`Escape` premuto in qualsiasi punto del pannello Esplora, nell’albero, nel campo Trova o Sostituisci o su uno dei suoi pulsanti, restituisce il focus all’area di disegno. Il pannello Esplora resta aperto e la selezione resta invariata.  
Un `Escape` che termina una composizione del metodo di input termina solo la composizione. `Escape` non chiude mai il pannello Esplora, che venga premuto al suo interno o sull’area di disegno.

Alcuni tasti di scelta rapida dell’editor funzionano anche mentre il focus è nel pannello Esplora — vedere [Tasti di scelta rapida](./settings.md#shortcuts):

- `Ctrl + F` (Windows/Linux) o `⌘ + F` (Mac) funziona come nell’area di disegno: chiude il pannello Esplora oppure, mentre accanto è aperto il pannello Proprietà tabella, chiude Proprietà tabella e porta il punto di inserimento nel campo Trova — vedere [Apertura e chiusura](#opening-and-closing).
- `Ctrl + K` (Windows/Linux) o `⌘ + K` (Mac) apre o chiude la Ricerca rapida.
- `Undo` e `Redo` annullano e ripetono le modifiche al diagramma anziché al testo di un campo.
- `Zoom In`, `Zoom Out` e `Zoom Reset` eseguono lo zoom dell’area di disegno.

Ogni altro tasto di scelta rapida dell’editor resta nel pannello Esplora, e lo stesso vale per i tasti freccia, `Tab`, `Enter`, `Space`, `Home`, `End` e qualsiasi tasto premuto mentre un metodo di input sta componendo.  
Nessuno di essi raggiunge l’area di disegno: `Delete` e `Backspace` non eliminano mai la selezione, `Alt + N` (Windows/Linux) o `⌥ + N` (Mac) non aggiunge alcuna tabella, e `T` e poi `G` non raggruppa nulla. In un campo agiscono come normali tasti di testo: `Ctrl + A` (Windows/Linux) o `⌘ + A` (Mac) seleziona il testo del campo, `Delete` e `Backspace` cancellano il testo, e `Space` digita uno spazio. `Tab` si sposta tra i pulsanti, i campi e l’albero del pannello Esplora.  
I tasti propri dei campi Trova e Sostituisci sono descritti in [Tasti nei campi di ricerca](./find-and-replace.md#keys-in-the-search-fields).  
I tasti che l’editor non associa, come quelli per il salvataggio o il riquadro comandi dell’host, raggiungono l’host come di consueto.

## Finestre di dialogo accanto al pannello {#dialogs-beside-it}

[Proprietà tabella](./table-related-functions.md#table-properties), il [generatore di temi](./language-and-theme.md#theme), il selettore [`Display Language`](./language-and-theme.md#picking-a-language), la finestra di dialogo [`Export image`](./file-import-export.md#image) e [Associa colonne](./relationship-editing.md#map-columns) lasciano aperto il pannello Esplora quando si aprono.

- Proprietà tabella si apre al centro dell’area di disegno accanto al pannello Esplora e oscura solo l’area di disegno. Il pannello Esplora resta utilizzabile: scegliere una riga chiude Proprietà tabella, poi porta alla riga.
- `Export image` e Associa colonne oscurano l’intero editor, compresi la barra degli strumenti e il pannello Esplora. Il pannello Esplora resta aperto sotto l’area oscurata, e un clic lì chiude la finestra di dialogo, come fa un clic in qualsiasi punto dell’area oscurata; Associa colonne si chiude allora senza associare nulla.
- In una lingua di visualizzazione da sinistra a destra, il generatore di temi e il selettore `Display Language` si aprono subito dopo il pannello Esplora anziché sopra di esso, e si spostano di conseguenza se il pannello si apre o si chiude mentre sono visibili. In una lingua da destra a sinistra mantengono la loro posizione a destra. Una pressione nel pannello Esplora li chiude, come fa qualsiasi pressione al di fuori di essi tranne una sulla barra degli strumenti.

Aprire la ricerca con il tasto di scelta rapida o con una voce `Toggle Explorer` le chiude tutte e cinque, Associa colonne senza associare nulla.  
Anche la [Ricerca rapida](./quick-search.md) lascia aperto il pannello Esplora, e `Escape` chiude allora solo il riquadro comandi.

## Editor di sola lettura {#read-only-editors}

In un editor [`readonly`](../../api/erd-editor-element.md#readonly) il pannello Esplora funziona come in qualsiasi altro: il pulsante della barra degli strumenti con lo stesso tooltip, il tasto di scelta rapida, la voce `Toggle Explorer` nella Ricerca rapida, l’albero, la compressione delle righe e `Collapse All`. Anche lì il suo titolo riporta `Explorer`. Il menu contestuale dell’area di disegno non ha lì `Toggle Explorer`, perché mantiene solo le righe che leggono — vedere [Editor di sola lettura](./table-related-functions.md#read-only-editors).

Andare a una riga funziona come in [Andare a una riga](#going-to-a-row): la vista si sposta con la stessa regola, e la tabella, il gruppo di tabelle o il memo della riga viene selezionato, con il contorno sull’area di disegno e la cella con il focus dove la riga la mette.  
È l’unico modo in cui un editor di sola lettura seleziona qualcosa. Una pressione sull’area di disegno non seleziona nulla, e un clic che non sposta cancella la selezione lasciata da una riga. Una tabella così selezionata si apre in [Proprietà tabella](./table-related-functions.md#table-properties) con `Alt + Space` (Windows/Linux) o `⌥ + Space` (Mac), in sola lettura, e `Ctrl + C` (Windows/Linux) o `⌘ + C` (Mac) copia ciò che ha selezionato come in qualsiasi editor.  
La sua ricerca si limita a trovare — vedere [Editor di sola lettura](./find-and-replace.md#read-only-editors) nella pagina Trova e sostituisci.
