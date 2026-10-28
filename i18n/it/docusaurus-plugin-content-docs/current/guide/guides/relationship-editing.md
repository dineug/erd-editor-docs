---
sidebar_position: 7
description: Eliminare una relazione, cambiarne il tipo, impostarne le azioni ON DELETE e ON UPDATE, associarla a colonne esistenti con Associa colonne, leggere la notazione dei connettori e il modo in cui vengono instradati attorno alle tabelle, lavorare con le relazioni N:M e identificanti e vedere cosa copiano le nuove colonne chiave esterna dalla loro chiave e come vengono denominate.
---

# Modifica delle relazioni

Le relazioni si disegnano dal menu contestuale dell’area di disegno, dalla barra degli strumenti dell’area di disegno, dalla [Ricerca rapida](./quick-search.md#what-the-palette-lists) o con un tasto di scelta rapida — vedere [Iniziare a modificare](./editing-start.md).  
Questa pagina descrive cosa si può fare con una relazione una volta creata, come [Associa colonne](#map-columns) la fa terminare su colonne già presenti nella tabella figlia e come vengono denominate le colonne chiave esterna che una relazione aggiunge.

## Eliminazione {#deletion}

È possibile eliminare una relazione dal suo menu contestuale.

![Eliminazione della relazione tra products e reviews dal suo menu contestuale](/img/demo-relationship-remove.webp)

Non esiste un tasto di scelta rapida per farlo, perché una relazione non si seleziona come una tabella o un memo: `Delete` e `Backspace`, che rimuovono ciò che è selezionato, non rimuovono mai una relazione da sola — vedere [Eliminazione di tabelle e memo](./table-related-functions.md#table-and-memo-deletion).  
Le relazioni vengono rimosse anche insieme a ciò che collegano: eliminando una tabella si rimuovono tutte le relazioni che la toccano, ed eliminando una colonna si rimuovono tutte le relazioni che la usano.

## Cambio di tipo {#type-change}

Il tipo si cambia con la voce `Relationship Type` del menu contestuale della relazione.  
Sono disponibili quattro tipi e quello attuale è contrassegnato da un segno di spunta:

- Zero One
- Zero N
- One Only
- One N

![Cambio di una relazione da Zero N a One Only e poi a One N nel suo menu contestuale](/img/demo-relationship-type.webp)

Sono gli stessi quattro tipi con cui si inizia una relazione, ciascuno con il proprio tasto di scelta rapida — vedere [Iniziare a modificare](./editing-start.md).

## ON DELETE e ON UPDATE {#on-delete-and-on-update}

Si impostano con le voci `On Delete` e `On Update` del menu contestuale della relazione, tra `Relationship Type` e `Map Columns`.  
Ciascuna offre le stesse sei voci e quella attuale è contrassegnata da un segno di spunta:

- Not set
- NO ACTION
- CASCADE
- SET NULL
- SET DEFAULT
- RESTRICT

`Not set` non scrive alcuna clausola, quindi si applica l’azione predefinita del database stesso. Una nuova relazione, disegnata o creata in [Associa colonne](#map-columns), parte con entrambe su `Not set`, e scegliendo in seguito `Not set` si rimuove un’azione.  
Le due impostazioni sono indipendenti: cambiare l’una lascia l’altra invariata.  
Il connettore mostra ciò che è impostato — vedere [Leggere un connettore](#reading-a-connector).  
Una relazione copiata e incollata, o duplicata, insieme alle sue tabelle mantiene entrambe le azioni, e importando Schema SQL, DBML o AML si ottengono le azioni dichiarate nel file — vedere [Importare o esportare file](./file-import-export.md).

![Impostazione di ON DELETE CASCADE e ON UPDATE RESTRICT sulla relazione tra orders e order_items dal suo menu contestuale, con l’etichetta che mostra D:C U:R, poi passaggio del puntatore per rileggerle entrambe](/img/demo-referential-actions.webp)

Ogni azione può essere scelta qualunque sia il database.  
Un’azione che il [database](./table-related-functions.md#databases) selezionato omette dal proprio Schema SQL riporta accanto una nota attenuata, come `not in MySQL`. `Not set` non ne riporta mai una, e cambiando database le note si aggiornano.  
Un’azione con la nota resta comunque memorizzata nella relazione: il connettore la mostra e JSON, DBML e AML la conservano, ma lo Schema SQL di quel database omette la clausola, quindi si applica l’azione predefinita del database.

Lo [Schema SQL](./schema-sql.md) scrive queste azioni e omette le altre:

| Database | ON DELETE | ON UPDATE |
| --- | --- | --- |
| Databricks | `NO ACTION` | `NO ACTION` |
| MSSQL | `NO ACTION`, `CASCADE`, `SET NULL`, `SET DEFAULT` | `NO ACTION`, `CASCADE`, `SET NULL`, `SET DEFAULT` |
| MariaDB | `NO ACTION`, `CASCADE`, `SET NULL`, `RESTRICT` | `NO ACTION`, `CASCADE`, `SET NULL`, `RESTRICT` |
| MySQL | `NO ACTION`, `CASCADE`, `SET NULL`, `RESTRICT` | `NO ACTION`, `CASCADE`, `SET NULL`, `RESTRICT` |
| Oracle | `CASCADE`, `SET NULL` | nessuna |
| PostgreSQL | tutte e cinque | tutte e cinque |
| Snowflake | `NO ACTION` | `NO ACTION` |
| SQLite | tutte e cinque | tutte e cinque |

Lo Schema SQL di Snowflake scrive anche un commento che indica ogni azione omessa — vedere [Azioni referenziali](./schema-sql.md#referential-actions).

Quali azioni scrivano le destinazioni ORM del Generatore di codice dipende dalla destinazione oltre che dal database selezionato — vedere [Generatore di codice](./code-generator.md#on-delete-and-on-update).

## Associa colonne {#map-columns}

Associa colonne abbina la chiave della tabella padre a colonne della tabella figlia, una riga per ogni colonna della chiave.  
Ogni riga usa una colonna già presente nella tabella figlia oppure aggiunge una nuova colonna chiave esterna, così una relazione può terminare su colonne già esistenti.

![Disegno di una relazione Zero N da members a orders, scelta di Map to existing columns e associazione di id alla colonna esistente member_id](/img/demo-map-columns.webp)

Si apre in due modi:

- Durante il disegno di una relazione, da `Map to existing columns` accanto alla tabella figlia — vedere [Creazione di relazioni](./editing-start.md#relationship-creation). `Map` aggiunge quindi una relazione del tipo che si sta disegnando.
- Dalla voce `Map Columns` del menu contestuale della relazione, per cambiare le colonne di una relazione esistente. `Save` scrive quindi la modifica. Un editor di sola lettura non apre alcun menu contestuale della relazione, quindi lì Associa colonne non può essere aperto.

Il sottotitolo della finestra di dialogo indica le due tabelle e il tipo di relazione, come `users → posts · One N`. Il tipo qui viene mostrato ma non modificato — usare [Cambio di tipo](#type-change).

In tutta la finestra di dialogo, comprese le note e i messaggi sotto le righe e la notifica con cui si chiude, le tabelle e le colonne vengono indicate con il nome mostrato dalla [Visualizzazione nomi](./logical-names.md#beyond-the-canvas).  
Tre elementi restano fisici: ogni tipo di dati, che è quello della colonna stessa e mai il nome del suo dominio; `New column: <name>`, che mostra il nome che riceverà la nuova colonna; e le righe che con `Map` partono già compilate, abbinate per nome, mai per nome logico.

Con il selettore `References` si sceglie la chiave a cui punta la relazione: `Primary Key`, con le sue colonne nell’ordine della tabella, poi `Unique: <column>` per ogni colonna contrassegnata come `Unique`. Compare solo quando c’è più di una scelta.  
Qui un indice univoco non conta come chiave, e una colonna `Unique` che costituisce l’intera chiave primaria non viene elencata due volte.  
Scegliendo un’altra chiave le righe vengono ricostruite. Una riga mantiene la propria scelta finché quella colonna è ancora nella tabella figlia.

Sotto le intestazioni `Referenced column` e `Foreign key column`, ogni riga mostra una colonna della chiave con il suo tipo di dati e un elenco delle colonne della tabella figlia con cui abbinarla:

- `Pick a column` lascia vuota la riga.
- `New column: <name>` aggiunge una nuova colonna chiave esterna. Il nome mostrato è quello che riceverà, come descritto in [Nomi delle colonne chiave esterna](#foreign-key-column-names), numerato rispetto alle colonne della tabella figlia e alle altre righe che aggiungono una nuova colonna. La voce non viene proposta quando il nome sarebbe vuoto, come per una chiave senza nome.
- Ogni colonna della tabella figlia, come `<name> (<data type>)`. Una colonna già scelta da un’altra riga appare come `<name> (<data type>) · in use` e non può essere scelta, così due righe non ne condividono mai una. Una colonna già usata da un’altra relazione può comunque essere scelta, così una colonna come un `tenant_id` condiviso può servire più relazioni.

Con `Map`, una riga parte già compilata solo quando esattamente una colonna della tabella figlia, senza distinguere maiuscole e minuscole, ha il nome che riceverebbe una nuova colonna chiave esterna per quella riga prima di qualsiasi numerazione `_2`, come `users_id` per `id` su `users` e `member_id` per `member_id`. Finché [`Bracket`](./schema-sql.md#database-and-bracket) è `None`, il valore predefinito, conta anche il nome costruito dalla parte di tabella di un nome di tabella qualificato con lo schema, così `id` su `public.users` viene abbinato a `public.users_id` o `users_id`. Per una chiave `Unique` conta anche il nome stesso della colonna della chiave, così `vin` viene abbinato a `vin`. Ogni altra riga parte da `Pick a column`.  
Con `Save`, ogni riga parte dalla colonna che la relazione usa attualmente. In entrambi i casi, scegliendo un’altra chiave in `References` si compilano le righe vuote di quella chiave in base agli stessi nomi.

Quando il tipo di dati di una colonna scelta differisce da quello che la colonna padre assegna a una chiave esterna, lo segnala una nota sotto la riga.  
Con [Sincronizzazione tipo di dati nelle relazioni](./settings.md#relationship-datatype-sync) attiva e un tipo di dati sulla colonna padre, la nota riporta `<column> becomes <type>`, il tipo che l’associazione scriverà. Altrimenti riporta `Types differ: <parent type> and <child type>` e la colonna mantiene il suo tipo.

`Map` o `Save` resta disabilitato finché qualcosa lo impedisce, e un messaggio sotto le righe indica cosa:

- `Pick a foreign key column for every referenced column`: una riga è ancora vuota.
- `At least one column must reference a different column`: una relazione autoreferenziale in cui ogni riga sceglie la propria colonna padre.
- `These columns are already linked by another relationship`: un’altra relazione tra le stesse due tabelle collega esattamente queste colonne.
- `<parent> has no key to reference`: con `Map`, la tabella padre non ha né una chiave primaria né una colonna `Unique`.

`Save` resta disabilitato anche finché l’associazione non differisce da quella attuale della relazione.  
Con `Save`, una riga riporta `(removed)` quando la sua colonna non è più nella sua tabella. Scegliere un’altra colonna della tabella figlia oppure, per una colonna padre scomparsa, scegliere una chiave in `References`. Con `Map`, una riga la cui colonna scelta viene rimossa torna a `Pick a column`.

Una relazione le cui colonne padre non corrispondono esattamente a una delle chiavi della tabella padre si apre su una scelta aggiuntiva in fondo a `References`, `Current columns (not a key)`, che mantiene quelle colonne così come sono. Quando la tabella padre non ha alcuna chiave, questa è l’unica scelta e il selettore `References` non viene mostrato.  
In questo caso il messaggio `The referenced columns are not a key of <parent>`, o `<parent> has no key to reference` quando la tabella padre non ha alcuna chiave, è un avviso, non un errore: `Save` funziona comunque, quindi è possibile cambiare le colonne della tabella figlia e mantenere il riferimento.  
Una relazione i cui due elenchi di colonne non si possono abbinare, ad esempio perché hanno lunghezze diverse, mostra righe `(invalid)` e mantiene disabilitato `Save` finché non si sceglie una chiave in `References` o non si aggiunge una chiave primaria o una colonna `Unique` alla tabella padre, se non ne ha.

Mentre è aperta, la finestra di dialogo segue il diagramma, comprese le modifiche di un collaboratore o di un agente di programmazione, e mantiene le scelte fatte.  
Se nel frattempo cambiano le colonne della relazione o la chiave su cui si è aperta, la finestra aggiunge il messaggio `This relationship changed while the dialog was open`.

Cosa scrivono `Map` e `Save`:

- `Map` aggiunge la relazione con `On Delete` e `On Update` su `Not set`. `Save` cambia solo le colonne della relazione, facendo puntare il lato padre alla chiave scelta in `References`, e ne mantiene il tipo, ON DELETE e ON UPDATE.
- Una riga `New column` aggiunge una colonna in fondo alla tabella figlia, come avviene quando si disegna: `NOT NULL`, con un nome derivato dalla sua chiave, con il tipo di dati, il valore predefinito, il commento, il nome logico e il dominio della chiave — vedere [Relazioni identificanti](#identifying-relationships).
- Una colonna scelta non viene mai rinominata né collegata al dominio della chiave, e i suoi `Not Null`, chiave primaria, `Unique`, valore predefinito, commento e nome logico restano invariati. Il suo tipo di dati cambia solo mentre `Relationship DataType Sync` è attivo e la colonna padre ha un tipo di dati: assume il tipo che la colonna padre assegna a una chiave esterna, il tipo intero per una chiave serial come per una nuova colonna, e la modifica si propaga lungo le relazioni come fa la sincronizzazione. Ogni colonna a cui la modifica cambia il tipo, scelta o raggiunta lungo le relazioni, viene scollegata dal suo [dominio](./dictionary.md#domains-and-data-types) quando il nuovo tipo differisce da quello del dominio.
- Una colonna che l’associazione smette di usare resta nella tabella figlia e non è più contrassegnata come chiave esterna, a meno che un’altra relazione non termini ancora su di essa.
- Tutto ciò che scrive un singolo `Map` o `Save` — comprese nuove colonne, modifiche di tipo e scollegamenti dai domini — costituisce un solo passo di annullamento.

Se la relazione è identificante e come viene disegnata la sua estremità padre si ricavano dalle colonne associate della tabella figlia, come per qualsiasi relazione. L’associazione alle colonne di chiave primaria della tabella figlia la rende subito identificante, e l’associazione a una colonna che ammette `NULL` mette un cerchio all’estremità padre — vedere [Leggere un connettore](#reading-a-connector).  
La chiave esterna dello Schema SQL fa riferimento alla chiave scelta, come `REFERENCES vehicle (vin)` per una chiave `Unique`.

Se il diagramma contiene già l’associazione quando si preme `Map` o `Save`, perché un collaboratore o un agente di programmazione è arrivato prima, non viene scritto nulla.  
Se è cambiato in modo che l’associazione non sia più applicabile, non viene scritto nulla e compare la notifica `Couldn't map columns: the diagram changed`.

`Cancel`, il pulsante `x`, `Escape` o un clic sull’area oscurata fuori dalla finestra di dialogo la chiudono senza scrivere nulla.  
L’area oscurata copre l’intero editor, barra degli strumenti compresa, e un pannello [Esplora](./explorer.md#dialogs-beside-it) aperto resta aperto al di sotto.  
Anche aprire la Ricerca rapida chiude la finestra di dialogo, e lo stesso vale per l’uscita dalla scheda ERD o per il passaggio dell’editor alla sola lettura.  
Anche `Ctrl + F` (Windows/Linux) o `⌘ + F` (Mac) la chiude e mette il punto di inserimento nel campo Trova della [ricerca](./find-and-replace.md#opening-and-closing) del pannello Esplora, aprendo il pannello Esplora se è chiuso. In un editor troppo stretto per mostrare il pannello Esplora, chiude comunque la finestra di dialogo ma mostra una notifica invece di spostare il punto di inserimento — vedere [Apertura e chiusura](./explorer.md#opening-and-closing).  
Se una delle sue tabelle o la relazione viene rimossa mentre è aperta, si chiude con una notifica come `Map Columns closed: the relationship was removed`.  
Mentre è aperta, i tasti di scelta rapida dell’area di disegno, Annulla e Ripeti e le operazioni di copia e incolla non hanno effetto.

Un agente di programmazione non dispone di uno strumento Associa colonne. Riassocia una relazione rimuovendola con `erd_remove_relationship`, che ne mantiene le colonne chiave esterna, e disegnandola di nuovo su colonne esistenti con `erd_link_columns`, entrambe le operazioni in un unico `erd_batch` — vedere [Strumenti](../../mcp/tools.md#relationships).

## Relazioni N:M {#nm-relationships}

Poiché l’editor si basa sul modello fisico, una relazione N:M si esprime con una tabella di associazione, come mostrato di seguito.

![Disegno di relazioni da products e poi da tags verso la tabella vuota product_tags con ⌘ + ⌥ + 2, con l’aggiunta di product_id e poi di tag_id](/img/demo-relationship-n-m.webp)

Quando la tabella di associazione ha già le sue colonne chiave, come `product_id` e `tag_id` su `product_tags`, disegnare ogni relazione con `Map to existing columns` e scegliere quelle colonne invece di aggiungerne di nuove — vedere [Associa colonne](#map-columns). Se costituiscono la chiave primaria della tabella di associazione, ogni relazione è subito identificante.

L’importazione di GraphQL, DBML o AML crea automaticamente la tabella di associazione.  
Una dichiarazione molti-a-molti arriva come una tabella denominata `<left>_<right>`, con il commento `Junction table inferred from <left> <-> <right>`, collegata a entrambi i lati da relazioni identificanti.  
Vedere [Importare o esportare file](./file-import-export.md).

## Relazioni identificanti {#identifying-relationships}

Disegnando una relazione con un clic sulla tabella figlia, o con `Create new columns`, ogni chiave primaria della tabella padre viene copiata nella tabella figlia come colonna chiave esterna `NOT NULL`, quindi una nuova relazione parte come non identificante.  
La copia riprende il tipo di dati, il valore predefinito, il commento e il nome logico della chiave, ma non `Unique` né `Auto Increment`, e riceve un nome come descritto in [Nomi delle colonne chiave esterna](#foreign-key-column-names).  
Una chiave serial è l’eccezione per il tipo di dati: la sua copia assume il tipo intero memorizzato dal serial. Con qualsiasi database, `smallserial` e `serial2` danno `smallint`, `serial4` dà `integer`, e `bigserial` e `serial8` danno `bigint`. Un `serial` semplice dà `integer` con PostgreSQL e `bigint unsigned` con MySQL e MariaDB, e resta `serial` con qualsiasi altro database.  
Conta solo il nome completo del tipo, senza distinguere maiuscole e minuscole, quindi `serial(4)` viene copiato così com’è scritto. Un tipo scritto in maiuscolo dà un risultato in maiuscolo: `SERIAL` dà `INTEGER` con PostgreSQL. Una colonna chiave esterna già di tipo `serial` in un diagramma salvato mantiene quel tipo.  
La copia viene anche collegata al [dominio](./dictionary.md#domains-and-data-types) della chiave, a condizione che il foglio `Domains` elenchi quel dominio al momento della copia e che la copia mantenga il tipo di dati della chiave. Così la copia di una chiave serial che assume un tipo intero non collega alcun dominio, mentre un `serial` semplice mantenuto come `serial` lo collega.  
Per rendere la relazione identificante, impostare come chiavi primarie quelle colonne chiave esterna della tabella figlia: selezionarle tutte e premere una volta `Alt + K` (Windows/Linux) o `⌥ + K` (Mac), oppure scegliere `Primary Key` nel menu contestuale della tabella, che appare come `Primary Key on selected columns` quando ne sono selezionate due o più — vedere [Chiave primaria di una colonna](./table-editing.md#column-primary-key).

![Attivazione e disattivazione di product_id come chiave primaria con Alt + K, con il connettore che diventa continuo e poi tratteggiato](/img/demo-identifying-relationship.webp)

L’editor lo mantiene allineato automaticamente.  
Una relazione è identificante finché ogni colonna sul suo lato figlio è una chiave primaria, e diventa non identificante non appena una di esse non lo è più.

## Nomi delle colonne chiave esterna {#foreign-key-column-names}

Quando si disegna una relazione, ogni colonna chiave esterna aggiunta prende il nome dalla chiave padre che copia:

- Un nome di chiave di una sola parola, come `id`, `ID` o `uuid`, riceve davanti il nome della tabella padre e un trattino basso: `id` su `products` diventa `products_id`.
- Un nome di chiave di più parole, come `member_id`, `userId` o `UserID`, viene mantenuto così com’è.
- Viene mantenuto anche un nome di chiave di una sola parola che coincide con il nome stesso della tabella, senza distinguere maiuscole e minuscole: `currency` su `currency` resta `currency`. Una chiave che contiene semplicemente il nome della tabella riceve comunque il prefisso: `username` su `user` diventa `user_username`.

Un nome è una sola parola quando contiene solo lettere e cifre, senza un cambio di maiuscole/minuscole.  
Qualsiasi altro carattere lo divide, quindi `_id`, `order no` e `order-no` sono più parole.  
Lo divide anche un cambio di maiuscole/minuscole, interpretato come nel camelCase: una lettera minuscola seguita da una maiuscola (`userId`), due maiuscole seguite da una minuscola (`IDCard`, `IDs`), oppure una lettera di una scrittura senza maiuscole e minuscole, come hangul, kana o han, accanto a una lettera che le distingue (`회원ID`).  
Le cifre non dividono una parola, quindi `id2` e `SHA256` sono una sola parola. Anche un composto scritto senza cambi di maiuscole/minuscole è una sola parola: `memberid` su `members` diventa `members_memberid`.

Il nome della tabella viene usato così com’è scritto, a parte gli spazi iniziali e finali: maiuscole e minuscole, spazi interni e punti vengono mantenuti, non viene reso singolare, e `Table Name Case` e `Column Name Case` del Generatore di codice non hanno alcun ruolo. `Users` con la chiave `ID` dà `Users_ID`.  
Ogni colonna di una chiave composta riceve il nome separatamente: `orders` con la chiave (`tenant_id`, `id`) aggiunge `tenant_id` e `orders_id`.

Un nome già presente nella tabella figlia, senza distinguere maiuscole e minuscole, viene numerato con `_2`, `_3` e così via, prendendo il primo numero libero.  
Una seconda relazione da `users`, con chiave `id`, verso la stessa tabella aggiunge `users_id_2`, e un autoriferimento su `members`, con chiave `member_id`, aggiunge `member_id_2`.  
Le colonne di una stessa chiave composta vengono numerate tra loro allo stesso modo, e un nome mantenuto così com’è occupa per primo il suo posto: `user` con la chiave (`id`, `user_id`) aggiunge `user_id` per `user_id` e `user_id_2` per `id`.

Una tabella padre senza nome lascia il nome della chiave così com’è, numerato come qualsiasi altro in caso di conflitto.  
Una chiave senza nome dà una colonna chiave esterna senza nome.  
Questo vale anche per la chiave primaria che l’editor aggiunge a una tabella padre che non ne ha, a meno che non le si assegni un nome prima di fare clic sulla tabella figlia.

I nomi vengono stabiliti quando si disegna la relazione. Rinominare in seguito la tabella padre o la sua chiave non li rinomina.  
Le righe `New column` di [Associa colonne](#map-columns) ricevono il nome secondo le stesse regole, e l’elenco mostra ogni nome prima che lo si scelga.  
Le relazioni che arrivano con le colonne già presenti — da un’importazione, da un’operazione di incolla, da una duplicazione o da Associa colonne quando abbina colonne esistenti — mantengono i nomi che quelle colonne hanno.  
Un agente di programmazione che aggiunge una relazione con `erd_add_relationship` ottiene gli stessi nomi, tipi di dati, nomi logici e domini — vedere [Strumenti](../../mcp/tools.md#relationships).

Una colonna chiave esterna prende il nome dalla sua chiave, mai dal nome logico che copia, e il suo nome conta come scritto dall’utente: un nome logico scritto in seguito sulla colonna lascia il nome com’è, a meno che il nome non sia vuoto — vedere [Nomi personalizzati](./dictionary.md#names-of-your-own).  
Finché il nome logico copiato corrisponde a un termine che assegna un altro nome, il foglio `Checks` elenca quindi la colonna sotto [`Physical name mismatch`](./dictionary.md#what-each-check-finds). Derivarne di nuovo il nome fisico la rinomina in base ai dizionari, a meno che un’altra colonna della tabella figlia non abbia già il nome che questi assegnano, senza distinguere maiuscole e minuscole — vedere [Deriva di nuovo i nomi fisici](./dictionary.md#derive-physical-names-again).

## Leggere un connettore {#reading-a-connector}

- Una relazione identificante viene disegnata con una linea continua, una non identificante con una linea tratteggiata.
- L’estremità figlia riporta il simbolo di cardinalità del tipo di relazione: un cerchio e un trattino per Zero One, un cerchio e una zampa di gallina per Zero N, due trattini per One Only e un trattino e una zampa di gallina per One N.
- L’estremità padre è un cerchio e un trattino, come Zero One, quando una qualsiasi delle colonne chiave esterna ammette `NULL`, e due trattini, come One Only, quando sono tutte `NOT NULL`.
- Il passaggio del puntatore su un connettore lo evidenzia insieme alle colonne che collega in entrambe le tabelle.

![Passaggio del puntatore su tre connettori uno dopo l’altro, ciascuno evidenziato insieme alle colonne che collega](/img/demo-relationship-hover.webp)

Una relazione che imposta [ON DELETE o ON UPDATE](#on-delete-and-on-update) riporta un’etichetta accanto alla sua estremità figlia, come `D:C U:R`: `D:` e l’azione ON DELETE, poi `U:` e l’azione ON UPDATE, ciascuna solo quando è impostata.  
Le azioni sono abbreviate secondo la notazione di erwin: `C` per CASCADE, `R` per RESTRICT, `SN` per SET NULL, `SD` per SET DEFAULT e `NA` per NO ACTION. Una relazione che non imposta nessuna delle due non ha etichetta.  
L’etichetta si trova dalla parte opposta alla tabella figlia, sopra la linea quando il connettore esce dal lato sinistro o destro di quella tabella e alla sua destra quando esce dal lato superiore o inferiore, senza sovrapporsi al simbolo di cardinalità.  
Viene disegnata nel colore del connettore su un piccolo riquadro con lo sfondo dell’area di disegno, e si evidenzia insieme al suo connettore. Le etichette vengono disegnate sopra tutti i connettori, quindi una linea che ne attraversa una passa al di sotto.  
Mostra l’azione memorizzata nella relazione indipendentemente da ciò che scrive il database selezionato, quindi ON DELETE SET DEFAULT appare comunque come `D:SD` su MySQL.

Il passaggio del puntatore su un connettore che imposta una delle due azioni mostra anche un tooltip che riporta le clausole per esteso, una per riga, come `ON DELETE CASCADE` e `ON UPDATE RESTRICT`.  
Il tooltip compare anche quando l’etichetta è nascosta.

Andare a una relazione la evidenzia: scegliendo una riga nella cartella `Foreign Keys` di una tabella nel pannello [Esplora](./explorer.md#going-to-a-row), o una riga di chiave esterna nel [Visualizzatore differenze](./table-related-functions.md#going-to-a-change), il suo connettore e la sua etichetta vengono disegnati nel colore del passaggio del puntatore. Nel Visualizzatore differenze viene evidenziato il connettore su ciascun lato che contiene la relazione, quindi una chiave esterna aggiunta evidenzia solo il lato attuale e una rimossa solo il lato salvato.  
Il salto seleziona soltanto la tabella figlia con le sue colonne chiave esterna, con il focus sulla cella della prima di esse; la relazione stessa non viene comunque mai selezionata. Per sapere dove si sposta la vista, vedere [Dove porta un salto](./table-related-functions.md#where-a-jump-lands).  
L’evidenziazione si spegne alla successiva pressione del pulsante sinistro o destro sull’area di disegno, che sia su un punto vuoto, una tabella, un memo, un gruppo di tabelle o un connettore, anche se la pressione lascia invariata la selezione. La spegne anche andare a un’altra riga o corrispondenza di ricerca nel pannello Esplora, e lo stesso vale per andare a un’altra riga nel Visualizzatore differenze, su ciascun lato a cui porta quella riga.  
Spostare la vista con il pulsante centrale o con lo strumento Mano la lascia accesa, così come comprimere o espandere una riga nel pannello Esplora o nel Visualizzatore differenze, annullare la selezione con `Escape` e un salto dalla [Ricerca rapida](./quick-search.md) o dal [pulsante della card](./visualization.md#card-buttons) per il collegamento esterno della modalità Flusso.  
L’evidenziazione non viene salvata né compare nella cronologia delle modifiche, e i collaboratori non la vedono.

In un editor [`readonly`](../../api/erd-editor-element.md#readonly) il puntatore evidenzia i connettori anche al posto dell’evidenziazione lasciata da un salto. Fermo su una tabella, evidenzia ogni connettore di quella tabella con il colore di evidenziazione al passaggio del puntatore finché non si sposta fuori dalla tabella.  
Un clic che non sposta lascia un’evidenziazione fino al successivo clic di questo tipo: su una tabella evidenzia i connettori di quella tabella, su un connettore quel connettore, e altrove nulla. Un trascinamento lì sposta la vista dell’area di disegno e lascia quell’evidenziazione com’era.

Per nascondere i connettori nell’area di disegno ERD usare l’opzione di visualizzazione `Relationship`, o per nasconderne solo le etichette l’opzione di visualizzazione `Referential Actions`, attiva per impostazione predefinita — vedere [Opzioni di visualizzazione delle tabelle](./table-related-functions.md#table-view-options).  
Le etichette non vengono disegnate al `70%` o meno, dove le tabelle si riducono al solo nome.  
Un’[esportazione come immagine](./file-import-export.md#image) viene sempre disegnata al 100%, quindi disegna le etichette qualunque sia lo zoom dell’area di disegno, a meno che un’opzione di visualizzazione non le nasconda. Con `Background` disattivato, anche il riquadro dietro ogni etichetta è trasparente.  
La [modalità Flusso](./visualization.md#flow-mode) nella scheda Visualizzazione disegna i connettori anche con `Relationship` disattivato, ognuno come un’unica curva morbida, continua e grigia con gli stessi segni alle estremità, quindi la linea tratteggiata, le etichette, il tooltip, l’evidenziazione dopo un salto e l’instradamento ortogonale descritti in questa pagina valgono solo per l’area di disegno ERD. Anche in modalità Flusso una relazione da una tabella a sé stessa si curva attorno all’angolo in alto a destra — vedere [Instradamento dei connettori](#connector-routing).

## Instradamento dei connettori {#connector-routing}

I connettori seguono un instradamento ortogonale e i loro angoli sono arrotondati.  
Un percorso aggira le tabelle che gli sbarrano la strada invece di attraversarle. Dove ogni percorso di poche svolte tra le sue due estremità attraverserebbe una tabella, come in un diagramma affollato, il connettore prende una via di aggiramento con tutte le svolte che servono. Solo dove non si trova alcuna via di aggiramento attraversa comunque una tabella.  
Un connettore esce dalle sue due tabelle da una coppia di lati che si fronteggiano, dove ce n’è una, e ogni estremità esce dalla sua tabella con un breve tratto rettilineo prima di svoltare, quindi due tabelle poco distanti le cui estremità del connettore sono allineate vengono unite da un’unica linea retta anziché da una deviazione.  
Due tabelle che si fronteggiano a una distanza inferiore, anche sotto i `40px`, mantengono i loro lati affacciati, e dove le loro estremità non sono allineate il connettore compie uno scarto attraverso lo spazio tra di esse anziché passare sotto una delle due.  
I percorsi che escono dallo stesso lato di una tabella vengono distribuiti su corridoi separati, così da non sovrapporsi l’uno all’altro.  
Vengono evitate solo le tabelle: un connettore può attraversare un memo o il riquadro di un gruppo di tabelle, e viene disegnato sopra i gruppi di tabelle e sotto le tabelle e i memo.

Una relazione da una tabella a sé stessa viene disegnata come un’unica curva attorno all’angolo in alto a destra della tabella, che esce dal lato superiore all’estremità padre ed entra nel lato destro all’estremità figlia.  
Ulteriori autoriferimenti sulla stessa tabella si annidano all’esterno del primo, così le loro curve non si incrociano tra loro né attraversano la tabella.

Non c’è nulla da configurare.  
I percorsi vengono ricalcolati automaticamente ogni volta che qualcosa nell’area di disegno si sposta o cambia dimensione, quindi non serve mai ritoccarli a mano.  
Mentre si trascina, i connettori delle tabelle spostate le seguono, e ogni altro connettore mantiene il percorso che aveva all’inizio del trascinamento. Quando si rilascia, ogni connettore che lo spostamento instrada di nuovo viene ridisegnato, come uno che ora aggira una tabella lasciata sul suo percorso, o uno che si raddrizza una volta che una tabella si è spostata dal suo percorso.

Un diagramma disegna gli stessi percorsi in ogni finestra che lo mostra con la stessa Visualizzazione nomi: una rimasta aperta mentre le tabelle si spostavano, una che ha aperto il diagramma proprio ora e quella di un collaboratore, e li disegna anche un’[immagine esportata](./file-import-export.md#image). La Visualizzazione nomi conta perché cambia la larghezza delle tabelle — vedere [Visualizzazione nomi](./logical-names.md#name-view).

![Trascinamento della tabella members verso il basso e di nuovo indietro mentre il connettore da orders passa alternativamente a destra di categories e attorno al suo lato sinistro, con tutti gli angoli arrotondati](/img/demo-connector-routing.webp)
