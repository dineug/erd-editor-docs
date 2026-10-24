---
sidebar_position: 2
description: Importare JSON, schema SQL, GraphQL, DBML o AML al posto del diagramma o aggiungendoli sotto di esso, ed esportare JSON, schema SQL o il diagramma come immagine PNG o SVG.
---

# Importare o esportare file

## Importare file esterni {#importing-external-files}

È possibile importare cinque formati dal sottomenu `Import` del menu contestuale dell’area di disegno:

- json
- Schema SQL
- GraphQL
- DBML
- AML

La voce `Import and Add`, subito sotto `Import`, aggiunge il file al diagramma invece di sostituirlo — vedere [Importa e aggiungi](#import-and-add).  
La schermata di benvenuto mostrata da un diagramma vuoto ha una riga `Import` con gli stessi cinque formati — vedere [Schermata di benvenuto](./editing-start.md#welcome-screen).  
Anche i fogli della scheda [Dizionario](./dictionary.md) accettano parole, termini e domini da file CSV, con il comando `Import CSV` proprio di quella scheda — vedere [Importare ed esportare file CSV](./dictionary.md#importing-and-exporting-csv).

Le estensioni vengono riconosciute senza distinzione tra maiuscole e minuscole. Se si sceglie un file la cui estensione non corrisponde al formato selezionato, l’importazione viene annullata e compare `Only <format> files can be imported`, con il formato scritto `json`, `sql`, `graphql`, `dbml` o `aml`, come in `Only sql files can be imported`.

`Import` sostituisce il documento corrente anziché fondersi con esso, e un solo annullamento ripristina il diagramma precedente.  
Un file JSON porta con sé le proprie impostazioni, compresi i suoi [blocchi](./settings.md#lock). Dove il file blocca la scheda, il linguaggio del Generatore di codice, uno stile dei nomi, il tipo di delimitatore o la [Visualizzazione nomi](./logical-names.md#name-view), si continua a vedere ciò che si aveva, ma il valore salvato è quello bloccato nel file. Lo zoom e la posizione della vista, bloccati o meno, assumono i valori indicati dal file. Un file JSON salvato prima che esistessero i blocchi viene importato con tutti i blocchi attivi e la vista al 100%. Uno salvato prima che esistesse il blocco `Name View` viene importato con quel blocco attivo, qualunque altro blocco registri.  
Gli altri formati mantengono le impostazioni già presenti, blocchi compresi, tranne la vista, che parte dal 100%.  
I parser GraphQL, DBML e AML non falliscono mai: un file che non riescono a leggere produce un diagramma vuoto anziché un errore.

Un file JSON porta con sé anche i nomi logici delle sue tabelle e colonne e i collegamenti delle sue colonne ai domini. Le sue parole, i suoi termini e i suoi domini prendono il posto di quelli della scheda [Dizionario](./dictionary.md), quindi un file che non ne contiene lascia vuoti i fogli, e annullare l’importazione ripristina quelli che ha sostituito.  
Gli altri formati non contengono nessuno di questi elementi. Le loro tabelle arrivano senza nomi logici e senza alcuna colonna collegata a un dominio, e le parole, i termini e i domini dell’utente restano come sono. Anche annullare o ripetere l’importazione li lascia come sono, quindi una modifica ai dizionari apportata dopo l’importazione viene mantenuta. Un’importazione di questo tipo lascia inoltre invariata la cronologia delle modifiche propria di ogni foglio, mentre un’importazione JSON svuota quelle cronologie — vedere [Fogli della scheda Dizionario](./undo-redo.md#dictionary-sheets).

Un file JSON mantiene le proprie posizioni. Le tabelle di un file Schema SQL, GraphQL, DBML o AML vengono posizionate prima che il diagramma cambi, con le larghezze che assumono nella [vista](./logical-names.md#beyond-the-canvas) che si sta guardando:

- Quando il file ha due o più tabelle e almeno una relazione, queste vengono disposte dal [Layout automatico](./table-related-functions.md#auto-layout) in modalità `Flow`, da sinistra a destra lungo le relazioni, a partire dall’angolo in alto a sinistra dell’area di disegno. Conta anche una relazione da una tabella a sé stessa.
- Altrimenti vengono disposte in righe a partire dall’angolo in alto a sinistra, prima le tabelle con meno colonne.
- Se il layout dura più di 6 secondi, compare l’avviso `Placing tables` con un pulsante `Cancel`. `Cancel`, o `Escape` mentre l’avviso è visibile, abbandona il layout e dispone invece le tabelle in righe. Le righe vengono usate anche, senza avviso, quando il layout non riesce, quando nessun layout arriva entro 60 secondi o quando l’host non esegue un worker condiviso — vedere [Web Worker](../../api/installation.md#web-workers).

Il diagramma viene poi sostituito in un solo passaggio, così non compare nessuno stato intermedio. Un’impostazione modificata durante il posizionamento delle tabelle, come la scheda, viene mantenuta, e se nel frattempo si importa un altro file, prevale l’ultima importazione avviata.

Un editor di sola lettura non carica nulla da `Import` e non offre né `Import and Add` né il comando `Import CSV` della scheda Dizionario.

### Importa e aggiungi {#import-and-add}

`Import and Add` mantiene il diagramma e aggiunge un file sotto di esso. Si trova nel menu contestuale dell’area di disegno e nella [Ricerca rapida](./quick-search.md) della scheda ERD, e offre gli stessi cinque formati con lo stesso controllo dell’estensione di `Import`.

![Aggiunta di un file SQL da Import and Add > Schema SQL, con le tabelle collocate sotto il diagramma, disposte lungo le relazioni e selezionate](/img/demo-import-and-add.webp)

Il file viene inserito come quando si incolla: ogni tabella, colonna, relazione, indice, memo e [gruppo di tabelle](./table-groups.md) che contiene viene aggiunto come nuovo elemento, le tabelle già presenti nel diagramma non si spostano e nessuna impostazione cambia, quindi le impostazioni di un file JSON vengono escluse.  
Le tabelle e le colonne di un file JSON mantengono i loro nomi logici, e ogni nome fisico resta gestito dai dizionari o personalizzato, come era nel file, il che determina se un nome logico scritto in seguito ne deriva uno nuovo — vedere [Derivare i nomi fisici](./dictionary.md#deriving-physical-names). Le parole, i termini e i domini del file vengono esclusi, quindi la scheda Dizionario resta com’era, e nessuna colonna aggiunta viene collegata a un dominio: ciascuna mantiene il tipo di dati che ha.  
Una tabella con un nome già presente nel diagramma viene aggiunta come seconda tabella con quel nome, senza essere unita all’altra. Relazioni e indici provengono solo dal file, quindi una chiave esterna verso una tabella che il file non definisce non viene collegata a una tabella già presente nel diagramma.

Il blocco aggiunto viene collocato subito sotto tutto ciò che il diagramma contiene, allineato al suo bordo sinistro, oppure in alto a sinistra in un diagramma vuoto. Contano anche i memo e i gruppi di tabelle nascosti con le [Opzioni di visualizzazione](./table-related-functions.md#table-view-options), poiché occupano comunque il loro spazio.  
All’interno del blocco, un file JSON mantiene la propria disposizione, gruppi di tabelle compresi. Gli altri formati vengono posizionati come li posiziona `Import`, con `Flow` o in righe secondo le stesse regole, e il riquadro di ogni gruppo di tabelle viene adattato attorno alle sue tabelle. Nell’ordine di sovrapposizione, le tabelle e i memo aggiunti stanno sopra a tutto ciò che è già presente.

Una volta collocato il blocco, viene selezionato solo ciò che è stato aggiunto: le nuove tabelle, più i nuovi memo e gruppi di tabelle se sono visibili. Se nel frattempo si è passati a un’altra scheda, l’editor torna alla scheda ERD prima di collocare il blocco. La vista scorre poi fino al blocco al livello di zoom corrente, a meno che non sia già ben visibile — vedere [Dove porta un salto](./table-related-functions.md#where-a-jump-lands). Un solo annullamento revoca l’intera aggiunta.  
Un file che il parser non riesce a leggere, o uno senza tabelle né memo, non aggiunge nulla.

Più file Schema SQL, GraphQL, DBML o AML aggiunti mentre uno è ancora in fase di posizionamento vengono collocati tutti, nell’ordine in cui sono stati avviati. Un file JSON aggiunto nel frattempo viene collocato appena letto, prima di essi. Un `Import`, o il caricamento di un altro documento, scarta quelli ancora in fase di posizionamento.

Gli agenti di programmazione aggiungono un file nello stesso modo con la modalità `append` degli strumenti di importazione MCP, che mantiene la disposizione di un file JSON ma dispone in righe le tabelle degli altri formati, mai con `Flow` — vedere [Importazione](../../mcp/tools.md#import).

### JSON {#json}

È possibile importare file nel [formato di schema definito nell’editor](../../api/advanced/schema.md).
Il nome del file deve terminare con `.json`, quindi un file esportato come `<database name>-<timestamp>.erd.json` si reimporta così com’è; un semplice file `.erd` o `.vuerd` non è accettato qui. Vengono letti anche i file salvati da versioni precedenti.

![Importazione di un file salvato da Import > json, che sostituisce il documento di bozza insieme alle sue impostazioni](/img/demo-import-json.webp)

### Schema SQL {#schema-sql}

È possibile importare anche file di schema definiti in SQL.  
Sebbene i parser siano stati resi il più flessibili possibile indipendentemente dal fornitore di database, potrebbe esserci qualche sintassi non supportata.  
Il nome del file deve terminare con `.sql`.  
[Qui è possibile verificare la sintassi supportata.](https://github.com/dineug/erd-editor/tree/main/packages/schema-sql-parser)

![Importazione di un file SQL da Import > Schema SQL, con le tabelle disposte lungo le relazioni, seguita da uno zoom indietro su di esse](/img/demo-import-sql.webp)

Le colonne provengono solo da `CREATE TABLE`. Una colonna aggiunta con `ALTER TABLE ... ADD COLUMN` non viene letta.  
Gli elementi di un `CREATE TABLE` che non sono colonne vengono ignorati anziché letti come colonne: un `CHECK (...)` senza nome, `LIKE` ed `EXCLUDE` di PostgreSQL, `FULLTEXT` e `SPATIAL` di MySQL scritti senza `INDEX` o `KEY`, `PERIOD FOR` di T-SQL e `SUPPLEMENTAL LOG DATA` di Oracle.  
Una colonna che porta il nome di uno di essi viene comunque importata quando il nome è seguito da un tipo integrato, come in `exclude BOOLEAN`, o quando il nome è tra virgolette, come in `"check" int`. Un `like` senza virgolette seguito da un tipo non integrato, come `like citext`, viene letto come il `LIKE` di PostgreSQL e ignorato.  
I vincoli `CHECK` in sé non vengono importati, poiché l’editor non ha dove conservarli.

#### Tipi di dati {#data-types}

Il tipo di dati di una colonna viene mantenuto, elenco degli argomenti compreso, anche quando non è un tipo integrato di alcun [database supportato](./table-related-functions.md#databases).  
Ciò comprende un enum o un tipo composito creato con `CREATE TYPE`, un dominio creato con `CREATE DOMAIN`, i tipi delle estensioni come `hstore`, `citext` e `ltree`, i nomi qualificati con lo schema come `public.mood` e i nomi tra virgolette o tra parentesi quadre come `"MyType"` e `[dbo].[Phone]`, che mantengono le virgolette o le parentesi. Le istruzioni `CREATE TYPE`, `CREATE DOMAIN` e `CREATE EXTENSION` in sé vengono ignorate.  
Un tipo integrato perde le virgolette o le parentesi quadre, quindi `[int]` viene importato come `int` e `[nvarchar](50)` come `nvarchar(50)`. `"char"` e `"bit"` di PostgreSQL mantengono le proprie, perché sono tipi diversi da `char` e `bit`.  
I suffissi di array restano su qualsiasi tipo: `integer[]`, `text[3][3]`, `integer ARRAY`, `mood[]`. `UNSIGNED BIG INT` di SQLite viene importato per intero.  
`UNSIGNED` e `ZEROFILL` di MySQL e MariaDB, scritti subito dopo un tipo e i suoi argomenti, restano parte del tipo così come sono scritti: `INT UNSIGNED`, `SMALLINT(5) UNSIGNED ZEROFILL`, `int unsigned` di mysqldump. `SIGNED`, il valore predefinito, viene scartato, quindi `TINYINT SIGNED` viene importato come `TINYINT`. Un modificatore scritto dopo un’altra opzione di colonna, come in `INT NOT NULL UNSIGNED`, che MySQL rifiuta, viene scartato.  
I valori di `ENUM(...)` e `SET(...)` mantengono le virgolette, e un apice all’interno di un valore viene raddoppiato, come in `ENUM('a','it''s')`. Il formato `'it\'s'` di MySQL, con escape tramite barra rovesciata, viene importato raddoppiato allo stesso modo. In un tipo `STRUCT<...>` di Databricks, i nomi di campo tra virgolette e il `COMMENT` di un campo mantengono le virgolette.  
Una colonna scritta senza tipo, come una colonna SQLite senza tipo o una colonna calcolata `AS`, resta senza tipo: una parola chiave come `NOT`, `NULL`, `DEFAULT`, `PRIMARY` o `REFERENCES`, o una stringa tra apici singoli, non viene letta come tipo.

#### Valori predefiniti {#defaults}

Il `DEFAULT` di una colonna mantiene l’intera espressione, come `now()`, `0.5`, `CURRENT_TIMESTAMP` o `ARRAY[]::text[]`, fino all’opzione di colonna successiva, a una virgola o alla parentesi di chiusura. Un `CASE ... END` viene letto per intero.  
Le parentesi attorno all’intera espressione vengono rimosse, quindi `((0))` di SQL Server viene importato come `0` e `(getdate())` come `getdate()`. Viene rimosso anche il cast di un valore letterale, quindi `'draft'::character varying` di pg_dump viene importato come `'draft'` e `NULL::character varying` come `NULL`; gli altri cast restano, come in `ARRAY[]::text[]` e `lower('A'::text)`.  
`ON UPDATE CURRENT_TIMESTAMP` di MySQL viene scartato, poiché una colonna non ha dove conservarlo, mentre il valore predefinito che lo precede resta. `DEFAULT ON NULL 0` di Oracle, con o senza `FOR INSERT ONLY` o `FOR INSERT AND UPDATE`, viene importato come `0`.  
Una stringa con un prefisso, come `N'x'`, `E'x'`, `B'0'`, `X'ff'`, `U&'x'` o `_utf8mb4'x'`, viene letta come un’unica stringa, anche se contiene una parentesi.

SQL Server Management Studio genera i valori predefiniti dopo le tabelle, come `ALTER TABLE [dbo].[t] ADD CONSTRAINT [DF_x] DEFAULT ((1)) FOR [col]`. Un’istruzione di questo tipo imposta il valore predefinito di quella colonna, qui `1`, e il nome del vincolo viene scartato.

Un’esportazione Schema SQL rimette le parentesi dove un database legge l’espressione di un valore predefinito solo al loro interno — vedere [Valori predefiniti](./schema-sql.md#defaults).

#### Incremento automatico {#auto-increment}

`AUTO_INCREMENT`, `AUTOINCREMENT` e `IDENTITY` attivano il flag `Auto Increment` di una colonna, così come `GENERATED ALWAYS AS IDENTITY` e `GENERATED BY DEFAULT AS IDENTITY`, che non lasciano alcun valore predefinito.  
Lo stesso vale per un valore predefinito costituito da una singola chiamata `nextval()` di PostgreSQL, il valore predefinito che riceve una colonna serial, scritto `nextval('s')` o, come lo scrive pg_dump, `nextval('s'::regclass)`. Il nome della sequenza non viene mantenuto. Un valore predefinito che si limita a usare una sequenza, come `nextval('s') + 1` o `NEXT VALUE FOR s` di SQL Server, resta un semplice valore predefinito.  
pg_dump scrive entrambi dopo le tabelle, come `ALTER TABLE [ONLY] t ALTER [COLUMN] c SET DEFAULT nextval('s'::regclass)` e `ALTER TABLE t ALTER [COLUMN] c ADD GENERATED ... AS IDENTITY`. Ciascuna delle due istruzioni attiva il flag `Auto Increment` di quella colonna e ne cancella il valore predefinito. `CREATE SEQUENCE`, `ALTER SEQUENCE` e ogni altra azione `ALTER COLUMN` vengono ignorati.  
Una colonna con tipo `serial`, `bigserial` o `smallserial` dichiarato inline mantiene quel tipo, con `Auto Increment` disattivato.

L’editor mantiene solo il flag `Auto Increment`, e ogni database scrive la propria forma in esportazione — vedere [Incremento automatico](./schema-sql.md#auto-increment). Un’esportazione PostgreSQL scrive `GENERATED ALWAYS AS IDENTITY` su una colonna `smallint`, `integer` o `bigint`, qualunque sia la forma importata, e su qualsiasi altro tipo, come `INT UNSIGNED`, solo una riga di commento dopo la tabella. Le opzioni della sequenza come `START WITH 100` vanno perse.  
Una tabella con più colonne serial o identity viene importata con più colonne a incremento automatico, e MySQL, MariaDB e SQL Server rifiutano una tabella del genere quando se ne esegue l’esportazione.

#### Chiavi primarie {#primary-keys}

Una chiave primaria aggiunta dopo la sua tabella, `ALTER TABLE t ADD [CONSTRAINT n] PRIMARY KEY (...)`, contrassegna le sue colonne come chiave primaria.  
`CLUSTERED` o `NONCLUSTERED` di SQL Server e `USING BTREE` di MySQL prima dell’elenco delle colonne vengono oltrepassati durante la lettura, quindi l’istruzione `ALTER TABLE [dbo].[Users] ADD CONSTRAINT [PK_Users] PRIMARY KEY CLUSTERED ([Id] ASC) WITH (...) ON [PRIMARY]` generata da SQL Server Management Studio imposta come chiave `Id`. Il `PRIMARY KEY NONCLUSTERED HASH (...)` di una tabella ottimizzata per la memoria non viene letto, né in `ALTER TABLE` né in `CREATE TABLE`.

#### Chiavi univoche e indici {#unique-keys-and-indexes}

Un `UNIQUE` su due o più colonne diventa un unico indice univoco, in qualunque forma sia scritto: `UNIQUE (a, b)`, `UNIQUE KEY n (a, b)`, `UNIQUE INDEX n (a, b)`, `CONSTRAINT n UNIQUE (a, b)`, l’`INDEX n UNIQUE (a, b)` inline di SQL Server e `ALTER TABLE t ADD [CONSTRAINT n] UNIQUE (a, b)`.  
L’indice prende il nome di indice della chiave, altrimenti il suo nome `CONSTRAINT`, altrimenti nessun nome, e mantiene l’ordinamento di ogni colonna. Un indice del genere è una [chiave alternativa](./table-related-functions.md#alternate-keys).  
Un `UNIQUE` su una sola colonna, in una qualsiasi di queste forme, imposta invece il flag Univoco su quella colonna e non aggiunge alcun indice, quindi il vincolo `UQ_<table name>_<column name>` scritto dall’esportazione torna come il flag da cui era stato scritto. Un `CREATE UNIQUE INDEX` su una sola colonna resta un indice univoco.

Un `ALTER TABLE` che aggiunge più chiavi alla volta, come quello che scrive phpMyAdmin, `ADD PRIMARY KEY (id), ADD UNIQUE KEY uq_a (a, b), ADD UNIQUE KEY uq_c (c)`, mantiene ogni chiave univoca che contiene: `uq_a` viene importata come indice univoco di nome `uq_a`, e `uq_c` come flag Univoco di `c`. Un nome `CONSTRAINT` dà il nome solo alla chiave della propria clausola. Vengono letti anche `ADD UNIQUE INDEX IF NOT EXISTS n (...)` di MariaDB e `ALTER TABLE t WITH CHECK ADD ...` e `WITH NOCHECK ADD ...` di SQL Server.  
`CREATE INDEX` e `CREATE UNIQUE INDEX` vengono letti con nomi qualificati come `public.t` e `[dbo].[t]`, con `CLUSTERED` e `NONCLUSTERED` di SQL Server, con `CONCURRENTLY`, `IF NOT EXISTS`, `ON ONLY` e `USING btree` di PostgreSQL, e anche senza alcun nome di indice. Il filegroup `ON [PRIMARY]` di SQL Server viene ignorato.  
Le opzioni della chiave come `NULLS NOT DISTINCT` o `USING BTREE` non vengono scambiate per il nome della chiave. Nell’elenco delle colonne di una chiave solo la prima parola indica la colonna, quindi `b DESC NULLS LAST`, `b text_pattern_ops` e `b COLLATE "C"` impostano tutti `b` come chiave, mantenendo `DESC` come suo ordinamento. Una lunghezza di prefisso come `email(191)` viene oltrepassata durante la lettura, ma una chiave con una parte costituita da un’espressione, come `lower(email)`, viene ignorata per intero.

Un indice univoco parziale, `CREATE UNIQUE INDEX ... WHERE ...` o l’`INDEX n UNIQUE (...) WHERE ...` inline di SQL Server, viene importato come indice semplice con lo stesso nome e le stesse colonne, perché una chiave univoca sull’intera tabella sarebbe più restrittiva di quella filtrata dichiarata dal file. Fa eccezione un filtro composto solo da test `IS NOT NULL` sulle colonne della chiave uniti da `AND`, il filtro di cui SQL Server ha bisogno per consentire a una colonna univoca di contenere più di un NULL: quella chiave resta univoca.  
Una chiave univoca che indica una colonna che la tabella non ha, come una colonna aggiunta con `ALTER TABLE ... ADD COLUMN`, viene scartata per intero anziché ridotta alle colonne esistenti. Un indice semplice mantiene le colonne esistenti.

SQL Developer di Oracle e `DBMS_METADATA` scrivono l’indice proprio di una chiave come un `CREATE UNIQUE INDEX` separato, con il nome della chiave oppure, per una chiave senza nome seguita da `USING INDEX`, con un nome di sistema come `SYS_C0012345`. L’importazione legge un indice del genere, e quello indicato da un `ADD CONSTRAINT ... USING INDEX`, come parte della sua chiave: una chiave univoca composta viene importata come un unico indice univoco, e una chiave primaria o una chiave univoca su una sola colonna come i flag della colonna, senza indice aggiuntivo. Una nuova esportazione verso Oracle crea quindi l’indice una sola volta.

Un’esportazione Schema SQL si reimporta con gli stessi flag Univoco e gli stessi indici per MySQL, MariaDB, MSSQL, Oracle, PostgreSQL e SQLite.  
Snowflake non ha indici secondari, quindi dalla sua esportazione tornano solo le chiavi univoche: una composta come indice univoco e una su una sola colonna come flag Univoco della colonna. Un’esportazione Databricks non dichiara alcuna univocità, quindi non ne torna nessuna.

#### Chiavi esterne {#foreign-keys}

Una chiave esterna diventa una relazione in queste forme di scrittura:

- Un `FOREIGN KEY (...) REFERENCES t (...)` a livello di tabella, con o senza `CONSTRAINT name`.
- `ALTER TABLE ... ADD [CONSTRAINT name] FOREIGN KEY (...) REFERENCES t (...)`, compresi gli `ALTER TABLE t WITH CHECK ADD ...` e `WITH NOCHECK ADD ...` generati da SQL Server Management Studio.
- Il `REFERENCES t (col)` inline di una colonna, come in `user_id INT REFERENCES users (id)`, e il `FOREIGN KEY REFERENCES t (col)` che SQL Server e Snowflake consentono in quella posizione. Un riferimento inline a più di una colonna viene ignorato.

Un `ALTER TABLE` produce al massimo una relazione, e solo quando la sua prima clausola aggiunge una chiave esterna: una clausola `FOREIGN KEY` dopo una clausola `ADD PRIMARY KEY` o `ADD UNIQUE` nella stessa istruzione non viene letta. Quando un’istruzione aggiunge più chiavi esterne, come quella che scrive phpMyAdmin, `ADD CONSTRAINT fk1 FOREIGN KEY ..., ADD CONSTRAINT fk2 FOREIGN KEY ...`, viene letta solo l’ultima.

`REFERENCES t` senza elenco di colonne punta alla chiave primaria di `t` quando questa è costituita da una sola colonna. Verso una chiave primaria composta, la chiave esterna viene ignorata.  
Una chiave esterna viene ignorata, e nessuna delle sue colonne viene contrassegnata come chiave esterna, quando non si trova nessuna delle sue colonne referenziate o quando le colonne trovate nelle due tabelle differiscono di numero, come quando una colonna manca solo in una delle due. Quando a entrambe le tabelle manca lo stesso numero delle sue colonne, le colonne trovate vengono accoppiate nell’ordine in cui sono scritte, e la relazione contiene solo quelle.  
Ogni relazione importata è `Zero N`, ed è identificante quando ciascuna delle sue colonne figlie è anche chiave primaria.

Le clausole `ON DELETE` e `ON UPDATE` di ogni chiave esterna diventano i valori `On Delete` e `On Update` della relazione: `NO ACTION`, `RESTRICT`, `CASCADE`, `SET NULL` o `SET DEFAULT`, senza distinzione tra maiuscole e minuscole e in entrambi gli ordini. Una chiave esterna senza di esse viene importata come `Not set`. Per impostarli nell’editor, vedere [Modifica delle relazioni](./relationship-editing.md#on-delete-and-on-update).  
L’elenco di colonne di PostgreSQL dopo `SET NULL` o `SET DEFAULT`, come in `ON DELETE SET NULL (a_id)`, viene oltrepassato durante la lettura: l’azione si applica all’intera chiave, e un `ON UPDATE` dopo l’elenco viene comunque letto. `MATCH FULL`, `MATCH PARTIAL` e `MATCH SIMPLE` vengono ignorati, e l’attributo di colonna `ON UPDATE CURRENT_TIMESTAMP` di MySQL non viene scambiato per un’azione.  
Un’esportazione Schema SQL si reimporta con le azioni che quel database scrive, quindi un’azione che tralascia, come `SET DEFAULT` su MySQL, qualsiasi `ON UPDATE` su Oracle o qualunque azione diversa da `NO ACTION` su Snowflake, torna come `Not set`.

#### Commenti {#comments}

I commenti di tabelle e colonne vengono importati dalle tre sintassi che il parser legge: l’opzione di tabella e l’attributo di colonna `COMMENT` usati da MySQL, MariaDB, Snowflake e Databricks, le istruzioni `COMMENT ON TABLE` e `COMMENT ON COLUMN` usate da PostgreSQL e Oracle, e la proprietà estesa `MS_Description` che SQL Server imposta con `EXEC sp_addextendedproperty`.  
Un commento che indica una tabella o una colonna non definita dal file viene ignorato.

Le chiamate di SQL Server vengono lette con argomenti denominati, come SQL Server Management Studio genera ogni commento (`@name=N'MS_Description', @value=N'...', ..., @level1type=N'TABLE', @level1name=N'Users'`), e con argomenti posizionali, come li scrive l’esportazione MSSQL dell’editor.  
Solo un `MS_Description` su una tabella, o su una delle sue colonne al livello 2, produce un commento. Un’altra proprietà, una vista, un indice o un vincolo non ne produce alcuno, e lo stesso vale per un commento passato in una variabile o costruito con `+`.

In un commento, come in qualsiasi testo tra virgolette, ad esempio un valore `DEFAULT` o un nome tra virgolette, un apice raddoppiato rappresenta un solo apice, come lo scrivono mysqldump e pg_dump: `'it''s'` viene letto come `it's`.  
Anche una barra rovesciata prima di un apice, come in `'it\'s'` scritto da MySQL e MariaDB, fa da escape per l’apice. Un apice del genere chiude comunque il testo quando è seguito da spazi vuoti, `,`, `;`, `)`, `]`, `:`, `|`, `+` o dalla fine del file, quindi `'C:\'`, `'C:\'::text` di pg_dump e `'C:\'+name` di T-SQL mantengono la barra rovesciata.  
Un valore `DEFAULT` mantiene le virgolette, e un apice al suo interno viene riscritto raddoppiato, qualunque sia l’escape usato dal file: `'it''s'`.  
Quando al momento dell’importazione il database del documento è Databricks, il testo tra apici singoli segue invece le regole di Spark: ogni barra rovesciata fa da escape per il carattere successivo, quindi `'C:\\dir'` viene letto come `C:\dir`, le sequenze di escape come `\n`, `\t` e `\u0041` vengono decodificate, e un valore `DEFAULT` viene mantenuto come `'it\'s'`.

Il modo in cui ciascun database scrive un commento in esportazione, e come vi applica l’escape a un apice, è descritto in [Commenti](./schema-sql.md#comments) nella pagina Schema SQL.  
Un’esportazione verso MySQL, MariaDB, PostgreSQL, Oracle, Snowflake o MSSQL si reimporta come gli stessi commenti di tabelle e colonne, apici compresi, salvo le righe vuote che un’esportazione Oracle omette. Un’esportazione Databricks, che applica l’escape a un apice e a una barra rovesciata con una barra rovesciata, si rilegge esattamente solo mentre Databricks è il database selezionato.  
I commenti non sopravvivono a un ciclo di esportazione e importazione con SQLite: SQLite li scrive come semplici righe `--`, che il parser non legge.  
Tranne che con SQLite, un nome logico che `Write logical names into empty comments` ha scritto in un commento vuoto si reimporta come commento di quella tabella o colonna, non come suo nome logico — vedere [Nomi logici come commenti](./schema-sql.md#logical-names-as-comments).

### GraphQL {#graphql}

È possibile importare un documento GraphQL SDL.  
Le definizioni dei tipi oggetto diventano tabelle, un blocco `extend type` si fonde con il tipo che estende e i campi delle interfacce vengono ereditati dai tipi che le implementano.  
Un campo il cui tipo è un’altra tabella diventa una relazione anziché una colonna, e una lista su entrambi i lati crea una tabella di associazione.  
Un campo singolare come `buyer: User` viene prima accoppiato con l’unico campo dell’altro tipo il cui nome termina con `By` seguito dal nome di quel campo, come `orderListByBuyer`, ignorando maiuscole/minuscole e trattini bassi; un campo numerato come `buyer2` viene accoppiato allo stesso modo senza il suo numero. È così che l’output GraphQL del Generatore di codice dà il nome ai campi quando due tabelle condividono più di una relazione o una tabella fa riferimento a sé stessa, quindi tale output si reimporta con tutte le relazioni.  
I tipi radice (`Query`, `Mutation`, `Subscription`), i tipi di introspezione e i wrapper di Relay, della federazione e di Hasura come `PageInfo`, `*Connection`, `*Edge` e `*_aggregate` vengono considerati rumore e ignorati.  
Le direttive `@id`, `@primaryKey`, `@unique`, `@autoincrement`, `@default`, `@map`, `@relation`, `@column`, `@table`, `@index` e `@db.*` vengono rispettate.  
Il nome del file deve terminare con `.graphql`, `.gql` o `.graphqls`. Un file Prisma `schema.prisma` non è un documento GraphQL e non può essere importato qui.

### DBML {#dbml}

È possibile importare un file DBML, il formato usato da dbdiagram.io e dbdocs.  
Vengono letti i blocchi `Table`, `TablePartial`, `Ref`, `Enum` e `TableGroup`. I blocchi `Project` e i blocchi `Note` autonomi vengono ignorati senza influire sulle tabelle circostanti.  
È accettata ogni forma di ref: la forma con i due punti `Ref:`, un ref con nome, la forma a blocco `Ref { }` e l’impostazione di colonna inline `[ref: > table.column]`.  
Un ref molti-a-molti `<>` crea una tabella di associazione che prende il nome da entrambi i lati.  
Le impostazioni `delete` e `update` di un ref autonomo diventano i valori `On Delete` e `On Update` della relazione, come in `Ref: users.id < posts.user_id [delete: cascade, update: set null]`. I valori sono `cascade`, `restrict`, `set null`, `set default` e `no action`, senza distinzione tra maiuscole e minuscole. Qualsiasi altro valore, o l’assenza dell’impostazione, viene importato come `Not set`, e le altre impostazioni come `color` vengono ignorate.  
L’impostazione inline `[ref: ...]` non porta azioni, e le impostazioni di un ref `<>` non vengono trasferite alla tabella di associazione. Quando la stessa chiave esterna è dichiarata sia inline sia come ref autonomo, viene mantenuta quella inline, senza azioni.  
L’impostazione `headercolor` di una tabella, come in `Table users [headercolor: #3498DB]`, diventa il suo colore quando il valore è un esadecimale `#rgb` o `#rrggbb` scritto senza virgolette. Qualsiasi altro valore viene scartato, e l’impostazione `headercolor` di un `TablePartial` non viene trasmessa alle tabelle che lo usano.  
Ogni `TableGroup` diventa un [gruppo di tabelle](./table-groups.md) che contiene le tabelle che elenca, una per riga, indicate come le indica un `Ref`. Il suo `[color: ...]` diventa il colore del gruppo con la stessa regola di `headercolor`, e la sua nota e le altre impostazioni vengono scartate. Una tabella elencata da due gruppi resta nel primo. Un gruppo rimasto senza tabelle non viene creato, sia che non ne elenchi nessuna dichiarata dal file, sia che elenchi solo tabelle già prese da un gruppo precedente. Il riquadro del gruppo viene adattato attorno alle sue tabelle ovunque vengano posizionate, e quando le tabelle vengono disposte in righe, le tabelle di un gruppo restano insieme.  
Il nome del file deve terminare con `.dbml`.

### AML {#aml}

È possibile importare un file AML (Azimutt Markup Language). Sono accettate sia la sintassi attuale sia la vecchia sintassi v1.  
Le entità diventano tabelle, e gli attributi annidati vengono appiattiti in un nome di colonna con punti come `settings.slug`.  
Gli attributi sono `NOT NULL` a meno che non siano contrassegnati come `nullable`, e i costrutti per cui l’editor non ha posto, come `check`, `type` e `tags`, vengono scartati anziché rifiutati. Un’entità contrassegnata come vista viene importata come una semplice tabella.  
La proprietà `color` di un’entità, come in `users {color: red}`, diventa il colore della sua tabella. I nomi di colore di AML, `red`, `orange`, `amber`, `yellow`, `lime`, `green`, `emerald`, `teal`, `cyan`, `sky`, `blue`, `indigo`, `violet`, `purple`, `fuchsia`, `pink`, `rose` e `gray`, vengono letti senza distinzione tra maiuscole e minuscole, tra virgolette o no, ciascuno come la tonalità 500 del colore Tailwind con quel nome, ad esempio `#ef4444` per `red`. Un esadecimale tra virgolette come `"#3498db"` viene mantenuto così com’è scritto; un `#3498db` senza virgolette non può essere letto, perché `#` inizia un commento AML. Qualsiasi altro valore, e un `color` su un attributo o su una relazione, viene scartato.  
Un’istruzione `rel` autonoma, o `fk` nella vecchia sintassi, mantiene le proprietà `onDelete` e `onUpdate` come valori `On Delete` e `On Update` della relazione, come in `rel posts(user_id) -> users(id) {onDelete: cascade, onUpdate: "set null"}`. I valori sono `cascade`, `restrict`, `set null`, `set default` e `no action`, tra virgolette o no, senza distinzione tra maiuscole e minuscole. Le altre proprietà vengono scartate.  
In una relazione inline come `user_id int -> users(id) {onDelete: cascade}`, le proprietà appartengono all’attributo, quindi vengono scartate e la relazione viene importata come `Not set`.  
Il nome del file deve terminare con `.aml`.

GraphQL, DBML e AML sono formati bidirezionali: ciascuno è anche una destinazione del [Generatore di codice](./code-generator.md).  
DBML e AML trasportano in entrambe le direzioni ON DELETE e ON UPDATE di ogni relazione — vedere [Generatore di codice](./code-generator.md#on-delete-and-on-update). GraphQL non trasporta né l’uno né l’altro, quindi un’importazione GraphQL li lascia entrambi su `Not set`.  
DBML trasporta in entrambe le direzioni anche i colori delle tabelle, senza l’eventuale trasparenza, e ogni gruppo di tabelle che contiene una tabella. Un gruppo senza nome torna come `group_1`, `group_2` e così via, e un nome di gruppo ripetuto torna con l’aggiunta di `_2`, `_3` e così via. AML trasporta il colore di una tabella solo come il più vicino dei suoi nomi di colore, quindi `#FF8800` viene scritto come `orange` e torna come `#f97316`, e non trasporta gruppi. GraphQL non trasporta né colori né gruppi.  
Nessuno dei tre trasporta, in nessuna delle due direzioni, i nomi logici, i collegamenti ai domini o i dizionari: il Generatore di codice scrive il nome fisico e il tipo di dati di ogni tabella e colonna, mai un nome logico o un dominio.

## Esportazione {#exporting}

Il sottomenu `Export` del menu contestuale dell’area di disegno ha tre voci:

- json: Salva il diagramma così come lo contiene il suo file, come `.erd.json`: le tabelle con le loro colonne e i loro indici, le relazioni, i memo e i gruppi di tabelle, i nomi logici e i collegamenti delle colonne ai domini, le parole, i termini e i domini della scheda [Dizionario](./dictionary.md), e le impostazioni, ciascuna [impostazione bloccata](./settings.md#lock) al suo valore bloccato. Ciò che non contiene nulla, come un testo vuoto o una riga di dizionario vuota, viene tralasciato — vedere [Forma di archiviazione e valore di runtime](../../api/advanced/schema.md#storage-form-and-runtime-value).
- Schema SQL: Apre la scheda [Schema SQL](./schema-sql.md#saving-or-copying-the-sql) con il pannello opzioni aperto e il focus sul pulsante `Save file`, così premendo `Enter` si salva come `.sql` il codice SQL mostrato dalla scheda. Fino ad allora non viene salvato nulla.
- Immagine: Apre la finestra di dialogo `Export image`, che salva il diagramma come `.png` o `.svg`, oppure lo copia negli Appunti come PNG — vedere [Immagine](#image).

Tutte e tre funzionano in un editor di sola lettura.  
Il comando `Export CSV` proprio della scheda Dizionario, che non si trova in questo sottomenu, salva il suo foglio `Domains`, `Words` o `Terms` come file CSV. A differenza di queste tre voci, non viene offerto in un editor di sola lettura — vedere [Importare ed esportare file CSV](./dictionary.md#importing-and-exporting-csv).

Schema SQL scrive ON DELETE e ON UPDATE di ogni relazione dopo il suo `REFERENCES`, prima ON DELETE. `Not set` non scrive nulla, e un’azione che il database selezionato non accetta viene tralasciata. Per sapere quale database accetta quale azione, vedere [Modifica delle relazioni](./relationship-editing.md#on-delete-and-on-update).

Ogni file esportato si chiama `<database name>-<timestamp>` seguito dalla sua estensione, con il timestamp nell’ora locale nel formato `yyyy-MM-dd'T'HH_mm_ss` — ad esempio `my-schema-2026-08-29T04_05_06.erd.json`. Un nome del database vuoto viene sostituito da `unnamed`.  
I pulsanti `Save file` della scheda Schema SQL e del [Generatore di codice](./code-generator.md) danno il nome ai file allo stesso modo, e così fa `Export CSV`, che aggiunge il foglio dopo il timestamp: `-words.csv`, `-terms.csv` o `-domains.csv`. Un’immagine prende il nome del database com’era all’apertura della finestra di dialogo.

`Import`, `Import and Add` ed `Export` sono disponibili anche dalla [Ricerca rapida](./quick-search.md) nella scheda ERD, con le stesse voci del menu contestuale dell’area di disegno.

In Obsidian non compare alcuna finestra di dialogo di download o di salvataggio: il file viene scritto nel vault, dove Obsidian mette i nuovi allegati per quel diagramma, e un avviso ne indica il percorso.  
I caratteri che Obsidian non consente in un nome di file, `\ / : * ? " < > |`, vengono sostituiti con `-`.  
L’esplora file di Obsidian elenca un file `.erd.json` o `.sql` esportato solo mentre l’opzione Settings → Files and links → Detect all file extensions è attiva.

### Immagine {#image}

`Export` ▸ `Image`, dal menu contestuale dell’area di disegno o dalla Ricerca rapida, apre la finestra di dialogo `Export image`: un’anteprima dell’immagine accanto alle sue opzioni. Il pannello [Esplora](./explorer.md#dialogs-beside-it), se è aperto, resta aperto sotto l’area oscurata.

![Apertura di Export > Image, disattivazione della modalità scura e dello sfondo, scelta di 3x e copia dell’immagine negli Appunti](/img/demo-export.webp)

- `Background`: Attivo per impostazione predefinita. Se disattivato, lascia trasparente l’area di disegno.
- `Dark mode`: All’inizio corrisponde all’aspetto dell’editor. Finché corrisponde all’aspetto sullo schermo, l’immagine prende i colori propri dell’area di disegno, comprese le modifiche del [generatore di temi](./language-and-theme.md); l’altro aspetto usa il tema preimpostato con la stessa tonalità di grigio e lo stesso colore principale.
- `Scale`: `1x`, `2x` o `3x`, con `2x` selezionato per impostazione predefinita. Imposta solo la dimensione del PNG e della copia negli Appunti, e la riga sottostante indica tale dimensione, come `PNG <width> × <height> px`.

Le scelte vengono mantenute fino alla chiusura dell’editor e non vengono mai salvate nel documento. L’anteprima viene disegnata nello stesso modo dell’immagine, e viene ridisegnata quando cambia `Background` o `Dark mode`.

L’immagine contiene il diagramma com’era all’apertura della finestra di dialogo; per includere le modifiche successive, chiudere e riaprire la finestra di dialogo. Le sue tabelle e colonne sono indicate nella vista che l’editor mostrava in quel momento, anche una vista attivata solo sullo schermo dell’utente mentre il blocco `Name View` ne mantiene un’altra nel file — vedere [Oltre l’area di disegno](./logical-names.md#beyond-the-canvas). I colori che i [controlli dei dizionari](./dictionary.md#marks-on-the-canvas) danno ai nomi nell’area di disegno non vengono disegnati. Contiene l’intero diagramma, per quanto lontano sia stata fatta scorrere la vista, ritagliato su ciò che il diagramma disegna più un margine, ed è sempre disegnata al 100%, qualunque sia lo zoom mostrato dall’editor, così ogni tabella viene disegnata per intero. Ciò che le [Opzioni di visualizzazione](./table-related-functions.md#table-view-options) nascondono — relazioni, le loro etichette ON DELETE e ON UPDATE, gruppi di tabelle o memo — non viene disegnato e non occupa spazio, e i gruppi di tabelle vengono disegnati dietro a tutto il resto.

Tre pulsanti scrivono l’immagine, e ciascuno lascia aperta la finestra di dialogo:

- `PNG`: Salva un `.png` delle dimensioni del diagramma al 100% moltiplicate per il valore di `Scale`. Un PNG troppo grande per un canvas del browser viene scritto a risoluzione ridotta invece di fallire: la finestra di dialogo lo segnala in anticipo con `Reduced from <width> × <height> px, past what a browser canvas can hold`, e un avviso con il testo `Exported at a reduced resolution` lo comunica dopo.
- `SVG`: Salva un `.svg` delle dimensioni del diagramma al 100%, qualunque sia il valore di `Scale`, e mai ridotto. Il testo resta testo e i font sono indicati per nome anziché incorporati, quindi un visualizzatore privo del font dell’editor ne usa un altro. Le ombre vengono omesse.
- `Copy to clipboard`: Mette negli Appunti un PNG al valore di `Scale` scelto, ridotto come un PNG salvato quando un canvas del browser non può contenerlo. Conferma con `Copied the image to the clipboard`, o con `Copied at a reduced resolution` quando l’immagine è stata ridotta. Se la copia non riesce, perché il browser o l’host nega l’accesso agli Appunti o non è stato possibile disegnare l’immagine, `Couldn't copy the image` suggerisce invece di salvare un PNG.

L’immagine viene disegnata in un worker in background, se l’host ne esegue uno, così nel frattempo l’editor resta utilizzabile. Un avviso con il testo `Exporting PNG`, `Exporting SVG` o `Copying image` compare quando l’operazione richiede più di un istante, e un errore viene segnalato come `Couldn't export the PNG` o `Couldn't export the SVG`. Chiudere la finestra di dialogo mentre un file è ancora in fase di disegno non impedisce il salvataggio di quel file.

Il pulsante `PNG` ha il focus all’apertura della finestra di dialogo, e lo spostamento con `Tab` resta all’interno della finestra. `Escape`, il pulsante `x` o un clic sull’area oscurata intorno alla finestra la chiude.  
Mentre è aperta, i tasti di scelta rapida dell’area di disegno, compresi quelli per annullare e ripetere, e le operazioni di copia e incolla non hanno effetto. `Ctrl + K` (Windows/Linux) o `⌘ + K` (Mac) la chiude e apre la Ricerca rapida. `Ctrl + F` (Windows/Linux) o `⌘ + F` (Mac) la chiude e mette il punto di inserimento nel campo Trova del pannello [Esplora](./explorer.md#opening-and-closing), aprendo il pannello Esplora se è chiuso, senza mai chiuderlo. In un editor troppo stretto per mostrare il pannello Esplora, la combinazione chiude comunque la finestra di dialogo, ma mostra una notifica anziché spostare il punto di inserimento.
