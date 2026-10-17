---
sidebar_position: 12
description: Generați cod pentru douăzeci și două de ținte din diagramă, alegeți limbajul, baza de date, stilul de denumire și delimitatorul în panoul de opțiuni, vedeți care ținte scriu acțiunile ON DELETE și ON UPDATE ale unei relații și salvați sau copiați rezultatul.
---

# Generator de cod

Treceți la fila `Code Generator` din bara de instrumente. Fila afișează în stânga codul întregului document, iar în dreapta acestuia un panou de opțiuni cu titlul `Code Generator`, în care alegeți limbajul, baza de date, stilurile de denumire și, pentru unele ținte, delimitatorul.  
Panoul se deschide singur, cu excepția cazului în care editorul este mai îngust de 640 px când fila se deschide prima dată. Butonul `Hide options` din partea de sus a panoului îl restrânge, iar butonul `Show options` din dreapta sus a codului îl readuce. Panoul rămâne deschis sau restrâns la schimbarea filelor cât timp editorul este deschis, independent de panoul filei Schemă SQL, și nu se salvează niciodată în fișier.

Faceți clic dreapta pe cod pentru a-i deschide meniul contextual: `Language`, `Database`, `Table Name Case`, `Column Name Case`, `Bracket` (doar pentru `Doctrine`, `JPA` și `SeaORM`), fiecare cu un submeniu care bifează valoarea curentă, apoi `Options panel`, care restrânge sau deschide panoul și este bifat cât timp acesta este afișat, și `Save file`.  
Cât timp această filă este deschisă, [căutarea rapidă](./quick-search.md) oferă `Database`, `Bracket` (doar pentru `Doctrine`, `JPA` și `SeaORM`), `Language`, `Table Name Case`, `Column Name Case` și `Code Generator: Options panel`, care restrânge sau deschide panoul.

![Alegerea limbajului TypeScript, apoi Rust, din meniul contextual al codului, trecerea numelor de coloane la Snake în panoul de opțiuni și copierea codului](/img/demo-code-generator.webp)

Aceeași vizualizare a codului este și fila `Code Generator` a panoului [Proprietăți tabel](./table-related-functions.md#table-properties), unde generează cod doar pentru acel tabel, în locul întregului document. Acolo nu are panou de opțiuni, iar meniul ei contextual schimbă aceleași setări, dar nu are nici `Options panel`, nici `Save file`.  
Acolo unde codul întregului document începe cu importuri sau cu un antet, codul unui singur tabel începe cu cele de care are nevoie acel tabel, de exemplu `<?php` pentru `PHP`, `import Foundation` pentru `Swift` sau `$schema` pentru `JSON Schema`.

Codul este scris când fila se deschide și din nou de fiecare dată când se schimbă limbajul, baza de date, un stil de denumire sau delimitatorul. O editare a diagramei făcută cât timp fila este deschisă, de exemplu de un colaborator sau de un agent de programare, apare după ce părăsiți fila și reveniți sau după ce se schimbă una dintre aceste setări.

## Panoul de opțiuni {#options-panel}

Sub titlul `Saved in the document`, panoul listează `Language`, `Database`, `Table Name Case` și `Column Name Case`, urmate de `Bracket` cât timp limbajul este `Doctrine`, `JPA` sau `SeaORM`. Fiecare este o listă derulantă, iar o modificare rescrie imediat codul.  
Când limbajul selectat ignoră `Database` sau stilurile de denumire, acestea rămân în panou, estompate, cu o mențiune sub ele, de exemplu `Not used by DBML`, și pot fi totuși modificate.  
Butoanele `Save file` și `Copy` se află în partea de jos a panoului (consultați [Salvarea sau copierea rezultatului](#saving-or-copying-the-result)).

Acestea sunt setările proprii ale diagramei, aceleași pe care le schimbă și meniul contextual, și căutarea rapidă. Opțiunea `Database` se salvează în fișier ca orice editare.  
Opțiunile `Language`, `Table Name Case`, `Column Name Case` și `Bracket` se salvează doar cât timp blocarea lor din fila Setări este dezactivată (`Bracket Type` pentru `Bracket`), iar o diagramă nouă are toate blocările activate. Cât timp o blocare este activată, o modificare rescrie codul de pe ecran, dar fișierul păstrează valoarea blocată, iar diagrama se redeschide cu ea. Panoul nu arată niciun semn al blocării; pentru a păstra o alegere în fișier, dezactivați-i blocarea (consultați [Blocare](./settings.md#lock)).

## Limbaj {#language}

Sunt acceptate douăzeci și două de ținte, listate în trei grupuri – limbaje, ORM-uri, apoi scheme –, fiecare în ordine alfabetică. Lista din panou și meniul contextual separă grupurile printr-o linie, dar nu denumesc niciunul dintre ele:

| Țintă | Grup | Relații | Indexuri | ON DELETE / ON UPDATE | Salvat ca |
| --- | --- | --- | --- | --- | --- |
| `C#` | Limbaj | — | — | — | `.cs` |
| `Go` | Limbaj | — | — | — | `.go` |
| `Java` | Limbaj | — | — | — | `.java` |
| `Kotlin` | Limbaj | — | — | — | `.kt` |
| `PHP` | Limbaj | — | — | — | `.php` |
| `Rust` | Limbaj | — | — | — | `.rs` |
| `Scala` | Limbaj | — | — | — | `.scala` |
| `Swift` | Limbaj | — | — | — | `.swift` |
| `TypeScript` | Limbaj | — | — | — | `.ts` |
| `Doctrine` | ORM | ✓ | ✓ | Doar ON DELETE | `.php` |
| `Drizzle` | ORM | ✓ | ✓ | ✓ | `.ts` |
| `JPA` | ORM | ✓ | — | — | `.java` |
| `SeaORM` | ORM | ✓ | Doar cele unice | ✓ | `.rs` |
| `Sequelize` | ORM | ✓ | ✓ | ✓ | `.ts` |
| `SQLAlchemy` | ORM | ✓ | ✓ | ✓ | `.py` |
| `TypeORM` | ORM | ✓ | ✓ | ✓ | `.ts` |
| `AML` | Schemă | ✓ | ✓ | ✓ | `.aml` |
| `DBML` | Schemă | ✓ | ✓ | ✓ | `.dbml` |
| `GraphQL` | Schemă | ✓ | — | — | `.graphql` |
| `JSON Schema` | Schemă | — | — | — | `.json` |
| `Mermaid` | Schemă | ✓ | — | — | `.mmd` |
| `Zod` | Schemă | — | — | — | `.ts` |

Valoarea implicită este `GraphQL`. Fiecare țintă generează coloanele; marcajele ✓ arată ce mai generează.  
Tabelele sunt generate în ordinea numelor, nu în ordinea în care se află pe pânză, iar indexurile sunt cele listate sub `Indexes` în panoul [Proprietăți tabel](./table-related-functions.md#indexes), nu rândurile `Keys` de deasupra lor. `SeaORM` scrie doar indexurile unice, iar `Mermaid` marchează o coloană unică cu `UK`, dar nu scrie niciun index.  
Toate țintele, în afară de `Java`, `AML`, `DBML` și `Mermaid`, scriu o coloană cheie primară ca non-NULL, indiferent dacă indicatorul `Not Null` este setat pentru ea sau nu. `Java` nu marchează nicio coloană nici ca acceptând NULL, nici ca non-NULL, iar `AML`, `DBML` și `Mermaid` păstrează indicatorul așa cum îl are diagrama.

Ce scriu unele dintre ținte:

- `PHP`: clase simple cu proprietăți publice tipizate, care încep cu `<?php` și `declare(strict_types=1);`.
- `Doctrine`: entități Doctrine ORM 3 cu atribute, pentru DBAL 4.2 sau o versiune ulterioară, fiecare coloană cu tipul DBAL și opțiunile ei pentru baza de date selectată.
- `Rust`: câte un `pub struct` pentru fiecare tabel, cu tipurile scrise prin calea completă, de exemplu `chrono::NaiveDateTime` sau `rust_decimal::Decimal`, fără nicio linie `use`.
- `SeaORM`: entități SeaORM 2.0 în formatul dens, fiecare tabel fiind un `pub mod`, astfel încât întregul text se compilează ca un singur fișier.
- `Swift`: câte un struct `Codable`, `Hashable`, `Sendable` pentru fiecare tabel, care necesită Swift 6.1 sau o versiune ulterioară.
- `TypeScript`: câte un `export interface` pentru fiecare tabel, care descrie rândul ca JSON, la fel ca schema `Zod`: o dată sau o oră este un `string`, iar o coloană care acceptă NULL este `T | null`.
- `Zod`: câte o schemă de rând Zod 4 pentru fiecare tabel și tipul pe care îl deduce, fără schemă de inserare și fără relații.
- `JSON Schema`: un singur document JSON Schema draft 2020-12, cu câte o schemă de rând pentru fiecare tabel sub `$defs`.
- `Mermaid`: un `erDiagram`, de tipul pe care îl redă GitHub, în care fiecare tabel este o entitate care listează fiecare coloană cu tipul ei și eventualul marcaj `PK`, `FK` sau `UK`, iar fiecare relație este o linie între cele două tabele ale sale.

`AML`, `DBML` și `GraphQL` sunt formate bidirecționale: fiecare este și o sursă de import. Consultați [Importarea sau exportarea fișierelor](./file-import-export.md). Celelalte scheme, `JSON Schema`, `Mermaid` și `Zod`, sunt doar de ieșire.  
`DBML` scrie culoarea fiecărui tabel ca `headercolor` și, în codul întregului document, câte un bloc `TableGroup` după definițiile `Ref` pentru fiecare [grup de tabele](./table-groups.md) care conține un tabel. `AML` scrie culoarea unui tabel ca cel mai apropiat dintre numele de culori din AML.

## ON DELETE și ON UPDATE {#on-delete-and-on-update}

Acțiunile ON DELETE și ON UPDATE ale unei relații se setează din meniul ei contextual (consultați [ON DELETE și ON UPDATE](./relationship-editing.md#on-delete-and-on-update)).  
Țintele cu ✓ în coloana `ON DELETE / ON UPDATE` a tabelului din secțiunea [Limbaj](#language) scriu acțiunile pe care le setează o relație; pentru o acțiune lăsată la `Not set` nu se scrie nimic.  
Acțiunile pe care le păstrează țintele ORM depind de baza de date selectată, în timp ce `AML` și `DBML` le păstrează pe toate (consultați [Bază de date](#database)).

- `Doctrine` scrie doar ON DELETE, deoarece Doctrine nu are ON UPDATE. Adaugă `onDelete: 'CASCADE'` la fiecare atribut `#[ORM\JoinColumn]` al asocierii `ManyToOne` sau `OneToOne` de pe partea proprietară, de exemplu `#[ORM\JoinColumn(name: 'user_id', referencedColumnName: 'id', nullable: false, onDelete: 'CASCADE')]`, și nimic la asocierea `OneToMany` sau `OneToOne` de pe partea inversă. O relație către o coloană unică ce nu este cheia primară rămâne sub formă de coloane simple, pe care Doctrine le mapează fără asociere, deci nu scrie nicio acțiune pentru ea.
- `Drizzle` le scrie cu litere mici. La `.references()` apar ca opțiuni, de exemplu `{ onDelete: "cascade", onUpdate: "set null" }`; la un `foreignKey()`, pe care îl primește o cheie cu mai multe coloane, sunt înlănțuite, de exemplu `.onDelete("restrict").onUpdate("no action")`.
- `SeaORM` le scrie pe relația `belongs_to` a tabelului copil, întâi ON UPDATE, cu numele din SeaORM `NoAction`, `Cascade`, `SetNull`, `SetDefault` și `Restrict`, de exemplu `on_update = "Cascade", on_delete = "SetNull"`. Relația `has_one` sau `has_many` a tabelului părinte nu primește niciuna.
- `Sequelize` scrie intrări `onDelete: "CASCADE"` și `onUpdate` în ambele apeluri de asociere: `hasMany` sau `hasOne`, și `belongsTo`. O cheie cu mai multe coloane nu primește apeluri de asociere, deci `Sequelize` nu scrie nicio acțiune pentru ea.
- `SQLAlchemy` transmite argumentele `ondelete="CASCADE"` și `onupdate` către `ForeignKey()` pentru o cheie cu o singură coloană și către `ForeignKeyConstraint()` pentru o cheie cu mai multe coloane.
- `TypeORM` scrie opțiunile `onDelete: "CASCADE"` și `onUpdate` pe `@ManyToOne` sau `@OneToOne` de pe partea proprietară, niciodată pe partea inversă. Omite întotdeauna `SET DEFAULT`, deoarece TypeORM l-ar scrie ca `DEFAULT`, pe care nu îl acceptă nicio bază de date.
- `DBML` adaugă setări la definiția `Ref`, de exemplu `[delete: set null, update: no action]`.
- `AML` scrie o relație care are o acțiune ca instrucțiune `rel` separată, cu proprietăți, de exemplu `{onDelete: cascade, onUpdate: "set null"}`, în loc să o scrie direct pe coloana ei.

`JPA` nu scrie niciuna: JPA standard nu are nicio opțiune pentru ele, iar generatorul nu folosește `@OnDelete` din Hibernate. Nici `Mermaid` nu scrie niciuna, deoarece o linie `erDiagram` nu are loc pentru ele.  
În fila `Code Generator` a panoului Proprietăți tabel, care afișează un singur tabel, `DBML` nu scrie nicio definiție `Ref`, iar `AML` nicio instrucțiune `rel`, deci niciuna dintre ele nu afișează acolo acțiunile; `AML` păstrează direct pe coloana ei o relație cu o singură coloană care are acțiuni, la fel ca pe una fără acțiuni. Acolo, `Mermaid` nu scrie deloc linii de relație. `Doctrine` și `SeaORM` scriu acolo aceeași entitate ca în întregul document, inclusiv acțiunile.

## Stil de denumire {#name-case}

Opțiunile `Table Name Case` și `Column Name Case` acceptă fiecare `Pascal`, `Camel`, `Snake` și `None`.  
Valorile implicite sunt `Pascal` pentru numele tabelelor și `Camel` pentru numele coloanelor. `None` generează un nume așa cum este scris în diagramă.  
La orice stil, un nume pe care limbajul țintei îl rezervă este protejat prin escape acolo unde limbajul permite acest lucru, de exemplu `@class` în `C#` sau `r#type` în `Rust`, și redenumit acolo unde nu permite, de exemplu `class_` în `Java`.

`AML`, `DBML` și `Mermaid` ignoră ambele setări și generează întotdeauna numele din diagramă.  
Și `SeaORM` le ignoră: denumește câmpurile și modulele în snake case, forma pe care SeaORM o recunoaște la citire, și indică numele stocate în `table_name` și, acolo unde diferă, în `column_name`.  
Pentru aceste patru ținte, panoul estompează ambele liste, cu mențiunea `Not used by` sub ele.

## Bază de date {#database}

Tipurile de date se stabilesc în funcție de baza de date selectată (consultați [Baze de date](./table-related-functions.md#databases)).  
Alegeți-o în această filă din lista `Database` a panoului, din elementul `Database` al meniului contextual sau din căutarea rapidă, iar codul se rescrie imediat. Este singura setare de bază de date a diagramei, aceeași pe care o setează meniul contextual al pânzei și fila [Schemă SQL](./schema-sql.md), astfel încât o modificare făcută aici apare și acolo.  
`Drizzle` își ia dialectul din aceeași setare: `pgTable` pentru PostgreSQL, `mysqlTable` pentru MySQL și MariaDB, `sqliteTable` pentru SQLite și `pgTable` pentru orice altă bază de date.  
`SeaORM` scrie un `column_type` acolo unde, în lipsa lui, SeaORM ar crea un tip de coloană diferit pe PostgreSQL, MySQL, MariaDB sau SQLite și nu scrie niciunul pe MSSQL, Oracle, Snowflake sau Databricks, pentru care SeaORM nu are backend.

Baza de date selectată decide și ce acțiuni ON DELETE și ON UPDATE scriu țintele ORM.  
`Doctrine`, `SeaORM`, `Sequelize`, `SQLAlchemy` și `TypeORM` omit orice acțiune pe care fila Schemă SQL o omite pentru acea bază de date, de exemplu `SET DEFAULT` pe MySQL și MariaDB, `RESTRICT` pe MSSQL sau orice acțiune în afară de `NO ACTION` pe Snowflake și Databricks, astfel încât se aplică acțiunea implicită a bazei de date. Lista completă se află în [ON DELETE și ON UPDATE](./relationship-editing.md#on-delete-and-on-update).  
`Drizzle` urmează în schimb dialectul pe care îl scrie: codul `mysqlTable` omite `SET DEFAULT`, în timp ce codul `pgTable` și `sqliteTable` păstrează toate acțiunile, inclusiv codul `pgTable` pe care îl scrie pentru MSSQL, Oracle, Snowflake și Databricks.

`AML`, `DBML` și `Mermaid` sunt excepția: generează fiecare tip de date așa cum este scris în diagramă, deci setarea bazei de date nu le schimbă rezultatul, iar panoul estompează pentru ele opțiunea `Database`. `AML` și `DBML` scriu fiecare acțiune pe care o setează o relație, iar `Mermaid` nu scrie niciuna.

## Delimitator {#bracket}

Opțiunea `Bracket` este oferită în panou, în meniul contextual și în căutarea rapidă doar cât timp limbajul este `Doctrine`, `JPA` sau `SeaORM`.  
Este aceeași setare ca delimitatorul din fila Schemă SQL (consultați [Schemă SQL](./schema-sql.md#database-and-bracket)), astfel încât o modificare făcută aici schimbă și modul în care fila Schemă SQL delimitează numele. Oferă `SingleQuote`, `DoubleQuote`, `Backtick` și `None` și pornește de la `None`.

- `Doctrine`: la orice delimitator în afară de `None`, fiecare nume de tabel, de coloană și de coloană de join este încadrat între apostrofuri inverse, modul prin care Doctrine marchează un nume care trebuie delimitat, de exemplu ``#[ORM\Table(name: '`order`')]``. La `None` este încadrat doar un nume care o cere: un cuvânt pe care îl rezervă o bază de date, un nume care nu este un identificator ASCII simplu sau un nume tastat între ghilimele.
- `JPA`: la orice delimitator în afară de `None`, un nume de tabel care este un cuvânt rezervat este pus între ghilimele în `@Table`, de exemplu `@Table(name = "\"user\"")`. La `None` este lăsat nedelimitat, așa cum îl lasă fila Schemă SQL.
- `SeaORM`: la `None`, numele sunt scrise așa cum le stochează baza de date: un nume de tabel care conține un punct este împărțit în `schema_name` și `table_name`, iar pe PostgreSQL un nume nedelimitat este convertit la litere mici. La orice alt delimitator, un nume este păstrat întreg, așa cum este scris.

## Salvarea sau copierea rezultatului {#saving-or-copying-the-result}

Comanda `Save file`, din partea de jos a panoului de opțiuni sau din meniul contextual, salvează ca fișier codul afișat.  
Fișierul este denumit ca orice export, `<database name>-<timestamp>`, urmat de extensia indicată în tabelul din secțiunea [Limbaj](#language), de exemplu `shop-2026-10-12T04_05_06.ts`, și ajunge acolo unde ajunge orice export în aplicația gazdă (consultați [Exportarea](./file-import-export.md#exporting)). `Java` și `JPA` pun toate clasele într-un singur fișier `.java`, așa cum le afișează fila.  
Meniul Export nu are niciun element pentru generatorul de cod, iar fila `Code Generator` a panoului Proprietăți tabel nu poate salva un fișier.

Pentru a copia codul, faceți clic pe butonul `Copy` din partea de jos a panoului sau treceți cu indicatorul peste cod și faceți clic pe butonul de copiere din dreapta sus a acestuia, singura modalitate din panoul Proprietăți tabel.  
O notificare `Copied!` cu o bifă confirmă copierea timp de două secunde. Dacă browserul sau aplicația gazdă refuză accesul la clipboard, o notificare `Couldn't copy to the clipboard` cu un semn de avertizare semnalează în schimb acest lucru. O nouă copiere înlocuiește notificarea, în loc să adauge alta.  
Textul poate fi și selectat, astfel încât puteți prelua doar partea de care aveți nevoie.
