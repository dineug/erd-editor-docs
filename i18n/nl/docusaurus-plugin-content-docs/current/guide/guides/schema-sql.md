---
sidebar_position: 12
description: Lees de DDL van het diagram op het tabblad Schema SQL, kies in het optiepaneel de database, de aanhalingstekens, de instructies, de kop, logische namen in lege opmerkingen en de tabellen, voeg je eigen scripts vóór en na de tabellen toe en sla de SQL op of kopieer die.
---

# Schema SQL

Het tabblad `Schema SQL` toont de DDL van het diagram voor de geselecteerde database: de SQL die de tabellen ervan maakt, met hun sleutels, indexen en refererende sleutels.  
Schakel in de werkbalk over naar het tabblad `Schema SQL`, of kies `Schema SQL` onder `Tab` in [Snel zoeken](./quick-search.md). Ook als je `Schema SQL` kiest in het submenu `Export`, wordt het tabblad geopend, klaar om op te slaan — zie [De SQL opslaan of kopiëren](#saving-or-copying-the-sql).

De SQL staat links, en rechts ervan bevat een optiepaneel met de titel `Schema SQL` de keuzes die de SQL bepalen — zie [Optiepaneel](#options-panel). Ook in een weergavetaal die van rechts naar links loopt, blijft de SQL links staan en wordt die van links naar rechts gelezen.  
Het paneel opent vanzelf, tenzij de editor smaller is dan 640 px wanneer het tabblad voor het eerst opent. `Hide options` in de kop van het paneel vouwt het samen, en `Show options` rechtsboven in de code haalt het terug. Daarna blijft het open of samengevouwen zoals je het hebt achtergelaten, ook als je van tabblad wisselt, zolang de editor open is. Het wordt los van het paneel van het tabblad Codegenerator samengevouwen en geopend, en wordt nooit in het bestand opgeslagen.

![Export > Schema SQL openen, de instructies op Drop & re-create en de kop op USE zetten en daarna een SET NAMES-script vóór de tabellen toevoegen](/img/demo-schema-sql-options.webp)

Klik met de rechtermuisknop op de SQL om het contextmenu ervan te openen:

- `Database` en `Bracket`, elk een submenu waarin de huidige waarde is aangevinkt.
- `Statements` en `Header`, elk een submenu waarin de geldende keuze is aangevinkt. Een keuze die de database niet heeft, krijgt een gedimde notitie zoals `not in Oracle` en doet niets.
- `Options panel`, aangevinkt zolang het paneel zichtbaar is, dat het paneel samenvouwt of opent.
- `Save file`

Zolang dit tabblad open is, biedt Snel zoeken `Database` en `Bracket`; `Schema SQL: Statements` en `Schema SQL: Header`, die alleen de keuzes tonen die de database heeft; en `Schema SQL: Options panel`, dat het paneel samenvouwt of opent.  
Noch het contextmenu noch Snel zoeken biedt `Write logical names into empty comments`, dat alleen in het optiepaneel staat — zie [Logische namen als opmerkingen](#logical-names-as-comments).

De SQL wordt geschreven wanneer het tabblad opent, en opnieuw telkens wanneer een van de keuzes in het paneel, de databasenaam of een script verandert. Een bewerking van de tabellen terwijl het tabblad open is, zoals die van een medebewerker of een codeeragent, wordt zichtbaar zodra je het tabblad verlaat en terugkomt, of zodra een van die dingen verandert.

[Tabeleigenschappen](./table-related-functions.md#table-properties) heeft een eigen tabblad `Schema SQL`, dat de DDL van één tabel toont. Het schrijft altijd gewone `CREATE`-instructies zonder kop of scripts, schrijft nooit een logische naam in een lege opmerking, heeft geen optiepaneel en het contextmenu ervan biedt alleen `Database` en `Bracket`.

## Optiepaneel {#options-panel}

Het paneel bevat drie groepen, elk onder een opschrift:

1. `Saved in the document`: `Database` en `Bracket` — zie [Database en aanhalingstekens](#database-and-bracket). Een editor in alleen-lezenmodus duidt ze aan met `This window only` — zie [Editors in alleen-lezenmodus](#read-only-editors).
2. `This window only`: `Statements`, `Header`, `Write logical names into empty comments` en, zolang het diagram een [tabelgroep](./table-groups.md) heeft, `Tables` — zie [Instructies](#statements), [Kop](#header), [Logische namen als opmerkingen](#logical-names-as-comments) en [Tabellen](#tables).
3. `Saved in the document · written as is for every database`: de scripts `Before tables` en `After tables` — zie [Scripts vóór en na de tabellen](#before-and-after-scripts).

`Save file` en `Copy` staan onder aan het paneel — zie [De SQL opslaan of kopiëren](#saving-or-copying-the-sql).

De keuzes onder `This window only` horen bij het editorvenster waarin je ze maakt. Ze worden niet in het document opgeslagen, niet met medebewerkers gedeeld en niet in de geschiedenis vastgelegd, en ze worden teruggezet wanneer de editor wordt gesloten of opnieuw geladen; bij het wisselen van tabblad blijven ze behouden.  
`Statements` begint bij `If not exists`, `Header` bij `CREATE + USE` en `Write logical names into empty comments` staat uit. De SQL die een pagina met een ingesloten editor via [`getSchemaSQL()`](../../api/erd-editor-element.md#getschemasql) leest, en de SQL die een [codeeragent leest](../../mcp/tools.md#reading-a-document), beginnen in plaats daarvan bij `Create`, zonder kop, en schrijven geen logische namen, tenzij daarom wordt gevraagd.

Een keuze die de geselecteerde database niet heeft, blijft gedimd in het paneel staan, met de knopinfo `Not in <database>`, zoals `Not in Oracle`, en erop drukken doet niets.  
De SQL gebruikt dan de dichtstbijzijnde vorm die de database heeft, en de knop van die vorm wordt ingedrukt weergegeven: `If not exists` valt terug op `Create`, `CREATE + USE` op `USE`, of op `None` als de database ook geen `USE` heeft, en `USE` op `None`. Je keuze blijft bewaard, dus als je overschakelt naar een database die de keuze heeft, komt die terug.

## Database en aanhalingstekens {#database-and-bracket}

`Database` is de database van het diagram, dezelfde instelling als `Database` in het contextmenu van het canvas en die van de Codegenerator — zie [Databases](./table-related-functions.md#databases). Deze instelling biedt Databricks, MSSQL, MariaDB, MySQL, Oracle, PostgreSQL, Snowflake en SQLite, begint bij MySQL en wordt net als elke bewerking in het bestand opgeslagen.

`Bracket` bepaalt het aanhalingsteken rond namen van tabellen, kolommen, beperkingen en indexen: `SingleQuote`, `DoubleQuote`, `Backtick` of `None` voor helemaal geen aanhalingstekens, wat de standaardwaarde is. Het is dezelfde instelling als die van de Codegenerator — zie [Aanhalingstekens](./code-generator.md#bracket).  
Snowflake, dat namen alleen tussen dubbele aanhalingstekens zet, gebruikt die bij elke keuze behalve `None`, en Databricks zet namen altijd tussen backticks.  
`Bracket` wordt alleen in het bestand opgeslagen zolang de vergrendeling `Bracket Type` op het tabblad Instellingen uitstaat, en in een nieuw diagram staan alle vergrendelingen aan. Zolang de vergrendeling aanstaat, herschrijft een wijziging de SQL op je scherm, maar het bestand behoudt de vergrendelde waarde en het diagram opent daarmee opnieuw — zie [Vergrendeling](./settings.md#lock).

Zolang de database Oracle is en de SQL een naam bevat die langer is dan 30 bytes, wat Oracle 12.1 en ouder weigeren, noemt een notitie onder de twee lijsten elk van die namen: `Oracle 12.2+ for names over 30 bytes: <names>`. De notitie controleert namen van tabellen, kolommen, schema's, sleutels, indexen, sequences en triggers. De SQL zelf verandert niet.

## Instructies {#statements}

`Statements` bepaalt hoe de tabellen worden gemaakt:

- `Create` schrijft gewone `CREATE`-instructies.
- `If not exists` slaat de tabellen en indexen over die al bestaan. MySQL, MariaDB, PostgreSQL, SQLite en Databricks hebben deze keuze; MSSQL, Oracle en Snowflake schrijven in plaats daarvan `Create`.
  - MySQL schrijft elke tabel als `CREATE TABLE IF NOT EXISTS` met de unieke beperkingen, indexen en refererende sleutels erin, en zet de hele batch tussen `SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;` en `SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;`.
  - MariaDB zet `IF NOT EXISTS` bij elke instructie: de `CREATE TABLE`, elke `UNIQUE`- en `FOREIGN KEY`-beperking en elke `CREATE INDEX`.
  - PostgreSQL schrijft `CREATE TABLE IF NOT EXISTS` en `CREATE INDEX IF NOT EXISTS`, en verwijdert elke refererende sleutel met `DROP CONSTRAINT IF EXISTS` voordat die opnieuw wordt toegevoegd.
  - SQLite schrijft `CREATE TABLE IF NOT EXISTS` en `CREATE INDEX IF NOT EXISTS`.
  - Databricks schrijft `CREATE TABLE IF NOT EXISTS`, en verwijdert elke refererende sleutel met `DROP CONSTRAINT IF EXISTS` voordat die opnieuw wordt toegevoegd.
- `Drop & re-create` verwijdert elke tabel die het schrijft voordat de tabellen opnieuw worden gemaakt, behalve op Snowflake. Elke database heeft deze keuze:
  - MySQL en MariaDB schrijven een `DROP TABLE IF EXISTS` voor elke tabel, tussen dezelfde twee regels die de controles op refererende sleutels uit- en weer inschakelen.
  - PostgreSQL schrijft één `DROP TABLE IF EXISTS` die alle tabellen noemt, wat mislukt als een tabel buiten de lijst naar een van die tabellen verwijst. Bij de kop `CREATE + USE` wordt een tabel waarvan de naam geen schema bevat, uit dat schema verwijderd, zoals `shop.member`.
  - MSSQL schrijft één transactie, waarvoor SQL Server 2016 of later nodig is, zoals de knopinfo `SQL Server 2016+` van de knop aangeeft. Die verwijdert de refererende sleutels van de geschreven tabellen, daarna de tabellen met één `DROP TABLE IF EXISTS`, en wordt bij een fout teruggedraaid. Een refererende sleutel van een tabel buiten de lijst blokkeert het verwijderen nog steeds.
  - SQLite schrijft `PRAGMA foreign_keys=OFF;`, dat voor die verbinding blijft gelden, en daarna een `DROP TABLE IF EXISTS` voor elke tabel.
  - Oracle schrijft `DROP TABLE … CASCADE CONSTRAINTS` voor elke tabel en `DROP SEQUENCE` voor elke sequence voor automatisch ophogen, elk in een PL/SQL-blok dat eindigt met een regel `/` en de fout negeert die een ontbrekende tabel of sequence oplevert.
  - Databricks schrijft een `DROP TABLE IF EXISTS` voor elke tabel.
  - Snowflake verwijdert niets en schrijft in plaats daarvan `CREATE OR REPLACE TABLE`.

Zolang `Drop & re-create` geldt, noemt een waarschuwing in het paneel de tabellen die worden verwijderd: `Drops <tables> before creating them. Their rows are lost.`, of op Snowflake `Replaces <tables>. Their rows are lost.`  
Tot vijf tabellen worden volledig genoemd. Bij meer dan vijf noemt de waarschuwing de eerste vier en geeft ze voor de rest het aantal, zoals `a, b, c, d, and 3 more tables`.

## Kop {#header}

`Header` laat de SQL beginnen met de instructies die de database of het schema maken of selecteren waarin de SQL draait. De naam is de databasenaam van het diagram, ingevuld in het veld `database name` van de werkbalk, en wordt tussen de aanhalingstekens van `Bracket` gezet.

- MySQL en MariaDB: `USE` schrijft `USE shop;`, en `CREATE + USE` schrijft daarvóór `CREATE DATABASE IF NOT EXISTS shop;`.
- MSSQL: `USE` schrijft `USE shop` en `GO`, en `CREATE + USE` schrijft daarvóór `IF DB_ID(N'shop') IS NULL CREATE DATABASE shop` en `GO`.
- PostgreSQL heeft alleen `CREATE + USE`, dat `CREATE SCHEMA IF NOT EXISTS shop;` en `SET search_path TO shop, public;` schrijft.
- Oracle heeft alleen `USE`, dat `ALTER SESSION SET CURRENT_SCHEMA = shop;` schrijft. `CREATE + USE` valt erop terug, dus dit is de regel die Oracle schrijft bij de standaardkop van het tabblad.
- Snowflake en Databricks: `USE` schrijft `USE SCHEMA shop;`, en `CREATE + USE` schrijft daarvóór `CREATE SCHEMA IF NOT EXISTS shop;`.
- SQLite heeft geen van beide en schrijft geen kop.

Waar de database `USE` of `CREATE + USE` heeft, noemt de knopinfo van de knop wat die daar schrijft, zoals `CREATE SCHEMA + SET search_path` op PostgreSQL.

Een kop wordt alleen geschreven zolang de databasenaam een eenvoudige identifier is: een ASCII-letter (`A`–`Z`, `a`–`z`) of `_`, gevolgd door ASCII-letters, cijfers of `_`.  
Elke andere naam, een lege inbegrepen, levert geen kop op, en de `DROP TABLE` van PostgreSQL noemt dan geen schema. Zolang een andere kop dan `None` geldt, meldt een notitie onder `Header` dit: `Database name "<name>" is not a valid identifier.`  
De databasenaam van een nieuw diagram is leeg, dus totdat je de database een naam geeft, toont het paneel `Database name "" is not a valid identifier.`

## Logische namen als opmerkingen {#logical-names-as-comments}

`Write logical names into empty comments`, een schakelaar onder `This window only`, schrijft de [logische naam](./logical-names.md) van een tabel of kolom in de DDL waar de opmerking ervan leeg is, op elke database.

![Write logical names into empty comments inschakelen in het paneel Schema SQL, waardoor de logische naam van elke kolom van order_items in haar lege COMMENT wordt geschreven, terwijl de opmerkingen van members blijven staan](/img/demo-schema-sql-logical-names.webp)

- Een opmerking met tekst wint altijd: de logische naam vervangt haar nooit en wordt er nooit aan toegevoegd.
- Een opmerking die alleen uit witruimte bestaat, geldt als leeg, dus de logische naam wordt op haar plaats geschreven. Een logische naam die leeg is of alleen uit witruimte bestaat, schrijft niets, en die tabel of kolom krijgt dan nog steeds geen opmerking.
- De logische naam wordt geschreven waar en in de vorm waarin de database een opmerking schrijft, met aanhalingstekens erin op dezelfde manier geëscapet — zie [Opmerkingen](#comments).

Op MySQL wordt bijvoorbeeld een kolom `id` met de logische naam `Member ID` en zonder opmerking geschreven met `COMMENT 'Member ID'`, terwijl een kolom `email` met de logische naam `Email` en de opmerking `Sign-in address` haar `COMMENT 'Sign-in address'` behoudt.

Net als bij `Statements` en `Header` hoort de schakelaar bij het venster en staat hij aanvankelijk uit — zie [Optiepaneel](#options-panel).  
Een import leest zo'n opmerking nooit terug als logische naam — zie [Opmerkingen](./file-import-export.md#comments).

## Tabellen {#tables}

Zolang het diagram minstens één [tabelgroep](./table-groups.md) heeft, getoond of verborgen, verschijnt `Tables` onder `This window only` met een selectievakje voor elke keuze:

- `All`, dat elk vakje aanvinkt of uitvinkt. Het toont een gemengde status zolang slechts enkele zijn aangevinkt.
- Eén vakje per tabelgroep, in de groepsvolgorde van het diagram, met de naam van de groep als label, of `unnamed` voor een groep zonder naam, na een stip in de kleur van de groep als die een kleur heeft.
- `No group`, voor de tabellen die in geen enkele groep zitten.

Als elk vakje is aangevinkt, schrijft het tabblad het hele diagram.  
Als slechts enkele zijn aangevinkt, schrijft het de tabellen van de aangevinkte vakjes met hun indexen en de refererende sleutels die ze bevatten, ook een die naar een weggelaten tabel verwijst. De scripts vóór en na de tabellen worden nog steeds geschreven, en `Drop & re-create`, de waarschuwing daarvan en de Oracle-notitie over lange namen gelden alleen voor die tabellen.  
Als geen vakje is aangevinkt, schrijft het tabblad niets, en een aanwijzing in het codegebied toont `No tables chosen. Check some under Tables.` `Save file` slaat dan een leeg bestand op, en `Copy` kopieert lege tekst.

Net als bij `Statements` en `Header` hoort de keuze bij het venster — zie [Optiepaneel](#options-panel).  
Een groep die later wordt toegevoegd, begint alleen aangevinkt als op dat moment elk vakje was aangevinkt. Als je een groep verwijdert, verdwijnt het vakje ervan, en als je de laatste groep verwijdert, wordt alles weer aangevinkt.  
De keuze geldt alleen voor dit tabblad. Het tabblad `Schema SQL` van Tabeleigenschappen en `getSchemaSQL()` worden er niet door beïnvloed.

## Scripts vóór en na de tabellen {#before-and-after-scripts}

`Before tables` en `After tables` bevatten je eigen SQL, zoals `CREATE EXTENSION`- of `SET`-instructies vóór de tabellen, of GRANT-instructies, views en startgegevens erna.  
Ze worden in het document opgeslagen, één paar voor het hele diagram, ongeacht de database. Elk script wordt in de SQL geschreven zoals je het hebt getypt, zonder controle: het script vóór de tabellen komt na de kop en vóór de `DROP`-instructies en de tabellen, het script na de tabellen helemaal aan het eind.

Regeleinden worden als LF geschreven, en de lege regels vóór een script en de witruimte erna worden weggelaten.  
Op MSSQL wordt een regel `GO` toegevoegd na een script waarvan de laatste regel niet `GO` is (of `GO` met een aantal), zoals de regel onder de twee velden vermeldt. Sluit op Oracle een PL/SQL-blok zelf af met de bijbehorende regel `/`.

De velden tonen SQL met syntaxismarkering en groeien mee met hun tekst.  
Een bewerking wordt toegepast wanneer je het veld verlaat, door ergens anders te klikken of van tabblad te wisselen, en pas dan veranderen de SQL ernaast en het document. Een veld waarin je alleen hebt geklikt, verandert niets.  
Een bewerking van een script wijzigt het diagram zoals elke andere bewerking: ze wordt in het bestand opgeslagen, medebewerkers zien ze en elke toegepaste bewerking is één stap in de [geschiedenis](./undo-redo.md), die je vanaf het ERD-tabblad ongedaan maakt.  
Terwijl je in een veld typt, laat de editor zijn eigen sneltoetsen aan het veld over, dus `Ctrl + Z` (Windows/Linux) of `⌘ + Z` (Mac) maakt daar je typen ongedaan, en kopiëren, knippen en plakken werken op de tekst in plaats van op het diagram.  
Snel zoeken en de [zoekfunctie van de Verkenner](./find-and-replace.md) openen nog steeds met hun sneltoetsen, `Ctrl + K` en `Ctrl + F` (Windows/Linux) of `⌘ + K` en `⌘ + F` (Mac). Omdat `Ctrl + F` of `⌘ + F` naar het ERD-tabblad overschakelt, past die sneltoets je bewerking toe, zoals elke wissel van tabblad dat doet.  
Een veld zonder toetsenbordfocus volgt een wijziging die een medebewerker of een [codeeragent](../../mcp/tools.md#settings) in het script ervan aanbrengt. Een veld waarin je staat, toont die wijziging wanneer je het verlaat zonder te hebben getypt. Als je hebt getypt, wordt je tekst toegepast wanneer je het veld verlaat en vervangt die de hunne.

## De SQL opslaan of kopiëren {#saving-or-copying-the-sql}

`Save file`, onder aan het paneel of in het contextmenu, slaat precies de SQL op die het tabblad toont, met de huidige database, aanhalingstekens, instructies, kop, opmerkingen met logische namen, tabellen en scripts, als `<database name>-<timestamp>.sql`. Het bestand krijgt een naam en wordt opgeslagen zoals elke andere export — zie [Exporteren](./file-import-export.md#exporting).

`Export` ▸ `Schema SQL`, in het contextmenu van het canvas of in Snel zoeken, slaat zelf niets op.  
Het schakelt over naar dit tabblad, opent het optiepaneel, ook als dat was samengevouwen, en zet de toetsenbordfocus op `Save file`, zodat een druk op `Enter` het bestand opslaat.

`Copy` onder aan het paneel, of de kopieerknop die rechtsboven in de code verschijnt terwijl je de aanwijzer erboven houdt, kopieert de SQL.  
De melding `Copied!` met een vinkje bevestigt dit twee seconden lang. Als de browser of host het klembord weigert, verschijnt in plaats daarvan de melding `Couldn't copy to the clipboard` met een waarschuwingsteken, vijf seconden lang. Opnieuw kopiëren vervangt de melding in plaats van er nog een toe te voegen.  
De SQL is ook selecteerbaar, zodat je er alleen een deel van kunt overnemen.

## Wat de DDL schrijft {#what-the-ddl-writes}

Deze regels gelden overal waar de editor Schema SQL schrijft: op dit tabblad en in het bestand ervan, en in de SQL die een pagina met een ingesloten editor of een codeeragent leest.  
Het tabblad `Schema SQL` van Tabeleigenschappen volgt ze voor de ene tabel die het toont. Het schrijft geen Oracle-sequence of -trigger, en geen refererende sleutels behalve die van SQLite, die in de `CREATE TABLE` staan. Ook schrijft het de instructies voor opmerkingen niet die PostgreSQL, Oracle en MSSQL na een tabel plaatsen, dus op die drie toont het geen opmerkingen.

De onderdelen volgen in deze volgorde, telkens gescheiden door een lege regel: de kop, het script vóór de tabellen, de `DROP`-instructies, de tabellen en het script na de tabellen. Tabellen worden in volgorde van naam geschreven.  
Een diagram zonder tabellen en zonder scripts levert niets op, ook niet als er een kop is gekozen.

Tabellen en kolommen worden geschreven met hun fysieke namen, wat de [naamweergave](./logical-names.md#name-view) ook toont. Een kolom die aan een domein is gekoppeld, wordt geschreven met haar eigen gegevenstype, dat het domein bepaalt — zie [Domeinen en gegevenstypen](./dictionary.md#domains-and-data-types).

### Automatisch ophogen {#auto-increment}

Een kolom die met `Auto Increment` is gemarkeerd, wordt geschreven zoals elke database dat schrijft: `AUTO_INCREMENT` op MySQL en MariaDB, `IDENTITY(1,1)` op MSSQL, `AUTOINCREMENT` op Snowflake en `GENERATED ALWAYS AS IDENTITY` op PostgreSQL en Databricks.  
Oracle krijgt een sequence `SEQ_<table>` en een trigger `SEQ_TRG_<table>` die de kolom daaruit vult. De trigger eindigt met een regel `/`, zodat SQL\*Plus en SQLcl hem uitvoeren.

Waar een database automatisch ophogen niet accepteert voor het type van de kolom, wordt de clausule weggelaten en noemt een commentaarregel na de tabel de kolom:

- PostgreSQL accepteert het alleen voor `smallint`, `integer` of `bigint`, onder elk van hun namen: `INT`, `INTEGER`, `BIGINT`, `SMALLINT`, `INT2`, `INT4` of `INT8`. Een kolom van een ander type krijgt de clausule niet en ook geen standaardwaarde, en het commentaar luidt bijvoorbeeld `-- PostgreSQL takes IDENTITY only on smallint, integer or bigint, so member.id is written without it.`
- Databricks accepteert het alleen voor `BIGINT` of `LONG`.
- SQLite accepteert `AUTOINCREMENT` alleen voor een kolom die als enige de primaire sleutel van een tabel vormt en een type voor gehele getallen heeft, zoals `INT`, `BIGINT` of `INT8`, met of zonder breedte. Die kolom wordt geschreven als `INTEGER`, en de sleutel als `PRIMARY KEY (id AUTOINCREMENT)`. Een enkelvoudige sleutel van een ander type wordt er zonder geschreven.

### Referentiële acties {#referential-actions}

Welke acties voor ON DELETE en ON UPDATE elke database schrijft, staat in [ON DELETE en ON UPDATE](./relationship-editing.md#on-delete-and-on-update).  
Waar Snowflake een actie weglaat, noemt een commentaarregel boven de `ALTER TABLE` van die refererende sleutel de actie, zoals `-- Snowflake creates no foreign key with a referential action other than NO ACTION, so ON DELETE CASCADE is left out.`

### Tabelnamen met schemanaam {#schema-qualified-table-names}

Met `Bracket` op `None` wordt een tabelnaam met een punt, zoals `sales.users`, gelezen als een schema en een tabel, gesplitst bij de laatste punt buiten vierkante haken of dubbele aanhalingstekens.

- MySQL, MariaDB, MSSQL, Oracle en PostgreSQL vormen de automatische namen die ze schrijven uit alleen het tabeldeel: `FK_users_TO_orders` en `IDX_users` op alle vijf, `UQ_users_email` op alle behalve PostgreSQL, en `PK_users` op MSSQL en Oracle, de twee daarvan die de primaire sleutel een naam geven. Op die twee geven `[sales].[users]` en `"sales"."users"` ook `PK_users`, en `[Order]` geeft `PK_Order`.
- SQLite geeft beperkingen geen naam, dus de enige automatische naam die het vormt, is die van de index: `CREATE INDEX sales.IDX_users ON users`.
- Oracle maakt de indexen van de tabel, en de sequence en trigger van een kolom met automatisch ophogen, in het schema van de tabel: `sales.IDX_users`, `sales.SEQ_users` en `sales.SEQ_TRG_users`.
- In Oracle en SQLite behoudt een indexnaam waaraan je zelf een schema hebt gegeven, dat schema.
- Een automatische naam van een refererende sleutel of index die, ongeacht hoofdlettergebruik, een eerdere naam herhaalt, krijgt een nummer. Als `orders` zowel naar `sales.users` als naar `hr.Users` verwijst, is de tweede sleutel `FK_Users_TO_orders1`.

Bij elke andere waarde van `Bracket` is de hele tabelnaam één identifier, zoals `"PK_sales.users"`. Snowflake en Databricks behouden altijd de hele naam.  
De rijen `Keys` op het tabblad [Indexen](./table-related-functions.md#indexes) tonen dezelfde namen.

### Standaardwaarden {#defaults}

De standaardwaarde van een kolom wordt geschreven zoals je die hebt getypt, maar tussen haakjes waar de database die expressie alleen tussen haakjes leest. Een standaardwaarde die al tussen haakjes staat, blijft zoals ze is.

- MySQL zet alles behalve een letterlijke waarde of de huidige tijd tussen haakjes, zoals `(uuid())`. Het zet ook elke standaardwaarde behalve `NULL` tussen haakjes bij een `BLOB`-, `TEXT`-, `JSON`-, ruimtelijke of `LONG…`-kolom, en de huidige tijd bij elke kolom behalve een `TIMESTAMP`- of `DATETIME`-kolom.
- MariaDB zet alles tussen haakjes behalve een letterlijke waarde, de huidige tijd, een functieaanroep of een naam.
- SQLite zet alles behalve een letterlijke waarde of een naam tussen haakjes, zoals `(datetime('now'))`.
- PostgreSQL zet alleen een expressie tussen haakjes die buiten haakjes een woord bevat zoals `AT TIME ZONE`, `AND`, `OR`, `IS`, `IN`, `LIKE`, `COLLATE` of `= ANY`, zoals `(now() AT TIME ZONE 'utc')`.
- MSSQL, Oracle, Snowflake en Databricks schrijven elke standaardwaarde zoals die is getypt.

### Opmerkingen {#comments}

Een opmerking van een tabel of kolom die niet leeg is, of de logische naam die [`Write logical names into empty comments`](#logical-names-as-comments) op haar plaats schrijft, wordt geschreven zoals elke database opmerkingen schrijft:

- MySQL en MariaDB schrijven haar inline: een kolom eindigt met `COMMENT 'Member ID'`, en de tabel sluit af met `) COMMENT 'Members';`, ook in de batch `If not exists` van MySQL.
- Snowflake schrijft die van een kolom inline, `COMMENT 'Member ID'`, en die van de tabel op een eigen regel na het sluithaakje, `COMMENT = 'Members';`.
- Databricks schrijft die van een kolom inline, en die van de tabel als `COMMENT 'Members';` na `USING DELTA`.
- PostgreSQL schrijft `COMMENT ON TABLE member IS 'Members';` en `COMMENT ON COLUMN member.id IS 'Member ID';` direct na de `CREATE TABLE` van de tabel. Oracle schrijft dezelfde instructies na de tabel, de unieke beperkingen ervan en de sequence en trigger ervan voor automatisch ophogen.
- MSSQL schrijft één aanroep per tabel en per kolom, na de tabel en de unieke beperkingen ervan, elk gevolgd door `GO`: `EXECUTE sys.sp_addextendedproperty 'MS_Description', N'Members', 'schema', 'dbo', 'table', 'member'`, met `'column', 'id'` erbij voor een kolom.  
  De tekst is een nationale literal, `N'…'`, zodat SQL Server tekst buiten de codetabel van de database, zoals Koreaans, behoudt in plaats van vraagtekens op te slaan.  
  Met `Bracket` op `None` levert een tabel met de naam `sales.users` het schema `sales` en de tabel `users` op, net als `[sales].[users]` en `"sales"."users"`, waarvan de vierkante haken en dubbele aanhalingstekens worden weggelaten. Een naam zonder schema valt in `dbo`. Een deel vóór het schema, zoals in `shop.sales.users`, voert de procedure van die database uit, `shop.sys.sp_addextendedproperty`. Bij elke andere waarde van `Bracket` is de hele naam de tabel, in `dbo`.
- SQLite bewaart geen opmerkingen, dus het schrijft elke opmerking als een regel `--` boven wat ze beschrijft: `-- Members` boven `CREATE TABLE member`, en `-- Member ID` boven de kolom.

Een aanhalingsteken binnen een opmerking tussen aanhalingstekens wordt verdubbeld, zoals in `'it''s'` en `N'it''s'`, en dat geldt ook voor een aanhalingsteken in de namen die de aanroepen van MSSQL doorgeven. Databricks escapet een aanhalingsteken en een backslash in plaats daarvan met een backslash, zoals in `'it\'s'`, de vorm die elke Spark-versie leest. De regels `--` van SQLite staan niet tussen aanhalingstekens, dus die behouden een aanhalingsteken zoals getypt: `-- it's`.  
Verder wordt de tekst geschreven zoals getypt, regeleinden inbegrepen, behalve op twee databases:

- Oracle laat lege regels weg, waarbij een regel met alleen spaties of tabs als leeg geldt, omdat SQL\*Plus een instructie bij een lege regel beëindigt en de rest ervan overslaat. Een tabelopmerking van `Members`, een lege regel en `Active only` wordt geschreven als `COMMENT ON TABLE member IS 'Members` met `Active only';` op de volgende regel.
- SQLite schrijft elke reeks regeleinden als één spatie, omdat een regeleinde de regel `--` zou beëindigen en de rest als SQL zou uitvoeren. Dezelfde opmerking wordt geschreven als `-- Members Active only`.

Hoe deze opmerkingen bij het importeren worden teruggelezen, staat beschreven in [Opmerkingen](./file-import-export.md#comments).

## Editors in alleen-lezenmodus {#read-only-editors}

In een editor met [`readonly`](../../api/erd-editor-element.md#readonly) werkt het tabblad voor de lezer, en bereikt niets wat erop wordt gedaan het document:

- `Database` en `Bracket` herschrijven nog steeds de SQL, maar alleen in dat venster, dus het paneel duidt ze ook aan met `This window only`. Een keuze wordt niet in het bestand opgeslagen, niet met medebewerkers gedeeld en niet voor ongedaan maken vastgelegd, wat de vergrendelingen ook aangeven, en een wijziging van een medebewerker in een instelling die je koos, laat jouw keuze op het scherm staan. Het tabblad Codegenerator toont dezelfde keuze, en [`getSchemaSQL()`](../../api/erd-editor-element.md#getschemasql) zonder databasesysteem aangeroepen schrijft haar ook. Zodra de editor weer bewerkbaar wordt, komen het databasesysteem en het type aanhalingstekens van het document terug.
- `Statements`, `Header`, `Write logical names into empty comments` en `Tables` werken zoals overal, omdat ze al bij het venster horen.
- De twee scriptvelden zijn alleen-lezen: ze tonen de scripts van het document, die de SQL nog steeds schrijft, en accepteren geen invoer.
- `Save file` en `Copy` slaan de SQL op die het tabblad toont en kopiëren die.
