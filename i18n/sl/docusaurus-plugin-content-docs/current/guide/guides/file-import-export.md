---
sidebar_position: 2
description: Uvoz JSON, Sheme SQL, GraphQL, DBML ali AML namesto diagrama ali kot dodatek pod njim ter izvoz JSON, Sheme SQL ali diagrama kot slike PNG ali SVG.
---

# Uvoz in izvoz datotek

## Uvoz zunanjih datotek {#importing-external-files}

Pet formatov je mogoče uvoziti iz podmenija `Import` v priročnem meniju platna:

- json
- Schema SQL
- GraphQL
- DBML
- AML

Ukaz `Import and Add` tik pod ukazom `Import` datoteko doda v diagram, namesto da bi ga nadomestil – glejte razdelek [Uvozi in dodaj](#import-and-add).  
Pozdravni zaslon, ki ga prikaže prazen diagram, ima postavko `Import` z istimi petimi formati – glejte razdelek [Pozdravni zaslon](./editing-start.md#welcome-screen).  
Tudi listi zavihka [Slovar](./dictionary.md) sprejmejo besede, izraze in domene iz datotek CSV, in sicer z lastnim ukazom `Import CSV` tega zavihka – glejte razdelek [Uvoz in izvoz CSV](./dictionary.md#importing-and-exporting-csv).

Končnice se preverjajo ne glede na velikost črk. Če izberete datoteko, katere končnica se ne ujema z izbranim formatom, se uvoz prekliče in prikaže se sporočilo `Only <format> files can be imported`, pri čemer je format zapisan kot `json`, `sql`, `graphql`, `dbml` ali `aml`, na primer `Only sql files can be imported`.

Ukaz `Import` trenutni dokument nadomesti, namesto da bi vanj združil vsebino, ena razveljavitev pa povrne prejšnji diagram.  
Datoteka JSON s seboj prinese lastne nastavitve, vključno s svojimi [zaklepi](./settings.md#lock). Kjer datoteka zaklene zavihek, jezik generatorja kode, zapis imen, vrsto narekovajev ali [prikaz imen](./logical-names.md#name-view), še naprej vidite to, kar ste imeli, shrani pa se zaklenjena vrednost iz datoteke. Povečava in položaj pogleda, zaklenjena ali ne, se postavita tja, kamor ju postavi datoteka. Datoteka JSON, shranjena pred uvedbo zaklepanja, se uvozi z vsemi vklopljenimi zaklepi in s pogledom pri 100 %. Datoteka, shranjena pred uvedbo zaklepa `Name View`, se uvozi tako, da je ta zaklep vklopljen, ne glede na to, katere druge zaklepe beleži.  
Drugi formati ohranijo nastavitve, ki jih že imate, vključno z zaklepi, razen pogleda, ki se začne pri 100 %.  
Razčlenjevalniki za GraphQL, DBML in AML nikoli ne odpovejo: iz datoteke, ki je ne morejo prebrati, nastane prazen diagram namesto napake.

Datoteka JSON prinese tudi logična imena svojih tabel in stolpcev ter povezave svojih stolpcev z domenami. Njene besede, izrazi in domene nadomestijo tiste na zavihku [Slovar](./dictionary.md), zato datoteka, ki jih nima, pusti liste prazne, razveljavitev uvoza pa povrne tiste, ki jih je nadomestila.  
Drugi formati nimajo ničesar od tega. Njihove tabele se uvozijo brez logičnih imen in brez stolpcev, povezanih z domeno, vaše besede, izrazi in domene pa ostanejo nespremenjeni. Tudi razveljavitev ali uveljavitev uvoza jih pusti nespremenjene, zato se sprememba slovarja, narejena po uvozu, ohrani. Tak uvoz pusti nespremenjeno tudi lastno zgodovino razveljavitev vsakega lista, medtem ko uvoz JSON te zgodovine izprazni – glejte razdelek [Listi zavihka Slovar](./undo-redo.md#dictionary-sheets).

Datoteka JSON ohrani položaje, ki jih ima. Tabele iz datoteke Sheme SQL, GraphQL, DBML ali AML se razporedijo, preden se diagram spremeni, s širinami, ki jih imajo v [prikazu imen](./logical-names.md#beyond-the-canvas), ki ga gledate:

- Če ima datoteka dve ali več tabel in vsaj eno relacijo, jih [samodejna postavitev](./table-related-functions.md#auto-layout) `Flow` razporedi od leve proti desni vzdolž relacij, od zgornjega levega kota platna. Šteje tudi relacija, ki tabelo povezuje s samo seboj.
- Sicer se razporedijo v vrstice od zgornjega levega kota, najprej tabele z najmanj stolpci.
- Če postavitev traja dlje kot 6 sekund, se prikaže obvestilo `Placing tables` z gumbom `Cancel`. Gumb `Cancel` ali tipka `Escape`, pritisnjena med prikazom obvestila, postavitev opusti in tabele namesto tega razporedi v vrstice. Vrstice se brez obvestila uporabijo tudi, ko postavitev ne uspe, ko se v 60 sekundah ne vrne nobena postavitev ali ko gostitelj ne poganja procesa shared worker – glejte razdelek [Web Workers](../../api/installation.md#web-workers).

Diagram se nato nadomesti v enem koraku, zato vmes ni prikazano nič. Nastavitev, ki jo spremenite med razporejanjem tabel, kot je zavihek, se ohrani, če pa medtem uvozite drugo datoteko, obvelja uvoz, ki se je začel zadnji.

Urejevalnik samo za branje z ukazom `Import` ne naloži ničesar in ne ponuja niti ukaza `Import and Add` niti ukaza `Import CSV` na zavihku Slovar.

### Uvozi in dodaj {#import-and-add}

Ukaz `Import and Add` ohrani diagram in pod njim doda datoteko. Na voljo je v priročnem meniju platna in v [hitrem iskanju](./quick-search.md) na zavihku ERD ter ponuja istih pet formatov z enakim preverjanjem končnice kot ukaz `Import`.

![Dodajanje datoteke SQL prek Import and Add > Schema SQL: njene tabele pristanejo pod diagramom, razporejene vzdolž relacij, in so izbrane](/img/demo-import-and-add.webp)

Datoteka se uvozi tako kot pri lepljenju: vse tabele, stolpci, relacije, indeksi, beležke in [skupine tabel](./table-groups.md), ki jih vsebuje, se dodajo kot novi elementi, tabele, ki so že v diagramu, se ne premaknejo in nobena nastavitev se ne spremeni, zato so nastavitve datoteke JSON izpuščene.  
Tabele in stolpci iz datoteke JSON ohranijo svoja logična imena, vsako fizično ime pa še naprej upravljajo slovarji ali ostane vaše, kot je bilo v datoteki, kar določa, ali logično ime, vneseno pozneje, izpelje novo ime – glejte razdelek [Izpeljava fizičnih imen](./dictionary.md#deriving-physical-names). Besede, izrazi in domene iz datoteke so izpuščeni, zato zavihek Slovar ostane takšen, kot je bil, in noben dodani stolpec ni povezan z domeno: vsak ohrani podatkovni tip, ki ga ima.  
Tabela z imenom, ki ga diagram že ima, se doda kot druga tabela s tem imenom in se z obstoječo ne združi. Relacije in indeksi prihajajo samo iz datoteke, zato tuji ključ na tabelo, ki je datoteka ne določa, ni povezan s tabelo, ki je že v diagramu.

Dodani blok pristane tik pod vsem, kar vsebuje diagram, poravnan z njegovim levim robom, v praznem diagramu pa v zgornjem levem kotu. Upoštevajo se tudi beležke in skupine tabel, skrite z [možnostmi pogleda](./table-related-functions.md#table-view-options), saj so še vedno na svojem mestu.  
Znotraj bloka datoteka JSON ohrani lastno razporeditev, vključno s skupinami tabel. Drugi formati se razporedijo tako, kot jih razporedi ukaz `Import`, s postavitvijo `Flow` ali v vrstice po enakih pravilih, okvir vsake skupine tabel pa se prilagodi njenim tabelam. Dodane tabele in beležke se postavijo v ospredje, nad vse, kar je že tam.

Ko blok pristane, je izbrano samo dodano: nove tabele ter nove beležke in skupine tabel, če so prikazane. Če ste se medtem premaknili na drug zavihek, urejevalnik preklopi nazaj na zavihek ERD, preden blok pristane. Pogled se nato pri trenutni povečavi pomakne do bloka, razen če je ta že dobro viden – glejte razdelek [Kam pripelje skok](./table-related-functions.md#where-a-jump-lands). Ena razveljavitev prekliče celotno dodajanje.  
Datoteka, ki je razčlenjevalnik ne more prebrati, ali datoteka, ki nima ne tabele ne beležke, ne doda ničesar.

Če dodate več datotek Sheme SQL, GraphQL, DBML ali AML, medtem ko se ena še razporeja, pristanejo vse, in sicer v vrstnem redu, v katerem ste jih začeli dodajati. Datoteka JSON, dodana medtem, pristane pred njimi, takoj ko je prebrana. Ukaz `Import` ali nalaganje drugega dokumenta zavrže vse, ki se še razporejajo.

Agenti za kodiranje datoteko na enak način dodajo z načinom `append` orodij MCP za uvoz, ki ohrani razporeditev datoteke JSON, tabele drugih formatov pa razporedi v vrstice, nikoli s postavitvijo `Flow` – glejte razdelek [Uvoz](../../mcp/tools.md#import).

### JSON {#json}

Uvozite lahko datoteke v [formatu sheme, ki ga določa urejevalnik](../../api/advanced/schema.md).
Ime datoteke se mora končati s končnico `.json`, zato se datoteka, izvožena kot `<database name>-<timestamp>.erd.json`, uvozi nazaj takšna, kot je; datoteka samo s končnico `.erd` ali `.vuerd` tukaj ni sprejeta. Urejevalnik prebere tudi datoteke, ki so jih shranile starejše izdaje.

![Uvoz shranjene datoteke prek Import > json in zamenjava osnutka dokumenta skupaj z njegovimi nastavitvami](/img/demo-import-json.webp)

### Shema SQL {#schema-sql}

Uvozite lahko tudi datoteke s shemo, zapisano v jeziku SQL.  
Čeprav so razčlenjevalniki narejeni čim bolj prilagodljivo ne glede na vrsto zbirke podatkov, nekatera sintaksa morda ni podprta.  
Ime datoteke se mora končati s končnico `.sql`.  
[Podprto sintakso si lahko ogledate tukaj.](https://github.com/dineug/erd-editor/tree/main/packages/schema-sql-parser)

![Uvoz datoteke SQL prek Import > Schema SQL, razporeditev njenih tabel vzdolž relacij in nato pomanjšanje pogleda nad njimi](/img/demo-import-sql.webp)

Stolpci se preberejo samo iz stavka `CREATE TABLE`. Stolpec, dodan s stavkom `ALTER TABLE ... ADD COLUMN`, se ne prebere.  
Elementi stavka `CREATE TABLE`, ki niso stolpci, se preskočijo, namesto da bi se prebrali kot stolpci: neimenovani `CHECK (...)`, `LIKE` in `EXCLUDE` v PostgreSQL, `FULLTEXT` in `SPATIAL` v MySQL, kadar sta zapisana brez `INDEX` ali `KEY`, `PERIOD FOR` v T-SQL in `SUPPLEMENTAL LOG DATA` v Oracle.  
Stolpec, poimenovan po enem od njih, se vseeno uvozi, če imenu sledi vgrajeni tip, kot v `exclude BOOLEAN`, ali če je ime v narekovajih, kot v `"check" int`. Ime `like` brez narekovajev, ki mu sledi tip, ki ni vgrajen, kot v `like citext`, se prebere kot `LIKE` iz PostgreSQL in preskoči.  
Same omejitve `CHECK` se ne uvozijo, ker jih urejevalnik nima kje hraniti.

#### Podatkovni tipi {#data-types}

Podatkovni tip stolpca se ohrani, vključno s seznamom argumentov, tudi kadar ni vgrajeni tip nobene od [podprtih zbirk podatkov](./table-related-functions.md#databases).  
To velja za naštevni ali sestavljeni tip, ustvarjen s stavkom `CREATE TYPE`, domeno, ustvarjeno s stavkom `CREATE DOMAIN`, tipe razširitev, kot so `hstore`, `citext` in `ltree`, imena s shemo, kot je `public.mood`, ter imena v narekovajih ali oglatih oklepajih, kot sta `"MyType"` in `[dbo].[Phone]`, ki ohranijo svoje narekovaje ali oklepaje. Sami stavki `CREATE TYPE`, `CREATE DOMAIN` in `CREATE EXTENSION` se preskočijo.  
Vgrajeni tip izgubi narekovaje ali oklepaje, zato se `[int]` uvozi kot `int`, `[nvarchar](50)` pa kot `nvarchar(50)`. Tipa `"char"` in `"bit"` v PostgreSQL svoje ohranita, ker sta drugačna tipa kot `char` in `bit`.  
Pripone za polja ostanejo pri vsakem tipu: `integer[]`, `text[3][3]`, `integer ARRAY`, `mood[]`. Tip `UNSIGNED BIG INT` v SQLite se uvozi v celoti.  
Modifikatorja `UNSIGNED` in `ZEROFILL` v MySQL in MariaDB, zapisana tik za tipom in njegovimi argumenti, ostaneta del tipa, kot sta zapisana: `INT UNSIGNED`, `SMALLINT(5) UNSIGNED ZEROFILL`, `int unsigned` iz orodja mysqldump. Modifikator `SIGNED`, ki je privzet, se izpusti, zato se `TINYINT SIGNED` uvozi kot `TINYINT`. Modifikator, zapisan za drugo možnostjo stolpca, kot v `INT NOT NULL UNSIGNED`, ki ga MySQL zavrne, se izpusti.  
Vrednosti `ENUM(...)` in `SET(...)` ohranijo narekovaje, pri čemer je narekovaj znotraj vrednosti podvojen, kot v `ENUM('a','it''s')`. Zapis `'it\'s'` iz MySQL, kjer je narekovaj zaščiten s poševnico nazaj, se uvozi enako podvojen. V tipu `STRUCT<...>` v Databricks imena polj v narekovajih in določilo `COMMENT` polja ohranijo narekovaje.  
Stolpec, zapisan brez tipa, kot je stolpec brez tipa v SQLite ali izračunani stolpec `AS`, ostane brez tipa: ključna beseda, kot je `NOT`, `NULL`, `DEFAULT`, `PRIMARY` ali `REFERENCES`, ali niz v enojnih narekovajih se ne prebere kot tip.

#### Privzete vrednosti {#defaults}

Določilo `DEFAULT` stolpca ohrani celoten izraz, kot je `now()`, `0.5`, `CURRENT_TIMESTAMP` ali `ARRAY[]::text[]`, do naslednje možnosti stolpca, vejice ali zaklepaja. Izraz `CASE ... END` se prebere v celoti.  
Oklepaji okoli celotnega izraza se odstranijo, zato se `((0))` iz SQL Server uvozi kot `0`, `(getdate())` pa kot `getdate()`. Odstrani se tudi pretvorba tipa literala, zato se `'draft'::character varying` iz orodja pg_dump uvozi kot `'draft'`, `NULL::character varying` pa kot `NULL`; druge pretvorbe tipa ostanejo, kot v `ARRAY[]::text[]` in `lower('A'::text)`.  
Določilo `ON UPDATE CURRENT_TIMESTAMP` iz MySQL se izpusti, ker zanj v stolpcu ni prostora, privzeta vrednost pred njim pa ostane. Zapis `DEFAULT ON NULL 0` iz Oracle, z določilom `FOR INSERT ONLY` ali `FOR INSERT AND UPDATE` ali brez njega, se uvozi kot `0`.  
Niz s predpono, kot je `N'x'`, `E'x'`, `B'0'`, `X'ff'`, `U&'x'` ali `_utf8mb4'x'`, se prebere kot en niz, tudi če je v njem oklepaj.

SQL Server Management Studio v skriptu zapiše privzete vrednosti za tabelami, v obliki `ALTER TABLE [dbo].[t] ADD CONSTRAINT [DF_x] DEFAULT ((1)) FOR [col]`. Tak stavek nastavi privzeto vrednost tega stolpca, tu `1`, ime njegove omejitve pa se izpusti.

Izvoz Sheme SQL vrne oklepaje tja, kjer zbirka podatkov izraz privzete vrednosti prebere samo znotraj njih – glejte razdelek [Privzete vrednosti](./schema-sql.md#defaults).

#### Samodejno povečevanje {#auto-increment}

`AUTO_INCREMENT`, `AUTOINCREMENT` in `IDENTITY` vklopijo zastavico `Auto Increment` stolpca, prav tako pa tudi `GENERATED ALWAYS AS IDENTITY` in `GENERATED BY DEFAULT AS IDENTITY`, ki za seboj ne pustita privzete vrednosti.  
Enako velja za privzeto vrednost, ki je en sam klic `nextval()` v PostgreSQL, tj. privzeto vrednost, ki jo dobi stolpec serial, zapisano kot `nextval('s')` ali, kot jo zapiše pg_dump, `nextval('s'::regclass)`. Ime zaporedja se ne ohrani. Privzeta vrednost, ki zaporedje samo uporablja, kot je `nextval('s') + 1` ali `NEXT VALUE FOR s` iz SQL Server, ostane navadna privzeta vrednost.  
Orodje pg_dump oboje zapiše za tabelami, kot `ALTER TABLE [ONLY] t ALTER [COLUMN] c SET DEFAULT nextval('s'::regclass)` in `ALTER TABLE t ALTER [COLUMN] c ADD GENERATED ... AS IDENTITY`. Vsak od teh stavkov vklopi zastavico `Auto Increment` tega stolpca in počisti njegovo privzeto vrednost. Stavki `CREATE SEQUENCE`, `ALTER SEQUENCE` in vsa druga dejanja `ALTER COLUMN` se preskočijo.  
Stolpec, ki ima neposredno v definiciji tip `serial`, `bigserial` ali `smallserial`, ta tip ohrani, zastavica `Auto Increment` pa ostane izklopljena.

Urejevalnik hrani samo zastavico `Auto Increment`, vsaka zbirka podatkov pa ob izvozu zapiše svojo obliko – glejte razdelek [Samodejno povečevanje](./schema-sql.md#auto-increment). Izvoz za PostgreSQL pri stolpcu `smallint`, `integer` ali `bigint` zapiše `GENERATED ALWAYS AS IDENTITY`, ne glede na to, katera oblika je bila uvožena, pri katerem koli drugem tipu, kot je `INT UNSIGNED`, pa samo vrstico s komentarjem za tabelo. Možnosti zaporedja, kot je `START WITH 100`, se izgubijo.  
Tabela z več stolpci serial ali identity se uvozi z več stolpci s samodejnim povečevanjem, MySQL, MariaDB in SQL Server pa tako tabelo zavrnejo, ko se zažene njen izvoz.

#### Primarni ključi {#primary-keys}

Primarni ključ, ki je tabeli dodan naknadno, `ALTER TABLE t ADD [CONSTRAINT n] PRIMARY KEY (...)`, označi svoje stolpce kot primarni ključ.  
Določila `CLUSTERED` ali `NONCLUSTERED` iz SQL Server in `USING BTREE` iz MySQL pred seznamom stolpcev se prezrejo, zato stavek `ALTER TABLE [dbo].[Users] ADD CONSTRAINT [PK_Users] PRIMARY KEY CLUSTERED ([Id] ASC) WITH (...) ON [PRIMARY]`, ki ga zapiše SQL Server Management Studio, tvori ključ na stolpcu `Id`. Določilo `PRIMARY KEY NONCLUSTERED HASH (...)` pomnilniško optimizirane tabele se ne prebere, ne v `ALTER TABLE` ne v `CREATE TABLE`.

#### Enolični ključi in indeksi {#unique-keys-and-indexes}

Določilo `UNIQUE` nad dvema ali več stolpci postane en enoličen indeks, v vsakem zapisu: `UNIQUE (a, b)`, `UNIQUE KEY n (a, b)`, `UNIQUE INDEX n (a, b)`, `CONSTRAINT n UNIQUE (a, b)`, neposredno zapisani `INDEX n UNIQUE (a, b)` iz SQL Server in `ALTER TABLE t ADD [CONSTRAINT n] UNIQUE (a, b)`.  
Indeks prevzame ime indeksa ključa, sicer njegovo ime `CONSTRAINT`, sicer ostane brez imena, in ohrani smer razvrščanja vsakega stolpca. Tak indeks je [alternativni ključ](./table-related-functions.md#alternate-keys).  
Določilo `UNIQUE` nad enim stolpcem v katerem koli od teh zapisov namesto tega temu stolpcu nastavi zastavico Enolično in ne doda indeksa, zato se omejitev `UQ_<table name>_<column name>`, ki jo zapiše izvoz, vrne kot zastavica, iz katere je bila zapisana. Stavek `CREATE UNIQUE INDEX` nad enim stolpcem ostane enoličen indeks.

Stavek `ALTER TABLE`, ki doda več ključev hkrati, kot ga phpMyAdmin zapiše v obliki `ADD PRIMARY KEY (id), ADD UNIQUE KEY uq_a (a, b), ADD UNIQUE KEY uq_c (c)`, ohrani vse enolične ključe v njem: `uq_a` se uvozi kot enoličen indeks z imenom `uq_a`, `uq_c` pa kot zastavica Enolično stolpca `c`. Ime `CONSTRAINT` poimenuje samo ključ v svojem določilu. Preberejo se tudi `ADD UNIQUE INDEX IF NOT EXISTS n (...)` iz MariaDB ter `ALTER TABLE t WITH CHECK ADD ...` in `WITH NOCHECK ADD ...` iz SQL Server.  
Stavka `CREATE INDEX` in `CREATE UNIQUE INDEX` se prebereta z imeni s shemo, kot sta `public.t` in `[dbo].[t]`, z določili `CLUSTERED` in `NONCLUSTERED` iz SQL Server, z določili `CONCURRENTLY`, `IF NOT EXISTS`, `ON ONLY` in `USING btree` iz PostgreSQL in tudi povsem brez imena indeksa. Skupina datotek `ON [PRIMARY]` iz SQL Server se prezre.  
Možnosti ključa, kot sta `NULLS NOT DISTINCT` ali `USING BTREE`, se ne preberejo zmotno kot ime ključa. V seznamu stolpcev ključa stolpec poimenuje samo prva beseda, zato `b DESC NULLS LAST`, `b text_pattern_ops` in `b COLLATE "C"` vsi tvorijo ključ na stolpcu `b`, pri čemer se `DESC` ohrani kot njegova smer razvrščanja. Dolžina predpone, kot je `email(191)`, se prezre, ključ z delom v obliki izraza, kot je `lower(email)`, pa se v celoti preskoči.

Delni enoličen indeks, `CREATE UNIQUE INDEX ... WHERE ...` ali neposredno zapisani `INDEX n UNIQUE (...) WHERE ...` iz SQL Server, se uvozi kot navaden indeks z enakim imenom in stolpci, ker bi bil ključ, enoličen v celotni tabeli, strožji od filtriranega, ki ga navaja datoteka. Izjema je filter, sestavljen samo iz preverjanj `IS NOT NULL` nad stolpci ključa, povezanih z `AND`, tj. filter, ki ga SQL Server potrebuje, da lahko enoličen stolpec vsebuje več kot en NULL: tak ključ ostane enoličen.  
Enoličen ključ, ki navaja stolpec, ki ga tabela nima, kot je stolpec, dodan s stavkom `ALTER TABLE ... ADD COLUMN`, se v celoti izpusti, namesto da bi se skrčil na obstoječe stolpce. Navaden indeks obdrži obstoječe stolpce.

Oracle SQL Developer in paket `DBMS_METADATA` lastni indeks ključa zapišeta kot ločen stavek `CREATE UNIQUE INDEX`, poimenovan po ključu ali, pri ključu brez imena, ki mu sledi `USING INDEX`, s sistemskim imenom, kot je `SYS_C0012345`. Uvoz tak indeks in indeks, ki ga navaja `ADD CONSTRAINT ... USING INDEX`, prebere kot del njegovega ključa: sestavljeni enolični ključ se uvozi kot en enoličen indeks, primarni ključ ali enoličen ključ z enim stolpcem pa kot zastavice stolpcev brez dodatnega indeksa. Izvoz nazaj za Oracle nato indeks ustvari enkrat.

Izvoz Sheme SQL se za MySQL, MariaDB, MSSQL, Oracle, PostgreSQL in SQLite uvozi nazaj z enakimi zastavicami Enolično in indeksi.  
Snowflake nima sekundarnih indeksov, zato njegov izvoz vrne samo enolične ključe: sestavljeni kot enoličen indeks, ključ z enim stolpcem pa kot zastavico Enolično tega stolpca. Izvoz za Databricks ne navaja nobene enoličnosti, zato se ne vrne nobena.

#### Tuji ključi {#foreign-keys}

Tuji ključ postane relacija v teh zapisih:

- `FOREIGN KEY (...) REFERENCES t (...)` na ravni tabele, z določilom `CONSTRAINT name` ali brez njega.
- `ALTER TABLE ... ADD [CONSTRAINT name] FOREIGN KEY (...) REFERENCES t (...)`, vključno z `ALTER TABLE t WITH CHECK ADD ...` in `WITH NOCHECK ADD ...`, ki ju zapiše SQL Server Management Studio.
- `REFERENCES t (col)`, zapisan neposredno v definiciji stolpca, kot v `user_id INT REFERENCES users (id)`, in `FOREIGN KEY REFERENCES t (col)`, ki ga SQL Server in Snowflake dovoljujeta na tem mestu. Neposredno zapisan sklic na več kot en stolpec se preskoči.

Stavek `ALTER TABLE` da največ eno relacijo, in to samo, če njegovo prvo določilo doda tuji ključ: določilo `FOREIGN KEY` za določilom `ADD PRIMARY KEY` ali `ADD UNIQUE` v istem stavku se ne prebere. Če en stavek doda več tujih ključev, kot jih phpMyAdmin zapiše v obliki `ADD CONSTRAINT fk1 FOREIGN KEY ..., ADD CONSTRAINT fk2 FOREIGN KEY ...`, se prebere samo zadnji.

`REFERENCES t` brez seznama stolpcev kaže na primarni ključ tabele `t`, če ima ta ključ en sam stolpec. Pri sestavljenem primarnem ključu se tuji ključ preskoči.  
Tuji ključ se preskoči in noben njegov stolpec se ne označi kot tuji ključ, če ni najden noben od njegovih ciljnih stolpcev ali če se število najdenih stolpcev v obeh tabelah razlikuje, na primer ko stolpec manjka samo v eni od njiju. Če v obeh tabelah manjka enako število njegovih stolpcev, se najdeni stolpci združijo v pare po zapisanem vrstnem redu, relacija pa vsebuje samo te.  
Vsaka uvožena relacija je `Zero N` in je identifikacijska, če je vsak njen stolpec v podrejeni tabeli tudi primarni ključ.

Določili `ON DELETE` in `ON UPDATE` vsakega tujega ključa postaneta nastavitvi `On Delete` in `On Update` relacije: `NO ACTION`, `RESTRICT`, `CASCADE`, `SET NULL` ali `SET DEFAULT`, ne glede na velikost črk in v poljubnem vrstnem redu. Tuji ključ brez njiju se uvozi kot `Not set`. Za nastavljanje v urejevalniku glejte stran [Urejanje relacij](./relationship-editing.md#on-delete-and-on-update).  
Seznam stolpcev za `SET NULL` ali `SET DEFAULT` v PostgreSQL, kot v `ON DELETE SET NULL (a_id)`, se prezre: dejanje velja za celoten ključ, `ON UPDATE` za seznamom pa se še vedno prebere. `MATCH FULL`, `MATCH PARTIAL` in `MATCH SIMPLE` se preskočijo, atribut stolpca `ON UPDATE CURRENT_TIMESTAMP` iz MySQL pa se ne prebere zmotno kot dejanje.  
Izvoz Sheme SQL se uvozi nazaj z dejanji, ki jih zapiše ta zbirka podatkov, zato se dejanje, ki ga izpusti, kot je `SET DEFAULT` pri MySQL, kateri koli `ON UPDATE` pri Oracle ali kar koli razen `NO ACTION` pri Snowflake, vrne kot `Not set`.

#### Komentarji {#comments}

Komentarji tabel in stolpcev se uvozijo iz treh sintaks, ki jih bere razčlenjevalnik: možnost tabele in atribut stolpca `COMMENT`, ki ju uporabljajo MySQL, MariaDB, Snowflake in Databricks, stavka `COMMENT ON TABLE` in `COMMENT ON COLUMN`, ki ju uporabljata PostgreSQL in Oracle, ter razširjena lastnost `MS_Description`, ki jo SQL Server nastavi z `EXEC sp_addextendedproperty`.  
Komentar za tabelo ali stolpec, ki ga datoteka ne določa, se prezre.

Klici v SQL Server se preberejo z imenovanimi argumenti, kot SQL Server Management Studio v skriptu zapiše vsak komentar (`@name=N'MS_Description', @value=N'...', ..., @level1type=N'TABLE', @level1name=N'Users'`), in s pozicijskimi, kot jih zapiše izvoz MSSQL urejevalnika.  
Komentar da samo lastnost `MS_Description` na tabeli ali na enem od njenih stolpcev na ravni 2. Druga lastnost, pogled, indeks ali omejitev ne da nobenega, prav tako ne komentar, podan v spremenljivki ali sestavljen z operatorjem `+`.

V komentarju, tako kot v vsakem besedilu v narekovajih, kot je vrednost `DEFAULT` ali ime v narekovajih, podvojeni narekovaj pomeni en narekovaj, kot to zapišeta orodji mysqldump in pg_dump: `'it''s'` se prebere kot `it's`.  
Poševnica nazaj pred narekovajem, kot jo MySQL in MariaDB zapišeta v `'it\'s'`, narekovaj prav tako zaščiti. Tak narekovaj še vedno konča besedilo, če mu sledi presledni znak, `,`, `;`, `)`, `]`, `:`, `|`, `+` ali konec datoteke, zato `'C:\'`, `'C:\'::text` iz orodja pg_dump in `'C:\'+name` iz T-SQL ohranijo svojo poševnico nazaj.  
Vrednost `DEFAULT` ohrani narekovaje, narekovaj v njej pa se zapiše nazaj podvojen, ne glede na to, kako ga je zaščitila datoteka: `'it''s'`.  
Če je ob uvozu zbirka podatkov dokumenta Databricks, besedilo v enojnih narekovajih namesto tega sledi pravilom ogrodja Spark: vsaka poševnica nazaj zaščiti znak za njo, zato se `'C:\\dir'` prebere kot `C:\dir`, ubežna zaporedja, kot so `\n`, `\t` in `\u0041`, se dekodirajo, vrednost `DEFAULT` pa se ohrani kot `'it\'s'`.

Kako posamezna zbirka podatkov pri izvozu zapiše komentar in kako v njem zaščiti narekovaj, je opisano v razdelku [Komentarji](./schema-sql.md#comments) na strani Shema SQL.  
Izvoz za MySQL, MariaDB, PostgreSQL, Oracle, Snowflake ali MSSQL se uvozi nazaj kot enaki komentarji tabel in stolpcev, vključno z narekovaji, razen praznih vrstic, ki jih izvoz za Oracle izpusti. Izvoz za Databricks, ki narekovaj in poševnico nazaj zaščiti s poševnico nazaj, se natančno prebere nazaj samo, dokler je izbrana zbirka podatkov Databricks.  
Komentarji se pri izvozu za SQLite in ponovnem uvozu izgubijo: SQLite jih zapiše kot navadne vrstice `--`, ki jih razčlenjevalnik ne bere.  
Razen pri SQLite se logično ime, ki ga je stikalo `Write logical names into empty comments` zapisalo v prazen komentar, uvozi nazaj kot komentar te tabele ali stolpca, ne kot logično ime – glejte razdelek [Logična imena kot komentarji](./schema-sql.md#logical-names-as-comments).

### GraphQL {#graphql}

Uvozite lahko dokument GraphQL SDL.  
Definicije objektnih tipov postanejo tabele, blok `extend type` se združi s tipom, ki ga razširja, polja vmesnikov pa podedujejo tipi, ki jih implementirajo.  
Polje, katerega tip je druga tabela, postane relacija namesto stolpca, seznam na obeh straneh pa ustvari vezno tabelo.  
Polje z eno vrednostjo, kot je `buyer: User`, se najprej poveže z edinim poljem drugega tipa, katerega ime se konča z `By`, ki mu sledi ime tega polja, kot je `orderListByBuyer`, ne glede na velikost črk in podčrtaje; oštevilčeno polje, kot je `buyer2`, se poveže na enak način brez svoje številke. Tako polja poimenuje izhod generatorja kode za GraphQL, kadar si dve tabeli delita več kot eno relacijo ali se tabela sklicuje sama nase, zato se tak izhod uvozi nazaj z vsemi relacijami.  
Korenski tipi (`Query`, `Mutation`, `Subscription`), introspekcijski tipi ter ovojni tipi Relay, federacije in Hasura, kot so `PageInfo`, `*Connection`, `*Edge` in `*_aggregate`, se obravnavajo kot šum in preskočijo.  
Upoštevajo se direktive `@id`, `@primaryKey`, `@unique`, `@autoincrement`, `@default`, `@map`, `@relation`, `@column`, `@table`, `@index` in `@db.*`.  
Ime datoteke se mora končati s končnico `.graphql`, `.gql` ali `.graphqls`. Datoteka Prisma `schema.prisma` ni dokument GraphQL in je tukaj ni mogoče uvoziti.

### DBML {#dbml}

Uvozite lahko datoteko DBML – format, ki ga uporabljata dbdiagram.io in dbdocs.  
Preberejo se bloki `Table`, `TablePartial`, `Ref`, `Enum` in `TableGroup`. Bloki `Project` in samostojni bloki `Note` se preskočijo, ne da bi vplivali na tabele okoli njih.  
Sprejet je vsak zapis sklica: oblika `Ref:` z dvopičjem, poimenovani sklic, bločna oblika `Ref { }` in nastavitev stolpca `[ref: > table.column]`, zapisana neposredno v stolpcu.  
Sklic `<>` mnogo proti mnogo ustvari vezno tabelo, poimenovano po obeh straneh.  
Nastavitvi `delete` in `update` samostojnega sklica postaneta nastavitvi `On Delete` in `On Update` relacije, kot v `Ref: users.id < posts.user_id [delete: cascade, update: set null]`. Vrednosti so `cascade`, `restrict`, `set null`, `set default` in `no action`, ne glede na velikost črk. Kar koli drugega ali odsotnost nastavitve se uvozi kot `Not set`, druge nastavitve, kot je `color`, pa se prezrejo.  
Nastavitev `[ref: ...]` v stolpcu ne prenaša dejanj, nastavitve sklica `<>` pa se ne prenesejo na vezno tabelo. Če je isti tuji ključ deklariran tako v stolpcu kot s samostojnim sklicem, se ohrani tisti v stolpcu, brez dejanj.  
Nastavitev `headercolor` tabele, kot v `Table users [headercolor: #3498DB]`, postane njena barva, če je vrednost šestnajstiška koda `#rgb` ali `#rrggbb`, zapisana brez narekovajev. Vsaka druga vrednost se izpusti, nastavitev `headercolor` bloka `TablePartial` pa se ne prenese na tabele, ki ga uporabljajo.  
Vsak blok `TableGroup` postane [skupina tabel](./table-groups.md) s tabelami, ki jih navaja po eno v vrstici in jih poimenuje tako, kot jih poimenuje `Ref`. Njegova nastavitev `[color: ...]` postane barva skupine po enakem pravilu kot `headercolor`, njegova opomba in druge nastavitve pa se izpustijo. Tabela, ki jo navajata dve skupini, ostane v prvi. Skupina, ki ostane brez tabel, se ne ustvari, ne glede na to, ali ne navaja nobene tabele, ki jo deklarira datoteka, ali samo tabele, ki jih je že prevzela prejšnja skupina. Okvir skupine se prilagodi njenim tabelam, kjer koli so razporejene, ko pa se tabele razporedijo v vrstice, ostanejo tabele skupine skupaj.  
Ime datoteke se mora končati s končnico `.dbml`.

### AML {#aml}

Uvozite lahko datoteko AML (Azimutt Markup Language). Sprejeti sta tako trenutna kot stara sintaksa v1.  
Entitete postanejo tabele, gnezdeni atributi pa se sploščijo v ime stolpca s pikami, kot je `settings.slug`.  
Atributi so `NOT NULL`, razen če so označeni z `nullable`, konstrukti, za katere urejevalnik nima mesta, kot so `check`, `type` in `tags`, pa se izpustijo, namesto da bi bili zavrnjeni. Entiteta, označena kot pogled, se uvozi kot navadna tabela.  
Lastnost `color` entitete, kot v `users {color: red}`, postane barva njene tabele. Imena barv v AML, `red`, `orange`, `amber`, `yellow`, `lime`, `green`, `emerald`, `teal`, `cyan`, `sky`, `blue`, `indigo`, `violet`, `purple`, `fuchsia`, `pink`, `rose` in `gray`, se preberejo ne glede na velikost črk, v narekovajih ali brez njih, vsako kot odtenek 500 barve Tailwind z istim imenom, na primer `#ef4444` za `red`. Šestnajstiška koda v narekovajih, kot je `"#3498db"`, se ohrani, kot je zapisana; gole kode `#3498db` ni mogoče prebrati, ker `#` v AML začne komentar. Vsaka druga vrednost in lastnost `color` na atributu ali relaciji se izpusti.  
Samostojni stavek `rel` ali `fk` v stari sintaksi ohrani lastnosti `onDelete` in `onUpdate` kot nastavitvi `On Delete` in `On Update` relacije, kot v `rel posts(user_id) -> users(id) {onDelete: cascade, onUpdate: "set null"}`. Vrednosti so `cascade`, `restrict`, `set null`, `set default` in `no action`, v narekovajih ali brez njih, ne glede na velikost črk. Druge lastnosti se izpustijo.  
Pri relaciji, zapisani neposredno v atributu, kot je `user_id int -> users(id) {onDelete: cascade}`, lastnosti pripadajo atributu, zato se izpustijo, relacija pa se uvozi kot `Not set`.  
Ime datoteke se mora končati s končnico `.aml`.

GraphQL, DBML in AML so formati za izmenjavo v obe smeri: vsak je tudi cilj [generatorja kode](./code-generator.md).  
DBML in AML prenašata ON DELETE in ON UPDATE vsake relacije v obe smeri – glejte stran [Generator kode](./code-generator.md#on-delete-and-on-update). GraphQL ne prenaša nobenega od njiju, zato sta po uvozu GraphQL obe nastavitvi `Not set`.  
DBML v obe smeri prenaša tudi barve tabel, brez morebitne prosojnosti, in vsako skupino tabel, ki vsebuje vsaj eno tabelo. Skupina brez imena se vrne kot `group_1`, `group_2` in tako naprej, ponovljeno ime skupine pa se vrne z dodanim `_2`, `_3` in tako naprej. AML prenaša barvo tabele samo kot najbližje od svojih imen barv, zato se `#FF8800` zapiše kot `orange` in vrne kot `#f97316`, skupin pa ne prenaša. GraphQL ne prenaša ne barv ne skupin.  
Nobeden od teh treh formatov ne prenaša logičnih imen, povezav z domenami ali slovarjev, v nobeno smer: generator kode zapiše fizično ime in podatkovni tip vsake tabele in stolpca, nikoli logičnega imena ali domene.

## Izvoz {#exporting}

Podmeni `Export` v priročnem meniju platna ima tri postavke:

- json: shrani diagram tako, kot ga vsebuje njegova datoteka, kot datoteko `.erd.json`: tabele z njihovimi stolpci in indeksi, relacije, beležke in skupine tabel, logična imena in povezave stolpcev z domenami, besede, izraze in domene zavihka [Slovar](./dictionary.md) ter nastavitve, pri čemer ima vsaka [zaklenjena nastavitev](./settings.md#lock) svojo zaklenjeno vrednost. Kar ne vsebuje ničesar, na primer prazno besedilo ali prazna vrstica slovarja, je izpuščeno – glejte razdelek [Oblika za shranjevanje in vrednost med izvajanjem](../../api/advanced/schema.md#storage-form-and-runtime-value).
- Schema SQL: odpre zavihek [Shema SQL](./schema-sql.md#saving-or-copying-the-sql) z odprto ploščo z možnostmi in fokusom na gumbu `Save file`, tako da pritisk tipke `Enter` shrani kodo SQL, ki jo prikazuje zavihek, kot datoteko `.sql`. Do takrat se ne shrani nič.
- Image: odpre pogovorno okno `Export image`, ki diagram shrani kot datoteko `.png` ali `.svg` ali ga kopira v odložišče kot PNG – glejte razdelek [Slika](#image).

Vse tri delujejo v urejevalniku samo za branje.  
Lastni ukaz `Export CSV` zavihka Slovar, ki ga v tem podmeniju ni, shrani list `Domains`, `Words` ali `Terms` kot datoteko CSV. Za razliko od teh treh v urejevalniku samo za branje ni na voljo – glejte razdelek [Uvoz in izvoz CSV](./dictionary.md#importing-and-exporting-csv).

Shema SQL zapiše ON DELETE in ON UPDATE vsake relacije za njenim določilom `REFERENCES`, najprej ON DELETE. Vrednost `Not set` ne zapiše ničesar, dejanje, ki ga izbrana zbirka podatkov ne sprejema, pa je izpuščeno. Katera zbirka podatkov sprejema katero dejanje, je opisano na strani [Urejanje relacij](./relationship-editing.md#on-delete-and-on-update).

Vsaka izvožena datoteka dobi ime `<database name>-<timestamp>`, ki mu sledi njena končnica, pri čemer je časovni žig v lokalnem času, oblikovan kot `yyyy-MM-dd'T'HH_mm_ss` – na primer `my-schema-2026-08-29T04_05_06.erd.json`. Če je ime zbirke podatkov prazno, se uporabi `unnamed`.  
Gumba `Save file` na zavihku Shema SQL in v [generatorju kode](./code-generator.md) poimenujeta datoteke na enak način, prav tako ukaz `Export CSV`, ki za časovnim žigom doda list: `-words.csv`, `-terms.csv` ali `-domains.csv`. Slika prevzame ime zbirke podatkov, kakršno je bilo ob odprtju pogovornega okna.

Ukazi `Import`, `Import and Add` in `Export` so na voljo tudi v [hitrem iskanju](./quick-search.md) na zavihku ERD, z enakimi postavkami kot v priročnem meniju platna.

V aplikaciji Obsidian se ne prikaže nobeno pogovorno okno za prenos ali shranjevanje: datoteka se zapiše v trezor, tja, kamor Obsidian postavi nove priloge za ta diagram, obvestilo pa navede njeno pot.  
Znaki, ki jih Obsidian v imenu datoteke ne dovoli, `\ / : * ? " < > |`, se nadomestijo z vezajem `-`.  
Raziskovalec datotek v aplikaciji Obsidian izvoženo datoteko `.erd.json` ali `.sql` prikaže samo, kadar je vklopljena možnost Settings → Files and links → Detect all file extensions.

### Slika {#image}

`Export` ▸ `Image` v priročnem meniju platna ali v hitrem iskanju odpre pogovorno okno `Export image`: predogled slike ob njenih možnostih. Odprt [raziskovalec](./explorer.md#dialogs-beside-it) ostane odprt pod zatemnjenim območjem.

![Odpiranje Export > Image, izklop temnega načina in ozadja, izbira 3x in kopiranje slike v odložišče](/img/demo-export.webp)

- `Background`: privzeto vklopljeno. Ko je izklopljeno, ostane platno prosojno.
- `Dark mode`: na začetku se ujema z videzom urejevalnika. Dokler se ujema z videzom na zaslonu, slika prevzame lastne barve platna, vključno s spremembami v [izbirniku teme](./language-and-theme.md); drugi videz uporabi prednastavitev z enakimi sivimi toni in barvo poudarka.
- `Scale`: `1x`, `2x` ali `3x`, pri čemer je privzeto izbrano `2x`. Določa samo velikost slike PNG in kopije v odložišču, vrstica pod možnostjo pa to velikost navede kot `PNG <width> × <height> px`.

Izbire se ohranijo, dokler se urejevalnik ne zapre, in se nikoli ne shranijo v dokument. Predogled se izriše na enak način kot slika in se znova izriše, ko se spremeni možnost `Background` ali `Dark mode`.

Slika vsebuje diagram, kakršen je bil ob odprtju pogovornega okna; če želite zajeti poznejše spremembe, okno zaprite in znova odprite. Njene tabele in stolpci so poimenovani v prikazu imen, ki ga je takrat prikazoval urejevalnik, tudi če ste ga preklopili samo na svojem zaslonu, medtem ko zaklep `Name View` v datoteki ohranja drugega – glejte razdelek [Zunaj platna](./logical-names.md#beyond-the-canvas). Barve, ki jih [preverjanja slovarjev](./dictionary.md#marks-on-the-canvas) dajo imenom na platnu, se ne izrišejo. Vsebuje celoten diagram, ne glede na to, kako daleč je pomaknjen iz vidnega območja, obrezana je na to, kar diagram izriše, z dodanim robom, in vedno je izrisana pri 100 %, ne glede na povečavo, ki jo prikazuje urejevalnik, tako da je vsaka tabela izrisana v celoti. Kar skrivajo [možnosti pogleda](./table-related-functions.md#table-view-options) – relacije, njihove oznake ON DELETE in ON UPDATE, skupine tabel ali beležke –, se ne izriše in zanj ni prostora, skupine tabel pa se izrišejo za vsem drugim.

Sliko zapišejo trije gumbi in vsak pusti pogovorno okno odprto:

- `PNG`: shrani datoteko `.png` v velikosti diagrama pri 100 %, pomnoženi z vrednostjo `Scale`. Slika PNG, ki je prevelika za platno brskalnika, se zapiše v zmanjšani ločljivosti, namesto da bi izvoz spodletel: pogovorno okno vnaprej opozori s sporočilom `Reduced from <width> × <height> px, past what a browser canvas can hold`, pozneje pa to sporoči obvestilo `Exported at a reduced resolution`.
- `SVG`: shrani datoteko `.svg` v velikosti diagrama pri 100 %, ne glede na vrednost `Scale`, in je nikoli ne zmanjša. Besedilo v njej ostane besedilo, pisave pa so navedene po imenu in niso vdelane, zato pregledovalnik brez pisave urejevalnika izriše drugo. Sence so izpuščene.
- `Copy to clipboard`: v odložišče postavi sliko PNG z izbrano vrednostjo `Scale`, zmanjšano tako kot shranjena slika PNG, kadar je platno brskalnika ne more vsebovati. Potrdi s sporočilom `Copied the image to the clipboard` ali s sporočilom `Copied at a reduced resolution`, če je bila slika zmanjšana. Če kopiranje ne uspe, ker brskalnik ali gostitelj zavrne dostop do odložišča ali slike ni bilo mogoče izrisati, sporočilo `Couldn't copy the image` predlaga, da namesto tega shranite sliko PNG.

Slika se izriše v procesu v ozadju, če ga gostitelj poganja, tako da je urejevalnik medtem še naprej uporaben. Če traja dlje kot trenutek, se prikaže obvestilo `Exporting PNG`, `Exporting SVG` ali `Copying image`, napaka pa se sporoči kot `Couldn't export the PNG` ali `Couldn't export the SVG`. Če pogovorno okno zaprete, medtem ko se datoteka še izrisuje, se ta datoteka vseeno shrani.

Ko se pogovorno okno odpre, ima fokus gumb `PNG`, tipka `Tab` pa ostane znotraj okna. Tipka `Escape`, gumb `x` ali klik na zatemnjeno območje okoli okna ga zapre.  
Dokler je okno odprto, bližnjice platna, vključno z razveljavitvijo in uveljavitvijo, ter kopiranje in lepljenje ne naredijo ničesar. `Ctrl + K` (Windows/Linux) ali `⌘ + K` (Mac) ga zapre in odpre hitro iskanje. `Ctrl + F` (Windows/Linux) ali `⌘ + F` (Mac) ga zapre in postavi kazalko v iskalno polje [raziskovalca](./explorer.md#opening-and-closing), pri čemer raziskovalec odpre, če je zaprt, nikoli pa ga ne zapre. V urejevalniku, ki je preozek za prikaz raziskovalca, bližnjica pogovorno okno vseeno zapre, vendar namesto premika kazalke prikaže pojavno obvestilo.
