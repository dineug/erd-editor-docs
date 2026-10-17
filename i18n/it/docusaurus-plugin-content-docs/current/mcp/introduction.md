---
sidebar_position: 1
description: Permettere a un agente di programmazione come Claude Code o Codex di modificare i diagrammi di erd-editor tramite il server MCP @dineug/erd-editor-mcp, live in VS Code, Obsidian o un IDE JetBrains, oppure direttamente su disco.
---

# Introduzione

`@dineug/erd-editor-mcp` è un server MCP che permette a un agente di programmazione di modificare i diagrammi di erd-editor.
Claude Code, Codex e qualsiasi altro client del [Model Context Protocol](https://modelcontextprotocol.io) dispongono di uno strumento per ogni operazione su un documento: aggiungere una tabella, rinominare una colonna, mettere in relazione due tabelle, importare un dump DDL, rileggere lo schema come SQL.

Quando il documento è aperto nell’ERD Editor di [VS Code](https://marketplace.visualstudio.com/items?itemName=dineug.vuerd-vscode), di [Obsidian](https://community.obsidian.md/plugins/erd-editor) o di un [IDE JetBrains](https://plugins.jetbrains.com/plugin/23594-erd-editor), l’agente si unisce all’editor come un collaboratore.
Ogni modifica compare nell’area di disegno nel momento in cui avviene, e un annullamento dell’agente annulla soltanto le sue modifiche.
VS Code lascia non salvate le modifiche dell’agente finché non le salva l’agente o l’utente, mentre Obsidian e un IDE JetBrains le salvano come salvano quelle dell’utente.
Quando nessun editor detiene il documento, gli stessi strumenti modificano il file stesso.

![Un agente di programmazione che aggiunge tabelle e relazioni a un diagramma aperto in VS Code](/img/coding-agents.webp)

## Cosa può fare un agente {#what-an-agent-can-do}

- Creare o modificare uno schema nel corso di una conversazione: tabelle, colonne e ogni opzione delle colonne, relazioni con la loro cardinalità e le loro azioni ON DELETE e ON UPDATE, indici, memo, colori e posizioni nell’area di disegno. Vedere [Relazioni](./tools.md#relationships).
- Riunire le tabelle in [gruppi di tabelle](../guide/guides/table-groups.md): aggiungere un gruppo attorno alle tabelle che l’agente indica o sopra una zona dell’area di disegno, poi rinominarlo, assegnargli un colore, spostarlo insieme alle sue tabelle, ridimensionarlo, inserirvi tabelle o toglierle, oppure rimuoverlo, il che lascia le sue tabelle dove si trovano. Vedere [Gruppi di tabelle](./tools.md#table-groups).
- Sostituire il documento con uno schema ottenuto analizzando SQL DDL, GraphQL SDL, DBML o AML, oppure con un altro documento `.erd.json`. Oppure aggiungere quello schema o quel documento sotto il diagramma e mantenere tutto ciò che è già presente, come fa la funzione [`Import and Add`](../guide/guides/file-import-export.md#import-and-add) dell’editor. In entrambi i casi, un `TableGroup` DBML arriva come gruppo di tabelle. Vedere [Importazione](./tools.md#import).
- Rileggere il diagramma come elenco di id, come entità complete, come il testo `.erd.json` scritto da un salvataggio oppure come DDL per uno qualsiasi degli otto database, con le opzioni `Statements` e `Header` della scheda [Schema SQL](../guide/guides/schema-sql.md). Su uno schema di migliaia di tabelle legge una pagina, alcune tabelle o le tabelle di alcuni gruppi di tabelle alla volta. Vedere [Leggere un documento](./tools.md#reading-a-document).
- Impostare il database, il nome del database e gli [script](../guide/guides/schema-sql.md#before-and-after-scripts) scritti prima e dopo le tabelle nello Schema SQL, come `CREATE EXTENSION` prima di esse o `GRANT` dopo di esse. `erd_read` restituisce gli script da soli oppure all’interno del DDL dell’intero documento. Vedere [Impostazioni](./tools.md#settings).
- Eseguire più modifiche come una sola, tutte o nessuna, che si annullano in un solo passo. Vedere [erd_batch](./tools.md#erd_batch).
- Annullare e ripetere le proprie modifiche, mai quelle dell’utente.

Cosa non fa:

- Eseguire lo zoom, scorrere o cambiare scheda. Queste azioni sono proprie di ciascuna persona che visualizza il documento, quindi nessuno strumento le esegue. Un’importazione che sostituisce il documento sposta comunque la vista, anche quando `Viewport` è bloccato, come fa il sottomenu `Import` dell’editor: la riporta all’inizio dell’area di disegno al 100% oppure, con `erd_import_json`, alla vista del documento che carica, e anche alla sua scheda, a meno che quel documento non blocchi `Canvas Type`. Vedere [Importazione](./tools.md#import).
- Modificare [`View Option`](../guide/guides/table-related-functions.md#table-view-options), il linguaggio e gli stili dei nomi del Generatore di codice, il tipo di delimitatore oppure le impostazioni `Relationship DataType Sync`, `Maximum comment width` e `Column Order` della scheda [Impostazioni](../guide/guides/settings.md). Spetta all’utente impostarli nell’editor, e l’agente li legge così come li salva il file.
- Attivare o disattivare un [blocco](../guide/guides/settings.md#lock). Solo `erd_import_json`, quando sostituisce l’intero documento, cambia i blocchi o le impostazioni elencate sopra, sostituendoli con quelli del documento che carica. Un documento senza il campo `lockSettings`, come un file salvato dall’estensione per VS Code prima della versione `4.0.0` o dal plugin per Obsidian o per JetBrains prima della versione `1.0.0`, attiva tutti i blocchi. Annullare qualsiasi importazione che ha sostituito il documento ripristina le impostazioni e i blocchi che il documento aveva prima.
- Riassociare una relazione ad altre colonne, come fa la funzione [`Map Columns`](../guide/guides/relationship-editing.md#map-columns). L’agente invece rimuove la relazione, il che lascia al loro posto le sue colonne chiave esterna, e collega le colonne che desidera con `erd_link_columns`, in un unico `erd_batch` che si annulla in un solo passo.
- Eseguire il Generatore di codice. `erd_read` risponde con DDL o JSON, e l’agente stesso scrive il codice a partire da questi.

## Come funziona {#how-it-works}

Il server è un processo stdio avviato dal client MCP.
A ogni chiamata cerca un editor che detenga il documento: una finestra di VS Code, la finestra di un vault Obsidian o un IDE JetBrains, ognuno con l’estensione o il plugin ERD Editor.

- **Live** — un editor contiene il documento nella sua area di lavoro, nel suo vault o in uno dei suoi progetti aperti, oppure lo tiene aperto. Il server si unisce alla sessione di modifica di quell’editor e la modifica arriva nell’editor: non salvata in VS Code, e salvata come le modifiche dell’utente in Obsidian e in un IDE JetBrains.
- **Headless** — nessun editor. Il server carica il file, applica la modifica e riscrive il file.
- **Rifiutato** — un editor detiene il documento ma ha l’hub disattivato. Il server legge dal disco ma non scrive nulla, poiché l’editor aperto potrebbe sovrascrivere il file al suo salvataggio successivo. Anche un IDE JetBrains con l’hub attivo rifiuta di modificare un documento detenuto solo da progetti che non ritiene attendibili, sebbene l’agente possa comunque leggerlo. Quando l’hub dell’editor è attivo ma la sua estensione o il suo plugin ERD Editor usa un protocollo dell’hub diverso da quello del server, ogni chiamata sul documento viene rifiutata, letture comprese, con `protocolMismatch` e un messaggio che indica la parte da aggiornare — vedere [Aggiornamento](./installation.md#updating).

Per i dettagli, vedere [Live e headless](./live-and-headless.md).

## Requisiti {#requirements}

| | |
| --- | --- |
| Node.js | `22.12` o successiva, per eseguire il server |
| Un client MCP | Claude Code, Codex o qualsiasi client in grado di avviare un server stdio |
| VS Code, per la modifica live | `1.101.0` o successiva, con l’estensione ERD Editor `4.0.0` o successiva |
| Obsidian, per la modifica live | L’app desktop `1.5.7` o successiva, con il plugin ERD Editor `1.0.0` o successivo |
| Un IDE JetBrains, per la modifica live | Un IDE basato su IntelliJ `2025.2` o successivo, con il plugin ERD Editor `1.0.0` o successivo |

Il server `1.0.0` e le versioni indicate sopra usano il protocollo 2 dell’hub.
Le versioni precedenti che servono gli agenti usano il protocollo 1: l’estensione per VS Code dalla `3.0.0` alla `3.1.0`, il plugin per Obsidian `0.1.0` e `0.2.0` e il plugin per JetBrains `0.9.0` e `0.10.0`.
Una versione del genere e il server `1.0.0` si rifiutano a vicenda, e lo stesso vale per un server precedente e le versioni indicate sopra — vedere [Aggiornamento](./installation.md#updating).
Un’estensione per VS Code precedente alla versione `3.0.0` o un plugin per JetBrains precedente alla versione `0.9.0` non ha alcun hub, quindi il server non lo vede e modifica il file su disco, anche quello di un diagramma aperto al suo interno.

Passo successivo: [Installazione](./installation.md).
