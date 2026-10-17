---
sidebar_position: 14
description: Sincronizzazione del tipo di dati nelle relazioni, larghezza massima dei commenti, ricalcolo della larghezza delle tabelle, blocco delle impostazioni (vista, scheda e impostazioni del codice), ordine di visualizzazione delle colonne ed elenco dei tasti di scelta rapida.
---

# Impostazioni

Si apre con il pulsante `Settings` nella barra degli strumenti, oppure dalla [Ricerca rapida](./quick-search.md) sotto `Tab`.
La schermata Impostazioni ha due schede: `Preferences` e `Shortcuts`. Per prima si apre `Preferences`, tranne quando si arriva dalla voce `Shortcuts` della [schermata di benvenuto](./editing-start.md#welcome-screen), che apre `Shortcuts`.

Il tema e la lingua di visualizzazione non si trovano in questa schermata. Si aprono con i pulsanti `Theme` e `Display Language` della barra degli strumenti — vedere [Lingua e tema](./language-and-theme.md).

## Sincronizzazione tipo di dati nelle relazioni {#relationship-datatype-sync}

Determina se sincronizzare i tipi di dati. È attiva per impostazione predefinita.
Il tipo di dati modificato in una colonna viene quindi applicato a ogni colonna collegata a essa da una relazione, seguendo la catena da entrambe le estremità, così una chiave esterna non si discosta mai dalla chiave a cui fa riferimento.
Da una chiave alle sue chiavi esterne, un tipo serial arriva come il tipo intero che memorizza, come avviene quando si disegna una relazione — vedere [Relazioni identificanti](./relationship-editing.md#identifying-relationships). Così, cambiare una chiave in `serial` dà alle sue chiavi esterne `integer` con PostgreSQL, e da lì la modifica prosegue lungo la catena.
In senso inverso, da una chiave esterna alla sua chiave, il tipo arriva così com’è scritto, con un’eccezione: una chiave serial mantiene il proprio tipo e la modifica si ferma lì.
Anche [Associa colonne](./relationship-editing.md#map-columns) segue questa impostazione: mentre è attiva, ogni colonna esistente che associa assume il tipo che la sua chiave padre dà a una chiave esterna, e la modifica prosegue lungo le relazioni come sopra. Mentre è disattivata, o quando la chiave non ha un tipo di dati, la colonna mantiene il proprio.

<img src="/img/settings-relationship-data-type-sync.png" width="290" alt="Impostazione di sincronizzazione del tipo di dati nelle relazioni" loading="lazy" />

![Modifica di members.id in BIGINT UNSIGNED, che aggiorna ogni member_id collegato a questa colonna](/img/demo-relationship-data-type-sync.webp)

## Larghezza massima commenti {#maximum-comment-width}

Specifica la larghezza massima della colonna dei commenti in pixel (`60` ~ `200`).
Disattivare l’interruttore rimuove il limite, e il campo è disabilitato finché l’interruttore resta disattivato.
Quando lo si attiva, il valore iniziale è `60px`. Un valore digitato fuori dall’intervallo viene riportato all’estremo più vicino.

![Attivazione di Maximum comment width, inserimento di 120 e la scheda ERD che mostra i commenti troncati a quella larghezza](/img/demo-settings-comment-width.webp)

## Ricalcolo larghezza tabelle {#recalculation-table-width}

Premere `Sync` per ricalcolare la larghezza di ogni tabella e di ogni cella di colonna in base al testo attuale, e per ridisegnare i connettori delle relazioni attorno alle nuove dimensioni.
Lo conferma la notifica `Recalculated table width`.
Le larghezze vengono ricalcolate automaticamente ogni volta che si carica un documento, quindi serve solo quando un cambio di font o di rendering le ha rese obsolete.
Le larghezze non vengono salvate nel file, quindi `Sync` non lo modifica mai.

## Blocco {#lock}

L’elenco `Lock` contiene sei impostazioni. Mentre il blocco di un’impostazione è attivo, il file conserva il valore che questa aveva al momento del blocco, quindi modificarla sullo schermo lascia il file com’era.

| Riga | Cosa conserva il file | In un nuovo diagramma |
| --- | --- | --- |
| `Viewport` | Il livello di zoom e la posizione della vista dell’area di disegno ERD, con un unico blocco | `100% · 0, 0` |
| `Canvas Type` | La scheda su cui si apre il diagramma: `ERD`, `Visualization`, `Schema SQL` o `Code Generator` | `ERD` |
| `Language` | Il linguaggio del [Generatore di codice](./code-generator.md#language) | `GraphQL` |
| `Table Name Case` | Lo [stile dei nomi delle tabelle](./code-generator.md#name-case) del Generatore di codice | `Pascal` |
| `Column Name Case` | Lo [stile dei nomi delle colonne](./code-generator.md#name-case) del Generatore di codice | `Camel` |
| `Bracket Type` | L’opzione `Bracket` della scheda [Schema SQL](./schema-sql.md#database-and-bracket) e delle destinazioni del [Generatore di codice](./code-generator.md#bracket) che la offrono | `None` |

Ogni riga mostra un valore e un pulsante di blocco, e un clic sul pulsante attiva o disattiva solo quel blocco.
Mentre un blocco è attivo, il pulsante mostra un lucchetto chiuso con il tooltip `Unlock Viewport` (e così via per ogni riga), e il valore, con il tooltip `Locked value`, è quello che il file conserva.
Mentre è disattivato, il pulsante mostra un lucchetto aperto con il tooltip `Lock Viewport`, e il valore, attenuato, con il tooltip `Current value`, è l’impostazione così com’è al momento.
`Viewport` mostra lo zoom e poi la posizione della vista, come `75% · -40, 91`. La posizione della vista è il punto dello schermo, in pixel, in cui si trova lo `0, 0` del diagramma, e una coordinata di mille o più viene abbreviata, come in `1.2k` o `-24k`.

Il blocco fissa l’impostazione così com’è in quel momento.
Mentre un blocco è attivo, l’impostazione continua a funzionare sullo schermo: è possibile scorrere ed eseguire lo zoom, cambiare scheda e scegliere un altro linguaggio, stile dei nomi o delimitatore dai menu, dai pannelli opzioni o dalla Ricerca rapida.
Il file, però, conserva il valore bloccato, e la riga continua a mostrarlo, quindi il diagramma si riapre sulla vista bloccata, nella scheda bloccata, con il linguaggio, gli stili dei nomi e il delimitatore bloccati. Anche un’esportazione JSON scrive i valori bloccati.
Per salvare ciò che mostra lo schermo, disattivare il blocco, e da quel momento il file segue l’impostazione: con `Viewport` disattivato, il diagramma si apre dove lo si era lasciato. Per bloccare invece un nuovo valore, come una nuova vista iniziale, disattivare e riattivare il blocco.
Se all’apertura del file la vista bloccata non mostra alcuna parte del diagramma, lo schermo si sposta comunque sul diagramma, e il valore bloccato resta invariato.
`Canvas Type` non conserva mai la scheda Impostazioni. Attivarlo blocca l’ultima altra scheda in cui ci si trovava, e mentre è disattivato la sua riga indica quella scheda.

![Sblocco di Viewport, scorrimento e zoom del diagramma, e nuovo blocco sulla nuova vista mostrata dalla sua riga](/img/demo-settings-locks.webp)

Attivare o disattivare un blocco modifica il file, poiché il file memorizza quali blocchi sono attivi, ma come il resto della scheda Impostazioni non viene registrato nella [cronologia delle modifiche](./undo-redo.md#what-the-history-records). In un editor di sola lettura i pulsanti di blocco non hanno effetto.
Ogni altra impostazione viene salvata così com’è: il database, gli interruttori di [`View Option`](./table-related-functions.md#table-view-options) e il resto della scheda `Preferences`.

In un nuovo diagramma, cioè uno creato da zero, ogni blocco è attivo: un file vuoto aperto in VS Code, Obsidian o un IDE JetBrains (lo creano `ERD Editor: Create new diagram` e `New ERD` di Obsidian), un nuovo schema nell’app web, un file creato dal menu New di Google Drive o un `<erd-editor>` a cui non è stato dato alcun valore.
Anche uno schema o un file di Google Drive che l’app web crea importando un file SQL, DBML, AML o GraphQL parte con ogni blocco attivo. Uno creato da un file JSON mantiene i blocchi registrati in quel file.
Un file che si apre mantiene i blocchi con cui è stato salvato, ciascuno al suo valore bloccato.
Un file che non registra alcun blocco, come uno salvato da una versione precedente ai blocchi o scritto a mano, si apre con ogni blocco attivo: la vista a `100% · 0, 0` e la scheda su `ERD`, qualunque vista e scheda abbia salvato, e il linguaggio, gli stili dei nomi e il tipo di delimitatore bloccati come li ha salvati.
Anche un’importazione con `Import` che sostituisce il diagramma imposta i blocchi: un file JSON porta i blocchi che registra e i valori che contengono, mentre un file SQL, DBML, AML o GraphQL mantiene i blocchi attuali ma riporta la vista a `100% · 0, 0`, bloccata o meno — vedere [Importare file esterni](./file-import-export.md#importing-external-files). Annullare l’importazione ripristina i blocchi e i valori bloccati che aveva sostituito.

Una modifica che un blocco tiene fuori dal file non viene considerata una modifica. VS Code non contrassegna la scheda come modificata, e Obsidian e un IDE JetBrains lasciano il file com’era, sia quando salvano automaticamente sia quando la scheda viene chiusa.
Così, con ogni blocco attivo, esplorare un diagramma, cambiare scheda e provare un altro linguaggio, stile dei nomi o delimitatore non compaiono mai in `git diff`.
Con `Viewport` disattivato, lo scorrimento e lo zoom modificano il file, e con `Canvas Type` disattivato lo fa anche il cambio di scheda, compreso il passaggio alla scheda Impostazioni.
Il file vuoto di un nuovo diagramma resta vuoto fino alla prima modifica che il file conserva: una modifica al diagramma, il cambio di un’impostazione che nessun blocco trattiene, o l’attivazione o disattivazione di un blocco.
Aprire un diagramma e chiuderlo senza una modifica di questo tipo lascia il file com’era, qualunque versione o computer lo abbia scritto. Il file contiene solo ciò che costituisce il diagramma, in un ordine fisso, e un file salvato in una forma precedente viene riscritto in questa forma una sola volta, alla sua prima modifica di questo tipo — vedere [Forma di archiviazione e valore di runtime](../../api/advanced/schema.md#storage-form-and-runtime-value).
In VS Code, una revisione riaperta come diagramma con `Reopen Editor With...`, come una revisione Git o una voce di Local History, è di sola lettura e non viene mai contrassegnata come modificata.
In Google Drive, uno scorrimento, uno zoom o il passaggio a un’altra scheda non vengono mai salvati da soli, bloccati o meno. Con `Viewport` disattivato, la vista viene scritta solo insieme a un’altra modifica, quindi un file di Drive si apre dove si trovava la vista al suo ultimo salvataggio, e lo stesso vale per la scheda con `Canvas Type` disattivato.

In una [sessione collaborativa](../../api/advanced/collaborative-editing.md), l’attivazione o la disattivazione di un blocco raggiunge ogni editor, e un blocco conserva il valore dell’editor che lo ha attivato.
Disattivare `Language`, uno stile dei nomi o `Bracket Type` dà a ogni editor il valore mostrato nell’editor che lo ha disattivato, così tutti salvano un unico valore. Disattivare `Viewport` o `Canvas Type` non sposta la vista né cambia la scheda di nessuno.
Un agente di programmazione che lavora tramite il server MCP non dispone di strumenti per i blocchi né per le impostazioni che trattengono, e legge un linguaggio, uno stile dei nomi o un tipo di delimitatore bloccato al valore che il file conserva. Solo le sue importazioni in modalità `replace` li raggiungono, come fa `Import` — vedere [Impostazioni](../../mcp/tools.md#settings) e [Importazione](../../mcp/tools.md#import).

## Modificare l’ordine delle colonne {#adjusting-column-order}

Imposta l’ordine di visualizzazione delle colonne nelle tabelle.
Trascinare una riga per spostarla — l’intera riga è trascinabile, e l’icona di trascinamento la contrassegna. Le sette righe, nel loro ordine predefinito, sono `Name`, `DataType`, `Not Null`, `Unique`, `Auto Increment`, `Default` e `Comment`.
Una cella nascosta da un’[opzione di visualizzazione delle tabelle](./table-related-functions.md#table-view-options) mantiene il suo posto nell’elenco, quindi l’ordine si applica alle celle mostrate, quali che siano.
L’indicatore di [chiave alternativa](./table-related-functions.md#alternate-keys) (`AK1.1` e così via) non è una di queste righe. Sta sempre per ultimo in una riga, dopo la cella che questo ordine mette per ultima.

![Scorrimento fino a Column Order e trascinamento della riga Comment sotto Name, che mette ogni commento subito dopo il nome della sua colonna](/img/demo-settings-column-order.webp)

## Tasti di scelta rapida {#shortcuts}

La scheda `Shortcuts` è una tabella di sola lettura con le colonne `Command` e `Keybinding`, che elenca le associazioni di tasti della piattaforma in uso.

| Command | Windows/Linux | Mac |
| --- | --- | --- |
| Editing | `Enter` | `Enter` |
| Stop | `ESC` | `ESC` |
| Search | `Ctrl + K` | `⌘ + K` |
| [Toggle Explorer](./explorer.md) | `Ctrl + F` | `⌘ + F` |
| Undo | `Ctrl + Z` | `⌘ + Z` |
| Redo | `Ctrl + Shift + Z` | `⌘ + Shift + Z` |
| Add Table | `Alt + N` | `⌥ + N` |
| Add Column | `Alt + Enter` | `⌥ + Enter` |
| Add Memo | `Alt + M` | `⌥ + M` |
| Add Table Group | `Alt + G` | `⌥ + G` |
| Group Selected Tables | `T` e poi `G` | `T` e poi `G` |
| Remove Table, Memo | `Ctrl + Backspace`, `Ctrl + Delete` | `⌘ + Backspace`, `⌘ + Delete` |
| Remove Column | `Alt + Backspace`, `Alt + Delete` | `⌥ + Backspace`, `⌥ + Delete` |
| Delete Selection | `Delete`, `Backspace` | `Delete`, `Backspace` |
| Primary Key | `Alt + K` | `⌥ + K` |
| Select All Table, Memo | `Ctrl + A`, `Ctrl + Alt + A` | `⌘ + A`, `⌘ + ⌥ + A` |
| Select All Column | `Alt + A` | `⌥ + A` |
| Relationship Zero One | `Ctrl + Alt + 1` | `⌘ + ⌥ + 1` |
| Relationship Zero N | `Ctrl + Alt + 2` | `⌘ + ⌥ + 2` |
| Relationship One Only | `Ctrl + Alt + 3` | `⌘ + ⌥ + 3` |
| Relationship One N | `Ctrl + Alt + 4` | `⌘ + ⌥ + 4` |
| Table Properties | `Alt + Space` | `⌥ + Space` |
| Focus on this table | `Alt + F` | `⌥ + F` |
| Zoom In | `Ctrl + Plus` | `⌘ + Plus` |
| Zoom Out | `Ctrl + Minus` | `⌘ + Minus` |
| Zoom Reset | `Ctrl + 0` | `⌘ + 0` |
| Hand Tool | `Space` | `Space` |
| Zen Mode | `Alt + Z` | `⌥ + Z` |

La maggior parte di questi tasti funziona solo nella scheda ERD, e viene sospesa mentre sono aperti la Ricerca rapida, Proprietà tabella, il Visualizzatore differenze, l’anteprima del Layout automatico, il Viaggio nel tempo, la finestra di dialogo [`Export image`](./file-import-export.md#image) o [`Map Columns`](./relationship-editing.md#map-columns).
`Search`, `Toggle Explorer` e `Stop` fanno eccezione: `Search` apre o chiude la Ricerca rapida da qualsiasi scheda, `Toggle Explorer` apre il pannello [Esplora](./explorer.md#opening-and-closing) sulla sua ricerca da qualsiasi scheda e passa alla scheda ERD, e `Stop` è ciò che chiude la Ricerca rapida, Proprietà tabella, il Visualizzatore differenze, l’anteprima del Layout automatico, il Viaggio nel tempo, la finestra di dialogo `Export image`, `Map Columns`, il generatore di temi, il selettore `Display Language`, il selettore colori e un menu contestuale aperto.
`Toggle Explorer` richiude il pannello Esplora mentre è aperto nella scheda ERD e non è nascosto dalla modalità Zen, come fa il pulsante `Explorer` della barra degli strumenti. Con la Ricerca rapida, Proprietà tabella, il generatore di temi, il selettore `Display Language`, la finestra di dialogo `Export image` o `Map Columns` aperti, chiude invece quell’elemento e porta il focus della tastiera sulla ricerca del pannello Esplora.
`Toggle Explorer` non ha effetto mentre si modifica una cella, un memo o il nome di un gruppo di tabelle. Mentre sono aperti il Visualizzatore differenze, l’anteprima del Layout automatico o il Viaggio nel tempo, lascia il suo tasto al browser o all’host — vedere [La barra di ricerca del browser](./find-and-replace.md#the-browsers-find-bar).
Nella scheda ERD, `Stop` termina la modifica in corso di una cella o di un memo, chiude l’editor del nome di un [gruppo di tabelle](./table-groups.md) senza rinominare il gruppo, oppure annulla una relazione o un `New Table Group` in corso di disegno, e lascia invariata la selezione. Se nessuno di questi è aperto, annulla la selezione e toglie il focus dalla cella e, con la stessa pressione, chiude un selettore colori aperto. Un generatore di temi o un selettore `Display Language` aperto si chiude con la stessa pressione in entrambi i casi.
Un pannello Esplora, un generatore di temi o un selettore `Display Language` aperto non sospende nessuno dei tasti di scelta rapida nell’area di disegno. `Stop` non chiude mai il pannello Esplora. Per ciò che fanno `Stop` e gli altri tasti all’interno del pannello Esplora, vedere [Tasti nel pannello Esplora](./explorer.md#keys-in-the-explorer), e all’interno del selettore, vedere [Scegliere una lingua](./language-and-theme.md#picking-a-language).
`Delete Selection` rimuove ogni tabella, memo e gruppo di tabelle selezionato oppure, quando è selezionata una sola tabella con alcune delle sue colonne e lo zoom è superiore al `70%`, quelle colonne — vedere [Eliminazione di tabelle e memo](./table-related-functions.md#table-and-memo-deletion). Anche `Remove Table, Memo` rimuove i gruppi di tabelle selezionati.
`Add Table Group` avvia il disegno di un [`New Table Group`](./table-groups.md#drawing-a-group), come fa il pulsante `New Table Group` della [barra degli strumenti dell’area di disegno](./table-related-functions.md#canvas-toolbar), e una seconda pressione annulla il disegno. `Group Selected Tables` consiste in due pressioni senza tasto modificatore, `T` e poi `G` entro un secondo. Mette le tabelle selezionate in un nuovo gruppo e apre l’editor del suo nome, come fa `Group selected tables` nel menu contestuale di una tabella, e non ha effetto quando non è selezionata alcuna tabella — vedere [Raggruppare le tabelle selezionate](./table-groups.md#grouping-selected-tables). Nessuno dei due ha effetto in un editor di sola lettura o mentre i gruppi sono [nascosti](./table-groups.md#hiding-groups).
`Zoom In`, `Zoom Out` e `Zoom Reset` eseguono lo zoom anche nella scheda [Visualizzazione](./visualization.md#toolbar), sia nella modalità `Graph` sia nella modalità `Flow`, a meno che non sia aperta la Ricerca rapida.
Nella scheda Visualizzazione, `Stop` chiude anche il menu di [visualizzazione righe](./visualization.md#row-display) e annulla un [layout della modalità Flusso](./visualization.md#how-flow-is-placed) ancora in corso; non allarga una vista ristretta con `Focus on this table`.
`Focus on this table` apre la scheda Visualizzazione nella modalità `Flow`, ristretta alle tabelle selezionate e a ogni tabella a una relazione di distanza, e non ha effetto quando non è selezionata alcuna tabella — vedere [Focalizzare le tabelle](./visualization.md#focusing-on-tables).
`Select All Table, Memo`, `Hand Tool`, `Delete Selection` e `Group Selected Tables` cedono il passo al punto di inserimento: mentre si modifica una cella o un memo o si digita in un campo di testo come il campo Trova del pannello Esplora, `Ctrl + A` (Windows/Linux) o `⌘ + A` (Mac) seleziona il testo, `Space` digita uno spazio, `Delete` e `Backspace` cancellano il testo, e `T` e poi `G` digitano le due lettere.
Copia e incolla sono i tasti `Ctrl + C` e `Ctrl + V` (Windows/Linux) o `⌘ + C` e `⌘ + V` (Mac) del browser stesso, quindi non compaiono in questo elenco — vedere [Modifica delle tabelle](./table-editing.md).

Le associazioni di tasti non si possono modificare da questa scheda.
Un host che incorpora l’editor le riassegna con [`setKeyBindingMap`](../../api/erd-editor-element.md#setkeybindingmap), tranne `Editing`, `Stop`, `Undo`, `Redo`, `Zoom In`, `Zoom Out` e `Zoom Reset`, che sono fissi.
La scheda `Shortcuts` elenca allora le associazioni dell’host: un comando che l’host non riassegna mantiene quella predefinita, e uno che l’host non associa ad alcun tasto non ne mostra nessuna.

In Obsidian questi tasti raggiungono l’editor ogni volta che la scheda Obsidian del diagramma è attiva, anche dove un tasto di scelta rapida di Obsidian usa la stessa combinazione, come `Alt + Enter`, `Ctrl + K` e `Ctrl + F` (Windows/Linux) o `⌥ + Enter`, `⌘ + K` e `⌘ + F` (Mac). Tutti gli altri tasti di scelta rapida di Obsidian continuano a funzionare nella scheda. Per `Ctrl + F` o `⌘ + F`, vedere [La barra di ricerca del browser](./find-and-replace.md#the-browsers-find-bar).
