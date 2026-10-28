---
sidebar_position: 5
description: Selezionare, spostare, copiare, duplicare ed eliminare tabelle e memo, impostare colori e opzioni di visualizzazione, definire indici e chiavi alternative, scegliere un database, muoversi nell’area di disegno infinita e confrontare documenti.
---

# Funzioni relative alle tabelle

Tutto ciò che si fa con tabelle e memo una volta creati — selezionarli, spostarli, copiarli, eliminarli, assegnare loro un colore e impostare ciò che mostra l’area di disegno — più i controlli dell’area di disegno che li circondano.  
Vengono prima i comandi per tabelle e memo; poi le proprietà della tabella, la focalizzazione delle tabelle, gli indici e le chiavi alternative, il Layout automatico e il fornitore di database; poi l’area di disegno stessa: la barra degli strumenti dell’area di disegno, lo zoom, lo spostamento della vista e dove porta un salto, e il Visualizzatore differenze; e infine ciò che di tutto questo conserva un editor di sola lettura.  
I gruppi di tabelle, i riquadri che raccolgono le tabelle, hanno una pagina dedicata — vedere [Gruppi di tabelle](./table-groups.md).  
Lo stesso vale per i nomi logici e la Visualizzazione nomi, che decide i nomi mostrati dalle tabelle — vedere [Nomi logici](./logical-names.md).

## Selezione multipla {#multiple-selection}

Supporta tre metodi:

- `Ctrl + drag` (Windows/Linux) o `⌘ + drag` (Mac)
- `Ctrl + click` (Windows/Linux) o `⌘ + click` (Mac)
- `Ctrl + A` o `Ctrl + Alt + A` (Windows/Linux), `⌘ + A` o `⌘ + ⌥ + A` (Mac)

I memo si selezionano allo stesso modo, ed entrambi i tasti di scelta rapida per selezionare tutto selezionano in una volta tutte le tabelle e tutti i memo. I memo nascosti con View Option → `Memos` restano esclusi dalla selezione completa e da un riquadro di selezione — vedere [Opzioni di visualizzazione delle tabelle](#table-view-options).  
I [gruppi di tabelle](./table-groups.md#selecting-groups) si aggiungono alla selezione con `Ctrl + click` (Windows/Linux) o `⌘ + click` (Mac) sulla loro barra del titolo, ma la selezione completa non ne include mai nessuno.  
`Ctrl + A` cede il passo al punto di inserimento, quindi durante la modifica di una cella seleziona il testo anziché il diagramma.  
Un riquadro di selezione include una tabella o un memo quando ne copre il centro, non quando ne tocca soltanto un bordo. Include un gruppo di tabelle solo quando racchiude l’intero riquadro del gruppo, quindi un riquadro tracciato all’interno di un gruppo seleziona le tabelle senza il gruppo.  
Un clic con il pulsante destro su un elemento già selezionato mantiene l’intera selezione, quindi voci di menu come `Color`, `Group selected tables` e `Delete selected` agiscono su tutta la selezione. Un clic con il pulsante destro su qualsiasi altra tabella, memo o gruppo di tabelle seleziona solo quell’elemento, anche tenendo premuto `Ctrl` o `⌘`, e un clic con il pulsante destro su una relazione o su una zona vuota dell’area di disegno annulla la selezione.  
`Escape` annulla la selezione. Mentre è aperto l’editor di una cella, di un memo o del nome di un gruppo di tabelle, oppure mentre si disegna una relazione o un `New Table Group`, il primo `Escape` termina quell’operazione e un secondo annulla la selezione.  
Un editor di sola lettura non ha nessuno di questi modi di selezionare: lì seleziona solo un salto — vedere [Editor di sola lettura](#read-only-editors).

![Selezione delle tabelle con ⌘ + drag e ⌘ + click, poi di tutte le tabelle e i memo con ⌘ + A](/img/demo-table-select.webp)

In una sessione collaborativa, la selezione, la cella con il focus e il riquadro di selezione di ogni partecipante vengono disegnati sull’area di disegno nel colore di quel partecipante — vedere [Modifica collaborativa](../../api/advanced/collaborative-editing.md).  
La cella con il focus di un partecipante che guarda un’altra vista viene disegnata sulla cella che la vista in uso disegna al suo posto, ad esempio la sua cella del nome sulla cella del nome logico — vedere [Collaboratori](./logical-names.md#collaborators).

## Spostare più tabelle {#moving-multiple-tables}

Trascinando una tabella o un memo che fa già parte della selezione, si sposta insieme l’intera selezione — non serve alcun tasto modificatore.  
Una tabella si trascina dalla sua intestazione o da una qualsiasi delle righe delle sue colonne, quindi un trascinamento che parte dalla riga di una colonna sposta la tabella, non la colonna. Le colonne si spostano invece con la maniglia di trascinamento accanto alla riga con il focus — vedere [Riordinare e spostare le colonne](./table-editing.md#rearranging-and-moving-columns).  
Su una cella dell’intestazione o sulla riga di una colonna, la tabella inizia a spostarsi solo dopo che il puntatore ha percorso un breve tratto, quindi un clic lì porta comunque il focus sulla cella e un doppio clic ne apre comunque l’editor. Un trascinamento non parte mai dal bordo colorato di una tabella, che apre il selettore colori, dai pulsanti `+` e `x` della sua intestazione o dalla `x` della riga di una colonna.  
Trascinando un elemento esterno alla selezione, la selezione si riduce a quell’elemento, che viene spostato da solo. `Ctrl + drag` (Windows/Linux) o `⌘ + drag` (Mac) mantiene la selezione in entrambi i casi.  
Solo il pulsante sinistro del mouse sposta tabelle e memo. Un clic con il pulsante destro sceglie l’elemento su cui agisce il menu contestuale e non sposta nulla, mentre un trascinamento con il pulsante centrale sposta invece la vista dell’area di disegno — vedere [Muoversi nell’area di disegno](#getting-around-the-canvas).

![Il trascinamento di una di due tabelle selezionate le sposta entrambe, e la relazione le segue](/img/demo-table-multiple-move.webp)

Si sposta anche un [gruppo di tabelle](./table-groups.md) selezionato, portando con sé le sue tabelle, e una tabella che è sia selezionata sia in un gruppo in movimento si sposta una sola volta.  
Il punto in cui si rilascia una tabella può spostarla dentro o fuori da un gruppo — vedere [Aggiungere e rimuovere tabelle](./table-groups.md#adding-and-removing-tables).

Tabelle e memo condividono un unico ordine di sovrapposizione. Una pressione su una tabella o un memo, con il pulsante sinistro o con quello destro, porta l’elemento davanti a ogni altra tabella e a ogni altro memo, e una pressione sulla barra del titolo di un gruppo di tabelle, o un clic con il pulsante destro sul suo corpo, porta in primo piano le sue tabelle.  
L’ordine non viene salvato: un diagramma riaperto sovrappone le tabelle nell’ordine in cui le elenca il file, con tutti i memo sopra di esse.

## Copiare e incollare tabelle e memo {#copyingpasting-tables-and-memos}

Copia le tabelle e i memo selezionati e li incolla come nuovi elementi.  
Tasti di scelta rapida: `Ctrl + C` (Windows/Linux) o `⌘ + C` (Mac), `Ctrl + V` (Windows/Linux) o `⌘ + V` (Mac)

Una tabella copiata mantiene nome, nome logico, commento, colonne e colore; un memo copiato mantiene testo, dimensione e colore.  
Ogni colonna copiata mantiene il suo nome logico, e ogni nome di tabella e di colonna mantiene l’informazione se sia stato derivato o meno dai dizionari — vedere [Derivare i nomi fisici](./dictionary.md#deriving-physical-names).  
Una colonna incollata mantiene il suo collegamento a un dominio solo a due condizioni: il diagramma in cui arriva elenca proprio quel dominio, non solo uno con lo stesso nome, e il dominio ha ancora il tipo di dati con cui la colonna è stata copiata. Altrimenti la colonna arriva senza dominio e mantiene il tipo con cui è stata copiata — vedere [Collegare una colonna](./dictionary.md#linking-a-column).  
Vengono copiati anche indici e relazioni: un indice viene copiato per intero sulla tabella copiata, e una relazione viene copiata con il suo tipo e le sue azioni ON DELETE e ON UPDATE quando entrambe le tabelle che collega fanno parte dell’insieme copiato. Una relazione a metà viene scartata anziché lasciata puntare all’originale.  
Le copie incollate diventano la nuova selezione, e incollando di nuovo la stessa copia, la nuova copia viene spostata ogni volta di altri `50px`, così le copie incollate più volte non si impilano l’una sull’altra.  
Una copia non mantiene il suo [gruppo di tabelle](./table-groups.md): la tabella incollata non appartiene ad alcun gruppo, anche quando finisce all’interno del riquadro di un gruppo, e un gruppo selezionato non viene copiato.  
Mentre View Option → `Memos` nasconde i memo, un’operazione di incolla aggiunge comunque i memo che contiene, nascosti e non selezionati, quindi solo le tabelle incollate diventano la selezione.

![Due tabelle correlate copiate e incollate due volte, relazione inclusa](/img/demo-table-copy-paste.webp)

Quando sono selezionate delle colonne all’interno di una tabella con il focus, lo stesso tasto di scelta rapida copia invece quelle colonne — vedere [Modifica delle tabelle](./table-editing.md).

## Duplicare tabelle e memo {#duplicating-tables-and-memos}

Tenere premuto `Alt` e trascinare una tabella o un memo con il pulsante sinistro del mouse.  
Una tabella si afferra dalla sua intestazione o da una qualsiasi riga di colonna, quindi `Alt + drag` sulla riga di una colonna duplica la tabella e lascia invariato l’ordine delle colonne. Tenere premuto `Alt` sulla maniglia di trascinamento della colonna non duplica nulla: la colonna si sposta come con un semplice trascinamento della maniglia — vedere [Riordinare e spostare le colonne](./table-editing.md#rearranging-and-moving-columns).  
Un’anteprima semitrasparente segue il puntatore, e rilasciando il pulsante la copia viene collocata dove si trova l’anteprima.  
Se l’elemento afferrato fa già parte di una selezione, viene duplicata l’intera selezione. Altrimenti la selezione viene sostituita dall’entità sotto il puntatore.  
`Alt + click` senza spostare il mouse colloca la copia `50px` più in basso e a destra, spostandola ulteriormente ogni volta che quel punto è già occupato.

Un duplicato porta con sé le stesse cose di un [elemento incollato](#copyingpasting-tables-and-memos): nomi e nomi logici, commenti, colonne, colori, dimensioni dei memo e gli indici e le relazioni che appartengono interamente a ciò che è stato copiato. Poiché resta nello stesso diagramma, mantiene così com’è il collegamento a un dominio di ogni colonna. Come un elemento incollato, non finisce in alcun gruppo di tabelle.  
`Alt + drag` sulla barra del titolo di un gruppo di tabelle sposta il gruppo come un normale trascinamento; un gruppo non viene mai duplicato.

![Duplicazione di una tabella con Alt + drag, poi Alt + click per un’altra copia in basso a destra](/img/demo-table-duplicate.webp)

## Eliminazione di tabelle e memo {#table-and-memo-deletion}

Elimina le tabelle, i memo e i [gruppi di tabelle](./table-groups.md) selezionati.  
Tasti di scelta rapida:

- `Delete` o `Backspace`. Rimuovono l’intera selezione, tranne quando l’unico elemento selezionato è una tabella con alcune delle sue colonne selezionate e lo zoom è superiore al `70%`: in quel caso rimuovono invece quelle colonne — vedere [Eliminazione delle colonne](./table-editing.md#column-deletion).
- `Ctrl + Backspace` o `Ctrl + Delete` (Windows/Linux), `⌘ + Backspace` o `⌘ + Delete` (Mac). Rimuovono sempre le tabelle, i memo e i gruppi di tabelle selezionati, anche mentre sono selezionate delle colonne.

![Eliminazione di una tabella e delle sue relazioni con il tasto Delete, poi di una tabella e di un memo insieme con Delete selected dal menu del memo](/img/demo-table-remove.webp)

Anche i menu contestuali eliminano. L’ultima voce del menu di una tabella o di un memo è `Delete selected` mentre quella tabella o quel memo è uno di due o più elementi selezionati, e rimuove l’intera selezione. Altrimenti è `Delete` e rimuove solo quella tabella o quel memo. Sopra la riga di una colonna selezionata, il menu della tabella mostra invece `Delete column` o `Delete columns`, come in [Eliminazione delle colonne](./table-editing.md#column-deletion).

Rimuovendo una tabella si rimuovono con essa anche le sue relazioni e i suoi indici. Rimuovendo un gruppo di tabelle se ne mantengono le tabelle, senza gruppo — vedere [Rimuovere un gruppo](./table-groups.md#removing-a-group).  
Non viene chiesta alcuna conferma, ogni rimozione è un passo di annullamento, e in un editor `readonly` non viene rimosso nulla.  
Tenuti premuti, `Delete` e `Backspace` rimuovono una sola volta, e non rimuovono mai una relazione — vedere [Modifica delle relazioni](./relationship-editing.md#deletion). Durante la digitazione in una cella, in un memo o in qualsiasi altro campo di testo, modificano invece il testo.  
In Impostazioni i due tasti sono elencati come `Delete Selection` — vedere [Tasti di scelta rapida](./settings.md#shortcuts).

## Colore di tabelle e memo {#table-and-memo-color-specification}

È possibile assegnare colori per distinguere gli elementi per categoria.  
Una tabella porta il suo colore lungo il bordo sinistro, e un memo lungo la striscia superiore. Per aprire il selettore colori in corrispondenza del puntatore, fare clic con il pulsante sinistro su quel bordo o su quella striscia, oppure scegliere `Color` nel menu contestuale della tabella o del memo. Il colore viene applicato a ogni tabella, memo e gruppo di tabelle selezionato, non solo a quello su cui si è fatto clic.  
A un gruppo di tabelle si assegna un colore da `Color` nel suo menu, e una tabella in un gruppo colorato porta il colore del gruppo sull’intestazione, mantenendo il proprio colore sul bordo sinistro — vedere [Assegnare un colore a un gruppo](./table-groups.md#coloring-a-group).

![Scelta del colore predefinito Blu dalla striscia del colore di un memo per due tabelle selezionate e il memo, poi rimozione del colore con No color](/img/demo-table-color.webp)

Il selettore contiene, dall’alto verso il basso:

- Un’area di saturazione e luminosità, poi il dispositivo di scorrimento della tonalità con un’anteprima del colore accanto. Dove il browser offre un contagocce, un pulsante a forma di pipetta prima del dispositivo di scorrimento, `Pick a color from the screen`, preleva un colore da qualsiasi punto dello schermo.
- I campi `Hex`, `R`, `G` e `B`. `Hex` accetta 3, 4, 6 o 8 cifre esadecimali, con o senza `#`, oppure un `rgb()`, un `hsl()` o un nome di colore CSS incollato. Un valore completo di 6 o 8 cifre viene applicato durante la digitazione, qualsiasi altro valore con `Enter` o all’uscita dal campo. `R`, `G` e `B` accettano numeri interi, interpretano qualsiasi valore superiore a `255` come `255` e vengono applicati con `Enter` o all’uscita dal campo. Il testo che il selettore non riesce a interpretare viene scartato.
- Sedici campioni di colori predefiniti in due righe da otto: Rosso, Arancione, Ambra, Giallo, Lime, Verde, Verde acqua, Ciano, Blu, Indaco, Violetto, Viola, Rosa, Cremisi, Marrone e Grigio. Passando il puntatore su un campione, ne viene mostrato il codice esadecimale.
- `Document colors`: fino a otto colori già usati dalle tabelle, dai memo e dai gruppi di tabelle del documento, a partire dal più usato. La riga compare solo quando ce ne sono.
- `No color`.

Un colore è sempre opaco: il selettore non ha alcun controllo della trasparenza e scarta l’eventuale trasparenza di un valore digitato o incollato.  
Aprire il selettore non modifica nulla, e scegliere il colore che la selezione ha già non aggiunge alcun passo di annullamento.

`No color` toglie il colore a ogni tabella, memo e gruppo di tabelle selezionato in un solo passo di annullamento, e chiude il selettore. `Remove color`, subito sotto `Color` nei menu contestuali di tabella, memo e gruppo di tabelle mentre almeno un elemento selezionato ha un colore, fa lo stesso senza aprire il selettore.

Il selettore prende il focus della tastiera quando si apre, e `Tab` e `Shift + Tab` scorrono ciclicamente i suoi controlli. I tasti freccia spostano l’area e il dispositivo di scorrimento della tonalità di 1, o di 10 con `Shift`, e passano da un campione all’altro, applicandoli man mano.  
Mentre il selettore ha il focus, Annulla e Ripeti, i tasti di scelta rapida dello zoom, `Search` e `Toggle Explorer` raggiungono comunque l’editor, mentre gli altri tasti di scelta rapida dell’editor no: i tasti di scelta rapida di [eliminazione](#table-and-memo-deletion) non rimuovono nulla, e `Delete` e `Backspace` modificano solo il testo dei campi `Hex`, `R`, `G` e `B`.  
`Escape` chiude il selettore, così come una pressione sull’area di disegno al di fuori di esso.  
Una pressione nel pannello [Esplora](./explorer.md) non è una pressione sull’area di disegno, quindi lascia aperto il selettore. Una riga scelta lì cambia la selezione, e la scelta successiva assegna il colore alla nuova selezione.

## Opzioni di visualizzazione delle tabelle {#table-view-options}

Offre le seguenti opzioni di visualizzazione:

- Table Comment
- Column Comment
- DataType
- Domain
- Default
- Not Null
- Unique
- Alternate Key
- Auto Increment
- Relationship
- Referential Actions
- Table Groups
- Memos

`Domain`, `Unique`, `Alternate Key` e `Auto Increment` sono disattivate per impostazione predefinita, le altre sono attive.  
Quali nomi mostrano le tabelle non è un’opzione di visualizzazione: `Name View`, subito dopo `View Option` nel menu contestuale dell’area di disegno, sceglie i nomi fisici, i nomi logici o entrambi — vedere [Cambiare vista](./logical-names.md#switching-the-view).  
`Domain` dà a ogni colonna una cella, collocata secondo l’[ordine delle colonne](./settings.md#adjusting-column-order), con il nome del dominio a cui la colonna è collegata. Una colonna non collegata ad alcun dominio elencato nel foglio `Domains` mostra lì il testo segnaposto `domain`, attenuato. La cella compare in ogni vista. Mentre `Domain` è disattivata, la vista `Logical Names` mostra invece il nome di un dominio collegato nella cella del tipo — vedere [La cella Dominio](./logical-names.md#the-domain-cell).  
`Alternate Key` contrassegna le colonne di ogni chiave alternativa con indicatori come `AK1.1` — vedere [Chiavi alternative](#alternate-keys).  
`Referential Actions` mostra le etichette `D:` e `U:` che le azioni ON DELETE e ON UPDATE di una relazione pongono all’estremità del suo connettore dal lato della tabella figlia — vedere [Leggere un connettore](./relationship-editing.md#reading-a-connector). Disattivandola si nascondono solo quelle etichette e non si sposta alcuna tabella né alcun connettore.  
`Table Groups` mostra i [gruppi di tabelle](./table-groups.md) e i colori dei gruppi sulle intestazioni delle loro tabelle. Disattivandola, i gruppi vengono nascosti nell’area di disegno, nella minimappa e nelle esportazioni di immagini, nessuna tabella viene spostata e ogni tabella resta nel suo gruppo — vedere [Nascondere i gruppi](./table-groups.md#hiding-groups). Inoltre, la cartella `Table Groups` scompare dal pannello [Esplora](./explorer.md#the-tree) e `New Table Group` dalla [barra degli strumenti dell’area di disegno](#canvas-toolbar), e la ricerca del pannello Esplora smette di trovare i nomi dei gruppi.  
`Memos` mostra i memo. Disattivandola, ogni memo viene nascosto nell’area di disegno, nella minimappa e nelle esportazioni di immagini, e nessuna tabella né connettore viene spostato. I memo nascosti non occupano spazio, quindi le barre di scorrimento, la minimappa e la bussola `Go to content` non ne tengono conto.  
Nascondere i memo li deseleziona e chiude l’editor di un memo aperto. Il pannello [Esplora](./explorer.md#the-tree) perde la cartella `Memos`, e né la sua ricerca [Trova e sostituisci](./find-and-replace.md) né il `:` della Ricerca rapida li cercano. Mentre sono nascosti, `New Memo` scompare dal menu contestuale, dalla [barra degli strumenti dell’area di disegno](#canvas-toolbar), dalla Ricerca rapida e dalla [schermata di benvenuto](./editing-start.md#welcome-screen), e `Alt + M` non aggiunge alcun memo. Un’operazione di incolla o [Importa e aggiungi](./file-import-export.md#import-and-add) aggiunge comunque i memo che contiene, nascosti e non selezionati.  
In un editor di sola lettura gli interruttori funzionano comunque, ma solo su quello schermo: non vengono salvati, registrati nella cronologia di annullamento né condivisi, e tornano a quelli del file quando l’editor torna modificabile — vedere [Editor di sola lettura](./settings.md#read-only-editors) in Impostazioni.

![Attivazione e disattivazione delle voci delle Opzioni di visualizzazione mentre le tabelle si ridispongono, contrassegno di un indice univoco composto come AK1.1 e AK1.2 con Alternate Key, poi disattivazione e riattivazione di Memos](/img/demo-view-options.webp)

Le card della modalità `Flow` della scheda Visualizzazione non seguono queste opzioni, `Domain` compresa: usano una propria [visualizzazione righe](./visualization.md#row-display) e disegnano i loro connettori anche con `Relationship` disattivata. Le celle che una card dispone dipendono solo dalla Visualizzazione nomi — vedere [Nomi sulle card](./visualization.md#names-on-the-cards).

## Proprietà tabella {#table-properties}

Apre il pannello delle proprietà di una tabella.  
Per aprirlo, scegliere `Table Properties` nel menu contestuale della tabella, che lo apre per la tabella su cui si è fatto clic con il pulsante destro, oppure selezionare una tabella e premere `Alt + Space`.  
Il pannello si apre al centro dell’area di disegno oscurata. Viene oscurata solo l’area di disegno, quindi un pannello [Esplora](./explorer.md#dialogs-beside-it) aperto resta aperto e utilizzabile accanto al pannello. La sua intestazione contiene il titolo `Table Properties`, le cinque tabelle aperte più di recente sotto forma di chip, con quella corrente evidenziata, e un pulsante di chiusura. Ogni chip nomina la sua tabella come fa la [Visualizzazione nomi](./logical-names.md#beyond-the-canvas). Fare clic su un chip per passare a quella tabella senza riaprire il pannello.  
Sotto l’intestazione ci sono tre schede: `Indexes`, `Schema SQL` e `Code Generator`. Il pannello mantiene la stessa dimensione per tutte e tre, quindi cambiare scheda non lo sposta né lo ridimensiona.  
Si chiude con il pulsante di chiusura, con `Escape` o con un clic sull’area di disegno al di fuori del pannello.  
Scegliere nel pannello Esplora una riga che non sia una cartella, o andare a una corrispondenza della sua ricerca, chiude il pannello Proprietà tabella prima del salto. Lo stesso fa `Ctrl + F` (Windows/Linux) o `⌘ + F` (Mac), che apre la ricerca del pannello Esplora, o porta il punto di inserimento nel suo campo Trova quando il pannello Esplora è già aperto. Qualsiasi altro clic nel pannello Esplora, compresa una riga di cartella, o sul pulsante `Explorer` della barra degli strumenti, lascia aperto il pannello Proprietà tabella. Un `Escape` premuto mentre il focus è nel pannello Esplora restituisce soltanto il focus all’area di disegno, quindi serve un secondo `Escape` per chiudere il pannello Proprietà tabella.

La scheda `Indexes` è descritta in [Indici](#indexes).  
La scheda `Schema SQL` mostra il DDL della tabella per il [database](#databases) selezionato: il suo `CREATE TABLE`, i vincoli separati che alcuni database scrivono per le sue colonne univoche, e i suoi indici. Scrive sempre semplici istruzioni `CREATE`, senza intestazione, senza script prima o dopo e senza nomi logici nei commenti vuoti, qualunque sia l’impostazione della scheda [Schema SQL](./schema-sql.md) della barra degli strumenti — vedere [Nomi logici come commenti](./schema-sql.md#logical-names-as-comments). Non ha un pannello opzioni, e il suo menu contestuale offre solo `Database` e `Bracket`.  
La scheda `Code Generator` genera il codice solo per questa tabella — vedere [Generatore di codice](./code-generator.md).

In un editor di sola lettura il pannello si apre comunque, da `Table Properties`, l’unica voce lì del menu contestuale di una tabella, o con `Alt + Space` sulla tabella selezionata da un salto. Mostra un badge `Read only` accanto al titolo, e la sua scheda `Indexes` non consente modifiche.  
Un pannello aperto nel momento in cui l’editor diventa di sola lettura resta aperto e diventa di sola lettura con esso — vedere [Editor di sola lettura](#read-only-editors).

## Focalizzare le tabelle {#focusing-on-tables}

Apre la scheda Visualizzazione in modalità `Flow`, limitata alle tabelle scelte e a ogni tabella a una relazione di distanza da esse.  
Per avviare la focalizzazione, scegliere `Focus on this table` dal menu contestuale della tabella, oppure selezionare una o più tabelle e premere `Alt + F`.  
Quando la tabella su cui si fa clic con il pulsante destro è una di più tabelle selezionate, la voce diventa `Focus on selected tables` e focalizza l’intera selezione. Un clic con il pulsante destro su una tabella esterna alla selezione focalizza solo quella tabella.  
Il tasto di scelta rapida prende le tabelle selezionate, esclude i memo e non fa nulla quando nessuna tabella è selezionata. Il menu di una tabella in un editor di sola lettura non ha `Focus on this table`, e il tasto di scelta rapida prende lì la tabella selezionata da un salto — vedere [Editor di sola lettura](#read-only-editors).  
Qui un [gruppo di tabelle](./table-groups.md) selezionato non conta, sia per il tasto di scelta rapida sia per la voce di menu: le sue tabelle vengono prese solo quando sono selezionate esse stesse, cosa che fa `Select tables` nel menu del gruppo.  
Cosa mostra la vista limitata, e come tornare all’intero diagramma, è descritto in [Visualizzazione](./visualization.md#focusing-on-tables), e come tornare indietro e andare avanti tra ciò che la modalità Flusso ha mostrato in precedenza in [Tabella precedente e tabella successiva](./visualization.md#previous-table-and-next-table).

## Indici {#indexes}

Gli indici si definiscono nella scheda `Indexes` del pannello delle proprietà della tabella e sono inclusi nello Schema SQL esportato.

Il lato sinistro elenca le chiavi e gli indici della tabella in due gruppi.  
`Keys`, mostrato quando la tabella ha delle chiavi, elenca le chiavi dichiarate dalle sue colonne: `PK_<table name>` sulle colonne contrassegnate come PK, poi `UQ_<table name>_<column name>` per ogni colonna contrassegnata come Univoco, nell’ordine delle colonne. I nomi sono quelli fisici che scrive lo Schema SQL del database selezionato, qualunque sia la Visualizzazione nomi, quindi con `Bracket` impostato su `None` una tabella qualificata con lo schema come `sales.users` elenca `PK_users` con ogni database tranne Databricks e Snowflake — vedere [Nomi di tabella qualificati con lo schema](./schema-sql.md#schema-qualified-table-names). Ciascuna ha l’etichetta `PK` o `UQ` ed è contrassegnata con un lucchetto. Qui sono di sola lettura e cambiano solo con i flag [PK](./table-editing.md#column-primary-key) e [Univoco](./table-editing.md#not-null-unique-auto-increment) delle colonne.  
`Indexes` elenca gli indici della tabella nell’ordine in cui sono stati aggiunti. Ogni indice ha un interruttore `UQ` che lo rende univoco, un campo per il nome e una `x` che lo rimuove. Un indice che è una [chiave alternativa](#alternate-keys) mostra anche il suo numero, ad esempio `AK1`. Per aggiungere un indice, usare `Add Index` in fondo all’elenco.

Il lato destro elenca le colonne della tabella sotto `Columns`, ciascuna con una casella di controllo. Ogni riga mostra le stesse celle della riga della colonna nell’area di disegno, seguendo l’ordine delle colonne, le Opzioni di visualizzazione e la [Visualizzazione nomi](./logical-names.md#beyond-the-canvas). Nulla è modificabile finché non si seleziona un indice a sinistra.  
Selezionare la casella di una colonna per aggiungerla all’indice selezionato, e deselezionarla per rimuoverla. Quando si seleziona una chiave, le caselle delle sue colonne appaiono selezionate, ma restano disabilitate.  
Le colonne dell’indice selezionato sono elencate più in basso sotto `Index order`, ciascuna nominata come la nomina la Visualizzazione nomi, con il nome tra parentesi dopo il nome logico nella vista `Both Names`, ad esempio `Member Number (member_no)`. Trascinarle dalla maniglia di trascinamento per riordinarle, e fare clic sul chip `ASC` o `DESC` di una riga per invertirne l’ordinamento. In una chiave alternativa, ogni riga termina con il suo indicatore `AK<n>.<m>`. L’elenco mostra tre righe alla volta e si può scorrere per vedere le altre.

In un editor di sola lettura, selezionando una chiave o un indice se ne mostrano comunque le colonne, ma non ci sono né `Add Index` né `x`, e nient’altro nella scheda può essere modificato: i nomi non accettano digitazione, ogni casella è disabilitata e le righe di `Index order` non si trascinano né invertono l’ordinamento.

Il pannello [Esplora](./explorer.md#the-tree) elenca gli indici di ogni tabella nella cartella `Indexes` della tabella, e sceglierne uno lì porta alla sua tabella. La sua ricerca trova anche i nomi degli indici, e può rinominarli — vedere [Cosa cerca](./find-and-replace.md#what-it-searches).

![Apertura di Proprietà tabella su orders, dove la scheda Indexes elenca le chiavi PK e UQ sopra gli indici, poi aggiunta di un indice su member_id e ordered_at DESC, che si ritrova nella scheda Schema SQL](/img/demo-table-properties.webp)

## Chiavi alternative {#alternate-keys}

Una chiave alternativa è un indice univoco su due o più colonne: un indice della scheda `Indexes` con l’interruttore `UQ` attivo e almeno due colonne della tabella selezionate.  
Un indice univoco su una sola colonna non dice nulla di più del flag Univoco di quella colonna, quindi non è una chiave alternativa, e non lo sono nemmeno un indice semplice, la chiave primaria o una colonna contrassegnata come Univoco.

Con `Alternate Key` attivata nelle [opzioni di visualizzazione](#table-view-options), il diagramma contrassegna le colonne di ogni chiave alternativa come le scrivono erwin e IDEF1X: `AK1.1`, `AK1.2` e così via. L’opzione è disattivata per impostazione predefinita.

Le chiavi sono numerate in base alla posizione delle loro colonne nella tabella, non in base all’ordine in cui sono stati aggiunti gli indici. La chiave la cui prima colonna nel suo `Index order` si trova più in alto nella tabella è `AK1`. In caso di parità decide la colonna successiva di ciascuna chiave, e una chiave che costituisce la parte iniziale di una più lunga viene prima di essa.  
Spostare una colonna all’interno della tabella, o riordinare l’`Index order` di una chiave, può rinumerare le chiavi. Annullare la rimozione di una chiave le restituisce il suo numero, e ogni collaboratore vede gli stessi numeri.

Ogni colonna di una chiave è contrassegnata con `AK<n>.<m>`, dove `n` è il numero della chiave e `m` la posizione della colonna nell’`Index order` della chiave. Una colonna presente in più chiavi riporta tutti gli indicatori, uniti da una virgola.  
Ad esempio, in una tabella con le colonne `a`, `b` e `c`, gli indici univoci su (`c`, `a`) e (`b`, `a`) diventano `AK1` = (`b`, `a`) e `AK2` = (`c`, `a`), perché `b` si trova sopra `c`. Quindi `b` riporta `AK1.1`, `c` riporta `AK2.1` e `a` riporta `AK1.2,AK2.2`.

L’indicatore viene disegnato per ultimo nella riga, dopo la cella che l’[ordine delle colonne](./settings.md#adjusting-column-order) mette per ultima. Non è una cella, quindi non riceve mai il focus e non viene mai modificato né copiato — vedere [Modifica delle tabelle](./table-editing.md).  
Anche una colonna chiave primaria o chiave esterna può riportare un indicatore AK, poiché l’indicatore non sostituisce nulla: l’icona della chiave all’inizio della riga mostra ancora PK e FK, e la cella Univoco mantiene il proprio `UQ`.  
Una tabella che ha una chiave alternativa riserva spazio dopo l’ultima cella di ogni riga per il suo indicatore più lungo; una tabella senza chiavi alternative mantiene la sua larghezza.  
Gli indicatori compaiono nell’area di disegno ERD, dove una tabella ridotta al solo nome al `70%` o meno non ne mostra nessuno, e in un’[esportazione di immagine](./file-import-export.md#image), che disegna ogni tabella per intero qualunque sia lo zoom. Li mostra anche l’[anteprima al passaggio del puntatore](./visualization.md#hover-preview) della scheda Visualizzazione in modalità `Graph`; le card di `Flow` non li mostrano mai.

La scheda `Indexes` mostra i numeri indipendentemente dal fatto che l’opzione sia attiva — vedere [Indici](#indexes).

## Layout automatico {#auto-layout}

Dispone automaticamente ogni tabella sull’area di disegno.  
Aprire `Auto Layout` dal menu contestuale dell’area di disegno o dalla Ricerca rapida, e scegliere uno dei quattro layout:

| Layout | Cosa disegna |
| --- | --- |
| `Force` | Una simulazione: le relazioni avvicinano le tabelle, le tabelle vicine si respingono a vicenda e le tabelle sovrapposte si separano. |
| `Flow` | Da sinistra a destra lungo le relazioni, assegnando a ogni connettore un proprio punto di contatto su una tabella. Cerca di limitare gli incroci, ma può lasciarne alcuni che un altro layout eviterebbe. |
| `Tree - vertical` | A livelli verso il basso: una tabella padre si trova sopra le tabelle che hanno una chiave esterna verso di essa. |
| `Tree - horizontal` | La stessa disposizione a livelli, da sinistra a destra. |

`Force` apre un’anteprima mentre il layout si assesta, con `Apply` e `Cancel` sull’avviso che mostra.  
L’anteprima è inquadrata sul diagramma com’era all’avvio del layout, quindi le tabelle possono uscire dall’inquadratura mentre il layout si assesta. Viene disegnata al `70%` o meno, quindi le sue tabelle appaiono ridotte al nome e al bordo colorato. Si apre nella vista che si sta guardando, qualunque sia la vista conservata dal file — vedere [Oltre l’area di disegno](./logical-names.md#beyond-the-canvas).  
`Apply` mantiene le posizioni così come sono in quel momento, e il layout viene applicato da solo quando si stabilizza. `Cancel` o `Escape` lascia il diagramma com’era.

Gli altri tre vengono calcolati in un’unica passata, fuori dal thread principale, quindi non c’è nulla da osservare: un avviso compare mentre il layout viene calcolato, e la disposizione finale viene centrata sull’area già occupata dal diagramma. `Cancel` o `Escape` scarta un layout che non si vuole più attendere, e un host che non esegue alcun worker condiviso termina con `Could not place tables` — vedere [Web Worker](../../api/installation.md#web-workers). Un layout che non restituisce un risultato entro 60 secondi termina allo stesso modo.

Qualunque layout si scelga, vengono spostati tabelle e gruppi di tabelle, mentre i memo restano dove sono. Le tabelle vengono collocate con le larghezze che assumono nella vista che si sta guardando. Una relazione da una tabella verso sé stessa viene ignorata, e più relazioni tra le stesse due tabelle contano una sola volta.  
Ogni layout mantiene unite le tabelle di ciascun gruppo, che i gruppi siano visibili o meno, e adatta attorno a esse ogni gruppo che contiene tabelle — vedere [Gruppi di tabelle](./table-groups.md#auto-layout).  
Il risultato viene registrato come un’unica voce della cronologia, quindi un solo annullamento riporta ogni tabella e ogni gruppo dov’era.  
Un editor di sola lettura non offre `Auto Layout`. Uno ancora in corso quando l’editor diventa di sola lettura termina lì: l’anteprima `Force` si chiude con il suo avviso e non conserva nessuna delle sue posizioni, e un layout ancora in calcolo viene scartato con il suo avviso, quindi nessuna tabella si sposta, né allora né quando l’editor torna modificabile.

![Riordino di un mucchio di tabelle con il layout Flow del Layout automatico dal menu contestuale dell’area di disegno, che le allinea da sinistra a destra lungo le relazioni](/img/demo-automatic-table-placement.webp)

## Database {#databases}

I database supportati includono:

- Databricks
- MSSQL
- MariaDB
- MySQL
- Oracle
- PostgreSQL
- Snowflake
- SQLite

Sceglierne uno da `Database` nel menu contestuale dell’area di disegno, nel pannello opzioni o nel menu contestuale delle schede Schema SQL e Generatore di codice, oppure nella Ricerca rapida. In tutti i casi si modifica la stessa impostazione. Il menu dell’area di disegno di un editor di sola lettura non ha `Database`, e una scelta negli altri modifica solo quello schermo — vedere [Editor di sola lettura](#read-only-editors).

Queste opzioni determinano la sintassi Schema SQL per l’esportazione, il completamento automatico del tipo di dati e i tipi in cui si risolvono il codice generato e gli schemi importati.  
Decidono quali scelte di `Statements` e `Header` può scrivere la scheda [Schema SQL](./schema-sql.md#options-panel). Una scelta che il database non supporta resta nel pannello opzioni, attenuata, e il codice SQL ripiega su quella più vicina disponibile.  
Decidono anche quali azioni ON DELETE e ON UPDATE scrivono Schema SQL e le destinazioni ORM del Generatore di codice, e quali i menu delle relazioni contrassegnano con `not in <database>` — vedere [ON DELETE e ON UPDATE](./relationship-editing.md#on-delete-and-on-update) e [Generatore di codice](./code-generator.md#database).  
L’importazione di Schema SQL mantiene il tipo di dati di una colonna, elenco degli argomenti incluso, che l’editor lo elenchi o meno, come `TIMESTAMP WITH TIME ZONE`, `public.mood` o `integer[]` — vedere [Tipi di dati](./file-import-export.md#data-types). Il completamento automatico del tipo di dati suggerisce solo i tipi elencati dal database selezionato.

![Passaggio al database PostgreSQL, poi scelta di un tipo PostgreSQL nel completamento automatico](/img/demo-database.webp)

![Completamento automatico approssimativo del tipo di dati, percorso con i tasti freccia e confermato con Right, Tab o Enter](/img/demo-data-type-autocomplete.webp)

## Barra degli strumenti dell’area di disegno {#canvas-toolbar}

Una piccola barra degli strumenti fluttua al centro del bordo inferiore dell’area di disegno e contiene, da sinistra a destra, gli strumenti che agiscono sull’area di disegno stessa e i comandi che vi aggiungono elementi:

- La mano e il puntatore. Il puntatore è quello predefinito; la mano trasforma ogni trascinamento in uno spostamento della vista, sia sopra le tabelle sia nelle zone vuote. `Space` alterna i due strumenti. Mentre è pronto il disegno di un [`New Table Group`](./table-groups.md#drawing-a-group), al posto di entrambi risulta selezionato il pulsante `New Table Group`, e fare clic su uno dei due, premere `Space` o scegliere una notazione di relazione termina il disegno senza aggiungere alcun gruppo.
- `New Table`, `New Memo` e `New Table Group`. `New Table` aggiunge una tabella come fa `Alt + N`, e `New Memo` aggiunge un memo come fa `Alt + M`. `New Table Group` prepara il [disegno del gruppo](./table-groups.md#drawing-a-group) come fa `Alt + G` e disattiva la mano; un secondo clic, come un secondo `Alt + G`, termina il disegno senza aggiungere alcun gruppo. `New Memo` non compare mentre View Option → `Memos` nasconde i memo, e `New Table Group` mentre View Option → `Table Groups` nasconde i gruppi.
- Lo zoom: `Zoom out`, lo zoom corrente in percentuale e `Zoom in`. I due pulsanti modificano lo zoom a scatti come i tasti di scelta rapida dello zoom, e un clic sulla percentuale lo riporta al `100%`.
- Le quattro notazioni di relazione, le stesse quattro con cui si inizia una relazione — vedere [Iniziare a modificare](./editing-start.md). Sceglierne una riporta al puntatore, poiché una relazione si disegna facendo clic su due tabelle.
- `Name View`, un pulsante con una freccia verso il basso che indica la vista attiva: `Physical Names`, `Logical Names` o `Both Names`. Mantiene la stessa larghezza qualunque vista indichi, quindi un cambio di vista non sposta mai la barra degli strumenti. Un clic apre sopra la barra degli strumenti un elenco delle tre viste, con un segno di spunta sulla vista attiva. Sceglierne una passa a quella vista e chiude l’elenco; un secondo clic sul pulsante, una pressione in qualsiasi altro punto o `Escape` chiude l’elenco senza cambiare vista. Cosa disegna ciascuna vista è descritto in [Visualizzazione nomi](./logical-names.md#name-view), e se un cambio viene salvato in [Cambiare vista](./logical-names.md#switching-the-view).
- La modalità Zen, `Alt + Z`, che nasconde tutto tranne l’area di disegno e questa barra degli strumenti. Premendo di nuovo `Alt + Z`, o il pulsante, ricompare il resto. Un pannello Esplora aperto viene nascosto con il resto, senza essere chiuso, e ricompare insieme a esso. Può comunque essere aperto durante la modalità Zen — vedere [Quando si nasconde](./explorer.md#when-it-stands-aside).
- La bussola `Go to content`, che si aggiunge alla fine della barra degli strumenti solo quando sullo schermo non ci sono tabelle, memo visibili né gruppi di tabelle visibili — vedere [Muoversi nell’area di disegno](#getting-around-the-canvas).

Ogni pulsante con un tasto di scelta rapida lo indica nel suo tooltip, ad esempio `New Table (Alt + N)` (Windows/Linux) o `New Table (⌥ + N)` (Mac).  
La barra degli strumenti si nasconde mentre è aperta l’anteprima del Layout automatico `Force`, Proprietà tabella, il Viaggio nel tempo o il Visualizzatore differenze, e ricompare dopo la chiusura.  
La barra degli strumenti di un editor di sola lettura conserva lo zoom, `Name View`, la modalità Zen e la bussola `Go to content`. Non ha né la mano e il puntatore, né `New Table`, `New Memo` o `New Table Group`, né le notazioni, e li riottiene quando l’editor torna modificabile.

![Aggiunta di una tabella e di un memo dalla barra degli strumenti, attivazione e annullamento di New Table Group, spostamento della vista con la mano, modifica dello zoom a scatti e attivazione e disattivazione della modalità Zen con ⌥ + Z](/img/demo-canvas-toolbar.webp)

## Zoom avanti/indietro {#zoom-inout}

Esegue lo zoom con `Ctrl + Wheel` (Windows/Linux) o `⌘ + Wheel` (Mac). La sola rotellina sposta la vista dell’area di disegno.  
Anche un gesto di pinch sul trackpad esegue lo zoom, centrato sul punto del gesto, così come due dita su un touchscreen, che spostano anche la vista mentre si muovono.  
Tasti di scelta rapida: `Ctrl + Plus` (Windows/Linux) o `⌘ + Plus` (Mac), `Ctrl + Minus` (Windows/Linux) o `⌘ + Minus` (Mac)  
`Ctrl + 0` (Windows/Linux) o `⌘ + 0` (Mac) torna direttamente al `100%`, mantenendo fermo il centro dello schermo.

I pulsanti `Zoom out` e `Zoom in` della [barra degli strumenti dell’area di disegno](#canvas-toolbar) modificano lo zoom a scatti come i tasti di scelta rapida `Minus` e `Plus`: ogni pressione lo sposta di 4 punti percentuali, mantenendo fermo il centro dello schermo. La percentuale tra i due mostra lo zoom corrente, e un clic su di essa torna direttamente al `100%` come `Ctrl + 0` (Windows/Linux) o `⌘ + 0` (Mac).

Lo zoom va dal `10%` al `150%`.  
A `70%` o meno, le tabelle si riducono al nome e al bordo colorato, e la modifica delle celle, i tasti di scelta rapida delle celle e il copia e incolla smettono di funzionare finché non si esegue di nuovo lo zoom avanti. Il nome mostrato da una tabella ridotta segue la Visualizzazione nomi — vedere [Visualizzazione nomi](./logical-names.md#name-view).

Gli stessi tre tasti di scelta rapida eseguono lo zoom anche nella scheda Visualizzazione, sia in modalità `Graph` sia in modalità `Flow`, ciascuna entro il proprio intervallo — vedere [Visualizzazione](./visualization.md#toolbar).

![Zoom indietro con ⌘ + Wheel finché le tabelle non si riducono al nome, poi ritorno a scatti con ⌘ + Plus, ⌘ + Minus e ⌘ + 0](/img/demo-zoom.webp)

## Muoversi nell’area di disegno {#getting-around-the-canvas}

L’area di disegno non ha bordi né dimensioni da impostare. Tabelle e memo restano ovunque li si collochi, e tutto ciò che segue descrive il diagramma anziché una pagina fissa.

Trascinare una zona vuota dell’area di disegno per spostare la vista, oppure passare allo strumento Mano con `Space` e trascinare in qualsiasi punto, anche sopra una tabella. Anche la rotellina sposta la vista, e `Shift + Wheel` la sposta lateralmente.  
Il corpo di un [gruppo di tabelle](./table-groups.md#selecting-groups), la zona sotto la sua barra del titolo, conta come zona vuota dell’area di disegno per il pulsante sinistro: trascinarlo sposta la vista, `Ctrl + drag` (Windows/Linux) o `⌘ + drag` (Mac) disegna un riquadro di selezione e un clic annulla la selezione.  
Lo spostamento della vista non ha limiti: la rotellina, un trascinamento e lo strumento Mano portano la vista fin dove la si sposta, oltre le tabelle su ogni lato.

Trascinare con il pulsante centrale del mouse (premendo la rotellina) per spostare la vista da qualsiasi punto dell’area di disegno, sia con il puntatore sia con la mano. Funziona anche quando la pressione cade su una tabella, un memo, una cella, un’icona o una relazione.  
Un trascinamento con il pulsante centrale non seleziona, non sposta e non fa clic su nulla, e mantiene la selezione. Chiude un menu contestuale aperto e il selettore colori, e lo scorrimento e l’incolla con il clic centrale propri del browser non si avviano.  
Una pressione con il pulsante centrale sulle barre di scorrimento, sulla minimappa, sulla barra degli strumenti dell’area di disegno o sull’editor aperto di una cella o di un memo non sposta la vista.

La minimappa nell’angolo in alto a destra rappresenta il diagramma con lo spazio di uno schermo su ogni lato, cioè la portata delle barre di scorrimento, allineata verso l’esterno a una griglia a maglie larghe, quindi più si esegue lo zoom indietro, più il diagramma vi appare piccolo. Fare clic su di essa per spostare la vista in quel punto, oppure trascinare il rettangolo dell’area visibile per spostare la vista. Man mano che si esegue lo zoom indietro, il rettangolo dell’area visibile si ingrandisce per coprire una parte maggiore della mappa.  
Disegna ogni tabella nel colore della tabella, e ogni gruppo di tabelle visibile come un riquadro nel colore del gruppo dietro le sue tabelle.  
Le barre di scorrimento lungo i bordi destro e inferiore descrivono la stessa corsa, che va dal diagramma appena fuori da un lato dello schermo fino ad appena fuori dall’altro, quindi è più lunga del diagramma disegnato di almeno uno schermo, e ancora più lunga quando la vista si trova oltre il diagramma. Fuori dalla modalità Zen, entrambe le barre di scorrimento compaiono ogni volta che il documento contiene una tabella, un memo visibile o un gruppo di tabelle visibile, anche quando tutto entra nello schermo. Un documento che non contiene nessuno di questi elementi, come uno i cui unici memo sono nascosti con View Option → `Memos`, non mostra né le barre né la minimappa.  
Trascinare la casella di scorrimento di una barra di scorrimento o il rettangolo dell’area visibile della minimappa è l’unico spostamento della vista che si ferma: non va oltre le tabelle appena fuori dallo schermo, o oltre il punto in cui è iniziato il trascinamento, se questo era più esterno.

Se dopo uno spostamento della vista sullo schermo non rimangono tabelle, memo visibili né gruppi di tabelle visibili, alla fine della [barra degli strumenti dell’area di disegno](#canvas-toolbar) si aggiunge una bussola `Go to content`, con una freccia che punta all’elemento più vicino e la sua distanza. Fare clic su di essa per centrare quell’elemento senza modificare lo zoom.

![Spostamento della vista trascinando una zona vuota dell’area di disegno, con la rotellina, con un trascinamento del pulsante centrale sopra una tabella e dalla minimappa, poi Shift + wheel oltre il contenuto e ritorno indietro seguendo la bussola Go to content](/img/demo-canvas-navigation.webp)

### Dove porta un salto {#where-a-jump-lands}

Ogni navigazione che porta a un elemento dell’area di disegno sposta la vista secondo un’unica regola: i risultati `#`, `@` e `:` della [Ricerca rapida](./quick-search.md#searching-the-diagram), le righe del pannello [Esplora](./explorer.md#going-to-a-row) e le corrispondenze della sua ricerca [Trova e sostituisci](./find-and-replace.md#going-to-a-match), le righe dell’elenco del [Visualizzatore differenze](#going-to-a-change), il [pulsante della card](./visualization.md#card-buttons) per il collegamento esterno in modalità Flusso, un controllo che nomina una tabella o una colonna nel [foglio Controlli](./dictionary.md#the-checks-sheet) della scheda Dizionario e l’arrivo di un [Importa e aggiungi](./file-import-export.md#import-and-add). Ognuna di queste sezioni indica cosa seleziona la navigazione; questa indica dove va la vista.

Un salto non modifica mai lo zoom ed esegue al massimo uno scorrimento. Da un’altra scheda passa prima alla scheda ERD.  
Misura l’area di disegno così come appare: sotto la barra degli strumenti superiore, o a tutta altezza in modalità Zen, e a destra di un pannello Esplora aperto, che restringe l’area di disegno anziché coprirla.

La direzione orizzontale e quella verticale vengono valutate separatamente, e una direzione in cui la destinazione è già ben visibile resta esattamente com’è:

- Una destinazione non più lunga di metà dell’area di disegno in quella direzione resta ferma finché il suo centro si trova nella metà centrale dell’area di disegno, tra un quarto e tre quarti della larghezza, o dell’altezza. Altrimenti il suo centro viene portato al centro dell’area di disegno.
- Una destinazione più lunga che entra comunque con `40px` di margine a ciascuna estremità resta ferma finché è interamente visibile. Altrimenti, in orizzontale, viene centrata; in verticale, il suo bordo superiore viene portato a `40px` sotto il bordo superiore dell’area di disegno.
- Una destinazione ancora più lunga resta ferma finché è interamente visibile o, quando è più lunga dell’area di disegno, finché lo è la sua parte essenziale, indicata più sotto. Altrimenti viene centrata se entra, oppure collocata il più vicino possibile al centro mantenendo entrambe le estremità della sua parte essenziale ad almeno `40px` all’interno dell’area di disegno; di una parte essenziale troppo lunga per questo viene mantenuto l’inizio a `40px` all’interno.

Quindi una piccola tabella vicina al bordo sinistro dell’area di disegno, a metà altezza, si sposta solo in orizzontale.

Cosa rende visibile un salto, e la parte essenziale che deve essere visibile quando l’insieme non entra:

- Una tabella: l’intera tabella, in base alla fascia del nome in alto, o in base alla cella del commento per una corrispondenza nel commento della tabella mentre View Option → `Table Comment` mostra i commenti. Al `70%` o meno, dove le tabelle si riducono al nome, in base al nome al centro del riquadro.
- Una colonna: la sua riga, in base alla cella a cui porta il salto: il nome, il nome logico per una corrispondenza nel nome logico o un controllo sul nome logico, la cella Dominio per un controllo sul dominio, o il commento in cui si trova una corrispondenza mentre View Option → `Column Comment` mostra i commenti. Dove la riga non disegna una cella di questo tipo, il salto porta alla cella disegnata al suo posto: il nome logico per il nome nella vista `Logical Names`, il nome per il nome logico nella vista `Physical Names`, e la cella del tipo per la cella Dominio mentre View Option → `Domain` è disattivata, o la riga nel suo insieme quando è disattivata anche `DataType`. Al `70%` o meno, una colonna rende visibile la sua tabella secondo la regola della tabella.
- Una cella troppo larga per essere mostrata per intero, come un commento lungo: in base al testo corrispondente al suo interno. Un salto alla cella disegnata al posto di quella in cui si trova la corrispondenza, come il nome per una corrispondenza nel nome logico nella vista `Physical Names`, non si basa sul testo.
- Una relazione: il riquadro che comprende le sue due tabelle, in base alla tabella figlia.
- Un gruppo di tabelle: il suo riquadro, in base alla barra del titolo.
- Un memo, o il blocco collocato da un Importa e aggiungi: l’intero elemento.

Quando nessuna delle due direzioni si sposterebbe, non c’è scorrimento, quindi andando due volte di seguito nello stesso punto la seconda volta non si sposta nulla. Un salto che fa scorrere l’area di disegno registra lo scorrimento nella [cronologia delle modifiche](./undo-redo.md#what-the-history-records) come qualsiasi altro cambio della posizione della vista, e uno che non sposta nulla non lascia nulla da annullare. Per un Importa e aggiungi, lo scorrimento fa parte dello stesso passo dell’aggiunta. Una riga dell’elenco del Visualizzatore differenze sposta solo i lati di sola lettura della vista, quindi non registra nulla, e un editor di sola lettura non registra alcun salto.  
Nessun salto avvia o completa una relazione in fase di disegno. La bussola `Go to content` non è un salto: centra l’elemento a cui punta.

## Visualizzatore differenze {#diff-viewer}

È possibile confrontare documenti salvati in precedenza con il documento corrente.  
Scegliere `Diff Viewer` dal menu contestuale dell’area di disegno e selezionare un documento `.json` esportato in precedenza.

La vista si apre sopra l’area di disegno: a sinistra ciò che è cambiato, poi il documento salvato e quello corrente affiancati.  
Il documento corrente viene confrontato così com’è al momento dell’apertura della vista; le modifiche fatte in seguito, comprese quelle di un collaboratore, non arrivano nella vista. Entrambi i lati si aprono, e restano, nella vista che si sta guardando, qualunque sia la vista conservata da ciascun file — vedere [Oltre l’area di disegno](./logical-names.md#beyond-the-canvas). Un pannello [Esplora](./explorer.md#when-it-stands-aside) aperto viene nascosto finché la vista è aperta, quindi la vista occupa l’intera larghezza dell’editor.  
Su ciascun lato si sposta la vista con la rotellina, trascinando una zona vuota o il corpo di un gruppo di tabelle, o trascinando con il pulsante centrale in qualsiasi punto del lato, e si esegue lo zoom con `Ctrl + Wheel` (Windows/Linux), `⌘ + Wheel` (Mac) o un gesto di pinch. Al `70%` o meno le tabelle di ciascun lato si riducono come nell’area di disegno — vedere [Indicatori sui due lati](#marks-on-the-two-sides).  
Entrambi i lati sono di sola lettura, quindi nel documento non viene modificato nulla. Ciascuno mantiene la propria selezione, e un clic su una tabella in un lato la seleziona solo su quel lato.  
La vista si chiude con il pulsante `Close` dell’avviso `Diff Viewer` che compare alla sua apertura, o con `Escape`.  
Un editor di sola lettura offre anch’esso `Diff Viewer`, e la vista funziona lì come in qualsiasi editor, con un clic su una tabella di un lato che continua a selezionarla solo su quel lato. Una vista aperta quando l’editor diventa di sola lettura resta aperta.

![Apertura del Visualizzatore differenze su un file .json salvato, clic sulle righe contrassegnate con A, M, D e R nel suo albero, filtro per nome e chiusura](/img/demo-diff-viewer.webp)

### Cosa viene confrontato {#what-is-compared}

Tabelle, colonne, indici, chiavi esterne, memo e gruppi di tabelle vengono tutti confrontati.  
Ogni elemento viene abbinato innanzitutto in base al suo id, quindi rispetto a una versione precedente dello stesso file, che mantiene gli id, una tabella, una colonna, un indice o un gruppo di tabelle rinominato resta un unico elemento, elencato come rinominato.  
Ciò che resta viene abbinato uno a uno in base a ciò che mantiene: una tabella o un gruppo di tabelle in base al nome, maiuscole e minuscole comprese; una colonna o un indice in base alla tabella e al nome; una chiave esterna in base alle sue due tabelle e alle sue coppie di colonne; e un memo in base al testo, poi alla posizione. Un indice senza nome viene abbinato in base alle colonne, al loro ordine e alla loro direzione, e al fatto che sia univoco, e un gruppo di tabelle senza nome in base al maggior numero di tabelle in comune.  
Quindi, rispetto a un file di altra provenienza, come un diagramma ricostruito con un’importazione SQL, una tabella rinominata appare come una tabella rimossa e una aggiunta.

Cosa conta come modifica:

- Una tabella: nome, commento, gruppo di tabelle, posizione e colore.
- Una colonna: nome, commento, tipo di dati, valore predefinito, Incremento automatico, chiave primaria, Univoco, Non null e posizione nella tabella. Contano come spostate solo le colonne al di fuori dell’ordine condiviso da entrambi i documenti, quindi aggiungere, rimuovere o spostare una colonna non contrassegna le altre.
- Un indice: nome, UNIQUE e colonne, con il loro ordine e la loro direzione.
- Una chiave esterna: coppie di colonne, tipo di relazione e azioni ON DELETE e ON UPDATE.
- Un memo: testo, posizione, dimensione e colore.
- Un gruppo di tabelle: nome, tabelle contenute, colore, posizione e dimensione.

Quindi una tabella, un memo o un gruppo che è stato solo spostato, ridimensionato o ricolorato conta come modificato. Posizioni e dimensioni vengono confrontate in pixel interi, mentre l’ordine di sovrapposizione e il punto in cui un connettore incontra una tabella non contano mai.  
I nomi logici, i collegamenti ai domini e le parole, i termini e i domini della scheda [Dizionario](./dictionary.md) non vengono confrontati, quindi una modifica che riguarda solo questi elementi non viene né elencata né contrassegnata. Conta invece un tipo di dati modificato da un dominio, come modifica del tipo di dati della colonna.

### L’albero delle modifiche {#the-change-tree}

L’elenco a sinistra è disegnato come l’[albero del pannello Esplora](./explorer.md#the-tree) e contiene solo ciò che è cambiato: `Tables`, `Table Groups` e `Memos`, ciascuno mostrato solo quando contiene una riga, e, sotto una tabella, i suoi `Columns`, `Indexes` e `Foreign Keys`. Una chiave esterna è elencata sotto la sua tabella figlia, e una tabella aggiunta o rimossa non elenca nulla al suo interno.  
Ogni cartella mostra quante righe contiene, e ogni cartella e ogni tabella parte espansa.  
Una riga di tabella o di colonna viene nominata nella vista in cui si sono aperti i lati. Nella vista `Both Names` mostra il nome logico seguito dal nome, attenuato, e su una riga rimossa il nome attenuato è barrato insieme al resto. Tabelle e gruppi di tabelle sono elencati per nome, senza distinzione tra maiuscole e minuscole, qualunque sia la vista. I memo, e le colonne, gli indici e le chiavi esterne di una tabella, mantengono l’ordine del documento corrente, e un elemento rimosso torna al posto in cui si trovava. Una riga di memo mostra la prima riga del memo, e una riga di chiave esterna mostra le sue colonne figlie, poi `→` con la tabella padre e le sue colonne, ad esempio `user_id → users(id)`. Un nome vuoto appare come `unnamed` in corsivo.

Ogni riga termina con una lettera, e una riga contrassegnata con `A`, `D`, `M` o `R` ha il nome nel colore della lettera:

- `A`, aggiunto, in verde: solo nel documento corrente.
- `D`, rimosso, in rosso e barrato: solo nel documento salvato.
- `M`, modificato, in ambra: in entrambi, cambiato.
- `R`, rinominato, in blu: in entrambi, con un nuovo nome. Una ridenominazione prevale su qualsiasi altra modifica, che il tooltip elenca comunque.
- `~`, in ambra, chiude ogni cartella e ogni tabella elencata solo per ciò che è cambiato al suo interno; i loro nomi mantengono il colore consueto.

Passare il puntatore sul nome di una riga per vederne il tooltip: lo stato, `Added`, `Deleted`, `Modified`, `Renamed` o `Changed inside`, poi una riga per ogni modifica, ad esempio `Name: users → members` o `NN: ✗ → ✓`. Un testo viene citato con la sua prima riga, troncata dopo 40 caratteri, e un valore vuoto appare come `—`. Il tooltip di un elemento aggiunto o rimosso contiene solo il suo stato.

`Filter by name`, sopra l’albero, mantiene le righe il cui nome corrente o salvato, o il cui nome logico corrente o salvato, contiene il testo digitato, senza distinzione tra maiuscole e minuscole, in ogni vista. Una tabella il cui nome corrisponde mantiene tutte le sue righe, e una il cui nome non corrisponde resta solo con le righe che corrispondono. Un filtro che non corrisponde a nulla lascia l’albero vuoto.  
Quando i due documenti non differiscono affatto, l’albero mostra `No changes`.

Trascinare il bordo destro dell’albero per allargarlo o restringerlo, da `200px` a `480px`, e fare doppio clic sul bordo per riportarlo a `260px`. Ogni confronto si apre a `260px`, e i due lati si dividono equamente il resto della larghezza.  
Con la tastiera ci si muove nell’albero come in quello del pannello Esplora — vedere [Tasti nel pannello Esplora](./explorer.md#keys-in-the-explorer) — ma qui `Escape`, nell’albero o in `Filter by name`, chiude la vista.

### Andare a una modifica {#going-to-a-change}

Fare clic su una riga, o premere `Enter` o `Space` quando ha il focus, per andare al suo elemento su ciascun lato che lo contiene: un elemento aggiunto solo sul lato corrente, uno rimosso solo sul lato salvato e tutto ciò che è presente in entrambi su entrambi i lati. Una riga di cartella si limita a comprimere o espandere la cartella, e lo stesso vale per la freccia all’inizio di una riga di tabella.

- Una riga di tabella, colonna o indice seleziona solo la tabella.
- Una riga di chiave esterna rende visibili le sue due tabelle, o la tabella figlia quando le due sono troppo distanti per essere mostrate insieme, seleziona la tabella figlia con le sue colonne chiave esterna ed evidenzia il connettore — vedere [Leggere un connettore](./relationship-editing.md#reading-a-connector).
- Una riga di memo seleziona il memo, e una riga di gruppo di tabelle seleziona il gruppo. Un memo o un gruppo nascosto dal documento di un lato non porta da nessuna parte su quel lato.

Ciascun lato si sposta secondo la regola di [Dove porta un salto](#where-a-jump-lands), misurata su quel lato, quindi facendo di nuovo clic sulla stessa riga non si sposta nulla.

### Indicatori sui due lati {#marks-on-the-two-sides}

I due lati colorano testo, contorni e connettori, e non riempiono nulla. Aggiunto è in verde e compare solo sul lato corrente, rimosso è in rosso e compare solo sul lato salvato, mentre modificato, in ambra, e rinominato, in blu, compaiono su entrambi i lati. Tutto ciò che non è cambiato viene disegnato come di consueto.

- Una tabella o un gruppo di tabelle aggiunto o rimosso viene contornato nel colore corrispondente, e il suo nome assume quel colore. Un memo aggiunto o rimosso viene contornato.
- Una colonna aggiunta o rimossa in una tabella presente in entrambi i documenti colora l’intera riga, e una colonna spostata colora di ambra l’intera riga. Nulla all’interno di una tabella aggiunta o rimossa viene contrassegnato singolarmente.
- Il testo di una cella modificata diventa ambra: il commento di una tabella, il commento, il tipo di dati, il valore predefinito, Incremento automatico, Univoco o Non null di una colonna, oppure il testo di un memo. Una modifica della chiave primaria colora di ambra l’icona della chiave della colonna.
- Una tabella, una colonna o un gruppo di tabelle rinominato ha il nome in blu.
- Una tabella, un memo o un gruppo di tabelle con una modifica che non ha una cella propria, come uno spostamento, una nuova dimensione o un nuovo colore, o un cambio di gruppo o delle tabelle di un gruppo, viene contornato in ambra.
- Una chiave esterna aggiunta, rimossa o modificata disegna il suo connettore in quel colore. Il passaggio del puntatore su di esso, o l’evidenziazione attivata da una riga, lo disegna invece nel consueto colore del passaggio del puntatore.
- Una modifica di un indice non contrassegna nulla su nessuno dei due lati; compare solo nell’albero.

Ciascun lato segue le Opzioni di visualizzazione del proprio documento. Una modifica in una cella che quel lato non disegna compare invece sul nome. Una modifica di colonna in una cella nascosta da una delle Opzioni di visualizzazione, come `Unique` o `Auto Increment`, entrambe disattivate per impostazione predefinita, colora di ambra il nome della colonna, e lo stesso fa una modifica della chiave primaria su una riga che non mostra l’icona della chiave. Una modifica del commento della tabella mentre `Table Comment` è disattivata colora di ambra il nome della tabella. Il blu di una ridenominazione prevale su questo color ambra. Un memo o un gruppo di tabelle nascosto dal suo documento è elencato nell’albero ma non viene disegnato su quel lato.

Nella vista `Logical Names`, che non disegna alcuna cella del nome, il blu di una ridenominazione e l’ambra di una modifica in una cella che il lato non disegna vanno sul nome logico disegnato al posto del nome. Una modifica del tipo di dati colora di ambra la cella del tipo in ogni vista, anche dove la cella mostra il nome di un dominio. Nessuno dei due lati disegna i colori che i controlli dei dizionari danno ai nomi nell’area di disegno — vedere [Indicatori nell’area di disegno](./dictionary.md#marks-on-the-canvas).

A `70%` o meno, le tabelle ridotte mantengono il contorno. Il nome mantiene il verde o il rosso di una tabella aggiunta o rimossa, o il blu di una ridenominazione, e altrimenti assume il color ambra di una modifica del commento. Le modifiche delle colonne non vengono disegnate finché non si esegue di nuovo lo zoom avanti; l’albero le elenca comunque.

## Editor di sola lettura {#read-only-editors}

Un editor [`readonly`](../../api/erd-editor-element.md#readonly), come una revisione Git riaperta come diagramma in VS Code, è un lettore. Le sue sei schede, il pannello [Esplora](./explorer.md#read-only-editors), la minimappa, le barre di scorrimento e i cursori e le selezioni dei collaboratori restano, e ogni controllo che modificherebbe il diagramma scompare anziché essere attenuato.

Nell’area di disegno ERD:

- Un trascinamento sposta la vista, ovunque inizi: su un’area vuota, una tabella, un memo o un gruppo di tabelle allo stesso modo. Il pulsante centrale, la rotellina, il pizzico e i tasti dello zoom funzionano come in qualsiasi editor.
- Fermare il puntatore su una tabella ne evidenzia le relazioni. Un clic che non sposta evidenzia le relazioni della tabella su cui cade, o la relazione su cui cade, e un clic altrove spegne l’evidenziazione.
- Nulla viene selezionato da una pressione, da un riquadro di selezione o da un tasto di selezione totale. Seleziona solo un salto: una riga di [Esplora](./explorer.md#going-to-a-row), una corrispondenza della sua [ricerca Trova e sostituisci](./find-and-replace.md#going-to-a-match) o un risultato `#`, `@` o `:` della [Ricerca rapida](./quick-search.md#searching-the-diagram) seleziona ciò su cui arriva, con il contorno di qualsiasi selezione e la cella con il focus dove la mette il salto. Un clic che non sposta cancella quella selezione.
- I tasti freccia spostano la cella con il focus. Copia, `Table Properties` e `Focus on this table` funzionano su ciò che un salto ha selezionato, con i rispettivi tasti, e un’incolla non aggiunge nulla. Gli altri tasti sono elencati in [Tasti di scelta rapida](./settings.md#shortcuts).
- Nessun nome di cella, di memo o di gruppo di tabelle si apre per la modifica. Non ci sono pulsanti `+` o `x` su tabelle, memo e gruppi, né bordi di ridimensionamento su memo e gruppi, né maniglia di trascinamento delle colonne, né selettore di colore.

Il menu contestuale dell’area di disegno conserva `View Option`, `Name View`, `Export` e `Diff Viewer`. Non ha `New Table`, `New Memo`, `New Table Group`, `Toggle Explorer`, `Relationship`, `Derive Physical Names Again`, `Database`, `Import`, `Import and Add` né `Auto Layout`.  
Il menu di una tabella conserva la sola voce `Table Properties`, che apre il pannello in sola lettura per quella tabella — vedere [Proprietà tabella](#table-properties). Un memo, una relazione e un gruppo di tabelle non aprono alcun menu.  
La [barra degli strumenti dell’area di disegno](#canvas-toolbar) conserva lo zoom, `Name View`, la modalità Zen e la bussola `Go to content`. La barra degli strumenti superiore mostra il nome del database come testo non modificabile, e non ha `Undo`, `Redo` né `Time Travel`.  
L’[esportazione](./file-import-export.md#exporting), con tutte e tre le sue voci, e il [Visualizzatore differenze](#diff-viewer) funzionano come in qualsiasi editor.

[`View Option`](#table-view-options), la `Name View`, il database, la scheda, la posizione della vista e lo zoom cambiano comunque lì, ma solo su quello schermo: nulla li salva, registra o condivide — vedere [Editor di sola lettura](./settings.md#read-only-editors) in Impostazioni.

Rendere un editor di sola lettura termina ciò che era aperto per la modifica: l’editor di una cella, di un memo o del nome di un gruppo di tabelle, una relazione o un `New Table Group` in corso di disegno, la selezione e la cella con il focus, lo strumento mano, il selettore di colore, [Associa colonne](./relationship-editing.md#map-columns) e il [Viaggio nel tempo](./undo-redo.md#time-travel). La vista, lo zoom, la scheda e la Visualizzazione nomi restano com’erano, e Proprietà tabella, il Visualizzatore differenze e la finestra di dialogo `Export image` restano aperti.  
Anche un gesto in corso termina lì. Un trascinamento di tabelle o memo si ferma dov’è, un `Alt + drag` non rilascia alcuna copia, un trascinamento di colonna termina, il ridimensionamento di un memo si ferma dov’è, il ridimensionamento di un gruppo di tabelle viene scartato e un [Layout automatico](#auto-layout) viene scartato con il suo avviso, quindi nessuna tabella si sposta.  
Quando l’editor torna modificabile, restituisce i controlli sopra elencati, e nulla di ciò che il passaggio ha chiuso si riapre.
