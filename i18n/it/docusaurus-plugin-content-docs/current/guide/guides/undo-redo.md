---
sidebar_position: 15
description: Annullare e ripetere le modifiche, cosa registra la cronologia, le cronologie proprie dei fogli della scheda Dizionario e come percorrere passo per passo la cronologia del diagramma con il Viaggio nel tempo.
---

# Annulla, Ripeti

È possibile tornare a uno stato di modifica precedente o avanzare a uno successivo.  
La cronologia conserva fino a `2048` modifiche.

- Annulla: `Ctrl + Z` (Windows/Linux) o `⌘ + Z` (Mac)
- Ripeti: `Ctrl + Shift + Z` (Windows/Linux) o `⌘ + Shift + Z` (Mac)

Nella scheda ERD, la barra degli strumenti offre gli stessi due comandi come pulsanti `Undo` e `Redo`, accanto a `Time Travel`. Nella scheda Dizionario mostra `Undo` e `Redo` senza `Time Travel`, e nessun’altra scheda li mostra.  
Si attivano solo quando c’è qualcosa da annullare o ripetere. Un editor `readonly` li nasconde, e i tasti di scelta rapida non annullano né ripetono nulla.

Annulla e Ripeti agiscono sulla cronologia del diagramma solo nella scheda ERD.  
Lì i tasti di scelta rapida restano inattivi mentre sono aperti la Ricerca rapida, `Table Properties`, `Diff Viewer`, l’anteprima di `Auto Layout`, la finestra di dialogo [`Export image`](./file-import-export.md#image), [Associa colonne](./relationship-editing.md#map-columns) o il Viaggio nel tempo.  
Continuano a funzionare mentre il focus si trova in qualsiasi punto del pannello [Esplora](./explorer.md#keys-in-the-explorer), albero compreso, e mentre è aperto il [selettore colori](./table-related-functions.md#table-and-memo-color-specification). Anche con il punto di inserimento in uno dei loro campi, come Trova, Sostituisci o `Hex`, annullano e ripetono le modifiche al diagramma anziché quelle al testo del campo.

Nelle altre schede:

- Dizionario: annullano e ripetono le modifiche del foglio mostrato, `Domains`, `Words` o `Terms`, dalla cronologia propria di quel foglio, mai da quella del diagramma. Sul foglio `Checks` non hanno effetto — vedere [Fogli della scheda Dizionario](#dictionary-sheets).
- Visualizzazione: nella modalità `Flow`, gli stessi tasti tornano indietro e vanno avanti di un passo tra ciò che la modalità Flusso ha mostrato, come fanno `Previous table` e `Next table`, anche in un editor `readonly`. Lì non annullano né ripetono mai le modifiche al diagramma — vedere [Tabella precedente e tabella successiva](./visualization.md#previous-table-and-next-table). Nella modalità `Graph` non hanno effetto.
- Schema SQL, Generatore di codice e Impostazioni: non sono disponibili. Nei campi `Before tables` e `After tables` della scheda Schema SQL, gli stessi tasti annullano e ripetono invece la digitazione nel campo.

La cronologia resta in memoria per la sessione corrente. Non viene salvata nel documento, quindi un diagramma riaperto parte con una cronologia vuota.

![Spostamento di una tabella e rimozione di una colonna con ⌥ + Backspace, poi annullamento di entrambe le operazioni con ⌘ + Z e ripetizione con ⌘ + Shift + Z](/img/demo-undo-redo.webp)

## Cosa registra la cronologia {#what-the-history-records}

Vengono registrati:

- Tabelle e memo: aggiunta, rimozione, spostamento e colore; nome, nome logico e commento di una tabella; testo e dimensione di un memo.
- Gruppi di tabelle: aggiunta, rimozione, spostamento, ridimensionamento, nome, colore e il gruppo di cui fa parte ciascuna tabella — vedere [Gruppi di tabelle](./table-groups.md).
- Colonne: aggiunta, rimozione, riordinamento, nome logico, il dominio a cui ciascuna è collegata e ogni opzione delle colonne.
- I nomi fisici che i dizionari derivano, e se ciascun nome è personalizzato o gestito dai dizionari: un solo annullamento ripristina insieme un nome e quello stato — vedere [Nomi personalizzati](./dictionary.md#names-of-your-own).
- `Derive Physical Name Again` e `Derive Physical Names Again` — vedere [Deriva di nuovo i nomi fisici](./dictionary.md#derive-physical-names-again).
- Relazioni: aggiunta, rimozione, cambio di tipo, le colonne impostate in [Associa colonne](./relationship-editing.md#map-columns) e ogni scelta da `On Delete` o `On Update` — vedere [ON DELETE e ON UPDATE](./relationship-editing.md#on-delete-and-on-update). Annullare una rimozione ripristina la relazione insieme alle sue azioni ON DELETE e ON UPDATE.
- Gli indici e le loro colonne.
- La posizione della vista, il livello di zoom e gli interruttori di `View Option`.
- Gli script `Before tables` e `After tables` della scheda Schema SQL, un passo per ogni modifica applicata uscendo dal campo — vedere [Script prima e dopo le tabelle](./schema-sql.md#before-and-after-scripts).
- L’importazione di un file e l’aggiunta di un file con [`Import and Add`](./file-import-export.md#import-and-add).

Non vengono registrati:

- Il fornitore di database e il nome del database.
- Il linguaggio del Generatore di codice, `Table Name Case` e `Column Name Case`.
- Il tipo di delimitatore, che sia impostato nella scheda Schema SQL o nella scheda Generatore di codice.
- Le scelte `Statements`, `Header`, `Write logical names into empty comments` e `Tables` della scheda Schema SQL, che appartengono alla finestra dell’editor — vedere [Pannello opzioni](./schema-sql.md#options-panel).
- Tutto ciò che si trova nella scheda Impostazioni, comprese le righe [`Lock`](./settings.md#lock).
- Il cambio della Visualizzazione nomi, da qualsiasi punto, che il suo blocco sia attivo o disattivato — vedere [Cambiare vista](./logical-names.md#switching-the-view).
- Il tema e la lingua di visualizzazione — vedere [Lingua e tema](./language-and-theme.md).
- Quale tabella, memo o gruppo viene disegnato davanti agli altri.
- Il pannello [Esplora](./explorer.md): apertura, chiusura o ridimensionamento, compressione dell’albero, testo e opzioni di ricerca. Vengono però registrate le modifiche apportate da `Replace` e `Replace All`, così come lo scorrimento prodotto da un salto — vedere [Un gesto, un passo](#one-gesture-one-step).
- Lo zoom e lo spostamento della vista nella scheda Visualizzazione in entrambe le modalità, lo spostamento dei nodi del grafo o delle card della modalità Flusso, `Tidy Up`, la visualizzazione righe, la focalizzazione delle tabelle e i passi con `Previous table` e `Next table` — vedere [La modalità Flusso non modifica mai il documento](./visualization.md#flow-never-edits-the-document).
- Il foglio mostrato nella scheda Dizionario, e la ricerca, la selezione, lo scorrimento e le larghezze delle colonne di ciascun foglio — vedere [Aprire la scheda](./dictionary.md#opening-the-tab).

Le modifiche a questi elementi non possono essere annullate.

Le modifiche apportate nella scheda Dizionario possono essere annullate, ma finiscono nella cronologia del proprio foglio anziché in questa, quindi Annulla nella scheda ERD non ne revoca mai nessuna, nemmeno il nuovo `Data Type` di un dominio e i tipi di colonna che modifica — vedere [Fogli della scheda Dizionario](#dictionary-sheets).

Non vengono registrate nemmeno le modifiche provenienti da un altro editor, quindi Annulla agisce solo sulle proprie modifiche. In una [sessione collaborativa](../../api/advanced/collaborative-editing.md) ogni editor annulla le proprie modifiche, e un agente di programmazione che modifica tramite il [server MCP](../../mcp/live-and-headless.md#undo) annulla le proprie con `erd_undo`.

Annullare un `Import`, che sostituisce l’intero diagramma, ripristina il diagramma precedente così com’era nell’editor al momento dell’importazione, con ogni [blocco](./settings.md#lock) attivo o disattivato e ogni valore bloccato com’erano allora.  
Se quel diagramma aveva l’impostazione `Viewport` bloccata, la vista e lo zoom tornano alla vista bloccata, quella con cui il diagramma si apre, anziché al punto in cui ci si trovava. Con l’impostazione `Viewport` sbloccata, tornano al punto in cui ci si trovava al momento dell’importazione. Le altre impostazioni bloccate, come la scheda attiva, il linguaggio del Generatore di codice o la Visualizzazione nomi, restano come appaiono sullo schermo.  
Un nuovo diagramma parte con tutti i blocchi attivi. Sbloccare `Viewport` prima di importare per conservare la propria vista attraverso un annullamento di questo tipo. Sbloccarlo in seguito, o importare un file JSON il cui blocco `Viewport` è disattivato, non cambia il punto a cui porta l’annullamento.

Annullare l’importazione di un file JSON ripristina anche le parole, i termini e i domini che aveva il diagramma precedente. Un’importazione di Schema SQL, GraphQL, DBML o AML mantiene i dizionari, quindi il suo annullamento e la sua ripetizione li lasciano come sono, comprese le modifiche apportate nel frattempo nella scheda Dizionario.

Un annullamento o una ripetizione nella scheda ERD che collega di nuovo una colonna a un dominio, o che ripristina una colonna collegata a un dominio, dà alla colonna il tipo di dati del dominio così com’è ora. Uno che ripristina un altro tipo su una colonna collegata la scollega — vedere [Domini e tipi di dati](./dictionary.md#domains-and-data-types).

## Un gesto, un passo {#one-gesture-one-step}

Tutte le azioni inviate da un singolo gesto diventano una sola voce della cronologia.  
Se si incollano più tabelle e memo contemporaneamente, o li si duplica con `Alt + drag`, l’operazione si annulla in un solo passo.

Una pressione di `Delete` o `Backspace`, oppure `Delete selected` o `Delete columns` in un menu contestuale, è un solo passo, indipendentemente da quante tabelle, memo, gruppi di tabelle o colonne rimuova.  
Attivare o disattivare la chiave primaria su più colonne selezionate è un solo passo, sia con `Alt + K` (Windows/Linux) o `⌥ + K` (Mac) sia con `Primary Key on selected columns` nel menu contestuale di una tabella.  
Impostare il colore della selezione, o rimuoverlo con `No color` o `Remove color`, è un solo passo, indipendentemente da quante tabelle, memo e gruppi siano selezionati. Scegliere un colore che tutti gli elementi selezionati hanno già non registra alcun passo, e lo stesso vale per `No color` quando nessun elemento selezionato ha un colore.  
`Map` o `Save` in [Associa colonne](./relationship-editing.md#map-columns) è un solo passo, insieme alle colonne di chiave esterna che aggiunge e ai tipi di dati che modifica.  
`Import and Add` è un solo passo, insieme allo scorrimento che porta in vista il blocco aggiunto, quando serve.

Scegliere un termine dall’elenco sotto una cella del nome logico è un solo passo: il nome logico, il nome fisico che deriva e, per una colonna, il dominio del termine con il suo tipo di dati — vedere [Completare i nomi dei termini](./logical-names.md#completing-term-names).  
Scegliere un dominio nella cella Dominio di una colonna è un solo passo, insieme al tipo di dati che dà alla colonna e a ciò che [Sincronizzazione tipo di dati nelle relazioni](./settings.md#relationship-datatype-sync) propaga lungo le relazioni. Anche scegliere `None`, che scollega la colonna, è un solo passo — vedere [La cella Dominio](./logical-names.md#the-domain-cell). Digitare in una colonna collegata un tipo di dati diverso da quello del suo dominio scollega la colonna nel passo di quell’input.  
`Derive Physical Name Again` o `Derive Physical Names Again` è un solo passo, indipendentemente da quanti nomi, collegamenti a domini e tipi di dati modifichi. Non registra alcun passo solo quando non modifica nulla. Restituire ai dizionari un nome personalizzato è una modifica, anche quando il nome contiene già ciò che danno i dizionari.

Creare un [gruppo di tabelle](./table-groups.md), disegnandolo o raggruppando le tabelle selezionate con `Group selected tables` o `T` e poi `G`, è un solo passo insieme a ogni tabella che include. Rimuovere un gruppo è un solo passo, e annullare la rimozione riporta il gruppo con le sue tabelle al suo interno.  
Trascinare un gruppo per la barra del titolo sposta il gruppo e tutte le sue tabelle in un solo passo. Le tabelle rilasciate dentro o fuori da un gruppo cambiano gruppo nello stesso passo del loro trascinamento se il rilascio avviene entro circa `200ms` dall’ultimo movimento, quindi un solo annullamento le riporta dov’erano e nei gruppi di cui facevano parte. Dopo una pausa più lunga prima del rilascio, il cambio di gruppo è un passo a sé, e il primo annullamento revoca solo quello.  
Il ridimensionamento di un gruppo da un bordo o da un angolo viene registrato una sola volta, al rilascio.  
Applicare il [Layout automatico](./table-related-functions.md#auto-layout) è un solo passo, compresi i gruppi che adatta attorno alle loro tabelle.

Anche `Replace All` in [Trova e sostituisci](./find-and-replace.md#replacing) è un solo passo, indipendentemente da quanti nomi di tabelle, nomi di colonne, nomi logici, nomi di indici, nomi di gruppi di tabelle, commenti e memo modifichi, compresi i nomi fisici e i collegamenti a domini derivati dai nomi logici. Quando non modifica nulla, come quando `Preserve Case` riscrive ogni corrispondenza così com’era, non registra alcun passo.  
Un singolo `Replace` è un solo passo, compresi ciò che deriva da un nome logico e lo scorrimento fino alla corrispondenza successiva quando questa lo richiede. Quando riscrive la propria corrispondenza così com’era, registra solo quello scorrimento, o nulla se lo scorrimento non avviene.  
Andare a una corrispondenza fa scorrere l’area di disegno solo quando la corrispondenza non è già ben visibile — vedere [Dove porta un salto](./table-related-functions.md#where-a-jump-lands). Quello scorrimento viene registrato come qualsiasi altro cambio di posizione della vista, quindi dopo essersi spostati tra le corrispondenze, Annulla revoca prima quegli scorrimenti, uno per passo.  
Gli altri salti che portano all’area di disegno registrano i loro scorrimenti allo stesso modo: la scelta di una riga nel pannello Esplora, di un risultato della Ricerca rapida, di un controllo del foglio `Checks` della scheda Dizionario che nomina una tabella o una colonna, o del [pulsante della card](./visualization.md#card-buttons) per il collegamento esterno nella modalità Flusso. Un salto che lascia la vista dov’è non registra nulla. Nemmeno la scelta di una riga nell’elenco di `Diff Viewer` registra qualcosa, poiché sposta solo i lati di sola lettura interni al Visualizzatore differenze.

Un trascinamento continuo, uno spostamento della vista dell’area di disegno, uno zoom, un gesto di pinch o un cambio di colore viene accumulato per circa `200ms` e diventa anch’esso una sola voce.  
Un trascinamento che sposta in totale meno di `20px` non registra alcuno spostamento. Viene registrato solo l’eventuale cambio di gruppo che produce.

La digitazione in una cella o in un memo viene registrata per singolo input anziché per gesto: ogni carattere digitato, ogni operazione di incolla e ogni fase di una composizione IME è un passo a sé.  
Una cella del nome logico viene registrata allo stesso modo. Quando il suo editor si chiude su un nome logico diverso da quello con cui si era aperto, il nome fisico che i dizionari ne derivano è un passo in più dopo la digitazione. Il primo annullamento revoca solo quel nome, con il dominio e il tipo di dati portati da un termine, e lascia il nome logico digitato. Quando non viene derivato nulla, non viene registrato altro — vedere [Scrivere un nome logico](./logical-names.md#writing-a-logical-name).  
Il nome di un gruppo di tabelle viene registrato una sola volta, quando lo salvano `Enter` o l’uscita dal campo, quindi il nome digitato in un gruppo appena creato è un passo distinto dalla sua creazione. `Esc`, o un nome lasciato invariato, non registra nulla.

## Fogli della scheda Dizionario {#dictionary-sheets}

I fogli `Domains`, `Words` e `Terms` della scheda Dizionario conservano ciascuno una cronologia propria, separata da quella del diagramma. Ogni modifica apportata nella scheda finisce nella cronologia del foglio di cui scrive le righe. Come quella del diagramma, ogni cronologia conserva fino a `2048` passi e resta in memoria per la sessione.

- Con il focus nella scheda, `Ctrl + Z` (Windows/Linux) o `⌘ + Z` (Mac) annulla l’ultima modifica del foglio mostrato, e `Ctrl + Shift + Z` (Windows/Linux) o `⌘ + Shift + Z` (Mac) ripete l’ultima annullata.
- I pulsanti `Undo` e `Redo` della barra degli strumenti fanno lo stesso, e si attivano solo quando il foglio mostrato ha una modifica da annullare o ripetere. Premerli lascia il focus dov’era, nella griglia o nel campo di ricerca. La scheda non ha `Time Travel`.
- Sul foglio `Checks`, dove non si modifica nulla, i pulsanti restano disattivati, e né loro né i tasti hanno effetto.
- Con la modifica di una cella in corso, o con il punto di inserimento nel campo di ricerca della scheda, i tasti annullano e ripetono invece la digitazione in quel punto.

Le cronologie non si incrociano mai. Annulla nella scheda ERD non revoca mai la modifica di un foglio, e Annulla di un foglio non revoca mai la modifica di un altro foglio né quella del diagramma. Ogni foglio conserva la propria cronologia mentre si cambia foglio o scheda.

Ciascuno di questi è un passo del proprio foglio:

- La modifica di una cella, registrata una sola volta quando viene scritta anziché per ogni carattere digitato, e solo quando cambia il valore — vedere [Modificare le celle](./dictionary.md#editing-cells).
- Un’operazione di incolla, comprese le righe che aggiunge, e la cancellazione delle celle selezionate con `Delete` o `Backspace` — vedere [Copia e incolla](./dictionary.md#copying-and-pasting).
- `Add Row` e ogni inserimento o eliminazione di righe, dalla barra, dal menu della griglia o con i tasti, indipendentemente da quante righe riguardi — vedere [Aggiungere ed eliminare righe](./dictionary.md#adding-and-deleting-rows).
- Il dominio di un termine scelto dal suo elenco, `None` compreso — vedere [Il dominio di un termine](./dictionary.md#a-terms-domain).
- Un ordinamento — vedere [Ordinamento](./dictionary.md#sorting).
- Un file CSV importato con `Import CSV`, indipendentemente da quante righe aggiunga o aggiorni. È un passo del foglio che il file riempie, che la scheda mostra poi, qualunque sia il foglio da cui lo si è importato — vedere [Importazione](./dictionary.md#importing).

Una scrittura che non modifica nulla, come lo stesso file importato di nuovo o l’ordinamento di un foglio già in quell’ordine, non registra alcun passo, e lo stesso vale per una scrittura rifiutata con la notifica `Nothing saved: …`. Quando si assegna un nome a un termine senza `Physical Name`, il nome fisico che le sue parole compongono fa parte del passo di quella modifica.

Il nuovo `Data Type` di un dominio è un passo del foglio `Domains`, insieme ai tipi che dà alle colonne collegate al dominio e a quelli che la Sincronizzazione tipo di dati nelle relazioni raggiunge a partire da esse — vedere [Domini e tipi di dati](./dictionary.md#domains-and-data-types).  
Annullarlo o ripeterlo riassegna il tipo alle colonne collegate al dominio in quel momento, quindi una colonna che nel frattempo è stata collegata a un altro dominio o ha cambiato tipo mantiene il proprio tipo. Una colonna che il passo ha scollegato, come una chiave esterna che la sincronizzazione ha tolto da un proprio dominio, viene collegata di nuovo solo finché è ancora scollegata e ha ancora il tipo che il passo le ha lasciato.

Un editor `readonly` nasconde i pulsanti, e i tasti non annullano né ripetono nulla.  
Nemmeno le modifiche dei collaboratori e degli agenti di programmazione vengono registrate nella cronologia di un foglio.

La cronologia di ogni foglio viene svuotata quando i dizionari vengono sostituiti: da un `Import` di un file JSON, dell’utente o di un collaboratore, dal suo annullamento o dalla sua ripetizione, e dal caricamento di un altro diagramma nell’editor. Un `Import` di Schema SQL, GraphQL, DBML o AML mantiene i dizionari, e con essi la cronologia di ogni foglio, anche attraverso il suo annullamento e la sua ripetizione.

## Viaggio nel tempo {#time-travel}

Si apre dal pulsante `Time Travel` nella barra degli strumenti, accanto ad Annulla e Ripeti nella scheda ERD.  
Il pulsante non ha effetto finché la cronologia del diagramma non contiene almeno una modifica registrata.

Il Viaggio nel tempo apre una copia separata e di sola lettura del diagramma, alla posizione di scorrimento, al livello di zoom e nella [Visualizzazione nomi](./logical-names.md#name-view) mostrati dall’area di disegno, che il blocco `Viewport` o `Name View` sia attivo o meno.  
Percorre solo la cronologia del diagramma, quindi le modifiche dei fogli della scheda Dizionario non sono tra i suoi punti.  
Trascinare il dispositivo di scorrimento, o fare clic in un punto qualsiasi della sua guida, per percorrere l’intera cronologia delle modifiche e visualizzare l’anteprima di ogni punto. La posizione più a sinistra del dispositivo di scorrimento è lo stato che precede di un passo la prima modifica registrata, e all’apertura l’indicatore si trova sullo stato corrente.  
L’anteprima è inerte: disegna una minimappa, ma non è possibile spostarne la vista, scorrerla o modificarla, e il documento reale resta intatto finché non si applica.

Premere `Apply` per ripristinare il punto selezionato, oppure `Cancel` o `Esc` per lasciare il documento invariato.

![Apertura del Viaggio nel tempo, trascinamento all’indietro del dispositivo di scorrimento lungo la sessione e applicazione di un punto precedente](/img/demo-time-travel.webp)
