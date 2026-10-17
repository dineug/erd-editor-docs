---
sidebar_position: 2
description: Importați fișiere JSON, Schemă SQL, GraphQL, DBML sau AML în locul diagramei sau adăugate sub ea și exportați JSON, Schemă SQL ori diagrama ca imagine PNG sau SVG.
---

# Importarea sau exportarea fișierelor

## Importarea fișierelor externe {#importing-external-files}

Din submeniul `Import` al meniului contextual al pânzei se pot importa cinci formate:

- json
- Schema SQL
- GraphQL
- DBML
- AML

Elementul `Import and Add`, aflat imediat sub `Import`, adaugă fișierul la diagramă în loc să o înlocuiască (consultați [Import și adăugare](#import-and-add)).  
Ecranul de bun venit afișat de o diagramă goală are un rând `Import` cu aceleași cinci formate (consultați [Ecranul de bun venit](./editing-start.md#welcome-screen)).

Extensiile sunt recunoscute indiferent de majuscule. Alegerea unui fișier a cărui extensie nu corespunde formatului ales anulează importul și afișează mesajul `Only <format> files can be imported`, cu formatul scris `json`, `sql`, `graphql`, `dbml` sau `aml`, ca în `Only sql files can be imported`.

Elementul `Import` înlocuiește documentul curent în loc să fuzioneze cu acesta, iar o singură anulare readuce diagrama anterioară.  
Un fișier JSON își aduce propriile setări, inclusiv [blocările](./settings.md#lock). Acolo unde fișierul blochează fila, limbajul generatorului de cod, un stil de denumire sau tipul de delimitator, vedeți în continuare ce aveați, dar valoarea blocată din fișier este cea salvată. Vizualizarea, blocată sau nu, ajunge acolo unde o plasează fișierul. Un fișier JSON salvat înainte de apariția blocărilor se importă cu toate blocările activate și cu vizualizarea la 100%.  
Celelalte formate păstrează setările pe care le aveți deja, inclusiv blocările, cu excepția vizualizării, care pornește la 100%.  
Parserele GraphQL, DBML și AML nu eșuează niciodată: un fișier pe care nu îl pot citi produce o diagramă goală, nu o eroare.

Un fișier JSON își păstrează pozițiile. Tabelele unui fișier Schemă SQL, GraphQL, DBML sau AML sunt plasate înainte ca diagrama să se schimbe:

- Când fișierul are două sau mai multe tabele și cel puțin o relație, acestea sunt aranjate cu modul `Flow` al [aranjării automate](./table-related-functions.md#auto-layout), de la stânga la dreapta de-a lungul relațiilor, pornind din colțul din stânga sus al pânzei. Se ia în calcul și o relație a unui tabel cu el însuși.
- Altfel, sunt dispuse pe rânduri din stânga sus, începând cu tabelele cu cele mai puține coloane.
- Dacă aranjarea durează mai mult de 6 secunde, apare mesajul `Placing tables` cu un buton `Cancel`. Butonul `Cancel` sau tasta `Escape`, cât timp mesajul este afișat, renunță la aranjare și dispune în schimb tabelele pe rânduri. Tabelele sunt dispuse pe rânduri, fără mesaj, și când aranjarea eșuează, când nu revine nicio aranjare în 60 de secunde sau când aplicația gazdă nu rulează niciun worker partajat (consultați [Web Workers](../../api/installation.md#web-workers)).

Diagrama este apoi înlocuită într-un singur pas, așa că nu apare nicio stare intermediară. O setare pe care o schimbați în timp ce tabelele sunt plasate, de exemplu fila, se păstrează, iar dacă importați între timp un alt fișier, câștigă importul pornit ultimul.

Un editor doar în citire nu încarcă nimic prin `Import` și nu oferă elementul `Import and Add`.

### Import și adăugare {#import-and-add}

Elementul `Import and Add` păstrează diagrama și adaugă un fișier sub ea. Se află în meniul contextual al pânzei și în [căutarea rapidă](./quick-search.md) din fila ERD și oferă aceleași cinci formate, cu aceeași verificare a extensiei ca `Import`.

![Adăugarea unui fișier SQL din Import and Add > Schema SQL, cu tabelele sale ajungând sub diagramă, aranjate de-a lungul relațiilor și selectate](/img/demo-import-and-add.webp)

Fișierul intră la fel ca la o lipire: toate tabelele, coloanele, relațiile, indexurile, notele și [grupurile de tabele](./table-groups.md) pe care le conține se adaugă ca noi, tabelele aflate deja în diagramă nu se mută și nicio setare nu se schimbă, așa că setările unui fișier JSON sunt omise.  
Un tabel al cărui nume există deja în diagramă se adaugă ca al doilea tabel cu acel nume, fără a fi îmbinat cu primul. Relațiile și indexurile provin doar din fișier, așa că o cheie străină către un tabel pe care fișierul nu îl definește nu este legată de un tabel aflat deja în diagramă.

Blocul adăugat ajunge imediat sub tot ce conține diagrama, aliniat cu marginea ei din stânga, sau în colțul din stânga sus al unei diagrame goale. Se iau în calcul și notele și grupurile de tabele ascunse cu [opțiunile de afișare](./table-related-functions.md#table-view-options), deoarece ele se află în continuare acolo.  
În interiorul blocului, un fișier JSON își păstrează propria aranjare, inclusiv grupurile de tabele. Celelalte formate sunt plasate așa cum le plasează elementul `Import`, cu modul `Flow` sau pe rânduri, după aceleași reguli, iar chenarul fiecărui grup de tabele se ajustează în jurul tabelelor sale. Tabelele și notele adăugate se așază deasupra a tot ce există deja.

După ce blocul ajunge, este selectat doar ce s-a adăugat: tabelele noi, plus notele și grupurile de tabele noi cât timp sunt afișate. Dacă între timp ați trecut la altă filă, editorul revine la fila ERD înainte ca blocul să ajungă. Vizualizarea se derulează apoi la bloc, la zoomul curent, cu excepția cazului în care acesta se vede deja bine (consultați [Unde ajunge un salt](./table-related-functions.md#where-a-jump-lands)). O singură anulare elimină întreaga adăugare.  
Un fișier pe care parserul nu îl poate citi sau unul fără niciun tabel și nicio notă nu adaugă nimic.

Mai multe fișiere Schemă SQL, GraphQL, DBML sau AML adăugate cât timp unul este încă în curs de plasare ajung toate, în ordinea în care au fost pornite. Un fișier JSON adăugat între timp ajunge imediat ce este citit, înaintea lor. Folosirea elementului `Import` sau încărcarea unui alt document le abandonează pe cele aflate încă în curs de plasare.

Agenții de programare adaugă un fișier la fel, prin modul `append` al instrumentelor de import MCP, care păstrează aranjarea unui fișier JSON, dar dispune tabelele celorlalte formate pe rânduri, niciodată cu modul `Flow` (consultați [Import](../../mcp/tools.md#import)).

### JSON {#json}

Puteți importa fișiere în [formatul de schemă definit în editor](../../api/advanced/schema.md).
Numele fișierului trebuie să se termine cu `.json`, așa că un fișier exportat ca `<database name>-<timestamp>.erd.json` se reimportă așa cum este; un fișier cu extensia simplă `.erd` sau `.vuerd` nu este acceptat aici. Sunt citite și fișierele salvate de versiunile anterioare.

![Importarea unui fișier salvat din Import > json, înlocuind documentul ciornă împreună cu setările sale](/img/demo-import-json.webp)

### Schemă SQL {#schema-sql}

Puteți importa și fișiere de schemă definite în SQL.  
Deși parserele au fost făcute cât mai flexibile posibil, indiferent de sistemul de baze de date, este posibil să existe unele sintaxe neacceptate.  
Numele fișierului trebuie să se termine cu `.sql`.  
[Sintaxa acceptată poate fi verificată aici.](https://github.com/dineug/erd-editor/tree/main/packages/schema-sql-parser)

![Importarea unui fișier SQL din Import > Schema SQL, cu tabelele aranjate de-a lungul relațiilor, apoi micșorarea vizualizării peste ele](/img/demo-import-sql.webp)

Coloanele provin doar din instrucțiunile `CREATE TABLE`. O coloană adăugată prin `ALTER TABLE ... ADD COLUMN` nu este citită.  
Elementele unei instrucțiuni `CREATE TABLE` care nu sunt coloane sunt omise, nu citite drept coloane: un `CHECK (...)` fără nume, `LIKE` și `EXCLUDE` din PostgreSQL, `FULLTEXT` și `SPATIAL` din MySQL scrise fără `INDEX` sau `KEY`, `PERIOD FOR` din T-SQL și `SUPPLEMENTAL LOG DATA` din Oracle.  
O coloană numită după unul dintre ele se importă totuși când numele este urmat de un tip predefinit, ca în `exclude BOOLEAN`, sau când numele este între ghilimele, ca în `"check" int`. Un `like` fără ghilimele, urmat de un tip care nu este predefinit, de exemplu `like citext`, este citit drept `LIKE` din PostgreSQL și omis.  
Constrângerile `CHECK` propriu-zise nu se importă, deoarece editorul nu are unde să le păstreze.

#### Tipuri de date {#data-types}

Tipul de date al unei coloane se păstrează, inclusiv lista de argumente, chiar și când nu este un tip predefinit al vreunei [baze de date acceptate](./table-related-functions.md#databases).  
Aceasta include un enum sau un tip compus creat cu `CREATE TYPE`, un domeniu creat cu `CREATE DOMAIN`, tipuri din extensii, de exemplu `hstore`, `citext` și `ltree`, nume calificate cu schema, de exemplu `public.mood`, și nume între ghilimele sau între paranteze drepte, de exemplu `"MyType"` și `[dbo].[Phone]`, care își păstrează ghilimelele sau parantezele drepte. Instrucțiunile `CREATE TYPE`, `CREATE DOMAIN` și `CREATE EXTENSION` propriu-zise sunt omise.  
Un tip predefinit își pierde ghilimelele sau parantezele drepte, așa că `[int]` se importă ca `int`, iar `[nvarchar](50)` ca `nvarchar(50)`. Tipurile `"char"` și `"bit"` din PostgreSQL le păstrează pe ale lor, deoarece sunt tipuri diferite de `char` și `bit`.  
Sufixele de tablou rămân pe orice tip: `integer[]`, `text[3][3]`, `integer ARRAY`, `mood[]`. Tipul `UNSIGNED BIG INT` din SQLite se importă întreg.  
Modificatorii `UNSIGNED` și `ZEROFILL` din MySQL și MariaDB, scriși imediat după un tip și argumentele sale, rămân parte a tipului așa cum sunt scriși: `INT UNSIGNED`, `SMALLINT(5) UNSIGNED ZEROFILL`, `int unsigned` din mysqldump. Modificatorul `SIGNED`, cel implicit, este eliminat, așa că `TINYINT SIGNED` se importă ca `TINYINT`. Un modificator scris după o altă opțiune de coloană, ca în `INT NOT NULL UNSIGNED`, pe care MySQL îl refuză, este eliminat.  
Valorile `ENUM(...)` și `SET(...)` își păstrează ghilimelele, cu o ghilimea din interiorul unei valori dublată, ca în `ENUM('a','it''s')`. Forma `'it\'s'` din MySQL, cu ghilimeaua precedată de backslash, se importă în același mod, cu ghilimeaua dublată. Într-un tip `STRUCT<...>` din Databricks, numele de câmpuri între ghilimele și clauza `COMMENT` a unui câmp își păstrează ghilimelele.  
O coloană scrisă fără tip, de exemplu o coloană SQLite fără tip sau o coloană calculată cu `AS`, rămâne fără tip: un cuvânt cheie, de exemplu `NOT`, `NULL`, `DEFAULT`, `PRIMARY` sau `REFERENCES`, ori un șir între ghilimele simple nu este citit drept tip.

#### Valori implicite {#defaults}

Clauza `DEFAULT` a unei coloane își păstrează întreaga expresie, de exemplu `now()`, `0.5`, `CURRENT_TIMESTAMP` sau `ARRAY[]::text[]`, până la următoarea opțiune de coloană, o virgulă sau paranteza de închidere. O expresie `CASE ... END` se citește întreagă.  
Parantezele din jurul întregii expresii se elimină, așa că `((0))` din SQL Server se importă ca `0`, iar `(getdate())` ca `getdate()`. Se elimină și conversia de tip a unui literal, așa că `'draft'::character varying` din pg_dump se importă ca `'draft'`, iar `NULL::character varying` ca `NULL`; celelalte conversii de tip rămân, ca în `ARRAY[]::text[]` și `lower('A'::text)`.  
Clauza `ON UPDATE CURRENT_TIMESTAMP` din MySQL este eliminată, deoarece o coloană nu are unde s-o păstreze, iar valoarea implicită dinaintea ei rămâne. Clauza `DEFAULT ON NULL 0` din Oracle, cu sau fără `FOR INSERT ONLY` ori `FOR INSERT AND UPDATE`, se importă ca `0`.  
Un șir cu prefix, de exemplu `N'x'`, `E'x'`, `B'0'`, `X'ff'`, `U&'x'` sau `_utf8mb4'x'`, este citit ca un singur șir, chiar dacă are o paranteză în interior.

SQL Server Management Studio scrie valorile implicite după tabele, sub forma `ALTER TABLE [dbo].[t] ADD CONSTRAINT [DF_x] DEFAULT ((1)) FOR [col]`. O astfel de instrucțiune setează valoarea implicită a acelei coloane, aici `1`, iar numele constrângerii sale este eliminat.

Un export Schemă SQL repune parantezele acolo unde o bază de date citește expresia unei valori implicite doar între ele (consultați [Valori implicite](./schema-sql.md#defaults)).

#### Autoincrementare {#auto-increment}

Cuvintele cheie `AUTO_INCREMENT`, `AUTOINCREMENT` și `IDENTITY` activează opțiunea `Auto Increment` a unei coloane, la fel ca `GENERATED ALWAYS AS IDENTITY` și `GENERATED BY DEFAULT AS IDENTITY`, care nu lasă în urmă nicio valoare implicită.  
La fel face o valoare implicită formată dintr-un singur apel PostgreSQL `nextval()`, valoarea implicită pe care o primește o coloană de tip serial, scrisă `nextval('s')` sau, cum o scrie pg_dump, `nextval('s'::regclass)`. Numele secvenței nu se păstrează. O valoare implicită care doar folosește o secvență, de exemplu `nextval('s') + 1` sau `NEXT VALUE FOR s` din SQL Server, rămâne o valoare implicită obișnuită.  
pg_dump le scrie pe amândouă după tabele, sub forma `ALTER TABLE [ONLY] t ALTER [COLUMN] c SET DEFAULT nextval('s'::regclass)` și `ALTER TABLE t ALTER [COLUMN] c ADD GENERATED ... AS IDENTITY`. Oricare dintre aceste instrucțiuni activează opțiunea `Auto Increment` a acelei coloane și îi șterge valoarea implicită. Instrucțiunile `CREATE SEQUENCE`, `ALTER SEQUENCE` și orice altă acțiune `ALTER COLUMN` sunt omise.  
O coloană al cărei tip este scris în linie ca `serial`, `bigserial` sau `smallserial` își păstrează acel tip, cu opțiunea `Auto Increment` dezactivată.

Editorul păstrează doar indicatorul `Auto Increment`, iar fiecare bază de date își scrie propria formă la export (consultați [Autoincrementare](./schema-sql.md#auto-increment)). Un export PostgreSQL scrie `GENERATED ALWAYS AS IDENTITY` pe o coloană `smallint`, `integer` sau `bigint`, indiferent de forma importată, iar pe orice alt tip, de exemplu `INT UNSIGNED`, doar o linie de comentariu după tabel. Opțiunile secvenței, de exemplu `START WITH 100`, se pierd.  
Un tabel cu mai multe coloane de tip serial sau de identitate se importă cu mai multe coloane cu autoincrementare, iar MySQL, MariaDB și SQL Server refuză un astfel de tabel când este rulat exportul său.

#### Chei primare {#primary-keys}

O cheie primară adăugată după tabelul său, `ALTER TABLE t ADD [CONSTRAINT n] PRIMARY KEY (...)`, își marchează coloanele drept cheie primară.  
Cuvintele `CLUSTERED` sau `NONCLUSTERED` din SQL Server și `USING BTREE` din MySQL dinaintea listei de coloane sunt sărite la citire, așa că instrucțiunea `ALTER TABLE [dbo].[Users] ADD CONSTRAINT [PK_Users] PRIMARY KEY CLUSTERED ([Id] ASC) WITH (...) ON [PRIMARY]` scrisă de SQL Server Management Studio definește cheia pe coloana `Id`. Clauza `PRIMARY KEY NONCLUSTERED HASH (...)` a unui tabel optimizat pentru memorie nu este citită, nici în `ALTER TABLE`, nici în `CREATE TABLE`.

#### Chei unice și indexuri {#unique-keys-and-indexes}

O constrângere `UNIQUE` pe două sau mai multe coloane devine un singur index unic, în orice formă de scriere: `UNIQUE (a, b)`, `UNIQUE KEY n (a, b)`, `UNIQUE INDEX n (a, b)`, `CONSTRAINT n UNIQUE (a, b)`, forma în linie `INDEX n UNIQUE (a, b)` din SQL Server și `ALTER TABLE t ADD [CONSTRAINT n] UNIQUE (a, b)`.  
Indexul primește numele de index al cheii, altfel numele din `CONSTRAINT`, altfel niciun nume, și păstrează ordinea de sortare a fiecărei coloane. Un astfel de index este o [cheie alternativă](./table-related-functions.md#alternate-keys).  
O constrângere `UNIQUE` pe o singură coloană, în oricare dintre aceste forme, marchează în schimb acea coloană ca unică și nu adaugă niciun index, așa că constrângerea `UQ_<table name>_<column name>` scrisă de export revine ca indicatorul din care a fost scrisă. O instrucțiune `CREATE UNIQUE INDEX` pe o singură coloană rămâne un index unic.

O instrucțiune `ALTER TABLE` care adaugă mai multe chei deodată, cum scrie phpMyAdmin `ADD PRIMARY KEY (id), ADD UNIQUE KEY uq_a (a, b), ADD UNIQUE KEY uq_c (c)`, păstrează toate cheile unice din ea: `uq_a` se importă ca index unic numit `uq_a`, iar `uq_c` ca indicatorul unic al coloanei `c`. Un nume din `CONSTRAINT` denumește doar cheia din propria clauză. Se citesc și `ADD UNIQUE INDEX IF NOT EXISTS n (...)` din MariaDB, precum și `ALTER TABLE t WITH CHECK ADD ...` și `WITH NOCHECK ADD ...` din SQL Server.  
Instrucțiunile `CREATE INDEX` și `CREATE UNIQUE INDEX` se citesc cu nume calificate, de exemplu `public.t` și `[dbo].[t]`, cu `CLUSTERED` și `NONCLUSTERED` din SQL Server, cu `CONCURRENTLY`, `IF NOT EXISTS`, `ON ONLY` și `USING btree` din PostgreSQL, precum și fără niciun nume de index. Grupul de fișiere `ON [PRIMARY]` din SQL Server este ignorat.  
Opțiunile cheii, de exemplu `NULLS NOT DISTINCT` sau `USING BTREE`, nu sunt confundate cu numele cheii. În lista de coloane a unei chei, doar primul cuvânt denumește coloana, așa că `b DESC NULLS LAST`, `b text_pattern_ops` și `b COLLATE "C"` definesc toate cheia pe `b`, cu `DESC` păstrat ca ordine de sortare. O lungime de prefix, de exemplu `email(191)`, este sărită la citire, dar o cheie cu o parte de tip expresie, de exemplu `lower(email)`, este omisă în întregime.

Un index unic parțial, `CREATE UNIQUE INDEX ... WHERE ...` sau forma în linie `INDEX n UNIQUE (...) WHERE ...` din SQL Server, se importă ca index obișnuit cu același nume și aceleași coloane, deoarece o cheie unică pe întregul tabel ar fi mai strictă decât cea filtrată pe care o declară fișierul. Excepția este un filtru format doar din teste `IS NOT NULL` pe coloanele cheii, unite prin `AND`, filtrul de care SQL Server are nevoie pentru a permite unei coloane unice să conțină mai mult de un NULL: acea cheie rămâne unică.  
O cheie unică ce numește o coloană pe care tabelul nu o are, de exemplu una adăugată prin `ALTER TABLE ... ADD COLUMN`, este eliminată în întregime, nu redusă la coloanele existente. Un index obișnuit păstrează coloanele existente.

SQL Developer și `DBMS_METADATA` din Oracle scriu indexul propriu al unei chei ca instrucțiune `CREATE UNIQUE INDEX` separată, cu numele cheii sau, pentru o cheie fără nume urmată de `USING INDEX`, cu un nume de sistem, de exemplu `SYS_C0012345`. Importul citește un astfel de index, precum și pe cel numit de o clauză `ADD CONSTRAINT ... USING INDEX`, ca parte a cheii sale: o cheie unică compusă se importă ca un singur index unic, iar o cheie primară sau o cheie unică pe o singură coloană ca indicatorii coloanelor, fără index suplimentar. Un export înapoi în Oracle creează apoi indexul o singură dată.

Un export Schemă SQL se reimportă cu aceiași indicatori unic și aceleași indexuri pentru MySQL, MariaDB, MSSQL, Oracle, PostgreSQL și SQLite.  
Snowflake nu are indexuri secundare, așa că exportul său readuce doar cheile unice: una compusă ca index unic, iar una pe o singură coloană ca indicatorul unic al coloanei. Un export Databricks nu declară nicio unicitate, așa că nu revine niciuna.

#### Chei străine {#foreign-keys}

O cheie străină devine relație în aceste forme de scriere:

- O clauză `FOREIGN KEY (...) REFERENCES t (...)` la nivel de tabel, cu sau fără `CONSTRAINT name`.
- `ALTER TABLE ... ADD [CONSTRAINT name] FOREIGN KEY (...) REFERENCES t (...)`, inclusiv `ALTER TABLE t WITH CHECK ADD ...` și `WITH NOCHECK ADD ...` scrise de SQL Server Management Studio.
- Clauza în linie `REFERENCES t (col)` a unei coloane, ca în `user_id INT REFERENCES users (id)`, și clauza `FOREIGN KEY REFERENCES t (col)` pe care SQL Server și Snowflake o permit în același loc. O referință în linie către mai mult de o coloană este omisă.

O instrucțiune `ALTER TABLE` produce cel mult o relație și numai când prima sa clauză adaugă o cheie străină: o clauză `FOREIGN KEY` aflată după o clauză `ADD PRIMARY KEY` sau `ADD UNIQUE` în aceeași instrucțiune nu este citită. Când o instrucțiune adaugă mai multe chei străine, cum scrie phpMyAdmin `ADD CONSTRAINT fk1 FOREIGN KEY ..., ADD CONSTRAINT fk2 FOREIGN KEY ...`, se citește doar ultima.

Clauza `REFERENCES t` fără listă de coloane indică cheia primară a tabelului `t` când acea cheie este o singură coloană. În cazul unei chei primare compuse, cheia străină este omisă.  
O cheie străină este omisă, iar niciuna dintre coloanele sale nu este marcată drept cheie străină, când nu se găsește niciuna dintre coloanele referite sau când coloanele găsite în cele două tabele diferă ca număr, ca atunci când o coloană lipsește doar din unul dintre ele. Când ambelor tabele le lipsește același număr de coloane ale cheii, coloanele găsite sunt asociate în ordinea în care sunt scrise, iar relația le conține doar pe acestea.  
Fiecare relație importată este de tip `Zero N` și este identificatoare când fiecare dintre coloanele sale din tabelul copil este și cheie primară.

Clauzele `ON DELETE` și `ON UPDATE` ale fiecărei chei străine devin opțiunile `On Delete` și `On Update` ale relației: `NO ACTION`, `RESTRICT`, `CASCADE`, `SET NULL` sau `SET DEFAULT`, indiferent de majuscule și în orice ordine. O cheie străină fără ele se importă ca `Not set`. Pentru setarea lor în editor, consultați [Editarea relațiilor](./relationship-editing.md#on-delete-and-on-update).  
Lista de coloane din PostgreSQL de după `SET NULL` sau `SET DEFAULT`, ca în `ON DELETE SET NULL (a_id)`, este sărită la citire: acțiunea se aplică întregii chei, iar un `ON UPDATE` de după listă este citit în continuare. Clauzele `MATCH FULL`, `MATCH PARTIAL` și `MATCH SIMPLE` sunt omise, iar atributul de coloană `ON UPDATE CURRENT_TIMESTAMP` din MySQL nu este confundat cu o acțiune.  
Un export Schemă SQL se reimportă cu acțiunile pe care le scrie baza de date respectivă, așa că o acțiune pe care o omite, de exemplu `SET DEFAULT` pe MySQL, orice `ON UPDATE` pe Oracle sau orice altceva decât `NO ACTION` pe Snowflake, revine ca `Not set`.

#### Comentarii {#comments}

Comentariile tabelelor și ale coloanelor se importă din cele trei sintaxe pe care le citește parserul: opțiunea de tabel și atributul de coloană `COMMENT` folosite de MySQL, MariaDB, Snowflake și Databricks, instrucțiunile `COMMENT ON TABLE` și `COMMENT ON COLUMN` folosite de PostgreSQL și Oracle și proprietatea extinsă `MS_Description` pe care SQL Server o setează cu `EXEC sp_addextendedproperty`.  
Un comentariu care numește un tabel sau o coloană pe care fișierul nu le definește este ignorat.

Apelurile SQL Server se citesc cu argumente numite, așa cum scrie SQL Server Management Studio fiecare comentariu (`@name=N'MS_Description', @value=N'...', ..., @level1type=N'TABLE', @level1name=N'Users'`), și cu argumente poziționale, așa cum le scrie exportul MSSQL al editorului.  
Doar o proprietate `MS_Description` pe un tabel sau pe una dintre coloanele sale, la nivelul 2, produce un comentariu. O altă proprietate, o vizualizare, un index sau o constrângere nu produce niciunul, și nici un comentariu transmis printr-o variabilă sau construit cu `+`.

Într-un comentariu, ca în orice text între ghilimele, de exemplu o valoare `DEFAULT` sau un nume între ghilimele, o ghilimea dublată înseamnă o singură ghilimea, așa cum o scriu mysqldump și pg_dump: `'it''s'` se citește ca `it's`.  
Un backslash înaintea unei ghilimele, cum scriu MySQL și MariaDB `'it\'s'`, servește și el drept caracter de escape pentru ghilimea. O astfel de ghilimea încheie totuși textul când este urmată de un spațiu alb, `,`, `;`, `)`, `]`, `:`, `|`, `+` sau sfârșitul fișierului, așa că `'C:\'`, `'C:\'::text` din pg_dump și `'C:\'+name` din T-SQL își păstrează backslashul.  
O valoare `DEFAULT` își păstrează ghilimelele, iar o ghilimea din interiorul ei este rescrisă dublată, indiferent de forma de escape din fișier: `'it''s'`.  
Când baza de date a documentului este Databricks în momentul importului, textul între ghilimele simple urmează în schimb regulile Spark: fiecare backslash servește drept caracter de escape pentru caracterul de după el, așa că `'C:\\dir'` se citește ca `C:\dir`, secvențele de escape, de exemplu `\n`, `\t` și `\u0041`, sunt decodificate, iar o valoare `DEFAULT` se păstrează ca `'it\'s'`.

În codul Schemă SQL exportat, o ghilimea din comentariul unui tabel sau al unei coloane este scrisă cu escape: `COMMENT 'it''s'` pentru MySQL, MariaDB și Snowflake, `COMMENT ON TABLE` și `COMMENT ON COLUMN ... IS 'it''s'` pentru PostgreSQL și Oracle și aceeași dublare, inclusiv în numele tabelelor și ale coloanelor, în apelurile `sp_addextendedproperty` ale MSSQL. Un comentariu fără ghilimele este scris așa cum este.  
Databricks folosește în schimb un backslash drept caracter de escape pentru o ghilimea și pentru un backslash, ca în `COMMENT 'it\'s'`, așa că exportul său se reimportă exact doar cât timp Databricks este baza de date selectată.  
MSSQL scrie fiecare comentariu ca `EXECUTE sys.sp_addextendedproperty 'MS_Description', '<comment>', 'schema', '<schema>', 'table', '<table>'`, urmat de `'column', '<column>'` pentru o coloană. Cu setarea `Bracket` la `None`, un tabel numit `sales.users` dă schema `sales` și tabelul `users`, iar un nume fără schemă se află în `dbo`. Cu orice altă valoare `Bracket`, întregul nume este tabelul, în `dbo`.

Comentariile nu supraviețuiesc unui export SQLite urmat de import: SQLite le scrie ca simple linii `--`, pe care parserul nu le citește. Apelurile `sp_addextendedproperty` ale unui export MSSQL se reimportă ca aceleași comentarii de tabel și de coloană.

### GraphQL {#graphql}

Puteți importa un document GraphQL SDL.  
Definițiile de tipuri obiect devin tabele, un bloc `extend type` se îmbină cu tipul pe care îl extinde, iar câmpurile interfețelor sunt moștenite de tipurile care le implementează.  
Un câmp al cărui tip este un alt tabel devine relație în loc de coloană, iar o listă pe ambele părți creează un tabel de legătură.  
Un câmp singular, de exemplu `buyer: User`, este asociat mai întâi cu singurul câmp de pe celălalt tip al cărui nume se termină cu `By` urmat de numele acelui câmp, de exemplu `orderListByBuyer`, indiferent de majuscule și de caracterele de subliniere; un câmp numerotat, de exemplu `buyer2`, este asociat la fel, fără numărul său. Astfel își denumește câmpurile rezultatul GraphQL al generatorului de cod când două tabele au în comun mai mult de o relație sau un tabel se referă la el însuși, așa că un astfel de rezultat se reimportă cu toate relațiile.  
Tipurile rădăcină (`Query`, `Mutation`, `Subscription`), tipurile de introspecție și tipurile de înveliș din Relay, din federație și din Hasura, de exemplu `PageInfo`, `*Connection`, `*Edge` și `*_aggregate`, sunt tratate ca zgomot și omise.  
Directivele `@id`, `@primaryKey`, `@unique`, `@autoincrement`, `@default`, `@map`, `@relation`, `@column`, `@table`, `@index` și `@db.*` sunt respectate.  
Numele fișierului trebuie să se termine cu `.graphql`, `.gql` sau `.graphqls`. Un fișier Prisma `schema.prisma` nu este un document GraphQL și nu poate fi importat aici.

### DBML {#dbml}

Puteți importa un fișier DBML, formatul folosit de dbdiagram.io și dbdocs.  
Se citesc blocurile `Table`, `TablePartial`, `Ref`, `Enum` și `TableGroup`. Blocurile `Project` și blocurile `Note` independente sunt omise fără a afecta tabelele din jurul lor.  
Este acceptată orice formă de scriere a referințelor: forma cu două puncte `Ref:`, o referință cu nume, forma de bloc `Ref { }` și setarea de coloană în linie `[ref: > table.column]`.  
O referință mulți-la-mulți `<>` creează un tabel de legătură denumit după ambele părți.  
Setările `delete` și `update` ale unei referințe independente devin opțiunile `On Delete` și `On Update` ale relației, ca în `Ref: users.id < posts.user_id [delete: cascade, update: set null]`. Valorile sunt `cascade`, `restrict`, `set null`, `set default` și `no action`, indiferent de majuscule. Orice altă valoare sau lipsa setării se importă ca `Not set`, iar alte setări, de exemplu `color`, sunt ignorate.  
Setarea în linie `[ref: ...]` nu transmite nicio acțiune, iar setările unei referințe `<>` nu sunt transmise tabelului de legătură. Când aceeași cheie străină este declarată atât în linie, cât și ca referință independentă, se păstrează cea în linie, fără acțiuni.  
Setarea `headercolor` a unui tabel, ca în `Table users [headercolor: #3498DB]`, devine culoarea sa când valoarea este un cod hexazecimal `#rgb` sau `#rrggbb` scris fără ghilimele. Orice altă valoare este eliminată, iar setarea `headercolor` a unui bloc `TablePartial` nu este transmisă tabelelor care îl folosesc.  
Fiecare bloc `TableGroup` devine un [grup de tabele](./table-groups.md) care conține tabelele pe care le enumeră, câte unul pe linie, denumite așa cum le denumește o referință `Ref`. Setarea sa `[color: ...]` devine culoarea grupului după aceeași regulă ca `headercolor`, iar nota și celelalte setări ale sale sunt eliminate. Un tabel enumerat de două grupuri rămâne în primul. Un grup rămas fără niciun tabel nu este creat, fie că nu enumeră niciun tabel declarat în fișier, fie că enumeră doar tabele luate de un grup anterior. Chenarul grupului se ajustează în jurul tabelelor sale oriunde ar fi plasate, iar când tabelele sunt dispuse pe rânduri, tabelele unui grup rămân împreună.  
Numele fișierului trebuie să se termine cu `.dbml`.

### AML {#aml}

Puteți importa un fișier AML (Azimutt Markup Language). Sunt acceptate atât sintaxa actuală, cât și sintaxa veche v1.  
Entitățile devin tabele, iar atributele imbricate sunt aplatizate într-un nume de coloană cu puncte, de exemplu `settings.slug`.  
Atributele sunt `NOT NULL`, cu excepția celor marcate `nullable`, iar construcțiile pentru care editorul nu are loc, de exemplu `check`, `type` și `tags`, sunt eliminate, nu respinse. O entitate marcată ca vizualizare se importă ca tabel obișnuit.  
Proprietatea `color` a unei entități, ca în `users {color: red}`, devine culoarea tabelului său. Numele de culori AML, `red`, `orange`, `amber`, `yellow`, `lime`, `green`, `emerald`, `teal`, `cyan`, `sky`, `blue`, `indigo`, `violet`, `purple`, `fuchsia`, `pink`, `rose` și `gray`, se citesc indiferent de majuscule, cu sau fără ghilimele, fiecare ca nuanța 500 a culorii Tailwind cu același nume, de exemplu `#ef4444` pentru `red`. Un cod hexazecimal între ghilimele, de exemplu `"#3498db"`, se păstrează așa cum este scris; un `#3498db` fără ghilimele nu poate fi citit, deoarece `#` începe un comentariu AML. Orice altă valoare, precum și o proprietate `color` pe un atribut sau pe o relație, este eliminată.  
O instrucțiune `rel` independentă, sau `fk` în sintaxa veche, își păstrează proprietățile `onDelete` și `onUpdate` ca opțiunile `On Delete` și `On Update` ale relației, ca în `rel posts(user_id) -> users(id) {onDelete: cascade, onUpdate: "set null"}`. Valorile sunt `cascade`, `restrict`, `set null`, `set default` și `no action`, cu sau fără ghilimele, indiferent de majuscule. Celelalte proprietăți sunt eliminate.  
Pe o relație în linie, de exemplu `user_id int -> users(id) {onDelete: cascade}`, proprietățile aparțin atributului, așa că sunt eliminate, iar relația se importă ca `Not set`.  
Numele fișierului trebuie să se termine cu `.aml`.

GraphQL, DBML și AML sunt formate bidirecționale: fiecare este și o țintă a [generatorului de cod](./code-generator.md).  
DBML și AML transmit în ambele sensuri ON DELETE și ON UPDATE ale fiecărei relații (consultați [Generator de cod](./code-generator.md#on-delete-and-on-update)). GraphQL nu transmite niciuna dintre ele, așa că un import GraphQL le lasă pe amândouă la `Not set`.  
DBML transmite în ambele sensuri și culorile tabelelor, fără transparență, și fiecare grup de tabele care conține un tabel. Un grup fără nume revine ca `group_1`, `group_2` și așa mai departe, iar un nume de grup repetat revine cu sufixul `_2`, `_3` și așa mai departe. AML transmite culoarea unui tabel doar ca cel mai apropiat nume de culoare AML, așa că `#FF8800` este scris ca `orange` și revine ca `#f97316`, și nu transmite niciun grup. GraphQL nu transmite nici culori, nici grupuri.

## Exportarea {#exporting}

Submeniul `Export` al meniului contextual al pânzei are trei elemente:

- json: salvează diagrama așa cum o conține fișierul său, ca `.erd.json`: tabelele cu coloanele și indexurile lor, relațiile, notele și grupurile de tabele, precum și setările, fiecare [setare blocată](./settings.md#lock) cu valoarea sa blocată.
- Schema SQL: deschide fila [Schemă SQL](./schema-sql.md#saving-or-copying-the-sql) cu panoul de opțiuni deschis și cu focusul pe butonul `Save file`, așa că apăsarea tastei `Enter` salvează ca `.sql` codul SQL afișat în filă. Până atunci nu se salvează nimic.
- Image: deschide caseta de dialog `Export image`, care salvează diagrama ca `.png` sau `.svg` ori o copiază în clipboard ca PNG (consultați [Imagine](#image)).

Toate trei funcționează într-un editor doar în citire.

Fila Schemă SQL scrie ON DELETE și ON UPDATE ale fiecărei relații după clauza `REFERENCES`, întâi ON DELETE. Valoarea `Not set` nu scrie nimic, iar o acțiune pe care baza de date selectată nu o acceptă este omisă. Pentru a afla ce acțiuni acceptă fiecare bază de date, consultați [Editarea relațiilor](./relationship-editing.md#on-delete-and-on-update).

Fiecare fișier exportat se numește `<database name>-<timestamp>`, urmat de extensia sa, cu marcajul de timp în ora locală, în formatul `yyyy-MM-dd'T'HH_mm_ss`, de exemplu `my-schema-2026-08-29T04_05_06.erd.json`. Un nume de bază de date gol este înlocuit cu `unnamed`.  
Butoanele `Save file` ale filei Schemă SQL și ale [generatorului de cod](./code-generator.md) își denumesc fișierele în același mod. O imagine preia numele bazei de date așa cum era la deschiderea casetei de dialog.

Comenzile `Import`, `Import and Add` și `Export` sunt disponibile și din [căutarea rapidă](./quick-search.md) din fila ERD, cu aceleași elemente ca în meniul contextual al pânzei.

În Obsidian nu apare nicio casetă de dialog de descărcare sau de salvare: fișierul este scris în seif, acolo unde Obsidian pune atașamentele noi pentru acea diagramă, iar o notificare îi indică calea.  
Caracterele pe care Obsidian nu le permite într-un nume de fișier, `\ / : * ? " < > |`, sunt înlocuite cu `-`.  
Exploratorul de fișiere din Obsidian listează un fișier `.erd.json` sau `.sql` exportat doar cât timp opțiunea Settings → Files and links → Detect all file extensions este activată.

### Imagine {#image}

Elementul `Export` ▸ `Image`, din meniul contextual al pânzei sau din căutarea rapidă, deschide caseta de dialog `Export image`: o previzualizare a imaginii alături de opțiunile ei. Un [explorator](./explorer.md#dialogs-beside-it) deschis rămâne deschis sub zona estompată.

![Deschiderea Export > Image, dezactivarea modului întunecat și a fundalului, alegerea 3x și copierea imaginii în clipboard](/img/demo-export.webp)

- `Background`: activat implicit. Când este dezactivat, pânza rămâne transparentă.
- `Dark mode`: inițial corespunde aspectului editorului. Cât timp corespunde aspectului de pe ecran, imaginea preia culorile proprii ale pânzei, inclusiv modificările din [configuratorul de teme](./language-and-theme.md); celălalt aspect folosește tema predefinită cu același ton de gri și aceeași culoare de accent.
- `Scale`: `1x`, `2x` sau `3x`, cu `2x` selectat implicit. Stabilește doar dimensiunea imaginii PNG și a copiei din clipboard, iar linia de sub opțiune indică această dimensiune, sub forma `PNG <width> × <height> px`.

Alegerile se păstrează până la închiderea editorului și nu se salvează niciodată în document. Previzualizarea se desenează la fel ca imaginea și se redesenează când se schimbă opțiunea `Background` sau `Dark mode`.

Imaginea conține diagrama așa cum era la deschiderea casetei de dialog; închideți și redeschideți caseta de dialog pentru a include modificările ulterioare. Conține întreaga diagramă, oricât de departe ar fi derulată, decupată la ce desenează diagrama plus o margine, și este desenată mereu la 100%, indiferent de zoomul afișat de editor, așa că fiecare tabel este desenat complet. Ce ascund [opțiunile de afișare](./table-related-functions.md#table-view-options) – relațiile, etichetele lor ON DELETE și ON UPDATE, grupurile de tabele sau notele – nu este nici desenat, nici nu i se face loc, iar grupurile de tabele sunt desenate în spatele tuturor celorlalte elemente.

Trei butoane scriu imaginea și fiecare lasă caseta de dialog deschisă:

- `PNG`: salvează un fișier `.png` de dimensiunea diagramei la 100%, înmulțită cu valoarea `Scale`. O imagine PNG prea mare pentru un canvas de browser este scrisă la o rezoluție redusă, în loc să eșueze: caseta de dialog avertizează dinainte cu `Reduced from <width> × <height> px, past what a browser canvas can hold`, iar ulterior o notificare cu textul `Exported at a reduced resolution` semnalează acest lucru.
- `SVG`: salvează un fișier `.svg` de dimensiunea diagramei la 100%, indiferent de valoarea `Scale`, și niciodată redus. Textul rămâne text, iar fonturile sunt doar numite, nu încorporate, așa că un program de vizualizare care nu are fontul editorului desenează altul. Umbrele sunt omise.
- `Copy to clipboard`: pune în clipboard o imagine PNG la valoarea `Scale` aleasă, redusă la fel ca o imagine PNG salvată când un canvas de browser nu o poate cuprinde. Confirmă cu `Copied the image to the clipboard` sau cu `Copied at a reduced resolution` când imaginea a fost redusă. Dacă copierea eșuează, deoarece browserul sau aplicația gazdă refuză accesul la clipboard ori imaginea nu a putut fi desenată, mesajul `Couldn't copy the image` sugerează în schimb salvarea unei imagini PNG.

Imaginea este desenată într-un worker în fundal, acolo unde aplicația gazdă rulează unul, așa că editorul rămâne utilizabil între timp. O notificare cu textul `Exporting PNG`, `Exporting SVG` sau `Copying image` apare când operația durează mai mult de o clipă, iar un eșec este semnalat ca `Couldn't export the PNG` sau `Couldn't export the SVG`. Închiderea casetei de dialog cât timp un fișier este încă în curs de desenare nu împiedică salvarea acelui fișier.

Butonul `PNG` are focusul la deschiderea casetei de dialog, iar tasta `Tab` rămâne în interiorul casetei. Tasta `Escape`, butonul `x` sau un clic pe zona estompată din jurul ei o închide.  
Cât timp este deschisă, comenzile rapide ale pânzei, inclusiv anularea și refacerea, precum și copierea și lipirea nu au niciun efect. `Ctrl + K` (Windows/Linux) sau `⌘ + K` (Mac) o închide și deschide căutarea rapidă. `Ctrl + F` (Windows/Linux) sau `⌘ + F` (Mac) o închide și plasează cursorul de text în câmpul Găsire al [exploratorului](./explorer.md#opening-and-closing), deschizând exploratorul dacă este închis, fără a-l închide vreodată. Într-un editor prea îngust pentru a afișa exploratorul, combinația închide totuși caseta de dialog, dar afișează o notificare în loc să mute cursorul de text.
