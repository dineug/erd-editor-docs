---
sidebar_position: 2
description: Importera JSON, Schema SQL, GraphQL, DBML eller AML i stället för diagrammet eller som ett tillägg under det och exportera JSON, Schema SQL eller diagrammet som en PNG- eller SVG-bild.
---

# Importera eller exportera filer

## Importera externa filer {#importing-external-files}

Du kan importera fem format från undermenyn `Import` i arbetsytans snabbmeny:

- json
- Schema SQL
- GraphQL
- DBML
- AML

Menyalternativet `Import and Add` direkt under `Import` lägger till filen i diagrammet i stället för att ersätta det – se [Importera och lägg till](#import-and-add).  
Välkomstskärmen som ett tomt diagram visar har en rad `Import` med samma fem format – se [Välkomstskärmen](./editing-start.md#welcome-screen).  
Bladen på fliken [Ordlista](./dictionary.md) tar också emot ord, termer och domäner från CSV-filer, med flikens egen `Import CSV` – se [Importera och exportera CSV](./dictionary.md#importing-and-exporting-csv).

Filändelser matchas oavsett skiftläge. Om du väljer en fil vars filändelse inte matchar det valda formatet avbryts importen och meddelandet `Only <format> files can be imported` visas, med formatet skrivet som `json`, `sql`, `graphql`, `dbml` eller `aml`, som i `Only sql files can be imported`.

`Import` ersätter det aktuella dokumentet i stället för att slås samman med det, och om du ångrar ett steg kommer det tidigare diagrammet tillbaka.  
En JSON-fil tar med sig sina egna inställningar, inklusive sina [lås](./settings.md#lock). Där filen låser fliken, kodgeneratorns språk, ett skiftläge, typen av citattecken eller [namnvisningen](./logical-names.md#name-view) ser du fortfarande det du hade, men det är filens låsta värde som sparas. Zoomnivån och vypositionen hamnar, låsta eller inte, där filen anger. En JSON-fil som sparades innan låsen fanns importeras med alla lås påslagna och vyn på 100 %. En fil som sparades innan låset `Name View` fanns importeras med det låset påslaget, oavsett vilka andra lås den registrerar.  
De andra formaten behåller de inställningar du redan har, inklusive låsen, utom vyn, som börjar på 100 %.  
Parsrarna för GraphQL, DBML och AML misslyckas aldrig: en fil som de inte kan tolka ger ett tomt diagram i stället för ett fel.

En JSON-fil tar också med sig tabellernas och kolumnernas logiska namn och kolumnernas domänkopplingar. Dess ord, termer och domäner ersätter dem på fliken [Ordlista](./dictionary.md), så en fil som inte innehåller några lämnar bladen tomma, och om du ångrar importen kommer de som ersattes tillbaka.  
De andra formaten innehåller inget av detta. Deras tabeller kommer in utan logiska namn och utan någon kolumn som är kopplad till en domän, och dina ord, termer och domäner förblir som de är. Att ångra eller göra om importen lämnar dem också som de är, så en ändring i ordlistan som görs efter importen behålls. En sådan import lämnar också varje blads egen ångrahistorik som den är, medan en JSON-import tömmer de historikerna – se [Ordlistans blad](./undo-redo.md#dictionary-sheets).

En JSON-fil behåller sina positioner. Tabellerna i en Schema SQL-, GraphQL-, DBML- eller AML-fil placeras innan diagrammet ändras, med de bredder de har i den [namnvisning](./logical-names.md#beyond-the-canvas) du tittar på:

- När filen har två eller fler tabeller och minst en relation läggs tabellerna ut med den [automatiska layouten](./table-related-functions.md#auto-layout) `Flow`, från vänster till höger längs relationerna, med början uppe till vänster på arbetsytan. En relation från en tabell till sig själv räknas.
- Annars ställs de upp i rader med början uppe till vänster, med de tabeller som har färst kolumner först.
- Om layouten tar längre tid än 6 sekunder visas meddelandet `Placing tables` med knappen `Cancel`. `Cancel`, eller ett tryck på `Escape` medan meddelandet visas, avbryter layouten och ställer i stället upp tabellerna i rader. Rader används också, utan meddelande, när layouten misslyckas, när ingen layout har kommit tillbaka inom 60 sekunder eller när värdprogrammet inte kör någon shared worker – se [Web Workers](../../api/installation.md#web-workers).

Diagrammet ersätts sedan i ett enda steg, så ingenting visas däremellan. En inställning som du ändrar medan tabellerna placeras, till exempel fliken, behålls, och om du importerar en annan fil under tiden vinner den import som startades sist.

En skrivskyddad editor importerar ingenting. Dess snabbmeny för arbetsytan och dess snabbsökning erbjuder varken `Import` eller `Import and Add`, den visar ingen välkomstskärm, och fliken Ordlista erbjuder ingen `Import CSV`.

### Importera och lägg till {#import-and-add}

`Import and Add` behåller diagrammet och lägger till en fil under det. Det finns i arbetsytans snabbmeny och i [snabbsökningen](./quick-search.md) på ERD-fliken och erbjuder samma fem format med samma kontroll av filändelsen som `Import`.

![En SQL-fil läggs till från Import and Add > Schema SQL, och dess tabeller hamnar under diagrammet, utlagda längs sina relationer och markerade](/img/demo-import-and-add.webp)

Filen läggs in på samma sätt som vid en inklistring: alla tabeller, kolumner, relationer, index, anteckningar och [tabellgrupper](./table-groups.md) som den innehåller läggs till som nya, tabellerna som redan finns i diagrammet flyttas inte och ingen inställning ändras, så inställningarna i en JSON-fil utelämnas.  
Tabellerna och kolumnerna i en JSON-fil behåller sina logiska namn, och varje fysiskt namn tillhör fortfarande ordlistorna eller dig, så som det var i filen, vilket avgör om ett logiskt namn som skrivs senare härleder ett nytt – se [Härleda fysiska namn](./dictionary.md#deriving-physical-names). Filens ord, termer och domäner utelämnas, så fliken Ordlista förblir som den var, och ingen tillagd kolumn kopplas till en domän: var och en behåller den datatyp den har.  
En tabell vars namn redan finns i diagrammet läggs till som en andra tabell med det namnet och slås inte ihop med den. Relationer och index kommer bara från filen, så en sekundärnyckel till en tabell som filen inte definierar kopplas inte till en tabell som redan finns i diagrammet.

Det tillagda blocket hamnar precis under allt som diagrammet innehåller, i linje med dess vänsterkant, eller uppe till vänster i ett tomt diagram. Anteckningar och tabellgrupper som är dolda med [visningsalternativen](./table-related-functions.md#table-view-options) räknas också, eftersom de fortfarande står kvar där.  
Inom blocket behåller en JSON-fil sin egen placering, inklusive sina tabellgrupper. De andra formaten placeras som `Import` placerar dem, med `Flow` eller i rader enligt samma regler, och varje tabellgrupps ruta anpassas runt gruppens tabeller. De tillagda tabellerna och anteckningarna hamnar ovanpå allt som redan finns där.

När blocket har hamnat är bara det som lades till markerat: de nya tabellerna samt de nya anteckningarna och tabellgrupperna om de visas. Om du har gått till en annan flik under tiden växlar editorn tillbaka till ERD-fliken innan blocket hamnar. Vyn rullar sedan till blocket med den aktuella zoomnivån, om det inte redan syns väl – se [Var ett hopp hamnar](./table-related-functions.md#where-a-jump-lands). Hela tillägget ångras i ett steg.  
En fil som parsern inte kan tolka, eller en fil som varken har någon tabell eller någon anteckning, lägger inte till något.

Flera Schema SQL-, GraphQL-, DBML- eller AML-filer som läggs till medan en fortfarande placeras hamnar alla, i den ordning de startades. En JSON-fil som läggs till under tiden hamnar så snart den har lästs in, före dem. En `Import`, eller inläsning av ett annat dokument, avbryter alla som fortfarande placeras.

Kodagenter lägger till en fil på samma sätt med läget `append` i MCP-verktygen för import, som behåller placeringen i en JSON-fil men ställer upp tabellerna i de andra formaten i rader, aldrig med `Flow` – se [Import](../../mcp/tools.md#import).

### JSON {#json}

Du kan importera filer i [schemaformatet som definieras i editorn](../../api/advanced/schema.md).
Filnamnet måste sluta på `.json`, så en fil som exporterats som `<database name>-<timestamp>.erd.json` kan importeras tillbaka som den är; en ren `.erd`- eller `.vuerd`-fil godtas inte här. Filer som sparats av tidigare versioner läses också in.

![En sparad fil importeras från Import > json och ersätter utkastdokumentet tillsammans med dess inställningar](/img/demo-import-json.webp)

### Schema SQL {#schema-sql}

Du kan också importera schemafiler som definieras i SQL.  
Även om parsrarna har gjorts så flexibla som möjligt oavsett databassystem kan det finnas syntax som inte stöds.  
Filnamnet måste sluta på `.sql`.  
[Här kan du se vilken syntax som stöds.](https://github.com/dineug/erd-editor/tree/main/packages/schema-sql-parser)

![En SQL-fil importeras från Import > Schema SQL, dess tabeller läggs ut längs sina relationer och sedan zoomas vyn ut över dem](/img/demo-import-sql.webp)

Kolumner hämtas bara från `CREATE TABLE`. En kolumn som läggs till med `ALTER TABLE ... ADD COLUMN` läses inte in.  
Delar av en `CREATE TABLE` som inte är kolumner hoppas över i stället för att läsas som kolumner: en namnlös `CHECK (...)`, `LIKE` och `EXCLUDE` i PostgreSQL, `FULLTEXT` och `SPATIAL` i MySQL när de skrivs utan `INDEX` eller `KEY`, `PERIOD FOR` i T-SQL och `SUPPLEMENTAL LOG DATA` i Oracle.  
En kolumn med samma namn som något av dem importeras ändå när en inbyggd typ följer efter namnet, som i `exclude BOOLEAN`, eller när namnet står inom citattecken, som i `"check" int`. Ett `like` utan citattecken som följs av en typ som inte är inbyggd, till exempel `like citext`, läses som `LIKE` i PostgreSQL och hoppas över.  
Begränsningarna `CHECK` i sig importeras inte, eftersom editorn inte har någon plats att lagra dem.

#### Datatyper {#data-types}

En kolumns datatyp behålls, inklusive argumentlistan, även när den inte är en inbyggd typ i någon [databas som stöds](./table-related-functions.md#databases).  
Det gäller en enum eller sammansatt typ som skapats med `CREATE TYPE`, en domän som skapats med `CREATE DOMAIN`, tilläggstyper som `hstore`, `citext` och `ltree`, schemakvalificerade namn som `public.mood` och namn inom citattecken eller hakparenteser som `"MyType"` och `[dbo].[Phone]`, som behåller sina citattecken eller hakparenteser. Själva satserna `CREATE TYPE`, `CREATE DOMAIN` och `CREATE EXTENSION` hoppas över.  
En inbyggd typ förlorar sina citattecken eller hakparenteser, så `[int]` importeras som `int` och `[nvarchar](50)` som `nvarchar(50)`. `"char"` och `"bit"` i PostgreSQL behåller sina, eftersom de är andra typer än `char` och `bit`.  
Arraysuffix behålls på alla typer: `integer[]`, `text[3][3]`, `integer ARRAY`, `mood[]`. `UNSIGNED BIG INT` i SQLite importeras i sin helhet.  
`UNSIGNED` och `ZEROFILL` i MySQL och MariaDB, skrivna direkt efter en typ och dess argument, förblir en del av typen så som de skrivits: `INT UNSIGNED`, `SMALLINT(5) UNSIGNED ZEROFILL`, `int unsigned` från mysqldump. `SIGNED`, som är standard, tas bort, så `TINYINT SIGNED` importeras som `TINYINT`. En modifierare som skrivs efter ett annat kolumnalternativ, som i `INT NOT NULL UNSIGNED`, vilket MySQL avvisar, tas bort.  
Värden i `ENUM(...)` och `SET(...)` behåller sina citattecken, med ett citattecken inuti ett värde dubblerat, som i `ENUM('a','it''s')`. MySQL-varianten `'it\'s'` med omvänt snedstreck importeras dubblerad på samma sätt. I typen `STRUCT<...>` i Databricks behåller fältnamn inom citattecken och ett fälts `COMMENT` sina citattecken.  
En kolumn som skrivs utan typ, till exempel en typlös kolumn i SQLite eller en beräknad kolumn med `AS`, förblir typlös: ett nyckelord som `NOT`, `NULL`, `DEFAULT`, `PRIMARY` eller `REFERENCES`, eller en sträng inom enkla citattecken, läses inte som en typ.

#### Standardvärden {#defaults}

En kolumns `DEFAULT` behåller hela sitt uttryck, till exempel `now()`, `0.5`, `CURRENT_TIMESTAMP` eller `ARRAY[]::text[]`, fram till nästa kolumnalternativ, ett kommatecken eller den avslutande parentesen. En `CASE ... END` läses i sin helhet.  
Parenteser runt hela uttrycket tas bort, så `((0))` från SQL Server importeras som `0` och `(getdate())` som `getdate()`. En typomvandling av en literal tas också bort, så `'draft'::character varying` från pg_dump importeras som `'draft'` och `NULL::character varying` som `NULL`; andra typomvandlingar behålls, som i `ARRAY[]::text[]` och `lower('A'::text)`.  
`ON UPDATE CURRENT_TIMESTAMP` i MySQL tas bort, eftersom en kolumn inte har någon plats för det, och standardvärdet före det behålls. `DEFAULT ON NULL 0` i Oracle, med eller utan `FOR INSERT ONLY` eller `FOR INSERT AND UPDATE`, importeras som `0`.  
En sträng med prefix, till exempel `N'x'`, `E'x'`, `B'0'`, `X'ff'`, `U&'x'` eller `_utf8mb4'x'`, läses som en enda sträng, även om den innehåller en parentes.

SQL Server Management Studio skriver standardvärden efter tabellerna i sina skript, som `ALTER TABLE [dbo].[t] ADD CONSTRAINT [DF_x] DEFAULT ((1)) FOR [col]`. En sådan sats anger standardvärdet för den kolumnen, här `1`, och namnet på dess begränsning tas bort.

En Schema SQL-export sätter tillbaka parenteserna där en databas bara läser ett standardvärdes uttryck inom parenteser – se [Standardvärden](./schema-sql.md#defaults).

#### Automatisk uppräkning {#auto-increment}

`AUTO_INCREMENT`, `AUTOINCREMENT` och `IDENTITY` slår på `Auto Increment` för en kolumn, och det gör även `GENERATED ALWAYS AS IDENTITY` och `GENERATED BY DEFAULT AS IDENTITY`, som inte lämnar något standardvärde efter sig.  
Det gör även ett standardvärde som är ett enda anrop av `nextval()` i PostgreSQL, det standardvärde som en serial-kolumn får, skrivet `nextval('s')` eller, som pg_dump skriver det, `nextval('s'::regclass)`. Sekvensens namn behålls inte. Ett standardvärde som bara använder en sekvens, till exempel `nextval('s') + 1` eller `NEXT VALUE FOR s` i SQL Server, förblir ett vanligt standardvärde.  
pg_dump skriver båda efter tabellerna, som `ALTER TABLE [ONLY] t ALTER [COLUMN] c SET DEFAULT nextval('s'::regclass)` och `ALTER TABLE t ALTER [COLUMN] c ADD GENERATED ... AS IDENTITY`. Var och en av satserna slår på `Auto Increment` för den kolumnen och rensar dess standardvärde. `CREATE SEQUENCE`, `ALTER SEQUENCE` och alla andra åtgärder i `ALTER COLUMN` hoppas över.  
En kolumn som direkt i definitionen har typen `serial`, `bigserial` eller `smallserial` behåller den typen, med `Auto Increment` av.

Editorn behåller bara flaggan `Auto Increment`, och varje databas skriver sin egen form vid export – se [Automatisk uppräkning](./schema-sql.md#auto-increment). En PostgreSQL-export skriver `GENERATED ALWAYS AS IDENTITY` på en kolumn av typen `smallint`, `integer` eller `bigint`, oavsett vilken form som importerades, och på alla andra typer, till exempel `INT UNSIGNED`, bara en kommentarsrad efter tabellen. Sekvensalternativ som `START WITH 100` går förlorade.  
En tabell med flera serial- eller identity-kolumner importeras med flera kolumner med automatisk uppräkning, och MySQL, MariaDB och SQL Server avvisar en sådan tabell när dess export körs.

#### Primärnycklar {#primary-keys}

En primärnyckel som läggs till efter sin tabell, `ALTER TABLE t ADD [CONSTRAINT n] PRIMARY KEY (...)`, gör sina kolumner till primärnyckeln.  
`CLUSTERED` eller `NONCLUSTERED` i SQL Server och `USING BTREE` i MySQL före kolumnlistan ignoreras, så den `ALTER TABLE [dbo].[Users] ADD CONSTRAINT [PK_Users] PRIMARY KEY CLUSTERED ([Id] ASC) WITH (...) ON [PRIMARY]` som SQL Server Management Studio skriver i sina skript ger en nyckel på `Id`. `PRIMARY KEY NONCLUSTERED HASH (...)` för en minnesoptimerad tabell läses inte, varken i `ALTER TABLE` eller i `CREATE TABLE`.

#### Unika nycklar och index {#unique-keys-and-indexes}

En `UNIQUE` över två eller fler kolumner blir ett unikt index, i alla skrivsätt: `UNIQUE (a, b)`, `UNIQUE KEY n (a, b)`, `UNIQUE INDEX n (a, b)`, `CONSTRAINT n UNIQUE (a, b)`, den infogade `INDEX n UNIQUE (a, b)` i SQL Server och `ALTER TABLE t ADD [CONSTRAINT n] UNIQUE (a, b)`.  
Indexet får nyckelns indexnamn, annars namnet i dess `CONSTRAINT`, annars inget namn, och behåller varje kolumns sorteringsordning. Ett sådant index är en [alternativ nyckel](./table-related-functions.md#alternate-keys).  
En `UNIQUE` över en kolumn, i vilket som helst av de skrivsätten, ger i stället den kolumnen flaggan Unik och lägger inte till något index, så begränsningen `UQ_<table name>_<column name>` som exporten skriver kommer tillbaka som den flagga den skrevs från. En `CREATE UNIQUE INDEX` över en kolumn förblir ett unikt index.

En `ALTER TABLE` som lägger till flera nycklar på en gång, som när phpMyAdmin skriver `ADD PRIMARY KEY (id), ADD UNIQUE KEY uq_a (a, b), ADD UNIQUE KEY uq_c (c)`, behåller varje unik nyckel i den: `uq_a` importeras som ett unikt index med namnet `uq_a` och `uq_c` som flaggan Unik på `c`. Ett namn i `CONSTRAINT` namnger bara nyckeln i sin egen klausul. `ADD UNIQUE INDEX IF NOT EXISTS n (...)` i MariaDB samt `ALTER TABLE t WITH CHECK ADD ...` och `WITH NOCHECK ADD ...` i SQL Server läses också in.  
`CREATE INDEX` och `CREATE UNIQUE INDEX` läses in med kvalificerade namn som `public.t` och `[dbo].[t]`, med `CLUSTERED` och `NONCLUSTERED` i SQL Server, med `CONCURRENTLY`, `IF NOT EXISTS`, `ON ONLY` och `USING btree` i PostgreSQL samt helt utan indexnamn. Filgruppen `ON [PRIMARY]` i SQL Server ignoreras.  
Nyckelalternativ som `NULLS NOT DISTINCT` eller `USING BTREE` misstas inte för nyckelns namn. I en nyckels kolumnlista anger bara det första ordet kolumnen, så `b DESC NULLS LAST`, `b text_pattern_ops` och `b COLLATE "C"` ger alla en nyckel på `b`, med `DESC` bevarat som dess sorteringsordning. En prefixlängd som `email(191)` ignoreras, men en nyckel med en uttrycksdel, som `lower(email)`, hoppas över helt.

Ett partiellt unikt index, `CREATE UNIQUE INDEX ... WHERE ...` eller den infogade `INDEX n UNIQUE (...) WHERE ...` i SQL Server, importeras som ett vanligt index med samma namn och kolumner, eftersom en nyckel som är unik över hela tabellen skulle vara striktare än den filtrerade som filen deklarerar. Undantaget är ett filter som bara består av tester med `IS NOT NULL` på nyckelns kolumner sammanfogade med `AND`, det filter som SQL Server behöver för att en unik kolumn ska kunna innehålla mer än ett NULL: den nyckeln förblir unik.  
En unik nyckel som anger en kolumn som tabellen inte har, till exempel en som lagts till med `ALTER TABLE ... ADD COLUMN`, tas bort helt i stället för att kortas ned till de kolumner som finns. Ett vanligt index behåller de kolumner som finns.

SQL Developer från Oracle och `DBMS_METADATA` skriver en nyckels eget index som en separat `CREATE UNIQUE INDEX`, med nyckelns namn eller, för en namnlös nyckel som följs av `USING INDEX`, med ett systemnamn som `SYS_C0012345`. Importen läser ett sådant index, och det index som en `ADD CONSTRAINT ... USING INDEX` anger, som en del av sin nyckel: en sammansatt unik nyckel importeras som ett unikt index och en primärnyckel eller en unik nyckel över en kolumn som kolumnflaggorna, utan något extra index. En export tillbaka till Oracle skapar sedan indexet en gång.

En Schema SQL-export importeras tillbaka med samma flaggor Unik och samma index för MySQL, MariaDB, MSSQL, Oracle, PostgreSQL och SQLite.  
Snowflake har inga sekundära index, så dess export ger bara tillbaka de unika nycklarna: en sammansatt som ett unikt index och en över en kolumn som kolumnens flagga Unik. En Databricks-export deklarerar ingen unikhet, så ingen kommer tillbaka.

#### Sekundärnycklar {#foreign-keys}

En sekundärnyckel blir en relation i dessa skrivsätt:

- En `FOREIGN KEY (...) REFERENCES t (...)` på tabellnivå, med eller utan `CONSTRAINT name`.
- `ALTER TABLE ... ADD [CONSTRAINT name] FOREIGN KEY (...) REFERENCES t (...)`, inklusive de `ALTER TABLE t WITH CHECK ADD ...` och `WITH NOCHECK ADD ...` som SQL Server Management Studio skriver i sina skript.
- En kolumns infogade `REFERENCES t (col)`, som i `user_id INT REFERENCES users (id)`, och den `FOREIGN KEY REFERENCES t (col)` som SQL Server och Snowflake tillåter där. En infogad referens till mer än en kolumn hoppas över.

En `ALTER TABLE` ger högst en relation, och bara när dess första klausul lägger till en sekundärnyckel: en klausul med `FOREIGN KEY` efter en klausul med `ADD PRIMARY KEY` eller `ADD UNIQUE` i samma sats läses inte. När en sats lägger till flera sekundärnycklar, som när phpMyAdmin skriver `ADD CONSTRAINT fk1 FOREIGN KEY ..., ADD CONSTRAINT fk2 FOREIGN KEY ...`, läses bara den sista.

`REFERENCES t` utan kolumnlista pekar på primärnyckeln i `t` när den nyckeln är en enda kolumn. Mot en sammansatt primärnyckel hoppas sekundärnyckeln över.  
En sekundärnyckel hoppas över, och ingen av dess kolumner blir en sekundärnyckelkolumn, när ingen av dess refererade kolumner hittas eller när antalet hittade kolumner skiljer sig mellan de två tabellerna, som när en kolumn bara saknas i den ena av dem. När båda tabellerna saknar lika många av dess kolumner paras de hittade kolumnerna ihop i den ordning de skrivits, och relationen innehåller bara dem.  
Varje importerad relation är `Zero N`, och den är identifierande när var och en av dess barnkolumner också är en primärnyckel.

Klausulerna `ON DELETE` och `ON UPDATE` för varje sekundärnyckel blir relationens `On Delete` och `On Update`: `NO ACTION`, `RESTRICT`, `CASCADE`, `SET NULL` eller `SET DEFAULT`, oavsett skiftläge och i valfri ordning. En sekundärnyckel utan dem importeras som `Not set`. Se [Redigera relationer](./relationship-editing.md#on-delete-and-on-update) för hur du anger dem i editorn.  
Kolumnlistan efter `SET NULL` eller `SET DEFAULT` i PostgreSQL, som i `ON DELETE SET NULL (a_id)`, ignoreras: åtgärden gäller hela nyckeln, och en `ON UPDATE` efter listan läses ändå. `MATCH FULL`, `MATCH PARTIAL` och `MATCH SIMPLE` hoppas över, och kolumnattributet `ON UPDATE CURRENT_TIMESTAMP` i MySQL misstas inte för en åtgärd.  
En Schema SQL-export importeras tillbaka med de åtgärder som den databasen skriver, så en åtgärd som den utelämnar, till exempel `SET DEFAULT` för MySQL, alla `ON UPDATE` för Oracle eller allt utom `NO ACTION` för Snowflake, kommer tillbaka som `Not set`.

#### Kommentarer {#comments}

Tabell- och kolumnkommentarer importeras från de tre syntaxer som parsern läser: tabellalternativet och kolumnattributet `COMMENT` som används av MySQL, MariaDB, Snowflake och Databricks, satserna `COMMENT ON TABLE` och `COMMENT ON COLUMN` som används av PostgreSQL och Oracle samt den utökade egenskapen `MS_Description` som SQL Server anger med `EXEC sp_addextendedproperty`.  
En kommentar som anger en tabell eller kolumn som filen inte definierar ignoreras.

Anropen i SQL Server läses med namngivna argument, så som SQL Server Management Studio skriver varje kommentar i sina skript (`@name=N'MS_Description', @value=N'...', ..., @level1type=N'TABLE', @level1name=N'Users'`), och med positionella argument, så som editorns MSSQL-export skriver dem.  
Bara en `MS_Description` på en tabell, eller på en av dess kolumner på nivå 2, ger en kommentar. En annan egenskap, en vy, ett index eller en begränsning ger ingen, och det gör inte heller en kommentar som skickas i en variabel eller byggs ihop med `+`.

I en kommentar, liksom i all text inom citattecken som ett värde i `DEFAULT` eller ett namn inom citattecken, står ett dubblerat citattecken för ett citattecken, så som mysqldump och pg_dump skriver det: `'it''s'` läses som `it's`.  
Ett omvänt snedstreck före ett citattecken, som när MySQL och MariaDB skriver `'it\'s'`, maskerar också citattecknet. Ett sådant citattecken avslutar ändå texten när blanktecken, `,`, `;`, `)`, `]`, `:`, `|`, `+` eller filens slut följer efter det, så `'C:\'`, `'C:\'::text` från pg_dump och `'C:\'+name` i T-SQL behåller sitt omvända snedstreck.  
Ett värde i `DEFAULT` behåller sina citattecken, och ett citattecken inuti det skrivs tillbaka dubblerat oavsett hur filen maskerade det: `'it''s'`.  
När dokumentets databas är Databricks vid importen följer text inom enkla citattecken i stället reglerna i Spark: varje omvänt snedstreck maskerar tecknet efter det, så `'C:\\dir'` läses som `C:\dir`, escape-sekvenser som `\n`, `\t` och `\u0041` avkodas och ett värde i `DEFAULT` behålls som `'it\'s'`.

Hur varje databas skriver en kommentar vid export, och hur den maskerar ett citattecken i en, beskrivs i [Kommentarer](./schema-sql.md#comments) på sidan om Schema SQL.  
En export till MySQL, MariaDB, PostgreSQL, Oracle, Snowflake eller MSSQL importeras tillbaka som samma tabell- och kolumnkommentarer, inklusive citattecken, bortsett från de tomma rader som en Oracle-export utelämnar. En Databricks-export, som maskerar ett citattecken och ett omvänt snedstreck med ett omvänt snedstreck, läses tillbaka exakt bara medan Databricks är den valda databasen.  
Kommentarer överlever inte en export och återimport med SQLite: SQLite skriver dem som vanliga rader med `--`, som parsern inte läser.  
Utom i SQLite importeras ett logiskt namn som `Write logical names into empty comments` skrev i en tom kommentar tillbaka som tabellens eller kolumnens kommentar, inte som dess logiska namn – se [Logiska namn som kommentarer](./schema-sql.md#logical-names-as-comments).

### GraphQL {#graphql}

Du kan importera ett GraphQL SDL-dokument.  
Definitioner av objekttyper blir tabeller, ett block med `extend type` slås samman med typen det utökar och gränssnittsfält ärvs av de typer som implementerar dem.  
Ett fält vars typ är en annan tabell blir en relation i stället för en kolumn, och en lista på båda sidor skapar en kopplingstabell.  
Ett fält i singular som `buyer: User` paras först ihop med det enda fältet på den andra typen vars namn slutar på `By` följt av det fältets namn, till exempel `orderListByBuyer`, oavsett skiftläge och understreck; ett numrerat fält som `buyer2` paras ihop på samma sätt utan sitt nummer. Det är så kodgeneratorns GraphQL-utdata namnger fälten när två tabeller delar mer än en relation eller en tabell refererar till sig själv, så sådana utdata importeras tillbaka med alla relationer.  
Rottyper (`Query`, `Mutation`, `Subscription`), introspektionstyper och omslutande typer för Relay, federation och Hasura, som `PageInfo`, `*Connection`, `*Edge` och `*_aggregate`, behandlas som brus och hoppas över.  
Direktiven `@id`, `@primaryKey`, `@unique`, `@autoincrement`, `@default`, `@map`, `@relation`, `@column`, `@table`, `@index` och `@db.*` respekteras.  
Filnamnet måste sluta på `.graphql`, `.gql` eller `.graphqls`. En Prisma-fil `schema.prisma` är inte ett GraphQL-dokument och kan inte importeras här.

### DBML {#dbml}

Du kan importera en DBML-fil, formatet som används av dbdiagram.io och dbdocs.  
Blocken `Table`, `TablePartial`, `Ref`, `Enum` och `TableGroup` läses in. Block med `Project` och fristående block med `Note` hoppas över utan att påverka tabellerna runt dem.  
Alla skrivsätt för ref godtas: kolonformen `Ref:`, en namngiven ref, blockformen `Ref { }` och den infogade kolumninställningen `[ref: > table.column]`.  
En många-till-många-ref med `<>` skapar en kopplingstabell som får sitt namn efter båda sidorna.  
Inställningarna `delete` och `update` för en fristående ref blir relationens `On Delete` och `On Update`, som i `Ref: users.id < posts.user_id [delete: cascade, update: set null]`. Värdena är `cascade`, `restrict`, `set null`, `set default` och `no action`, oavsett skiftläge. Allt annat, eller ingen inställning, importeras som `Not set`, och andra inställningar som `color` ignoreras.  
Den infogade inställningen `[ref: ...]` har inga åtgärder, och inställningarna för en ref med `<>` förs inte över till kopplingstabellen. När samma sekundärnyckel deklareras både infogad och som en fristående ref behålls den infogade, utan åtgärder.  
En tabells inställning `headercolor`, som i `Table users [headercolor: #3498DB]`, blir dess färg när värdet är ett hexvärde i formen `#rgb` eller `#rrggbb` skrivet utan citattecken. Alla andra värden tas bort, och `headercolor` i en `TablePartial` förs inte vidare till de tabeller som använder den.  
Varje `TableGroup` blir en [tabellgrupp](./table-groups.md) som innehåller tabellerna den listar, en per rad, namngivna på samma sätt som i en `Ref`. Dess `[color: ...]` blir gruppens färg enligt samma regel som `headercolor`, och dess notering och övriga inställningar tas bort. En tabell som listas av två grupper stannar i den första. En grupp som blir utan tabeller skapas inte, vare sig den inte listar någon tabell som filen deklarerar eller bara tabeller som en tidigare grupp redan har tagit. Gruppens ruta anpassas runt dess tabeller var de än placeras, och när tabellerna ställs upp i rader hålls en grupps tabeller ihop.  
Filnamnet måste sluta på `.dbml`.

### AML {#aml}

Du kan importera en AML-fil (Azimutt Markup Language). Både det nuvarande skrivsättet och det äldre v1-skrivsättet godtas.  
Entiteter blir tabeller, och nästlade attribut plattas ut till ett kolumnnamn med punkter som `settings.slug`.  
Attribut är `NOT NULL` om de inte är märkta med `nullable`, och konstruktioner som editorn saknar plats för, som `check`, `type` och `tags`, tas bort i stället för att avvisas. En entitet som är märkt som vy importeras som en vanlig tabell.  
En entitets `color`, som i `users {color: red}`, blir dess tabells färg. Färgnamnen i AML, `red`, `orange`, `amber`, `yellow`, `lime`, `green`, `emerald`, `teal`, `cyan`, `sky`, `blue`, `indigo`, `violet`, `purple`, `fuchsia`, `pink`, `rose` och `gray`, läses oavsett skiftläge, med eller utan citattecken, vart och ett som nyans 500 av Tailwind-färgen med det namnet, till exempel `#ef4444` för `red`. Ett hexvärde inom citattecken som `"#3498db"` behålls som det skrivits; ett `#3498db` utan citattecken kan inte läsas, eftersom `#` inleder en AML-kommentar. Alla andra värden, och en `color` på ett attribut eller en relation, tas bort.  
En fristående sats med `rel`, eller `fk` i det äldre skrivsättet, behåller sina egenskaper `onDelete` och `onUpdate` som relationens `On Delete` och `On Update`, som i `rel posts(user_id) -> users(id) {onDelete: cascade, onUpdate: "set null"}`. Värdena är `cascade`, `restrict`, `set null`, `set default` och `no action`, med eller utan citattecken, oavsett skiftläge. Övriga egenskaper tas bort.  
På en infogad relation som `user_id int -> users(id) {onDelete: cascade}` hör egenskaperna till attributet, så de tas bort och relationen importeras som `Not set`.  
Filnamnet måste sluta på `.aml`.

GraphQL, DBML och AML fungerar i båda riktningarna: vart och ett är också ett mål i [kodgeneratorn](./code-generator.md).  
DBML och AML för över varje relations ON DELETE och ON UPDATE i båda riktningarna – se [Kodgenerator](./code-generator.md#on-delete-and-on-update). GraphQL för inte över någon av dem, så en GraphQL-import lämnar båda som `Not set`.  
DBML för också över tabellfärger, utan eventuell transparens, och varje tabellgrupp som innehåller en tabell, i båda riktningarna. En grupp utan namn kommer tillbaka som `group_1`, `group_2` och så vidare, och ett upprepat gruppnamn kommer tillbaka med `_2`, `_3` och så vidare tillagt. AML för bara över en tabellfärg som det närmaste av sina färgnamn, så `#FF8800` skrivs som `orange` och kommer tillbaka som `#f97316`, och det för inte över några grupper. GraphQL för över varken färger eller grupper.  
Inget av de tre för över logiska namn, domänkopplingar eller ordlistorna, i någon riktning: kodgeneratorn skriver varje tabells och kolumns fysiska namn och datatyp, aldrig ett logiskt namn eller en domän.

## Exportera {#exporting}

Undermenyn `Export` i arbetsytans snabbmeny har tre alternativ:

- json: Sparar diagrammet så som dess fil innehåller det, som `.erd.json`: tabellerna med deras kolumner och index, relationerna, anteckningarna och tabellgrupperna, de logiska namnen och kolumnernas domänkopplingar, orden, termerna och domänerna på fliken [Ordlista](./dictionary.md) samt inställningarna, varje [låst inställning](./settings.md#lock) med sitt låsta värde. Det som inte innehåller något, som tom text eller en tom rad i en ordlista, utelämnas – se [Lagringsform och körtidsvärde](../../api/advanced/schema.md#storage-form-and-runtime-value).
- Schema SQL: Öppnar fliken [Schema SQL](./schema-sql.md#saving-or-copying-the-sql) med dess alternativpanel öppen och dess knapp `Save file` i fokus, så att ett tryck på `Enter` sparar den SQL-kod som fliken visar som en `.sql`-fil. Ingenting sparas innan dess.
- Image: Öppnar dialogrutan `Export image`, som sparar diagrammet som `.png` eller `.svg` eller kopierar det till Urklipp som PNG – se [Bild](#image).

Alla tre fungerar i en skrivskyddad editor, där `Export` är en av de få rader som snabbmenyn för arbetsytan behåller. Där skriver json de inställningar som filen innehåller, inte vyn, fliken, namnvisningen, databasen, kodinställningarna eller de växlar under `View Option` som ändrats bara på den skärmen – se [Skrivskyddade editorer](./settings.md#read-only-editors) i Inställningar.  
`Export CSV` på fliken Ordlista, som inte finns i den här undermenyn, sparar bladet `Domains`, `Words` eller `Terms` som en CSV-fil. Till skillnad från de här tre erbjuds den inte i en skrivskyddad editor – se [Importera och exportera CSV](./dictionary.md#importing-and-exporting-csv).

Schema SQL skriver varje relations ON DELETE och ON UPDATE efter dess `REFERENCES`, med ON DELETE först. `Not set` skriver ingenting, och en åtgärd som den valda databasen inte godtar utelämnas. Se [Redigera relationer](./relationship-editing.md#on-delete-and-on-update) för vilken databas som godtar vilken åtgärd.

Varje exporterad fil får namnet `<database name>-<timestamp>` följt av sin filändelse, med tidsstämpeln i lokal tid formaterad som `yyyy-MM-dd'T'HH_mm_ss` – till exempel `my-schema-2026-08-29T04_05_06.erd.json`. Ett tomt databasnamn ersätts med `unnamed`.  
Knapparna `Save file` på fliken Schema SQL och i [kodgeneratorn](./code-generator.md) namnger sina filer på samma sätt, och det gör även `Export CSV`, som lägger till bladet efter tidsstämpeln: `-words.csv`, `-terms.csv` eller `-domains.csv`. En bild får databasnamnet så som det var när dialogrutan öppnades.

`Import`, `Import and Add` och `Export` finns också i [snabbsökningen](./quick-search.md) på ERD-fliken, med samma alternativ som i arbetsytans snabbmeny.

I Obsidian visas ingen dialogruta för nedladdning eller sparande: filen skrivs till valvet, där Obsidian lägger nya bilagor för det diagrammet, och ett meddelande anger dess sökväg.  
Tecken som Obsidian inte tillåter i ett filnamn, `\ / : * ? " < > |`, ersätts med `-`.  
Filutforskaren i Obsidian listar en exporterad `.erd.json`- eller `.sql`-fil bara medan Settings → Files and links → Detect all file extensions är på.

### Bild {#image}

`Export` ▸ `Image`, i arbetsytans snabbmeny eller i snabbsökningen, öppnar dialogrutan `Export image`: en förhandsgranskning av bilden bredvid dess alternativ. Om [utforskaren](./explorer.md#dialogs-beside-it) är öppen förblir den öppen under det nedtonade området.

![Export > Image öppnas, mörkt läge och bakgrunden slås av, 3x väljs och bilden kopieras till Urklipp](/img/demo-export.webp)

- `Background`: På som standard. När den är av blir arbetsytan transparent.
- `Dark mode`: Matchar från början editorns utseende. Så länge inställningen matchar utseendet på skärmen får bilden arbetsytans egna färger, inklusive ändringar från [temaverktyget](./language-and-theme.md); det andra utseendet använder den förinställning som har samma gråton och accentfärg.
- `Scale`: `1x`, `2x` eller `3x`, med `2x` valt som standard. Den anger bara storleken på PNG-bilden och på kopian i Urklipp, och raden under den visar den storleken, som `PNG <width> × <height> px`.

Valen behålls tills editorn stängs och sparas aldrig i dokumentet. Förhandsgranskningen ritas på samma sätt som bilden och ritas om när `Background` eller `Dark mode` ändras.

Bilden innehåller diagrammet som det såg ut när dialogrutan öppnades; stäng och öppna dialogrutan igen för att få med senare ändringar. Dess tabeller och kolumner namnges i den namnvisning som editorn visade då, även en som du bara har bytt till på din egen skärm medan låset `Name View` behåller en annan i filen – se [Utanför arbetsytan](./logical-names.md#beyond-the-canvas). De färger som [ordlistornas kontroller](./dictionary.md#marks-on-the-canvas) ger namn på arbetsytan ritas inte. Den innehåller hela diagrammet oavsett hur långt bort från det vyn har rullats, beskuret till det som diagrammet ritar plus en marginal, och den ritas alltid i 100 %, oavsett vilken zoomnivå editorn visar, så att varje tabell ritas i sin helhet. Det som [visningsalternativen](./table-related-functions.md#table-view-options) döljer – relationer, deras etiketter för ON DELETE och ON UPDATE, tabellgrupper eller anteckningar – varken ritas eller får plats, och tabellgrupper ritas bakom allt annat.

Tre knappar skriver bilden, och var och en lämnar dialogrutan öppen:

- `PNG`: Sparar en `.png` med diagrammets storlek i 100 % gånger `Scale`. En PNG-bild som är för stor för en canvas i webbläsaren skrivs med lägre upplösning i stället för att misslyckas: dialogrutan varnar i förväg med `Reduced from <width> × <height> px, past what a browser canvas can hold`, och meddelandet `Exported at a reduced resolution` talar om det efteråt.
- `SVG`: Sparar en `.svg` med diagrammets storlek i 100 %, oavsett `Scale`, och aldrig med lägre upplösning. Dess text förblir text och dess teckensnitt anges med namn i stället för att bäddas in, så ett visningsprogram utan editorns teckensnitt ritar med ett annat. Skuggor utelämnas.
- `Copy to clipboard`: Lägger en PNG-bild i Urklipp med den skala som har valts i `Scale`, med lägre upplösning på samma sätt som en sparad PNG-bild när en canvas i webbläsaren inte rymmer den. Den bekräftar med `Copied the image to the clipboard` eller med `Copied at a reduced resolution` när bilden fick lägre upplösning. Om kopieringen misslyckas, för att webbläsaren eller värdprogrammet nekar åtkomst till Urklipp eller för att bilden inte kunde ritas, föreslår `Couldn't copy the image` att du sparar en PNG-bild i stället.

Bilden ritas i en worker i bakgrunden där värdprogrammet kör en, så editorn förblir användbar under tiden. Meddelandet `Exporting PNG`, `Exporting SVG` eller `Copying image` visas när det tar längre tid än ett ögonblick, och ett fel rapporteras som `Couldn't export the PNG` eller `Couldn't export the SVG`. Om du stänger dialogrutan medan en fil fortfarande ritas hindrar det inte att filen sparas.

`PNG` har fokus när dialogrutan öppnas, och `Tab` stannar inom dialogrutan. `Escape`, knappen `x` eller ett klick på det nedtonade området runt den stänger den.  
Medan den är öppen gör arbetsytans kortkommandon ingenting, inklusive ångra och göra om, och inte heller kopiera och klistra in. `Ctrl + K` (Windows/Linux) eller `⌘ + K` (Mac) stänger den och öppnar snabbsökningen. `Ctrl + F` (Windows/Linux) eller `⌘ + F` (Mac) stänger den och placerar textmarkören i sökfältet i [utforskaren](./explorer.md#opening-and-closing), och öppnar utforskaren om den är stängd, men stänger den aldrig. I en editor som är för smal för att visa utforskaren stänger kortkommandot ändå dialogrutan men visar ett meddelande i stället för att flytta textmarkören.
