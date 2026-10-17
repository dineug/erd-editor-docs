---
sidebar_position: 2
description: Importeer JSON, Schema SQL, GraphQL, DBML of AML ter vervanging van het diagram of als toevoeging eronder, en exporteer JSON, Schema SQL of het diagram als PNG- of SVG-afbeelding.
---

# Bestanden importeren of exporteren

## Externe bestanden importeren {#importing-external-files}

Via het submenu `Import` van het contextmenu van het canvas kun je vijf formaten importeren:

- json
- Schema SQL
- GraphQL
- DBML
- AML

`Import and Add`, direct onder `Import`, voegt het bestand toe aan het diagram in plaats van het te vervangen — zie [Importeren en toevoegen](#import-and-add).  
Het welkomstscherm dat een leeg diagram toont, heeft een rij `Import` met dezelfde vijf formaten — zie [Welkomstscherm](./editing-start.md#welcome-screen).

Extensies worden herkend ongeacht het hoofdlettergebruik. Kies je een bestand waarvan de extensie niet bij het gekozen formaat past, dan wordt de import geannuleerd en verschijnt `Only <format> files can be imported`, met het formaat geschreven als `json`, `sql`, `graphql`, `dbml` of `aml`, zoals in `Only sql files can be imported`.

`Import` vervangt het huidige document in plaats van het bestand ermee samen te voegen, en met één keer ongedaan maken krijg je het vorige diagram terug.  
Een JSON-bestand brengt zijn eigen instellingen mee, inclusief zijn [vergrendelingen](./settings.md#lock). Waar het bestand het tabblad, de taal van de Codegenerator, een naamnotatie of het type aanhalingstekens vergrendelt, blijf je zien wat je had, maar wordt de vergrendelde waarde uit het bestand opgeslagen. De weergave gaat, vergrendeld of niet, naar de plek die het bestand aangeeft. Een JSON-bestand dat is opgeslagen voordat de vergrendelingen bestonden, komt binnen met elke vergrendeling ingeschakeld en de weergave op 100%.  
De andere formaten behouden de instellingen die je al hebt, inclusief de vergrendelingen, behalve de weergave, die op 100% begint.  
De parsers voor GraphQL, DBML en AML falen nooit: een bestand dat ze niet kunnen lezen, levert een leeg diagram op in plaats van een fout.

Een JSON-bestand behoudt de posities die het heeft. De tabellen van een Schema SQL-, GraphQL-, DBML- of AML-bestand worden geplaatst voordat het diagram verandert:

- Als het bestand twee of meer tabellen en minstens één relatie heeft, worden ze ingedeeld met de [Automatische indeling](./table-related-functions.md#auto-layout) `Flow`, van links naar rechts langs de relaties, vanaf de linkerbovenhoek van het canvas. Een relatie van een tabel naar zichzelf telt mee.
- Anders worden ze vanaf de linkerbovenhoek in rijen gezet, de tabellen met de minste kolommen eerst.
- Duurt de indeling langer dan 6 seconden, dan verschijnt de melding `Placing tables` met de knop `Cancel`. `Cancel`, of `Escape` terwijl de melding zichtbaar is, breekt de indeling af en zet de tabellen in plaats daarvan in rijen. Rijen worden ook, zonder melding, gebruikt als de indeling mislukt, als er binnen 60 seconden geen indeling terugkomt of als de host geen shared worker draait — zie [Web Workers](../../api/installation.md#web-workers).

Daarna wordt het diagram in één stap vervangen, zodat er tussendoor niets te zien is. Een instelling die je wijzigt terwijl de tabellen worden geplaatst, zoals het tabblad, blijft behouden, en als je intussen een ander bestand importeert, wint de import die als laatste is gestart.

Een editor in alleen-lezenmodus laadt niets via `Import` en biedt `Import and Add` niet aan.

### Importeren en toevoegen {#import-and-add}

`Import and Add` behoudt het diagram en voegt er een bestand onder toe. Het staat in het contextmenu van het canvas en in [Snel zoeken](./quick-search.md) op het ERD-tabblad, en biedt dezelfde vijf formaten met dezelfde extensiecontrole als `Import`.

![Een SQL-bestand toevoegen via Import and Add > Schema SQL, waarna de tabellen onder het diagram terechtkomen, langs hun relaties ingedeeld en geselecteerd](/img/demo-import-and-add.webp)

Het bestand komt binnen zoals bij plakken: elke tabel, kolom, relatie, index, memo en [tabelgroep](./table-groups.md) die het bevat, wordt als nieuw item toegevoegd, de tabellen die al in het diagram staan, worden niet verplaatst en er verandert geen instelling, dus de instellingen van een JSON-bestand worden weggelaten.  
Een tabel met een naam die al in het diagram voorkomt, wordt toegevoegd als tweede tabel met die naam en niet met die tabel samengevoegd. Relaties en indexen komen alleen uit het bestand, dus een refererende sleutel naar een tabel die het bestand niet definieert, wordt niet gekoppeld aan een tabel die al in het diagram staat.

Het toegevoegde blok komt direct onder alles in het diagram terecht, uitgelijnd met de linkerrand daarvan, of linksboven in een leeg diagram. Memo's en tabelgroepen die met de [weergaveopties](./table-related-functions.md#table-view-options) zijn verborgen, tellen ook mee, omdat ze daar nog steeds staan.  
Binnen het blok behoudt een JSON-bestand zijn eigen schikking, inclusief zijn tabelgroepen. De andere formaten worden geplaatst zoals `Import` ze plaatst, met `Flow` of in rijen volgens dezelfde regels, en het kader van elke tabelgroep wordt om de tabellen ervan heen gepast. De toegevoegde tabellen en memo's komen bovenop alles te liggen wat er al staat.

Zodra het blok terechtkomt, is alleen wat is toegevoegd geselecteerd: de nieuwe tabellen, plus de nieuwe memo's en tabelgroepen zolang die worden getoond. Als je intussen naar een ander tabblad bent gegaan, schakelt de editor terug naar het ERD-tabblad voordat het blok terechtkomt. De weergave scrolt daarna op het huidige zoomniveau naar het blok, tenzij het al goed in beeld is — zie [Waar een sprong terechtkomt](./table-related-functions.md#where-a-jump-lands). Eén keer ongedaan maken draait de hele toevoeging terug.  
Een bestand dat de parser niet kan lezen, of een bestand zonder tabel en zonder memo, voegt niets toe.

Meerdere Schema SQL-, GraphQL-, DBML- of AML-bestanden die worden toegevoegd terwijl er nog een wordt geplaatst, komen allemaal terecht, in de volgorde waarin ze zijn gestart. Een JSON-bestand dat intussen wordt toegevoegd, komt terecht zodra het is gelezen, vóór die bestanden. Bij een `Import` of het laden van een ander document vervallen alle bestanden die nog worden geplaatst.

Codeeragents voegen een bestand op dezelfde manier toe met de modus `append` van de MCP-importtools, die de schikking van een JSON-bestand behoudt maar de tabellen van de andere formaten in rijen zet, nooit met `Flow` — zie [Importeren](../../mcp/tools.md#import).

### JSON {#json}

Je kunt bestanden importeren in het [schemaformaat dat in de editor is gedefinieerd](../../api/advanced/schema.md).
De bestandsnaam moet eindigen op `.json`, zodat een bestand dat is geëxporteerd als `<database name>-<timestamp>.erd.json` zonder aanpassing weer kan worden geïmporteerd; een bestand dat alleen op `.erd` of `.vuerd` eindigt, wordt hier niet geaccepteerd. Bestanden die door eerdere versies zijn opgeslagen, worden ook gelezen.

![Een opgeslagen bestand importeren via Import > json, dat het conceptdocument samen met de instellingen ervan vervangt](/img/demo-import-json.webp)

### Schema SQL {#schema-sql}

Je kunt ook schemabestanden importeren die in SQL zijn gedefinieerd.  
Hoewel de parsers ongeacht het databasesysteem zo flexibel mogelijk zijn gemaakt, kan er syntaxis zijn die niet wordt ondersteund.  
De bestandsnaam moet eindigen op `.sql`.  
[Hier kun je controleren welke syntaxis wordt ondersteund.](https://github.com/dineug/erd-editor/tree/main/packages/schema-sql-parser)

![Een SQL-bestand importeren via Import > Schema SQL, waarbij de tabellen langs hun relaties worden ingedeeld, en daarna erover uitzoomen](/img/demo-import-sql.webp)

Kolommen komen alleen uit `CREATE TABLE`. Een kolom die met `ALTER TABLE ... ADD COLUMN` wordt toegevoegd, wordt niet gelezen.  
Onderdelen van een `CREATE TABLE` die geen kolommen zijn, worden overgeslagen in plaats van als kolommen gelezen: een naamloze `CHECK (...)`, `LIKE` en `EXCLUDE` van PostgreSQL, `FULLTEXT` en `SPATIAL` van MySQL zonder `INDEX` of `KEY` geschreven, `PERIOD FOR` van T-SQL en `SUPPLEMENTAL LOG DATA` van Oracle.  
Een kolom die naar een daarvan is genoemd, wordt toch geïmporteerd als er een ingebouwd type op de naam volgt, zoals in `exclude BOOLEAN`, of als de naam tussen aanhalingstekens staat, zoals in `"check" int`. Een `like` zonder aanhalingstekens gevolgd door een type dat niet ingebouwd is, zoals `like citext`, wordt gelezen als `LIKE` van PostgreSQL en overgeslagen.  
Beperkingen met `CHECK` worden zelf niet geïmporteerd, omdat de editor geen plek heeft om ze te bewaren.

#### Gegevenstypen {#data-types}

Het gegevenstype van een kolom blijft behouden, inclusief de argumentenlijst, ook als het geen ingebouwd type is van een van de [ondersteunde databases](./table-related-functions.md#databases).  
Dat geldt voor een enum of samengesteld type gemaakt met `CREATE TYPE`, een domein gemaakt met `CREATE DOMAIN`, extensietypen zoals `hstore`, `citext` en `ltree`, namen met schemanaam zoals `public.mood`, en namen tussen aanhalingstekens of vierkante haken zoals `"MyType"` en `[dbo].[Phone]`, die hun aanhalingstekens of vierkante haken behouden. De instructies `CREATE TYPE`, `CREATE DOMAIN` en `CREATE EXTENSION` zelf worden overgeslagen.  
Een ingebouwd type verliest zijn aanhalingstekens of vierkante haken, dus `[int]` komt binnen als `int` en `[nvarchar](50)` als `nvarchar(50)`. `"char"` en `"bit"` van PostgreSQL behouden ze, omdat het andere typen zijn dan `char` en `bit`.  
Array-achtervoegsels blijven bij elk type staan: `integer[]`, `text[3][3]`, `integer ARRAY`, `mood[]`. `UNSIGNED BIG INT` van SQLite komt in zijn geheel binnen.  
`UNSIGNED` en `ZEROFILL` van MySQL en MariaDB, direct na een type en zijn argumenten geschreven, blijven zoals geschreven deel van het type: `INT UNSIGNED`, `SMALLINT(5) UNSIGNED ZEROFILL`, `int unsigned` van mysqldump. `SIGNED`, de standaard, wordt weggelaten, dus `TINYINT SIGNED` komt binnen als `TINYINT`. Een toevoeging die na een andere kolomoptie staat, zoals in `INT NOT NULL UNSIGNED`, wat MySQL weigert, wordt weggelaten.  
Waarden van `ENUM(...)` en `SET(...)` behouden hun aanhalingstekens, met een aanhalingsteken binnen een waarde verdubbeld, zoals in `ENUM('a','it''s')`. Het met een backslash geëscapete `'it\'s'` van MySQL komt op dezelfde manier verdubbeld binnen. In een type `STRUCT<...>` van Databricks behouden veldnamen tussen aanhalingstekens en de `COMMENT` van een veld hun aanhalingstekens.  
Een kolom die zonder type is geschreven, zoals een SQLite-kolom zonder type of een berekende kolom met `AS`, blijft zonder type: een trefwoord zoals `NOT`, `NULL`, `DEFAULT`, `PRIMARY` of `REFERENCES`, of een string tussen enkele aanhalingstekens, wordt niet als type gelezen.

#### Standaardwaarden {#defaults}

De `DEFAULT` van een kolom behoudt zijn hele expressie, zoals `now()`, `0.5`, `CURRENT_TIMESTAMP` of `ARRAY[]::text[]`, tot aan de volgende kolomoptie, een komma of het sluitende haakje. Een `CASE ... END` wordt in zijn geheel gelezen.  
Haakjes rond de hele expressie worden verwijderd, dus `((0))` van SQL Server komt binnen als `0` en `(getdate())` als `getdate()`. Een cast van een letterlijke waarde wordt ook verwijderd, dus `'draft'::character varying` van pg_dump komt binnen als `'draft'` en `NULL::character varying` als `NULL`; andere casts blijven staan, zoals in `ARRAY[]::text[]` en `lower('A'::text)`.  
`ON UPDATE CURRENT_TIMESTAMP` van MySQL wordt weggelaten, omdat een kolom er geen plek voor heeft, en de standaardwaarde ervoor blijft staan. `DEFAULT ON NULL 0` van Oracle, met of zonder `FOR INSERT ONLY` of `FOR INSERT AND UPDATE`, komt binnen als `0`.  
Een string met een voorvoegsel, zoals `N'x'`, `E'x'`, `B'0'`, `X'ff'`, `U&'x'` of `_utf8mb4'x'`, wordt als één string gelezen, ook als er een haakje in staat.

SQL Server Management Studio schrijft standaardwaarden in het script na de tabellen, als `ALTER TABLE [dbo].[t] ADD CONSTRAINT [DF_x] DEFAULT ((1)) FOR [col]`. Zo'n instructie stelt de standaardwaarde van die kolom in, hier `1`, en de naam van de beperking wordt weggelaten.

Een Schema SQL-export zet de haakjes terug waar een database de expressie van een standaardwaarde alleen binnen haakjes leest — zie [Standaardwaarden](./schema-sql.md#defaults).

#### Automatisch ophogen {#auto-increment}

`AUTO_INCREMENT`, `AUTOINCREMENT` en `IDENTITY` schakelen `Auto Increment` van een kolom in, net als `GENERATED ALWAYS AS IDENTITY` en `GENERATED BY DEFAULT AS IDENTITY`, die geen standaardwaarde achterlaten.  
Dat doet ook een standaardwaarde die uit één PostgreSQL-aanroep van `nextval()` bestaat, de standaardwaarde die een serial-kolom krijgt, geschreven als `nextval('s')` of, zoals pg_dump het schrijft, `nextval('s'::regclass)`. De naam van de sequence wordt niet bewaard. Een standaardwaarde die een sequence alleen gebruikt, zoals `nextval('s') + 1` of `NEXT VALUE FOR s` van SQL Server, blijft een gewone standaardwaarde.  
pg_dump schrijft beide na de tabellen, als `ALTER TABLE [ONLY] t ALTER [COLUMN] c SET DEFAULT nextval('s'::regclass)` en `ALTER TABLE t ALTER [COLUMN] c ADD GENERATED ... AS IDENTITY`. Elk van die instructies schakelt `Auto Increment` van die kolom in en wist de standaardwaarde ervan. `CREATE SEQUENCE`, `ALTER SEQUENCE` en elke andere actie van `ALTER COLUMN` worden overgeslagen.  
Een kolom die inline als `serial`, `bigserial` of `smallserial` is getypeerd, behoudt dat type, met `Auto Increment` uit.

De editor bewaart alleen de vlag `Auto Increment`, en elke database schrijft bij het exporteren zijn eigen vorm — zie [Automatisch ophogen](./schema-sql.md#auto-increment). Een PostgreSQL-export schrijft `GENERATED ALWAYS AS IDENTITY` bij een kolom van het type `smallint`, `integer` of `bigint`, welke vorm er ook is geïmporteerd, en bij elk ander type, zoals `INT UNSIGNED`, alleen een commentaarregel na de tabel. Opties van de sequence zoals `START WITH 100` gaan verloren.  
Een tabel met meerdere serial- of identity-kolommen wordt geïmporteerd met meerdere kolommen met automatisch ophogen, en MySQL, MariaDB en SQL Server weigeren zo'n tabel wanneer de export ervan wordt uitgevoerd.

#### Primaire sleutels {#primary-keys}

Een primaire sleutel die na zijn tabel wordt toegevoegd, `ALTER TABLE t ADD [CONSTRAINT n] PRIMARY KEY (...)`, merkt zijn kolommen aan als de primaire sleutel.  
`CLUSTERED` of `NONCLUSTERED` van SQL Server en `USING BTREE` van MySQL vóór de kolomlijst worden genegeerd, zodat de `ALTER TABLE [dbo].[Users] ADD CONSTRAINT [PK_Users] PRIMARY KEY CLUSTERED ([Id] ASC) WITH (...) ON [PRIMARY]` die SQL Server Management Studio in het script schrijft, de sleutel op `Id` legt. De `PRIMARY KEY NONCLUSTERED HASH (...)` van een geheugengeoptimaliseerde tabel wordt niet gelezen, niet in `ALTER TABLE` en niet in `CREATE TABLE`.

#### Unieke sleutels en indexen {#unique-keys-and-indexes}

Een `UNIQUE` over twee of meer kolommen wordt één unieke index, in elke schrijfwijze: `UNIQUE (a, b)`, `UNIQUE KEY n (a, b)`, `UNIQUE INDEX n (a, b)`, `CONSTRAINT n UNIQUE (a, b)`, de inline `INDEX n UNIQUE (a, b)` van SQL Server en `ALTER TABLE t ADD [CONSTRAINT n] UNIQUE (a, b)`.  
De index krijgt de indexnaam van de sleutel, anders de naam bij `CONSTRAINT`, anders geen naam, en behoudt de sorteervolgorde van elke kolom. Zo'n index is een [alternatieve sleutel](./table-related-functions.md#alternate-keys).  
Een `UNIQUE` over één kolom, in elk van die schrijfwijzen, geeft die kolom in plaats daarvan de vlag Uniek en voegt geen index toe, zodat de beperking `UQ_<table name>_<column name>` die de export schrijft, terugkomt als de vlag waaruit ze is geschreven. Een `CREATE UNIQUE INDEX` over één kolom blijft een unieke index.

Een `ALTER TABLE` die meerdere sleutels tegelijk toevoegt, zoals phpMyAdmin `ADD PRIMARY KEY (id), ADD UNIQUE KEY uq_a (a, b), ADD UNIQUE KEY uq_c (c)` schrijft, behoudt elke unieke sleutel erin: `uq_a` komt binnen als een unieke index met de naam `uq_a`, en `uq_c` als de vlag Uniek van `c`. Een naam bij `CONSTRAINT` benoemt alleen de sleutel in zijn eigen clausule. `ADD UNIQUE INDEX IF NOT EXISTS n (...)` van MariaDB en `ALTER TABLE t WITH CHECK ADD ...` en `WITH NOCHECK ADD ...` van SQL Server worden ook gelezen.  
`CREATE INDEX` en `CREATE UNIQUE INDEX` worden gelezen met namen met schemanaam zoals `public.t` en `[dbo].[t]`, met `CLUSTERED` en `NONCLUSTERED` van SQL Server, met `CONCURRENTLY`, `IF NOT EXISTS`, `ON ONLY` en `USING btree` van PostgreSQL, en helemaal zonder indexnaam. De bestandsgroep `ON [PRIMARY]` van SQL Server wordt genegeerd.  
Sleutelopties zoals `NULLS NOT DISTINCT` of `USING BTREE` worden niet voor de naam van de sleutel aangezien. In de kolomlijst van een sleutel benoemt alleen het eerste woord de kolom, dus `b DESC NULLS LAST`, `b text_pattern_ops` en `b COLLATE "C"` leggen allemaal de sleutel op `b`, waarbij `DESC` als sorteervolgorde behouden blijft. Een prefixlengte zoals `email(191)` wordt genegeerd, maar een sleutel met een expressiedeel, zoals `lower(email)`, wordt in zijn geheel overgeslagen.

Een gedeeltelijke unieke index, `CREATE UNIQUE INDEX ... WHERE ...` of de inline `INDEX n UNIQUE (...) WHERE ...` van SQL Server, komt binnen als een gewone index met dezelfde naam en kolommen, omdat een sleutel die over de hele tabel uniek is, strenger zou zijn dan de gefilterde sleutel die het bestand declareert. De uitzondering is een filter dat alleen bestaat uit tests met `IS NOT NULL` op de kolommen van de sleutel, verbonden met `AND`, het filter dat SQL Server nodig heeft om een unieke kolom meer dan één NULL te laten bevatten: die sleutel blijft uniek.  
Een unieke sleutel die een kolom noemt die de tabel niet heeft, zoals een kolom die met `ALTER TABLE ... ADD COLUMN` is toegevoegd, wordt in zijn geheel weggelaten in plaats van ingekort tot de kolommen die bestaan. Een gewone index behoudt de kolommen die bestaan.

SQL Developer en `DBMS_METADATA` van Oracle schrijven de eigen index van een sleutel als een aparte `CREATE UNIQUE INDEX`, genoemd naar de sleutel of, voor een sleutel zonder naam waarop `USING INDEX` volgt, met een systeemnaam zoals `SYS_C0012345`. De import leest zo'n index, en de index die een `ADD CONSTRAINT ... USING INDEX` noemt, als deel van zijn sleutel: een samengestelde unieke sleutel komt binnen als één unieke index, en een primaire sleutel of een unieke sleutel op één kolom als de kolomvlaggen zonder extra index. Een export terug naar Oracle maakt de index dan één keer aan.

Een Schema SQL-export levert bij het opnieuw importeren dezelfde vlaggen Uniek en dezelfde indexen op voor MySQL, MariaDB, MSSQL, Oracle, PostgreSQL en SQLite.  
Snowflake heeft geen secundaire indexen, dus de export ervan brengt alleen de unieke sleutels terug: een samengestelde als unieke index en een op één kolom als de vlag Uniek van de kolom. Een Databricks-export declareert geen uniciteit, dus er komt er geen terug.

#### Refererende sleutels {#foreign-keys}

Een refererende sleutel wordt een relatie in deze schrijfwijzen:

- Een `FOREIGN KEY (...) REFERENCES t (...)` op tabelniveau, met of zonder `CONSTRAINT name`.
- `ALTER TABLE ... ADD [CONSTRAINT name] FOREIGN KEY (...) REFERENCES t (...)`, inclusief de `ALTER TABLE t WITH CHECK ADD ...` en `WITH NOCHECK ADD ...` die SQL Server Management Studio in scripts schrijft.
- De inline `REFERENCES t (col)` van een kolom, zoals in `user_id INT REFERENCES users (id)`, en de `FOREIGN KEY REFERENCES t (col)` die SQL Server en Snowflake daar toestaan. Een inline verwijzing naar meer dan één kolom wordt overgeslagen.

Een `ALTER TABLE` levert hooguit één relatie op, en alleen als de eerste clausule ervan een refererende sleutel toevoegt: een clausule `FOREIGN KEY` na een clausule `ADD PRIMARY KEY` of `ADD UNIQUE` in dezelfde instructie wordt niet gelezen. Als één instructie meerdere refererende sleutels toevoegt, zoals phpMyAdmin `ADD CONSTRAINT fk1 FOREIGN KEY ..., ADD CONSTRAINT fk2 FOREIGN KEY ...` schrijft, wordt alleen de laatste gelezen.

`REFERENCES t` zonder kolomlijst verwijst naar de primaire sleutel van `t` als die sleutel uit één kolom bestaat. Bij een samengestelde primaire sleutel wordt de refererende sleutel overgeslagen.  
Een refererende sleutel wordt overgeslagen, en geen van zijn kolommen wordt als refererende sleutel aangemerkt, als geen enkele kolom waarnaar hij verwijst, wordt gevonden, of als het aantal gevonden kolommen in de twee tabellen verschilt, zoals wanneer een kolom in slechts één ervan ontbreekt. Als in beide tabellen hetzelfde aantal van zijn kolommen ontbreekt, worden de gevonden kolommen gekoppeld in de geschreven volgorde, en bevat de relatie alleen die kolommen.  
Elke geïmporteerde relatie is `Zero N`, en ze is identificerend als elk van haar kolommen in de kindtabel ook een primaire sleutel is.

De clausules `ON DELETE` en `ON UPDATE` van elke refererende sleutel worden `On Delete` en `On Update` van de relatie: `NO ACTION`, `RESTRICT`, `CASCADE`, `SET NULL` of `SET DEFAULT`, ongeacht het hoofdlettergebruik en in beide volgorden. Een refererende sleutel zonder deze clausules wordt geïmporteerd als `Not set`. Zie [Relaties bewerken](./relationship-editing.md#on-delete-and-on-update) voor het instellen ervan in de editor.  
De kolomlijst van PostgreSQL na `SET NULL` of `SET DEFAULT`, zoals in `ON DELETE SET NULL (a_id)`, wordt genegeerd: de actie geldt voor de hele sleutel, en een `ON UPDATE` na de lijst wordt nog steeds gelezen. `MATCH FULL`, `MATCH PARTIAL` en `MATCH SIMPLE` worden overgeslagen, en het kolomattribuut `ON UPDATE CURRENT_TIMESTAMP` van MySQL wordt niet voor een actie aangezien.  
Een Schema SQL-export wordt opnieuw geïmporteerd met de acties die de betreffende database schrijft, dus een actie die deze weglaat, zoals `SET DEFAULT` bij MySQL, elke `ON UPDATE` bij Oracle of alles behalve `NO ACTION` bij Snowflake, komt terug als `Not set`.

#### Opmerkingen {#comments}

Tabel- en kolomopmerkingen worden geïmporteerd uit de drie syntaxen die de parser leest: de tabeloptie en het kolomattribuut `COMMENT` die MySQL, MariaDB, Snowflake en Databricks gebruiken, de instructies `COMMENT ON TABLE` en `COMMENT ON COLUMN` die PostgreSQL en Oracle gebruiken, en de uitgebreide eigenschap `MS_Description` die SQL Server instelt met `EXEC sp_addextendedproperty`.  
Een opmerking die een tabel of kolom noemt die het bestand niet definieert, wordt genegeerd.

De aanroepen van SQL Server worden gelezen met benoemde argumenten, zoals SQL Server Management Studio elke opmerking in het script schrijft (`@name=N'MS_Description', @value=N'...', ..., @level1type=N'TABLE', @level1name=N'Users'`), en met positionele argumenten, zoals de MSSQL-export van de editor ze schrijft.  
Alleen een `MS_Description` op een tabel, of op een van de kolommen ervan op niveau 2, levert een opmerking op. Een andere eigenschap, een view, een index of een beperking levert er geen op, en een opmerking die in een variabele wordt doorgegeven of met `+` wordt opgebouwd evenmin.

In een opmerking, net als in elke tekst tussen aanhalingstekens zoals een waarde bij `DEFAULT` of een naam tussen aanhalingstekens, staat een verdubbeld aanhalingsteken voor één aanhalingsteken, zoals mysqldump en pg_dump het schrijven: `'it''s'` wordt gelezen als `it's`.  
Een backslash vóór een aanhalingsteken, zoals MySQL en MariaDB `'it\'s'` schrijven, escapet het aanhalingsteken ook. Zo'n aanhalingsteken beëindigt de tekst toch als er witruimte, `,`, `;`, `)`, `]`, `:`, `|`, `+` of het einde van het bestand op volgt, dus `'C:\'`, `'C:\'::text` van pg_dump en `'C:\'+name` van T-SQL behouden hun backslash.  
Een waarde bij `DEFAULT` behoudt haar aanhalingstekens, en een aanhalingsteken erin wordt verdubbeld teruggeschreven, hoe het bestand het ook heeft geëscapet: `'it''s'`.  
Als de database van het document op het moment van importeren Databricks is, volgt tekst tussen enkele aanhalingstekens in plaats daarvan de regels van Spark: elke backslash escapet het teken erna, dus `'C:\\dir'` wordt gelezen als `C:\dir`, escapereeksen zoals `\n`, `\t` en `\u0041` worden gedecodeerd, en een waarde bij `DEFAULT` wordt bewaard als `'it\'s'`.

Geëxporteerde Schema SQL escapet een aanhalingsteken binnen een tabel- of kolomopmerking: `COMMENT 'it''s'` voor MySQL, MariaDB en Snowflake, `COMMENT ON TABLE` en `COMMENT ON COLUMN ... IS 'it''s'` voor PostgreSQL en Oracle, en dezelfde verdubbeling, tabel- en kolomnamen inbegrepen, in de aanroepen van `sp_addextendedproperty` van MSSQL. Een opmerking zonder aanhalingsteken wordt geschreven zoals ze is.  
Databricks escapet een aanhalingsteken en een backslash in plaats daarvan met een backslash, zoals in `COMMENT 'it\'s'`, dus de export ervan wordt alleen exact teruggelezen zolang Databricks de geselecteerde database is.  
MSSQL schrijft elke opmerking als `EXECUTE sys.sp_addextendedproperty 'MS_Description', '<comment>', 'schema', '<schema>', 'table', '<table>'`, gevolgd door `'column', '<column>'` voor een kolom. Met `Bracket` op `None` levert een tabel met de naam `sales.users` het schema `sales` en de tabel `users` op, en valt een naam zonder schema in `dbo`. Bij elke andere waarde van `Bracket` is de hele naam de tabel, in `dbo`.

Opmerkingen blijven niet behouden als je naar SQLite exporteert en het resultaat weer importeert: SQLite schrijft ze als gewone regels met `--`, die de parser niet leest. De aanroepen van `sp_addextendedproperty` uit een MSSQL-export komen bij het opnieuw importeren terug als dezelfde tabel- en kolomopmerkingen.

### GraphQL {#graphql}

Je kunt een GraphQL SDL-document importeren.  
Definities van objecttypen worden tabellen, een blok `extend type` wordt samengevoegd met het type dat het uitbreidt, en interfacevelden worden overgeërfd door de typen die de interface implementeren.  
Een veld waarvan het type een andere tabel is, wordt een relatie in plaats van een kolom, en een lijst aan beide kanten maakt een koppeltabel aan.  
Een enkelvoudig veld zoals `buyer: User` wordt eerst gekoppeld aan het ene veld op het andere type waarvan de naam eindigt op `By` gevolgd door de naam van dat veld, zoals `orderListByBuyer`, zonder op hoofdletters en underscores te letten; een genummerd veld zoals `buyer2` wordt op dezelfde manier gekoppeld zonder zijn nummer. Zo benoemt de GraphQL-uitvoer van de Codegenerator de velden wanneer twee tabellen meer dan één relatie delen of een tabel naar zichzelf verwijst, dus zulke uitvoer wordt met elke relatie opnieuw geïmporteerd.  
Roottypen (`Query`, `Mutation`, `Subscription`), introspectietypen en de wrappers van Relay, federatie en Hasura zoals `PageInfo`, `*Connection`, `*Edge` en `*_aggregate` worden als ruis behandeld en overgeslagen.  
De directieven `@id`, `@primaryKey`, `@unique`, `@autoincrement`, `@default`, `@map`, `@relation`, `@column`, `@table`, `@index` en `@db.*` worden gerespecteerd.  
De bestandsnaam moet eindigen op `.graphql`, `.gql` of `.graphqls`. Een Prisma-bestand `schema.prisma` is geen GraphQL-document en kan hier niet worden geïmporteerd.

### DBML {#dbml}

Je kunt een DBML-bestand importeren, het formaat dat dbdiagram.io en dbdocs gebruiken.  
Blokken `Table`, `TablePartial`, `Ref`, `Enum` en `TableGroup` worden gelezen. Blokken `Project` en losse blokken `Note` worden overgeslagen zonder de tabellen eromheen te beïnvloeden.  
Elke schrijfwijze van een ref wordt geaccepteerd: de dubbelepuntvorm `Ref:`, een benoemde ref, de blokvorm `Ref { }` en de inline kolominstelling `[ref: > table.column]`.  
Een veel-op-veel-ref `<>` maakt een koppeltabel aan die naar beide kanten is genoemd.  
De instellingen `delete` en `update` van een losse ref worden `On Delete` en `On Update` van de relatie, zoals in `Ref: users.id < posts.user_id [delete: cascade, update: set null]`. De waarden zijn `cascade`, `restrict`, `set null`, `set default` en `no action`, ongeacht het hoofdlettergebruik. Iets anders, of geen instelling, wordt geïmporteerd als `Not set`, en andere instellingen zoals `color` worden genegeerd.  
De inline instelling `[ref: ...]` heeft geen acties, en de instellingen van een ref `<>` worden niet overgenomen op de koppeltabel. Als dezelfde refererende sleutel zowel inline als met een losse ref is gedeclareerd, blijft de inline versie behouden, zonder acties.  
De instelling `headercolor` van een tabel, zoals in `Table users [headercolor: #3498DB]`, wordt de kleur ervan als de waarde een hexwaarde `#rgb` of `#rrggbb` zonder aanhalingstekens is. Elke andere waarde wordt weggelaten, en de `headercolor` van een `TablePartial` wordt niet doorgegeven aan de tabellen die deze gebruiken.  
Elke `TableGroup` wordt een [tabelgroep](./table-groups.md) met de tabellen die ze opsomt, één per regel, benoemd zoals een `Ref` ze benoemt. De `[color: ...]` ervan wordt de kleur van de groep volgens dezelfde regel als `headercolor`, en de notitie en andere instellingen ervan worden weggelaten. Een tabel die in twee groepen staat, blijft in de eerste. Een groep zonder tabel wordt niet aangemaakt, of ze nu geen tabel opsomt die het bestand declareert of alleen tabellen die een eerdere groep al heeft genomen. Het kader van de groep wordt om haar tabellen heen gepast, waar ze ook worden geplaatst, en als de tabellen in rijen worden gezet, blijven de tabellen van een groep bij elkaar.  
De bestandsnaam moet eindigen op `.dbml`.

### AML {#aml}

Je kunt een AML-bestand (Azimutt Markup Language) importeren. Zowel de huidige schrijfwijze als de oude v1-schrijfwijze worden geaccepteerd.  
Entiteiten worden tabellen, en geneste attributen worden afgevlakt tot een kolomnaam met punten zoals `settings.slug`.  
Attributen zijn `NOT NULL` tenzij ze als `nullable` zijn aangeduid, en constructies waarvoor de editor geen plek heeft, zoals `check`, `type` en `tags`, worden weggelaten in plaats van geweigerd. Een entiteit die als view is aangeduid, komt binnen als een gewone tabel.  
De `color` van een entiteit, zoals in `users {color: red}`, wordt de kleur van de tabel ervan. De kleurnamen van AML, `red`, `orange`, `amber`, `yellow`, `lime`, `green`, `emerald`, `teal`, `cyan`, `sky`, `blue`, `indigo`, `violet`, `purple`, `fuchsia`, `pink`, `rose` en `gray`, worden gelezen ongeacht het hoofdlettergebruik, met of zonder aanhalingstekens, elk als de tint 500 van de Tailwind-kleur met die naam, zoals `#ef4444` voor `red`. Een hexwaarde tussen aanhalingstekens zoals `"#3498db"` blijft behouden zoals geschreven; een kale `#3498db` kan niet worden gelezen, omdat `#` een AML-commentaar begint. Elke andere waarde, en een `color` op een attribuut of een relatie, wordt weggelaten.  
Een losse instructie `rel`, of `fk` in de oude schrijfwijze, behoudt haar eigenschappen `onDelete` en `onUpdate` als `On Delete` en `On Update` van de relatie, zoals in `rel posts(user_id) -> users(id) {onDelete: cascade, onUpdate: "set null"}`. De waarden zijn `cascade`, `restrict`, `set null`, `set default` en `no action`, met of zonder aanhalingstekens, ongeacht het hoofdlettergebruik. Andere eigenschappen worden weggelaten.  
Bij een inline relatie zoals `user_id int -> users(id) {onDelete: cascade}` horen de eigenschappen bij het attribuut, dus worden ze weggelaten en wordt de relatie geïmporteerd als `Not set`.  
De bestandsnaam moet eindigen op `.aml`.

GraphQL, DBML en AML zijn formaten die heen en terug werken: elk ervan is ook een doel van de [Codegenerator](./code-generator.md).  
DBML en AML dragen ON DELETE en ON UPDATE van elke relatie in beide richtingen over — zie [Codegenerator](./code-generator.md#on-delete-and-on-update). GraphQL draagt geen van beide over, dus een GraphQL-import laat beide op `Not set` staan.  
DBML draagt ook tabelkleuren, zonder eventuele transparantie, en elke tabelgroep die een tabel bevat, in beide richtingen over. Een groep zonder naam komt terug als `group_1`, `group_2` enzovoort, en een herhaalde groepsnaam komt terug met `_2`, `_3` enzovoort erachter. AML draagt een tabelkleur alleen over als de dichtstbijzijnde van zijn kleurnamen, dus `#FF8800` wordt geschreven als `orange` en komt terug als `#f97316`, en AML draagt geen groepen over. GraphQL draagt kleuren noch groepen over.

## Exporteren {#exporting}

Het submenu `Export` van het contextmenu van het canvas heeft drie items:

- json: Slaat het diagram op zoals het bestand ervan het bevat, als `.erd.json`: de tabellen met hun kolommen en indexen, de relaties, memo's en tabelgroepen, en de instellingen, elke [vergrendelde instelling](./settings.md#lock) op haar vergrendelde waarde.
- Schema SQL: Opent het tabblad [Schema SQL](./schema-sql.md#saving-or-copying-the-sql) met het optiepaneel open en de focus op de knop `Save file`, zodat een druk op `Enter` de SQL die het tabblad toont opslaat als `.sql`. Tot dan wordt er niets opgeslagen.
- Image: Opent het dialoogvenster `Export image`, dat het diagram opslaat als `.png` of `.svg`, of het als PNG naar het klembord kopieert — zie [Afbeelding](#image).

Alle drie werken in een editor in alleen-lezenmodus.

Schema SQL schrijft ON DELETE en ON UPDATE van elke relatie na de `REFERENCES` ervan, ON DELETE eerst. `Not set` schrijft niets, en een actie die de geselecteerde database niet accepteert, wordt weggelaten. Zie [Relaties bewerken](./relationship-editing.md#on-delete-and-on-update) voor welke database welke actie accepteert.

Elk geëxporteerd bestand heet `<database name>-<timestamp>` gevolgd door de extensie, met de tijdstempel in lokale tijd in de notatie `yyyy-MM-dd'T'HH_mm_ss` — bijvoorbeeld `my-schema-2026-08-29T04_05_06.erd.json`. Bij een lege databasenaam wordt `unnamed` gebruikt.  
`Save file` op het tabblad Schema SQL en in de [Codegenerator](./code-generator.md) geeft bestanden op dezelfde manier een naam. Een afbeelding krijgt de databasenaam zoals die was toen het dialoogvenster werd geopend.

`Import`, `Import and Add` en `Export` zijn ook beschikbaar via [Snel zoeken](./quick-search.md) op het ERD-tabblad, met dezelfde items als het contextmenu van het canvas.

In Obsidian verschijnt er geen download- of opslagdialoogvenster: het bestand wordt in de kluis geschreven, op de plek waar Obsidian nieuwe bijlagen voor dat diagram plaatst, en een melding noemt het pad ervan.  
Tekens die Obsidian niet toestaat in een bestandsnaam, `\ / : * ? " < > |`, worden vervangen door `-`.  
De bestandsverkenner van Obsidian toont een geëxporteerd `.erd.json`- of `.sql`-bestand alleen zolang Settings → Files and links → Detect all file extensions aanstaat.

### Afbeelding {#image}

`Export` ▸ `Image`, via het contextmenu van het canvas of via Snel zoeken, opent het dialoogvenster `Export image`: een voorbeeld van de afbeelding naast de opties ervan. Een geopende [Verkenner](./explorer.md#dialogs-beside-it) blijft open onder het gedimde gebied.

![Export > Image openen, de donkere modus en de achtergrond uitschakelen, 3x kiezen en de afbeelding naar het klembord kopiëren](/img/demo-export.webp)

- `Background`: Staat standaard aan. Staat de optie uit, dan blijft het canvas transparant.
- `Dark mode`: Komt aanvankelijk overeen met het uiterlijk van de editor. Zolang de optie overeenkomt met het uiterlijk op het scherm, krijgt de afbeelding de eigen kleuren van het canvas, inclusief wijzigingen uit de [themabouwer](./language-and-theme.md); het andere uiterlijk gebruikt de voorinstelling met dezelfde grijstint en accentkleur.
- `Scale`: `1x`, `2x` of `3x`, met standaard `2x` geselecteerd. De optie bepaalt alleen de grootte van de PNG en van de kopie op het klembord, en de regel eronder geeft die grootte, als `PNG <width> × <height> px`.

De keuzes blijven bewaard tot de editor sluit en worden nooit in het document opgeslagen. Het voorbeeld wordt getekend zoals de afbeelding, en wordt opnieuw getekend als `Background` of `Dark mode` verandert.

De afbeelding bevat het diagram zoals het was toen het dialoogvenster werd geopend; sluit het dialoogvenster en open het opnieuw om latere wijzigingen mee te nemen. Ze bevat het hele diagram, hoe ver het ook is weggescrold, bijgesneden tot wat het diagram tekent plus een marge, en ze wordt altijd op 100% getekend, welk zoomniveau de editor ook toont, zodat elke tabel volledig wordt getekend. Wat de [weergaveopties](./table-related-functions.md#table-view-options) verbergen — relaties, hun labels voor ON DELETE en ON UPDATE, tabelgroepen of memo's — wordt niet getekend en krijgt geen ruimte, en tabelgroepen worden achter al het andere getekend.

Drie knoppen schrijven de afbeelding weg, en elk ervan laat het dialoogvenster open:

- `PNG`: Slaat een `.png` op ter grootte van het diagram op 100% maal de `Scale`. Een PNG die te groot is voor een browsercanvas, wordt met een lagere resolutie geschreven in plaats van te mislukken: het dialoogvenster waarschuwt vooraf met `Reduced from <width> × <height> px, past what a browser canvas can hold`, en achteraf zegt de melding `Exported at a reduced resolution` dat ook.
- `SVG`: Slaat een `.svg` op ter grootte van het diagram op 100%, ongeacht de `Scale`, en nooit verkleind. De tekst blijft tekst en de lettertypen worden bij naam genoemd in plaats van ingesloten, zodat een viewer zonder het lettertype van de editor een ander lettertype gebruikt. Schaduwen worden weggelaten.
- `Copy to clipboard`: Zet een PNG op het klembord met de gekozen `Scale`, verkleind zoals een opgeslagen PNG wanneer een browsercanvas die niet kan bevatten. De knop bevestigt met `Copied the image to the clipboard`, of met `Copied at a reduced resolution` als de afbeelding is verkleind. Als het kopiëren mislukt, omdat de browser of de host het klembord weigert of de afbeelding niet kon worden getekend, stelt `Couldn't copy the image` voor om in plaats daarvan een PNG op te slaan.

De afbeelding wordt getekend in een worker op de achtergrond als de host er een draait, zodat de editor intussen bruikbaar blijft. De melding `Exporting PNG`, `Exporting SVG` of `Copying image` verschijnt als het langer dan even duurt, en een fout wordt gemeld als `Couldn't export the PNG` of `Couldn't export the SVG`. Als je het dialoogvenster sluit terwijl een bestand nog wordt getekend, wordt dat bestand toch opgeslagen.

`PNG` heeft de focus als het dialoogvenster opent, en `Tab` blijft binnen het dialoogvenster. `Escape`, de knop `x` of een klik op het gedimde gebied eromheen sluit het.  
Zolang het open is, doen de sneltoetsen van het canvas, inclusief ongedaan maken en opnieuw uitvoeren, en kopiëren en plakken niets. `Ctrl + K` (Windows/Linux) of `⌘ + K` (Mac) sluit het en opent Snel zoeken. `Ctrl + F` (Windows/Linux) of `⌘ + F` (Mac) sluit het en zet de tekstcursor in het zoekveld van de [Verkenner](./explorer.md#opening-and-closing), waarbij de Verkenner wordt geopend als die gesloten is, maar nooit wordt gesloten. In een editor die te smal is om de Verkenner te tonen, sluit de toetscombinatie het dialoogvenster nog steeds, maar toont ze een melding in plaats van de tekstcursor te verplaatsen.
