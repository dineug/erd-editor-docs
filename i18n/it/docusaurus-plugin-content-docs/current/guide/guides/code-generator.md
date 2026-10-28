---
sidebar_position: 13
description: Generare codice per ventidue destinazioni a partire dal diagramma, scegliere linguaggio, database, stile dei nomi e delimitatore nel pannello opzioni, vedere quali destinazioni scrivono le azioni ON DELETE e ON UPDATE di una relazione e salvare o copiare il risultato.
---

# Generatore di codice

Passare alla scheda `Code Generator` nella barra degli strumenti. La scheda mostra a sinistra il codice dell’intero documento e, alla sua destra, un pannello opzioni intitolato `Code Generator`, in cui si scelgono il linguaggio, il database, gli stili dei nomi e, per alcune destinazioni, il delimitatore.  
Il pannello si apre da solo, a meno che l’editor non sia più stretto di 640 px alla prima apertura della scheda. `Hide options` in cima al pannello lo comprime e `Show options` in alto a destra nel codice lo riapre. Resta aperto o compresso anche cambiando scheda, finché l’editor resta aperto, indipendentemente dal pannello della scheda Schema SQL, e non viene mai salvato nel file.

Fare clic con il pulsante destro sul codice per aprirne il menu contestuale: `Language`, `Database`, `Table Name Case`, `Column Name Case`, `Bracket` (solo per `Doctrine`, `JPA` e `SeaORM`), ciascuno con un sottomenu che mostra il segno di spunta sul valore corrente, poi `Options panel`, che comprime o apre il pannello e ha il segno di spunta mentre il pannello è visibile, e `Save file`.  
Mentre questa scheda è aperta, la [Ricerca rapida](./quick-search.md) offre `Database`, `Bracket` (solo per `Doctrine`, `JPA` e `SeaORM`), `Language`, `Table Name Case`, `Column Name Case` e `Code Generator: Options panel`, che comprime o apre il pannello.

![Scelta di TypeScript e poi di Rust dal menu contestuale del codice, passaggio dei nomi delle colonne a Snake nel pannello opzioni e copia del codice](/img/demo-code-generator.webp)

La stessa vista del codice è anche la scheda `Code Generator` di [Proprietà tabella](./table-related-functions.md#table-properties), dove genera il codice di quella sola tabella anziché dell’intero documento. Lì non ha un pannello opzioni, e il suo menu contestuale cambia le stesse impostazioni ma non ha `Options panel` né `Save file`.  
Dove il codice dell’intero documento inizia con delle importazioni o un’intestazione, il codice della singola tabella inizia con quelle che servono a quella tabella, come `<?php` per `PHP`, `import Foundation` per `Swift` o `$schema` per `JSON Schema`.

Il codice viene scritto all’apertura della scheda e di nuovo ogni volta che cambia il linguaggio, il database, uno stile dei nomi o il delimitatore. Una modifica apportata al diagramma mentre la scheda è aperta, come quella di un collaboratore o di un agente di programmazione, compare quando si esce dalla scheda e vi si ritorna, o quando cambia una di queste impostazioni.

## Pannello opzioni {#options-panel}

Sotto l’etichetta `Saved in the document`, il pannello elenca `Language`, `Database`, `Table Name Case` e `Column Name Case`, seguiti da `Bracket` mentre il linguaggio è `Doctrine`, `JPA` o `SeaORM`. Ciascuno è un elenco a discesa, e una modifica riscrive subito il codice.  
Quando il linguaggio selezionato ignora `Database` o gli stili dei nomi, questi restano nel pannello, attenuati, con sotto una nota come `Not used by DBML`, e si possono comunque modificare.  
`Save file` e `Copy` si trovano in fondo al pannello — vedere [Salvare o copiare il risultato](#saving-or-copying-the-result).

Sono le impostazioni proprie del diagramma, le stesse che modificano anche il menu contestuale e la Ricerca rapida. `Database` viene salvato nel file come qualsiasi modifica.  
`Language`, `Table Name Case`, `Column Name Case` e `Bracket` vengono salvati solo finché il rispettivo blocco nella scheda Impostazioni è disattivato (`Bracket Type` per `Bracket`), e un nuovo diagramma ha tutti i blocchi attivi. Mentre un blocco è attivo, una modifica riscrive il codice sullo schermo, ma il file mantiene il valore bloccato e il diagramma si riapre con quel valore. Il pannello non mostra alcun segno di un blocco; per conservare una scelta nel file, disattivarne il blocco — vedere [Blocco](./settings.md#lock).  
In un editor di sola lettura la didascalia riporta invece `This window only`, poiché una modifica lì raggiunge solo quella finestra — vedere [Editor di sola lettura](#read-only-editors).

## Linguaggio {#language}

Sono supportate ventidue destinazioni, elencate in tre gruppi — linguaggi, ORM e poi schemi — ciascuno in ordine alfabetico. L’elenco del pannello e il menu contestuale tracciano una linea tra i gruppi, ma non ne nominano nessuno:

| Destinazione | Gruppo | Relazioni | Indici | ON DELETE / ON UPDATE | Salvato come |
| --- | --- | --- | --- | --- | --- |
| `C#` | Linguaggio | — | — | — | `.cs` |
| `Go` | Linguaggio | — | — | — | `.go` |
| `Java` | Linguaggio | — | — | — | `.java` |
| `Kotlin` | Linguaggio | — | — | — | `.kt` |
| `PHP` | Linguaggio | — | — | — | `.php` |
| `Rust` | Linguaggio | — | — | — | `.rs` |
| `Scala` | Linguaggio | — | — | — | `.scala` |
| `Swift` | Linguaggio | — | — | — | `.swift` |
| `TypeScript` | Linguaggio | — | — | — | `.ts` |
| `Doctrine` | ORM | ✓ | ✓ | Solo ON DELETE | `.php` |
| `Drizzle` | ORM | ✓ | ✓ | ✓ | `.ts` |
| `JPA` | ORM | ✓ | — | — | `.java` |
| `SeaORM` | ORM | ✓ | Solo univoci | ✓ | `.rs` |
| `Sequelize` | ORM | ✓ | ✓ | ✓ | `.ts` |
| `SQLAlchemy` | ORM | ✓ | ✓ | ✓ | `.py` |
| `TypeORM` | ORM | ✓ | ✓ | ✓ | `.ts` |
| `AML` | Schema | ✓ | ✓ | ✓ | `.aml` |
| `DBML` | Schema | ✓ | ✓ | ✓ | `.dbml` |
| `GraphQL` | Schema | ✓ | — | — | `.graphql` |
| `JSON Schema` | Schema | — | — | — | `.json` |
| `Mermaid` | Schema | ✓ | — | — | `.mmd` |
| `Zod` | Schema | — | — | — | `.ts` |

Il valore predefinito è `GraphQL`. Ogni destinazione produce le colonne; i segni ✓ indicano cos’altro produce.  
Le tabelle vengono prodotte in ordine di nome anziché nell’ordine in cui si trovano nell’area di disegno, e gli indici sono quelli elencati sotto `Indexes` in [Proprietà tabella](./table-related-functions.md#indexes), non le righe `Keys` sopra di essi. `SeaORM` scrive solo quelli univoci, e `Mermaid` contrassegna una colonna univoca con `UK` ma non scrive alcun indice.  
Tutte le destinazioni tranne `Java`, `AML`, `DBML` e `Mermaid` scrivono una colonna chiave primaria come non null, che su di essa sia impostato `Not Null` o meno. `Java` non indica per alcuna colonna se ammetta o meno valori null, e `AML`, `DBML` e `Mermaid` mantengono il flag come lo riporta il diagramma.

Cosa scrivono alcune delle destinazioni:

- `PHP`: semplici classi con proprietà pubbliche tipizzate, che iniziano con `<?php` e `declare(strict_types=1);`.
- `Doctrine`: entità Doctrine ORM 3 con attributi, per DBAL 4.2 o successiva, ogni colonna con il suo tipo DBAL e le opzioni per il database selezionato.
- `Rust`: una `pub struct` per tabella, con i tipi scritti con il percorso completo, come `chrono::NaiveDateTime` o `rust_decimal::Decimal`, senza alcuna riga `use`.
- `SeaORM`: entità SeaORM 2.0 nel formato dense, con un `pub mod` per ogni tabella, così l’intero testo si compila come un unico file.
- `Swift`: una struct `Codable`, `Hashable`, `Sendable` per tabella, che richiede Swift 6.1 o successiva.
- `TypeScript`: una `export interface` per tabella che descrive la riga come JSON, come fa lo schema `Zod` — una data o un’ora è una `string`, e una colonna che ammette valori null è `T | null`.
- `Zod`: uno schema di riga Zod 4 per tabella e il tipo da esso inferito, senza schema di inserimento né relazioni.
- `JSON Schema`: un unico documento JSON Schema draft 2020-12, con uno schema di riga per tabella sotto `$defs`.
- `Mermaid`: un `erDiagram`, il tipo di diagramma che GitHub visualizza, in cui ogni tabella è un’entità che elenca tutte le colonne con il loro tipo e l’eventuale indicatore `PK`, `FK` o `UK`, e ogni relazione è una linea tra le sue due tabelle.

`AML`, `DBML` e `GraphQL` sono formati bidirezionali: ciascuno può anche essere importato. Vedere [Importare o esportare file](./file-import-export.md). Gli altri schemi, `JSON Schema`, `Mermaid` e `Zod`, sono solo di output.  
`DBML` scrive il colore di ogni tabella come `headercolor` e, nel codice dell’intero documento, dopo i `Ref` un blocco `TableGroup` per ogni [gruppo di tabelle](./table-groups.md) che contiene una tabella. `AML` scrive il colore di una tabella come il più vicino tra i nomi di colore di AML.

## ON DELETE e ON UPDATE {#on-delete-and-on-update}

Le azioni ON DELETE e ON UPDATE di una relazione si impostano dal suo menu contestuale — vedere [ON DELETE e ON UPDATE](./relationship-editing.md#on-delete-and-on-update).  
Le destinazioni con un ✓ nella colonna `ON DELETE / ON UPDATE` della tabella in [Linguaggio](#language) scrivono le azioni che una relazione imposta; un’azione lasciata a `Not set` non scrive nulla.  
Quali azioni mantengano le destinazioni ORM dipende dal database selezionato, mentre `AML` e `DBML` le mantengono tutte — vedere [Database](#database).

- `Doctrine` scrive solo ON DELETE, poiché Doctrine non ha ON UPDATE. Aggiunge `onDelete: 'CASCADE'` a ogni `#[ORM\JoinColumn]` del `ManyToOne` o `OneToOne` del lato proprietario, come `#[ORM\JoinColumn(name: 'user_id', referencedColumnName: 'id', nullable: false, onDelete: 'CASCADE')]`, e nulla sul `OneToMany` o `OneToOne` del lato inverso. Una relazione verso una colonna univoca che non è la chiave primaria resta sotto forma di semplici colonne, che Doctrine mappa senza un’associazione, quindi non scrive alcuna azione.
- `Drizzle` le scrive in minuscolo. Su `.references()` sono opzioni, come `{ onDelete: "cascade", onUpdate: "set null" }`; su un `foreignKey()`, usato per una chiave a più colonne, sono concatenate, come `.onDelete("restrict").onUpdate("no action")`.
- `SeaORM` le scrive sulla relazione `belongs_to` della tabella figlia, prima ON UPDATE, con i nomi di SeaORM `NoAction`, `Cascade`, `SetNull`, `SetDefault` e `Restrict`, come `on_update = "Cascade", on_delete = "SetNull"`. Il `has_one` o `has_many` della tabella padre non ne riceve nessuna.
- `Sequelize` scrive le voci `onDelete: "CASCADE"` e `onUpdate` in entrambe le chiamate di associazione: `hasMany` o `hasOne`, e `belongsTo`. Una chiave a più colonne non riceve chiamate di associazione, quindi `Sequelize` non scrive azioni per essa.
- `SQLAlchemy` passa gli argomenti `ondelete="CASCADE"` e `onupdate` a `ForeignKey()` per una chiave a una colonna, e a `ForeignKeyConstraint()` per una chiave a più colonne.
- `TypeORM` scrive le opzioni `onDelete: "CASCADE"` e `onUpdate` sul `@ManyToOne` o `@OneToOne` del lato proprietario, mai sul lato inverso. Omette sempre `SET DEFAULT`, perché TypeORM lo scriverebbe come `DEFAULT`, che nessun database accetta.
- `DBML` aggiunge delle impostazioni al `Ref`, come `[delete: set null, update: no action]`.
- `AML` scrive una relazione che ha un’azione come istruzione `rel` autonoma con proprietà, come `{onDelete: cascade, onUpdate: "set null"}`, anziché in linea sulla sua colonna.

`JPA` non ne scrive nessuna: JPA puro non ha un’opzione per esse, e il generatore non usa `@OnDelete` di Hibernate. Nemmeno `Mermaid` ne scrive, poiché una linea di un `erDiagram` non ha spazio per esse.  
Nella scheda `Code Generator` di Proprietà tabella, che mostra una sola tabella, `DBML` non scrive alcun `Ref` e `AML` nessuna istruzione `rel`, quindi lì nessuno dei due mostra le azioni; `AML` mantiene in linea sulla sua colonna una relazione a una colonna che ha delle azioni, come fa con una che non ne ha. Lì `Mermaid` non scrive affatto linee di relazione. `Doctrine` e `SeaORM` vi scrivono la stessa entità dell’intero documento, azioni comprese.

## Stile dei nomi {#name-case}

`Table Name Case` e `Column Name Case` supportano ciascuno `Pascal`, `Camel`, `Snake` e `None`.  
I valori predefiniti sono `Pascal` per i nomi delle tabelle e `Camel` per i nomi delle colonne. `None` produce un nome così com’è scritto nel diagramma.  
Con qualsiasi stile, un nome riservato dal linguaggio della destinazione viene sottoposto a escape dove quel linguaggio lo consente, come `@class` in `C#` o `r#type` in `Rust`, e rinominato dove non lo consente, come `class_` in `Java`.

`AML`, `DBML` e `Mermaid` ignorano entrambe le impostazioni e producono sempre i nomi del diagramma.  
Anche `SeaORM` le ignora: assegna a campi e moduli nomi in snake case, la forma che SeaORM rilegge, e indica i nomi memorizzati in `table_name` e, dove differiscono, in `column_name`.  
Per queste quattro destinazioni il pannello attenua entrambi gli elenchi, con sotto la nota `Not used by`.

Ogni destinazione scrive i nomi fisici, qualunque cosa mostri la [Visualizzazione nomi](./logical-names.md#name-view).  
Nessuna scrive un nome logico, nemmeno in un commento vuoto: questa scheda non ha un equivalente dell’opzione [`Write logical names into empty comments`](./schema-sql.md#logical-names-as-comments) della scheda Schema SQL.  
Nessuna scrive nemmeno un dominio: una colonna collegata a un dominio viene scritta con il suo tipo di dati, come ogni altra colonna.

## Database {#database}

I tipi di dati vengono risolti in base al database selezionato — vedere [Database](./table-related-functions.md#databases).  
Se lo si sceglie in questa scheda dall’elenco `Database` del pannello, da `Database` nel menu contestuale o dalla Ricerca rapida, il codice viene riscritto subito. È l’unica impostazione del database del diagramma, la stessa che impostano il menu contestuale dell’area di disegno e la scheda [Schema SQL](./schema-sql.md), quindi una modifica fatta qui compare anche lì.  
`Drizzle` prende il proprio dialetto dalla stessa impostazione: `pgTable` per PostgreSQL, `mysqlTable` per MySQL e MariaDB, `sqliteTable` per SQLite e `pgTable` per ogni altro database.  
`SeaORM` scrive un `column_type` dove altrimenti SeaORM creerebbe un tipo di colonna diverso su PostgreSQL, MySQL, MariaDB o SQLite, e nessuno su MSSQL, Oracle, Snowflake o Databricks, per i quali SeaORM non ha un backend.

Il database selezionato determina anche quali azioni ON DELETE e ON UPDATE scrivono le destinazioni ORM.  
`Doctrine`, `SeaORM`, `Sequelize`, `SQLAlchemy` e `TypeORM` omettono qualsiasi azione omessa dallo Schema SQL di quel database, come `SET DEFAULT` su MySQL e MariaDB, `RESTRICT` su MSSQL o tutte le azioni tranne `NO ACTION` su Snowflake e Databricks, in modo che si applichi l’azione predefinita del database. L’elenco completo è in [ON DELETE e ON UPDATE](./relationship-editing.md#on-delete-and-on-update).  
`Drizzle` segue invece il dialetto che scrive: il codice `mysqlTable` omette `SET DEFAULT`, mentre il codice `pgTable` e `sqliteTable` mantiene tutte le azioni, compreso il codice `pgTable` che scrive per MSSQL, Oracle, Snowflake e Databricks.

`AML`, `DBML` e `Mermaid` fanno eccezione: producono ogni tipo di dati così com’è scritto nel diagramma, quindi l’impostazione del database non ne cambia l’output, e per loro il pannello attenua `Database`. `AML` e `DBML` scrivono tutte le azioni che una relazione imposta, e `Mermaid` non ne scrive nessuna.

## Delimitatore {#bracket}

`Bracket` è disponibile nel pannello, nel menu contestuale e nella Ricerca rapida solo mentre il linguaggio è `Doctrine`, `JPA` o `SeaORM`.  
È la stessa impostazione del delimitatore della scheda Schema SQL — vedere [Schema SQL](./schema-sql.md#database-and-bracket) — quindi una modifica fatta qui cambia anche il modo in cui Schema SQL delimita i nomi. Offre `SingleQuote`, `DoubleQuote`, `Backtick` e `None`, ed è inizialmente impostato su `None`.

- `Doctrine`: con qualsiasi delimitatore tranne `None`, ogni nome di tabella, colonna e colonna di join viene racchiuso tra apici inversi, che è il modo in cui Doctrine contrassegna un nome da delimitare, come ``#[ORM\Table(name: '`order`')]``. Con `None` lo è solo un nome che ne ha bisogno: una parola riservata da un database, un nome che non è un semplice identificatore ASCII o un nome digitato tra virgolette.
- `JPA`: con qualsiasi delimitatore tranne `None`, un nome di tabella che è una parola riservata viene delimitato all’interno di `@Table`, come `@Table(name = "\"user\"")`. Con `None` viene lasciato senza delimitatori, come lo lascia Schema SQL.
- `SeaORM`: con `None`, i nomi vengono scritti come li memorizza il database: un nome di tabella con un punto viene diviso in `schema_name` e `table_name`, e su PostgreSQL un nome non delimitato viene convertito in minuscolo. Con qualsiasi altro delimitatore un nome viene mantenuto intero, così com’è scritto.

## Salvare o copiare il risultato {#saving-or-copying-the-result}

`Save file`, in fondo al pannello opzioni o nel menu contestuale, salva come file il codice mostrato.  
Il file viene denominato come ogni esportazione, `<database name>-<timestamp>`, seguito dall’estensione indicata nella tabella in [Linguaggio](#language), come `shop-2026-10-12T04_05_06.ts`, e va dove va ogni esportazione nell’host in uso — vedere [Esportazione](./file-import-export.md#exporting). `Java` e `JPA` mettono tutte le classi in un unico file `.java`, come le mostra la scheda.  
Il menu Esporta non ha una voce per il Generatore di codice, e la scheda `Code Generator` di Proprietà tabella non può salvare un file.

Per copiare il codice, fare clic su `Copy` in fondo al pannello, oppure passare il puntatore sul codice e fare clic sul pulsante di copia in alto a destra, l’unico modo in Proprietà tabella.  
Lo conferma per due secondi la notifica `Copied!` con un segno di spunta. Se il browser o l’host rifiuta l’accesso agli Appunti, lo segnala invece per cinque secondi la notifica `Couldn't copy to the clipboard` con un simbolo di avviso. Una nuova copia sostituisce la notifica anziché aggiungerne un’altra.  
Il testo è anche selezionabile, quindi è possibile prenderne solo la parte che serve.

## Editor di sola lettura {#read-only-editors}

In un editor [`readonly`](../../api/erd-editor-element.md#readonly) gli elenchi del pannello, il menu contestuale e la Ricerca rapida cambiano ancora `Language`, `Database`, `Table Name Case`, `Column Name Case` e `Bracket`, ma solo in quella finestra, quindi il pannello li indica con `This window only` anziché con `Saved in the document`.  
Una modifica riscrive il codice su quello schermo e non viene salvata nel file, condivisa con i collaboratori né registrata per l’annullamento, qualunque sia il loro blocco, e una modifica di un collaboratore a un’impostazione che avete scelto lascia sullo schermo la vostra scelta. `Database` e `Bracket` sono anche le impostazioni della scheda Schema SQL, quindi una scelta fatta qui compare lì nella stessa finestra — vedere [Editor di sola lettura](./schema-sql.md#read-only-editors).  
Quando l’editor torna modificabile, tornano le impostazioni del documento e il codice viene scritto per esse.  
`Save file` e `Copy` salvano e copiano il codice mostrato.
