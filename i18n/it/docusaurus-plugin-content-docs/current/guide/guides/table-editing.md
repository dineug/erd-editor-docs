---
sidebar_position: 3
description: Aggiungere, selezionare, riordinare ed eliminare colonne, attivare o disattivare le opzioni delle colonne e copiare o incollare colonne.
---

# Modifica delle tabelle

La modifica delle tabelle offre fondamentalmente un’esperienza di modifica simile a quella di Excel.  
La modalità di modifica si avvia con `Enter` o facendo doppio clic su una cella.  
`Enter` o `Escape` la termina. Il testo digitato viene applicato durante la digitazione, quindi `Escape` mantiene il testo anziché ripristinare quello precedente.  
`Escape` lascia il focus sulla cella e la selezione sulla tabella, e un secondo `Escape` li rimuove entrambi.  
Mentre un metodo di input sta ancora componendo il testo, `Escape` lascia attiva la modalità di modifica.

![Aggiunta di una tabella con Alt + N e compilazione di due colonne](/img/demo-table-edit.webp)

## Aggiungere colonne {#adding-columns}

Si creano con il tasto di scelta rapida `Alt + Enter` (Windows/Linux) o `⌥ + Enter` (Mac).  
Viene aggiunta una colonna a ogni tabella selezionata.

## Tasto Tab {#tab-key}

Premere `Tab` per passare direttamente alla modalità di modifica della cella successiva.  
Premendo `Tab` nell’ultima cella si crea una nuova colonna.  
Usare `Shift + Tab` per spostarsi alla modalità di modifica della cella precedente.  
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

Un clic con il pulsante destro sulla riga di una colonna determina su quali colonne agisce il menu contestuale della tabella, qualunque sia il tasto modificatore premuto.  
Su una riga già selezionata, la selezione resta e il focus passa a quella riga. Su qualsiasi altra riga, viene selezionata solo quella riga. Ciò vale in qualunque punto della riga, compresi l’icona della chiave e un indicatore di [chiave alternativa](./table-related-functions.md#alternate-keys).  
Quindi, per agire su più colonne dal menu, come in [Chiave primaria di una colonna](#column-primary-key) o [Eliminazione delle colonne](#column-deletion), fare clic con il pulsante destro su una delle righe selezionate.  
Su Mac, anche `Ctrl + click` apre il menu, ma conta come un clic semplice, quindi su una cella seleziona solo quella riga prima che il menu si apra.

## Riordinare e spostare le colonne {#rearranging-and-moving-columns}

Funziona durante il `dragging` e consente lo spostamento in altre tabelle.  
Le righe trascinate seguono il puntatore, e le righe attorno al punto di rilascio si spostano di lato per fare spazio.  
Rilasciare appena sotto l’ultima riga di una tabella per spostare la colonna alla fine di quella tabella. Una tabella senza colonne accetta il rilascio in qualsiasi suo punto.

![Trascinamento di una colonna in una nuova posizione, poi in un’altra tabella](/img/demo-column-move.webp)

Supporta lo spostamento di più colonne con `Ctrl + drag` (Windows/Linux) o `⌘ + drag` (Mac).

![Selezione di tre colonne e loro spostamento in un’altra tabella con Ctrl/⌘ + drag](/img/demo-column-multi-move.webp)

## Eliminazione delle colonne {#column-deletion}

Elimina le colonne selezionate della tabella con il focus. Un clic su una cella ne seleziona la colonna, quindi facendo clic su una cella e premendo `Delete` si rimuove quella sola colonna.  
Tasti di scelta rapida:

- `Delete` o `Backspace` (`⌫` su Mac). Rimuovono le colonne selezionate mentre la loro tabella è l’unico elemento selezionato. Quando non è selezionata alcuna colonna (il focus è sul nome o sul commento della tabella), quando è selezionato anche qualcos’altro, oppure con lo zoom al `70%` o meno, dove le tabelle mostrano solo il loro nome, rimuovono invece l’intera selezione — vedere [Eliminazione di tabelle e memo](./table-related-functions.md#table-and-memo-deletion).
- `Alt + Backspace` o `Alt + Delete` (Windows/Linux), `⌥ + ⌫` o `⌥ + Delete` (Mac). Rimuovono le colonne selezionate della tabella con il focus anche quando la selezione comprende altre tabelle o altri memo. Non rimuovono nulla durante la modifica di una cella o con lo zoom al `70%` o meno.

![Eliminazione di una colonna, poi di due colonne selezionate, con Alt + Backspace](/img/demo-column-remove.webp)

Il menu contestuale della tabella fa lo stesso. Con la tabella come unico elemento selezionato, fare clic con il pulsante destro sulla riga di una colonna: l’ultima voce del menu è `Delete column`, oppure `Delete columns` quando la colonna di quella riga è una di due o più colonne selezionate.

Durante la modifica di una cella, `Delete` e `Backspace` cancellano solo il testo. Tenuti premuti fuori dall’editor della cella, rimuovono una sola volta.  
Dopo una rimozione, il focus passa alla colonna rimanente più vicina sopra quella che aveva il focus. Quando sopra non ne resta nessuna, il focus passa al nome della tabella anche se restano colonne sotto, quindi il successivo `Delete` o `Backspace` rimuove la tabella anziché una colonna.  
Le relazioni e gli indici che usano una colonna rimossa vengono rimossi insieme a essa. Non viene chiesta alcuna conferma, e l’intera rimozione costituisce un solo passo di annullamento.

## Copiare e incollare colonne {#copyingpasting-columns}

Funziona come degli Appunti in formato tabella.  
Tasti di scelta rapida: `Ctrl + C` (Windows/Linux) o `⌘ + C` (Mac), `Ctrl + V` (Windows/Linux) o `⌘ + V` (Mac)

Quando si copia verso un foglio di calcolo o si incolla da esso, e quando si incolla nella tabella in cui una cella di colonna ha il focus, vengono usate le celle mostrate dalle tabelle, nell’ordine in cui le mostrano — vedere [Opzioni di visualizzazione delle tabelle](./table-related-functions.md#table-view-options) e [Modificare l’ordine delle colonne](./settings.md#adjusting-column-order).  
Le colonne copiate nell’editor e incollate con l’intestazione di una tabella selezionata, o nelle altre tabelle selezionate, portano con sé tutte le celle delle colonne copiate, comprese quelle nascoste come Univoco e Incremento automatico.  
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

## Copiare e incollare tabelle e memo {#copyingpasting-tables-and-memos}

Quando non è selezionata alcuna colonna all’interno di una tabella con il focus, gli stessi tasti di scelta rapida copiano invece le tabelle e i memo selezionati — vedere [Funzioni relative alle tabelle](./table-related-functions.md).

## Chiave primaria di una colonna {#column-primary-key}

Attiva o disattiva la chiave primaria sulla colonna con il focus, ovvero la colonna a cui appartiene la cella con il focus.  
Quando la colonna con il focus è una di due o più colonne selezionate, il comando si applica a tutte le colonne selezionate: se almeno una di esse non è una chiave, diventano tutte chiavi, e se lo sono già tutte, a tutte viene tolta la chiave. Le colonne fuori dalla selezione restano invariate.  
Usare il menu contestuale della tabella o il tasto di scelta rapida `Alt + K` (Windows/Linux) o `⌥ + K` (Mac). Quando il comando riguarda due o più colonne, la voce del menu è `Primary Key on selected columns` anziché `Primary Key`.  
L’icona della chiave nella riga serve solo da indicazione visiva, quindi facendo clic su di essa non si imposta la chiave.

Per fare di più colonne un’unica chiave composta, [selezionarle](#selecting-multiple-columns), poi premere `Alt + K` (Windows/Linux) o `⌥ + K` (Mac), oppure fare clic con il pulsante destro su una delle righe selezionate e scegliere `Primary Key on selected columns`. Ogni attivazione o disattivazione costituisce un solo passo di annullamento.

![Selezione di due colonne con Shift + Arrow Down, poi impostazione di entrambe come chiave primaria con ⌥ + K e rimozione della chiave da entrambe con una seconda pressione](/img/demo-column-pk.webp)
