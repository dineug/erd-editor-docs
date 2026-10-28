---
sidebar_position: 6
description: Raccogliere tabelle correlate in un riquadro con nome e colore disegnato dietro di esse; creare i gruppi, assegnare loro un nome e un colore, spostarli, ridimensionarli e rimuoverli, raggiungerli dal pannello Esplora, cambiare le tabelle che contengono, nasconderli e conservarli nel Layout automatico, nello Schema SQL e in DBML.
---

# Gruppi di tabelle

Un gruppo di tabelle è un riquadro con nome e colore disegnato dietro tabelle correlate nell’area di disegno ERD, per mostrare quali tabelle vanno insieme.  
Una tabella fa parte al massimo di un gruppo. I gruppi vengono salvati con il diagramma, insieme al gruppo di cui fa parte ciascuna tabella.

Il riquadro ha una barra del titolo lungo il bordo superiore, che contiene un’icona di gruppo, il nome del gruppo in grassetto e, mentre il puntatore si trova sul gruppo, una `x` che lo rimuove — vedere [Rimuovere un gruppo](#removing-a-group). Un gruppo senza nome mostra `unnamed`, e un nome troppo lungo per la barra viene troncato con `…`.  
Il riquadro contiene sempre le sue tabelle: mantiene la dimensione che gli è stata data, ma si allarga per tenere all’interno ogni tabella con `24px` di spazio attorno e la barra del titolo sopra. Una tabella che cresce allarga il riquadro con sé, e lo stesso fa una tabella rilasciata vicino a un bordo con il centro ancora all’interno del riquadro. Mentre si trascinano tabelle, il riquadro non si allarga né si restringe. L’allargamento non viene salvato: il riquadro torna alla propria dimensione non appena la tabella non ha più bisogno di quello spazio.

I gruppi vengono disegnati dietro tutto il resto dell’area di disegno: tabelle, memo e linee delle relazioni.  
Dove i gruppi si sovrappongono, l’ultimo premuto o aggiunto viene disegnato davanti, e il corpo di un gruppo non copre mai la barra del titolo di un altro gruppo. L’ordine non viene salvato, quindi un diagramma riaperto sovrappone i gruppi nell’ordine in cui sono stati aggiunti.  
I gruppi sono visibili nell’area di disegno ERD, nella minimappa e in un’immagine esportata, e il pannello [Esplora](./explorer.md) li elenca — vedere [Andare a un gruppo](#going-to-a-group). La scheda [Visualizzazione](./visualization.md) non disegna né gruppi né colori dei gruppi in nessuna delle due modalità.

Anche un agente di programmazione può creare e modificare gruppi, e leggere il DDL dei gruppi scelti — vedere [Gruppi di tabelle](../../mcp/tools.md#table-groups) negli strumenti MCP.

![Attivazione del disegno di un gruppo con ⌥ + G, disegno del gruppo sopra orders e payments, assegnazione del nome Billing, rilascio di order_items al suo interno, poi spostamento e ridimensionamento del gruppo](/img/demo-table-group.webp)

## Creare un gruppo {#creating-a-group}

Esistono due modi per creare un gruppo, ciascuno con un tasto di scelta rapida. Nessuno dei due è disponibile in un editor di sola lettura o mentre i gruppi sono [nascosti](#hiding-groups), e in quel caso i relativi tasti di scelta rapida non hanno effetto.  
Come gli altri tasti di scelta rapida dell’area di disegno, funzionano solo nella scheda ERD e vengono sospesi mentre si modifica una cella, un memo o il nome di un gruppo — vedere [Tasti di scelta rapida](./settings.md#shortcuts).

### Disegnare un gruppo {#drawing-a-group}

Fare clic sul pulsante `New Table Group` nella [barra degli strumenti dell’area di disegno](./table-related-functions.md#canvas-toolbar), premere `Alt + G` (Windows/Linux) o `⌥ + G` (Mac), oppure scegliere `New Table Group` dal menu contestuale dell’area di disegno, dove segue `New Table` e `New Memo`, o dalla [Ricerca rapida](./quick-search.md) nella scheda ERD. Poi trascinare un riquadro sull’area di disegno.  
Il pulsante e il tasto di scelta rapida attivano o disattivano il disegno, quindi premere uno dei due mentre è attivo lo termina, comunque sia stato avviato; la voce del menu contestuale e la Ricerca rapida si limitano ad avviarlo. Avviarlo disattiva lo strumento Mano e annulla una relazione in corso di disegno.  
Mentre il disegno è attivo, il cursore è un mirino, e una pressione avvia il riquadro ovunque cada, anche sopra una tabella, invece di selezionare o spostare ciò che si trova sotto. La barra degli strumenti dell’area di disegno contrassegna allora il pulsante `New Table Group`, e non lo strumento Mano né il puntatore.

Al rilascio viene aggiunto un gruppo in quel riquadro, mai più stretto di `160px` né più basso di `100px`, barra del titolo inclusa, per quanto breve sia il trascinamento. Un clic senza trascinamento aggiunge un gruppo largo `480px` e alto `320px` con l’angolo superiore sinistro nel punto del clic.  
Ogni tabella che non fa parte di alcun gruppo e il cui centro si trova all’interno del nuovo riquadro entra nel gruppo. Una tabella che fa già parte di un altro gruppo vi rimane.

Il pulsante centrale del mouse continua a spostare la vista dell’area di disegno e lascia attivo il disegno. Le seguenti azioni terminano il disegno senza aggiungere un gruppo:

- `Escape`, oppure `Alt + G` (Windows/Linux) o `⌥ + G` (Mac), prima della pressione o durante il trascinamento. Prima della pressione lasciano la selezione com’è; la pressione che avvia il riquadro l’ha già annullata.
- Un clic con il pulsante destro, che annulla la selezione. Non si apre alcun menu contestuale.
- Passare allo strumento Mano con `Space` o con la barra degli strumenti dell’area di disegno, fare clic sul puntatore della barra degli strumenti o sul suo pulsante `New Table Group`, oppure avviare una relazione.
- Passare a un’altra scheda, nascondere i gruppi, oppure il passaggio dell’editor alla sola lettura.

### Raggruppare le tabelle selezionate {#grouping-selected-tables}

Selezionare una o più tabelle e premere `T` e poi `G`, oppure scegliere `Group selected tables` dal menu contestuale di una tabella o `Group Selected Tables` dalla Ricerca rapida, che lo elenca mentre è selezionata una tabella.  
Il nuovo gruppo viene disegnato attorno alle tabelle selezionate con `24px` di spazio su ogni lato e la barra del titolo sopra. Ogni tabella selezionata vi entra, lasciando il gruppo di cui faceva parte, e il gruppo lasciato rimane, anche se ora è vuoto. I memo presenti nella selezione vengono ignorati.

La sequenza `T` e poi `G` è composta da due pressioni senza tasto modificatore, `G` entro un secondo da `T`. Senza alcuna tabella selezionata non ha effetto, e in un campo di testo, come il campo Trova del pannello Esplora, digita le due lettere.

![Raggruppamento di categories e products con T e poi G, assegnazione del nome Catalog al gruppo, poi assegnazione del colore violetto dal suo menu, così che entrambe le intestazioni assumano il colore](/img/demo-table-group-selected.webp)

In entrambi i casi, il nuovo gruppo non ha né nome né colore. Viene selezionato da solo, e il suo campo del nome si apre sopra la barra del titolo, così da poter digitare subito un nome — vedere [Assegnare un nome a un gruppo](#naming-a-group).  
Il gruppo e le tabelle che accoglie costituiscono un solo passo di annullamento, e il nome digitato un altro.

## Assegnare un nome a un gruppo {#naming-a-group}

Il nome di un gruppo si modifica in un campo che si apre sopra la sua barra del titolo. Si apre da solo quando viene creato un gruppo, con un doppio clic sulla barra del titolo e dalla voce `Rename` nel menu contestuale del gruppo.  
`Enter`, o un clic altrove, salva il nome. `Escape` chiude il campo senza modificare il nome e lascia il gruppo selezionato, e un secondo `Escape` annulla la selezione.  
Un nome modificato è un solo passo di annullamento; salvare il nome invariato non registra nulla. Un nome vuoto o composto solo da spazi viene mostrato come `unnamed`.  
Mentre il campo è aperto, i tasti di scelta rapida dell’area di disegno vengono sospesi, e i tasti di scelta rapida della Ricerca rapida e di `Toggle Explorer` non hanno effetto, come durante la modifica di una cella di una tabella.

[Trova e sostituisci](./find-and-replace.md#what-it-searches) cerca nei nomi dei gruppi con `Table group names` mentre i gruppi sono visibili, e i suoi pulsanti `Replace` e `Replace All` rinominano i gruppi — vedere [Sostituzione](./find-and-replace.md#replacing). La [Ricerca rapida](./quick-search.md#searching-the-diagram) non cerca nei nomi dei gruppi.

## Assegnare un colore a un gruppo {#coloring-a-group}

Scegliere `Color` nel menu contestuale del gruppo per aprire il selettore colori sul colore del gruppo.  
Come per tabelle e memo, il selettore assegna il colore a ogni tabella, memo e gruppo selezionato, e la voce `Remove color` del menu, o l’opzione `No color` del selettore, toglie il colore a tutti — vedere [Colore di tabelle e memo](./table-related-functions.md#table-and-memo-color-specification). Il colore di un gruppo viene proposto anche nella sezione `Document colors` del selettore.

Un gruppo colorato disegna la barra del titolo e il contorno nel suo colore e il corpo in una tinta tenue dello stesso. Un gruppo senza colore usa i grigi neutri del tema.  
Ogni tabella di un gruppo colorato mostra il colore del gruppo su tutta l’intestazione e mantiene il proprio colore sul bordo sinistro, così che entrambi siano visibili.  
Il testo e i pulsanti di tale intestazione diventano bianchi, oppure neri su un colore chiaro dove il nero si legge molto meglio, così come il nome, l’icona e la `x` sulla barra del titolo del gruppo. Tra i colori predefiniti del selettore, Arancione, Ambra, Giallo e Lime usano il nero, e gli altri il bianco.  
Una tabella mantiene la propria intestazione quando il suo gruppo non ha colore, mentre i gruppi sono nascosti, con lo zoom al `70%` o meno, dove le tabelle si riducono al solo nome, e nella scheda Visualizzazione.

Una modifica del colore viene registrata nella [cronologia delle modifiche](./undo-redo.md#one-gesture-one-step) come avviene per tabelle e memo.

## Selezionare i gruppi {#selecting-groups}

Fare clic sulla barra del titolo di un gruppo per selezionare solo quel gruppo, oppure usare `Ctrl + click` (Windows/Linux) o `⌘ + click` (Mac) per aggiungerlo alla selezione.  
Una pressione sulla barra del titolo di un gruppo già selezionato mantiene l’intera selezione, quindi un trascinamento la sposta poi tutta.  
Una pressione sulla barra del titolo, o un clic con il pulsante destro sul gruppo, porta il gruppo davanti agli altri gruppi e le sue tabelle davanti a ogni altra tabella e memo.

Il corpo, l’area sotto la barra del titolo, si comporta come l’area di disegno per il pulsante sinistro del mouse: trascinarlo sposta la vista, `Ctrl + drag` (Windows/Linux) o `⌘ + drag` (Mac) disegna un riquadro di selezione, e un clic annulla la selezione. Le tabelle, i memo e le linee delle relazioni sopra il corpo rispondono al puntatore come di consueto.

Un riquadro di selezione include un gruppo solo quando ne racchiude per intero il riquadro, quindi un riquadro disegnato all’interno di un gruppo seleziona le tabelle senza il gruppo — vedere [Selezione multipla](./table-related-functions.md#multiple-selection).  
`Ctrl + A` (Windows/Linux) o `⌘ + A` (Mac) non seleziona mai un gruppo.

La voce `Select tables` nel menu contestuale del gruppo sostituisce la selezione con le tabelle del gruppo, escludendo il gruppo stesso, così il comando successivo raggiunge solo le tabelle.  
Usarla prima dei comandi che agiscono solo sulle tabelle, come copiare o [focalizzare le tabelle](./table-related-functions.md#focusing-on-tables), che ignorano un gruppo selezionato.

Il contorno di un gruppo selezionato assume il colore della selezione. In una [sessione collaborativa](../../api/advanced/collaborative-editing.md), un gruppo selezionato da un altro partecipante viene contornato con il colore di quel partecipante.

## Andare a un gruppo {#going-to-a-group}

Il pannello [Esplora](./explorer.md#the-tree) elenca i gruppi nella cartella `Table Groups`, per nome, ciascuno con le sue tabelle sotto. La Ricerca rapida non elenca gruppi.

Scegliere la riga di un gruppo nel pannello Esplora, una corrispondenza di [Trova e sostituisci](./find-and-replace.md#going-to-a-match) nel nome di un gruppo o la riga di un gruppo nell’elenco del [Visualizzatore differenze](./table-related-functions.md#the-change-tree) porta a quel gruppo.  
Porta nella vista il riquadro del gruppo, facendo riferimento alla barra del titolo quando il riquadro è più alto dell’area di disegno — vedere [Dove porta un salto](./table-related-functions.md#where-a-jump-lands). Poi seleziona solo il gruppo e lo porta in primo piano con le sue tabelle, come fa una pressione sulla sua barra del titolo.  
Mentre i gruppi sono [nascosti](#hiding-groups), o una volta rimosso il gruppo, andarvi non ha effetto.  
Nel Visualizzatore differenze ogni lato va al gruppo solo dove il proprio documento lo contiene e lo mostra — vedere [Andare a una modifica](./table-related-functions.md#going-to-a-change).

## Spostare e ridimensionare un gruppo {#moving-and-resizing-a-group}

Trascinare un gruppo per la sua barra del titolo per spostarlo con tutte le sue tabelle.  
Se il gruppo fa parte di una selezione più ampia, l’intera selezione si sposta con esso, e una tabella che è sia selezionata sia nel gruppo si sposta una sola volta.  
Il trascinamento inizia solo dopo che il puntatore si è spostato di un breve tratto, quindi un clic o un doppio clic sulla barra del titolo resta un clic. `Alt + drag` su una barra del titolo sposta il gruppo come un normale trascinamento; un gruppo non viene mai duplicato.  
Lo spostamento, con tutte le tabelle che trasporta, è un solo passo di annullamento.

Trascinare una tabella da sola sposta solo quella tabella, e può spostarla dentro o fuori da un gruppo — vedere [Aggiungere e rimuovere tabelle](#adding-and-removing-tables).

Ogni gruppo ha maniglie di ridimensionamento sui quattro bordi e sui quattro angoli, selezionato o no, come un memo.  
Trascinarne una con il pulsante sinistro del mouse: il riquadro segue il puntatore, e la nuova dimensione viene salvata al rilascio, come un solo passo di annullamento.  
Un gruppo non può essere reso più piccolo di `160px` per `100px`, né più piccolo delle sue tabelle con i loro `24px` di spazio e la barra del titolo. Il bordo si ferma lì, per quanto lontano vada il puntatore.

## Aggiungere e rimuovere tabelle {#adding-and-removing-tables}

Una tabella entra in un gruppo o ne esce in base al punto in cui viene rilasciata.  
Quando si trascinano tabelle e le si rilascia, ogni tabella trascinata che non è trasportata da un gruppo selezionato viene valutata in base al suo centro. Entra nel gruppo più in alto il cui riquadro ne contiene il centro, oppure esce dal proprio gruppo se il centro non si trova nel riquadro di alcun gruppo. Il gruppo più in alto è quello disegnato davanti.  
Un gruppo che il trascinamento lascia al suo posto mantiene il riquadro che aveva all’inizio del trascinamento, quindi una tabella spostata di poco all’interno del proprio gruppo vi rimane, e per uscirne deve essere trascinata finché il suo centro non è fuori da quel riquadro.  
Durante il trascinamento, ogni gruppo in cui il rilascio inserirebbe una tabella viene evidenziato con un contorno.

Quando si rilascia entro circa `200ms` dall’ultimo movimento, il cambio di gruppo fa parte del passo di annullamento del trascinamento, quindi un solo annullamento riporta le tabelle dov’erano e nei gruppi di cui facevano parte. Dopo una pausa più lunga prima del rilascio, il cambio di gruppo è un passo a sé — vedere [Un gesto, un passo](./undo-redo.md#one-gesture-one-step).  
Un clic, o un trascinamento di pochi pixel, non cambia alcun gruppo, e nulla cambia gruppo mentre i gruppi sono nascosti.

Gli altri modi per cambiare le tabelle contenute in un gruppo:

- La voce `Remove from group` nel menu contestuale di una tabella toglie dal proprio gruppo ogni tabella selezionata. Compare mentre una tabella selezionata fa parte di un gruppo, anche mentre i gruppi sono nascosti, ed è un solo passo di annullamento.
- La voce `Group selected tables` sposta le tabelle selezionate in un nuovo gruppo — vedere [Raggruppare le tabelle selezionate](#grouping-selected-tables).
- Rimuovere un gruppo lascia le sue tabelle senza gruppo.

Una tabella incollata o duplicata con `Alt` non fa parte di alcun gruppo, anche quando finisce all’interno del riquadro di un gruppo. Trascinarla in seguito applica la regola del rilascio.

## Rimuovere un gruppo {#removing-a-group}

Rimuovere un gruppo non rimuove mai le sue tabelle: restano dove sono, senza gruppo.

- La `x` alla fine della barra del titolo, visibile mentre il puntatore si trova sul gruppo, rimuove solo quel gruppo.
- La voce `Delete` nel menu contestuale del gruppo rimuove il gruppo. Quando il gruppo è uno di più elementi selezionati, la voce riporta `Delete selected` e rimuove tutto ciò che è selezionato: tabelle, memo e gruppi.
- Con dei gruppi selezionati, `Delete` o `Backspace` rimuove i gruppi selezionati insieme alle tabelle e ai memo selezionati, così come `Ctrl + Backspace` e `Ctrl + Delete` (Windows/Linux) o `⌘ + Backspace` e `⌘ + Delete` (Mac) — vedere [Eliminazione di tabelle e memo](./table-related-functions.md#table-and-memo-deletion).

Ogni rimozione è un solo passo di annullamento, che ripristina il gruppo con le sue tabelle al suo interno.

## Il menu del gruppo {#the-group-menu}

Fare clic con il pulsante destro sulla barra del titolo, sul corpo o sul bordo di un gruppo per aprirne il menu. Su un Mac lo apre anche `Ctrl + click`, così come una pressione prolungata su un touchscreen.  
Il clic con il pulsante destro seleziona prima il gruppo, da solo a meno che non faccia già parte della selezione, quindi `Color` e `Delete selected` raggiungono il resto della selezione solo quando il gruppo ne faceva parte.

- `Select tables`: seleziona solo le tabelle del gruppo — vedere [Selezionare i gruppi](#selecting-groups).
- `Rename`: apre il campo del nome — vedere [Assegnare un nome a un gruppo](#naming-a-group).
- `Color`: apre il selettore colori — vedere [Assegnare un colore a un gruppo](#coloring-a-group).
- `Remove color`: visibile mentre un elemento selezionato ha un colore.
- `Delete`, o `Delete selected` quando il gruppo è uno di più elementi selezionati, con il tasto `Delete` indicato a destra — vedere [Rimuovere un gruppo](#removing-a-group).

Il menu contestuale di una tabella aggiunge `Group selected tables` e `Remove from group` dopo `Color` e `Remove color`, prima della sua voce di eliminazione, e il menu contestuale dell’area di disegno aggiunge `New Table Group`.  
La voce `Group selected tables` mostra a destra i suoi tasti, `T` e poi `G`, e la voce `New Table Group` mostra `Alt + G` (Windows/Linux) o `⌥ + G` (Mac).

## Nascondere i gruppi {#hiding-groups}

La voce `View Option` → `Table Groups` del menu contestuale dell’area di disegno mostra o nasconde tutti i gruppi. È selezionata per impostazione predefinita — vedere [Opzioni di visualizzazione delle tabelle](./table-related-functions.md#table-view-options).  
Se è deselezionata, i riquadri dei gruppi e i colori dei gruppi sulle intestazioni delle tabelle scompaiono dall’area di disegno, dalla minimappa e dalle immagini esportate, e le barre di scorrimento e la minimappa non riservano più spazio ai gruppi. Nulla si sposta o si ridimensiona, e ogni tabella resta nel suo gruppo.  
Nascondere i gruppi li deseleziona, termina il disegno di un `New Table Group` e chiude un campo del nome aperto.

Mentre i gruppi sono nascosti:

- Le voci `New Table Group` e `Group selected tables` non sono disponibili nei menu, né `New Table Group` e `Group Selected Tables` nella Ricerca rapida, e la barra degli strumenti dell’area di disegno omette il suo pulsante `New Table Group`. La voce `Remove from group` resta disponibile.
- `Alt + G` (Windows/Linux) o `⌥ + G` (Mac), così come `T` e poi `G`, non hanno effetto.
- Trascinare tabelle non cambia alcun gruppo, e un riquadro di selezione non include alcun gruppo.
- Il pannello Esplora omette la cartella `Table Groups`, e Trova e sostituisci non trova né sostituisce i nomi dei gruppi, nemmeno con `Table group names` attivo.
- Il [Layout automatico](#auto-layout) mantiene comunque insieme le tabelle di ogni gruppo, la scheda Schema SQL propone ancora i [gruppi tra cui scegliere](#schema-sql-by-group), DBML li scrive ancora, e [Importa e aggiungi](./file-import-export.md#import-and-add) colloca ancora quanto aggiunto sotto i riquadri nascosti.

La scelta viene salvata nel documento e registrata nella [cronologia delle modifiche](./undo-redo.md#what-the-history-records), come gli altri interruttori delle Opzioni di visualizzazione. In un editor di sola lettura resta invece su quello schermo — vedere [Editor di sola lettura](#read-only-editors).

## Layout automatico {#auto-layout}

Tutti i tipi di [Layout automatico](./table-related-functions.md#auto-layout) mantengono insieme le tabelle di ogni gruppo, che i gruppi siano visibili o meno.

- `Force` sposta ogni gruppo con le sue tabelle come un unico riquadro, con le tabelle che mantengono la loro posizione al suo interno, e tiene il riquadro di ogni gruppo ad almeno `100px` dagli altri gruppi e dalle tabelle senza gruppo. L’anteprima mostra ogni gruppo nella posizione di destinazione.
- `Flow`, `Tree - vertical` e `Tree - horizontal` dispongono le tabelle di ogni gruppo all’interno del gruppo e collocano i gruppi in base alle relazioni tra di essi, con le tabelle senza gruppo disposte attorno.

In seguito ogni gruppo che contiene tabelle viene adattato a esse: il suo riquadro diventa il loro ingombro complessivo con `24px` di spazio e la barra del titolo. Un gruppo senza tabelle mantiene posizione e dimensione.  
Le tabelle e i gruppi vengono collocati in un solo passo di annullamento.

Un’importazione DBML adatta ogni gruppo attorno alle sue tabelle allo stesso modo, ovunque siano collocate — vedere [DBML](./file-import-export.md#dbml).

## Schema SQL per gruppo {#schema-sql-by-group}

La scheda [Schema SQL](./schema-sql.md) può scrivere solo le tabelle dei gruppi scelti.  
Mentre il documento contiene un gruppo, visibile o nascosto, il pannello opzioni della scheda mostra una riga `Tables` sotto `This window only`, con una casella di controllo per `All`, una per ogni gruppo e una per `No group`, le tabelle senza gruppo — vedere [Tabelle](./schema-sql.md#tables).  
La scelta appartiene alla finestra dell’editor e non viene salvata nel documento.

## Importazione, esportazione e copia {#import-export-and-copying}

- DBML trasporta i gruppi in entrambe le direzioni. Un’importazione DBML trasforma ogni blocco `TableGroup` in un gruppo — vedere [DBML](./file-import-export.md#dbml) — e la destinazione `DBML` del Generatore di codice scrive un blocco `TableGroup` per ogni gruppo che contiene una tabella — vedere [Generatore di codice](./code-generator.md#language).
- Un file JSON conserva i suoi gruppi. Nessun altro formato li trasporta: le importazioni SQL, GraphQL e AML non ne portano, e Schema SQL e le altre destinazioni del Generatore di codice non ne scrivono.
- [Importa e aggiungi](./file-import-export.md#import-and-add) porta i gruppi di un file come nuovi gruppi che contengono le loro tabelle, e li seleziona insieme alle nuove tabelle mentre i gruppi sono visibili, così trascinare il blocco aggiunto ne porta con sé i gruppi.
- Un’[immagine esportata](./file-import-export.md#image) disegna i gruppi visibili dietro le tabelle, con i colori dei gruppi sulle loro intestazioni.
- Copiare e incollare, o duplicare con `Alt`, non copia mai un gruppo — vedere [Copiare e incollare tabelle e memo](./table-related-functions.md#copyingpasting-tables-and-memos) e [Aggiungere e rimuovere tabelle](#adding-and-removing-tables).

## Editor di sola lettura {#read-only-editors}

In un editor [`readonly`](../../api/erd-editor-element.md#readonly), i gruppi vengono disegnati ed elencati nel pannello Esplora come di consueto e possono essere raggiunti, ma non modificati:

- [Andare a un gruppo](#going-to-a-group) lo seleziona, ed è l’unico modo in cui lì si seleziona un gruppo. Una pressione su una barra del titolo non seleziona nulla e non sposta nulla: se trascinata, sposta la vista dell’area di disegno, e un clic che non sposta cancella la selezione lasciata da un salto.
- Non ci sono maniglie di ridimensionamento né `x`, e un doppio clic sulla barra del titolo non apre alcun campo del nome.
- Un clic con il pulsante destro su un gruppo non apre alcun menu, e il menu della tabella contiene solo `Table Properties`.
- Il menu dell’area di disegno non ha `New Table Group`, e la Ricerca rapida non elenca nessuno dei due comandi di gruppo. Il disegno di un `New Table Group` termina quando l’editor diventa di sola lettura.
- La [barra degli strumenti dell’area di disegno](./table-related-functions.md#canvas-toolbar) conserva solo i suoi controlli di vista, quindi non ha il pulsante `New Table Group`, e `Alt + G` (Windows/Linux) o `⌥ + G` (Mac), così come `T` e poi `G`, non hanno effetto.
- Un trascinamento di tabelle o di un gruppo in corso quando l’editor diventa di sola lettura si ferma dov’è e non modifica alcun gruppo, e il ridimensionamento di un gruppo in corso termina senza cambiare la dimensione.
- `View Option` → `Table Groups` mostra o nasconde i gruppi solo su quello schermo, come ogni Opzione di visualizzazione lì: il documento, i collaboratori e la cronologia di annullamento mantengono la scelta com’era, e quando l’editor torna modificabile viene ripristinata la scelta del documento.
- La scelta `Tables` della scheda Schema SQL funziona ancora.
