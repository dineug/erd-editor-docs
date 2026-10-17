---
sidebar_position: 2
description: Inportatu JSON, SQL eskema, GraphQL, DBML edo AML diagramaren ordez edo haren azpian gehituta, eta esportatu JSON, SQL eskema edo diagrama PNG edo SVG irudi gisa.
---

# Fitxategiak inportatzea edo esportatzea

## Kanpoko fitxategiak inportatzea {#importing-external-files}

Bost formatu inporta daitezke, oihalaren laster-menuko `Import` azpimenutik:

- json
- Schema SQL
- GraphQL
- DBML
- AML

`Import` aukeraren azpian bertan dagoen `Import and Add` aukerak fitxategia diagramari gehitzen dio, hura ordeztu beharrean. Ikus [Inportatu eta gehitu](#import-and-add).  
Diagrama huts batek erakusten duen ongietorri-pantailak `Import` aukera bat du, bost formatu berberekin. Ikus [Ongietorri-pantaila](./editing-start.md#welcome-screen).

Fitxategi-luzapenak maiuskulak eta minuskulak bereizi gabe egiaztatzen dira. Aukeratutako formatuarekin bat ez datorren luzapena duen fitxategi bat hautatzeak inportazioa bertan behera uzten du eta `Only <format> files can be imported` erakusten du; formatua `json`, `sql`, `graphql`, `dbml` edo `aml` gisa idazten da, `Only sql files can be imported` adibidean bezala.

`Import` aukerak uneko dokumentua ordezten du, harekin bateratu beharrean, eta desegite bakar batek aurreko diagrama itzultzen du.  
JSON fitxategi batek bere ezarpenak dakartza, bere [blokeoak](./settings.md#lock) barne. Fitxategiak fitxa, Kode-sortzailearen lengoaia, izenen idazkera bat edo mugatzaile mota blokeatzen dituen kasuetan, lehen zenuena ikusten jarraitzen duzu, baina fitxategiaren balio blokeatua da gordetzen dena. Ikuspen-eremua, blokeatuta egon ala ez, fitxategiak adierazten duen tokira joaten da. Blokeoak existitu baino lehen gordetako JSON fitxategi bat blokeo guztiak aktibatuta eta ikuspen-eremua % 100eko zoomean dituela sartzen da.  
Gainerako formatuek lehendik dituzun ezarpenak gordetzen dituzte, blokeoak barne, ikuspen-eremua izan ezik, % 100eko zoomean hasten baita.  
GraphQL, DBML eta AML analizatzaileek ez dute inoiz huts egiten: irakur ezin duten fitxategi batek diagrama huts bat sortzen du, errore bat eman beharrean.

JSON fitxategi batek dituen kokapenak gordetzen ditu. SQL eskema, GraphQL, DBML edo AML fitxategi bateko taulak diagrama aldatu aurretik kokatzen dira:

- Fitxategiak bi taula edo gehiago eta gutxienez erlazio bat dituenean, `Flow` moduko [Antolaketa automatikoa](./table-related-functions.md#auto-layout) erabiliz antolatzen dira, ezkerretik eskuinera erlazioei jarraituz, oihalaren goiko ezkerreko izkinatik hasita. Taula batek bere buruarekin duen erlazio bat ere kontuan hartzen da.
- Bestela, errenkadatan jartzen dira goiko ezkerreko izkinatik hasita, zutabe gutxien dituzten taulak lehenik.
- Antolaketak 6 segundo baino gehiago irauten badu, `Placing tables` abisua agertzen da `Cancel` botoiarekin. `Cancel` botoiak, edo `Escape` teklak abisua ikusgai dagoen bitartean, antolaketa bertan behera uzten du eta taulak errenkadatan jartzen ditu horren ordez. Errenkadak abisurik gabe ere erabiltzen dira antolaketak huts egiten duenean, 60 segundoren barruan antolaketarik itzultzen ez denean edo ostalariak worker partekaturik exekutatzen ez duenean. Ikus [Web Workers](../../api/installation.md#web-workers).

Ondoren, diagrama urrats bakarrean ordezten da, eta, beraz, tartean ez da ezer ikusten. Taulak kokatzen diren bitartean aldatzen duzun ezarpen bat, fitxa adibidez, gorde egiten da, eta bitartean beste fitxategi bat inportatzen baduzu, azken hasitako inportazioa nagusitzen da.

Irakurtzeko soilik dagoen editore batek ez du ezer kargatzen `Import` aukeratik, eta ez du `Import and Add` aukera eskaintzen.

### Inportatu eta gehitu {#import-and-add}

`Import and Add` aukerak diagrama gordetzen du eta fitxategi bat gehitzen du haren azpian. Oihalaren laster-menuan eta ERD fitxako [Bilaketa azkarrean](./quick-search.md) dago, eta `Import` aukeraren bost formatu berberak eskaintzen ditu, luzapen-egiaztapen berarekin.

![SQL fitxategi bat gehitzea Import and Add > Schema SQL bidez; haren taulak diagramaren azpian kokatzen dira, erlazioei jarraituz antolatuta eta hautatuta](/img/demo-import-and-add.webp)

Fitxategia itsaste baten moduan sartzen da: dituen taula, zutabe, erlazio, indize, ohar eta [taula-talde](./table-groups.md) guztiak berri gisa gehitzen dira, diagraman lehendik dauden taulak ez dira mugitzen eta ez da ezarpenik aldatzen; beraz, JSON fitxategi baten ezarpenak kanpoan geratzen dira.  
Diagraman lehendik dagoen izena duen taula bat izen bereko bigarren taula gisa gehitzen da, eta ez da harekin bateratzen. Erlazioak eta indizeak fitxategitik soilik datoz; beraz, fitxategiak definitzen ez duen taula baterako gako arrotz bat ez da diagraman lehendik dagoen taula batekin lotzen.

Gehitutako blokea diagramak duen guztiaren azpi-azpian kokatzen da, haren ezkerreko ertzarekin lerrokatuta, edo diagrama huts baten goiko ezkerreko izkinan. [View Option](./table-related-functions.md#table-view-options) bidez ezkutatutako oharrak eta taula-taldeak ere kontuan hartzen dira, bertan jarraitzen baitute.  
Blokearen barruan, JSON fitxategi batek bere antolaketa gordetzen du, bere taula-taldeak barne. Gainerako formatuak `Import` aukerak kokatzen dituen bezala kokatzen dira, `Flow` bidez edo errenkadatan, arau berberen arabera, eta taula-talde bakoitzaren koadroa bere taulen inguruan doitzen da. Gehitutako taulak eta oharrak lehendik dagoen guztiaren gainean pilatzen dira.

Blokea kokatu ondoren, gehitutakoa soilik hautatzen da: taula berriak, eta baita ohar eta taula-talde berriak ere, erakusten diren bitartean. Bitartean beste fitxa batera joan bazara, editorea ERD fitxara itzultzen da blokea kokatu aurretik. Ondoren, ikuspen-eremua blokeraino korritzen da uneko zoomarekin, blokea dagoeneko ondo ikusten denean izan ezik. Ikus [Jauziaren helmuga](./table-related-functions.md#where-a-jump-lands). Desegite bakar batek gehitutako guztia desegiten du.  
Analizatzaileak irakur ezin duen fitxategi batek, edo taularik eta oharrik ez duen batek, ez du ezer gehitzen.

Bat oraindik kokatzen den bitartean gehitutako SQL eskema, GraphQL, DBML edo AML fitxategi guztiak kokatzen dira, hasi ziren ordenan. Bitartean gehitutako JSON fitxategi bat irakurri bezain laster kokatzen da, haien aurretik. `Import` erabiltzeak, edo beste dokumentu bat kargatzeak, oraindik kokatu gabe dauden guztiak baztertzen ditu.

Kodetze-agenteek modu berean gehitzen dute fitxategi bat MCP inportazio-tresnen `append` moduarekin; modu horrek JSON fitxategi baten antolaketa gordetzen du, baina gainerako formatuen taulak errenkadatan jartzen ditu, inoiz ez `Flow` bidez. Ikus [Inportazioa](../../mcp/tools.md#import).

### JSON {#json}

[Editorean definitutako eskema-formatuan](../../api/advanced/schema.md) dauden fitxategiak inporta ditzakezu.
Fitxategi-izenak `.json` luzapenarekin amaitu behar du; beraz, `<database name>-<timestamp>.erd.json` gisa esportatutako fitxategi bat dagoen bezala inporta daiteke berriro, eta `.erd` edo `.vuerd` fitxategi soil bat ez da hemen onartzen. Aurreko bertsioek gordetako fitxategiak ere irakurtzen dira.

![Gordetako fitxategi bat inportatzea Import > json bidez; zirriborro-dokumentua eta haren ezarpenak ordezten ditu](/img/demo-import-json.webp)

### SQL eskema {#schema-sql}

SQLz definitutako eskema-fitxategiak ere inporta ditzakezu.  
Analizatzaileak ahalik eta malguenak egin diren arren, datu-base hornitzailea edozein dela ere, baliteke sintaxi batzuk onartuta ez egotea.  
Fitxategi-izenak `.sql` luzapenarekin amaitu behar du.  
[Onartutako sintaxia hemen egiazta daiteke.](https://github.com/dineug/erd-editor/tree/main/packages/schema-sql-parser)

![SQL fitxategi bat inportatzea Import > Schema SQL bidez; haren taulak erlazioei jarraituz antolatzen dira, eta ondoren zooma txikiagotzen da haien gainean](/img/demo-import-sql.webp)

Zutabeak `CREATE TABLE` sententziatik soilik datoz. `ALTER TABLE ... ADD COLUMN` sententziak gehitutako zutabe bat ez da irakurtzen.  
`CREATE TABLE` sententzia bateko zutabe ez diren elementuak saltatu egiten dira, zutabe gisa irakurri beharrean: izenik gabeko `CHECK (...)` bat, PostgreSQLen `LIKE` eta `EXCLUDE`, `INDEX` edo `KEY` gabe idatzitako MySQLen `FULLTEXT` eta `SPATIAL`, T-SQLen `PERIOD FOR` eta Oracle datu-baseko `SUPPLEMENTAL LOG DATA`.  
Horietako baten izena duen zutabe bat inportatu egiten da, hala ere, izenaren ondoren mota integratu bat badator, `exclude BOOLEAN` adibidean bezala, edo izena komatxoen artean badago, `"check" int` adibidean bezala. Komatxorik gabeko `like` bat, ondoren integratua ez den mota bat duela, `like citext` adibidez, PostgreSQLen `LIKE` gisa irakurtzen da eta saltatu egiten da.  
`CHECK` murriztapenak berak ez dira inportatzen, editoreak ez baitu haiek gordetzeko tokirik.

#### Datu motak {#data-types}

Zutabe baten datu mota gorde egiten da, argumentu-zerrenda barne, nahiz eta ez izan [onartutako datu-baseetako](./table-related-functions.md#databases) ezeinen mota integratua.  
Horrek barne hartzen ditu `CREATE TYPE` bidez egindako enum edo mota konposatu bat, `CREATE DOMAIN` bidez egindako domeinu bat, `hstore`, `citext` eta `ltree` bezalako luzapen-motak, `public.mood` bezalako eskemaz kualifikatutako izenak, eta `"MyType"` eta `[dbo].[Phone]` bezalako komatxo edo kortxete arteko izenak, beren komatxoak edo kortxeteak gordetzen dituztenak. `CREATE TYPE`, `CREATE DOMAIN` eta `CREATE EXTENSION` sententziak berak saltatu egiten dira.  
Mota integratu batek bere komatxoak edo kortxeteak galtzen ditu; beraz, `[int]` `int` gisa sartzen da, eta `[nvarchar](50)` `nvarchar(50)` gisa. PostgreSQLen `"char"` eta `"bit"` motek beraienak gordetzen dituzte, `char` eta `bit` motez bestelakoak baitira.  
Matrize-atzizkiak edozein motatan mantentzen dira: `integer[]`, `text[3][3]`, `integer ARRAY`, `mood[]`. SQLite datu-baseko `UNSIGNED BIG INT` osorik sartzen da.  
MySQLen eta MariaDBren `UNSIGNED` eta `ZEROFILL`, mota baten eta haren argumentuen ondoren berehala idatzita, motaren parte izaten jarraitzen dute, idatzi bezala: `INT UNSIGNED`, `SMALLINT(5) UNSIGNED ZEROFILL`, mysqldump tresnaren `int unsigned`. `SIGNED`, lehenetsia dena, kendu egiten da; beraz, `TINYINT SIGNED` `TINYINT` gisa sartzen da. Beste zutabe-aukera baten ondoren idatzitako aldatzaile bat kendu egiten da, MySQLek ukatzen duen `INT NOT NULL UNSIGNED` adibidean bezala.  
`ENUM(...)` eta `SET(...)` balioek beren komatxoak gordetzen dituzte, eta balio baten barruko komatxoa bikoiztuta geratzen da, `ENUM('a','it''s')` adibidean bezala. MySQLen alderantzizko barraz ihes egindako `'it\'s'` ere modu berean bikoiztuta sartzen da. Databricks datu-baseko `STRUCT<...>` mota batean, komatxo arteko eremu-izenek eta eremu baten `COMMENT` balioak beren komatxoak gordetzen dituzte.  
Motarik gabe idatzitako zutabe bat, hala nola SQLite datu-baseko motarik gabeko zutabe bat edo `AS` zutabe kalkulatu bat, motarik gabe geratzen da: `NOT`, `NULL`, `DEFAULT`, `PRIMARY` edo `REFERENCES` bezalako gako-hitz bat, edo komatxo bakunen arteko kate bat, ez da mota gisa irakurtzen.

#### Balio lehenetsiak {#defaults}

Zutabe baten `DEFAULT` klausulak bere adierazpen osoa gordetzen du, adibidez `now()`, `0.5`, `CURRENT_TIMESTAMP` edo `ARRAY[]::text[]`, hurrengo zutabe-aukeraraino, koma bateraino edo itxierako parentesiraino. `CASE ... END` bat osorik irakurtzen da.  
Adierazpen osoaren inguruko parentesiak kendu egiten dira; beraz, SQL Serverren `((0))` `0` gisa sartzen da, eta `(getdate())` `getdate()` gisa. Literal baten mota-bihurketa ere kendu egiten da; beraz, pg_dump tresnaren `'draft'::character varying` `'draft'` gisa sartzen da, eta `NULL::character varying` `NULL` gisa; beste mota-bihurketek bere horretan jarraitzen dute, `ARRAY[]::text[]` eta `lower('A'::text)` adibideetan bezala.  
MySQLen `ON UPDATE CURRENT_TIMESTAMP` kendu egiten da, zutabe batek ez baitu horretarako tokirik, eta haren aurreko balio lehenetsiak bere horretan jarraitzen du. Oracle datu-baseko `DEFAULT ON NULL 0`, `FOR INSERT ONLY` edo `FOR INSERT AND UPDATE` klausularekin edo gabe, `0` gisa sartzen da.  
Aurrizkia duen kate bat, adibidez `N'x'`, `E'x'`, `B'0'`, `X'ff'`, `U&'x'` edo `_utf8mb4'x'`, kate bakar gisa irakurtzen da, barruan parentesi bat badu ere.

SQL Server Management Studio tresnak balio lehenetsiak taulen ondoren idazten ditu bere scriptetan, `ALTER TABLE [dbo].[t] ADD CONSTRAINT [DF_x] DEFAULT ((1)) FOR [col]` gisa. Halako sententzia batek zutabe horren balio lehenetsia ezartzen du, hemen `1`, eta haren murriztapen-izena kendu egiten da.

SQL eskemaren esportazio batek parentesiak berriro jartzen ditu datu-base batek balio lehenetsi baten adierazpena haien barruan soilik irakurtzen duen kasuetan. Ikus [Balio lehenetsiak](./schema-sql.md#defaults).

#### Gehikuntza automatikoa {#auto-increment}

`AUTO_INCREMENT`, `AUTOINCREMENT` eta `IDENTITY` gako-hitzek zutabe baten `Auto Increment` marka aktibatzen dute, eta baita `GENERATED ALWAYS AS IDENTITY` eta `GENERATED BY DEFAULT AS IDENTITY` klausulek ere, balio lehenetsirik uzten ez dutenak.  
Gauza bera egiten du PostgreSQLen `nextval()` dei bakar bat den balio lehenetsi batek, hau da, serial zutabe batek jasotzen duenak, `nextval('s')` gisa idatzita edo, pg_dump tresnak idazten duen bezala, `nextval('s'::regclass)` gisa. Sekuentziaren izena ez da gordetzen. Sekuentzia bat erabiltzea besterik egiten ez duen balio lehenetsi bat, adibidez `nextval('s') + 1` edo SQL Serverren `NEXT VALUE FOR s`, balio lehenetsi arrunt gisa geratzen da.  
pg_dump tresnak biak taulen ondoren idazten ditu, `ALTER TABLE [ONLY] t ALTER [COLUMN] c SET DEFAULT nextval('s'::regclass)` eta `ALTER TABLE t ALTER [COLUMN] c ADD GENERATED ... AS IDENTITY` gisa. Bi sententzietako edozeinek zutabe horren `Auto Increment` marka aktibatzen du eta haren balio lehenetsia garbitzen du. `CREATE SEQUENCE`, `ALTER SEQUENCE` eta beste `ALTER COLUMN` ekintza guztiak saltatu egiten dira.  
Lerroan bertan `serial`, `bigserial` edo `smallserial` motarekin idatzitako zutabe batek mota hori gordetzen du, `Auto Increment` marka desaktibatuta.

Editoreak `Auto Increment` marka soilik gordetzen du, eta datu-base bakoitzak bere forma idazten du esportatzean. Ikus [Gehikuntza automatikoa](./schema-sql.md#auto-increment). PostgreSQL esportazio batek `GENERATED ALWAYS AS IDENTITY` idazten du `smallint`, `integer` edo `bigint` zutabe batean, inportatutako forma edozein dela ere, eta beste edozein motatan, `INT UNSIGNED` adibidez, iruzkin-lerro bat besterik ez taularen ondoren. `START WITH 100` bezalako sekuentzia-aukerak galdu egiten dira.  
Hainbat serial edo identity zutabe dituen taula bat gehikuntza automatikoko hainbat zutaberekin inportatzen da, eta MySQL, MariaDB eta SQL Server datu-baseek halako taula bat ukatzen dute haren esportazioa exekutatzean.

#### Gako nagusiak {#primary-keys}

Bere taularen ondoren gehitutako gako nagusi batek, `ALTER TABLE t ADD [CONSTRAINT n] PRIMARY KEY (...)`, bere zutabeak gako nagusi gisa markatzen ditu.  
Zutabe-zerrendaren aurreko SQL Serverren `CLUSTERED` edo `NONCLUSTERED` eta MySQLen `USING BTREE` ez dira kontuan hartzen, eta irakurketak aurrera jarraitzen du; beraz, SQL Server Management Studio tresnak bere scriptetan idazten duen `ALTER TABLE [dbo].[Users] ADD CONSTRAINT [PK_Users] PRIMARY KEY CLUSTERED ([Id] ASC) WITH (...) ON [PRIMARY]` sententziak `Id` zutabea gako bihurtzen du. Memoria-optimizatutako taula baten `PRIMARY KEY NONCLUSTERED HASH (...)` ez da irakurtzen, ez `ALTER TABLE` sententzian, ez `CREATE TABLE` sententzian.

#### Gako bakarrak eta indizeak {#unique-keys-and-indexes}

Bi zutabe edo gehiagoren gaineko `UNIQUE` bat indize bakar bihurtzen da, idazmolde guztietan: `UNIQUE (a, b)`, `UNIQUE KEY n (a, b)`, `UNIQUE INDEX n (a, b)`, `CONSTRAINT n UNIQUE (a, b)`, SQL Serverren lerroko `INDEX n UNIQUE (a, b)` eta `ALTER TABLE t ADD [CONSTRAINT n] UNIQUE (a, b)`.  
Indizeak gakoaren indize-izena hartzen du, edo, bestela, haren `CONSTRAINT` izena, edo, bestela, izenik ez, eta zutabe bakoitzaren ordena gordetzen du. Halako indize bat [gako alternatibo](./table-related-functions.md#alternate-keys) bat da.  
Zutabe bakar baten gaineko `UNIQUE` batek, idazmolde horietako edozeinetan, zutabe hori Bakarra gisa markatzen du horren ordez, eta ez du indizerik gehitzen; beraz, esportazioak marka batetik idazten duen `UQ_<table name>_<column name>` murriztapena marka hori bera bihurtzen da berriro. Zutabe bakar baten gaineko `CREATE UNIQUE INDEX` batek indize bakar izaten jarraitzen du.

Hainbat gako aldi berean gehitzen dituen `ALTER TABLE` batek, phpMyAdmin tresnak `ADD PRIMARY KEY (id), ADD UNIQUE KEY uq_a (a, b), ADD UNIQUE KEY uq_c (c)` idazten duen bezala, bertako gako bakar guztiak gordetzen ditu: `uq_a` `uq_a` izeneko indize bakar gisa sartzen da, eta `uq_c` `c` zutabearen Bakarra marka gisa. `CONSTRAINT` izen batek bere klausulako gakoa soilik izendatzen du. MariaDBren `ADD UNIQUE INDEX IF NOT EXISTS n (...)` eta SQL Serverren `ALTER TABLE t WITH CHECK ADD ...` eta `WITH NOCHECK ADD ...` ere irakurtzen dira.  
`CREATE INDEX` eta `CREATE UNIQUE INDEX` sententziak irakurtzen dira `public.t` eta `[dbo].[t]` bezalako izen kualifikatuekin, SQL Serverren `CLUSTERED` eta `NONCLUSTERED` gako-hitzekin, PostgreSQLen `CONCURRENTLY`, `IF NOT EXISTS`, `ON ONLY` eta `USING btree` gako-hitzekin, eta indize-izenik batere gabe ere. SQL Serverren `ON [PRIMARY]` fitxategi-taldea ez da kontuan hartzen.  
`NULLS NOT DISTINCT` edo `USING BTREE` bezalako gako-aukerak ez dira gakoaren izentzat hartzen. Gako baten zutabe-zerrendan lehen hitzak soilik izendatzen du zutabea; beraz, `b DESC NULLS LAST`, `b text_pattern_ops` eta `b COLLATE "C"` adibide guztiek `b` zutabea gako bihurtzen dute, eta `DESC` haren ordena gisa gordetzen da. `email(191)` bezalako aurrizki-luzera bat ez da kontuan hartzen, baina adierazpen-zati bat duen gako bat, `lower(email)` adibidez, osorik saltatzen da.

Indize bakar partzial bat, `CREATE UNIQUE INDEX ... WHERE ...` edo SQL Serverren lerroko `INDEX n UNIQUE (...) WHERE ...`, izen eta zutabe bereko indize arrunt gisa sartzen da, taula osoan bakarra den gako bat fitxategiak deklaratzen duen iragazitakoa baino zorrotzagoa izango litzatekeelako. Salbuespena gakoaren zutabeen gaineko eta `AND` bidez lotutako `IS NOT NULL` egiaztapenez soilik osatutako iragazkia da, balio bakarreko zutabe batek NULL bat baino gehiago eduki ahal izateko SQL Serverrek behar duen iragazkia: gako horrek bakar izaten jarraitzen du.  
Taulak ez duen zutabe bat aipatzen duen gako bakar bat, `ALTER TABLE ... ADD COLUMN` bidez gehitutako bat adibidez, osorik kentzen da, existitzen diren zutabeetara murriztu beharrean. Indize arrunt batek existitzen diren zutabeak gordetzen ditu.

Oracle enpresaren SQL Developer tresnak eta `DBMS_METADATA` paketeak gako baten indizea `CREATE UNIQUE INDEX` bereizi gisa idazten dute, gakoaren izenarekin edo, izenik ez duen eta ondoren `USING INDEX` duen gako baterako, `SYS_C0012345` bezalako sistema-izen batekin. Inportazioak halako indize bat, eta `ADD CONSTRAINT ... USING INDEX` batek izendatzen duena, bere gakoaren parte gisa irakurtzen ditu: gako bakar konposatu bat indize bakar gisa sartzen da, eta gako nagusi bat edo zutabe bakarreko gako bakar bat zutabe-marka gisa, indize gehigarririk gabe. Ondoren, Oracle datu-basera berriro esportatzean, indizea behin bakarrik sortzen da.

MySQL, MariaDB, MSSQL, Oracle, PostgreSQL eta SQLite datu-baseetan, SQL eskemaren esportazio bat berriro inportatzean, Bakarra marka eta indize berberak lortzen dira.  
Snowflake datu-baseak ez du bigarren mailako indizerik; beraz, haren esportazioak gako bakarrak soilik itzultzen ditu: konposatu bat indize bakar gisa, eta zutabe bakarreko bat zutabearen Bakarra marka gisa. Databricks esportazio batek ez du bakartasunik deklaratzen; beraz, ez da bat ere itzultzen.

#### Gako arrotzak {#foreign-keys}

Gako arrotz bat erlazio bihurtzen da idazmolde hauetan:

- Taula-mailako `FOREIGN KEY (...) REFERENCES t (...)` bat, `CONSTRAINT name` klausularekin edo gabe.
- `ALTER TABLE ... ADD [CONSTRAINT name] FOREIGN KEY (...) REFERENCES t (...)`, SQL Server Management Studio tresnak bere scriptetan idazten dituen `ALTER TABLE t WITH CHECK ADD ...` eta `WITH NOCHECK ADD ...` barne.
- Zutabe baten lerroko `REFERENCES t (col)`, `user_id INT REFERENCES users (id)` adibidean bezala, eta SQL Server eta Snowflake datu-baseek bertan onartzen duten `FOREIGN KEY REFERENCES t (col)`. Zutabe bat baino gehiagorako lerroko erreferentzia bat saltatu egiten da.

`ALTER TABLE` batek erlazio bat ematen du gehienez, eta haren lehen klausulak gako arrotz bat gehitzen duenean soilik: sententzia bereko `ADD PRIMARY KEY` edo `ADD UNIQUE` klausula baten ondorengo `FOREIGN KEY` klausula bat ez da irakurtzen. Sententzia batek hainbat gako arrotz gehitzen dituenean, phpMyAdmin tresnak `ADD CONSTRAINT fk1 FOREIGN KEY ..., ADD CONSTRAINT fk2 FOREIGN KEY ...` idazten duen bezala, azkena soilik irakurtzen da.

Zutabe-zerrendarik gabeko `REFERENCES t` batek `t` taularen gako nagusia seinalatzen du, gako hori zutabe bakarrekoa denean. Gako nagusi konposatu baten aurrean, gako arrotza saltatu egiten da.  
Gako arrotz bat saltatu egiten da, eta haren zutabeetako bat ere ez da gako arrotz gisa markatzen, haren erreferentziatutako zutabeetako bat ere aurkitzen ez denean, edo bi tauletan aurkitutako zutabeen kopurua desberdina denean, adibidez zutabe bat haietako batean soilik falta denean. Bi taulei haren zutabeen kopuru bera falta zaienean, aurkitutako zutabeak idatzitako ordenan parekatzen dira, eta erlazioak horiek soilik hartzen ditu.  
Inportatutako erlazio oro `Zero N` motakoa da, eta identifikatzailea da bere zutabe ume guztiak gako nagusi ere badirenean.

Gako arrotz bakoitzaren `ON DELETE` eta `ON UPDATE` klausulak erlazioaren `On Delete` eta `On Update` balio bihurtzen dira: `NO ACTION`, `RESTRICT`, `CASCADE`, `SET NULL` edo `SET DEFAULT`, maiuskulak eta minuskulak bereizi gabe eta edozein ordenatan. Klausula horiek ez dituen gako arrotz bat `Not set` gisa inportatzen da. Editorean ezartzeko, ikus [Erlazioak editatzea](./relationship-editing.md#on-delete-and-on-update).  
`SET NULL` edo `SET DEFAULT` ekintzaren ondoko PostgreSQLen zutabe-zerrenda, `ON DELETE SET NULL (a_id)` adibidean bezala, ez da kontuan hartzen, eta irakurketak aurrera jarraitzen du: ekintza gako osoari aplikatzen zaio, eta zerrendaren ondoko `ON UPDATE` bat irakurtzen da hala ere. `MATCH FULL`, `MATCH PARTIAL` eta `MATCH SIMPLE` saltatu egiten dira, eta MySQLen `ON UPDATE CURRENT_TIMESTAMP` zutabe-atributua ez da ekintzatzat hartzen.  
SQL eskemaren esportazio bat datu-base horrek idazten dituen ekintzekin inportatzen da berriro; beraz, kanpoan uzten duen ekintza bat, adibidez `SET DEFAULT` MySQLen, edozein `ON UPDATE` Oracle datu-basean edo `NO ACTION` ez den edozer Snowflake datu-basean, `Not set` gisa itzultzen da.

#### Iruzkinak {#comments}

Taulen eta zutabeen iruzkinak analizatzaileak irakurtzen dituen hiru sintaxietatik inportatzen dira: MySQL, MariaDB, Snowflake eta Databricks datu-baseek erabiltzen duten `COMMENT` taula-aukera eta zutabe-atributua, PostgreSQL eta Oracle datu-baseek erabiltzen dituzten `COMMENT ON TABLE` eta `COMMENT ON COLUMN` sententziak, eta SQL Serverrek `EXEC sp_addextendedproperty` bidez ezartzen duen `MS_Description` propietate hedatua.  
Fitxategiak definitzen ez duen taula edo zutabe bat aipatzen duen iruzkin bat ez da kontuan hartzen.

SQL Serverren deiak izendun argumentuekin irakurtzen dira, SQL Server Management Studio tresnak iruzkin guztiak bere scriptetan idazten dituen bezala (`@name=N'MS_Description', @value=N'...', ..., @level1type=N'TABLE', @level1name=N'Users'`), eta posiziozko argumentuekin, editorearen MSSQL esportazioak idazten dituen bezala.  
Taula batean, edo 2. mailan haren zutabeetako batean, dagoen `MS_Description` batek soilik ematen du iruzkina. Beste propietate batek, bista batek, indize batek edo murriztapen batek ez du iruzkinik ematen, ezta aldagai batean pasatutako edo `+` bidez eraikitako iruzkin batek ere.

Iruzkin batean, komatxo arteko beste edozein testutan bezala, hala nola `DEFAULT` balio batean edo komatxo arteko izen batean, komatxo bikoiztu batek komatxo bakar bat adierazten du, mysqldump eta pg_dump tresnek idazten duten bezala: `'it''s'` `it's` gisa irakurtzen da.  
Komatxo baten aurreko alderantzizko barra batek ere, MySQL eta MariaDB datu-baseek `'it\'s'` idazten duten bezala, komatxoari ihes egiten dio. Halako komatxo batek testua amaitzen du, hala ere, ondoren zuriunea, `,`, `;`, `)`, `]`, `:`, `|`, `+` edo fitxategiaren amaiera datorrenean; beraz, `'C:\'`, pg_dump tresnaren `'C:\'::text` eta T-SQLen `'C:\'+name` adibideek beren alderantzizko barra gordetzen dute.  
`DEFAULT` balio batek bere komatxoak gordetzen ditu, eta barruko komatxoa bikoiztuta idazten da berriro, fitxategiak hari ihes egiteko erabilitako modua edozein dela ere: `'it''s'`.  
Inportatzeko unean dokumentuaren datu-basea Databricks bada, komatxo bakunen arteko testuak Sparken arauak betetzen ditu horren ordez: alderantzizko barra bakoitzak ondorengo karaktereari ihes egiten dio; beraz, `'C:\\dir'` `C:\dir` gisa irakurtzen da, `\n`, `\t` eta `\u0041` bezalako ihes-sekuentziak deskodetu egiten dira, eta `DEFAULT` balio bat `'it\'s'` gisa gordetzen da.

Esportatutako SQL eskemak taula edo zutabe baten iruzkineko komatxoari ihes egiten dio: `COMMENT 'it''s'` MySQL, MariaDB eta Snowflake datu-baseetarako, `COMMENT ON TABLE` eta `COMMENT ON COLUMN ... IS 'it''s'` PostgreSQL eta Oracle datu-baseetarako, eta bikoizketa bera, taula- eta zutabe-izenak barne, MSSQLen `sp_addextendedproperty` deietan. Komatxorik gabeko iruzkin bat dagoen bezala idazten da.  
Databricks datu-baseak, aldiz, komatxoari eta alderantzizko barrari alderantzizko barra batekin egiten die ihes, `COMMENT 'it\'s'` adibidean bezala; beraz, haren esportazioa zehatz-mehatz irakurtzen da berriro Databricks hautatutako datu-basea den bitartean soilik.  
MSSQL esportazioak iruzkin bakoitza `EXECUTE sys.sp_addextendedproperty 'MS_Description', '<comment>', 'schema', '<schema>', 'table', '<table>'` gisa idazten du, eta zutabe baterako ondoren `'column', '<column>'` gehitzen du. `Bracket` ezarpena `None` balioan dagoenean, `sales.users` izeneko taula batek `sales` eskema eta `users` taula ematen ditu, eta eskemarik gabeko izen bat `dbo` eskeman dago. Beste edozein `Bracket` baliorekin, izen osoa da taula, `dbo` eskeman.

Iruzkinak galdu egiten dira SQLite esportazio eta inportazio joan-etorri batean: SQLite esportazioak `--` lerro arrunt gisa idazten ditu, eta analizatzaileak ez ditu lerro horiek irakurtzen. MSSQL esportazio baten `sp_addextendedproperty` deiak taula- eta zutabe-iruzkin berberak bihurtzen dira berriro inportatzean.

### GraphQL {#graphql}

GraphQL SDL dokumentu bat inporta dezakezu.  
Objektu-moten definizioak taula bihurtzen dira, `extend type` bloke bat hedatzen duen motarekin bateratzen da, eta interfazeen eremuak haiek inplementatzen dituzten motek heredatzen dituzte.  
Mota gisa beste taula bat duen eremu bat erlazio bihurtzen da, zutabe bihurtu beharrean, eta bi aldeetan zerrenda bat egoteak lotura-taula bat sortzen du.  
`buyer: User` bezalako eremu singular bat, lehenik, beste motako eremu bakar honekin parekatzen da: izenaren amaieran `By` eta eremu horren izena dituena, `orderListByBuyer` adibidez, maiuskulak eta minuskulak bereizi gabe eta azpimarrak kontuan hartu gabe; `buyer2` bezalako zenbakidun eremu bat modu berean parekatzen da, bere zenbakirik gabe. Horrela izendatzen ditu eremuak Kode-sortzailearen GraphQL irteerak bi taulek erlazio bat baino gehiago partekatzen dituztenean edo taula batek bere buruari erreferentzia egiten dionean; beraz, halako irteera bat erlazio guztiekin inportatzen da berriro.  
Erro-motak (`Query`, `Mutation`, `Subscription`), introspekzio-motak, eta Relay, federazio eta Hasura bilgarriak, hala nola `PageInfo`, `*Connection`, `*Edge` eta `*_aggregate`, zaratatzat hartzen dira eta saltatu egiten dira.  
`@id`, `@primaryKey`, `@unique`, `@autoincrement`, `@default`, `@map`, `@relation`, `@column`, `@table`, `@index` eta `@db.*` zuzentarauak errespetatzen dira.  
Fitxategi-izenak `.graphql`, `.gql` edo `.graphqls` luzapenarekin amaitu behar du. Prismaren `schema.prisma` fitxategi bat ez da GraphQL dokumentu bat, eta ezin da hemen inportatu.

### DBML {#dbml}

DBML fitxategi bat inporta dezakezu; dbdiagram.io eta dbdocs zerbitzuek erabiltzen duten formatua da.  
`Table`, `TablePartial`, `Ref`, `Enum` eta `TableGroup` blokeak irakurtzen dira. `Project` blokeak eta `Note` bloke bereiziak saltatu egiten dira, inguruko taulei eragin gabe.  
Ref idazmolde guztiak onartzen dira: `Ref:` bi puntuko forma, ref izendun bat, `Ref { }` bloke-forma eta lerroko `[ref: > table.column]` zutabe-ezarpena.  
Asko-askorako `<>` ref batek lotura-taula bat sortzen du, bi aldeen izena duena.  
Ref bereizi baten `delete` eta `update` ezarpenak erlazioaren `On Delete` eta `On Update` balio bihurtzen dira, `Ref: users.id < posts.user_id [delete: cascade, update: set null]` adibidean bezala. Balioak `cascade`, `restrict`, `set null`, `set default` eta `no action` dira, maiuskulak eta minuskulak bereizi gabe. Beste edozer, edo ezarpenik ez, `Not set` gisa inportatzen da, eta `color` bezalako beste ezarpenak ez dira kontuan hartzen.  
Lerroko `[ref: ...]` ezarpenak ez du ekintzarik eramaten, eta `<>` ref baten ezarpenak ez dira lotura-taulara eramaten. Gako arrotz bera lerroan eta ref bereizi gisa deklaratzen denean, lerrokoa gordetzen da, ekintzarik gabe.  
Taula baten `headercolor` ezarpena, `Table users [headercolor: #3498DB]` adibidean bezala, taularen kolore bihurtzen da balioa komatxorik gabe idatzitako `#rgb` edo `#rrggbb` kode hamaseitarra denean. Beste edozein balio kendu egiten da, eta `TablePartial` baten `headercolor` ezarpena ez zaie hura erabiltzen duten taulei transmititzen.  
`TableGroup` bakoitza zerrendatzen dituen taulak dituen [taula-talde](./table-groups.md) bihurtzen da; taulak lerro bakoitzean bat zerrendatzen dira, `Ref` batek izendatzen dituen bezala izendatuta. Haren `[color: ...]` ezarpena taldearen kolore bihurtzen da `headercolor` ezarpenaren arau beraren arabera, eta haren azalpena eta beste ezarpenak kendu egiten dira. Bi taldek zerrendatutako taula bat lehenengoan geratzen da. Taularik gabe geratzen den talde bat ez da sortzen, bai fitxategiak deklaratzen duen taularik zerrendatzen ez duenean, bai aurreko talde batek hartutako taulak soilik zerrendatzen dituenean. Taldearen koadroa bere taulen inguruan doitzen da, taulak non kokatzen diren kontuan hartu gabe, eta taulak errenkadatan jartzen direnean, talde bateko taulak elkarrekin geratzen dira.  
Fitxategi-izenak `.dbml` luzapenarekin amaitu behar du.

### AML {#aml}

AML (Azimutt Markup Language) fitxategi bat inporta dezakezu. Uneko idazmoldea eta v1 idazmolde zaharra onartzen dira.  
Entitateak taula bihurtzen dira, eta habiaratutako atributuak puntuz bereizitako zutabe-izen batean lautzen dira, `settings.slug` adibidez.  
Atributuak `NOT NULL` dira `nullable` gisa markatuta ez badaude, eta editoreak haientzako tokirik ez duen eraikuntzak, hala nola `check`, `type` eta `tags`, kendu egiten dira, ukatu beharrean. Bista gisa markatutako entitate bat taula arrunt gisa sartzen da.  
Entitate baten `color` propietatea, `users {color: red}` adibidean bezala, haren taularen kolore bihurtzen da. AML formatuaren kolore-izenak, `red`, `orange`, `amber`, `yellow`, `lime`, `green`, `emerald`, `teal`, `cyan`, `sky`, `blue`, `indigo`, `violet`, `purple`, `fuchsia`, `pink`, `rose` eta `gray`, maiuskulak eta minuskulak bereizi gabe irakurtzen dira, komatxoekin edo gabe, bakoitza izen bereko Tailwind kolorearen 500 tonu gisa, adibidez `#ef4444` `red` kolorerako. Komatxo arteko kode hamaseitar bat, `"#3498db"` adibidez, idatzi bezala gordetzen da; `#3498db` soil bat ezin da irakurri, `#` ikurrak AML iruzkin bat hasten baitu. Beste edozein balio, eta atributu edo erlazio bateko `color` bat, kendu egiten da.  
`rel` sententzia bereizi batek, edo `fk` sententziak idazmolde zaharrean, bere `onDelete` eta `onUpdate` propietateak gordetzen ditu erlazioaren `On Delete` eta `On Update` balio gisa, `rel posts(user_id) -> users(id) {onDelete: cascade, onUpdate: "set null"}` adibidean bezala. Balioak `cascade`, `restrict`, `set null`, `set default` eta `no action` dira, komatxoekin edo gabe, maiuskulak eta minuskulak bereizi gabe. Beste propietateak kendu egiten dira.  
`user_id int -> users(id) {onDelete: cascade}` bezalako lerroko erlazio batean, propietateak atributuarenak dira; beraz, kendu egiten dira, eta erlazioa `Not set` gisa inportatzen da.  
Fitxategi-izenak `.aml` luzapenarekin amaitu behar du.

GraphQL, DBML eta AML joan-etorriko formatuak dira: bakoitza [Kode-sortzailea](./code-generator.md) fitxaren helburu bat ere bada.  
DBML eta AML formatuek erlazio bakoitzaren ON DELETE eta ON UPDATE bi noranzkoetan eramaten dituzte. Ikus [Kode-sortzailea](./code-generator.md#on-delete-and-on-update). GraphQL formatuak ez du bat ere eramaten; beraz, GraphQL inportazio batek biak `Not set` balioan uzten ditu.  
DBML formatuak, gainera, taulen koloreak, gardentasunik gabe, eta taularen bat duen taula-talde bakoitza eramaten ditu bi noranzkoetan. Izenik gabeko talde bat `group_1`, `group_2` eta abar gisa itzultzen da, eta errepikatutako talde-izen bat `_2`, `_3` eta abar gehituta itzultzen da. AML formatuak taula-kolore bat bere kolore-izenetatik hurbilenaren gisa soilik eramaten du; beraz, `#FF8800` `orange` gisa idazten da eta `#f97316` gisa itzultzen da, eta ez du talderik eramaten. GraphQL formatuak ez du ez kolorerik ez talderik eramaten.

## Esportatzea {#exporting}

Oihalaren laster-menuko `Export` azpimenuak hiru aukera ditu:

- json: Diagrama bere fitxategiak gordetzen duen bezala gordetzen du, `.erd.json` gisa: taulak beren zutabe eta indizeekin, erlazioak, oharrak eta taula-taldeak, eta ezarpenak, [blokeatutako ezarpen](./settings.md#lock) bakoitza bere balio blokeatuarekin.
- Schema SQL: [SQL eskema](./schema-sql.md#saving-or-copying-the-sql) fitxa irekitzen du, aukeren panela irekita eta `Save file` botoia fokuratuta dituela; beraz, `Enter` sakatzean fitxak erakusten duen SQLa `.sql` gisa gordetzen da. Ordura arte ez da ezer gordetzen.
- Image: `Export image` elkarrizketa-koadroa irekitzen du; horrek diagrama `.png` edo `.svg` gisa gordetzen du, edo arbelean kopiatzen du PNG gisa. Ikus [Irudia](#image).

Hirurek irakurtzeko soilik dagoen editore batean funtzionatzen dute.

SQL eskemak erlazio bakoitzaren ON DELETE eta ON UPDATE haren `REFERENCES` klausularen ondoren idazten ditu, ON DELETE lehenik. `Not set` balioak ez du ezer idazten, eta hautatutako datu-baseak onartzen ez duen ekintza bat kanpoan uzten da. Datu-base bakoitzak zein onartzen duen jakiteko, ikus [Erlazioak editatzea](./relationship-editing.md#on-delete-and-on-update).

Esportatutako fitxategi bakoitzak `<database name>-<timestamp>` izena du, eta ondoren bere luzapena, denbora-zigilua tokiko orduan eta `yyyy-MM-dd'T'HH_mm_ss` formatuan dagoela; adibidez, `my-schema-2026-08-29T04_05_06.erd.json`. Datu-basearen izena hutsik badago, `unnamed` erabiltzen da.  
SQL eskema fitxako eta [Kode-sortzailea](./code-generator.md) fitxako `Save file` botoiek modu berean izendatzen dituzte beren fitxategiak. Irudi batek elkarrizketa-koadroa ireki zen unean zegoen datu-basearen izena hartzen du.

`Import`, `Import and Add` eta `Export` ERD fitxako [Bilaketa azkarrean](./quick-search.md) ere eskuragarri daude, oihalaren laster-menuko aukera berberekin.

Obsidian aplikazioan ez da deskargarik edo gordetzeko elkarrizketa-koadrorik agertzen: fitxategia biltegian idazten da, Obsidianek diagrama horren eranskin berriak jartzen dituen tokian, eta jakinarazpen batek haren bide-izena adierazten du.  
Obsidianek fitxategi-izen batean onartzen ez dituen karaktereak, `\ / : * ? " < > |`, `-` karakterearekin ordezten dira.  
Obsidianen fitxategi-arakatzaileak esportatutako `.erd.json` edo `.sql` fitxategi bat zerrendatzen du Settings → Files and links → Detect all file extensions aukera aktibatuta dagoen bitartean soilik.

### Irudia {#image}

`Export` ▸ `Image` aukerak, oihalaren laster-menutik edo Bilaketa azkarretik, `Export image` elkarrizketa-koadroa irekitzen du: irudiaren aurrebista bat, haren aukeren ondoan. Irekita dagoen [Arakatzailea](./explorer.md#dialogs-beside-it) irekita geratzen da lausotutako eremuaren azpian.

![Export > Image irekitzea, modu iluna eta atzeko planoa desaktibatzea, 3x hautatzea eta irudia arbelean kopiatzea](/img/demo-export.webp)

- `Background`: Lehenespenez aktibatuta. Desaktibatuta, oihala garden geratzen da.
- `Dark mode`: Hasieran editorearen itxurarekin bat dator. Pantailako itxurarekin bat datorren bitartean, irudiak oihalaren beraren koloreak hartzen ditu, [gai-sortzailearen](./language-and-theme.md) aldaketak barne; beste itxurak gris-tonu eta nabarmentze-kolore berberen aurrezarpena erabiltzen du.
- `Scale`: `1x`, `2x` edo `3x`, `2x` lehenespenez hautatuta. PNGaren eta arbeleko kopiaren tamaina soilik ezartzen du, eta azpiko lerroak tamaina hori ematen du, `PNG <width> × <height> px` gisa.

Aukerak editorea itxi arte gordetzen dira, eta ez dira inoiz dokumentuan gordetzen. Aurrebista irudia bezala marrazten da, eta berriro marrazten da `Background` edo `Dark mode` aldatzen denean.

Irudiak elkarrizketa-koadroa ireki zenean zegoen bezala jasotzen du diagrama; itxi eta ireki berriro elkarrizketa-koadroa geroagoko aldaketak jasotzeko. Diagrama osoa jasotzen du, ikuspegia zenbateraino korrituta dagoen kontuan hartu gabe, diagramak marrazten duenera gehi marjina batera moztuta, eta beti % 100ean marrazten da, editoreak erakusten duen zooma edozein dela ere; beraz, taula guztiak osorik marrazten dira. [View Option](./table-related-functions.md#table-view-options) aukerak ezkutatzen duena — erlazioak, haien ON DELETE eta ON UPDATE etiketak, taula-taldeak edo oharrak — ez da marrazten, eta ez zaio tokirik ematen, eta taula-taldeak beste guztiaren atzean marrazten dira.

Hiru botoik idazten dute irudia, eta bakoitzak elkarrizketa-koadroa irekita uzten du:

- `PNG`: `.png` bat gordetzen du, diagramak % 100ean duen tamainarekin, `Scale` balioaz biderkatuta. Nabigatzaileko canvas elementu baterako handiegia den PNG bat bereizmen txikiagoan idazten da, huts egin beharrean: elkarrizketa-koadroak aldez aurretik abisatzen du `Reduced from <width> × <height> px, past what a browser canvas can hold` mezuarekin, eta `Exported at a reduced resolution` dioen jakinarazpen batek gero hala dela adierazten du.
- `SVG`: `.svg` bat gordetzen du, diagramak % 100ean duen tamainakoa, `Scale` balioa edozein dela ere, eta inoiz ez txikituta. Haren testuak testu izaten jarraitzen du, eta letra-tipoak izenez aipatzen dira, txertatu beharrean; beraz, editorearen letra-tipoa ez duen ikustaile batek beste batekin marrazten du. Itzalak kanpoan uzten dira.
- `Copy to clipboard`: PNG bat jartzen du arbelean, aukeratutako `Scale` balioarekin, gordetako PNG bat txikitzen den bezala txikituta nabigatzaileko canvas elementu batek eutsi ezin dionean. `Copied the image to the clipboard` mezuarekin baieztatzen du, edo `Copied at a reduced resolution` mezuarekin irudia txikitu denean. Kopiak huts egiten badu, nabigatzaileak edo ostalariak arbela ukatzen duelako edo irudia ezin izan delako marraztu, `Couldn't copy the image` mezuak horren ordez PNG bat gordetzea iradokitzen du.

Irudia atzeko planoko worker batean marrazten da, ostalariak halakorik exekutatzen badu; beraz, editorea erabilgarri geratzen da bitartean. `Exporting PNG`, `Exporting SVG` edo `Copying image` dioen jakinarazpen bat agertzen da une bat baino gehiago behar denean, eta hutsegite bat `Couldn't export the PNG` edo `Couldn't export the SVG` gisa jakinarazten da. Fitxategi bat oraindik marrazten den bitartean elkarrizketa-koadroa ixteak ez du eragozten fitxategi hori gordetzea.

Elkarrizketa-koadroa irekitzean `PNG` botoiak du fokua, eta `Tab` teklarekin fokua elkarrizketa-koadroaren barruan geratzen da. `Escape` teklak, `x` botoiak edo inguruko eremu lausotuan klik egiteak ixten du.  
Irekita dagoen bitartean, oihalaren lasterbideek, desegin eta berregin barne, eta kopiatu eta itsatsi ekintzek ez dute ezer egiten. `Ctrl + K` (Windows/Linux) edo `⌘ + K` (Mac) lasterbideak ixten du eta Bilaketa azkarra irekitzen du. `Ctrl + F` (Windows/Linux) edo `⌘ + F` (Mac) lasterbideak ixten du eta testu-kurtsorea [Arakatzailea](./explorer.md#opening-and-closing) panelaren Bilatu eremuan jartzen du; Arakatzailea itxita badago ireki egiten du, eta inoiz ez du ixten. Arakatzailea erakusteko estuegia den editore batean, elkarrizketa-koadroa ixten du hala ere, baina jakinarazpen bat erakusten du testu-kurtsorea mugitu beharrean.
