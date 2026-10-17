---
sidebar_position: 11
description: Zobrazenie kódu DDL diagramu na karte Schéma SQL, výber databázy, úvodzoviek, príkazov, hlavičky a tabuliek v jej paneli možností, pridanie vlastných skriptov pred tabuľkami a za tabuľkami a uloženie alebo kopírovanie kódu SQL.
---

# Schéma SQL

Karta `Schema SQL` zobrazuje kód DDL diagramu pre vybratú databázu: kód SQL, ktorý vytvorí jeho tabuľky s ich kľúčmi, indexmi a cudzími kľúčmi.  
Prepnite na kartu `Schema SQL` na paneli nástrojov alebo v [rýchlom vyhľadávaní](./quick-search.md) vyberte položku `Schema SQL` pod položkou `Tab`. Kartu otvorí aj výber položky `Schema SQL` v podponuke `Export`, a to pripravenú na uloženie – pozrite si časť [Uloženie alebo kopírovanie SQL](#saving-or-copying-the-sql).

Kód SQL je vľavo a napravo od neho panel možností s nadpisom `Schema SQL` obsahuje voľby, ktoré určujú jeho podobu – pozrite si časť [Panel možností](#options-panel). Aj v jazyku zobrazenia písanom sprava doľava zostáva kód SQL vľavo a číta sa zľava doprava.  
Panel sa otvorí sám, ak editor pri prvom otvorení karty nie je užší ako 640 px. Tlačidlo `Hide options` v záhlaví panela ho zbalí a tlačidlo `Show options` v pravom hornom rohu kódu ho znova otvorí. Potom zostáva otvorený alebo zbalený tak, ako ste ho nechali, aj pri prepínaní kariet, kým je editor otvorený. Zbaľuje sa a otvára nezávisle od panela na karte Generátor kódu a nikdy sa neukladá do súboru.

![Otvorenie Export > Schema SQL, prepnutie príkazov na Drop & re-create a hlavičky na USE, potom pridanie skriptu SET NAMES pred tabuľkami](/img/demo-schema-sql-options.webp)

Kliknutím pravým tlačidlom na kód SQL otvoríte jeho kontextovú ponuku:

- `Database` a `Bracket`, obe podponuky so začiarknutou aktuálnou hodnotou.
- `Statements` a `Header`, obe podponuky so začiarknutou práve platnou voľbou. Voľba, ktorú databáza nepodporuje, má pri sebe tlmené upozornenie, napríklad `not in Oracle`, a nemá žiadny účinok.
- `Options panel`, položka, ktorá je začiarknutá, kým je panel zobrazený, a ktorá ho zbalí alebo otvorí.
- `Save file`

Kým je táto karta otvorená, rýchle vyhľadávanie ponúka položky `Database` a `Bracket`, položky `Schema SQL: Statements` a `Schema SQL: Header`, ktoré uvádzajú iba voľby podporované databázou, a položku `Schema SQL: Options panel`, ktorá zbalí alebo otvorí panel.

Kód SQL sa vygeneruje pri otvorení karty a znova vždy, keď sa zmení niektorá z volieb panela, názov databázy alebo skript. Úprava tabuliek vykonaná, kým je karta otvorená, napríklad úprava od spolupracovníka alebo programovacieho agenta, sa zobrazí, až keď kartu opustíte a vrátite sa na ňu alebo keď sa zmení niečo z uvedeného.

[Vlastnosti tabuľky](./table-related-functions.md#table-properties) majú vlastnú kartu `Schema SQL`, ktorá zobrazuje kód DDL jednej tabuľky. Vždy zapisuje obyčajné príkazy `CREATE` bez hlavičky a skriptov, nemá panel možností a jej kontextová ponuka obsahuje iba položky `Database` a `Bracket`.

## Panel možností {#options-panel}

Panel obsahuje tri skupiny, každú pod vlastným nadpisom:

1. `Saved in the document`: `Database` a `Bracket` – pozrite si časť [Databáza a úvodzovky](#database-and-bracket).
2. `This window only`: `Statements`, `Header` a, kým má diagram nejakú [skupinu tabuliek](./table-groups.md), `Tables` – pozrite si časti [Príkazy](#statements), [Hlavička](#header) a [Tabuľky](#tables).
3. `Saved in the document · written as is for every database`: skripty `Before tables` a `After tables` – pozrite si časť [Skripty pred tabuľkami a za nimi](#before-and-after-scripts).

V dolnej časti panela sú tlačidlá `Save file` a `Copy` – pozrite si časť [Uloženie alebo kopírovanie SQL](#saving-or-copying-the-sql).

Voľby v časti `This window only` patria k oknu editora, v ktorom ich nastavíte. Neukladajú sa do dokumentu, nezdieľajú sa so spolupracovníkmi ani sa nezaznamenávajú do histórie zmien a po zatvorení alebo opätovnom načítaní editora sa vrátia na počiatočné hodnoty; prepínanie kariet ich zachováva.  
Možnosť `Statements` je na začiatku nastavená na `If not exists` a možnosť `Header` na `CREATE + USE`. Kód SQL, ktorý číta stránka s vloženým editorom pomocou metódy [`getSchemaSQL()`](../../api/erd-editor-element.md#getschemasql), a kód SQL, ktorý číta programovací agent, naopak vychádzajú z nastavenia `Create` bez hlavičky.

Voľba, ktorú vybratá databáza nepodporuje, zostáva v paneli stlmená s bublinovým popisom `Not in <database>`, napríklad `Not in Oracle`, a jej stlačenie nemá žiadny účinok.  
Kód SQL potom použije najbližší tvar, ktorý databáza podporuje, a tlačidlo tohto tvaru sa zobrazí ako stlačené: namiesto `If not exists` sa použije `Create`, namiesto `CREATE + USE` sa použije `USE`, prípadne `None`, ak databáza nepodporuje ani `USE`, a namiesto `USE` sa použije `None`. Vaša voľba sa zachová, takže po prepnutí na databázu, ktorá ju podporuje, sa znova uplatní.

## Databáza a úvodzovky {#database-and-bracket}

Možnosť `Database` je databáza diagramu, rovnaké nastavenie ako položka `Database` v kontextovej ponuke plátna a databáza na karte Generátor kódu – pozrite si časť [Databázy](./table-related-functions.md#databases). Ponúka Databricks, MSSQL, MariaDB, MySQL, Oracle, PostgreSQL, Snowflake a SQLite, na začiatku je nastavená na MySQL a ukladá sa do súboru ako každá úprava.

Možnosť `Bracket` určuje úvodzovky okolo názvov tabuliek, stĺpcov, obmedzení a indexov: `SingleQuote`, `DoubleQuote`, `Backtick` alebo `None` pre názvy úplne bez úvodzoviek, čo je predvolená hodnota. Je to rovnaké nastavenie ako na karte Generátor kódu – pozrite si časť [Úvodzovky](./code-generator.md#bracket).  
Snowflake, ktorý názvy uzatvára iba do dvojitých úvodzoviek, ich použije pri každej voľbe okrem `None` a Databricks uzatvára názvy vždy do spätných apostrofov.  
Možnosť `Bracket` sa ukladá do súboru iba vtedy, keď je zamknutie `Bracket Type` na karte Nastavenia vypnuté, a nový diagram má zapnuté všetky zamknutia. Kým je zamknutie zapnuté, zmena prepíše kód SQL na obrazovke, no súbor si ponechá zamknutú hodnotu a diagram sa s ňou znova otvorí – pozrite si časť [Zamknutie](./settings.md#lock).

Kým je databáza Oracle a kód SQL obsahuje názov dlhší ako 30 bajtov, ktorý Oracle 12.1 a staršie verzie odmietajú, upozornenie pod oboma zoznamami vymenuje každý taký názov: `Oracle 12.2+ for names over 30 bytes: <names>`. Kontrolujú sa názvy tabuliek, stĺpcov, schém, kľúčov, indexov, sekvencií a spúšťačov. Samotný kód SQL sa nemení.

## Príkazy {#statements}

Možnosť `Statements` určuje, ako sa tabuľky vytvoria:

- `Create` zapíše obyčajné príkazy `CREATE`.
- `If not exists` preskočí tabuľky a indexy, ktoré už existujú. Túto voľbu podporujú MySQL, MariaDB, PostgreSQL, SQLite a Databricks; MSSQL, Oracle a Snowflake namiesto nej zapíšu `Create`.
  - MySQL zapíše každú tabuľku ako `CREATE TABLE IF NOT EXISTS` s jej obmedzeniami jedinečnosti, indexmi a cudzími kľúčmi vo vnútri a celú dávku umiestni medzi `SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;` a `SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;`.
  - MariaDB pridá `IF NOT EXISTS` ku každému príkazu: k príkazu `CREATE TABLE`, ku každému obmedzeniu `UNIQUE` a `FOREIGN KEY` a ku každému príkazu `CREATE INDEX`.
  - PostgreSQL zapíše `CREATE TABLE IF NOT EXISTS` a `CREATE INDEX IF NOT EXISTS` a každý cudzí kľúč pred opätovným pridaním odstráni pomocou `DROP CONSTRAINT IF EXISTS`.
  - SQLite zapíše `CREATE TABLE IF NOT EXISTS` a `CREATE INDEX IF NOT EXISTS`.
  - Databricks zapíše `CREATE TABLE IF NOT EXISTS` a každý cudzí kľúč pred opätovným pridaním odstráni pomocou `DROP CONSTRAINT IF EXISTS`.
- `Drop & re-create` odstráni každú zapisovanú tabuľku pred jej opätovným vytvorením, s výnimkou Snowflake. Túto voľbu podporuje každá databáza:
  - MySQL a MariaDB zapíšu pre každú tabuľku `DROP TABLE IF EXISTS`, a to medzi tie isté dva riadky, ktoré vypnú a opäť zapnú kontrolu cudzích kľúčov.
  - PostgreSQL zapíše jeden príkaz `DROP TABLE IF EXISTS`, ktorý uvádza všetky tabuľky a ktorý zlyhá, ak na niektorú z nich odkazuje tabuľka mimo zoznamu. Pri hlavičke `CREATE + USE` sa tabuľka, ktorej názov neuvádza schému, odstráni z tejto schémy, napríklad `shop.member`.
  - MSSQL zapíše jednu transakciu, ktorá vyžaduje SQL Server 2016 alebo novší, ako uvádza bublinový popis tlačidla, ktorý znie `SQL Server 2016+`. Odstráni cudzie kľúče, ktoré zapisované tabuľky obsahujú, potom tabuľky jedným príkazom `DROP TABLE IF EXISTS` a pri chybe zmeny vráti späť. Cudzí kľúč, ktorý obsahuje tabuľka mimo zoznamu, odstránenie aj tak zablokuje.
  - SQLite zapíše `PRAGMA foreign_keys=OFF;`, takže kontrola cudzích kľúčov zostane pre dané pripojenie vypnutá, a potom pre každú tabuľku `DROP TABLE IF EXISTS`.
  - Oracle zapíše pre každú tabuľku `DROP TABLE … CASCADE CONSTRAINTS` a pre každú sekvenciu automatického prírastku `DROP SEQUENCE`, každý z nich v bloku PL/SQL, ktorý končí riadkom `/` a ignoruje chybu, ktorú vyvolá chýbajúca tabuľka alebo sekvencia.
  - Databricks zapíše pre každú tabuľku `DROP TABLE IF EXISTS`.
  - Snowflake nič neodstráni a namiesto toho zapíše `CREATE OR REPLACE TABLE`.

Kým platí voľba `Drop & re-create`, varovanie v paneli vymenuje tabuľky, ktoré odstráni: `Drops <tables> before creating them. Their rows are lost.` alebo v Snowflake `Replaces <tables>. Their rows are lost.`  
Ak ide najviac o päť tabuliek, vymenujú sa všetky. Ak ich je viac ako päť, varovanie uvedie prvé štyri a zvyšné spočíta, napríklad `a, b, c, d, and 3 more tables`.

## Hlavička {#header}

Možnosť `Header` začne kód SQL príkazmi, ktoré vytvoria alebo vyberú databázu, prípadne schému, v ktorej sa kód spúšťa. Názov je názov databázy diagramu zadaný do poľa `database name` na paneli nástrojov a uzatvára sa do úvodzoviek zvolených v možnosti `Bracket`.

- MySQL a MariaDB: `USE` zapíše `USE shop;` a `CREATE + USE` pred tým zapíše `CREATE DATABASE IF NOT EXISTS shop;`.
- MSSQL: `USE` zapíše `USE shop` a `GO`, kým `CREATE + USE` pred tým zapíše `IF DB_ID(N'shop') IS NULL CREATE DATABASE shop` a `GO`.
- PostgreSQL podporuje iba voľbu `CREATE + USE`, ktorá zapíše `CREATE SCHEMA IF NOT EXISTS shop;` a `SET search_path TO shop, public;`.
- Oracle podporuje iba voľbu `USE`, ktorá zapíše `ALTER SESSION SET CURRENT_SCHEMA = shop;`. Namiesto `CREATE + USE` sa použije práve ona, takže tento riadok Oracle zapíše pri predvolenej hlavičke karty.
- Snowflake a Databricks: `USE` zapíše `USE SCHEMA shop;` a `CREATE + USE` pred tým zapíše `CREATE SCHEMA IF NOT EXISTS shop;`.
- SQLite nepodporuje ani jednu a nezapíše žiadnu hlavičku.

Ak databáza podporuje `USE` alebo `CREATE + USE`, bublinový popis tlačidla uvádza, čo v nej zapíše, napríklad `CREATE SCHEMA + SET search_path` v PostgreSQL.

Hlavička sa zapíše iba vtedy, keď je názov databázy jednoduchý identifikátor: písmeno ASCII (`A`–`Z`, `a`–`z`) alebo `_`, za ktorým nasledujú písmená ASCII, číslice alebo `_`.  
Pri akomkoľvek inom názve vrátane prázdneho sa hlavička nezapíše a príkaz `DROP TABLE` v PostgreSQL potom neuvádza žiadnu schému. Kým platí iná hlavička ako `None`, upozornenie pod možnosťou `Header` to oznámi: `Database name "<name>" is not a valid identifier.`  
Nový diagram má prázdny názov databázy, takže kým ho nezadáte, panel zobrazuje `Database name "" is not a valid identifier.`

## Tabuľky {#tables}

Kým má diagram aspoň jednu [skupinu tabuliek](./table-groups.md), zobrazenú alebo skrytú, v časti `This window only` sa zobrazuje možnosť `Tables` so začiarkavacím políčkom pre každú voľbu:

- `All`, políčko, ktoré začiarkne alebo zruší začiarknutie všetkých políčok. Kým sú začiarknuté iba niektoré, zobrazuje neurčitý stav.
- Jedno políčko pre každú skupinu tabuliek v poradí skupín v diagrame, označené názvom skupiny, pri skupine bez názvu `unnamed`, za bodkou vo farbe skupiny, ak má skupina farbu.
- `No group` pre tabuľky, ktoré nepatria do žiadnej skupiny.

Keď sú začiarknuté všetky políčka, karta zapíše celý diagram.  
Keď sú začiarknuté iba niektoré, zapíše tabuľky začiarknutých políčok s ich indexmi a cudzími kľúčmi, ktoré tieto tabuľky obsahujú, vrátane takého, ktorý odkazuje na vynechanú tabuľku. Skripty pred tabuľkami a za tabuľkami sa zapíšu aj tak a voľba `Drop & re-create`, jej varovanie a upozornenie na dlhé názvy v Oracle sa týkajú iba týchto tabuliek.  
Keď nie je začiarknuté žiadne políčko, karta nezapíše nič a nad kódom sa zobrazí informácia `No tables chosen. Check some under Tables.` Tlačidlo `Save file` potom uloží prázdny súbor a tlačidlo `Copy` skopíruje prázdny text.

Rovnako ako pri možnostiach `Statements` a `Header` patrí táto voľba k oknu – pozrite si časť [Panel možností](#options-panel).  
Skupina pridaná neskôr je na začiatku začiarknutá, iba ak boli v tej chvíli začiarknuté všetky políčka. Odstránením skupiny zmizne jej políčko a odstránením poslednej skupiny sa znova začiarkne všetko.  
Voľba platí iba pre túto kartu. Karta `Schema SQL` v paneli Vlastnosti tabuľky a metóda `getSchemaSQL()` ňou nie sú ovplyvnené.

## Skripty pred tabuľkami a za nimi {#before-and-after-scripts}

Polia `Before tables` a `After tables` obsahujú vlastný kód SQL, napríklad príkazy `CREATE EXTENSION` alebo `SET` pred tabuľkami, prípadne udelenia práv, pohľady a počiatočné údaje za nimi.  
Ukladajú sa do dokumentu, jedna dvojica pre celý diagram bez ohľadu na databázu. Každý skript sa do kódu SQL zapíše tak, ako ste ho napísali, bez akejkoľvek kontroly: skript pred tabuľkami za hlavičku a pred príkazy `DROP` a tabuľky, skript za tabuľkami úplne na koniec.

Zalomenia riadkov sa zapisujú ako LF a prázdne riadky pred skriptom a prázdne znaky za ním sa vynechajú.  
V MSSQL sa za skript, ktorého posledný riadok nie je `GO` (ani `GO` s počtom), pridá riadok `GO`, ako uvádza riadok pod oboma poľami. V Oracle ukončite blok PL/SQL riadkom `/` sami.

Polia zvýrazňujú syntax SQL a zväčšujú sa spolu s textom.  
Úprava sa použije, keď pole opustíte kliknutím inam alebo prepnutím karty, a až potom sa zmení kód SQL vedľa neho a dokument. Pole, do ktorého ste iba klikli, nič nezmení.  
Úprava skriptu mení diagram ako každá iná úprava: uloží sa do súboru, spolupracovníci ju vidia a každá použitá úprava je jeden krok [histórie zmien](./undo-redo.md), ktorý vrátite späť na karte ERD.  
Kým píšete do poľa, editor mu prenecháva svoje klávesové skratky, takže `Ctrl + Z` (Windows/Linux) alebo `⌘ + Z` (Mac) vráti späť písanie v ňom a kopírovanie, vystrihnutie a prilepenie pôsobia na text, nie na diagram.  
Rýchle vyhľadávanie a [vyhľadávanie v prieskumníkovi](./find-and-replace.md) sa naďalej otvárajú svojimi klávesovými skratkami, `Ctrl + K` a `Ctrl + F` (Windows/Linux) alebo `⌘ + K` a `⌘ + F` (Mac). Keďže `Ctrl + F` alebo `⌘ + F` prepne na kartu ERD, použije vašu úpravu rovnako ako každé prepnutie karty.  
Pole bez fokusu klávesnice prevezme zmenu, ktorú v jeho skripte urobí spolupracovník alebo [programovací agent](../../mcp/tools.md#settings). Pole, v ktorom sa práve nachádzate, zobrazí takú zmenu, keď ho opustíte bez toho, aby ste písali. Ak ste písali, pri opustení sa použije váš text a nahradí ich zmenu.

## Uloženie alebo kopírovanie SQL {#saving-or-copying-the-sql}

`Save file` v dolnej časti panela alebo v kontextovej ponuke uloží presne ten kód SQL, ktorý karta zobrazuje, s aktuálnou databázou, úvodzovkami, príkazmi, hlavičkou, tabuľkami a skriptmi, ako súbor `<database name>-<timestamp>.sql`. Súbor sa pomenuje a uloží ako pri každom inom exporte – pozrite si časť [Export](./file-import-export.md#exporting).

Položka `Export` ▸ `Schema SQL` v kontextovej ponuke plátna alebo v rýchlom vyhľadávaní sama osebe nič neuloží.  
Prepne na túto kartu, otvorí panel možností, aj keď bol zbalený, a presunie fokus klávesnice na tlačidlo `Save file`, takže stlačením klávesu `Enter` súbor uložíte.

Tlačidlo `Copy` v dolnej časti panela alebo tlačidlo kopírovania, ktoré sa zobrazí v pravom hornom rohu kódu, keď nad ním podržíte ukazovateľ, skopíruje kód SQL.  
Na dve sekundy to potvrdí oznámenie `Copied!` so značkou začiarknutia. Ak prehliadač alebo hostiteľská aplikácia odmietne prístup do schránky, upozorní na to namiesto toho oznámenie `Couldn't copy to the clipboard` s výstražným symbolom. Opätovné kopírovanie oznámenie nahradí, namiesto aby pridalo ďalšie.  
Kód SQL sa dá aj vyberať, takže si môžete vziať iba jeho časť.

## Čo sa zapisuje do DDL {#what-the-ddl-writes}

Tieto pravidlá platia všade, kde editor zapisuje schému SQL: na tejto karte a v jej súbore, ako aj v kóde SQL, ktorý číta stránka s vloženým editorom alebo programovací agent.  
Karta `Schema SQL` v paneli Vlastnosti tabuľky sa nimi riadi pre jedinú tabuľku, ktorú zobrazuje. Nezapisuje cudzie kľúče okrem tých v SQLite, ktoré sú súčasťou jej príkazu `CREATE TABLE`, ani sekvenciu či spúšťač pre Oracle.

Časti nasledujú v tomto poradí, oddelené jedným prázdnym riadkom: hlavička, skript pred tabuľkami, príkazy `DROP`, tabuľky a skript za tabuľkami. Tabuľky sa zapisujú v poradí podľa názvu.  
Pre diagram bez tabuliek a bez skriptov sa nezapíše nič, ani keď je vybratá hlavička.

### Automatický prírastok {#auto-increment}

Stĺpec označený príznakom `Auto Increment` sa zapíše spôsobom, ktorý používa daná databáza: `AUTO_INCREMENT` v MySQL a MariaDB, `IDENTITY(1,1)` v MSSQL, `AUTOINCREMENT` v Snowflake a `GENERATED ALWAYS AS IDENTITY` v PostgreSQL a Databricks.  
Oracle dostane sekvenciu `SEQ_<table>` a spúšťač `SEQ_TRG_<table>`, ktorý z nej plní stĺpec. Spúšťač končí riadkom `/`, takže ho SQL\*Plus a SQLcl spustia.

Ak databáza nepodporuje automatický prírastok pre typ stĺpca, klauzula sa vynechá a riadok komentára za tabuľkou uvedie názov stĺpca:

- PostgreSQL ho podporuje iba pre `smallint`, `integer` alebo `bigint` pod ktorýmkoľvek z ich názvov: `INT`, `INTEGER`, `BIGINT`, `SMALLINT`, `INT2`, `INT4` alebo `INT8`. Stĺpec iného typu nedostane ani klauzulu, ani predvolenú hodnotu a komentár znie napríklad `-- PostgreSQL takes IDENTITY only on smallint, integer or bigint, so member.id is written without it.`
- Databricks ho podporuje iba pre `BIGINT` alebo `LONG`.
- SQLite podporuje `AUTOINCREMENT` iba pre jediný stĺpec primárneho kľúča tabuľky s celočíselným typom, napríklad `INT`, `BIGINT` alebo `INT8`, so šírkou alebo bez nej. Tento stĺpec sa zapíše ako `INTEGER` a kľúč ako `PRIMARY KEY (id AUTOINCREMENT)`. Jediný kľúč akéhokoľvek iného typu sa zapíše bez neho.

### Referenčné akcie {#referential-actions}

Ktoré akcie ON DELETE a ON UPDATE jednotlivé databázy zapisujú, uvádza časť [ON DELETE a ON UPDATE](./relationship-editing.md#on-delete-and-on-update).  
Ak Snowflake niektorú akciu vynechá, komentár nad príkazom `ALTER TABLE` tohto cudzieho kľúča ju uvedie, napríklad `-- Snowflake creates no foreign key with a referential action other than NO ACTION, so ON DELETE CASCADE is left out.`

### Názvy tabuliek so schémou {#schema-qualified-table-names}

Keď je možnosť `Bracket` nastavená na `None`, názov tabuľky s bodkou, napríklad `sales.users`, sa chápe ako schéma a tabuľka, rozdelené pri poslednej bodke mimo hranatých zátvoriek alebo dvojitých úvodzoviek.

- MySQL, MariaDB, MSSQL, Oracle a PostgreSQL tvoria automatické názvy, ktoré zapisujú, iba z časti, ktorá označuje tabuľku: `FK_users_TO_orders` a `IDX_users` vo všetkých piatich, `UQ_users_email` vo všetkých okrem PostgreSQL a `PK_users` v MSSQL a Oracle, jediných dvoch z nich, ktoré pomenúvajú primárny kľúč. V týchto dvoch vznikne `PK_users` aj z `[sales].[users]` a `"sales"."users"` a z `[Order]` vznikne `PK_Order`.
- SQLite nepomenúva žiadne obmedzenia, takže jediný automatický názov, ktorý tvorí, je názov indexu: `CREATE INDEX sales.IDX_users ON users`.
- Oracle vytvorí indexy tabuľky a sekvenciu a spúšťač stĺpca s automatickým prírastkom v schéme tabuľky: `sales.IDX_users`, `sales.SEQ_users` a `sales.SEQ_TRG_users`.
- V Oracle a SQLite si názov indexu, ktorému ste schému zadali sami, ju ponechá.
- Automatický názov cudzieho kľúča alebo indexu, ktorý bez ohľadu na veľkosť písmen opakuje skorší názov, dostane číslo. Ak na `sales.users` aj `hr.Users` odkazuje tabuľka `orders`, druhý kľúč je `FK_Users_TO_orders1`.

Pri akejkoľvek inej hodnote možnosti `Bracket` je celý názov tabuľky jeden identifikátor, napríklad `"PK_sales.users"`. Snowflake a Databricks vždy ponechávajú celý názov.  
Riadky `Keys` na karte [Indexy](./table-related-functions.md#indexes) zobrazujú rovnaké názvy.

### Predvolené hodnoty {#defaults}

Predvolená hodnota stĺpca sa zapíše tak, ako ste ju zadali, ale v zátvorkách tam, kde databáza daný výraz prečíta iba v nich. Predvolená hodnota, ktorá už je v zátvorkách, sa ponechá bez zmeny.

- MySQL uzavrie do zátvoriek všetko okrem literálu alebo aktuálneho času, napríklad `(uuid())`. Do zátvoriek uzavrie aj akúkoľvek predvolenú hodnotu okrem `NULL` pri stĺpci typu `BLOB`, `TEXT`, `JSON`, priestorového typu alebo `LONG…` a aktuálny čas pri akomkoľvek stĺpci okrem `TIMESTAMP` alebo `DATETIME`.
- MariaDB uzavrie do zátvoriek všetko okrem literálu, aktuálneho času, volania funkcie alebo názvu.
- SQLite uzavrie do zátvoriek všetko okrem literálu alebo názvu, napríklad `(datetime('now'))`.
- PostgreSQL uzavrie do zátvoriek iba výraz, ktorý mimo zátvoriek obsahuje slovo ako `AT TIME ZONE`, `AND`, `OR`, `IS`, `IN`, `LIKE`, `COLLATE` alebo `= ANY`, napríklad `(now() AT TIME ZONE 'utc')`.
- MSSQL, Oracle, Snowflake a Databricks zapíšu každú predvolenú hodnotu tak, ako bola zadaná.

## Editory iba na čítanie {#read-only-editors}

V editore s atribútom `readonly` funguje karta ako zvyčajne: `Database` a `Bracket` naďalej menia zobrazený kód SQL, `Statements`, `Header` a `Tables` naďalej fungujú a `Save file` a `Copy` ho naďalej ukladajú a kopírujú.  
Len dve polia skriptov sú iba na čítanie.
