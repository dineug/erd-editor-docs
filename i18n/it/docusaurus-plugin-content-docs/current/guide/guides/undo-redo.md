---
sidebar_position: 13
description: Annullare e ripetere le modifiche, cosa registra la cronologia e come percorrerla passo per passo con il Viaggio nel tempo.
---

# Annulla, Ripeti

È possibile tornare a uno stato di modifica precedente o avanzare a uno successivo.  
La cronologia conserva fino a `2048` modifiche.

- Annulla: `Ctrl + Z` (Windows/Linux) o `⌘ + Z` (Mac)
- Ripeti: `Ctrl + Shift + Z` (Windows/Linux) o `⌘ + Shift + Z` (Mac)

La barra degli strumenti offre gli stessi due comandi come pulsanti `Undo` e `Redo`, accanto a `Time Travel`.  
Si attivano solo quando c’è qualcosa da annullare o ripetere. Un editor `readonly` li nasconde tutti e tre, e i tasti di scelta rapida non hanno effetto.

Annulla e Ripeti funzionano solo nella scheda ERD. Non sono disponibili nelle schede Visualizzazione, Schema SQL, Generatore di codice e Impostazioni. Nei campi `Before tables` e `After tables` della scheda Schema SQL, gli stessi tasti annullano e ripetono invece la digitazione nel campo.  
I tasti di scelta rapida restano inattivi anche mentre sono aperti la Ricerca rapida, `Table Properties`, `Diff Viewer`, l’anteprima di `Auto Layout`, la finestra di dialogo [`Export image`](./file-import-export.md#image), [Associa colonne](./relationship-editing.md#map-columns) o il Viaggio nel tempo.  
Continuano a funzionare mentre il focus si trova in qualsiasi punto del pannello [Esplora](./explorer.md#keys-in-the-explorer), albero compreso, e mentre è aperto il [selettore colori](./table-related-functions.md#table-and-memo-color-specification). Anche con il punto di inserimento in uno dei loro campi, come Trova, Sostituisci o `Hex`, annullano e ripetono le modifiche al diagramma anziché quelle al testo del campo.

La cronologia resta in memoria per la sessione corrente. Non viene salvata nel documento, quindi un diagramma riaperto parte con una cronologia vuota.

![Spostamento di una tabella e rimozione di una colonna con ⌥ + Backspace, poi annullamento di entrambe le operazioni con ⌘ + Z e ripetizione con ⌘ + Shift + Z](/img/demo-undo-redo.webp)

## Cosa registra la cronologia {#what-the-history-records}

Vengono registrati:

- Tabelle e memo: aggiunta, rimozione, spostamento, colore, nome e commento, testo e dimensione dei memo.
- Gruppi di tabelle: aggiunta, rimozione, spostamento, ridimensionamento, nome, colore e il gruppo di cui fa parte ciascuna tabella — vedere [Gruppi di tabelle](./table-groups.md).
- Colonne: aggiunta, rimozione, riordinamento e ogni opzione delle colonne.
- Relazioni: aggiunta, rimozione, cambio di tipo, le colonne impostate in [Associa colonne](./relationship-editing.md#map-columns) e ogni scelta da `On Delete` o `On Update` — vedere [ON DELETE e ON UPDATE](./relationship-editing.md#on-delete-and-on-update). Annullare una rimozione ripristina la relazione insieme alle sue azioni ON DELETE e ON UPDATE.
- Gli indici e le loro colonne.
- La posizione della vista, il livello di zoom e gli interruttori di `View Option`.
- Gli script `Before tables` e `After tables` della scheda Schema SQL, un passo per ogni modifica applicata uscendo dal campo — vedere [Script prima e dopo le tabelle](./schema-sql.md#before-and-after-scripts).
- L’importazione di un file e l’aggiunta di un file con [`Import and Add`](./file-import-export.md#import-and-add).

Non vengono registrati:

- Il fornitore di database e il nome del database.
- Il linguaggio del Generatore di codice, `Table Name Case` e `Column Name Case`.
- Il tipo di delimitatore, che sia impostato nella scheda Schema SQL o nella scheda Generatore di codice.
- Le scelte `Statements`, `Header` e `Tables` della scheda Schema SQL, che appartengono alla finestra dell’editor — vedere [Pannello opzioni](./schema-sql.md#options-panel).
- Tutto ciò che si trova nella scheda Impostazioni, comprese le righe [`Lock`](./settings.md#lock).
- Il tema e la lingua di visualizzazione — vedere [Lingua e tema](./language-and-theme.md).
- Quale tabella, memo o gruppo viene disegnato davanti agli altri.
- Il pannello [Esplora](./explorer.md): apertura, chiusura o ridimensionamento, compressione dell’albero, testo e opzioni di ricerca. Vengono però registrate le modifiche apportate da `Replace` e `Replace All`, così come lo scorrimento prodotto da un salto — vedere [Un gesto, un passo](#one-gesture-one-step).
- Lo zoom e lo spostamento della vista nella scheda Visualizzazione in entrambe le modalità, lo spostamento dei nodi del grafo o delle card della modalità Flusso, `Tidy Up`, la visualizzazione righe e la focalizzazione delle tabelle — vedere [La modalità Flusso non modifica mai il documento](./visualization.md#flow-never-edits-the-document).

Le modifiche a questi elementi non possono essere annullate.

Non vengono registrate nemmeno le modifiche provenienti da un altro editor, quindi Annulla agisce solo sulle proprie modifiche. In una [sessione collaborativa](../../api/advanced/collaborative-editing.md) ogni editor annulla le proprie modifiche, e un agente di programmazione che modifica tramite il [server MCP](../../mcp/live-and-headless.md#undo) annulla le proprie con `erd_undo`.

Annullare un `Import`, che sostituisce l’intero diagramma, ripristina il diagramma precedente così com’era nell’editor al momento dell’importazione, con ogni [blocco](./settings.md#lock) attivo o disattivato e ogni valore bloccato com’erano allora.  
Se quel diagramma aveva l’impostazione `Viewport` bloccata, la vista e lo zoom tornano alla vista bloccata, quella con cui il diagramma si apre, anziché al punto in cui ci si trovava. Con l’impostazione `Viewport` sbloccata, tornano al punto in cui ci si trovava al momento dell’importazione. Le altre impostazioni bloccate, come la scheda attiva o il linguaggio del Generatore di codice, restano come appaiono sullo schermo.  
Un nuovo diagramma parte con tutti i blocchi attivi. Sbloccare `Viewport` prima di importare per conservare la propria vista attraverso un annullamento di questo tipo. Sbloccarlo in seguito, o importare un file JSON il cui blocco `Viewport` è disattivato, non cambia il punto a cui porta l’annullamento.

## Un gesto, un passo {#one-gesture-one-step}

Tutte le azioni inviate da un singolo gesto diventano una sola voce della cronologia.  
Se si incollano più tabelle e memo contemporaneamente, o li si duplica con `Alt + drag`, l’operazione si annulla in un solo passo.

Una pressione di `Delete` o `Backspace`, oppure `Delete selected` o `Delete columns` in un menu contestuale, è un solo passo, indipendentemente da quante tabelle, memo, gruppi di tabelle o colonne rimuova.  
Attivare o disattivare la chiave primaria su più colonne selezionate è un solo passo, sia con `Alt + K` (Windows/Linux) o `⌥ + K` (Mac) sia con `Primary Key on selected columns` nel menu contestuale di una tabella.  
Impostare il colore della selezione, o rimuoverlo con `No color` o `Remove color`, è un solo passo, indipendentemente da quante tabelle, memo e gruppi siano selezionati. Scegliere un colore che tutti gli elementi selezionati hanno già non registra alcun passo, e lo stesso vale per `No color` quando nessun elemento selezionato ha un colore.  
`Map` o `Save` in [Associa colonne](./relationship-editing.md#map-columns) è un solo passo, insieme alle colonne di chiave esterna che aggiunge e ai tipi di dati che modifica.  
`Import and Add` è un solo passo, insieme allo scorrimento che porta in vista il blocco aggiunto, quando serve.

Creare un [gruppo di tabelle](./table-groups.md), disegnandolo o raggruppando le tabelle selezionate con `Group selected tables` o `T` e poi `G`, è un solo passo insieme a ogni tabella che include. Rimuovere un gruppo è un solo passo, e annullare la rimozione riporta il gruppo con le sue tabelle al suo interno.  
Trascinare un gruppo per la barra del titolo sposta il gruppo e tutte le sue tabelle in un solo passo. Le tabelle rilasciate dentro o fuori da un gruppo cambiano gruppo nello stesso passo del loro trascinamento se il rilascio avviene entro circa `200ms` dall’ultimo movimento, quindi un solo annullamento le riporta dov’erano e nei gruppi di cui facevano parte. Dopo una pausa più lunga prima del rilascio, il cambio di gruppo è un passo a sé, e il primo annullamento revoca solo quello.  
Il ridimensionamento di un gruppo da un bordo o da un angolo viene registrato una sola volta, al rilascio.  
Applicare il [Layout automatico](./table-related-functions.md#auto-layout) è un solo passo, compresi i gruppi che adatta attorno alle loro tabelle.

Anche `Replace All` in [Trova e sostituisci](./find-and-replace.md#replacing) è un solo passo, indipendentemente da quanti nomi di tabelle, nomi di colonne, nomi di indici, nomi di gruppi di tabelle, commenti e memo modifichi. Quando non modifica nulla, come quando `Preserve Case` riscrive ogni corrispondenza così com’era, non registra alcun passo.  
Un singolo `Replace` è un solo passo, compreso lo scorrimento fino alla corrispondenza successiva quando questa lo richiede. Quando riscrive la propria corrispondenza così com’era, registra solo quello scorrimento, o nulla se lo scorrimento non avviene.  
Andare a una corrispondenza fa scorrere l’area di disegno solo quando la corrispondenza non è già ben visibile — vedere [Dove porta un salto](./table-related-functions.md#where-a-jump-lands). Quello scorrimento viene registrato come qualsiasi altro cambio di posizione della vista, quindi dopo essersi spostati tra le corrispondenze, Annulla revoca prima quegli scorrimenti, uno per passo.  
Gli altri salti che portano all’area di disegno registrano i loro scorrimenti allo stesso modo: la scelta di una riga nel pannello Esplora, di un risultato della Ricerca rapida o del [pulsante della card](./visualization.md#card-buttons) per il collegamento esterno nella modalità Flusso. Un salto che lascia la vista dov’è non registra nulla. Nemmeno la scelta di una riga nell’elenco di `Diff Viewer` registra qualcosa, poiché sposta solo i lati di sola lettura interni al Visualizzatore differenze.

Un trascinamento continuo, uno spostamento della vista dell’area di disegno, uno zoom, un gesto di pinch o un cambio di colore viene accumulato per circa `200ms` e diventa anch’esso una sola voce.  
Un trascinamento che sposta in totale meno di `20px` non registra alcuno spostamento. Viene registrato solo l’eventuale cambio di gruppo che produce.

La digitazione in una cella o in un memo viene registrata per singolo input anziché per gesto: ogni carattere digitato, ogni operazione di incolla e ogni fase di una composizione IME è un passo a sé.  
Il nome di un gruppo di tabelle viene registrato una sola volta, quando lo salvano `Enter` o l’uscita dal campo, quindi il nome digitato in un gruppo appena creato è un passo distinto dalla sua creazione. `Esc`, o un nome lasciato invariato, non registra nulla.

## Viaggio nel tempo {#time-travel}

Si apre dal pulsante `Time Travel` nella barra degli strumenti, accanto ad Annulla e Ripeti.  
Il pulsante non ha effetto finché la sessione non contiene almeno una modifica registrata.

Il Viaggio nel tempo apre una copia separata e di sola lettura del diagramma, alla posizione di scorrimento e al livello di zoom mostrati dall’area di disegno, che il blocco `Viewport` sia attivo o meno.  
Trascinare il dispositivo di scorrimento, o fare clic in un punto qualsiasi della sua guida, per percorrere l’intera cronologia delle modifiche e visualizzare l’anteprima di ogni punto. La posizione più a sinistra del dispositivo di scorrimento è lo stato che precede di un passo la prima modifica registrata, e all’apertura l’indicatore si trova sullo stato corrente.  
L’anteprima è inerte: disegna una minimappa, ma non è possibile spostarne la vista, scorrerla o modificarla, e il documento reale resta intatto finché non si applica.

Premere `Apply` per ripristinare il punto selezionato, oppure `Cancel` o `Esc` per lasciare il documento invariato.

![Apertura del Viaggio nel tempo, trascinamento all’indietro del dispositivo di scorrimento lungo la sessione e applicazione di un punto precedente](/img/demo-time-travel.webp)
