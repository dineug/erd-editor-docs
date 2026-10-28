---
sidebar_position: 16
description: Sincronizzazione del tipo di dati nelle relazioni e domini, larghezza massima dei commenti, blocco delle impostazioni (vista, scheda, impostazioni del codice e Visualizzazione nomi), ordine di visualizzazione delle colonne, elenco dei tasti di scelta rapida e scheda Impostazioni di un editor di sola lettura.
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

Un [dominio](./dictionary.md#domains-and-data-types) dà il proprio `Data Type` alle colonne collegate a esso, quando quel tipo cambia e quando una colonna viene collegata. Mentre questa impostazione è attiva, la modifica prosegue lungo le relazioni a partire da ciascuna di quelle colonne come sopra; mentre è disattivata, cambiano solo le colonne collegate. Una colonna che in quel passaggio assume il tipo del proprio dominio lo mantiene, anche dove la sincronizzazione gliene darebbe un altro, come il tipo intero che una chiave serial dà alle sue chiavi esterne.
Una colonna collegata a cui la sincronizzazione o Associa colonne dà un tipo diverso da quello del proprio dominio viene scollegata da quel dominio nello stesso passaggio — vedere [Scollegamento](./dictionary.md#unlinking). Nessuna operazione di incolla di colonne propaga un tipo tramite questa impostazione, nemmeno il tipo di un dominio che l’operazione di incolla collega — vedere [Copiare e incollare colonne](./table-editing.md#copyingpasting-columns). Lo propaga invece un `Data Type` incollato nel foglio `Domains` della scheda Dizionario, come fa qualsiasi modifica al tipo di un dominio.

<img src="/img/settings-relationship-data-type-sync.png" width="290" alt="Impostazione di sincronizzazione del tipo di dati nelle relazioni" loading="lazy" />

![Modifica di members.id in BIGINT UNSIGNED, che aggiorna ogni member_id collegato a questa colonna](/img/demo-relationship-data-type-sync.webp)

## Larghezza massima commenti {#maximum-comment-width}

Specifica la larghezza massima della colonna dei commenti in pixel (`60` ~ `200`).
Disattivare l’interruttore rimuove il limite, e il campo è disabilitato finché l’interruttore resta disattivato.
Quando lo si attiva, il valore iniziale è `60px`. Un valore digitato fuori dall’intervallo viene riportato all’estremo più vicino.

![Attivazione di Maximum comment width, inserimento di 120 e la scheda ERD che mostra i commenti troncati a quella larghezza](/img/demo-settings-comment-width.webp)

## Blocco {#lock}

L’elenco `Lock` contiene sette impostazioni. Mentre il blocco di un’impostazione è attivo, il file conserva il valore che questa aveva al momento del blocco, quindi modificarla sullo schermo lascia il file com’era.

| Riga | Cosa conserva il file | In un nuovo diagramma |
| --- | --- | --- |
| `Viewport` | Il livello di zoom e la posizione della vista dell’area di disegno ERD, con un unico blocco | `100% · 0, 0` |
| `Canvas Type` | La scheda su cui si apre il diagramma: `ERD`, `Visualization`, `Schema SQL`, `Code Generator` o `Dictionary` | `ERD` |
| `Language` | Il linguaggio del [Generatore di codice](./code-generator.md#language) | `GraphQL` |
| `Table Name Case` | Lo [stile dei nomi delle tabelle](./code-generator.md#name-case) del Generatore di codice | `Pascal` |
| `Column Name Case` | Lo [stile dei nomi delle colonne](./code-generator.md#name-case) del Generatore di codice | `Camel` |
| `Bracket Type` | L’opzione `Bracket` della scheda [Schema SQL](./schema-sql.md#database-and-bracket) e delle destinazioni del [Generatore di codice](./code-generator.md#bracket) che la offrono | `None` |
| `Name View` | La [Visualizzazione nomi](./logical-names.md#name-view) con cui si apre il diagramma: `Physical Names`, `Logical Names` o `Both Names` | `Physical Names` |

Ogni riga mostra un valore e un pulsante di blocco, e un clic sul pulsante attiva o disattiva solo quel blocco.
Mentre un blocco è attivo, il pulsante mostra un lucchetto chiuso con il tooltip `Unlock Viewport` (e così via per ogni riga), e il valore, con il tooltip `Locked value`, è quello che il file conserva.
Mentre è disattivato, il pulsante mostra un lucchetto aperto con il tooltip `Lock Viewport`, e il valore, attenuato, con il tooltip `Current value`, è l’impostazione così com’è al momento.
`Viewport` mostra lo zoom e poi la posizione della vista, come `75% · -40, 91`. La posizione della vista è il punto dello schermo, in pixel, in cui si trova lo `0, 0` del diagramma, e una coordinata di mille o più viene abbreviata, come in `1.2k` o `-24k`.

Il blocco fissa l’impostazione così com’è in quel momento.
Mentre un blocco è attivo, l’impostazione continua a funzionare sullo schermo: è possibile scorrere ed eseguire lo zoom, cambiare scheda, scegliere un altro linguaggio, stile dei nomi o delimitatore dai menu, dai pannelli opzioni o dalla Ricerca rapida, e cambiare la Visualizzazione nomi da uno qualsiasi dei suoi selettori — vedere [Cambiare vista](./logical-names.md#switching-the-view).
Il file, però, conserva il valore bloccato, e la riga continua a mostrarlo, quindi il diagramma si riapre sulla vista bloccata, nella scheda bloccata, nella Visualizzazione nomi bloccata e con il linguaggio, gli stili dei nomi e il delimitatore bloccati. Anche un’esportazione JSON scrive i valori bloccati.
Per salvare ciò che mostra lo schermo, disattivare il blocco, e da quel momento il file segue l’impostazione: con `Viewport` disattivato, il diagramma si apre dove lo si era lasciato. Per bloccare invece un nuovo valore, come una nuova vista iniziale, disattivare e riattivare il blocco.
Se all’apertura del file la vista bloccata non mostra alcuna parte del diagramma, lo schermo si sposta comunque sul diagramma, e il valore bloccato resta invariato.
`Canvas Type` non conserva mai la scheda Impostazioni. Attivarlo blocca l’ultima altra scheda in cui ci si trovava, e mentre è disattivato la sua riga indica quella scheda.

![Sblocco di Viewport, scorrimento e zoom del diagramma, e nuovo blocco sulla nuova vista mostrata dalla sua riga](/img/demo-settings-locks.webp)

Attivare o disattivare un blocco modifica il file, poiché il file memorizza quali blocchi sono attivi, ma come il resto della scheda Impostazioni non viene registrato nella [cronologia delle modifiche](./undo-redo.md#what-the-history-records). Nemmeno un cambio della Visualizzazione nomi viene registrato, che sia bloccata o meno.
Ogni altra impostazione viene salvata così com’è: il database, gli interruttori di [`View Option`](./table-related-functions.md#table-view-options) e il resto della scheda `Preferences`.
Un editor di sola lettura non modifica il file con nessuna di queste, qualunque sia il blocco: i suoi pulsanti di blocco e gli altri controlli di `Preferences` sono disabilitati, e le impostazioni che consente ancora di cambiare restano su quello schermo — vedere [Editor di sola lettura](#read-only-editors).

In un nuovo diagramma, cioè uno creato da zero, ogni blocco è attivo: un file vuoto aperto in VS Code, Obsidian o un IDE JetBrains (lo creano `ERD Editor: Create new diagram` e `New ERD` di Obsidian), un nuovo schema nell’app web, un file creato dal menu New di Google Drive o un `<erd-editor>` a cui non è stato dato alcun valore.
Anche uno schema o un file di Google Drive che l’app web crea importando un file SQL, DBML, AML o GraphQL parte con ogni blocco attivo. Uno creato da un file JSON mantiene i blocchi registrati in quel file.
Un file che si apre mantiene i blocchi con cui è stato salvato, ciascuno al suo valore bloccato.
Un file che non registra alcun blocco, come uno salvato da una versione precedente ai blocchi o scritto a mano, si apre con ogni blocco attivo: la vista a `100% · 0, 0` e la scheda su `ERD`, qualunque vista e scheda abbia salvato, e il linguaggio, gli stili dei nomi, il tipo di delimitatore e la Visualizzazione nomi bloccati come li ha salvati.
Un file salvato da una versione precedente al blocco della Visualizzazione nomi si apre nella vista `Physical Names` con `Name View` bloccato, anche se ogni altro blocco che registra è disattivato.
Anche un’importazione con `Import` che sostituisce il diagramma imposta i blocchi: un file JSON porta i blocchi che registra e i valori che contengono, mentre un file SQL, DBML, AML o GraphQL mantiene i blocchi attuali ma riporta la vista a `100% · 0, 0`, bloccata o meno — vedere [Importare file esterni](./file-import-export.md#importing-external-files). Annullare l’importazione ripristina i blocchi e i valori bloccati che aveva sostituito.

Una modifica che un blocco tiene fuori dal file non viene considerata una modifica. VS Code non contrassegna la scheda come modificata, e Obsidian e un IDE JetBrains lasciano il file com’era, sia quando salvano automaticamente sia quando la scheda viene chiusa.
Così, con ogni blocco attivo, esplorare un diagramma, cambiare scheda, provare un altro linguaggio, stile dei nomi o delimitatore e cambiare la Visualizzazione nomi non compaiono mai in `git diff`.
Con `Viewport` disattivato, lo scorrimento e lo zoom modificano il file; con `Canvas Type` disattivato lo fa anche il cambio di scheda, compreso il passaggio alla scheda Impostazioni; e con `Name View` disattivato lo fa anche il cambio della Visualizzazione nomi.
Il file vuoto di un nuovo diagramma resta vuoto fino alla prima modifica che il file conserva: una modifica al diagramma, il cambio di un’impostazione che nessun blocco trattiene, o l’attivazione o disattivazione di un blocco.
Aprire un diagramma e chiuderlo senza una modifica di questo tipo lascia il file com’era, qualunque versione o computer lo abbia scritto. Il file contiene solo ciò che costituisce il diagramma, in un ordine fisso, e un file salvato in una forma precedente viene riscritto in questa forma una sola volta, alla sua prima modifica di questo tipo — vedere [Forma di archiviazione e valore di runtime](../../api/advanced/schema.md#storage-form-and-runtime-value).
In VS Code, una revisione riaperta come diagramma con `Reopen Editor With...`, come una revisione Git o una voce di Local History, è di sola lettura e non viene mai contrassegnata come modificata.
In Google Drive, uno scorrimento, uno zoom o il passaggio a un’altra scheda non vengono mai salvati da soli, bloccati o meno. Con `Viewport` disattivato, la vista viene scritta solo insieme a un’altra modifica, quindi un file di Drive si apre dove si trovava la vista al suo ultimo salvataggio, e lo stesso vale per la scheda con `Canvas Type` disattivato. Un cambio della Visualizzazione nomi fatto con `Name View` disattivato viene salvato come una modifica, mentre uno fatto mentre è attivo, o in un editor di sola lettura, non viene mai salvato.

In una [sessione collaborativa](../../api/advanced/collaborative-editing.md), l’attivazione o la disattivazione di un blocco raggiunge ogni editor, e un blocco conserva il valore dell’editor che lo ha attivato.
Disattivare `Language`, uno stile dei nomi, `Bracket Type` o `Name View` dà a ogni editor il valore mostrato nell’editor che lo ha disattivato, così tutti salvano un unico valore. Disattivare `Viewport` o `Canvas Type` non sposta la vista né cambia la scheda di nessuno.
Un linguaggio, uno stile dei nomi o un delimitatore scelto mentre il suo blocco è attivo raggiunge comunque ogni editor, ma la Visualizzazione nomi è propria di ciascun editor finché `Name View` è attivo: un cambio compare solo nell’editor che lo ha fatto, e attivare il blocco non cambia la vista di nessuno. Mentre è disattivato, un cambio in qualsiasi editor che non sia di sola lettura cambia la vista di ogni editor.
Un agente di programmazione che lavora tramite il server MCP non dispone di strumenti per i blocchi né per le impostazioni che trattengono, e legge un linguaggio, uno stile dei nomi o un tipo di delimitatore bloccato al valore che il file conserva. Solo le sue importazioni in modalità `replace` li raggiungono, come fa `Import` — vedere [Impostazioni](../../mcp/tools.md#settings) e [Importazione](../../mcp/tools.md#import). Il suo `erd_list` e il formato `snapshot` di `erd_read` omettono la Visualizzazione nomi, e l’agente modifica lo schema, nomi logici compresi, qualunque sia la vista che una persona sta guardando.

## Modificare l’ordine delle colonne {#adjusting-column-order}

Imposta l’ordine di visualizzazione delle colonne nelle tabelle.
Trascinare una riga per spostarla — l’intera riga è trascinabile, e l’icona di trascinamento la contrassegna. Le nove righe, nel loro ordine predefinito, sono `Logical Name`, `Name`, `DataType`, `Domain`, `Not Null`, `Unique`, `Auto Increment`, `Default` e `Comment`.
`Logical Name` colloca la cella del nome logico che la riga di una colonna disegna nella vista `Both Names`. Nella vista `Logical Names` il nome logico prende invece il posto della riga `Name`, e la vista `Physical Names` non ne disegna alcuna — vedere [Visualizzazione nomi](./logical-names.md#name-view). `Domain` colloca la cella Dominio che mostra View Option → `Domain` — vedere [La cella Dominio](./logical-names.md#the-domain-cell).
Una cella nascosta da un’[opzione di visualizzazione delle tabelle](./table-related-functions.md#table-view-options) o esclusa dalla Visualizzazione nomi mantiene il suo posto nell’elenco, quindi l’ordine si applica alle celle mostrate, quali che siano.
Un diagramma il cui ordine è stato impostato prima che `Logical Name` e `Domain` diventassero righe riceve `Logical Name` subito prima di `Name` e `Domain` subito dopo `DataType`, ovunque questi si trovino nel suo ordine.
Anche un diagramma salvato da una versione successiva mantiene il suo ordine, anche quando quella versione ha una riga che questa non ha: le righe di questa versione restano nell’ordine indicato dal file e la riga sconosciuta viene esclusa. Salvando qui il diagramma si scrive l’ordine senza di essa, e la versione successiva rimette quella riga accanto alla sua vicina nel proprio ordine predefinito.
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
`Search`, `Toggle Explorer` e `Stop` fanno eccezione: `Search` apre o chiude la Ricerca rapida da qualsiasi scheda, `Toggle Explorer` apre il pannello [Esplora](./explorer.md#opening-and-closing) sulla sua ricerca da qualsiasi scheda e passa alla scheda ERD, e `Stop` è ciò che chiude la Ricerca rapida, Proprietà tabella, il Visualizzatore differenze, l’anteprima del Layout automatico, il Viaggio nel tempo, la finestra di dialogo `Export image`, `Map Columns`, il generatore di temi, il selettore `Display Language`, il selettore colori, l’elenco che apre un pulsante `Name View` e un menu contestuale aperto.
`Toggle Explorer` richiude il pannello Esplora mentre è aperto nella scheda ERD e non è nascosto dalla modalità Zen, come fa il pulsante `Explorer` della barra degli strumenti. Con la Ricerca rapida, Proprietà tabella, il generatore di temi, il selettore `Display Language`, la finestra di dialogo `Export image` o `Map Columns` aperti, chiude invece quell’elemento e porta il focus della tastiera sulla ricerca del pannello Esplora.
`Toggle Explorer` non ha effetto mentre si modifica una cella, un memo o il nome di un gruppo di tabelle. Né questo né `Search` hanno effetto mentre si modifica una cella della scheda [Dizionario](./dictionary.md), così il testo digitato lì viene mantenuto. Mentre sono aperti il Visualizzatore differenze, l’anteprima del Layout automatico o il Viaggio nel tempo, `Toggle Explorer` lascia il suo tasto al browser o all’host — vedere [La barra di ricerca del browser](./find-and-replace.md#the-browsers-find-bar).
Nella scheda ERD, `Stop` termina la modifica in corso di una cella o di un memo, chiude l’editor del nome di un [gruppo di tabelle](./table-groups.md) senza rinominare il gruppo, oppure annulla una relazione o un `New Table Group` in corso di disegno, e lascia invariata la selezione. Se nessuno di questi è aperto, annulla la selezione e toglie il focus dalla cella e, con la stessa pressione, chiude un selettore colori aperto. Un generatore di temi o un selettore `Display Language` aperto si chiude con la stessa pressione in entrambi i casi.
In una cella del nome logico con l’elenco dei termini aperto, la prima pressione di `Stop` chiude solo l’elenco — vedere [Completare i nomi dei termini](./logical-names.md#completing-term-names).
Un pannello Esplora, un generatore di temi o un selettore `Display Language` aperto non sospende nessuno dei tasti di scelta rapida nell’area di disegno. `Stop` non chiude mai il pannello Esplora. Per ciò che fanno `Stop` e gli altri tasti all’interno del pannello Esplora, vedere [Tasti nel pannello Esplora](./explorer.md#keys-in-the-explorer), e all’interno del selettore, vedere [Scegliere una lingua](./language-and-theme.md#picking-a-language).
`Delete Selection` rimuove ogni tabella, memo e gruppo di tabelle selezionato oppure, quando è selezionata una sola tabella con alcune delle sue colonne e lo zoom è superiore al `70%`, quelle colonne — vedere [Eliminazione di tabelle e memo](./table-related-functions.md#table-and-memo-deletion). Anche `Remove Table, Memo` rimuove i gruppi di tabelle selezionati.
`Add Table Group` avvia il disegno di un [`New Table Group`](./table-groups.md#drawing-a-group), come fa il pulsante `New Table Group` della [barra degli strumenti dell’area di disegno](./table-related-functions.md#canvas-toolbar), e una seconda pressione annulla il disegno. `Group Selected Tables` consiste in due pressioni senza tasto modificatore, `T` e poi `G` entro un secondo. Mette le tabelle selezionate in un nuovo gruppo e apre l’editor del suo nome, come fa `Group selected tables` nel menu contestuale di una tabella, e non ha effetto quando non è selezionata alcuna tabella — vedere [Raggruppare le tabelle selezionate](./table-groups.md#grouping-selected-tables). Nessuno dei due ha effetto in un editor di sola lettura o mentre i gruppi sono [nascosti](./table-groups.md#hiding-groups).
In un editor di sola lettura funzionano solo i tasti che leggono: `Search`, `Toggle Explorer`, `Stop`, `Table Properties` e `Focus on this table` sulla tabella selezionata da un salto, i tre tasti dello zoom, `Zen Mode`, copia e i tasti freccia, che spostano la cella con il focus. `Editing`, ogni tasto `Add` e `Remove`, `Delete Selection`, `Primary Key`, entrambi i tasti di selezione totale, i quattro tasti delle relazioni, `Add Table Group`, `Group Selected Tables`, `Hand Tool` e l’incolla non fanno nulla, e `Undo` e `Redo` non annullano né ripetono nulla — vedere [Editor di sola lettura](./table-related-functions.md#read-only-editors).
`Zoom In`, `Zoom Out` e `Zoom Reset` eseguono lo zoom anche nella scheda [Visualizzazione](./visualization.md#toolbar), sia nella modalità `Graph` sia nella modalità `Flow`, a meno che non sia aperta la Ricerca rapida.
Nella modalità `Flow`, `Undo` e `Redo` tornano indietro e vanno avanti tra le viste a cui è stata ristretta la modalità Flusso, come fanno i suoi pulsanti `Previous table` e `Next table`, a meno che non sia aperta la Ricerca rapida. Lì non annullano mai le modifiche al diagramma, e nella modalità `Graph` non hanno effetto — vedere [Tabella precedente e tabella successiva](./visualization.md#previous-table-and-next-table).
Nella scheda Visualizzazione, `Stop` chiude anche il menu di [visualizzazione righe](./visualization.md#row-display) e annulla un [layout della modalità Flusso](./visualization.md#how-flow-is-placed) ancora in corso; non allarga una vista ristretta con `Focus on this table`.
`Focus on this table` apre la scheda Visualizzazione nella modalità `Flow`, ristretta alle tabelle selezionate e a ogni tabella a una relazione di distanza, e non ha effetto quando non è selezionata alcuna tabella — vedere [Focalizzare le tabelle](./visualization.md#focusing-on-tables).
Nella scheda Dizionario, `Undo` e `Redo` agiscono sulla cronologia del foglio mostrato anziché su quella del diagramma, e non hanno effetto sul foglio `Checks` — vedere [Fogli della scheda Dizionario](./undo-redo.md#dictionary-sheets). Nei fogli `Domains`, `Words` e `Terms`, `Add Column` inserisce righe sotto la selezione, il suo tasto con l’aggiunta di `Shift` le inserisce sopra, e `Remove Column` elimina le righe coperte dalla selezione — vedere [Aggiungere ed eliminare righe](./dictionary.md#adding-and-deleting-rows). Per gli altri tasti della scheda, vedere [Tasti nella scheda](./dictionary.md#keys-on-the-tab).
`Select All Table, Memo`, `Hand Tool`, `Delete Selection` e `Group Selected Tables` cedono il passo al punto di inserimento: mentre si modifica una cella o un memo o si digita in un campo di testo come il campo Trova del pannello Esplora, `Ctrl + A` (Windows/Linux) o `⌘ + A` (Mac) seleziona il testo, `Space` digita uno spazio, `Delete` e `Backspace` cancellano il testo, e `T` e poi `G` digitano le due lettere.
Copia e incolla sono i tasti `Ctrl + C` e `Ctrl + V` (Windows/Linux) o `⌘ + C` e `⌘ + V` (Mac) del browser stesso, quindi non compaiono in questo elenco — vedere [Modifica delle tabelle](./table-editing.md).

Le associazioni di tasti non si possono modificare da questa scheda.
Un host che incorpora l’editor le riassegna con [`setKeyBindingMap`](../../api/erd-editor-element.md#setkeybindingmap), tranne `Editing`, `Stop`, `Undo`, `Redo`, `Zoom In`, `Zoom Out` e `Zoom Reset`, che sono fissi.
La scheda `Shortcuts` elenca allora le associazioni dell’host: un comando che l’host non riassegna mantiene quella predefinita, e uno che l’host non associa ad alcun tasto non ne mostra nessuna.
I tasti per le righe della scheda Dizionario seguono `Add Column` e `Remove Column`, quindi riassegnare uno dei due li sposta — vedere [`dictionaryRowChords`](../../api/erd-editor-element.md#dictionaryrowchords).

In Obsidian questi tasti raggiungono l’editor ogni volta che la scheda Obsidian del diagramma è attiva, anche dove un tasto di scelta rapida di Obsidian usa la stessa combinazione, come `Alt + Enter`, `Ctrl + K` e `Ctrl + F` (Windows/Linux) o `⌥ + Enter`, `⌘ + K` e `⌘ + F` (Mac). Lo stesso vale per `Alt + Shift + Enter` (Windows/Linux) o `⌥ + Shift + Enter` (Mac) della scheda Dizionario, che non compare in nessuna riga di questo elenco. Tutti gli altri tasti di scelta rapida di Obsidian continuano a funzionare nella scheda. Per `Ctrl + F` o `⌘ + F`, vedere [La barra di ricerca del browser](./find-and-replace.md#the-browsers-find-bar).

## Editor di sola lettura {#read-only-editors}

In un editor [`readonly`](../../api/erd-editor-element.md#readonly) la scheda Impostazioni mostra le impostazioni del diagramma e non ne modifica nessuna. Un badge `Read only` si trova accanto al titolo di ciascuna pagina, `Preferences` e `Shortcuts`.
Gli interruttori `Relationship DataType Sync` e `Maximum comment width` e il campo della larghezza sono disabilitati, come ogni pulsante di blocco. Le righe di `Column Order` non mostrano alcuna maniglia e non possono essere trascinate.
Ogni riga di `Lock` mostra comunque il suo valore. Una riga bloccata mostra il valore che il file conserva, e una sbloccata l’impostazione così come la ha quello schermo, che può differire da quella del file, come sotto.

Le impostazioni che decidono ciò che lo schermo mostra cambiano comunque: la posizione della vista e lo zoom, la scheda, la Visualizzazione nomi, il database, il linguaggio del Generatore di codice, entrambi gli stili dei nomi, il delimitatore e gli interruttori di [`View Option`](./table-related-functions.md#table-view-options).
Ognuna cambia solo quello schermo, qualunque sia il suo blocco. Non viene salvata nel file né scritta da un’esportazione JSON, non viene registrata nella cronologia di annullamento, non viene contata come modifica e non raggiunge mai i collaboratori. I pannelli delle opzioni delle schede [Schema SQL](./schema-sql.md#options-panel) e [Generatore di codice](./code-generator.md#options-panel) indicano lì queste scelte con `This window only`, al posto di `Saved in the document`.
Quando l’editor torna modificabile, il database, il linguaggio, gli stili dei nomi, il delimitatore e gli interruttori di View Option tornano ai valori del file. La vista, la scheda e la Visualizzazione nomi restano come le avete lasciate, e il file prende ciascuna di esse, nella misura in cui il suo blocco lo consente, con la successiva modifica.
