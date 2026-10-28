---
sidebar_position: 12
description: Leggere il DDL del diagramma nella scheda Schema SQL, scegliere database, delimitatori, istruzioni, intestazione, nomi logici nei commenti vuoti e tabelle nel relativo pannello opzioni, aggiungere script propri prima e dopo le tabelle e salvare o copiare il codice SQL.
---

# Schema SQL

La scheda `Schema SQL` mostra il DDL del diagramma per il database selezionato: il codice SQL che ne crea le tabelle con chiavi, indici e chiavi esterne.  
Passare alla scheda `Schema SQL` nella barra degli strumenti o scegliere `Schema SQL` sotto `Tab` nella [Ricerca rapida](./quick-search.md). Anche la scelta di `Schema SQL` dal sottomenu `Export` apre la scheda, pronta per il salvataggio — vedere [Salvare o copiare il codice SQL](#saving-or-copying-the-sql).

Il codice SQL si trova a sinistra e, alla sua destra, un pannello opzioni intitolato `Schema SQL` raccoglie le scelte che lo determinano — vedere [Pannello opzioni](#options-panel). Anche con una lingua di visualizzazione da destra a sinistra, il codice SQL resta a sinistra e si legge da sinistra a destra.  
Il pannello si apre da solo, a meno che l’editor non sia più stretto di 640 px alla prima apertura della scheda. `Hide options` nell’intestazione del pannello lo comprime e `Show options` in alto a destra nel codice lo riapre. Da quel momento resta aperto o compresso come lo si è lasciato, anche cambiando scheda, finché l’editor resta aperto. Si comprime e si apre indipendentemente dal pannello della scheda Generatore di codice e non viene mai salvato nel file.

![Apertura di Export > Schema SQL, impostazione delle istruzioni su Drop & re-create e dell’intestazione su USE, poi aggiunta di uno script SET NAMES prima delle tabelle](/img/demo-schema-sql-options.webp)

Fare clic con il pulsante destro sul codice SQL per aprirne il menu contestuale:

- `Database` e `Bracket`, ciascuno un sottomenu che mostra il segno di spunta sul valore corrente.
- `Statements` e `Header`, ciascuno un sottomenu che mostra il segno di spunta sulla scelta applicata. Una scelta che il database non prevede reca una nota attenuata come `not in Oracle` e non ha alcun effetto.
- `Options panel`, con il segno di spunta mentre il pannello è visibile, che lo comprime o lo apre.
- `Save file`

Mentre questa scheda è aperta, la Ricerca rapida offre `Database` e `Bracket`; `Schema SQL: Statements` e `Schema SQL: Header`, che elencano solo le scelte previste dal database; e `Schema SQL: Options panel`, che comprime o apre il pannello.  
Né il menu contestuale né la Ricerca rapida offrono `Write logical names into empty comments`, che si trova solo nel pannello opzioni — vedere [Nomi logici come commenti](#logical-names-as-comments).

Il codice SQL viene scritto all’apertura della scheda e di nuovo ogni volta che cambia una delle scelte del pannello, il nome del database o uno script. Una modifica apportata alle tabelle mentre la scheda è aperta, come quella di un collaboratore o di un agente di programmazione, compare quando si esce dalla scheda e vi si ritorna, o quando cambia uno di questi elementi.

[Proprietà tabella](./table-related-functions.md#table-properties) ha una propria scheda `Schema SQL`, che mostra il DDL di una singola tabella. Scrive sempre semplici istruzioni `CREATE` senza intestazione né script, non scrive mai un nome logico in un commento vuoto, non ha un pannello opzioni e il suo menu contestuale offre solo `Database` e `Bracket`.

## Pannello opzioni {#options-panel}

Il pannello contiene tre gruppi, ciascuno sotto un’etichetta:

1. `Saved in the document`: `Database` e `Bracket` — vedere [Database e delimitatore](#database-and-bracket). Un editor di sola lettura li indica con `This window only` — vedere [Editor di sola lettura](#read-only-editors).
2. `This window only`: `Statements`, `Header`, `Write logical names into empty comments` e, finché il diagramma contiene un [gruppo di tabelle](./table-groups.md), `Tables` — vedere [Istruzioni](#statements), [Intestazione](#header), [Nomi logici come commenti](#logical-names-as-comments) e [Tabelle](#tables).
3. `Saved in the document · written as is for every database`: gli script `Before tables` e `After tables` — vedere [Script prima e dopo le tabelle](#before-and-after-scripts).

`Save file` e `Copy` si trovano in fondo al pannello — vedere [Salvare o copiare il codice SQL](#saving-or-copying-the-sql).

Le scelte sotto `This window only` appartengono alla finestra dell’editor in cui vengono fatte. Non vengono salvate nel documento, né condivise con i collaboratori, né registrate per l’annullamento, e vengono reimpostate quando l’editor viene chiuso o ricaricato; cambiando scheda vengono mantenute.  
Inizialmente `Statements` è impostato su `If not exists`, `Header` su `CREATE + USE` e `Write logical names into empty comments` è disattivato. Il codice SQL che una pagina in cui è incorporato l’editor legge con [`getSchemaSQL()`](../../api/erd-editor-element.md#getschemasql) e quello [letto da un agente di programmazione](../../mcp/tools.md#reading-a-document) usano invece `Create`, senza intestazione, e non scrivono nomi logici a meno che non venga richiesto.

Una scelta che il database selezionato non prevede resta nel pannello, attenuata, con il tooltip `Not in <database>`, ad esempio `Not in Oracle`, e premerla non ha alcun effetto.  
Il codice SQL usa allora la forma più vicina prevista dal database, e il pulsante di quella forma appare premuto: `If not exists` ripiega su `Create`, `CREATE + USE` su `USE`, o su `None` se il database non prevede nemmeno `USE`, e `USE` su `None`. La scelta fatta viene mantenuta, quindi passando a un database che la prevede viene ripristinata.

## Database e delimitatore {#database-and-bracket}

`Database` è il database del diagramma, la stessa impostazione di `Database` nel menu contestuale dell’area di disegno e di quella del Generatore di codice — vedere [Database](./table-related-functions.md#databases). Elenca Databricks, MSSQL, MariaDB, MySQL, Oracle, PostgreSQL, Snowflake e SQLite, è inizialmente impostato su MySQL e viene salvato nel file come qualsiasi modifica.

`Bracket` imposta il carattere di delimitazione che racchiude i nomi di tabelle, colonne, vincoli e indici: `SingleQuote`, `DoubleQuote`, `Backtick` o `None` per non delimitarli affatto, che è il valore predefinito. È la stessa impostazione del Generatore di codice — vedere [Delimitatore](./code-generator.md#bracket).  
Snowflake, che delimita i nomi solo con le virgolette doppie, le usa con qualsiasi scelta tranne `None`, e Databricks delimita sempre i nomi con gli apici inversi.  
`Bracket` viene salvato nel file solo finché il blocco `Bracket Type` nella scheda Impostazioni è disattivato, e un nuovo diagramma ha tutti i blocchi attivi. Mentre il blocco è attivo, una modifica riscrive il codice SQL sullo schermo, ma il file mantiene il valore bloccato e il diagramma si riapre con quel valore — vedere [Blocco](./settings.md#lock).

Quando il database è Oracle e il codice SQL contiene un nome più lungo di 30 byte, che Oracle 12.1 e versioni precedenti rifiutano, una nota sotto i due elenchi indica ciascuno di questi nomi: `Oracle 12.2+ for names over 30 bytes: <names>`. Vengono controllati i nomi di tabelle, colonne, schemi, chiavi, indici, sequenze e trigger. Il codice SQL in sé non cambia.

## Istruzioni {#statements}

`Statements` determina come vengono create le tabelle:

- `Create` scrive semplici istruzioni `CREATE`.
- `If not exists` salta le tabelle e gli indici che esistono già. MySQL, MariaDB, PostgreSQL, SQLite e Databricks lo prevedono; MSSQL, Oracle e Snowflake scrivono invece `Create`.
  - MySQL scrive ogni tabella come `CREATE TABLE IF NOT EXISTS` con i relativi vincoli univoci, indici e chiavi esterne al suo interno, e racchiude l’intero insieme di istruzioni tra `SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;` e `SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;`.
  - MariaDB aggiunge `IF NOT EXISTS` a ogni istruzione: il `CREATE TABLE`, ogni vincolo `UNIQUE` e `FOREIGN KEY` e ogni `CREATE INDEX`.
  - PostgreSQL scrive `CREATE TABLE IF NOT EXISTS` e `CREATE INDEX IF NOT EXISTS`, ed elimina ogni chiave esterna con `DROP CONSTRAINT IF EXISTS` prima di aggiungerla di nuovo.
  - SQLite scrive `CREATE TABLE IF NOT EXISTS` e `CREATE INDEX IF NOT EXISTS`.
  - Databricks scrive `CREATE TABLE IF NOT EXISTS`, ed elimina ogni chiave esterna con `DROP CONSTRAINT IF EXISTS` prima di aggiungerla di nuovo.
- `Drop & re-create` elimina tutte le tabelle che scrive prima di crearle di nuovo, tranne su Snowflake. Tutti i database lo prevedono:
  - MySQL e MariaDB scrivono un `DROP TABLE IF EXISTS` per ogni tabella, tra le stesse due righe che disattivano e riattivano i controlli delle chiavi esterne.
  - PostgreSQL scrive un unico `DROP TABLE IF EXISTS` che nomina tutte le tabelle, e che fallisce se una tabella non inclusa nell’elenco fa riferimento a una di esse. Con un’intestazione `CREATE + USE`, una tabella il cui nome non indica uno schema viene eliminata da quello schema, ad esempio `shop.member`.
  - MSSQL scrive un’unica transazione, che richiede SQL Server 2016 o successiva, come indica il tooltip `SQL Server 2016+` del pulsante. Elimina le chiavi esterne contenute nelle tabelle scritte, poi le tabelle con un unico `DROP TABLE IF EXISTS`, ed esegue il rollback in caso di errore. Una chiave esterna contenuta in una tabella non inclusa nell’elenco blocca comunque l’eliminazione.
  - SQLite scrive `PRAGMA foreign_keys=OFF;`, che lascia le chiavi esterne disattivate per quella connessione, poi un `DROP TABLE IF EXISTS` per ogni tabella.
  - Oracle scrive `DROP TABLE … CASCADE CONSTRAINTS` per ogni tabella e `DROP SEQUENCE` per ogni sequenza di incremento automatico, ciascuno in un blocco PL/SQL che termina con una riga `/` e ignora l’errore generato da una tabella o da una sequenza mancante.
  - Databricks scrive un `DROP TABLE IF EXISTS` per ogni tabella.
  - Snowflake non elimina nulla e scrive invece `CREATE OR REPLACE TABLE`.

Mentre è applicata l’opzione `Drop & re-create`, un avviso nel pannello indica le tabelle che vengono eliminate: `Drops <tables> before creating them. Their rows are lost.`, o su Snowflake `Replaces <tables>. Their rows are lost.`  
Fino a cinque tabelle vengono indicate per intero. Oltre cinque, l’avviso nomina le prime quattro e conta le restanti, ad esempio `a, b, c, d, and 3 more tables`.

## Intestazione {#header}

`Header` fa iniziare il codice SQL con le istruzioni che creano o selezionano il database, o lo schema, in cui viene eseguito. Il nome è il nome del database del diagramma, digitato nel campo `database name` della barra degli strumenti, e viene delimitato con il carattere scelto in `Bracket`.

- MySQL e MariaDB: `USE` scrive `USE shop;` e `CREATE + USE` vi antepone `CREATE DATABASE IF NOT EXISTS shop;`.
- MSSQL: `USE` scrive `USE shop` e `GO`, e `CREATE + USE` vi antepone `IF DB_ID(N'shop') IS NULL CREATE DATABASE shop` e `GO`.
- PostgreSQL prevede solo `CREATE + USE`, che scrive `CREATE SCHEMA IF NOT EXISTS shop;` e `SET search_path TO shop, public;`.
- Oracle prevede solo `USE`, che scrive `ALTER SESSION SET CURRENT_SCHEMA = shop;`. `CREATE + USE` ripiega su di esso, quindi è questa la riga che Oracle scrive con l’intestazione predefinita della scheda.
- Snowflake e Databricks: `USE` scrive `USE SCHEMA shop;` e `CREATE + USE` vi antepone `CREATE SCHEMA IF NOT EXISTS shop;`.
- SQLite non prevede nessuno dei due e non scrive alcuna intestazione.

Dove il database prevede `USE` o `CREATE + USE`, il tooltip del pulsante indica cosa scrive in quel database, ad esempio `CREATE SCHEMA + SET search_path` su PostgreSQL.

Un’intestazione viene scritta solo se il nome del database è un identificatore semplice: una lettera ASCII (`A`–`Z`, `a`–`z`) o `_`, seguita da lettere ASCII, cifre o `_`.  
Qualsiasi altro nome, incluso un nome vuoto, non produce alcuna intestazione, e il `DROP TABLE` di PostgreSQL non indica allora alcuno schema. Mentre è applicata un’intestazione diversa da `None`, una nota sotto `Header` lo segnala: `Database name "<name>" is not a valid identifier.`  
Il nome del database di un nuovo diagramma è vuoto, quindi finché non gli si assegna un nome il pannello mostra `Database name "" is not a valid identifier.`

## Nomi logici come commenti {#logical-names-as-comments}

`Write logical names into empty comments`, un interruttore sotto `This window only`, scrive nel DDL il [nome logico](./logical-names.md) di una tabella o di una colonna dove il suo commento è vuoto, su ogni database.

![Attivazione di Write logical names into empty comments nel pannello Schema SQL, che scrive il nome logico di ogni colonna di order_items nel suo COMMENT vuoto mentre i commenti di members restano invariati](/img/demo-schema-sql-logical-names.webp)

- Un commento con del testo ha sempre la precedenza: il nome logico non lo sostituisce mai e non vi viene mai aggiunto.
- Un commento composto solo da spazi vuoti conta come vuoto, quindi al suo posto viene scritto il nome logico. Un nome logico vuoto o composto solo da spazi vuoti non scrive nulla, e quella tabella o colonna resta comunque senza commento.
- Il nome logico viene scritto nel punto e nella forma in cui il database scrive un commento, con gli apici sottoposti a escape allo stesso modo — vedere [Commenti](#comments).

Su MySQL, ad esempio, una colonna `id` con il nome logico `Member ID` e senza commento viene scritta con `COMMENT 'Member ID'`, mentre una colonna `email` con il nome logico `Email` e il commento `Sign-in address` mantiene `COMMENT 'Sign-in address'`.

Come `Statements` e `Header`, l’interruttore appartiene alla finestra ed è inizialmente disattivato — vedere [Pannello opzioni](#options-panel).  
Un’importazione non rilegge mai un commento di questo tipo come nome logico — vedere [Commenti](./file-import-export.md#comments).

## Tabelle {#tables}

Finché il diagramma contiene almeno un [gruppo di tabelle](./table-groups.md), visibile o nascosto, `Tables` compare sotto `This window only` con una casella di controllo per ogni scelta:

- `All`, che seleziona o deseleziona tutte le caselle. Mostra uno stato misto quando solo alcune sono selezionate.
- Una casella per ogni gruppo di tabelle, nell’ordine dei gruppi del diagramma, contrassegnata dal nome del gruppo, o da `unnamed` per un gruppo che non ne ha uno, preceduto da un punto del colore del gruppo se il gruppo ha un colore.
- `No group`, per le tabelle che non appartengono ad alcun gruppo.

Con tutte le caselle selezionate, la scheda scrive l’intero diagramma.  
Con solo alcune selezionate, scrive le tabelle delle caselle selezionate con i relativi indici e le chiavi esterne che contengono, inclusa una che fa riferimento a una tabella esclusa. Gli script prima e dopo le tabelle vengono comunque scritti, e `Drop & re-create`, il relativo avviso e la nota di Oracle sui nomi lunghi riguardano solo quelle tabelle.  
Senza alcuna casella selezionata, la scheda non scrive nulla e un suggerimento sopra il codice riporta `No tables chosen. Check some under Tables.` `Save file` salva allora un file vuoto e `Copy` copia un testo vuoto.

Come per `Statements` e `Header`, la scelta appartiene alla finestra — vedere [Pannello opzioni](#options-panel).  
Un gruppo aggiunto in seguito è inizialmente selezionato solo se in quel momento tutte le caselle erano selezionate. Rimuovendo un gruppo si rimuove la sua casella, e rimuovendo l’ultimo gruppo tutto torna selezionato.  
La scelta vale solo per questa scheda. La scheda `Schema SQL` di Proprietà tabella e `getSchemaSQL()` non ne risentono.

## Script prima e dopo le tabelle {#before-and-after-scripts}

`Before tables` e `After tables` contengono codice SQL scritto dall’utente, come istruzioni `CREATE EXTENSION` o `SET` prima delle tabelle, o concessioni di privilegi, viste e dati iniziali dopo di esse.  
Vengono salvati nel documento, una sola coppia per l’intero diagramma qualunque sia il database. Ciascuno viene inserito nel codice SQL così come è stato digitato, senza mai essere controllato: lo script prima delle tabelle va dopo l’intestazione e prima delle istruzioni `DROP` e delle tabelle, quello dopo le tabelle alla fine di tutto.

Le interruzioni di riga vengono scritte come LF, e le righe vuote prima di uno script e gli spazi vuoti dopo di esso vengono rimossi.  
Su MSSQL, viene aggiunta una riga `GO` dopo uno script la cui ultima riga non è `GO` (o `GO` seguito da un conteggio), come indica la riga sotto i due campi. Su Oracle, terminare manualmente un blocco PL/SQL con la relativa riga `/`.

I campi evidenziano la sintassi SQL e si espandono con il testo.  
Una modifica viene applicata quando si esce dal campo, facendo clic altrove o cambiando scheda, e solo allora cambiano il codice SQL accanto e il documento. Un campo in cui si è solo fatto clic non cambia nulla.  
Una modifica a uno script cambia il diagramma come qualsiasi altra modifica: viene salvata nel file, i collaboratori la vedono e ogni modifica applicata è un passo della [cronologia delle modifiche](./undo-redo.md), annullabile dalla scheda ERD.  
Durante la digitazione in un campo, i tasti di scelta rapida propri dell’editor vengono lasciati al campo, quindi `Ctrl + Z` (Windows/Linux) o `⌘ + Z` (Mac) annulla il testo digitato nel campo, e copia, taglia e incolla agiscono sul testo anziché sul diagramma.  
La Ricerca rapida e la [ricerca del pannello Esplora](./find-and-replace.md) si aprono comunque con i rispettivi tasti di scelta rapida, `Ctrl + K` e `Ctrl + F` (Windows/Linux) o `⌘ + K` e `⌘ + F` (Mac). Poiché `Ctrl + F` o `⌘ + F` passa alla scheda ERD, applica la modifica, come qualsiasi cambio di scheda.  
Un campo senza il focus recepisce una modifica che un collaboratore o un [agente di programmazione](../../mcp/tools.md#settings) apporta al suo script. Un campo che ha il focus mostra quella modifica quando lo si lascia senza aver digitato nulla. Se si è digitato qualcosa, il proprio testo viene applicato all’uscita dal campo e sostituisce il loro.

## Salvare o copiare il codice SQL {#saving-or-copying-the-sql}

`Save file`, in fondo al pannello o nel menu contestuale, salva esattamente il codice SQL mostrato dalla scheda, con i valori attuali di database, delimitatore, istruzioni, intestazione, commenti con i nomi logici, tabelle e script, come `<database name>-<timestamp>.sql`. Il file viene denominato e salvato come ogni altra esportazione — vedere [Esportazione](./file-import-export.md#exporting).

`Export` ▸ `Schema SQL`, nel menu contestuale dell’area di disegno o nella Ricerca rapida, da solo non salva nulla.  
Passa a questa scheda, apre il pannello opzioni anche se era compresso e sposta il focus su `Save file`, quindi premendo `Enter` si salva il file.

`Copy` in fondo al pannello, o il pulsante di copia che compare in alto a destra nel codice quando vi si passa sopra il puntatore, copia il codice SQL.  
Lo conferma per due secondi la notifica `Copied!` con un segno di spunta. Se il browser o l’host rifiuta l’accesso agli Appunti, lo segnala invece per cinque secondi la notifica `Couldn't copy to the clipboard` con un simbolo di avviso. Una nuova copia sostituisce la notifica anziché aggiungerne un’altra.  
Il codice SQL è anche selezionabile, quindi è possibile prenderne solo una parte.

## Cosa scrive il DDL {#what-the-ddl-writes}

Queste regole valgono ovunque l’editor scriva lo Schema SQL: in questa scheda e nel relativo file, e nel codice SQL letto da una pagina in cui è incorporato l’editor o da un agente di programmazione.  
La scheda `Schema SQL` di Proprietà tabella le segue per la singola tabella che mostra. Non scrive sequenze né trigger di Oracle, né chiavi esterne, tranne quelle di SQLite, che si trovano all’interno del suo `CREATE TABLE`. Non scrive nemmeno le istruzioni di commento che PostgreSQL, Oracle e MSSQL collocano dopo una tabella, quindi con questi tre database non mostra alcun commento.

Le parti compaiono in quest’ordine, separate da una riga vuota: l’intestazione, lo script prima delle tabelle, le istruzioni `DROP`, le tabelle e lo script dopo le tabelle. Le tabelle vengono scritte in ordine di nome.  
Un diagramma senza tabelle e senza script non scrive nulla, anche se è stata scelta un’intestazione.

Le tabelle e le colonne vengono scritte con i loro nomi fisici, qualunque cosa mostri la [Visualizzazione nomi](./logical-names.md#name-view). Una colonna collegata a un dominio viene scritta con il proprio tipo di dati, impostato dal dominio — vedere [Domini e tipi di dati](./dictionary.md#domains-and-data-types).

### Incremento automatico {#auto-increment}

Una colonna contrassegnata come `Auto Increment` viene scritta nel modo proprio di ciascun database: `AUTO_INCREMENT` su MySQL e MariaDB, `IDENTITY(1,1)` su MSSQL, `AUTOINCREMENT` su Snowflake e `GENERATED ALWAYS AS IDENTITY` su PostgreSQL e Databricks.  
Per Oracle vengono scritti una sequenza `SEQ_<table>` e un trigger `SEQ_TRG_<table>` che popola la colonna a partire dalla sequenza. Il trigger termina con una riga `/`, quindi SQL\*Plus e SQLcl lo eseguono.

Dove un database non accetta l’incremento automatico sul tipo della colonna, la clausola viene omessa e una riga di commento dopo la tabella indica la colonna:

- PostgreSQL lo accetta solo su `smallint`, `integer` o `bigint`, con uno qualsiasi dei loro nomi: `INT`, `INTEGER`, `BIGINT`, `SMALLINT`, `INT2`, `INT4` o `INT8`. Una colonna di un altro tipo non riceve né la clausola né un valore predefinito, e il commento riporta, ad esempio, `-- PostgreSQL takes IDENTITY only on smallint, integer or bigint, so member.id is written without it.`
- Databricks lo accetta solo su `BIGINT` o `LONG`.
- SQLite accetta `AUTOINCREMENT` solo sull’unica colonna di chiave primaria di una tabella, se di tipo intero, come `INT`, `BIGINT` o `INT8`, con o senza larghezza. Quella colonna viene scritta come `INTEGER` e la chiave come `PRIMARY KEY (id AUTOINCREMENT)`. Una chiave singola di qualsiasi altro tipo viene scritta senza di esso.

### Azioni referenziali {#referential-actions}

Le azioni ON DELETE e ON UPDATE scritte da ciascun database sono elencate in [ON DELETE e ON UPDATE](./relationship-editing.md#on-delete-and-on-update).  
Dove Snowflake omette un’azione, un commento sopra l’istruzione `ALTER TABLE` di quella chiave esterna la indica, ad esempio `-- Snowflake creates no foreign key with a referential action other than NO ACTION, so ON DELETE CASCADE is left out.`

### Nomi di tabella qualificati con lo schema {#schema-qualified-table-names}

Con `Bracket` impostato su `None`, un nome di tabella con un punto, come `sales.users`, viene interpretato come schema e tabella, divisi in corrispondenza dell’ultimo punto al di fuori di parentesi quadre o virgolette doppie.

- MySQL, MariaDB, MSSQL, Oracle e PostgreSQL costruiscono i nomi automatici che scrivono a partire dalla sola parte della tabella: `FK_users_TO_orders` e `IDX_users` su tutti e cinque, `UQ_users_email` su tutti tranne PostgreSQL, e `PK_users` su MSSQL e Oracle, i due tra questi che assegnano un nome alla chiave primaria. Su questi due, anche `[sales].[users]` e `"sales"."users"` danno `PK_users`, e `[Order]` dà `PK_Order`.
- SQLite non assegna nomi ai vincoli, quindi l’unico nome automatico che costruisce è quello dell’indice: `CREATE INDEX sales.IDX_users ON users`.
- Oracle crea gli indici della tabella, e la sequenza e il trigger di una colonna a incremento automatico, nello schema della tabella: `sales.IDX_users`, `sales.SEQ_users` e `sales.SEQ_TRG_users`.
- In Oracle e SQLite, un nome di indice a cui si è assegnato manualmente uno schema lo mantiene.
- Un nome automatico di chiave esterna o di indice che ripete uno precedente, senza distinzione tra maiuscole e minuscole, riceve un numero. Con `sales.users` e `hr.Users` entrambe referenziate da `orders`, la seconda chiave è `FK_Users_TO_orders1`.

Con qualsiasi altro valore di `Bracket`, l’intero nome della tabella è un unico identificatore, come `"PK_sales.users"`. Snowflake e Databricks mantengono sempre il nome intero.  
Le righe `Keys` della scheda [Indici](./table-related-functions.md#indexes) mostrano gli stessi nomi.

### Valori predefiniti {#defaults}

Il valore predefinito di una colonna viene scritto così come è stato digitato, ma tra parentesi dove il database legge quell’espressione solo al loro interno. Un valore predefinito già tra parentesi viene lasciato invariato.

- MySQL racchiude tra parentesi tutto tranne un valore letterale o l’ora corrente, come `(uuid())`. Racchiude inoltre qualsiasi valore predefinito diverso da `NULL` su una colonna `BLOB`, `TEXT`, `JSON`, spaziale o `LONG…`, e l’ora corrente su qualsiasi colonna che non sia `TIMESTAMP` o `DATETIME`.
- MariaDB racchiude tutto tranne un valore letterale, l’ora corrente, una chiamata di funzione o un nome.
- SQLite racchiude tutto tranne un valore letterale o un nome, come `(datetime('now'))`.
- PostgreSQL racchiude solo un’espressione con una parola come `AT TIME ZONE`, `AND`, `OR`, `IS`, `IN`, `LIKE`, `COLLATE` o `= ANY` al di fuori delle parentesi, come `(now() AT TIME ZONE 'utc')`.
- MSSQL, Oracle, Snowflake e Databricks scrivono ogni valore predefinito così come è stato digitato.

### Commenti {#comments}

Il commento non vuoto di una tabella o di una colonna, o il nome logico che [`Write logical names into empty comments`](#logical-names-as-comments) scrive al suo posto, viene scritto nel modo in cui ciascun database scrive i commenti:

- MySQL e MariaDB lo scrivono in linea: una colonna termina con `COMMENT 'Member ID'`, e la tabella si chiude con `) COMMENT 'Members';`, anche nell’insieme di istruzioni `If not exists` di MySQL.
- Snowflake scrive in linea quello di una colonna, `COMMENT 'Member ID'`, e quello della tabella su una riga a sé dopo la parentesi di chiusura, `COMMENT = 'Members';`.
- Databricks scrive in linea quello di una colonna, e quello della tabella come `COMMENT 'Members';` dopo `USING DELTA`.
- PostgreSQL scrive `COMMENT ON TABLE member IS 'Members';` e `COMMENT ON COLUMN member.id IS 'Member ID';` subito dopo il `CREATE TABLE` della tabella. Oracle scrive le stesse istruzioni dopo la tabella, i suoi vincoli univoci e la sua sequenza e il suo trigger di incremento automatico.
- MSSQL scrive una chiamata per ogni tabella e per ogni colonna, dopo la tabella e i suoi vincoli univoci, ciascuna seguita da `GO`: `EXECUTE sys.sp_addextendedproperty 'MS_Description', N'Members', 'schema', 'dbo', 'table', 'member'`, con l’aggiunta di `'column', 'id'` per una colonna.  
  Il testo è un letterale nazionale, `N'…'`, quindi SQL Server conserva il testo al di fuori della tabella codici del database, come il coreano, anziché memorizzare punti interrogativi.  
  Con `Bracket` impostato su `None`, una tabella denominata `sales.users` dà lo schema `sales` e la tabella `users`, e lo stesso vale per `[sales].[users]` e `"sales"."users"`, di cui vengono eliminate le parentesi quadre e le virgolette doppie. Un nome senza schema si trova in `dbo`. Una parte prima dello schema, come in `shop.sales.users`, esegue la procedura di quel database, `shop.sys.sp_addextendedproperty`. Con qualsiasi altro valore di `Bracket` l’intero nome è la tabella, in `dbo`.
- SQLite non conserva i commenti, quindi scrive ciascuno come una riga `--` sopra ciò che descrive: `-- Members` sopra `CREATE TABLE member`, e `-- Member ID` sopra la colonna.

Un apice all’interno di un commento delimitato da apici viene raddoppiato, come in `'it''s'` e `N'it''s'`, e lo stesso vale per un apice nei nomi passati dalle chiamate di MSSQL. Databricks invece sottopone a escape un apice e una barra rovesciata con una barra rovesciata, come in `'it\'s'`, la forma che legge ogni versione di Spark. Le righe `--` di SQLite non sono delimitate da apici, quindi mantengono un apice così come è stato digitato: `-- it's`.  
Per il resto il testo viene scritto così come è stato digitato, interruzioni di riga comprese, tranne su due database:

- Oracle omette le righe vuote, considerando vuota una riga composta solo da spazi o tabulazioni, perché SQL\*Plus termina un’istruzione a una riga vuota e ne salta il resto. Un commento di tabella composto da `Members`, una riga vuota e `Active only` viene scritto come `COMMENT ON TABLE member IS 'Members` con `Active only';` sulla riga successiva.
- SQLite scrive ogni sequenza di interruzioni di riga come un unico spazio, perché un’interruzione di riga terminerebbe la riga `--` ed eseguirebbe il resto come SQL. Lo stesso commento viene scritto come `-- Members Active only`.

Il modo in cui questi commenti vengono riletti in fase di importazione è descritto in [Commenti](./file-import-export.md#comments).

## Editor di sola lettura {#read-only-editors}

In un editor [`readonly`](../../api/erd-editor-element.md#readonly) la scheda funziona per il lettore, e nulla di ciò che vi si fa raggiunge il documento:

- `Database` e `Bracket` riscrivono comunque il codice SQL, ma solo in quella finestra, quindi il pannello li indica anch’esso con `This window only`. Una scelta non viene salvata nel file, condivisa con i collaboratori né registrata per l’annullamento, qualunque sia il blocco, e una modifica di un collaboratore a un’impostazione che avete scelto lascia sullo schermo la vostra scelta. La scheda Generatore di codice mostra la stessa scelta, e la scrive anche [`getSchemaSQL()`](../../api/erd-editor-element.md#getschemasql) chiamato senza un database. Quando l’editor torna modificabile, tornano il database e il delimitatore del documento.
- `Statements`, `Header`, `Write logical names into empty comments` e `Tables` funzionano come ovunque, poiché appartengono già alla finestra.
- I due campi degli script sono di sola lettura: mostrano gli script del documento, che il codice SQL scrive comunque, e non accettano digitazione.
- `Save file` e `Copy` salvano e copiano il codice SQL mostrato nella scheda.
