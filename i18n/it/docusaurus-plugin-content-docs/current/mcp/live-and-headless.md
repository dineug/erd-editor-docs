---
sidebar_position: 3
description: Come il server MCP decide tra la modifica live in un editor (VS Code, Obsidian o un IDE JetBrains) e la modifica del file su disco, e cosa fanno in ciascun caso il salvataggio, l’annullamento e un editor chiuso.
---

# Live e headless

A ogni chiamata il server cerca un editor che detenga il documento, tramite i file di lock che gli editor mantengono in `~/.erd-editor/ide/`.
Ogni finestra di VS Code e ogni finestra di un vault Obsidian con l’ERD Editor ne mantiene uno, e un IDE JetBrains ne mantiene uno per l’intero IDE, che elenca ogni progetto aperto al suo interno.
Un editor rimuove il proprio file di lock quando si chiude.
Ciò che il server trova decide dove va la modifica.

| Cosa trova | Cosa fa una modifica |
| --- | --- |
| Un editor la cui area di lavoro, il cui vault o il cui progetto aperto contiene il documento, oppure che lo tiene aperto | **Live.** Apre il documento nell’ERD Editor se necessario, si unisce alla sessione di modifica e vi applica la modifica. Le modifiche compaiono subito e vengono salvate come l’editor salva quelle dell’utente — vedere [Salvataggio](#saving). |
| Nessun editor | **Headless.** Carica il file, applica la modifica e sostituisce il file. `erd_save` non ha nulla da fare. |
| Un editor con l’hub disattivato | **Rifiutato.** Le letture funzionano comunque, dal disco. Una modifica scritta nel file mentre un editor lo tiene aperto potrebbe essere sovrascritta dal suo salvataggio successivo, quindi il server non scrive nulla. |
| Un editor con l’hub attivo ma che usa un protocollo diverso da quello del server: con il server `1.0.0`, un’estensione per VS Code `3.x`, un plugin per Obsidian `0.x` o un plugin per JetBrains `0.9.0` o `0.10.0`; con un server precedente alla versione `1.0.0`, l’estensione `4.0.0` o successiva, oppure un plugin `1.0.0` o successivo | **Rifiutato**, letture comprese, con `protocolMismatch`. Il messaggio indica la parte da aggiornare: l’estensione o il plugin, oppure il server — vedere [Aggiornamento](./installation.md#updating). |
| Su Windows, un editor che detiene il documento con un altro percorso dello stesso file: l’agente lo ha indicato tramite una condivisione di rete o un’unità mappata di questo computer, come `\\localhost\C$\…`, e l’editor lo detiene tramite il suo percorso con lettera di unità, o viceversa | **Rifiutato**, letture comprese, con `invalidPath`. Il messaggio indica il percorso con cui l’editor detiene il documento; chiamare di nuovo con quel percorso. |
| Su Windows, un editor a cui Windows nega l’accesso all’agente: uno avviato come amministratore quando l’agente non lo era, oppure qualsiasi editor quando l’agente viene eseguito in una sandbox | **Rifiutato**, letture comprese, con `hubUnreachable` e un messaggio che spiega il motivo. Eseguire l’editor e l’agente con gli stessi diritti, ad esempio avviando di nuovo l’editor senza diritti di amministratore. |

Il risultato di una modifica indica la modalità in cui è stata eseguita, `live` o `headless`, e una modifica rifiutata spiega il motivo.
La ricerca viene ripetuta a ogni chiamata, quindi aprire o chiudere un editor sposta di conseguenza la chiamata successiva.

Quando più editor detengono il documento, uno che lo tiene aperto prevale su uno che gestisce soltanto una cartella che lo contiene e, tra quelli che gestiscono una cartella, prevale quello la cui cartella si trova più in profondità.
In caso di parità, come due editor che lo tengono aperto entrambi, prevale quello il cui file di lock è cambiato per ultimo.
Così un documento in un vault Obsidian all’interno di una cartella dell’area di lavoro di VS Code va a Obsidian, a meno che VS Code lo tenga aperto e Obsidian no.

Le chiamate su uno stesso documento vengono eseguite una alla volta, nell’ordine in cui hanno raggiunto il server. Le chiamate su documenti diversi vengono eseguite in parallelo.

## Live {#live}

L’agente si unisce all’editor come un collaboratore in più.
Le sue modifiche raggiungono subito ogni editor aperto sul documento, e il suo focus viene disegnato sulla tabella e sulla cella che sta modificando, come quello di un collaboratore — vedere [focusTracker](../api/advanced/collaborative-editing.md#focustracker).

Una lettura non apre mai un editor. Una modifica apre il documento nell’ERD Editor quando non è ancora aperto, senza prendere il focus della tastiera.

### Salvataggio {#saving}

Ogni editor salva le modifiche dell’agente nello stesso modo in cui salva quelle dell’utente.

In VS Code le modifiche dell’agente contrassegnano la scheda come non salvata, come quelle dell’utente, e raggiungono il disco solo quando il documento viene salvato.
`erd_save` lo salva tramite VS Code, come fa il suo comando di salvataggio. In alternativa è possibile salvarlo con `Ctrl + S` (Windows/Linux) o `⌘ + S` (Mac).
Se si chiude l’editor con modifiche dell’agente non salvate, viene chiesto se salvarle, come per qualsiasi altra modifica non salvata.

Obsidian salva le modifiche dell’agente circa due secondi dopo l’interruzione delle modifiche, e la chiusura della scheda le salva senza chiedere conferma.
Un IDE JetBrains le scrive una frazione di secondo dopo l’interruzione delle modifiche, e la chiusura della scheda scrive ciò che è ancora in sospeso; la scheda non risulta mai modificata.
In entrambi i casi, `erd_save` le scrive subito.

`erd_save` attende prima fino a due secondi che l’editor contenga ogni modifica apportata dall’agente.
Viene rifiutato con `notSaved` quando l’editor non ha potuto confermarlo o non ha scritto il file: VS Code mantiene una scheda non salvata quando il file è cambiato su disco, e un IDE JetBrains non ha potuto scriverlo, ad esempio mentre era aperta una finestra di dialogo o quando il file non può essere scritto.

In VS Code e in un IDE JetBrains, `erd_save` su un documento in cui non resta nulla da salvare va a buon fine e lascia il file com’è.
È così una volta salvata ogni modifica, cosa che un IDE JetBrains fa da solo, e resta così finché ogni modifica successiva è una di quelle che un [blocco](../guide/guides/settings.md#lock) tiene fuori dal file, come scorrere o eseguire lo zoom con `Viewport` bloccato, o cambiare scheda con `Canvas Type` bloccato. Ogni blocco è attivo per impostazione predefinita.
Un file che un IDE JetBrains non può scrivere viene rifiutato anche in quel caso.

Quando l’editor chiude il documento dopo l’ultima modifica dell’agente, la chiamata successiva dell’agente riporta una nota secondo cui quelle modifiche si trovano nel file solo se sono state salvate prima della chiusura dell’editor.

### Annullamento {#undo}

`erd_undo` annulla l’ultima modifica fatta dall’agente, mai quelle dell’utente, e `erd_redo` la applica di nuovo.
La funzione [Annulla](../guide/guides/undo-redo.md) dell’editor stesso funziona al contrario: annulla le modifiche dell’utente e mai quelle dell’agente, poiché le modifiche che arrivano da un altro editor non vengono registrate nella cronologia dell’utente.

Alcune modifiche non creano un passo di annullamento nell’editor: `erd_set_database` e `erd_set_database_name` tra gli [strumenti delle impostazioni](./tools.md#settings), e `erd_resize_memo`.
Non ne crea nemmeno un `erd_move_table_group` che sposta il gruppo di meno di 20 pixel in tutto, sommando lo spostamento orizzontale e quello verticale, anche se il gruppo resta dove è stato spostato.
Non ne crea nemmeno una chiamata che non cambia nulla: `erd_set_column_primary_key`, `erd_set_column_unique`, `erd_set_column_not_null`, `erd_set_column_auto_increment`, `erd_set_index_unique` o `erd_set_index_column_order` che imposta un valore già contenuto nel documento; `erd_add_index_column` con una colonna già presente nell’indice; `erd_set_table_group` con tabelle già in quel gruppo (o già senza gruppo, con `groupId` `null`); `erd_move_table_group` verso il punto in cui il gruppo si trova già; `erd_resize_table_group` con il rettangolo che il gruppo ha già; `erd_sort_tables` su un documento senza tabelle; oppure un’importazione con `mode` `append` che non porta alcuna tabella (per `erd_import_json`, nessuna tabella e nessun memo).
`erd_undo` le salta e le indica per nome nel suo risultato.
Altre modifiche, come `erd_change_relationship_type`, `erd_change_relationship_on_delete`, `erd_change_relationship_on_update`, `erd_change_table_group_name`, `erd_change_table_group_color` e `erd_set_ddl_script`, creano un passo di annullamento anche quando impostano un valore che il documento contiene già.

La cronologia delle modifiche dell’agente si interrompe, con una nota nel risultato, quando:

- L’agente si unisce di nuovo al documento, ad esempio dopo che l’editor ha escluso l’agente dal documento.
- L’editor viene chiuso, oppure chiude il documento e smette di gestirlo, e l’agente continua a modificare il file su disco.
- Un editor prende in carico un documento che l’agente stava modificando su disco.

Il server chiude inoltre un documento su cui l’agente non esegue chiamate da 30 minuti, e la cronologia delle modifiche viene eliminata con esso, senza alcuna nota.

### Quando l’editor scompare {#when-the-editor-goes-away}

Finché un editor detiene un documento, il server non ripiega mai autonomamente sul file.
Se la connessione si interrompe, si riconnette.
Solo quando l’editor è stato chiuso, oppure ha chiuso il documento e non elenca più né il documento né una cartella che lo contiene, il server modifica il file, e lo segnala nel risultato.
Ciò accade quando si chiude un diagramma che si trova fuori da ogni cartella gestita dall’editor (in VS Code, uno aperto dall’esterno dell’area di lavoro), quando si disattiva il plugin ERD Editor in Obsidian e quando, in un IDE JetBrains, si chiude il progetto che contiene il documento o vi si disattiva il plugin.
Un diagramma chiuso all’interno di una cartella gestita dall’editor resta affidato all’editor, e la modifica successiva dell’agente lo riapre.

Un editor ancora in esecuzione, ma il cui file di lock non c’è più e la cui connessione si è chiusa senza che abbia chiuso il documento, rifiuta la modifica successiva con `hubGone`.
Il messaggio indica cosa libera il documento: in VS Code, ricaricare quella finestra, oppure chiuderla per consentire all’agente di modificare direttamente il file; in Obsidian, riattivare il plugin ERD Editor, oppure chiudere quella finestra; in un IDE JetBrains, riattivare il plugin, oppure chiudere l’IDE.

Una lettura passa invece al file su disco, con una nota secondo cui mancano le modifiche non ancora salvate nell’editor, in due casi: quando l’editor che detiene il documento ha l’hub disattivato, e nel caso `hubGone` descritto sopra.
Una lettura che non riesce a connettersi all’hub di un editor viene rifiutata con `hubUnreachable`, come una modifica.

## Headless {#headless}

Quando nessun editor gestisce il documento, ogni modifica carica il file, vi applica il cambiamento e lo riscrive.
La scrittura avviene in un file temporaneo accanto al documento, denominato `.<name>.<id>.tmp`, che poi lo sostituisce, così il documento non resta mai scritto a metà, tranne su Windows nel caso della scrittura diretta descritto più avanti.

Prima di quest’ultimo passaggio il server verifica se il file è cambiato su disco durante la chiamata.
In tal caso non viene scritto nulla, il file viene ricaricato e la chiamata viene rifiutata con `conflict`. L’agente esegue di nuovo la chiamata.
Un file cambiato tra due chiamate viene semplicemente ricaricato, e la cronologia delle modifiche dell’agente precedente a quel momento viene eliminata.

Un file di sola lettura viene lasciato com’è, e la modifica viene rifiutata con `readonly`: un file senza permesso di scrittura per il suo proprietario, o con l’attributo di sola lettura su Windows, come un file Perforce o TFVC su cui non è stato eseguito il checkout.
Renderlo scrivibile, quindi eseguire di nuovo la chiamata. Le letture funzionano comunque.

Se un editor inizia a gestire il documento mentre l’agente lo modifica su disco, quella singola modifica viene rifiutata con `hubAppeared` e non viene scritto nulla. La chiamata successiva modifica tramite l’editor.

Su Windows si applicano altre due regole:

- Un documento con permessi propri, diversi da quelli della sua cartella, viene scritto direttamente invece di essere sostituito, in modo da conservarli, e il file temporaneo viene poi rimosso. Un programma che legge il documento durante quella scrittura può trovare un testo che non può essere analizzato.
- Un file che un altro programma tiene aperto non può essere sostituito, quindi il server riprova per un massimo di due secondi. Ogni tentativo cerca prima di nuovo un editor, e un editor che nel frattempo ha iniziato a gestire il documento rifiuta la scrittura con `hubAppeared`, oppure con `blocked` quando il suo hub è disattivato. Se dopo due secondi il file è ancora tenuto aperto, non viene scritto nulla, il file viene ricaricato e la chiamata non riesce, con un messaggio che riporta l’errore di sistema.

## Rifiutato {#refused}

Una finestra di VS Code mantiene il proprio file di lock anche quando il suo hub è disattivato: quando `dineug.erd-editor.agentHub.enabled` è disattivato, quando l’area di lavoro non è attendibile o quando il suo hub non è riuscito a mettersi in ascolto.
Una finestra di un vault Obsidian mantiene il proprio file di lock con l’hub disattivato quando l’impostazione Coding agents è disattivata e quando il suo hub non è riuscito a mettersi in ascolto.
Un IDE JetBrains mantiene il proprio file di lock con l’hub disattivato quando l’impostazione Coding agents è disattivata, quando il suo hub non è riuscito a mettersi in ascolto e mentre l’IDE si sta chiudendo.

Una modifica a un documento di questo tipo viene rifiutata con `blocked`, perché l’editor aperto potrebbe sovrascrivere al suo salvataggio successivo una modifica scritta nel file.
Le letture funzionano comunque, dal file su disco.

Per consentire all’agente di apportare modifiche, riattivare l’hub, come indica il messaggio per quell’editor: in VS Code, considerare attendibile l’area di lavoro e attivare l’impostazione, oppure ricaricare la finestra; in Obsidian, attivare l’impostazione Coding agents, oppure ricaricare Obsidian; in un IDE JetBrains, attivare l’impostazione Coding agents, oppure riavviare l’IDE se è già attiva.

Un IDE JetBrains rifiuta inoltre, con `hubDisabled`, di modificare un documento detenuto solo da progetti che non considera attendibili.
Gli agenti possono comunque leggere un documento di questo tipo, e `erd_list_documents` lo elenca come `readonly`. Considerare attendibile il progetto, quindi eseguire di nuovo la chiamata.

Un editor che non mantiene alcun file di lock non protegge nulla, e l’agente modifica il file su disco anche mentre il diagramma vi è aperto.
È il caso di Obsidian o di un IDE JetBrains installati come Flatpak su Linux, di un IDE JetBrains senza JCEF e di un IDE JetBrains il cui hub non è riuscito ad avviarsi — vedere [Configurare Obsidian](./installation.md#set-up-obsidian) e [Configurare un IDE JetBrains](./installation.md#set-up-a-jetbrains-ide).
Non ne mantengono nemmeno un’estensione per VS Code precedente alla versione `3.0.0` e un plugin per JetBrains precedente alla versione `0.9.0`, poiché non hanno un hub.

## Documenti {#documents}

Un documento viene indicato tramite `path`, assoluto o relativo alla directory di lavoro del server.

- I nuovi documenti sono `.erd.json`. `erd_open_document` con `create` crea il file, aggiungendo `.erd.json` a un nome senza estensione. Come un nuovo diagramma nell’editor, il nuovo documento ha ogni [blocco](../guide/guides/settings.md#lock) attivo, quindi scorrere, eseguire lo zoom, cambiare scheda o scegliere un altro linguaggio del Generatore di codice, stile dei nomi o tipo di delimitatore in un editor non modifica mai il file. Nessuno strumento attiva o disattiva un singolo blocco: lo si fa nella scheda Impostazioni dell’editor. `erd_import_json` in modalità `replace` li sostituisce tutti con quelli del documento che carica — vedere [Importazione](./tools.md#import).
- Si aprono anche i file `.erd`, `.vuerd` e `.vuerd.json` esistenti. Un percorso con qualsiasi altra estensione viene rifiutato con `invalidPath`.
- Su Windows, un percorso che contiene un nome che Windows non memorizza così come è scritto viene rifiutato con `invalidPath` prima che il documento venga letto o scritto, letture comprese: un nome con i due punti o un altro carattere che Windows rifiuta, come `orders:v2.erd`; un nome di dispositivo come `NUL.erd` o `CON.erd`, con qualsiasi combinazione di maiuscole e minuscole; oppure un nome che termina con un punto o uno spazio. Rinominarlo, ad esempio con `-` al posto di `:`.
- Un file che non è un documento leggibile dall’editor, come uno rimasto con i marcatori di conflitto di merge, viene rifiutato con `invalidDocument` e lasciato com’è. Non viene mai caricato come diagramma vuoto e poi riscritto.

L’agente modifica un documento solo tramite gli strumenti e riceve l’istruzione di non scrivere mai direttamente il file.

`erd_list_documents` elenca i documenti con `path`, `open`, `active`, `dirty` e `readonly`.
Interroga l’editor che gestisce la directory di lavoro, scelto come per un documento, ed elenca i diagrammi aperti al suo interno, poi i file ERD che gestisce: quelli nelle cartelle dell’area di lavoro di una finestra di VS Code, in un vault Obsidian o in ogni progetto aperto in un IDE JetBrains.
Altrimenti elenca i file ERD sotto la directory di lavoro, dove un file di sola lettura viene contrassegnato come `readonly` e, su Windows, un nome che Windows non memorizza così come è scritto viene escluso.
