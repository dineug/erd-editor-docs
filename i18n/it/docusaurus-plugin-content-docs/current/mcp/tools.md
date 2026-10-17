---
sidebar_position: 4
description: Ogni strumento offerto dal server MCP di erd-editor — leggere un documento una pagina alla volta, i 54 strumenti di modifica, erd_batch e l’aspetto di un risultato e di un rifiuto.
---

# Strumenti

Il server offre 63 strumenti: cinque strumenti di sessione, tre strumenti di lettura, 54 strumenti di modifica, uno per ogni operazione di modifica, e `erd_batch`, che esegue più strumenti di modifica come un’unica modifica.

Ogni strumento tranne `erd_list_documents` accetta il `path` del documento come primo argomento, e le tabelle seguenti lo omettono.
Un argomento contrassegnato con `?` è facoltativo.

## Strumenti di sessione {#session-tools}

| Strumento | Argomenti | Cosa fa |
| --- | --- | --- |
| `erd_list_documents` | | Elenca i documenti ERD con `path`, `open`, `active`, `dirty` e `readonly`: quelli dell’editor che gestisce la directory di lavoro, che in un IDE JetBrains comprende ogni progetto aperto, altrimenti i file ERD sotto la directory di lavoro. |
| `erd_open_document` | `create?` | Apre un documento per la modifica, nell’ERD Editor dell’editor che lo gestisce, se ce n’è uno. Con `create` crea prima il file se non esiste, e a un nome senza estensione viene aggiunto `.erd.json`. |
| `erd_save` | | Salva un documento che un editor detiene. VS Code mantiene non salvate le modifiche dell’agente finché non viene chiamato questo strumento; Obsidian e un IDE JetBrains le salvano come salvano quelle dell’utente, e questo strumento le scrive subito. In modalità headless, ogni modifica è già scritta e questo strumento non fa nulla. |
| `erd_undo` | | Annulla l’ultima modifica fatta da questo agente, mai quelle dell’utente. Le chiamate che non hanno creato alcun passo di annullamento vengono saltate e indicate per nome. |
| `erd_redo` | | Applica di nuovo la modifica annullata per ultima da `erd_undo`. |

Per sapere cosa fanno il salvataggio e l’annullamento in ciascuna modalità, vedere [Live e headless](./live-and-headless.md).

## Leggere un documento {#reading-a-document}

| Strumento | Argomenti | Cosa fa |
| --- | --- | --- |
| `erd_list` | `query?`, `offset?`, `limit?`, `namesOnly?` | Le impostazioni e i conteggi, poi una pagina di tabelle con i relativi indici e relazioni, ciascuna tabella con il suo id, la sua posizione e la sua dimensione nell’area di disegno, il numero di colonne e il gruppo di tabelle, se ne fa parte. Salvo quando esegue una ricerca, dopo le tabelle seguono i gruppi di tabelle e poi i memo. |
| `erd_get` | `tableIds?`, `tableNames?`, `relationshipIds?`, `indexIds?`, `memoIds?`, `tableGroupIds?` | Le entità indicate, per intero: le tabelle con le loro colonne e il loro gruppo di tabelle, le relazioni con le loro colonne e i loro `onDelete` e `onUpdate`, gli indici con le loro colonne, i memo con il loro testo, i gruppi di tabelle con le loro tabelle. |
| `erd_read` | `format`, `vendor?`, `statements?`, `header?`, `tableIds?`, `tableNames?`, `groupNames?` | L’intero documento in una volta in uno dei quattro formati, oppure il DDL solo di alcune tabelle o di alcuni gruppi di tabelle. |

Un agente trova gli id con `erd_list`, legge le colonne e gli altri dettagli con `erd_get` e passa quegli id agli strumenti di modifica.
La dimensione di una tabella in `erd_list` è il riquadro che occupa nell’area di disegno: l’altezza esatta, la larghezza approssimativa.
Un gruppo di tabelle viene elencato con il rettangolo che memorizza, con il suo nome, il suo colore e il numero di tabelle che contiene.
Ogni relazione viene elencata una sola volta, con una delle sue due tabelle.
Le impostazioni riportate da `erd_list` e `erd_read` sono quelle salvate nel file — vedere [Impostazioni](#settings).

`erd_read` accetta uno di quattro formati:

| `format` | Cosa restituisce |
| --- | --- |
| `snapshot` | JSON compatto con ogni entità e il suo id, gruppi di tabelle inclusi, e le impostazioni con gli script di Schema SQL. Omette ciò che varia da un utente all’altro: le larghezze misurate, l’ordine di sovrapposizione, la vista e la scheda. Voluminoso su uno schema esteso. |
| `sql` | DDL per uno degli otto database, `Databricks`, `MariaDB`, `MSSQL`, `MySQL`, `Oracle`, `PostgreSQL`, `Snowflake` o `SQLite`. `vendor` ha come valore predefinito il database impostato nel documento. Il DDL dell’intero documento include i suoi script prima e dopo le tabelle. Con `tableIds`, `tableNames` o `groupNames`, solo quelle tabelle, con le chiavi esterne che contengono, e nessuno script. Le chiavi esterne riportano le loro azioni ON DELETE e ON UPDATE, tranne quelle che il database di destinazione omette — vedere [ON DELETE e ON UPDATE](../guide/guides/relationship-editing.md#on-delete-and-on-update). |
| `json` | L’intero documento esattamente come un salvataggio scrive il file, incluse le modifiche che l’editor non ha ancora salvato — vedere [Forma di archiviazione e valore di runtime](../api/advanced/schema.md#storage-form-and-runtime-value). |
| `scripts` | Solo gli script prima e dopo le tabelle del documento, come `{"before":"…","after":"…"}`, ciascuno vuoto quando non è impostato, per quanto grande sia lo schema. |

Solo il formato `sql` accetta `vendor`, `statements`, `header`, `tableIds`, `tableNames` e `groupNames`, e un altro formato li rifiuta.

- `statements`: `create`, il valore predefinito; `ifNotExists`, che scrive `CREATE TABLE IF NOT EXISTS` su MySQL, MariaDB, PostgreSQL, SQLite e Databricks e un semplice `CREATE TABLE` sugli altri; oppure `recreate`, che elimina le tabelle prima di crearle, dove Snowflake scrive invece `CREATE OR REPLACE TABLE`.
- `header`: `none`, il valore predefinito; `use`, che seleziona il database o lo schema indicato dal nome del database del documento; oppure `createAndUse`, che prima lo crea. Oracle ha solo `use`, quindi lì `createAndUse` scrive `use`, e PostgreSQL ha solo `createAndUse`, quindi lì `use` non scrive alcuna intestazione. SQLite non ne scrive nessuna, e nessun database ne scrive una finché il nome del database è vuoto o non è un identificatore semplice.
- `groupNames`: le tabelle dei gruppi di tabelle indicati, per nome senza distinzione tra maiuscole e minuscole, unite a `tableIds` e `tableNames`. Un nome che non corrisponde ad alcun gruppo viene rifiutato con `notFound`. Un gruppo che non contiene tabelle non ne aggiunge nessuna, e una lettura che resta senza alcuna tabella, come quando ogni gruppo indicato è vuoto e non viene indicata alcuna tabella, viene rifiutata con `invalidArgs`.

Anche al DDL di alcune tabelle si applicano `statements` e `header`. Funzionano come le opzioni `Statements` e `Header` della scheda [Schema SQL](../guide/guides/schema-sql.md#options-panel) dell’editor, anche se la scheda parte da `If not exists` e `CREATE + USE`.
I nomi vengono delimitati con il tipo di delimitatore salvato nel file, quello bloccato mentre `Bracket Type` è bloccato — vedere [Blocco](../guide/guides/settings.md#lock).

### Schemi di grandi dimensioni {#large-schemas}

Funzionano anche schemi di centinaia o migliaia di tabelle.
Una lettura restituisce al massimo 40.000 caratteri, sotto la soglia oltre la quale Claude Code mette da parte il risultato di uno strumento in un file.

- `erd_list` restituisce per impostazione predefinita una pagina di 100 elementi, prima le tabelle, poi i gruppi di tabelle, poi i memo, e indica dove inizia la pagina successiva con `nextOffset` e una `note`. Passare quel `nextOffset` come `offset`, con la stessa `query`.
- `query` trova le tabelle in base a parole contenute nel nome o nel commento di una tabella o di una colonna, senza distinzione tra maiuscole e minuscole. Le tabelle i cui nomi contengono più parole cercate compaiono per prime. Una ricerca non elenca gruppi di tabelle né memo.
- `namesOnly` elenca solo i nomi delle tabelle, circa 2000 nomi brevi in una sola risposta.
- `erd_get` e `erd_read` accettano `tableNames` oltre agli id, e `erd_read` accetta `groupNames`, quindi un agente a cui viene chiesta una query SQL su uno schema esteso legge il DDL solo delle tabelle di cui ha bisogno.
- `erd_get` elenca sotto `missing` gli id e i nomi che non indicano nulla, e sotto `notReturned` gli id per cui una risposta non ha spazio, da richiedere di nuovo.
- Una lettura troppo grande per una sola risposta viene rifiutata con `tooLarge`, con l’indicazione di come restringerla.

## Strumenti di modifica {#edit-tools}

Gli id provengono da `erd_list` e `erd_get`, oppure dai `createdIds` della chiamata che ha creato l’entità.
Un nuovo id è composto da 25 lettere minuscole e cifre, come `03h17be2plxpj5n59tqag7ogj`, mentre un id già presente nel documento mantiene la sua forma, quindi non bisogna dedurre nulla dalla forma di un id.
`x` e `y` sono i bordi sinistro e superiore nell’area di disegno, in pixel, e un colore è un colore esadecimale CSS come `#3b82f6`, oppure una stringa vuota, che rimuove il colore.

### Tabelle {#tables}

| Strumento | Argomenti | Cosa fa |
| --- | --- | --- |
| `erd_add_table` | | Aggiunge una tabella vuota in un punto libero e ne restituisce l’id in `createdIds`. |
| `erd_remove_table` | `tableId` | Rimuove una tabella con le sue colonne, i suoi indici e ogni relazione che la coinvolge. |
| `erd_change_table_name` | `tableId`, `value` | Rinomina una tabella. |
| `erd_change_table_comment` | `tableId`, `value` | Imposta il commento di una tabella. Una stringa vuota lo cancella. |
| `erd_change_table_color` | `tableId`, `color` | Imposta il colore di una tabella. |
| `erd_move_table` | `tableId`, `x`, `y` | Sposta una tabella in una posizione nell’area di disegno. |
| `erd_move_tables` | `positions` | Sposta più tabelle in un’unica modifica, che un solo `erd_undo` annulla. `positions` contiene `{ tableId, x, y }` per ogni tabella, ciascuna tabella al massimo una volta. |
| `erd_sort_tables` | | Dispone tutte le tabelle in righe nell’area di disegno, prima quelle con meno colonne, come le dispongono `erd_import_sql`, `erd_import_graphql`, `erd_import_dbml` e `erd_import_aml`. Le tabelle di un gruppo di tabelle restano insieme, e il riquadro di ciascun gruppo viene adattato attorno a esse. |

### Colonne {#columns}

| Strumento | Argomenti | Cosa fa |
| --- | --- | --- |
| `erd_add_column` | `tableId` | Aggiunge una colonna vuota a una tabella e ne restituisce l’id in `createdIds`. |
| `erd_remove_columns` | `tableId`, `columnIds` | Rimuove colonne da una tabella, con le relazioni e le voci di indice che le usano. |
| `erd_change_column_name` | `tableId`, `columnId`, `value` | Rinomina una colonna. |
| `erd_change_column_data_type` | `tableId`, `columnId`, `value` | Imposta il tipo di dati, come `INT` o `VARCHAR(255)`. Mentre l’impostazione [Sincronizzazione tipo di dati nelle relazioni](../guide/guides/settings.md#relationship-datatype-sync) è attiva, la modifica segue le relazioni in entrambe le direzioni, come avviene nell’editor: un tipo seriale arriva alle chiavi esterne come il tipo intero che memorizza, così come lo copia `erd_add_relationship`, e una chiave seriale mantiene il suo tipo quando cambia una delle sue chiavi esterne, il che ferma lì la modifica. Spetta all’utente attivare o disattivare la sincronizzazione, e `erd_list` la riporta come `relationshipDataTypeSync`. |
| `erd_change_column_default` | `tableId`, `columnId`, `value` | Imposta il valore predefinito, come testo SQL. Una stringa vuota lo cancella. |
| `erd_change_column_comment` | `tableId`, `columnId`, `value` | Imposta il commento. Una stringa vuota lo cancella. |
| `erd_set_column_primary_key` | `tableId`, `columnId`, `value` | `true` rende la colonna parte della chiave primaria, `false` la esclude. |
| `erd_set_column_unique` | `tableId`, `columnId`, `value` | Imposta se la colonna è univoca. |
| `erd_set_column_not_null` | `tableId`, `columnId`, `value` | Imposta se la colonna è `NOT NULL`. |
| `erd_set_column_auto_increment` | `tableId`, `columnId`, `value` | Imposta se la colonna ha l’incremento automatico. |
| `erd_move_column` | `tableId`, `columnId`, `targetColumnId` | Sposta una colonna all’interno della sua tabella nella posizione di un’altra colonna. |

### Relazioni {#relationships}

`relationshipType` è la cardinalità sul lato figlio: `ZeroOne`, `ZeroN`, `OneOnly` o `OneN`.
La tabella di partenza è la tabella padre, il lato referenziato che contiene la chiave primaria, e la tabella di arrivo è la tabella figlia.
`onDelete` e `onUpdate` sono le azioni ON DELETE e ON UPDATE della chiave esterna: `none`, `noAction`, `cascade`, `setNull`, `setDefault` o `restrict`.
`none` non scrive alcuna clausola, quindi si applica il comportamento predefinito del database — vedere [ON DELETE e ON UPDATE](../guide/guides/relationship-editing.md#on-delete-and-on-update).
Un’azione omessa in `erd_add_relationship` o `erd_link_columns` è `none`.

| Strumento | Argomenti | Cosa fa |
| --- | --- | --- |
| `erd_add_relationship` | `startTableId`, `endTableId`, `relationshipType`, `onDelete?`, `onUpdate?` | Mette in relazione due tabelle. Copia la chiave primaria della tabella padre nella tabella figlia come colonne chiave esterna, creando prima una colonna chiave primaria se la tabella padre non ne ha. Ogni colonna chiave esterna riceve il nome che le assegna l’editor quando si disegna una relazione: la chiave `id` di `users` dà `users_id`, e una chiave come `member_id` mantiene il suo nome — vedere [Nomi delle colonne chiave esterna](../guide/guides/relationship-editing.md#foreign-key-column-names). Ognuna copia il tipo di dati della sua chiave, tranne che una chiave seriale dà il tipo intero che memorizza, come `integer` per `serial4`, e un `serial` semplice resta `serial` al di fuori di PostgreSQL, MySQL e MariaDB — vedere [Relazioni identificanti](../guide/guides/relationship-editing.md#identifying-relationships). `createdIds` contiene la nuova colonna chiave, se ne è stata creata una, le colonne chiave esterna e, per ultimo, l’id della relazione. |
| `erd_link_columns` | `startTableId`, `startColumnIds`, `endTableId`, `endColumnIds`, `relationshipType`, `onDelete?`, `onUpdate?` | Disegna una relazione tra colonne già esistenti, abbinando le colonne di partenza e di arrivo in base alla posizione. Non rinomina alcuna colonna e non cambia alcun tipo di dati. |
| `erd_remove_relationship` | `relationshipId` | Rimuove la linea di una relazione. Le sue colonne chiave esterna restano nella tabella. |
| `erd_change_relationship_type` | `relationshipId`, `relationshipType` | Cambia la cardinalità di una relazione. |
| `erd_change_relationship_on_delete` | `relationshipId`, `onDelete` | Imposta l’azione ON DELETE di una relazione: l’effetto che l’eliminazione di una riga padre ha sulle sue righe figlie. |
| `erd_change_relationship_on_update` | `relationshipId`, `onUpdate` | Imposta l’azione ON UPDATE di una relazione: l’effetto che la modifica di una chiave padre ha sulle sue righe figlie. |

`erd_add_relationship` assegna i nomi alle colonne chiave esterna quando viene eseguito, quindi assegnare prima un nome alla tabella padre e alla sua chiave primaria.

Nessuno strumento cambia le colonne di una relazione esistente come fa [Associa colonne](../guide/guides/relationship-editing.md#map-columns) nell’editor.
Per associare una relazione ad altre colonne, eseguire `erd_remove_relationship`, che lascia le sue colonne chiave esterna nella tabella, e `erd_link_columns` con le colonne desiderate, in un unico `erd_batch`, che un solo `erd_undo` annulla.

### Indici {#indexes}

Un id di colonna dell’indice è una voce dell’elenco di colonne dell’indice restituito da `erd_get`, non l’id della colonna della tabella.

| Strumento | Argomenti | Cosa fa |
| --- | --- | --- |
| `erd_add_index` | `tableId` | Aggiunge un indice vuoto a una tabella e ne restituisce l’id in `createdIds`. |
| `erd_remove_index` | `indexId` | Rimuove un indice. |
| `erd_change_index_name` | `indexId`, `value` | Rinomina un indice. |
| `erd_set_index_unique` | `indexId`, `value` | Imposta se l’indice è univoco. |
| `erd_add_index_column` | `indexId`, `columnId` | Aggiunge una colonna della tabella dell’indice e restituisce il nuovo id di colonna dell’indice. Una colonna già presente nell’indice resta invariata. |
| `erd_remove_index_column` | `indexId`, `indexColumnId` | Rimuove una colonna da un indice. |
| `erd_move_index_column` | `indexId`, `indexColumnId`, `targetIndexColumnId` | Sposta una colonna all’interno di un indice nella posizione di un’altra delle sue colonne. |
| `erd_set_index_column_order` | `indexId`, `indexColumnId`, `orderType` | Imposta l’ordinamento di una colonna in un indice, `ASC` o `DESC`. |

### Memo {#memos}

| Strumento | Argomenti | Cosa fa |
| --- | --- | --- |
| `erd_add_memo` | | Aggiunge un memo vuoto in un punto libero e ne restituisce l’id in `createdIds`. |
| `erd_remove_memo` | `memoId` | Rimuove un memo. |
| `erd_change_memo_value` | `memoId`, `value` | Sostituisce il testo di un memo. |
| `erd_change_memo_color` | `memoId`, `color` | Imposta il colore di un memo. |
| `erd_move_memo` | `memoId`, `x`, `y` | Sposta un memo in una posizione nell’area di disegno. |
| `erd_resize_memo` | `memoId`, `width`, `height` | Ridimensiona un memo. La larghezza deve essere di almeno circa `116` pixel e l’altezza di almeno `100`. Non crea alcun passo di annullamento, poiché l’editor registra il ridimensionamento di un memo solo da un trascinamento. |

Mentre i memo sono nascosti con [View Option](../guide/guides/table-related-functions.md#table-view-options) → `Memos`, `erd_add_memo` ne aggiunge comunque uno, che resta nascosto finché i memo non vengono mostrati di nuovo.
Anche `erd_list` e `erd_get` elencano i memo nascosti.

### Gruppi di tabelle {#table-groups}

Un gruppo di tabelle è un riquadro con nome disegnato dietro le sue tabelle, e il suo colore appare sul riquadro e sulle intestazioni delle sue tabelle — vedere [Gruppi di tabelle](../guide/guides/table-groups.md).
Una tabella fa parte al massimo di un gruppo. `erd_move_table`, `erd_move_tables` e `erd_move_table_group` non cambiano mai quali tabelle contiene un gruppo, ovunque posizionino una tabella, mentre nell’editor una tabella entra in un gruppo o ne esce nel punto in cui viene rilasciata — vedere [Aggiungere e rimuovere tabelle](../guide/guides/table-groups.md#adding-and-removing-tables). `erd_add_table_group` e `erd_set_table_group` inseriscono tabelle in un gruppo, e `erd_remove_table_group` lascia le sue tabelle fuori da qualsiasi gruppo.
Un gruppo memorizza un rettangolo, largo almeno `160` pixel e alto almeno `100`, barra del titolo inclusa, e l’editor disegna il riquadro ingrandito in modo da contenere ciascuna delle sue tabelle.

| Strumento | Argomenti | Cosa fa |
| --- | --- | --- |
| `erd_add_table_group` | `name`, `color?`, `x?`, `y?`, `width?`, `height?`, `tableIds?` | Aggiunge un gruppo e ne restituisce l’id in `createdIds`. Passare `tableIds` oppure un rettangolo, `x`, `y`, `width` e `height` insieme. Con `tableIds`, ogni tabella lascia il gruppo in cui si trovava, e il rettangolo viene adattato attorno alle tabelle come quando si [raggruppano le tabelle selezionate](../guide/guides/table-groups.md#grouping-selected-tables). Un rettangolo accoglie ogni tabella senza gruppo il cui centro cade al suo interno, come quando si [disegna un gruppo](../guide/guides/table-groups.md#drawing-a-group). Un `name` vuoto lascia il gruppo senza nome. Un solo `erd_undo` rimuove il gruppo e riporta ogni tabella nel gruppo in cui si trovava. |
| `erd_remove_table_group` | `groupId` | Rimuove un gruppo. Le sue tabelle restano dove sono, senza gruppo. |
| `erd_change_table_group_name` | `groupId`, `value` | Rinomina un gruppo. Una stringa vuota lo lascia senza nome. |
| `erd_change_table_group_color` | `groupId`, `color` | Imposta il colore di un gruppo. |
| `erd_move_table_group` | `groupId`, `x`, `y` | Sposta un gruppo in modo che il suo rettangolo inizi in quel punto, con le sue tabelle spostate della stessa distanza, come fa il trascinamento della sua barra del titolo. Uno spostamento inferiore a 20 pixel, sommando la distanza orizzontale e quella verticale, non crea alcun passo di annullamento. |
| `erd_resize_table_group` | `groupId`, `x?`, `y?`, `width`, `height` | Imposta il rettangolo di un gruppo, lasciando le sue tabelle dove sono. Se `x` e `y` vengono omessi, il suo angolo resta invariato. Un rettangolo che non conterrebbe le tabelle del gruppo con il loro margine interno viene rifiutato, con un messaggio che indica il riquadro che deve contenere. |
| `erd_set_table_group` | `tableIds`, `groupId` | Inserisce tabelle in un gruppo, e ciascuna lascia il gruppo in cui si trovava. Un `groupId` pari a `null` o a una stringa vuota le toglie da qualsiasi gruppo. |

Mentre i gruppi sono nascosti con `View Option` → `Table Groups`, questi strumenti aggiungono e modificano comunque i gruppi, che restano nascosti finché i gruppi non vengono mostrati — vedere [Nascondere i gruppi](../guide/guides/table-groups.md#hiding-groups).
`erd_sort_tables` mantiene insieme le tabelle di ciascun gruppo, `erd_import_dbml` e `erd_import_json` importano i gruppi — vedere [Importazione](#import) — e `erd_read` scrive il DDL dei gruppi scelti con `groupNames`.
Una versione di ERD Editor precedente ai gruppi di tabelle scarta i gruppi di un file quando salva il file, come fanno l’estensione per VS Code prima della versione `4.0.0` e i plugin per Obsidian e JetBrains prima della versione `1.0.0` — vedere [Aggiornamento](./installation.md#updating).

### Impostazioni {#settings}

Un agente definisce le impostazioni dello schema stesso: il database, il suo nome e gli script di [Schema SQL](../guide/guides/schema-sql.md).
Ogni altra impostazione memorizzata nel documento spetta all’utente, che la imposta nell’editor: gli interruttori delle [Opzioni di visualizzazione](../guide/guides/table-related-functions.md#table-view-options), le opzioni della scheda [Impostazioni](../guide/guides/settings.md), il linguaggio e gli stili dei nomi del Generatore di codice, il tipo di delimitatore e i [blocchi](../guide/guides/settings.md#lock).
Nessuno strumento le modifica, tranne le importazioni in modalità `replace`: `erd_import_json` porta le impostazioni e i blocchi del documento che carica, e gli altri quattro riportano la vista all’inizio dell’area di disegno — vedere [Importazione](#import).
La versione `1.0.0` del server ha rimosso gli strumenti che le impostavano: `erd_set_language`, `erd_set_table_name_case`, `erd_set_column_name_case`, `erd_set_bracket_type`, `erd_set_relationship_data_type_sync`, `erd_set_relationship_optimization`, `erd_set_column_order`, `erd_set_max_width_comment`, `erd_set_ignore_save_settings` e `erd_set_show`.

`erd_list` e il formato `snapshot` di `erd_read` riportano le impostazioni come le salva il file, con `lockSettings` che contiene un flag per ogni blocco: `viewport`, `canvasType`, `language`, `tableNameCase`, `columnNameCase` e `bracketType`.
Un linguaggio, uno stile dei nomi o un tipo di delimitatore bloccato viene riportato con il suo valore bloccato, quello che il file conserva e con cui si apre ogni editor, qualunque cosa mostri lo schermo di un editor. La vista e la scheda non vengono riportate.

`erd_set_ddl_script` crea un passo di annullamento. `erd_set_database` e `erd_set_database_name` non ne creano, quindi `erd_undo` non può annullarli.

| Strumento | Argomenti | Cosa fa |
| --- | --- | --- |
| `erd_set_database` | `value` | Imposta il database: `MariaDB`, `MSSQL`, `MySQL`, `Oracle`, `PostgreSQL`, `SQLite`, `Databricks` o `Snowflake`. Determina i tipi di dati del database e il DDL che `erd_read` scrive quando non viene indicato alcun `vendor`. |
| `erd_set_database_name` | `value` | Imposta il nome del database, che le intestazioni `use` e `createAndUse` di `erd_read` riportano. |
| `erd_set_ddl_script` | `position`, `sql` | Imposta uno dei due script scritti attorno alle tabelle — vedere [Script prima e dopo le tabelle](../guide/guides/schema-sql.md#before-and-after-scripts). `position` è `before`, scritto prima delle tabelle, come `CREATE EXTENSION` o `CREATE SCHEMA`, oppure `after`, scritto dopo di esse, come `GRANT` o `CREATE VIEW`. `sql` sostituisce l’intero script, al massimo 10.000 caratteri, e una stringa vuota lo rimuove. Leggere prima quello attuale con il formato `scripts` di `erd_read`. |

Uno script entra così com’è nel DDL di ogni database, quindi scriverlo per il database del documento. Su MSSQL, viene aggiunta una riga `GO` dopo uno script la cui ultima riga non è `GO`.
Una versione di ERD Editor precedente a questi script scarta gli script di un file quando salva il file, come fanno l’estensione per VS Code prima della versione `4.0.0` e i plugin per Obsidian e JetBrains prima della versione `1.0.0` — vedere [Aggiornamento](./installation.md#updating).

### Importazione {#import}

Questi strumenti leggono uno schema come fa il menu Importa dell’editor — vedere [Importare o esportare file](../guide/guides/file-import-export.md).
Ognuno accetta il testo come `value`, e `mode`: `replace`, il valore predefinito, oppure `append`.

| Strumento | Argomenti | Cosa fa |
| --- | --- | --- |
| `erd_import_sql` | `value`, `mode?` | Carica DDL SQL, istruzioni `CREATE TABLE` e simili. |
| `erd_import_graphql` | `value`, `mode?` | Carica un SDL GraphQL. |
| `erd_import_dbml` | `value`, `mode?` | Carica DBML. Ogni `TableGroup` diventa un gruppo di tabelle con le tabelle che indica — vedere [DBML](../guide/guides/file-import-export.md#dbml). |
| `erd_import_aml` | `value`, `mode?` | Carica AML. |
| `erd_import_json` | `value`, `mode?` | Carica un documento JSON di erd-editor, come un altro file `.erd.json`. |

`replace` prende il posto del documento, e `erd_undo` ripristina quello precedente:

- `erd_import_sql`, `erd_import_graphql`, `erd_import_dbml` e `erd_import_aml` sostituiscono ogni tabella, relazione, indice, memo e gruppo di tabelle. Mantengono le impostazioni del documento, blocchi inclusi, tranne la vista, che torna all’inizio dell’area di disegno al 100%.
- `erd_import_json` sostituisce l’intero documento, impostazioni incluse: le impostazioni e i blocchi del JSON prendono il posto di quelli di questo documento, e un JSON che non registra alcun blocco attiva tutti i blocchi e porta la vista all’inizio dell’area di disegno. Per mantenere le impostazioni di questo documento, partire dal testo restituito dal formato `json` di `erd_read`. Un testo vuoto dà un nuovo documento, come quello che `erd_open_document` crea con `create`.

`append` aggiunge l’importazione al documento, come fa [Importa e aggiungi](../guide/guides/file-import-export.md#import-and-add) nell’editor, e un solo `erd_undo` annulla l’intera aggiunta:

- Il contenuto del testo arriva come nuove entità con nuovi id, in un blocco sotto tutto ciò che il documento contiene, memo nascosti e gruppi di tabelle inclusi, allineato al suo bordo sinistro. Ogni tabella e impostazione già presente resta, inclusa una tabella con lo stesso nome: nulla viene unito per nome.
- Le relazioni e gli indici arrivano solo tra le tabelle portate dall’importazione, quindi una chiave esterna verso una tabella che il testo non dichiara viene scartata.
- `erd_import_sql`, `erd_import_graphql` e `erd_import_aml` aggiungono tabelle con le loro relazioni e i loro indici, e `erd_import_dbml` anche i suoi gruppi di tabelle. `erd_import_json` aggiunge tabelle, relazioni, indici, memo e gruppi di tabelle, mai le sue impostazioni, e rifiuta un testo vuoto.

Un documento JSON mantiene la propria disposizione, inclusi i suoi gruppi di tabelle: nelle posizioni in cui colloca le sue tabelle con `replace`, e all’interno del blocco aggiunto con `append`.
Le tabelle di SQL, GraphQL, DBML e AML vengono disposte in righe, prima quelle con meno colonne e con le tabelle di ciascun gruppo insieme, come le dispone `erd_sort_tables`, mai con `Flow`, come le dispone invece l’importazione dell’editor stesso quando può. Questi quattro strumenti rifiutano un testo vuoto in entrambe le modalità.

## erd_batch {#erd_batch}

`erd_batch` esegue più strumenti di modifica in ordine come un’unica modifica, tutti o nessuno.

- `operations` contiene fino a 100 voci, ciascuna `{ tool, as?, args? }`, dove `args` sono gli argomenti dello strumento senza `path`.
- Le operazioni vengono prima provate su una copia del documento. Un’operazione rifiutata viene indicata, come `operations[1] erd_remove_table: …`, e non viene applicato nulla.
- Un solo `erd_undo` annulla l’intero batch, tranne le operazioni che non può annullare, indicate da `undoNote` nel risultato: quelle di uno strumento che non crea alcun passo di annullamento, come `erd_set_database`, e quelle che hanno modificato il documento senza crearne uno, come un breve `erd_move_table_group`. Un batch che non ha creato nessun passo di annullamento viene saltato da `erd_undo`. `historyEntries` nel risultato conta le voci della cronologia dell’editor al suo interno, non le chiamate a `erd_undo`.
- In una sessione live l’editor accetta l’intero batch o nessuna parte di esso.

Un agente non può conoscere gli id che un batch crea prima di chiamarlo, quindi un’operazione a cui viene dato un nome con `as` permette a un’operazione successiva di farvi riferimento: `$name` o `$name.0` per il suo primo id creato, `$name.1` per il secondo e `$name.last` per l’ultimo.
Un nome contiene lettere ASCII, cifre e trattini bassi, non inizia con una cifra e indica una sola operazione.
Un riferimento viene risolto solo dove un argomento accetta l’id di un’entità, quindi un nome o un commento che riporta `$x` resta testo.

Una tabella con le sue colonne e una relazione, in una sola chiamata:

```json
{
  "path": "shop.erd.json",
  "operations": [
    { "tool": "erd_add_table", "as": "users" },
    { "tool": "erd_change_table_name", "args": { "tableId": "$users", "value": "users" } },
    { "tool": "erd_add_column", "as": "uid", "args": { "tableId": "$users" } },
    { "tool": "erd_change_column_name", "args": { "tableId": "$users", "columnId": "$uid", "value": "id" } },
    { "tool": "erd_change_column_data_type", "args": { "tableId": "$users", "columnId": "$uid", "value": "BIGINT" } },
    { "tool": "erd_set_column_primary_key", "args": { "tableId": "$users", "columnId": "$uid", "value": true } },
    { "tool": "erd_add_table", "as": "orders" },
    { "tool": "erd_change_table_name", "args": { "tableId": "$orders", "value": "orders" } },
    { "tool": "erd_add_relationship", "args": { "startTableId": "$users", "endTableId": "$orders", "relationshipType": "ZeroN", "onDelete": "cascade" } }
  ]
}
```

`users` e la sua chiave `id` ricevono il nome prima della relazione, quindi la colonna chiave esterna che la relazione aggiunge a `orders` è `users_id`.

## Risultati {#results}

Una modifica restituisce una riga di JSON:

```json
{"tool":"erd_add_table","mode":"live","createdIds":["03h17be2plxpj5n59tqag7ogj"],"batches":1,"historyEntries":1}
```

| Campo | Significato |
| --- | --- |
| `mode` | `live` o `headless` — vedere [Live e headless](./live-and-headless.md). |
| `createdIds` | Gli id di ciò che la chiamata ha creato, in ordine. |
| `batches`, `historyEntries` | Quanti batch di modifiche ha inviato la chiamata e quante voci della cronologia dell’editor ha creato. |
| `undoable`, `undoNote` | `undoable` è `false` quando `erd_undo` salterà la chiamata, e `undoNote` spiega perché: lo strumento non crea alcun passo di annullamento, la chiamata ha modificato il documento senza crearne uno, come fa un `erd_move_table_group` di meno di 20 pixel, oppure il documento conteneva già il valore. Il risultato di un `erd_batch` riporta sempre un `undoNote`. Quando il batch ha creato un passo di annullamento, la nota dice che un solo `erd_undo` annulla il batch e indica ogni operazione che lascia invariata; quando non ne ha creato nessuno, il risultato riporta `undoable: false` e la nota dice che `erd_undo` lo salta. |
| `mismatch` | Presente quando la chiamata ha creato un numero di batch o di voci della cronologia diverso da quello dichiarato dallo strumento. |
| `notes` | Presente quando è cambiato qualcosa nella sessione, come un editor che è stato chiuso o ha smesso di gestire il documento, oppure un file modificato su disco. |

Un rifiuto è un risultato di errore che riporta un codice e un messaggio che indica cosa fare:

```json
{"error":{"code":"notFound","message":"tableId nope names no live table; read the document for current ids"}}
```

| `code` | Motivo |
| --- | --- |
| `notFound` | Un id non indica nulla di esistente, oppure il file non esiste. |
| `invalidArgs` | Un argomento manca o ha un valore errato. |
| `invalidPath` | Il percorso non è un documento ERD. Su Windows, anche un percorso con un nome che Windows non memorizza come è scritto, o uno che raggiunge un documento che un editor detiene con un altro percorso, indicato dal messaggio. |
| `invalidDocument` | Il file non è un documento che l’editor può leggere. |
| `tooLarge` | Una lettura non entra in una sola risposta. |
| `blocked` | Un editor con l’hub disattivato detiene il documento. Il messaggio indica come attivarlo: in VS Code, considerare attendibile l’area di lavoro e attivare `dineug.erd-editor.agentHub.enabled`, oppure ricaricare la finestra; in Obsidian, attivare l’impostazione Coding agents, oppure ricaricare Obsidian; in un IDE JetBrains, attivare l’impostazione Coding agents, oppure riavviare l’IDE se è attiva. |
| `hubDisabled` | Un IDE JetBrains detiene il documento solo in un progetto che non considera attendibile. Le letture funzionano comunque; considerare attendibile il progetto per consentire all’agente di apportare modifiche. |
| `conflict` | Il file è cambiato su disco durante la chiamata. Non è stato scritto nulla. |
| `hubAppeared`, `hubGone` | Un editor ha iniziato a gestire un documento che l’agente stava modificando su disco, oppure l’editor che lo gestiva è ancora in esecuzione ma il suo file di lock e la sua connessione non ci sono più. Non è stato scritto nulla. |
| `notSaved` | `erd_save` non è riuscito a salvare il documento dell’editor. |
| `readonly` | L’editor detiene il documento in sola lettura, come un file che non può scrivere o che non può leggere come diagramma. Senza editor, è il file stesso a essere di sola lettura, come un file Perforce o TFVC di cui non è stato eseguito il checkout. Non è stato scritto nulla. |
| `protocolMismatch` | L’estensione o il plugin ERD Editor dell’editor e il server usano versioni del protocollo diverse, come il server `1.0.0` con un’estensione per VS Code `3.x`. Vengono rifiutate anche le letture, e il messaggio indica la parte da aggiornare — vedere [Aggiornamento](./installation.md#updating). |
| `hubUnreachable`, `timeout`, `disconnected` | L’hub di un editor non ha accettato la connessione, non ha risposto entro 30 secondi o ha chiuso la connessione durante la chiamata. Su Windows, `hubUnreachable` significa anche che Windows ha impedito all’agente di accedere all’hub: l’editor viene eseguito con più diritti dell’agente, come quando è stato avviato come amministratore e l’agente no, oppure l’agente viene eseguito in una sandbox. |

Altri codici sono più rari, e ogni rifiuto riporta un messaggio che spiega cosa è successo.

Gli strumenti di modifica, `erd_batch` e i tre strumenti di lettura rifiutano un argomento che non dichiarano, o uno di tipo errato, con un errore JSON-RPC di parametri non validi (`-32602`) prima di toccare il documento, quindi un argomento scritto in modo errato non viene mai scartato silenziosamente.
I cinque strumenti di sessione ignorano gli argomenti che non conoscono.
