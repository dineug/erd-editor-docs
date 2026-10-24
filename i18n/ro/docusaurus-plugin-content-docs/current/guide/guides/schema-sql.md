---
sidebar_position: 12
description: Citiți codul DDL al diagramei în fila Schemă SQL, alegeți baza de date, delimitatorul, instrucțiunile, antetul, numele logice în comentariile goale și tabelele în panoul de opțiuni, adăugați propriile scripturi înainte și după tabele și salvați sau copiați codul SQL.
---

# Schemă SQL

Fila `Schema SQL` afișează codul DDL al diagramei pentru baza de date selectată: codul SQL care îi creează tabelele, cu cheile, indexurile și cheile străine ale acestora.  
Treceți la fila `Schema SQL` din bara de instrumente sau alegeți `Schema SQL` sub `Tab` în [căutarea rapidă](./quick-search.md). Alegerea elementului `Schema SQL` din submeniul `Export` o deschide de asemenea, pregătită pentru salvare (consultați [Salvarea sau copierea codului SQL](#saving-or-copying-the-sql)).

Codul SQL se află în stânga, iar în dreapta lui un panou de opțiuni cu titlul `Schema SQL` conține variantele care îl determină (consultați [Panoul de opțiuni](#options-panel)). Și într-o limbă de afișare de la dreapta la stânga, codul SQL rămâne în stânga și se citește de la stânga la dreapta.  
Panoul se deschide singur, cu excepția cazului în care editorul este mai îngust de 640 px când fila se deschide prima dată. Butonul `Hide options` din antetul panoului îl restrânge, iar butonul `Show options` din dreapta sus a codului îl readuce. Apoi rămâne deschis sau restrâns așa cum l-ați lăsat, inclusiv la schimbarea filelor, cât timp editorul este deschis. Se restrânge și se deschide independent de panoul filei Generator de cod și nu se salvează niciodată în fișier.

![Deschiderea Export > Schema SQL, comutarea instrucțiunilor la Drop & re-create și a antetului la USE, apoi adăugarea unui script SET NAMES înainte de tabele](/img/demo-schema-sql-options.webp)

Faceți clic dreapta pe codul SQL pentru a-i deschide meniul contextual:

- `Database` și `Bracket`, fiecare un submeniu care bifează valoarea curentă.
- `Statements` și `Header`, fiecare un submeniu care bifează varianta în vigoare. O variantă pe care baza de date nu o are poartă o mențiune estompată, de exemplu `not in Oracle`, și nu face nimic.
- `Options panel`, bifat cât timp panoul este afișat, care restrânge sau deschide panoul.
- `Save file`

Cât timp această filă este deschisă, căutarea rapidă oferă `Database` și `Bracket`; `Schema SQL: Statements` și `Schema SQL: Header`, care listează doar variantele pe care le are baza de date; și `Schema SQL: Options panel`, care restrânge sau deschide panoul.  
Nici meniul contextual, nici căutarea rapidă nu oferă opțiunea `Write logical names into empty comments`, care se află doar în panoul de opțiuni (consultați [Nume logice drept comentarii](#logical-names-as-comments)).

Codul SQL este scris când fila se deschide și din nou de fiecare dată când se schimbă una dintre variantele panoului, numele bazei de date sau un script. O editare a tabelelor făcută cât timp fila este deschisă, de exemplu de un colaborator sau de un agent de programare, apare după ce părăsiți fila și reveniți sau după ce se schimbă unul dintre aceste elemente.

Panoul [Proprietăți tabel](./table-related-functions.md#table-properties) are propria filă `Schema SQL`, care afișează codul DDL al unui singur tabel. Aceasta scrie întotdeauna instrucțiuni `CREATE` simple, fără antet sau scripturi, nu scrie niciodată un nume logic într-un comentariu gol, nu are panou de opțiuni, iar meniul ei contextual oferă doar `Database` și `Bracket`.

## Panoul de opțiuni {#options-panel}

Panoul conține trei grupuri, fiecare sub un titlu:

1. `Saved in the document`: `Database` și `Bracket` (consultați [Bază de date și delimitator](#database-and-bracket)).
2. `This window only`: `Statements`, `Header`, `Write logical names into empty comments` și, cât timp diagrama are un [grup de tabele](./table-groups.md), `Tables` (consultați [Instrucțiuni](#statements), [Antet](#header), [Nume logice drept comentarii](#logical-names-as-comments) și [Tabele](#tables)).
3. `Saved in the document · written as is for every database`: scripturile `Before tables` și `After tables` (consultați [Scripturi înainte și după tabele](#before-and-after-scripts)).

Butoanele `Save file` și `Copy` se află în partea de jos a panoului (consultați [Salvarea sau copierea codului SQL](#saving-or-copying-the-sql)).

Variantele de sub `This window only` aparțin ferestrei editorului în care le alegeți. Ele nu se salvează în document, nu se partajează cu colaboratorii și nu se înregistrează pentru anulare, iar când editorul este închis sau reîncărcat se resetează; schimbarea filei le păstrează.  
Opțiunea `Statements` pornește de la `If not exists`, `Header` de la `CREATE + USE`, iar `Write logical names into empty comments` pornește dezactivată. Codul SQL pe care îl citește cu [`getSchemaSQL()`](../../api/erd-editor-element.md#getschemasql) o pagină care încorporează editorul și codul SQL pe care [îl citește un agent de programare](../../mcp/tools.md#reading-a-document) pornesc în schimb de la `Create`, fără antet, și nu scriu nume logice decât dacă li se cere.

O variantă pe care baza de date selectată nu o are rămâne în panou, estompată, cu sfatul ecran `Not in <database>`, de exemplu `Not in Oracle`, iar apăsarea ei nu face nimic.  
Codul SQL folosește atunci cea mai apropiată formă pe care o are baza de date, iar butonul acelei forme apare apăsat: `If not exists` revine la `Create`, `CREATE + USE` la `USE` sau la `None` acolo unde baza de date nu are nici `USE`, iar `USE` la `None`. Alegerea dumneavoastră se păstrează, astfel încât trecerea la o bază de date care are acea variantă o readuce.

## Bază de date și delimitator {#database-and-bracket}

Opțiunea `Database` este baza de date a diagramei, aceeași setare ca `Database` din meniul contextual al pânzei și cea din generatorul de cod (consultați [Baze de date](./table-related-functions.md#databases)). Listează Databricks, MSSQL, MariaDB, MySQL, Oracle, PostgreSQL, Snowflake și SQLite, pornește de la MySQL și se salvează în fișier ca orice editare.

Opțiunea `Bracket` stabilește delimitatorul care încadrează numele tabelelor, coloanelor, constrângerilor și indexurilor: `SingleQuote`, `DoubleQuote`, `Backtick` sau `None`, adică nicio delimitare, care este valoarea implicită. Este aceeași setare ca cea din generatorul de cod (consultați [Delimitator](./code-generator.md#bracket)).  
Snowflake, care delimitează numele doar cu ghilimele duble, le folosește la orice variantă în afară de `None`, iar Databricks delimitează întotdeauna numele cu apostrofuri inverse.  
Opțiunea `Bracket` se salvează în fișier doar cât timp blocarea `Bracket Type` din fila Setări este dezactivată, iar o diagramă nouă are toate blocările activate. Cât timp blocarea este activată, o modificare rescrie codul SQL de pe ecran, dar fișierul păstrează valoarea blocată, iar diagrama se redeschide cu ea (consultați [Blocare](./settings.md#lock)).

Cât timp baza de date este Oracle și codul SQL conține un nume mai lung de 30 de octeți, pe care Oracle 12.1 și versiunile mai vechi îl refuză, o mențiune sub cele două liste numește fiecare astfel de nume: `Oracle 12.2+ for names over 30 bytes: <names>`. Sunt verificate numele de tabele, coloane, scheme, chei, indexuri, secvențe și triggere. Codul SQL în sine nu se schimbă.

## Instrucțiuni {#statements}

Opțiunea `Statements` determină modul în care sunt create tabelele:

- `Create` scrie instrucțiuni `CREATE` simple.
- `If not exists` omite tabelele și indexurile care există deja. MySQL, MariaDB, PostgreSQL, SQLite și Databricks au această variantă; MSSQL, Oracle și Snowflake scriu în schimb `Create`.
  - MySQL scrie fiecare tabel ca `CREATE TABLE IF NOT EXISTS`, cu constrângerile unice, indexurile și cheile străine în interiorul lui, și pune întregul lot între `SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;` și `SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;`.
  - MariaDB pune `IF NOT EXISTS` în fiecare instrucțiune: în `CREATE TABLE`, în fiecare constrângere `UNIQUE` și `FOREIGN KEY` și în fiecare `CREATE INDEX`.
  - PostgreSQL scrie `CREATE TABLE IF NOT EXISTS` și `CREATE INDEX IF NOT EXISTS` și elimină fiecare cheie străină cu `DROP CONSTRAINT IF EXISTS` înainte de a o adăuga din nou.
  - SQLite scrie `CREATE TABLE IF NOT EXISTS` și `CREATE INDEX IF NOT EXISTS`.
  - Databricks scrie `CREATE TABLE IF NOT EXISTS` și elimină fiecare cheie străină cu `DROP CONSTRAINT IF EXISTS` înainte de a o adăuga din nou.
- `Drop & re-create` elimină toate tabelele pe care le scrie înainte de a le crea din nou, exceptând Snowflake. Toate bazele de date au această variantă:
  - MySQL și MariaDB scriu câte un `DROP TABLE IF EXISTS` pentru fiecare tabel, între aceleași două linii care dezactivează și apoi reactivează verificarea cheilor străine.
  - PostgreSQL scrie un singur `DROP TABLE IF EXISTS` care numește toate tabelele și care eșuează dacă un tabel din afara listei referă unul dintre ele. Cu antetul `CREATE + USE`, un tabel al cărui nume nu indică nicio schemă este eliminat din acea schemă, de exemplu `shop.member`.
  - MSSQL scrie o singură tranzacție, care necesită SQL Server 2016 sau o versiune ulterioară, după cum indică sfatul ecran `SQL Server 2016+` al butonului. Aceasta elimină cheile străine pe care le conțin tabelele scrise, apoi tabelele, cu un singur `DROP TABLE IF EXISTS`, și se anulează în caz de eroare. O cheie străină conținută de un tabel din afara listei blochează în continuare eliminarea.
  - SQLite scrie `PRAGMA foreign_keys=OFF;`, care rămâne în vigoare pentru acea conexiune, apoi câte un `DROP TABLE IF EXISTS` pentru fiecare tabel.
  - Oracle scrie `DROP TABLE … CASCADE CONSTRAINTS` pentru fiecare tabel și `DROP SEQUENCE` pentru fiecare secvență de autoincrementare, fiecare într-un bloc PL/SQL care se termină cu o linie `/` și ignoră eroarea generată de un tabel sau de o secvență inexistentă.
  - Databricks scrie câte un `DROP TABLE IF EXISTS` pentru fiecare tabel.
  - Snowflake nu elimină nimic și scrie în schimb `CREATE OR REPLACE TABLE`.

Cât timp varianta `Drop & re-create` este în vigoare, un avertisment din panou numește tabelele pe care le elimină: `Drops <tables> before creating them. Their rows are lost.` sau, pentru Snowflake, `Replaces <tables>. Their rows are lost.`  
Sunt numite integral până la cinci tabele. Peste cinci, avertismentul le numește pe primele patru și le numără pe celelalte, de exemplu `a, b, c, d, and 3 more tables`.

## Antet {#header}

Opțiunea `Header` începe codul SQL cu instrucțiunile care creează sau selectează baza de date, ori schema, în care rulează acesta. Numele este numele bazei de date al diagramei, tastat în câmpul `database name` din bara de instrumente, și este delimitat cu caracterul ales la `Bracket`.

- MySQL și MariaDB: `USE` scrie `USE shop;`, iar `CREATE + USE` scrie înainte de aceasta `CREATE DATABASE IF NOT EXISTS shop;`.
- MSSQL: `USE` scrie `USE shop` și `GO`, iar `CREATE + USE` scrie înainte de acestea `IF DB_ID(N'shop') IS NULL CREATE DATABASE shop` și `GO`.
- PostgreSQL are doar `CREATE + USE`, care scrie `CREATE SCHEMA IF NOT EXISTS shop;` și `SET search_path TO shop, public;`.
- Oracle are doar `USE`, care scrie `ALTER SESSION SET CURRENT_SCHEMA = shop;`. `CREATE + USE` revine la această variantă, așa că aceasta este linia pe care o scrie Oracle cu antetul implicit al filei.
- Snowflake și Databricks: `USE` scrie `USE SCHEMA shop;`, iar `CREATE + USE` scrie înainte de aceasta `CREATE SCHEMA IF NOT EXISTS shop;`.
- SQLite nu are niciuna dintre ele și nu scrie niciun antet.

Acolo unde baza de date are `USE` sau `CREATE + USE`, sfatul ecran al butonului indică ce scrie acesta pentru ea, de exemplu `CREATE SCHEMA + SET search_path` pentru PostgreSQL.

Un antet se scrie doar cât timp numele bazei de date este un identificator simplu: o literă ASCII (`A`–`Z`, `a`–`z`) sau `_`, urmată de litere ASCII, cifre sau `_`.  
Cu orice alt nume, inclusiv cu unul gol, nu se scrie niciun antet, iar instrucțiunea `DROP TABLE` din PostgreSQL nu numește atunci nicio schemă. Cât timp este în vigoare un alt antet decât `None`, o mențiune sub `Header` semnalează acest lucru: `Database name "<name>" is not a valid identifier.`  
Numele bazei de date al unei diagrame noi este gol, așa că, până când îi dați un nume, panoul afișează `Database name "" is not a valid identifier.`

## Nume logice drept comentarii {#logical-names-as-comments}

Comutatorul `Write logical names into empty comments`, aflat sub `This window only`, scrie în codul DDL [numele logic](./logical-names.md) al unui tabel sau al unei coloane acolo unde comentariul acestuia este gol, pentru orice bază de date.

![Activarea opțiunii Write logical names into empty comments în panoul Schemă SQL, care scrie numele logic al fiecărei coloane din order_items în clauza ei COMMENT goală, în timp ce comentariile din members rămân neschimbate](/img/demo-schema-sql-logical-names.webp)

- Un comentariu cu text are întotdeauna prioritate: numele logic nu îl înlocuiește niciodată și nu i se adaugă niciodată.
- Un comentariu format doar din spații albe este considerat gol, așa că numele logic se scrie în locul lui. Un nume logic gol sau format doar din spații albe nu scrie nimic, iar acel tabel sau acea coloană rămâne în continuare fără comentariu.
- Numele logic se scrie acolo unde și în forma în care baza de date scrie un comentariu, cu apostrofurile protejate în același fel (consultați [Comentarii](#comments)).

În MySQL, de exemplu, o coloană `id` cu numele logic `Member ID` și fără comentariu este scrisă cu `COMMENT 'Member ID'`, în timp ce o coloană `email` cu numele logic `Email` și comentariul `Sign-in address` păstrează `COMMENT 'Sign-in address'`.

Ca opțiunile `Statements` și `Header`, comutatorul aparține ferestrei și pornește dezactivat (consultați [Panoul de opțiuni](#options-panel)).  
Un import nu citește niciodată un astfel de comentariu înapoi ca nume logic (consultați [Comentarii](./file-import-export.md#comments)).

## Tabele {#tables}

Cât timp diagrama are cel puțin un [grup de tabele](./table-groups.md), afișat sau ascuns, opțiunea `Tables` apare sub `This window only`, cu o casetă de selectare pentru fiecare variantă:

- `All`, care bifează sau debifează toate casetele. Afișează o stare mixtă cât timp doar unele sunt bifate.
- Câte o casetă pentru fiecare grup de tabele, în ordinea grupurilor din diagramă, etichetată cu numele grupului sau cu `unnamed` pentru un grup fără nume, după un punct în culoarea grupului când acesta are o culoare.
- `No group`, pentru tabelele care nu fac parte din niciun grup.

Cu toate casetele bifate, fila scrie întreaga diagramă.  
Cu doar unele bifate, scrie tabelele casetelor bifate, cu indexurile lor și cu cheile străine pe care le conțin, inclusiv una care referă un tabel omis. Scripturile înainte și după tabele se scriu în continuare, iar `Drop & re-create`, avertismentul său și mențiunea Oracle despre numele lungi se aplică doar acelor tabele.  
Fără nicio casetă bifată, fila nu scrie nimic, iar deasupra codului apare indicația `No tables chosen. Check some under Tables.` Butonul `Save file` salvează atunci un fișier gol, iar `Copy` copiază un text gol.

Ca în cazul opțiunilor `Statements` și `Header`, alegerea aparține ferestrei (consultați [Panoul de opțiuni](#options-panel)).  
Un grup adăugat ulterior pornește bifat doar dacă în acel moment toate casetele erau bifate. Eliminarea unui grup îi elimină caseta, iar eliminarea ultimului grup bifează din nou totul.  
Alegerea se aplică doar acestei file. Fila `Schema SQL` din panoul Proprietăți tabel și metoda `getSchemaSQL()` nu sunt afectate de ea.

## Scripturi înainte și după tabele {#before-and-after-scripts}

Câmpurile `Before tables` și `After tables` conțin cod SQL propriu, de exemplu instrucțiuni `CREATE EXTENSION` sau `SET` înainte de tabele ori permisiuni, vizualizări și date inițiale după ele.  
Acestea se salvează în document, o singură pereche pentru întreaga diagramă, indiferent de baza de date. Fiecare este scris în codul SQL așa cum l-ați tastat, fără a fi verificat vreodată: scriptul de dinaintea tabelelor, după antet și înaintea instrucțiunilor `DROP` și a tabelelor, iar scriptul de după tabele, chiar la final.

Sfârșiturile de linie se scriu ca LF, iar liniile goale dinaintea unui script și spațiile albe de după el sunt eliminate.  
Pentru MSSQL, se adaugă o linie `GO` după un script a cărui ultimă linie nu este `GO` (sau `GO` cu un număr), după cum precizează textul de sub cele două câmpuri. Pentru Oracle, încheiați manual un bloc PL/SQL cu linia lui `/`.

Câmpurile evidențiază sintaxa SQL și se măresc odată cu textul lor.  
O editare se aplică atunci când părăsiți câmpul, făcând clic în altă parte sau schimbând fila, și abia atunci se schimbă codul SQL de alături și documentul. Un câmp în care doar ați făcut clic nu schimbă nimic.  
O editare a unui script modifică diagrama ca orice altă editare: se salvează în fișier, colaboratorii o văd, iar fiecare editare aplicată constituie în [istoricul anulărilor](./undo-redo.md) un pas pe care îl anulați din fila ERD.  
Cât timp tastați într-un câmp, comenzile rapide proprii ale editorului sunt lăsate în seama câmpului, astfel încât `Ctrl + Z` (Windows/Linux) sau `⌘ + Z` (Mac) anulează ce ați tastat acolo, iar copierea, decuparea și lipirea acționează asupra textului, nu asupra diagramei.  
Căutarea rapidă și [căutarea din explorator](./find-and-replace.md) se deschid în continuare cu comenzile lor rapide, `Ctrl + K` și `Ctrl + F` (Windows/Linux) sau `⌘ + K` și `⌘ + F` (Mac). Deoarece `Ctrl + F` sau `⌘ + F` trece la fila ERD, aplică editarea, ca orice schimbare de filă.  
Un câmp fără focusul tastaturii preia o modificare pe care un colaborator sau un [agent de programare](../../mcp/tools.md#settings) o face scriptului său. Un câmp în care vă aflați afișează acea modificare când îl părăsiți fără să fi tastat. Dacă ați tastat, textul dumneavoastră se aplică la ieșire și îl înlocuiește pe al lor.

## Salvarea sau copierea codului SQL {#saving-or-copying-the-sql}

Comanda `Save file`, din partea de jos a panoului sau din meniul contextual, salvează exact codul SQL afișat de filă, cu baza de date, delimitatorul, instrucțiunile, antetul, comentariile cu nume logice, tabelele și scripturile curente, ca `<database name>-<timestamp>.sql`. Fișierul este denumit și salvat ca orice alt export (consultați [Exportarea](./file-import-export.md#exporting)).

Elementul `Export` ▸ `Schema SQL`, din meniul contextual al pânzei sau din căutarea rapidă, nu salvează nimic singur.  
Trece la această filă, deschide panoul de opțiuni chiar dacă era restrâns și mută focusul tastaturii pe `Save file`, astfel încât apăsarea tastei `Enter` salvează fișierul.

Butonul `Copy` din partea de jos a panoului, sau butonul de copiere care apare în dreapta sus a codului cât timp treceți cu indicatorul peste acesta, copiază codul SQL.  
O notificare `Copied!` cu o bifă confirmă copierea timp de două secunde. Dacă browserul sau aplicația gazdă refuză accesul la clipboard, o notificare `Couldn't copy to the clipboard` cu un semn de avertizare semnalează în schimb acest lucru, timp de cinci secunde. O nouă copiere înlocuiește notificarea în loc să adauge alta.  
Codul SQL poate fi și selectat, astfel încât puteți prelua doar o parte din el.

## Ce scrie codul DDL {#what-the-ddl-writes}

Aceste reguli se aplică oriunde editorul scrie cod Schemă SQL: în această filă și în fișierul ei, precum și în codul SQL pe care îl citește o pagină care încorporează editorul sau un agent de programare.  
Fila `Schema SQL` din panoul Proprietăți tabel le respectă pentru singurul tabel pe care îl afișează. Nu scrie secvențe sau triggere Oracle și nici chei străine, cu excepția celor din SQLite, care se află în instrucțiunea `CREATE TABLE` a tabelului. Nu scrie nici instrucțiunile de comentariu pe care PostgreSQL, Oracle și MSSQL le pun după un tabel, așa că, pentru aceste trei baze de date, nu afișează niciun comentariu.

Părțile apar în această ordine, separate de câte o linie goală: antetul, scriptul de dinaintea tabelelor, instrucțiunile `DROP`, tabelele și scriptul de după tabele. Tabelele sunt scrise în ordinea numelor.  
Pentru o diagramă fără tabele și fără scripturi nu se scrie nimic, chiar dacă este ales un antet.

Tabelele și coloanele sunt scrise cu numele lor fizice, indiferent ce afișează [modul de afișare a numelor](./logical-names.md#name-view). O coloană legată de un domeniu este scrisă cu propriul tip de date, pe care îl stabilește domeniul (consultați [Domenii și tipuri de date](./dictionary.md#domains-and-data-types)).

### Autoincrementare {#auto-increment}

O coloană marcată cu `Auto Increment` este scrisă așa cum o scrie fiecare bază de date: `AUTO_INCREMENT` în MySQL și MariaDB, `IDENTITY(1,1)` în MSSQL, `AUTOINCREMENT` în Snowflake și `GENERATED ALWAYS AS IDENTITY` în PostgreSQL și Databricks.  
Oracle primește o secvență `SEQ_<table>` și un trigger `SEQ_TRG_<table>` care completează coloana din aceasta. Triggerul se termină cu o linie `/`, astfel încât SQL\*Plus și SQLcl îl rulează.

Acolo unde o bază de date nu acceptă autoincrementarea pentru tipul coloanei, clauza este omisă, iar o linie de comentariu de după tabel numește coloana:

- PostgreSQL o acceptă doar pentru `smallint`, `integer` sau `bigint`, sub oricare dintre numele lor: `INT`, `INTEGER`, `BIGINT`, `SMALLINT`, `INT2`, `INT4` sau `INT8`. O coloană de alt tip nu primește nici clauza, nici o valoare implicită, iar comentariul este, de exemplu, `-- PostgreSQL takes IDENTITY only on smallint, integer or bigint, so member.id is written without it.`
- Databricks o acceptă doar pentru `BIGINT` sau `LONG`.
- SQLite acceptă `AUTOINCREMENT` doar pentru singura coloană a cheii primare a unui tabel, dacă este de tip întreg, de exemplu `INT`, `BIGINT` sau `INT8`, cu sau fără lățime. Acea coloană este scrisă ca `INTEGER`, iar cheia ca `PRIMARY KEY (id AUTOINCREMENT)`. O cheie dintr-o singură coloană de orice alt tip este scrisă fără acesta.

### Acțiuni referențiale {#referential-actions}

Acțiunile ON DELETE și ON UPDATE pe care le scrie fiecare bază de date sunt enumerate în [ON DELETE și ON UPDATE](./relationship-editing.md#on-delete-and-on-update).  
Acolo unde Snowflake omite o acțiune, un comentariu deasupra instrucțiunii `ALTER TABLE` a acelei chei străine o numește, de exemplu `-- Snowflake creates no foreign key with a referential action other than NO ACTION, so ON DELETE CASCADE is left out.`

### Nume de tabele calificate cu schema {#schema-qualified-table-names}

Cu opțiunea `Bracket` la `None`, un nume de tabel cu punct, de exemplu `sales.users`, este citit ca schemă și tabel, despărțite la ultimul punct din afara parantezelor drepte sau a ghilimelor duble.

- MySQL, MariaDB, MSSQL, Oracle și PostgreSQL construiesc numele automate pe care le scriu doar din partea de tabel: `FK_users_TO_orders` și `IDX_users` în toate cele cinci, `UQ_users_email` în toate în afară de PostgreSQL și `PK_users` în MSSQL și Oracle, singurele dintre ele care denumesc cheia primară. În cele două, `[sales].[users]` și `"sales"."users"` dau tot `PK_users`, iar `[Order]` dă `PK_Order`.
- SQLite nu denumește nicio constrângere, așa că singurul nume automat pe care îl construiește este cel al indexului: `CREATE INDEX sales.IDX_users ON users`.
- Oracle creează indexurile tabelului, precum și secvența și triggerul unei coloane cu autoincrementare, în schema tabelului: `sales.IDX_users`, `sales.SEQ_users` și `sales.SEQ_TRG_users`.
- În Oracle și SQLite, un nume de index căruia i-ați dat dumneavoastră o schemă o păstrează.
- Un nume automat de cheie străină sau de index care repetă unul anterior, indiferent de majuscule, primește un număr. Cu `sales.users` și `hr.Users` referite amândouă din `orders`, a doua cheie este `FK_Users_TO_orders1`.

Cu orice altă valoare a opțiunii `Bracket`, întregul nume al tabelului este un singur identificator, de exemplu `"PK_sales.users"`. Snowflake și Databricks păstrează întotdeauna numele întreg.  
Rândurile `Keys` din fila [Indexuri](./table-related-functions.md#indexes) afișează aceleași nume.

### Valori implicite {#defaults}

Valoarea implicită a unei coloane este scrisă așa cum ați tastat-o, dar între paranteze acolo unde baza de date citește acea expresie doar între paranteze. O valoare implicită aflată deja între paranteze este lăsată așa cum este.

- MySQL pune între paranteze orice în afară de un literal sau de ora curentă, de exemplu `(uuid())`. Pune între paranteze și orice valoare implicită în afară de `NULL` pentru o coloană `BLOB`, `TEXT`, `JSON`, spațială sau `LONG…`, precum și ora curentă pentru orice coloană în afară de `TIMESTAMP` sau `DATETIME`.
- MariaDB pune între paranteze orice în afară de un literal, de ora curentă, de un apel de funcție sau de un nume.
- SQLite pune între paranteze orice în afară de un literal sau de un nume, de exemplu `(datetime('now'))`.
- PostgreSQL pune între paranteze doar o expresie care conține în afara parantezelor un cuvânt precum `AT TIME ZONE`, `AND`, `OR`, `IS`, `IN`, `LIKE`, `COLLATE` sau `= ANY`, de exemplu `(now() AT TIME ZONE 'utc')`.
- MSSQL, Oracle, Snowflake și Databricks scriu fiecare valoare implicită așa cum a fost tastată.

### Comentarii {#comments}

Comentariul unui tabel sau al unei coloane care nu este gol, sau numele logic pe care opțiunea [`Write logical names into empty comments`](#logical-names-as-comments) îl scrie în locul lui, este scris așa cum scrie fiecare bază de date comentariile:

- MySQL și MariaDB îl scriu în linie: o coloană se termină cu `COMMENT 'Member ID'`, iar tabelul se încheie cu `) COMMENT 'Members';`, inclusiv în lotul `If not exists` din MySQL.
- Snowflake scrie comentariul unei coloane în linie, `COMMENT 'Member ID'`, iar pe cel al tabelului pe o linie separată după paranteza de închidere, `COMMENT = 'Members';`.
- Databricks scrie comentariul unei coloane în linie, iar pe cel al tabelului ca `COMMENT 'Members';` după `USING DELTA`.
- PostgreSQL scrie `COMMENT ON TABLE member IS 'Members';` și `COMMENT ON COLUMN member.id IS 'Member ID';` imediat după instrucțiunea `CREATE TABLE` a tabelului. Oracle scrie aceleași instrucțiuni după tabel, după constrângerile lui unice și după secvența și triggerul lui de autoincrementare.
- MSSQL scrie câte un apel pentru fiecare tabel și pentru fiecare coloană, după tabel și după constrângerile lui unice, fiecare urmat de `GO`: `EXECUTE sys.sp_addextendedproperty 'MS_Description', N'Members', 'schema', 'dbo', 'table', 'member'`, cu `'column', 'id'` adăugat pentru o coloană.  
  Textul este un literal național, `N'…'`, astfel încât SQL Server păstrează textul din afara paginii de cod a bazei de date, de exemplu în coreeană, în loc să stocheze semne de întrebare.  
  Cu opțiunea `Bracket` la `None`, un tabel numit `sales.users` dă schema `sales` și tabelul `users`, la fel ca `[sales].[users]` și `"sales"."users"`, ale căror paranteze drepte și ghilimele duble sunt eliminate. Un nume fără schemă se află în `dbo`. O parte dinaintea schemei, ca în `shop.sales.users`, rulează procedura acelei baze de date, `shop.sys.sp_addextendedproperty`. Cu orice altă valoare a opțiunii `Bracket`, întregul nume este tabelul, în `dbo`.
- SQLite nu păstrează comentarii, așa că îl scrie pe fiecare ca linie `--` deasupra elementului pe care îl descrie: `-- Members` deasupra instrucțiunii `CREATE TABLE member` și `-- Member ID` deasupra coloanei.

Un apostrof dintr-un comentariu delimitat cu apostrofuri se dublează, ca în `'it''s'` și `N'it''s'`, la fel ca unul din numele pe care le transmit apelurile MSSQL. Databricks protejează în schimb un apostrof și un backslash cu un backslash, ca în `'it\'s'`, forma pe care o citește orice versiune Spark. Liniile `--` din SQLite nu sunt delimitate, așa că păstrează un apostrof așa cum a fost tastat: `-- it's`.  
În rest, textul se scrie așa cum a fost tastat, inclusiv sfârșiturile de linie, cu excepția a două baze de date:

- Oracle omite liniile goale, o linie formată doar din spații sau tabulatori fiind considerată goală, deoarece SQL\*Plus încheie o instrucțiune la o linie goală și sare peste restul ei. Un comentariu de tabel format din `Members`, o linie goală și `Active only` este scris ca `COMMENT ON TABLE member IS 'Members`, cu `Active only';` pe linia următoare.
- SQLite scrie fiecare succesiune de sfârșituri de linie ca un singur spațiu, deoarece un sfârșit de linie ar încheia linia `--` și ar rula restul ca SQL. Același comentariu este scris ca `-- Members Active only`.

Modul în care aceste comentarii sunt citite înapoi la import este descris în [Comentarii](./file-import-export.md#comments).

## Editoare doar în citire {#read-only-editors}

Într-un editor cu atributul `readonly`, fila funcționează ca de obicei: `Database` și `Bracket` schimbă în continuare codul SQL afișat, `Statements`, `Header`, `Write logical names into empty comments` și `Tables` funcționează în continuare, iar `Save file` și `Copy` îl salvează și îl copiază în continuare.  
Singurele elemente doar în citire sunt cele două câmpuri pentru scripturi.
