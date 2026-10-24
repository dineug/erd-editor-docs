---
sidebar_position: 12
description: Branje DDL diagrama na zavihku Shema SQL, izbira zbirke podatkov, narekovajev, stavkov, glave, logičnih imen v praznih komentarjih in tabel na njegovi plošči z možnostmi, dodajanje lastnih skriptov pred tabelami in za njimi ter shranjevanje ali kopiranje kode SQL.
---

# Shema SQL

Zavihek `Schema SQL` prikaže DDL diagrama za izbrano zbirko podatkov: kodo SQL, ki ustvari njegove tabele z njihovimi ključi, indeksi in tujimi ključi.  
Preklopite na zavihek `Schema SQL` v orodni vrstici ali v [hitrem iskanju](./quick-search.md) izberite `Schema SQL` v podmeniju `Tab`. Odpre se tudi, če v podmeniju `Export` izberete `Schema SQL`, in je takoj pripravljen za shranjevanje – glejte razdelek [Shranjevanje ali kopiranje kode SQL](#saving-or-copying-the-sql).

Koda SQL je na levi, desno od nje pa plošča z možnostmi z naslovom `Schema SQL` vsebuje izbire, ki jo oblikujejo – glejte razdelek [Plošča z možnostmi](#options-panel). Tudi pri jeziku prikaza, ki se piše od desne proti levi, koda SQL ostane na levi in se bere od leve proti desni.  
Plošča se odpre samodejno, razen če je urejevalnik ob prvem odprtju zavihka ožji od 640 px. Gumb `Hide options` v glavi plošče jo strne, gumb `Show options` v zgornjem desnem kotu kode pa jo znova prikaže. Nato ostane odprta ali strnjena, kot ste jo pustili, tudi ob preklapljanju zavihkov, dokler je urejevalnik odprt. Strne in odpre se neodvisno od plošče zavihka Generator kode in se nikoli ne shrani v datoteko.

![Odpiranje Export > Schema SQL, preklop stavkov na Drop & re-create in glave na USE, nato dodajanje skripta SET NAMES pred tabelami](/img/demo-schema-sql-options.webp)

Kliknite kodo SQL z desno tipko miške, da odprete njen priročni meni:

- `Database` in `Bracket`, vsak od njiju podmeni, ki označi trenutno vrednost.
- `Statements` in `Header`, vsak od njiju podmeni, ki označi izbiro, ki trenutno velja. Izbira, ki je zbirka podatkov nima, ima bledo opombo, kot je `not in Oracle`, in ne naredi ničesar.
- `Options panel`, ki ploščo strne ali odpre in ima kljukico, dokler je plošča prikazana.
- `Save file`

Dokler je ta zavihek odprt, hitro iskanje ponuja `Database` in `Bracket`, ukaza `Schema SQL: Statements` in `Schema SQL: Header`, ki navajata samo izbire, ki jih zbirka podatkov ima, ter ukaz `Schema SQL: Options panel`, ki ploščo strne ali odpre.  
Stikala `Write logical names into empty comments`, ki je samo na plošči z možnostmi, ne ponujata niti priročni meni niti hitro iskanje – glejte razdelek [Logična imena kot komentarji](#logical-names-as-comments).

Koda SQL se zapiše ob odprtju zavihka in znova vsakič, ko se spremeni katera od izbir na plošči, ime zbirke podatkov ali skript. Sprememba tabel, narejena med odprtim zavihkom, na primer sprememba sodelavca ali agenta za kodiranje, se prikaže, ko zavihek zapustite in se vrnete nanj, ali ko se spremeni kar koli od naštetega.

Okno [Lastnosti tabele](./table-related-functions.md#table-properties) ima svoj zavihek `Schema SQL`, ki prikaže DDL ene tabele. Vedno zapiše navadne stavke `CREATE` brez glave in skriptov, nikoli ne zapiše logičnega imena v prazen komentar, nima plošče z možnostmi, njegov priročni meni pa ponuja samo `Database` in `Bracket`.

## Plošča z možnostmi {#options-panel}

Plošča vsebuje tri skupine, vsako pod svojim napisom:

1. `Saved in the document`: `Database` in `Bracket` – glejte razdelek [Zbirka podatkov in narekovaji](#database-and-bracket).
2. `This window only`: `Statements`, `Header`, `Write logical names into empty comments` in, dokler ima diagram [skupino tabel](./table-groups.md), `Tables` – glejte razdelke [Stavki](#statements), [Glava](#header), [Logična imena kot komentarji](#logical-names-as-comments) in [Tabele](#tables).
3. `Saved in the document · written as is for every database`: skripta `Before tables` in `After tables` – glejte razdelek [Skripti pred tabelami in za njimi](#before-and-after-scripts).

Gumba `Save file` in `Copy` sta na njenem dnu – glejte razdelek [Shranjevanje ali kopiranje kode SQL](#saving-or-copying-the-sql).

Izbire pod `This window only` pripadajo oknu urejevalnika, v katerem jih naredite. Ne shranijo se v dokument, ne delijo se s sodelavci in se ne beležijo za razveljavitev, ponastavijo pa se, ko se urejevalnik zapre ali znova naloži; preklapljanje zavihkov jih ohrani.  
Začetna vrednost za `Statements` je `If not exists`, za `Header` `CREATE + USE`, stikalo `Write logical names into empty comments` pa je izklopljeno. Za kodo SQL, ki jo stran z vdelanim urejevalnikom prebere z metodo [`getSchemaSQL()`](../../api/erd-editor-element.md#getschemasql), in za kodo SQL, ki jo [prebere agent za kodiranje](../../mcp/tools.md#reading-a-document), pa je začetna vrednost namesto tega `Create` brez glave, logična imena pa se v njej zapišejo le na zahtevo.

Izbira, ki je izbrana zbirka podatkov nima, ostane na plošči, zatemnjena, z opisom orodja `Not in <database>`, kot je `Not in Oracle`, in pritisk nanjo ne naredi ničesar.  
Koda SQL tedaj uporabi najbližjo obliko, ki jo zbirka podatkov ima, gumb te oblike pa je prikazan kot pritisnjen: `If not exists` preide na `Create`, `CREATE + USE` na `USE` ali na `None`, kjer zbirka podatkov nima niti `USE`, `USE` pa na `None`. Vaša izbira se ohrani, zato jo preklop na zbirko podatkov, ki jo ima, povrne.

## Zbirka podatkov in narekovaji {#database-and-bracket}

Nastavitev `Database` določa zbirko podatkov diagrama in je ista nastavitev kot `Database` v priročnem meniju platna in v generatorju kode – glejte razdelek [Zbirke podatkov](./table-related-functions.md#databases). Navaja Databricks, MSSQL, MariaDB, MySQL, Oracle, PostgreSQL, Snowflake in SQLite, njena začetna vrednost je MySQL, v datoteko pa se shrani kot vsaka druga sprememba.

Nastavitev `Bracket` določa narekovaj okoli imen tabel, stolpcev, omejitev in indeksov: `SingleQuote`, `DoubleQuote`, `Backtick` ali `None` za imena brez narekovajev, kar je privzeta vrednost. Je ista nastavitev kot v generatorju kode – glejte razdelek [Narekovaji](./code-generator.md#bracket).  
Snowflake, ki imena obdaja samo z dvojnimi narekovaji, jih uporabi pri vsaki izbiri razen `None`, Databricks pa imena vedno obda z obrnjenimi narekovaji.  
Nastavitev `Bracket` se shrani v datoteko samo, dokler je zaklep `Bracket Type` na zavihku Nastavitve izklopljen, nov diagram pa ima vklopljene vse zaklepe. Dokler je zaklep vklopljen, sprememba prepiše kodo SQL na vašem zaslonu, datoteka pa ohrani zaklenjeno vrednost in diagram se znova odpre z njo – glejte razdelek [Zaklepanje](./settings.md#lock).

Dokler je zbirka podatkov Oracle in koda SQL vsebuje ime, daljše od 30 bajtov, ki ga Oracle 12.1 in starejše različice zavrnejo, opomba pod obema seznamoma navede vsako takšno ime: `Oracle 12.2+ for names over 30 bytes: <names>`. Preverja imena tabel, stolpcev, shem, ključev, indeksov, zaporedij in sprožilcev. Sama koda SQL se ne spremeni.

## Stavki {#statements}

Nastavitev `Statements` določa, kako se tabele ustvarijo:

- `Create` zapiše navadne stavke `CREATE`.
- `If not exists` preskoči tabele in indekse, ki že obstajajo. Imajo ga MySQL, MariaDB, PostgreSQL, SQLite in Databricks; MSSQL, Oracle in Snowflake namesto tega zapišejo `Create`.
  - MySQL zapiše vsako tabelo kot `CREATE TABLE IF NOT EXISTS` z omejitvami enoličnosti, indeksi in tujimi ključi znotraj nje, celoten paket pa postavi med `SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;` in `SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;`.
  - MariaDB doda `IF NOT EXISTS` vsakemu stavku: stavku `CREATE TABLE`, vsaki omejitvi `UNIQUE` in `FOREIGN KEY` ter vsakemu stavku `CREATE INDEX`.
  - PostgreSQL zapiše `CREATE TABLE IF NOT EXISTS` in `CREATE INDEX IF NOT EXISTS`, vsak tuji ključ pa pred ponovnim dodajanjem odstrani z `DROP CONSTRAINT IF EXISTS`.
  - SQLite zapiše `CREATE TABLE IF NOT EXISTS` in `CREATE INDEX IF NOT EXISTS`.
  - Databricks zapiše `CREATE TABLE IF NOT EXISTS`, vsak tuji ključ pa pred ponovnim dodajanjem odstrani z `DROP CONSTRAINT IF EXISTS`.
- `Drop & re-create` izbriše vse tabele, ki jih zapiše, preden jih znova ustvari, razen pri Snowflake. Imajo ga vse zbirke podatkov:
  - MySQL in MariaDB zapišeta `DROP TABLE IF EXISTS` za vsako tabelo, med istima dvema vrsticama, ki izklopita in znova vklopita preverjanje tujih ključev.
  - PostgreSQL zapiše en sam `DROP TABLE IF EXISTS`, ki navede vse tabele in ne uspe, če se na katero od njih sklicuje tabela zunaj seznama. Pri glavi `CREATE + USE` se tabela, katere ime ne navaja sheme, izbriše iz te sheme, na primer `shop.member`.
  - MSSQL zapiše eno transakcijo, ki potrebuje SQL Server 2016 ali novejši, kot pove opis orodja `SQL Server 2016+` na gumbu. Odstrani tuje ključe, ki jih imajo zapisane tabele, nato z enim samim `DROP TABLE IF EXISTS` izbriše tabele, ob napaki pa transakcijo povrne. Tuji ključ, ki ga ima tabela zunaj seznama, brisanje še vedno prepreči.
  - SQLite zapiše `PRAGMA foreign_keys=OFF;`, ki ostane v veljavi za to povezavo, nato pa `DROP TABLE IF EXISTS` za vsako tabelo.
  - Oracle zapiše `DROP TABLE … CASCADE CONSTRAINTS` za vsako tabelo in `DROP SEQUENCE` za vsako zaporedje samodejnega povečevanja, vsakega v bloku PL/SQL, ki se konča z vrstico `/` in prezre napako, ki jo sproži manjkajoča tabela ali manjkajoče zaporedje.
  - Databricks zapiše `DROP TABLE IF EXISTS` za vsako tabelo.
  - Snowflake ne izbriše ničesar in namesto tega zapiše `CREATE OR REPLACE TABLE`.

Dokler velja `Drop & re-create`, opozorilo na plošči navede tabele, ki jih izbriše: `Drops <tables> before creating them. Their rows are lost.` ali pri Snowflake `Replaces <tables>. Their rows are lost.`  
Do pet tabel se navede v celoti. Pri več kot petih opozorilo navede prve štiri, preostale pa prešteje, na primer `a, b, c, d, and 3 more tables`.

## Glava {#header}

Nastavitev `Header` na začetek kode SQL postavi stavke, ki ustvarijo ali izberejo zbirko podatkov ali shemo, v kateri se koda izvaja. Ime je ime zbirke podatkov diagrama, vneseno v polje `database name` v orodni vrstici, obda pa se z narekovajem nastavitve `Bracket`.

- MySQL in MariaDB: `USE` zapiše `USE shop;`, `CREATE + USE` pa pred tem zapiše `CREATE DATABASE IF NOT EXISTS shop;`.
- MSSQL: `USE` zapiše `USE shop` in `GO`, `CREATE + USE` pa pred tem zapiše `IF DB_ID(N'shop') IS NULL CREATE DATABASE shop` in `GO`.
- PostgreSQL ima samo `CREATE + USE`, ki zapiše `CREATE SCHEMA IF NOT EXISTS shop;` in `SET search_path TO shop, public;`.
- Oracle ima samo `USE`, ki zapiše `ALTER SESSION SET CURRENT_SCHEMA = shop;`. Izbira `CREATE + USE` preide nanj, zato Oracle to vrstico zapiše pri privzeti glavi zavihka.
- Snowflake in Databricks: `USE` zapiše `USE SCHEMA shop;`, `CREATE + USE` pa pred tem zapiše `CREATE SCHEMA IF NOT EXISTS shop;`.
- SQLite nima nobene od njiju in ne zapiše glave.

Kjer ima zbirka podatkov `USE` ali `CREATE + USE`, opis orodja gumba pove, kaj ta tam zapiše, na primer `CREATE SCHEMA + SET search_path` pri PostgreSQL.

Glava se zapiše samo, dokler je ime zbirke podatkov preprost identifikator: na začetku črka ASCII (`A`–`Z`, `a`–`z`) ali `_`, nato črke ASCII, števke ali `_`.  
Pri vsakem drugem imenu, vključno s praznim, se glava ne zapiše, `DROP TABLE` pri PostgreSQL pa tedaj ne navede sheme. Dokler velja glava, ki ni `None`, to pove opomba pod `Header`: `Database name "<name>" is not a valid identifier.`  
Ime zbirke podatkov novega diagrama je prazno, zato plošča, dokler zbirke podatkov ne poimenujete, prikazuje `Database name "" is not a valid identifier.`

## Logična imena kot komentarji {#logical-names-as-comments}

Stikalo `Write logical names into empty comments` pod `This window only` pri vsaki zbirki podatkov zapiše [logično ime](./logical-names.md) tabele ali stolpca v DDL tam, kjer je komentar prazen.

![Vklop stikala Write logical names into empty comments na plošči zavihka Shema SQL, ki logično ime vsakega stolpca tabele order_items zapiše v njegov prazen COMMENT, komentarji tabele members pa ostanejo](/img/demo-schema-sql-logical-names.webp)

- Komentar z besedilom ima vedno prednost: logično ime ga nikoli ne nadomesti in se mu nikoli ne doda.
- Komentar iz samih presledkov šteje za prazen, zato se na njegovo mesto zapiše logično ime. Logično ime, ki je prazno ali iz samih presledkov, ne zapiše ničesar in ta tabela ali stolpec še vedno ne dobi komentarja.
- Logično ime se zapiše na mestu in v obliki, v kateri zbirka podatkov zapiše komentar, njegovi narekovaji pa se na enak način zapišejo v ubežni obliki – glejte razdelek [Komentarji](#comments).

Pri MySQL se na primer stolpec `id` z logičnim imenom `Member ID` in brez komentarja zapiše s `COMMENT 'Member ID'`, stolpec `email` z logičnim imenom `Email` in komentarjem `Sign-in address` pa ohrani `COMMENT 'Sign-in address'`.

Tako kot `Statements` in `Header` stikalo pripada oknu in je na začetku izklopljeno – glejte razdelek [Plošča z možnostmi](#options-panel).  
Uvoz takega komentarja nikoli ne prebere nazaj kot logično ime – glejte razdelek [Komentarji](./file-import-export.md#comments).

## Tabele {#tables}

Dokler ima diagram vsaj eno [skupino tabel](./table-groups.md), prikazano ali skrito, se pod `This window only` prikaže `Tables` s potrditvenim poljem za vsako izbiro:

- `All`, ki označi ali počisti vsa polja. Dokler so označena le nekatera, prikazuje mešano stanje.
- Eno polje na skupino tabel, v vrstnem redu skupin v diagramu, označeno z imenom skupine ali z `unnamed` pri skupini brez imena, za piko v barvi skupine, če ima skupina barvo.
- `No group` za tabele brez skupine.

Ko so označena vsa polja, zavihek zapiše celoten diagram.  
Ko so označena le nekatera, zapiše tabele označenih polj z njihovimi indeksi in tujimi ključi, ki jih imajo, tudi s takim, ki se sklicuje na izpuščeno tabelo. Skripta pred tabelami in za njimi se še vedno zapišeta, `Drop & re-create`, njegovo opozorilo in opomba za Oracle o dolgih imenih pa zajamejo samo te tabele.  
Ko ni označeno nobeno polje, zavihek ne zapiše ničesar, namig nad kodo pa se glasi `No tables chosen. Check some under Tables.` Gumb `Save file` tedaj shrani prazno datoteko, gumb `Copy` pa kopira prazno besedilo.

Tako kot `Statements` in `Header` izbira pripada oknu – glejte razdelek [Plošča z možnostmi](#options-panel).  
Pozneje dodana skupina je na začetku označena samo, če so bila v tistem trenutku označena vsa polja. Odstranitev skupine odstrani njeno polje, odstranitev zadnje skupine pa znova označi vse.  
Izbira velja samo za ta zavihek. Na zavihek `Schema SQL` v oknu Lastnosti tabele in na metodo `getSchemaSQL()` ne vpliva.

## Skripti pred tabelami in za njimi {#before-and-after-scripts}

Polji `Before tables` in `After tables` vsebujeta vašo lastno kodo SQL, na primer stavke `CREATE EXTENSION` ali `SET` pred tabelami ali pa dodelitve pravic, poglede in začetne podatke za njimi.  
Shranita se v dokument, en par za celoten diagram ne glede na zbirko podatkov. Vsak se v kodo SQL zapiše tako, kot ste ga vnesli, in se nikoli ne preverja: skript pred tabelami za glavo ter pred stavki `DROP` in tabelami, skript za tabelami pa čisto na koncu.

Prelomi vrstic se zapišejo kot LF, prazne vrstice pred skriptom in prazni znaki za njim pa se odstranijo.  
Pri MSSQL se za skript, katerega zadnja vrstica ni `GO` (ali `GO` s številom), doda vrstica `GO`, kot pove vrstica pod obema poljema. Pri Oracle blok PL/SQL sami zaključite z njegovo vrstico `/`.

Polji barvno označujeta sintakso SQL in se večata skupaj z besedilom.  
Sprememba se uporabi, ko zapustite polje, tako da kliknete drugam ali preklopite zavihek, in šele tedaj se spremenita koda SQL ob njem in dokument. Polje, v katero ste samo kliknili, ne spremeni ničesar.  
Sprememba skripta spremeni diagram kot vsaka druga sprememba: shrani se v datoteko, sodelavci jo vidijo, vsaka uporabljena sprememba pa je en korak v [zgodovini razveljavitev](./undo-redo.md), ki ga razveljavite na zavihku ERD.  
Medtem ko tipkate v polje, so lastne bližnjice urejevalnika prepuščene polju, zato `Ctrl + Z` (Windows/Linux) ali `⌘ + Z` (Mac) razveljavi vaše tipkanje v njem, kopiranje, izrezovanje in lepljenje pa delujejo na besedilu in ne na diagramu.  
Hitro iskanje in [iskanje v raziskovalcu](./find-and-replace.md) se še vedno odpreta s svojima bližnjicama, `Ctrl + K` in `Ctrl + F` (Windows/Linux) ali `⌘ + K` in `⌘ + F` (Mac). Ker `Ctrl + F` ali `⌘ + F` preklopi na zavihek ERD, uporabi vašo spremembo, tako kot vsak preklop zavihka.  
Polje brez fokusa tipkovnice sledi spremembi, ki jo sodelavec ali [agent za kodiranje](../../mcp/tools.md#settings) naredi v njegovem skriptu. Polje, v katerem ste, to spremembo prikaže, ko ga zapustite, ne da bi tipkali. Če ste tipkali, se vaše besedilo uporabi, ko polje zapustite, in nadomesti njihovo.

## Shranjevanje ali kopiranje kode SQL {#saving-or-copying-the-sql}

Ukaz `Save file` na dnu plošče ali v priročnem meniju shrani natanko kodo SQL, ki jo prikazuje zavihek, s trenutno zbirko podatkov, narekovaji, stavki, glavo, komentarji z logičnimi imeni, tabelami in skripti, kot datoteko `<database name>-<timestamp>.sql`. Poimenuje in shrani se kot vsak drug izvoz – glejte razdelek [Izvoz](./file-import-export.md#exporting).

Ukaz `Export` ▸ `Schema SQL` v priročnem meniju platna ali v hitrem iskanju sam po sebi ne shrani ničesar.  
Preklopi na ta zavihek, odpre ploščo z možnostmi, tudi če je bila strnjena, in postavi fokus tipkovnice na `Save file`, zato pritisk tipke `Enter` shrani datoteko.

Kodo SQL kopira gumb `Copy` na dnu plošče ali gumb za kopiranje, ki se prikaže v zgornjem desnem kotu kode, ko je kazalec nad njo.  
Pojavno obvestilo `Copied!` s kljukico to za dve sekundi potrdi. Če brskalnik ali gostitelj zavrne dostop do odložišča, to namesto tega za pet sekund sporoči pojavno obvestilo `Couldn't copy to the clipboard` z opozorilnim znakom. Ponovno kopiranje nadomesti pojavno obvestilo, namesto da bi dodalo novo.  
Kodo SQL je mogoče tudi izbrati, zato lahko vzamete samo njen del.

## Kaj zapiše DDL {#what-the-ddl-writes}

Ta pravila veljajo povsod, kjer urejevalnik zapiše Shemo SQL: na tem zavihku in v njegovi datoteki ter v kodi SQL, ki jo prebere stran z vdelanim urejevalnikom ali agent za kodiranje.  
Zavihek `Schema SQL` v oknu Lastnosti tabele jim sledi za tisto eno tabelo, ki jo prikazuje. Ne zapiše zaporedja ali sprožilca za Oracle in ne tujih ključev, razen pri SQLite, kjer so znotraj stavka `CREATE TABLE`. Prav tako ne zapiše stavkov za komentarje, ki jih PostgreSQL, Oracle in MSSQL postavijo za tabelo, zato pri teh treh ne prikaže komentarjev.

Deli si sledijo v tem vrstnem redu, ločeni s prazno vrstico: glava, skript pred tabelami, stavki `DROP`, tabele in skript za tabelami. Tabele se zapišejo po vrstnem redu imen.  
Diagram brez tabel in brez skriptov ne zapiše ničesar, tudi če je izbrana glava.

Tabele in stolpci se zapišejo s fizičnimi imeni, ne glede na to, kaj prikazuje [prikaz imen](./logical-names.md#name-view). Stolpec, povezan z domeno, se zapiše s svojim podatkovnim tipom, ki ga določa domena – glejte razdelek [Domene in podatkovni tipi](./dictionary.md#domains-and-data-types).

### Samodejno povečevanje {#auto-increment}

Stolpec z zastavico `Auto Increment` se zapiše tako, kot ga zapiše posamezna zbirka podatkov: `AUTO_INCREMENT` pri MySQL in MariaDB, `IDENTITY(1,1)` pri MSSQL, `AUTOINCREMENT` pri Snowflake in `GENERATED ALWAYS AS IDENTITY` pri PostgreSQL in Databricks.  
Za Oracle se zapišeta zaporedje `SEQ_<table>` in sprožilec `SEQ_TRG_<table>`, ki iz njega polni stolpec. Sprožilec se konča z vrstico `/`, zato ga SQL\*Plus in SQLcl izvedeta.

Kjer zbirka podatkov ne sprejme samodejnega povečevanja za tip stolpca, je določilo izpuščeno, vrstica s komentarjem za tabelo pa navede stolpec:

- PostgreSQL ga sprejme samo pri `smallint`, `integer` ali `bigint`, pod katerim koli od njihovih imen: `INT`, `INTEGER`, `BIGINT`, `SMALLINT`, `INT2`, `INT4` ali `INT8`. Stolpec drugega tipa ne dobi niti določila niti privzete vrednosti, komentar pa se glasi na primer `-- PostgreSQL takes IDENTITY only on smallint, integer or bigint, so member.id is written without it.`
- Databricks ga sprejme samo pri `BIGINT` ali `LONG`.
- SQLite sprejme `AUTOINCREMENT` samo pri edinem stolpcu primarnega ključa tabele, ki je celoštevilskega tipa, kot so `INT`, `BIGINT` ali `INT8`, z navedeno širino ali brez nje. Ta stolpec se zapiše kot `INTEGER`, ključ pa kot `PRIMARY KEY (id AUTOINCREMENT)`. Edini ključ katerega koli drugega tipa se zapiše brez njega.

### Referenčna dejanja {#referential-actions}

Katera dejanja ON DELETE in ON UPDATE zapiše posamezna zbirka podatkov, je navedeno v razdelku [ON DELETE in ON UPDATE](./relationship-editing.md#on-delete-and-on-update).  
Kjer Snowflake dejanje izpusti, ga navede komentar nad stavkom `ALTER TABLE` tega tujega ključa, na primer `-- Snowflake creates no foreign key with a referential action other than NO ACTION, so ON DELETE CASCADE is left out.`

### Imena tabel s shemo {#schema-qualified-table-names}

Ko ima nastavitev `Bracket` vrednost `None`, se ime tabele s piko, kot je `sales.users`, prebere kot shema in tabela, razdeljeno pri zadnji piki zunaj oglatih oklepajev ali dvojnih narekovajev.

- MySQL, MariaDB, MSSQL, Oracle in PostgreSQL samodejna imena, ki jih zapišejo, sestavijo samo iz tabelnega dela imena: `FK_users_TO_orders` in `IDX_users` pri vseh petih, `UQ_users_email` pri vseh razen PostgreSQL ter `PK_users` pri MSSQL in Oracle, edinih dveh med njimi, ki poimenujeta primarni ključ. Pri teh dveh tudi `[sales].[users]` in `"sales"."users"` dasta `PK_users`, `[Order]` pa da `PK_Order`.
- SQLite ne poimenuje omejitev, zato je edino samodejno ime, ki ga sestavi, ime indeksa: `CREATE INDEX sales.IDX_users ON users`.
- Oracle ustvari indekse tabele ter zaporedje in sprožilec stolpca s samodejnim povečevanjem v shemi tabele: `sales.IDX_users`, `sales.SEQ_users` in `sales.SEQ_TRG_users`.
- Pri Oracle in SQLite ime indeksa, ki ste mu shemo dodali sami, to shemo ohrani.
- Samodejno ime tujega ključa ali indeksa, ki ne glede na velikost črk ponovi prejšnje ime, dobi številko. Ko se tabela `orders` sklicuje na `sales.users` in na `hr.Users`, je drugi ključ `FK_Users_TO_orders1`.

Pri kateri koli drugi vrednosti nastavitve `Bracket` je celotno ime tabele en identifikator, na primer `"PK_sales.users"`. Snowflake in Databricks vedno ohranita celotno ime.  
Vrstice `Keys` na zavihku [Indeksi](./table-related-functions.md#indexes) prikazujejo ista imena.

### Privzete vrednosti {#defaults}

Privzeta vrednost stolpca se zapiše tako, kot ste jo vnesli, vendar v oklepajih, kjer zbirka podatkov ta izraz prebere samo znotraj njih. Privzeta vrednost, ki je že v oklepajih, ostane nespremenjena.

- MySQL v oklepaje obda vse razen literala ali trenutnega časa, na primer `(uuid())`. Obda tudi vsako privzeto vrednost razen `NULL` pri stolpcu tipa `BLOB`, `TEXT`, `JSON`, prostorskega tipa ali tipa `LONG…` ter trenutni čas pri vsakem stolpcu razen tipa `TIMESTAMP` ali `DATETIME`.
- MariaDB obda vse razen literala, trenutnega časa, klica funkcije ali imena.
- SQLite obda vse razen literala ali imena, na primer `(datetime('now'))`.
- PostgreSQL obda samo izraz, ki zunaj oklepajev vsebuje besedo, kot so `AT TIME ZONE`, `AND`, `OR`, `IS`, `IN`, `LIKE`, `COLLATE` ali `= ANY`, na primer `(now() AT TIME ZONE 'utc')`.
- MSSQL, Oracle, Snowflake in Databricks zapišejo vsako privzeto vrednost tako, kot je vnesena.

### Komentarji {#comments}

Komentar tabele ali stolpca, ki ni prazen, ali logično ime, ki ga stikalo [`Write logical names into empty comments`](#logical-names-as-comments) zapiše na njegovo mesto, se zapiše tako, kot posamezna zbirka podatkov zapisuje komentarje:

- MySQL in MariaDB ga zapišeta neposredno v definicijo: stolpec se konča s `COMMENT 'Member ID'`, tabela pa se zapre z vrstico `) COMMENT 'Members';`, tudi v paketu `If not exists` pri MySQL.
- Snowflake komentar stolpca zapiše neposredno v definicijo, `COMMENT 'Member ID'`, komentar tabele pa v svojo vrstico za zaklepajem, `COMMENT = 'Members';`.
- Databricks komentar stolpca zapiše neposredno v definicijo, komentar tabele pa kot `COMMENT 'Members';` za `USING DELTA`.
- PostgreSQL zapiše `COMMENT ON TABLE member IS 'Members';` in `COMMENT ON COLUMN member.id IS 'Member ID';` takoj za stavkom `CREATE TABLE` tabele. Oracle zapiše enake stavke za tabelo, njenimi omejitvami enoličnosti ter njenim zaporedjem in sprožilcem za samodejno povečevanje.
- MSSQL zapiše en klic za vsako tabelo in vsak stolpec, za tabelo in njenimi omejitvami enoličnosti, vsakemu pa sledi `GO`: `EXECUTE sys.sp_addextendedproperty 'MS_Description', N'Members', 'schema', 'dbo', 'table', 'member'`, pri stolpcu pa se doda še `'column', 'id'`.  
  Besedilo je nacionalni literal, `N'…'`, zato SQL Server besedilo zunaj kodne strani zbirke podatkov, na primer korejsko, ohrani, namesto da bi shranil vprašaje.  
  Ko ima nastavitev `Bracket` vrednost `None`, tabela z imenom `sales.users` da shemo `sales` in tabelo `users`, enako pa tudi `[sales].[users]` in `"sales"."users"`, katerih oglati oklepaji in dvojni narekovaji se odstranijo. Ime brez sheme je v `dbo`. Del pred shemo, kot v `shop.sales.users`, izvede proceduro te zbirke podatkov, `shop.sys.sp_addextendedproperty`. Pri kateri koli drugi vrednosti nastavitve `Bracket` je celotno ime tabela v `dbo`.
- SQLite ne hrani komentarjev, zato vsakega zapiše kot vrstico `--` nad tem, kar opisuje: `-- Members` nad `CREATE TABLE member` in `-- Member ID` nad stolpcem.

Narekovaj znotraj komentarja v narekovajih se podvoji, kot v `'it''s'` in `N'it''s'`, prav tako narekovaj v imenih, ki jih posredujejo klici MSSQL. Databricks pa narekovaj in poševnico nazaj zapiše v ubežni obliki s poševnico nazaj, kot v `'it\'s'`, kar je oblika, ki jo prebere vsaka izdaja Spark. Vrstice `--` pri SQLite niso v narekovajih, zato narekovaj ohranijo tako, kot je vnesen: `-- it's`.  
Besedilo se sicer zapiše tako, kot je vneseno, vključno s prelomi vrstic, razen pri dveh zbirkah podatkov:

- Oracle izpusti prazne vrstice, pri čemer vrstica iz samih presledkov ali tabulatorjev šteje za prazno, ker SQL\*Plus stavek konča pri prazni vrstici in njegov preostanek preskoči. Komentar tabele iz `Members`, prazne vrstice in `Active only` se zapiše kot `COMMENT ON TABLE member IS 'Members` z `Active only';` v naslednji vrstici.
- SQLite vsako zaporedje prelomov vrstic zapiše kot en presledek, ker bi prelom vrstice končal vrstico `--`, preostanek pa bi se izvedel kot SQL. Isti komentar se zapiše kot `-- Members Active only`.

Kako se ti komentarji preberejo nazaj pri uvozu, je opisano v razdelku [Komentarji](./file-import-export.md#comments).

## Urejevalniki samo za branje {#read-only-editors}

V urejevalniku z lastnostjo `readonly` zavihek deluje kot običajno: `Database` in `Bracket` še vedno spremenita prikazano kodo SQL, `Statements`, `Header`, `Write logical names into empty comments` in `Tables` še vedno delujejo, `Save file` in `Copy` pa jo še vedno shranita in kopirata.  
Le polji za skripta sta samo za branje.
