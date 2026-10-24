---
sidebar_position: 4
description: Assegnare nomi logici a tabelle e colonne, mostrare i nomi fisici, i nomi logici o entrambi con la Visualizzazione nomi, completare i nomi dei termini durante la digitazione, collegare le colonne ai domini e vedere in quali altri punti i nomi seguono la vista.
---

# Nomi logici

Una tabella e ciascuna delle sue colonne possono avere un nome logico accanto al nome. Il nome logico è quello che leggono le persone, come `Customer Name` per `CUST_NM`. Il nome vero e proprio è il nome fisico, quello che scrivono [Schema SQL](./schema-sql.md) e il [Generatore di codice](./code-generator.md).  
La Visualizzazione nomi determina quale dei due viene disegnato nell’area di disegno ERD: i nomi, i nomi logici o entrambi — vedere [Visualizzazione nomi](#name-view).  
Un nome logico può anche dare alla sua tabella o colonna un nome fisico, derivato dalle parole e dai termini della scheda [Dizionario](./dictionary.md) — vedere [Derivare i nomi fisici](./dictionary.md#deriving-physical-names).  
Una colonna può essere collegata a un dominio, cioè un tipo di dati con un nome, come `Name` per `VARCHAR(100)`, conservato nel foglio `Domains` della scheda Dizionario, e assume allora il tipo di dati del dominio — vedere [La cella Dominio](#the-domain-cell).  
Schema SQL può scrivere ogni nome logico in un commento vuoto — vedere [Nomi logici come commenti](./schema-sql.md#logical-names-as-comments).

## Visualizzazione nomi {#name-view}

Esistono tre viste, e ciascuna disegna a modo suo l’intestazione e le righe di una tabella:

- La vista `Physical Names`, quella di un nuovo diagramma, non disegna alcun nome logico. L’intestazione mostra il nome della tabella e, mentre View Option → `Table Comment` è attivo, il suo commento, e ogni riga mostra le proprie celle nell’[ordine delle colonne](./settings.md#adjusting-column-order).
- La vista `Logical Names` disegna il nome logico al posto di ogni nome: nell’intestazione e, in ogni riga, dove si trova `Name` nell’ordine delle colonne. La cella del tipo di una riga può rappresentare il dominio della colonna, come descritto più avanti.
- La vista `Both Names` disegna il nome logico accanto al nome. L’intestazione mostra il nome logico, poi il nome, poi il commento, e ogni riga acquisisce una cella `Logical Name`, che l’ordine delle colonne colloca per impostazione predefinita subito prima di `Name`.

Un nome logico vuoto, compreso uno composto solo da spazi, mostra un sostituto attenuato. Nella vista `Logical Names` è il nome disegnato al suo posto, oppure il testo segnaposto `table` o `column` quando anche il nome è vuoto. Nella vista `Both Names` è il testo segnaposto `logical`.

Nella vista `Logical Names`, una colonna collegata a un dominio con un nome nel foglio `Domains` della scheda Dizionario mostra nella cella del tipo il nome di quel dominio anziché il proprio tipo di dati. Ogni altra colonna vi mostra il proprio tipo di dati.  
Mentre View Option → `Domain` è attivo, il dominio ha una cella propria e la cella del tipo mantiene il tipo di dati, quindi nessuna riga mostra il dominio due volte — vedere [La cella Dominio](#the-domain-cell).

Ogni tabella è larga quanto le celle che disegna nella vista, quindi un cambio di vista ridimensiona le tabelle e ridispone i loro connettori. Nessuna tabella si sposta.  
Al `70%` o meno, una tabella si riduce al nome — vedere [Zoom avanti/indietro](./table-related-functions.md#zoom-inout). Nella vista `Logical Names` mostra il nome logico, oppure il nome attenuato finché non ce n’è uno. Nella vista `Both Names` mostra il nome logico con il nome su una riga sotto di esso, oppure il nome da solo finché non c’è un nome logico.

I controlli dei dizionari possono scrivere un nome logico o un nome in rosso o in ambra dove lo segnalano — vedere [Indicatori nell’area di disegno](./dictionary.md#marks-on-the-canvas).

## Cambiare vista {#switching-the-view}

Quattro punti permettono di cambiare vista, e ciascuno elenca `Physical Names`, `Logical Names` e `Both Names`, con un segno di spunta sulla vista attiva:

- Il pulsante `Name View` nella [barra degli strumenti dell’area di disegno](./table-related-functions.md#canvas-toolbar), tra le quattro notazioni di relazione e la modalità Zen. Riporta il nome della vista attiva, con una freccia verso il basso, e il suo tooltip è `Name View`. Un clic apre l’elenco sopra la barra degli strumenti, e una scelta lo chiude.
- La voce `Name View` nel menu contestuale dell’area di disegno, subito dopo `View Option`: un sottomenu con le tre viste. Il menu resta aperto dopo una scelta.
- Lo stesso elenco nella barra degli strumenti della scheda Visualizzazione in modalità `Flow`, dopo il menu della visualizzazione righe — vedere [Barra degli strumenti](./visualization.md#toolbar).
- La voce `Name View` nella [Ricerca rapida](./quick-search.md#what-the-palette-lists), subito dopo `Tab` ed elencata solo nella scheda ERD. Il suo sottomenu si apre con l’evidenziazione sulla vista attiva.

![Passaggio della Visualizzazione nomi a Logical Names dalla barra degli strumenti dell’area di disegno, a Both Names dal menu dell’area di disegno e di nuovo a Physical Names, con ordered_at, che non ha un nome logico, prima attenuato e poi mostrato come testo segnaposto logical](/img/demo-name-view.webp)

Tutti e quattro impostano la stessa vista. La barra degli strumenti superiore non ha alcun pulsante per questa funzione.

Un cambio di vista mantiene la selezione e non viene registrato nella [cronologia delle modifiche](./undo-redo.md#what-the-history-records).  
Se la cella con il focus non viene disegnata dalla nuova vista, il focus passa alla cella disegnata al suo posto: il nome e il nome logico prendono l’uno il posto dell’altro, come fanno il tipo e il dominio. Un editor di cella aperto su quella cella si chiude. Attivare o disattivare View Option → `Domain` sposta il focus allo stesso modo.  
Finché il blocco `Name View` è attivo, come in un nuovo diagramma, un cambio di vista modifica solo lo schermo dell’utente e il file mantiene la vista che aveva al momento del blocco. Con il blocco disattivato, il file salva la vista scelta — vedere [Blocco](./settings.md#lock).

## Scrivere un nome logico {#writing-a-logical-name}

La vista `Physical Names` non disegna alcun nome logico, quindi per scriverne uno nell’area di disegno passare alla vista `Logical Names` o `Both Names`:

- Nella vista `Logical Names`, le celle del nome dell’intestazione e delle righe contengono i nomi logici, quindi in questa vista un nome fisico non può essere modificato nell’area di disegno.
- Nella vista `Both Names`, le celle del nome logico contengono i nomi logici e le celle del nome i nomi fisici.

Una cella del nome logico si modifica come ogni altra cella: si inizia con `Enter` o con un doppio clic — vedere [Modifica delle tabelle](./table-editing.md). Aperto su un nome logico vuoto, l’editor mostra come testo segnaposto ciò che la cella disegnava: il nome nella vista `Logical Names`, `logical` nella vista `Both Names`.  
La digitazione scrive solo il nome logico. Il nome fisico ne viene derivato quando l’editor si chiude (`Enter`, `Tab`, `Escape` o un clic altrove) su un nome logico modificato, come un passo di annullamento a sé dopo la digitazione. Un nome fisico scritto dall’utente resta com’è — vedere [Derivare i nomi fisici](./dictionary.md#deriving-physical-names).

`Tab` e `Shift + Tab` percorrono le celle che la vista disegna, nel loro ordine — vedere [Tasto Tab](./table-editing.md#tab-key):

- Nella vista `Logical Names`, il nome logico dell’intestazione, poi il suo commento, poi le celle di ogni riga nell’ordine delle colonne, con il nome logico al posto del nome.
- Nella vista `Both Names`, il nome logico, il nome e il commento dell’intestazione, poi le celle di ogni riga nell’ordine delle colonne, con la cella `Logical Name` per prima per impostazione predefinita.

`Alt + Enter` (Windows/Linux) o `⌥ + Enter` (Mac) aggiunge una colonna e porta il focus sulla sua cella del nome, che nella vista `Logical Names` è il suo nome logico.

Una colonna chiave esterna aggiunta da una relazione copia il nome logico e il dominio della sua chiave, insieme al tipo — vedere [Relazioni identificanti](./relationship-editing.md#identifying-relationships).  
Quando si copiano colonne verso un foglio di calcolo e quando si incollano colonne da esso, vengono usate le celle che la vista disegna, comprese le celle del nome logico e le celle Dominio — vedere [Copiare e incollare colonne](./table-editing.md#copyingpasting-columns).

## Completare i nomi dei termini {#completing-term-names}

Durante la digitazione in una cella del nome logico, dell’intestazione o di una riga, un elenco sotto la cella propone i termini il cui nome inizia con il testo, senza distinguere maiuscole e minuscole e ignorando gli eventuali spazi che lo precedono. Un termine è un nome logico completo conservato nel foglio `Terms` della scheda Dizionario, con il nome fisico e il dominio che assegna. L’elenco mostra fino a otto termini, ordinati per nome, con il testo digitato evidenziato. Finché nessun termine inizia in quel modo, l’elenco non compare.

![Aggiunta di una colonna con ⌥ + Enter in Both Names, scelta di Order Amount dall’elenco dei termini sotto il suo nome logico per compilare ORD_AMT, DECIMAL(10,2) e il dominio Amount, poi digitazione di Order Date, il cui nome ORD_DT viene dato dalle parole quando Enter chiude l’editor](/img/demo-logical-names.webp)

- All’inizio nulla è evidenziato. `↑` e `↓` spostano l’evidenziazione, che a entrambe le estremità ricomincia dall’altra, e il termine evidenziato mostra il tasto `Enter`.
- `Enter` su un termine evidenziato ne scrive il nome come nome logico e termina la modifica. A meno che il nome fisico non sia stato scritto dall’utente, lo stesso passo di annullamento deriva subito il nome fisico dal termine e assegna a una colonna anche il dominio del termine. `Enter` senza alcuna evidenziazione termina la modifica e mantiene il testo digitato.
- Un clic su un termine lo scrive allo stesso modo e lascia aperto l’editor.
- `Escape`, mentre l’elenco è visibile, chiude solo l’elenco, e il successivo `Escape` termina la modifica.
- `Tab` passa oltre con il testo così come è stato digitato, e il nome fisico ne viene derivato alla chiusura dell’editor.
- Mentre un metodo di input sta componendo, le frecce e `Enter` sono gestiti dalla composizione.

Ciò che un termine assegna a una tabella o a una colonna è descritto in [Derivare i nomi fisici](./dictionary.md#deriving-physical-names).

## La cella Dominio {#the-domain-cell}

View Option → `Domain`, disattivato per impostazione predefinita, dà a ogni riga una cella Dominio in ogni vista, nel punto in cui si trova `Domain` nell’ordine delle colonne, per impostazione predefinita subito dopo `DataType` — vedere [Opzioni di visualizzazione delle tabelle](./table-related-functions.md#table-view-options).  
La cella mostra il nome del dominio a cui la colonna è collegata, oppure il testo segnaposto `domain`, attenuato, per una colonna non collegata ad alcun dominio elencato nel foglio `Domains`.

![Attivazione di View Option → Domain, scelta di Amount nella cella Domain di PAY_AMT dopo aver ristretto l’elenco con amo, modifica del Data Type di Amount in DECIMAL(12,2) nella scheda Dizionario, con la colonna che cambia insieme a esso, poi digitazione di NUMERIC(12,2) nella colonna, che la scollega](/img/demo-domains.webp)

`Enter` o un doppio clic apre un selettore sopra la cella: un campo vuoto con il testo della cella come testo segnaposto e, sotto di esso, `None`, poi ogni dominio con un nome del foglio `Domains`, nell’ordine del foglio. L’evidenziazione parte dal dominio collegato, oppure da `None`.

- Digitando vengono elencati solo i domini il cui nome contiene il testo, senza distinguere maiuscole e minuscole, `None` viene escluso e il primo dominio viene evidenziato. `↑` e `↓` spostano l’evidenziazione.
- `Enter` collega il dominio evidenziato, e un clic collega quello su cui si fa clic. Entrambi assegnano alla colonna il tipo di dati del dominio, come un solo passo di annullamento, e terminano la modifica. `None` scollega la colonna e ne mantiene il tipo di dati.
- Il testo digitato non viene mai scritto nella colonna. Finché il foglio `Domains` non contiene alcun dominio con un nome, l’elenco non compare e `Enter` termina la modifica senza scrivere nulla.

Nella vista `Logical Names` con View Option → `Domain` disattivato, una cella del tipo che mostra il nome di un dominio apre questo selettore, e una che mostra un tipo di dati apre l’editor del tipo di dati — vedere [Completamento automatico del tipo di dati](./table-editing.md#datatype-autocomplete). Per collegare un dominio a una colonna che non ne ha, attivare la cella Dominio.  
Una colonna collegata assume il tipo di dati del suo dominio e lo segue quando il tipo del dominio cambia, e digitare un altro tipo nella sua cella Tipo di dati la scollega — vedere [Domini e tipi di dati](./dictionary.md#domains-and-data-types).

## Oltre l’area di disegno {#beyond-the-canvas}

Anche la maggior parte degli altri punti che riportano il nome di una tabella o di una colonna segue la Visualizzazione nomi:

- La vista `Physical Names` mostra il nome.
- La vista `Logical Names` mostra il nome logico oppure, finché il nome logico è vuoto, il nome, attenuato dove il punto lo consente.
- La vista `Both Names` mostra il nome logico seguito dal nome: attenuato in una riga di testo, su una seconda riga in un’etichetta del grafo e tra parentesi dove un unico testo deve contenerli entrambi, come `Member (member)`. Una tabella o una colonna senza nome logico mostra solo il suo nome.

Un elenco ordinato per nome, come le tabelle del pannello Esplora o le righe `#` della Ricerca rapida, resta ordinato per nome in ogni vista, mai per nome logico.

I punti che seguono la vista:

- Nella scheda Visualizzazione, le card della modalità Flusso — vedere [Nomi sulle card](./visualization.md#names-on-the-cards) — e le etichette e l’anteprima al passaggio del puntatore del grafo — vedere [Leggere il grafo](./visualization.md#reading-the-graph) e [Anteprima al passaggio del puntatore](./visualization.md#hover-preview).
- [Proprietà tabella](./table-related-functions.md#table-properties): i suoi chip e, nella scheda `Indexes`, le righe `Columns` e l’elenco `Index order` — vedere [Indici](./table-related-functions.md#indexes).
- Le righe delle tabelle e delle colonne del pannello [Esplora](./explorer.md#the-tree), e le tabelle elencate sotto ogni gruppo di tabelle.
- Le righe `#` della Ricerca rapida — vedere [Cercare nel diagramma](./quick-search.md#searching-the-diagram).
- L’albero delle modifiche del [Visualizzatore differenze](./table-related-functions.md#diff-viewer) ed entrambi i suoi lati.
- [Associa colonne](./relationship-editing.md#map-columns), e il tooltip `<parent> has no primary key to copy` che `Create new columns` può mostrare mentre si disegna una relazione — vedere [Creazione di relazioni](./editing-start.md#relationship-creation).
- La copia delle righe che accompagna il trascinamento di una colonna sopra l’area di disegno vuota e mostra le celle del nome e del tipo di ogni riga come la riga le disegna — vedere [Riordinare e spostare le colonne](./table-editing.md#rearranging-and-moving-columns).
- La colonna `Target` del foglio `Checks` della scheda Dizionario — vedere [Il foglio Controlli](./dictionary.md#the-checks-sheet).
- Un’[immagine esportata](./file-import-export.md#image).

Alcuni punti mantengono i nomi qualunque sia la vista: le righe degli indici e delle chiavi esterne del pannello Esplora, la sezione `Keys` nella scheda `Indexes` di Proprietà tabella, `New column: <name>` di Associa colonne e la posizione indicata accanto a una riga `@` o `:` della Ricerca rapida.

Il Visualizzatore differenze, il [Viaggio nel tempo](./undo-redo.md#time-travel), l’anteprima `Force` del [Layout automatico](./table-related-functions.md#auto-layout) e la finestra di dialogo `Export image` si aprono nella vista che si sta guardando, qualunque sia la vista conservata dal file. Ciascuno mantiene quella vista finché resta aperto.  
Ogni Layout automatico, e un’importazione `Import` o `Import and Add` di Schema SQL, GraphQL, DBML o AML, dispone le tabelle con la larghezza che hanno nella vista dell’utente.

## Cercare per nome logico {#finding-by-logical-name}

I nomi logici vengono trovati in ogni vista, compresa la vista `Physical Names`, in cui l’area di disegno non ne disegna alcuno:

- [Trova e sostituisci](./find-and-replace.md#what-it-searches) li cerca come un unico tipo di testo, `Logical names`, sia per le tabelle sia per le colonne, ed è attivo alla prima apertura della ricerca. Sostituire un nome logico ne deriva il nome fisico, come avviene quando lo si scrive.
- Nella [Ricerca rapida](./quick-search.md#searching-the-diagram), `#` trova una tabella in base al nome o al nome logico, e `@` trova una colonna in base all’uno o all’altro, con `Logical name` accanto a una corrispondenza nel nome logico. Anche la parte della tabella di `@`, prima del `.`, corrisponde al nome o al nome logico di una tabella.

Cambiare la Visualizzazione nomi modifica il nome con cui vengono mostrati i risultati, mai ciò che viene trovato.

## Collaboratori {#collaborators}

In una [sessione collaborativa](../../api/advanced/collaborative-editing.md), i nomi logici e i collegamenti ai domini raggiungono ogni editor come qualsiasi altra modifica.  
Finché il blocco `Name View` è attivo, ogni editor mantiene una vista propria, e un cambio di vista compare solo nell’editor che lo ha effettuato. Mentre è disattivato, un cambio di vista in qualsiasi editor che non sia di sola lettura cambia la vista di ogni editor — vedere [Blocco](./settings.md#lock), che descrive anche l’effetto che l’attivazione o la disattivazione del blocco ha sulla vista di ogni editor.  
Quando la cella su cui un partecipante ha il focus non è disegnata nella vista dell’utente, il suo colore compare sulla cella che questa vista disegna al suo posto: una cella del nome in `Physical Names` compare sulla cella del nome logico dell’utente in `Logical Names`, e viceversa, e una cella del tipo e il dominio che ne prende il posto si corrispondono allo stesso modo.

Un agente di programmazione che lavora tramite il server MCP imposta i nomi logici e collega i domini qualunque sia la vista che si sta guardando, e non dispone di alcuno strumento che cambi la Visualizzazione nomi — vedere [Dizionari](../../mcp/tools.md#dictionaries) e [Impostazioni](../../mcp/tools.md#settings).

## Editor di sola lettura {#read-only-editors}

In un editor [`readonly`](../../api/erd-editor-element.md#readonly) ogni selettore della Visualizzazione nomi funziona, e un cambio di vista modifica solo quello schermo, qualunque sia il blocco.  
Lì i nomi logici e i domini non possono essere modificati, quindi non si apre né l’elenco dei termini né il selettore del dominio, e non viene proposta nessuna delle voci `Derive Physical Name Again` e `Derive Physical Names Again`. Lì View Option → `Domain` non modifica nulla, come del resto nessuna [opzione di visualizzazione](./table-related-functions.md#table-view-options).
