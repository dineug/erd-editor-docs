---
sidebar_position: 11
description: Esplorare lo schema come grafo a forze in modalità Grafo o come flusso di card delle tabelle in modalità Flusso — eseguire lo zoom e spostare la vista, evidenziare le tabelle correlate a una tabella, focalizzare poche tabelle alla volta e tornare indietro tra le focalizzazioni precedenti.
---

# Visualizzazione

Mostra l’intero documento a colpo d’occhio, in una di due modalità:

- `Graph`, un grafo a forze di tutte le tabelle, delle loro colonne e delle relazioni tra di esse — vedere [Modalità Grafo](#graph-mode).
- `Flow`, ogni tabella disegnata come una card e disposta lungo le sue relazioni — vedere [Modalità Flusso](#flow-mode).

Si apre dalla scheda `Visualization` nella barra degli strumenti in alto, o dalla [Ricerca rapida](./quick-search.md) sotto `Tab`.  
Dalla scheda ERD, `Alt + F` (Windows/Linux) o `⌥ + F` (Mac) e la voce `Focus on this table` del menu contestuale della tabella la aprono direttamente in `Flow`, ristretta alle tabelle scelte e alle tabelle a una relazione di distanza — vedere [Focalizzare le tabelle](#focusing-on-tables).

Per cambiare modalità, usare i pulsanti `Graph` e `Flow` all’estremità sinistra della [barra degli strumenti](#toolbar).  
Un editor appena aperto parte da `Graph`. La modalità scelta resta finché l’editor è aperto, anche passando ad altre schede, ma non viene salvata nel documento.

## Barra degli strumenti {#toolbar}

Una barra degli strumenti fluttua al centro del bordo inferiore della scheda. Da sinistra a destra:

- `Graph` e `Flow`, con la modalità corrente evidenziata.
- `Previous table` e `Next table`, solo in `Flow`: una freccia a sinistra e una freccia a destra che tornano indietro e vanno avanti di un passo tra le tabelle a cui è stata ristretta la modalità Flusso — vedere [Tabella precedente e tabella successiva](#previous-table-and-next-table). Ciascuna è attenuata finché non c’è alcun passo da compiere in quella direzione.
- `Zoom out`, lo zoom corrente sotto forma di percentuale, come `100%`, e `Zoom in`. Ogni pressione sposta lo zoom di 4 punti percentuali, mantenendo fermo il centro dello schermo. La percentuale mostra lo zoom della modalità corrente e un clic su di essa riporta quello zoom al `100%`.
- `Fit`, che porta nella vista tutto ciò che la modalità mostra: ogni nodo in `Graph`, ogni card in `Flow`.
- `Tidy Up`, solo in `Flow`, che dispone di nuovo le card — vedere [Come la modalità Flusso dispone le card](#how-flow-is-placed).
- Il menu della visualizzazione righe, solo in `Flow`, la cui etichetta è la scelta corrente — vedere [Visualizzazione righe](#row-display).
- L’elenco `Name View`, solo in `Flow`, la cui etichetta è la vista attiva — vedere [Nomi sulle card](#names-on-the-cards).
- `Show all`, solo in `Flow` e solo mentre la vista è ristretta, che torna all’intero diagramma — vedere [Focalizzare le tabelle](#focusing-on-tables).
- La bussola `Go to content`, che si aggiunge alla fine della barra degli strumenti solo mentre sullo schermo non c’è alcun nodo né alcuna card. Mostra una freccia che punta al nodo o alla card più vicina e quanto è distante, come `1.2k`. Fare clic su di essa per centrare quel nodo o quella card senza cambiare lo zoom.

I pulsanti dello zoom e le due frecce indicano i propri tasti di scelta rapida nei tooltip, ad esempio `Zoom in (Ctrl + Plus)` (Windows/Linux) o `Zoom in (⌘ + Plus)` (Mac), e `Previous table (Ctrl + Z)` (Windows/Linux) o `Previous table (⌘ + Z)` (Mac).  
`Ctrl + Plus` e `Ctrl + Minus` (Windows/Linux) o `⌘ + Plus` e `⌘ + Minus` (Mac) modificano lo zoom a passi come i pulsanti, in entrambe le modalità, e `Ctrl + 0` (Windows/Linux) o `⌘ + 0` (Mac) lo riporta direttamente al `100%`. Nella modalità `Flow`, `Ctrl + Z` e `Ctrl + Shift + Z` (Windows/Linux) o `⌘ + Z` e `⌘ + Shift + Z` (Mac) si spostano di un passo come le due frecce.  
Un clic sulla percentuale ha lo stesso effetto di `Ctrl + 0` (Windows/Linux) o `⌘ + 0` (Mac), e il suo tooltip lo indica. I tasti di scelta rapida non hanno alcun effetto mentre la Ricerca rapida è aperta.

## Modalità Grafo {#graph-mode}

Disegna l’intero documento come un grafo a forze, in modo da mostrare a colpo d’occhio come le tabelle sono in relazione tra loro e quali si trovano al centro di un dominio.

![Apertura della modalità Grafo, passaggio del puntatore su una tabella per vederne l’anteprima, trascinamento di un nodo e zoom indietro e poi di nuovo avanti](/img/demo-visualization.webp)

### Leggere il grafo {#reading-the-graph}

Ogni tabella e ogni colonna è un nodo, e i due tipi sono disegnati con colori diversi. I memo e i [gruppi di tabelle](./table-groups.md) non vengono disegnati.  
Ogni nodo colonna è collegato alla tabella a cui appartiene, e due tabelle unite da una relazione sono collegate tra loro.  
Le tabelle unite da più di una relazione nella stessa direzione sono collegate una sola volta, e una relazione che inizia e finisce sulla stessa tabella non disegna alcun collegamento.

I nomi delle tabelle compaiono sul grafo man mano che si esegue lo zoom avanti, con una dissolvenza in entrata tra il `50%` e il `100%`, e un nome più lungo di 15 caratteri viene troncato. I nodi colonna non hanno etichetta a nessun livello di zoom.  
Le etichette seguono la Visualizzazione nomi — vedere [Oltre l’area di disegno](./logical-names.md#beyond-the-canvas). Nella vista `Both Names`, un’etichetta mette il nome logico su una riga e il nome sulla riga sottostante, e ciascuna riga viene troncata separatamente.

### Muoversi nel grafo {#getting-around-the-graph}

La rotellina esegue lo zoom, attorno a ciò che si trova sotto il puntatore, dal `10%` al `400%`.  
Un gesto di pinch sul trackpad esegue lo zoom allo stesso modo, e due dita su uno schermo touch eseguono lo zoom attorno al punto tra di esse e spostano la vista mentre si muovono.  
Per spostare la vista, trascinare lo sfondo, o trascinare con il pulsante centrale del mouse da qualsiasi punto, anche da un nodo, come nell’[area di disegno ERD](./table-related-functions.md#getting-around-the-canvas). Un trascinamento con il pulsante centrale sposta solo la vista: non trascina mai un nodo.

I pulsanti dello zoom sulla [barra degli strumenti](#toolbar) e i tasti di scelta rapida dello zoom mantengono invece fermo il centro dello schermo, entro lo stesso intervallo, e `Fit` porta nella vista tutti i nodi.

### Anteprima al passaggio del puntatore {#hover-preview}

Passare il puntatore su un nodo tabella per visualizzare l’anteprima di quella tabella, accanto al cursore.  
Il passaggio del puntatore su un nodo colonna disegna solo un anello attorno a esso; non si apre alcuna anteprima.

L’anteprima mostra le stesse colonne e celle dell’area di disegno ERD, nello stesso ordine, e le nomina come fa l’area di disegno nella vista che si sta guardando — vedere [Opzioni di visualizzazione delle tabelle](./table-related-functions.md#table-view-options), [Modificare l’ordine delle colonne](./settings.md#adjusting-column-order) e [Visualizzazione nomi](./logical-names.md#name-view).  
Con l’opzione di visualizzazione `Alternate Key` attiva, ogni colonna di una [chiave alternativa](./table-related-functions.md#alternate-keys) riporta il suo indicatore, come `AK1.1`, in ultima posizione nella riga, e l’anteprima si allarga per contenerlo, come fa la tabella nell’area di disegno ERD.  
A differenza di una tabella nell’area di disegno ERD, la sua intestazione non assume mai il colore del [gruppo](./table-groups.md#coloring-a-group) della tabella, e i suoi nomi non portano mai gli [indicatori](./dictionary.md#marks-on-the-canvas) che i controlli dei dizionari mettono nell’area di disegno.  
È di sola visualizzazione e viene nascosta mentre si trascina un nodo o si sposta la vista.

### Evidenziare gli elementi adiacenti {#highlighting-a-neighbourhood}

Il passaggio del puntatore su una tabella evidenzia anche i suoi elementi adiacenti: la tabella stessa, le sue colonne, le tabelle che le sue relazioni uniscono in entrambe le direzioni e i collegamenti tra di essi.  
Tutto il resto del grafo si attenua, così risalta soltanto ciò con cui la tabella è a contatto.

### Spostare i nodi {#moving-nodes}

Trascinare un nodo con il pulsante sinistro del mouse per portarlo, insieme a tutto ciò che vi è collegato, in una nuova posizione.  
Il nodo resta fissato sotto il puntatore finché lo si tiene premuto e il layout si rimette in moto attorno a esso.  
Si assesta di nuovo quando lo si rilascia — nulla resta fissato nel punto in cui lo si è rilasciato.  
Una pressione o un trascinamento con il pulsante destro su un nodo non lo trascina né sposta la vista.

### Il grafo è un’istantanea {#the-graph-is-a-snapshot}

Il grafo viene costruito a partire dal documento così com’è nel momento in cui si apre questa scheda, e viene ricostruito da zero ogni volta che vi si torna.  
Anche il passaggio da `Flow` a `Graph` lo ricostruisce, e ogni ricostruzione riparte dal `100%`.

## Modalità Flusso {#flow-mode}

Disegna ogni tabella come una card e dispone le card lungo le loro relazioni. I memo e i [gruppi di tabelle](./table-groups.md) non vengono disegnati.  
Non è il layout `Flow` del [Layout automatico](./table-related-functions.md#auto-layout), che sposta le tabelle nella scheda ERD stessa.

Ogni card è disegnata come una tabella nella scheda ERD: il colore della tabella lungo il bordo sinistro, una fascia di intestazione con un’icona di tabella e i nomi della tabella come li mostra la [Visualizzazione nomi](#names-on-the-cards), poi le righe richieste dalla sua [visualizzazione righe](#row-display). A differenza di una tabella nella scheda ERD, una card disegna anche una linea tra le sue righe, e la sua intestazione non assume mai il colore del [gruppo](./table-groups.md#coloring-a-group) della tabella. Le card mantengono questo aspetto a ogni livello di zoom e non si riducono mai al solo nome come fanno le tabelle nella scheda ERD al `70%` o meno. Nulla su una card è modificabile.

Un connettore è un’unica curva morbida da tabella a tabella, disegnata sotto le card, per cui può passare dietro a una di esse. Una relazione da una tabella verso sé stessa curva attorno all’angolo superiore destro della card, come nella scheda ERD — vedere [Instradamento dei connettori](./relationship-editing.md#connector-routing). Ogni connettore è disegnato con la stessa linea grigia continua, che la relazione sia identificante o meno, con gli stessi simboli alle estremità presenti nella scheda ERD — vedere [Leggere un connettore](./relationship-editing.md#reading-a-connector). La modalità Flusso disegna i connettori anche quando l’[opzione di visualizzazione](./table-related-functions.md#table-view-options) `Relationship` è disattivata. Non disegna mai le etichette `D:` e `U:` delle azioni ON DELETE e ON UPDATE di una relazione né mostra il tooltip che le esplicita, qualunque cosa indichi l’opzione di visualizzazione `Referential Actions`.

Nell’intero diagramma, le tabelle che nessuna relazione unisce a un’altra tabella vengono raccolte in un unico blocco anziché sparse tra le altre.

![Passaggio alla modalità Flusso, passaggio del puntatore su orders per evidenziarla insieme alle tabelle adiacenti, fissaggio dell’evidenziazione, scelta di Keys only, poi zoom avanti con ⌘ + Wheel e clic su Fit](/img/demo-visualization-flow.webp)

### Visualizzazione righe {#row-display}

Il menu della visualizzazione righe sulla [barra degli strumenti](#toolbar) stabilisce quanta parte di ogni card viene disegnata. La sua etichetta è la scelta corrente e il suo tooltip riporta, ad esempio, `Row display: Name only`.  
Il menu si apre sopra la barra degli strumenti con un segno di spunta accanto alla scelta corrente. Si chiude quando si sceglie una voce, si fa di nuovo clic sull’etichetta, si fa clic in qualsiasi altro punto dell’editor, si preme `Escape` o si passa a `Graph`.

| Visualizzazione righe | Cosa mostra ogni card |
| --- | --- |
| `Name only` | Solo l’intestazione. |
| `Keys only` | Le colonne chiave primaria e chiave esterna, più ogni altra colonna su cui termina una relazione. |
| `All fields` | Tutte le colonne. |

Le righe sono elencate nell’ordine delle colonne della tabella. Ogni riga mostra il nome della colonna, preceduto da un’icona a forma di chiave quando la colonna è una chiave primaria, una chiave esterna o entrambe, e a destra il tipo di dati, che la card sia [evidenziata](#lighting-related-tables) o meno. La [Visualizzazione nomi](#names-on-the-cards) stabilisce quali nomi mostra una riga e se mostra il dominio della colonna.  
Non vengono disegnate altre celle né indicatori di chiave alternativa, e alle card non si applicano né [Opzioni di visualizzazione delle tabelle](./table-related-functions.md#table-view-options) né [Modificare l’ordine delle colonne](./settings.md#adjusting-column-order), che ordina le celle all’interno di una riga.

Alla prima apertura, la modalità Flusso parte da `Name only`, o da `Keys only` se ad aprirla è stata la [focalizzazione delle tabelle](#focusing-on-tables). In seguito, la visualizzazione righe cambia solo quando se ne sceglie un’altra, e resta invariata quando si restringe o si allarga la vista.  
Cambiare la visualizzazione righe ridimensiona le card, per cui la modalità Flusso le dispone di nuovo e le adatta allo schermo.

### Nomi sulle card {#names-on-the-cards}

Una card nomina la sua tabella e le sue colonne nella Visualizzazione nomi, la stessa in cui disegna la scheda ERD — vedere [Visualizzazione nomi](./logical-names.md#name-view).  
Qui la si cambia con l’elenco `Name View` sulla [barra degli strumenti](#toolbar). Il suo pulsante riporta la vista attiva, `Physical Names`, `Logical Names` o `Both Names`, e il suo tooltip riporta `Name View`. L’elenco si apre sopra la barra degli strumenti con un segno di spunta accanto alla vista attiva, e si chiude come il menu della [visualizzazione righe](#row-display). Una scelta cambia la vista dell’intero editor, scheda ERD compresa, come un cambio fatto in qualsiasi altro punto — vedere [Cambiare vista](./logical-names.md#switching-the-view).

Le card dispongono le loro celle solo in base alla Visualizzazione nomi. Nessuna [opzione di visualizzazione](./table-related-functions.md#table-view-options) le modifica, `Domain` compresa:

| Visualizzazione nomi | Intestazione | Ogni riga |
| --- | --- | --- |
| `Physical Names` | Il nome della tabella. | Il nome della colonna, poi il tipo di dati. |
| `Logical Names` | Il nome logico della tabella. | Il nome logico della colonna, poi il nome del suo [dominio](./dictionary.md#domains-and-data-types), o il suo tipo di dati finché non ne ha uno. |
| `Both Names` | Il nome logico, poi il nome della tabella, attenuato. | Il nome logico, il nome, il dominio e il tipo di dati. |

Finché un nome logico è vuoto, la vista `Logical Names` mostra al suo posto il nome, attenuato, o il testo segnaposto `table` o `column` quando anche il nome è vuoto, e la vista `Both Names` mostra il testo segnaposto `logical`, attenuato. Nella vista `Both Names`, una colonna senza dominio mostra il testo segnaposto `domain`, attenuato.  
Una card non porta mai gli [indicatori](./dictionary.md#marks-on-the-canvas) che i controlli dei dizionari mettono sui nomi nella scheda ERD.  
Cambiare la Visualizzazione nomi ridimensiona le card, per cui la modalità Flusso le dispone di nuovo — vedere [Come la modalità Flusso dispone le card](#how-flow-is-placed).

### Muoversi in modalità Flusso {#getting-around-the-flow}

La rotellina sposta la vista, e `Shift + Wheel` la sposta lateralmente. `Ctrl + Wheel` (Windows/Linux) o `⌘ + Wheel` (Mac) esegue lo zoom, mantenendo fermo il centro dello schermo.  
Un gesto di pinch sul trackpad esegue lo zoom attorno al punto in cui si esegue il gesto, e due dita su uno schermo touch eseguono lo zoom attorno al punto tra di esse e spostano la vista mentre si muovono.  
Per spostare la vista, trascinare lo sfondo, o trascinare con il pulsante centrale del mouse da qualsiasi punto, anche da una card. Un trascinamento con il pulsante centrale sposta solo la vista e lascia invariata la selezione. Lo spostamento della vista non ha limiti, come nell’[area di disegno ERD](./table-related-functions.md#getting-around-the-canvas).  
Lo zoom va dal `10%` al `150%`. La modalità Flusso mantiene uno zoom e una posizione della vista propri, separati da quelli della scheda ERD, e nessuno dei due viene salvato nel documento.

Una pressione sullo sfondo annulla la selezione, e `Ctrl + drag` (Windows/Linux) o `⌘ + drag` (Mac) sullo sfondo disegna un riquadro di selezione.  
La modalità Flusso non ha minimappa né barre di scorrimento. Quando uno spostamento della vista non lascia alcuna card sullo schermo, usare la bussola `Go to content` sulla [barra degli strumenti](#toolbar).

### Evidenziare le tabelle correlate {#lighting-related-tables}

Passare il puntatore su una card per evidenziare la card, le tabelle a una relazione di distanza da essa e i connettori che la uniscono a quelle tabelle. Un connettore tra due di quelle tabelle resta non evidenziato.  
Una card evidenziata riceve un bordo e un alone nel colore principale, e le sue righe su cui termina una relazione vengono leggermente colorate. Un connettore evidenziato assume il colore principale.  
Nient’altro si attenua, a differenza della modalità [Grafo](#highlighting-a-neighbourhood), e nulla è evidenziato finché nessuna card si trova sotto il puntatore o è fissata.

Fare clic su una card per fissarne l’evidenziazione, in modo che resti evidenziata quando il puntatore si allontana. Fare di nuovo clic sulla stessa card, o fare clic sullo sfondo, per rilasciarla; un clic su un’altra card sposta lì il fissaggio. La card sotto il puntatore e la card fissata vengono evidenziate insieme.  
Il trascinamento, `Ctrl + click` (Windows/Linux) o `⌘ + click` (Mac), lo spostamento della vista e i [pulsanti delle card](#card-buttons) non fissano né rilasciano una card.

Lungo ogni connettore evidenziato scorrono delle particelle, dall’estremità della tabella padre, dove si trova la chiave primaria, all’estremità della tabella figlia. Quando più di 60 connettori sono evidenziati contemporaneamente, le particelle si fermano e l’evidenziazione resta.

### Pulsanti delle card {#card-buttons}

Mentre il puntatore si trova su una card, all’estremità destra della sua intestazione compaiono due pulsanti a icona, entrambi senza tooltip:

- L’icona dei punti di passaggio, la stessa mostrata dal pulsante `Flow`, restringe la modalità Flusso a quella tabella e alle tabelle a una relazione di distanza — vedere [Focalizzare le tabelle](#focusing-on-tables). Ciò che la modalità Flusso mostrava prima resta a un `Previous table` di distanza — vedere [Tabella precedente e tabella successiva](#previous-table-and-next-table).
- L’icona del collegamento esterno passa alla scheda ERD, seleziona solo quella tabella, la porta in primo piano e sposta il focus sulla cella del suo nome, o sulla cella del suo nome logico nelle viste `Logical Names` e `Both Names`, a meno che una cella di quella tabella non lo abbia già. L’area di disegno scorre fino alla tabella solo se questa non è già ben visibile — vedere [Dove porta un salto](./table-related-functions.md#where-a-jump-lands). Non avvia né completa mai una relazione in corso di disegno.

Una pressione su uno dei due pulsanti riguarda solo il pulsante: a differenza di una pressione in un altro punto della card, non seleziona la card né la porta in primo piano. Il pulsante dei punti di passaggio lascia quindi la selezione com’era; il pulsante del collegamento esterno seleziona la tabella solo nell’ambito del passaggio alla scheda ERD. Entrambi i pulsanti funzionano solo con un clic sinistro.

### Spostare le card {#moving-cards}

Trascinare una card con il pulsante sinistro del mouse da qualsiasi punto tranne i due pulsanti della card; un trascinamento con il pulsante destro non sposta nulla.  
Una pressione su una card la seleziona, `Ctrl + click` (Windows/Linux) o `⌘ + click` (Mac) la aggiunge alla selezione, e il trascinamento di una card selezionata sposta tutte le card selezionate. La selezione è quella usata dalla scheda ERD, quindi ciò che si seleziona qui resta selezionato quando vi si torna.

Una card si sposta solo nella modalità Flusso: la sua tabella resta dov’è nella scheda ERD.  
Una card spostata resta ferma durante lo spostamento della vista, lo zoom e `Fit`. Torna dove l’aveva collocata il layout quando si lascia la scheda o si passa a `Graph` e poi si torna indietro, e quando `Show all` o un [passo](#previous-table-and-next-table) ritorna a un layout che la modalità Flusso ha già. Un nuovo layout la colloca di nuovo, tenendo conto di dove era stata lasciata — vedere [Come la modalità Flusso dispone le card](#how-flow-is-placed).

### Focalizzare le tabelle {#focusing-on-tables}

Nella scheda ERD, selezionare una o più tabelle e premere `Alt + F` (Windows/Linux) o `⌥ + F` (Mac), oppure fare clic con il pulsante destro su una tabella e scegliere `Focus on this table`.  
La scheda Visualizzazione si apre in `Flow`, ristretta a quelle tabelle e a ogni tabella a una relazione di distanza da una qualsiasi di esse, in entrambe le direzioni. Vengono disegnati solo i connettori tra le tabelle mostrate.

Quando la tabella su cui si fa clic con il pulsante destro è una di più tabelle selezionate, la voce diventa `Focus on selected tables` e focalizza l’intera selezione. Un clic con il pulsante destro su una tabella esterna alla selezione focalizza solo quella tabella.  
`Alt + F` prende le tabelle selezionate ed esclude i memo e i [gruppi di tabelle](./table-groups.md). Senza tabelle selezionate non fa nulla, anche con un gruppo selezionato: scegliere prima `Select tables` nel menu contestuale del gruppo — vedere [Selezionare i gruppi](./table-groups.md#selecting-groups).  
Viene ignorato mentre si modifica una cella, un memo o il nome di un gruppo, mentre il pannello [Esplora](./explorer.md#keys-in-the-explorer) ha il focus, o mentre è aperto uno tra Ricerca rapida, Proprietà tabella, Visualizzatore differenze, anteprima del Layout automatico, Viaggio nel tempo, finestra di dialogo [`Export image`](./file-import-export.md#image) e [`Map Columns`](./relationship-editing.md#map-columns).

All’interno della modalità Flusso, il [pulsante della card](#card-buttons) dei punti di passaggio restringe la vista allo stesso modo, a quell’unica tabella. `Show all` sulla [barra degli strumenti](#toolbar) torna all’intero diagramma. `Previous table` e `Next table` sulla barra degli strumenti, o i loro tasti, tornano indietro e vanno avanti tra le viste a cui è stata ristretta la modalità Flusso — vedere [Tabella precedente e tabella successiva](#previous-table-and-next-table).  
Una vista ristretta viene disposta separatamente e adattata allo schermo. Resta ristretta quando si lascia la scheda o si passa a `Graph` e poi si torna indietro, e `Escape` non la allarga.

![Focalizzazione di orders con ⌥ + F, restringimento a members con il pulsante dei punti di passaggio della sua card, poi Show all](/img/demo-visualization-focus.webp)

### Tabella precedente e tabella successiva {#previous-table-and-next-table}

La modalità Flusso ricorda le viste a cui è stata ristretta, come la cronologia di un browser. Ogni volta che la vista passa ad altre tabelle — [focalizzando le tabelle](#focusing-on-tables) dalla scheda ERD, con il [pulsante della card](#card-buttons) dei punti di passaggio o con `Show all` — ciò che mostrava prima viene conservato come passo indietro, che si trattasse di poche tabelle o dell’intero diagramma.

![Restringimento della modalità Flusso a orders con ⌥ + F e poi a members, passo indietro con Previous table, avanti con ⌘ + Shift + Z e di nuovo indietro con ⌘ + Z, poi Show all](/img/demo-visualization-steps.webp)

- `Previous table` sulla [barra degli strumenti](#toolbar) torna indietro di un passo, e `Next table` va di nuovo avanti fino a ciò che `Previous table` ha lasciato.
- Nella modalità `Flow`, `Ctrl + Z` (Windows/Linux) o `⌘ + Z` (Mac) torna indietro di un passo come `Previous table`, e `Ctrl + Shift + Z` (Windows/Linux) o `⌘ + Shift + Z` (Mac) va avanti di un passo come `Next table`. Lì non annullano né ripetono mai una modifica del diagramma. Nella modalità `Graph`, e mentre la Ricerca rapida è aperta, non hanno effetto.
- Restringere la vista o premere `Show all` dopo essere tornati indietro elimina i passi in avanti. Focalizzare di nuovo esattamente le tabelle a cui la modalità Flusso è già ristretta non aggiunge alcun passo e non ne elimina nessuno.
- Vengono conservati gli ultimi 100 passi indietro, e il più vecchio viene eliminato per primo.

Un passo mostra quelle delle sue tabelle che sono ancora nel diagramma, con ogni tabella a una relazione di distanza, come fa la focalizzazione. Un passo le cui tabelle sono state tutte rimosse viene saltato ed eliminato, e lo stesso vale per uno che lascerebbe la modalità Flusso dov’è: sulle stesse tabelle a cui è ristretta ora, o sull’intero diagramma mentre la modalità Flusso lo mostra già.  
Un pulsante è attenuato, e non ha effetto, finché non resta alcun passo in quella direzione. Entrambi sono attenuati alla prima apertura della modalità Flusso, sia sull’intero diagramma sia sulle tabelle con cui l’ha aperta una focalizzazione. Una volta aperta la modalità Flusso, una focalizzazione successiva dalla scheda ERD conserva come passo indietro ciò che la modalità Flusso mostrava quando la si è lasciata.  
Un passo viene disposto e adattato allo schermo come una focalizzazione — vedere [Come la modalità Flusso dispone le card](#how-flow-is-placed) — e la visualizzazione righe resta invariata.

I passi appartengono alla modalità Flusso. Vengono conservati finché l’editor è aperto, anche passando ad altre schede e a `Graph`, ma non vengono salvati nel documento né inviati ai collaboratori, e non aggiungono nulla alla cronologia delle modifiche. La sostituzione dell’intero documento li scarta insieme al resto della modalità Flusso.

In una lingua di visualizzazione da destra a sinistra la barra degli strumenti mantiene il suo ordine e le due frecce si scambiano la funzione, quindi `Previous table` è la freccia che punta a destra. I tasti restano gli stessi — vedere [Lingue da destra a sinistra](./language-and-theme.md#right-to-left-languages).

### Come la modalità Flusso dispone le card {#how-flow-is-placed}

La prima volta che viene mostrata la modalità `Flow`, le tabelle che mostra vengono disposte al di fuori del thread principale e il risultato viene adattato allo schermo.  
Il layout viene mantenuto finché l’editor è aperto. Se si lascia la scheda o si passa a `Graph` e poi si torna indietro, la modalità Flusso lo riutilizza, con zoom e posizione della vista come li si era lasciati.  
La modalità Flusso mantiene un layout per l’intero diagramma e uno per le tabelle a cui è stata ristretta l’ultima volta, quindi `Show all` torna al layout dell’intero diagramma e lo adatta allo schermo senza ricalcolarlo, purché non sia cambiato nulla di ciò su cui si basa quel layout. Un [passo](#previous-table-and-next-table) verso l’intero diagramma, o verso le tabelle a cui la modalità Flusso è stata ristretta l’ultima volta, riutilizza quel layout allo stesso modo.

La modalità Flusso dispone di nuovo le card quando:

- Si preme `Tidy Up`. Il risultato viene adattato allo schermo.
- Si cambia la visualizzazione righe, si restringe la vista ad altre tabelle o si passa ad altre tabelle con `Previous table` o `Next table`. Il risultato viene adattato allo schermo.
- Si sceglie un’altra vista nell’elenco `Name View`. Il risultato viene adattato allo schermo.
- Vengono aggiunte o rimosse tabelle o relazioni, o viene cambiata la Visualizzazione nomi — mentre si è fuori dalla modalità Flusso, con effetto al ritorno, o da parte di un collaboratore mentre si è nella modalità Flusso. Zoom e posizione della vista restano invariati.

Ogni layout tiene conto della posizione attuale delle card, quindi `Tidy Up` non ripristina necessariamente una disposizione precedente.  
Una modifica che ridimensiona soltanto una card, come rinominare una tabella, scrivere un nome logico o aggiungere una colonna, non dispone di nuovo le card. Premere `Tidy Up` se le card finiscono per sovrapporsi.

Un layout che richiede più di 6 secondi mostra l’avviso `Placing tables`, con un indicatore di caricamento rotante e `Cancel`.  
`Cancel`, o `Escape` in qualsiasi momento mentre il layout è in corso, lo annulla; `Tidy Up`, o il ritorno a `Flow`, lo richiede di nuovo.  
Se un layout non riesce — l’host non esegue alcun worker condiviso, il worker non si avvia o nessun layout viene restituito entro 60 secondi — la modalità Flusso mostra l’avviso `Could not place tables` con un simbolo di avviso, e `Tidy Up` riprova. Vedere [Web Worker](../../api/installation.md#web-workers).  
La modalità Flusso disegna solo le tabelle collocate dal suo ultimo layout, sia nell’intero diagramma sia in una vista ristretta, quindi la prima volta che viene mostrata potrebbe non esserci alcuna card finché un layout non riesce.  
Ogni volta che la modalità Flusso dispone di nuovo le card, come quando si restringe la vista ad altre tabelle, la disposizione precedente resta sullo schermo finché non arriva il nuovo layout, e vi resta se quel layout viene annullato o non riesce.

Quando l’intero documento viene sostituito, ad esempio importando un file, i layout, la focalizzazione, i passi di `Previous table` e `Next table`, la visualizzazione righe, lo zoom e la posizione della vista della modalità Flusso vengono scartati, e alla successiva apertura la modalità Flusso riparte come la prima volta: sull’intero diagramma, o ristretta se la si apre [focalizzando le tabelle](#focusing-on-tables).

### La modalità Flusso non modifica mai il documento {#flow-never-edits-the-document}

La modalità Flusso si limita a leggere il diagramma. Lo zoom, lo spostamento della vista, lo spostamento delle card, `Tidy Up`, la visualizzazione righe, i fissaggi, la focalizzazione e i passi con `Previous table` e `Next table` non aggiungono nulla alla [cronologia delle modifiche](./undo-redo.md#what-the-history-records).  
Non modificano nulla nemmeno nel diagramma. Una pressione su una card porta sì la sua tabella in primo piano, proprio come un clic su una tabella nella scheda ERD, per cui è in primo piano anche lì, ma l’ordine di sovrapposizione non viene salvato — vedere [Spostare più tabelle](./table-related-functions.md#moving-multiple-tables). Allo stesso modo, `Graph` lascia intatto il diagramma.  
L’elenco `Name View` è un’eccezione, e solo finché il [blocco](./settings.md#lock) `Name View` è disattivato: una scelta cambia allora la Visualizzazione nomi del diagramma, che viene salvata e cambia anche per i collaboratori. Finché il blocco è attivo, come per impostazione predefinita, una scelta cambia solo il proprio schermo. In entrambi i casi non aggiunge nulla alla cronologia delle modifiche.  
Una pressione su una card non aggiunge mai una relazione. Se si è lasciata la scheda ERD mentre se ne disegnava una, una pressione su una card ne sceglie la tabella come punto di partenza quando non ne è ancora stata scelta nessuna, e altrimenti pone fine al disegno.  
Il [pulsante della card](#card-buttons) del collegamento esterno va oltre, perché fa uscire dalla modalità Flusso: quando la scheda ERD deve scorrere fino alla tabella, quello scorrimento viene registrato come qualsiasi altra modifica della posizione della vista.

Le modifiche dei collaboratori continuano a raggiungere il diagramma mentre si è nella modalità Flusso, e le card seguono le tabelle e le relazioni che essi aggiungono o rimuovono — vedere [Come la modalità Flusso dispone le card](#how-flow-is-placed).  
I loro anelli di selezione e di focus vengono disegnati sulle card, ma i loro cursori e riquadri di trascinamento no — vedere [Modifica collaborativa](../../api/advanced/collaborative-editing.md).

Entrambe le modalità, focalizzazione e passi inclusi, funzionano anche in un editor [`readonly`](../../api/erd-editor-element.md#readonly), e lo stesso vale per l’elenco `Name View`, che lì cambia solo il proprio schermo.  
Nella scheda ERD di un editor di sola lettura il menu della tabella contiene solo `Table Properties` e una pressione non seleziona alcuna tabella, quindi la focalizzazione si fa con `Alt + F` (Windows/Linux) o `⌥ + F` (Mac) sulla tabella selezionata da un salto dal pannello [Esplora](./explorer.md#going-to-a-row) o dalla [Ricerca rapida](./quick-search.md).
