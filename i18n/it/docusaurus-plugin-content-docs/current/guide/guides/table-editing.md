---
sidebar_position: 3
description: Aggiungere, selezionare, riordinare ed eliminare colonne, attivare o disattivare le opzioni delle colonne e copiare o incollare colonne.
---

# Modifica delle tabelle

La modifica delle tabelle offre fondamentalmente un’esperienza di modifica simile a quella di Excel.  
La [Visualizzazione nomi](./logical-names.md#name-view) determina se una tabella disegna nell’intestazione e nelle righe i nomi, i nomi logici o entrambi.  
La modalità di modifica si avvia con `Enter` o facendo doppio clic su una cella.  
`Enter` o `Escape` la termina. Il testo digitato viene applicato durante la digitazione, quindi `Escape` mantiene il testo anziché ripristinare quello precedente. Una [cella Dominio](./logical-names.md#the-domain-cell) fa eccezione: si limita a scegliere dal suo elenco e non mantiene mai il testo digitato. Chiudere una [cella del nome logico](./logical-names.md#writing-a-logical-name) su un nome logico modificato può anche compilare il nome fisico.  
`Escape` lascia il focus sulla cella e la selezione sulla tabella, e un secondo `Escape` li rimuove entrambi. Mentre una cella del nome logico mostra il suo [elenco dei termini](./logical-names.md#completing-term-names), il primo `Escape` chiude solo l’elenco.  
Mentre un metodo di input sta ancora componendo il testo, `Escape` lascia attiva la modalità di modifica.

![Aggiunta di una tabella con Alt + N e compilazione di due colonne](/img/demo-table-edit.webp)

## Aggiungere colonne {#adding-columns}

Si creano con il tasto di scelta rapida `Alt + Enter` (Windows/Linux) o `⌥ + Enter` (Mac), che aggiunge una colonna a ogni tabella selezionata, oppure con il pulsante `+` nell’intestazione di una tabella, che ne aggiunge una a quella tabella.  
La prima cella della nuova colonna riceve il focus, la prima che la sua riga disegna nell’[ordine delle colonne](./settings.md#adjusting-column-order). Con l’ordine predefinito è il suo nome, che nella vista `Logical Names` è il suo nome logico e nella vista `Both Names` la sua cella `Logical Name` — vedere [Visualizzazione nomi](./logical-names.md#name-view).  
Anche una colonna aggiunta con `Tab` dall’ultima cella, e la chiave primaria che il disegno di una relazione aggiunge a una tabella padre che ne è priva, iniziano da quella cella.

## Tasto Tab {#tab-key}

Premere `Tab` per passare direttamente alla modalità di modifica della cella successiva.  
Premendo `Tab` nell’ultima cella si crea una nuova colonna e si apre la sua prima cella per la modifica — vedere [Aggiungere colonne](#adding-columns).  
Usare `Shift + Tab` per spostarsi alla modalità di modifica della cella precedente.  
`Tab` e `Shift + Tab` passano per le celle che la tabella disegna, nel loro ordine, quindi la Visualizzazione nomi e View Option → `Domain` determinano se tra queste ci sono le celle del nome logico e le celle Dominio — vedere [Scrivere un nome logico](./logical-names.md#writing-a-logical-name).  
Gli indicatori di [chiave alternativa](./table-related-functions.md#alternate-keys) disegnati dopo l’ultima cella di una riga non sono celle, quindi il focus della tastiera li salta e non si aprono mai per la modifica.

![Spostamento tra le celle di una riga con Tab, aggiunta di una colonna dall’ultima cella e ritorno indietro con Shift + Tab](/img/demo-table-tab.webp)

## Completamento automatico del tipo di dati {#datatype-autocomplete}

Iniziare a modificare una cella `DataType` e digitare. Vengono suggeriti i tipi corrispondenti del database selezionato, e la parte di un suggerimento che contiene letteralmente il testo digitato viene evidenziata.  
La corrispondenza in sé è approssimativa, quindi `vch` trova anche `VARCHAR`.

- `Arrow Up` o `Arrow Down`: spostarsi tra i suggerimenti
- `Arrow Right`, `Tab` o `Enter`: accettare il suggerimento evidenziato
- `Arrow Left`: tornare al testo digitato

È anche possibile fare clic su un suggerimento.  
L’elenco mostra fino a dieci suggerimenti alla volta e si può scorrere per vedere gli altri.  
Nulla è imposto, quindi un tipo che non è nell’elenco può essere digitato liberamente, argomenti compresi, come in `VARCHAR(255)`. L’elenco si chiude non appena il testo digitato va oltre un nome di tipo completo, come fanno `VARCHAR(255)` o `BIGINT UNSIGNED`.  
I suggerimenti seguono il database selezionato. Cambiare il database modifica ciò che viene proposto e lascia invariate le colonne esistenti.

Digitare nella cella `DataType` di una colonna collegata a un dominio, o accettarvi un suggerimento, scollega la colonna non appena il suo tipo differisce da quello del dominio — vedere [Domini e tipi di dati](./dictionary.md#domains-and-data-types).  
Nella vista `Logical Names`, mentre View Option → `Domain` è disattivato, la cella del tipo di una colonna collegata a un dominio con un nome mostra il nome del dominio, e modificarla apre il [selettore del dominio](./logical-names.md#the-domain-cell) anziché questi suggerimenti. Una cella del tipo che mostra un tipo di dati si modifica come descritto sopra.

![Compilazione delle celle DataType dai suggerimenti approssimativi con i tasti freccia, Tab ed Enter](/img/demo-data-type-autocomplete.webp)

## Non null, univoco, incremento automatico {#not-null-unique-auto-increment}

Queste tre celle sono interruttori, non testo.  
Per invertirne il valore, fare doppio clic su una di esse oppure premere `Enter` mentre ha il focus.

La cella Non null mostra `N-N` quando è impostata e `NULL` quando non lo è.  
`UQ` e `AI` appaiono attenuati quando sono disattivati ed evidenziati quando sono attivi.

![Inversione di Non null con un doppio clic, e di Univoco e Incremento automatico con Enter](/img/demo-column-options.webp)

Le celle nascoste dalle [opzioni di visualizzazione delle tabelle](./table-related-functions.md) non possono essere attivate o disattivate.

## Selezionare più colonne {#selecting-multiple-columns}

Supporta cinque metodi:

- `Shift + Arrow Up/Down`: estendere la selezione di una riga alla volta
- `Ctrl + click` (Windows/Linux) o `⌘ + click` (Mac): aggiungere una singola colonna
- `Shift + click`: selezionare l’intervallo a partire dall’ultima colonna che ha ricevuto il focus
- `Ctrl + Shift + click` (Windows/Linux) o `⌘ + Shift + click` (Mac): aggiungere quell’intervallo alla selezione
- `Alt + A` (Windows/Linux) o `⌥ + A` (Mac): Selezionare tutto

![Selezione di colonne con Shift + Arrow Down, Ctrl/⌘ + click, Shift + click e Alt + A](/img/demo-column-select.webp)

Per spostare insieme le colonne selezionate, trascinare la maniglia accanto a quella con il focus — vedere [Riordinare e spostare le colonne](#rearranging-and-moving-columns).

Un clic con il pulsante destro sulla riga di una colonna determina su quali colonne agisce il menu contestuale della tabella, qualunque sia il tasto modificatore premuto.  
Su una riga già selezionata, la selezione resta e il focus passa a quella riga. Su qualsiasi altra riga, viene selezionata solo quella riga. Ciò vale in qualunque punto della riga, compresi l’icona della chiave e un indicatore di [chiave alternativa](./table-related-functions.md#alternate-keys).  
Quindi, per agire su più colonne dal menu, come in [Chiave primaria di una colonna](#column-primary-key) o [Eliminazione delle colonne](#column-deletion), fare clic con il pulsante destro su una delle righe selezionate.  
Su Mac, anche `Ctrl + click` apre il menu, ma conta come un clic semplice, quindi su una cella seleziona solo quella riga prima che il menu si apra.

## Riordinare e spostare le colonne {#rearranging-and-moving-columns}

Una colonna si sposta con la sua maniglia di trascinamento, un piccolo pulsante con un’impugnatura che si trova appena fuori dal bordo sinistro della tabella, accanto alla riga con il focus.  
Quando si porta il focus su una cella qualsiasi della colonna, facendo clic su di essa o con i tasti freccia o `Tab`, la maniglia compare accanto alla sua riga. Nessuna riga ne ha una mentre il focus è sull’intestazione della tabella.  
La maniglia è disegnata in modo tenue finché il puntatore non vi si trova sopra, e il puntatore si trasforma allora in una mano. Una semplice pressione non fa nulla: il trascinamento inizia non appena il puntatore si sposta, e può portare la colonna in un altro punto della sua tabella o in un’altra tabella.  
Sopra le righe di una tabella, le righe trascinate si spostano in posizione e le righe attorno al punto di rilascio si spostano di lato per fare spazio. Sopra l’area di disegno vuota, o sopra l’intestazione di una tabella che ha colonne, una copia traslucida delle righe segue il puntatore, mostrando le celle del nome e del tipo di ogni riga come la riga le disegna nella [Visualizzazione nomi](./logical-names.md#name-view) corrente.  
Rilasciare appena sotto l’ultima riga di una tabella per spostare la colonna alla fine di quella tabella. Una tabella senza colonne accetta il rilascio in qualsiasi suo punto. Anche la fascia appena a sinistra di una tabella, dove si trova la maniglia, conta come righe della tabella, quindi un trascinamento dritto verso il basso lungo la maniglia riordina le colonne senza che il puntatore entri nella tabella.  
Una colonna spostata in un’altra tabella mantiene il suo nome logico e il suo dominio.

![Focus su una colonna e trascinamento della maniglia accanto alla sua riga in una nuova posizione, poi trascinamento della maniglia di un’altra colonna in un’altra tabella](/img/demo-column-move.webp)

Per spostare più colonne contemporaneamente, [selezionarle](#selecting-multiple-columns) e trascinare la maniglia accanto a quella con il focus. Mentre la colonna con il focus è una di due o più colonne selezionate della sua tabella, la maniglia le trascina tutte; altrimenti trascina solo la propria colonna.  
Non serve alcun tasto modificatore. Tenendo premuto `Alt` (Windows/Linux) o `⌥` (Mac) sulla maniglia, le colonne si spostano come con un trascinamento semplice e nulla viene duplicato.

![Selezione di tre colonne, poi trascinamento della maniglia accanto a quella con il focus in un’altra tabella, con le altre colonne selezionate che si spostano insieme a essa](/img/demo-column-multi-move.webp)

Un trascinamento che inizia sulla riga di una colonna anziché sulla sua maniglia sposta la tabella, come fa un trascinamento sulla sua intestazione — vedere [Spostare più tabelle](./table-related-functions.md#moving-multiple-tables). `Alt + drag` (Windows/Linux) o `⌥ + drag` (Mac) su una riga duplica la tabella — vedere [Duplicare tabelle e memo](./table-related-functions.md#duplicating-tables-and-memos).  
Con lo zoom al `70%` o meno, dove le tabelle mostrano solo il loro nome, o in un editor di sola lettura, non viene disegnata alcuna maniglia, quindi lì le colonne non possono essere riordinate.  
Un trascinamento di colonna in corso quando l’editor diventa di sola lettura termina subito: la copia che segue il puntatore e la mano che afferra scompaiono, e il rilascio non sposta alcuna colonna. Le righe che il trascinamento aveva già spostato restano dove le ha spostate.

## Eliminazione delle colonne {#column-deletion}

Elimina le colonne selezionate della tabella con il focus. Un clic su una cella ne seleziona la colonna, quindi facendo clic su una cella e premendo `Delete` si rimuove quella sola colonna.  
Tasti di scelta rapida:

- `Delete` o `Backspace`. Rimuovono le colonne selezionate mentre la loro tabella è l’unico elemento selezionato. Quando non è selezionata alcuna colonna (il focus è sul nome, sul [nome logico](./logical-names.md#name-view) o sul commento della tabella), quando è selezionato anche qualcos’altro, oppure con lo zoom al `70%` o meno, dove le tabelle mostrano solo il loro nome, rimuovono invece l’intera selezione — vedere [Eliminazione di tabelle e memo](./table-related-functions.md#table-and-memo-deletion).
- `Alt + Backspace` o `Alt + Delete` (Windows/Linux), `⌥ + Backspace` o `⌥ + Delete` (Mac). Rimuovono le colonne selezionate della tabella con il focus anche quando la selezione comprende altre tabelle o altri memo. Non rimuovono nulla durante la modifica di una cella o con lo zoom al `70%` o meno.

![Eliminazione di una colonna, poi di due colonne selezionate, con Alt + Backspace](/img/demo-column-remove.webp)

Il menu contestuale della tabella fa lo stesso. Con la tabella come unico elemento selezionato, fare clic con il pulsante destro sulla riga di una colonna: l’ultima voce del menu è `Delete column`, oppure `Delete columns` quando la colonna di quella riga è una di due o più colonne selezionate.

Durante la modifica di una cella, `Delete` e `Backspace` cancellano solo il testo. Tenuti premuti fuori dall’editor della cella, rimuovono una sola volta.  
Dopo una rimozione, il focus passa alla colonna rimanente più vicina sopra quella che aveva il focus. Quando sopra non ne resta nessuna, il focus passa al nome della tabella (nella vista `Logical Names`, al nome logico disegnato al suo posto) anche se restano colonne sotto, quindi il successivo `Delete` o `Backspace` rimuove la tabella anziché una colonna.  
Le relazioni e gli indici che usano una colonna rimossa vengono rimossi insieme a essa. Non viene chiesta alcuna conferma, e l’intera rimozione costituisce un solo passo di annullamento.

## Copiare e incollare colonne {#copyingpasting-columns}

Funziona come degli Appunti in formato tabella.  
Tasti di scelta rapida: `Ctrl + C` (Windows/Linux) o `⌘ + C` (Mac), `Ctrl + V` (Windows/Linux) o `⌘ + V` (Mac)

Quando si copia verso un foglio di calcolo o si incolla da esso, e quando si incolla nella tabella in cui una cella di colonna ha il focus, vengono usate le celle mostrate dalle tabelle, nell’ordine in cui le mostrano — vedere [Opzioni di visualizzazione delle tabelle](./table-related-functions.md#table-view-options), [Modificare l’ordine delle colonne](./settings.md#adjusting-column-order) e [Visualizzazione nomi](./logical-names.md#name-view). La Visualizzazione nomi cambia il contenuto di alcune di queste celle:

- Nella vista `Logical Names`, la cella del nome contiene il nome logico, oppure nulla finché è vuoto. Mentre View Option → `Domain` è disattivato, la cella del tipo contiene il nome del dominio della colonna dove ne mostra uno, e altrimenti il tipo di dati.
- Nella vista `Both Names`, la cella `Logical Name` viene copiata e incollata nel punto in cui la colloca l’ordine delle colonne.
- Una cella Dominio mostrata contiene il nome del dominio, oppure nulla per una colonna che non mostra alcun dominio.

Le colonne copiate nell’editor e incollate con l’intestazione di una tabella selezionata, o nelle altre tabelle selezionate, portano con sé tutte le celle delle colonne copiate, comprese quelle nascoste come Univoco e Incremento automatico, e i loro nomi logici.  
Mantengono un collegamento a un dominio solo finché questo diagramma elenca quello stesso dominio, non semplicemente uno con lo stesso nome, e il dominio ha ancora il tipo della colonna copiata. Altrimenti vengono incollate senza collegamento, con il tipo con cui sono state copiate. I loro nomi contano come scritti dall’utente, a meno che un nome incollato non sia vuoto e il nome logico ne derivi uno — vedere [Derivare i nomi fisici](./dictionary.md#deriving-physical-names).  
Gli indicatori di [chiave alternativa](./table-related-functions.md#alternate-keys) come `AK1.1` non sono celle, quindi non vengono copiati né incollati, anche quando sono mostrati.

È possibile incollare dall’editor in Excel e da Excel di nuovo nell’editor.  
I valori delle celle vengono copiati all’esterno esattamente come sono stati digitati, quindi un valore come `<label>` o `a &amp; b` arriva invariato in un foglio di calcolo o in un documento.  
Le colonne del foglio di calcolo vengono associate alle celle visibili in base alla posizione, non al nome, quindi le colonne del foglio devono seguirne l’ordine.  
Per le colonne seguenti, ciascuno di questi valori viene letto come vero (senza distinzione tra maiuscole e minuscole):

- Incremento automatico: `TRUE`, `1`, `YES`, `Y`
- Univoco: `TRUE`, `1`, `YES`, `Y`
- Non null: `TRUE`, `1`, `YES`, `Y`, `NOT NULL`

In uscita, l’editor scrive `TRUE` o `FALSE` per Incremento automatico e Univoco, e `NOT NULL` o `NULL` per Non null.  
Univoco e Incremento automatico sono nascosti per impostazione predefinita, quindi `TRUE` e `FALSE` vengono scritti e letti solo quando quelle celle sono mostrate.

![Quattro colonne incollate in un foglio di calcolo, con i flag scritti come TRUE/FALSE e NOT NULL/NULL](/img/demo-copy-column-to-sheet.webp)

![Tre righe di un foglio di calcolo incollate in una tabella come colonne, con YES, 1 e NOT NULL letti come vero](/img/demo-copy-sheet-column.webp)

La destinazione di un’operazione di incolla dipende dal focus:

- Con l’intestazione di una tabella selezionata, le righe incollate vengono aggiunte come nuove colonne a ogni tabella selezionata.
- Con il focus su una cella di colonna, le righe selezionate di quella tabella, e poi le righe sotto l’ultima di esse, vengono sovrascritte in ordine, tante quante le righe incollate. Le righe che si trovano tra selezioni separate vengono saltate. Una riga sovrascritta riceve i valori incollati nelle sue celle visibili e mantiene quelle nascoste, e le righe in eccesso vengono aggiunte come nuove colonne. A ogni altra tabella selezionata le righe incollate vengono aggiunte come nuove colonne.

![Due colonne copiate e incollate contemporaneamente in due tabelle selezionate](/img/demo-copy-column-multi.webp)

Una riga incollata scrive i nomi logici e i domini in questo modo:

- Un nome logico, da una cella `Logical Name` o dalla cella del nome nella vista `Logical Names`, conta come digitato per intero. Finché il nome della colonna è vuoto o ancora derivato, i [dizionari](./dictionary.md#deriving-physical-names) ne derivano il nome fisico e collegano il dominio assegnato dal suo termine, a meno che la cella Dominio della riga stessa non ne colleghi uno. Un nome incollato dalla stessa riga viene mantenuto e conta come scritto dall’utente.
- Una cella Dominio, o la cella del tipo nella vista `Logical Names` mentre View Option → `Domain` è disattivato, collega il dominio indicato dal suo testo, se il diagramma ne elenca uno. Qualsiasi altro testo, o una cella vuota, non collega alcun dominio e scollega la colonna, anche da un dominio del tipo incollato. Un testo nella cella del tipo che non indica alcun dominio viene letto come un tipo di dati. Le righe copiate nell’editor collegano invece il dominio con cui sono state copiate, e solo finché questo diagramma lo elenca con il tipo copiato, come fanno le nuove colonne.
- Un dominio collegato assegna alla colonna il suo tipo di dati, a meno che la riga non incolli un tipo proprio. In tal caso un dominio di un altro tipo non viene collegato, e la colonna assume il tipo incollato.
- In una riga senza cella Dominio, un tipo incollato scollega la colonna da un dominio di un altro tipo, come fa la sua digitazione.
- Nessuna operazione di incolla propaga un tipo secondo la [Sincronizzazione tipo di dati nelle relazioni](./settings.md#relationship-datatype-sync).

## Copiare e incollare tabelle e memo {#copyingpasting-tables-and-memos}

Quando non è selezionata alcuna colonna all’interno di una tabella con il focus, gli stessi tasti di scelta rapida copiano invece le tabelle e i memo selezionati — vedere [Funzioni relative alle tabelle](./table-related-functions.md).

## Chiave primaria di una colonna {#column-primary-key}

Attiva o disattiva la chiave primaria sulla colonna con il focus, ovvero la colonna a cui appartiene la cella con il focus.  
Quando la colonna con il focus è una di due o più colonne selezionate, il comando si applica a tutte le colonne selezionate: se almeno una di esse non è una chiave, diventano tutte chiavi, e se lo sono già tutte, a tutte viene tolta la chiave. Le colonne fuori dalla selezione restano invariate.  
Usare il menu contestuale della tabella o il tasto di scelta rapida `Alt + K` (Windows/Linux) o `⌥ + K` (Mac). Quando il comando riguarda due o più colonne, la voce del menu è `Primary Key on selected columns` anziché `Primary Key`.  
L’icona della chiave nella riga serve solo da indicazione visiva, quindi facendo clic su di essa non si imposta la chiave.

Per fare di più colonne un’unica chiave composta, [selezionarle](#selecting-multiple-columns), poi premere `Alt + K` (Windows/Linux) o `⌥ + K` (Mac), oppure fare clic con il pulsante destro su una delle righe selezionate e scegliere `Primary Key on selected columns`. Ogni attivazione o disattivazione costituisce un solo passo di annullamento.

![Selezione di due colonne con Shift + Arrow Down, poi impostazione di entrambe come chiave primaria con ⌥ + K e rimozione della chiave da entrambe con una seconda pressione](/img/demo-column-pk.webp)

## Editor di sola lettura {#read-only-editors}

In un editor [`readonly`](../../api/erd-editor-element.md#readonly) nessuna cella si apre per la modifica e nessuna colonna cambia.  
Un clic su una cella non dà il focus a nulla e toglie la selezione lasciata da un salto. `Enter` e un doppio clic non aprono alcun editor e non commutano alcun interruttore, `Tab` è lasciato alla pagina, e i tasti di scelta rapida che aggiungono colonne, selezionano tutto o le eliminano, l’interruttore della chiave primaria e l’incolla non fanno nulla.  
Andare a una colonna dal pannello [Esplora](./explorer.md#going-to-a-row) o dalla [Ricerca rapida](./quick-search.md) dà il focus alla sua cella. I tasti freccia spostano poi il focus da una cella all’altra, con la colonna raggiunta selezionata da sola, poiché lì `Shift` non aggiunge alcuna colonna.  
`Ctrl + C` (Windows/Linux) o `⌘ + C` (Mac) copia comunque la colonna selezionata, o la tabella selezionata da un salto — vedere [Copiare e incollare colonne](#copyingpasting-columns).
