---
sidebar_position: 2
description: Import JSON, schémy SQL, GraphQL, DBML alebo AML namiesto diagramu alebo pod neho a export JSON, schémy SQL alebo diagramu ako obrázka PNG či SVG.
---

# Import a export súborov

## Import externých súborov {#importing-external-files}

Z podponuky `Import` v kontextovej ponuke plátna možno importovať päť formátov:

- json
- Schema SQL
- GraphQL
- DBML
- AML

Položka `Import and Add` hneď pod položkou `Import` pridá súbor do diagramu namiesto toho, aby ho nahradila – pozrite si časť [Importovať a pridať](#import-and-add).  
Uvítacia obrazovka, ktorú zobrazuje prázdny diagram, má riadok `Import` s rovnakými piatimi formátmi – pozrite si časť [Uvítacia obrazovka](./editing-start.md#welcome-screen).  
Hárky karty [Slovník](./dictionary.md) tiež preberajú slová, termíny a domény zo súborov CSV pomocou vlastného tlačidla `Import CSV` tejto karty – pozrite si časť [Import a export CSV](./dictionary.md#importing-and-exporting-csv).

Prípony sa porovnávajú bez ohľadu na veľkosť písmen. Ak vyberiete súbor, ktorého prípona nezodpovedá zvolenému formátu, import sa zruší a zobrazí sa hlásenie `Only <format> files can be imported`, pričom formát je zapísaný ako `json`, `sql`, `graphql`, `dbml` alebo `aml`, napríklad `Only sql files can be imported`.

Položka `Import` nahradí aktuálny dokument namiesto toho, aby doň obsah zlúčila, a jedno vrátenie späť obnoví predchádzajúci diagram.  
Súbor JSON so sebou prináša vlastné nastavenia vrátane [zamknutí](./settings.md#lock). Ak súbor zamyká kartu, jazyk na karte Generátor kódu, niektorý štýl názvov, typ úvodzoviek alebo [Zobrazenie názvov](./logical-names.md#name-view), naďalej vidíte to, čo ste mali, ale uloží sa zamknutá hodnota zo súboru. Priblíženie a poloha zobrazenia sa nastavia tak, ako ich určuje súbor, či už sú zamknuté, alebo nie. Súbor JSON uložený pred zavedením zamknutí sa načíta so všetkými zamknutiami zapnutými a s priblížením zobrazenia 100 %. Súbor uložený pred zavedením zamknutia `Name View` sa načíta s týmto zamknutím zapnutým bez ohľadu na to, aké iné zamknutia zaznamenáva.  
Ostatné formáty zachovajú nastavenia, ktoré už máte, vrátane zamknutí, okrem zobrazenia, ktoré začína s priblížením 100 %.  
Parsery GraphQL, DBML a AML nikdy nezlyhajú: zo súboru, ktorý nedokážu prečítať, vznikne namiesto chyby prázdny diagram.

Súbor JSON prináša aj logické názvy svojich tabuliek a stĺpcov a prepojenia svojich stĺpcov s doménami. Jeho slová, termíny a domény nahradia slová, termíny a domény na karte [Slovník](./dictionary.md), takže súbor, ktorý žiadne neobsahuje, nechá hárky prázdne, a vrátenie importu späť obnoví tie, ktoré nahradil.  
Ostatné formáty nič z toho neobsahujú. Ich tabuľky sa načítajú bez logických názvov a bez stĺpcov prepojených s doménou a vaše slová, termíny a domény zostanú tak, ako sú. Vrátenie späť alebo opätovné vykonanie importu ich tiež ponechá tak, ako sú, takže úprava slovníka vykonaná po importe sa zachová. Takýto import tiež ponechá vlastnú históriu zmien každého hárka tak, ako je, zatiaľ čo import JSON tieto histórie vyprázdni – pozrite si časť [Hárky karty Slovník](./undo-redo.md#dictionary-sheets).

Súbor JSON si zachová pozície, ktoré obsahuje. Tabuľky zo súboru Schéma SQL, GraphQL, DBML alebo AML sa umiestnia ešte predtým, ako sa diagram zmení, a to so šírkami, ktoré majú v [Zobrazení názvov](./logical-names.md#beyond-the-canvas), ktoré práve máte:

- Ak má súbor dve alebo viac tabuliek a aspoň jeden vzťah, rozložia sa pomocou [automatického rozloženia](./table-related-functions.md#auto-layout) `Flow` zľava doprava pozdĺž vzťahov, od ľavého horného rohu plátna. Počíta sa aj vzťah tabuľky so sebou samou.
- V opačnom prípade sa usporiadajú do riadkov od ľavého horného rohu, pričom ako prvé idú tabuľky s najmenším počtom stĺpcov.
- Ak rozloženie trvá dlhšie ako 6 sekúnd, zobrazí sa upozornenie `Placing tables` s tlačidlom `Cancel`. Tlačidlo `Cancel` alebo kláves `Escape` stlačený počas zobrazenia upozornenia rozloženie preruší a tabuľky namiesto toho usporiada do riadkov. Riadky sa bez upozornenia použijú aj vtedy, keď rozloženie zlyhá, keď sa do 60 sekúnd nevráti žiadne rozloženie alebo keď hostiteľ nespúšťa žiadny shared worker – pozrite si časť [Web Workers](../../api/installation.md#web-workers).

Diagram sa potom nahradí v jednom kroku, takže sa medzitým nič nezobrazí. Nastavenie, ktoré zmeníte počas umiestňovania tabuliek, napríklad karta, sa zachová, a ak medzitým importujete ďalší súbor, platí import, ktorý sa spustil ako posledný.

Editor iba na čítanie nič neimportuje. Jeho kontextová ponuka plátna a rýchle vyhľadávanie neponúkajú ani `Import`, ani `Import and Add`, nezobrazuje uvítaciu obrazovku a karta Slovník neponúka `Import CSV`.

### Importovať a pridať {#import-and-add}

Položka `Import and Add` zachová diagram a pridá súbor pod neho. Nachádza sa v kontextovej ponuke plátna a v [rýchlom vyhľadávaní](./quick-search.md) na karte ERD a ponúka tých istých päť formátov s rovnakou kontrolou prípony ako položka `Import`.

![Pridanie súboru SQL cez Import and Add > Schema SQL, umiestnenie jeho tabuliek pod diagram, ich rozloženie pozdĺž vzťahov a výber](/img/demo-import-and-add.webp)

Súbor sa načíta rovnako ako pri prilepení: všetky tabuľky, stĺpce, vzťahy, indexy, poznámky a [skupiny tabuliek](./table-groups.md), ktoré obsahuje, sa pridajú ako nové, tabuľky, ktoré už sú v diagrame, sa nepohnú a žiadne nastavenie sa nezmení, takže nastavenia súboru JSON sa vynechajú.  
Tabuľky a stĺpce súboru JSON si ponechajú svoje logické názvy a každý fyzický názov naďalej patrí slovníkom alebo je vlastný tak, ako to bolo v súbore, čo rozhoduje o tom, či logický názov zapísaný neskôr odvodí nový – pozrite si časť [Odvodzovanie fyzických názvov](./dictionary.md#deriving-physical-names). Slová, termíny a domény súboru sa vynechajú, takže karta Slovník zostane taká, aká bola, a žiadny pridaný stĺpec nie je prepojený s doménou: každý si ponechá typ údajov, ktorý má.  
Tabuľka, ktorej názov už diagram obsahuje, sa pridá ako druhá tabuľka s týmto názvom a nezlúči sa s existujúcou. Vzťahy a indexy pochádzajú iba zo súboru, takže cudzí kľúč odkazujúci na tabuľku, ktorú súbor nedefinuje, sa neprepojí s tabuľkou, ktorá už je v diagrame.

Pridaný blok sa umiestni tesne pod všetko, čo diagram obsahuje, zarovnaný s jeho ľavým okrajom, alebo do ľavého horného rohu prázdneho diagramu. Započítajú sa aj poznámky a skupiny tabuliek skryté v ponuke [Možnosti zobrazenia](./table-related-functions.md#table-view-options), pretože na svojom mieste stále sú.  
V rámci bloku si súbor JSON zachová vlastné usporiadanie vrátane skupín tabuliek. Ostatné formáty sa umiestnia rovnako ako pri položke `Import`, pomocou `Flow` alebo do riadkov podľa rovnakých pravidiel, a rámec každej skupiny tabuliek sa prispôsobí jej tabuľkám. Pridané tabuľky a poznámky sa v poradí prekrývania ocitnú nad všetkým, čo už tam je.

Keď sa blok umiestni, vyberie sa iba to, čo sa pridalo: nové tabuľky a k nim nové poznámky a skupiny tabuliek, pokiaľ sú zobrazené. Ak ste medzitým prešli na inú kartu, editor sa pred umiestnením bloku prepne späť na kartu ERD. Zobrazenie sa potom pri aktuálnom priblížení posunie na blok, pokiaľ už nie je dobre viditeľný – pozrite si časť [Kam vedie skok](./table-related-functions.md#where-a-jump-lands). Jedno vrátenie späť zruší celé pridanie.  
Súbor, ktorý parser nedokáže prečítať, alebo súbor bez tabuľky a bez poznámky nepridá nič.

Viaceré súbory Schéma SQL, GraphQL, DBML alebo AML pridané v čase, keď sa jeden ešte umiestňuje, sa umiestnia všetky, a to v poradí, v akom sa spustili. Súbor JSON pridaný medzitým sa umiestni hneď po prečítaní, ešte pred nimi. Položka `Import` alebo načítanie iného dokumentu zahodí všetky, ktoré sa ešte umiestňujú.

Programovací agenti pridávajú súbor rovnakým spôsobom pomocou režimu `append` nástrojov MCP na import, ktorý zachová usporiadanie súboru JSON, ale tabuľky ostatných formátov usporiada do riadkov, nikdy nie pomocou `Flow` – pozrite si časť [Import](../../mcp/tools.md#import).

### JSON {#json}

Môžete importovať súbory vo [formáte schémy definovanom v editore](../../api/advanced/schema.md).
Názov súboru musí končiť na `.json`, takže súbor exportovaný ako `<database name>-<timestamp>.erd.json` sa importuje späť tak, ako je; súbor iba s príponou `.erd` alebo `.vuerd` sa tu neprijme. Načítajú sa aj súbory uložené staršími verziami.

![Import uloženého súboru cez Import > json a nahradenie rozpracovaného dokumentu spolu s jeho nastaveniami](/img/demo-import-json.webp)

### Schéma SQL {#schema-sql}

Môžete importovať aj súbory schémy definované v SQL.  
Hoci sú parsery navrhnuté čo najflexibilnejšie bez ohľadu na databázový systém, niektorá syntax nemusí byť podporovaná.  
Názov súboru musí končiť na `.sql`.  
[Podporovanú syntax si môžete pozrieť tu.](https://github.com/dineug/erd-editor/tree/main/packages/schema-sql-parser)

![Import súboru SQL cez Import > Schema SQL, rozloženie jeho tabuliek pozdĺž vzťahov a následné oddialenie zobrazenia nad nimi](/img/demo-import-sql.webp)

Stĺpce sa načítavajú iba z príkazu `CREATE TABLE`. Stĺpec pridaný príkazom `ALTER TABLE ... ADD COLUMN` sa nenačíta.  
Položky príkazu `CREATE TABLE`, ktoré nie sú stĺpcami, sa preskočia, namiesto aby sa načítali ako stĺpce: nepomenovaná klauzula `CHECK (...)`, `LIKE` a `EXCLUDE` v PostgreSQL, `FULLTEXT` a `SPATIAL` v MySQL zapísané bez `INDEX` alebo `KEY`, `PERIOD FOR` v T-SQL a `SUPPLEMENTAL LOG DATA` v Oracle.  
Stĺpec pomenovaný podľa niektorej z nich sa napriek tomu importuje, ak za názvom nasleduje vstavaný typ, ako v `exclude BOOLEAN`, alebo ak je názov v úvodzovkách, ako v `"check" int`. Slovo `like` bez úvodzoviek, za ktorým nasleduje typ, ktorý nie je vstavaný, napríklad `like citext`, sa načíta ako `LIKE` z PostgreSQL a preskočí sa.  
Samotné obmedzenia `CHECK` sa neimportujú, pretože editor ich nemá kde uchovávať.

#### Typy údajov {#data-types}

Typ údajov stĺpca sa zachová vrátane zoznamu argumentov, aj keď nejde o vstavaný typ žiadnej [podporovanej databázy](./table-related-functions.md#databases).  
To zahŕňa enumeračný alebo zložený typ vytvorený pomocou `CREATE TYPE`, doménu vytvorenú pomocou `CREATE DOMAIN`, typy z rozšírení, napríklad `hstore`, `citext` a `ltree`, názvy so schémou, napríklad `public.mood`, a názvy v úvodzovkách alebo hranatých zátvorkách, napríklad `"MyType"` a `[dbo].[Phone]`, ktoré si úvodzovky alebo zátvorky zachovajú. Samotné príkazy `CREATE TYPE`, `CREATE DOMAIN` a `CREATE EXTENSION` sa preskočia.  
Vstavaný typ úvodzovky alebo zátvorky stratí, takže `[int]` sa načíta ako `int` a `[nvarchar](50)` ako `nvarchar(50)`. Typy `"char"` a `"bit"` v PostgreSQL si ich zachovajú, pretože ide o iné typy ako `char` a `bit`.  
Prípony polí zostávajú pri každom type: `integer[]`, `text[3][3]`, `integer ARRAY`, `mood[]`. Typ `UNSIGNED BIG INT` v SQLite sa načíta celý.  
Modifikátory `UNSIGNED` a `ZEROFILL` z MySQL a MariaDB zapísané hneď za typom a jeho argumentmi zostávajú súčasťou typu tak, ako sú zapísané: `INT UNSIGNED`, `SMALLINT(5) UNSIGNED ZEROFILL`, `int unsigned` z nástroja mysqldump. Predvolený modifikátor `SIGNED` sa vynechá, takže `TINYINT SIGNED` sa načíta ako `TINYINT`. Modifikátor zapísaný za inou voľbou stĺpca, ako v zápise `INT NOT NULL UNSIGNED`, ktorý MySQL odmietne, sa vynechá.  
Hodnoty `ENUM(...)` a `SET(...)` si zachovajú úvodzovky, pričom úvodzovka vo vnútri hodnoty je zdvojená, ako v `ENUM('a','it''s')`. Zápis `'it\'s'` so spätnou lomkou z MySQL sa načíta rovnako zdvojený. V type `STRUCT<...>` v Databricks si názvy polí v úvodzovkách a klauzula `COMMENT` poľa zachovajú úvodzovky.  
Stĺpec zapísaný bez typu, napríklad stĺpec bez typu v SQLite alebo vypočítaný stĺpec `AS`, zostane bez typu: ako typ sa nenačíta kľúčové slovo ako `NOT`, `NULL`, `DEFAULT`, `PRIMARY` alebo `REFERENCES` ani reťazec v jednoduchých úvodzovkách.

#### Predvolené hodnoty {#defaults}

Klauzula `DEFAULT` stĺpca si zachová celý výraz, napríklad `now()`, `0.5`, `CURRENT_TIMESTAMP` alebo `ARRAY[]::text[]`, až po ďalšiu voľbu stĺpca, čiarku alebo uzatváraciu zátvorku. Výraz `CASE ... END` sa načíta celý.  
Zátvorky okolo celého výrazu sa odstránia, takže `((0))` v SQL Server sa načíta ako `0` a `(getdate())` ako `getdate()`. Odstráni sa aj pretypovanie literálu, takže `'draft'::character varying` z nástroja pg_dump sa načíta ako `'draft'` a `NULL::character varying` ako `NULL`; ostatné pretypovania zostanú, ako v `ARRAY[]::text[]` a `lower('A'::text)`.  
Klauzula `ON UPDATE CURRENT_TIMESTAMP` z MySQL sa vynechá, pretože stĺpec pre ňu nemá miesto, a predvolená hodnota pred ňou zostane. Zápis `DEFAULT ON NULL 0` z Oracle, s `FOR INSERT ONLY` alebo `FOR INSERT AND UPDATE` aj bez nich, sa načíta ako `0`.  
Reťazec s predponou, napríklad `N'x'`, `E'x'`, `B'0'`, `X'ff'`, `U&'x'` alebo `_utf8mb4'x'`, sa načíta ako jeden reťazec, aj keď obsahuje zátvorku.

SQL Server Management Studio zapisuje predvolené hodnoty do skriptu až za tabuľky, ako `ALTER TABLE [dbo].[t] ADD CONSTRAINT [DF_x] DEFAULT ((1)) FOR [col]`. Takýto príkaz nastaví predvolenú hodnotu daného stĺpca, tu `1`, a názov jeho obmedzenia sa vynechá.

Export Schéma SQL vráti zátvorky tam, kde databáza číta výraz predvolenej hodnoty iba v zátvorkách – pozrite si časť [Predvolené hodnoty](./schema-sql.md#defaults).

#### Automatický prírastok {#auto-increment}

Kľúčové slová `AUTO_INCREMENT`, `AUTOINCREMENT` a `IDENTITY` zapnú príznak `Auto Increment` stĺpca a rovnako aj `GENERATED ALWAYS AS IDENTITY` a `GENERATED BY DEFAULT AS IDENTITY`, ktoré po sebe nenechajú žiadnu predvolenú hodnotu.  
Rovnaký účinok má predvolená hodnota, ktorá je jediným volaním `nextval()` v PostgreSQL, teda predvolená hodnota, ktorú dostane stĺpec typu serial, zapísaná ako `nextval('s')` alebo v tvare, ktorý používa pg_dump, `nextval('s'::regclass)`. Názov sekvencie sa nezachová. Predvolená hodnota, ktorá sekvenciu iba používa, napríklad `nextval('s') + 1` alebo `NEXT VALUE FOR s` v SQL Server, zostane obyčajnou predvolenou hodnotou.  
Nástroj pg_dump zapisuje obe až za tabuľky, ako `ALTER TABLE [ONLY] t ALTER [COLUMN] c SET DEFAULT nextval('s'::regclass)` a `ALTER TABLE t ALTER [COLUMN] c ADD GENERATED ... AS IDENTITY`. Každý z týchto príkazov zapne príznak `Auto Increment` daného stĺpca a vymaže jeho predvolenú hodnotu. `CREATE SEQUENCE`, `ALTER SEQUENCE` a každá iná akcia `ALTER COLUMN` sa preskočia.  
Stĺpec, ktorého typ je priamo zapísaný ako `serial`, `bigserial` alebo `smallserial`, si tento typ zachová a príznak `Auto Increment` zostane vypnutý.

Editor uchováva iba príznak `Auto Increment` a každá databáza pri exporte zapíše vlastnú formu – pozrite si časť [Automatický prírastok](./schema-sql.md#auto-increment). Export pre PostgreSQL zapíše `GENERATED ALWAYS AS IDENTITY` pri stĺpci typu `smallint`, `integer` alebo `bigint` bez ohľadu na to, ktorá forma sa importovala, a pri akomkoľvek inom type, napríklad `INT UNSIGNED`, iba riadok s komentárom za tabuľkou. Voľby sekvencie, napríklad `START WITH 100`, sa stratia.  
Tabuľka s viacerými stĺpcami typu serial alebo identity sa importuje s viacerými stĺpcami s automatickým prírastkom a MySQL, MariaDB a SQL Server takúto tabuľku pri spustení jej exportu odmietnu.

#### Primárne kľúče {#primary-keys}

Primárny kľúč pridaný až za svojou tabuľkou, `ALTER TABLE t ADD [CONSTRAINT n] PRIMARY KEY (...)`, označí svoje stĺpce ako primárny kľúč.  
`CLUSTERED` alebo `NONCLUSTERED` v SQL Server a `USING BTREE` v MySQL pred zoznamom stĺpcov sa pri čítaní obídu, takže príkaz `ALTER TABLE [dbo].[Users] ADD CONSTRAINT [PK_Users] PRIMARY KEY CLUSTERED ([Id] ASC) WITH (...) ON [PRIMARY]`, ktorý generuje SQL Server Management Studio, vytvorí kľúč nad stĺpcom `Id`. Zápis `PRIMARY KEY NONCLUSTERED HASH (...)` tabuľky optimalizovanej pre pamäť sa nenačíta, ani v `ALTER TABLE`, ani v `CREATE TABLE`.

#### Jedinečné kľúče a indexy {#unique-keys-and-indexes}

Obmedzenie `UNIQUE` nad dvoma alebo viacerými stĺpcami sa v každom zápise stane jedným jedinečným indexom: `UNIQUE (a, b)`, `UNIQUE KEY n (a, b)`, `UNIQUE INDEX n (a, b)`, `CONSTRAINT n UNIQUE (a, b)`, vložený zápis `INDEX n UNIQUE (a, b)` v SQL Server a `ALTER TABLE t ADD [CONSTRAINT n] UNIQUE (a, b)`.  
Index prevezme názov indexu kľúča, inak jeho názov z `CONSTRAINT`, inak nedostane žiadny názov, a zachová smer zoradenia každého stĺpca. Takýto index je [alternatívnym kľúčom](./table-related-functions.md#alternate-keys).  
Obmedzenie `UNIQUE` nad jedným stĺpcom v ktoromkoľvek z týchto zápisov namiesto toho označí daný stĺpec ako Jedinečný a nepridá žiadny index, takže obmedzenie `UQ_<table name>_<column name>`, ktoré zapisuje export, sa vráti ako príznak, z ktorého bolo zapísané. `CREATE UNIQUE INDEX` nad jedným stĺpcom zostane jedinečným indexom.

Príkaz `ALTER TABLE`, ktorý pridáva viacero kľúčov naraz, ako ho phpMyAdmin zapisuje v tvare `ADD PRIMARY KEY (id), ADD UNIQUE KEY uq_a (a, b), ADD UNIQUE KEY uq_c (c)`, zachová všetky jedinečné kľúče, ktoré obsahuje: `uq_a` sa načíta ako jedinečný index s názvom `uq_a` a `uq_c` ako príznak Jedinečný stĺpca `c`. Názov z `CONSTRAINT` pomenúva iba kľúč vo vlastnej klauzule. Načítajú sa aj `ADD UNIQUE INDEX IF NOT EXISTS n (...)` z MariaDB a `ALTER TABLE t WITH CHECK ADD ...` a `WITH NOCHECK ADD ...` v SQL Server.  
Príkazy `CREATE INDEX` a `CREATE UNIQUE INDEX` sa načítajú s kvalifikovanými názvami, napríklad `public.t` a `[dbo].[t]`, s `CLUSTERED` a `NONCLUSTERED` v SQL Server, s `CONCURRENTLY`, `IF NOT EXISTS`, `ON ONLY` a `USING btree` v PostgreSQL a aj úplne bez názvu indexu. Skupina súborov `ON [PRIMARY]` v SQL Server sa ignoruje.  
Voľby kľúča, napríklad `NULLS NOT DISTINCT` alebo `USING BTREE`, sa nezamieňajú s názvom kľúča. V zozname stĺpcov kľúča pomenúva stĺpec iba prvé slovo, takže `b DESC NULLS LAST`, `b text_pattern_ops` aj `b COLLATE "C"` vytvoria kľúč nad stĺpcom `b`, pričom `DESC` sa zachová ako jeho smer zoradenia. Dĺžka predpony, napríklad `email(191)`, sa pri čítaní obíde, ale kľúč s časťou tvorenou výrazom, napríklad `lower(email)`, sa preskočí celý.

Čiastočný jedinečný index, `CREATE UNIQUE INDEX ... WHERE ...` alebo vložený zápis `INDEX n UNIQUE (...) WHERE ...` v SQL Server, sa načíta ako obyčajný index s rovnakým názvom a stĺpcami, pretože kľúč jedinečný v celej tabuľke by bol prísnejší ako filtrovaný kľúč, ktorý deklaruje súbor. Výnimkou je filter tvorený iba testami `IS NOT NULL` na stĺpcoch kľúča spojenými pomocou `AND`, teda filter, ktorý SQL Server potrebuje na to, aby jedinečný stĺpec mohol obsahovať viac ako jednu hodnotu NULL: takýto kľúč zostane jedinečný.  
Jedinečný kľúč, ktorý uvádza stĺpec, ktorý tabuľka nemá, napríklad stĺpec pridaný príkazom `ALTER TABLE ... ADD COLUMN`, sa vynechá celý, namiesto aby sa zúžil na existujúce stĺpce. Obyčajný index si existujúce stĺpce zachová.

Nástroj SQL Developer od Oracle a `DBMS_METADATA` zapisujú vlastný index kľúča ako samostatný príkaz `CREATE UNIQUE INDEX` s názvom podľa kľúča alebo, pri kľúči bez názvu, za ktorým nasleduje `USING INDEX`, so systémovým názvom, napríklad `SYS_C0012345`. Import načíta takýto index, ako aj index, ktorý uvádza `ADD CONSTRAINT ... USING INDEX`, ako súčasť príslušného kľúča: zložený jedinečný kľúč sa načíta ako jeden jedinečný index a primárny kľúč alebo jedinečný kľúč nad jedným stĺpcom ako príznaky stĺpcov bez ďalšieho indexu. Export späť do Oracle potom vytvorí index iba raz.

Export Schéma SQL pre MySQL, MariaDB, MSSQL, Oracle, PostgreSQL a SQLite sa importuje späť s rovnakými príznakmi Jedinečný a indexmi.  
Snowflake nemá sekundárne indexy, takže jeho export vráti iba jedinečné kľúče: zložený ako jedinečný index a jednostĺpcový ako príznak Jedinečný daného stĺpca. Export pre Databricks nedeklaruje žiadnu jedinečnosť, takže sa nevráti žiadna.

#### Cudzie kľúče {#foreign-keys}

Cudzí kľúč sa stane vzťahom v týchto zápisoch:

- Zápis `FOREIGN KEY (...) REFERENCES t (...)` na úrovni tabuľky, s `CONSTRAINT name` alebo bez neho.
- `ALTER TABLE ... ADD [CONSTRAINT name] FOREIGN KEY (...) REFERENCES t (...)` vrátane `ALTER TABLE t WITH CHECK ADD ...` a `WITH NOCHECK ADD ...`, ktoré generuje SQL Server Management Studio.
- Vložený zápis `REFERENCES t (col)` v stĺpci, ako v `user_id INT REFERENCES users (id)`, a zápis `FOREIGN KEY REFERENCES t (col)`, ktorý na tomto mieste povoľujú SQL Server a Snowflake. Vložený odkaz na viac ako jeden stĺpec sa preskočí.

Príkaz `ALTER TABLE` vytvorí najviac jeden vzťah, a to iba vtedy, keď jeho prvá klauzula pridáva cudzí kľúč: klauzula `FOREIGN KEY` za klauzulou `ADD PRIMARY KEY` alebo `ADD UNIQUE` v tom istom príkaze sa nenačíta. Keď jeden príkaz pridáva viacero cudzích kľúčov, ako ich phpMyAdmin zapisuje v tvare `ADD CONSTRAINT fk1 FOREIGN KEY ..., ADD CONSTRAINT fk2 FOREIGN KEY ...`, načíta sa iba posledný.

Zápis `REFERENCES t` bez zoznamu stĺpcov odkazuje na primárny kľúč tabuľky `t`, ak tento kľúč tvorí jeden stĺpec. Pri zloženom primárnom kľúči sa cudzí kľúč preskočí.  
Cudzí kľúč sa preskočí a žiadny z jeho stĺpcov sa neoznačí ako cudzí kľúč, ak sa nenájde žiadny z jeho cieľových stĺpcov alebo ak sa počet nájdených stĺpcov v oboch tabuľkách líši, napríklad keď stĺpec chýba iba v jednej z nich. Keď v oboch tabuľkách chýba rovnaký počet jeho stĺpcov, nájdené stĺpce sa spárujú v poradí, v akom sú zapísané, a vzťah obsahuje iba tie.  
Každý importovaný vzťah je typu `Zero N` a je identifikujúci, keď je každý z jeho stĺpcov v podradenej tabuľke zároveň primárnym kľúčom.

Klauzuly `ON DELETE` a `ON UPDATE` každého cudzieho kľúča sa stanú nastaveniami `On Delete` a `On Update` vzťahu: `NO ACTION`, `RESTRICT`, `CASCADE`, `SET NULL` alebo `SET DEFAULT`, s ľubovoľnou veľkosťou písmen a v ľubovoľnom poradí. Cudzí kľúč bez nich sa importuje ako `Not set`. Informácie o ich nastavení v editore nájdete na stránke [Úprava vzťahov](./relationship-editing.md#on-delete-and-on-update).  
Zoznam stĺpcov za `SET NULL` alebo `SET DEFAULT` v PostgreSQL, ako v `ON DELETE SET NULL (a_id)`, sa pri čítaní obíde: akcia sa vzťahuje na celý kľúč a `ON UPDATE` za zoznamom sa napriek tomu načíta. `MATCH FULL`, `MATCH PARTIAL` a `MATCH SIMPLE` sa preskočia a atribút stĺpca `ON UPDATE CURRENT_TIMESTAMP` z MySQL sa nezamieňa s akciou.  
Export Schéma SQL sa importuje späť s akciami, ktoré daná databáza zapisuje, takže akcia, ktorú vynecháva, napríklad `SET DEFAULT` v MySQL, akékoľvek `ON UPDATE` v Oracle alebo čokoľvek okrem `NO ACTION` v Snowflake, sa vráti ako `Not set`.

#### Komentáre {#comments}

Komentáre tabuliek a stĺpcov sa importujú z troch syntaxí, ktoré parser číta: z voľby tabuľky a atribútu stĺpca `COMMENT`, ktoré používajú MySQL, MariaDB, Snowflake a Databricks, z príkazov `COMMENT ON TABLE` a `COMMENT ON COLUMN`, ktoré používajú PostgreSQL a Oracle, a z rozšírenej vlastnosti `MS_Description`, ktorú SQL Server nastavuje pomocou `EXEC sp_addextendedproperty`.  
Komentár, ktorý uvádza tabuľku alebo stĺpec, ktoré súbor nedefinuje, sa ignoruje.

Volania pre SQL Server sa načítajú s pomenovanými argumentmi, ako SQL Server Management Studio zapisuje do skriptu každý komentár (`@name=N'MS_Description', @value=N'...', ..., @level1type=N'TABLE', @level1name=N'Users'`), aj s pozičnými argumentmi, ako ich zapisuje export MSSQL v editore.  
Komentár vznikne iba z vlastnosti `MS_Description` na tabuľke alebo na niektorom z jej stĺpcov na úrovni 2. Komentár nevytvorí iná vlastnosť, pohľad, index ani obmedzenie a takisto ani komentár odovzdaný v premennej alebo zostavený pomocou `+`.

V komentári, rovnako ako v akomkoľvek texte v úvodzovkách, napríklad v hodnote `DEFAULT` alebo v názve v úvodzovkách, zdvojená úvodzovka znamená jednu úvodzovku, tak ako ju zapisujú mysqldump a pg_dump: `'it''s'` sa načíta ako `it's`.  
Spätná lomka pred úvodzovkou, ako MySQL a MariaDB zapisujú `'it\'s'`, takisto funguje ako únikový znak pre úvodzovku. Takáto úvodzovka však text stále ukončí, ak za ňou nasleduje prázdny znak, `,`, `;`, `)`, `]`, `:`, `|`, `+` alebo koniec súboru, takže `'C:\'`, `'C:\'::text` z nástroja pg_dump a `'C:\'+name` z T-SQL si spätnú lomku zachovajú.  
Hodnota `DEFAULT` si zachová úvodzovky a úvodzovka v nej sa zapíše späť zdvojená bez ohľadu na to, ako ju súbor ošetril: `'it''s'`.  
Keď je v čase importu databázou dokumentu Databricks, text v jednoduchých úvodzovkách sa namiesto toho riadi pravidlami platformy Spark: každá spätná lomka je únikovým znakom pre znak, ktorý za ňou nasleduje, takže `'C:\\dir'` sa načíta ako `C:\dir`, únikové sekvencie ako `\n`, `\t` a `\u0041` sa dekódujú a hodnota `DEFAULT` sa zachová ako `'it\'s'`.

Ako jednotlivé databázy pri exporte zapisujú komentár a ako v ňom ošetrujú úvodzovku, opisuje časť [Komentáre](./schema-sql.md#comments) na stránke Schéma SQL.  
Export pre MySQL, MariaDB, PostgreSQL, Oracle, Snowflake alebo MSSQL sa importuje späť ako tie isté komentáre tabuliek a stĺpcov vrátane úvodzoviek, s výnimkou prázdnych riadkov, ktoré export pre Oracle vynecháva. Export pre Databricks, ktorý ošetruje úvodzovku aj spätnú lomku spätnou lomkou, sa načíta späť presne iba vtedy, keď je vybratou databázou Databricks.  
Komentáre neprežijú export do SQLite a jeho spätný import: SQLite ich zapisuje ako obyčajné riadky `--`, ktoré parser nečíta.  
Okrem SQLite sa logický názov, ktorý prepínač `Write logical names into empty comments` zapísal do prázdneho komentára, importuje späť ako komentár danej tabuľky alebo stĺpca, nie ako ich logický názov – pozrite si časť [Logické názvy ako komentáre](./schema-sql.md#logical-names-as-comments).

### GraphQL {#graphql}

Môžete importovať dokument GraphQL SDL.  
Z definícií objektových typov sa stanú tabuľky, blok `extend type` sa zlúči s typom, ktorý rozširuje, a polia rozhraní zdedia typy, ktoré tieto rozhrania implementujú.  
Pole, ktorého typom je iná tabuľka, sa namiesto stĺpca stane vzťahom a zoznam na oboch stranách vytvorí väzobnú tabuľku.  
Pole s jednou hodnotou, napríklad `buyer: User`, sa najprv spáruje s tým jediným poľom druhého typu, ktorého názov končí reťazcom `By`, za ktorým nasleduje názov tohto poľa, napríklad `orderListByBuyer`, bez ohľadu na veľkosť písmen a podčiarkovníky; očíslované pole, napríklad `buyer2`, sa spáruje rovnako, bez svojho čísla. Presne takto pomenúva polia výstup GraphQL na karte Generátor kódu, keď dve tabuľky zdieľajú viac ako jeden vzťah alebo keď tabuľka odkazuje sama na seba, takže sa takýto výstup importuje späť so všetkými vzťahmi.  
Koreňové typy (`Query`, `Mutation`, `Subscription`), introspekčné typy a obaľovacie typy pre Relay, federáciu a Hasura, napríklad `PageInfo`, `*Connection`, `*Edge` a `*_aggregate`, sa považujú za šum a preskočia sa.  
Direktívy `@id`, `@primaryKey`, `@unique`, `@autoincrement`, `@default`, `@map`, `@relation`, `@column`, `@table`, `@index` a `@db.*` sa rešpektujú.  
Názov súboru musí končiť na `.graphql`, `.gql` alebo `.graphqls`. Súbor `schema.prisma` pre Prisma nie je dokument GraphQL a tu ho nemožno importovať.

### DBML {#dbml}

Môžete importovať súbor DBML, teda formát, ktorý používajú dbdiagram.io a dbdocs.  
Načítajú sa bloky `Table`, `TablePartial`, `Ref`, `Enum` a `TableGroup`. Bloky `Project` a samostatné bloky `Note` sa preskočia bez vplyvu na okolité tabuľky.  
Prijíma sa každý zápis odkazu: tvar s dvojbodkou `Ref:`, pomenovaný odkaz, blokový tvar `Ref { }` a vložené nastavenie stĺpca `[ref: > table.column]`.  
Odkaz `<>` typu mnoho k mnohým vytvorí väzobnú tabuľku pomenovanú podľa oboch strán.  
Nastavenia `delete` a `update` samostatného odkazu sa stanú nastaveniami `On Delete` a `On Update` vzťahu, ako v `Ref: users.id < posts.user_id [delete: cascade, update: set null]`. Hodnoty sú `cascade`, `restrict`, `set null`, `set default` a `no action` s ľubovoľnou veľkosťou písmen. Čokoľvek iné alebo chýbajúce nastavenie sa importuje ako `Not set` a ostatné nastavenia, napríklad `color`, sa ignorujú.  
Vložené nastavenie `[ref: ...]` neprenáša žiadne akcie a nastavenia odkazu `<>` sa na väzobnú tabuľku neprenesú. Keď je ten istý cudzí kľúč deklarovaný vložene aj ako samostatný odkaz, zachová sa vložený, bez akcií.  
Nastavenie `headercolor` tabuľky, ako v `Table users [headercolor: #3498DB]`, sa stane jej farbou, ak je hodnota hexadecimálny zápis `#rgb` alebo `#rrggbb` bez úvodzoviek. Akákoľvek iná hodnota sa vynechá a nastavenie `headercolor` bloku `TablePartial` sa neprenesie na tabuľky, ktoré ho používajú.  
Z každého bloku `TableGroup` sa stane [skupina tabuliek](./table-groups.md) obsahujúca tabuľky, ktoré uvádza po jednej na riadok s názvami zapísanými tak, ako ich zapisuje `Ref`. Jeho `[color: ...]` sa stane farbou skupiny podľa rovnakého pravidla ako `headercolor` a jeho popis a ostatné nastavenia sa vynechajú. Tabuľka uvedená v dvoch skupinách zostane v prvej. Skupina, ktorej nezostane žiadna tabuľka, sa nevytvorí, či už neuvádza žiadnu tabuľku, ktorú súbor deklaruje, alebo uvádza iba tabuľky, ktoré si už vzala skoršia skupina. Rámec skupiny sa prispôsobí jej tabuľkám, nech sú umiestnené kdekoľvek, a keď sa tabuľky usporiadajú do riadkov, tabuľky jednej skupiny zostanú spolu.  
Názov súboru musí končiť na `.dbml`.

### AML {#aml}

Môžete importovať súbor AML (Azimutt Markup Language). Prijíma sa aktuálny zápis aj starší zápis v1.  
Z entít sa stanú tabuľky a vnorené atribúty sa sploštia do názvu stĺpca s bodkami, napríklad `settings.slug`.  
Atribúty sú `NOT NULL`, pokiaľ nie sú označené ako `nullable`, a konštrukcie, pre ktoré editor nemá miesto, napríklad `check`, `type` a `tags`, sa vynechajú, namiesto aby sa odmietli. Entita označená ako pohľad sa načíta ako obyčajná tabuľka.  
Nastavenie `color` entity, ako v `users {color: red}`, sa stane farbou jej tabuľky. Názvy farieb AML, `red`, `orange`, `amber`, `yellow`, `lime`, `green`, `emerald`, `teal`, `cyan`, `sky`, `blue`, `indigo`, `violet`, `purple`, `fuchsia`, `pink`, `rose` a `gray`, sa načítajú s ľubovoľnou veľkosťou písmen, v úvodzovkách aj bez nich, každý ako odtieň 500 farby Tailwind s rovnakým názvom, napríklad `#ef4444` pre `red`. Hexadecimálna hodnota v úvodzovkách, napríklad `"#3498db"`, sa zachová tak, ako je zapísaná; zápis `#3498db` bez úvodzoviek sa načítať nedá, pretože `#` začína komentár AML. Akákoľvek iná hodnota a nastavenie `color` na atribúte alebo vzťahu sa vynechajú.  
Samostatný príkaz `rel`, v staršom zápise `fk`, zachová svoje vlastnosti `onDelete` a `onUpdate` ako nastavenia `On Delete` a `On Update` vzťahu, ako v `rel posts(user_id) -> users(id) {onDelete: cascade, onUpdate: "set null"}`. Hodnoty sú `cascade`, `restrict`, `set null`, `set default` a `no action`, v úvodzovkách aj bez nich, s ľubovoľnou veľkosťou písmen. Ostatné vlastnosti sa vynechajú.  
Pri vloženom vzťahu, napríklad `user_id int -> users(id) {onDelete: cascade}`, patria vlastnosti atribútu, takže sa vynechajú a vzťah sa importuje ako `Not set`.  
Názov súboru musí končiť na `.aml`.

GraphQL, DBML a AML sú obojsmerné formáty: každý z nich je aj cieľom na karte [Generátor kódu](./code-generator.md).  
DBML a AML prenášajú ON DELETE a ON UPDATE každého vzťahu oboma smermi – pozrite si stránku [Generátor kódu](./code-generator.md#on-delete-and-on-update). GraphQL neprenáša ani jedno, takže import GraphQL ponechá obe na hodnote `Not set`.  
DBML oboma smermi prenáša aj farby tabuliek, bez prípadnej priehľadnosti, a každú skupinu tabuliek, ktorá obsahuje nejakú tabuľku. Skupina bez názvu sa vráti ako `group_1`, `group_2` a tak ďalej a opakovaný názov skupiny sa vráti s pridaným `_2`, `_3` a tak ďalej. AML prenáša farbu tabuľky iba ako najbližší zo svojich názvov farieb, takže `#FF8800` sa zapíše ako `orange` a vráti sa ako `#f97316`, a neprenáša žiadne skupiny. GraphQL neprenáša farby ani skupiny.  
Žiadny z týchto troch formátov neprenáša logické názvy, prepojenia s doménami ani slovníky, a to v žiadnom smere: karta Generátor kódu zapisuje fyzický názov a typ údajov každej tabuľky a stĺpca, nikdy logický názov ani doménu.

## Export {#exporting}

Podponuka `Export` v kontextovej ponuke plátna má tri položky:

- json: Uloží diagram v podobe, v akej ho obsahuje jeho súbor, ako `.erd.json`: tabuľky s ich stĺpcami a indexmi, vzťahy, poznámky a skupiny tabuliek, logické názvy a prepojenia stĺpcov s doménami, slová, termíny a domény karty [Slovník](./dictionary.md) a nastavenia, pričom každé [zamknuté nastavenie](./settings.md#lock) má svoju zamknutú hodnotu. To, čo nič neobsahuje, napríklad prázdny text alebo prázdny riadok slovníka, sa vynechá – pozrite si časť [Úložná forma a hodnota za behu](../../api/advanced/schema.md#storage-form-and-runtime-value).
- Schema SQL: Otvorí kartu [Schéma SQL](./schema-sql.md#saving-or-copying-the-sql) s otvoreným panelom možností a s fokusom na tlačidle `Save file`, takže stlačením klávesu `Enter` sa kód SQL zobrazený na karte uloží ako `.sql`. Dovtedy sa nič neuloží.
- Image: Otvorí dialógové okno `Export image`, ktoré diagram uloží ako `.png` alebo `.svg` alebo ho skopíruje do schránky ako PNG – pozrite si časť [Obrázok](#image).

Všetky tri fungujú aj v editore iba na čítanie, kde je `Export` jedným z mála riadkov, ktoré si jeho ponuka plátna ponecháva. Json tam zapíše nastavenia, ktoré súbor uchováva, nie zobrazenie, kartu, Zobrazenie názvov, databázu, nastavenia kódu ani prepínače `View Option` zmenené iba na tejto obrazovke – pozrite si časť [Editory iba na čítanie](./settings.md#read-only-editors) v Nastaveniach.  
Vlastné tlačidlo `Export CSV` karty Slovník, ktoré v tejto podponuke nie je, uloží jej hárok `Domains`, `Words` alebo `Terms` ako súbor CSV. Na rozdiel od týchto troch položiek sa v editore iba na čítanie neponúka – pozrite si časť [Import a export CSV](./dictionary.md#importing-and-exporting-csv).

Schéma SQL zapisuje ON DELETE a ON UPDATE každého vzťahu za jeho `REFERENCES`, najprv ON DELETE. Hodnota `Not set` nezapíše nič a akcia, ktorú vybratá databáza neprijíma, sa vynechá. Informácie o tom, ktorá databáza prijíma ktoré akcie, nájdete na stránke [Úprava vzťahov](./relationship-editing.md#on-delete-and-on-update).

Každý exportovaný súbor má názov `<database name>-<timestamp>` nasledovaný príponou, pričom časová pečiatka je v miestnom čase vo formáte `yyyy-MM-dd'T'HH_mm_ss` – napríklad `my-schema-2026-08-29T04_05_06.erd.json`. Ak je názov databázy prázdny, použije sa `unnamed`.  
Tlačidlo `Save file` na karte Schéma SQL a na karte [Generátor kódu](./code-generator.md) pomenúva súbory rovnakým spôsobom a rovnako aj tlačidlo `Export CSV`, ktoré za časovú pečiatku pridá hárok: `-words.csv`, `-terms.csv` alebo `-domains.csv`. Obrázok použije názov databázy taký, aký bol pri otvorení dialógového okna.

Položky `Import`, `Import and Add` a `Export` sú k dispozícii aj v [rýchlom vyhľadávaní](./quick-search.md) na karte ERD, s rovnakými položkami ako v kontextovej ponuke plátna.

V aplikácii Obsidian sa nezobrazí žiadne dialógové okno sťahovania ani ukladania: súbor sa zapíše do trezora tam, kam Obsidian ukladá nové prílohy pre daný diagram, a upozornenie uvedie jeho cestu.  
Znaky, ktoré Obsidian v názve súboru nepovoľuje, `\ / : * ? " < > |`, sa nahradia znakom `-`.  
Prieskumník súborov v aplikácii Obsidian zobrazí exportovaný súbor `.erd.json` alebo `.sql` iba vtedy, keď je zapnutá možnosť Settings → Files and links → Detect all file extensions.

### Obrázok {#image}

Položka `Export` ▸ `Image` v kontextovej ponuke plátna alebo v rýchlom vyhľadávaní otvorí dialógové okno `Export image`: ukážku obrázka vedľa jeho možností. Otvorený [prieskumník](./explorer.md#dialogs-beside-it) zostane otvorený pod stmavenou oblasťou.

![Otvorenie Export > Image, vypnutie tmavého režimu a pozadia, zvolenie 3x a kopírovanie obrázka do schránky](/img/demo-export.webp)

- `Background`: Predvolene zapnuté. Po vypnutí zostane plátno priehľadné.
- `Dark mode`: Na začiatku zodpovedá vzhľadu editora. Kým zodpovedá vzhľadu na obrazovke, obrázok použije vlastné farby plátna vrátane zmien z [výberu motívu](./language-and-theme.md); pre druhý vzhľad sa použije prednastavený motív s rovnakým odtieňom sivej a farbou zvýraznenia.
- `Scale`: `1x`, `2x` alebo `3x`, predvolene je vybraté `2x`. Určuje iba veľkosť PNG a kópie v schránke a riadok pod ním túto veľkosť uvádza v tvare `PNG <width> × <height> px`.

Zvolené hodnoty sa zachovajú, kým sa editor nezatvorí, a nikdy sa neukladajú do dokumentu. Ukážka sa vykresľuje rovnako ako obrázok a vykreslí sa znova, keď sa zmení možnosť `Background` alebo `Dark mode`.

Obrázok zachytáva diagram v stave, v akom bol pri otvorení dialógového okna; ak chcete zahrnúť neskoršie zmeny, zatvorte dialógové okno a znova ho otvorte. Jeho tabuľky a stĺpce sú pomenované v Zobrazení názvov, ktoré editor vtedy zobrazoval, a to aj v takom, ktoré bolo prepnuté iba na vašej obrazovke, kým zamknutie `Name View` uchováva v súbore iné – pozrite si časť [Mimo plátna](./logical-names.md#beyond-the-canvas). Farby, ktoré [kontroly slovníkov](./dictionary.md#marks-on-the-canvas) dávajú názvom na plátne, sa nevykresľujú. Obsahuje celý diagram bez ohľadu na to, ako ďaleko je zobrazenie posunuté, orezaný na to, čo diagram vykresľuje, s pridaným okrajom, a vždy sa vykresľuje pri 100 % bez ohľadu na priblíženie, ktoré editor práve zobrazuje, takže sa každá tabuľka vykreslí celá. Prvky skryté v ponuke [Možnosti zobrazenia](./table-related-functions.md#table-view-options) – vzťahy, ich označenia ON DELETE a ON UPDATE, skupiny tabuliek alebo poznámky – sa nevykreslia ani sa pre ne nevyhradí miesto a skupiny tabuliek sa vykresľujú za všetkým ostatným.

Obrázok zapisujú tri tlačidlá a každé z nich nechá dialógové okno otvorené:

- `PNG`: Uloží súbor `.png` s veľkosťou diagramu pri 100 % vynásobenou hodnotou `Scale`. Obrázok PNG, ktorý je príliš veľký pre plátno prehliadača, sa namiesto zlyhania zapíše v zníženom rozlíšení: dialógové okno na to vopred upozorní hlásením `Reduced from <width> × <height> px, past what a browser canvas can hold` a upozornenie `Exported at a reduced resolution` to potom oznámi.
- `SVG`: Uloží súbor `.svg` s veľkosťou diagramu pri 100 % bez ohľadu na hodnotu `Scale` a nikdy ho nezmenší. Text v ňom zostane textom a písma sú v ňom uvedené názvom, nie vložené, takže program na zobrazenie, ktorý písmo editora nemá, použije iné. Tiene sa vynechajú.
- `Copy to clipboard`: Vloží do schránky obrázok PNG so zvolenou hodnotou `Scale`, zmenšený rovnako ako pri ukladaní PNG, keď ho plátno prehliadača nedokáže pojať. Potvrdí to hlásením `Copied the image to the clipboard` alebo hlásením `Copied at a reduced resolution`, ak bol obrázok zmenšený. Ak kopírovanie zlyhá, pretože prehliadač alebo hostiteľ odmietne prístup do schránky alebo sa obrázok nepodarilo vykresliť, hlásenie `Couldn't copy the image` navrhne namiesto toho uložiť PNG.

Obrázok sa vykresľuje v pracovnom vlákne na pozadí, ak ho hostiteľ spúšťa, takže editor sa dá medzitým používať. Ak to trvá dlhšie ako chvíľu, zobrazí sa upozornenie `Exporting PNG`, `Exporting SVG` alebo `Copying image` a zlyhanie sa ohlási ako `Couldn't export the PNG` alebo `Couldn't export the SVG`. Zatvorenie dialógového okna počas vykresľovania súboru nezabráni jeho uloženiu.

Po otvorení dialógového okna má fokus tlačidlo `PNG` a kláves `Tab` zostáva v rámci dialógového okna. Kláves `Escape`, tlačidlo `x` alebo kliknutie na stmavenú oblasť okolo neho ho zatvorí.  
Kým je otvorené, nemajú žiadny účinok klávesové skratky plátna vrátane vrátenia späť a opätovného vykonania ani kopírovanie a prilepenie. `Ctrl + K` (Windows/Linux) alebo `⌘ + K` (Mac) ho zatvorí a otvorí rýchle vyhľadávanie. `Ctrl + F` (Windows/Linux) alebo `⌘ + F` (Mac) ho zatvorí a umiestni textový kurzor do poľa hľadania [prieskumníka](./explorer.md#opening-and-closing), pričom prieskumník otvorí, ak je zatvorený, a nikdy ho nezatvorí. V editore, ktorý je príliš úzky na zobrazenie prieskumníka, skratka dialógové okno aj tak zatvorí, ale namiesto presunu textového kurzora zobrazí oznámenie.
