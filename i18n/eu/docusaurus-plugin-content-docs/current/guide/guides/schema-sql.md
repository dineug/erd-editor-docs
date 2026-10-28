---
sidebar_position: 12
description: Irakurri diagramaren DDLa SQL eskema fitxan, aukeratu datu-basea, mugatzailea, sententziak, goiburua, iruzkin hutsetako izen logikoak eta taulak haren aukeren panelean, gehitu zure scriptak taulen aurretik eta ondoren, eta gorde edo kopiatu SQLa.
---

# SQL eskema

`Schema SQL` fitxak hautatutako datu-baserako diagramaren DDLa erakusten du: diagramaren taulak beren gako, indize eta gako arrotzekin sortzen dituen SQLa.  
Joan tresna-barrako `Schema SQL` fitxara, edo hautatu `Schema SQL` aukera [Bilaketa azkarra](./quick-search.md) paletako `Tab` atalean. `Export` azpimenuko `Schema SQL` aukerak ere irekitzen du fitxa, gordetzeko prest. Ikus [SQLa gordetzea edo kopiatzea](#saving-or-copying-the-sql).

SQLa ezkerrean dago, eta haren eskuinean, `Schema SQL` izenburua duen aukeren panel batek SQLa moldatzen duten aukerak biltzen ditu. Ikus [Aukeren panela](#options-panel). Eskuinetik ezkerrera idazten den bistaratze-hizkuntza batean ere, SQLa ezkerrean geratzen da eta ezkerretik eskuinera irakurtzen da.  
Panela berez irekitzen da, fitxa lehen aldiz irekitzean editorea 640 px baino estuagoa ez bada. Panelaren goiburuko `Hide options` botoiak tolestu egiten du, eta kodearen goiko eskuineko `Show options` botoiak berriro zabaltzen du. Ondoren, utzi zenuen bezala geratzen da, irekita edo tolestuta, fitxaz aldatu arren, editorea irekita dagoen bitartean. Kode-sortzailea fitxaren panelarekiko modu independentean tolesten eta irekitzen da, eta ez da inoiz fitxategian gordetzen.

![Export > Schema SQL irekitzea, sententziak Drop & re-create aukerara eta goiburua USE aukerara aldatzea, eta ondoren SET NAMES script bat taulen aurretik gehitzea](/img/demo-schema-sql-options.webp)

Egin eskuineko klik SQLan haren laster-menua irekitzeko:

- `Database` eta `Bracket`, bakoitza uneko balioa markatzen duen azpimenu bat.
- `Statements` eta `Header`, bakoitza indarrean dagoen aukera markatzen duen azpimenu bat. Datu-baseak ez duen aukera batek `not in Oracle` bezalako azalpen lausotu bat darama, eta ez du ezer egiten.
- `Options panel`, panela tolestu edo irekitzen duena; panela ikusgai dagoen bitartean markatuta dago.
- `Save file`

Fitxa hau irekita dagoen bitartean, Bilaketa azkarrak `Database` eta `Bracket` komandoak eskaintzen ditu; `Schema SQL: Statements` eta `Schema SQL: Header` komandoak, datu-baseak dituen aukerak soilik zerrendatzen dituztenak; eta `Schema SQL: Options panel` komandoa, panela tolestu edo irekitzen duena.  
Ez laster-menuak ez Bilaketa azkarrak ez dute eskaintzen `Write logical names into empty comments` etengailua, aukeren panelean bakarrik baitago. Ikus [Izen logikoak iruzkin gisa](#logical-names-as-comments).

SQLa fitxa irekitzean idazten da, eta berriro panelaren aukeretako bat, datu-basearen izena edo script bat aldatzen den bakoitzean. Fitxa irekita dagoen bitartean tauletan egindako edizio bat, hala nola lankide batena edo kodetze-agente batena, fitxatik irten eta itzultzen zarenean agertzen da, edo horietako bat aldatzen denean.

[Taularen propietateak](./table-related-functions.md#table-properties) panelak bere `Schema SQL` fitxa du, taula bakar baten DDLa erakusten duena. Beti `CREATE` sententzia arruntak idazten ditu, goibururik eta scriptik gabe, ez du inoiz izen logikorik idazten iruzkin huts batean, ez du aukeren panelik, eta haren laster-menuak `Database` eta `Bracket` soilik eskaintzen ditu.

## Aukeren panela {#options-panel}

Panelak hiru talde ditu, bakoitza epigrafe baten azpian:

1. `Saved in the document`: `Database` eta `Bracket`. Ikus [Datu-basea eta mugatzailea](#database-and-bracket). Irakurtzeko soilik dagoen editore batek `This window only` jartzen du haien epigrafean. Ikus [Irakurtzeko soilik dauden editoreak](#read-only-editors).
2. `This window only`: `Statements`, `Header`, `Write logical names into empty comments` eta, diagramak [taula-talde bat](./table-groups.md) duen bitartean, `Tables`. Ikus [Sententziak](#statements), [Goiburua](#header), [Izen logikoak iruzkin gisa](#logical-names-as-comments) eta [Taulak](#tables).
3. `Saved in the document · written as is for every database`: `Before tables` eta `After tables` scriptak. Ikus [Taulen aurreko eta ondorengo scriptak](#before-and-after-scripts).

`Save file` eta `Copy` botoiak panelaren oinean daude. Ikus [SQLa gordetzea edo kopiatzea](#saving-or-copying-the-sql).

`This window only` taldeko aukerak egiten dituzun editore-leihoari dagozkio. Ez dira dokumentuan gordetzen, ez dira lankideekin partekatzen eta ez dira desegite-historian erregistratzen, eta editorea itxi edo berriro kargatzean berrezartzen dira; fitxaz aldatzean, berriz, mantendu egiten dira.  
`Statements` aukera `If not exists` balioarekin hasten da, `Header` aukera `CREATE + USE` balioarekin, eta `Write logical names into empty comments` etengailua desaktibatuta. Editorea txertatzen duen orri batek [`getSchemaSQL()`](../../api/erd-editor-element.md#getschemasql) metodoarekin irakurtzen duen SQLa, eta [kodetze-agente batek irakurtzen duena](../../mcp/tools.md#reading-a-document), ordea, `Create` balioarekin eta goibururik gabe hasten dira, eta ez dute izen logikorik idazten hala eskatzen ez bada.

Hautatutako datu-baseak ez duen aukera bat panelean geratzen da, lausotuta, `Not in <database>` argibidearekin, adibidez `Not in Oracle`, eta sakatzeak ez du ezer egiten.  
SQLak, orduan, datu-baseak duen formarik hurbilena erabiltzen du, eta forma horren botoia sakatuta agertzen da: `If not exists` aukeraren ordez `Create` erabiltzen da, `CREATE + USE` aukeraren ordez `USE`, edo `None` datu-baseak `USE` ere ez badu, eta `USE` aukeraren ordez `None`. Zure aukera gordetzen da; beraz, hura duen datu-base batera aldatzean berriro ezartzen da.

## Datu-basea eta mugatzailea {#database-and-bracket}

`Database` aukera diagramaren datu-basea da: oihalaren laster-menuko `Database` aukerak eta Kode-sortzaileak erabiltzen duten ezarpen bera. Ikus [Datu-baseak](./table-related-functions.md#databases). Databricks, MSSQL, MariaDB, MySQL, Oracle, PostgreSQL, Snowflake eta SQLite zerrendatzen ditu, MySQL balioarekin hasten da, eta fitxategian gordetzen da beste edozein edizio bezala.

`Bracket` aukerak taula, zutabe, murriztapen eta indizeen izenak inguratzen dituen komatxoa ezartzen du: `SingleQuote`, `DoubleQuote`, `Backtick`, edo `None`, izenak inola ere komatxo artean ez jartzeko, eta hori da lehenetsia. Kode-sortzaileak erabiltzen duen ezarpen bera da. Ikus [Mugatzailea](./code-generator.md#bracket).  
Snowflake datu-baseak izenak komatxo bikoitzen artean soilik jartzen ditu, eta `None` ez den edozein aukerarekin horiek erabiltzen ditu; Databricks datu-baseak, berriz, beti jartzen ditu izenak alderantzizko komatxoen artean.  
`Bracket` aukera fitxategian gordetzen da Ezarpenak fitxako `Bracket Type` blokeoa desaktibatuta dagoen bitartean soilik, eta diagrama berri batek blokeo guztiak aktibatuta ditu. Blokeoa aktibatuta dagoen bitartean, aldaketa batek pantailako SQLa berridazten du, baina fitxategiak balio blokeatua mantentzen du, eta diagrama balio horrekin irekitzen da berriro. Ikus [Blokeoa](./settings.md#lock).

Datu-basea Oracle den eta SQLak 30 byte baino luzeagoko izen bat duen bitartean (Oracle 12.1 bertsioak eta zaharragoek ukatu egiten dituzte halakoak), bi zerrenden azpiko azalpen batek izen horiek banan-banan aipatzen ditu: `Oracle 12.2+ for names over 30 bytes: <names>`. Taula, zutabe, eskema, gako, indize, sekuentzia eta abiarazleen izenak egiaztatzen ditu. SQLa bera ez da aldatzen.

## Sententziak {#statements}

`Statements` aukerak taulak nola sortzen diren erabakitzen du:

- `Create` aukerak `CREATE` sententzia arruntak idazten ditu.
- `If not exists` aukerak dagoeneko dauden taulak eta indizeak saltatzen ditu. MySQL, MariaDB, PostgreSQL, SQLite eta Databricks datu-baseek dute; MSSQL, Oracle eta Snowflake datu-baseek `Create` idazten dute haren ordez.
  - MySQL datu-baseak taula bakoitza `CREATE TABLE IF NOT EXISTS` gisa idazten du, bere bakartasun-murriztapenak, indizeak eta gako arrotzak barnean dituela, eta sorta osoa `SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;` eta `SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;` lerroen artean jartzen du.
  - MariaDB datu-baseak `IF NOT EXISTS` jartzen du sententzia bakoitzean: `CREATE TABLE` sententzian, `UNIQUE` eta `FOREIGN KEY` murriztapen bakoitzean, eta `CREATE INDEX` sententzia bakoitzean.
  - PostgreSQL datu-baseak `CREATE TABLE IF NOT EXISTS` eta `CREATE INDEX IF NOT EXISTS` idazten ditu, eta gako arrotz bakoitza `DROP CONSTRAINT IF EXISTS` sententziarekin ezabatzen du berriro gehitu aurretik.
  - SQLite datu-baseak `CREATE TABLE IF NOT EXISTS` eta `CREATE INDEX IF NOT EXISTS` idazten ditu.
  - Databricks datu-baseak `CREATE TABLE IF NOT EXISTS` idazten du, eta gako arrotz bakoitza `DROP CONSTRAINT IF EXISTS` sententziarekin ezabatzen du berriro gehitu aurretik.
- `Drop & re-create` aukerak idazten dituen taula guztiak ezabatzen ditu berriro sortu aurretik, Snowflake datu-basean izan ezik. Datu-base guztiek dute:
  - MySQL eta MariaDB datu-baseek `DROP TABLE IF EXISTS` sententzia bat idazten dute taula bakoitzeko, gako arrotzen egiaztapenak desaktibatu eta berriro aktibatzen dituzten bi lerro berberen artean.
  - PostgreSQL datu-baseak taula guztiak aipatzen dituen `DROP TABLE IF EXISTS` sententzia bakarra idazten du, eta horrek huts egiten du zerrendatik kanpoko taula batek horietako bati erreferentzia egiten badio. `CREATE + USE` goiburuarekin, izenean eskemarik adierazten ez duen taula bat eskema horretatik ezabatzen da, adibidez `shop.member`.
  - MSSQL datu-baseak transakzio bakar bat idazten du, SQL Server 2016 edo berriagoa behar duena, botoiaren `SQL Server 2016+` argibideak dioen bezala. Idatzitako taulek dituzten gako arrotzak ezabatzen ditu, ondoren taulak `DROP TABLE IF EXISTS` sententzia bakarrarekin, eta errore bat gertatzen bada, aldaketak desegiten ditu. Zerrendatik kanpoko taula batek duen gako arrotz batek, hala ere, ezabaketa eragozten du.
  - SQLite datu-baseak `PRAGMA foreign_keys=OFF;` idazten du, eta ezarpen hori desaktibatuta geratzen da konexio horretarako; ondoren, `DROP TABLE IF EXISTS` sententzia bat idazten du taula bakoitzeko.
  - Oracle datu-baseak `DROP TABLE … CASCADE CONSTRAINTS` idazten du taula bakoitzeko eta `DROP SEQUENCE` gehikuntza automatikoko sekuentzia bakoitzeko, bakoitza PL/SQL bloke batean; bloke horiek `/` lerro batekin amaitzen dira, eta falta den taula edo sekuentzia batek sortzen duen errorea alde batera uzten dute.
  - Databricks datu-baseak `DROP TABLE IF EXISTS` sententzia bat idazten du taula bakoitzeko.
  - Snowflake datu-baseak ez du ezer ezabatzen, eta haren ordez `CREATE OR REPLACE TABLE` idazten du.

`Drop & re-create` aukera indarrean dagoen bitartean, paneleko abisu batek ezabatzen dituen taulak aipatzen ditu: `Drops <tables> before creating them. Their rows are lost.`, edo, Snowflake datu-basean, `Replaces <tables>. Their rows are lost.`  
Gehienez bost taula aipatzen dira osorik. Bost baino gehiago direnean, abisuak lehen laurak aipatzen ditu eta gainerakoak zenbatzen ditu, adibidez `a, b, c, d, and 3 more tables`.

## Goiburua {#header}

`Header` aukerak SQLaren hasieran jartzen ditu SQLa exekutatzen den datu-basea, edo eskema, sortzen edo hautatzen duten sententziak. Izena diagramaren datu-basearen izena da, tresna-barrako `database name` eremuan idatzitakoa, eta `Bracket` aukerako karakterearekin mugatzen da.

- MySQL eta MariaDB: `USE` aukerak `USE shop;` idazten du, eta `CREATE + USE` aukerak `CREATE DATABASE IF NOT EXISTS shop;` idazten du horren aurretik.
- MSSQL: `USE` aukerak `USE shop` eta `GO` idazten ditu, eta `CREATE + USE` aukerak `IF DB_ID(N'shop') IS NULL CREATE DATABASE shop` eta `GO` idazten ditu horien aurretik.
- PostgreSQL datu-baseak `CREATE + USE` aukera soilik du, eta aukera horrek `CREATE SCHEMA IF NOT EXISTS shop;` eta `SET search_path TO shop, public;` idazten ditu.
- Oracle datu-baseak `USE` aukera soilik du, eta aukera horrek `ALTER SESSION SET CURRENT_SCHEMA = shop;` idazten du. `CREATE + USE` aukeraren ordez hura erabiltzen da; beraz, hori da Oracle datu-baseak fitxaren goiburu lehenetsiarekin idazten duen lerroa.
- Snowflake eta Databricks: `USE` aukerak `USE SCHEMA shop;` idazten du, eta `CREATE + USE` aukerak `CREATE SCHEMA IF NOT EXISTS shop;` idazten du horren aurretik.
- SQLite datu-baseak ez du bietako bat ere, eta ez du goibururik idazten.

Datu-baseak `USE` edo `CREATE + USE` aukera duenean, botoiaren argibideak datu-base horretan zer idazten duen adierazten du, adibidez `CREATE SCHEMA + SET search_path` PostgreSQL datu-basean.

Goiburua datu-basearen izena identifikatzaile arrunt bat den bitartean soilik idazten da: ASCII letra bat (`A`–`Z`, `a`–`z`) edo `_`, eta ondoren ASCII letrak, digituak edo `_`.  
Beste edozein izenekin, izen hutsa barne, ez da goibururik idazten, eta PostgreSQL datu-basearen `DROP TABLE` sententziak ez du orduan eskemarik aipatzen. `None` ez den goiburu bat indarrean dagoen bitartean, `Header` aukeraren azpiko azalpen batek hala dio: `Database name "<name>" is not a valid identifier.`  
Diagrama berri baten datu-basearen izena hutsik dago; beraz, izena eman arte, panelak `Database name "" is not a valid identifier.` erakusten du.

## Izen logikoak iruzkin gisa {#logical-names-as-comments}

`Write logical names into empty comments` etengailuak, `This window only` taldean dagoenak, taula edo zutabe baten [izen logikoa](./logical-names.md) DDLan idazten du haren iruzkina hutsik dagoen lekuan, datu-base guztietan.

![Write logical names into empty comments aktibatzea Schema SQL panelean; horrek order_items taulako zutabe bakoitzaren izen logikoa haren COMMENT hutsean idazten du, eta members taulako iruzkinak mantendu egiten dira](/img/demo-schema-sql-logical-names.webp)

- Testua duen iruzkin bat nagusitzen da beti: izen logikoak ez du inoiz ordezten, eta ez zaio inoiz gehitzen.
- Zuriunez soilik osatutako iruzkin bat hutsik dagoela jotzen da; beraz, izen logikoa haren lekuan idazten da. Hutsik dagoen edo zuriunez soilik osatuta dagoen izen logiko batek ez du ezer idazten, eta taula edo zutabe horrek iruzkinik gabe jarraitzen du.
- Izen logikoa datu-baseak iruzkin bat idazten duen lekuan eta forman idazten da, eta haren komatxoei modu berean egiten zaie ihes. Ikus [Iruzkinak](#comments).

MySQL datu-basean, adibidez, `Member ID` izen logikoa eta iruzkinik ez duen `id` zutabe bat `COMMENT 'Member ID'` klausularekin idazten da; `Email` izen logikoa eta `Sign-in address` iruzkina dituen `email` zutabe batek, berriz, `COMMENT 'Sign-in address'` mantentzen du.

`Statements` eta `Header` aukerak bezala, etengailua leihoari dagokio eta desaktibatuta hasten da. Ikus [Aukeren panela](#options-panel).  
Inportazio batek ez du inoiz halako iruzkinik izen logiko gisa irakurtzen. Ikus [Iruzkinak](./file-import-export.md#comments).

## Taulak {#tables}

Diagramak gutxienez [taula-talde bat](./table-groups.md) duen bitartean, erakutsita edo ezkutatuta, `Tables` atala `This window only` taldean agertzen da, aukera bakoitzeko kontrol-lauki batekin:

- `All`, lauki guztiak markatzen edo desmarkatzen dituena. Egoera mistoa erakusten du lauki batzuk soilik markatuta dauden bitartean.
- Lauki bat taula-talde bakoitzeko, diagramako taldeen ordenan, taldearen izenarekin etiketatuta, edo `unnamed` etiketarekin izenik gabeko talde batean, eta, taldeak kolorea duenean, taldearen koloreko puntu baten ondoren.
- `No group`, inongo taldetan ez dauden tauletarako.

Lauki guztiak markatuta daudenean, fitxak diagrama osoa idazten du.  
Lauki batzuk soilik markatuta daudenean, markatutako laukien taulak idazten ditu, beren indizeekin eta dituzten gako arrotzekin, kanpoan utzitako taula bati erreferentzia egiten diona barne. Aurreko eta ondorengo scriptak idazten dira hala ere, eta `Drop & re-create` aukerak, haren abisuak eta izen luzeei buruzko Oracle azalpenak taula horiek soilik hartzen dituzte.  
Laukirik markatuta ez dagoenean, fitxak ez du ezer idazten, eta kodearen gaineko iradokizun batek `No tables chosen. Check some under Tables.` dio. Orduan, `Save file` botoiak fitxategi huts bat gordetzen du, eta `Copy` botoiak testu hutsa kopiatzen du.

`Statements` eta `Header` aukeretan bezala, aukeraketa leihoari dagokio. Ikus [Aukeren panela](#options-panel).  
Geroago gehitutako talde bat markatuta hasten da une horretan lauki guztiak markatuta bazeuden soilik. Talde bat kentzean haren laukia desagertzen da, eta azken taldea kentzean dena markatzen da berriro.  
Aukeraketa fitxa honi soilik aplikatzen zaio. Ez dio eragiten Taularen propietateak paneleko `Schema SQL` fitxari, ezta `getSchemaSQL()` metodoari ere.

## Taulen aurreko eta ondorengo scriptak {#before-and-after-scripts}

`Before tables` eta `After tables` eremuek zuk idatzitako SQLa gordetzen dute, adibidez `CREATE EXTENSION` edo `SET` sententziak taulen aurretik, edo baimenak, bistak eta hasierako datuak taulen ondoren.  
Dokumentuan gordetzen dira, bikote bakarra diagrama osorako, datu-basea edozein dela ere. Bakoitza idatzi zenuen bezala idazten da SQLan, inoiz egiaztatu gabe: aurreko scripta goiburuaren ondoren eta `DROP` sententzien eta taulen aurretik, eta ondorengo scripta guztiaren amaieran.

Lerro-jauziak LF gisa idazten dira, eta script baten aurreko lerro hutsak eta ondorengo zuriuneak kentzen dira.  
MSSQL datu-basean, `GO` lerro bat gehitzen da azken lerroa `GO` (edo zenbaki bat duen `GO`) ez den script baten ondoren, bi eremuen azpiko lerroak dioen bezala. Oracle datu-basean, amaitu zuk zeuk PL/SQL bloke bat bere `/` lerroarekin.

Eremuek SQL sintaxia nabarmentzen dute eta testuarekin batera handitzen dira.  
Edizio bat eremutik irtetean aplikatzen da, beste nonbait klik eginez edo fitxaz aldatuz, eta orduan bakarrik aldatzen dira ondoko SQLa eta dokumentua. Barruan klik egin besterik egin ez duzun eremu batek ez du ezer aldatzen.  
Script baten edizioak beste edozein edizioak bezala aldatzen du diagrama: fitxategian gordetzen da, lankideek ikusten dute, eta aplikatutako edizio bakoitza [desegite-historiako](./undo-redo.md) urrats bat da, ERD fitxatik desegiten dena.  
Eremu batean idazten ari zaren bitartean, editorearen beraren lasterbideak eremuari uzten zaizkio; beraz, `Ctrl + Z` (Windows/Linux) edo `⌘ + Z` (Mac) lasterbideak bertan idatzitakoa desegiten du, eta kopiatu, ebaki eta itsatsi ekintzek testuaren gainean jarduten dute, ez diagramaren gainean.  
Bilaketa azkarra eta [Arakatzailearen bilaketa](./find-and-replace.md) beren lasterbideekin irekitzen dira oraindik ere: `Ctrl + K` eta `Ctrl + F` (Windows/Linux) edo `⌘ + K` eta `⌘ + F` (Mac). `Ctrl + F` edo `⌘ + F` lasterbideak ERD fitxara aldatzen duenez, zure edizioa aplikatzen du, fitxa-aldaketa orok egiten duen bezala.  
Teklatuaren fokua ez duen eremu batek lankide batek edo [kodetze-agente batek](../../mcp/tools.md#settings) haren scriptean egiten duen aldaketa islatzen du. Zu zauden eremu batek aldaketa hori erakusten du, idatzi gabe eremutik irtetean. Idatzi baduzu, zure testua irtetean aplikatzen da, eta haiena ordezten du.

## SQLa gordetzea edo kopiatzea {#saving-or-copying-the-sql}

`Save file` aukerak, panelaren oinean edo laster-menuan, fitxak erakusten duen SQLa gordetzen du zehazki, bere uneko datu-base, mugatzaile, sententzia, goiburu, izen logikoen iruzkin, taula eta scriptekin, `<database name>-<timestamp>.sql` gisa. Beste esportazio guztiak bezala izendatzen eta gordetzen da. Ikus [Esportatzea](./file-import-export.md#exporting).

`Export` ▸ `Schema SQL` aukerak, oihalaren laster-menuan edo Bilaketa azkarrean, ez du ezer gordetzen berez.  
Fitxa honetara aldatzen da, aukeren panela irekitzen du tolestuta bazegoen ere, eta teklatuaren fokua `Save file` botoian jartzen du; beraz, `Enter` sakatzean fitxategia gordetzen da.

Panelaren oineko `Copy` botoiak, edo kodearen gainetik sagua pasatzean haren goiko eskuinean agertzen den kopiatzeko botoiak, SQLa kopiatzen du.  
Egiaztatze-marka bat duen `Copied!` jakinarazpen batek berresten du bi segundoz. Nabigatzaileak edo ostalariak arbela ukatzen badu, abisu-ikur bat duen `Couldn't copy to the clipboard` jakinarazpen batek adierazten du hori haren ordez, bost segundoz. Berriro kopiatzean, jakinarazpena ordezten da, beste bat gehitu beharrean.  
SQLa hautatu ere egin daiteke; beraz, haren zati bat soilik har dezakezu.

## DDLak zer idazten duen {#what-the-ddl-writes}

Arau hauek editoreak SQL eskema idazten duen leku guztietan betetzen dira: fitxa honetan eta haren fitxategian, eta editorea txertatzen duen orri batek edo kodetze-agente batek irakurtzen duen SQLan.  
Taularen propietateak paneleko `Schema SQL` fitxak arau horiei jarraitzen die erakusten duen taula bakarrerako. Ez du Oracle sekuentziarik edo abiarazlerik idazten, ezta gako arrotzik ere, SQLite datu-basearenak izan ezik, haren `CREATE TABLE` sententziaren barruan baitaude. Ez ditu idazten, halaber, PostgreSQL, Oracle eta MSSQL datu-baseek taula baten ondoren jartzen dituzten iruzkin-sententziak; beraz, hiru horietan ez du iruzkinik erakusten.

Zatiak ordena honetan datoz, lerro huts batez bereizita: goiburua, aurreko scripta, `DROP` sententziak, taulak eta ondorengo scripta. Taulak izenaren arabera ordenatuta idazten dira.  
Taularik eta scriptik ez duen diagrama batek ez du ezer idazten, goiburu bat aukeratuta egon arren.

Taulak eta zutabeak beren izen fisikoekin idazten dira, [Izenen ikuspegiak](./logical-names.md#name-view) erakusten duena edozein dela ere. Domeinu bati lotutako zutabe bat bere datu motarekin idazten da, domeinuak ezartzen duenarekin. Ikus [Domeinuak eta datu motak](./dictionary.md#domains-and-data-types).

### Gehikuntza automatikoa {#auto-increment}

`Auto Increment` markatuta duen zutabe bat datu-base bakoitzak idazten duen moduan idazten da: `AUTO_INCREMENT` MySQL eta MariaDB datu-baseetan, `IDENTITY(1,1)` MSSQL datu-basean, `AUTOINCREMENT` Snowflake datu-basean, eta `GENERATED ALWAYS AS IDENTITY` PostgreSQL eta Databricks datu-baseetan.  
Oracle datu-baseak `SEQ_<table>` sekuentzia bat eta zutabea sekuentzia horretatik betetzen duen `SEQ_TRG_<table>` abiarazle bat jasotzen ditu. Abiarazlea `/` lerro batekin amaitzen da; beraz, SQL\*Plus eta SQLcl tresnek exekutatzen dute.

Datu-base batek zutabearen motan gehikuntza automatikoa onartzen ez duenean, klausula kanpoan uzten da, eta taularen ondorengo iruzkin-lerro batek zutabea aipatzen du:

- PostgreSQL datu-baseak `smallint`, `integer` edo `bigint` motetan soilik onartzen du, haien edozein izenekin: `INT`, `INTEGER`, `BIGINT`, `SMALLINT`, `INT2`, `INT4` edo `INT8`. Beste mota bateko zutabe batek ez du ez klausularik ez balio lehenetsirik jasotzen, eta iruzkinak, adibidez, hau dio: `-- PostgreSQL takes IDENTITY only on smallint, integer or bigint, so member.id is written without it.`
- Databricks datu-baseak `BIGINT` edo `LONG` motetan soilik onartzen du.
- SQLite datu-baseak `AUTOINCREMENT` onartzen du soilik taula baten gako nagusia zenbaki osoko motako zutabe bakarra denean, adibidez `INT`, `BIGINT` edo `INT8`, zabalerarekin edo gabe. Zutabe hori `INTEGER` gisa idazten da, eta gakoa `PRIMARY KEY (id AUTOINCREMENT)` gisa. Beste edozein motatako zutabe bakarreko gako bat hura gabe idazten da.

### Erreferentzia-ekintzak {#referential-actions}

Datu-base bakoitzak zein ON DELETE eta ON UPDATE ekintza idazten dituen [ON DELETE eta ON UPDATE](./relationship-editing.md#on-delete-and-on-update) atalean zerrendatzen da.  
Snowflake datu-baseak ekintza bat kanpoan uzten duenean, gako arrotz horren `ALTER TABLE` sententziaren gaineko iruzkin batek aipatzen du, adibidez `-- Snowflake creates no foreign key with a referential action other than NO ACTION, so ON DELETE CASCADE is left out.`

### Eskemaz kualifikatutako taula-izenak {#schema-qualified-table-names}

`Bracket` aukera `None` balioan dagoenean, puntu bat duen taula-izen bat, adibidez `sales.users`, eskema eta taula gisa irakurtzen da, kortxete edo komatxo bikoitzetatik kanpoko azken puntuan zatituta.

- MySQL, MariaDB, MSSQL, Oracle eta PostgreSQL datu-baseek idazten dituzten izen automatikoak taularen zatitik soilik eraikitzen dituzte: `FK_users_TO_orders` eta `IDX_users` bostetan, `UQ_users_email` guztietan PostgreSQL datu-basean izan ezik, eta `PK_users` MSSQL eta Oracle datu-baseetan, bost horietatik gako nagusiari izena ematen dioten biak. Bi horietan, `[sales].[users]` eta `"sales"."users"` izenek ere `PK_users` ematen dute, eta `[Order]` izenak `PK_Order`.
- SQLite datu-baseak ez die murriztapenei izenik ematen; beraz, eraikitzen duen izen automatiko bakarra indizearena da: `CREATE INDEX sales.IDX_users ON users`.
- Oracle datu-baseak taularen indizeak, eta gehikuntza automatikoko zutabe baten sekuentzia eta abiarazlea, taularen eskeman sortzen ditu: `sales.IDX_users`, `sales.SEQ_users` eta `sales.SEQ_TRG_users`.
- Oracle eta SQLite datu-baseetan, zuk zeuk eskema bat eman diozun indize-izen batek eskema hori mantentzen du.
- Aurreko bat errepikatzen duen gako arrotz edo indize baten izen automatiko batek, maiuskulak eta minuskulak bereizi gabe, zenbaki bat jasotzen du. `orders` taulatik `sales.users` eta `hr.Users` biei erreferentzia egiten zaienean, bigarren gakoa `FK_Users_TO_orders1` da.

Beste edozein `Bracket` baliorekin, taula-izen osoa identifikatzaile bakarra da, adibidez `"PK_sales.users"`. Snowflake eta Databricks datu-baseek beti mantentzen dute izen osoa.  
[Indizeak](./table-related-functions.md#indexes) fitxako `Keys` errenkadek izen berberak erakusten dituzte.

### Balio lehenetsiak {#defaults}

Zutabe baten balio lehenetsia idatzi zenuen bezala idazten da, baina parentesi artean, datu-baseak adierazpen hori parentesi artean soilik irakurtzen duenean. Dagoeneko parentesi artean dagoen balio lehenetsi bat dagoen bezala uzten da.

- MySQL datu-baseak parentesi artean jartzen du literal bat edo uneko ordua ez den edozer, adibidez `(uuid())`. `NULL` ez den edozein balio lehenetsi ere parentesi artean jartzen du `BLOB`, `TEXT`, `JSON`, espazial edo `LONG…` motako zutabe batean, eta uneko ordua `TIMESTAMP` edo `DATETIME` ez den edozein zutabetan.
- MariaDB datu-baseak parentesi artean jartzen du literal bat, uneko ordua, funtzio-dei bat edo izen bat ez den edozer.
- SQLite datu-baseak parentesi artean jartzen du literal bat edo izen bat ez den edozer, adibidez `(datetime('now'))`.
- PostgreSQL datu-baseak parentesietatik kanpo `AT TIME ZONE`, `AND`, `OR`, `IS`, `IN`, `LIKE`, `COLLATE` edo `= ANY` bezalako hitz bat duen adierazpena soilik jartzen du parentesi artean, adibidez `(now() AT TIME ZONE 'utc')`.
- MSSQL, Oracle, Snowflake eta Databricks datu-baseek balio lehenetsi guztiak idatzi bezala idazten dituzte.

### Iruzkinak {#comments}

Taula edo zutabe baten iruzkina, hutsik ez dagoenean, edo [`Write logical names into empty comments`](#logical-names-as-comments) etengailuak haren lekuan idazten duen izen logikoa, datu-base bakoitzak iruzkinak idazten dituen moduan idazten da:

- MySQL eta MariaDB datu-baseek lerroan bertan idazten dute: zutabe bat `COMMENT 'Member ID'` klausularekin amaitzen da, eta taula `) COMMENT 'Members';` klausularekin ixten da, baita MySQL datu-basearen `If not exists` sortan ere.
- Snowflake datu-baseak zutabearena lerroan bertan idazten du, `COMMENT 'Member ID'`, eta taularena bere lerroan, itxierako parentesiaren ondoren, `COMMENT = 'Members';`.
- Databricks datu-baseak zutabearena lerroan bertan idazten du, eta taularena `COMMENT 'Members';` gisa, `USING DELTA` klausularen ondoren.
- PostgreSQL datu-baseak `COMMENT ON TABLE member IS 'Members';` eta `COMMENT ON COLUMN member.id IS 'Member ID';` idazten ditu taularen `CREATE TABLE` sententziaren ondoren bertan. Oracle datu-baseak sententzia berberak idazten ditu taularen, haren bakartasun-murriztapenen eta haren gehikuntza automatikoko sekuentziaren eta abiarazlearen ondoren.
- MSSQL datu-baseak dei bat idazten du taula bakoitzeko eta zutabe bakoitzeko, taularen eta haren bakartasun-murriztapenen ondoren, bakoitzaren ondoren `GO` lerro bat duela: `EXECUTE sys.sp_addextendedproperty 'MS_Description', N'Members', 'schema', 'dbo', 'table', 'member'`, eta zutabe baterako `'column', 'id'` gehituta.  
  Testua literal nazional bat da, `N'…'`; beraz, SQL Serverrek datu-basearen kode-orritik kanpoko testua mantentzen du, adibidez koreera, galdera-ikurrak gorde beharrean.  
  `Bracket` aukera `None` balioan dagoela, `sales.users` izeneko taula batek `sales` eskema eta `users` taula ematen ditu, baita `[sales].[users]` eta `"sales"."users"` izenek ere, haien kortxeteak eta komatxo bikoitzak kenduta. Eskemarik gabeko izen bat `dbo` eskeman dago. Eskemaren aurreko zati batek, `shop.sales.users` izenean bezala, datu-base horren prozedura exekutatzen du, `shop.sys.sp_addextendedproperty`. Beste edozein `Bracket` baliorekin, izen osoa taula da, `dbo` eskeman.
- SQLite datu-baseak ez du iruzkinik gordetzen; beraz, bakoitza `--` lerro gisa idazten du deskribatzen duenaren gainean: `-- Members` `CREATE TABLE member` sententziaren gainean, eta `-- Member ID` zutabearen gainean.

Komatxo arteko iruzkin baten barruko komatxo bat bikoiztu egiten da, `'it''s'` eta `N'it''s'` adibideetan bezala, baita MSSQL datu-basearen deiek pasatzen dituzten izenetakoa ere. Databricks datu-baseak, horren ordez, komatxoari eta alderantzizko barrari alderantzizko barra batekin egiten die ihes, `'it\'s'` adibidean bezala, Spark bertsio guztiek irakurtzen duten forman. SQLite datu-basearen `--` lerroak ez daude komatxo artean; beraz, komatxoa idatzi bezala mantentzen dute: `-- it's`.  
Bestela, testua idatzi bezala idazten da, lerro-jauziak barne, bi datu-basetan izan ezik:

- Oracle datu-baseak lerro hutsak kanpoan uzten ditu (zuriunez edo tabulazioz soilik osatutako lerroa hutsik dagoela jotzen da), SQL\*Plus tresnak lerro huts batean amaitzen baitu sententzia bat eta gainerakoa saltatu egiten baitu. `Members`, lerro huts bat eta `Active only` dituen taula-iruzkin bat `COMMENT ON TABLE member IS 'Members` gisa idazten da, eta `Active only';` hurrengo lerroan.
- SQLite datu-baseak jarraian dauden lerro-jauzien multzo bakoitza zuriune bakar gisa idazten du, lerro-jauzi batek `--` lerroa amaituko lukeelako eta gainerakoa SQL gisa exekutatuko lukeelako. Iruzkin bera `-- Members Active only` gisa idazten da.

Iruzkin hauek inportatzean nola irakurtzen diren [Iruzkinak](./file-import-export.md#comments) atalean azaltzen da.

## Irakurtzeko soilik dauden editoreak {#read-only-editors}

[`readonly`](../../api/erd-editor-element.md#readonly) atributua duen editore batean, fitxak irakurlearentzat funtzionatzen du, eta bertan egindako ezerk ez du dokumentura iristen:

- `Database` eta `Bracket` aukerek SQLa berridazten dute oraindik, baina leiho horretan bakarrik; beraz, panelak `This window only` jartzen du haien epigrafean ere. Aukera bat ez da fitxategian gordetzen, ez lankideekin partekatzen, ez desegiteko erregistratzen, blokeoek dioten guztia gorabehera, eta lankide batek zuk aukeratutako ezarpen bati egindako aldaketak zure aukera pantailan uzten du. Code Generator fitxak aukera bera erakusten du, eta datu-baserik gabe deitutako [`getSchemaSQL()`](../../api/erd-editor-element.md#getschemasql) metodoak ere hura idazten du. Editorea berriro idazgarri bihurtzen denean, dokumentuaren datu-basea eta mugatzailea itzultzen dira.
- `Statements`, `Header`, `Write logical names into empty comments` eta `Tables` aukerek edonon bezala funtzionatzen dute, leihoarenak baitira dagoeneko.
- Bi script-eremuak irakurtzeko soilik daude: dokumentuaren scriptak erakusten dituzte, SQLak oraindik idazten dituenak, eta ez dute idazterik onartzen.
- `Save file` eta `Copy` aukerek fitxak erakusten duen SQLa gordetzen eta kopiatzen dute.
