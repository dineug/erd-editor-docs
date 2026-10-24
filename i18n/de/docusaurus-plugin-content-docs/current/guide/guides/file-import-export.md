---
sidebar_position: 2
description: JSON, Schema SQL, GraphQL, DBML oder AML anstelle des Diagramms importieren oder darunter hinzufügen und JSON, Schema SQL oder das Diagramm als PNG- oder SVG-Bild exportieren.
---

# Dateien importieren oder exportieren

## Externe Dateien importieren {#importing-external-files}

Fünf Formate lassen sich über das Untermenü `Import` des Kontextmenüs der Zeichenfläche importieren:

- json
- Schema SQL
- GraphQL
- DBML
- AML

Der Eintrag `Import and Add` direkt unter `Import` fügt die Datei dem Diagramm hinzu, statt es zu ersetzen – siehe [Importieren und hinzufügen](#import-and-add).  
Der Willkommensbildschirm, den ein leeres Diagramm zeigt, hat einen Eintrag `Import` mit denselben fünf Formaten – siehe [Willkommensbildschirm](./editing-start.md#welcome-screen).  
Die Blätter der Registerkarte [Wörterbuch](./dictionary.md) übernehmen außerdem Wörter, Begriffe und Domänen aus CSV-Dateien, über die eigene Schaltfläche `Import CSV` dieser Registerkarte – siehe [CSV importieren und exportieren](./dictionary.md#importing-and-exporting-csv).

Dateiendungen werden in jeder Groß-/Kleinschreibung erkannt. Wenn Sie eine Datei auswählen, deren Endung nicht zum gewählten Format passt, wird der Import abgebrochen und `Only <format> files can be imported` angezeigt, wobei das Format als `json`, `sql`, `graphql`, `dbml` oder `aml` geschrieben wird, wie in `Only sql files can be imported`.

`Import` ersetzt das aktuelle Dokument, statt die Datei damit zusammenzuführen, und ein einziges Rückgängigmachen stellt das vorherige Diagramm wieder her.  
Eine JSON-Datei bringt ihre eigenen Einstellungen mit, einschließlich ihrer [Sperren](./settings.md#lock). Wo die Datei die Registerkarte, die Sprache des Codegenerators, eine Schreibweise, den Begrenzertyp oder die [Namensansicht](./logical-names.md#name-view) sperrt, sehen Sie weiterhin, was Sie hatten, gespeichert wird aber der gesperrte Wert der Datei. Zoomstufe und Ansichtsposition landen, ob gesperrt oder nicht, dort, wo die Datei sie festlegt. Eine JSON-Datei, die gespeichert wurde, bevor es die Sperren gab, wird so übernommen, dass alle Sperren eingeschaltet sind und die Ansicht bei 100 % steht. Eine Datei, die gespeichert wurde, bevor es die Sperre `Name View` gab, wird mit eingeschalteter Sperre `Name View` übernommen, unabhängig davon, welche anderen Sperren sie verzeichnet.  
Die anderen Formate behalten Ihre bestehenden Einstellungen bei, einschließlich der Sperren, mit Ausnahme der Ansicht, die bei 100 % beginnt.  
Die Parser für GraphQL, DBML und AML schlagen nie fehl: Eine Datei, die sie nicht lesen können, ergibt ein leeres Diagramm statt eines Fehlers.

Eine JSON-Datei bringt außerdem die logischen Namen ihrer Tabellen und Spalten und die Domänenverknüpfungen ihrer Spalten mit. Ihre Wörter, Begriffe und Domänen treten an die Stelle derer der Registerkarte [Wörterbuch](./dictionary.md), sodass eine Datei, die keine enthält, die Blätter leer lässt, und das Rückgängigmachen des Imports bringt die ersetzten zurück.  
Die anderen Formate enthalten nichts davon. Ihre Tabellen kommen ohne logische Namen und ohne mit einer Domäne verknüpfte Spalte an, und Ihre Wörter, Begriffe und Domänen bleiben unverändert. Auch das Rückgängigmachen oder Wiederholen des Imports lässt sie unverändert, sodass eine nach dem Import vorgenommene Änderung am Wörterbuch erhalten bleibt. Ein solcher Import lässt außerdem den eigenen Verlauf jedes Blatts unverändert, während ein JSON-Import diese Verläufe leert – siehe [Wörterbuchblätter](./undo-redo.md#dictionary-sheets).

Eine JSON-Datei behält die Positionen, die sie enthält. Die Tabellen einer Datei in Schema SQL, GraphQL, DBML oder AML werden angeordnet, bevor sich das Diagramm ändert, und zwar in den Breiten, die sie in der [Namensansicht](./logical-names.md#beyond-the-canvas) haben, die Sie gerade sehen:

- Hat die Datei zwei oder mehr Tabellen und mindestens eine Beziehung, werden sie mit dem [Automatischen Layout](./table-related-functions.md#auto-layout) `Flow` von links nach rechts entlang der Beziehungen angeordnet, ausgehend von oben links auf der Zeichenfläche. Eine Beziehung von einer Tabelle zu sich selbst zählt mit.
- Andernfalls werden sie ab oben links in Zeilen angeordnet, die Tabellen mit den wenigsten Spalten zuerst.
- Dauert das Layout länger als 6 Sekunden, erscheint ein Hinweis `Placing tables` mit einer Schaltfläche `Cancel`. `Cancel` oder `Escape`, solange der Hinweis angezeigt wird, bricht das Layout ab und ordnet die Tabellen stattdessen in Zeilen an. Zeilen werden auch ohne Hinweis verwendet, wenn das Layout fehlschlägt, wenn innerhalb von 60 Sekunden kein Layout zurückkommt oder wenn der Host keinen Shared Worker ausführt – siehe [Web Worker](../../api/installation.md#web-workers).

Danach wird das Diagramm in einem Schritt ersetzt, sodass kein Zwischenstand zu sehen ist. Eine Einstellung, die Sie ändern, während die Tabellen angeordnet werden, etwa die Registerkarte, bleibt erhalten, und wenn Sie währenddessen eine andere Datei importieren, setzt sich der zuletzt gestartete Import durch.

Ein schreibgeschützter Editor lädt über `Import` nichts und bietet weder `Import and Add` noch die Schaltfläche `Import CSV` der Registerkarte Wörterbuch an.

### Importieren und hinzufügen {#import-and-add}

`Import and Add` behält das Diagramm bei und fügt eine Datei darunter hinzu. Der Eintrag befindet sich im Kontextmenü der Zeichenfläche und in der [Schnellsuche](./quick-search.md) auf der Registerkarte ERD und bietet dieselben fünf Formate mit derselben Prüfung der Dateiendung wie `Import`.

![Eine SQL-Datei über Import and Add > Schema SQL hinzufügen, deren Tabellen unter dem Diagramm landen, entlang ihrer Beziehungen angeordnet und ausgewählt](/img/demo-import-and-add.webp)

Die Datei wird wie beim Einfügen übernommen: Alle Tabellen, Spalten, Beziehungen, Indizes, Notizen und [Tabellengruppen](./table-groups.md), die sie enthält, werden als neue hinzugefügt, die bereits im Diagramm vorhandenen Tabellen bewegen sich nicht und keine Einstellung ändert sich, sodass die Einstellungen einer JSON-Datei entfallen.  
Die Tabellen und Spalten einer JSON-Datei behalten ihre logischen Namen, und jeder physische Name bleibt, wie in der Datei, von den Wörterbüchern abgeleitet oder Ihr eigener, was darüber entscheidet, ob ein später geschriebener logischer Name einen neuen ableitet – siehe [Physische Namen ableiten](./dictionary.md#deriving-physical-names). Die Wörter, Begriffe und Domänen der Datei entfallen, sodass die Registerkarte Wörterbuch so bleibt, wie sie war, und keine hinzugefügte Spalte mit einer Domäne verknüpft ist: Jede behält den Datentyp, den sie hat.  
Eine Tabelle, deren Namen das Diagramm bereits enthält, wird als zweite Tabelle mit diesem Namen hinzugefügt, nicht mit der vorhandenen zusammengeführt. Beziehungen und Indizes stammen nur aus der Datei, sodass ein Fremdschlüssel auf eine Tabelle, die die Datei nicht definiert, nicht mit einer bereits im Diagramm vorhandenen Tabelle verknüpft wird.

Der hinzugefügte Block landet direkt unter allem, was das Diagramm enthält, bündig an dessen linkem Rand, oder oben links in einem leeren Diagramm. Notizen und Tabellengruppen, die mit den [Ansichtsoptionen](./table-related-functions.md#table-view-options) ausgeblendet sind, zählen ebenfalls, da sie weiterhin dort stehen.  
Innerhalb des Blocks behält eine JSON-Datei ihre eigene Anordnung, einschließlich ihrer Tabellengruppen. Die anderen Formate werden so angeordnet, wie `Import` sie anordnet, nach denselben Regeln mit `Flow` oder in Zeilen, und der Rahmen jeder Tabellengruppe wird um ihre Tabellen angepasst. Die hinzugefügten Tabellen und Notizen werden über allem gestapelt, was bereits vorhanden ist.

Sobald der Block gelandet ist, ist nur das Hinzugefügte ausgewählt: die neuen Tabellen sowie die neuen Notizen und Tabellengruppen, sofern diese eingeblendet sind. Wenn Sie inzwischen zu einer anderen Registerkarte gewechselt sind, wechselt der Editor zur Registerkarte ERD zurück, bevor der Block landet. Die Ansicht scrollt dann bei der aktuellen Zoomstufe zum Block, sofern er nicht bereits gut sichtbar ist – siehe [Wohin ein Sprung führt](./table-related-functions.md#where-a-jump-lands). Ein einziges Rückgängigmachen nimmt das gesamte Hinzufügen zurück.  
Eine Datei, die der Parser nicht lesen kann, oder eine ohne Tabelle und ohne Notiz fügt nichts hinzu.

Mehrere Dateien in Schema SQL, GraphQL, DBML oder AML, die hinzugefügt werden, während eine noch angeordnet wird, landen alle in der Reihenfolge, in der sie gestartet wurden. Eine währenddessen hinzugefügte JSON-Datei landet, sobald sie gelesen ist, vor ihnen. Ein `Import` oder das Laden eines anderen Dokuments verwirft alle, die noch angeordnet werden.

Coding-Agenten fügen eine Datei auf dieselbe Weise mit dem Modus `append` der MCP-Import-Tools hinzu, der die Anordnung einer JSON-Datei beibehält, die Tabellen der anderen Formate aber in Zeilen anordnet, nie mit `Flow` – siehe [Import](../../mcp/tools.md#import).

### JSON {#json}

Sie können Dateien im [vom Editor definierten Schemaformat](../../api/advanced/schema.md) importieren.
Der Dateiname muss auf `.json` enden, sodass sich eine als `<database name>-<timestamp>.erd.json` exportierte Datei unverändert wieder importieren lässt; eine Datei mit der bloßen Endung `.erd` oder `.vuerd` wird hier nicht akzeptiert. Dateien, die von früheren Versionen gespeichert wurden, werden ebenfalls gelesen.

![Eine gespeicherte Datei über Import > json importieren und damit das Entwurfsdokument samt seinen Einstellungen ersetzen](/img/demo-import-json.webp)

### Schema SQL {#schema-sql}

Sie können auch in SQL definierte Schemadateien importieren.  
Obwohl die Parser unabhängig vom Datenbanksystem so flexibel wie möglich gestaltet wurden, kann es Syntax geben, die nicht unterstützt wird.  
Der Dateiname muss auf `.sql` enden.  
[Die unterstützte Syntax können Sie hier nachsehen.](https://github.com/dineug/erd-editor/tree/main/packages/schema-sql-parser)

![Eine SQL-Datei über Import > Schema SQL importieren, deren Tabellen entlang ihrer Beziehungen angeordnet werden, und die Ansicht dann über ihnen verkleinern](/img/demo-import-sql.webp)

Spalten stammen nur aus `CREATE TABLE`. Eine mit `ALTER TABLE ... ADD COLUMN` hinzugefügte Spalte wird nicht gelesen.  
Bestandteile eines `CREATE TABLE`, die keine Spalten sind, werden übersprungen, statt als Spalten gelesen zu werden: ein unbenanntes `CHECK (...)`, `LIKE` und `EXCLUDE` von PostgreSQL, `FULLTEXT` und `SPATIAL` von MySQL, wenn sie ohne `INDEX` oder `KEY` geschrieben sind, `PERIOD FOR` von T-SQL und `SUPPLEMENTAL LOG DATA` von Oracle.  
Eine Spalte, die nach einem von ihnen benannt ist, wird dennoch importiert, wenn auf den Namen ein integrierter Typ folgt, wie in `exclude BOOLEAN`, oder wenn der Name in Anführungszeichen steht, wie in `"check" int`. Ein `like` ohne Anführungszeichen, auf das ein nicht integrierter Typ folgt, etwa `like citext`, wird als `LIKE` von PostgreSQL gelesen und übersprungen.  
Die Constraints `CHECK` selbst werden nicht importiert, da der Editor keinen Platz hat, um sie aufzubewahren.

#### Datentypen {#data-types}

Der Datentyp einer Spalte bleibt einschließlich seiner Argumentliste erhalten, auch wenn er kein integrierter Typ einer der [unterstützten Datenbanken](./table-related-functions.md#databases) ist.  
Das umfasst einen mit `CREATE TYPE` erstellten Aufzählungs- oder zusammengesetzten Typ, eine mit `CREATE DOMAIN` erstellte Domäne, Erweiterungstypen wie `hstore`, `citext` und `ltree`, schemaqualifizierte Namen wie `public.mood` sowie Namen in Anführungszeichen oder eckigen Klammern wie `"MyType"` und `[dbo].[Phone]`, die ihre Anführungszeichen oder eckigen Klammern behalten. Die Anweisungen `CREATE TYPE`, `CREATE DOMAIN` und `CREATE EXTENSION` selbst werden übersprungen.  
Ein integrierter Typ verliert seine Anführungszeichen oder eckigen Klammern, sodass `[int]` als `int` und `[nvarchar](50)` als `nvarchar(50)` übernommen wird. Bei PostgreSQL behalten `"char"` und `"bit"` ihre Anführungszeichen, weil sie andere Typen als `char` und `bit` sind.  
Array-Suffixe bleiben bei jedem Typ erhalten: `integer[]`, `text[3][3]`, `integer ARRAY`, `mood[]`. Das `UNSIGNED BIG INT` von SQLite wird vollständig übernommen.  
Die Angaben `UNSIGNED` und `ZEROFILL` von MySQL und MariaDB bleiben, wenn sie direkt nach einem Typ und seinen Argumenten stehen, wie geschrieben Teil des Typs: `INT UNSIGNED`, `SMALLINT(5) UNSIGNED ZEROFILL`, das `int unsigned` von mysqldump. `SIGNED`, der Standardfall, entfällt, sodass `TINYINT SIGNED` als `TINYINT` übernommen wird. Ein Modifikator, der nach einer anderen Spaltenoption steht, wie in `INT NOT NULL UNSIGNED`, das MySQL ablehnt, entfällt.  
Werte von `ENUM(...)` und `SET(...)` behalten ihre Anführungszeichen, wobei ein Anführungszeichen innerhalb eines Werts verdoppelt wird, wie in `ENUM('a','it''s')`. Das mit Backslash maskierte `'it\'s'` von MySQL wird auf dieselbe Weise verdoppelt übernommen. In einem Typ `STRUCT<...>` von Databricks behalten Feldnamen in Anführungszeichen und der `COMMENT` eines Felds ihre Anführungszeichen.  
Eine ohne Typ geschriebene Spalte, etwa eine typlose SQLite-Spalte oder eine berechnete Spalte mit `AS`, bleibt typlos: Ein Schlüsselwort wie `NOT`, `NULL`, `DEFAULT`, `PRIMARY` oder `REFERENCES` oder eine Zeichenkette in einfachen Anführungszeichen wird nicht als Typ gelesen.

#### Standardwerte {#defaults}

Das `DEFAULT` einer Spalte behält seinen ganzen Ausdruck, etwa `now()`, `0.5`, `CURRENT_TIMESTAMP` oder `ARRAY[]::text[]`, bis zur nächsten Spaltenoption, einem Komma oder der schließenden Klammer. Ein `CASE ... END` wird vollständig gelesen.  
Klammern um den ganzen Ausdruck werden entfernt, sodass `((0))` von SQL Server als `0` und `(getdate())` als `getdate()` übernommen wird. Auch eine Typumwandlung eines Literals wird entfernt, sodass `'draft'::character varying` von pg_dump als `'draft'` und `NULL::character varying` als `NULL` übernommen wird; andere Typumwandlungen bleiben, wie in `ARRAY[]::text[]` und `lower('A'::text)`.  
`ON UPDATE CURRENT_TIMESTAMP` von MySQL entfällt, da eine Spalte keinen Platz dafür hat, und der Standardwert davor bleibt erhalten. `DEFAULT ON NULL 0` von Oracle wird mit oder ohne `FOR INSERT ONLY` oder `FOR INSERT AND UPDATE` als `0` übernommen.  
Eine Zeichenkette mit Präfix, etwa `N'x'`, `E'x'`, `B'0'`, `X'ff'`, `U&'x'` oder `_utf8mb4'x'`, wird als eine einzige Zeichenkette gelesen, auch wenn sie eine Klammer enthält.

SQL Server Management Studio schreibt Standardwerte nach den Tabellen ins Skript, als `ALTER TABLE [dbo].[t] ADD CONSTRAINT [DF_x] DEFAULT ((1)) FOR [col]`. Eine solche Anweisung setzt den Standardwert dieser Spalte, hier `1`, und ihr Constraint-Name entfällt.

Ein Export als Schema SQL fügt die Klammern dort wieder ein, wo eine Datenbank den Ausdruck eines Standardwerts nur innerhalb von Klammern liest – siehe [Standardwerte](./schema-sql.md#defaults).

#### Autoinkrement {#auto-increment}

`AUTO_INCREMENT`, `AUTOINCREMENT` und `IDENTITY` schalten bei einer Spalte `Auto Increment` ein, ebenso `GENERATED ALWAYS AS IDENTITY` und `GENERATED BY DEFAULT AS IDENTITY`, die keinen Standardwert hinterlassen.  
Das Gleiche bewirkt ein Standardwert, der aus einem einzelnen Aufruf von `nextval()` in PostgreSQL besteht, also der Standardwert, den eine Serial-Spalte erhält, geschrieben als `nextval('s')` oder, wie pg_dump ihn schreibt, `nextval('s'::regclass)`. Der Sequenzname wird nicht übernommen. Ein Standardwert, der eine Sequenz nur verwendet, etwa `nextval('s') + 1` oder `NEXT VALUE FOR s` von SQL Server, bleibt ein einfacher Standardwert.  
pg_dump schreibt beides nach den Tabellen, als `ALTER TABLE [ONLY] t ALTER [COLUMN] c SET DEFAULT nextval('s'::regclass)` und `ALTER TABLE t ALTER [COLUMN] c ADD GENERATED ... AS IDENTITY`. Jede der beiden Anweisungen schaltet bei dieser Spalte `Auto Increment` ein und löscht ihren Standardwert. `CREATE SEQUENCE`, `ALTER SEQUENCE` und jede andere Aktion von `ALTER COLUMN` werden übersprungen.  
Eine Spalte, die inline als `serial`, `bigserial` oder `smallserial` typisiert ist, behält diesen Typ, wobei `Auto Increment` ausgeschaltet bleibt.

Der Editor behält nur das Kennzeichen `Auto Increment`, und jede Datenbank schreibt beim Export ihre eigene Form – siehe [Autoinkrement](./schema-sql.md#auto-increment). Ein Export für PostgreSQL schreibt `GENERATED ALWAYS AS IDENTITY` bei einer Spalte vom Typ `smallint`, `integer` oder `bigint`, gleich welche Form importiert wurde, und bei jedem anderen Typ, etwa `INT UNSIGNED`, nur eine Kommentarzeile nach der Tabelle. Sequenzoptionen wie `START WITH 100` gehen verloren.  
Eine Tabelle mit mehreren Serial- oder Identity-Spalten wird mit mehreren Autoinkrement-Spalten importiert, und MySQL, MariaDB und SQL Server lehnen eine solche Tabelle ab, wenn ihr Export ausgeführt wird.

#### Primärschlüssel {#primary-keys}

Ein nach seiner Tabelle hinzugefügter Primärschlüssel, `ALTER TABLE t ADD [CONSTRAINT n] PRIMARY KEY (...)`, kennzeichnet seine Spalten als Primärschlüssel.  
`CLUSTERED` oder `NONCLUSTERED` von SQL Server und `USING BTREE` von MySQL vor der Spaltenliste werden überlesen, sodass das `ALTER TABLE [dbo].[Users] ADD CONSTRAINT [PK_Users] PRIMARY KEY CLUSTERED ([Id] ASC) WITH (...) ON [PRIMARY]`, das SQL Server Management Studio ins Skript schreibt, `Id` zum Schlüssel macht. Das `PRIMARY KEY NONCLUSTERED HASH (...)` einer speicheroptimierten Tabelle wird nicht gelesen, weder in `ALTER TABLE` noch in `CREATE TABLE`.

#### Eindeutige Schlüssel und Indizes {#unique-keys-and-indexes}

Ein `UNIQUE` über zwei oder mehr Spalten wird in jeder Schreibform zu einem eindeutigen Index: `UNIQUE (a, b)`, `UNIQUE KEY n (a, b)`, `UNIQUE INDEX n (a, b)`, `CONSTRAINT n UNIQUE (a, b)`, das inline geschriebene `INDEX n UNIQUE (a, b)` von SQL Server und `ALTER TABLE t ADD [CONSTRAINT n] UNIQUE (a, b)`.  
Der Index übernimmt den Indexnamen des Schlüssels, sonst seinen Namen aus `CONSTRAINT`, sonst keinen Namen, und behält die Sortierreihenfolge jeder Spalte. Ein solcher Index ist ein [Alternativschlüssel](./table-related-functions.md#alternate-keys).  
Ein `UNIQUE` über eine Spalte kennzeichnet in jeder dieser Schreibformen stattdessen diese Spalte als „Eindeutig“ und fügt keinen Index hinzu, sodass der Constraint `UQ_<table name>_<column name>`, den der Export schreibt, als das Kennzeichen zurückkommt, aus dem er geschrieben wurde. Ein `CREATE UNIQUE INDEX` über eine Spalte bleibt ein eindeutiger Index.

Ein `ALTER TABLE`, das mehrere Schlüssel auf einmal hinzufügt, wie phpMyAdmin `ADD PRIMARY KEY (id), ADD UNIQUE KEY uq_a (a, b), ADD UNIQUE KEY uq_c (c)` schreibt, behält jeden eindeutigen Schlüssel darin: `uq_a` wird als eindeutiger Index namens `uq_a` übernommen und `uq_c` als Kennzeichen „Eindeutig“ von `c`. Ein Name aus `CONSTRAINT` benennt nur den Schlüssel in seiner eigenen Klausel. `ADD UNIQUE INDEX IF NOT EXISTS n (...)` von MariaDB sowie `ALTER TABLE t WITH CHECK ADD ...` und `WITH NOCHECK ADD ...` von SQL Server werden ebenfalls gelesen.  
`CREATE INDEX` und `CREATE UNIQUE INDEX` werden mit qualifizierten Namen wie `public.t` und `[dbo].[t]`, mit `CLUSTERED` und `NONCLUSTERED` von SQL Server, mit `CONCURRENTLY`, `IF NOT EXISTS`, `ON ONLY` und `USING btree` von PostgreSQL und ganz ohne Indexnamen gelesen. Die Dateigruppe `ON [PRIMARY]` von SQL Server wird ignoriert.  
Schlüsseloptionen wie `NULLS NOT DISTINCT` oder `USING BTREE` werden nicht für den Namen des Schlüssels gehalten. In der Spaltenliste eines Schlüssels benennt nur das erste Wort die Spalte, sodass `b DESC NULLS LAST`, `b text_pattern_ops` und `b COLLATE "C"` alle `b` zum Schlüssel machen, wobei `DESC` als Sortierreihenfolge erhalten bleibt. Eine Präfixlänge wie `email(191)` wird überlesen, ein Schlüssel mit einem Ausdrucksteil wie `lower(email)` wird dagegen ganz übersprungen.

Ein partieller eindeutiger Index, `CREATE UNIQUE INDEX ... WHERE ...` oder das inline geschriebene `INDEX n UNIQUE (...) WHERE ...` von SQL Server, wird als einfacher Index mit demselben Namen und denselben Spalten übernommen, weil ein über die ganze Tabelle eindeutiger Schlüssel strenger wäre als der gefilterte, den die Datei deklariert. Die Ausnahme ist ein Filter, der nur aus mit `AND` verknüpften Prüfungen auf `IS NOT NULL` für die Spalten des Schlüssels besteht, also der Filter, den SQL Server benötigt, damit eine eindeutige Spalte mehr als einen NULL-Wert enthalten kann: Dieser Schlüssel bleibt eindeutig.  
Ein eindeutiger Schlüssel, der eine Spalte nennt, die die Tabelle nicht hat, etwa eine mit `ALTER TABLE ... ADD COLUMN` hinzugefügte, entfällt ganz, statt auf die vorhandenen Spalten gekürzt zu werden. Ein einfacher Index behält die vorhandenen Spalten.

SQL Developer von Oracle und `DBMS_METADATA` schreiben den eigenen Index eines Schlüssels als separates `CREATE UNIQUE INDEX`, benannt nach dem Schlüssel oder, bei einem Schlüssel ohne Namen, auf den `USING INDEX` folgt, mit einem Systemnamen wie `SYS_C0012345`. Der Import liest einen solchen Index sowie den, den ein `ADD CONSTRAINT ... USING INDEX` nennt, als Teil seines Schlüssels: Ein zusammengesetzter eindeutiger Schlüssel wird als ein eindeutiger Index übernommen, ein Primärschlüssel oder ein einspaltiger eindeutiger Schlüssel als die Spaltenkennzeichen ohne zusätzlichen Index. Ein Export zurück nach Oracle erstellt den Index dann ein einziges Mal.

Ein Export als Schema SQL ergibt beim erneuten Import für MySQL, MariaDB, MSSQL, Oracle, PostgreSQL und SQLite dieselben Kennzeichen „Eindeutig“ und Indizes.  
Snowflake hat keine Sekundärindizes, daher bringt sein Export nur die eindeutigen Schlüssel zurück: einen zusammengesetzten als eindeutigen Index und einen einspaltigen als Kennzeichen „Eindeutig“ der Spalte. Ein Export für Databricks deklariert keine Eindeutigkeit, daher kommt keine zurück.

#### Fremdschlüssel {#foreign-keys}

Ein Fremdschlüssel wird in diesen Schreibformen zu einer Beziehung:

- Ein `FOREIGN KEY (...) REFERENCES t (...)` auf Tabellenebene, mit oder ohne `CONSTRAINT name`.
- `ALTER TABLE ... ADD [CONSTRAINT name] FOREIGN KEY (...) REFERENCES t (...)`, einschließlich der Anweisungen `ALTER TABLE t WITH CHECK ADD ...` und `WITH NOCHECK ADD ...`, die SQL Server Management Studio ins Skript schreibt.
- Das inline geschriebene `REFERENCES t (col)` einer Spalte, wie in `user_id INT REFERENCES users (id)`, und das `FOREIGN KEY REFERENCES t (col)`, das SQL Server und Snowflake dort erlauben. Eine Inline-Referenz auf mehr als eine Spalte wird übersprungen.

Ein `ALTER TABLE` ergibt höchstens eine Beziehung, und nur dann, wenn seine erste Klausel einen Fremdschlüssel hinzufügt: Eine Klausel `FOREIGN KEY` nach einer Klausel `ADD PRIMARY KEY` oder `ADD UNIQUE` in derselben Anweisung wird nicht gelesen. Wenn eine Anweisung mehrere Fremdschlüssel hinzufügt, wie phpMyAdmin `ADD CONSTRAINT fk1 FOREIGN KEY ..., ADD CONSTRAINT fk2 FOREIGN KEY ...` schreibt, wird nur der letzte gelesen.

`REFERENCES t` ohne Spaltenliste verweist auf den Primärschlüssel von `t`, wenn dieser Schlüssel aus einer einzigen Spalte besteht. Bei einem zusammengesetzten Primärschlüssel wird der Fremdschlüssel übersprungen.  
Ein Fremdschlüssel wird übersprungen und keine seiner Spalten als Fremdschlüssel gekennzeichnet, wenn keine seiner referenzierten Spalten gefunden wird oder wenn sich die Anzahl der in den beiden Tabellen gefundenen Spalten unterscheidet, etwa wenn eine Spalte nur in einer der beiden fehlt. Fehlt beiden Tabellen dieselbe Anzahl seiner Spalten, werden die gefundenen Spalten in der geschriebenen Reihenfolge gepaart, und die Beziehung enthält nur diese.  
Jede importierte Beziehung ist `Zero N`, und sie ist identifizierend, wenn jede ihrer Spalten in der Kindtabelle auch ein Primärschlüssel ist.

Die Klauseln `ON DELETE` und `ON UPDATE` jedes Fremdschlüssels werden zu `On Delete` und `On Update` der Beziehung: `NO ACTION`, `RESTRICT`, `CASCADE`, `SET NULL` oder `SET DEFAULT`, in beliebiger Groß-/Kleinschreibung und in beliebiger Reihenfolge. Ein Fremdschlüssel ohne sie wird als `Not set` importiert. Zum Festlegen im Editor siehe [Beziehungen bearbeiten](./relationship-editing.md#on-delete-and-on-update).  
Die Spaltenliste von PostgreSQL nach `SET NULL` oder `SET DEFAULT`, wie in `ON DELETE SET NULL (a_id)`, wird überlesen: Die Aktion gilt für den ganzen Schlüssel, und ein `ON UPDATE` nach der Liste wird weiterhin gelesen. `MATCH FULL`, `MATCH PARTIAL` und `MATCH SIMPLE` werden übersprungen, und das Spaltenattribut `ON UPDATE CURRENT_TIMESTAMP` von MySQL wird nicht für eine Aktion gehalten.  
Ein Export als Schema SQL wird mit den Aktionen wieder importiert, die diese Datenbank schreibt, sodass eine Aktion, die sie weglässt, etwa `SET DEFAULT` bei MySQL, jedes `ON UPDATE` bei Oracle oder alles außer `NO ACTION` bei Snowflake, als `Not set` zurückkommt.

#### Kommentare {#comments}

Tabellen- und Spaltenkommentare werden aus den drei Syntaxformen importiert, die der Parser liest: der Tabellenoption und dem Spaltenattribut `COMMENT`, die MySQL, MariaDB, Snowflake und Databricks verwenden, den Anweisungen `COMMENT ON TABLE` und `COMMENT ON COLUMN`, die PostgreSQL und Oracle verwenden, und der erweiterten Eigenschaft `MS_Description`, die SQL Server mit `EXEC sp_addextendedproperty` setzt.  
Ein Kommentar, der eine Tabelle oder Spalte nennt, die die Datei nicht definiert, wird ignoriert.

Die Aufrufe von SQL Server werden mit benannten Argumenten gelesen, wie SQL Server Management Studio jeden Kommentar ins Skript schreibt (`@name=N'MS_Description', @value=N'...', ..., @level1type=N'TABLE', @level1name=N'Users'`), und mit Positionsargumenten, wie der MSSQL-Export des Editors sie schreibt.  
Nur die Eigenschaft `MS_Description` an einer Tabelle oder an einer ihrer Spalten auf Ebene 2 ergibt einen Kommentar. Eine andere Eigenschaft, eine Sicht, ein Index oder ein Constraint ergibt keinen, ebenso wenig ein Kommentar, der in einer Variablen übergeben oder mit `+` zusammengesetzt wird.

In einem Kommentar steht wie in jedem Text in Anführungszeichen, etwa einem Wert von `DEFAULT` oder einem Namen in Anführungszeichen, ein verdoppeltes Anführungszeichen für ein einzelnes, so wie mysqldump und pg_dump es schreiben: `'it''s'` wird als `it's` gelesen.  
Ein Backslash vor einem Anführungszeichen, wie MySQL und MariaDB `'it\'s'` schreiben, maskiert das Anführungszeichen ebenfalls. Ein solches Anführungszeichen beendet den Text dennoch, wenn Leerraum, `,`, `;`, `)`, `]`, `:`, `|`, `+` oder das Dateiende darauf folgt, sodass `'C:\'`, das `'C:\'::text` von pg_dump und das `'C:\'+name` von T-SQL ihren Backslash behalten.  
Ein Wert von `DEFAULT` behält seine Anführungszeichen, und ein Anführungszeichen darin wird verdoppelt zurückgeschrieben, unabhängig davon, wie die Datei es maskiert hat: `'it''s'`.  
Ist die Datenbank des Dokuments zum Zeitpunkt des Imports Databricks, folgt Text in einfachen Anführungszeichen stattdessen den Regeln von Spark: Jeder Backslash maskiert das Zeichen danach, sodass `'C:\\dir'` als `C:\dir` gelesen wird, Escape-Sequenzen wie `\n`, `\t` und `\u0041` dekodiert werden und ein Wert von `DEFAULT` als `'it\'s'` erhalten bleibt.

Wie jede Datenbank einen Kommentar beim Export schreibt und wie sie ein Anführungszeichen darin maskiert, wird in [Kommentare](./schema-sql.md#comments) auf der Seite zu Schema SQL beschrieben.  
Ein Export nach MySQL, MariaDB, PostgreSQL, Oracle, Snowflake oder MSSQL wird als dieselben Tabellen- und Spaltenkommentare wieder importiert, einschließlich der Anführungszeichen, abgesehen von den Leerzeilen, die ein Oracle-Export auslässt. Ein Databricks-Export, der ein Anführungszeichen und einen Backslash mit einem Backslash maskiert, wird nur so lange exakt zurückgelesen, wie Databricks die ausgewählte Datenbank ist.  
Kommentare überstehen einen Export nach SQLite mit anschließendem erneutem Import nicht: SQLite schreibt sie als einfache Zeilen mit `--`, die der Parser nicht liest.  
Außer bei SQLite wird ein logischer Name, den `Write logical names into empty comments` in einen leeren Kommentar geschrieben hat, als Kommentar dieser Tabelle oder Spalte wieder importiert, nicht als ihr logischer Name – siehe [Logische Namen als Kommentare](./schema-sql.md#logical-names-as-comments).

### GraphQL {#graphql}

Sie können ein GraphQL-SDL-Dokument importieren.  
Objekttypdefinitionen werden zu Tabellen, ein Block `extend type` wird mit dem Typ zusammengeführt, den er erweitert, und Felder von Interfaces werden von den Typen geerbt, die diese implementieren.  
Ein Feld, dessen Typ eine andere Tabelle ist, wird statt zu einer Spalte zu einer Beziehung, und eine Liste auf beiden Seiten erzeugt eine Zuordnungstabelle.  
Ein Feld im Singular wie `buyer: User` wird zuerst mit dem einen Feld des anderen Typs gepaart, dessen Name auf `By` gefolgt vom Namen dieses Felds endet, etwa `orderListByBuyer`, ohne Beachtung von Groß-/Kleinschreibung und Unterstrichen; ein nummeriertes Feld wie `buyer2` wird auf dieselbe Weise ohne seine Nummer gepaart. So benennt die GraphQL-Ausgabe des Codegenerators die Felder, wenn zwei Tabellen mehr als eine Beziehung teilen oder eine Tabelle auf sich selbst verweist, sodass eine solche Ausgabe mit allen Beziehungen wieder importiert wird.  
Root-Typen (`Query`, `Mutation`, `Subscription`), Introspektionstypen sowie die Wrapper von Relay, Federation und Hasura wie `PageInfo`, `*Connection`, `*Edge` und `*_aggregate` werden als Beiwerk behandelt und übersprungen.  
Die Direktiven `@id`, `@primaryKey`, `@unique`, `@autoincrement`, `@default`, `@map`, `@relation`, `@column`, `@table`, `@index` und `@db.*` werden berücksichtigt.  
Der Dateiname muss auf `.graphql`, `.gql` oder `.graphqls` enden. Eine Prisma-Datei `schema.prisma` ist kein GraphQL-Dokument und kann hier nicht importiert werden.

### DBML {#dbml}

Sie können eine Datei in DBML importieren, dem Format, das dbdiagram.io und dbdocs verwenden.  
Die Blöcke `Table`, `TablePartial`, `Ref`, `Enum` und `TableGroup` werden gelesen. Blöcke `Project` und eigenständige Blöcke `Note` werden übersprungen, ohne die Tabellen um sie herum zu beeinflussen.  
Jede Schreibform von Referenzen wird akzeptiert: die Doppelpunktform `Ref:`, eine benannte Referenz, die Blockform `Ref { }` und die Inline-Spalteneinstellung `[ref: > table.column]`.  
Eine N:M-Referenz `<>` erzeugt eine Zuordnungstabelle, die nach beiden Seiten benannt ist.  
Die Einstellungen `delete` und `update` einer eigenständigen Referenz werden zu `On Delete` und `On Update` der Beziehung, wie in `Ref: users.id < posts.user_id [delete: cascade, update: set null]`. Die Werte sind `cascade`, `restrict`, `set null`, `set default` und `no action`, in beliebiger Groß-/Kleinschreibung. Alles andere oder keine Einstellung wird als `Not set` importiert, und andere Einstellungen wie `color` werden ignoriert.  
Die Inline-Einstellung `[ref: ...]` trägt keine Aktionen, und die Einstellungen einer Referenz `<>` werden nicht auf die Zuordnungstabelle übertragen. Wird derselbe Fremdschlüssel sowohl inline als auch als eigenständige Referenz deklariert, bleibt die Inline-Deklaration erhalten, ohne Aktionen.  
Die Einstellung `headercolor` einer Tabelle, wie in `Table users [headercolor: #3498DB]`, wird zu ihrer Farbe, wenn der Wert ein ohne Anführungszeichen geschriebener Hexwert `#rgb` oder `#rrggbb` ist. Jeder andere Wert entfällt, und die Einstellung `headercolor` eines Blocks `TablePartial` wird nicht an die Tabellen weitergegeben, die ihn verwenden.  
Jeder Block `TableGroup` wird zu einer [Tabellengruppe](./table-groups.md) mit den Tabellen, die er auflistet, eine pro Zeile, so benannt, wie ein `Ref` sie benennt. Seine Einstellung `[color: ...]` wird nach derselben Regel wie `headercolor` zur Farbe der Gruppe, und seine Anmerkung und andere Einstellungen entfallen. Eine Tabelle, die von zwei Gruppen aufgelistet wird, bleibt in der ersten. Eine Gruppe, die ohne Tabelle bleibt, wird nicht erstellt, gleich ob sie keine Tabelle auflistet, die die Datei deklariert, oder nur Tabellen, die eine frühere Gruppe übernommen hat. Der Rahmen der Gruppe wird um ihre Tabellen angepasst, wo auch immer sie angeordnet werden, und wenn die Tabellen in Zeilen angeordnet werden, bleiben die Tabellen einer Gruppe zusammen.  
Der Dateiname muss auf `.dbml` enden.

### AML {#aml}

Sie können eine AML-Datei (Azimutt Markup Language) importieren. Sowohl die aktuelle Schreibform als auch die ältere Schreibform v1 werden akzeptiert.  
Entitäten werden zu Tabellen, und verschachtelte Attribute werden zu einem Spaltennamen mit Punkten wie `settings.slug` abgeflacht.  
Attribute sind `NOT NULL`, sofern sie nicht als `nullable` gekennzeichnet sind, und Konstrukte, für die der Editor keinen Platz hat, etwa `check`, `type` und `tags`, entfallen, statt abgelehnt zu werden. Eine als Sicht gekennzeichnete Entität wird als einfache Tabelle übernommen.  
Die Eigenschaft `color` einer Entität, wie in `users {color: red}`, wird zur Farbe ihrer Tabelle. Die Farbnamen von AML, `red`, `orange`, `amber`, `yellow`, `lime`, `green`, `emerald`, `teal`, `cyan`, `sky`, `blue`, `indigo`, `violet`, `purple`, `fuchsia`, `pink`, `rose` und `gray`, werden in beliebiger Groß-/Kleinschreibung gelesen, mit oder ohne Anführungszeichen, jeweils als Stufe 500 der gleichnamigen Tailwind-Farbe, etwa `#ef4444` für `red`. Ein Hexwert in Anführungszeichen wie `"#3498db"` bleibt wie geschrieben erhalten; ein bloßes `#3498db` kann nicht gelesen werden, weil `#` einen AML-Kommentar einleitet. Jeder andere Wert und eine Eigenschaft `color` an einem Attribut oder einer Relation entfallen.  
Eine eigenständige Anweisung `rel`, oder `fk` in der älteren Schreibform, behält ihre Eigenschaften `onDelete` und `onUpdate` als `On Delete` und `On Update` der Beziehung, wie in `rel posts(user_id) -> users(id) {onDelete: cascade, onUpdate: "set null"}`. Die Werte sind `cascade`, `restrict`, `set null`, `set default` und `no action`, mit oder ohne Anführungszeichen, in beliebiger Groß-/Kleinschreibung. Andere Eigenschaften entfallen.  
Bei einer Inline-Relation wie `user_id int -> users(id) {onDelete: cascade}` gehören die Eigenschaften zum Attribut, daher entfallen sie, und die Beziehung wird als `Not set` importiert.  
Der Dateiname muss auf `.aml` enden.

GraphQL, DBML und AML sind Round-Trip-Formate: Jedes ist auch ein Ziel im [Codegenerator](./code-generator.md).  
DBML und AML übertragen ON DELETE und ON UPDATE jeder Beziehung in beide Richtungen – siehe [Codegenerator](./code-generator.md#on-delete-and-on-update). GraphQL überträgt keines von beiden, daher lässt ein GraphQL-Import beide auf `Not set`.  
DBML überträgt außerdem Tabellenfarben, ohne etwaige Transparenz, und jede Tabellengruppe, die eine Tabelle enthält, in beide Richtungen. Eine Gruppe ohne Namen kommt als `group_1`, `group_2` usw. zurück, und ein wiederholter Gruppenname kommt mit angehängtem `_2`, `_3` usw. zurück. AML überträgt eine Tabellenfarbe nur als den nächstliegenden seiner Farbnamen, sodass `#FF8800` als `orange` geschrieben wird und als `#f97316` zurückkommt, und es überträgt keine Gruppen. GraphQL überträgt weder Farben noch Gruppen.  
Keines der drei überträgt logische Namen, Domänenverknüpfungen oder die Wörterbücher, in keiner Richtung: Der Codegenerator schreibt den physischen Namen und den Datentyp jeder Tabelle und Spalte, nie einen logischen Namen oder eine Domäne.

## Exportieren {#exporting}

Das Untermenü `Export` des Kontextmenüs der Zeichenfläche hat drei Einträge:

- json: Speichert das Diagramm so, wie seine Datei es enthält, als `.erd.json`: die Tabellen mit ihren Spalten und Indizes, die Beziehungen, Notizen und Tabellengruppen, die logischen Namen und die Domänenverknüpfungen der Spalten, die Wörter, Begriffe und Domänen der Registerkarte [Wörterbuch](./dictionary.md) sowie die Einstellungen, jede [gesperrte Einstellung](./settings.md#lock) mit ihrem gesperrten Wert. Was nichts enthält, etwa leerer Text oder eine leere Wörterbuchzeile, entfällt – siehe [Speicherform und Laufzeitwert](../../api/advanced/schema.md#storage-form-and-runtime-value).
- Schema SQL: Öffnet die Registerkarte [Schema SQL](./schema-sql.md#saving-or-copying-the-sql) mit geöffnetem Optionsbereich und fokussierter Schaltfläche `Save file`, sodass das Drücken von `Enter` das SQL, das die Registerkarte zeigt, als `.sql` speichert. Bis dahin wird nichts gespeichert.
- Image: Öffnet den Dialog `Export image`, der das Diagramm als `.png` oder `.svg` speichert oder es als PNG in die Zwischenablage kopiert – siehe [Bild](#image).

Alle drei funktionieren in einem schreibgeschützten Editor.  
Die eigene Schaltfläche `Export CSV` der Registerkarte Wörterbuch, die nicht in diesem Untermenü steht, speichert deren Blatt `Domains`, `Words` oder `Terms` als CSV-Datei. Anders als diese drei wird sie in einem schreibgeschützten Editor nicht angeboten – siehe [CSV importieren und exportieren](./dictionary.md#importing-and-exporting-csv).

Schema SQL schreibt ON DELETE und ON UPDATE jeder Beziehung nach ihrem `REFERENCES`, ON DELETE zuerst. `Not set` schreibt nichts, und eine Aktion, die die ausgewählte Datenbank nicht akzeptiert, entfällt. Zu den Aktionen, die jede Datenbank akzeptiert, siehe [Beziehungen bearbeiten](./relationship-editing.md#on-delete-and-on-update).

Jede exportierte Datei heißt `<database name>-<timestamp>`, gefolgt von ihrer Dateiendung, wobei der Zeitstempel in Ortszeit als `yyyy-MM-dd'T'HH_mm_ss` formatiert ist – zum Beispiel `my-schema-2026-08-29T04_05_06.erd.json`. Bei einem leeren Datenbanknamen wird `unnamed` verwendet.  
Die Schaltflächen `Save file` auf der Registerkarte Schema SQL und im [Codegenerator](./code-generator.md) benennen ihre Dateien auf dieselbe Weise, ebenso `Export CSV`, das nach dem Zeitstempel das Blatt anfügt: `-words.csv`, `-terms.csv` oder `-domains.csv`. Ein Bild übernimmt den Datenbanknamen so, wie er beim Öffnen des Dialogs war.

`Import`, `Import and Add` und `Export` sind auch über die [Schnellsuche](./quick-search.md) auf der Registerkarte ERD verfügbar, mit denselben Einträgen wie im Kontextmenü der Zeichenfläche.

In Obsidian erscheint weder ein Download- noch ein Speicherdialog: Die Datei wird in den Vault geschrieben, dorthin, wo Obsidian neue Anhänge für dieses Diagramm ablegt, und ein Hinweis nennt ihren Pfad.  
Zeichen, die Obsidian in einem Dateinamen nicht erlaubt, `\ / : * ? " < > |`, werden durch `-` ersetzt.  
Der Dateiexplorer von Obsidian listet eine exportierte Datei `.erd.json` oder `.sql` nur auf, solange Settings → Files and links → Detect all file extensions eingeschaltet ist.

### Bild {#image}

`Export` ▸ `Image` öffnet aus dem Kontextmenü der Zeichenfläche oder aus der Schnellsuche den Dialog `Export image`: eine Vorschau des Bilds neben seinen Optionen. Ein geöffneter [Explorer](./explorer.md#dialogs-beside-it) bleibt unter dem abgedunkelten Bereich geöffnet.

![Export > Image öffnen, Dark mode und Background ausschalten, 3x wählen und das Bild in die Zwischenablage kopieren](/img/demo-export.webp)

- `Background`: Standardmäßig eingeschaltet. Ist die Option ausgeschaltet, bleibt die Zeichenfläche transparent.
- `Dark mode`: Entspricht anfangs dem Erscheinungsbild des Editors. Solange die Option dem Erscheinungsbild auf dem Bildschirm entspricht, übernimmt das Bild die eigenen Farben der Zeichenfläche, einschließlich der Änderungen in der [Designauswahl](./language-and-theme.md); das andere Erscheinungsbild verwendet die Vorgabe mit demselben Grauton und derselben Akzentfarbe.
- `Scale`: `1x`, `2x` oder `3x`, wobei standardmäßig `2x` ausgewählt ist. Die Option legt nur die Größe des PNG und der Kopie in der Zwischenablage fest, und die Zeile darunter gibt diese Größe an, als `PNG <width> × <height> px`.

Die Auswahl bleibt erhalten, bis der Editor geschlossen wird, und wird nie im Dokument gespeichert. Die Vorschau wird so gezeichnet wie das Bild und neu gezeichnet, wenn sich `Background` oder `Dark mode` ändert.

Das Bild enthält das Diagramm so, wie es beim Öffnen des Dialogs war; schließen Sie den Dialog und öffnen Sie ihn erneut, um spätere Änderungen zu übernehmen. Seine Tabellen und Spalten werden in der Namensansicht benannt, die der Editor zu diesem Zeitpunkt zeigte, auch wenn Sie diese nur auf Ihrem Bildschirm eingestellt haben, während die Sperre `Name View` in der Datei eine andere beibehält – siehe [Außerhalb der Zeichenfläche](./logical-names.md#beyond-the-canvas). Die Farben, die die [Prüfungen des Wörterbuchs](./dictionary.md#marks-on-the-canvas) Namen auf der Zeichenfläche geben, werden nicht gezeichnet. Es enthält das ganze Diagramm, wie weit es auch weggescrollt ist, zugeschnitten auf das, was das Diagramm zeichnet, plus einen Rand, und es wird immer bei 100 % gezeichnet, unabhängig von der Zoomstufe, die der Editor zeigt, sodass jede Tabelle vollständig gezeichnet wird. Was die [Ansichtsoptionen](./table-related-functions.md#table-view-options) ausblenden – Beziehungen, ihre Beschriftungen für ON DELETE und ON UPDATE, Tabellengruppen oder Notizen –, wird weder gezeichnet, noch wird Platz dafür freigehalten, und Tabellengruppen werden hinter allem anderen gezeichnet.

Drei Schaltflächen schreiben das Bild, und jede lässt den Dialog geöffnet:

- `PNG`: Speichert eine Datei `.png` in der Größe des Diagramms bei 100 %, multipliziert mit `Scale`. Ein PNG, das für eine Browser-Zeichenfläche zu groß ist, wird mit reduzierter Auflösung geschrieben, statt fehlzuschlagen: Der Dialog warnt vorher mit `Reduced from <width> × <height> px, past what a browser canvas can hold`, und ein Hinweis `Exported at a reduced resolution` meldet es danach.
- `SVG`: Speichert eine Datei `.svg` in der Größe des Diagramms bei 100 %, unabhängig von `Scale`, und nie reduziert. Ihr Text bleibt Text, und ihre Schriftarten werden benannt statt eingebettet, sodass ein Anzeigeprogramm ohne die Schriftart des Editors mit einer anderen zeichnet. Schatten entfallen.
- `Copy to clipboard`: Legt ein PNG mit dem gewählten Wert von `Scale` in die Zwischenablage, reduziert wie ein gespeichertes PNG, wenn eine Browser-Zeichenfläche es nicht aufnehmen kann. Die Schaltfläche bestätigt mit `Copied the image to the clipboard` oder mit `Copied at a reduced resolution`, wenn das Bild reduziert wurde. Schlägt das Kopieren fehl, weil der Browser oder Host die Zwischenablage verweigert oder das Bild nicht gezeichnet werden konnte, schlägt `Couldn't copy the image` vor, stattdessen ein PNG zu speichern.

Das Bild wird in einem Hintergrund-Worker gezeichnet, sofern der Host einen ausführt, sodass der Editor währenddessen benutzbar bleibt. Ein Hinweis `Exporting PNG`, `Exporting SVG` oder `Copying image` erscheint, wenn es länger als einen Moment dauert, und ein Fehler wird als `Couldn't export the PNG` oder `Couldn't export the SVG` gemeldet. Wird der Dialog geschlossen, während eine Datei noch gezeichnet wird, verhindert das nicht, dass diese Datei gespeichert wird.

`PNG` hat beim Öffnen des Dialogs den Fokus, und `Tab` bleibt innerhalb des Dialogs. `Escape`, die Schaltfläche `x` oder ein Klick auf den abgedunkelten Bereich um ihn herum schließt ihn.  
Solange er geöffnet ist, bewirken die Tastenkombinationen der Zeichenfläche, einschließlich Rückgängig und Wiederholen, sowie Kopieren und Einfügen nichts. `Ctrl + K` (Windows/Linux) oder `⌘ + K` (Mac) schließt ihn und öffnet die Schnellsuche. `Ctrl + F` (Windows/Linux) oder `⌘ + F` (Mac) schließt ihn und setzt den Textcursor in das Suchfeld im [Explorer](./explorer.md#opening-and-closing), wobei der Explorer geöffnet wird, wenn er geschlossen ist, aber nie geschlossen wird. In einem Editor, der zu schmal ist, um den Explorer anzuzeigen, schließt die Tastenkombination dennoch den Dialog, zeigt aber eine Meldung, statt den Textcursor zu verschieben.
