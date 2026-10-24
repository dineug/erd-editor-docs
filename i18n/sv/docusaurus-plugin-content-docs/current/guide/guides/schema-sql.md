---
sidebar_position: 12
description: Läs diagrammets DDL på fliken Schema SQL, välj databas, citattecken, satser, inledning, logiska namn i tomma kommentarer och tabeller i dess alternativpanel, lägg till egna skript före och efter tabellerna och spara eller kopiera SQL-koden.
---

# Schema SQL

Fliken `Schema SQL` visar diagrammets DDL för den valda databasen: den SQL-kod som skapar dess tabeller med deras nycklar, index och sekundärnycklar.  
Byt till fliken `Schema SQL` i verktygsfältet eller välj `Schema SQL` under `Tab` i [snabbsökningen](./quick-search.md). Om du väljer `Schema SQL` i undermenyn `Export` öppnas fliken också, redo att sparas – se [Spara eller kopiera SQL-koden](#saving-or-copying-the-sql).

SQL-koden står till vänster, och till höger om den finns en alternativpanel med rubriken `Schema SQL` som innehåller de val som formar koden – se [Alternativpanelen](#options-panel). Även i ett visningsspråk som skrivs från höger till vänster står SQL-koden kvar till vänster och läses från vänster till höger.  
Panelen öppnas av sig själv om editorn inte är smalare än 640 px när fliken öppnas första gången. `Hide options` i panelens rubrikrad fäller ihop den, och `Show options` längst upp till höger i koden tar fram den igen. Därefter förblir den öppen eller ihopfälld så som du lämnade den, även när du byter flik, så länge editorn är öppen. Den fälls ihop och öppnas oberoende av panelen på fliken Kodgenerator och sparas aldrig i filen.

![Export > Schema SQL öppnas, satserna byts till Drop & re-create och inledningen till USE, och sedan läggs ett SET NAMES-skript till före tabellerna](/img/demo-schema-sql-options.webp)

Högerklicka på SQL-koden för att öppna dess snabbmeny:

- `Database` och `Bracket`, båda undermenyer där det aktuella värdet är ikryssat.
- `Statements` och `Header`, båda undermenyer där det val som gäller är ikryssat. Ett val som databasen inte har får en nedtonad notering, till exempel `not in Oracle`, och gör ingenting.
- `Options panel`, som är ikryssat medan panelen visas och som fäller ihop eller öppnar den.
- `Save file`

Medan den här fliken är öppen erbjuder snabbsökningen `Database` och `Bracket`; `Schema SQL: Statements` och `Schema SQL: Header`, som bara listar de val som databasen har; och `Schema SQL: Options panel`, som fäller ihop eller öppnar panelen.  
Varken snabbmenyn eller snabbsökningen erbjuder `Write logical names into empty comments`, som bara finns i alternativpanelen – se [Logiska namn som kommentarer](#logical-names-as-comments).

SQL-koden skrivs när fliken öppnas, och igen varje gång ett av panelens val, databasnamnet eller ett skript ändras. En ändring i tabellerna medan fliken är öppen, till exempel från en medarbetare eller en kodagent, visas när du lämnar fliken och kommer tillbaka, eller när något av dem ändras.

Panelen [Tabellegenskaper](./table-related-functions.md#table-properties) har en egen flik `Schema SQL` som visar en enskild tabells DDL. Den skriver alltid vanliga satser med `CREATE` utan inledning eller skript, skriver aldrig ett logiskt namn i en tom kommentar, har ingen alternativpanel, och dess snabbmeny erbjuder bara `Database` och `Bracket`.

## Alternativpanelen {#options-panel}

Panelen innehåller tre grupper, var och en under en rubrik:

1. `Saved in the document`: `Database` och `Bracket` – se [Databas och citattecken](#database-and-bracket).
2. `This window only`: `Statements`, `Header`, `Write logical names into empty comments` och, medan diagrammet har en [tabellgrupp](./table-groups.md), `Tables` – se [Satser](#statements), [Inledning](#header), [Logiska namn som kommentarer](#logical-names-as-comments) och [Tabeller](#tables).
3. `Saved in the document · written as is for every database`: skripten `Before tables` och `After tables` – se [Skript före och efter tabellerna](#before-and-after-scripts).

`Save file` och `Copy` finns längst ned i panelen – se [Spara eller kopiera SQL-koden](#saving-or-copying-the-sql).

Valen under `This window only` hör till det editorfönster där du gör dem. De sparas inte i dokumentet, delas inte med medarbetare och registreras inte i ångrahistoriken, och de återställs när editorn stängs eller läses in på nytt; ett flikbyte behåller dem.  
`Statements` börjar på `If not exists` och `Header` på `CREATE + USE`, och `Write logical names into empty comments` är av från början. Den SQL-kod som en sida med inbäddad editor läser med [`getSchemaSQL()`](../../api/erd-editor-element.md#getschemasql), och den SQL-kod som en [kodagent läser](../../mcp/tools.md#reading-a-document), börjar i stället på `Create` utan inledning och skriver inga logiska namn om den inte ombeds att göra det.

Ett val som den valda databasen inte har står kvar i panelen, nedtonat, med knappbeskrivningen `Not in <database>`, till exempel `Not in Oracle`, och ett tryck på det gör ingenting.  
SQL-koden använder då den närmaste form som databasen har, och knappen för den formen visas intryckt: `If not exists` faller tillbaka på `Create`, `CREATE + USE` på `USE`, eller på `None` där databasen inte heller har `USE`, och `USE` på `None`. Ditt val behålls, så om du byter till en databas som har det kommer det tillbaka.

## Databas och citattecken {#database-and-bracket}

`Database` är diagrammets databas, samma inställning som `Database` i arbetsytans snabbmeny och i kodgeneratorn – se [Databaser](./table-related-functions.md#databases). Den listar Databricks, MSSQL, MariaDB, MySQL, Oracle, PostgreSQL, Snowflake och SQLite, börjar på MySQL och sparas i filen som alla andra ändringar.

`Bracket` anger vilket citattecken som omger tabell-, kolumn-, begränsnings- och indexnamn: `SingleQuote`, `DoubleQuote`, `Backtick` eller `None` för inga citattecken alls, vilket är standard. Det är samma inställning som i kodgeneratorn – se [Citattecken](./code-generator.md#bracket).  
Snowflake, som bara sätter namn inom dubbla citattecken, använder dem vid alla val utom `None`, och Databricks sätter alltid namn inom grava accenter.  
`Bracket` sparas bara i filen medan låset `Bracket Type` på fliken Inställningar är av, och i ett nytt diagram är alla lås på. Medan låset är på skriver en ändring om SQL-koden på din skärm, men filen behåller det låsta värdet och diagrammet öppnas igen med det – se [Lås](./settings.md#lock).

Medan databasen är Oracle och SQL-koden innehåller ett namn som är längre än 30 byte, vilket Oracle 12.1 och äldre inte godtar, namnger en notering under de två listorna vart och ett av dem: `Oracle 12.2+ for names over 30 bytes: <names>`. Den kontrollerar tabell-, kolumn-, schema-, nyckel-, index-, sekvens- och triggernamn. Själva SQL-koden ändras inte.

## Satser {#statements}

`Statements` avgör hur tabellerna skapas:

- `Create` skriver vanliga satser med `CREATE`.
- `If not exists` hoppar över de tabeller och index som redan finns. MySQL, MariaDB, PostgreSQL, SQLite och Databricks har det; MSSQL, Oracle och Snowflake skriver `Create` i stället.
  - MySQL skriver varje tabell som `CREATE TABLE IF NOT EXISTS` med dess unika begränsningar, index och sekundärnycklar inuti, och placerar alltihop mellan `SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;` och `SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;`.
  - MariaDB sätter `IF NOT EXISTS` på varje sats: `CREATE TABLE`, varje begränsning `UNIQUE` och `FOREIGN KEY` samt varje `CREATE INDEX`.
  - PostgreSQL skriver `CREATE TABLE IF NOT EXISTS` och `CREATE INDEX IF NOT EXISTS`, och tar bort varje sekundärnyckel med `DROP CONSTRAINT IF EXISTS` innan den läggs till igen.
  - SQLite skriver `CREATE TABLE IF NOT EXISTS` och `CREATE INDEX IF NOT EXISTS`.
  - Databricks skriver `CREATE TABLE IF NOT EXISTS` och tar bort varje sekundärnyckel med `DROP CONSTRAINT IF EXISTS` innan den läggs till igen.
- `Drop & re-create` tar bort alla tabeller som skrivs innan de skapas igen, utom i Snowflake. Alla databaser har det:
  - MySQL och MariaDB skriver en `DROP TABLE IF EXISTS` för varje tabell, mellan samma två rader som slår av och åter på kontrollen av sekundärnycklar.
  - PostgreSQL skriver en enda `DROP TABLE IF EXISTS` som namnger alla tabeller, vilket misslyckas om en tabell utanför listan refererar till någon av dem. Med inledningen `CREATE + USE` tas en tabell vars namn inte anger något schema bort ur det schemat, till exempel `shop.member`.
  - MSSQL skriver en enda transaktion, som kräver SQL Server 2016 eller senare, vilket knappbeskrivningen `SQL Server 2016+` på knappen anger. Den tar bort de sekundärnycklar som de skrivna tabellerna har, sedan tabellerna med en enda `DROP TABLE IF EXISTS`, och rullar tillbaka vid ett fel. En sekundärnyckel som en tabell utanför listan har blockerar ändå borttagningen.
  - SQLite skriver `PRAGMA foreign_keys=OFF;`, vilket förblir av för den anslutningen, och sedan en `DROP TABLE IF EXISTS` för varje tabell.
  - Oracle skriver `DROP TABLE … CASCADE CONSTRAINTS` för varje tabell och `DROP SEQUENCE` för varje sekvens för automatisk uppräkning, var och en i ett PL/SQL-block som slutar med en rad med `/` och som hoppar över det fel som en saknad tabell eller sekvens orsakar.
  - Databricks skriver en `DROP TABLE IF EXISTS` för varje tabell.
  - Snowflake tar inte bort något och skriver `CREATE OR REPLACE TABLE` i stället.

Medan `Drop & re-create` gäller namnger en varning i panelen de tabeller som tas bort: `Drops <tables> before creating them. Their rows are lost.`, eller i Snowflake `Replaces <tables>. Their rows are lost.`  
Upp till fem tabeller namnges fullständigt. Vid fler än fem namnger varningen de fyra första och räknar resten, till exempel `a, b, c, d, and 3 more tables`.

## Inledning {#header}

`Header` inleder SQL-koden med de satser som skapar eller väljer den databas, eller det schema, som koden körs i. Namnet är diagrammets databasnamn, som skrivs i fältet `database name` i verktygsfältet, och omges av tecknet som `Bracket` anger.

- MySQL och MariaDB: `USE` skriver `USE shop;`, och `CREATE + USE` skriver `CREATE DATABASE IF NOT EXISTS shop;` före den.
- MSSQL: `USE` skriver `USE shop` och `GO`, och `CREATE + USE` skriver `IF DB_ID(N'shop') IS NULL CREATE DATABASE shop` och `GO` före den.
- PostgreSQL har bara `CREATE + USE`, som skriver `CREATE SCHEMA IF NOT EXISTS shop;` och `SET search_path TO shop, public;`.
- Oracle har bara `USE`, som skriver `ALTER SESSION SET CURRENT_SCHEMA = shop;`. `CREATE + USE` faller tillbaka på det, så det är den här raden som Oracle skriver med flikens standardinledning.
- Snowflake och Databricks: `USE` skriver `USE SCHEMA shop;`, och `CREATE + USE` skriver `CREATE SCHEMA IF NOT EXISTS shop;` före den.
- SQLite har ingetdera och skriver ingen inledning.

Där databasen har `USE` eller `CREATE + USE` anger knappbeskrivningen på knappen vad den skriver där, till exempel `CREATE SCHEMA + SET search_path` i PostgreSQL.

En inledning skrivs bara medan databasnamnet är en enkel identifierare: en ASCII-bokstav (`A`–`Z`, `a`–`z`) eller `_`, följd av ASCII-bokstäver, siffror eller `_`.  
Med alla andra namn, även ett tomt, skrivs ingen inledning, och `DROP TABLE` i PostgreSQL namnger då inget schema. Medan en annan inledning än `None` gäller påpekar en notering under `Header` det: `Database name "<name>" is not a valid identifier.`  
I ett nytt diagram är databasnamnet tomt, så tills du ger databasen ett namn visar panelen `Database name "" is not a valid identifier.`

## Logiska namn som kommentarer {#logical-names-as-comments}

`Write logical names into empty comments`, en växlingsknapp under `This window only`, skriver det [logiska namnet](./logical-names.md) för en tabell eller kolumn i DDL-koden där dess kommentar är tom, i alla databaser.

![Write logical names into empty comments slås på i panelen Schema SQL, vilket skriver det logiska namnet för varje kolumn i order_items i dess tomma COMMENT medan kommentarerna i members står kvar](/img/demo-schema-sql-logical-names.webp)

- En kommentar med text har alltid företräde: det logiska namnet ersätter den aldrig och läggs aldrig till i den.
- En kommentar som bara består av blanktecken räknas som tom, så det logiska namnet skrivs i dess ställe. Ett logiskt namn som är tomt eller bara består av blanktecken skriver ingenting, och den tabellen eller kolumnen får fortfarande ingen kommentar.
- Det logiska namnet skrivs där och i den form som databasen skriver en kommentar, med citattecknen maskerade på samma sätt – se [Kommentarer](#comments).

I MySQL skrivs till exempel en kolumn `id` med det logiska namnet `Member ID` och utan kommentar med `COMMENT 'Member ID'`, medan en kolumn `email` med det logiska namnet `Email` och kommentaren `Sign-in address` behåller `COMMENT 'Sign-in address'`.

Precis som `Statements` och `Header` hör växlingsknappen till fönstret och är av från början – se [Alternativpanelen](#options-panel).  
En import läser aldrig tillbaka en sådan kommentar som ett logiskt namn – se [Kommentarer](./file-import-export.md#comments).

## Tabeller {#tables}

Medan diagrammet har minst en [tabellgrupp](./table-groups.md), synlig eller dold, visas `Tables` under `This window only` med en kryssruta för varje val:

- `All`, som kryssar i eller kryssar ur alla rutor. Den visar ett blandat läge medan bara vissa är ikryssade.
- En ruta per tabellgrupp, i diagrammets gruppordning, märkt med gruppens namn, eller `unnamed` för en grupp utan namn, efter en prick i gruppens färg när gruppen har en färg.
- `No group`, för de tabeller som inte ingår i någon grupp.

När alla rutor är ikryssade skriver fliken hela diagrammet.  
När bara vissa är ikryssade skriver den tabellerna för de ikryssade rutorna med deras index och de sekundärnycklar som de har, även en som refererar till en tabell som har utelämnats. Skripten före och efter tabellerna skrivs ändå, och `Drop & re-create`, dess varning och Oracle-noteringen om långa namn omfattar bara de tabellerna.  
När ingen ruta är ikryssad skriver fliken ingenting, och en ledtext över koden visar `No tables chosen. Check some under Tables.` `Save file` sparar då en tom fil, och `Copy` kopierar en tom text.

Precis som för `Statements` och `Header` hör valet till fönstret – se [Alternativpanelen](#options-panel).  
En grupp som läggs till senare börjar ikryssad bara om alla rutor var ikryssade i det ögonblicket. När en grupp tas bort försvinner dess ruta, och när den sista gruppen tas bort kryssas allt i igen.  
Valet gäller bara den här fliken. Fliken `Schema SQL` i panelen Tabellegenskaper och `getSchemaSQL()` påverkas inte av det.

## Skript före och efter tabellerna {#before-and-after-scripts}

`Before tables` och `After tables` innehåller din egen SQL-kod, till exempel satser med `CREATE EXTENSION` eller `SET` före tabellerna, eller behörigheter, vyer och startdata efter dem.  
De sparas i dokumentet, ett par för hela diagrammet oavsett databas. Vart och ett skrivs in i SQL-koden precis som du skrev det och kontrolleras aldrig: skriptet före tabellerna hamnar efter inledningen och före satserna med `DROP` och tabellerna, skriptet efter tabellerna allra sist.

Radbrytningar skrivs som LF, och tomma rader före ett skript och blanktecken efter det tas bort.  
I MSSQL läggs en rad med `GO` till efter ett skript vars sista rad inte är `GO` (eller `GO` med ett antal), som raden under de två fälten anger. I Oracle avslutar du själv ett PL/SQL-block med dess rad med `/`.

Fälten har syntaxmarkering för SQL och växer med sin text.  
En ändring tillämpas när du lämnar fältet, genom att klicka någon annanstans eller byta flik, och först då ändras SQL-koden bredvid och dokumentet. Ett fält som du bara klickade i ändrar ingenting.  
En ändring av ett skript ändrar diagrammet som alla andra ändringar: den sparas i filen, medarbetare ser den, och varje tillämpad ändring är ett steg i [ångrahistoriken](./undo-redo.md), som du ångrar från ERD-fliken.  
Medan du skriver i ett fält lämnas editorns egna kortkommandon åt fältet, så `Ctrl + Z` (Windows/Linux) eller `⌘ + Z` (Mac) ångrar det du skrev där, och kopiera, klipp ut och klistra in verkar på texten i stället för på diagrammet.  
Snabbsökningen och [utforskarens sökning](./find-and-replace.md) öppnas ändå med sina kortkommandon, `Ctrl + K` och `Ctrl + F` (Windows/Linux) eller `⌘ + K` och `⌘ + F` (Mac). Eftersom `Ctrl + F` eller `⌘ + F` byter till ERD-fliken tillämpar det din ändring, som alla flikbyten gör.  
Ett fält utan tangentbordsfokus följer en ändring som en medarbetare eller en [kodagent](../../mcp/tools.md#settings) gör i dess skript. Ett fält som du befinner dig i visar den ändringen när du lämnar det utan att ha skrivit något. Om du har skrivit tillämpas din text när du lämnar fältet och ersätter deras.

## Spara eller kopiera SQL-koden {#saving-or-copying-the-sql}

`Save file`, längst ned i panelen eller i snabbmenyn, sparar exakt den SQL-kod som fliken visar, med dess aktuella databas, citattecken, satser, inledning, kommentarer med logiska namn, tabeller och skript, som `<database name>-<timestamp>.sql`. Filen namnges och sparas som alla andra exporter – se [Exportera](./file-import-export.md#exporting).

`Export` ▸ `Schema SQL`, i arbetsytans snabbmeny eller i snabbsökningen, sparar ingenting av sig själv.  
Det byter till den här fliken, öppnar alternativpanelen även om den var ihopfälld och lägger tangentbordsfokus på `Save file`, så att ett tryck på `Enter` sparar filen.

`Copy` längst ned i panelen, eller kopieringsknappen som visas längst upp till höger i koden medan du håller pekaren över den, kopierar SQL-koden.  
Meddelandet `Copied!` med en bock bekräftar kopieringen i två sekunder. Om webbläsaren eller värdprogrammet nekar åtkomst till Urklipp talar meddelandet `Couldn't copy to the clipboard` med en varningssymbol om det i stället, i fem sekunder. En ny kopiering ersätter meddelandet i stället för att lägga till ett till.  
SQL-koden går också att markera, så du kan ta bara en del av den.

## Vad DDL-koden skriver {#what-the-ddl-writes}

De här reglerna gäller överallt där editorn skriver Schema SQL: på den här fliken och i dess fil, och i den SQL-kod som en sida med inbäddad editor eller en kodagent läser.  
Fliken `Schema SQL` i panelen Tabellegenskaper följer dem för den enda tabell som den visar. Den skriver ingen sekvens eller trigger för Oracle, och inga sekundärnycklar utom i SQLite, där de står inuti `CREATE TABLE`. Den skriver inte heller de kommentarssatser som PostgreSQL, Oracle och MSSQL placerar efter en tabell, så i de tre databaserna visar den inga kommentarer.

Delarna kommer i den här ordningen, åtskilda av en tom rad: inledningen, skriptet före tabellerna, satserna med `DROP`, tabellerna och skriptet efter tabellerna. Tabellerna skrivs i namnordning.  
För ett diagram utan tabeller och utan skript skrivs ingenting, även om en inledning är vald.

Tabeller och kolumner skrivs med sina fysiska namn, oavsett vad [namnvisningen](./logical-names.md#name-view) visar. En kolumn som är kopplad till en domän skrivs med sin egen datatyp, som domänen anger – se [Domäner och datatyper](./dictionary.md#domains-and-data-types).

### Automatisk uppräkning {#auto-increment}

En kolumn med flaggan `Auto Increment` skrivs på det sätt som varje databas skriver automatisk uppräkning: `AUTO_INCREMENT` i MySQL och MariaDB, `IDENTITY(1,1)` i MSSQL, `AUTOINCREMENT` i Snowflake och `GENERATED ALWAYS AS IDENTITY` i PostgreSQL och Databricks.  
Oracle får en sekvens `SEQ_<table>` och en trigger `SEQ_TRG_<table>` som fyller kolumnen från den. Triggern slutar med en rad med `/`, så att SQL\*Plus och SQLcl kör den.

Där en databas inte godtar automatisk uppräkning för kolumnens typ utelämnas klausulen, och en kommentarsrad efter tabellen namnger kolumnen:

- PostgreSQL godtar den bara för `smallint`, `integer` eller `bigint`, under vilket som helst av deras namn: `INT`, `INTEGER`, `BIGINT`, `SMALLINT`, `INT2`, `INT4` eller `INT8`. En kolumn av en annan typ får varken klausulen eller ett standardvärde, och kommentaren lyder till exempel `-- PostgreSQL takes IDENTITY only on smallint, integer or bigint, so member.id is written without it.`
- Databricks godtar den bara för `BIGINT` eller `LONG`.
- SQLite godtar `AUTOINCREMENT` bara för en tabells enda primärnyckelkolumn av en heltalstyp, till exempel `INT`, `BIGINT` eller `INT8`, med eller utan bredd. Den kolumnen skrivs som `INTEGER` och nyckeln som `PRIMARY KEY (id AUTOINCREMENT)`. En ensam nyckel av någon annan typ skrivs utan det.

### Referensåtgärder {#referential-actions}

Vilka åtgärder för ON DELETE och ON UPDATE som varje databas skriver listas i [ON DELETE och ON UPDATE](./relationship-editing.md#on-delete-and-on-update).  
Där Snowflake utelämnar en åtgärd namnges den i en kommentar ovanför `ALTER TABLE` för den sekundärnyckeln, till exempel `-- Snowflake creates no foreign key with a referential action other than NO ACTION, so ON DELETE CASCADE is left out.`

### Schemakvalificerade tabellnamn {#schema-qualified-table-names}

När `Bracket` är `None` läses ett tabellnamn med en punkt, till exempel `sales.users`, som ett schema och en tabell, delat vid den sista punkten utanför hakparenteser eller dubbla citattecken.

- MySQL, MariaDB, MSSQL, Oracle och PostgreSQL bygger de automatiska namn som de skriver enbart av tabelldelen: `FK_users_TO_orders` och `IDX_users` i alla fem, `UQ_users_email` i alla utom PostgreSQL och `PK_users` i MSSQL och Oracle, de två av dem som namnger primärnyckeln. I de två ger `[sales].[users]` och `"sales"."users"` också `PK_users`, och `[Order]` ger `PK_Order`.
- SQLite namnger inga begränsningar, så det enda automatiska namn som SQLite bygger är indexets: `CREATE INDEX sales.IDX_users ON users`.
- Oracle skapar tabellens index, och sekvensen och triggern för en kolumn med automatisk uppräkning, i tabellens schema: `sales.IDX_users`, `sales.SEQ_users` och `sales.SEQ_TRG_users`.
- I Oracle och SQLite behåller ett indexnamn som du själv har gett ett schema det schemat.
- Ett automatiskt namn på en sekundärnyckel eller ett index som upprepar ett tidigare, oavsett skiftläge, får ett nummer. När `orders` refererar till både `sales.users` och `hr.Users` blir den andra nyckeln `FK_Users_TO_orders1`.

Med alla andra värden för `Bracket` är hela tabellnamnet en enda identifierare, till exempel `"PK_sales.users"`. Snowflake och Databricks behåller alltid hela namnet.  
Raderna `Keys` på fliken [Index](./table-related-functions.md#indexes) visar samma namn.

### Standardvärden {#defaults}

En kolumns standardvärde skrivs så som du skrev det, men inom parenteser där databasen bara läser uttrycket inom parenteser. Ett standardvärde som redan står inom parenteser lämnas som det är.

- MySQL sätter allt utom en literal eller aktuell tid inom parenteser, till exempel `(uuid())`. MySQL sätter också alla standardvärden utom `NULL` inom parenteser i en kolumn av typen `BLOB`, `TEXT`, `JSON`, en spatial typ eller `LONG…`, och aktuell tid i alla kolumner utom de av typen `TIMESTAMP` eller `DATETIME`.
- MariaDB sätter allt utom en literal, aktuell tid, ett funktionsanrop eller ett namn inom parenteser.
- SQLite sätter allt utom en literal eller ett namn inom parenteser, till exempel `(datetime('now'))`.
- PostgreSQL sätter bara ett uttryck inom parenteser när det har ett ord som `AT TIME ZONE`, `AND`, `OR`, `IS`, `IN`, `LIKE`, `COLLATE` eller `= ANY` utanför parenteser, till exempel `(now() AT TIME ZONE 'utc')`.
- MSSQL, Oracle, Snowflake och Databricks skriver alla standardvärden så som de skrevs.

### Kommentarer {#comments}

En tabells eller kolumns kommentar som inte är tom, eller det logiska namn som [`Write logical names into empty comments`](#logical-names-as-comments) skriver i dess ställe, skrivs så som varje databas skriver kommentarer:

- MySQL och MariaDB skriver den direkt i definitionen: en kolumn slutar med `COMMENT 'Member ID'`, och tabellen avslutas med `) COMMENT 'Members';`, även i den batch som MySQL skriver för `If not exists`.
- Snowflake skriver en kolumns kommentar direkt i definitionen, `COMMENT 'Member ID'`, och tabellens på en egen rad efter den avslutande parentesen, `COMMENT = 'Members';`.
- Databricks skriver en kolumns kommentar direkt i definitionen och tabellens som `COMMENT 'Members';` efter `USING DELTA`.
- PostgreSQL skriver `COMMENT ON TABLE member IS 'Members';` och `COMMENT ON COLUMN member.id IS 'Member ID';` direkt efter tabellens `CREATE TABLE`. Oracle skriver samma satser efter tabellen, dess unika begränsningar och dess sekvens och trigger för automatisk uppräkning.
- MSSQL skriver ett anrop per tabell och per kolumn, efter tabellen och dess unika begränsningar, vart och ett följt av `GO`: `EXECUTE sys.sp_addextendedproperty 'MS_Description', N'Members', 'schema', 'dbo', 'table', 'member'`, med `'column', 'id'` tillagt för en kolumn.  
  Texten är en nationell literal, `N'…'`, så SQL Server behåller text utanför databasens teckentabell, till exempel koreanska, i stället för att lagra frågetecken.  
  När `Bracket` är `None` ger en tabell med namnet `sales.users` schemat `sales` och tabellen `users`, och det gör även `[sales].[users]` och `"sales"."users"`, vars hakparenteser och dubbla citattecken tas bort. Ett namn utan schema hamnar i `dbo`. En del före schemat, som i `shop.sales.users`, kör den databasens procedur, `shop.sys.sp_addextendedproperty`. Med alla andra värden för `Bracket` är hela namnet tabellen, i `dbo`.
- SQLite sparar inga kommentarer, så SQLite skriver var och en som en rad med `--` ovanför det som den beskriver: `-- Members` ovanför `CREATE TABLE member` och `-- Member ID` ovanför kolumnen.

Ett citattecken inuti en kommentar inom citattecken dubbleras, som i `'it''s'` och `N'it''s'`, och det gäller även ett citattecken i de namn som anropen i MSSQL skickar. Databricks maskerar i stället ett citattecken och ett omvänt snedstreck med ett omvänt snedstreck, som i `'it\'s'`, den form som alla Spark-versioner läser. Raderna med `--` i SQLite står inte inom citattecken, så de behåller ett citattecken så som det skrevs: `-- it's`.  
I övrigt skrivs texten så som den skrevs, även radbrytningar, utom i två databaser:

- Oracle utelämnar tomma rader, där en rad med bara blanksteg eller tabbar räknas som tom, eftersom SQL\*Plus avslutar en sats vid en tom rad och hoppar över resten av den. En tabellkommentar som består av `Members`, en tom rad och `Active only` skrivs som `COMMENT ON TABLE member IS 'Members` med `Active only';` på nästa rad.
- SQLite skriver varje följd av radbrytningar som ett enda blanksteg, eftersom en radbrytning skulle avsluta raden med `--` och köra resten som SQL. Samma kommentar skrivs som `-- Members Active only`.

Hur de här kommentarerna läses in igen vid import beskrivs i [Kommentarer](./file-import-export.md#comments).

## Skrivskyddade editorer {#read-only-editors}

I en editor med `readonly` fungerar fliken som vanligt: `Database` och `Bracket` ändrar fortfarande den SQL-kod som visas, `Statements`, `Header`, `Write logical names into empty comments` och `Tables` fungerar fortfarande, och `Save file` och `Copy` sparar och kopierar den fortfarande.  
Bara de två skriptfälten är skrivskyddade.
