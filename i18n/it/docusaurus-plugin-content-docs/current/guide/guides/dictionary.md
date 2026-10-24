---
sidebar_position: 14
description: Conservare i domini, le parole e i termini del diagramma nella scheda Dizionario, derivare i nomi fisici dai nomi logici, lasciare che un dominio imposti il tipo di dati delle sue colonne, leggere ciò che rileva il foglio Controlli, modificare e ordinare i fogli come in un foglio di calcolo e importarli ed esportarli come file CSV.
---

# Dizionario

La scheda Dizionario contiene lo standard di denominazione del diagramma in tre dizionari, ciascuno in un foglio che si modifica come un foglio di calcolo:

- `Domains`: tipi di dati con un nome, come `Name` per `VARCHAR(100)`. Una colonna collegata a un dominio ne assume il tipo di dati.
- `Words`: le parole standard di cui sono composti i nomi logici, ciascuna con l’abbreviazione che un nome fisico usa per essa, come `Customer` e `CUST`.
- `Terms`: nomi logici completi, ciascuno con il nome fisico e il dominio che assegna, come `Customer Name` con `CUST_NM`.

Il [nome logico](./logical-names.md) di una tabella o di una colonna ne deriva il nome fisico da questi dizionari, e il termine di una colonna può anche collegarla a un dominio — vedere [Derivare i nomi fisici](#deriving-physical-names).  
Un quarto foglio, `Checks`, elenca ciò che i dizionari trovano di errato nei nomi e nei tipi del diagramma e nei dizionari stessi, come una parola vietata in un nome logico — vedere [Il foglio Controlli](#the-checks-sheet).

## Aprire la scheda {#opening-the-tab}

Passare alla scheda `Dictionary` nella barra degli strumenti, il pulsante con l’icona di un libro tra `Code Generator` e `Settings`, o scegliere `Dictionary` sotto `Tab` nella [Ricerca rapida](./quick-search.md).  
Può essere la scheda con cui si apre il diagramma — vedere `Canvas Type` in [Blocco](./settings.md#lock).

La scheda si apre sul foglio `Domains` finché non se ne sceglie un altro.  
Ogni volta che si apre, il foglio ritorna con la selezione e la posizione di scorrimento lasciate, o con la prima cella selezionata alla prima visita. La sua griglia riceve il focus della tastiera, quindi la digitazione o i tasti freccia agiscono subito.

Il foglio mostrato e, per ciascun foglio, la ricerca, la selezione, la posizione di scorrimento e le larghezze delle colonne riguardano solo l’utente.  
Niente di tutto ciò viene salvato nel file, registrato nella cronologia delle modifiche o condiviso con i collaboratori. Viene conservato finché l’editor resta aperto, anche cambiando scheda e caricando altri documenti nello stesso editor.

## I fogli {#the-sheets}

La barra in alto contiene i quattro pulsanti dei fogli, `Domains`, `Words`, `Terms` e `Checks`, e il pulsante del foglio mostrato appare premuto. Ciascuno mostra un conteggio accanto al nome: le righe contenute nel suo foglio, qualunque cosa mostri la ricerca, oppure, su `Checks`, il numero di controlli, colorato in base al loro livello — vedere [Il foglio Controlli](#the-checks-sheet).  
Segue il campo di ricerca — vedere [Ricerca](#searching). Alla fine della barra, su `Domains`, `Words` e `Terms` e non in un editor di sola lettura, si trovano quattro strumenti: `Add Row`, `Delete Rows`, `Import CSV` ed `Export CSV` — vedere [Aggiungere ed eliminare righe](#adding-and-deleting-rows) e [Importare ed esportare file CSV](#importing-and-exporting-csv).  
In un riquadro stretto o con una lingua di visualizzazione dai testi lunghi, la barra va a capo su più righe, così ogni pulsante resta raggiungibile.

Sotto la griglia, una riga di stato conta le righe lasciate dalla ricerca, come in `4 rows`, e, mentre la selezione copre almeno una riga, quante ne copre, come in `1 selected`. Una riga condivisa da due intervalli conta una volta sola, quindi quel numero indica quante righe rimuoverebbe `Delete Rows`.  
I numeri di riga sul lato sinistro contano le righe come le mostra il foglio, a partire da 1. Una cella di sola lettura, ovvero ogni cella su `Checks` e ogni cella in un editor di sola lettura, viene disegnata su uno sfondo grigio, tranne dove un controllo la contrassegna.  
Un foglio `Domains`, `Words` o `Terms` vuoto mostra `Import a CSV file or add a row`, tranne in un editor di sola lettura.

Le colonne di ciascun foglio, in ordine:

| Foglio | Colonne |
| --- | --- |
| `Domains` | `Domain`, `Category`, `Data Type`, `Description` |
| `Words` | `Word`, `Abbreviation`, `English Name`, `Description`, `Synonyms`, `Forbidden Words` |
| `Terms` | `Term`, `Physical Name`, `Domain`, `Description`, `Synonyms` |
| `Checks` | `Type`, `Target`, `Detail` |

Cosa fanno le celle:

- Il campo `Data Type` di un dominio si scrive come il tipo di una colonna, ad esempio `VARCHAR(100)` o `NUMERIC(15,2)`, e ogni colonna collegata al dominio lo assume — vedere [Domini e tipi di dati](#domains-and-data-types).
- Il campo `Abbreviation` di una parola è ciò che un nome fisico usa per quella parola — vedere [Dalle parole](#from-the-words).
- I campi `Synonyms` e `Forbidden Words` di una parola elencano altre parole per lo stesso concetto, separate da virgole. Da ogni elemento vengono rimossi gli spazi iniziali e finali, un elemento vuoto viene scartato e un elemento uguale alla parola stessa viene ignorato. Un nome logico che ne usa uno non compone alcun nome fisico, e il foglio `Checks` lo segnala e indica la parola da usare al suo posto — vedere [Cosa rileva ciascun controllo](#what-each-check-finds).
- Il campo `Term` di un termine è un nome logico completo, e il suo campo `Physical Name` è il nome che quel nome logico assegna — vedere [Da un termine](#from-a-term).
- Il campo `Domain` di un termine mostra il nome del dominio che collega, ed è vuoto finché non ne collega nessuno o collega un dominio poi rimosso — vedere [Il dominio di un termine](#a-terms-domain).
- `Category`, `English Name`, ogni `Description` e il campo `Synonyms` di un termine sono note. Non cambiano nulla e nessun controllo li legge.

In una [lingua di visualizzazione da destra a sinistra](./language-and-theme.md#right-to-left-languages), la barra, il menu della griglia e la riga di stato sono invertiti a specchio, mentre i fogli e l’elenco dei domini di un termine restano da sinistra a destra.

## Derivare i nomi fisici {#deriving-physical-names}

I dizionari possono assegnare a una tabella o a una colonna il suo nome fisico, il nome che scrivono Schema SQL e il Generatore di codice, a partire dal suo nome logico. Si cerca prima un termine il cui `Term` sia il nome logico; altrimenti il nome viene composto dalle abbreviazioni delle parole.  
Ad esempio, con le parole `Customer` (`CUST`), `Name` (`NM`), `Number` (`NO`), `Order` (`ORD`) e `Date` (`DT`), e il termine `Customer Number` con il nome fisico `CUST_NO` e il dominio `Number`, il cui tipo di dati è `INT`:

- Il nome logico `Customer Number` assegna a una colonna il nome `CUST_NO`, la collega a `Number` e le assegna il tipo `INT`.
- `Order Date` compone `ORD_DT`.
- Una tabella con il nome logico `Customer` prende il nome `CUST`.

Con un foglio `Words` vuoto e un foglio `Terms` vuoto, non viene derivato nulla.

### Quando un nome viene derivato {#when-a-name-is-derived}

Un nome fisico viene derivato quando si scrive un nome logico:

- Nell’area di disegno, quando l’editor della cella del nome logico si chiude su un nome logico diverso da quello con cui si era aperto, con `Enter`, `Tab`, `Escape` o un clic altrove. Ogni tasto digitato scrive solo il nome logico — vedere [Scrivere un nome logico](./logical-names.md#writing-a-logical-name).
- Subito, quando si sceglie un termine dall’elenco sotto la cella — vedere [Completare i nomi dei termini](./logical-names.md#completing-term-names).
- Quando un’operazione di incolla scrive una cella del nome logico — vedere [Copiare e incollare colonne](./table-editing.md#copyingpasting-columns).
- Quando [Trova e sostituisci](./find-and-replace.md#replacing) sostituisce un nome logico, una corrispondenza o tutte.
- Quando un agente di programmazione imposta un nome logico.

Viene derivato solo finché il nome fisico è vuoto o è stato a sua volta derivato — vedere [Nomi personalizzati](#names-of-your-own).  
La scelta di un termine, un’operazione di incolla o una sostituzione scrive il nome logico e ciò che ne deriva come un solo passo di annullamento. Nell’area di disegno, il nome derivato alla chiusura dell’editor è un passo a sé dopo la digitazione: il primo annullamento rimuove il nome derivato, insieme al dominio e al tipo portati da un termine, e lascia il nome logico digitato.

In seguito non viene derivato di nuovo nulla in modo automatico. Un nuovo valore nel campo `Abbreviation` di una parola o nel campo `Physical Name` o `Domain` di un termine, e nuove parole o nuovi termini, lasciano invariati i nomi già derivati; per questo, usare [Deriva di nuovo i nomi fisici](#derive-physical-names-again). Il campo `Data Type` di un dominio è l’eccezione: raggiunge subito le sue colonne.

### Da un termine {#from-a-term}

Nel foglio `Terms` si cerca prima un termine il cui `Term` sia uguale al nome logico. Gli spazi iniziali e finali e la composizione Unicode vengono ignorati, ma maiuscole e minuscole contano, quindi `customer number` non corrisponde a `Customer Number`. Tra due termini con lo stesso nome, conta il primo del foglio.

- Il termine assegna il suo `Physical Name` o, finché questo è vuoto, il nome composto dalle sue parole, come descritto sotto, se ne compongono uno.
- Per una colonna, il termine collega anche il suo `Domain`, finché il foglio `Domains` lo elenca, e questo assegna alla colonna il tipo di dati del dominio — vedere [Collegare una colonna](#linking-a-column). Lo fa anche quando il termine non assegna alcun nome. Un termine senza dominio non scollega nulla.
- Una tabella prende solo il nome fisico del termine.

### Dalle parole {#from-the-words}

Senza un termine corrispondente, le parole compongono il nome:

1. Il nome logico viene diviso in corrispondenza di spazi, `_`, `-`, `·` e `/`, e nessuna parola si estende oltre una divisione.
2. Ogni parte viene letta da sinistra, prendendo in ogni punto il testo più lungo elencato nel foglio `Words`, come `Word`, sinonimo o parola vietata, senza mai tornare indietro. Con le parole `가입`, `가입일` e `일자`, `가입일자` viene letto come `가입일` e `자`, lasciando `자` non registrato, mentre `가입 일자` viene letto come `가입` e `일자`. Maiuscole e minuscole contano: `member` non è la parola `Member`.
3. Il nome fisico è formato dai valori `Abbreviation` delle parole, così come sono stati digitati, uniti da `_`, come `ORD_DT`. Tra due parole con lo stesso nome, l’abbreviazione viene dalla prima del foglio. Non si applica alcun limite di lunghezza, e `Table Name Case` e `Column Name Case` del Generatore di codice non hanno alcun ruolo.

O tutto o niente. Se un segmento qualsiasi è un sinonimo, una parola vietata o un testo che nessuna parola elenca, o se una parola ha il campo `Abbreviation` vuoto, non viene composto alcun nome e il nome fisico resta invariato.

### Nomi personalizzati {#names-of-your-own}

I dizionari compilano un nome fisico solo finché è vuoto o è stato compilato da loro stessi. L’editor lo ricorda per ogni tabella e colonna, anche se nell’area di disegno nulla lo mostra.

- Un nome scritto dall’utente diventa personalizzato: la digitazione in una cella del nome, la sostituzione del nome di una tabella o di una colonna con Trova e sostituisci, un’operazione di incolla sulla cella del nome di una colonna e la ridenominazione da parte di un agente di programmazione. Un nome logico scritto in seguito lo lascia invariato, scrive solo il nome logico e non collega alcun dominio.
- Cancellare il nome lo restituisce ai dizionari, poiché un nome vuoto viene sempre derivato.
- Un nome logico che non deriva nulla lascia il nome fisico e il suo stato come erano: un nome vuoto resta vuoto, e un nome derivato non cambia e resta gestito dai dizionari.
- Una nuova tabella o colonna parte con un nome vuoto, quindi il suo primo nome logico lo deriva. Una colonna chiave esterna aggiunta da una relazione prende il nome dalla sua chiave, e quel nome conta come personalizzato — vedere [Nomi delle colonne chiave esterna](./relationship-editing.md#foreign-key-column-names).
- I nomi portati da un `Import` o da un `Import and Add` di Schema SQL, GraphQL, DBML o AML, e i nomi di un diagramma creato da una versione precedente alla scheda Dizionario, contano come personalizzati, quindi un nome logico scritto in seguito su di essi non deriva nulla.
- Una [tabella duplicata](./table-related-functions.md#duplicating-tables-and-memos), una colonna [spostata in un’altra tabella](./table-editing.md#rearranging-and-moving-columns) con la sua maniglia di trascinamento, un’operazione di incolla di tabelle copiate e un `Import and Add` di un file JSON mantengono lo stato di ogni nome. Le colonne incollate come nuove colonne nelle tabelle selezionate contano come personalizzate, a meno che il nome incollato sia vuoto e il loro nome logico ne derivi uno.
- [Deriva di nuovo i nomi fisici](#derive-physical-names-again) restituisce ai dizionari un nome personalizzato, compreso uno importato.

### Due colonne, un solo nome {#two-columns-one-name}

Una colonna non deriva nulla quando un’altra colonna della sua tabella ha già il nome che deriverebbe. Mantiene il suo nome, il suo stato e il suo collegamento a un dominio, e viene scritto solo il suo nome logico. I nomi vengono confrontati senza distinguere maiuscole e minuscole e senza gli spazi iniziali e finali, come per i nomi delle colonne chiave esterna.  
Quando una sola modifica darebbe lo stesso nome a due colonne, come può accadere con `Replace All` o `Derive Physical Names Again` su una tabella, lo prende la prima della tabella.  
Ad esempio, un autoriferimento su `members` con chiave `MBR_NO` aggiunge `MBR_NO_2`, che copia il nome logico `Member Number`. `Derive Physical Names Again` darebbe a questa colonna il nome `MBR_NO`, che appartiene già alla chiave, quindi mantiene `MBR_NO_2`.  
Per le tabelle non esiste una regola simile: due tabelle possono derivare lo stesso nome.

## Deriva di nuovo i nomi fisici {#derive-physical-names-again}

Usare `Derive Physical Names Again` dopo aver modificato il campo `Abbreviation` di una parola o il campo `Physical Name` o `Domain` di un termine, poiché queste modifiche da sole non rinominano nulla. Restituisce ai dizionari i nomi interessati e li deriva di nuovo secondo le regole descritte sopra, compresi i nomi scritti dall’utente. È disponibile solo nella scheda ERD, e non in un editor di sola lettura:

- Il menu contestuale della tabella, subito dopo `Focus on this table` o `Focus on selected tables`. Quando la tabella è una di due o più tabelle selezionate, `Derive Physical Names Again` le interessa tutte, in qualunque punto della tabella si faccia clic con il pulsante destro. Altrimenti, un clic con il pulsante destro sulla riga di una colonna offre `Derive Physical Name Again`, solo per quella colonna, e uno sull’intestazione offre `Derive Physical Names Again`, per il nome della tabella e ogni colonna.
- Il menu contestuale dell’area di disegno, subito dopo `Name View`: `Derive Physical Names Again`, per ogni tabella e colonna del diagramma. Non compare finché il diagramma non ha tabelle.
- La [Ricerca rapida](./quick-search.md#what-the-palette-lists), come voci per la colonna con il focus, la tabella con il focus, le tabelle selezionate e l’intero diagramma.

![Modifica dell’abbreviazione di Number da NO a NUM nel foglio Words, con i nomi fisici che restano MBR_NO e PAY_NO nel diagramma, poi Derive Physical Names Again dal menu dell’area di disegno che li trasforma in MBR_NUM e PAY_NUM, mentre ORD_NO, assegnato dal suo termine, resta invariato](/img/demo-derive-physical-names.webp)

Ogni tabella e colonna interessata che ha un nome logico viene derivata di nuovo. Una colonna prende anche il dominio assegnato dal suo termine, e con esso il tipo del dominio, che si propaga lungo le relazioni finché l’impostazione [Sincronizzazione tipo di dati nelle relazioni](./settings.md#relationship-datatype-sync) è attiva.  
Non tocca una tabella o una colonna senza nome logico, né una colonna il cui nuovo nome appartiene già a un’altra colonna della sua tabella — vedere [Due colonne, un solo nome](#two-columns-one-name). Ciascuna di queste mantiene il suo nome e il suo stato, personalizzato o gestito dai dizionari, e una colonna mantiene anche il suo collegamento a un dominio.  
Un nome logico che ora non deriva nulla lascia il nome fisico invariato, ma lo restituisce ai dizionari, quindi il prossimo nome logico scritto lo deriva.  
È un solo passo di annullamento, per quanti nomi, collegamenti e tipi modifichi. Non registra alcun passo solo quando non cambia nulla, e restituire ai dizionari un nome personalizzato conta come una modifica, anche quando il nome contiene già ciò che essi assegnano.

Il campo `Physical Name` proprio di un termine non viene ricomposto a partire dalle parole modificate, quindi modificare il termine prima di derivare di nuovo i nomi.

## Domini e tipi di dati {#domains-and-data-types}

Una colonna collegata a un dominio ha il `Data Type` del dominio. Collegare una colonna le assegna subito quel tipo.  
Quando il `Data Type` di un dominio cambia, che sia modificato, incollato o importato nel foglio `Domains` o cambiato da un collaboratore o da un agente di programmazione, ogni colonna collegata al dominio prende il nuovo tipo nello stesso passo. Finché l’impostazione [Sincronizzazione tipo di dati nelle relazioni](./settings.md#relationship-datatype-sync) è attiva, ciascuna di queste modifiche prosegue lungo le relazioni come fa una modifica digitata; quando è disattivata, cambiano solo le colonne collegate.  
Rinominare un dominio cambia solo il nome mostrato nelle celle Dominio delle colonne.

Un cambio di tipo effettuato nel foglio `Domains` si annulla lì, insieme ai tipi di colonna che ha assegnato — vedere [Fogli della scheda Dizionario](./undo-redo.md#dictionary-sheets).  
Un annullamento o una ripetizione nella scheda ERD che ricollega una colonna a un dominio, o che riporta una colonna collegata a un dominio, assegna alla colonna il tipo attuale del dominio. Se invece rimette un altro tipo, scollega la colonna.

### Collegare una colonna {#linking-a-column}

Una colonna viene collegata a un dominio tramite:

- La scelta del dominio nella cella Dominio della colonna, mostrata da View Option → `Domain`, o, nella vista `Logical Names`, nella cella del tipo che ne prende il posto — vedere [La cella Dominio](./logical-names.md#the-domain-cell).
- Un nome logico il cui termine assegna un dominio — vedere [Da un termine](#from-a-term). Questo avviene solo mentre il nome viene derivato, quindi non per un nome personalizzato né per una colonna il cui nome derivato appartiene già a un’altra colonna.
- `Derive Physical Name Again` o `Derive Physical Names Again`, che collega il dominio del termine di ciascuna colonna interessata.
- Una relazione: una colonna chiave esterna copia il dominio della sua chiave, insieme al tipo e al nome logico — vedere [Relazioni identificanti](./relationship-editing.md#identifying-relationships). Una chiave la cui copia riceve un altro tipo, come accade per una chiave seriale, non trasmette alcun dominio.
- La duplicazione della sua tabella o il suo spostamento in un’altra tabella con la sua maniglia di trascinamento, che mantengono entrambi il collegamento. Un’operazione di incolla di tabelle o colonne copiate lo mantiene solo se questo diagramma elenca il dominio e il dominio ha ancora il tipo della colonna copiata, quindi una copia da un altro diagramma arriva scollegata — vedere [Copiare e incollare tabelle e memo](./table-related-functions.md#copyingpasting-tables-and-memos). `Import and Add` non collega alcuna colonna.
- Il nome di un dominio incollato in una cella Dominio — vedere [Copiare e incollare colonne](./table-editing.md#copyingpasting-columns).

### Scollegamento {#unlinking}

- Digitare un tipo nella cella `DataType` di una colonna collegata, o accettare un suggerimento, scollega la colonna non appena il suo tipo differisce da quello del dominio, e la colonna mantiene il tipo digitato — vedere [Completamento automatico del tipo di dati](./table-editing.md#datatype-autocomplete). Digitare di nuovo il tipo del dominio non la ricollega; scegliere invece il dominio nella sua cella Dominio. Un’operazione di incolla sulla cella `DataType` e un cambio di tipo da parte di un agente di programmazione scollegano allo stesso modo.
- Finché l’impostazione Sincronizzazione tipo di dati nelle relazioni è attiva, ogni colonna raggiunta da un cambio di tipo il cui nuovo tipo differisce da quello del proprio dominio viene scollegata nello stesso passo, come una chiave esterna collegata a un proprio dominio. [Associa colonne](./relationship-editing.md#map-columns) scollega allo stesso modo le colonne di cui cambia il tipo.
- `None` nella cella Dominio scollega la colonna e ne mantiene il tipo.
- Cambiare o svuotare il campo `Domain` di un termine, o rimuovere un termine, non modifica alcuna colonna.

### Rimuovere un dominio {#removing-a-domain}

Rimuovere la riga di un dominio lascia le sue colonne con i loro tipi, e i loro collegamenti restano. Le colonne non mostrano alcun dominio, e il foglio `Checks` elenca `Unknown domain` per ciascuna di esse finché il foglio `Domains` contiene ancora un dominio. Annullare la rimozione nel foglio `Domains` mostra di nuovo i collegamenti.  
Finché il dominio è assente, digitare in una di queste colonne un tipo diverso da quello del dominio la scollega definitivamente, e lo stesso fa `None` nella sua cella Dominio.  
Al salvataggio, il file omette questi collegamenti, quindi il diagramma si riapre con quelle colonne scollegate.

Un termine collegato a un dominio rimosso mostra una cella `Domain` vuota, contrassegnata come `Unknown domain`. `Delete` o `Backspace` sulla cella lo scollega — vedere [Il dominio di un termine](#a-terms-domain).

## Il foglio Controlli {#the-checks-sheet}

Il foglio `Checks` elenca ciò che i controlli dei dizionari rilevano nei dizionari e nelle tabelle e colonne del diagramma. I controlli si limitano a leggere: non cambiano nulla.  
Ogni controllo viene eseguito solo finché il foglio che legge contiene una riga, e i controlli sulle parole solo finché il foglio `Words` contiene una parola con un nome, quindi un diagramma con i dizionari vuoti non elenca nulla.

![Customer Num disegnato in rosso e Order Stat in ambra nella vista Logical Names, il foglio Checks che elenca i loro tre controlli con un conteggio rosso, un doppio clic sulla riga Forbidden word che torna a Customer Num nel diagramma, e la sua riscrittura come Member Number, che lascia un solo controllo](/img/demo-dictionary-checks.webp)

Le sue tre colonne sono di sola lettura:

- `Type` indica il controllo — vedere [Cosa rileva ciascun controllo](#what-each-check-finds).
- `Target` indica una parola, un termine o un dominio con il suo nome, una tabella con il suo nome e una colonna come `table.column`, con la tabella e la colonna chiamate come le chiama la [Visualizzazione nomi](./logical-names.md#beyond-the-canvas), e `unnamed` dove la vista non mostra alcun nome.
- `Detail` mostra ciò che il controllo ha rilevato e, dopo `→`, ciò che i dizionari propongono al suo posto, più valori uniti da virgole, come `멤버 → 회원`. Un lato vuoto mostra `—`, come in `— → NUMERIC(15)`.

Prima vengono i controlli delle parole, poi quelli dei termini e dei domini, poi tabella per tabella, ciascuna tabella seguita dalle sue colonne.  
L’elenco segue ogni modifica appena viene applicata, comprese quelle di un collaboratore e di un agente di programmazione, e ogni cambio di vista.  
Il conteggio del pulsante `Checks` è rosso finché almeno un controllo è un errore, ambra finché sono tutti avvisi, e attenuato quando non ce n’è nessuno.

Le righe non si possono modificare, aggiungere, eliminare, ordinare, importare né esportare: la barra non mostra strumenti, un clic con il pulsante destro non apre il menu della griglia, e Annulla e Ripeti non hanno effetto. Ricerca, selezione e copia funzionano come negli altri fogli.

`Enter` o un doppio clic su una riga porta a ciò che la riga indica:

- Una parola, un termine o un dominio: la scheda mostra il suo foglio con selezionata la cella letta dal controllo, il nome o il campo `Domain` di un termine, e con la sua riga come prima riga visibile. La ricerca del foglio viene cancellata se nasconde la riga. Una riga nel frattempo rimossa non porta da nessuna parte.
- Una tabella o una colonna: compare la scheda ERD con la sola tabella selezionata e il focus sulla cella letta dal controllo. Si tratta del nome, del nome logico o della cella Dominio, oppure, dove la riga non disegna quella cella, della cella disegnata al suo posto. L’area di disegno riceve il focus della tastiera, e la vista si sposta secondo la regola di [Dove porta un salto](./table-related-functions.md#where-a-jump-lands).

Un doppio clic su un’intestazione, sul bordo di una colonna, su una barra di scorrimento o sotto le righe non porta da nessuna parte.  
Un agente di programmazione elenca gli stessi controlli, nello stesso ordine, con `erd_list_checks` — vedere [Controlli dei dizionari](../../mcp/tools.md#dictionary-checks).

Gli altri tre fogli contrassegnano le celle lette dai controlli, un nome o il campo `Domain` di un termine, con testo rosso o ambra su uno sfondo colorato:

- Rosso: un nome presente anche in un’altra riga del suo foglio, il campo `Domain` di un termine che collega un dominio rimosso e un `Term` che usa una parola vietata.
- Ambra: un `Term` che usa un sinonimo o una parola non registrata.

Una cella assume il più grave dei suoi livelli. Gli indicatori compaiono anche in un editor di sola lettura, e il foglio `Checks` stesso non è colorato. Per gli indicatori nell’area di disegno ERD, vedere [Indicatori nell’area di disegno](#marks-on-the-canvas).

### Cosa rileva ciascun controllo {#what-each-check-finds}

| `Type` | Livello | Rileva | `Detail`, ad esempio |
| --- | --- | --- | --- |
| `Duplicate name` | Errore | Un valore `Word`, `Term` o `Domain` presente anche in un’altra riga dello stesso foglio. Ciascuna delle righe viene elencata. | `Member` |
| `Unknown domain` | Errore | Una colonna o un termine ancora collegati a un dominio rimosso, finché il foglio `Domains` contiene un dominio | Il nome del dominio rimosso |
| `Forbidden word` | Errore | Un segmento di un nome logico o di un `Term` che una parola elenca nel suo campo `Forbidden Words` | `커스터머 → 고객` |
| `Unregistered word` | Avviso | Un segmento del nome logico di una tabella o di una colonna, o di un `Term`, che nessuna parola elenca | `자` |
| `Synonym` | Avviso | Un segmento che una parola elenca nel suo campo `Synonyms` | `멤버 → 회원` |
| `Physical name mismatch` | Avviso | Una tabella o una colonna il cui nome logico corrisponde a un termine ma il cui nome fisico non è quello assegnato dal termine | `mbr_no → MBR_NO` |
| `Domain type mismatch` | Avviso | Una colonna il cui `DataType` non è il `Data Type` del dominio a cui è collegata | `INT → NUMERIC(15)` |

- I nomi vengono confrontati senza gli spazi iniziali e finali, distinguendo maiuscole e minuscole, quindi `Member` e `member` sono due nomi diversi, e un nome vuoto non è mai un duplicato. I fogli rifiutano una modifica che darebbe lo stesso nome a due righe, quindi `Duplicate name` compare solo dove due modifiche si sono incrociate, come quando due collaboratori assegnano nomi alle righe nello stesso momento, o in un file modificato altrove.
- I controlli sulle parole leggono un nome come descritto in [Dalle parole](#from-the-words), ed elencano ogni segmento diverso una volta per nome. `Forbidden word` e `Synonym` propongono la parola che elenca il segmento.
- `Physical name mismatch` confronta il nome, senza gli spazi iniziali e finali, con il `Physical Name` del termine, o con ciò che compongono le sue parole quando non ne ha uno, e non segnala nulla finché il termine non assegna alcun nome. Una colonna chiave esterna che ha copiato il nome logico della sua chiave lo mostra ogni volta che il suo nome differisce da quello del termine, come `members_id → MBR_ID`. `Derive Physical Name Again` lo risolve, a meno che un’altra colonna abbia già quel nome.
- `Domain type mismatch` non è mai il risultato di modifiche fatte in un solo editor, poiché una colonna collegata finisce sempre con il tipo del suo dominio. Può comparire quando un collaboratore collega una colonna mentre un altro cambia il tipo di quel dominio, o in un file scritto altrove. Scegliere di nuovo il dominio nella cella Dominio della colonna assegna alla colonna il suo tipo, e `None` la scollega. Un collegamento a un dominio rimosso compare solo come `Unknown domain`.

### Indicatori nell’area di disegno {#marks-on-the-canvas}

L’area di disegno ERD scrive un nome segnalato dai controlli nel colore del suo controllo:

- Una cella del nome logico, nell’intestazione della tabella o nella riga di una colonna, è rossa finché il suo nome logico usa una parola vietata, e altrimenti ambra finché usa un sinonimo o una parola assente dal foglio `Words`.
- Una cella del nome fisico, nell’intestazione o in una riga, è ambra finché il termine a cui corrisponde il suo nome logico assegna un altro nome fisico.

Vengono contrassegnati solo questi due tipi di cella, mai la cella Dominio o `DataType`, quindi `Unknown domain` e `Domain type mismatch` di una colonna compaiono solo nel foglio `Checks`.  
Una cella viene contrassegnata solo per ciò che disegna: la vista `Physical Names` può contrassegnare solo i nomi fisici, `Logical Names` solo i nomi logici, e `Both Names` ogni cella in base ai suoi controlli — vedere [Visualizzazione nomi](./logical-names.md#name-view). Una cella vuota mantiene il colore del testo segnaposto, e i dizionari vuoti non contrassegnano nulla.  
Nell’intestazione di una tabella in un [gruppo di tabelle](./table-groups.md) colorato, un indicatore mantiene il suo colore solo finché resta leggibile sul colore del gruppo; altrimenti il nome prende il nero o il bianco propri dell’intestazione.

Gli indicatori compaiono nell’area di disegno ERD, nel [Viaggio nel tempo](./undo-redo.md#time-travel) e nell’anteprima del [Layout automatico](./table-related-functions.md#auto-layout), anche in un editor di sola lettura. La scheda Visualizzazione, i due lati del [Visualizzatore differenze](./table-related-functions.md#diff-viewer) e un’immagine esportata non ne disegnano alcuno.  
Seguono ogni modifica nel momento in cui avviene, che riguardi un nome o una parola, un termine o un dominio.

## Ricerca {#searching}

Il campo di ricerca mostra `Search` e compare in tutti e quattro i fogli, anche in un editor di sola lettura. Ogni foglio ha la propria ricerca.  
Una riga corrisponde quando una delle celle in cui si cerca contiene il testo, senza distinguere maiuscole e minuscole né la composizione Unicode e ignorando gli spazi attorno al testo di ricerca. Una corrispondenza non si estende mai su due celle. Le celle in cui si cerca:

- `Domains`: `Domain`, `Data Type` e `Description`.
- `Words`: `Word`, `Abbreviation`, `English Name` e `Description`.
- `Terms`: `Term`, `Physical Name` e `Description`.
- `Checks`: tutte e tre, come appaiono nella lingua di visualizzazione.

Una nuova ricerca porta la selezione sulla prima cella e scorre fino in cima.  
Finché il campo contiene testo, un pulsante `x` con il tooltip `Clear search` lo svuota e lascia il punto di inserimento nel campo. Anche `Escape` nel campo lo svuota.  
Nel campo, `Ctrl + Z` (Windows/Linux) o `⌘ + Z` (Mac) annulla la digitazione, non il foglio, e i tasti per le righe di [Aggiungere ed eliminare righe](#adding-and-deleting-rows) sono tasti di testo.  
`Add Row` e gli inserimenti cancellano prima la ricerca, poiché una riga vuota non corrisponde ad alcuna ricerca. Un’importazione la mantiene.

## Selezione e spostamento {#selecting-and-moving}

La griglia seleziona come fa un foglio di calcolo:

- Un clic seleziona una cella, e un trascinamento seleziona un intervallo e fa scorrere il foglio quando ne raggiunge il bordo. `Shift + click` estende la selezione dalla cella attiva, e `Ctrl + click` (Windows/Linux) o `⌘ + click` (Mac) aggiunge un altro intervallo.
- Un’intestazione di colonna seleziona la sua colonna, un numero di riga la sua riga, e l’angolo in alto a sinistra ogni cella, come fa `Ctrl + A` (Windows/Linux) o `⌘ + A` (Mac).
- Su un Mac, `Ctrl + click` equivale a un clic con il pulsante destro — vedere [Il menu della griglia](#the-grids-menu).

Con la tastiera:

- I tasti freccia portano alla cella adiacente e, tenendo premuto `Ctrl` (Windows/Linux) o `⌘` (Mac), al bordo del foglio in quella direzione.
- `Home` e `End` vanno alla prima e all’ultima cella della riga e, tenendo premuto `Ctrl` o `⌘`, alla prima e all’ultima cella del foglio.
- `Page Up` e `Page Down` spostano la selezione di una schermata di righe.
- Tenendo premuto `Shift` con uno qualsiasi dei tasti precedenti, si estende invece la selezione.
- `Tab` e `Shift + Tab` portano a destra e a sinistra, e `Shift + Enter` verso l’alto. `Enter` da solo modifica la cella — vedere [Modificare le celle](#editing-cells).

Quando le righe sotto la selezione scompaiono, per un annullamento o una rimozione da parte di un collaboratore, la selezione viene riportata all’interno delle righe rimaste.

Trascinare il bordo destro di un’intestazione di colonna per ridimensionare la colonna, o fare doppio clic sul bordo per adattare la colonna al testo più largo nelle righe visibili. Nessun tasto ridimensiona una colonna.

## Modificare le celle {#editing-cells}

Digitare sulla cella selezionata ne sostituisce il valore. `Enter`, `F2` o un doppio clic modifica il valore così com’è, con il punto di inserimento alla fine.  
Una cella contiene una sola riga, quindi una tabulazione o un a capo incollati al suo interno diventano uno spazio.

- `Enter` scrive la modifica e passa alla cella sotto, e `Tab` la scrive e passa alla cella a destra. Con `Shift`, passano alla cella sopra o a sinistra.
- Anche un clic altrove, o il focus della tastiera che lascia la griglia, la scrive.
- `Escape` la annulla.

![Modifica del foglio Words: digitazione di NUM su una cella e pressione di Enter, inserimento di una riga con ⌥ + Enter e compilazione con Tab, ordinamento per Word dal menu della griglia, poi ricerca di ord e svuotamento della ricerca con Esc](/img/demo-dictionary-editing.webp)

Una modifica che lascia il valore com’era non scrive nulla, e una modifica scritta è un solo passo di annullamento del suo foglio, per quanto testo sia stato digitato.  
`Delete` o `Backspace`, senza alcuna modifica aperta, svuota ogni cella selezionata, come un solo passo.  
Mentre una modifica è aperta, i tasti per annullare e ripetere annullano e ripetono la digitazione nella cella, e i tasti per le righe digitano testo — vedere [Tasti nella scheda](#keys-on-the-tab).  
Ogni cella su `Checks`, e ogni cella in un editor di sola lettura, è di sola lettura e non apre alcuna modifica.

Quando viene rifiutata anche una sola riga di una modifica, di un’operazione di incolla o di uno svuotamento, non ne viene salvato nulla, e una notifica di errore ne indica il motivo, contando le righe e indicando le prime tre:

- Un nome già presente in un’altra riga del foglio, o scritto da un’altra riga della stessa operazione di incolla: `Nothing saved: 1 row shares a name with another row (Member)` o `Nothing saved: 2 rows share a name with another row (…)`. I nomi vengono confrontati senza gli spazi iniziali e finali, distinguendo maiuscole e minuscole, quindi `Member` e `member` sono diversi. Un nome vuoto non viene mai rifiutato.
- Il campo `Domain` di un termine compilato con un testo che non è il nome di alcun dominio del foglio `Domains`: `Nothing saved: 1 row names an unknown domain (…)`.
- Una riga che un collaboratore ha rimosso durante la modifica: `Nothing saved: the row was removed`.

Una scrittura può estendersi oltre la sua cella:

- Un termine che riceve un `Term` mentre il suo `Physical Name` è vuoto ottiene il nome composto dalle sue parole, se ne compongono uno — vedere [Dalle parole](#from-the-words). Questo avviene una sola volta: il nome non viene ricomposto quando in seguito le parole cambiano.
- Un nuovo valore nel campo `Data Type` di un dominio cambia il tipo di ogni colonna collegata al dominio, nello stesso passo di annullamento — vedere [Domini e tipi di dati](#domains-and-data-types).

### Il dominio di un termine {#a-terms-domain}

`Enter`, `F2` o un doppio clic sulla cella `Domain` di un termine apre un elenco sotto la cella, o sopra di essa dove c’è più spazio, con un campo di ricerca che mostra `Domain`.  
L’elenco contiene `None`, poi ogni dominio con un nome nell’ordine del foglio `Domains`, e l’evidenziazione parte dal dominio collegato dal termine, o da `None`. Digitare un carattere sulla cella apre l’elenco già filtrato da quel carattere.

- La digitazione restringe l’elenco ai domini il cui nome contiene il testo, senza distinguere maiuscole e minuscole, elimina `None` ed evidenzia la prima corrispondenza.
- `↑` e `↓` spostano l’evidenziazione, ricominciando dall’altro capo quando raggiungono un’estremità.
- `Enter` o `Tab` sceglie la riga evidenziata, e un clic sceglie la riga su cui si fa clic, come un solo passo di annullamento. Il termine collega proprio il dominio scelto, anche uno di due domini con lo stesso nome, e `None` lo scollega.
- `Escape` o un clic all’esterno chiude l’elenco senza scrivere nulla di quanto digitato.

Se il foglio `Domains` non ha alcun dominio con un nome, il campo si apre senza elenco.  
Il testo incollato collega il primo dominio elencato con quel nome, un testo vuoto scollega, e un testo uguale a ciò che mostra la cella lascia invariato il collegamento. Qualsiasi altro nome viene rifiutato — vedere [Modificare le celle](#editing-cells). `Delete` o `Backspace` sulla cella scollega il termine, anche da un dominio rimosso.

## Copia e incolla {#copying-and-pasting}

`Ctrl + C` (Windows/Linux) o `⌘ + C` (Mac) copia la selezione come testo separato da tabulazioni, una riga di testo per ogni riga, come lo scrivono i fogli di calcolo, quindi si incolla in un foglio di calcolo come celle. Una tabulazione o un a capo all’interno di un valore diventa uno spazio.  
Più intervalli si copiano insieme solo quando coprono le stesse righe, affiancati, o le stesse colonne, uno sopra l’altro. Altrimenti non viene copiato nulla e compare la notifica di errore `Nothing copied: the ranges share no rows or columns`.

`Ctrl + V` (Windows/Linux) o `⌘ + V` (Mac) incolla testo separato da tabulazioni, come celle copiate da un foglio di calcolo, a partire dalla cella attiva verso il basso e verso destra:

- Le virgolette vengono incollate come testo, quindi una cella di un foglio di calcolo che contiene un a capo non si incolla come una sola cella.
- Un singolo valore riempie ogni intervallo selezionato.
- Le righe oltre l’ultima riga vengono aggiunte come nuove righe, in ordine, quindi incollare in un foglio vuoto lo riempie.
- Le colonne oltre l’ultima colonna vengono omesse e, una volta salvato il resto, lo segnala la notifica `Columns past the last one weren't pasted`.
- Un’operazione di incolla di più celle seleziona poi il blocco che ha scritto.

Un’operazione di incolla è un solo passo di annullamento, comprese le righe che aggiunge, e viene rifiutata per intero in caso di nome duplicato o di dominio sconosciuto — vedere [Modificare le celle](#editing-cells).  
Una copia, un’operazione di incolla o uno svuotamento su più di un milione di celle non ha effetto, e compare la notifica di errore `Nothing done: the selection covers too many cells`.  
Taglia, `Ctrl + X` (Windows/Linux) o `⌘ + X` (Mac), non ha effetto su un foglio. Copia e incolla in questa scheda non raggiungono mai il diagramma e, mentre è aperta la modifica di una cella, agiscono sul testo della cella.

## Aggiungere ed eliminare righe {#adding-and-deleting-rows}

`Add Row` aggiunge una riga vuota alla fine del foglio. Cancella la ricerca, seleziona la prima cella della nuova riga e dà il focus della tastiera alla griglia, quindi la digitazione riempie quella cella.  
`Delete Rows` rimuove ogni riga coperta dalla selezione, in qualsiasi colonna, e un solo annullamento le rimette tutte al loro posto. Il suo tooltip indica il tasto che fa lo stesso.

Con il focus della tastiera nella griglia e nessuna cella in modifica:

- `Alt + Enter` (Windows/Linux) o `⌥ + Enter` (Mac) inserisce sotto la selezione tante righe vuote quante ne copre.
- `Alt + Shift + Enter` (Windows/Linux) o `⌥ + Shift + Enter` (Mac) le inserisce sopra.
- `Alt + Backspace` o `Alt + Delete` (Windows/Linux), o `⌥ + Backspace` o `⌥ + Delete` (Mac), elimina le righe coperte dalla selezione.

Fanno ciò che fanno le voci di inserimento ed eliminazione delle righe del menu della griglia — vedere [Il menu della griglia](#the-grids-menu). Un inserimento cancella la ricerca e mette le nuove righe subito sopra la prima riga coperta dalla selezione, o subito sotto l’ultima. Le seleziona nella prima colonna, con la prima di esse attiva, ed è un solo passo di annullamento.

Questi tasti sono le associazioni `Add Column` e `Remove Column` della scheda [Tasti di scelta rapida](./settings.md#shortcuts), quindi un host che le riassegna con [`setKeyBindingMap`](../../api/erd-editor-element.md#setkeybindingmap) sposta anche questi. `Alt + Shift + Enter` è il tasto di `Add Column` con l’aggiunta di `Shift`, e lì non ha una riga propria.  
In una modifica aperta e nel campo di ricerca sono tasti di testo, quindi su un Mac `⌥ + Backspace` elimina una parola. Su `Checks` e in un editor di sola lettura non hanno effetto. In questa scheda non aggiungono né rimuovono mai la colonna di una tabella.  
In Obsidian raggiungono la scheda anche dove un tasto di scelta rapida di Obsidian usa lo stesso tasto.

Una riga mai compilata, o svuotata di ogni valore, compare nel suo foglio e raggiunge i collaboratori, ma il file la omette, quindi scompare quando il diagramma viene riaperto.

## Il menu della griglia {#the-grids-menu}

Fare clic con il pulsante destro su una cella di `Domains`, `Words` o `Terms` per aprire il menu della griglia. Una cella fuori dalla selezione diventa prima la selezione.  
Un clic con il pulsante destro sotto l’ultima riga o a destra dell’ultima colonna lo apre sulla selezione così com’è, quindi in un foglio vuoto si apre in qualsiasi punto sotto le intestazioni. Il tasto menu o `Shift + F10` lo apre per la cella attiva.

- `Insert 1 row above`, `Insert 1 row below` e `Delete 1 row`, ciascuna con il conteggio delle righe coperte dalla selezione, come in `Insert 3 rows above`, e con il suo tasto a destra — vedere [Aggiungere ed eliminare righe](#adding-and-deleting-rows).
- `Sort by <column>, ascending` e `Sort by <column>, descending`, che indicano la colonna su cui si è fatto clic con il pulsante destro, come in `Sort by Word, ascending` — vedere [Ordinamento](#sorting). Non compaiono a destra dell’ultima colonna.
- `Import CSV` ed `Export CSV`, che fanno ciò che fanno i pulsanti della barra — vedere [Importare ed esportare file CSV](#importing-and-exporting-csv).

Quando non è visibile alcuna riga, in un foglio vuoto o con una ricerca che non trova corrispondenze, compaiono solo `Insert 1 row below`, `Import CSV` ed `Export CSV`.  
`Checks` e un editor di sola lettura aprono invece il menu del browser, e lo stesso fa un clic con il pulsante destro su un’intestazione o su una barra di scorrimento.  
Il menu si chiude con una scelta, con `Escape`, con una pressione altrove nella scheda, quando cambiano la selezione o il foglio, e quando cambiano le righe del foglio, per una modifica dell’utente o di un collaboratore.

## Ordinamento {#sorting}

`Sort by <column>, ascending` e `Sort by <column>, descending` riordinano le righe stesse del foglio, non solo la vista. Il nuovo ordine viene salvato nel file, visto dai collaboratori e seguito da `Export CSV`, e un solo annullamento ripristina l’ordine precedente.  
Le righe vengono confrontate in base al testo mostrato dalla cella, il campo `Domain` di un termine in base al nome del dominio, nell’ordine alfabetico della lingua di visualizzazione, con i numeri confrontati per valore, quindi `2` viene prima di `10`. Le celle vuote vanno in fondo in entrambi i casi, e le righe equivalenti mantengono il loro ordine. Ordinare un foglio già in quell’ordine non registra nulla.  
La ricerca resta com’era, e così la selezione, le cui celle ora contengono altre righe.

## Importare ed esportare file CSV {#importing-and-exporting-csv}

Ciascuno dei fogli `Domains`, `Words` e `Terms` si importa da un file CSV e si esporta in un file CSV. Questi file sono propri della scheda Dizionario: `Import` ed `Export` del menu contestuale dell’area di disegno non li leggono né li scrivono — vedere [Importare o esportare file](./file-import-export.md).

### Importazione {#importing}

`Import CSV`, nella barra o nel menu della griglia, apre il selettore di file del browser per i file `.csv`, non la finestra di dialogo di importazione dell’host. Scegliere di nuovo lo stesso file lo importa di nuovo.  
Il file va nel dizionario indicato dalla sua intestazione, qualunque foglio sia mostrato, e la scheda mostra poi quel foglio e dà il focus della tastiera alla sua griglia. Il foglio mantiene la ricerca, la selezione e la posizione di scorrimento, quindi le righe nascoste dalla ricerca, o le righe aggiunte sotto la parte visibile, restano fuori vista.  
Il file viene letto come UTF-8, con o senza indicatore dell’ordine dei byte, o come EUC-KR quando non è UTF-8 valido, come accade per i file meno recenti dello standard coreano dei dati pubblici.

![Apertura della scheda Dizionario dalla barra degli strumenti, poi importazione di domini, parole e termini con Import CSV, con ogni file che porta la scheda sul proprio foglio e riporta ciò che ha aggiunto](/img/demo-dictionary-import.webp)

Come vengono applicate le righe:

- Ogni riga con un nome aggiorna la riga del foglio con quel nome, nei campi per cui il file ha colonne. Le colonne assenti dal file lasciano invariati i rispettivi campi. I nomi vengono confrontati senza gli spazi iniziali e finali, distinguendo maiuscole e minuscole.
- I nomi assenti dal foglio vengono aggiunti dopo la sua ultima riga, nell’ordine del file.
- Un’importazione non rimuove mai una riga.
- Una riga con un nome vuoto viene saltata. Quando il file contiene due volte un nome, prevale la riga successiva e quella precedente conta come saltata. Le righe vuote del file non contano come righe.
- Il dominio di un termine viene trovato in base al nome, come il primo dominio con quel nome, e un nome che nessun dominio ha lascia il termine scollegato, quindi importare prima i domini.

Un’importazione è un solo passo di annullamento di quel foglio.  
La notifica mostra poi, ad esempio, `1 added · 1 updated · 2 skipped`. Una riga identica a quella del foglio non conta né come aggiunta né come aggiornata, quindi importare di nuovo lo stesso file non cambia nulla e non registra alcun passo.  
Se i termini del file indicano domini assenti dal diagramma, una seconda riga indica i primi tre, come in `4 unknown domains: 연월일, 금액, 번호`.  
Un file la cui intestazione non corrisponde ad alcuna struttura, o corrisponde a due, non importa nulla, e compare la notifica di errore `Couldn't read this file as words, terms or domains`.

### Strutture dei file {#file-layouts}

Ogni dizionario legge due strutture. La prima è la struttura propria dell’editor, che `Export CSV` scrive, con i nomi dei campi come intestazione:

| Dizionario | Intestazione | Un file richiede |
| --- | --- | --- |
| Parole | `name,abbreviation,englishName,description,synonyms,forbiddenWords` | `name`, `abbreviation` |
| Termini | `name,physicalName,domain,description,synonyms` | `name`, `physicalName` |
| Domini | `name,category,dataType,description` | `name`, `dataType` |

Le colonne possono comparire in qualsiasi ordine, la colonna `domain` di un termine contiene il nome del dominio, e qualsiasi altra colonna viene ignorata. Nell’intestazione maiuscole e minuscole contano, e le celle vengono lette esattamente come sono scritte, spazi compresi.

La seconda è la struttura dei file dello standard coreano dei dati pubblici (공통표준):

| Dizionario | Un file richiede | Letti anche |
| --- | --- | --- |
| Parole | `공통표준단어명` | `공통표준단어영문약어명` (abbreviazione), `공통표준단어 영문명` (nome in inglese), `공통표준단어 설명` (descrizione), `이음동의어 목록` (sinonimi), `금칙어 목록` (parole vietate) |
| Termini | `공통표준용어명` | `공통표준용어영문약어명` (nome fisico), `공통표준도메인명` (dominio, per nome), `공통표준용어설명` (descrizione), `용어 이음동의어 목록` (sinonimi) |
| Domini | `공통표준도메인명`, `데이터타입` | `공통표준도메인분류명` (categoria), `공통표준도메인설명` (descrizione), `데이터길이`, `데이터소수점길이` |

`데이터타입`, `데이터길이` e `데이터소수점길이` di un dominio si uniscono in un unico tipo di dati: `NUMERIC(15,2)`, `CHAR(8)`, il solo tipo dove non c’è lunghezza, come `DATE`, e una scala pari a 0 omessa, come in `NUMERIC(15)`.  
In questi file dalle celle vengono rimossi gli spazi iniziali e finali, e le altre colonne, come la cronologia delle revisioni, vengono ignorate.  
In entrambe le strutture, gli spazi nel nome di un’intestazione non contano.

### Esportazione {#exporting}

`Export CSV`, nella barra o nel menu della griglia, salva il foglio mostrato nella struttura propria dell’editor: ogni riga nell’ordine del foglio, qualunque cosa mostri la ricerca, con il dominio di un termine scritto con il suo nome, o lasciato vuoto per un dominio rimosso.  
Il file è in UTF-8 con indicatore dell’ordine dei byte e terminatori di riga CRLF, e solo un campo che contiene virgolette, una virgola o un a capo viene racchiuso tra virgolette. Si apre in un foglio di calcolo e, reimportato, restituisce le stesse righe.  
Si chiama `<database name>-<timestamp>-words.csv`, `-terms.csv` o `-domains.csv`, e viene salvato come le altre esportazioni dell’editor — vedere [Esportazione](./file-import-export.md#exporting).

`Checks` non ha esportazione, e un editor di sola lettura non offre né importazione né esportazione.

## Annulla e Ripeti {#undo-and-redo}

`Domains`, `Words` e `Terms` hanno ciascuno una cronologia delle modifiche propria, separata da quella del diagramma. In questa scheda, `Ctrl + Z` e `Ctrl + Shift + Z` (Windows/Linux) o `⌘ + Z` e `⌘ + Shift + Z` (Mac), e `Undo` e `Redo` della barra degli strumenti, agiscono sul foglio mostrato, e la barra degli strumenti non mostra `Time Travel`. Su `Checks` non hanno effetto.  
Annulla nella scheda ERD non annulla mai la modifica di un foglio — vedere [Fogli della scheda Dizionario](./undo-redo.md#dictionary-sheets).

## Tasti nella scheda {#keys-on-the-tab}

Mentre il focus della tastiera è nella scheda, agiscono questi tasti di scelta rapida dell’editor — vedere [Tasti di scelta rapida](./settings.md#shortcuts):

- `Search`, `Ctrl + K` (Windows/Linux) o `⌘ + K` (Mac), apre la [Ricerca rapida](./quick-search.md).
- `Toggle Explorer`, `Ctrl + F` (Windows/Linux) o `⌘ + F` (Mac), passa alla scheda ERD e apre il pannello [Esplora](./explorer.md#opening-and-closing) sulla sua ricerca.
- `Undo` e `Redo` agiscono sul foglio mostrato — vedere [Annulla e Ripeti](#undo-and-redo).
- `Add Column` e `Remove Column` inseriscono ed eliminano righe — vedere [Aggiungere ed eliminare righe](#adding-and-deleting-rows).

Mentre è aperta la modifica di una cella, compreso l’elenco dei domini di un termine, `Search` e `Toggle Explorer` non hanno effetto, così il testo digitato non va perso.

Ogni altro tasto di scelta rapida dell’editor resta nella scheda e non raggiunge mai l’area di disegno: `Alt + N` (Windows/Linux) o `⌥ + N` (Mac) non aggiunge alcuna tabella, e `Delete` e `Backspace` non eliminano nulla nell’area di disegno.  
Agiscono invece sul foglio i tasti propri della griglia: `Enter` modifica la cella, `Delete` e `Backspace` svuotano le celle selezionate, `Ctrl + A` (Windows/Linux) o `⌘ + A` (Mac) seleziona ogni cella, ed `Escape` annulla una modifica, chiude il menu della griglia o svuota il campo di ricerca. Anche copia, taglia e incolla restano nella scheda — vedere [Copia e incolla](#copying-and-pasting).

## Editor di sola lettura {#read-only-editors}

In un editor [`readonly`](../../api/erd-editor-element.md#readonly) la scheda si apre e mostra ogni foglio.  
Cambiare foglio, cercare, selezionare, scorrere, ridimensionare le colonne e copiare funzionano come di consueto, e così anche andare a un controllo da `Checks` con `Enter` o un doppio clic. Compaiono anche gli indicatori dei controlli.

Nessuna cella accetta una modifica, un’operazione di incolla o uno svuotamento, e ogni cella che nessun controllo contrassegna viene disegnata sullo sfondo grigio di sola lettura.  
`Add Row`, `Delete Rows`, `Import CSV` ed `Export CSV` sono nascosti, i tasti per le righe non hanno effetto, e un clic con il pulsante destro apre il menu del browser. Un foglio vuoto non mostra alcun suggerimento, e la barra degli strumenti non mostra `Undo` né `Redo`.

## Collaboratori e file {#collaborators-and-the-file}

Il file del diagramma contiene le parole, i termini e i domini nell’ordine dei loro fogli, compreso quello dato da un ordinamento, e omette una riga che non contiene alcun valore.  
Contiene anche il nome logico di ogni tabella e colonna, se ogni nome fisico è gestito dai dizionari, e il collegamento a un dominio di ogni colonna finché il dominio è elencato. I controlli e gli indicatori vengono ricavati da questi dati e non vengono mai salvati.

In una [sessione collaborativa](../../api/advanced/collaborative-editing.md), ciascun editor vede le modifiche che gli altri apportano ai dizionari appena vengono applicate, ordinamenti e inserimenti compresi. Ciascuno mantiene il proprio foglio, la propria ricerca e la propria selezione, e le cronologie dei suoi fogli contengono solo le sue modifiche.  
Una modifica o un’operazione di incolla su una riga che nel frattempo un collaboratore ha rimosso non salva nulla, e compare la notifica `Nothing saved: the row was removed`.  
Un editor di una versione precedente alla scheda Dizionario salva il diagramma senza i suoi nomi logici, i collegamenti ai domini e i dizionari — vedere [Combinare versioni diverse](../../api/advanced/collaborative-editing.md#mixing-releases).

Un `Import` di Schema SQL, GraphQL, DBML o AML mantiene i dizionari, un `Import` di JSON li sostituisce con quelli del file, e `Import and Add` non ne porta alcuno — vedere [Importare file esterni](./file-import-export.md#importing-external-files).  
Un agente di programmazione modifica le parole, i termini e i domini, imposta nomi logici e domini, deriva di nuovo i nomi fisici ed elenca i controlli tramite il server MCP — vedere [Dizionari](../../mcp/tools.md#dictionaries) e [Controlli dei dizionari](../../mcp/tools.md#dictionary-checks). Non ha alcuno strumento per i file CSV.
